# 📋 MEMORIAL DESCRITIVO CONCEITUAL COMPLETO
## ERP GENESIS - Plataforma Corporativa + Módulo Obra
### Documento para Validação em ChatGPT

**Data:** Janeiro 2026  
**Versão:** 2.0 (Conceito Corrigido e Validado)  
**Status:** 🟢 Documento Mestre para Desenvolvimento

---

## 📑 SUMÁRIO

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura Conceitual Macro](#2-arquitetura-conceitual-macro)
3. [Módulo Corporativo - Detalhamento Completo](#3-módulo-corporativo---detalhamento-completo)
4. [Módulo Obra - Detalhamento Completo](#4-módulo-obra---detalhamento-completo)
5. [EAP - Estrutura Analítica com Visão Dual](#5-eap---estrutura-analítica-com-visão-dual)
6. [Gates de Governança](#6-gates-de-governança)
7. [Fechamento Mensal](#7-fechamento-mensal)
8. [Interface e Experiência do Usuário](#8-interface-e-experiência-do-usuário)
9. [Tecnologias e Arquitetura Técnica](#9-tecnologias-e-arquitetura-técnica)
10. [Estado Atual de Implementação](#10-estado-atual-de-implementação)
11. [Fluxos de Trabalho Detalhados](#11-fluxos-de-trabalho-detalhados)
12. [Regras de Negócio](#12-regras-de-negócio)
13. [Modelos de Dados](#13-modelos-de-dados)
14. [Próximos Passos de Implementação](#14-próximos-passos-de-implementação)

---

## 1. VISÃO GERAL DO SISTEMA

### 1.1. O que é o ERP GENESIS

O **ERP GENESIS** é uma plataforma corporativa integrada desenvolvida especificamente para empresas de **engenharia pesada e infraestrutura**:

- Rodovias
- Pontes e viadutos
- Barragens
- Saneamento
- Grandes obras de infraestrutura

### 1.2. Princípio Fundamental

**"O CORPORATIVO GOVERNA. A OBRA EXECUTA."**

**Regras:**
- Nada nasce na obra sem origem corporativa
- Nada é validado no corporativo sem evidência da obra
- O Corporativo define estratégia, a Obra executa

### 1.3. Estrutura do Sistema

O sistema é estruturado em **DOIS GRANDES BLOCOS INSEPARÁVEIS**:

1. **MÓDULO CORPORATIVO** (Governança, Estratégia e Padronização)
2. **MÓDULO OBRA** (Execução, Controle e Resultado)

---

## 2. ARQUITETURA CONCEITUAL MACRO

```
ERP GENESIS (Plataforma Única)
│
├── MÓDULO CORPORATIVO
│   ├── Governança Corporativa
│   ├── Cadastro de Clientes
│   ├── Cadastro de Contratos
│   ├── Abertura de Centro de Custo
│   ├── Upload de Planilha Analítica (Dados Referenciais)
│   ├── Padrões Técnicos e Econômicos
│   ├── Usuários e Perfis
│   ├── Políticas, Regras e Gates Globais
│   ├── Cadastro de Obras
│   └── Liberação de Obras (Gate 1)
│
└── MÓDULO OBRA
    ├── Comercial da Obra
    │   ├── Estruturação (Criação da EAP)
    │   ├── Medição de Produção (MP)
    │   ├── Medição do Cliente (MC)
    │   ├── Comparativo MP x MC
    │   ├── Aditivos
    │   ├── Glosas
    │   └── Faturamento
    ├── Engenharia
    ├── Produção
    ├── Suprimentos
    ├── Custos
    ├── Qualidade
    ├── SSMA (Segurança, Saúde e Meio Ambiente)
    ├── Meio Ambiente
    ├── Financeiro da Obra
    ├── Planejamento e Controle
    └── Painel Gerencial Integrado
```

---

## 3. MÓDULO CORPORATIVO - DETALHAMENTO COMPLETO

### 3.1. Conceito e Responsabilidades

O Módulo Corporativo é o **"CÉREBRO"** do ERP GENESIS.

**Ele NÃO executa obra. Ele DEFINE, CONTROLA e GOVERNA.**

### 3.2. Funcionalidades Detalhadas

#### 3.2.1. Cadastro de Clientes

**Funcionalidades:**
- CRUD completo de clientes
- Dados cadastrais:
  - Razão social
  - CNPJ
  - Endereço
  - Contatos
  - Classificação (público/privado)
- Histórico de contratos
- Relacionamento com obras

**Regras:**
- Cliente deve existir antes de criar contrato
- Soft delete (exclusão lógica)
- Auditoria de alterações

#### 3.2.2. Cadastro de Contratos

**Funcionalidades:**
- CRUD completo de contratos
- Dados do contrato:
  - Número do contrato
  - Cliente vinculado
  - Valor total
  - Data de assinatura
  - Prazo de execução
  - Tipo de contrato
- Upload de documentos contratuais
- Aditivos contratuais (histórico)
- Status do contrato

**Regras:**
- Contrato deve estar vinculado a um cliente
- Um contrato pode gerar múltiplas obras
- Soft delete

#### 3.2.3. Abertura de Centro de Custo

**Funcionalidades:**
- Criação de centro de custo para a obra
- Código do centro de custo
- Vinculação com obra
- Configuração de parâmetros:
  - Moeda
  - Período fiscal
  - Regras de apropriação

**Regras:**
- Centro de custo é criado antes do upload da planilha
- Um centro de custo = uma obra

#### 3.2.4. Upload de Planilha Analítica (DADOS REFERENCIAIS)

**Funcionalidades:**
- Upload de arquivo Excel/CSV com planilha analítica
- Dados referenciais contidos na planilha:
  - **Proposta** (valores da proposta comercial)
  - **Orçamento** (valores orçados)
  - **Preços** (preços unitários referenciais)
  - Itens de serviço
  - Quantidades referenciais
  - Unidades de medida
- Validação de formato
- Processamento e importação
- Pré-visualização antes de confirmar

**IMPORTANTE:**
- Estes são **DADOS REFERENCIAIS**, não a EAP final
- A planilha serve como **BASE** para estruturação
- O Corporativo **NÃO cria a EAP** com estes dados
- Os dados são enviados para o Módulo Obra/Comercial

**Regras:**
- Planilha deve seguir formato padrão
- Validação de dados obrigatórios
- Histórico de versões da planilha
- Auditoria de uploads

#### 3.2.5. Padrões Técnicos e Econômicos

**Funcionalidades:**
- Cadastro de padrões corporativos:
  - Composições de custo padrão
  - Índices de produtividade
  - Custos unitários referenciais
  - Metas de desempenho
- Aplicação automática em novas obras
- Versionamento de padrões

#### 3.2.6. Usuários e Perfis

**Funcionalidades:**
- Gestão de usuários do sistema
- Perfis de acesso:
  - Administrador Corporativo
  - Gestor Corporativo
  - Gerente de Obra
  - Engenheiro
  - Usuário
- Permissões por módulo
- Multi-obra (usuário pode ter acesso a várias obras)

#### 3.2.7. Cadastro de Obras

**Funcionalidades:**
- CRUD completo de obras
- Dados da obra:
  - Código da obra
  - Nome/Descrição
  - Cliente vinculado
  - Contrato vinculado
  - Centro de custo
  - Localização
  - Datas (início, fim previsto)
  - Valor total
  - Status
- Vinculação com dados referenciais (planilha)

**Regras:**
- Obra deve estar vinculada a cliente e contrato
- Centro de custo deve estar criado
- Planilha analítica deve estar carregada

#### 3.2.8. Liberação de Obras (Gate 1)

**Funcionalidades:**
- Processo de liberação da obra
- Validações antes de liberar:
  - Cliente cadastrado
  - Contrato vinculado
  - Centro de custo criado
  - Planilha analítica carregada
- Aprovação e liberação
- Após liberação, obra passa a existir no Módulo Obra

**Gate 1 - Liberação da Obra:**
- Controla a transição Corporativo → Obra
- Uma vez liberada, obra não pode ser deletada
- Histórico de liberações

---

## 4. MÓDULO OBRA - DETALHAMENTO COMPLETO

### 4.1. Conceito e Princípio

O Módulo Obra é o ambiente de **EXECUÇÃO**.

**Princípio:** "Executar, medir, comparar, corrigir."

Todos os departamentos operam sobre:
- A mesma baseline (criada pelo Comercial)
- A mesma EAP (criada pelo Comercial)
- Os mesmos dados mestres

### 4.2. Fluxo de Inicialização da Obra

**Após Gate 1 (Liberação):**

1. Obra aparece no Módulo Obra
2. Sistema **preenche automaticamente** o Departamento Comercial com dados referenciais do Corporativo
3. Gerente Comercial recebe notificação
4. Gerente Comercial inicia trabalho

### 4.3. DEPARTAMENTOS DO MÓDULO OBRA

---

#### 4.3.1. COMERCIAL DA OBRA

**Responsabilidades:**

##### A. ESTRUTURAÇÃO (Primeira Atividade)

**O que é:**
- Criação da EAP (Estrutura Analítica do Projeto)
- Estruturação hierárquica baseada em dados referenciais
- Definição de itens, quantidades e valores
- Configuração de fatores de conversão (se necessário)

**Fluxo:**
1. Gerente Comercial acessa módulo Comercial
2. Visualiza dados referenciais recebidos do Corporativo
3. Cria a EAP comercial:
   - Define hierarquia (níveis)
   - Estrutura itens
   - Define quantidades
   - Define valores unitários
   - Calcula valores totais
4. Cria Baseline Comercial (versão 1)
5. Aprova estruturação
6. **Libera para outros serviços**

**Interface:**
- Tabela de alta densidade (estilo planilha)
- Edição inline
- Validações em tempo real
- Cálculos automáticos
- Tema escuro profissional

**Regras:**
- EAP deve ser criada antes de qualquer outra atividade
- Valores devem ser consistentes com dados referenciais
- Após liberação, EAP não pode ser alterada (apenas versionada)
- Versão 1 da Baseline é criada automaticamente

##### B. Medição de Produção (MP)

**O que é:**
- Medição do que foi **realmente executado** pela empresa
- Controle interno de produção
- Base para apropriação de custos

**Funcionalidades:**
- Lançamento de medições mensais
- Vinculação com itens da EAP
- Quantidade medida
- Valor medido (calculado automaticamente)
- Período de referência
- Status (rascunho, enviada, aprovada, rejeitada)
- Histórico de medições

**Regras:**
- MP pode ser lançada a qualquer momento
- Valores são calculados automaticamente
- Requer aprovação antes de ser considerada válida

##### C. Medição do Cliente (MC)

**O que é:**
- Medição do que será **faturado para o cliente**
- Pode divergir da MP
- Base para faturamento

**Funcionalidades:**
- Lançamento de medições mensais
- Vinculação com itens da EAP
- Quantidade medida
- Valor medido
- Período de referência
- Status (rascunho, enviada, aprovada, rejeitada)
- Histórico de medições

**Regras:**
- MC pode ser lançada a qualquer momento
- Pode divergir da MP (requer justificativa)
- Requer aprovação antes de faturamento

##### D. Comparativo MP x MC (Sigiloso)

**O que é:**
- Comparação entre Medição de Produção e Medição do Cliente
- Identificação de divergências
- Análise de desvios

**Funcionalidades:**
- Visualização comparativa
- Cálculo de diferenças (quantidade e valor)
- Identificação de itens divergentes
- Justificativas para divergências
- Relatórios sigilosos

**Regras:**
- Acesso restrito (apenas gerentes e diretores)
- Divergências devem ser justificadas
- Histórico de comparativos

##### E. Aditivos

**O que é:**
- Alterações contratuais que aumentam escopo/valor
- Aditivos aprovados pelo cliente

**Funcionalidades:**
- Cadastro de aditivos
- Vinculação com contrato original
- Valores adicionais
- Aprovação do cliente
- Integração com EAP (novos itens ou ajustes)

**Regras:**
- Aditivos criam nova versão da Baseline
- Devem ser aprovados antes de execução
- Histórico completo

##### F. Glosas

**O que é:**
- Reduções/descontos aplicados pelo cliente
- Itens não aceitos ou com problemas

**Funcionalidades:**
- Cadastro de glosas
- Vinculação com medições
- Valores descontados
- Justificativa
- Status (pendente, aceita, contestada)

**Regras:**
- Glosas impactam receita
- Devem ser registradas e justificadas
- Histórico completo

##### G. Faturamento

**O que é:**
- Geração de notas fiscais/faturas
- Baseado na MC aprovada
- Controle de faturamento

**Funcionalidades:**
- Geração de faturamento mensal
- Baseado em MC aprovada
- Cálculo de valores a faturar
- Integração com sistema financeiro
- Controle de faturamento pendente

**Regras:**
- Faturamento baseado em MC aprovada
- Integração com Gate 4 (Fechamento Comercial)

---

#### 4.3.2. ENGENHARIA

**Responsabilidades:**

##### A. Projetos Técnicos

**Funcionalidades:**
- Gestão de projetos executivos
- Upload de desenhos e projetos
- Versionamento de projetos
- Aprovações técnicas
- Controle de revisões

##### B. Documentação Técnica

**Funcionalidades:**
- Memoriais descritivos
- Especificações técnicas
- Relatórios técnicos
- Controle de documentos
- Biblioteca técnica

##### C. Liberação de Frentes

**Funcionalidades:**
- Liberação de frentes de trabalho
- Validação técnica antes de produção
- Controle de frentes liberadas
- Integração com Produção

##### D. Apoio Técnico à Produção

**Funcionalidades:**
- Suporte técnico em campo
- Resolução de problemas técnicos
- Orientações de execução

##### E. Interface com Qualidade e SSMA

**Funcionalidades:**
- Integração com inspeções de qualidade
- Suporte a não conformidades
- Interface com segurança do trabalho

---

#### 4.3.3. PRODUÇÃO

**Responsabilidades:**

**IMPORTANTE:** Produção **NÃO trabalha** com valores financeiros absolutos. Apenas quantidades físicas.

##### A. Execução Física

**Funcionalidades:**
- Registro de execução diária
- Quantidades executadas
- Frentes de trabalho
- Equipes envolvidas

##### B. Avanços Diários

**Funcionalidades:**
- Apontamento diário de produção
- Quantidades por item da EAP
- Integração com EAP operacional
- Cálculo de percentual de avanço

##### C. PBS (Planejamento Baseado em Serviços)

**Funcionalidades:**
- Estruturação de serviços
- Planejamento de execução
- Sequência de serviços
- Dependências entre serviços

##### D. Apontamentos

**Funcionalidades:**
- Apontamento de horas trabalhadas
- Apontamento de equipes
- Apontamento de equipamentos
- Produtividade

##### E. Produtividade

**Funcionalidades:**
- Cálculo de produtividade
- Comparação com metas
- Indicadores de desempenho
- Relatórios de produtividade

**Integração:**
- Gate 3 (Fechamento de Produção)
- Integração com Custos (para apropriação)

---

#### 4.3.4. SUPRIMENTOS

**Responsabilidades:**

##### A. Requisições

**Funcionalidades:**
- Criação de requisições de compra
- Itens solicitados
- Quantidades
- Justificativa
- Aprovações

##### B. Compras

**Funcionalidades:**
- Processo de compra
- Cotações
- Seleção de fornecedores
- Emissão de ordens de compra
- Acompanhamento

##### C. Contratos

**Funcionalidades:**
- Contratos com fornecedores
- Contratos de serviços
- Gestão de contratos
- Renovações

##### D. Recebimentos

**Funcionalidades:**
- Recebimento de materiais
- Conferência de quantidades
- Controle de qualidade na recepção
- Entrada no estoque

##### E. Controle de Saldo

**Funcionalidades:**
- Estoque por obra
- Saldo de insumos
- Movimentações
- Alertas de estoque mínimo

**Integração:**
- Custos (para apropriação)
- Produção (para consumo)

---

#### 4.3.5. CUSTOS

**Responsabilidades:**

##### A. Apropriações

**Funcionalidades:**
- Apropriação de custos diretos
- Vinculação com EAP
- Rateio de custos indiretos
- Distribuição de custos

##### B. Rateios

**Funcionalidades:**
- Rateio de custos indiretos
- Critérios de rateio
- Distribuição proporcional
- Controle de rateios

##### C. Controle CR/CO

**O que é:**
- **CR:** Custo Real
- **CO:** Custo Orçado

**Funcionalidades:**
- Comparação Custo Real vs. Custo Orçado
- Análise de desvios
- Variações de custo
- Relatórios comparativos

##### D. Controle F/CD

**O que é:**
- **F:** Faturamento
- **CD:** Custo Direto

**Funcionalidades:**
- Comparação Faturamento vs. Custo Direto
- Análise de margem
- Indicadores de rentabilidade

##### E. Fechamento Mensal de Custos

**Funcionalidades:**
- Fechamento mensal
- Consolidação de custos
- Validação de apropriações
- Integração com Gate 2

**Integração:**
- Gate 2 (Fechamento Mensal de Custos)
- Produção (para apropriação)
- Suprimentos (para apropriação)

---

#### 4.3.6. QUALIDADE

**Responsabilidades:**

**PODER DE TRAVA:** Qualidade tem poder de bloquear fechamento mensal.

##### A. Inspeções

**Funcionalidades:**
- Agendamento de inspeções
- Execução de inspeções
- Registro de resultados
- Não conformidades identificadas

##### B. Não Conformidades (NCs)

**Funcionalidades:**
- Cadastro de NCs
- Classificação (crítica, alta, média, baixa)
- Ações corretivas
- Acompanhamento
- Fechamento de NCs

##### C. Ensaios

**Funcionalidades:**
- Controle de ensaios
- Resultados de ensaios
- Certificados
- Validação de materiais

##### D. Liberação de Serviços

**Funcionalidades:**
- Liberação de serviços após inspeção
- Controle de serviços liberados
- Bloqueio de serviços não aprovados

**Integração:**
- Gate 5 (Qualidade OK)
- Engenharia
- SSMA

---

#### 4.3.7. SSMA (Segurança, Saúde e Meio Ambiente)

**Responsabilidades:**

**PODER DE TRAVA:** SSMA tem poder de bloquear fechamento mensal.

##### A. Segurança do Trabalho

**Funcionalidades:**
- Controle de EPIs
- Inspeções de segurança
- Permissões de trabalho (PT, APR)
- Análise de riscos

##### B. Incidentes

**Funcionalidades:**
- Registro de acidentes
- Registro de incidentes
- Investigação
- Ações corretivas
- Indicadores (taxa de frequência, gravidade)

##### C. Treinamentos

**Funcionalidades:**
- Controle de treinamentos
- Certificações
- Validade de certificados
- Alertas de vencimento

##### D. Inspeções de Campo

**Funcionalidades:**
- Inspeções de segurança
- Inspeções ambientais
- Registro de não conformidades
- Ações corretivas

**Integração:**
- Gate 6 (SSMA OK)
- Qualidade
- Engenharia

---

#### 4.3.8. MEIO AMBIENTE

**Responsabilidades:**

##### A. Licenças Ambientais

**Funcionalidades:**
- Controle de licenças
- Validade de licenças
- Condicionantes
- Renovações

##### B. Condicionantes

**Funcionalidades:**
- Controle de condicionantes
- Cumprimento
- Prazos
- Documentação

##### C. Monitoramentos

**Funcionalidades:**
- Monitoramento ambiental
- Controle de emissões
- Controle de resíduos
- Relatórios ambientais

---

#### 4.3.9. FINANCEIRO DA OBRA

**Responsabilidades:**

##### A. Fluxo de Caixa

**Funcionalidades:**
- Projeção de fluxo de caixa
- Entradas e saídas
- Saldo projetado
- Análise de necessidade de capital

##### B. Contas a Receber

**Funcionalidades:**
- Controle de recebimentos
- Faturas emitidas
- Controle de inadimplência
- Previsão de recebimentos

##### C. Contas a Pagar

**Funcionalidades:**
- Controle de pagamentos
- Fornecedores
- Prazos de pagamento
- Planejamento de pagamentos

##### D. Interface com Faturamento

**Funcionalidades:**
- Integração com faturamento (Comercial)
- Conciliação
- Controle de recebimentos

**Integração:**
- Gate 7 (Financeiro OK)
- Comercial (faturamento)

---

#### 4.3.10. GERENCIAL

**Responsabilidades:**

##### A. Análise de Resultado

**Funcionalidades:**
- Análise de resultado da obra
- Margem de contribuição
- Rentabilidade
- Indicadores financeiros

##### B. Tendências

**Funcionalidades:**
- Análise de tendências
- Projeções
- Cenários
- Análise de riscos

##### C. Cenários

**Funcionalidades:**
- Simulação de cenários
- Análise de "e se"
- Tomada de decisão
- Planejamento estratégico

##### D. Tomada de Decisão

**Funcionalidades:**
- Dashboards executivos
- KPIs consolidados
- Alertas e notificações
- Relatórios gerenciais

**Integração:**
- Gate 8 (Gerencial OK)
- Todos os departamentos

---

## 5. EAP - ESTRUTURA ANALÍTICA COM VISÃO DUAL

### 5.1. Conceito

A EAP é **ÚNICA**, mas possui **DUAS LEITURAS**:

1. **VISÃO COMERCIAL** (econômica)
2. **VISÃO OPERACIONAL** (execução)

### 5.2. Visão Comercial

**Características:**
- Unidade: m³, ton, m², hh (horas-homem)
- Foco: custo unitário, margem, resultado
- Valores financeiros
- Base para faturamento

**Uso:**
- Medições comerciais (MC)
- Faturamento
- Análise de resultado
- Controle financeiro

### 5.3. Visão Operacional

**Características:**
- Unidade: bloco, estaca, viga, trecho (unidades físicas de execução)
- Foco: produção, quantidade, avanço
- Quantidades físicas
- Base para produção

**Uso:**
- Medições de produção (MP)
- Controle de produção
- Apontamentos
- Produtividade

### 5.4. Fatores de Conversão

**Conceito:**
As duas visões são conectadas por **FATORES DE CONVERSÃO**.

**Exemplo:**
- 1 bloco tipo A = 2,50 m³
- 1 estaca = 15 m³ de concreto
- 1 viga = 8 m³ de concreto

**Regra Fundamental:**
Os **valores financeiros DEVEM ser idênticos**, independente da unidade.

**Exemplo Prático:**
- Comercial: 100 m³ × R$ 50,00 = R$ 5.000,00
- Operacional: 40 blocos × R$ 125,00 = R$ 5.000,00
- Fator: 1 bloco = 2,5 m³

### 5.5. Criação da EAP

**IMPORTANTE - CONCEITO CORRIGIDO:**

**EAP é criada no MÓDULO OBRA, no DEPARTAMENTO COMERCIAL.**

**Fluxo:**
1. Corporativo carrega planilha analítica (dados referenciais)
2. Sistema preenche automaticamente o Comercial
3. Gerente Comercial **cria a EAP** usando dados referenciais
4. Gerente Comercial faz a **ESTRUTURAÇÃO**
5. Após estruturação, **libera para outros serviços**

**Não é criada no Corporativo!**

### 5.6. Estruturação da EAP

**Processo:**
1. Gerente Comercial acessa módulo de Estruturação
2. Visualiza dados referenciais recebidos
3. Cria hierarquia:
   - Níveis (1.0, 2.0, 2.1, etc.)
   - Itens pai e filhos
   - Itens folha (executáveis)
4. Define quantidades e valores:
   - Quantidade planejada
   - Valor unitário
   - Valor total (calculado)
5. Configura fatores de conversão (se necessário)
6. Valida estrutura
7. Cria Baseline Comercial v1
8. Aprova e libera

**Interface:**
- Tabela de alta densidade
- Edição inline
- Cálculos automáticos
- Validações em tempo real
- Tema escuro profissional

### 5.7. Versionamento

**Conceito:**
- EAP pode ter múltiplas versões
- Cada versão cria uma nova Baseline
- Baseline v1, v2, v3, etc.
- Apenas uma baseline ativa por vez

**Quando versionar:**
- Aditivos contratuais
- Alterações de escopo
- Correções significativas

**Regras:**
- Baseline ativa não pode ser alterada
- Nova versão cria nova baseline
- Histórico completo mantido

---

## 6. GATES DE GOVERNANÇA

### 6.1. Conceito

Os Gates garantem **disciplina real de obra**.

São **9 GATES OFICIAIS OBRIGATÓRIOS**:

### 6.2. Os 9 Gates

#### Gate 1 – Liberação da Obra
- **Onde:** Módulo Corporativo
- **Responsável:** Corporativo
- **O que faz:** Libera a obra para o Módulo Obra
- **Validações:**
  - Cliente cadastrado
  - Contrato vinculado
  - Centro de custo criado
  - Planilha analítica carregada
- **Após aprovação:** Obra passa a existir no Módulo Obra

#### Gate 2 – Fechamento Mensal de Custos
- **Onde:** Módulo Obra - Custos
- **Responsável:** Departamento de Custos
- **O que faz:** Valida fechamento mensal de custos
- **Validações:**
  - Todas as apropriações realizadas
  - Rateios aplicados
  - Custos consolidados
  - Validação de valores

#### Gate 3 – Fechamento de Produção
- **Onde:** Módulo Obra - Produção
- **Responsável:** Departamento de Produção
- **O que faz:** Valida fechamento mensal de produção
- **Validações:**
  - Todos os apontamentos realizados
  - Avanços consolidados
  - Produtividade calculada
  - Validação de quantidades

#### Gate 4 – Fechamento Comercial
- **Onde:** Módulo Obra - Comercial
- **Responsável:** Departamento Comercial
- **O que faz:** Valida fechamento mensal comercial
- **Validações:**
  - MP e MC lançadas
  - Faturamento gerado
  - Receita validada
  - Comparativo MP x MC analisado

#### Gate 5 – Qualidade OK
- **Onde:** Módulo Obra - Qualidade
- **Responsável:** Departamento de Qualidade
- **O que faz:** Aprova qualidade do mês
- **Validações:**
  - Inspeções realizadas
  - NCs resolvidas ou em tratamento
  - Ensaios validados
  - Serviços liberados

**PODER DE TRAVA:** Bloqueia Gate 9 se não aprovado.

#### Gate 6 – SSMA OK
- **Onde:** Módulo Obra - SSMA
- **Responsável:** Departamento SSMA
- **O que faz:** Aprova SSMA do mês
- **Validações:**
  - Inspeções realizadas
  - Incidentes tratados
  - Treinamentos em dia
  - Conformidade verificada

**PODER DE TRAVA:** Bloqueia Gate 9 se não aprovado.

#### Gate 7 – Financeiro OK
- **Onde:** Módulo Obra - Financeiro
- **Responsável:** Departamento Financeiro
- **O que faz:** Valida fechamento financeiro
- **Validações:**
  - Fluxo de caixa atualizado
  - Contas a pagar/receber validadas
  - Conciliação realizada
  - Financeiro conciliado

#### Gate 8 – Gerencial OK
- **Onde:** Módulo Obra - Gerencial
- **Responsável:** Gerência da Obra
- **O que faz:** Aprova fechamento gerencial
- **Validações:**
  - Análise de resultado realizada
  - Tendências analisadas
  - Decisões tomadas
  - Aprovação gerencial

#### Gate 9 – Competência Concluída
- **Onde:** Módulo Obra - Gerencial
- **Responsável:** Gerência da Obra
- **O que faz:** Finaliza competência mensal
- **Validações:**
  - Todos os gates anteriores aprovados
  - **Especialmente:** Gate 5 (Qualidade) e Gate 6 (SSMA) devem estar OK

### 6.3. Regra Fundamental

**SEM QUALIDADE OK (Gate 5) E SSMA OK (Gate 6), A COMPETÊNCIA NÃO FECHA (Gate 9 bloqueado).**

### 6.4. Sequência dos Gates

**Ordem de aprovação:**
1. Gate 2 (Custos)
2. Gate 3 (Produção)
3. Gate 4 (Comercial)
4. Gate 5 (Qualidade) - **PODER DE TRAVA**
5. Gate 6 (SSMA) - **PODER DE TRAVA**
6. Gate 7 (Financeiro)
7. Gate 8 (Gerencial)
8. Gate 9 (Competência Concluída) - **Só libera se 5 e 6 estiverem OK**

### 6.5. Interface dos Gates

**Funcionalidades:**
- Dashboard de gates
- Status de cada gate
- Histórico de aprovações
- Rastreabilidade (quem aprovou, quando)
- Notificações de bloqueios

---

## 7. FECHAMENTO MENSAL

### 7.1. Conceito

Uma competência mensal só é considerada **FECHADA** quando todos os departamentos validaram.

### 7.2. Processo de Fechamento

**Fluxo:**

1. **Abertura da Competência**
   - Sistema abre competência do mês
   - Período definido (ex: Janeiro/2026)

2. **Validação Sequencial dos Gates**
   - Gate 2: Custos validam
   - Gate 3: Produção valida
   - Gate 4: Comercial valida
   - Gate 5: Qualidade aprova (ou bloqueia)
   - Gate 6: SSMA aprova (ou bloqueia)
   - Gate 7: Financeiro valida
   - Gate 8: Gerencial aprova
   - Gate 9: Competência concluída (só se 5 e 6 OK)

3. **Bloqueios**
   - Se Qualidade não aprovar → Gate 9 bloqueado
   - Se SSMA não aprovar → Gate 9 bloqueado
   - Competência fica em "Aguardando Aprovação"

4. **Fechamento**
   - Quando Gate 9 aprovado
   - Competência marcada como "Fechada"
   - Dados congelados (não podem ser alterados)
   - Relatórios gerados

### 7.3. Validações Obrigatórias

Uma competência mensal só fecha quando:

- ✅ **Produção validada** (Gate 3)
  - Todos os apontamentos realizados
  - Avanços consolidados

- ✅ **Custos apropriados** (Gate 2)
  - Todas as apropriações realizadas
  - Rateios aplicados

- ✅ **Receita validada** (Gate 4)
  - MP e MC lançadas
  - Faturamento gerado

- ✅ **Qualidade aprovada** (Gate 5)
  - Inspeções realizadas
  - NCs tratadas
  - **OBRIGATÓRIO para fechamento**

- ✅ **SSMA aprovado** (Gate 6)
  - Inspeções realizadas
  - Incidentes tratados
  - **OBRIGATÓRIO para fechamento**

- ✅ **Financeiro conciliado** (Gate 7)
  - Fluxo de caixa atualizado
  - Conciliação realizada

- ✅ **Gerencial aprovado** (Gate 8)
  - Análise realizada
  - Decisões tomadas

- ✅ **Competência concluída** (Gate 9)
  - Todos os gates anteriores OK
  - Especialmente Gate 5 e Gate 6

### 7.4. Interface de Fechamento

**Funcionalidades:**
- Dashboard de fechamento mensal
- Status de cada gate
- Indicadores visuais (verde/amarelo/vermelho)
- Alertas de bloqueios
- Histórico de fechamentos
- Relatórios consolidados

### 7.5. Regras de Fechamento

**Regras:**
- Competência não pode ser fechada sem todos os gates
- Especialmente: Gate 5 e Gate 6 são obrigatórios
- Após fechamento, dados não podem ser alterados
- Reabertura requer aprovação especial
- Histórico completo mantido

---

## 8. INTERFACE E EXPERIÊNCIA DO USUÁRIO

### 8.1. Princípios Obrigatórios

Conforme Memorial Descritivo Oficial:

- **Sidebar lateral fixa** (departamentos)
- **Topbar com ações globais**
- **Páginas operacionais = tabelas** (alta densidade)
- **Páginas gerenciais = resumos + gráficos**
- **Nada de excesso de cards**
- **Alta densidade de informação**
- **Cada assunto na sua "caixinha"**

### 8.2. Layout Principal

**Estrutura:**
```
┌─────────────────────────────────────────┐
│ Topbar (ações globais, notificações)    │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Área de Conteúdo            │
│ (fixa)   │  (páginas)                    │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### 8.3. Sidebar

**Conteúdo:**
- Logo e informações do projeto
- Menu de navegação por departamentos
- Badges de notificação
- Submenus expansíveis
- Botão de logout

**Departamentos no Menu:**
- Intranet (Dashboard)
- Obras
- Comercial (com submenu)
- Engenharia
- Produção
- Suprimentos
- Custos
- Qualidade
- SSMA
- Meio Ambiente
- Financeiro
- Gerencial

### 8.4. Páginas Operacionais

**Características:**
- Tabelas de alta densidade
- Edição inline
- Filtros e busca
- Paginação
- Exportação de dados
- Tema escuro (para EAP)

**Exemplos:**
- Estruturação de EAP
- Lista de medições
- Apontamentos de produção
- Requisições de compra

### 8.5. Páginas Gerenciais

**Características:**
- Dashboards com gráficos
- Cards de resumo (KPIs)
- Tabelas consolidadas
- Filtros de período
- Exportação de relatórios

**Exemplos:**
- Dashboard Intranet
- Painel Gerencial
- Análise de Resultado
- Indicadores

### 8.6. Design System

**Cores:**
- Primária: Azul (#3B82F6)
- Sucesso: Verde (#10B981)
- Alerta: Amarelo (#F59E0B)
- Erro: Vermelho (#EF4444)
- Neutro: Cinza (#6B7280)

**Tipografia:**
- Títulos: Bold, grande
- Texto: Regular, médio
- Labels: Semibold, pequeno
- Códigos: Monospace

**Componentes:**
- Botões (primário, secundário, perigo)
- Inputs (texto, número, data, select)
- Tabelas (estilo planilha)
- Modais
- Drawers
- Cards
- Gráficos (Recharts)

---

## 9. TECNOLOGIAS E ARQUITETURA TÉCNICA

### 9.1. Frontend

**Framework:**
- **Next.js 14** (App Router)
- **React 18** com TypeScript
- **Tailwind CSS** para estilização

**Bibliotecas:**
- **Lucide React** para ícones
- **Recharts** para gráficos
- **Axios** para requisições HTTP
- **React Hook Form** para formulários (futuro)

**Estrutura:**
```
app/
├── login/
├── obras/
│   ├── page.tsx (lista)
│   └── [id]/
│       └── page.tsx (detalhes)
└── layout.tsx

src/
├── app/
│   ├── page.tsx (Intranet)
│   ├── suprimentos/
│   └── api/ (Next.js API Routes)
├── components/
├── services/
├── types/
└── utils/
```

### 9.2. Backend

**Framework:**
- **Express.js** (API REST)
- **TypeScript**

**ORM:**
- **Prisma ORM**

**Banco de Dados:**
- **PostgreSQL**

**Autenticação:**
- **JWT** (JSON Web Tokens)
- **Bcrypt** para hash de senhas

**Estrutura:**
```
src/api/
├── routes/
│   ├── auth.routes.ts
│   ├── obras.routes.ts
│   ├── eap.routes.ts
│   ├── medicoes.routes.ts
│   ├── gates.routes.ts
│   └── dashboard.routes.ts
├── middleware/
│   ├── authMiddleware.ts
│   ├── errorHandler.ts
│   └── validateObra.ts
├── app.ts
└── server.ts
```

### 9.3. Banco de Dados

**SGBD:**
- PostgreSQL

**ORM:**
- Prisma

**Modelos Principais:**
- Usuario
- Obra
- Cliente (a implementar)
- Contrato (a implementar)
- CentroCusto (a implementar)
- PlanilhaAnalitica (a implementar)
- BaselineComercial
- Eap
- EapFatorConversao
- Gate
- Medicao (MP e MC - a separar)
- Insumo
- UsuarioObra
- CompetenciaMensal (a implementar)

---

## 10. ESTADO ATUAL DE IMPLEMENTAÇÃO

### 10.1. Implementado (100%)

✅ **Autenticação e Segurança**
- Login com JWT
- Refresh tokens
- Middleware de autenticação
- Proteção de rotas

✅ **Gestão de Obras**
- CRUD completo
- Listagem com filtros
- Detalhes da obra
- Multi-obra

✅ **EAP Dual**
- EAP Comercial e Operacional
- Fatores de conversão
- Interface de alta densidade
- Cálculos automáticos

✅ **Medições Básicas**
- Lançamento de medições
- Histórico
- Status (rascunho, enviada, aprovada)
- Cálculo automático

✅ **Gates (Estrutura Base)**
- Modelo de dados
- Listagem de gates
- Status básico

✅ **Dashboards**
- Gráficos (linha e pizza)
- KPIs
- Filtros de período

✅ **Suprimentos (Básico)**
- Cadastro de insumos
- Listagem
- Integração com banco

✅ **Interface**
- Sidebar
- Layout responsivo
- Intranet/Dashboard

### 10.2. Parcialmente Implementado

⚠️ **Baseline Comercial**
- Versionamento OK
- Falta origem corporativa clara
- Falta upload de planilha no Corporativo

⚠️ **Medições**
- Básicas OK
- Falta separação MP/MC
- Falta comparativo MP x MC

⚠️ **Gates**
- Estrutura base OK
- Faltam os 9 gates oficiais completos
- Falta lógica de sequência e bloqueios

### 10.3. Não Implementado

❌ **MÓDULO CORPORATIVO**
- Cadastro de Clientes
- Cadastro de Contratos
- Abertura de Centro de Custo
- Upload de Planilha Analítica
- Liberação de Obras (Gate 1)

❌ **COMERCIAL DA OBRA (Completo)**
- Estruturação (parcial - EAP existe mas precisa revisão)
- MP separada
- MC separada
- Comparativo MP x MC
- Aditivos
- Glosas
- Faturamento

❌ **PRODUÇÃO**
- Execução física
- Avanços diários
- PBS
- Apontamentos
- Produtividade

❌ **CUSTOS**
- Apropriações
- Rateios
- CR/CO
- F/CD
- Fechamento mensal

❌ **QUALIDADE**
- Inspeções
- NCs
- Ensaios
- Liberação de serviços
- Poder de trava

❌ **SSMA**
- Segurança do trabalho
- Incidentes
- Treinamentos
- Inspeções
- Poder de trava

❌ **ENGENHARIA**
- Projetos
- Documentação
- Liberação de frentes

❌ **FINANCEIRO DA OBRA**
- Fluxo de caixa
- Contas a pagar/receber

❌ **GERENCIAL**
- Análise de resultado
- Tendências
- Cenários

❌ **MEIO AMBIENTE**
- Licenças
- Condicionantes
- Monitoramentos

❌ **FECHAMENTO MENSAL**
- Modelo de competência
- Fluxo completo
- Validações
- Dashboard

---

## 11. FLUXOS DE TRABALHO DETALHADOS

### 11.1. Fluxo: Criação de Obra até Estruturação

```
1. CORPORATIVO
   ├── Cadastra Cliente
   ├── Cadastra Contrato
   ├── Cria Obra
   ├── Abre Centro de Custo
   ├── Faz Upload de Planilha Analítica
   │   └── Dados: Proposta, Orçamento, Preços
   └── Libera Obra (Gate 1)
       │
       ▼
2. SISTEMA
   └── Preenche automaticamente Comercial
       │
       ▼
3. OBRA - COMERCIAL
   ├── Gerente Comercial recebe notificação
   ├── Acessa módulo Comercial
   ├── Visualiza dados referenciais
   ├── Cria EAP
   │   ├── Define hierarquia
   │   ├── Estrutura itens
   │   ├── Define quantidades
   │   └── Define valores
   ├── Faz Estruturação
   ├── Cria Baseline v1
   └── Libera para outros serviços
       │
       ▼
4. OUTROS DEPARTAMENTOS
   └── Podem começar a trabalhar
```

### 11.2. Fluxo: Fechamento Mensal

```
1. Sistema abre Competência do Mês
   │
   ▼
2. CUSTOS
   ├── Apropria custos
   ├── Aplica rateios
   └── Aprova Gate 2
   │
   ▼
3. PRODUÇÃO
   ├── Consolida apontamentos
   ├── Valida avanços
   └── Aprova Gate 3
   │
   ▼
4. COMERCIAL
   ├── Lança MP e MC
   ├── Gera faturamento
   └── Aprova Gate 4
   │
   ▼
5. QUALIDADE
   ├── Realiza inspeções
   ├── Trata NCs
   └── Aprova Gate 5 (ou bloqueia)
   │
   ▼
6. SSMA
   ├── Realiza inspeções
   ├── Trata incidentes
   └── Aprova Gate 6 (ou bloqueia)
   │
   ▼
7. FINANCEIRO
   ├── Atualiza fluxo de caixa
   ├── Concilia contas
   └── Aprova Gate 7
   │
   ▼
8. GERENCIAL
   ├── Analisa resultado
   ├── Toma decisões
   └── Aprova Gate 8
   │
   ▼
9. COMPETÊNCIA
   └── Gate 9 (só libera se Gate 5 e Gate 6 OK)
       │
       ▼
   Competência FECHADA
```

### 11.3. Fluxo: Medição de Produção vs. Medição do Cliente

```
1. PRODUÇÃO
   └── Executa serviço
       │
       ▼
2. COMERCIAL - MP
   ├── Lança Medição de Produção
   ├── Quantidade realmente executada
   └── Valor calculado
       │
       ▼
3. COMERCIAL - MC
   ├── Lança Medição do Cliente
   ├── Quantidade a faturar
   └── Valor a faturar
       │
       ▼
4. COMPARATIVO
   ├── Sistema compara MP x MC
   ├── Identifica divergências
   └── Requer justificativa se divergir
       │
       ▼
5. FATURAMENTO
   └── Baseado em MC aprovada
```

---

## 12. REGRAS DE NEGÓCIO

### 12.1. Regras Gerais

1. **Nada nasce na obra sem origem corporativa**
2. **Nada é validado no corporativo sem evidência da obra**
3. **Baseline é imutável após liberação** (apenas versionamento)
4. **EAP é criada no Comercial**, não no Corporativo
5. **Valores financeiros devem ser idênticos** entre visões comercial/operacional

### 12.2. Regras de Gates

1. **Gate 5 (Qualidade) e Gate 6 (SSMA) bloqueiam Gate 9**
2. **Gates devem ser aprovados em sequência**
3. **Histórico completo de aprovações mantido**
4. **Rastreabilidade obrigatória** (quem, quando, por quê)

### 12.3. Regras de Fechamento

1. **Todos os gates devem estar aprovados**
2. **Especialmente Gate 5 e Gate 6 são obrigatórios**
3. **Após fechamento, dados não podem ser alterados**
4. **Reabertura requer aprovação especial**

### 12.4. Regras de Medições

1. **MP e MC podem divergir** (requer justificativa)
2. **MC é base para faturamento**
3. **MP é base para apropriação de custos**
4. **Comparativo MP x MC é sigiloso** (acesso restrito)

### 12.5. Regras de Produção

1. **Produção NÃO trabalha com valores financeiros**
2. **Apenas quantidades físicas**
3. **Integração com Custos para apropriação**

### 12.6. Regras de EAP

1. **EAP é criada no Comercial**
2. **Usa dados referenciais do Corporativo**
3. **Após estruturação e liberação, não pode ser alterada**
4. **Versionamento cria nova baseline**

---

## 13. MODELOS DE DADOS

### 13.1. Modelos Existentes

**Usuario**
- id, email, nome, senha_hash, perfil, is_ativo

**Obra**
- id, codigo, nome, cliente_id, contrato_id, centro_custo_id, status, etc.

**BaselineComercial**
- id, obra_id, versao, valor_total, is_ativo, etc.

**Eap**
- id, baseline_comercial_id, codigo, descricao, tipo (comercial/operacional), etc.

**EapFatorConversao**
- id, eap_comercial_id, eap_operacional_id, fator_quantidade, fator_valor

**Gate**
- id, obra_id, tipo, status, aprovado_por, data_aprovacao

**Medicao**
- id, obra_id, eap_id, periodo_referencia, quantidade_medida, valor_medido, tipo (MP/MC - a separar)

**Insumo**
- id, codigo, nome, unidade, categoria, preco_estimado, estoque

**UsuarioObra**
- id, usuario_id, obra_id, permissao, is_ativo

### 13.2. Modelos a Implementar

**Cliente**
- id, razao_social, cnpj, endereco, contatos, tipo

**Contrato**
- id, cliente_id, numero, valor_total, data_assinatura, prazo, tipo

**CentroCusto**
- id, obra_id, codigo, moeda, periodo_fiscal

**PlanilhaAnalitica**
- id, obra_id, versao, arquivo, dados_referenciais (JSON), data_upload

**CompetenciaMensal**
- id, obra_id, periodo (YYYY-MM), status, data_abertura, data_fechamento

**MedicaoProducao (MP)**
- Separar de Medicao atual
- id, obra_id, eap_id, periodo, quantidade, valor

**MedicaoCliente (MC)**
- Separar de Medicao atual
- id, obra_id, eap_id, periodo, quantidade, valor

**Aditivo**
- id, obra_id, contrato_id, valor, descricao, aprovado

**Glosa**
- id, obra_id, medicao_id, valor, descricao, status

---

## 14. PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

### 14.1. Fase 1: Crítica (2-4 semanas)

#### 1.1. Módulo Corporativo (Base)
- [ ] Cadastro de Clientes
- [ ] Cadastro de Contratos
- [ ] Abertura de Centro de Custo
- [ ] Upload de Planilha Analítica
- [ ] Envio automático para Comercial

#### 1.2. Revisar EAP
- [ ] Garantir que EAP é criada no Comercial
- [ ] Interface de Estruturação no Comercial
- [ ] Recebimento de dados referenciais
- [ ] Liberação para outros serviços

#### 1.3. Completar 9 Gates
- [ ] Implementar todos os 9 gates
- [ ] Lógica de sequência
- [ ] Regras de bloqueio (Gate 5 e 6)
- [ ] Interface de aprovação

#### 1.4. Fechamento Mensal
- [ ] Modelo CompetenciaMensal
- [ ] Fluxo de fechamento
- [ ] Dashboard de status
- [ ] Validações

### 14.2. Fase 2: Alta (4-6 semanas)

#### 2.1. Comercial Completo
- [ ] Separar MP e MC
- [ ] Comparativo MP x MC
- [ ] Aditivos
- [ ] Glosas
- [ ] Faturamento

#### 2.2. Produção
- [ ] Execução física
- [ ] Avanços diários
- [ ] PBS
- [ ] Apontamentos

#### 2.3. Custos
- [ ] Apropriações
- [ ] Rateios
- [ ] CR/CO
- [ ] F/CD

### 14.3. Fase 3: Média (6-8 semanas)

#### 3.1. Qualidade
- [ ] Inspeções
- [ ] NCs
- [ ] Ensaios
- [ ] Poder de trava

#### 3.2. SSMA
- [ ] Segurança
- [ ] Incidentes
- [ ] Treinamentos
- [ ] Poder de trava

#### 3.3. Engenharia
- [ ] Projetos
- [ ] Documentação
- [ ] Liberação de frentes

### 14.4. Fase 4: Baixa (8+ semanas)

#### 4.1. Financeiro da Obra
#### 4.2. Gerencial
#### 4.3. Meio Ambiente
#### 4.4. Melhorias e Otimizações

---

## 15. VALIDAÇÃO E APROVAÇÃO

### 15.1. Checklist de Validação

**Conceitos:**
- [x] Princípio fundamental documentado
- [x] Arquitetura dos dois módulos
- [x] Fluxo Corporativo → Obra
- [x] EAP criada no Comercial (corrigido)
- [x] 9 Gates oficiais documentados
- [x] Fechamento mensal detalhado
- [x] Todos os departamentos descritos
- [x] Regras de negócio definidas

**Tecnologias:**
- [x] Stack tecnológico definido
- [x] Arquitetura técnica documentada
- [x] Modelos de dados listados

**Estado Atual:**
- [x] O que está implementado
- [x] O que está parcial
- [x] O que está faltando

**Próximos Passos:**
- [x] Fases definidas
- [x] Prioridades estabelecidas
- [x] Cronograma sugerido

---

## 16. CONCLUSÃO

Este documento apresenta o **conceito completo e detalhado** do ERP GENESIS, incluindo:

- ✅ Arquitetura conceitual completa
- ✅ Todos os módulos e departamentos
- ✅ Fluxos de trabalho detalhados
- ✅ Regras de negócio
- ✅ Estado atual de implementação
- ✅ Próximos passos

**Princípio Fundamental:** "O CORPORATIVO GOVERNA. A OBRA EXECUTA."

**Conceito Corrigido:** EAP é criada no Comercial da Obra, não no Corporativo.

**Este documento serve como referência única para desenvolvimento e validação em ChatGPT.**

---

**Documento criado em:** Janeiro 2026  
**Versão:** 2.0 (Conceito Corrigido)  
**Status:** 🟢 Aprovado para Desenvolvimento

---

*Este documento foi criado para validação em ChatGPT e serve como referência completa para continuidade do desenvolvimento do ERP GENESIS.*






