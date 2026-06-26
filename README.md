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
- Mac mini-påminner via ntfy hvis dagens økt ikke er fullført

## Lokal kjøring

```bash
python3 -m http.server 4173
```

Åpne `http://localhost:4173/trene/`.

## Mac mini-påminner

Appen sender en ntfy-melding med tittelen `Bra jobbet` når brukeren fullfører dagens økt. Når innstillinger lagres, sender appen også valgt påminnelsestid som en `Trene-config`-melding. Mac mini kjører `scripts/william-reminder.mjs` hvert 15. minutt via launchd. Scriptet sjekker ntfy-topicens siste meldinger og sender bare påminnelse hvis valgt tid er passert og dagens fullført-melding mangler.

Topic: `william-trene-wb-8v4k9m2p`

Manuell test:

```bash
node scripts/william-reminder.mjs --dry-run
node scripts/william-reminder.mjs --test
```

Launchd installeres fra `launchd/com.remimarents.william-trene-reminder.plist`.

## Felles konto og synk

Trening bruker samme innlogging som de andre Marents-appene. Felles auth-token lagres i `localStorage` som `ordreise-auth` og kommer fra `/wow/api/`.

Treningsdata synkes via:

`https://marents.no/trening/api/?action=sync`

Serverdata ligger i `~/.ordreise-sync/trening-progress/`, mens bruker og sessions deles med de andre appene via `~/.ordreise-sync/users.json` og `~/.ordreise-sync/sessions.json`.
