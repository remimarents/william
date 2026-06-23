# William Trene

Mobil-først treningsapp for Williams daglige pushups og situps.

Publisert med GitHub Pages fra `main` og mappen `trene/`:

`https://remimarents.github.io/william/trene/`

## Funksjoner

- daglig økt med pushups og situps
- streak, XP og merker
- progresjon mot 100 reps
- situps kan settes senere i innstillinger
- synkronisert historikk via Mac mini-tjeneste, med `localStorage` som lokal cache
- PWA med hjemskjermikon og enkel offline-cache
- Mac mini-påminner via ntfy hvis dagens økt ikke er fullført

## Lokal kjøring

```bash
python3 -m http.server 4173
```

Åpne `http://localhost:4173/trene/`.

## Mac mini-påminner

Appen sender en ntfy-melding med tittelen `Bra jobbet` når William fullfører dagens økt. Når innstillinger lagres, sender appen også valgt påminnelsestid som en `Trene-config`-melding. Mac mini kjører `scripts/william-reminder.mjs` hvert 15. minutt via launchd. Scriptet sjekker ntfy-topicens siste meldinger og sender bare påminnelse hvis valgt tid er passert og dagens fullført-melding mangler.

Topic: `william-trene-wb-8v4k9m2p`

Manuell test:

```bash
node scripts/william-reminder.mjs --dry-run
node scripts/william-reminder.mjs --test
```

Launchd installeres fra `launchd/com.remimarents.william-trene-reminder.plist`.

## Mac mini-synk

`scripts/william-sync-server.mjs` er en liten JSON-basert sync-server for appdata. Appen kan lese/skrive felles state via `https://.../api/state`, slik at Williams økter vises på andre telefoner også.

Serveren kjører lokalt på Mac mini, men GitHub Pages-appen krever HTTPS. Den aktive produksjonsruten er Cloudflare Tunnel `william-trene-sync`:

`https://william-trene-sync.marents.no`

Tunnelen peker til lokal origin `http://127.0.0.1:18787`.

Lag en sterk nøkkel:

```bash
openssl rand -hex 32
```

Test lokalt:

```bash
SYNC_TOKEN="<nøkkel>" node scripts/william-sync-server.mjs
curl -X POST -H "Content-Type: application/json" -d '{"username":"williamberner","password":"<passord>"}' http://127.0.0.1:18787/api/login
curl -H "Authorization: Bearer <nøkkel>" -H "X-WB-User: williamberner" http://127.0.0.1:18787/api/state
curl -H "Authorization: Bearer <nøkkel>" -H "X-WB-User: williamberner" https://william-trene-sync.marents.no/api/state
```

Launchd-mal ligger i `launchd/com.remimarents.william-trene-sync.plist`. Bytt `CHANGE_ME` med nøkkelen lokalt før den lastes inn.

I appen er tunnel-URL forhåndsutfylt under `Innstillinger` → `Synkronisering`. Når William logger inn, henter appen automatisk en kortlevd sync-session fra serveren. Den permanente sync-nøkkelen blir værende på Mac mini og trenger ikke limes inn på telefonen.
