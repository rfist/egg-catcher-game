interface GameMessageProps {
  type: 'start' | 'gameover';
  score?: number;
}

/**
 * Displays game start or game over message.
 */
export function GameMessage({ type, score }: GameMessageProps) {
  if (type === 'start') {
    return (
      <div className="game-message">
        <span>Press SPACE to start</span>
        <span className="controls-hint">Controls: Z A S X</span>
      </div>
    );
  }

  return (
    <div className="game-message game-over">
      <span>Game Over!</span>
      <span className="final-score">Final Score: {score}</span>
    </div>
  );
}
