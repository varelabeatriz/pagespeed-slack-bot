import { config } from './config';
import { getPageSpeedSnapshot } from './services/pagespeed';
import { sendSlackMessage } from './services/slack';
import { diffSnapshots } from './utils/compare';
import { formatErrorAlert, formatSnapshotAlert } from './utils/format';
import { buildHistoryKey, readHistory, writeHistory } from './utils/history';

async function main(): Promise<void> {
  const history = await readHistory();

  for (const url of config.urls) {
    for (const strategy of config.strategies) {
      try {
        const current = await getPageSpeedSnapshot(url, strategy);
        const key = buildHistoryKey(url, strategy);
        const previous = history[key];
        const diff = diffSnapshots(previous, current, config.thresholds);

        if (diff.changed) {
          const alert = formatSnapshotAlert(current, diff.reasons);
          await sendSlackMessage(alert);
          console.log(`Alert sent for ${key}`);
        } else {
          console.log(`No relevant change for ${key}`);
        }

        history[key] = current;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to monitor ${strategy}:${url} -> ${message}`);
        await sendSlackMessage(formatErrorAlert(url, strategy, message));
      }
    }
  }

  await writeHistory(history);
}

main().catch((error) => {
  console.error('Fatal error while running the bot:', error);
  process.exit(1);
});
