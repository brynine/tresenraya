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


export function addRecord(record){
const h = loadHistory();
h.unshift(record); // última primera
saveHistory(h);
}


export function clearHistory(){
localStorage.removeItem(KEY_HISTORY);
}


export function exportHistory(){
return JSON.stringify(loadHistory(), null, 2);
}
