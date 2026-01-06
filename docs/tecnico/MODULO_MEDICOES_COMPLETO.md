================================================================================
MEMORIAL / RELATÓRIO / DOCUMENTO – ERP GENESIS
================================================================================
Produto................: ERP GENESIS
Versão.................: v1.0
Status.................: OFICIAL
Data...................: 2026-01-05
Hora...................: 17:30 (UTC-3)
IA Autora..............: Auto (Cursor AI)
Solicitante............: Proprietário do Produto / GC
Arquitetura............: ChatGPT + Cursor + v0 + Vercel
Origem do Documento....: Nova Criação
Documento Substitui....: —
Documento Substituído Por: —
Objetivo...............: Gestão de Alta Performance por Micro-Unidades de Resultado
================================================================================

# MÓDULO DE MEDIÇÕES - FLUXO COMPLETO E AUDITÁVEL
## Status: Operável e Auditável

## RESUMO EXECUTIVO

O módulo de Medições está completo, operável e auditável, com:
- Estados e transições validadas
- Regras de negócio implementadas
- Trava por competência fechada
- Auditoria completa (rastreabilidade)
- Contrato canônico de API
- Frontend funcional

## ESTADO ATUAL DO MÓDULO

### Arquivos Principais
- `src/api/routes/medicoes.routes.ts` - Rotas RESTful
- `src/api/controllers/MedicoesController.ts` - Controller com formato canônico
- `src/services/MedicaoService.ts` - Service layer com regras de negócio
- `src/types/medicao.ts` - Tipos TypeScript
- `app/obras/[id]/medicoes/page.tsx` - Frontend de medições
- `src/services/api/medicaoApi.ts` - Service de API para frontend

### Modelo Prisma (Medicao)
- Status: Enum `MedicaoStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED)
- Auditoria: `usuario_id`, `aprovado_por_id`, `rejeitado_por_id`
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Datas de aprovação/rejeição: `data_aprovacao`, `data_rejeicao`
- Motivo de rejeição: `motivo_rejeicao`
- Vinculação: `obra_id`, `eap_id`, `competencia_id`

## ESTADOS E TRANSIÇÕES

### Estados Disponíveis
1. **DRAFT** - Rascunho (pode ser editado)
2. **SUBMITTED** - Enviada para aprovação
3. **APPROVED** - Aprovada (não pode ser editada)
4. **REJECTED** - Rejeitada (pode voltar para DRAFT ou ser reenviada)

### Transições Permitidas
```typescript
DRAFT -> SUBMITTED          ✅ Permitido
SUBMITTED -> APPROVED       ✅ Permitido
SUBMITTED -> REJECTED       ✅ Permitido
REJECTED -> DRAFT           ✅ Permitido (correção)
REJECTED -> SUBMITTED       ✅ Permitido (reenvio)
APPROVED -> [qualquer]      ❌ Bloqueado
```

### Validação de Transições
- Implementada em `MedicaoService.validateStatusTransition()`
- Bloqueia transições inválidas com erro claro
- Aprovação bloqueada se não estiver em SUBMITTED

## REGRAS DE NEGÓCIO E VALIDAÇÕES

### Validações Implementadas

#### 1. Vinculação Obrigatória
- ✅ Medição deve estar vinculada a uma obra (`obra_id`)
- ✅ Medição deve ter usuário criador (`usuario_id`)
- ✅ EAP é opcional mas validada se fornecida
- ✅ Competência é opcional mas validada se fornecida

#### 2. Validação de Quantidade
- ✅ Quantidade medida deve ser maior que zero
- ✅ Validação na criação e atualização

#### 3. Validação de Submissão
- ✅ Não permite SUBMITTED se quantidade <= 0
- ✅ Valida competência aberta antes de submeter

#### 4. Bloqueio de Edição
- ✅ Medição APPROVED não pode ser editada
- ✅ Apenas DRAFT e REJECTED podem ser editados
- ✅ Validação em `validateCanEdit()`

#### 5. Trava por Competência Fechada
- ✅ Bloqueia criação se competência estiver fechada
- ✅ Bloqueia edição se competência estiver fechada
- ✅ Bloqueia submissão se competência estiver fechada
- ✅ Implementado em `validateCompetenciaAberta()`

### Fluxo de Validação
```
Criar Medição:
  1. Valida obra existe
  2. Valida usuário existe
  3. Valida EAP (se fornecida)
  4. Valida competência aberta (se fornecida)
  5. Valida quantidade > 0
  6. Cria como DRAFT

Editar Medição:
  1. Valida medição existe
  2. Valida status permite edição (DRAFT ou REJECTED)
  3. Valida competência aberta
  4. Valida EAP (se fornecida)
  5. Valida quantidade (se fornecida)

Submeter Medição:
  1. Valida medição existe
  2. Valida transição DRAFT -> SUBMITTED
  3. Valida quantidade > 0
  4. Valida competência aberta

Aprovar Medição:
  1. Valida medição existe
  2. Valida transição SUBMITTED -> APPROVED
  3. Registra aprovador e data

Rejeitar Medição:
  1. Valida medição existe
  2. Valida transição SUBMITTED -> REJECTED
  3. Valida motivo de rejeição obrigatório
  4. Registra rejeitador, data e motivo
```

## AUDITORIA E RASTREABILIDADE

### Campos de Auditoria
- **Criador**: `usuario_id` (obrigatório, não pode ser alterado)
- **Aprovador**: `aprovado_por_id`, `data_aprovacao`
- **Rejeitador**: `rejeitado_por_id`, `data_rejeicao`, `motivo_rejeicao`
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`

### Rastreabilidade Completa
- ✅ Quem criou (usuario_id)
- ✅ Quando criou (created_at)
- ✅ Quem aprovou (aprovado_por_id, data_aprovacao)
- ✅ Quem rejeitou (rejeitado_por_id, data_rejeicao, motivo_rejeicao)
- ✅ Última atualização (updated_at)
- ✅ Soft delete (deleted_at)

### Relações Prisma
- `usuario` - Usuário criador
- `aprovado_por` - Usuário aprovador
- `rejeitado_por` - Usuário rejeitador
- `obra` - Obra vinculada
- `eap` - EAP vinculada (opcional)
- `competencia` - Competência vinculada (opcional)

## ENDPOINTS (CONTRATO CANÔNICO)

### Endpoints Implementados

#### GET /api/medicoes/producao
- Lista Medições de Produção (MP) da obra ativa
- Query: `periodo` (opcional)
- Retorna: Formato canônico `{ data, meta, error }`

#### GET /api/medicoes/cliente
- Lista Medições do Cliente (MC) da obra ativa
- Query: `periodo` (opcional)
- Retorna: Formato canônico

#### GET /api/medicoes/comparativo
- Comparativo MP x MC da obra ativa
- Query: `periodo` (obrigatório)
- Retorna: Formato canônico

#### GET /api/medicoes/obra/:obra_id
- Lista medições por obra
- Query: `eap_id`, `usuario_id`, `periodo_referencia`, `status`, `includeDeleted`
- Retorna: Formato canônico

#### GET /api/medicoes
- Lista todas as medições (uso administrativo)
- Query: `obra_id`, `eap_id`, `usuario_id`, `periodo_referencia`, `status`, `includeDeleted`
- Retorna: Formato canônico

#### GET /api/medicoes/:id
- Busca medição por ID
- Retorna: Formato canônico com relacionamentos

#### POST /api/medicoes
- Cria nova medição (sempre como DRAFT)
- Body: `CreateMedicaoDto`
- Retorna: Formato canônico (201 Created)

#### PUT /api/medicoes/:id
- Atualiza medição (apenas se DRAFT ou REJECTED)
- Body: `UpdateMedicaoDto`
- Retorna: Formato canônico

#### POST /api/medicoes/:id/submit
- Submete medição (DRAFT -> SUBMITTED)
- Retorna: Formato canônico

#### POST /api/medicoes/:id/aprovar
- Aprova medição (SUBMITTED -> APPROVED)
- Body: `{ observacoes? }`
- Retorna: Formato canônico

#### POST /api/medicoes/:id/rejeitar
- Rejeita medição (SUBMITTED -> REJECTED)
- Body: `{ motivo_rejeicao: string }`
- Retorna: Formato canônico

#### DELETE /api/medicoes/:id
- Soft delete de medição
- Retorna: Formato canônico

### Proteção
- ✅ Todos os endpoints protegidos por `authMiddleware`
- ✅ Endpoints de obra validam acesso via `validateObraAccess`
- ✅ Endpoints de aprovação/rejeição requerem autenticação

## FRONTEND

### Página de Medições
- **Localização**: `app/obras/[id]/medicoes/page.tsx`
- **Funcionalidades**:
  - ✅ Listagem de medições por obra
  - ✅ Filtro por status
  - ✅ Badges de status (DRAFT, SUBMITTED, APPROVED, REJECTED)
  - ✅ Botão Enviar (submit) para DRAFT/REJECTED
  - ✅ Botão Aprovar para SUBMITTED (admin/gestor)
  - ✅ Botão Rejeitar para SUBMITTED (admin/gestor)
  - ✅ Modal de rejeição com motivo obrigatório
  - ✅ Exibição de motivo de rejeição
  - ✅ Validação de permissões (admin/gestor para aprovar/rejeitar)

### Service de API
- **Localização**: `src/services/api/medicaoApi.ts`
- **Funções**:
  - `listMedicoesByObra()` - Lista por obra
  - `getMedicaoById()` - Busca por ID
  - `createMedicao()` - Cria nova
  - `updateMedicao()` - Atualiza
  - `deleteMedicao()` - Deleta
  - `submitMedicao()` - Submete
  - `approveMedicao()` - Aprova
  - `rejectMedicao()` - Rejeita

## VALIDAÇÕES CRÍTICAS

### ✅ Implementadas
1. Medição vinculada a obra (obrigatório)
2. Medição vinculada a competência (opcional, mas validada)
3. EAP validada se fornecida
4. Quantidade > 0 obrigatória
5. Não permite SUBMITTED sem quantidade válida
6. Não permite edição de APPROVED
7. Trava por competência fechada (criação, edição, submissão)

### ✅ Transições Validadas
- DRAFT -> SUBMITTED
- SUBMITTED -> APPROVED
- SUBMITTED -> REJECTED
- REJECTED -> DRAFT
- REJECTED -> SUBMITTED
- APPROVED -> [bloqueado]

## CHECKLIST DE COMPLETUDE

### Backend
- [x] Modelo Prisma completo
- [x] Enum de status implementado
- [x] Transições validadas
- [x] Regras de negócio implementadas
- [x] Trava por competência fechada
- [x] Auditoria completa
- [x] Endpoints com contrato canônico
- [x] Validações críticas

### Frontend
- [x] Página de listagem
- [x] Filtros por status
- [x] Ações (submit, approve, reject)
- [x] Modal de rejeição
- [x] Exibição de status
- [x] Validação de permissões

### Integração
- [x] Service de API completo
- [x] Tipos TypeScript
- [x] Tratamento de erros

## CONCLUSÃO

O módulo de Medições está **COMPLETO, OPERÁVEL E AUDITÁVEL**:
- ✅ Estados e transições implementadas e validadas
- ✅ Regras de negócio críticas implementadas
- ✅ Trava por competência fechada funcionando
- ✅ Auditoria completa (rastreabilidade)
- ✅ Contrato canônico aplicado em todos os endpoints
- ✅ Frontend funcional com todas as ações necessárias

**Status**: Pronto para produção.

---

**Documento gerado automaticamente durante validação do módulo de Medições.**



