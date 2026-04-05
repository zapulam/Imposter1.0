# Imposter 1.0

A **pass-the-device** party game for 3–20 players, built with React and Vite. Everyone except the Imposters sees the same secret word. Players take turns giving short spoken clues without saying the word outright, then vote on who they think is lying.

## Play online

**[Open the game (GitHub Pages)](https://zapulam.github.io/Imposter1.0/)**

Works in a modern mobile or desktop browser. One phone or tablet is enough: players hand the device around for private role reveals and voting.

## How it works

1. **Setup** — Enter names, pick a mode, set how many Imposters, and adjust options (discussion timer, tie-breaking, scoring, and more).
2. **Private reveal** — Each player taps when it is their turn, reads their role and word (if any), then hides the screen before passing the device.
3. **Clues** — In order, each player gives a brief clue out loud. Do not say, spell, rhyme with, or translate the secret word.
4. **Discussion** — Talk it through; an optional timer can limit discussion time.
5. **Vote** — Each player votes privately. The app shows tallies and reveals who was who.

In **Classic** mode, most players share one word; Imposters may get no hint, or only a category hint, depending on settings. In **Multi-word Imposter** mode, normals and imposters can see different but related words, which changes how clues sound.

Optional rules include keeping score across rounds, allowing a caught Imposter to guess the word to steal the win (Classic), and tie-handling options such as a runoff vote among tied players.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Deploy to GitHub Pages (uses `gh-pages` and the `homepage` in `package.json`):

```bash
npm run deploy
```
