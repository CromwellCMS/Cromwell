export function getThumbnailSrc({
  src,
  width,
  height,
  quality,
}: {
  src: string;
  width: number;
  height: number;
  quality?: number;
}) {
  if (!src) return src;
  if (src.startsWith('http')) {
    // TODO: Implement
    // External URLs are not yet supported
    return src;
  }

  if (!width || !height) return src;

  let out = `${src}?crw-thumbnail&width=${width}&height=${height}`;
  if (quality) out += `&quality=${quality}`;
  return out;
}
