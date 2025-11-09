const NAMESPACE = 'ppw-tresenraya';
const KEY_HISTORY = `${NAMESPACE}:history`;


export function loadHistory(){
try{
const raw = localStorage.getItem(KEY_HISTORY);
return raw ? JSON.parse(raw) : [];
}catch(e){
console.error('Error cargando historial', e);
return [];
}
}


export function saveHistory(historyArray){
try{
localStorage.setItem(KEY_HISTORY, JSON.stringify(historyArray));
}catch(e){
console.error('Error guardando historial', e);
}
}


export function addRecord(players, winner, moves, duration){
const h = loadHistory();

const record = {
    player1: players?.player1 || 'Jugador 1',
    player2: players?.player2 || 'Jugador 2',
    winner: winner || 'Empate',
    moves: moves || 0,
    duration: duration || '0s',
    date: new Date().toLocaleDateString(),
};

h.push(record); 
saveHistory(h);
}


export function clearHistory(){
localStorage.removeItem(KEY_HISTORY);
}


export function exportHistory(){
return JSON.stringify(loadHistory(), null, 2);
}
