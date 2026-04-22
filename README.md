# 🤖 PageSpeed Slack Bot

Bot em Node.js + TypeScript para monitorar métricas do Google PageSpeed Insights e enviar alertas para um canal do Slack quando houver mudanças relevantes.

<img width="1175" height="795" alt="image" src="https://github.com/user-attachments/assets/0d63d567-ec3b-4c58-b193-12d9dfa74586" />


## Como funciona?

- Configure uma ou mais URLs em .env
- É feita uma consulta na API do Google PageSpeed Insights
- A coleta atual é comparada com a última baseline salva
- É feito o envio de uma mensagem no Slack quando a mudança ultrapassa os thresholds configurados
- O histórico local fica salvo em `src/data/history.json`

  
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

