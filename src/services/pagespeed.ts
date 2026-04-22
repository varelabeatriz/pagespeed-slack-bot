import { config } from '../config';
import { Snapshot, Strategy } from '../types';

export async function getPageSpeedSnapshot(url: string, strategy: Strategy): Promise<Snapshot> {
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('strategy', strategy);
  endpoint.searchParams.append('category', 'performance');
  endpoint.searchParams.append('category', 'accessibility');
  endpoint.searchParams.append('category', 'best-practices');
  endpoint.searchParams.append('category', 'seo');
  endpoint.searchParams.set('key', config.psiApiKey);

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    throw new Error(`PageSpeed request failed with ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const categories = data?.lighthouseResult?.categories ?? {};
  const audits = data?.lighthouseResult?.audits ?? {};

  return {
    url,
    strategy,
    timestamp: new Date().toISOString(),
    scores: {
      performance: categories.performance?.score != null ? Math.round(categories.performance.score * 100) : null,
      accessibility: categories.accessibility?.score != null ? Math.round(categories.accessibility.score * 100) : null,
      bestPractices: categories['best-practices']?.score != null ? Math.round(categories['best-practices'].score * 100) : null,
      seo: categories.seo?.score != null ? Math.round(categories.seo.score * 100) : null
    },
    metrics: {
      lcp: audits['largest-contentful-paint']?.numericValue ?? null,
      cls: audits['cumulative-layout-shift']?.numericValue ?? null,
      inp: audits['interaction-to-next-paint']?.numericValue ?? null,
      ttfb: audits['server-response-time']?.numericValue ?? null
    }
  };
}
