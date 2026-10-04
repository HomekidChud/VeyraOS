



AppRegistry.register('calculator', {
  name: 'Calculator',
  iconBg: 'linear-gradient(135deg, #374151, #1f2937)',
  iconText: VeyraIcons.calculator,

  render(container, win) {
    container.innerHTML = `
      <div class="app-root calc-root">
        <div class="calc-display">
          <div class="calc-history" id="calcHistory"></div>
          <div class="calc-result" id="calcResult">0</div>
        </div>
        <div class="calc-keys">
          <button class="calc-key fn" data-key="AC">AC</button>
          <button class="calc-key fn" data-key="+/-">±</button>
          <button class="calc-key fn" data-key="%">%</button>
          <button class="calc-key op" data-key="/">÷</button>
          <button class="calc-key" data-key="7">7</button>
          <button class="calc-key" data-key="8">8</button>
          <button class="calc-key" data-key="9">9</button>
          <button class="calc-key op" data-key="*">×</button>
          <button class="calc-key" data-key="4">4</button>
          <button class="calc-key" data-key="5">5</button>
          <button class="calc-key" data-key="6">6</button>
          <button class="calc-key op" data-key="-">−</button>
          <button class="calc-key" data-key="1">1</button>
          <button class="calc-key" data-key="2">2</button>
          <button class="calc-key" data-key="3">3</button>
          <button class="calc-key op" data-key="+">+</button>
          <button class="calc-key zero" data-key="0">0</button>
          <button class="calc-key" data-key=".">.</button>
          <button class="calc-key op" data-key="=">=</button>
        </div>
      </div>
    `;

    const resultEl = container.querySelector('#calcResult');
    const historyEl = container.querySelector('#calcHistory');
    let current = '0';
    let expression = '';
    let justCalculated = false;

    const updateDisplay = () => {
      resultEl.textContent = current;
      historyEl.textContent = expression;
    };

    const calculate = () => {
      try {
        const expr = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        if (!/^[\d+\-*/%.() ]+$/.test(expr)) throw new Error('Invalid');
        const result = Function('"use strict";return (' + expr + ')')();
        if (!isFinite(result)) throw new Error('Invalid');
        current = String(Math.round(result * 1e10) / 1e10);
        expression = current;
        justCalculated = true;
      } catch {
        current = 'Error';
        expression = '';
      }
      updateDisplay();
    };

    container.querySelectorAll('.calc-key').forEach(key => {
      key.addEventListener('click', () => {
        const k = key.dataset.key;

        if (k === 'AC') {
          current = '0';
          expression = '';
          justCalculated = false;
        } else if (k === '+/-') {
          if (current !== '0' && current !== 'Error') {
            current = current.startsWith('-') ? current.slice(1) : '-' + current;
          }
        } else if (k === '%') {
          current = String(parseFloat(current) / 100);
          expression = current;
        } else if (k === '=') {
          calculate();
          return;
        } else if (['+', '-', '*', '/'].includes(k)) {
          if (justCalculated) {
            justCalculated = false;
          }
          if (expression && !['+', '-', '*', '/'].includes(expression.slice(-1))) {
            expression += k;
          } else if (expression) {
            expression = expression.slice(0, -1) + k;
          } else {
            expression = current + k;
          }
          current = k === '*' ? '×' : k === '/' ? '÷' : k === '-' ? '−' : k;
        } else if (k === '.') {
          if (!current.includes('.')) {
            current += '.';
            if (expression && !['+', '-', '*', '/'].includes(expression.slice(-1))) {
              expression += '.';
            } else {
              expression = current;
            }
          }
        } else {
          
          if (justCalculated || current === '0' || ['+', '-', '*', '/', '×', '÷', '−'].includes(current)) {
            current = k;
            if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
              expression += k;
            } else {
              expression = k;
            }
            justCalculated = false;
          } else {
            current += k;
            expression += k;
          }
        }

        updateDisplay();
      });
    });

    
    container.tabIndex = 0;
    container.addEventListener('keydown', (e) => {
      const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
        'Enter': '=', '=': '=', '%': '%'
      };
      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        const btn = container.querySelector(`[data-key="${mapped}"]`);
        if (btn) btn.click();
      } else if (e.key === 'Escape') {
        const btn = container.querySelector('[data-key="AC"]');
        if (btn) btn.click();
      }
    });
  }
});
