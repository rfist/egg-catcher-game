// Catcher sprites
import catcherBottomLeft from '../assets/characters/professor-catch-bottom-left.svg';
import catcherTopLeft from '../assets/characters/professor-catch-top-left.svg';
import catcherTopRight from '../assets/characters/professor-catch-top-right.svg';
import catcherBottomRight from '../assets/characters/professor-catch-bottom-right.svg';
import catcherFailLeft from '../assets/characters/fail-bottom-left.svg';
import catcherFailRight from '../assets/characters/fail-bottom-right.svg';

// Miss animation sprites
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

// Other assets
import timoshenko from '../assets/characters/timoshenko.svg';
import missedEggIcon from '../assets/ui/missed-egg-icon.svg';

const ASSETS_TO_PRELOAD = [
  // Catcher
  catcherBottomLeft,
  catcherTopLeft,
  catcherTopRight,
  catcherBottomRight,
  catcherFailLeft,
  catcherFailRight,
  // Miss animation
  leftRunning0,
  leftRunning1,
  leftRunning2,
  leftRunning3,
  leftRunning4,
  rightRunning0,
  rightRunning1,
  rightRunning2,
  rightRunning3,
  rightRunning4,
  // Other
  timoshenko,
  missedEggIcon,
];

export function AssetPreloader() {
  return (
    <div style={{ display: 'none', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      {ASSETS_TO_PRELOAD.map((src, index) => (
        <img key={index} src={src} alt="" />
      ))}
    </div>
  );
}
