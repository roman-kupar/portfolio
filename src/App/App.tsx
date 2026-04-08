import './App.css'
import Game from '../GameElements/Game/Game'
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
    <>
      <header className="app-header">
        <div className="header-content">
          <h1>React Chess</h1>
          <button className="restart-btn" onClick={handleRestart}>
            Restart Game
          </button>
        </div>
      </header>
      
      <div className="app-container">
        <Game 
          key={gameKey}
          onGameWon={setWinner} 
        />
      </div>
    </>
  )
}

export default App
