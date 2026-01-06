# 🎨 Guia de Desenvolvimento de Telas
## Para Gestores de Projetos (Sem Experiência em Programação)

**Objetivo:** Este guia explica como criar e modificar telas no ERP G-NESIS de forma simples e prática.

---

## 📚 Índice

1. [Entendendo a Estrutura do Projeto](#1-entendendo-a-estrutura-do-projeto)
2. [Como Criar uma Nova Tela](#2-como-criar-uma-nova-tela)
3. [Exemplo Prático: Criando uma Tela Passo a Passo](#3-exemplo-prático-criando-uma-tela-passo-a-passo)
4. [Ordem Recomendada de Desenvolvimento](#4-ordem-recomendada-de-desenvolvimento)
5. [Referência Rápida](#5-referência-rápida)

---

## 1. Entendendo a Estrutura do Projeto

### 1.1. Onde Ficam as Telas?

```
app/
├── page.tsx              ← Tela inicial (Dashboard/Intranet)
├── login/
│   └── page.tsx          ← Tela de login
└── obras/
    ├── page.tsx          ← Lista de obras
    └── [id]/
        └── page.tsx      ← Detalhes de uma obra
```

**Regra Simples:**
- Cada pasta dentro de `app/` vira uma URL
- `app/obras/page.tsx` → URL: `/obras`
- `app/obras/[id]/page.tsx` → URL: `/obras/123` (onde 123 é o ID)

### 1.2. Onde Ficam os Componentes Reutilizáveis?

```
src/components/
├── MainLayout.tsx        ← Layout principal (sidebar, menu)
├── ProtectedRoute.tsx    ← Proteção de rotas (exige login)
└── EapEstruturacao/      ← Componentes de EAP
```

### 1.3. Onde Ficam as Chamadas à API?

```
src/services/api/
├── obraApi.ts           ← Funções para trabalhar com obras
├── medicaoApi.ts        ← Funções para trabalhar com medições
├── eapApi.ts           ← Funções para trabalhar com EAP
└── authApi.ts          ← Funções de login/logout
```

**Exemplo de uso:**
```typescript
import { listObras } from '@/services/api/obraApi';

// Dentro da sua tela:
const obras = await listObras();
```

---

## 2. Como Criar uma Nova Tela

### Passo 1: Criar a Pasta e Arquivo

**Exemplo:** Criar tela de "Fornecedores"

1. Crie a pasta: `app/fornecedores/`
2. Crie o arquivo: `app/fornecedores/page.tsx`

### Passo 2: Estrutura Básica de uma Tela

```typescript
'use client';  // Sempre coloque isso no início

import React, { useState, useEffect } from 'react';

export default function FornecedoresPage() {
  // 1. Estados (dados que mudam)
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Carregar dados quando a tela abrir
  useEffect(() => {
    loadFornecedores();
  }, []);

  // 3. Função para carregar dados
  const loadFornecedores = async () => {
    try {
      setLoading(true);
      // Aqui você chama a API
      // const data = await listFornecedores();
      // setFornecedores(data);
    } catch (err) {
      setError('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  // 4. Renderizar a tela
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fornecedores</h1>
      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

### Passo 3: Adicionar ao Menu (Sidebar)

Edite: `src/components/MainLayout.tsx`

Encontre a seção de menu e adicione:
```typescript
<Link href="/fornecedores">
  <Truck className="w-5 h-5" />
  <span>Fornecedores</span>
</Link>
```

---

## 3. Exemplo Prático: Criando uma Tela Passo a Passo

### Exemplo: Tela de "Compras"

#### Passo 1: Criar o arquivo

Crie: `app/compras/page.tsx`

#### Passo 2: Copiar estrutura básica

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search } from 'lucide-react';

export default function ComprasPage() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setCompras([
        { id: '1', descricao: 'Cimento', valor: 5000, status: 'pendente' },
        { id: '2', descricao: 'Aço', valor: 15000, status: 'aprovada' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Compras</h1>
          <p className="text-gray-600">Gestão de compras e requisições</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Nova Compra
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar compras..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Compras */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Descrição</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Valor</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {compras.map((compra) => (
              <tr key={compra.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-800">{compra.descricao}</td>
                <td className="p-4 text-sm text-gray-800">
                  R$ {compra.valor.toLocaleString('pt-BR')}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    compra.status === 'aprovada' ? 'bg-green-100 text-green-700' :
                    compra.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {compra.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

#### Passo 3: Adicionar ao menu

Edite `src/components/MainLayout.tsx` e adicione no menu:
```typescript
<Link href="/compras">
  <ShoppingCart className="w-5 h-5" />
  <span>Compras</span>
</Link>
```

#### Passo 4: Testar

1. Salve o arquivo
2. Acesse: `http://localhost:3000/compras`
3. Você verá a tela funcionando!

---

## 4. Ordem Recomendada de Desenvolvimento

### Fase 1: Telas Básicas (CRUD Simples)
1. ✅ **Obras** - Já implementado
2. ⏳ **Fornecedores** - Criar, listar, editar, deletar
3. ⏳ **Insumos** - Já tem API, falta tela
4. ⏳ **Usuários** - Gestão de usuários do sistema

### Fase 2: Telas de Processo
5. ⏳ **Compras/Requisições** - Fluxo de compras
6. ⏳ **Medições** - Já tem parcial, completar
7. ⏳ **Gates** - Gestão dos 9 gates
8. ⏳ **Competências Mensais** - Fechamento mensal

### Fase 3: Telas de Relatórios
9. ⏳ **Dashboard Avançado** - Gráficos e indicadores
10. ⏳ **Relatórios Financeiros** - Receitas, despesas
11. ⏳ **Relatórios de Produção** - Evolução, comparativos

### Fase 4: Telas Administrativas
12. ⏳ **Configurações** - Parâmetros do sistema
13. ⏳ **Auditoria** - Logs de ações
14. ⏳ **Backup/Restore** - Gestão de dados

---

## 5. Referência Rápida

### 5.1. Componentes Comuns (Tailwind CSS)

```typescript
// Botão
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
  Salvar
</button>

// Input
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  value={valor}
  onChange={(e) => setValor(e.target.value)}
/>

// Card
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
  {/* Conteúdo */}
</div>

// Tabela
<table className="w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="p-4 text-left">Coluna 1</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-gray-50">
      <td className="p-4">Dado 1</td>
    </tr>
  </tbody>
</table>
```

### 5.2. Ícones (Lucide React)

```typescript
import { Plus, Edit, Trash, Search, Eye } from 'lucide-react';

<Plus size={20} />      // Ícone de adicionar
<Edit size={20} />     // Ícone de editar
<Trash size={20} />    // Ícone de deletar
<Search size={20} />   // Ícone de buscar
<Eye size={20} />      // Ícone de visualizar
```

### 5.3. Chamadas à API

```typescript
// Listar
const items = await listItems();

// Buscar por ID
const item = await getItemById(id);

// Criar
const novoItem = await createItem(dados);

// Atualizar
const itemAtualizado = await updateItem(id, dados);

// Deletar
await deleteItem(id);
```

### 5.4. Estados e Loading

```typescript
// Estado de dados
const [items, setItems] = useState([]);

// Estado de loading
const [loading, setLoading] = useState(true);

// Estado de erro
const [error, setError] = useState(null);

// Carregar dados
useEffect(() => {
  loadItems();
}, []);

const loadItems = async () => {
  try {
    setLoading(true);
    const data = await listItems();
    setItems(data);
  } catch (err) {
    setError('Erro ao carregar');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Dicas Importantes

1. **Sempre use `'use client'`** no início dos arquivos de tela
2. **Teste localmente primeiro** antes de fazer commit
3. **Use os componentes existentes** como referência
4. **Mantenha o código simples** - não precisa ser perfeito na primeira vez
5. **Peça ajuda** quando tiver dúvidas - é melhor perguntar do que ficar travado

---

## 📞 Próximos Passos

1. Escolha uma tela da Fase 1 para começar
2. Copie a estrutura de `app/obras/page.tsx` como base
3. Adapte para sua necessidade
4. Teste e ajuste
5. Quando funcionar, faça commit e push

**Boa sorte! 🚀**




