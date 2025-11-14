/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <TODO: find workaround> */

export interface IconProps {
  svg?: string;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon = ({ svg, size = 20, color = "currentColor", className }: IconProps) => {
  if (!svg) return null;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        color,
        display: "inline-block",
        lineHeight: 0,
        shapeRendering: "crispEdges",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
