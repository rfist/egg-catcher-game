import { useEffect } from 'react';
import type { CatchPosition } from '../types/game';
import { KEY_MAPPINGS } from '../constants/gameConfig';

interface UseKeyboardControlsProps {
  onPositionChange: (position: CatchPosition) => void;
  onStartGame: () => void;
  enabled: boolean;
}

/**
 * Hook for handling keyboard input for game controls.
 */
export function useKeyboardControls({
  onPositionChange,
  onStartGame,
  enabled,
}: UseKeyboardControlsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check position keys
      const position = KEY_MAPPINGS[e.key];
      if (position) {
        onPositionChange(position);
        return;
      }

      // Space to start game
      if (e.key === ' ' && enabled) {
        onStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPositionChange, onStartGame, enabled]);
}
