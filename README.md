# VOSC Activity-1 — Tic-Tac-Toe

## Description

A two-player Tic-Tac-Toe game for the VOSC open-source activity. The rules are the classic ones; the focus is on execution — editorial typography, a carefully built board, and quiet, precise micro-interactions — all made with nothing but the browser's own technologies.

## Features

- Two-player game on one device — Player X always starts and players alternate
- Occupied cells are protected; no moves are accepted once a round has finished
- Detection of all 8 winning combinations (3 rows, 3 columns, 2 diagonals)
- Draw detection
- Winning cells highlighted, other cells dimmed, and an animated winning line
- Live turn indicator and result message (`aria-live` announced for screen readers)
- Persistent score for X, O and draws during the session
- **New Round** (clears the board, keeps scores) and **Reset Score** (clears everything)
- X and O drawn as animated SVG strokes; hover shows a faint preview of the current player's mark
- Short entrance animation (under one second)
- Responsive layout for desktop, laptop, tablet and mobile
- Keyboard accessible (Tab, Enter/Space, and arrow keys between cells) with visible focus states
- Respects `prefers-reduced-motion`

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

> No frameworks or external libraries were used.

There are no external fonts, images, CDNs, APIs, packages or build tools. Fonts come from the system font stack, and every visual (background, texture, symbols) is generated with HTML and CSS.

## How to Run

Open `index.html` in any modern web browser. No installation, terminal commands or server are required.

## How to Play

1. Player X goes first; players then take turns clicking (or pressing Enter/Space on) an empty cell.
2. The first player to place three of their marks in a row — horizontally, vertically or diagonally — wins the round.
3. If all nine cells are filled with no winner, the round is a draw.
4. Press **New Round** to play again with the scores kept, or **Reset Score** to start fresh.

## Project Structure

```text
VOSC Activity-1/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Design

The look is dark, cinematic and editorial rather than "gamer". A warm charcoal background is built from layered gradients, a fine dither texture, faint concentric rings and a single hairline beam. The palette is deliberately restrained: warm ivory for text and X, and one muted brass accent for O and highlights — no neon and no heavy glow.

The title is set in a large serif with a staircase indent (a quiet nod to a diagonal win) and the italic **TAC** in the accent colour. The board sits in a softly translucent frame with thin, faded grid lines, and the symbols are drawn stroke by stroke. Motion is short and purposeful; nothing bounces, flashes or explodes.

## Future Improvements

- Optional alternating starting player between rounds
- Saving the scores in the browser between visits
- A light theme variant
- Optional single-player mode against the computer
