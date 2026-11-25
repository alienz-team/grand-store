/**
 * Unsplash's CDN (imgix) resizes and re-encodes on the fly, so we request the
 * width each slot needs instead of running an image optimizer in the Worker.
 * Other hosts are passed through unchanged.
 */
const WIDTHS = [320, 480, 640, 960, 1280];

function isResizable(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "images.unsplash.com" || host === "plus.unsplash.com";
  } catch {
    return false;
  }
}

export function sizedImage(url: string, width: number, quality = 75): string {
  if (!isResizable(url)) return url;
  const u = new URL(url);
  u.searchParams.set("w", String(width));
  u.searchParams.set("q", String(quality));
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", "crop");
  return u.toString();
}

export function imageSrcSet(url: string, maxWidth = 1280): string | undefined {
  if (!isResizable(url)) return undefined;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${sizedImage(url, w)} ${w}w`)
    .join(", ");
}
