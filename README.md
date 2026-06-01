# Fifteen Puzzle

A classic 15-tile sliding puzzle built with React and Vite.

## How to play

Slide tiles into the empty space until they are arranged in order from 1 to 15, left to right, top to bottom.

- **Click** any tile adjacent to the blank to slide it
- **Arrow keys** also work — the tile moves into the blank in that direction
- Hit **Shuffle** to start a new game at any time

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/fifteen-puzzle.git
cd fifteen-puzzle
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## How it works

Tiles are positioned absolutely on the board and keyed by their value rather than their index. When a move is made, only the CSS `transform` changes — the browser animates the slide automatically via a CSS transition.

Every shuffled board is checked for solvability using the standard inversion-parity algorithm, so you will never be given an impossible puzzle.