import type { CatchPosition, MissSide } from '../types/game';

// Import catcher sprites
import catcherBottomLeft from '../assets/characters/professor-catch-bottom-left.svg';
import catcherTopLeft from '../assets/characters/professor-catch-top-left.svg';
import catcherTopRight from '../assets/characters/professor-catch-top-right.svg';
import catcherBottomRight from '../assets/characters/professor-catch-bottom-right.svg';
import catcherFailLeft from '../assets/characters/fail-bottom-left.svg';
import catcherFailRight from '../assets/characters/fail-bottom-right.svg';

// All sprites with their CSS class and visibility key
const NORMAL_FRAMES: { key: CatchPosition; src: string; className: string }[] = [
  { key: 'bottom-left',  src: catcherBottomLeft,  className: 'catcher catcher-bottom-left' },
  { key: 'top-left',     src: catcherTopLeft,     className: 'catcher catcher-top-left' },
  { key: 'top-right',    src: catcherTopRight,     className: 'catcher catcher-top-right' },
  { key: 'bottom-right', src: catcherBottomRight,  className: 'catcher catcher-bottom-right' },
];

const FAIL_FRAMES: { key: 'left' | 'right'; src: string; className: string }[] = [
  { key: 'left',  src: catcherFailLeft,  className: 'catcher catcher-fail-left' },
  { key: 'right', src: catcherFailRight, className: 'catcher catcher-fail-right' },
];

interface CatcherProps {
  position: CatchPosition;
  failSide: MissSide;
}

/**
 * Catcher character that catches falling eggs.
 * Pre-renders all sprites and toggles visibility to avoid flicker on position change.
 */
export function Catcher({ position, failSide }: CatcherProps) {
  return (
    <>
      {NORMAL_FRAMES.map(({ key, src, className }) => (
        <img
          key={key}
          src={src}
          alt={`Catcher at ${key}`}
          className={className}
          style={{ visibility: !failSide && position === key ? 'visible' : 'hidden' }}
        />
      ))}
      {FAIL_FRAMES.map(({ key, src, className }) => (
        <img
          key={`fail-${key}`}
          src={src}
          alt={`Catcher fail ${key}`}
          className={className}
          style={{ visibility: failSide === key ? 'visible' : 'hidden' }}
        />
      ))}
    </>
  );
}
