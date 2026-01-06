# 🔄 CORREÇÃO DO CONCEITO - EAP E BASELINE COMERCIAL

**Data:** Janeiro 2026  
**Status:** ✅ Correção Aplicada

---

## ❌ CONCEITO ANTERIOR (INCORRETO)

**EAP criada no Módulo Corporativo**

- Baseline Comercial criada no Corporativo
- EAP criada no Corporativo
- Obra apenas consome a EAP

---

## ✅ CONCEITO CORRETO

### Fluxo Real do Sistema

#### 1. MÓDULO CORPORATIVO (Preparação)

**O que o Corporativo faz:**
- ✅ Abre o **Centro de Custo**
- ✅ Carrega a **Planilha Analítica** com informações de referência:
  - Proposta
  - Orçamento
  - Preços
  - Dados referenciais

**O que o Corporativo NÃO faz:**
- ❌ NÃO cria a EAP
- ❌ NÃO estrutura a Baseline Comercial

#### 2. MÓDULO OBRA - DEPARTAMENTO COMERCIAL (Estruturação)

**O que acontece:**
- ✅ O sistema comercial é **preenchido automaticamente** com as informações do Corporativo
- ✅ O **Gerente do Departamento Comercial** recebe essas informações referenciais
- ✅ O Gerente Comercial **cria a EAP** no Módulo Obra
- ✅ O Gerente Comercial faz a **Estruturação** da EAP
- ✅ Após estruturação, **libera para outros serviços/departamentos**

**Fluxo de Atividades do Comercial:**
1. **Estruturação** (primeira atividade)
   - Criação da EAP
   - Estruturação hierárquica
   - Definição de itens e valores
2. **Liberação** para outros serviços
   - Após estruturação completa
   - Outros departamentos podem trabalhar

---

## 📊 DIAGRAMA DO FLUXO CORRETO

```
MÓDULO CORPORATIVO
│
├── Abre Centro de Custo
├── Carrega Planilha Analítica
│   ├── Proposta (referência)
│   ├── Orçamento (referência)
│   └── Preços (referência)
│
└── [Envia dados referenciais]
    │
    ▼
MÓDULO OBRA - COMERCIAL
│
├── Recebe informações referenciais (automático)
├── Gerente Comercial cria a EAP
├── Gerente Comercial faz ESTRUTURAÇÃO
│   ├── Define hierarquia
│   ├── Estrutura itens
│   └── Define valores
│
└── [Libera para outros serviços]
    │
    ▼
OUTROS DEPARTAMENTOS
│
├── Engenharia
├── Produção
├── Custos
└── etc.
```

---

## 🎯 CONCEITOS CORRIGIDOS

### Baseline Comercial

**Conceito Anterior (INCORRETO):**
- Criada no Corporativo
- EAP criada junto no Corporativo

**Conceito Correto:**
- **Dados referenciais** vêm do Corporativo (proposta, orçamento, preços)
- **EAP é criada no Comercial da Obra** usando esses dados referenciais
- Baseline Comercial é o resultado da estruturação feita pelo Comercial

### Estruturação

**Conceito Correto:**
- É a **primeira atividade** do Departamento Comercial
- O Gerente Comercial estrutura a EAP baseado nos dados referenciais
- Após estruturação, libera para outros serviços

### Liberação

**Conceito Correto:**
- Após estruturação completa, o Comercial **libera** para outros departamentos
- Outros serviços podem começar a trabalhar
- Isso pode estar relacionado ao **Gate 1** ou um gate específico de estruturação

---

## 📝 IMPLICAÇÕES PARA O SISTEMA

### Módulo Corporativo

**Deve ter:**
- [ ] Abertura de Centro de Custo
- [ ] Upload de Planilha Analítica
- [ ] Campos: Proposta, Orçamento, Preços (referenciais)
- [ ] Envio automático para o Módulo Obra/Comercial

**NÃO deve ter:**
- [ ] Criação de EAP
- [ ] Estruturação de Baseline

### Módulo Obra - Comercial

**Deve ter:**
- [ ] Recebimento automático de dados referenciais
- [ ] Criação de EAP pelo Gerente Comercial
- [ ] Interface de Estruturação
- [ ] Liberação para outros serviços
- [ ] Controle de versão da Baseline após estruturação

---

## 🔄 ATUALIZAÇÕES NECESSÁRIAS

### Documentos a Atualizar

1. **MEMORIAL_DESCRITIVO_OFICIAL.md**
   - Corrigir seção sobre Baseline Comercial
   - Corrigir fluxo Corporativo → Obra
   - Adicionar conceito de Estruturação no Comercial

2. **RELATORIO_CONCEITO_ERP_GENESIS.md**
   - Atualizar fluxo de criação de EAP
   - Corrigir responsabilidades do Corporativo vs. Comercial

3. **REVISAO_MODULO_OBRA.md**
   - Atualizar seção sobre EAP
   - Corrigir origem da EAP

### Código a Revisar

1. **Estruturação de EAP**
   - Verificar onde está sendo criada
   - Mover para Módulo Obra/Comercial se necessário

2. **Upload de Planilha**
   - Verificar se está no lugar correto (Corporativo)
   - Garantir que envia dados referenciais para Comercial

3. **Interface de Estruturação**
   - Garantir que está no Comercial da Obra
   - Adicionar funcionalidade de liberação

---

## ✅ RESUMO DA CORREÇÃO

| Item | Conceito Anterior (❌) | Conceito Correto (✅) |
|------|----------------------|----------------------|
| **Criação da EAP** | No Corporativo | No Comercial da Obra |
| **Estruturação** | No Corporativo | No Comercial da Obra (primeira atividade) |
| **Corporativo faz** | Cria EAP e Baseline | Abre centro de custo e carrega planilha analítica (referência) |
| **Comercial faz** | Apenas consome | Recebe dados, cria EAP, estrutura, libera |
| **Dados referenciais** | Não mencionado | Proposta, Orçamento, Preços (do Corporativo) |

---

**Documento criado em:** Janeiro 2026  
**Status:** ✅ Correção Aplicada  
**Próxima ação:** Atualizar documentos oficiais






