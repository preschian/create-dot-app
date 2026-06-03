// Stats for the landing strip, resolved at build time.
// npm weekly downloads + GitHub stars are fetched when the site is built;
// the other two cells are real facts about the shipped templates/next.

const NPM_PACKAGE = 'create-dot-app';
const GITHUB_REPO = 'preschian/create-dot-app';

export interface Stat {
  n: string;
  label: string;
  meta: string;
}

/** 15 → "15", 1_234 → "1.2k", 128_000 → "128k", 1_500_000 → "1.5m". */
function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

async function npmWeeklyInstalls(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${NPM_PACKAGE}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { downloads?: number };
    return typeof data.downloads === 'number' ? data.downloads : null;
  } catch {
    return null;
  }
}

async function githubStars(): Promise<number | null> {
  try {
    // GitHub's REST API rejects requests without a User-Agent.
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'create-dot-app-docs' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<Stat[]> {
  const [installs, stars] = await Promise.all([npmWeeklyInstalls(), githubStars()]);

  if (installs === null) console.warn('[stats] npm weekly installs unavailable at build time');
  if (stars === null) console.warn('[stats] GitHub stars unavailable at build time');

  return [
    { n: installs === null ? '—' : compact(installs), label: 'weekly installs', meta: 'npm' },
    { n: stars === null ? '—' : compact(stars), label: 'GitHub stars', meta: 'github' },
    { n: '3', label: 'Hub networks', meta: 'passet · dot · ksm' },
    { n: '2', label: 'sample contracts', meta: 'flipper · remark' },
  ];
}
