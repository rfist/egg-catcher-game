import type { CatchPosition } from '../types/game';

export type Point = { x: number; y: number }; // 0–100, percentage of container

// Set to true to show the colored zone overlay for adjustment/debugging
export const DEBUG_CLICK_ZONES = false;

// ── EDIT THESE to reshape the click zones ───────────────────────────────────
// Each zone is a quadrilateral defined by 4 corner points.
// tl = top-left, tr = top-right, br = bottom-right, bl = bottom-left.
// All values are percentages of the game container (0 = left/top, 100 = right/bottom).
export const CLICK_ZONES: Record<CatchPosition, { tl: Point; tr: Point; br: Point; bl: Point }> = {
  'top-left':     { tl: { x:  0, y:  0 }, tr: { x: 50, y:  0 }, br: { x: 50, y: 70 }, bl: { x:  0, y: 30 } },
  'top-right':    { tl: { x: 50, y:  0 }, tr: { x:100, y:  0 }, br: { x:100, y: 30 }, bl: { x: 50, y: 70 } },
  'bottom-left':  { tl: { x:  0, y: 30 }, tr: { x: 50, y: 70 }, br: { x: 50, y:100 }, bl: { x:  0, y:100 } },
  'bottom-right': { tl: { x: 50, y: 70 }, tr: { x:100, y: 30 }, br: { x:100, y:100 }, bl: { x: 50, y:100 } },
};
// ────────────────────────────────────────────────────────────────────────────

const ZONE_COLORS: Record<CatchPosition, string> = {
  'top-left':     'rgba(220, 60,  60,  0.4)',
  'top-right':    'rgba(60,  180, 60,  0.4)',
  'bottom-left':  'rgba(60,  100, 220, 0.4)',
  'bottom-right': 'rgba(200, 160, 0,   0.4)',
};

function toSvgPoints({ tl, tr, br, bl }: { tl: Point; tr: Point; br: Point; bl: Point }): string {
  return [tl, tr, br, bl].map(p => `${p.x},${p.y}`).join(' ');
}

function centroid({ tl, tr, br, bl }: { tl: Point; tr: Point; br: Point; bl: Point }): Point {
  return {
    x: (tl.x + tr.x + br.x + bl.x) / 4,
    y: (tl.y + tr.y + br.y + bl.y) / 4,
  };
}

/**
 * Debug overlay: shows the four click zones as colored quadrilaterals.
 * Remove <ClickZoneOverlay /> from GameScene once zones are finalized.
 */
export function ClickZoneOverlay() {
  if (!DEBUG_CLICK_ZONES) return null;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 500,
        pointerEvents: 'none',
      }}
    >
      {(Object.keys(CLICK_ZONES) as CatchPosition[]).map(position => {
        const zone = CLICK_ZONES[position];
        const c = centroid(zone);
        return (
          <g key={position}>
            <polygon
              points={toSvgPoints(zone)}
              fill={ZONE_COLORS[position]}
              stroke="rgba(0,0,0,0.7)"
              strokeWidth="0.5"
              strokeDasharray="2 1"
            />
            <text
              x={c.x}
              y={c.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5"
              fill="white"
              stroke="rgba(0,0,0,0.9)"
              strokeWidth="0.4"
              paintOrder="stroke"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {position}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
