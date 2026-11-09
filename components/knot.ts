type Vec = [number, number, number];
const TAU = Math.PI * 2;
const rings = 188;
const strands = 34;
function normalize(v: Vec): Vec {
  const length = Math.hypot(...v);
  return [v[0] / length, v[1] / length, v[2] / length];
}
function cross(a: Vec, b: Vec): Vec {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function curve(t: number): Vec {
  const radius = 1.19 + 0.48 * Math.cos(3 * t);
  return [
    radius * Math.cos(2 * t),
    radius * Math.sin(2 * t),
    0.83 * Math.sin(3 * t),
  ];
}
const vertices = Array.from({ length: rings }, (_, i) => {
  const t = (TAU * i) / rings,
    p = curve(t),
    q = curve(t + 0.0001);
  const tangent = normalize([q[0] - p[0], q[1] - p[1], q[2] - p[2]]);
  const normal = normalize(cross(tangent, [0, 0, 1])),
    binormal = cross(tangent, normal);
  return Array.from({ length: strands }, (_, j) => {
    const a = (TAU * j) / strands;
    return p.map(
      (x, k) =>
        x + 0.34 * (Math.cos(a) * normal[k] + Math.sin(a) * binormal[k]),
    ) as Vec;
  });
});
export function projectKnot(yaw: number, pitch: number) {
  const sy = Math.sin(yaw),
    cy = Math.cos(yaw),
    sx = Math.sin(pitch),
    cx = Math.cos(pitch);
  const mesh = vertices.map((row) =>
    row.map(([x, y, z]) => {
      const u = x * cy + z * sy,
        v = z * cy - x * sy,
        w = y * cx - v * sx,
        depth = y * sx + v * cx;
      const scale = 91 * (1 + depth * 0.058);
      return [250 + scale * u, 204 - scale * w, depth];
    }),
  );
  const faces = mesh.flatMap((row, i) =>
    row.map((p, j) => {
      const next = mesh[(i + 1) % rings],
        k = (j + 1) % strands;
      const points = [p, next[j], next[k], row[k]];
      const light = Math.max(0, Math.min(1, (p[2] + 1.5) / 3));
      const stroke =
        "rgb(" +
        Math.round(60 + 148 * light) +
        "," +
        Math.round(108 + 147 * light) +
        "," +
        Math.round(36 + 78 * light) +
        ")";
      return {
        points,
        stroke,
        z: points.reduce((total, v) => total + v[2], 0),
      };
    }),
  );
  return faces.sort((a, b) => a.z - b.z);
}
