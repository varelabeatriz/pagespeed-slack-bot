import dotenv from 'dotenv';
import { Strategy, Thresholds } from './types';

dotenv.config();

function readRequired(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readNumber(name: string, fallback: number): number {
  const value = process.env[name]?.trim();
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number.`);
  }
  return parsed;
}

function readStrategies(): Strategy[] {
  const raw = process.env.STRATEGIES?.trim() || 'mobile,desktop';
  const values = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const strategies = values.filter(
    (item): item is Strategy => item === 'mobile' || item === 'desktop'
  );

  if (strategies.length === 0) {
    throw new Error('STRATEGIES must include at least one valid value: mobile or desktop.');
  }

  return [...new Set(strategies)];
}

function readUrls(): string[] {
  const raw = readRequired('URLS');
  const urls = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (urls.length === 0) {
    throw new Error('URLS must contain at least one URL.');
  }

  return urls;
}

export const config = {
  psiApiKey: readRequired('PSI_API_KEY'),
  slackWebhookUrl: readRequired('SLACK_WEBHOOK_URL'),
  urls: readUrls(),
  strategies: readStrategies(),
  thresholds: {
    performance: readNumber('PERFORMANCE_THRESHOLD', 5),
    lcpMs: readNumber('LCP_THRESHOLD_MS', 300),
    cls: readNumber('CLS_THRESHOLD', 0.05),
    inpMs: readNumber('INP_THRESHOLD_MS', 100),
    ttfbMs: readNumber('TTFB_THRESHOLD_MS', 200)
  } satisfies Thresholds
};
