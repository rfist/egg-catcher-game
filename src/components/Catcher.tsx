import type { CatchPosition, MissSide } from '../types/game';

// Import catcher sprites
import catcherBottomLeft from '../assets/characters/professor-catch-bottom-left.svg';
import catcherTopLeft from '../assets/characters/professor-catch-top-left.svg';
import catcherTopRight from '../assets/characters/professor-catch-top-right.svg';
import catcherBottomRight from '../assets/characters/professor-catch-bottom-right.svg';
import catcherFailLeft from '../assets/characters/fail-bottom-left.svg';
import catcherFailRight from '../assets/characters/fail-bottom-right.svg';

const CATCHER_FRAMES: Record<CatchPosition, string> = {
  'bottom-left': catcherBottomLeft,
  'top-left': catcherTopLeft,
  'top-right': catcherTopRight,
  'bottom-right': catcherBottomRight,
};

interface CatcherProps {
  position: CatchPosition;
  failSide: MissSide;
}

/**
 * Catcher character that catches falling eggs.
 * Shows fail pose during miss animation.
 */
export function Catcher({ position, failSide }: CatcherProps) {
  const src = failSide === 'left'
    ? catcherFailLeft
    : failSide === 'right'
      ? catcherFailRight
      : CATCHER_FRAMES[position];

  const className = failSide
    ? `catcher catcher-fail-${failSide}`
    : `catcher catcher-${position}`;

  return (
    <img
      src={src}
      alt={failSide ? `Catcher fail ${failSide}` : `Catcher at ${position}`}
      className={className}
    />
  );
}
