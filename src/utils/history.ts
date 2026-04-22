import fs from 'node:fs/promises';
import path from 'node:path';
import { History, Strategy } from '../types';

const historyFilePath = path.resolve(process.cwd(), 'src/data/history.json');

export function buildHistoryKey(url: string, strategy: Strategy): string {
  return `${strategy}:${url}`;
}

export async function readHistory(): Promise<History> {
  try {
    const raw = await fs.readFile(historyFilePath, 'utf-8');
    return JSON.parse(raw) as History;
  } catch {
    return {};
  }
}

export async function writeHistory(history: History): Promise<void> {
  await fs.mkdir(path.dirname(historyFilePath), { recursive: true });
  await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
}
