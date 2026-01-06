# 📋 RESUMO CONCEITUAL - ERP G-NESIS

## 🎯 VISÃO GERAL DO PROJETO

O **ERP G-NESIS** é um sistema de gestão empresarial desenvolvido especificamente para **gestão de obras e projetos de infraestrutura**. O sistema foi criado para atender às necessidades específicas do setor de construção civil, com foco em controle financeiro, operacional e gerencial de obras.

---

## 🏗️ CONCEITO PRINCIPAL

### O que é o ERP G-NESIS?

Um sistema completo de gestão que integra:
- **Gestão de Obras**: Controle de múltiplas obras simultaneamente
- **Estrutura Analítica do Projeto (EAP)**: Visão dual comercial/operacional
- **Medições e Avanço Físico**: Acompanhamento de execução
- **Gates de Aprovação**: Controle de marcos e portões de aprovação
- **Suprimentos**: Gestão de insumos e materiais
- **Financeiro**: Controle de receitas, custos e orçamentos
- **Relatórios e Dashboards**: Visualização de KPIs e métricas

### Diferencial

- **Foco em Infraestrutura**: Desenvolvido especificamente para obras rodoviárias, pontes, barragens, etc.
- **EAP Dual**: Separação clara entre visão comercial (contrato) e operacional (execução)
- **Multi-obra e Multi-usuário**: Suporte a várias obras e equipes simultaneamente
- **Interface Profissional**: Design limpo e funcional para uso diário por engenheiros

---

## 📊 ARQUITETURA DO SISTEMA

### Frontend
- **Next.js 14** (App Router)
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Recharts** para gráficos

### Backend
- **Express.js** (API REST)
- **Prisma ORM** (banco de dados)
- **PostgreSQL** (banco de dados)
- **JWT** (autenticação)
- **Bcrypt** (criptografia de senhas)

### Banco de Dados
- **PostgreSQL** com schema Prisma
- Modelos: Usuario, Obra, BaselineComercial, EAP, EapFatorConversao, Gate, Medicao, Insumo

---

## 🏢 MÓDULOS E DEPARTAMENTOS

### ✅ **1. INTRANET / DASHBOARD** (Implementado)
**Rota:** `/` (página inicial)

**Funcionalidades:**
- Visão geral da obra ativa
- Cards de resumo (Tarefas, Comunicados, Marcos)
- Fila de Trabalho (itens pendentes de aprovação)
- Comunicados e notificações
- Calendário de marcos e eventos
- Requisições pendentes

**Status:** ✅ Implementado (aguardando integração com API)

---

### ✅ **2. OBRAS** (Implementado)
**Rota:** `/obras`

**Funcionalidades:**
- Listagem de todas as obras
- Criação, edição e exclusão de obras
- Filtros e busca
- Detalhes da obra:
  - Resumo geral
  - EAP (Estrutura Analítica do Projeto)
  - Medições e avanço físico
  - Relatórios e gráficos
  - Gates de aprovação

**Status:** ✅ Implementado e funcional

---

### ✅ **3. COMERCIAL** (Parcialmente Implementado)
**Rota:** `/comercial/*`

**Funcionalidades:**
- Estruturação da EAP Comercial
- Definição de baselines
- Aprovações comerciais
- Visualização da EAP Comercial
- Edição de itens comerciais
- Cálculo de valores
- Controle de receitas contratuais
- Faturamento
- Projeções de receita
- Análise de custos
- Comparação orçado vs. realizado
- Margem de contribuição

**Status:** ⚠️ Parcialmente implementado (EAP via módulo Obras)

---

### ✅ **4. ENGENHARIA** (Planejado)
**Rota:** `/engenharia`

**Funcionalidades Planejadas:**
- Gestão de projetos técnicos
- Controle de documentação técnica
- Aprovações técnicas
- Desenhos e projetos
- Especificações técnicas
- Controle de projetos executivos
- Gestão de memoriais descritivos
- Acompanhamento de execução técnica

**Status:** 📋 Planejado

---

### ✅ **5. PRODUÇÃO** (Planejado)
**Rota:** `/producao`

**Funcionalidades Planejadas:**
- Controle de produção diária
- Acompanhamento de equipes
- Gestão de frentes de trabalho
- Controle de produtividade
- Relatórios de produção
- Análise de eficiência
- Planejamento de produção

**Status:** 📋 Planejado

---

### ✅ **6. SAÚDE E SEGURANÇA DO TRABALHO (SST)** (Planejado)
**Rota:** `/sst` ou `/seguranca`

**Funcionalidades Planejadas:**
- Gestão de acidentes e incidentes
- Controle de EPIs (Equipamentos de Proteção Individual)
- Inspeções de segurança
- Treinamentos de segurança
- Permissões de trabalho (PT, APR)
- Análise de riscos
- Indicadores de segurança (taxa de frequência, gravidade)
- Relatórios de SST
- Gestão de brigada de incêndio
- Controle de exames médicos

**Status:** 📋 Planejado

---

### ✅ **7. QUALIDADE** (Planejado)
**Rota:** `/qualidade`

**Funcionalidades Planejadas:**
- Controle de qualidade de materiais
- Inspeções de qualidade
- Não conformidades
- Planos de ação corretiva
- Certificados de qualidade
- Controle de ensaios
- Relatórios de qualidade
- Indicadores de qualidade
- Gestão de auditorias
- Controle de documentação de qualidade

**Status:** 📋 Planejado

---

### ✅ **8. ADMINISTRAÇÃO** (Planejado)
**Rota:** `/administracao`

**Funcionalidades Planejadas:**
- Gestão administrativa geral
- Controle de documentação
- Gestão de contratos
- Aprovações administrativas
- Controle de correspondências
- Gestão de reuniões
- Arquivo e documentação
- Controle de prazos administrativos

**Status:** 📋 Planejado

---

### ✅ **9. MEIO AMBIENTE** (Planejado)
**Rota:** `/meio-ambiente` ou `/ambiente`

**Funcionalidades Planejadas:**
- Gestão de licenças ambientais
- Controle de impactos ambientais
- Monitoramento ambiental
- Gestão de resíduos
- Planos de controle ambiental
- Relatórios ambientais
- Indicadores ambientais
- Gestão de áreas protegidas
- Controle de emissões
- Programas ambientais

**Status:** 📋 Planejado

---

### ✅ **10. SUPRIMENTOS** (Implementado)
**Rota:** `/suprimentos`

**Funcionalidades:**
- Cadastro de insumos e materiais
- Controle de estoque
- Requisições de compra
- Cotações
- Entrada e saída de materiais
- Histórico de movimentações

**Status:** ✅ Implementado (básico - cadastro de insumos)

**Próximas Funcionalidades:**
- Requisições de compra
- Cotações
- Controle de estoque por obra
- Entrada/saída de materiais

---

### ✅ **11. FINANCEIRO** (Planejado)
**Rota:** `/financeiro`

**Funcionalidades Planejadas:**
- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Orçamento vs. Realizado
- Conciliação bancária
- Relatórios financeiros

**Status:** 📋 Planejado

---

### ✅ **12. GERENCIAL** (Planejado)
**Rota:** `/gerencial`

**Funcionalidades Planejadas:**
- Dashboards executivos
- KPIs e métricas consolidadas
- Análise de performance
- Relatórios gerenciais
- Indicadores de saúde do projeto
- Visão consolidada de todos os departamentos

**Status:** 📋 Planejado

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

### Sistema de Usuários
- **Perfis:** Admin, Gestor, Engenheiro, Usuário
- **Autenticação:** JWT (JSON Web Tokens)
- **Permissões:** Controle por obra (multi-obra)
- **Sessão:** Tokens de acesso e refresh

### Proteção de Rotas
- Middleware de autenticação
- Validação de permissões por obra
- Soft delete (exclusão lógica)

---

## 📈 FUNCIONALIDADES CORE IMPLEMENTADAS

### ✅ EAP (Estrutura Analítica do Projeto)
- EAP Comercial e Operacional
- Fatores de conversão entre EAPs
- Interface de alta densidade (estilo planilha)
- Cálculo automático de valores

### ✅ Medições
- Lançamento de medições
- Histórico de medições
- Status (rascunho, enviada, aprovada, rejeitada)
- Cálculo automático de valores

### ✅ Gates de Aprovação
- Controle de marcos do projeto
- Status sequencial
- Aprovações e rejeições
- Histórico de aprovações

### ✅ Dashboards
- Gráfico de evolução (linha)
- Gráfico de composição (pizza)
- Cards de KPI
- Filtros de período

---

## 🗄️ ESTRUTURA DE DADOS

### Entidades Principais

1. **Usuario**: Usuários do sistema
2. **Obra**: Obras/projetos
3. **BaselineComercial**: Versões aprovadas do escopo comercial
4. **Eap**: Estrutura Analítica do Projeto (comercial/operacional)
5. **EapFatorConversao**: Relacionamento entre EAPs comercial/operacional
6. **Gate**: Portões/marcos de aprovação
7. **Medicao**: Medições realizadas
8. **Insumo**: Insumos e materiais
9. **UsuarioObra**: Permissões de acesso (multi-obra)

---

## 🚀 STATUS ATUAL DO PROJETO

### ✅ Fases Concluídas
- ✅ Fase 1-10: Desenvolvimento completo do sistema base
- ✅ Fase 11: Seed de dados (infraestrutura)
- ✅ Autenticação e segurança
- ✅ Gestão de obras
- ✅ EAP e medições
- ✅ Dashboards e relatórios
- ✅ Suprimentos (básico)
- ✅ Interface Intranet

### 🔄 Em Desenvolvimento
- Integração completa da Intranet com API
- Expansão do módulo Suprimentos
- Módulo Comercial completo

### 📋 Planejado
- Módulo Gerencial
- Módulo Engenharia
- Módulo Financeiro
- Módulo RH
- Funcionalidades avançadas de cada módulo

---

## 📝 PRÓXIMOS PASSOS SUGERIDOS

### Prioridade Alta
1. **Completar Módulo Comercial**
   - Estruturação completa
   - Receita e Custos
   - Relatórios comerciais

2. **Expandir Suprimentos**
   - Requisições de compra
   - Cotações
   - Controle de estoque por obra

### Prioridade Média
3. **Desenvolver Módulo Engenharia**
   - Gestão de documentação técnica
   - Aprovações técnicas
   - Controle de projetos executivos

4. **Implementar Módulo Produção**
   - Controle de produção diária
   - Acompanhamento de equipes
   - Relatórios de produtividade

5. **Criar Módulo Saúde e Segurança do Trabalho (SST)**
   - Gestão de acidentes e incidentes
   - Controle de EPIs
   - Inspeções de segurança
   - Indicadores de segurança

6. **Desenvolver Módulo Qualidade**
   - Controle de qualidade de materiais
   - Inspeções de qualidade
   - Não conformidades
   - Indicadores de qualidade

### Prioridade Baixa
7. **Implementar Módulo Administração**
   - Gestão administrativa geral
   - Controle de documentação
   - Gestão de contratos

8. **Criar Módulo Meio Ambiente**
   - Gestão de licenças ambientais
   - Controle de impactos ambientais
   - Monitoramento ambiental

9. **Desenvolver Módulo Financeiro**
   - Contas a pagar/receber
   - Fluxo de caixa
   - Orçamento vs. Realizado

10. **Criar Módulo Gerencial**
    - Dashboards executivos
    - KPIs consolidados
    - Relatórios gerenciais

---

## 🎯 OBJETIVO FINAL

Criar um ERP completo e integrado que permita:
- **Gestão completa** de obras de infraestrutura
- **Controle financeiro** preciso
- **Acompanhamento operacional** em tempo real
- **Tomada de decisão** baseada em dados
- **Colaboração** entre equipes
- **Rastreabilidade** completa de processos

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0  
**Status do Projeto:** 🟢 Em Desenvolvimento Ativo

