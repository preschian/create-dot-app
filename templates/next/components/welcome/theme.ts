// Color tokens + type roles for the editorial welcome screen.
// Light/dark token sets are oklch so accent + contrast stay coherent in both modes.

export interface Tokens {
  paper: string;
  ink: string;
  dim: string;
  faint: string;
  line: string;
  card: string;
}

export function tokens(dark: boolean): Tokens {
  return dark
    ? {
        paper: "oklch(0.17 0.008 70)",
        ink: "oklch(0.95 0.006 80)",
        dim: "oklch(0.7 0.012 75)",
        faint: "oklch(0.56 0.012 75)",
        line: "oklch(0.3 0.01 70)",
        card: "oklch(0.205 0.008 70)",
      }
    : {
        paper: "oklch(0.972 0.006 80)",
        ink: "oklch(0.22 0.012 60)",
        dim: "oklch(0.45 0.012 60)",
        faint: "oklch(0.6 0.01 60)",
        line: "oklch(0.88 0.008 70)",
        card: "oklch(0.995 0.004 80)",
      };
}

// Curated accent swatches: vermilion, electric blue, green, violet, amber.
export const ACCENTS = ["#D9542B", "#2F6BFF", "#18A058", "#7A5AE0", "#E0A92F"];
export const DEFAULT_ACCENT = ACCENTS[0];

// Type roles. Font families are wired to next/font CSS variables in app/layout.tsx.
export const FONT = {
  disp: "var(--font-grotesk), 'Space Grotesk', sans-serif",
  body: "var(--font-grotesk), 'Space Grotesk', sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
} as const;
