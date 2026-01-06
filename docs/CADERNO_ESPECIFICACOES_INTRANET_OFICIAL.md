# CADERNO DE ESPECIFICAÇÕES OFICIAL

## MÓDULO: INTRANET (DASHBOARD PRINCIPAL)

---

**Versão:** 1.0  
**Data:** 2026-01-03  
**Status:** VALIDADO  
**Autor Técnico:** Arquiteto de Software Sênior  
**Validação Conceitual:** Gutemberg P. (Especialista de Domínio)

---

## SUMÁRIO

1. [Conceito](#1-conceito)
2. [Funcionalidade](#2-funcionalidade)
3. [Visual](#3-visual)
4. [Integrações](#4-integrações)
5. [Visões](#5-visões)
6. [Auditoria e Controle](#6-auditoria-e-controle)

---

## 1. CONCEITO

### 1.1. Definição

A Intranet é a **página mãe** do ERP Gênesis. É a primeira tela que qualquer usuário visualiza ao fazer login no sistema. Funciona como um **hub centralizado de informação e comunicação**, onde todos sabem o que está acontecendo na empresa, na obra e nas suas atividades específicas.

### 1.2. Objetivo de Negócio

O objetivo principal é resolver a falha de comunicação em projetos de grande porte, que representa aproximadamente 90% dos problemas em gerenciamento de projetos. A Intranet garante que todos os envolvidos, do operacional ao estratégico, tenham acesso à informação relevante em tempo real, promovendo alinhamento, transparência e agilidade na tomada de decisão.

### 1.3. Princípio de Governança

A **informação certa deve chegar à pessoa certa no tempo certo**. A Intranet é a principal ferramenta para garantir que a comunicação flua de forma eficiente e auditável, desde comunicados globais da diretoria até tarefas operacionais do dia a dia.

### 1.4. Os 3 Níveis de Informação

| Nível | Descrição | Exemplo |
| :--- | :--- | :--- |
| **Corporativo (Global)** | Informações da empresa como um todo, para todas as obras | "Hoje assinamos um novo contrato" |
| **Obra (Local)** | Informações específicas de uma obra | "Entregamos a data marco", "Nova frente de trabalho iniciada" |
| **Setor/Gerencial** | Informações específicas do cargo/setor do usuário | Tarefas pendentes, status de aprovações, prazos |

---

## 2. FUNCIONALIDADE

### 2.1. Função Principal

A Intranet é **primariamente uma tela de visualização**, não de operação. Ela concentra em um único lugar tudo o que o usuário precisa saber. O usuário **visualiza** os resumos e, se precisar agir, **clica** no card/item e é levado para a tela onde a operação acontece.

### 2.2. Fluxo de Comunicados

#### 2.2.1. Dois Níveis de Aprovação

| Escopo | Fluxo de Aprovação |
| :--- | :--- |
| **LOCAL (apenas a obra)** | Setor → Chefe do Setor → Administrativo da Obra → Publicação |
| **GLOBAL (todas as obras)** | Setor → Chefe do Setor → Administrativo da Obra → **Administrativo do Corporativo** → Publicação |

#### 2.2.2. Ciclo de Vida do Comunicado

| Etapa | Responsável | Ação | Status |
| :--- | :--- | :--- | :--- |
| 1. Criação | Colaborador do setor | Redige o comunicado, define público-alvo e prioridade | `Rascunho` |
| 2. Submissão | Autor | Envia para o Chefe do Setor | `Aguardando Validação do Setor` |
| 3. Validação | Chefe do Setor | Aprova, solicita ajustes ou rejeita | `Validado pelo Setor` ou `Devolvido para Ajustes` |
| 4. Envio para Publicação | Chefe do Setor | Encaminha para o Setor de Comunicação | `Aguardando Publicação` |
| 5. Aprovação Corporativa | Administrativo Corporativo | Aprova comunicados globais | `Aprovado pelo Corporativo` (apenas para globais) |
| 6. Publicação | Setor de Comunicação | Revisa, agenda ou publica imediatamente | `Publicado` |
| 7. Expiração | Sistema (automático) | Remove da exibição após data de validade | `Expirado` |

#### 2.2.3. Estados do Comunicado

| Status | Visível na Intranet? | Quem pode ver? |
| :--- | :--- | :--- |
| `Rascunho` | Não | Apenas o autor |
| `Aguardando Validação do Setor` | Não | Autor + Chefe do Setor |
| `Devolvido para Ajustes` | Não | Apenas o autor |
| `Validado pelo Setor` | Não | Autor + Chefe + Comunicação |
| `Aguardando Publicação` | Não | Comunicação |
| `Publicado` | **Sim** | Público-alvo definido |
| `Expirado` | Não | Histórico (auditoria) |

#### 2.2.4. Campos do Comunicado

| Campo | Descrição | Obrigatório |
| :--- | :--- | :--- |
| Título | Título do comunicado | Sim |
| Conteúdo | Texto do comunicado (com formatação básica) | Sim |
| Público-Alvo | Global (todas as obras), Obra específica, Setor específico | Sim |
| Prioridade | Normal, Urgente, Crítico | Sim |
| Setor de Origem | SSMA, Qualidade, Engenharia, etc. | Automático |
| Data de Publicação | Imediata ou agendada | Sim |
| Data de Expiração | Quando o comunicado sai do ar | Opcional |
| Anexos | Documentos, imagens | Opcional |

### 2.3. Prioridade de Exibição das Notícias

| Prioridade | Tipo | Exemplo | Comportamento |
| :--- | :--- | :--- | :--- |
| **1ª (Máxima)** | Alerta Crítico | Acidente de trabalho, Interdição | Destaque no topo, cor vermelha |
| **2ª** | Comunicado Corporativo Urgente | Mudança de diretoria, Novo contrato | Logo abaixo dos alertas |
| **3ª** | Comunicado da Obra | Entrega de marco, Nova frente | Carrossel principal |
| **4ª** | Comunicado de Setor | Treinamento, Atualização de procedimento | Área específica do setor |
| **5ª** | Informativo Geral | Aniversariantes, Confraternização | Área secundária |

Dentro de cada nível de prioridade, os mais recentes aparecem primeiro.

### 2.4. Notificações Automáticas

| Evento | Quem é Notificado |
| :--- | :--- |
| Comunicado submetido para validação | Chefe do Setor |
| Comunicado devolvido para ajustes | Autor |
| Comunicado validado e enviado para publicação | Setor de Comunicação |
| Comunicado global enviado para aprovação corporativa | Administrativo Corporativo |
| Comunicado publicado | Público-alvo definido |
| Comunicado próximo de expirar (3 dias antes) | Autor + Comunicação |

### 2.5. Regras de Negócio

| Código | Regra |
| :--- | :--- |
| RN-01 | Nenhum comunicado local é publicado sem passar pelas 3 etapas (Setor → Chefe → Comunicação) |
| RN-02 | Comunicados globais exigem aprovação adicional do Administrativo Corporativo |
| RN-03 | Comunicados com prioridade "Crítico" geram notificação push/email para todo o público-alvo |
| RN-04 | Comunicados expirados ficam disponíveis no histórico para fins de auditoria |
| RN-05 | O Setor de Comunicação pode editar formatação, mas não pode alterar conteúdo técnico sem devolver ao setor |

### 2.6. Funcionalidades Adicionais Aprovadas

| Funcionalidade | Descrição |
| :--- | :--- |
| **Confirmação de Leitura** | Comunicados "Crítico" ou "Obrigatório" exigem que o usuário clique em "Li e estou ciente". O sistema registra quem leu e quando. |
| **Comunicados Fixados (Pin)** | O Setor de Comunicação pode fixar um comunicado no topo da Intranet por tempo determinado. |
| **Busca no Histórico** | Busca por palavra-chave no título e conteúdo dos comunicados. |

---

## 3. VISUAL

### 3.1. Identidade Visual Base

A interface seguirá o **Manual de Identidade Visual da AahBrant Engenharia & Construções**.

#### 3.1.1. Paleta de Cores Institucional

| Cor | Código Hex | RGB | Aplicação |
| :--- | :--- | :--- | :--- |
| **Preto** | `#000000` | R0 G0 B0 | Textos, ícones, elementos gráficos |
| **Cinza Claro** | `#EEEEE8` | R238 G238 B232 | Fundos, áreas de respiro, cards |
| **Vermelho Institucional** | `#96110D` | R150 G17 B13 | Cor de destaque, botões principais, identidade SSMA |

#### 3.1.2. Tipografia

| Função | Fonte | Uso |
| :--- | :--- | :--- |
| **Destaque** | Bebas Neue | Títulos de seções, números grandes em KPIs |
| **Corpo** | Montserrat Regular | Textos, labels, descrições |
| **Apoio** | Calibri Light (ou Open Sans Light) | Textos longos e explicativos |

### 3.2. Sistema de Temas

O sistema oferecerá **3 opções de tema**:

| Tema | Descrição | Aplicação |
| :--- | :--- | :--- |
| **Oficial AahBrant** | Paleta institucional (Preto, Cinza Claro, Vermelho) | Padrão da empresa |
| **Escuro (Dark Mode)** | Fundo escuro, textos claros, vermelho como destaque | Preferência do usuário / uso noturno |
| **Genérico / Jovial** | Paleta moderna e colorida, visual mais leve | Para consórcios ou outras empresas |

### 3.3. Exceção para Consórcio

Em caso de **consórcio** (união de duas ou mais empresas), o sistema permite:
- Upload de logotipo personalizado
- Definição de paleta de cores específica para aquele projeto/obra

### 3.4. Estética Geral

| Aspecto | Diretriz |
| :--- | :--- |
| **Densidade** | Limpa, não densa. Bastante espaço em branco. |
| **Formato** | Cards para cada bloco de informação |
| **Comunicados** | Apresentados em formato de carrossel (rolagem horizontal) |
| **Cores por Setor** | SSMA e outros setores terão identidade visual própria para fácil identificação |
| **Referência** | Protótipo V0 validado pelo usuário |

### 3.5. Layout da Tela

A Intranet será organizada em áreas distintas:

| Área | Conteúdo |
| :--- | :--- |
| **Comunicados Corporativos** | Notícias globais da empresa |
| **Comunicados da Obra** | Acontecimentos da obra específica |
| **Cards de Tarefas/Workflow** | Resumo das pendências do usuário |
| **KPIs do Setor** | Informações gerenciais sintéticas |
| **Calendário** | Próximos eventos e datas marco |

---

## 4. INTEGRAÇÕES

### 4.1. Diagrama de Integrações

```
┌─────────────────────────────────────────────────────────────┐
│                        INTRANET                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ COMUNICADOS │  │    KPIs     │  │   TAREFAS   │         │
│  │  (Formais)  │  │  (Setores)  │  │  (Workflow) │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐         │
│  │ Módulo de   │  │ Relatórios  │  │  Planner/   │         │
│  │ Comunicação │  │  Técnicos   │  │   Kanban    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │    CHAT     │  │ CALENDÁRIO  │                          │
│  └─────────────┘  └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Origem dos Dados

#### 4.2.1. Comunicados
Vêm do **Módulo de Comunicação**, gerenciado pelo Setor Administrativo. Passam pelo fluxo de aprovação antes de aparecer na Intranet.

#### 4.2.2. KPIs dos Setores
São dados técnicos extraídos **automaticamente** dos relatórios e atividades de cada setor. O usuário não cadastra — o sistema calcula e exibe.

| Origem | Tipo de Dado | Exemplo |
| :--- | :--- | :--- |
| Tarefas/Workflow | Pendências do usuário | "5 requisições aguardando aprovação" |
| Relatórios Técnicos | KPIs do setor | "3 não conformidades abertas" |
| Solicitações | Pedidos recebidos | "2 solicitações de material" |
| Urgências | Itens prioritários | "1 tarefa crítica para hoje" |

#### 4.2.3. Tarefas
Vêm do **Planner/Kanban** integrado ao sistema, no estilo Trello.

### 4.3. Ferramentas de Comunicação Integradas

| Ferramenta | Função | Integração com Intranet |
| :--- | :--- | :--- |
| **Chat** | Comunicação rápida entre setores/usuários | Notificação de mensagens não lidas |
| **Calendário** | Agenda de eventos, reuniões, marcos | Widget de "Próximos Eventos" |
| **Planner/Kanban** | Gestão de tarefas no estilo Trello | Widget de "Minhas Tarefas" |

### 4.4. Personalização por Perfil

Cada setor/cargo terá um **conjunto de widgets pré-definido** que aparece automaticamente. O sistema identifica o perfil do usuário no login e monta a tela.

| Perfil | Widgets na Intranet |
| :--- | :--- |
| Comprador (Suprimentos) | Requisições Pendentes, Cotações a Enviar, Pedidos Atrasados |
| Gerente de Contrato | KPIs da Obra, Aprovações Pendentes, Alertas de Gates |
| Engenheiro de Produção | Avanço Físico do Dia, Medições em Aberto, Não Conformidades |
| Técnico de Segurança | Inspeções Pendentes, Incidentes Abertos, Treinamentos Vencendo |
| Diretor | Visão consolidada de todas as obras, Resultado Financeiro, Riscos |

---

## 5. VISÕES

### 5.1. Visão do Diretor (Estratégica)

Visão **consolidada e de alto nível**, focada em resultados e riscos de todas as obras.

| Elemento | O que vê | Comportamento |
| :--- | :--- | :--- |
| **Comunicados** | Apenas comunicados Globais/Corporativos | Não vê comunicados locais de obras específicas |
| **KPIs** | Painel consolidado de todas as obras: Resultado Financeiro, Desvio de Prazo, Índice de Segurança | Números agregados com indicadores de tendência |
| **Tarefas** | Apenas aprovações estratégicas (homologação de baseline, aditivos de grande valor) | Lista reduzida |
| **Alertas** | Alertas críticos de qualquer obra (acidentes, interdições, desvios graves) | Destaque em vermelho |
| **Calendário** | Reuniões de diretoria, datas marco principais | Visão mensal |

**Ação típica:** Olha números consolidados. Se algo está fora do esperado, clica e vai ao detalhe da obra.

### 5.2. Visão do Gerente de Obra (Gerencial/Tática)

Visão **completa da sua obra**, com foco em controle e tomada de decisão tática.

| Elemento | O que vê | Comportamento |
| :--- | :--- | :--- |
| **Comunicados** | Globais + da sua Obra + de todos os setores da obra | Vê tudo da empresa e da sua obra |
| **KPIs** | Painel detalhado: Avanço Físico, Avanço Financeiro, Medições, Status dos Gates, Não Conformidades | Comparativo ao planejado |
| **Tarefas** | Todas as aprovações pendentes da obra | Lista completa |
| **Alertas** | Alertas da obra: Gates travados, prazos vencendo, não conformidades | Destaque por prioridade |
| **Calendário** | Datas marco da obra, reuniões, vistorias, auditorias | Visão semanal/mensal |

**Ação típica:** Vê o "pulso" da obra, identifica o que precisa de atenção, aprova pendências.

### 5.3. Visão do Colaborador de Setor (Operacional)

Visão **focada nas suas tarefas e no seu setor**, com informações práticas para o dia a dia.

| Elemento | O que vê | Comportamento |
| :--- | :--- | :--- |
| **Comunicados** | Globais + da Obra + do seu Setor | Não vê comunicados de outros setores |
| **KPIs** | Apenas KPIs do seu setor/função | Números específicos da sua área |
| **Tarefas** | Suas tarefas pessoais: o que fazer hoje, atrasados, solicitações | Estilo Planner/Kanban |
| **Alertas** | Alertas do seu setor: prazos vencendo, solicitações urgentes | Destaque para críticos |
| **Calendário** | Seus compromissos: treinamentos, reuniões, prazos | Visão diária/semanal |

**Ação típica:** Vê exatamente o que precisa fazer no dia. Clica na tarefa e executa.

### 5.4. Resumo Comparativo

| Aspecto | Diretor | Gerente de Obra | Colaborador |
| :--- | :--- | :--- | :--- |
| **Escopo de Comunicados** | Global | Global + Obra | Global + Obra + Setor |
| **Escopo de KPIs** | Todas as obras (consolidado) | Uma obra (detalhado) | Seu setor (específico) |
| **Escopo de Tarefas** | Aprovações estratégicas | Aprovações da obra | Tarefas pessoais |
| **Foco** | Resultado e Risco | Controle e Decisão | Execução |
| **Profundidade** | Alto nível | Médio nível | Detalhe operacional |

---

## 6. AUDITORIA E CONTROLE

### 6.1. Rastreabilidade de Comunicados

O Setor Administrativo/Comunicação terá acesso a uma tela de **Histórico Completo** com todas as publicações.

#### 6.1.1. Colunas do Histórico

| Coluna | Descrição |
| :--- | :--- |
| ID | Número único do comunicado |
| Título | Título do comunicado |
| Tema/Categoria | SSMA, Qualidade, Institucional, Obra, etc. |
| Setor de Origem | Quem criou |
| Autor | Nome do colaborador que redigiu |
| Aprovador (Setor) | Chefe que validou |
| Aprovador (Corporativo) | Quem aprovou no corporativo (se global) |
| Publicador | Quem do Comunicação publicou |
| Data de Publicação | Quando foi ao ar |
| Data de Expiração | Quando saiu do ar |
| Duração | Tempo que ficou visível |
| Status | Publicado, Expirado, Com Errata |
| Ações | Ver conteúdo, Publicar Errata, Exportar |

#### 6.1.2. Campos de Auditoria (em todo comunicado)

| Campo | Descrição |
| :--- | :--- |
| Criado por | Usuário + Data/Hora |
| Validado por | Usuário + Data/Hora |
| Aprovado por (Corporativo) | Usuário + Data/Hora (se global) |
| Publicado por | Usuário + Data/Hora |
| Editado por | Usuário + Data/Hora (se houve edição) |
| Errata vinculada | ID da errata (se houver) |

### 6.2. Funcionalidade de Errata

| Etapa | Ação |
| :--- | :--- |
| 1 | O Setor de Comunicação acessa o comunicado original no Histórico |
| 2 | Clica em "Publicar Errata" |
| 3 | Redige a correção, vinculando ao comunicado original |
| 4 | A errata é publicada e aparece junto ao comunicado original (se ainda visível) ou como nova publicação (se expirado) |
| 5 | O comunicado original fica marcado como "Com Errata" no histórico |

### 6.3. Filtros do Histórico

O usuário pode filtrar a lista por:
- Período (data de publicação)
- Tema/Categoria
- Setor de Origem
- Status (Publicado, Expirado, Com Errata)
- Autor ou Aprovador

### 6.4. Exportação

O histórico pode ser exportado em **PDF** ou **Excel** para fins de auditoria externa ou relatórios gerenciais.

### 6.5. Relatório de Alcance

Para comunicados com **Confirmação de Leitura** ativada, o sistema gera um relatório com:
- Total de destinatários
- Quantidade que confirmou leitura
- Quantidade pendente
- Lista nominal de quem leu e quando

---

## APROVAÇÃO

| Item | Status |
| :--- | :--- |
| 1. Conceito | ✅ Validado |
| 2. Funcionalidade | ✅ Validado |
| 3. Visual | ✅ Validado |
| 4. Integrações | ✅ Validado |
| 5. Visões | ✅ Validado |
| 6. Auditoria e Controle | ✅ Validado |

---

**DOCUMENTO APROVADO PARA IMPLEMENTAÇÃO**

Data: 2026-01-03  
Validado por: Gutemberg P. (Especialista de Domínio)  
Elaborado por: Arquiteto de Software Sênior

---

*Este documento é parte integrante da documentação técnica do ERP Gênesis e deve ser utilizado como referência oficial para a implementação do módulo Intranet.*
