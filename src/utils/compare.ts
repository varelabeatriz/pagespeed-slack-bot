import { DiffResult, Snapshot, Thresholds } from '../types';

export function diffSnapshots(
  previous: Snapshot | undefined,
  current: Snapshot,
  thresholds: Thresholds
): DiffResult {
  if (!previous) {
    return {
      changed: true,
      reasons: ['Primeira coleta registrada para esta URL e estratégia.']
    };
  }

  const reasons: string[] = [];

  const performanceDelta = calculateDelta(previous.scores.performance, current.scores.performance);
  const lcpDelta = calculateDelta(previous.metrics.lcp, current.metrics.lcp);
  const clsDelta = calculateDelta(previous.metrics.cls, current.metrics.cls);
  const inpDelta = calculateDelta(previous.metrics.inp, current.metrics.inp);
  const ttfbDelta = calculateDelta(previous.metrics.ttfb, current.metrics.ttfb);

  if (performanceDelta != null && Math.abs(performanceDelta) >= thresholds.performance) {
    reasons.push(`Performance ${describeDirection(performanceDelta, 'subiu', 'caiu')} ${Math.abs(performanceDelta)} pontos.`);
  }

  if (lcpDelta != null && Math.abs(lcpDelta) >= thresholds.lcpMs) {
    reasons.push(`LCP ${describeDirection(lcpDelta, 'melhorou', 'piorou')} ${Math.abs(Math.round(lcpDelta))} ms.`);
  }

  if (clsDelta != null && Math.abs(clsDelta) >= thresholds.cls) {
    reasons.push(`CLS ${describeDirection(clsDelta, 'melhorou', 'piorou')} ${Math.abs(clsDelta).toFixed(3)}.`);
  }

  if (inpDelta != null && Math.abs(inpDelta) >= thresholds.inpMs) {
    reasons.push(`INP ${describeDirection(inpDelta, 'melhorou', 'piorou')} ${Math.abs(Math.round(inpDelta))} ms.`);
  }

  if (ttfbDelta != null && Math.abs(ttfbDelta) >= thresholds.ttfbMs) {
    reasons.push(`TTFB ${describeDirection(ttfbDelta, 'melhorou', 'piorou')} ${Math.abs(Math.round(ttfbDelta))} ms.`);
  }

  return {
    changed: reasons.length > 0,
    reasons
  };
}

function calculateDelta(previous: number | null, current: number | null): number | null {
  if (previous == null || current == null) {
    return null;
  }

  return current - previous;
}

function describeDirection(delta: number, positiveLabel: string, negativeLabel: string): string {
  return delta > 0 ? positiveLabel : negativeLabel;
}
