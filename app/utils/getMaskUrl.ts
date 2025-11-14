export function getMaskUrl(svg?: string): string | undefined {
  if (!svg) return;

  const compact = svg.replace(/\n/g, "").replace(/\s\s+/g, " ").replace(/"/g, "'");

  return `url("data:image/svg+xml,${encodeURIComponent(compact)}")`;
}
