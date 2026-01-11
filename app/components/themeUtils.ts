export type HSL = { h: number; s: number; l: number };

type ThemeVars = {
  background: string;
  foreground: string;
  foregroundContrast: string;
};

export const getThemeVars = (color: HSL): ThemeVars => {
  const background = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  const contrastHue = (color.h + 180) % 360;
  const contrastLight = color.l > 60 ? 25 : 85;
  const foreground = `hsl(${contrastHue}, ${color.s}%, ${contrastLight}%)`;
  const foregroundContrast = color.l > 60 ? "#fff" : "#000";

  return { background, foreground, foregroundContrast };
};

export const readThemeVars = (): ThemeVars => {
  const root = document.documentElement;

  return {
    background: root.style.getPropertyValue("--background"),
    foreground: root.style.getPropertyValue("--foreground"),
    foregroundContrast: root.style.getPropertyValue("--foreground-contrast"),
  };
};

export const setThemeVars = (vars: ThemeVars) => {
  const root = document.documentElement;
  root.style.setProperty("--background", vars.background, "important");
  root.style.setProperty("--foreground", vars.foreground, "important");
  root.style.setProperty("--foreground-contrast", vars.foregroundContrast, "important");
};

export const restoreThemeVars = (vars: ThemeVars) => {
  const root = document.documentElement;
  const restore = (name: string, value: string) => {
    if (value) {
      root.style.setProperty(name, value, "important");
      return;
    }
    root.style.removeProperty(name);
  };

  restore("--background", vars.background);
  restore("--foreground", vars.foreground);
  restore("--foreground-contrast", vars.foregroundContrast);
};
