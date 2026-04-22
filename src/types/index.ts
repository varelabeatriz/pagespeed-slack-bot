export type Strategy = 'mobile' | 'desktop';

export type Snapshot = {
  url: string;
  strategy: Strategy;
  timestamp: string;
  scores: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  metrics: {
    lcp: number | null;
    cls: number | null;
    inp: number | null;
    ttfb: number | null;
  };
};

export type History = Record<string, Snapshot>;

export type DiffResult = {
  changed: boolean;
  reasons: string[];
};

export type Thresholds = {
  performance: number;
  lcpMs: number;
  cls: number;
  inpMs: number;
  ttfbMs: number;
};
