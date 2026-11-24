(function () {
  var historyEl = document.getElementById('history');
  var currentEl = document.getElementById('current');

  var current = '0';
  var previous = null;
  var operator = null;
  var justEvaluated = false;

  function updateDisplay() {
    currentEl.textContent = current;
    currentEl.classList.toggle('error', current === 'Error');
    if (operator !== null && previous !== null) {
      historyEl.textContent = previous + ' ' + opSymbol(operator);
    } else {
      historyEl.textContent = '';
    }
  }

  function opSymbol(op) {
    return op === '/' ? '÷' : op === '*' ? '×' : op === '-' ? '−' : '+';
  }

  function inputDigit(d) {
    if (current === 'Error') clearAll();
    if (justEvaluated) { current = '0'; justEvaluated = false; }
    if (current === '0') current = d;
    else if (current.replace('-', '').replace('.', '').length < 12) current += d;
    updateDisplay();
  }

  function inputDecimal() {
    if (current === 'Error') clearAll();
    if (justEvaluated) { current = '0'; justEvaluated = false; }
    if (current.indexOf('.') === -1) current += '.';
    updateDisplay();
  }

  function backspace() {
    if (current === 'Error') { clearAll(); return; }
    if (justEvaluated) return;
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }

  function compute(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    var r;
    if (op === '+') r = a + b;
    else if (op === '-') r = a - b;
    else if (op === '*') r = a * b;
    else { if (b === 0) return null; r = a / b; }
    return String(parseFloat(r.toPrecision(12)));
  }

  function applyOperator(op) {
    if (current === 'Error') return;
    if (operator !== null && previous !== null && !justEvaluated) {
      var r = compute(previous, current, operator);
      if (r === null) { setError(); return; }
      previous = r;
    } else {
      previous = current;
    }
    operator = op;
    justEvaluated = false;
    current = '0';
    updateDisplay();
    currentEl.textContent = previous;
  }

  function equals() {
    if (operator === null || previous === null || current === 'Error') return;
    var r = compute(previous, current, operator);
    if (r === null) { setError(); return; }
    var expression = previous + ' ' + opSymbol(operator) + ' ' + current + ' =';
    current = r;
    previous = null;
    operator = null;
    justEvaluated = true;
    updateDisplay();
    historyEl.textContent = expression;
  }

  function setError() {
    current = 'Error';
    previous = null;
    operator = null;
    justEvaluated = false;
    updateDisplay();
  }

  function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    justEvaluated = false;
    updateDisplay();
  }

  document.querySelectorAll('.key[data-digit]').forEach(function (btn) {
    btn.addEventListener('click', function () { inputDigit(btn.dataset.digit); });
  });
  document.querySelectorAll('.key[data-op]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyOperator(btn.dataset.op); });
  });
  document.querySelector('[data-action="decimal"]').addEventListener('click', inputDecimal);
  document.querySelector('[data-action="clear"]').addEventListener('click', clearAll);
  document.querySelector('[data-action="backspace"]').addEventListener('click', backspace);
  document.querySelector('[data-action="equals"]').addEventListener('click', function () { equals(); });

  document.addEventListener('keydown', function (e) {
    if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
    else if (e.key === '.') inputDecimal();
    else if (['+', '-', '*', '/'].indexOf(e.key) !== -1) applyOperator(e.key);
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape') clearAll();
  });

  updateDisplay();
})();
