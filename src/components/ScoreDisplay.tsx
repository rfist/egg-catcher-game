interface ScoreDisplayProps {
  score: number;
}

/**
 * Displays the current score with LCD-style font.
 */
export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="ui-overlay">
      <div className="score-display">
        <span className="score-value">{score}</span>
      </div>
    </div>
  );
}
