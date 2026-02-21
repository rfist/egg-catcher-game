import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { CatchPosition } from '../types/game';
import { CLICK_ZONES } from '../components/ClickZoneOverlay';
import type { Point } from '../components/ClickZoneOverlay';

interface UsePointerControlsProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onPositionChange: (position: CatchPosition) => void;
  onStartGame: () => void;
  enabled: boolean;
}

function pointInPolygon(px: number, py: number, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function getPosition(clientX: number, clientY: number, rect: DOMRect): CatchPosition {
  const px = (clientX - rect.left) / rect.width * 100;
  const py = (clientY - rect.top) / rect.height * 100;

  for (const position of Object.keys(CLICK_ZONES) as CatchPosition[]) {
    const { tl, tr, br, bl } = CLICK_ZONES[position];
    if (pointInPolygon(px, py, [tl, tr, br, bl])) {
      return position;
    }
  }

  // Fallback: simple quadrant (should only trigger on exact zone borders)
  const left = px < 50;
  const top = py < 50;
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
