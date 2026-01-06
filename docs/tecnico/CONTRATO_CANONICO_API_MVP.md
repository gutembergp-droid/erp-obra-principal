# CONTRATO CANÔNICO DE API (MVP) — GENESIS ERP

**Versão:** v1.0 (CONGELADO)  
**Data:** Janeiro/2026  
**Objetivo:** Definir contratos mínimos para backend no Cursor e consumo pelo frontend (Vercel). Evitar retrabalho e divergência.

---

## PRINCÍPIO CENTRAL

- **"O Corporativo Governa. A Obra Executa."**
- UI/UX pode mudar livremente.
- **API/Contrato só muda com ordem do Gutemberg.**

---

## BASE URL

- **Produção:** `https://<seu-dominio>/api`
- **Local:** `http://localhost:3001/api`

---

## FORMATO

- **JSON** em todas as rotas
- **Datas** em ISO 8601 (UTC), ex: `"2026-01-04T12:00:00.000Z"`
- **Decimal:** usar string (ex: `"12345.67"`) para evitar erro de ponto flutuante.

---

## AUTH

- **Header:** `Authorization: Bearer <access_token>`
- Se não autenticado: `401`
- Se sem permissão: `403`

---

## PADRÃO DE RESPOSTA

**Sucesso:**
```json
{
  "data": <objeto|array>,
  "meta": <opcional>
}
```

**Erro:**
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": <any>
  }
}
```

---

## CÓDIGOS DE ERRO PADRÃO (error.code)

- `AUTH_REQUIRED`
- `AUTH_INVALID`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `INTERNAL_ERROR`

---

## PAGINAÇÃO (quando aplicável)

- **Query:** `page` (default 1), `pageSize` (default 20)
- **meta:** `{ "page":1, "pageSize":20, "total":123 }`

---

## 1) MODELOS (SHAPES) — CANÔNICOS (FRONT E BACK DEVEM SEGUIR)

### 1.1 Usuario

```typescript
{
  "id": "uuid",
  "email": "string",
  "nome": "string",
  "perfil": "admin|gestor|engenheiro|usuario",
  "isAtivo": true,
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

### 1.2 Contexto do Usuário (Sessão)

```typescript
{
  "usuario": Usuario,
  "departamentoDefault": "corporativo|obra|hub|intranet|comercial|suprimentos|engenharia|producao|administrativo|garantidores|gerencial|inteligencia|qsms|juridico",
  "obraAtiva": ObraResumo|null,
  "permissoes": {
    "obras": {
      "acessoTotal": false,
      "permitidas": ["uuid", "uuid"]
    }
  }
}
```

### 1.3 ObraResumo (para listas e contexto)

```typescript
{
  "id": "uuid",
  "codigo": "OBR-001",
  "nome": "string",
  "cliente": "string|null",
  "uf": "string|null",
  "status": "planejamento|em_andamento|pausada|concluida|cancelada",
  "orcamentoTotal": "string|null",
  "responsavel": "string|null",
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

### 1.4 ObraDetalhe (pode incluir agregados)

```typescript
{
  "obra": ObraResumo,
  "agregados": {
    "valorContratadoEapComercial": "string|null",
    "medicoesAprovadasNoPeriodo": "string|null"
  }
}
```

### 1.5 CompetenciaMensal (mínimo para fechamento)

```typescript
{
  "id": "uuid",
  "obraId": "uuid",
  "periodo": "YYYY-MM",          // ex: "2026-01"
  "status": "aberta|em_analise|concluida|bloqueada",
  "travasAtivas": {
    "qualidade": false,
    "ssma": false
  },
  "gates": [GateStatus],         // sempre 9 itens
  "criadaEm": "ISO",
  "concluidaEm": "ISO|null"
}
```

### 1.6 GateStatus (1..9)

```typescript
{
  "numero": 1,
  "nome": "string",
  "status": "pendente|em_analise|aprovado|rejeitado|bloqueado",
  "isTrava": false,              // true para Gate 5 e Gate 6
  "motivoBloqueio": "string|null",
  "aprovadoPor": "uuid|null",
  "aprovadoEm": "ISO|null"
}
```

### 1.7 PatchGate (ação)

```typescript
{
  "status": "pendente|em_analise|aprovado|rejeitado|bloqueado",
  "observacao": "string|null"
}
```

---

## 2) REGRAS CONCEITUAIS — IMPORTANTES (PARA NÃO GERAR CONFLITO)

### 2.1 Pós-login

- **Fluxo:** Login → Intranet (sempre) → (redirecionamento automático)
- **Regra escolhida (MVP):** APÓS INTRANET, É AUTOMÁTICO PARA O DEPARTAMENTO DEFAULT.
- Observação: a Intranet ainda pode ter botões/atalhos, mas o sistema redireciona sozinho após carregar o contexto do usuário.

### 2.2 Níveis Operacional/Tático/Estratégico

- **Regra escolhida (MVP):** É ORGANIZAÇÃO CONCEITUAL.
- No front, isso aparece como:
  - Sidebar agrupada por "Módulos/Departamentos"
  - Dentro do módulo, rotas podem ter subgrupos por nível (ex: `/operacional`, `/tatico`, `/estrategico`)
  - NÃO é obrigatório virar "abas" em todas as telas.
- (Se futuramente quiser, pode virar abas sem mudar o contrato.)

### 2.3 Toggle Tabela/Gráficos

- **Regra escolhida (MVP):** NEM TUDO vira gráfico.
- Tabela é padrão sempre. Gráficos apenas onde houver agregado útil:
  - Dashboard/Analytics
  - Encerramento/Competência
  - Comercial (receita/custo/analytics)
- Esse toggle é 100% front-end (não exige mudança no contrato).

### 2.4 Workflow: exemplo prático (para orientar telas)

MVP vai suportar estes workflows:

**A) Fechamento Mensal (Competência)**
- Abrir competência → Atualizar status gates → Travas (Q/SSMA) → Concluir

**B) Governança por Gates**
- Mudar gate para em_analise → aprovar/rejeitar → bloquear se necessário

**C) Seleção de Obra**
- Usuário seleciona obra → contexto persiste → telas usam obraAtiva

---

## 3) ENDPOINTS — MVP

### 3.1 Auth

#### POST /api/auth/login

**Body:**
```json
{
  "email": "string",
  "senha": "string"
}
```

**200:**
```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "usuario": Usuario
  }
}
```

#### POST /api/auth/refresh

**Body:**
```json
{
  "refreshToken": "string"
}
```

**200:**
```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

#### GET /api/auth/me

**Headers:** `Authorization`

**200:**
```json
{
  "data": ContextoUsuario
}
```

#### POST /api/auth/logout

**Headers:** `Authorization`

**200:**
```json
{
  "data": {
    "ok": true
  }
}
```

---

### 3.2 Obras (mínimo operacional)

#### GET /api/obras

**Query params:**
- `page` (default 1)
- `pageSize` (default 20)
- `status` (opcional)
- `cliente` (opcional)
- `includeDeleted` (default false)

**Headers:** `Authorization`

**200:**
```json
{
  "data": [ObraResumo],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

#### GET /api/obras/:id

**Headers:** `Authorization`

**200:**
```json
{
  "data": ObraDetalhe
}
```

#### POST /api/obras

**Headers:** `Authorization`

**Body:**
```json
{
  "codigo": "OBR-001",
  "nome": "string",
  "cliente": "string|null",
  "uf": "string|null",
  "status": "planejamento|em_andamento|pausada|concluida|cancelada",
  "orcamentoTotal": "string|null",
  "responsavel": "string|null"
}
```

**201:**
```json
{
  "data": ObraResumo
}
```

#### PUT /api/obras/:id

**Headers:** `Authorization`

**Body:** (parcial permitido)
```json
{
  "nome": "string|null",
  "cliente": "string|null",
  "uf": "string|null",
  "status": "planejamento|em_andamento|pausada|concluida|cancelada",
  "orcamentoTotal": "string|null",
  "responsavel": "string|null"
}
```

**200:**
```json
{
  "data": ObraResumo
}
```

#### DELETE /api/obras/:id

**Headers:** `Authorization`

**200:**
```json
{
  "data": {
    "ok": true
  }
}
```

---

### 3.3 Contexto de Obra Ativa (para o Front persistir)

#### GET /api/contexto/obra-ativa

**Headers:** `Authorization`

**200:**
```json
{
  "data": {
    "obraAtiva": ObraResumo|null
  }
}
```

#### PUT /api/contexto/obra-ativa

**Headers:** `Authorization`

**Body:**
```json
{
  "obraId": "uuid|null"
}
```

**200:**
```json
{
  "data": {
    "obraAtiva": ObraResumo|null
  }
}
```

---

### 3.4 Competência Mensal e Gates (MVP CRÍTICO)

#### GET /api/obras/:obraId/competencias

**Query params:**
- `status` (opcional): `aberta|em_analise|concluida|bloqueada`
- `periodo` (opcional): `YYYY-MM`

**Headers:** `Authorization`

**200:**
```json
{
  "data": [CompetenciaMensal]
}
```

#### POST /api/obras/:obraId/competencias

**Headers:** `Authorization`

**Body:**
```json
{
  "periodo": "YYYY-MM"
}
```

**201:**
```json
{
  "data": CompetenciaMensal
}
```

#### GET /api/competencias/:competenciaId

**Headers:** `Authorization`

**200:**
```json
{
  "data": CompetenciaMensal
}
```

#### PATCH /api/competencias/:competenciaId/gates/:numero

**Headers:** `Authorization`

**Body:** PatchGate

**200:**
```json
{
  "data": CompetenciaMensal
}
```

#### POST /api/competencias/:competenciaId/concluir

**Headers:** `Authorization`

**Body:**
```json
{
  "observacao": "string|null"
}
```

**Regras:**
- Se `travasAtivas.qualidade == true` OR `travasAtivas.ssma == true` => `409 CONFLICT`
- Se Gate 9 != `aprovado` => `409 CONFLICT`

**200:**
```json
{
  "data": CompetenciaMensal
}
```

---

### 3.5 Padrão de Erros (exemplos)

#### 401 (sem token)

```json
{
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Token não informado",
    "details": null
  }
}
```

#### 403 (sem permissão)

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Usuário não possui acesso a esta obra",
    "details": {
      "obraId": "uuid"
    }
  }
}
```

#### 409 (conflito de regra)

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Não é possível concluir competência com travas ativas",
    "details": {
      "qualidade": true,
      "ssma": false
    }
  }
}
```

---

## 4) REGRAS MÍNIMAS DE NEGÓCIO (BACKEND)

### 4.1 Geração de Competência

- Ao criar uma competência:
  - `gates` deve vir com 9 itens (numero 1..9)
  - Gate 5 e Gate 6 têm `isTrava=true`
  - `status` inicial: `"aberta"`
  - `travasAtivas` calculadas a partir dos gates:
    - `qualidade = (gate5.status != aprovado)`
    - `ssma = (gate6.status != aprovado)`
  - (Essa regra pode evoluir, mas é o mínimo.)

### 4.2 Concluir Competência

- Bloquear conclusão se:
  - `gate5.status != aprovado` OR `gate6.status != aprovado`
  - `gate9.status != aprovado`
- Ao concluir:
  - `status` da competência vira `"concluida"`
  - `concluidaEm` preenchido

### 4.3 Multi-obra (acesso)

- **Admin:** acesso total
- **Outros:** só acessa `obraId` presente em `permissoes.obras.permitidas`

---

## 5) ITENS FORA DO ESCOPO (NÃO IMPLEMENTAR AGORA)

- Chat realtime, WebSocket
- Vídeo chamada
- Agentes IA funcionais
- Export PDF/Excel
- Auditoria completa
- Módulos completos (Jurídico, RH detalhado, etc.)

(As telas já existem como protótipo, mas a API MVP é só para operar a moldura.)

---

**FIM DO DOCUMENTO — CONTRATO CANÔNICO v1.0 (CONGELADO)**

**Status:** 🟢 DOCUMENTO OFICIAL TRAVADO  
**Aprovação:** Gutemberg  
**Data:** Janeiro 2026


