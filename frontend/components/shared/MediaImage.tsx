// Renders an image URL of any format: sources the Next optimizer can handle
// (jpg/png/webp/avif) go through next/image, everything else (svg, gif, bmp,
// tiff, ico, heic…) falls back to a plain <img> because the optimizer 400s on
// formats it cannot re-encode. Drop-in for <Image> with the same props.
import Image from "next/image";
import { isOptimizableImage } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Position the element absolutely inside a relative parent (matches next/image). */
  fill?: boolean;
  sizes?: string;
  className?: string;
  /** Load eagerly instead of lazily (hero/above-the-fold media). */
  priority?: boolean;
  /** Element ref (parallax/measurement effects); React 19 passes it as a prop. */
  ref?: React.Ref<HTMLImageElement>;
};

export default function MediaImage({ src, alt, fill, sizes, className, priority, ref }: Props) {
  if (!src) return null;

  if (isOptimizableImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={className}
        priority={priority}
        ref={ref}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={`${fill ? "absolute inset-0 h-full w-full" : ""} ${className ?? ""}`.trim()}
    />
  );
}
