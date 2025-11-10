let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let players = { player1: 'Jugador 1', player2: 'Jugador 2' };
let moveCount = 0;
let timerInterval = null;
let startTime = null;
let lastWinner = null;
let gameStarted = false;

import { loadHistory, addRecord, saveHistory, clearHistory, exportHistory } from './storage.js';

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

function onStart(e) {
  e.preventDefault();

  const player1 = document.getElementById('player1').value.trim();
  const player2 = document.getElementById('player2').value.trim();

  if (player1 === "" || player2 === "") {
    showModal("Debes ingresar el nombre de ambos jugadores.");
    return;
  }

  const first = document.querySelector('input[name=\"first\"]:checked')?.value || "X";

  players = { player1, player2 };
  currentPlayer = first;
  boardState = Array(9).fill(null);
  moveCount = 0;
  lastWinner = null;
  gameStarted = true;

  renderBoard();
  startTimer();
  updateStatus(`${getCurrentPlayerName()} (${currentPlayer}) — tu turno`);
  rematchBtn.disabled = false;
}

function onCellClick(index) {
  if (!gameStarted) {
    showModal('Debes iniciar la partida para poder jugar');
    return;
  }

  if (boardState[index] || checkWinner(boardState)) return;

  boardState[index] = currentPlayer;
  moveCount++;

  renderBoard();
  moveCountEl.textContent = moveCount;

  const winner = checkWinner(boardState);

  if (winner) {
    stopTimer();
    addRecord(players, getCurrentPlayerName(), moveCount, timerEl.textContent);
    renderHistory();
    showModal(`Ganó ${getCurrentPlayerName()} (${winner})`);
    gameStarted = false;
  } else if (moveCount === 9) {
    stopTimer();
    addRecord(players, 'Empate', moveCount, timerEl.textContent);
    gameStarted = false;
    renderHistory();
    showModal('¡Empate!');
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
    btn.setAttribute('tabindex', '0');

    if (cell === 'X') {
      btn.textContent = 'X';
      btn.classList.add('x');
      btn.disabled = true;
    } else if (cell === 'O') {
      btn.textContent = 'O';
      btn.classList.add('o');
      btn.disabled = true;
    } else {
      btn.textContent = '';
    }

    btn.addEventListener('click', () => onCellClick(i));

    boardEl.appendChild(btn);
  });
}



function updateStatus(msg) {
  statusEl.textContent = msg;
}

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


function onRematch() {

  if (!players.player1 || !players.player2) {
    showModal("Primero debes iniciar una partida registrando a los jugadores.");
    return;
  }

  boardState = Array(9).fill(null);
  moveCount = 0;
  renderBoard();
  startTimer();
  updateStatus(`${getCurrentPlayerName()} (${currentPlayer}) — tu turno`);
  gameStarted = true; 
}

function onNewGame() {
  document.getElementById('setup-form').reset();
  boardState = Array(9).fill(null);
  moveCount = 0;
  stopTimer();
  showModal('Completa el formulario e inicia la partida.');
  renderBoard();
  gameStarted=false;
}

function onExport() {
  const data = exportHistory();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'historial_tres_en_raya.json';
  a.click();
  URL.revokeObjectURL(url);
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

function showModal(message) {
  const modal = document.getElementById('customModal');
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.textContent = message;
  modal.style.display = 'block';

  document.getElementById('closeModal').onclick = function() {
    modal.style.display = 'none';
  };
}


init();
