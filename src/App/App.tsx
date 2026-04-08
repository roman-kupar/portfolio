import './App.css'
import Game from '../GameElements/Game/Game'
import Portfolio from '../Portfolio/Portfolio'
import { useState, useEffect } from 'react'

function App() {
  const [winner, setWinner] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    if (winner) {
      alert(`${winner} won!`);
    }
  }, [winner]);

  const handleRestart = () => {
    setWinner(null);
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="app-layout">
      <Portfolio />
      <div className="app-container">
        <div className="game-header">
          <h2>React Chess</h2>
          <button className="restart-btn" onClick={handleRestart}>
            Restart Game
          </button>
        </div>
        <Game 
          key={gameKey}
          onGameWon={setWinner} 
        />
      </div>
      <footer id="contact" className="portfolio-footer">
        <p>© {new Date().getFullYear()} Roman Kupar.</p>
        <p>Contact: <a href="mailto:roman.kuparr@gmail.com">roman.kuparr@gmail.com</a></p>
      </footer>
    </div>
  )
}

export default App
