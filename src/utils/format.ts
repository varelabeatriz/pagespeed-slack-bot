import { Snapshot } from '../types';

function formatValue(value: number | null, suffix = ''): string {
  if (value == null) return '-';
  return `${Math.round(value)}${suffix}`;
}

function formatCollectedAt(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatSnapshotAlert(snapshot: Snapshot, reasons: string[]): string {
  return [
    ':rotating_light: *Alerta de mudanca no PageSpeed*',
    `*URL:* ${snapshot.url}`,
    `*Estrategia:* ${snapshot.strategy}`,
    `*Coletado em:* ${formatCollectedAt(snapshot.timestamp)}`,
    '',
    '*Scores*',
    `- Performance: ${snapshot.scores.performance ?? '-'}`,
    `- Accessibility: ${snapshot.scores.accessibility ?? '-'}`,
    `- Best Practices: ${snapshot.scores.bestPractices ?? '-'}`,
    `- SEO: ${snapshot.scores.seo ?? '-'}`,
    '',
    '*Metricas*',
    `- LCP: ${formatValue(snapshot.metrics.lcp, ' ms')}`,
    `- CLS: ${snapshot.metrics.cls ?? '-'}`,
    `- INP: ${formatValue(snapshot.metrics.inp, ' ms')}`,
    `- TTFB: ${formatValue(snapshot.metrics.ttfb, ' ms')}`,
    '',
    '*Mudancas detectadas*',
    ...reasons.map((reason) => `- ${reason}`)
  ].join('\n');
}

export function formatErrorAlert(url: string, strategy: string, errorMessage: string): string {
  return [
    ':x: *Erro ao monitorar PageSpeed*',
    `*URL:* ${url}`,
    `*Estrategia:* ${strategy}`,
    `*Erro:* ${errorMessage}`
  ].join('\n');
}
