 import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'

function MainApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('tic-tac-toe-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tic-tac-toe-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <StrictMode>
      <div className="game-wrapper">
        <header className="game-header">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Light and Dark Theme"
          >
            <div className="toggle-track">
              <span className="toggle-icon sun">☀️</span>
              <span className="toggle-icon moon">🌙</span>
              <div className="toggle-thumb" />
            </div>
            <span className="toggle-text">
              {theme === 'light' ? 'Day Mode' : 'Night Mode'}
            </span>
          </button>
        </header>
        <main className="game-main">
          <App />
        </main>
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<MainApp />);

