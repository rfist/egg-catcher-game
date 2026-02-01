import type { Nest, CatchPosition } from '../types/game';

// Game timing
export const PHASE_DURATION_MS = 1000;
export const MISS_ANIMATION_FRAME_MS = 400;
export const MISS_ANIMATION_FRAMES = 5;
export const WINDOW_CHARACTER_VISIBLE_DURATION_MS = 5000;

// Game rules
export const POINTS_PER_CATCH = 1;
export const MAX_PENALTY_POINTS = 3;
export const WINDOW_CHARACTER_APPEAR_CHANCE = 0.15;

// Audio
export const AUDIO_POOL_SIZE = 8;

// Nest order for iteration
export const NEST_ORDER: Nest[] = ['bottom-left', 'top-left', 'top-right', 'bottom-right'];

// Keyboard mappings
export const KEY_MAPPINGS: Record<string, CatchPosition> = {
  'z': 'bottom-left',
  'a': 'top-left',
  's': 'top-right',
  'x': 'bottom-right',
};
