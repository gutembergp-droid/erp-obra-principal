# 📊 RELATÓRIO DE IMPLEMENTAÇÃO - FASE 1.1
## Fluxo de Homologação de Baseline (v2.1)

**Data:** Janeiro 2026  
**Fase:** 1.1 - Implementar Fluxo de Homologação de Baseline  
**Status:** 🟡 Em Progresso

---

## ✅ TAREFAS CONCLUÍDAS

### 1. Modelo de Dados - Prisma Schema ✅

**Arquivo:** `prisma/schema.prisma`

**Mudanças Implementadas:**
- ✅ Adicionado campo `status` (String, default: "proposta")
- ✅ Adicionado campos de proposta:
  - `proposta_por` (String?, usuario_id)
  - `proposta_em` (DateTime?)
- ✅ Adicionado campos de homologação:
  - `homologada_por` (String?, usuario_id)
  - `homologada_em` (DateTime?)
- ✅ Adicionado campos de rejeição:
  - `rejeitada_por` (String?)
  - `rejeitada_em` (DateTime?)
  - `motivo_rejeicao` (String?)
- ✅ Alterado `is_ativo` default de `true` para `false`
- ✅ Adicionado relações com Usuario:
  - `usuario_proponente` (BaselinePropostaPor)
  - `usuario_homologador` (BaselineHomologadaPor)
  - `usuario_rejeitador` (BaselineRejeitadaPor)
- ✅ Adicionado índices: `status`, `proposta_por`, `homologada_por`
- ✅ Mantidos campos legados (`data_aprovacao`, `aprovado_por`) para compatibilidade

**Status:** ✅ Concluído

---

### 2. Tipos TypeScript ✅

**Arquivo:** `src/types/baseline-comercial.ts`

**Mudanças Implementadas:**
- ✅ Adicionado tipo `BaselineStatus = 'proposta' | 'homologada' | 'rejeitada'`
- ✅ Atualizado interface `BaselineComercial` com novos campos
- ✅ Adicionado DTOs:
  - `ProporBaselineDto`
  - `HomologarBaselineDto`
  - `RejeitarBaselineDto`

**Status:** ✅ Concluído

---

## 🟡 TAREFAS EM PROGRESSO

### 3. Migration do Banco de Dados

**Status:** 🟡 Pendente

**Próximos Passos:**
- [ ] Criar migration: `npx prisma migrate dev --name add_baseline_homologacao`
- [ ] Verificar se migration foi criada corretamente
- [ ] Aplicar migration no banco de dados

**Nota:** O Prisma não está encontrando o schema automaticamente. Verificar caminho ou executar manualmente.

---

## ⏳ TAREFAS PENDENTES

### 4. Backend - API Routes

**Endpoints a Criar:**

#### A. `POST /api/obras/[id]/baseline/propor`
- [ ] Criar rota
- [ ] Validar permissões (Comercial da Obra)
- [ ] Criar BaselineComercial com status "proposta"
- [ ] Registrar `proposta_por` e `proposta_em`
- [ ] Retornar baseline criada

#### B. `POST /api/obras/[id]/baseline/[baselineId]/homologar`
- [ ] Criar rota
- [ ] Validar permissões (apenas Corporativo)
- [ ] Validar que baseline está com status "proposta"
- [ ] Atualizar status para "homologada"
- [ ] Desativar outras baselines da obra (`is_ativo = false`)
- [ ] Ativar esta baseline (`is_ativo = true`)
- [ ] Registrar `homologada_por` e `homologada_em`
- [ ] Retornar baseline homologada

#### C. `POST /api/obras/[id]/baseline/[baselineId]/rejeitar`
- [ ] Criar rota
- [ ] Validar permissões (apenas Corporativo)
- [ ] Validar que baseline está com status "proposta"
- [ ] Validar que `motivo_rejeicao` foi fornecido
- [ ] Atualizar status para "rejeitada"
- [ ] Registrar `rejeitada_por`, `rejeitada_em` e `motivo_rejeicao`
- [ ] Retornar baseline rejeitada

#### D. `GET /api/obras/[id]/baseline`
- [ ] Criar rota
- [ ] Retornar baseline ativa ou proposta pendente
- [ ] Incluir relacionamentos (EAP, usuários)

**Status:** ⏳ Pendente

---

### 5. Frontend - Módulo Corporativo

**Páginas/Componentes a Criar:**

#### A. `/corporativo/baselines/pendentes`
- [ ] Criar página
- [ ] Listar baselines propostas aguardando homologação
- [ ] Mostrar: obra, versão, quem propôs, quando
- [ ] Botões: Ver Detalhes / Homologar / Rejeitar

#### B. `BaselineHomologacaoModal`
- [ ] Criar componente modal
- [ ] Visualizar EAP proposta
- [ ] Botões: Homologar / Rejeitar
- [ ] Campo de motivo (se rejeitar)
- [ ] Validações

#### C. `/corporativo/baselines/homologadas`
- [ ] Criar página
- [ ] Histórico de baselines homologadas
- [ ] Filtros e busca

**Status:** ⏳ Pendente

---

### 6. Frontend - Módulo Obra (Comercial)

**Páginas/Componentes a Atualizar:**

#### A. Página de Estruturação
- [ ] Após criar EAP, mostrar botão "Enviar para Homologação"
- [ ] Mostrar status: "Em Estruturação" / "Proposta" / "Homologada" / "Rejeitada"
- [ ] Desabilitar edição se já homologada
- [ ] Mostrar mensagem se rejeitada (com motivo)

**Status:** ⏳ Pendente

---

## 📋 PRÓXIMOS PASSOS

1. **Criar Migration**
   - Executar `npx prisma migrate dev --name add_baseline_homologacao`
   - Verificar se campos foram adicionados corretamente

2. **Criar Endpoints de API**
   - Implementar rotas no backend
   - Testar cada endpoint

3. **Criar Interfaces Frontend**
   - Implementar páginas do Corporativo
   - Atualizar página de Estruturação

4. **Testes**
   - Testar fluxo completo: Propor → Homologar
   - Testar fluxo: Propor → Rejeitar
   - Validar permissões

---

## 🔍 NOTAS TÉCNICAS

### Validações Necessárias

1. **Ao Propor:**
   - Usuário deve ter permissão na obra
   - Obra deve estar no status adequado
   - Não pode haver outra baseline proposta pendente

2. **Ao Homologar:**
   - Usuário deve ser do Corporativo (perfil: admin ou gestor_corporativo)
   - Baseline deve estar com status "proposta"
   - Deve desativar outras baselines ativas

3. **Ao Rejeitar:**
   - Usuário deve ser do Corporativo
   - Baseline deve estar com status "proposta"
   - Motivo de rejeição é obrigatório

---

**Documento criado em:** Janeiro 2026  
**Status:** 🟡 Em Progresso  
**Próxima Ação:** Criar migration e endpoints de API






