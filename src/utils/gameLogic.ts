import type { Nest, ActiveEggs, CatchPosition, SoundKey } from '../types/game';
import { NEST_ORDER } from '../constants/gameConfig';

// Nest to rolling sound mapping
const NEST_ROLLING_SOUND: Record<Nest, SoundKey> = {
  'top-left': 'lu',
  'bottom-left': 'ld',
  'top-right': 'ru',
  'bottom-right': 'rd',
};

/**
 * Calculate max eggs allowed on screen based on consecutive catches.
 * Difficulty increases as player catches more eggs in a row.
 */
export function getMaxEggsOnScreen(consecutiveCatches: number): number {
  if (consecutiveCatches >= 70) return 4;
  if (consecutiveCatches >= 10) return 3;
  if (consecutiveCatches >= 5) return 2;
  return 1;
}

/**
 * Count total active eggs across all nests.
 */
export function getTotalActiveEggs(eggs: ActiveEggs): number {
  return NEST_ORDER.reduce((total, nest) => total + eggs[nest].length, 0);
}

/**
 * Get nests available for spawning new eggs.
 * A nest is available if empty OR all its eggs have frame >= 2 (2-frame gap rule).
 */
export function getAvailableNests(eggs: ActiveEggs): Nest[] {
  return NEST_ORDER.filter(nest => {
    const nestEggs = eggs[nest];
    if (nestEggs.length === 0) return true;
    return !nestEggs.some(egg => egg.frame < 2);
  });
}

/**
 * Get a random nest from available nests for spawning.
 */
export function getRandomAvailableNest(eggs: ActiveEggs): Nest | null {
  const available = getAvailableNests(eggs);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Determine which side of the screen a nest is on.
 */
export function getNestSide(nest: Nest): 'left' | 'right' {
  return nest.includes('left') ? 'left' : 'right';
}

/**
 * Create empty ActiveEggs structure.
 */
export function createEmptyActiveEggs(): ActiveEggs {
  return {
    'top-left': [],
    'bottom-left': [],
    'top-right': [],
    'bottom-right': [],
  };
}

export interface GameTickResult {
  newActiveEggs: ActiveEggs;
  caughtCount: number;
  missedCount: number;
  lastMissedSide: 'left' | 'right' | null;
  nextEggId: number;
  sounds: SoundKey[];
}

/**
 * Calculates the state of the game for the next tick.
 * Handles egg movement, collision detection (catch/miss), and spawning.
 */
export function calculateNextGameState(
  currentEggs: ActiveEggs,
  catcherPosition: CatchPosition,
  consecutiveCatches: number,
  currentEggId: number
): GameTickResult {
  const newActiveEggs: ActiveEggs = createEmptyActiveEggs();
  let caughtCount = 0;
  let missedCount = 0;
  let lastMissedSide: 'left' | 'right' | null = null;
  const sounds: SoundKey[] = [];
  let nextEggId = currentEggId;

  // Process each nest
  for (const nest of NEST_ORDER) {
    for (const egg of currentEggs[nest]) {
      if (egg.frame >= 4) {
        // Egg reached catch position
        if (catcherPosition === nest) {
          caughtCount++;
        } else {
          missedCount++;
          lastMissedSide = getNestSide(nest);
        }
      } else {
        // Advance egg to next frame
        newActiveEggs[nest].push({ id: egg.id, frame: egg.frame + 1 });
        sounds.push(NEST_ROLLING_SOUND[nest]);
      }
    }
  }

  // Update consecutive catches logic locally to determine spawn rate
  let simulatedConsecutive = consecutiveCatches;
  if (missedCount > 0) {
    simulatedConsecutive = 0;
  } else if (caughtCount > 0) {
    simulatedConsecutive += caughtCount;
  }

  // Spawn new egg if below max
  const maxEggs = getMaxEggsOnScreen(simulatedConsecutive);
  const totalEggs = getTotalActiveEggs(newActiveEggs);

  if (totalEggs < maxEggs) {
    const availableNest = getRandomAvailableNest(newActiveEggs);
    if (availableNest) {
      newActiveEggs[availableNest].push({ id: nextEggId++, frame: 0 });
    }
  }

  return {
    newActiveEggs,
    caughtCount,
    missedCount,
    lastMissedSide,
    nextEggId,
    sounds,
  };
}
