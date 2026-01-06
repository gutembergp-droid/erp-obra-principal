# 📊 ANÁLISE DE ADERÊNCIA ÀS DIRETRIZES UI/UX E NAVEGAÇÃO

**Data:** Janeiro 2026  
**Versão das Diretrizes:** 1.0  
**Documento de Referência:** `DIRETRIZES_UI_UX_NAVEGACAO.md`

---

## ✅ O QUE JÁ ESTÁ ADERENTE

### 1.1 Estrutura e Layout

#### ✅ **Sidebar/Topbar (2.3)**
- ✅ Sidebar fixa implementada (`MainLayout.tsx`)
- ✅ Topbar/menu funcional
- ✅ Navegação reflete estrutura Corporativo/Obra (parcial)
- ✅ Moldura fixa do sistema funcionando

#### ✅ **Padrão de Tela (2.1)**
- ✅ Header com título e descrição (em várias páginas)
- ✅ Área de ações implementada (ex: `/obras`, `/suprimentos`)
- ✅ Filtros e busca funcionais
- ✅ Tabelas como padrão (preferência por tabelas densas)

#### ✅ **UI/UX Geral (2.2)**
- ✅ Tabelas densas e legíveis
- ✅ Evita cardização excessiva
- ✅ Foco em produtividade

### 1.2 Funcionalidades Básicas

#### ✅ **Autenticação (A - MVP)**
- ✅ Login funcional
- ✅ JWT implementado
- ✅ Tokens salvos no localStorage
- ✅ ProtectedRoute implementado

#### ✅ **CRUD de Obras (D - MVP)**
- ✅ Lista de obras funcional
- ✅ Detalhes da obra funcionando
- ✅ Criar/editar/deletar obras
- ✅ Filtros funcionando

#### ✅ **EAP e Estruturação**
- ✅ EAP comercial/operacional implementada
- ✅ Fatores de conversão funcionando
- ✅ Visualização em tabela

#### ✅ **Medições (parcial)**
- ✅ Separação MP/MC implementada no backend
- ✅ CRUD de medições funcionando
- ⚠️ Comparativo MP x MC (backend existe, não registrado)

### 1.3 Backend e Integrações

#### ✅ **Competências Mensais (C - MVP - Backend)**
- ✅ Abrir competência implementado
- ✅ Criar gates 1-9 automaticamente
- ✅ Aprovar/rejeitar gates
- ✅ Travas (Gates 5 e 6) implementadas

#### ✅ **Infraestrutura**
- ✅ Deploy no Vercel funcionando
- ✅ API Routes funcionando
- ✅ Integração Express + Next.js

---

## 🔴 O QUE PRECISA SER AJUSTADO

### 2.1 Redirecionamento Pós-Login (1.1) - CRÍTICO

#### ❌ **Problema Identificado:**
```typescript
// app/login/page.tsx (linha 76)
const returnUrl = searchParams?.get('returnUrl') || '/obras';
router.push(returnUrl);
```

**Diretriz Oficial:** Login → Intranet (sempre) → Redirecionamento automático para departamento  
**Atual:** Login → `/obras` (diretamente, pulando Intranet)

**Clarificação Oficial:**
- Intranet é **hub inicial obrigatório** (não opcional)
- Intranet funciona como painel de avisos, indicadores e contexto
- Redirecionamento é **automático** (sistema decide, não usuário)
- Sistema decide baseado em: perfil, departamento principal, última obra ativa

#### 🔴 **Ajustes Necessários:**
1. ✅ Login deve redirecionar para `/` (Intranet) **sempre** (obrigatório)
2. ❌ Intranet deve redirecionar **automaticamente** para departamento do usuário
3. ❌ Se múltiplos departamentos/obras: Intranet como **fallback/selector**
4. ❌ Implementar lógica de decisão automática (perfil + departamento + obra ativa)
5. ❌ Implementar middleware/guard centralizado (não duplicar em cada página)

### 2.2 Intranet Mockada (1.1, 4, 6)

#### ❌ **Problema:**
- `app/page.tsx` usa dados mockados
- Não há redirecionamento automático
- Não funciona como selector de departamento/obra

#### 🔴 **Ajustes Necessários:**
1. Conectar Intranet à API real
2. Implementar redirecionamento baseado em role/departamento
3. Implementar selector se múltiplas obras/departamentos
4. Buscar dados reais (tarefas, comunicados, indicadores)

### 2.3 RBAC Incompleto (1.2, 6)

#### ⚠️ **Problema:**
- RBAC existe no backend mas não está integrado no frontend
- Níveis operacional/tático/estratégico não implementados
- Menu não filtra por permissões

#### 🔴 **Ajustes Necessários:**
1. Implementar controle de acesso baseado em roles no frontend
2. Filtrar menu baseado em permissões
3. Implementar organização de menu por níveis (opcional)
4. Sinalização visual de níveis (opcional)

### 2.4 Contexto Global de Obra (B - MVP)

#### ❌ **Problema:**
- Não há contexto global de obra selecionada
- Dados mockados no MainLayout (projeto ativo)
- Não há persistência de obra selecionada

#### 🔴 **Ajustes Necessários:**
1. Criar Context API para obra ativa
2. Implementar seleção de obra (se múltiplas)
3. Persistir obra selecionada (localStorage/sessionStorage)
4. Atualizar MainLayout para usar contexto real

### 2.5 Competências Frontend (C - MVP)

#### ❌ **Problema:**
- Backend completo, frontend inexistente
- Não há interface para abrir competência
- Não há interface para aprovar/rejeitar gates
- Não há visualização de status das travas

#### 🔴 **Ajustes Necessários:**
1. Criar página/componente de competências
2. Interface para abrir competência mensal
3. Interface para visualizar gates 1-9
4. Interface para aprovar/rejeitar gates
5. Validação de travas (Gates 5 e 6) bloqueando conclusão
6. Visualização de status do fechamento mensal

### 2.6 Rotas Comerciais Não Registradas

#### ❌ **Problema:**
- `src/api/routes/comercial.routes.ts` existe mas não está em `app.ts`
- Endpoints MP/MC/comparativo não disponíveis

#### 🔴 **Ajustes Necessários:**
1. Registrar rotas comerciais no `src/api/app.ts`
2. Testar endpoints MP/MC
3. Implementar comparativo MP x MC no frontend

### 2.7 Níveis Operacional/Tático/Estratégico (1.2)

#### ⚠️ **Clarificação Oficial:**
- Níveis **NÃO aparecem explicitamente** como menus ou abas
- São organização **conceitual e de permissão**, não visual
- A mesma tela tem visões diferentes conforme perfil
- Nível determinado por: tipo de ação, campos visíveis, possibilidade de aprovação

#### 🔴 **Ajustes Necessários:**
1. ❌ Implementar controle de visibilidade de campos por perfil
2. ❌ Implementar controle de ações permitidas por perfil
3. ❌ Implementar controle de aprovação/trava por perfil
4. ✅ NÃO criar menus/abas separados por níveis
5. ✅ Níveis emergem da função do usuário, não são escolhidos

---

## 🚀 O QUE SERÁ FEITO PRIMEIRO (MVP - ORDEM DE PRIORIDADE)

### Prioridade 1: Fluxo de Login e Redirecionamento (A - MVP)

**Objetivo:** Implementar Login → Intranet → Departamento

**Tarefas:**
1. ✅ Login já redireciona (mas para `/obras`, não `/`)
2. ⚠️ Alterar redirecionamento pós-login para `/` (Intranet)
3. ❌ Implementar redirecionamento automático da Intranet para departamento
4. ❌ Criar middleware/guard centralizado
5. ❌ Implementar lógica de selector (múltiplas obras/departamentos)

**Impacto:** CRÍTICO - Base de toda navegação

---

### Prioridade 2: Contexto Global de Obra (B - MVP)

**Objetivo:** Obra selecionada disponível globalmente

**Tarefas:**
1. ❌ Criar Context API (`ObraContext`)
2. ❌ Implementar seleção de obra (se múltiplas)
3. ❌ Persistir obra selecionada
4. ❌ Atualizar MainLayout para usar contexto real
5. ❌ Remover dados mockados do MainLayout

**Impacto:** ALTO - Necessário para todas as funcionalidades

---

### Prioridade 3: Intranet Funcional (A - MVP)

**Objetivo:** Intranet conectada à API e com redirecionamento

**Tarefas:**
1. ❌ Conectar Intranet à API real
2. ❌ Buscar tarefas/indicadores/comunicados reais
3. ❌ Implementar redirecionamento automático
4. ❌ Implementar selector de obra/departamento (se necessário)

**Impacto:** ALTO - Primeira tela após login

---

### Prioridade 4: Competências Frontend (C - MVP)

**Objetivo:** Interface completa para competências mensais e gates

**Tarefas:**
1. ❌ Criar página/componente de competências
2. ❌ Interface para abrir competência
3. ❌ Visualizar gates 1-9
4. ❌ Aprovar/rejeitar gates
5. ❌ Validação de travas (Gates 5 e 6)
6. ❌ Visualização de status do fechamento

**Impacto:** ALTO - Funcionalidade core do sistema

**Observação:** Backend já está completo, apenas falta frontend

---

### Prioridade 5: RBAC Básico (A - MVP)

**Objetivo:** Controle de acesso por roles no frontend

**Tarefas:**
1. ⚠️ Integrar RBAC do backend com frontend
2. ❌ Filtrar menu baseado em permissões
3. ❌ Proteger rotas por role
4. ❌ Validar acesso em cada página

**Impacto:** MÉDIO-ALTO - Segurança e controle de acesso

---

### Prioridade 6: Registrar Rotas Comerciais

**Objetivo:** Disponibilizar endpoints MP/MC/comparativo

**Tarefas:**
1. ❌ Registrar `comercial.routes.ts` no `app.ts`
2. ⚠️ Testar endpoints
3. ❌ Implementar comparativo MP x MC no frontend

**Impacto:** MÉDIO - Funcionalidade importante mas não bloqueante

---

## 📋 RESUMO EXECUTIVO

### ✅ **Pontos Fortes:**
- Estrutura de layout aderente
- Autenticação funcionando
- CRUD básico completo
- Backend robusto (competências, gates)
- Deploy funcionando

### 🔴 **Principais Gaps:**
1. **Redirecionamento pós-login** (não segue diretriz)
2. **Intranet mockada** (precisa ser funcional)
3. **Contexto de obra** (não implementado)
4. **Competências frontend** (backend completo, frontend zero)
5. **RBAC frontend** (incompleto)

### 🚀 **Plano de Ação MVP:**

**Fase 1 (Crítico - Bloqueador):**
1. Redirecionamento Login → Intranet → Departamento
2. Contexto global de obra
3. Intranet funcional

**Fase 2 (Alto Impacto):**
4. Competências frontend completo
5. RBAC básico no frontend

**Fase 3 (Melhorias):**
6. Rotas comerciais registradas
7. Comparativo MP x MC
8. Níveis operacional/tático/estratégico

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0  
**Próxima revisão:** Após implementação do MVP

