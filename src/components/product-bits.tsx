import { imageSrcSet, sizedImage } from "@/lib/images";
import { CategoryGlyph } from "./icons";

const SIZES = {
  card: "(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw",
  hero: "(min-width: 1024px) 40vw, 92vw",
  thumb: "64px",
} as const;

/**
 * Product photo (responsive, zooms when its `group` parent is hovered).
 * Falls back to the category's line drawing for products added without a photo.
 */
export function ProductVisual({
  imageUrl,
  title,
  categorySlug,
  size = "card",
  priority = false,
}: {
  imageUrl: string | null;
  title: string;
  categorySlug: string;
  size?: keyof typeof SIZES;
  priority?: boolean;
}) {
  const glyph = size === "hero" ? "size-56 md:size-72" : size === "thumb" ? "size-9" : "size-24 md:size-28";
  return (
    <div className="relative size-full overflow-hidden bg-slab-2">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sizedImage(imageUrl, size === "thumb" ? 160 : size === "hero" ? 1280 : 640)}
          srcSet={size === "thumb" ? undefined : imageSrcSet(imageUrl)}
          sizes={SIZES[size]}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      ) : (
        <div className="grid size-full place-items-center" role="img" aria-label={title}>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 60%, rgb(255 182 39 / 0.14), transparent 70%), repeating-linear-gradient(90deg, transparent 0 23px, rgb(255 255 255 / 0.025) 23px 24px)",
            }}
          />
          <CategoryGlyph slug={categorySlug} className={`relative text-gold/80 ${glyph}`} />
        </div>
      )}
    </div>
  );
}

export function Badge({ label }: { label: string }) {
  const isSale = /تخفيض|خصم|%/.test(label);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold shadow-lg shadow-black/30 ${
        isSale ? "bg-signal text-white" : "bg-saffron text-ink"
      }`}
    >
      <bdi>{label}</bdi>
    </span>
  );
}
