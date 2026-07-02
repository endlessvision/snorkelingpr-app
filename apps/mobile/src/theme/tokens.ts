// Ported 1:1 from design-reference/05-design-tokens.md — don't eyeball new values here.

export const color = {
  surfTurquoise: "#16C0D8",
  deepSea: "#0A4F70",
  reefMagenta: "#FF2E93",
  sunshine: "#FFD23F",
  seaFoam: "#7FE6EF",
  sandCream: "#FFF6E6",
  coinGold: "#F4C93D",
  coinRim: "#C9962A",
} as const;

// Direction A — "Sunlight" (default, bright)
export const themeA = {
  bg: "#F3FBFC",
  surface: "#FFFFFF",
  primary: "#16C0D8",
  ctaFrom: "#FF5BB0",
  ctaTo: "#FF2E93",
  text: "#0A4F70",
  textMuted: "#6B8694",
} as const;

// Direction B — "Deep Blue" (premium, optional — not the default)
export const themeB = {
  bg: "#03182A",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(150,240,240,0.18)",
  primary: "#38E1D6",
  accent: "#FF3D8B",
  ctaFrom: "#5CF0E6",
  ctaTo: "#1BB6C9",
  text: "#EEF6F7",
  textMuted: "rgba(180,220,225,0.6)",
} as const;

export const theme = themeA;

/** Dive ocean gradient, top -> bottom (the pannable 1120x4200 world). */
export const diveOceanGradient = {
  colors: [
    "#c2f0f5",
    "#67dbe8",
    "#22c2d8",
    "#0ea3c6",
    "#0a83ac",
    "#0a6389",
    "#084a6c",
    "#063a54",
    "#04283c",
    "#02141f",
  ] as string[],
  locations: [0, 0.08, 0.2, 0.33, 0.46, 0.6, 0.72, 0.82, 0.91, 1] as number[],
};

/** Home screen (phone) gradient. */
export const homeGradient = {
  colors: ["#bdf1f6", "#5fd9e6", "#16c0d8", "#0a8fb6", "#0a5c84", "#073a5c"] as string[],
  locations: [0, 0.14, 0.36, 0.58, 0.78, 1] as number[],
};

/** Gear colors — masks/fins/suits/flags. */
export const gearColor = {
  mask: { explorer: "#16c0d8", fortune: "#f4c93d", voyager: "#ff2e93" },
  fins: { aqua: "#19c6cf", coral: "#ff5bb0", sunray: "#ffd23f" },
  suit: { reef: "#2f7bff", kelp: "#2fa86a", coralpink: "#ff7a9c" },
  flag: { diver: "#e2402f", alpha: "#2f7bff" },
} as const;

export const radius = { sm: 8, md: 14, lg: 18, card: 22, phone: 46, pill: 100 } as const;

/** 8-pt grid. Screen padding ~22-24, grid gaps 10-14. Touch targets >= 44px. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  gap: 12,
  lg: 16,
  xl: 22,
  screen: 24,
} as const;

export const minTouchTarget = 44;

/** Type scale (px). Display weight ~600; labels 700-800. */
export const typeScale = {
  display: 28,
  heroBig: 62,
  subtitle: 20,
  body: 14,
  label: 11,
} as const;

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const shadow: Record<"card" | "ctaPink" | "tabBar" | "glowCyan", ShadowStyle> = {
  // 0 14px 30px -14px rgba(3,40,60,.5)
  card: {
    shadowColor: "#03283C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  // 0 8px 18px -6px rgba(255,46,147,.5)
  ctaPink: {
    shadowColor: "#FF2E93",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  // 0 12px 30px -8px rgba(3,40,60,.45)
  tabBar: {
    shadowColor: "#03283C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 10,
  },
  // 0 0 22px rgba(56,225,214,.6) — Direction B glow, unused by default theme
  glowCyan: {
    shadowColor: "#38E1D6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 22,
    elevation: 10,
  },
};

/** Base easing curve — "everything feels like water." Use with Easing.bezier in reanimated. */
export const tideEasing = { x1: 0.22, y1: 1, x2: 0.36, y2: 1 } as const;

/** Named animation loop durations (ms), ported from the prototype's @keyframes. */
export const motion = {
  bobFloat: 5000,
  swayFloat: 8000,
  bubbleRise: 5500,
  shimmer: 6500,
  dvSwim: 11000,
  dvGlide: 12000,
  dvPop: 700,
  splashSequence: 2800,
  homeReveal: 600,
  sheetOpen: 320,
} as const;
