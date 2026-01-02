# Service Layer - ERP G-NESIS

Camada de serviços (Service Layer) que implementa a lógica de negócio do sistema, separando a lógica de apresentação da lógica de dados.

## Estrutura

```
src/services/
├── EapService.ts      # Serviço de EAP com cálculo de fator de conversão
├── index.ts           # Exportações centralizadas
└── README.md          # Este arquivo
```

## EapService

Serviço responsável por todas as operações relacionadas à EAP (Estrutura Analítica do Projeto).

### Funcionalidades Principais

#### CRUD de EAP
- `createEap()`: Cria nova EAP
- `updateEap()`: Atualiza EAP existente
- `getEapById()`: Busca EAP por ID
- `listEapByBaseline()`: Lista EAPs por baseline
- `listEapFolha()`: Lista apenas EAPs folha (sem filhos)
- `deleteEap()`: Soft delete de EAP

#### Fatores de Conversão
- `createFatorConversao()`: Cria novo fator de conversão
- `updateFatorConversao()`: Atualiza fator de conversão
- `listFatoresConversaoByEapComercial()`: Lista fatores por EAP Comercial
- `deleteFatorConversao()`: Soft delete de fator

#### Cálculos (Regra de Negócio Crítica)
- `calcularQuantidadeOperacional()`: Calcula quantidade operacional
  - Fórmula: `Quantidade Operacional = Quantidade Comercial × Fator Quantidade`
- `calcularValorOperacional()`: Calcula valor operacional
  - Fórmula: `Valor Operacional = Valor Comercial × Fator Valor` (ou Fator Quantidade se não houver Fator Valor)
- `recalcularEapOperacional()`: **FUNÇÃO CRÍTICA** que recalcula todas as EAPs Operacionais relacionadas
  - Executada automaticamente quando:
    - EAP Comercial é criada/atualizada
    - Fator de conversão é criado/atualizado/removido

### Uso

```typescript
import { PrismaClient } from '@prisma/client';
import { EapService } from './services';

const prisma = new PrismaClient();
const eapService = new EapService(prisma);

// Criar EAP Comercial
const eapComercial = await eapService.createEap({
  baseline_comercial_id: 'baseline-1',
  codigo: '1.1.1',
  descricao: 'Serviço de Terraplanagem',
  tipo: 'comercial',
  nivel: 3,
  unidade_medida: 'm³',
  quantidade: 1000,
  valor_unitario: 45.75,
  ordem: 1,
  is_folha: true,
});

// Criar fator de conversão
const fator = await eapService.createFatorConversao({
  eap_comercial_id: eapComercial.id,
  eap_operacional_id: 'eap-op-1',
  fator_quantidade: 2.5,
  fator_valor: 0.4,
  is_ativo: true,
});

// O cálculo automático já foi executado!
// A EAP Operacional foi atualizada com:
// - Quantidade: 1000 × 2.5 = 2500 m³
// - Valor Unitário: 45.75 × 0.4 = 18.30
// - Valor Total: 2500 × 18.30 = 45.750,00
```

### Validações Implementadas

1. **EAP Comercial existe** antes de criar fator de conversão
2. **EAP Operacional existe** antes de criar fator de conversão
3. **Tipos corretos** (comercial/operacional) antes de criar fator
4. **Código único** na baseline antes de criar EAP
5. **Fator único** por par (comercial, operacional)

### Tratamento de Erros

Todos os métodos lançam exceções descritivas em caso de erro:
- `Error`: Erros de validação e regras de negócio
- Mensagens claras e específicas

### Próximos Passos

- [ ] Serviços para outras entidades (Obra, Baseline, Gate)
- [ ] Validações mais complexas
- [ ] Transações para operações atômicas
- [ ] Cache para melhorar performance
- [ ] Logs de auditoria

