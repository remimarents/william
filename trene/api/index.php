<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$home = getenv('HOME') ?: dirname(__DIR__, 3);
$dataDir = rtrim($home, '/') . '/.ordreise-sync';
$sessionsFile = $dataDir . '/sessions.json';
$progressDir = $dataDir . '/trening-progress';

ensureStorage();

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($input)) respond(['error' => 'Ugyldig JSON'], 400);

$action = $_GET['action'] ?? ($input['action'] ?? '');

try {
    if ($action === 'sync') syncProgress($input);
    if ($action === 'me') currentUser();
    respond(['error' => 'Ukjent handling'], 404);
} catch (Throwable $error) {
    respond(['error' => 'Serverfeil'], 500);
}

function ensureStorage(): void {
    global $dataDir, $progressDir, $sessionsFile;
    if (!is_dir($dataDir)) mkdir($dataDir, 0700, true);
    if (!is_dir($progressDir)) mkdir($progressDir, 0700, true);
    if (!file_exists($sessionsFile)) writeJsonFile($sessionsFile, []);
}

function syncProgress(array $input): void {
    $email = requireAuth();
    $clientState = is_array($input['state'] ?? null) ? $input['state'] : [];
    if (!stateBelongsToUser($clientState, $email)) {
        $clientState = [];
    }

    $path = progressFile($email);
    $serverState = file_exists($path) ? readJsonFile($path) : [];
    $merged = mergeTrainingState($serverState, $clientState);
    $merged['accountEmail'] = $email;
    $merged['serverSyncedAt'] = time();
    writeJsonFile($path, $merged);
    respond(['ok' => true, 'email' => $email, 'state' => $merged]);
}

function stateBelongsToUser(array $state, string $email): bool {
    $owner = strtolower(trim((string)($state['accountEmail'] ?? '')));
    return $owner === '' || $owner === strtolower(trim($email));
}

function currentUser(): void {
    $email = requireAuth();
    respond(['ok' => true, 'email' => $email]);
}

function mergeTrainingState(array $server, array $client): array {
    if (!$server) return normalizedTrainingState($client);
    if (!$client) return normalizedTrainingState($server);

    $serverUpdated = normalizeTimestamp($server['updatedAt'] ?? 0);
    $clientUpdated = normalizeTimestamp($client['updatedAt'] ?? 0);
    $base = $clientUpdated >= $serverUpdated ? $client : $server;

    $merged = normalizedTrainingState($base);
    $merged['history'] = mergeEntries(
        is_array($server['history'] ?? null) ? $server['history'] : [],
        is_array($client['history'] ?? null) ? $client['history'] : []
    );
    $merged['photos'] = mergePhotos(
        is_array($server['photos'] ?? null) ? $server['photos'] : [],
        is_array($client['photos'] ?? null) ? $client['photos'] : []
    );
    unset($merged['profile']['syncToken']);
    $merged['updatedAt'] = gmdate('c');
    return $merged;
}

function normalizedTrainingState(array $state): array {
    $profile = is_array($state['profile'] ?? null) ? $state['profile'] : [];
    unset($profile['syncToken']);
    return [
        'version' => (int)($state['version'] ?? 1),
        'profile' => $profile,
        'history' => is_array($state['history'] ?? null) ? array_values($state['history']) : [],
        'photos' => is_array($state['photos'] ?? null) ? array_values($state['photos']) : [],
        'notifications' => is_array($state['notifications'] ?? null) ? $state['notifications'] : [],
        'pendingPhoto' => $state['pendingPhoto'] ?? null,
        'updatedAt' => is_string($state['updatedAt'] ?? null) ? $state['updatedAt'] : gmdate('c'),
        'accountEmail' => is_string($state['accountEmail'] ?? null) ? strtolower(trim($state['accountEmail'])) : '',
    ];
}

function mergeEntries(array $serverEntries, array $clientEntries): array {
    $byKey = [];
    foreach (array_merge($serverEntries, $clientEntries) as $entry) {
        if (!is_array($entry)) continue;
        $key = (string)($entry['date'] ?? $entry['id'] ?? '');
        if ($key === '') continue;
        $existing = $byKey[$key] ?? null;
        if (!$existing || normalizeTimestamp($entry['updatedAt'] ?? 0) >= normalizeTimestamp($existing['updatedAt'] ?? 0)) {
            $byKey[$key] = $entry;
        }
    }
    usort($byKey, function ($a, $b) {
        return strcmp((string)($a['date'] ?? ''), (string)($b['date'] ?? ''))
            ?: strcmp((string)($a['updatedAt'] ?? ''), (string)($b['updatedAt'] ?? ''));
    });
    return array_values($byKey);
}

function mergePhotos(array $serverPhotos, array $clientPhotos): array {
    $byKey = [];
    foreach (array_merge($serverPhotos, $clientPhotos) as $photo) {
        if (!is_array($photo)) continue;
        $key = implode('|', [
            (string)($photo['date'] ?? ''),
            (string)($photo['workoutNumber'] ?? ''),
            (string)($photo['label'] ?? ''),
        ]);
        if ($key === '||') continue;
        $byKey[$key] = $photo;
    }
    usort($byKey, function ($a, $b) {
        return strcmp((string)($a['date'] ?? ''), (string)($b['date'] ?? ''))
            ?: ((int)($a['workoutNumber'] ?? 0) <=> (int)($b['workoutNumber'] ?? 0));
    });
    return array_values($byKey);
}

function normalizeTimestamp($value): int {
    if (is_string($value) && preg_match('/^\d{4}-\d{2}-\d{2}/', $value)) {
        $parsed = strtotime($value);
        return $parsed === false ? 0 : $parsed;
    }
    $timestamp = (int)$value;
    if ($timestamp > 9999999999) $timestamp = (int)floor($timestamp / 1000);
    if ($timestamp > time() + 60 * 60 * 24 * 365) return 0;
    return max(0, $timestamp);
}

function requireAuth(): string {
    global $sessionsFile;
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$header && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (!preg_match('/Bearer\s+(.+)/', $header, $matches)) respond(['error' => 'Ikke innlogget'], 401);

    $sessions = readJsonFile($sessionsFile);
    $hash = hash('sha256', trim($matches[1]));
    $session = $sessions[$hash] ?? null;
    if (!$session || (int)($session['expiresAt'] ?? 0) < time()) {
        if (isset($sessions[$hash])) {
            unset($sessions[$hash]);
            writeJsonFile($sessionsFile, $sessions);
        }
        respond(['error' => 'Ikke innlogget'], 401);
    }
    return strtolower(trim((string)$session['email']));
}

function progressFile(string $email): string {
    global $progressDir;
    return $progressDir . '/' . hash('sha256', strtolower(trim($email))) . '.json';
}

function readJsonFile(string $path): array {
    $handle = fopen($path, 'c+');
    if (!$handle) return [];
    flock($handle, LOCK_SH);
    $data = stream_get_contents($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    $json = json_decode($data ?: '{}', true);
    return is_array($json) ? $json : [];
}

function writeJsonFile(string $path, array $data): void {
    $handle = fopen($path, 'c+');
    if (!$handle) throw new RuntimeException('Cannot write file');
    flock($handle, LOCK_EX);
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    @chmod($path, 0600);
}

function respond(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
