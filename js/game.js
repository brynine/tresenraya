import { loadHistory, addRecord, saveHistory, clearHistory, exportHistory } from './storage.js';

//Estado del juego
let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let players = { player1: 'Jugador 1', player2: 'Jugador 2' };
let moveCount = 0;
let timerInterval = null;
let startTime = null;
let lastWinner = null;

//Referencias al DOM
const setupForm = document.getElementById('setup-form');
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const moveCountEl = document.getElementById('move-count');
const timerEl = document.getElementById('timer');
const rematchBtn = document.getElementById('rematch-btn');
const newgameBtn = document.getElementById('newgame-btn');
const historyTable = document.querySelector('#history-table tbody');
const exportBtn = document.getElementById('export-json');
const clearHistoryBtn = document.getElementById('clear-history');
const filterWinner = document.getElementById('filter-winner');
const filterFrom = document.getElementById('filter-from');
const filterTo = document.getElementById('filter-to');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearFiltersBtn = document.getElementById('clear-filters');

//Inicialización
function init() {
  renderBoard();
  bindEvents();
  renderHistory();
  updateStatus('Completa el formulario e inicia la partida.');
}

function bindEvents() {
  setupForm.addEventListener('submit', onStart);
  rematchBtn.addEventListener('click', onRematch);
  newgameBtn.addEventListener('click', onNewGame);
  exportBtn.addEventListener('click', onExport);
  clearHistoryBtn.addEventListener('click', onClearHistory);
  applyFiltersBtn.addEventListener('click', renderHistory);
  clearFiltersBtn.addEventListener('click', onClearFilters);
  
  // Mover con teclado
  boardEl.addEventListener('keydown', e => {
    const activeCell = boardEl.querySelector('.cell:focus');
    if (!activeCell) return;
    const i = Number(activeCell.dataset.index);

    switch (e.key) {
      case 'ArrowRight': focusCell((i + 1) % 9); e.preventDefault(); break;
      case 'ArrowLeft':  focusCell((i + 8) % 9); e.preventDefault(); break;
      case 'ArrowDown':  focusCell((i + 3) % 9); e.preventDefault(); break;
      case 'ArrowUp':    focusCell((i + 6) % 9); e.preventDefault(); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onCellClick(i);
        break;
    }
  });
}

//Función de inicio
function onStart(e) {
  e.preventDefault();

  const player1 = document.getElementById('player1').value.trim() || 'Jugador 1';
  const player2 = document.getElementById('player2').value.trim() || 'Jugador 2';
  const first = document.querySelector('input[name="first"]:checked')?.value || 'X';

  players = { player1, player2 };
  currentPlayer = first;
  boardState = Array(9).fill(null);
  moveCount = 0;
  lastWinner = null;

  renderBoard();
  startTimer();
  updateStatus(`${getCurrentPlayerName()} (${currentPlayer}) — tu turno`);
}

//Lógica del tablero
function onCellClick(index) {
  if (boardState[index] || checkWinner(boardState)) return;
  boardState[index] = currentPlayer;
  moveCount++;
  renderBoard();

  const winner = checkWinner(boardState);
  if (winner) {
    stopTimer();
    updateStatus(`Ganó ${getCurrentPlayerName()} (${winner}) 🎉`);
    addRecord(players, getCurrentPlayerName(), moveCount, timerEl.textContent);
  } else if (moveCount === 9) {
    stopTimer();
    updateStatus('Empate 🤝');
    addRecord(players, 'Empate', moveCount, timerEl.textContent);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`${getCurrentPlayerName()} (${currentPlayer}) — tu turno`);
  }
}

function renderBoard() {
  boardEl.innerHTML = '';
  boardState.forEach((cell, i) => {
    const btn = document.createElement('button');
    btn.classList.add('cell');
    btn.dataset.index = i;
    btn.textContent = cell ? cell : '';
    btn.addEventListener('click', () => onCellClick(i));
    boardEl.appendChild(btn);
  });
}

function updateStatus(msg) {
  statusEl.textContent = msg;
}

// Funciones auxiliares
function getCurrentPlayerName() {
  return currentPlayer === 'X' ? players.player1 : players.player2;
}

function focusCell(i) {
  const cell = boardEl.querySelector(`[data-index="${i}"]`);
  if (cell) cell.focus();
}

function checkWinner(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,bx,c] of lines) {
    if (b[a] && b[a] === b[bx] && b[a] === b[c]) return b[a];
  }
  return null;
}

// Temporizador
function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(diff / 60).toString().padStart(2, '0');
    const secs = (diff % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// Historial
function renderHistory() {
  const history = loadHistory();
  historyTable.innerHTML = '';
  history.forEach(h => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${h.player1} vs ${h.player2}</td>
      <td>${h.winner}</td>
      <td>${h.moves}</td>
      <td>${h.duration}</td>
      <td>${h.date}</td>
    `;
    historyTable.appendChild(row);
  });
}


// Botones adicionales
function onRematch() {
  boardState = Array(9).fill(null);
  moveCount = 0;
  renderBoard();
  startTimer();
  updateStatus(`${getCurrentPlayerName()} (${currentPlayer}) — tu turno`);
}

function onNewGame() {
  document.getElementById('setup-form').reset();
  boardState = Array(9).fill(null);
  moveCount = 0;
  stopTimer();
  updateStatus('Completa el formulario e inicia la partida.');
  renderBoard();
}

function onExport() {
  exportHistory();
}

function onClearHistory() {
  clearHistory();
  renderHistory();
}

function onClearFilters() {
  filterWinner.value = '';
  filterFrom.value = '';
  filterTo.value = '';
  renderHistory();
}

init();
