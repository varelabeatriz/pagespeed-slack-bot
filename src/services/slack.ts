import { config } from '../config';

export async function sendSlackMessage(text: string): Promise<void> {
  const response = await fetch(config.slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error(`Slack webhook request failed with ${response.status} ${response.statusText}`);
  }
}
