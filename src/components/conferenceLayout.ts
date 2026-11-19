/*
  Room layouts in metres, shared by the 2D, 3D and plan views so they always agree.
  x: across the room (0 = centre), z: distance from the display wall (0 = wall).
*/

export type RoomKind = "huddle" | "meeting" | "large" | "hall";

export type Seat = { x: number; z: number; rot: number }; // rot: radians about y; 0 = facing the display wall, -π/2 = facing +x
export type Layout = {
  roomW: number;
  roomD: number;
  displays: { w: number; h: number; x: number }[]; // screens on the wall
  displayBottom: number;
  displayLabel: string;
  table?: { x: number; z: number; w: number; d: number };
  desk?: { x: number; z: number; w: number; d: number };
  seats: Seat[];
};

const tv = (inch: number) => {
  const w = (inch * 0.0254 * 16) / Math.hypot(16, 9);
  return { w, h: (w * 9) / 16 };
};

function tableRoom(roomW: number, roomD: number, perSide: number, displays: Layout["displays"], label: string, bottom = 0.9): Layout {
  const pitch = 0.7; // chair spacing
  const len = perSide * pitch + 0.3;
  const tw = perSide > 6 ? 1.4 : 1.1;
  const z0 = Math.max(1.6, (roomD - len) / 2 + 0.4);
  const seats: Seat[] = [];
  for (let i = 0; i < perSide; i++) {
    const z = z0 + 0.15 + pitch / 2 + i * pitch;
    seats.push({ x: -(tw / 2 + 0.38), z, rot: -Math.PI / 2 }, { x: tw / 2 + 0.38, z, rot: Math.PI / 2 });
  }
  return {
    roomW,
    roomD,
    displays,
    displayBottom: bottom,
    displayLabel: label,
    table: { x: 0, z: z0 + len / 2, w: tw, d: len },
    seats,
  };
}

export function layoutFor(kind: RoomKind): Layout {
  switch (kind) {
    case "huddle":
      return tableRoom(4, 4.6, 3, [{ ...tv(65), x: 0 }], '65"');
    case "meeting":
      return tableRoom(5, 7.4, 6, [{ ...tv(86), x: 0 }], '86"');
    case "large": {
      const d = tv(86);
      return tableRoom(6.6, 12.2, 12, [{ ...d, x: -1.15 }, { ...d, x: 1.15 }], '2 × 86"');
    }
    case "hall": {
      const seats: Seat[] = [];
      const cols = 12;
      for (let r = 0; r < 4; r++)
        for (let i = 0; i < cols; i++) {
          const x = (i - (cols - 1) / 2) * 0.62 + (i >= cols / 2 ? 0.6 : -0.6);
          seats.push({ x, z: 5.2 + r * 1.1, rot: 0 });
        }
      return {
        roomW: 12,
        roomD: 11,
        displays: [{ w: 5, h: 2.8125, x: 0 }],
        displayBottom: 1.4,
        displayLabel: "LED 5 × 2.8",
        desk: { x: 0, z: 2.6, w: 4.2, d: 0.8 },
        seats,
      };
    }
  }
}
