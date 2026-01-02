# Modelos de Dados - ERP G-NESIS

Este diretório contém os modelos de dados TypeScript (interfaces) para o sistema ERP G-NESIS.

## Estrutura de Tabelas

### 1. Obras (`obras.ts`)
Representa uma obra/projeto no sistema.

**Campos principais:**
- `id`: Identificador único
- `codigo`: Código único da obra
- `nome`: Nome da obra
- `status`: Status atual (planejamento, em_andamento, pausada, concluida, cancelada)
- `orcamento_total`: Orçamento total da obra

**Relações:**
- Uma obra pode ter múltiplas baselines comerciais
- Uma obra pode ter múltiplos gates

---

### 2. Baseline Comercial (`baseline-comercial.ts`)
Representa a baseline comercial de uma obra, que é uma versão aprovada do escopo e valores.

**Campos principais:**
- `id`: Identificador único
- `obra_id`: Referência à obra
- `versao`: Número da versão da baseline
- `valor_total`: Valor total da baseline
- `is_ativo`: Indica se esta é a baseline ativa

**Relações:**
- Pertence a uma obra
- Contém múltiplos itens de EAP

**Regra de Negócio:**
- Uma obra pode ter múltiplas versões de baseline, mas apenas uma pode estar ativa (`is_ativo = true`)

---

### 3. EAP (`eap.ts`)
Estrutura Analítica do Projeto. Pode ser **comercial** ou **operacional**.

**Campos principais:**
- `id`: Identificador único
- `baseline_comercial_id`: Referência à baseline comercial
- `codigo`: Código hierárquico (ex: "1.1.2.3")
- `descricao`: Descrição do item
- `tipo`: "comercial" ou "operacional"
- `nivel`: Nível hierárquico na árvore
- `eap_pai_id`: Referência ao item pai (para hierarquia)
- `quantidade`: Quantidade do item
- `valor_total`: Valor total do item
- `is_folha`: Indica se é um item folha (sem filhos)

**Relações:**
- Pertence a uma baseline comercial
- Pode ter um item pai (self-reference para hierarquia)
- Pode ter múltiplos filhos (self-reference)
- Pode ter fatores de conversão (quando é comercial ou operacional)

**Regras de Negócio:**
- A EAP forma uma árvore hierárquica através de `eap_pai_id`
- Itens folha (`is_folha = true`) não podem ter filhos
- A EAP Comercial e Operacional são relacionadas através de fatores de conversão

---

### 4. EAP Fator de Conversão (`eap-fator-conversao.ts`)
**CRÍTICO**: Define a relação entre EAP Comercial e EAP Operacional.

**Campos principais:**
- `id`: Identificador único
- `eap_comercial_id`: Referência ao item da EAP Comercial
- `eap_operacional_id`: Referência ao item da EAP Operacional
- `fator_quantidade`: Fator de conversão de quantidade (ex: 1.0 comercial = 2.5 operacional)
- `fator_valor`: Fator de conversão de valor (opcional)
- `is_ativo`: Indica se o fator está ativo

**Relações:**
- Relaciona uma EAP Comercial com uma EAP Operacional

**Regra de Negócio CRÍTICA:**
- **Cada item da EAP Comercial pode ter um ou mais itens da EAP Operacional** através de fatores de conversão
- O fator de conversão define como converter quantidades e valores entre as duas estruturas
- Exemplo: 1 unidade comercial pode equivaler a 2.5 unidades operacionais
- Um item comercial pode ter múltiplos fatores de conversão (relação 1:N)
- Um item operacional pode estar relacionado a apenas um item comercial (ou múltiplos, dependendo da regra de negócio)

**Exemplo de Uso:**
```
EAP Comercial: "Serviço de Terraplanagem" (1 unidade)
  ↓ (fator: 1.0 comercial = 2.5 operacional)
EAP Operacional: "Escavação" (2.5 unidades)
EAP Operacional: "Aterro" (1.0 unidade)
```

---

### 5. Gates (`gates.ts`)
Representa os portões/marcos do projeto (gates de aprovação).

**Campos principais:**
- `id`: Identificador único
- `obra_id`: Referência à obra
- `codigo`: Código único do gate
- `nome`: Nome do gate
- `tipo`: Tipo do gate (inicio, meio, fim, customizado)
- `ordem`: Ordem sequencial dos gates
- `status`: Status atual (pendente, em_analise, aprovado, rejeitado)
- `data_prevista`: Data prevista para o gate
- `data_real`: Data real de conclusão
- `criterios_aprovacao`: Critérios de aprovação (JSON ou texto)

**Relações:**
- Pertence a uma obra

**Regra de Negócio:**
- Gates são sequenciais e devem ser aprovados em ordem
- Um gate só pode ser aprovado se o anterior estiver aprovado

---

## Diagrama de Relações

```
Obra
  ├── BaselineComercial (1:N)
  │     └── EAP (1:N)
  │           ├── EAP (hierarquia, self-reference N:1)
  │           └── EapFatorConversao (1:N)
  │                 └── EAP Operacional (N:1)
  └── Gate (1:N)
```

## Uso dos Modelos

### TypeScript Interfaces
```typescript
import { Obra, CreateObraDto, UpdateObraDto } from './types';
import { Eap, EapFatorConversao } from './types';
```

### Prisma Schema
O schema Prisma está em `prisma/schema.prisma` e pode ser usado para:
- Gerar migrations
- Gerar o Prisma Client
- Validar a estrutura do banco de dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migration
npx prisma migrate dev --name init

# Visualizar schema no Prisma Studio
npx prisma studio
```

## Notas Importantes

1. **Soft Delete**: Todas as tabelas possuem `deleted_at` para implementar soft delete
2. **Timestamps**: Todas as tabelas possuem `created_at` e `updated_at`
3. **Fator de Conversão**: A relação entre EAP Comercial e Operacional é **obrigatória** através de fatores de conversão
4. **Hierarquia EAP**: A EAP forma uma árvore através de self-reference (`eap_pai_id`)
5. **Valores Monetários**: Usar `Decimal` no Prisma para precisão financeira

