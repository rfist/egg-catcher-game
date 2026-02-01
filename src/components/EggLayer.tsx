import type { Nest, ActiveEggs } from '../types/game';
import { NEST_ORDER } from '../constants/gameConfig';

// Import egg sprites for each nest
import egg01 from '../assets/eggs/egg-01.svg';
import egg02 from '../assets/eggs/egg-02.svg';
import egg03 from '../assets/eggs/egg-03.svg';
import egg04 from '../assets/eggs/egg-04.svg';
import egg05 from '../assets/eggs/egg-05.svg';
import egg06 from '../assets/eggs/egg-06.svg';
import egg07 from '../assets/eggs/egg-07.svg';
import egg08 from '../assets/eggs/egg-08.svg';
import egg09 from '../assets/eggs/egg-09.svg';
import egg10 from '../assets/eggs/egg-10.svg';
import egg11 from '../assets/eggs/egg-11.svg';
import egg12 from '../assets/eggs/egg-12.svg';
import egg13 from '../assets/eggs/egg-13.svg';
import egg14 from '../assets/eggs/egg-14.svg';
import egg15 from '../assets/eggs/egg-15.svg';
import egg16 from '../assets/eggs/egg-16.svg';
import egg17 from '../assets/eggs/egg-17.svg';
import egg18 from '../assets/eggs/egg-18.svg';
import egg19 from '../assets/eggs/egg-19.svg';
import egg20 from '../assets/eggs/egg-20.svg';

// Egg frames per nest (5 frames each)
const NEST_EGG_FRAMES: Record<Nest, string[]> = {
  'top-left': [egg01, egg02, egg03, egg04, egg05],
  'bottom-left': [egg06, egg07, egg08, egg09, egg10],
  'top-right': [egg11, egg12, egg13, egg14, egg15],
  'bottom-right': [egg16, egg17, egg18, egg19, egg20],
};

// CSS class prefix per nest
const NEST_CSS_PREFIX: Record<Nest, string> = {
  'top-left': 'left-falling-egg',
  'bottom-left': 'bottom-left-egg',
  'top-right': 'right-falling-egg',
  'bottom-right': 'bottom-right-egg',
};

interface EggLayerProps {
  activeEggs: ActiveEggs;
  hidden: boolean;
}

/**
 * Renders all egg sprites with visibility based on active eggs.
 * Pre-renders all frames and toggles visibility for performance.
 */
export function EggLayer({ activeEggs, hidden }: EggLayerProps) {
  return (
    <>
      {NEST_ORDER.map(nest => {
        const eggs = activeEggs[nest];
        const frames = NEST_EGG_FRAMES[nest];
        const cssPrefix = NEST_CSS_PREFIX[nest];

        // Determine which frames should be visible
        const visibleFrames = hidden
          ? new Set<number>()
          : new Set(eggs.map(egg => egg.frame));

        return frames.map((frameSrc, frameIndex) => (
          <img
            key={`${nest}-frame-${frameIndex}`}
            src={frameSrc}
            alt={`${nest} egg frame ${frameIndex}`}
            className={`${cssPrefix} ${cssPrefix}-${frameIndex}`}
            style={{ visibility: visibleFrames.has(frameIndex) ? 'visible' : 'hidden' }}
          />
        ));
      })}
    </>
  );
}
