# Empreiteira GR - Agents Pack

## Objetivo

Criar uma camada simples e segura para agentes acompanharem a operação digital da Empreiteira GR, começando pelo básico:

- ler dados do site/landing;
- revisar funil de visitas, WhatsApp e leads;
- sugerir melhorias de anúncio, landing e atendimento;
- registrar auditoria do que foi visto e proposto;
- evitar mudanças perigosas sem aprovação humana.

Escopo atual prioritário: Empreiteira GR / Edson Rocha.

## Regra principal

Para agentes cloud, o caminho padrão deve ser usar API/MCP e dados estruturados, não automação de browser no dashboard humano.

O dashboard humano, quando existir, deve ser para Bernardo/operador.
Agentes devem operar por:

- API/MCP do sistema operacional do cliente; ou
- endpoints REST autenticados; ou
- leitura de arquivos/dados exportados explicitamente para agentes.

## Estado atual

Landing publicada:

- URL: `https://empreiteiragr.vercel.app`
- negócio: Empreiteira GR
- responsável: Edson Rocha
- WhatsApp: `+55 21 98924-2095`
- região: Niterói, Rio de Janeiro e Região dos Lagos
- oferta: reformas residenciais, acabamentos, áreas externas e pequenos projetos

Site/repositório local:

- projeto: `/root/empreiteiro-site`
- repo remoto: `bernardolcp/gr-empreiteira-site`
- deploy: Vercel

## Arquitetura recomendada

### Fase 1 - sem backend complexo

Usar a landing como captura e adicionar tracking first-party leve:

- `page_view`
- `cta_click`
- `whatsapp_open`
- `lead_intent`

Cada evento deve salvar:

- `timestamp`
- `client_id = empreiteira-gr`
- `page_url`
- `event_name`
- `cta_label`
- `gclid`
- `gbraid`
- `wbraid`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `user_agent`
- `referrer`

### Fase 2 - Cecilia OS como painel operacional

Criar ou cadastrar cliente no Cecilia OS:

- `client_id`: `empreiteira-gr`
- nome: `Empreiteira GR`
- responsável: `Edson Rocha`
- WhatsApp: `+5521989242095`
- segmento: reformas/construção residencial
- região: Niterói, Rio de Janeiro e Região dos Lagos

A partir disso, agentes usam Cecilia OS para:

- métricas de landing;
- funil paid/local;
- leads e conversas;
- tarefas;
- audit log;
- propostas de ação.

## Autenticação do agente

Se for via Cecilia OS:

```http
Authorization: Bearer <AGENT_API_KEY>
x-agent-id: <agent-name>
```

Exemplos:

- `x-agent-id: empreiteira-gr-reviewer`
- `x-agent-id: local-services-monitor`
- `x-agent-id: ads-landing-optimizer`

## MCP/API esperada

Base sugerida, se entrar no Cecilia OS:

- Produção Cecilia OS: `https://cecilia-os.vercel.app`
- MCP: `POST /api/mcp`
- REST: `GET/POST /api/v1/...`

### Tools desejadas

- `cecilia_get_client`
- `cecilia_get_client_metrics`
- `cecilia_get_client_health`
- `cecilia_list_leads`
- `cecilia_list_tasks`
- `cecilia_get_audit_log`
- `cecilia_log_agent_review`
- `cecilia_propose_action`
- `cecilia_list_pending_actions`
- `cecilia_execute_action` somente para ações aprovadas

### Endpoints REST desejados

- `GET /api/v1/clients/empreiteira-gr/health`
- `GET /api/v1/clients/empreiteira-gr/metrics?range=2`
- `GET /api/v1/clients/empreiteira-gr/funnel?range=2`
- `GET /api/v1/clients/empreiteira-gr/leads`
- `GET /api/v1/clients/empreiteira-gr/tasks`
- `GET /api/v1/clients/empreiteira-gr/audit?limit=50`

## Regra de atribuição paid

Para provar tráfego pago, contar apenas sessões/eventos com pelo menos um destes campos:

- `gclid`
- `gbraid`
- `wbraid`

UTM manual sozinho não é prova de paid.

Essa regra vale para:

- `paid_sessions`
- `paid_whatsapp_leads`
- `paid_leads`
- CPL pago

## Eventos first-party importantes

Principais eventos da landing:

- `page_view` = visita à landing
- `cta_click` = clique em chamada de orçamento
- `whatsapp_open` = intenção de abrir conversa
- `lead_intent` = clique qualificado com origem/campanha preservada

Leitura operacional:

- `whatsapp_open` é sinal forte de intenção;
- se houver `gclid/gbraid/wbraid`, conta como paid funnel;
- se não houver, entra em funil orgânico/referral/unknown.

## O que agentes cloud podem fazer sem aprovação humana

Baixo risco:

- ler métricas;
- revisar funil;
- ler leads e tarefas;
- registrar review;
- sugerir ajustes de texto, criativo ou atendimento;
- propor ações com audit trail;
- criar lista de perguntas para qualificar leads.

## O que agentes cloud não devem mudar sem aprovação humana

Não alterar sem aprovação explícita:

- orçamento de campanha;
- status de campanha;
- bidding strategy;
- conversion action;
- landing page publicada;
- telefone/WhatsApp;
- domínio;
- qualquer copy que prometa preço, prazo ou garantia sem confirmação do Edson/Bernardo.

## Guardrails específicos da Empreiteira GR

Aplicar sempre:

- não inventar depoimentos reais;
- não prometer preço sem visita/orçamento;
- não afirmar registro, certificação ou equipe própria se não estiver confirmado;
- não usar linguagem genérica de “empresa líder”;
- manter foco em confiança, obra organizada, acabamento e atendimento direto;
- região principal: Niterói, Rio de Janeiro e Região dos Lagos;
- WhatsApp correto: `+55 21 98924-2095`.

## Fluxo recomendado para agente recorrente

### Ritual de revisão

1. Confirmar cliente `empreiteira-gr` e dados principais.
2. Ler health.
3. Ler métricas de 2 dias.
4. Comparar com 7 e 30 dias se houver tráfego suficiente.
5. Ler funil de WhatsApp e paid proof.
6. Ler leads/tarefas.
7. Ler audit log recente para não repetir sugestão.
8. Propor ação se houver oportunidade clara.
9. Registrar `cecilia_log_agent_review` ou equivalente.

### Exemplo mínimo de log obrigatório

```json
{
  "client_id": "empreiteira-gr",
  "summary": "Revisao da Empreiteira GR concluida sem mudancas automaticas.",
  "window_days": 2,
  "findings": [
    "WhatsApp correto deve permanecer +5521989242095",
    "Paid proof deve usar apenas gclid gbraid ou wbraid",
    "Nao prometer preco sem visita ou orcamento"
  ],
  "actions_executed": [],
  "actions_proposed": [],
  "next_decision": "Seguir monitorando cliques de WhatsApp e qualidade dos leads antes de propor investimento em ads"
}
```

## Agentes sugeridos

### 1. Landing Reviewer

Responsável por revisar:

- clareza da oferta;
- CTA;
- SEO local;
- consistência de WhatsApp;
- imagens quebradas;
- promessas indevidas.

Não publica mudanças sem aprovação.

### 2. Lead Quality Reviewer

Responsável por revisar leads/conversas quando disponíveis:

- tipo de serviço;
- bairro/cidade;
- urgência;
- fotos enviadas;
- valor potencial;
- próximo passo recomendado.

### 3. Ads Monitor

Responsável por revisar campanha paga, se houver:

- gasto;
- cliques;
- termos/segmentos;
- conversões first-party com paid proof;
- CPL;
- anomalias.

Não muda budget/status/bidding sem aprovação.

### 4. Operator Assistant

Responsável por sugerir respostas e follow-ups:

- pedir fotos;
- pedir endereço/bairro;
- entender escopo;
- sugerir visita técnica;
- lembrar retorno depois de orçamento.

## Prompt base para agente cloud

```text
Você é um agente operacional da Empreiteira GR. Use API/MCP quando disponível. Não use browser humano como caminho padrão. Cliente: empreiteira-gr. Responsável: Edson Rocha. WhatsApp: +5521989242095. Região: Niterói, Rio de Janeiro e Região dos Lagos.

Sua função é revisar métricas, funil, leads e oportunidades. Você pode ler dados, registrar review e propor ações. Você não pode mudar orçamento, bidding, status de campanha, conversion action, landing page, domínio ou WhatsApp sem aprovação humana explícita.

Paid proof só conta se houver gclid, gbraid ou wbraid. UTM manual sozinho não prova tráfego pago.

No final, sempre registre auditoria com resumo, achados, ações propostas, ações executadas e próxima decisão.
```

## Próximos passos práticos

1. Adicionar tracking first-party na landing da Empreiteira GR.
2. Criar `client_id=empreiteira-gr` no Cecilia OS.
3. Conectar eventos da landing ao Cecilia OS.
4. Criar endpoints REST/MCP para métricas, leads, tasks e audit.
5. Criar cron de revisão diária/semana para o agente.
6. Só depois conectar Google Ads/GA4, se houver campanha paga.

## Resumo executivo

Para dar acesso a um agente cloud da Empreiteira GR, passe:

- `AGENT_API_KEY`
- base URL do Cecilia OS ou API operacional
- `client_id=empreiteira-gr`
- instrução de usar MCP/API, não browser
- regra de paid proof por `gclid/gbraid/wbraid`
- WhatsApp correto `+5521989242095`
- regra de sempre registrar audit log
- proibição explícita de mudar campanha, landing, domínio ou telefone sem aprovação humana
