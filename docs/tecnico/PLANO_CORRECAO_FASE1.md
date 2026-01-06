# 🔧 PLANO DE CORREÇÃO - FASE 1
## Organização (Curta, Obrigatória)

**Data:** Janeiro 2026  
**Baseado em:** Validação Arquitetural Externa  
**Status:** 🟡 Aguardando Implementação

---

## OBJETIVO

Ajustar semântica e estrutura antes de expandir, evitando dívida técnica.

**Estimativa:** 3-5 dias  
**Prioridade:** 🔴 CRÍTICA

---

## TAREFA 1: AJUSTAR MODELO GATE (FIXAR G1–G9)

### 1.1. Atualizar Schema Prisma

**Arquivo:** `prisma/schema.prisma`

**Mudanças:**
- Adicionar enum para códigos de gate
- Adicionar constraint que limita a 9 gates
- Adicionar campo `gate_oficial` (Boolean) para identificar gates oficiais

**Código:**
```prisma
enum GateCodigo {
  G1  // Liberação da Obra
  G2  // Fechamento de Produção
  G3  // Fechamento de Custos
  G4  // Fechamento Comercial
  G5  // Qualidade OK
  G6  // SST OK
  G7  // Financeiro OK
  G8  // Gerencial OK
  G9  // Competência Concluída
}

model Gate {
  // ... campos existentes
  codigo GateCodigo  // Mudar de String para Enum
  gate_oficial Boolean @default(true) @map("gate_oficial")
  // ... resto
}
```

### 1.2. Atualizar GateService

**Arquivo:** `src/services/GateService.ts`

**Mudanças:**
- Validação que impede criar gates fora dos 9 oficiais
- Método para inicializar os 9 gates oficiais em uma obra
- Validação de sequência (Gate N só após Gate N-1)
- Validação de bloqueio (Gate 9 só se Gate 5 e Gate 6 OK)

### 1.3. Atualizar Rotas

**Arquivo:** `src/api/routes/gates.routes.ts`

**Mudanças:**
- Endpoint `POST /api/gates` - Criar gate (apenas os 9 oficiais)
- Endpoint `POST /api/gates/:id/aprovar` - Aprovar gate
- Validações de sequência e bloqueios

### 1.4. Criar Migration

**Comando:**
```bash
npx prisma migrate dev --name fix_gate_enum
```

---

## TAREFA 2: AJUSTAR MEDIÇÃO (MP/MC)

### 2.1. Atualizar Schema Prisma

**Arquivo:** `prisma/schema.prisma`

**Mudanças:**
- Adicionar enum para tipo de medição
- Adicionar campo obrigatório `tipo`

**Código:**
```prisma
enum TipoMedicao {
  MP  // Medição de Produção
  MC  // Medição do Cliente
}

model Medicao {
  // ... campos existentes
  tipo TipoMedicao  // Adicionar campo obrigatório
  // ... resto
}
```

### 2.2. Atualizar Tipos TypeScript

**Arquivo:** `src/types/medicao.ts`

**Mudanças:**
- Adicionar tipo `TipoMedicao = 'MP' | 'MC'`
- Atualizar interface `Medicao`
- Criar interfaces separadas: `MedicaoProducao`, `MedicaoCliente`

### 2.3. Atualizar MedicaoService

**Arquivo:** `src/services/MedicaoService.ts`

**Mudanças:**
- Separar métodos: `createMP()`, `createMC()`
- Método `getComparativo(obraId, periodo)` - Comparativo MP x MC
- Validações específicas por tipo

### 2.4. Criar Rotas do Comercial

**Arquivo:** `src/api/routes/comercial.routes.ts` (NOVO)

**Endpoints:**
- `GET /api/comercial/medicao-producao/obra/:obra_id`
- `POST /api/comercial/medicao-producao`
- `GET /api/comercial/medicao-cliente/obra/:obra_id`
- `POST /api/comercial/medicao-cliente`
- `GET /api/comercial/comparativo/obra/:obra_id` - Comparativo MP x MC (acesso restrito)

### 2.5. Atualizar Rotas Existentes

**Arquivo:** `src/api/routes/medicoes.routes.ts`

**Mudanças:**
- Manter endpoints genéricos (para compatibilidade)
- Adicionar filtro por tipo
- Deprecar endpoints genéricos (marcar como deprecated)

### 2.6. Criar Migration

**Comando:**
```bash
npx prisma migrate dev --name add_medicao_tipo
```

---

## TAREFA 3: CRIAR ESQUELETO DE COMPETENCIAMENSAL

### 3.1. Criar Modelo Prisma

**Arquivo:** `prisma/schema.prisma`

**Código:**
```prisma
model CompetenciaMensal {
  id            String    @id @default(uuid())
  obra_id       String    @map("obra_id")
  periodo       String    // Formato: "2026-01"
  status        String    @default("aberta") // aberta, fechada, reaberta
  data_abertura DateTime  @default(now()) @map("data_abertura")
  data_fechamento DateTime? @map("data_fechamento")
  fechada_por   String?   @map("fechada_por") // usuario_id
  observacoes   String?
  
  // Relações
  obra Obra @relation(fields: [obra_id], references: [id], onDelete: Cascade)
  gates Gate[] // Gates vinculados a esta competência
  
  // Timestamps
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")
  deleted_at DateTime? @map("deleted_at")
  
  @@unique([obra_id, periodo])
  @@index([obra_id])
  @@index([periodo])
  @@index([status])
  @@map("competencia_mensal")
}
```

### 3.2. Atualizar Modelo Obra

**Arquivo:** `prisma/schema.prisma`

**Mudanças:**
- Adicionar relação com `CompetenciaMensal`

### 3.3. Atualizar Modelo Gate

**Arquivo:** `prisma/schema.prisma`

**Mudanças:**
- Adicionar campo `competencia_mensal_id` (opcional)
- Adicionar relação com `CompetenciaMensal`

### 3.4. Criar Tipos TypeScript

**Arquivo:** `src/types/competencia-mensal.ts` (NOVO)

**Conteúdo:**
- Interface `CompetenciaMensal`
- DTOs: `CreateCompetenciaMensalDto`, `FecharCompetenciaMensalDto`

### 3.5. Criar Migration

**Comando:**
```bash
npx prisma migrate dev --name add_competencia_mensal
```

---

## TAREFA 4: CRIAR SERVIÇO CENTRAL DE VALIDAÇÃO DE FECHAMENTO

### 4.1. Criar FechamentoService

**Arquivo:** `src/services/FechamentoService.ts` (NOVO)

**Métodos:**
- `validarGates(obraId, periodo)` - Valida se todos os gates estão aprovados
- `verificarBloqueios(obraId, periodo)` - Verifica se Gate 5 e Gate 6 estão OK
- `podeFechar(obraId, periodo)` - Verifica se pode fechar competência
- `fecharCompetencia(obraId, periodo, usuarioId)` - Fecha competência

### 4.2. Integrar com GateService

**Arquivo:** `src/services/GateService.ts`

**Mudanças:**
- Método `validarSequencia(gateId)` - Valida se gate anterior está aprovado
- Método `validarBloqueioGate9(obraId)` - Valida Gate 5 e Gate 6

---

## CHECKLIST DE IMPLEMENTAÇÃO

### Tarefa 1: Gate
- [ ] Atualizar schema Prisma (enum, constraint)
- [ ] Criar migration
- [ ] Atualizar GateService
- [ ] Atualizar rotas
- [ ] Atualizar tipos TypeScript
- [ ] Testar criação de gates (apenas os 9 oficiais)

### Tarefa 2: Medição
- [ ] Atualizar schema Prisma (enum tipo)
- [ ] Criar migration
- [ ] Atualizar tipos TypeScript
- [ ] Atualizar MedicaoService
- [ ] Criar rotas do Comercial
- [ ] Atualizar rotas existentes
- [ ] Testar MP e MC separadas

### Tarefa 3: CompetenciaMensal
- [ ] Criar modelo Prisma
- [ ] Atualizar modelos relacionados
- [ ] Criar migration
- [ ] Criar tipos TypeScript
- [ ] Testar criação de competência

### Tarefa 4: FechamentoService
- [ ] Criar FechamentoService
- [ ] Implementar validações
- [ ] Integrar com GateService
- [ ] Testar validações

---

## ORDEM DE EXECUÇÃO RECOMENDADA

1. **Tarefa 1** (Gate) - Mais simples, ajuste de constraint
2. **Tarefa 2** (Medição) - Mais crítico, afeta funcionalidade existente
3. **Tarefa 3** (CompetenciaMensal) - Base para fechamento
4. **Tarefa 4** (FechamentoService) - Usa as 3 anteriores

---

## NOTAS TÉCNICAS

### Migrations

**Importante:** Executar migrations em ordem:
1. `fix_gate_enum`
2. `add_medicao_tipo`
3. `add_competencia_mensal`

### Compatibilidade

**Gate:**
- Gates existentes precisam ser migrados para o enum
- Criar script de migração de dados

**Medição:**
- Medições existentes precisam ter tipo definido
- Criar script de migração (definir tipo padrão ou MP)

### Testes

Após cada tarefa:
- [ ] Testar criação
- [ ] Testar validações
- [ ] Testar queries existentes
- [ ] Verificar se não quebrou funcionalidades

---

**Documento criado em:** Janeiro 2026  
**Status:** 🟡 Aguardando Implementação  
**Próxima Ação:** Iniciar Tarefa 1 - Ajustar Gate






