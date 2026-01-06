# 📋 PLANO DE IMPLEMENTAÇÃO - CONTRATO CANÔNICO API MVP

**Versão:** 1.0  
**Data:** Janeiro 2026  
**Baseado em:** `CONTRATO_CANONICO_API_MVP.md` (v1.0 - CONGELADO)

---

## 🎯 OBJETIVO

Implementar os endpoints do contrato canônico na ordem especificada, garantindo aderência total ao contrato travado.

---

## 📊 ORDEM DE IMPLEMENTAÇÃO

### 1️⃣ Auth (login/refresh/me)

**Status Atual:** ✅ Parcialmente implementado  
**O que falta:** Ajustar para seguir contrato canônico

#### Endpoints a implementar/ajustar:

- ✅ `POST /api/auth/login` - Existe, precisa ajustar resposta
- ✅ `POST /api/auth/refresh` - Existe, precisa ajustar resposta
- ✅ `GET /api/auth/me` - Existe, precisa retornar `ContextoUsuario`
- ✅ `POST /api/auth/logout` - Existe, precisa ajustar resposta

#### Ajustes necessários:

1. **Padronizar formato de resposta:**
   - Usar `{ "data": {...} }` em vez de resposta direta
   - Garantir formato canônico

2. **GET /api/auth/me:**
   - Retornar `ContextoUsuario` completo
   - Incluir `departamentoDefault`
   - Incluir `obraAtiva`
   - Incluir `permissoes.obras`

3. **Códigos de erro:**
   - Usar códigos canônicos (`AUTH_REQUIRED`, `AUTH_INVALID`)

**Arquivos a modificar:**
- `src/api/routes/auth.routes.ts`
- `src/services/api/authApi.ts` (frontend)

**Estimativa:** 2-3 horas

---

### 2️⃣ Obras (CRUD + Permissões)

**Status Atual:** ✅ Parcialmente implementado  
**O que falta:** Ajustar para seguir contrato canônico

#### Endpoints a implementar/ajustar:

- ✅ `GET /api/obras` - Existe, precisa adicionar paginação e formato canônico
- ✅ `GET /api/obras/:id` - Existe, precisa retornar `ObraDetalhe`
- ✅ `POST /api/obras` - Existe, precisa ajustar formato
- ✅ `PUT /api/obras/:id` - Existe, precisa ajustar formato
- ✅ `DELETE /api/obras/:id` - Existe, precisa ajustar formato

#### Ajustes necessários:

1. **Paginação:**
   - Adicionar query params `page` e `pageSize`
   - Retornar `meta` com paginação

2. **Formato de resposta:**
   - Usar `{ "data": {...} }` em todas as respostas
   - `GET /api/obras/:id` retornar `ObraDetalhe` com agregados

3. **Permissões:**
   - Validar acesso baseado em `permissoes.obras`
   - Admin tem acesso total
   - Outros só acessam obras permitidas

4. **Campos:**
   - Adicionar `uf` e `responsavel` se não existirem
   - Garantir `orcamentoTotal` como string

**Arquivos a modificar:**
- `src/api/routes/obras.routes.ts`
- `src/services/ObraService.ts`
- `src/services/api/obraApi.ts` (frontend)
- `prisma/schema.prisma` (se necessário adicionar campos)

**Estimativa:** 4-6 horas

---

### 3️⃣ Contexto Obra Ativa

**Status Atual:** ❌ Não implementado  
**O que falta:** Criar do zero

#### Endpoints a implementar:

- ❌ `GET /api/contexto/obra-ativa` - Criar
- ❌ `PUT /api/contexto/obra-ativa` - Criar

#### Implementação necessária:

1. **Backend:**
   - Criar rota `/api/contexto/obra-ativa`
   - Persistir obra ativa (pode ser em sessão/banco ou apenas retornar do contexto)
   - Validar permissão de acesso à obra

2. **Frontend:**
   - Criar serviço para gerenciar obra ativa
   - Criar Context API (`ObraContext`)
   - Persistir em localStorage/sessionStorage
   - Atualizar MainLayout para usar contexto

3. **Estratégia de persistência:**
   - Opção 1: Armazenar no banco (tabela `usuario_obra_ativa`)
   - Opção 2: Armazenar apenas no frontend (localStorage)
   - **Recomendação MVP:** localStorage + endpoint para validar acesso

**Arquivos a criar:**
- `src/api/routes/contexto.routes.ts` (novo)
- `src/services/ContextoService.ts` (novo)
- `src/services/api/contextoApi.ts` (novo - frontend)
- `src/contexts/ObraContext.tsx` (novo - frontend)

**Arquivos a modificar:**
- `src/api/app.ts` (registrar nova rota)
- `src/components/MainLayout.tsx` (usar contexto)

**Estimativa:** 4-5 horas

---

### 4️⃣ Competência + Gates + Concluir

**Status Atual:** ✅ Backend implementado, precisa ajustar para contrato  
**O que falta:** Ajustar formato e adicionar endpoint de conclusão

#### Endpoints a implementar/ajustar:

- ✅ `GET /api/obras/:obraId/competencias` - Existe, precisa ajustar formato
- ✅ `POST /api/obras/:obraId/competencias` - Existe, precisa ajustar formato
- ✅ `GET /api/competencias/:competenciaId` - Existe, precisa ajustar formato
- ✅ `PATCH /api/competencias/:competenciaId/gates/:numero` - Existe, precisa ajustar formato
- ❌ `POST /api/competencias/:competenciaId/concluir` - Criar

#### Ajustes necessários:

1. **Formato de resposta:**
   - Usar `{ "data": {...} }` em todas as respostas
   - Retornar `CompetenciaMensal` completo com `gates` e `travasAtivas`

2. **Estrutura de dados:**
   - `CompetenciaMensal` deve ter:
     - `travasAtivas: { qualidade: boolean, ssma: boolean }`
     - `gates: [GateStatus]` (sempre 9 itens)
   - `GateStatus` deve ter:
     - `isTrava: boolean` (true para Gates 5 e 6)
     - Todos os campos canônicos

3. **Endpoint de conclusão:**
   - Criar `POST /api/competencias/:competenciaId/concluir`
   - Validar travas (qualidade e ssma)
   - Validar Gate 9 aprovado
   - Retornar 409 CONFLICT se houver bloqueios
   - Atualizar status para `"concluida"` e preencher `concluidaEm`

4. **Regras de negócio:**
   - Ao criar competência: gerar 9 gates automaticamente
   - Gate 5 e Gate 6 com `isTrava=true`
   - Calcular `travasAtivas` dinamicamente

**Arquivos a modificar:**
- `src/api/routes/competencias.routes.ts`
- `src/services/CompetenciaService.ts`
- `src/services/api/competenciaApi.ts` (frontend - criar se não existir)

**Arquivos a criar:**
- Endpoint de conclusão em `competencias.routes.ts`

**Estimativa:** 6-8 horas

---

## 📊 RESUMO DE ESFORÇO

| Fase | Status | Estimativa | Prioridade |
|------|--------|------------|------------|
| 1. Auth | ✅ Parcial | 2-3h | 🔴 Crítico |
| 2. Obras | ✅ Parcial | 4-6h | 🔴 Crítico |
| 3. Contexto | ❌ Novo | 4-5h | 🔴 Crítico |
| 4. Competências | ✅ Parcial | 6-8h | 🔴 Crítico |
| **TOTAL** | | **16-22h** | |

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Auth
- [ ] Ajustar `POST /api/auth/login` para formato canônico
- [ ] Ajustar `POST /api/auth/refresh` para formato canônico
- [ ] Implementar `GET /api/auth/me` retornando `ContextoUsuario`
- [ ] Ajustar `POST /api/auth/logout` para formato canônico
- [ ] Atualizar códigos de erro para canônicos
- [ ] Testar todos os endpoints

### Fase 2: Obras
- [ ] Adicionar paginação em `GET /api/obras`
- [ ] Ajustar formato de resposta para canônico
- [ ] Implementar `GET /api/obras/:id` retornando `ObraDetalhe`
- [ ] Adicionar validação de permissões
- [ ] Garantir campos `uf` e `responsavel`
- [ ] Testar CRUD completo

### Fase 3: Contexto
- [ ] Criar rota `GET /api/contexto/obra-ativa`
- [ ] Criar rota `PUT /api/contexto/obra-ativa`
- [ ] Criar `ObraContext` no frontend
- [ ] Implementar persistência (localStorage)
- [ ] Atualizar MainLayout para usar contexto
- [ ] Testar seleção e persistência de obra

### Fase 4: Competências
- [ ] Ajustar formato de resposta para canônico
- [ ] Implementar `travasAtivas` calculado dinamicamente
- [ ] Garantir `gates` sempre com 9 itens
- [ ] Criar `POST /api/competencias/:competenciaId/concluir`
- [ ] Implementar validações de travas
- [ ] Implementar validação de Gate 9
- [ ] Testar fluxo completo de fechamento

---

## 🔍 VALIDAÇÃO FINAL

Após implementação, validar:

1. ✅ Todos os endpoints seguem formato canônico `{ "data": {...} }`
2. ✅ Todos os erros seguem formato canônico `{ "error": {...} }`
3. ✅ Códigos de erro são canônicos
4. ✅ Modelos (shapes) correspondem exatamente ao contrato
5. ✅ Regras de negócio implementadas corretamente
6. ✅ Permissões funcionando (multi-obra)
7. ✅ Travas de competência funcionando
8. ✅ Frontend consumindo API corretamente

---

## 📝 OBSERVAÇÕES

1. **Contrato congelado:** Não alterar sem ordem do Gutemberg
2. **Formato decimal:** Sempre usar string para valores monetários
3. **Datas:** Sempre ISO 8601 UTC
4. **Paginação:** Implementar onde fizer sentido
5. **Permissões:** Validar em todos os endpoints protegidos

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0  
**Status:** 🟢 Plano de Implementação Ativo


