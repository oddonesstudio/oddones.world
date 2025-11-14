export function getContrastingColor({ h, s, l }: { h: number; s: number; l: number }) {
  const contrastHue = (h + 180) % 360; // opposite hue
  const contrastLightness = l > 50 ? 20 : 80; // dark bg -> light text, light bg -> dark text
  return `hsl(${contrastHue}, ${s}%, ${contrastLightness}%)`;
}