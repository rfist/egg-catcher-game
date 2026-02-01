import missedEggIcon from '../assets/ui/missed-egg-icon.svg';

interface PenaltyDisplayProps {
  penaltyPoints: number;
}

/**
 * Displays penalty points as icons.
 * Half points shown with blinking animation.
 */
export function PenaltyDisplay({ penaltyPoints }: PenaltyDisplayProps) {
  const fullPoints = Math.floor(penaltyPoints);
  const hasHalfPoint = penaltyPoints % 1 === 0.5;

  return (
    <div className="lives-display">
      {/* Full penalty point icons */}
      {[...Array(fullPoints)].map((_, i) => (
        <img
          key={`full-${i}`}
          src={missedEggIcon}
          alt="Penalty point"
          className="life-icon"
        />
      ))}
      {/* Half penalty point icon (blinking) */}
      {hasHalfPoint && (
        <img
          src={missedEggIcon}
          alt="Half penalty point"
          className="life-icon life-icon-blinking"
        />
      )}
    </div>
  );
}
