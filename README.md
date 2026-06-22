# William Trene

Mobil-først treningsapp for Williams daglige pushups og situps.

Publisert med GitHub Pages fra `main` og mappen `trene/`:

`https://remimarents.github.io/william/trene/`

## Funksjoner

- daglig økt med pushups og situps
- streak, XP og merker
- progresjon mot 100 reps
- situps kan settes senere i innstillinger
- lokal historikk på telefonen via `localStorage`
- PWA med hjemskjermikon og enkel offline-cache
- Mac mini-påminner via ntfy hvis dagens økt ikke er fullført

## Lokal kjøring

```bash
python3 -m http.server 4173
```

Åpne `http://localhost:4173/trene/`.

## Mac mini-påminner

Appen sender en ntfy-melding med tittelen `Bra jobbet` når William fullfører dagens økt. Mac mini kjører `scripts/william-reminder.mjs` hver dag kl. 19:30 via launchd. Scriptet sjekker ntfy-topicens siste meldinger og sender bare påminnelse hvis dagens fullført-melding mangler.

Topic: `william-trene-wb-8v4k9m2p`

Manuell test:

```bash
node scripts/william-reminder.mjs --dry-run
node scripts/william-reminder.mjs --test
```

Launchd installeres fra `launchd/com.remimarents.william-trene-reminder.plist`.
