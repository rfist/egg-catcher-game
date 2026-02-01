import type { MissSide } from '../types/game';

// Import miss animation frames
import leftRunning0 from '../assets/chickens/left-running-chicken-0.svg';
import leftRunning1 from '../assets/chickens/left-running-chicken-1.svg';
import leftRunning2 from '../assets/chickens/left-running-chicken-2.svg';
import leftRunning3 from '../assets/chickens/left-running-chicken-3.svg';
import leftRunning4 from '../assets/chickens/left-running-chicken-4.svg';
import rightRunning0 from '../assets/chickens/right-running-chicken-0.svg';
import rightRunning1 from '../assets/chickens/right-running-chicken-1.svg';
import rightRunning2 from '../assets/chickens/right-running-chicken-2.svg';
import rightRunning3 from '../assets/chickens/right-running-chicken-3.svg';
import rightRunning4 from '../assets/chickens/right-running-chicken-4.svg';

const LEFT_FRAMES = [leftRunning0, leftRunning1, leftRunning2, leftRunning3, leftRunning4];
const RIGHT_FRAMES = [rightRunning0, rightRunning1, rightRunning2, rightRunning3, rightRunning4];

interface MissAnimationProps {
  side: MissSide;
  frame: number;
}

/**
 * Miss animation showing broken egg and running away sequence.
 */
export function MissAnimation({ side, frame }: MissAnimationProps) {
  if (!side) return null;

  const frames = side === 'left' ? LEFT_FRAMES : RIGHT_FRAMES;
  const className = `${side}-running-sequence`;

  return (
    <div className={className}>
      {frames.map((frameSrc, i) => (
        <img
          key={i}
          src={frameSrc}
          alt={`${side} running frame ${i}`}
          className={`${side}-running-frame ${side}-running-frame-${i}`}
          style={{ visibility: i === frame ? 'visible' : 'hidden' }}
        />
      ))}
    </div>
  );
}
