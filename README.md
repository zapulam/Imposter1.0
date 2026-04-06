# Imposter 1.0

A **pass-the-device** party game for 3–20 players, built with React, Tailwind CSS, and Vite. Everyone except the Imposters sees the same secret word. Players take turns giving short spoken clues without saying the word outright, then vote on who they think is lying.

Play for free **[here](https://zapulam.github.io/Imposter1.0/)**.

![Imposter Party Game](https://img.shields.io/badge/React-19.0.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.6-38B2AC) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.1-purple)

## 🎮 Game Overview

Imposter is a social deduction game played on one shared phone or tablet. Players hand the device around for private role reveals and voting—no accounts or servers required for the core loop. The app handles setup, timers, scoring options, and vote tallies so you can focus on clues and discussion.

## ✨ Features

- **📱 Pass-the-device flow** — Private reveals, clue order, discussion, and voting on one device
- **👥 3–20 players** — Name entry, adjustable Imposter count, and flexible group sizes
- **🎛️ Modes & options** — Classic and Multi-word Imposter modes; discussion timer, tie-breaking, scoring, and more
- **🎨 Modern UI** — Responsive layout for mobile and desktop browsers
- **⚡ Fast setup** — Configure a round and start playing quickly

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or another compatible package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Imposter1.0
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** — Go to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Play

### Round flow

1. **Setup** — Enter names, pick a mode, set how many Imposters, and adjust options (discussion timer, tie-breaking, scoring, and more).
2. **Private reveal** — Each player taps when it is their turn, reads their role and word (if any), then hides the screen before passing the device.
3. **Clues** — In order, each player gives a brief clue out loud. Do not say, spell, rhyme with, or translate the secret word.
4. **Discussion** — Talk it through; an optional timer can limit discussion time.
5. **Vote** — Each player votes privately. The app shows tallies and reveals who was who.

### Modes

- **Classic** — Most players share one word; Imposters may get no hint or only a category hint, depending on settings.
- **Multi-word Imposter** — Normals and Imposters can see different but related words, which changes how clues sound.

### Optional rules

You can keep score across rounds, allow a caught Imposter to guess the word to steal the win (Classic), and use tie-handling options such as a runoff vote among tied players.

## 🔧 Development

### Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint

## Deployment

- `npm run build` — Production build output in `dist`
- `npm run deploy` — Deploy to GitHub Pages (uses `gh-pages` and the `homepage` field in `package.json`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you run into problems or have ideas, open an issue on the GitHub repository.

---

**Enjoy playing Imposter 1.0! 🎉**
