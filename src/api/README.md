# API REST - ERP G-NESIS

API REST desenvolvida com Express para o sistema ERP G-NESIS.

## Estrutura

```
src/api/
├── app.ts                    # Configuração da aplicação Express
├── server.ts                 # Servidor HTTP
├── middleware/
│   ├── validateObra.ts      # Validação de acesso à obra (multi-obra)
│   ├── errorHandler.ts      # Tratamento de erros
│   └── index.ts             # Exportações
└── routes/
    ├── obras.routes.ts       # Rotas de Obras
    ├── eap.routes.ts         # Rotas de EAP
    ├── medicoes.routes.ts    # Rotas de Medições
    └── index.ts              # Exportações
```

## Endpoints

### Obras

- `GET /api/obras` - Lista todas as obras
- `GET /api/obras/:id` - Busca obra por ID
- `POST /api/obras` - Cria nova obra
- `PUT /api/obras/:id` - Atualiza obra
- `DELETE /api/obras/:id` - Soft delete de obra

### EAP

- `GET /api/eap` - Lista EAPs por baseline (query: baseline_id)
- `GET /api/eap/obra/:obra_id` - Lista EAPs por obra (filtro multi-obra)
- `GET /api/eap/obra/:obra_id/folha` - Lista EAPs folha por obra
- `GET /api/eap/comercial-operacional/:baseline_id` - EAP Comercial com Operacionais
- `GET /api/eap/:id` - Busca EAP por ID
- `POST /api/eap` - Cria nova EAP (recalcula operacionais automaticamente)
- `PUT /api/eap/:id` - Atualiza EAP (recalcula operacionais automaticamente)
- `DELETE /api/eap/:id` - Soft delete de EAP

**Fatores de Conversão:**
- `GET /api/eap/:eap_comercial_id/fatores` - Lista fatores de conversão
- `POST /api/eap/fatores` - Cria fator (recalcula operacional automaticamente)
- `PUT /api/eap/fatores/:id` - Atualiza fator (recalcula operacional automaticamente)
- `DELETE /api/eap/fatores/:id` - Deleta fator (recalcula operacional automaticamente)

### Medições

- `GET /api/medicoes/obra/:obra_id` - Lista medições por obra (filtro obrigatório)
- `GET /api/medicoes` - Lista todas as medições (uso administrativo)
- `GET /api/medicoes/:id` - Busca medição por ID
- `POST /api/medicoes` - Cria nova medição (usuario_id obrigatório)
- `PUT /api/medicoes/:id` - Atualiza medição
- `POST /api/medicoes/:id/aprovar` - Aprova medição
- `POST /api/medicoes/:id/rejeitar` - Rejeita medição
- `DELETE /api/medicoes/:id` - Soft delete de medição

## Middleware de Validação Multi-Obra

### validateObraAccess

Garante que um usuário de uma 'Obra A' nunca consiga ver ou editar dados da 'Obra B'.

**Funcionamento:**
1. Extrai `obra_id` de parâmetros, body ou query
2. Valida se a obra existe
3. Verifica se a obra não foi deletada (soft delete)
4. Adiciona obra ao request para uso posterior

**Uso:**
```typescript
router.get('/obra/:obra_id', validateObraAccess, async (req, res) => {
  // req.obraId e req.obra estão disponíveis
  // A obra já foi validada
});
```

## Recálculo Automático de EAPs Operacionais

O `EapService` é integrado nas rotas e garante recálculo automático:

1. **Ao criar EAP Comercial**: Se tiver quantidade e valor, recalcula operacionais relacionadas
2. **Ao atualizar EAP Comercial**: Se quantidade ou valor foram alterados, recalcula
3. **Ao criar Fator de Conversão**: Recalcula EAP Operacional relacionada
4. **Ao atualizar Fator de Conversão**: Recalcula EAP Operacional relacionada
5. **Ao deletar Fator de Conversão**: Recalcula EAP Operacional relacionada

## Execução

```bash
# Instalar dependências
npm install express cors @types/express @types/cors

# Executar servidor
npm run dev
# ou
ts-node src/api/server.ts
```

## Variáveis de Ambiente

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/erp_genesis
NODE_ENV=development
```

## Próximos Passos

- [ ] Autenticação JWT
- [ ] Validação de permissões por obra
- [ ] Rate limiting
- [ ] Documentação Swagger/OpenAPI
- [ ] Logs estruturados
- [ ] Testes de integração



