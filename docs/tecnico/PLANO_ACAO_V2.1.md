# 🎯 PLANO DE AÇÃO - VERSÃO 2.1
## Implementação das Mudanças e Refinamentos Validados

**Data:** Janeiro 2026  
**Versão Base:** 2.1 (Conceito Refinado e Governança Ajustada)  
**Status:** 🟡 Aguardando Implementação

---

## 📋 OBJETIVO

Implementar as mudanças críticas e refinamentos validados pelo ChatGPT antes de continuar com o desenvolvimento do Dashboard de Obras e demais funcionalidades.

---

## 🔴 FASE 1: MUDANÇAS CRÍTICAS (Prioridade ALTA)

### 1.1. Implementar Fluxo de Homologação de Baseline

**Objetivo:**  
Implementar o processo onde a obra PROPÕE a baseline e o corporativo HOMOLOGA.

**Tarefas:**

#### A. Modelo de Dados
- [ ] Atualizar modelo `BaselineComercial` no Prisma:
  ```prisma
  model BaselineComercial {
    id              String    @id @default(uuid())
    obra_id         String
    versao          Int
    status          String    // "proposta" | "homologada" | "rejeitada"
    proposta_por    String?   // usuario_id que propôs
    proposta_em     DateTime?
    homologada_por   String?   // usuario_id que homologou
    homologada_em   DateTime?
    rejeitada_por   String?
    rejeitada_em    DateTime?
    motivo_rejeicao String?
    is_ativo        Boolean   @default(false)
    // ... outros campos
  }
  ```

#### B. Backend - API Routes
- [ ] Criar endpoint `POST /api/obras/[id]/baseline/propor`
  - Recebe EAP estruturada
  - Cria BaselineComercial com status "proposta"
  - Registra quem propôs e quando
  
- [ ] Criar endpoint `POST /api/obras/[id]/baseline/[baselineId]/homologar`
  - Valida permissões (apenas corporativo)
  - Atualiza status para "homologada"
  - Desativa outras baselines da obra
  - Ativa esta baseline
  - Registra quem homologou e quando
  
- [ ] Criar endpoint `POST /api/obras/[id]/baseline/[baselineId]/rejeitar`
  - Valida permissões
  - Atualiza status para "rejeitada"
  - Registra motivo da rejeição

- [ ] Criar endpoint `GET /api/obras/[id]/baseline`
  - Retorna baseline ativa ou proposta pendente

#### C. Frontend - Módulo Corporativo
- [ ] Criar página `/corporativo/baselines/pendentes`
  - Lista baselines propostas aguardando homologação
  - Mostra obra, versão, quem propôs, quando
  
- [ ] Criar componente `BaselineHomologacaoModal`
  - Visualiza EAP proposta
  - Botões: Homologar / Rejeitar
  - Campo de motivo (se rejeitar)
  
- [ ] Criar página `/corporativo/baselines/homologadas`
  - Histórico de baselines homologadas

#### D. Frontend - Módulo Obra (Comercial)
- [ ] Atualizar página de Estruturação
  - Após criar EAP, mostrar botão "Enviar para Homologação"
  - Mostrar status: "Em Estruturação" / "Proposta" / "Homologada"
  - Desabilitar edição se já homologada

**Estimativa:** 2-3 dias  
**Dependências:** Nenhuma

---

### 1.2. Ajustar Ordem dos Gates

**Objetivo:**  
Corrigir a ordem dos gates: Gate 2 = Produção, Gate 3 = Custos.

**Tarefas:**

#### A. Modelo de Dados
- [ ] Verificar modelo `Gate` no Prisma
- [ ] Garantir que `ordem` ou `tipo` reflete a ordem correta:
  ```
  Gate 1: "liberacao_obra"
  Gate 2: "fechamento_producao"  // TROCOU
  Gate 3: "fechamento_custos"     // TROCOU
  Gate 4: "fechamento_comercial"
  Gate 5: "qualidade_ok"
  Gate 6: "sst_ok"
  Gate 7: "financeiro_ok"
  Gate 8: "gerencial_ok"
  Gate 9: "competencia_concluida"
  ```

#### B. Backend - Lógica de Sequência
- [ ] Atualizar validação de sequência de gates
  - Gate 2 só pode ser aprovado após Gate 1
  - Gate 3 só pode ser aprovado após Gate 2
  - etc.
  
- [ ] Atualizar regra de bloqueio
  - Gate 9 só libera se Gate 5 E Gate 6 estiverem OK

#### C. Frontend - Interfaces
- [ ] Atualizar componente de visualização de gates
  - Ordem correta na lista
  - Labels corretos
  
- [ ] Atualizar dashboard de fechamento mensal
  - Sequência correta
  - Dependências corretas

**Estimativa:** 1 dia  
**Dependências:** Nenhuma

---

### 1.3. Atualizar Gate 1 - Validação de Baseline Homologada

**Objetivo:**  
Adicionar validação de baseline homologada como pré-requisito para Gate 1.

**Tarefas:**

#### A. Backend - Validação
- [ ] Atualizar endpoint `POST /api/obras/[id]/gates/1/aprovar`
  - Adicionar validação: baseline deve estar homologada
  - Retornar erro se baseline não homologada
  
- [ ] Atualizar endpoint `GET /api/obras/[id]/gates/1/validacoes`
  - Incluir status da baseline nas validações
  - Mostrar se baseline está proposta, homologada ou rejeitada

#### B. Frontend - Interface
- [ ] Atualizar componente de Gate 1
  - Mostrar status da baseline
  - Desabilitar aprovação se baseline não homologada
  - Mensagem clara: "Baseline deve estar homologada"

**Estimativa:** 0.5 dia  
**Dependências:** 1.1 (Fluxo de Homologação)

---

## 🟡 FASE 2: MUDANÇAS MÉDIAS (Prioridade MÉDIA)

### 2.1. Renomear SSMA para SST

**Objetivo:**  
Separar SST (Segurança e Saúde do Trabalho) de Meio Ambiente.

**Tarefas:**

#### A. Modelo de Dados
- [ ] Renomear modelo `SSMA` para `SST` (se existir)
- [ ] Criar modelo `MeioAmbiente` separado (se não existir)
- [ ] Atualizar relacionamentos

#### B. Backend
- [ ] Renomear rotas `/api/ssma` para `/api/sst`
- [ ] Criar rotas `/api/meio-ambiente`
- [ ] Atualizar controllers e services

#### C. Frontend
- [ ] Renomear páginas e componentes
- [ ] Atualizar menu lateral
- [ ] Atualizar referências em código

**Estimativa:** 1 dia  
**Dependências:** Nenhuma

---

### 2.2. Implementar Planejamento e Controle

**Objetivo:**  
Criar módulo de Planejamento e Controle como departamento explícito.

**Tarefas:**

#### A. Modelo de Dados
- [ ] Criar modelos necessários:
  - `Cronograma`
  - `CurvaS`
  - `PBS` (Planejamento Baseado em Serviços)
  - `Lookahead`
  - `Restricao`

#### B. Backend
- [ ] Criar rotas `/api/planejamento/*`
- [ ] Implementar funcionalidades básicas

#### C. Frontend
- [ ] Criar páginas de Planejamento e Controle
- [ ] Adicionar ao menu lateral

**Estimativa:** 3-5 dias  
**Dependências:** Nenhuma (pode ser feito depois)

---

## 🟢 FASE 3: MELHORIAS (Prioridade BAIXA)

### 3.1. Clarificar Fluxo de MP

**Objetivo:**  
Documentar e implementar integração Produção → Comercial para MP.

**Tarefas:**

#### A. Documentação
- [ ] Documentar fluxo completo
- [ ] Criar diagramas de sequência

#### B. Implementação
- [ ] Implementar consolidação mensal de apontamentos
- [ ] Criar interface de consolidação no Comercial

**Estimativa:** 2-3 dias  
**Dependências:** Módulo de Produção implementado

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1 (Dias 1-5)
- ✅ Fase 1.1: Fluxo de Homologação (2-3 dias)
- ✅ Fase 1.2: Ajustar Ordem dos Gates (1 dia)
- ✅ Fase 1.3: Atualizar Gate 1 (0.5 dia)
- ✅ Testes e ajustes (0.5 dia)

### Semana 2 (Dias 6-10)
- ✅ Fase 2.1: Renomear SSMA para SST (1 dia)
- ✅ Fase 2.2: Planejamento e Controle (3-5 dias) - ou adiar
- ✅ Testes e ajustes

### Semana 3+ (Dias 11+)
- ✅ Fase 3: Melhorias e refinamentos
- ✅ Continuar desenvolvimento do Dashboard de Obras

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após implementar cada fase, validar:

### Fase 1 - Mudanças Críticas
- [ ] Baseline pode ser proposta pelo Comercial
- [ ] Baseline pode ser homologada pelo Corporativo
- [ ] Gate 1 só libera se baseline homologada
- [ ] Gate 2 = Produção, Gate 3 = Custos (ordem correta)
- [ ] Gate 9 só libera se Gate 5 E Gate 6 OK

### Fase 2 - Mudanças Médias
- [ ] SSMA renomeado para SST
- [ ] Meio Ambiente separado
- [ ] Planejamento e Controle implementado (ou planejado)

### Fase 3 - Melhorias
- [ ] Fluxo de MP documentado
- [ ] Integração Produção → Comercial funcionando

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Revisar e aprovar este plano**
2. **Iniciar Fase 1.1: Fluxo de Homologação**
3. **Paralelamente: Continuar desenvolvimento do Dashboard de Obras** (usando conceitos corretos)

---

**Documento criado em:** Janeiro 2026  
**Status:** 🟡 Aguardando Aprovação  
**Próxima Ação:** Iniciar Fase 1.1






