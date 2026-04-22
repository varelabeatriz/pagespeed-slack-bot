# PageSpeed Slack Bot

Bot em Node.js + TypeScript para monitorar métricas do Google PageSpeed Insights e enviar alertas para um canal do Slack quando houver mudanças relevantes.

## O que ele faz

- consulta a API do Google PageSpeed Insights
- monitora uma ou mais URLs
- roda em `mobile` e/ou `desktop`
- compara a coleta atual com a última baseline salva
- envia mensagem no Slack quando a mudança ultrapassa os thresholds configurados
- salva o histórico local em `src/data/history.json`

## Estrutura

```txt
src/
  config.ts
  index.ts
  data/
  services/
    pagespeed.ts
    slack.ts
  types/
    index.ts
  utils/
    compare.ts
    format.ts
    history.ts
```

## Requisitos

- Node.js 18+
- chave da API do PageSpeed Insights
- Slack Incoming Webhook

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` com base no `.env.example`.

Exemplo:

```env
PSI_API_KEY=your_google_pagespeed_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
URLS=https://example.com,https://example.com/products/123
STRATEGIES=mobile,desktop
PERFORMANCE_THRESHOLD=5
LCP_THRESHOLD_MS=300
CLS_THRESHOLD=0.05
INP_THRESHOLD_MS=100
TTFB_THRESHOLD_MS=200
```

## Scripts

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Rodar build:

```bash
npm start
```

Build + run:

```bash
npm run check
```

## Como funciona a comparação

O bot compara a coleta atual com a última coleta salva por combinação de:

- URL
- estratégia (`mobile` ou `desktop`)

Ele envia alerta quando detectar pelo menos uma mudança acima do threshold, por exemplo:

- performance variou 5 pontos ou mais
- LCP variou 300 ms ou mais
- CLS variou 0.05 ou mais
- INP variou 100 ms ou mais
- TTFB variou 200 ms ou mais

## Agendamento

Você pode agendar a execução com:

- GitHub Actions
- cron no servidor
- Vercel Cron
- AWS Lambda + EventBridge

Exemplo simples com cron para rodar a cada 6 horas:

```bash
0 */6 * * * cd /caminho/do/projeto && /usr/bin/npm run check >> bot.log 2>&1
```

## Observação importante

Esse boilerplate usa o resultado de Lighthouse retornado pela API do PageSpeed Insights. Se no futuro você quiser uma versão mais robusta, dá para evoluir para:

- relatórios diários
- alertas só após 2 ou 3 quedas seguidas
- persistência em banco
- métricas de campo com CrUX
- mensagens mais ricas com Block Kit no Slack
