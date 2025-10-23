let display = document.getElementById('result');
let operationDisplay = document.getElementById('operation');

let currentExpression = ""; // Para guardar a expressão em cima
let isNewNumber = true;     // Para saber quando reiniciar o display

function appendToDisplay(value) {
  // ✅ Evitar múltiplos pontos no mesmo número
  if (value === '.' && display.value.includes('.') && !isNewNumber) {
    return;
  }

  if (isNewNumber) {
    display.value = value;
    isNewNumber = false;
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  display.value = '';
  operationDisplay.textContent = '';
  currentExpression = '';
  isNewNumber = true;
}

function deleteLast() {
  if (!isNewNumber) {
    display.value = display.value.slice(0, -1);
  }
}

function percentage() {
  let value = parseFloat(display.value);
  if (!isNaN(value)) {
    display.value = value / 100;
  }
}

function useOperator(operator) {
  // ✅ Impedir operadores múltiplos seguidos
  if (isNewNumber && currentExpression !== '') {
    // Substitui o último operador pelo novo
    currentExpression = currentExpression.slice(0, -3) + ' ' + operator + ' ';
    operationDisplay.textContent = currentExpression;
    return;
  }

  if (display.value === '' && currentExpression === '') return;

  currentExpression += display.value + ' ' + operator + ' ';
  operationDisplay.textContent = currentExpression;
  
  isNewNumber = true; // O próximo número será novo
}

function toggleSign() {
  if (display.value.startsWith('-')) {
    display.value = display.value.slice(1);
  } else if (display.value !== '') {
    display.value = '-' + display.value;
  }
}

function calculate() {
  if (currentExpression === '' || display.value === '') return;

  let finalExpression = currentExpression + display.value;

  // ✅ Verificar divisão por zero antes de calcular
  if (/\/\s*0(?!\d)/.test(finalExpression.replace(/÷/g, '/'))) {
    display.value = 'Erro';
    operationDisplay.textContent = finalExpression + ' =';
    currentExpression = '';
    isNewNumber = true;
    return;
  }

  let result = eval(finalExpression.replace(/÷/g, '/').replace(/×/g, '*'));

  operationDisplay.textContent = finalExpression + ' =';
  display.value = result;

  currentExpression = '';
  isNewNumber = true;
}

document.addEventListener('keydown', function(event) {
  const key = event.key;

  if ('0123456789.'.includes(key)) {
    appendToDisplay(key);
  } else if (key === '+') {
    useOperator('+');
  } else if (key === '-') {
    useOperator('-');
  } else if (key === '*') {
    useOperator('×');
  } else if (key === '/') {
    useOperator('÷');
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});
