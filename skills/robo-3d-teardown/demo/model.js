// One deterministic mechanism model shared by motion, display and QA.
// Dimensions are educational example values (mm), NOT measurements of a product.
export const DIMENSIONS = Object.freeze({
  crankRadiusMm: 18,
  connectingRodMm: 57,
  pistonDiameterMm: 28,
  scaleMmPerUnit: 10,
  originY: -2.0
});

export const clamp = (n,a,b) => Math.min(b, Math.max(a,n));

export function pose(angle) {
  if (!Number.isFinite(angle)) throw new RangeError('Angle must be finite');
  const {crankRadiusMm:rmm, connectingRodMm:lmm, scaleMmPerUnit:mm, originY:oy} = DIMENSIONS;
  const r = rmm/mm, l = lmm/mm;
  const px = r * Math.sin(angle);
  const py = oy + r * Math.cos(angle);
  const y = oy + r*Math.cos(angle) + Math.sqrt(l*l-r*r*Math.sin(angle)**2);
  const dx = -px, dy = y-py;
  const rodLength = Math.hypot(dx,dy);
  const strokeMm = (y-(oy+l-r))*mm;
  const rodTiltDeg = Math.atan2(px, y-py)*180/Math.PI;
  return {angle, crankX:px, crankY:py, sliderY:y, rodLength,
    strokeMm, rodTiltDeg, travelMm:2*rmm, percentage:strokeMm/(2*rmm)*100};
}
