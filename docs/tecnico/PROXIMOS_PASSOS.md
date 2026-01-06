# 🎯 PRÓXIMOS PASSOS - ERP GENESIS

**Data:** Janeiro 2026  
**Baseado em:** Memorial Descritivo Oficial  
**Status:** 🟢 Planejamento Estratégico

---

## 📋 RESUMO EXECUTIVO

Este documento define os próximos passos prioritários para o desenvolvimento do ERP GENESIS, seguindo rigorosamente o **Memorial Descritivo Oficial** como referência única.

---

## 🔴 PRIORIDADE CRÍTICA (Fase 1 - 2-4 semanas)

### 1. MÓDULO CORPORATIVO (Fundação do Sistema)

**Por que é crítico:**
- É o "CÉREBRO" do sistema conforme Memorial Oficial
- Baseline Comercial deve nascer no Corporativo
- Obras são criadas e liberadas pelo Corporativo
- Sem isso, o sistema não segue o princípio: "O CORPORATIVO GOVERNA. A OBRA EXECUTA."

**Tarefas:**

#### 1.1. Estrutura Base do Módulo Corporativo
- [ ] Criar rota `/corporativo` no frontend
- [ ] Criar rotas de API `/api/corporativo/*`
- [ ] Criar sidebar/menu específico para módulo corporativo
- [ ] Definir permissões (apenas usuários corporativos)

#### 1.2. Cadastro de Clientes
- [ ] Modelo Prisma: `Cliente`
- [ ] CRUD completo de clientes
- [ ] Interface de listagem e cadastro
- [ ] Validações e regras de negócio

#### 1.3. Cadastro de Contratos
- [ ] Modelo Prisma: `Contrato`
- [ ] Relacionamento Cliente → Contrato
- [ ] CRUD completo de contratos
- [ ] Upload de documentos contratuais

#### 1.4. Baseline Comercial (No Corporativo)
- [ ] Mover criação de Baseline para módulo corporativo
- [ ] Interface de upload de planilha analítica
- [ ] Processamento e importação de EAP comercial
- [ ] Versionamento (v1, v2, v3...)
- [ ] Aprovação e liberação de baseline
- [ ] **Regra:** Baseline imutável após liberação

#### 1.5. Cadastro e Liberação de Obras
- [ ] Mover criação de obras para módulo corporativo
- [ ] Interface de cadastro de obra
- [ ] Vinculação: Cliente → Contrato → Obra
- [ ] **Gate 1:** Liberação da Obra
- [ ] Após liberação, obra passa a existir no Módulo Obra

#### 1.6. Padrões Técnicos e Econômicos
- [ ] Modelo Prisma: `PadraoTecnico`, `PadraoEconomico`
- [ ] Cadastro de padrões corporativos
- [ ] Aplicação automática em novas obras

---

### 2. COMPLETAR OS 9 GATES OFICIAIS

**Por que é crítico:**
- Gates garantem disciplina real de obra
- Fechamento mensal depende dos gates
- Qualidade e SSMA têm poder de trava

**Tarefas:**

#### 2.1. Modelagem de Gates
- [ ] Atualizar modelo Prisma `Gate` com os 9 gates oficiais:
  1. Gate 1 – Liberação da Obra
  2. Gate 2 – Fechamento Mensal de Custos
  3. Gate 3 – Fechamento de Produção
  4. Gate 4 – Fechamento Comercial
  5. Gate 5 – Qualidade OK
  6. Gate 6 – SSMA OK
  7. Gate 7 – Financeiro OK
  8. Gate 8 – Gerencial OK
  9. Gate 9 – Competência Concluída

#### 2.2. Lógica de Gates
- [ ] Implementar sequência obrigatória
- [ ] **Regra crítica:** Gate 5 (Qualidade) e Gate 6 (SSMA) bloqueiam Gate 9
- [ ] Interface de aprovação/rejeição
- [ ] Histórico e rastreabilidade

#### 2.3. Integração com Departamentos
- [ ] Gate 2 → Módulo Custos
- [ ] Gate 3 → Módulo Produção
- [ ] Gate 4 → Módulo Comercial
- [ ] Gate 5 → Módulo Qualidade
- [ ] Gate 6 → Módulo SSMA
- [ ] Gate 7 → Módulo Financeiro
- [ ] Gate 8 → Módulo Gerencial

---

### 3. FECHAMENTO MENSAL

**Por que é crítico:**
- Processo obrigatório conforme Memorial Oficial
- Validação de todos os departamentos
- Competência só fecha quando todos os gates estão OK

**Tarefas:**

#### 3.1. Modelagem
- [ ] Modelo Prisma: `CompetenciaMensal`
- [ ] Relacionamento com obra e período
- [ ] Status: aberta, em fechamento, fechada

#### 3.2. Fluxo de Fechamento
- [ ] Interface de abertura de competência
- [ ] Validação sequencial dos gates
- [ ] Dashboard de status do fechamento
- [ ] Bloqueio de edições após fechamento

#### 3.3. Validações Obrigatórias
- [ ] Produção validada (Gate 3)
- [ ] Custos apropriados (Gate 2)
- [ ] Receita validada (Gate 4)
- [ ] Qualidade aprovada (Gate 5)
- [ ] SSMA aprovado (Gate 6)
- [ ] Financeiro conciliado (Gate 7)
- [ ] Gerencial aprovado (Gate 8)
- [ ] Competência concluída (Gate 9)

---

## 🟠 PRIORIDADE ALTA (Fase 2 - 4-6 semanas)

### 4. COMERCIAL DA OBRA (Completo)

**Funcionalidades:**
- [ ] Medição de Produção (MP)
- [ ] Medição do Cliente (MC)
- [ ] Comparativo MP x MC (sigiloso)
- [ ] Aditivos contratuais
- [ ] Glosas
- [ ] Faturamento
- [ ] Integração com Gate 4 (Fechamento Comercial)

---

### 5. MÓDULO CUSTOS

**Funcionalidades:**
- [ ] Apropriações de custos
- [ ] Rateios
- [ ] Controle CR/CO (Custo Real vs. Custo Orçado)
- [ ] Controle F/CD (Faturamento vs. Custo Direto)
- [ ] Fechamento mensal de custos
- [ ] Integração com Gate 2 (Fechamento Mensal de Custos)

---

### 6. MÓDULO PRODUÇÃO

**Funcionalidades:**
- [ ] Execução física
- [ ] Avanços diários
- [ ] PBS (Planejamento Baseado em Serviços)
- [ ] Apontamentos
- [ ] Produtividade
- [ ] **IMPORTANTE:** Produção NÃO trabalha com valores financeiros
- [ ] Integração com Gate 3 (Fechamento de Produção)

---

## 🟡 PRIORIDADE MÉDIA (Fase 3 - 6-8 semanas)

### 7. MÓDULO QUALIDADE

**Funcionalidades:**
- [ ] Inspeções de qualidade
- [ ] Não Conformidades (NCs)
- [ ] Ensaios
- [ ] Liberação de serviços
- [ ] **PODER DE TRAVA:** Bloqueia fechamento se não aprovado
- [ ] Integração com Gate 5 (Qualidade OK)

---

### 8. MÓDULO SSMA

**Funcionalidades:**
- [ ] Segurança do trabalho
- [ ] Incidentes e acidentes
- [ ] Treinamentos
- [ ] Inspeções de campo
- [ ] **PODER DE TRAVA:** Bloqueia fechamento se não aprovado
- [ ] Integração com Gate 6 (SSMA OK)

---

### 9. MÓDULO ENGENHARIA

**Funcionalidades:**
- [ ] Projetos técnicos
- [ ] Documentação técnica
- [ ] Liberação de frentes de trabalho
- [ ] Apoio técnico à produção
- [ ] Interface com qualidade e SSMA

---

### 10. EXPANDIR SUPRIMENTOS

**Funcionalidades Adicionais:**
- [ ] Requisições de compra
- [ ] Cotações
- [ ] Controle de estoque por obra
- [ ] Entrada e saída de materiais
- [ ] Integração com custos e produção

---

## 🟢 PRIORIDADE BAIXA (Fase 4 - 8+ semanas)

### 11. MÓDULO FINANCEIRO DA OBRA

**Funcionalidades:**
- [ ] Fluxo de caixa
- [ ] Contas a receber
- [ ] Contas a pagar
- [ ] Interface com faturamento
- [ ] Integração com Gate 7 (Financeiro OK)

---

### 12. MÓDULO GERENCIAL

**Funcionalidades:**
- [ ] Análise de resultado
- [ ] Tendências
- [ ] Cenários
- [ ] Tomada de decisão
- [ ] Integração com Gate 8 (Gerencial OK)

---

### 13. MEIO AMBIENTE

**Funcionalidades:**
- [ ] Licenças ambientais
- [ ] Condicionantes
- [ ] Monitoramentos ambientais

---

### 14. MELHORIAS E OTIMIZAÇÕES

- [ ] Integração completa da Intranet com API real
- [ ] Performance e otimizações
- [ ] Testes automatizados
- [ ] Documentação de API
- [ ] Deploy em produção

---

## 📊 CRONOGRAMA SUGERIDO

### Semana 1-2: Módulo Corporativo (Base)
- Estrutura e rotas
- Cadastro de Clientes
- Cadastro de Contratos

### Semana 3-4: Baseline e Obras no Corporativo
- Baseline Comercial no corporativo
- Cadastro e liberação de obras
- Gate 1 implementado

### Semana 5-6: Gates e Fechamento Mensal
- 9 Gates oficiais completos
- Lógica de sequência e bloqueios
- Fechamento mensal básico

### Semana 7-10: Departamentos Críticos
- Comercial da Obra completo
- Módulo Custos
- Módulo Produção

### Semana 11-14: Departamentos de Trava
- Qualidade (Gate 5)
- SSMA (Gate 6)
- Integração com fechamento

### Semana 15+: Departamentos Restantes
- Engenharia
- Financeiro
- Gerencial
- Meio Ambiente

---

## 🎯 MÉTRICAS DE SUCESSO

### Fase 1 (Crítica)
- ✅ Módulo Corporativo funcional
- ✅ Baseline criada no corporativo
- ✅ Obras liberadas via Gate 1
- ✅ 9 Gates implementados
- ✅ Fechamento mensal básico funcionando

### Fase 2 (Alta)
- ✅ Comercial da Obra completo
- ✅ Custos com fechamento mensal
- ✅ Produção com avanços diários

### Fase 3 (Média)
- ✅ Qualidade e SSMA com poder de trava
- ✅ Engenharia funcional
- ✅ Suprimentos expandido

### Fase 4 (Baixa)
- ✅ Todos os departamentos implementados
- ✅ Sistema completo e funcional
- ✅ Pronto para produção

---

## 📝 NOTAS IMPORTANTES

1. **Sempre consultar o Memorial Descritivo Oficial** antes de implementar
2. **Princípio fundamental:** "O CORPORATIVO GOVERNA. A OBRA EXECUTA."
3. **Gates são obrigatórios:** Sem Qualidade OK e SSMA OK, competência não fecha
4. **Baseline é imutável:** Após liberação, obra apenas consome
5. **Fechamento mensal é rigoroso:** Todos os departamentos devem validar

---

**Documento criado em:** Janeiro 2026  
**Próxima revisão:** Após conclusão da Fase 1  
**Status:** 🟢 Ativo






