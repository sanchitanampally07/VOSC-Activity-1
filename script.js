'use strict';

/* ==========================================================================
   VOSC Activity-1 — Tic-Tac-Toe
   Vanilla JavaScript only. No libraries, no frameworks, no network calls.
   ========================================================================== */

/* ---------- Constants ---------- */

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Inline SVG markup for each symbol (drawn with CSS stroke animation)
const MARKS = {
  X: '<svg class="glyph glyph-x" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
       '<path d="M24 24 L76 76" pathLength="1"></path>' +
       '<path d="M76 24 L24 76" pathLength="1"></path>' +
     '</svg>',
  O: '<svg class="glyph glyph-o" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
       '<circle cx="50" cy="50" r="27" pathLength="1"></circle>' +
     '</svg>'
};

/* ---------- DOM references ---------- */

const boardElement = document.getElementById('board');
const winLineSvg = document.getElementById('win-line-svg');
const winLine = document.getElementById('win-line');
const statusElement = document.getElementById('status');
const newRoundButton = document.getElementById('new-round');
const resetScoreButton = document.getElementById('reset-score');

const scoreElements = {
  X: document.getElementById('score-x'),
  O: document.getElementById('score-o'),
  draw: document.getElementById('score-draw')
};
const scoreRows = document.querySelectorAll('.score-row');

const cells = [];

/* ---------- Game state ---------- */

const state = {
  board: Array(9).fill(null), // null | 'X' | 'O'
  currentPlayer: 'X',
  isOver: false,
  result: null,               // null | 'X' | 'O' | 'draw'
  scores: { X: 0, O: 0, draw: 0 }
};

/* ---------- Setup ---------- */

function startGame() {
  buildBoard();

  boardElement.addEventListener('click', handleCellClick);
  boardElement.addEventListener('keydown', handleBoardKeys);
  newRoundButton.addEventListener('click', resetRound);
  resetScoreButton.addEventListener('click', resetGame);

  resetRound();
}

function buildBoard() {
  for (let index = 0; index < 9; index++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.index = index;
    cell.innerHTML =
      '<span class="ghost ghost-x">' + MARKS.X + '</span>' +
      '<span class="ghost ghost-o">' + MARKS.O + '</span>' +
      '<span class="mark"></span>';

    boardElement.insertBefore(cell, winLineSvg);
    cells.push(cell);
  }
}

/* ---------- Gameplay ---------- */

function handleCellClick(event) {
  const cell = event.target.closest('.cell');
  if (!cell) return;

  const index = Number(cell.dataset.index);
  if (state.isOver || state.board[index] !== null) return;

  state.board[index] = state.currentPlayer;

  const winner = checkWinner(state.board);

  if (winner) {
    finishRound(winner.player, winner.line);
  } else if (checkDraw(state.board)) {
    finishRound('draw', null);
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  }

  updateBoard();
  updateStatus();
}

// Returns { player, line } when someone has three in a row, otherwise null
function checkWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: line };
    }
  }
  return null;
}

// Only meaningful after checkWinner() has returned null
function checkDraw(board) {
  return board.every(function (value) { return value !== null; });
}

function finishRound(result, line) {
  state.isOver = true;
  state.result = result;
  state.scores[result] += 1;
  updateScore(result);

  boardElement.dataset.state = result === 'draw' ? 'draw' : 'over';

  if (line) {
    boardElement.dataset.winner = result;
    cells.forEach(function (cell, index) {
      const isWinning = line.includes(index);
      cell.classList.toggle('win', isWinning);
      cell.classList.toggle('dim', !isWinning);
    });
    drawWinLine(line);
  }
}

/* ---------- Rendering ---------- */

function updateBoard() {
  cells.forEach(function (cell, index) {
    const value = state.board[index];
    const markElement = cell.querySelector('.mark');
    const alreadyDrawn = cell.dataset.player === value;

    if (value && !alreadyDrawn) {
      markElement.innerHTML = MARKS[value];
      cell.dataset.player = value;
      cell.classList.add('is-filled');
    } else if (!value && cell.dataset.player) {
      markElement.innerHTML = '';
      delete cell.dataset.player;
      cell.classList.remove('is-filled');
    }

    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.setAttribute('aria-label', 'Row ' + row + ', column ' + column + ', ' + (value ? value : 'empty'));
    cell.setAttribute('aria-disabled', value || state.isOver ? 'true' : 'false');
  });

  boardElement.dataset.turn = state.currentPlayer;
}

function updateStatus() {
  let message;
  let tone = 'result';

  if (state.result === 'draw') {
    message = 'A perfect stalemate.';
  } else if (state.result) {
    message = state.result + ' takes the round.';
  } else {
    message = 'Turn → ' + state.currentPlayer;
    tone = 'turn';
  }

  statusElement.textContent = message;
  statusElement.dataset.tone = tone;

  // restart the short fade-in
  statusElement.style.animation = 'none';
  void statusElement.offsetWidth;
  statusElement.style.animation = '';

  scoreRows.forEach(function (row) {
    const key = row.dataset.key;
    const isActive = state.isOver ? key === state.result : key === state.currentPlayer;
    row.dataset.active = String(isActive);
  });
}

function updateScore(changedKey) {
  Object.keys(scoreElements).forEach(function (key) {
    scoreElements[key].textContent = String(state.scores[key]).padStart(2, '0');
  });

  if (changedKey) {
    const element = scoreElements[changedKey];
    element.classList.remove('bump');
    void element.offsetWidth;
    element.classList.add('bump');
  }
}

/* ---------- Winning line ---------- */

function cellCenter(index) {
  return { x: (index % 3) * 100 + 50, y: Math.floor(index / 3) * 100 + 50 };
}

function drawWinLine(line) {
  const start = cellCenter(line[0]);
  const end = cellCenter(line[2]);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const extend = 30;

  winLine.setAttribute('x1', start.x - (dx / length) * extend);
  winLine.setAttribute('y1', start.y - (dy / length) * extend);
  winLine.setAttribute('x2', end.x + (dx / length) * extend);
  winLine.setAttribute('y2', end.y + (dy / length) * extend);

  winLineSvg.classList.remove('show');
  void winLineSvg.getBoundingClientRect();
  winLineSvg.classList.add('show');
}

/* ---------- Resets ---------- */

// Clears the board but keeps the scores
function resetRound() {
  state.board = Array(9).fill(null);
  state.currentPlayer = 'X';
  state.isOver = false;
  state.result = null;

  delete boardElement.dataset.winner;
  boardElement.dataset.state = 'playing';

  cells.forEach(function (cell) {
    cell.classList.remove('win', 'dim');
  });
  winLineSvg.classList.remove('show');

  updateBoard();
  updateStatus();
  updateScore();
}

// Clears the board and sets every score back to zero
function resetGame() {
  state.scores = { X: 0, O: 0, draw: 0 };
  resetRound();
}

/* ---------- Keyboard: arrow keys move between cells ---------- */

function handleBoardKeys(event) {
  const cell = event.target.closest('.cell');
  if (!cell) return;

  const index = Number(cell.dataset.index);
  const row = Math.floor(index / 3);
  const column = index % 3;
  let nextRow = row;
  let nextColumn = column;

  if (event.key === 'ArrowUp') nextRow = Math.max(0, row - 1);
  else if (event.key === 'ArrowDown') nextRow = Math.min(2, row + 1);
  else if (event.key === 'ArrowLeft') nextColumn = Math.max(0, column - 1);
  else if (event.key === 'ArrowRight') nextColumn = Math.min(2, column + 1);
  else return;

  event.preventDefault();
  cells[nextRow * 3 + nextColumn].focus();
}

startGame();
