# 🔍 REVISÃO DO MÓDULO OBRA - ERP GENESIS

**Data:** Janeiro 2026  
**Baseado em:** Memorial Descritivo Oficial  
**Status:** 🟡 Em Revisão

---

## 📋 OBJETIVO

Este documento identifica o estado atual do **Módulo Obra**, o que precisa ser revisado/melhorado e o que está faltando conforme o Memorial Descritivo Oficial.

**Nota:** O setor de propostas (parte do Módulo Corporativo) será tratado em uma segunda parte.

---

## ✅ O QUE ESTÁ IMPLEMENTADO

### 1. Estrutura Base da Obra
- ✅ **Listagem de Obras** (`app/obras/page.tsx`)
  - CRUD completo
  - Filtros e busca
  - Status das obras

- ✅ **Detalhes da Obra** (`app/obras/[id]/page.tsx`)
  - Abas: Resumo, EAP, Medições, Relatórios
  - Informações gerais da obra
  - Integração com gates

### 2. EAP (Estrutura Analítica do Projeto)
- ✅ **EAP Dual** (Comercial e Operacional)
  - Visualização de ambas as visões
  - Fatores de conversão implementados
  - Interface de alta densidade (estilo planilha)

- ✅ **Componentes:**
  - `EapEstruturacaoTable.tsx` - Tabela principal
  - `EapDrawer.tsx` - Drawer de configurações

**Status:** ✅ **Funcional** - Mas precisa revisão conforme Memorial

### 3. Medições
- ✅ **Lançamento de Medições**
  - Formulário de nova medição
  - Histórico de medições
  - Status (rascunho, enviada, aprovada, rejeitada)
  - Cálculo automático de valores

**Status:** ✅ **Funcional** - Mas precisa revisão para alinhar com MP/MC

### 4. Gates de Aprovação
- ✅ **Estrutura Base**
  - Modelo Prisma `Gate`
  - Listagem de gates por obra
  - Status sequencial básico

**Status:** ⚠️ **Parcial** - Faltam os 9 gates oficiais completos

### 5. Dashboards e Relatórios
- ✅ **Gráficos**
  - Evolução (linha)
  - Composição (pizza)
  - KPIs e métricas

**Status:** ✅ **Funcional**

### 6. Suprimentos (Básico)
- ✅ **Cadastro de Insumos**
  - Listagem
  - Cadastro via modal
  - Integração com banco

**Status:** ✅ **Básico** - Precisa expansão

---

## ⚠️ O QUE PRECISA SER REVISADO

### 1. EAP - Revisão Crítica

**Problemas Identificados:**
- ❌ EAP está sendo criada/gerenciada na obra, mas deveria vir do Corporativo
- ❌ Falta clareza sobre origem corporativa da Baseline
- ❌ Visão operacional pode não estar totalmente alinhada

**Ações Necessárias:**
- [ ] Revisar fluxo: Baseline deve vir do Corporativo
- [ ] Garantir que obra apenas CONSUME a EAP, não cria
- [ ] Validar fatores de conversão estão corretos
- [ ] Verificar se valores financeiros são idênticos entre visões

### 2. Medições - Revisão para MP/MC

**Problemas Identificados:**
- ❌ Não há distinção entre Medição de Produção (MP) e Medição do Cliente (MC)
- ❌ Falta comparativo MP x MC (sigiloso)
- ❌ Não há controle de aditivos e glosas

**Ações Necessárias:**
- [ ] Separar MP e MC no modelo de dados
- [ ] Criar interface para lançamento de MP
- [ ] Criar interface para lançamento de MC
- [ ] Implementar comparativo MP x MC (acesso restrito)
- [ ] Adicionar controle de aditivos
- [ ] Adicionar controle de glosas

### 3. Gates - Completar os 9 Gates Oficiais

**Problemas Identificados:**
- ❌ Apenas estrutura base implementada
- ❌ Faltam os 9 gates oficiais:
  1. Gate 1 – Liberação da Obra (deve ser no Corporativo)
  2. Gate 2 – Fechamento Mensal de Custos
  3. Gate 3 – Fechamento de Produção
  4. Gate 4 – Fechamento Comercial
  5. Gate 5 – Qualidade OK
  6. Gate 6 – SSMA OK
  7. Gate 7 – Financeiro OK
  8. Gate 8 – Gerencial OK
  9. Gate 9 – Competência Concluída

**Ações Necessárias:**
- [ ] Implementar os 9 gates oficiais
- [ ] Lógica de sequência obrigatória
- [ ] Regra: Gate 5 e Gate 6 bloqueiam Gate 9
- [ ] Integração com departamentos

### 4. Suprimentos - Expandir Funcionalidades

**Problemas Identificados:**
- ❌ Apenas cadastro básico de insumos
- ❌ Faltam: Requisições, Compras, Contratos, Recebimentos

**Ações Necessárias:**
- [ ] Requisições de compra
- [ ] Cotações
- [ ] Controle de estoque por obra
- [ ] Entrada e saída de materiais
- [ ] Integração com custos e produção

---

## ❌ O QUE ESTÁ FALTANDO (Conforme Memorial)

### 1. COMERCIAL DA OBRA (Completo)

**Status Atual:** ⚠️ Parcial (apenas medições básicas)

**Faltando:**
- [ ] Medição de Produção (MP) - separada
- [ ] Medição do Cliente (MC) - separada
- [ ] Comparativo MP x MC (sigiloso)
- [ ] Aditivos contratuais
- [ ] Glosas
- [ ] Faturamento
- [ ] Integração com Gate 4 (Fechamento Comercial)

**Prioridade:** 🔴 ALTA

---

### 2. ENGENHARIA

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Projetos técnicos
- [ ] Documentação técnica
- [ ] Liberação de frentes de trabalho
- [ ] Apoio técnico à produção
- [ ] Interface com qualidade e SSMA

**Prioridade:** 🟡 MÉDIA

---

### 3. PRODUÇÃO

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Execução física
- [ ] Avanços diários
- [ ] PBS (Planejamento Baseado em Serviços)
- [ ] Apontamentos
- [ ] Produtividade
- [ ] **IMPORTANTE:** NÃO trabalha com valores financeiros
- [ ] Integração com Gate 3 (Fechamento de Produção)

**Prioridade:** 🔴 ALTA

---

### 4. CUSTOS

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Apropriações de custos
- [ ] Rateios
- [ ] Controle CR/CO (Custo Real vs. Custo Orçado)
- [ ] Controle F/CD (Faturamento vs. Custo Direto)
- [ ] Fechamento mensal de custos
- [ ] Integração com Gate 2 (Fechamento Mensal de Custos)

**Prioridade:** 🔴 ALTA

---

### 5. QUALIDADE

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Inspeções de qualidade
- [ ] Não Conformidades (NCs)
- [ ] Ensaios
- [ ] Liberação de serviços
- [ ] **PODER DE TRAVA:** Bloqueia fechamento se não aprovado
- [ ] Integração com Gate 5 (Qualidade OK)

**Prioridade:** 🟡 MÉDIA (mas crítico para fechamento)

---

### 6. SSMA

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Segurança do trabalho
- [ ] Incidentes e acidentes
- [ ] Treinamentos
- [ ] Inspeções de campo
- [ ] **PODER DE TRAVA:** Bloqueia fechamento se não aprovado
- [ ] Integração com Gate 6 (SSMA OK)

**Prioridade:** 🟡 MÉDIA (mas crítico para fechamento)

---

### 7. MEIO AMBIENTE

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Licenças ambientais
- [ ] Condicionantes
- [ ] Monitoramentos ambientais

**Prioridade:** 🟢 BAIXA

---

### 8. FINANCEIRO DA OBRA

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Fluxo de caixa
- [ ] Contas a receber
- [ ] Contas a pagar
- [ ] Interface com faturamento
- [ ] Integração com Gate 7 (Financeiro OK)

**Prioridade:** 🟡 MÉDIA

---

### 9. GERENCIAL

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Análise de resultado
- [ ] Tendências
- [ ] Cenários
- [ ] Tomada de decisão
- [ ] Integração com Gate 8 (Gerencial OK)

**Prioridade:** 🟡 MÉDIA

---

### 10. FECHAMENTO MENSAL

**Status Atual:** ❌ Não implementado

**Faltando:**
- [ ] Modelo de Competência Mensal
- [ ] Fluxo de fechamento
- [ ] Validação sequencial dos gates
- [ ] Dashboard de status
- [ ] Bloqueio de edições após fechamento
- [ ] Integração com todos os departamentos

**Prioridade:** 🔴 ALTA (crítico)

---

## 🎯 PLANO DE REVISÃO E IMPLEMENTAÇÃO

### Fase 1: Revisões Críticas (1-2 semanas)

1. **Revisar EAP**
   - Garantir origem corporativa
   - Validar fatores de conversão
   - Verificar valores financeiros idênticos

2. **Revisar Medições para MP/MC**
   - Separar MP e MC
   - Implementar comparativo
   - Adicionar aditivos e glosas

3. **Completar 9 Gates Oficiais**
   - Implementar todos os gates
   - Lógica de sequência
   - Regras de bloqueio

### Fase 2: Departamentos Críticos (2-4 semanas)

4. **Comercial da Obra Completo**
   - MP, MC, Comparativo, Aditivos, Glosas, Faturamento

5. **Módulo Produção**
   - Execução física, Avanços, PBS, Apontamentos

6. **Módulo Custos**
   - Apropriações, Rateios, CR/CO, F/CD

### Fase 3: Departamentos de Trava (2-3 semanas)

7. **Qualidade**
   - Inspeções, NCs, Ensaios, Poder de Trava

8. **SSMA**
   - Segurança, Incidentes, Treinamentos, Poder de Trava

### Fase 4: Fechamento Mensal (1-2 semanas)

9. **Fechamento Mensal Completo**
   - Modelo, Fluxo, Validações, Dashboard

### Fase 5: Departamentos Restantes (4-6 semanas)

10. **Engenharia**
11. **Financeiro da Obra**
12. **Gerencial**
13. **Meio Ambiente**

---

## 📊 PRIORIZAÇÃO

### 🔴 CRÍTICO (Fazer Primeiro)
1. Revisar EAP (origem corporativa)
2. Revisar Medições (MP/MC)
3. Completar 9 Gates Oficiais
4. Fechamento Mensal
5. Comercial da Obra Completo
6. Módulo Produção
7. Módulo Custos

### 🟡 IMPORTANTE (Fazer Depois)
8. Qualidade (poder de trava)
9. SSMA (poder de trava)
10. Engenharia
11. Financeiro da Obra
12. Gerencial

### 🟢 BAIXA (Pode Esperar)
13. Meio Ambiente
14. Melhorias e otimizações

---

## 📝 NOTAS IMPORTANTES

1. **Baseline vem do Corporativo:** EAP não deve ser criada na obra
2. **MP ≠ MC:** Devem ser tratadas separadamente
3. **Gates são obrigatórios:** Sem Qualidade e SSMA OK, não fecha
4. **Produção não tem valores:** Apenas quantidades físicas
5. **Fechamento é rigoroso:** Todos os departamentos devem validar

---

**Documento criado em:** Janeiro 2026  
**Próxima revisão:** Após Fase 1  
**Status:** 🟡 Em Revisão






