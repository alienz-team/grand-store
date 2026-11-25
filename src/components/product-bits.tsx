import { CategoryGlyph } from "./icons";

/** Photo when the product has one; otherwise a dark tile with the category's line glyph. */
export function ProductVisual({
  imageUrl,
  title,
  categorySlug,
  size = "card",
}: {
  imageUrl: string | null;
  title: string;
  categorySlug: string;
  size?: "card" | "hero" | "thumb";
}) {
  const glyph = size === "hero" ? "size-56 md:size-72" : size === "thumb" ? "size-9" : "size-24 md:size-28";
  return (
    <div className="relative size-full overflow-hidden bg-slab-2">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} loading="lazy" className="size-full object-cover" />
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
          <CategoryGlyph slug={categorySlug} className={`relative text-saffron/80 ${glyph}`} />
        </div>
      )}
    </div>
  );
}

export function Badge({ label }: { label: string }) {
  const isSale = /تخفيض|خصم|%/.test(label);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
        isSale ? "bg-signal text-white" : "bg-saffron text-graphite"
      }`}
    >
      <bdi>{label}</bdi>
    </span>
  );
}
