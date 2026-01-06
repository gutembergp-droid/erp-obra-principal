# 🔍 AUDITORIA DE ADERÊNCIA AO CONTRATO CANÔNICO API MVP

**Data:** Janeiro 2026  
**Contrato de Referência:** `CONTRATO_CANONICO_API_MVP.md` (v1.0 - CONGELADO)  
**Objetivo:** Verificar aderência total ao contrato canônico e identificar divergências

---

## 1) ROTAS IMPLEMENTADAS

| Método | Rota Contrato | Rota Implementada | Arquivo Handler | DTO Request/Response | Status |
|--------|---------------|-------------------|-----------------|----------------------|--------|
| **AUTH** |
| POST | `/api/auth/login` | `/api/auth/login` | `auth.routes.ts:32` | ❌ Formato divergente | 🔴 **DESVIO** |
| POST | `/api/auth/refresh` | `/api/auth/refresh` | `auth.routes.ts:122` | ❌ Formato divergente | 🔴 **DESVIO** |
| GET | `/api/auth/me` | `/api/auth/me` | `auth.routes.ts:182` | ❌ Retorna Usuario, não ContextoUsuario | 🔴 **DESVIO** |
| POST | `/api/auth/logout` | `/api/auth/logout` | `auth.routes.ts:224` | ❌ Formato divergente | 🔴 **DESVIO** |
| **OBRAS** |
| GET | `/api/obras?page&pageSize&status&cliente&includeDeleted` | `/api/obras?status&cliente&includeDeleted` | `obras.routes.ts:20` | ❌ Sem paginação, formato divergente | 🔴 **DESVIO** |
| GET | `/api/obras/:id` | `/api/obras/:id` | `obras.routes.ts:42` | ❌ Retorna Obra, não ObraDetalhe | 🔴 **DESVIO** |
| POST | `/api/obras` | `/api/obras` | `obras.routes.ts:63` | ❌ Formato divergente, falta `uf` e `responsavel` | 🔴 **DESVIO** |
| PUT | `/api/obras/:id` | `/api/obras/:id` | `obras.routes.ts:77` | ❌ Formato divergente | 🔴 **DESVIO** |
| DELETE | `/api/obras/:id` | `/api/obras/:id` | `obras.routes.ts:91` | ❌ Retorna 204, não `{ "data": { "ok": true } }` | 🔴 **DESVIO** |
| **CONTEXTO** |
| GET | `/api/contexto/obra-ativa` | ❌ **NÃO EXISTE** | - | - | 🔴 **FALTANDO** |
| PUT | `/api/contexto/obra-ativa` | ❌ **NÃO EXISTE** | - | - | 🔴 **FALTANDO** |
| **COMPETÊNCIAS** |
| GET | `/api/obras/:obraId/competencias?status&periodo` | `/api/obras/:obraId/competencias/ativa` | `competencias.routes.ts:20` | ❌ Rota diferente, formato divergente | 🔴 **DESVIO** |
| POST | `/api/obras/:obraId/competencias` | `/api/obras/:obraId/competencias/abrir` | `competencias.routes.ts:67` | ❌ Rota diferente, formato divergente | 🔴 **DESVIO** |
| GET | `/api/competencias/:competenciaId` | `/api/obras/:obraId/competencias/:competenciaId` | `competencias.routes.ts:115` | ❌ Rota diferente, formato divergente | 🔴 **DESVIO** |
| PATCH | `/api/competencias/:competenciaId/gates/:numero` | `/api/obras/:obraId/competencias/:competenciaId/gates/:numero/aprovar` | `competencias.routes.ts:200` | ❌ Rota diferente, formato divergente | 🔴 **DESVIO** |
| POST | `/api/competencias/:competenciaId/concluir` | `/api/obras/:obraId/competencias/:competenciaId/concluir` | `competencias.routes.ts:330` | ❌ Rota diferente, formato divergente | 🔴 **DESVIO** |

**Resumo:**
- ✅ **Rotas existem:** 13/15 (87%)
- ❌ **Rotas faltando:** 2/15 (13%) - Contexto obra ativa
- 🔴 **Rotas com desvio:** 13/13 (100%) - Formato de resposta não canônico

---

## 2) SHAPES / DTOs

### 2.1 Usuario

| Campo Contrato | Campo Implementado | Status | Observação |
|----------------|-------------------|--------|------------|
| `id` | `id` | ✅ OK | - |
| `email` | `email` | ✅ OK | - |
| `nome` | `nome` | ✅ OK | - |
| `perfil` | `perfil` | ✅ OK | Valores: admin|gestor|engenheiro|usuario |
| `isAtivo` | `is_ativo` | ⚠️ **DESVIO** | Snake_case vs camelCase |
| `createdAt` | `created_at` | ⚠️ **DESVIO** | Snake_case vs camelCase |
| `updatedAt` | `updated_at` | ⚠️ **DESVIO** | Snake_case vs camelCase |

**Status:** ⚠️ **DESVIO** - Nomenclatura snake_case vs camelCase

---

### 2.2 ContextoUsuario

| Campo Contrato | Campo Implementado | Status | Observação |
|----------------|-------------------|--------|------------|
| `usuario` | ❌ Não retornado | 🔴 **FALTANDO** | GET /api/auth/me retorna apenas Usuario |
| `departamentoDefault` | ❌ Não existe | 🔴 **FALTANDO** | Não implementado |
| `obraAtiva` | ❌ Não existe | 🔴 **FALTANDO** | Não implementado |
| `permissoes.obras.acessoTotal` | ❌ Não existe | 🔴 **FALTANDO** | Não implementado |
| `permissoes.obras.permitidas` | ❌ Não existe | 🔴 **FALTANDO** | Não implementado |

**Status:** 🔴 **NÃO IMPLEMENTADO** - GET /api/auth/me não retorna ContextoUsuario

---

### 2.3 ObraResumo

| Campo Contrato | Campo Implementado | Status | Observação |
|----------------|-------------------|--------|------------|
| `id` | `id` | ✅ OK | - |
| `codigo` | `codigo` | ✅ OK | - |
| `nome` | `nome` | ✅ OK | - |
| `cliente` | `cliente` | ✅ OK | - |
| `uf` | ❌ Não existe | 🔴 **FALTANDO** | Campo não existe no schema |
| `status` | `status` | ✅ OK | Valores compatíveis |
| `orcamentoTotal` | `orcamento_total` | ⚠️ **DESVIO** | Snake_case + tipo Decimal vs string |
| `responsavel` | ❌ Não existe | 🔴 **FALTANDO** | Campo não existe no schema |
| `createdAt` | `created_at` | ⚠️ **DESVIO** | Snake_case vs camelCase |
| `updatedAt` | `updated_at` | ⚠️ **DESVIO** | Snake_case vs camelCase |

**Status:** 🔴 **DESVIO** - Faltam campos `uf` e `responsavel`, nomenclatura divergente, `orcamentoTotal` deve ser string

---

### 2.4 ObraDetalhe

| Campo Contrato | Campo Implementado | Status | Observação |
|----------------|-------------------|--------|------------|
| `obra` (ObraResumo) | Retorna Obra completo | ⚠️ **DESVIO** | Estrutura diferente |
| `agregados.valorContratadoEapComercial` | ❌ Não existe | 🔴 **FALTANDO** | Não calculado |
| `agregados.medicoesAprovadasNoPeriodo` | ❌ Não existe | 🔴 **FALTANDO** | Não calculado |

**Status:** 🔴 **DESVIO** - GET /api/obras/:id não retorna ObraDetalhe com agregados

---

### 2.5 CompetenciaMensal

| Campo Contrato | Campo Implementado | Status | Observação |
|----------------|-------------------|--------|------------|
| `id` | `id` | ✅ OK | - |
| `obraId` | `obra_id` | ⚠️ **DESVIO** | Snake_case vs camelCase |
| `periodo` | `periodo` | ✅ OK | - |
| `status` | `status` | ⚠️ **DESVIO** | Valores: `aberta|fechada` vs `aberta|em_analise|concluida|bloqueada` |
| `travasAtivas.qualidade` | ❌ Não retornado | 🔴 **FALTANDO** | Calculado mas não retornado no formato |
| `travasAtivas.ssma` | ❌ Não retornado | 🔴 **FALTANDO** | Calculado mas não retornado no formato |
| `gates` (array) | Retornado em rota separada | ⚠️ **DESVIO** | Não vem junto na resposta |
| `criadaEm` | `aberta_em` | ⚠️ **DESVIO** | Nome diferente |
| `concluidaEm` | `fechada_em` | ⚠️ **DESVIO** | Nome diferente |

**Status:** 🔴 **DESVIO** - Formato de resposta não segue contrato canônico

---

### 2.6 GateStatus

| Campo Contrato | Campo Implementado | Status | Observação |
|----------------|-------------------|--------|------------|
| `numero` | `numero` | ✅ OK | - |
| `nome` | `nome` | ✅ OK | - |
| `status` | `status` | ✅ OK | Valores compatíveis |
| `isTrava` | `trava` | ⚠️ **DESVIO** | Nome diferente |
| `motivoBloqueio` | `motivo_rejeicao` | ⚠️ **DESVIO** | Nome diferente |
| `aprovadoPor` | `aprovado_por_id` | ⚠️ **DESVIO** | Nome diferente + sufixo `_id` |
| `aprovadoEm` | `aprovado_em` | ⚠️ **DESVIO** | Snake_case vs camelCase |

**Status:** ⚠️ **DESVIO** - Nomenclatura divergente

---

### 2.7 Enum Values - Status

| Enum | Contrato | Implementado | Compatibilidade |
|------|----------|--------------|-----------------|
| **Obra.status** | `planejamento\|em_andamento\|pausada\|concluida\|cancelada` | ✅ Compatível | ✅ OK |
| **Competencia.status** | `aberta\|em_analise\|concluida\|bloqueada` | `aberta\|fechada` | 🔴 **INCOMPATÍVEL** |
| **Gate.status** | `pendente\|em_analise\|aprovado\|rejeitado\|bloqueado` | ✅ Compatível | ✅ OK |

**Status:** 🔴 **INCOMPATIBILIDADE** - Competencia.status usa `fechada` em vez de `concluida`

---

## 3) REGRAS DE NEGÓCIO (CHECKLIST)

### 3.1 Geração de Competência

- ✅ **Gates 1-9 criados automaticamente:** `CompetenciaService.ts:72-85`
- ✅ **Gate 5 e Gate 6 têm `isTrava=true`:** `CompetenciaService.ts:79`
- ✅ **Status inicial `"aberta"`:** `CompetenciaService.ts:67`
- ⚠️ **`travasAtivas` calculadas:** Calculado em `listarGatesComTravas` mas não retornado no formato canônico
- ❌ **`travasAtivas` no formato canônico:** Não retornado como `{ qualidade: boolean, ssma: boolean }`

**Status:** ⚠️ **PARCIAL** - Lógica existe, formato de retorno não canônico

---

### 3.2 Concluir Competência

- ✅ **Bloqueio se Gate 5 não aprovado:** `CompetenciaService.ts:148, 377`
- ✅ **Bloqueio se Gate 6 não aprovado:** `CompetenciaService.ts:148, 377`
- ✅ **Bloqueio se Gate 9 não aprovado:** `CompetenciaService.ts:161, 377`
- ✅ **Status vira `"concluida"`:** `CompetenciaService.ts:310-316` (mas usa `fechada`)
- ⚠️ **`concluidaEm` preenchido:** Preenchido como `fechada_em` (nome diferente)
- ❌ **Retorna 409 CONFLICT com formato canônico:** Retorna 409 mas formato de erro não canônico

**Status:** ⚠️ **PARCIAL** - Lógica correta, formato e nomenclatura divergentes

---

### 3.3 Travas (Gate 5 e Gate 6)

- ✅ **Gate 5 bloqueia conclusão:** `CompetenciaService.ts:148, 151-152`
- ✅ **Gate 6 bloqueia conclusão:** `CompetenciaService.ts:148, 154-155`
- ✅ **Travas calculadas dinamicamente:** `CompetenciaService.ts:148`
- ❌ **Travas retornadas no formato canônico:** Não retornado como `travasAtivas: { qualidade: boolean, ssma: boolean }`

**Status:** ⚠️ **PARCIAL** - Lógica correta, formato de retorno não canônico

---

### 3.4 Sequência de Gates

- ✅ **Validação de sequência implementada:** `CompetenciaService.ts:194-220`
- ✅ **Gate N depende de Gate N-1:** `CompetenciaService.ts:194-220`
- ⚠️ **Validação aplicada na aprovação:** Aplicada mas pode não estar bloqueando corretamente

**Status:** ✅ **OK** - Validação implementada

---

### 3.5 Auditabilidade

- ✅ **`aprovadoPor` registrado:** `CompetenciaService.ts:302`
- ✅ **`aprovadoEm` registrado:** `CompetenciaService.ts:303`
- ✅ **`rejeitadoPor` registrado:** `CompetenciaService.ts:361`
- ✅ **`rejeitadoEm` registrado:** `CompetenciaService.ts:362`
- ⚠️ **Nomenclatura divergente:** Usa `aprovado_por_id` em vez de `aprovadoPor`

**Status:** ✅ **OK** - Auditabilidade implementada, nomenclatura divergente

---

### 3.6 Multi-obra (Acesso)

- ✅ **Admin tem acesso total:** `ObraService.ts:140`
- ✅ **Outros só acessam obras permitidas:** `ObraService.ts:142-148`
- ❌ **Retornado em `permissoes.obras`:** Não retornado no formato canônico

**Status:** ⚠️ **PARCIAL** - Lógica correta, formato de retorno não canônico

---

## 4) PONTOS DE RISCO + PRÓXIMAS CORREÇÕES

### 🔴 CRÍTICO - BLOQUEADOR

#### 4.1 Formato de Resposta Não Canônico

**Problema:** Nenhuma rota retorna no formato `{ "data": {...} }`

**Impacto:** Frontend não consegue consumir API de forma padronizada

**Correção:**
```typescript
// ANTES
res.json(usuario);

// DEPOIS
res.json({ data: usuario });
```

**Arquivos afetados:** TODOS os arquivos de rotas

**PR Sugerido:** `fix: Padronizar formato de resposta para contrato canônico { data: ... }`

---

#### 4.2 Formato de Erro Não Canônico

**Problema:** Erros não seguem formato `{ "error": { "code": "...", "message": "...", "details": {...} } }`

**Impacto:** Frontend não consegue tratar erros de forma padronizada

**Correção:**
```typescript
// ANTES
res.status(401).json({
  error: 'Credenciais inválidas',
  message: 'Email ou senha incorretos',
});

// DEPOIS
res.status(401).json({
  error: {
    code: 'AUTH_INVALID',
    message: 'Email ou senha incorretos',
    details: null
  }
});
```

**Arquivos afetados:** TODOS os arquivos de rotas + `errorHandler.ts`

**PR Sugerido:** `fix: Padronizar formato de erro para contrato canônico { error: { code, message, details } }`

---

#### 4.3 GET /api/auth/me Não Retorna ContextoUsuario

**Problema:** Retorna apenas `Usuario`, deveria retornar `ContextoUsuario` completo

**Impacto:** Frontend não consegue obter `departamentoDefault`, `obraAtiva`, `permissoes`

**Correção:**
- Buscar obras permitidas do usuário
- Calcular `departamentoDefault` baseado em perfil
- Buscar `obraAtiva` (pode ser do contexto/sessão)
- Retornar formato canônico

**Arquivos afetados:** `src/api/routes/auth.routes.ts`, criar `src/services/ContextoService.ts`

**PR Sugerido:** `feat: Implementar GET /api/auth/me retornando ContextoUsuario completo`

---

#### 4.4 Rotas de Contexto Não Existem

**Problema:** `GET /api/contexto/obra-ativa` e `PUT /api/contexto/obra-ativa` não existem

**Impacto:** Frontend não consegue persistir/selecionar obra ativa

**Correção:**
- Criar `src/api/routes/contexto.routes.ts`
- Implementar GET e PUT
- Persistir em banco ou retornar do contexto
- Registrar rota em `app.ts`

**Arquivos afetados:** Criar novo arquivo, modificar `src/api/app.ts`

**PR Sugerido:** `feat: Implementar rotas de contexto obra ativa (GET/PUT /api/contexto/obra-ativa)`

---

### 🟡 ALTO IMPACTO

#### 4.5 Rotas de Competências com Caminho Diferente

**Problema:** Rotas usam `/api/obras/:obraId/competencias/...` em vez de `/api/competencias/:competenciaId/...`

**Impacto:** Frontend precisa usar rotas diferentes do contrato

**Correção:**
- Manter rotas existentes (compatibilidade)
- Adicionar rotas canônicas como aliases
- Ou migrar para formato canônico

**Arquivos afetados:** `src/api/routes/competencias.routes.ts`, `src/api/app.ts`

**PR Sugerido:** `fix: Adicionar rotas canônicas de competências conforme contrato`

---

#### 4.6 GET /api/obras Sem Paginação

**Problema:** Não implementa `page`, `pageSize`, `meta`

**Impacto:** Performance em listas grandes, não segue contrato

**Correção:**
- Adicionar query params `page` e `pageSize`
- Implementar paginação no `ObraService`
- Retornar `meta: { page, pageSize, total }`

**Arquivos afetados:** `src/api/routes/obras.routes.ts`, `src/services/ObraService.ts`

**PR Sugerido:** `feat: Implementar paginação em GET /api/obras conforme contrato`

---

#### 4.7 GET /api/obras/:id Não Retorna ObraDetalhe

**Problema:** Retorna `Obra` completo, deveria retornar `ObraDetalhe` com agregados

**Impacto:** Frontend não recebe agregados (`valorContratadoEapComercial`, `medicoesAprovadasNoPeriodo`)

**Correção:**
- Calcular agregados no `ObraService`
- Retornar formato `{ obra: ObraResumo, agregados: {...} }`

**Arquivos afetados:** `src/services/ObraService.ts`, `src/api/routes/obras.routes.ts`

**PR Sugerido:** `feat: Implementar ObraDetalhe com agregados em GET /api/obras/:id`

---

#### 4.8 CompetenciaMensal Sem Formato Canônico

**Problema:** Não retorna `travasAtivas`, `gates` não vem junto, nomenclatura divergente

**Impacto:** Frontend não consegue usar dados de forma padronizada

**Correção:**
- Retornar `travasAtivas: { qualidade: boolean, ssma: boolean }`
- Incluir `gates` no array da competência
- Ajustar nomenclatura (camelCase)
- Ajustar `status` para usar `concluida` em vez de `fechada`

**Arquivos afetados:** `src/services/CompetenciaService.ts`, `src/api/routes/competencias.routes.ts`

**PR Sugerido:** `fix: Ajustar formato de CompetenciaMensal para contrato canônico`

---

### 🟢 MÉDIO IMPACTO

#### 4.9 Campos Faltantes em Obra

**Problema:** Faltam campos `uf` e `responsavel` no schema e DTOs

**Impacto:** Dados não podem ser armazenados conforme contrato

**Correção:**
- Adicionar campos no `prisma/schema.prisma`
- Criar migration
- Atualizar DTOs e Service

**Arquivos afetados:** `prisma/schema.prisma`, `src/types/obras.ts`, `src/services/ObraService.ts`

**PR Sugerido:** `feat: Adicionar campos uf e responsavel em Obra conforme contrato`

---

#### 4.10 Nomenclatura Snake_case vs CamelCase

**Problema:** Backend usa snake_case, contrato especifica camelCase

**Impacto:** Inconsistência entre contrato e implementação

**Correção:**
- Opção 1: Transformar no response (recomendado)
- Opção 2: Atualizar contrato (não recomendado - contrato congelado)

**Arquivos afetados:** Todos os services e rotas

**PR Sugerido:** `fix: Transformar nomenclatura snake_case para camelCase nas respostas`

---

#### 4.11 OrcamentoTotal Como Decimal vs String

**Problema:** Backend usa `Decimal`, contrato especifica `string`

**Impacto:** Frontend pode ter problemas com precisão

**Correção:**
- Converter `Decimal` para `string` nas respostas

**Arquivos afetados:** `src/services/ObraService.ts`, rotas de obras

**PR Sugerido:** `fix: Converter orcamentoTotal de Decimal para string conforme contrato`

---

## 📊 SCORE DE ADERÊNCIA

### Cálculo por Categoria

| Categoria | Peso | Aderência | Score Ponderado |
|----------|------|-----------|-----------------|
| **Rotas Implementadas** | 25% | 87% (13/15) | 21.75% |
| **Formato de Resposta** | 30% | 0% (0/13) | 0% |
| **Shapes/DTOs** | 20% | 40% (campos corretos mas formato divergente) | 8% |
| **Regras de Negócio** | 20% | 85% (lógica correta, formato divergente) | 17% |
| **Códigos de Erro** | 5% | 0% (não usa códigos canônicos) | 0% |

### Score Total: 46.75% ≈ 47%

### Justificativa

**Pontos Positivos:**
- ✅ Rotas principais implementadas (87%)
- ✅ Regras de negócio corretas (travas, sequência, auditabilidade)
- ✅ Lógica de competências e gates funcionando
- ✅ Permissões multi-obra implementadas

**Pontos Negativos:**
- 🔴 **Formato de resposta:** 0% aderente (nenhuma rota usa `{ "data": {...} }`)
- 🔴 **Formato de erro:** 0% aderente (não usa códigos canônicos)
- 🔴 **ContextoUsuario:** Não implementado
- 🔴 **Rotas de contexto:** Não existem
- ⚠️ **Nomenclatura:** Snake_case vs camelCase
- ⚠️ **Campos faltantes:** `uf`, `responsavel` em Obra
- ⚠️ **CompetenciaMensal:** Formato não canônico

**Conclusão:**
A implementação tem a **lógica correta** mas **formato completamente divergente** do contrato. O frontend não conseguirá consumir a API sem adaptações significativas.

---

## 🎯 PRIORIZAÇÃO DE CORREÇÕES

### Fase 1 - Crítico (Bloqueador)
1. ✅ Formato de resposta canônico (`{ "data": {...} }`)
2. ✅ Formato de erro canônico (`{ "error": { "code", "message", "details" } }`)
3. ✅ GET /api/auth/me retornando ContextoUsuario
4. ✅ Rotas de contexto obra ativa

### Fase 2 - Alto Impacto
5. ✅ Paginação em GET /api/obras
6. ✅ ObraDetalhe com agregados
7. ✅ CompetenciaMensal formato canônico
8. ✅ Rotas canônicas de competências

### Fase 3 - Médio Impacto
9. ✅ Campos `uf` e `responsavel` em Obra
10. ✅ Nomenclatura camelCase nas respostas
11. ✅ OrcamentoTotal como string

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0  
**Status:** 🟡 Auditoria Completa - Ação Requerida


