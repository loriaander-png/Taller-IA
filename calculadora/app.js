// app.js — lógica de la calculadora
// Organización: manejo del DOM, entrada/estado, parser (shunting-yard) y evaluador

const displayEl = document.getElementById('display');
const keysEl = document.querySelector('.keys');

// Estado simple
const state = {
  current: '0', // texto mostrado / número en edición
  tokens: [],    // tokens infix: números y operadores
  lastWasEqual: false
};

// Utilidades
const clampDecimals = (n) => {
  if (!isFinite(n)) throw new Error('Math error');
  // redondear a 10 decimales razonables
  return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
};

const updateDisplay = (text) => {
  displayEl.textContent = String(text);
};

// DOM actions
const actions = {
  inputDigit: (d) => {
    if (state.lastWasEqual) { state.current = '0'; state.tokens = []; state.lastWasEqual = false; }
    if (state.current === '0' && d !== '.') state.current = d;
    else if (d === '.' && state.current.includes('.')) return;
    else state.current = state.current + d;
    updateDisplay(state.current);
  },
  operator: (op) => {
    // push current number then operator
    if (state.current !== '') {
      state.tokens.push(state.current);
    }
    // if last token is operator, replace
    const last = state.tokens[state.tokens.length - 1];
    if (['+','-','*','/'].includes(last)) {
      state.tokens[state.tokens.length -1] = op;
    } else {
      state.tokens.push(op);
    }
    state.current = '0';
    state.lastWasEqual = false;
    updateDisplay(op);
  },
  percent: () => {
    // convierte el número actual en porcentaje
    try {
      const v = parseFloat(state.current || '0');
      const res = clampDecimals(v / 100);
      state.current = String(res);
      updateDisplay(state.current);
    } catch (e) { updateDisplay('Error'); }
  },
  toggleSign: () => {
    if (state.current === '0') return;
    if (state.current.startsWith('-')) state.current = state.current.slice(1);
    else state.current = '-' + state.current;
    updateDisplay(state.current);
  },
  clear: () => {
    state.current = '0'; state.tokens = []; state.lastWasEqual = false; updateDisplay('0');
  },
  backspace: () => {
    if (state.lastWasEqual) { actions.clear(); return; }
    if (state.current.length <=1) state.current = '0'; else state.current = state.current.slice(0,-1);
    updateDisplay(state.current);
  },
  equals: () => {
    // push last number
    if (state.current !== '') state.tokens.push(state.current);
    try {
      const rpn = toRPN(state.tokens);
      const value = evaluateRPN(rpn);
      const rounded = clampDecimals(value);
      updateDisplay(rounded);
      state.current = String(rounded);
      state.tokens = [];
      state.lastWasEqual = true;
    } catch (e) {
      updateDisplay('Error');
      state.current = '0'; state.tokens = [];
      state.lastWasEqual = false;
      console.error(e);
    }
  }
};

// Parser: Shunting-yard to RPN (supports + - * / and numbers)
const precedence = { '+':1, '-':1, '*':2, '/':2 };
const isOperator = (t) => ['+','-','*','/'].includes(t);

const toRPN = (tokens) => {
  const output = [];
  const ops = [];
  for (let i=0;i<tokens.length;i++){
    const t = tokens[i];
    if (t === '') continue;
    if (!isNaN(Number(t))) {
      output.push(t);
    } else if (isOperator(t)){
      while (ops.length && isOperator(ops[ops.length-1]) && precedence[ops[ops.length-1]] >= precedence[t]){
        output.push(ops.pop());
      }
      ops.push(t);
    } else {
      throw new Error('Token inválido: ' + t);
    }
  }
  while (ops.length) output.push(ops.pop());
  return output;
};

const evaluateRPN = (rpn) => {
  const st = [];
  for (const t of rpn){
    if (!isNaN(Number(t))) st.push(Number(t));
    else if (isOperator(t)){
      const b = st.pop(); const a = st.pop();
      if (a === undefined || b === undefined) throw new Error('Expresión inválida');
      let res;
      switch(t){
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/': if (b === 0) throw new Error('División por cero'); res = a / b; break;
        default: throw new Error('Operador desconocido');
      }
      st.push(res);
    } else throw new Error('Token inesperado RPN: ' + t);
  }
  if (st.length !== 1) throw new Error('Expresión inválida al evaluar');
  return st[0];
};

// Event handling
keysEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const val = btn.dataset.value;
  const action = btn.dataset.action;
  if (action === 'clear') actions.clear();
  else if (action === 'toggle-sign') actions.toggleSign();
  else if (action === 'percent') actions.percent();
  else if (action === 'backspace') actions.backspace();
  else if (action === 'equals') actions.equals();
  else if (action === 'operator') actions.operator(btn.dataset.value);
  else if (val !== undefined) actions.inputDigit(val);
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((/^[0-9]$/).test(key)) { actions.inputDigit(key); e.preventDefault(); return; }
  if (key === '.') { actions.inputDigit('.'); e.preventDefault(); return; }
  if (key === 'Enter') { actions.equals(); e.preventDefault(); return; }
  if (key === 'Backspace') { actions.backspace(); e.preventDefault(); return; }
  if (key === 'Escape') { actions.clear(); e.preventDefault(); return; }
  if (key === '%') { actions.percent(); e.preventDefault(); return; }
  if (['+','-','*','/'].includes(key)) { actions.operator(key); e.preventDefault(); return; }
  // optional: toggle sign with 'p'
  if (key.toLowerCase() === 'p') { actions.toggleSign(); e.preventDefault(); return; }
});

// Init
updateDisplay(state.current);

// Notes: No use of eval() — expression building uses tokens and a shunting-yard evaluator.
