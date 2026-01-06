# 📌 GENESIS — VALIDAÇÃO ARQUITETURAL + PLANO DE CORREÇÃO
## Análise do AS-BUILT do Cursor vs Conceito Oficial Travado

**Projeto:** ERP GENESIS  
**Data:** Janeiro / 2026  
**Documento:** Validação Técnica Arquitetural  
**Status:** ✅ CONCEITO CORRETO | ⚠️ AJUSTES ESTRUTURAIS NECESSÁRIOS

---

## 1. VEREDITO EXECUTIVO (CURTO E DIRETO)

✅ **O CONCEITO IMPLEMENTADO PELO CURSOR ESTÁ CORRETO.**  
✅ **NÃO HÁ DESVIO CONCEITUAL GRAVE.**  
⚠️ **EXISTEM DESALINHAMENTOS DE ARQUITETURA E NOMENCLATURA.**  
⚠️ **O MÓDULO CORPORATIVO AINDA NÃO EXISTE (COMO PREVISTO).**  
⚠️ **ALGUMAS DECISÕES TÉCNICAS PRECISAM SER AJUSTADAS AGORA** para não gerar dívida estrutural.

**IMPORTANTE:**
- Nada do que foi feito precisa ser descartado.
- Mas algumas coisas precisam ser **ORGANIZADAS** antes de avançar.

---

## 2. O QUE ESTÁ 100% ALINHADO COM O CONCEITO (CORRETO)

### 2.1. Princípios Estruturais

✅ **"Corporativo governa / Obra executa"** respeitado (mesmo sem corporativo ainda)  
✅ **Multi-obra** corretamente modelado (UsuarioObra)  
✅ **Soft delete + auditoria** — correto  
✅ **Baseline versionada** — correto  
✅ **EAP dual (comercial / operacional)** — MUITO BEM IMPLEMENTADA  
✅ **Fatores de conversão** — implementação madura  
✅ **Separação hierárquica da EAP** — correta  
✅ **Produção não trabalha com valores financeiros** (respeitado implicitamente)  
✅ **Medições vinculadas à EAP** — correto

👉 **Esse núcleo está sólido e bem acima da média de ERPs.**

---

## 3. DESALINHAMENTOS IDENTIFICADOS (SEM MUDAR CONCEITO)

### 3.1. Gate — Problema de SEMÂNTICA (não de lógica)

**📌 Problema:**
A tabela `Gate` hoje é genérica, mas o conceito exige:
- Gates FIXOS (1 a 9)
- Com regras claras de dependência
- Com poder de trava (Gate 5 e 6)

**📌 Situação Atual:**
- `Gate.codigo` é String livre
- `Gate` pode ser criado customizadamente
- Não há validação de que são exatamente 9 gates
- Não há lógica de dependência entre gates
- Não há poder de trava explícito

**📌 Correção Obrigatória:**
- `Gate.codigo` deve ser **ENUM FIXO**: G1, G2, G3, G4, G5, G6, G7, G8, G9
- `Gate` **NÃO deve ser "customizável"** livremente
- A ordem dos gates é **IMUTÁVEL**
- Gate 9 depende explicitamente de Gate 5 e Gate 6
- Criar validação que impede criar gates fora dos 9 oficiais

**Arquivos Afetados:**
- `prisma/schema.prisma` - Adicionar constraint/enum
- `src/services/GateService.ts` - Validações
- `src/api/routes/gates.routes.ts` - Validações

👉 **Não é refatoração grande, é ajuste de regra.**

---

### 3.2. Medição — Ponto Mais Crítico (já identificado corretamente)

**📌 Situação Atual:**
- Tabela `Medicao` genérica
- Não diferencia MP e MC
- Não há comparativo
- Não há separação de responsabilidades

**📌 Conceito Travado:**
- MP ≠ MC
- Comparativo é obrigatório
- MC gera faturamento
- MP gera custo

**📌 Correção Obrigatória (escolher UMA, não misturar):**

**OPÇÃO RECOMENDADA:**
- Manter tabela `Medicao`
- Adicionar campo obrigatório: `tipo ENUM('MP','MC')`
- Criar índices e regras por tipo
- Criar endpoint exclusivo de comparativo: `GET /api/comercial/comparativo/obra/:obra_id`
- Separar endpoints: `/api/comercial/medicao-producao` e `/api/comercial/medicao-cliente`

**Arquivos Afetados:**
- `prisma/schema.prisma` - Adicionar campo `tipo`
- `src/types/medicao.ts` - Atualizar interface
- `src/services/MedicaoService.ts` - Separar lógicas MP/MC
- `src/api/routes/medicoes.routes.ts` - Separar rotas ou adicionar filtro por tipo
- Criar `src/api/routes/comercial.routes.ts` - Rotas específicas do Comercial

👉 **Não criar duas tabelas agora evita retrabalho.**

---

### 3.3. Baseline — Conceito CERTO, Fluxo INCOMPLETO (esperado)

**📌 Correto:**
- Versionamento
- Status (proposta / homologada / rejeitada)
- Usuários de proposta/homologação
- Campos de homologação implementados

**📌 O que falta (e é esperado):**
- Origem corporativa explícita
- Gate 1 vinculado à baseline homologada
- Endpoints de proposição/homologação
- Interface de homologação no Corporativo

**Arquivos Afetados:**
- Criar `src/api/routes/baseline.routes.ts` - Endpoints de homologação
- Criar `src/services/BaselineService.ts` - Lógica de homologação
- Atualizar `src/api/routes/gates.routes.ts` - Validação Gate 1

👉 **Não é erro. É etapa seguinte.**

---

### 3.4. Arquitetura de Pastas — Ajuste NECESSÁRIO agora

**📌 Problema:**
Hoje a estrutura é "por recurso técnico" e não por **DOMÍNIO**.

**Estrutura Atual:**
```
src/
├── api/routes/        # Por recurso técnico
│   ├── obras.routes.ts
│   ├── eap.routes.ts
│   └── medicoes.routes.ts
└── services/          # Por recurso técnico
    ├── ObraService.ts
    ├── EapService.ts
    └── MedicaoService.ts
```

**📌 Risco:**
Quando os departamentos entrarem, vira caos.

**📌 Correção Recomendada (SEM refatorar tudo):**

Criar **camada lógica por domínio**, mesmo que fisicamente continue igual:

**Opção 1: Reorganizar Físicamente (Recomendado)**
```
src/
├── domains/
│   ├── corporativo/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   └── obra/
│       ├── comercial/
│       │   ├── routes/
│       │   ├── services/
│       │   └── types/
│       ├── producao/
│       ├── custos/
│       ├── qualidade/
│       ├── ssma/
│       ├── financeiro/
│       └── gerencial/
```

**Opção 2: Manter Estrutura, Organizar Logicamente (Mais Rápido)**
```
src/
├── api/routes/        # Manter como está
│   ├── corporativo/   # Nova pasta
│   └── obra/          # Nova pasta
│       ├── comercial/
│       ├── producao/
│       └── ...
└── services/          # Manter como está
    ├── corporativo/   # Nova pasta
    └── obra/          # Nova pasta
        ├── comercial/
        ├── producao/
        └── ...
```

👉 **Pode começar apenas organizando SERVICES e DTOs.**

---

## 4. O QUE NÃO É ERRO (E NÃO DEVE SER "ARRUMADO")

❌ **Não é erro** não ter módulo corporativo ainda  
❌ **Não é erro** Gates estarem só como leitura  
❌ **Não é erro** Suprimentos estar básico  
❌ **Não é erro** não ter fechamento mensal  

Isso é **sequência correta de construção**, não falha.

---

## 5. ORDEM CORRETA DOS PRÓXIMOS PASSOS (SEM DISCUSSÃO)

### FASE 1 — ORGANIZAÇÃO (CURTA, OBRIGATÓRIA)

**Objetivo:** Ajustar semântica e estrutura antes de expandir.

**Tarefas:**

1. **Ajustar modelo Gate (fixar G1–G9)**
   - [ ] Adicionar constraint/enum para `codigo` (G1 a G9)
   - [ ] Criar validação que impede criar gates fora dos 9 oficiais
   - [ ] Atualizar `GateService` com validações
   - [ ] Criar migration

2. **Ajustar Medição (MP/MC)**
   - [ ] Adicionar campo `tipo ENUM('MP','MC')` em `Medicao`
   - [ ] Criar migration
   - [ ] Atualizar `MedicaoService` para separar lógicas
   - [ ] Criar endpoints separados ou filtro por tipo
   - [ ] Criar endpoint de comparativo

3. **Criar esqueleto de CompetenciaMensal**
   - [ ] Modelo `CompetenciaMensal` no Prisma
   - [ ] Campos: obra_id, periodo (YYYY-MM), status, data_abertura, data_fechamento
   - [ ] Relacionamento com Gates

4. **Criar serviço central de validação de fechamento**
   - [ ] `FechamentoService.ts`
   - [ ] Método que valida todos os gates
   - [ ] Método que verifica bloqueios (Gate 5 e 6)

👉 **Sem UI nova ainda.**

**Estimativa:** 3-5 dias

---

### FASE 2 — GOVERNANÇA (ALTA PRIORIDADE)

**Objetivo:** Implementar lógica completa dos 9 Gates e fechamento mensal.

**Tarefas:**

5. **Implementar lógica completa dos 9 Gates**
   - [ ] Endpoint para criar gates (apenas os 9 oficiais)
   - [ ] Endpoint para aprovar gate
   - [ ] Validação de sequência (Gate N só após Gate N-1)
   - [ ] Validação de Gate 1 (baseline homologada)

6. **Implementar bloqueio de Gate 9 por Qualidade e SSMA**
   - [ ] Lógica que verifica Gate 5 e Gate 6
   - [ ] Bloqueio explícito se não aprovados
   - [ ] Mensagem clara de bloqueio

7. **Criar fluxo de fechamento mensal**
   - [ ] Endpoint para abrir competência
   - [ ] Endpoint para fechar competência
   - [ ] Validação de todos os gates
   - [ ] Congelamento de dados após fechamento
   - [ ] Dashboard de status de fechamento

**Estimativa:** 5-7 dias

---

### FASE 3 — CORPORATIVO (FINALMENTE)

**Objetivo:** Implementar Módulo Corporativo completo.

**Tarefas:**

8. **Clientes**
   - [ ] Modelo `Cliente`
   - [ ] CRUD completo
   - [ ] Interface

9. **Contratos**
   - [ ] Modelo `Contrato`
   - [ ] CRUD completo
   - [ ] Interface

10. **Centro de Custo**
    - [ ] Modelo `CentroCusto`
    - [ ] CRUD completo
    - [ ] Interface

11. **Upload de Planilha Analítica**
    - [ ] Modelo `PlanilhaAnalitica`
    - [ ] Endpoint de upload
    - [ ] Processamento de Excel/CSV
    - [ ] Interface

12. **Gate 1 (Liberação da Obra)**
    - [ ] Validação de pré-requisitos
    - [ ] Endpoint de aprovação
    - [ ] Transição Corporativo → Obra

**Estimativa:** 10-15 dias

---

### FASE 4 — EXPANSÃO DA OBRA

**Objetivo:** Implementar departamentos do Módulo Obra.

**Tarefas:**

13. **MP/MC completo + comparativo**
    - [ ] Interface de MP
    - [ ] Interface de MC
    - [ ] Interface de comparativo (acesso restrito)
    - [ ] Integração com faturamento

14. **Custos**
    - [ ] Modelos: Apropriacao, Rateio
    - [ ] CRUD completo
    - [ ] Cálculo CR/CO e F/CD
    - [ ] Interface

15. **Produção**
    - [ ] Modelos: Apontamento, Avanco, PBS
    - [ ] CRUD completo
    - [ ] Integração com MP
    - [ ] Interface

16. **Qualidade**
    - [ ] Modelos: Inspecao, NaoConformidade, Ensaio
    - [ ] CRUD completo
    - [ ] Integração com Gate 5
    - [ ] Interface

17. **SSMA**
    - [ ] Modelos: Incidente, InspecaoSST, Treinamento
    - [ ] CRUD completo
    - [ ] Integração com Gate 6
    - [ ] Interface

**Estimativa:** 20-30 dias

---

## 6. CONCLUSÃO FINAL (SEM POLITICAGEM)

✔️ **O trabalho feito no Cursor é BOM.**  
✔️ **O conceito está RESPEITADO.**  
✔️ **Não existe retrabalho estrutural.**  
✔️ **O maior risco agora é seguir sem organizar gates, medições e domínios.**  
✔️ **Se você fizer os ajustes acima agora, o GENESIS vira um ERP extremamente robusto.**

👉 **Pode seguir tranquilo.**  
👉 **A base está sólida.**  
👉 **Agora é engenharia, não conceituação.**

---

## 7. PRIORIZAÇÃO TÉCNICA

### Crítico (Fazer Agora)
1. Gate - Fixar G1-G9
2. Medição - Separar MP/MC
3. Organização de domínios

### Importante (Próxima Sprint)
4. Lógica dos 9 Gates
5. Fechamento mensal
6. CompetenciaMensal

### Planejado (Futuro)
7. Módulo Corporativo
8. Departamentos da Obra

---

**Documento criado em:** Janeiro 2026  
**Status:** ✅ Validação Externa Recebida e Documentada  
**Próxima Ação:** Iniciar FASE 1 - Organização






