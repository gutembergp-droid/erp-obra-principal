# 🗺️ Roadmap de Desenvolvimento
## ERP G-NESIS - Plano de Implementação de Telas

**Última Atualização:** Janeiro 2026  
**Status Geral:** ✅ Backend Funcionando | ⏳ Frontend em Desenvolvimento

---

## 📊 Status Atual

### ✅ Implementado
- ✅ **Backend Completo** - API REST funcionando
- ✅ **Autenticação** - Login/Logout
- ✅ **Dashboard/Intranet** - Tela inicial
- ✅ **Gestão de Obras** - Lista e detalhes
- ✅ **EAP** - Estruturação básica
- ✅ **Medições** - Parcial (precisa completar)

### ⏳ Em Desenvolvimento
- ⏳ Telas de CRUD básicas
- ⏳ Telas de processos
- ⏳ Relatórios e dashboards

---

## 🎯 Fase 1: Telas Básicas (CRUD)
**Prioridade:** ALTA | **Estimativa:** 2-3 semanas

### 1.1. Fornecedores ⏳
- [ ] Lista de fornecedores
- [ ] Criar fornecedor
- [ ] Editar fornecedor
- [ ] Deletar fornecedor
- [ ] Busca e filtros

**Arquivo:** `app/fornecedores/page.tsx`  
**API:** Criar `src/services/api/fornecedorApi.ts`  
**Prioridade:** 🔴 Alta

---

### 1.2. Insumos ⏳
- [ ] Lista de insumos (API já existe)
- [ ] Criar insumo
- [ ] Editar insumo
- [ ] Deletar insumo
- [ ] Busca e filtros

**Arquivo:** `app/insumos/page.tsx`  
**API:** `src/app/api/insumos/route.ts` (já existe)  
**Prioridade:** 🔴 Alta

---

### 1.3. Usuários ⏳
- [ ] Lista de usuários
- [ ] Criar usuário
- [ ] Editar usuário
- [ ] Deletar usuário (soft delete)
- [ ] Resetar senha
- [ ] Ativar/Desativar usuário

**Arquivo:** `app/usuarios/page.tsx`  
**API:** Criar `src/services/api/usuarioApi.ts`  
**Prioridade:** 🟡 Média

---

### 1.4. Clientes ⏳
- [ ] Lista de clientes
- [ ] Criar cliente
- [ ] Editar cliente
- [ ] Deletar cliente
- [ ] Histórico de obras por cliente

**Arquivo:** `app/clientes/page.tsx`  
**API:** Criar `src/services/api/clienteApi.ts`  
**Prioridade:** 🟡 Média

---

## 🎯 Fase 2: Telas de Processo
**Prioridade:** ALTA | **Estimativa:** 3-4 semanas

### 2.1. Compras/Requisições ⏳
- [ ] Lista de requisições
- [ ] Criar requisição
- [ ] Aprovar/Rejeitar requisição
- [ ] Fluxo de aprovação
- [ ] Histórico de compras

**Arquivo:** `app/compras/page.tsx`  
**API:** Criar `src/services/api/compraApi.ts`  
**Prioridade:** 🔴 Alta

---

### 2.2. Medições (Completar) ⏳
- [x] Lista de medições (parcial)
- [ ] Criar medição MP (Medição de Produção)
- [ ] Criar medição MC (Medição do Cliente)
- [ ] Aprovar/Rejeitar medição
- [ ] Comparativo MP vs MC
- [ ] Histórico por período

**Arquivo:** `app/obras/[id]/page.tsx` (já existe, completar)  
**API:** `src/services/api/medicaoApi.ts` (já existe)  
**Prioridade:** 🔴 Alta

---

### 2.3. Gates (9 Gates) ⏳
- [ ] Visualizar status dos 9 gates
- [ ] Aprovar gate
- [ ] Rejeitar gate
- [ ] Ver dependências entre gates
- [ ] Histórico de aprovações

**Arquivo:** `app/obras/[id]/gates/page.tsx`  
**API:** `src/services/api/gateApi.ts` (já existe)  
**Prioridade:** 🔴 Alta

---

### 2.4. Competências Mensais ⏳
- [ ] Lista de competências
- [ ] Abrir nova competência
- [ ] Visualizar gates da competência
- [ ] Aprovar/Rejeitar gates
- [ ] Fechar competência
- [ ] Histórico de fechamentos

**Arquivo:** `app/obras/[id]/competencias/page.tsx`  
**API:** `src/api/routes/competencias.routes.ts` (já existe)  
**Prioridade:** 🔴 Alta

---

## 🎯 Fase 3: Relatórios e Dashboards
**Prioridade:** MÉDIA | **Estimativa:** 2-3 semanas

### 3.1. Dashboard Avançado ⏳
- [ ] Gráficos de evolução
- [ ] Indicadores financeiros
- [ ] Indicadores de produção
- [ ] Comparativos entre obras
- [ ] Filtros por período

**Arquivo:** `app/dashboard/page.tsx`  
**API:** `src/services/api/dashboardApi.ts` (já existe)  
**Prioridade:** 🟡 Média

---

### 3.2. Relatórios Financeiros ⏳
- [ ] Receitas vs Despesas
- [ ] Fluxo de caixa
- [ ] Análise de custos
- [ ] Projeções
- [ ] Exportar PDF/Excel

**Arquivo:** `app/relatorios/financeiro/page.tsx`  
**API:** Criar `src/services/api/relatorioApi.ts`  
**Prioridade:** 🟡 Média

---

### 3.3. Relatórios de Produção ⏳
- [ ] Evolução de medições
- [ ] Comparativo MP vs MC
- [ ] Análise de produtividade
- [ ] Gráficos e tabelas
- [ ] Exportar PDF/Excel

**Arquivo:** `app/relatorios/producao/page.tsx`  
**API:** Criar `src/services/api/relatorioApi.ts`  
**Prioridade:** 🟡 Média

---

## 🎯 Fase 4: Administração
**Prioridade:** BAIXA | **Estimativa:** 1-2 semanas

### 4.1. Configurações ⏳
- [ ] Parâmetros do sistema
- [ ] Configurações de email
- [ ] Configurações de backup
- [ ] Logs do sistema

**Arquivo:** `app/configuracoes/page.tsx`  
**Prioridade:** 🟢 Baixa

---

### 4.2. Auditoria ⏳
- [ ] Logs de ações
- [ ] Histórico de alterações
- [ ] Rastreamento de usuários
- [ ] Exportar logs

**Arquivo:** `app/auditoria/page.tsx`  
**Prioridade:** 🟢 Baixa

---

## 📝 Ordem Recomendada de Desenvolvimento

### Semana 1-2: Fundação
1. **Fornecedores** (CRUD completo)
2. **Insumos** (completar tela, API já existe)

### Semana 3-4: Processos Críticos
3. **Compras/Requisições** (fluxo completo)
4. **Medições** (completar funcionalidades)

### Semana 5-6: Gates e Competências
5. **Gates** (9 gates, aprovações)
6. **Competências Mensais** (fechamento mensal)

### Semana 7-8: Relatórios
7. **Dashboard Avançado**
8. **Relatórios Financeiros e Produção**

### Semana 9+: Administração
9. **Usuários** (gestão completa)
10. **Configurações e Auditoria**

---

## 🛠️ Ferramentas e Recursos

### Templates Disponíveis
- ✅ `TEMPLATE_TELA_BASICA.tsx` - Template completo de CRUD
- ✅ `app/obras/page.tsx` - Exemplo real de lista
- ✅ `app/obras/[id]/page.tsx` - Exemplo real de detalhes

### Documentação
- ✅ `GUIA_DESENVOLVIMENTO_TELAS.md` - Guia completo
- ✅ `RELATORIO_AS_BUILT_ERP_GENESIS.md` - Documentação técnica
- ✅ `src/services/api/` - Exemplos de chamadas à API

### Ícones e Componentes
- ✅ Lucide React - Biblioteca de ícones
- ✅ Tailwind CSS - Estilização
- ✅ Next.js 14 - Framework

---

## ✅ Checklist para Cada Tela

Antes de considerar uma tela "pronta", verifique:

- [ ] Tela criada e funcionando
- [ ] Conectada com a API
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Validação de formulários
- [ ] Mensagens de sucesso/erro
- [ ] Responsivo (mobile)
- [ ] Adicionada ao menu
- [ ] Testada localmente
- [ ] Commit e push feito

---

## 🎯 Próximos Passos Imediatos

1. **Escolha uma tela da Fase 1** (recomendo Fornecedores ou Insumos)
2. **Use o template** `TEMPLATE_TELA_BASICA.tsx`
3. **Copie estrutura** de `app/obras/page.tsx`
4. **Desenvolva e teste** localmente
5. **Faça commit** quando funcionar

**Boa sorte! 🚀**




