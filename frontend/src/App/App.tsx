import './App.css'
import Game from '../GameElements/Game/Game'
import { useState, useEffect } from 'react'

export type GameMode = '2player' | 'ai';

function App() {
  const [winner, setWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('2player');
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    if (winner) {
      alert(`${winner} won!`);
    }
  }, [winner]);

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setWinner(null);
    setGameKey(prev => prev + 1);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="mode-selector">
            <button 
              className={`mode-btn ${gameMode === '2player' ? 'active' : ''}`}
              onClick={() => handleModeChange('2player')}
            >
              2 Player
            </button>
            <button 
              className={`mode-btn ${gameMode === 'ai' ? 'active' : ''}`}
              onClick={() => handleModeChange('ai')}
            >
              AI
            </button>
          </div>
          <h1>React Chess</h1>
        </div>
      </header>
      
      <div className="app-container">
        <Game 
          key={gameKey}
          gameMode={gameMode}
          onGameWon={setWinner} 
        />
      </div>
    </>
  )
}

export default App
