import { useCallback, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const FALLBACK_COLOR = "hsl(220 10% 13%)";
const MAX_CACHED_COLORS = 300;
const colorCache = new Map();
const colorExtractor = new FastAverageColor();

function toMutedDarkColor([red = 0, green = 0, blue = 0]) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta > 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case r: hue = ((g - b) / delta) % 6; break;
      case g: hue = (b - r) / delta + 2; break;
      default: hue = (r - g) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }

  const mutedSaturation = Math.min(42, Math.max(12, Math.round(saturation * 42)));
  return `hsl(${hue} ${mutedSaturation}% 14%)`;
}

function getCachedAmbientColor(imageUrl) {
  if (colorCache.has(imageUrl)) {
    const cached = colorCache.get(imageUrl);
    colorCache.delete(imageUrl);
    colorCache.set(imageUrl, cached);
    return cached;
  }

  const colorPromise = colorExtractor
    .getColorAsync(imageUrl, {
      algorithm: "dominant",
      crossOrigin: "anonymous",
      silent: true,
    })
    .then(({ value }) => toMutedDarkColor(value || []))
    .catch(() => FALLBACK_COLOR);

  colorCache.set(imageUrl, colorPromise);
  if (colorCache.size > MAX_CACHED_COLORS) {
    colorCache.delete(colorCache.keys().next().value);
  }
  return colorPromise;
}

export default function useAmbientCardColor(imageUrl) {
  const [resolvedColor, setResolvedColor] = useState(null);
  const ambientColor = resolvedColor && resolvedColor.imageUrl === imageUrl
    ? resolvedColor.color
    : FALLBACK_COLOR;

  const loadAmbientColor = useCallback(() => {
    if (!imageUrl) return;
    getCachedAmbientColor(imageUrl).then((color) => {
      setResolvedColor((current) => (
        current?.imageUrl === imageUrl && current.color === color
          ? current
          : { imageUrl, color }
      ));
    });
  }, [imageUrl]);

  return { ambientColor, loadAmbientColor };
}
