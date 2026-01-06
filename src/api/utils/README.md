# Utils - Helpers de Resposta Canônica

Este diretório contém utilitários para padronizar respostas da API conforme o contrato canônico.

## Uso

### Importar helpers

```typescript
import { ok, fail } from '../utils/http';
```

### Exemplos de uso

#### Resposta de sucesso (200)
```typescript
// ANTES
res.json(obra);

// DEPOIS
return ok(res, obra);
```

#### Resposta de criação (201)
```typescript
// ANTES
res.status(201).json(obra);

// DEPOIS
return ok(res, obra, null, 201);
```

#### Resposta com paginação
```typescript
return ok(res, obras, {
  page: 1,
  pageSize: 20,
  total: 100
});
```

#### Resposta de erro
```typescript
// ANTES
return res.status(401).json({
  error: 'Credenciais inválidas',
  message: 'Email ou senha incorretos',
});

// DEPOIS
return fail(res, 'AUTH_INVALID', 'Email ou senha incorretos', 401);
```

#### Códigos de erro canônicos
```typescript
// AUTH_REQUIRED
return fail(res, 'AUTH_REQUIRED', 'Token não informado', 401);

// AUTH_INVALID
return fail(res, 'AUTH_INVALID', 'Token inválido ou expirado', 401);

// FORBIDDEN
return fail(res, 'FORBIDDEN', 'Usuário não possui acesso a esta obra', 403, { obraId });

// NOT_FOUND
return fail(res, 'NOT_FOUND', 'Obra não encontrada', 404);

// VALIDATION_ERROR
return fail(res, 'VALIDATION_ERROR', 'Email e senha são obrigatórios', 400);

// CONFLICT
return fail(res, 'CONFLICT', 'Não é possível concluir competência com travas ativas', 409, { qualidade: true });

// INTERNAL_ERROR
return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
```

## Migração

Substituir todas as respostas diretas por helpers canônicos para garantir aderência ao contrato.

