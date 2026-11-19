/*
  An example concert hall in metres, shared by the side section, plan and 3D views.
  x: across (0 = centre line), z: from the back wall of the stage towards the audience, y: up.
  The coverage colours are an illustration of how level falls with distance from the arrays
  (inverse-square law only) — not an acoustic simulation. The page says so next to the view.
*/

export const HALL = {
  width: 26,
  depth: 34,
  height: 13,
  stage: { depth: 9, width: 16, height: 1.2 },
  audience: { x0: -11, x1: 11, z0: 11, z1: 32 },
  rakeStart: 18, // flat floor until here, then the seating rises
  rakeSlope: 0.22,
  arrays: [
    { x: -7.5, z: 8.5, top: 10, boxes: 8 },
    { x: 7.5, z: 8.5, top: 10, boxes: 8 },
  ],
  earHeight: 1.2,
};

export function floorAt(z: number) {
  return z <= HALL.rakeStart ? 0 : (z - HALL.rakeStart) * HALL.rakeSlope;
}

/** Relative level in dB at a seat: 0 dB at 10 m from the nearest array, falling 6 dB per doubling. */
export function levelAt(x: number, z: number) {
  const y = floorAt(z) + HALL.earHeight;
  let best = -Infinity;
  for (const a of HALL.arrays) {
    const cy = a.top - a.boxes * 0.35 * 0.6; // acoustic centre of the hang
    const r = Math.hypot(x - a.x, y - cy, z - a.z);
    best = Math.max(best, -20 * Math.log10(r / 10));
  }
  return best;
}

/** Teal (loud) to amber (quieter) to red (too quiet). */
export function levelColor(db: number) {
  const stops: [number, [number, number, number]][] = [
    [3, [20, 184, 166]],
    [0, [52, 211, 153]],
    [-3, [163, 230, 53]],
    [-6, [250, 204, 21]],
    [-9, [251, 146, 60]],
    [-12, [239, 68, 68]],
  ];
  if (db >= stops[0][0]) return `rgb(${stops[0][1].join(",")})`;
  for (let i = 1; i < stops.length; i++) {
    const [d1, c1] = stops[i - 1];
    const [d2, c2] = stops[i];
    if (db >= d2) {
      const f = (d1 - db) / (d1 - d2);
      const c = c1.map((v, k) => Math.round(v + (c2[k] - v) * f));
      return `rgb(${c.join(",")})`;
    }
  }
  return `rgb(${stops[stops.length - 1][1].join(",")})`;
}

/** Audience cells (1 m) with their level, used by the plan and the 3D floor. */
export function audienceCells(step = 1) {
  const cells: { x: number; z: number; db: number }[] = [];
  const { x0, x1, z0, z1 } = HALL.audience;
  for (let z = z0; z < z1; z += step)
    for (let x = x0; x < x1; x += step) {
      if (Math.abs(x + step / 2) < 0.9) continue; // centre aisle
      cells.push({ x: x + step / 2, z: z + step / 2, db: levelAt(x + step / 2, z + step / 2) });
    }
  return cells;
}
