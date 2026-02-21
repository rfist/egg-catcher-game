import { useEffect, useRef } from 'react';
import type { CatchPosition } from '../types/game';

interface UseKeyboardControlsProps {
  onPositionChange: (position: CatchPosition) => void;
  onStartGame: () => void;
  enabled: boolean;
  currentPosition: CatchPosition;
}

/**
 * Hook for handling keyboard input for game controls.
 * Arrow keys: Left/Right switch side, Up/Down switch arm height.
 * Space starts the game.
 */
export function useKeyboardControls({
  onPositionChange,
  onStartGame,
  enabled,
  currentPosition,
}: UseKeyboardControlsProps) {
  // Ref keeps the handler current without re-attaching the listener on every move
  const positionRef = useRef(currentPosition);
  positionRef.current = currentPosition;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [vertical, horizontal] = positionRef.current.split('-') as ['top' | 'bottom', 'left' | 'right'];

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPositionChange(`${vertical}-left`);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onPositionChange(`${vertical}-right`);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onPositionChange(`top-${horizontal}`);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onPositionChange(`bottom-${horizontal}`);
          break;
        case ' ':
          if (enabled) onStartGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPositionChange, onStartGame, enabled]);
}
