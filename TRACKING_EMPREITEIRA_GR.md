# Tracking — Empreiteira GR

O site está preparado para tráfego orgânico, Google Ads, Meta Ads e futura integração com Cecilia OS.

## Eventos first-party emitidos

Todos os eventos são enviados para `window.dataLayer` e também para GA4/Meta quando os IDs forem configurados.

- `page_view`: carregamento da página
- `cta_click`: clique em CTA, especialmente WhatsApp
- `whatsapp_open`: abertura do WhatsApp
- `lead_intent`: intenção de lead quando alguém clica para chamar no WhatsApp
- `section_navigation`: navegação interna por âncoras
- `session_no_lead`: sessão que saiu sem clicar em WhatsApp

## Parâmetros capturados

O script captura e persiste na sessão:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `gbraid`
- `wbraid`

## Paid proof

Para evitar atribuição falsa, `paid_proof: true` só acontece se houver:

- `gclid`
- `gbraid`
- `wbraid`

UTM sozinha ajuda análise, mas não prova Google Ads.

## Como ativar GA4/GTM/Meta Pixel

No `index.html`, preencher em `window.GR_TRACKING_CONFIG`:

```js
window.GR_TRACKING_CONFIG = {
  clientId: 'empreiteira-gr',
  businessName: 'Empreiteira GR',
  phone: '+5521989242095',
  gtmId: 'GTM-XXXXXXX',
  ga4Id: 'G-XXXXXXXXXX',
  metaPixelId: '000000000000000'
};
```

Pode usar só GTM, só GA4, só Meta Pixel ou uma combinação.

## WhatsApp

Quando a URL tem UTMs ou IDs de clique, os links de WhatsApp recebem mensagem pré-preenchida com origem/campanha para facilitar triagem manual.

Exemplo:

`?utm_source=google&utm_medium=cpc&utm_campaign=reforma_niteroi&gclid=abc123`

## Schema local

O site inclui JSON-LD `HomeAndConstructionBusiness` com:

- nome
- telefone
- descrição
- área atendida
- cidade/região
- horário de atendimento

Isso ajuda SEO local e consistência com Google Business Profile.

## Próximos passos

1. Criar/confirmar GA4.
2. Criar/confirmar Google Tag Manager, se quiser centralizar tags.
3. Criar/confirmar Meta Pixel, se for anunciar no Instagram/Facebook.
4. Configurar conversão no GA4 para `lead_intent` e/ou `whatsapp_open`.
5. Importar conversão no Google Ads depois que o GA4 estiver recebendo eventos.
6. Atualizar o `AGENTS_PACK_EMPREITEIRA_GR.md` com IDs finais e endpoints do Cecilia OS quando estiverem prontos.
