import React, { useState, useEffect } from 'react';
import './Calculator.css';
import {
  getSessionId,
  getSessionIdFromUrl,
  saveHistoryToCloud,
  loadHistoryFromCloud,
  getShareableUrl
} from './cloudStorage';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  // Initialize session and load history
  useEffect(() => {
    const urlSessionId = getSessionIdFromUrl();
    const currentSessionId = urlSessionId || getSessionId();
    setSessionId(currentSessionId);

    // Load history from cloud/localStorage
    loadHistoryFromCloud(currentSessionId).then((loadedHistory) => {
      // Always set history, even if empty, to ensure state is initialized
      setHistory(loadedHistory);
    }).catch((error) => {
      console.error('Error loading history:', error);
      // Even on error, try to load from localStorage directly
      try {
        const localHistory = localStorage.getItem('calculator_history');
        if (localHistory) {
          setHistory(JSON.parse(localHistory));
        }
      } catch (e) {
        console.error('Error parsing localStorage:', e);
      }
    });
  }, []);

  // Save history to localStorage immediately whenever it changes
  useEffect(() => {
    // Always save to localStorage immediately (synchronous)
    if (history.length > 0) {
      localStorage.setItem('calculator_history', JSON.stringify(history));
    }
  }, [history]);

  // Save history to cloud (asynchronous)
  useEffect(() => {
    if (history.length > 0 && sessionId) {
      setIsSyncing(true);
      saveHistoryToCloud(history, sessionId).then(() => {
        setIsSyncing(false);
      });
    }
  }, [history, sessionId]);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);

      // Add to history
      const operatorSymbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
      };

      const historyEntry = {
        expression: `${previousValue} ${operatorSymbols[operation]} ${inputValue}`,
        result: newValue,
        timestamp: new Date().toLocaleTimeString()
      };

      setHistory([historyEntry, ...history]);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    // Also clear from localStorage
    localStorage.removeItem('calculator_history');
  };

  const handleShare = () => {
    const shareUrl = getShareableUrl(sessionId);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareNotification(true);
      setTimeout(() => {
        setShowShareNotification(false);
      }, 3000);
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert(`Share this link: ${shareUrl}`);
    });
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-display">
          <div className="display-value">{display}</div>
        </div>
        <div className="calculator-keypad">
          <div className="calculator-row">
            <button className="calculator-key key-function" onClick={clear}>C</button>
            <button className="calculator-key key-function" onClick={clearEntry}>CE</button>
            <button className="calculator-key key-function" onClick={handleBackspace}>⌫</button>
            <button className="calculator-key key-operator" onClick={() => performOperation('/')}>÷</button>
          </div>
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => inputDigit(7)}>7</button>
            <button className="calculator-key" onClick={() => inputDigit(8)}>8</button>
            <button className="calculator-key" onClick={() => inputDigit(9)}>9</button>
            <button className="calculator-key key-operator" onClick={() => performOperation('*')}>×</button>
          </div>
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => inputDigit(4)}>4</button>
            <button className="calculator-key" onClick={() => inputDigit(5)}>5</button>
            <button className="calculator-key" onClick={() => inputDigit(6)}>6</button>
            <button className="calculator-key key-operator" onClick={() => performOperation('-')}>−</button>
          </div>
          <div className="calculator-row">
            <button className="calculator-key" onClick={() => inputDigit(1)}>1</button>
            <button className="calculator-key" onClick={() => inputDigit(2)}>2</button>
            <button className="calculator-key" onClick={() => inputDigit(3)}>3</button>
            <button className="calculator-key key-operator" onClick={() => performOperation('+')}>+</button>
          </div>
          <div className="calculator-row">
            <button className="calculator-key" onClick={toggleSign}>±</button>
            <button className="calculator-key" onClick={() => inputDigit(0)}>0</button>
            <button className="calculator-key" onClick={inputDecimal}>.</button>
            <button className="calculator-key key-equals" onClick={handleEquals}>=</button>
          </div>
        </div>
      </div>

      <div className="history-panel">
        <div className="history-header">
          <h2>History</h2>
          <div className="history-actions">
            <button className="share-btn" onClick={handleShare} title="Share your history">
              🔗 Share
            </button>
            <button className="clear-history-btn" onClick={clearHistory}>Clear</button>
          </div>
        </div>

        {showShareNotification && (
          <div className="share-notification">
            Link copied to clipboard!
          </div>
        )}

        <div className="sync-status">
          {isSyncing ? (
            <span className="syncing">☁️ Syncing...</span>
          ) : (
            <span className="synced">✓ Synced to cloud</span>
          )}
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="no-history">No calculations yet</div>
          ) : (
            history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-expression">{item.expression}</div>
                <div className="history-result">= {item.result}</div>
                <div className="history-time">{item.timestamp}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
