# Trening

Mobil-først treningsapp for daglige pushups, situps og andre kroppsvektøvelser.

Publisert på Marents.no fra mappen `trene/`:

`https://marents.no/trening/`

## Funksjoner

- daglig økt med pushups og situps
- streak, XP og merker
- progresjon mot 100 reps
- situps kan settes senere i innstillinger
- synkronisert historikk via felles Marents-konto, med `localStorage` som lokal cache
- PWA med hjemskjermikon og enkel offline-cache
- Mac mini-påminner via iMessage hvis dagens økt ikke er fullført

## Lokal kjøring

```bash
python3 -m http.server 4173
```

Åpne `http://localhost:4173/trene/`.

## Mac mini-påminner

Appen lagrer iMessage-mottaker, tidspunkt for dagens økt, påminnelsestid og fullførte økter i den server-synkede treningsstaten. Mac mini kjører `scripts/william-reminder.mjs` hvert 15. minutt via launchd. Scriptet leser treningsdata fra Marents-serveren via SSH og kan sende dagens foreslåtte økt med lenke på valgt tidspunkt. Det kan også sende en egen iMessage hvis valgt påminnelsestid er passert og dagens økt fortsatt mangler.

Mac mini må være innlogget med Meldinger/iMessage, og Terminal/osascript må ha lov til å styre Meldinger i macOS Personvern og sikkerhet.

Manuell test:

```bash
node scripts/william-reminder.mjs --dry-run
IMESSAGE_RECIPIENT="+47..." node scripts/william-reminder.mjs --test
```

Launchd installeres fra `launchd/com.remimarents.william-trene-reminder.plist`.

## Felles konto og synk

Trening bruker samme innlogging som de andre Marents-appene. Felles auth-token lagres i `localStorage` som `ordreise-auth` og kommer fra `/spill/api/`.

Treningsdata synkes via:

`https://marents.no/trening/api/?action=sync`

Treningsdata ligger per bruker i `~/.marents-sync/trening-progress/`, og felles brukere/sessions ligger under `~/.marents-sync/`. Lokal nettleser-cache lagres også per innlogget bruker etter første innlogging, slik at flere kontoer på samme enhet ikke blander treningslogg.
