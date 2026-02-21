import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { CatchPosition } from '../types/game';

interface UsePointerControlsProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onPositionChange: (position: CatchPosition) => void;
  onStartGame: () => void;
  enabled: boolean;
}

function getPosition(clientX: number, clientY: number, rect: DOMRect): CatchPosition {
  const left = (clientX - rect.left) / rect.width < 0.5;
  const top = (clientY - rect.top) / rect.height < 0.5;
  if (left && top) return 'top-left';
  if (left && !top) return 'bottom-left';
  if (!left && top) return 'top-right';
  return 'bottom-right';
}

export function usePointerControls({
  containerRef, onPositionChange, onStartGame, enabled,
}: UsePointerControlsProps) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const pos = getPosition(e.clientX, e.clientY, el.getBoundingClientRect());
      onPositionChange(pos);
      if (enabled) onStartGame();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // suppress scroll/zoom
      const t = e.touches[0];
      const pos = getPosition(t.clientX, t.clientY, el.getBoundingClientRect());
      onPositionChange(pos);
      if (enabled) onStartGame();
    };

    el.addEventListener('click', handleClick);
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      el.removeEventListener('click', handleClick);
      el.removeEventListener('touchstart', handleTouchStart);
    };
  }, [containerRef, onPositionChange, onStartGame, enabled]);
}
