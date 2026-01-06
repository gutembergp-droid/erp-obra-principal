# GNESIS — Documento de Diretriz para o Cursor (UI Conceitual + Regras de Navegação)

**Versão:** 1.0  
**Data:** Janeiro / 2026  
**Objetivo:** Garantir alinhamento do desenvolvimento (Cursor) com o protótipo V0 e com o conceito travado do GENESIS, evitando implementação divergente.

---

## 0) PREMISSAS (NÃO NEGOCIÁVEIS)

1. **V0 é PROTÓTIPO** (referência visual/UX). O produto real é o repositório no GitHub + deploy na Vercel.
2. **O Cursor implementa** o que torna o protótipo FUNCIONAL: integração de dados, contratos, backend e persistência.
3. **UI/UX:** padrão de telas e sidebar/topbar seguem o "UX CONGELADO" já adotado.
4. **Conceito do sistema:** "O Corporativo governa. A Obra executa."

---

## 1) PERGUNTAS DO CONCEITUAL (RESPOSTAS OFICIAIS)

### 1.1 Redirecionamento pós-login (Intranet → Departamento)

**REGRA OFICIAL:** AUTOMÁTICO (não por escolha manual do usuário).

**Fluxo correto:**
```
Login → Intranet (sempre) → Redirecionamento automático para o departamento principal do usuário
```

**A Intranet funciona como:**
- ✅ **Hub inicial** (obrigatório)
- ✅ **Painel de avisos, indicadores rápidos e contexto**
- ✅ **Ponto de fallback** caso o usuário tenha múltiplas obras ou múltiplos departamentos

**O sistema decide automaticamente com base em:**
- Perfil do usuário
- Departamento principal
- Última obra ativa (persistida)

**O usuário NÃO escolhe sempre** - o sistema decide automaticamente.

**Implementação:** regra única em um middleware/guard (sem duplicar em cada página).

---

### 1.2 Níveis (Operacional / Tático / Estratégico)

**REGRA OFICIAL:** Os níveis **NÃO aparecem explicitamente** como menus ou abas.

**Eles são uma organização conceitual e de permissão, não visual.**

**Na prática:**
- A mesma tela pode ter **visões diferentes** conforme o perfil
- O nível é determinado por:
  - Tipo de ação permitida
  - Campos visíveis
  - Possibilidade de aprovação/trava

**Exemplos:**
- **Produção (operacional):** lança apontamento
- **Planejamento (tático):** valida avanço
- **Gerencial (estratégico):** aprova competência

**O usuário não "entra no nível"** - o nível emerge da função dele.

**ABAS somente quando fizer sentido dentro da mesma entidade** (ex.: Tabela | Gráficos; Visão Geral | Histórico).

---

### 1.3 Toggle Tabela / Gráficos

**REGRA OFICIAL:** Nem todos os dados possuem visualização em gráfico.

**Regra:**
- **Tabela é sempre a visualização padrão**
- **Gráficos existem apenas quando agregam decisão**

**Exemplos COM gráfico:**
- Indicadores
- Analytics
- Cockpit gerencial
- Curvas, tendências, projeções

**Exemplos SEM gráfico:**
- Cadastro
- Lançamentos
- Apontamentos
- Requisições

**Onde existir gráfico, o toggle Tabela ↔ Gráfico é permitido.**

**Transacionais (CRUD/fluxo):** foco em tabela + filtros + ações, sem "cardização" excessiva.

---

### 1.4 Workflows (exemplos práticos prioritários)

**REGRA OFICIAL:** Todo workflow no GENESIS segue obrigatoriamente:

```
INÍCIO → PROCESSO → FIM (com gate ou registro)
```

**Exemplos reais:**

**a) Medição de Produção:**
- **Início:** Produção lança avanço
- **Processo:** Planejamento valida
- **Fim:** Avanço consolida base física (sem financeiro)

**b) Fechamento Mensal:**
- **Início:** Abertura da competência
- **Processo:** Gates 1 a 8
- **Fim:** Gate 9 (Competência Concluída)
- **Bloqueios obrigatórios:** Qualidade e SSMA

**c) Demissão de Colaborador:**
- **Início:** Solicitação administrativa
- **Processo:** RH + QSMS + Jurídico
- **Fim:** Dossiê de demissão fechado (DOCIE)

**Nenhum processo "termina" sem um estado final claro.**

---

## 2) REGRAS DE UI/UX (PARA MANTER IDÊNTICO AO V0)

### 2.1 Padrão de tela (layout)

- **Header:** Título + descrição curta
- **Área de ações:** 1–4 ações principais
- **Filtros e busca:** simples, claros, com estado persistente quando fizer sentido
- **Conteúdo:** Tabela como padrão
- **Opcional:** Toggle Tabela | Gráficos quando aplicável (analytics)

### 2.2 "Alta produtividade"

- Preferência por **tabelas densas e legíveis**
- Evitar páginas baseadas em **cards decorativos**
- Sem "desperdício de espaço"

### 2.3 Sidebar/Topbar

- Sidebar e Topbar são a **moldura fixa** do sistema.
- O que muda é o **"miolo"** de cada rota.
- A navegação deve refletir: **Corporativo (governa) / Obra (executa)**.

---

## 3) ALINHAMENTO CONCEITUAL (PARA NÃO CONFLITAR COM O TRAVADO)

### 3.1 Termos do Memorial (mapeamento)

- **"Micro-Contratos"** = Itens da EAP/WBS + baseline + composição (CPU) + metas/valores
- **"PBS"** = ordem/serviço produtivo OBRIGATORIAMENTE vinculado a item EAP
- **"DNA do Recurso"** = composição/custos/insumos/estruturas associadas ao item EAP (modelagem evolutiva)

### 3.2 O que NÃO entra agora (evitar travar MVP)

- Offline-first e sincronização avançada (fase posterior)
- WebRTC/chat realtime (fase posterior)
- IA jurídica/agentes como automação completa (fase posterior)

**Obs:** pode manter placeholders na UI, mas sem bloquear o core.

---

## 4) DIRETRIZ DE IMPLEMENTAÇÃO (CURSOR x V0)

1. **V0 define** UI e hierarquia de telas.
2. **Cursor implementa:**
   - Contratos de API mínimos
   - Persistência (DB)
   - Autenticação e RBAC
   - Estados reais (loading/error/empty)
3. **Interface final no Vercel** deve ficar visualmente igual ao V0, mas funcional.

---

## 5) ITENS MÍNIMOS PARA "VIRAR FUNCIONAL" (ORDEM SUGERIDA)

### MVP (essencial):

**A) Auth real + RBAC + redirect Intranet → Departamento**  
**B) Contexto global de Obra** (seleção + persistência)  
**C) Competência Mensal + Gates** (status, travas e conclusão)  
**D) CRUD de Obras** (list/detail/create/update)

### Em seguida:

**E) Suprimentos workflow A** (requisição→compra→recebimento)  
**F) Medições MP/MC** (separação e comparativo) conforme roadmap

---

## 6) CRITÉRIOS DE ACEITE (VALIDAÇÃO VISUAL E FUNCIONAL)

- ✅ A UI do deploy (Vercel) corresponde ao protótipo (V0) em navegação, sidebar/topbar e padrões de tela.
- ✅ Login redireciona: Login → Intranet → Departamento (auto; exceção: selector se multi-role/multi-obra).
- ✅ RBAC controla menus e rotas.
- ✅ Competência: gates 1..9 com travas (5 e 6) impedindo conclusão.
- ✅ Sem duplicação de regras em múltiplas páginas (centralizar em middleware/guards/services).

---

## 7) OBSERVAÇÕES FINAIS

- **Não alterar** o conceito travado sem ordem explícita do responsável (Gutemberg).
- Este documento é a **"fonte de verdade"** para as decisões de UI/fluxo no Cursor.

---

**Documento validado por:** Gutemberg  
**Data de validação:** Janeiro 2026  
**Versão:** 1.0  
**Status:** 🟢 DOCUMENTO OFICIAL DE REFERÊNCIA PARA UI/UX

---

## 📋 REFERÊNCIAS CROSS-REFERENCE

Este documento **complementa** (e não substitui) o documento conceitual oficial:
- **`MEMORIAL_DESCRITIVO_OFICIAL_VALIDADO.md`** - Conceito fundamental travado
- **`DIRETRIZES_UI_UX_NAVEGACAO.md`** - Este documento (regras de UI/UX e navegação)

**Uso:**
- Para questões **conceituais** e de **estrutura do sistema**: consultar `MEMORIAL_DESCRITIVO_OFICIAL_VALIDADO.md`
- Para questões de **UI/UX** e **navegação**: consultar este documento
- Em caso de conflito: o conceito oficial prevalece

---

**FIM DO DOCUMENTO DE DIRETRIZES UI/UX E NAVEGAÇÃO**

