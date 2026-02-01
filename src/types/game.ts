/** Positions where the catcher can stand to catch eggs */
export type CatchPosition = 'bottom-left' | 'top-left' | 'top-right' | 'bottom-right';

/** Nest positions where eggs originate (same as catch positions) */
export type Nest = CatchPosition;

/** Individual egg with unique ID and current animation frame */
export type Egg = {
  id: number;
  frame: number;
};

/** Active eggs organized by nest */
export type ActiveEggs = Record<Nest, Egg[]>;

/** Side of the screen for miss animation */
export type MissSide = 'left' | 'right' | null;

/** Available sound effects */
export type SoundKey = 'catch' | 'miss' | 'chicken' | 'gameover' | 'lu' | 'ld' | 'ru' | 'rd';