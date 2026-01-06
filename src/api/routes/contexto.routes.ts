import { Router } from "express";
import prisma from '../../libs/prisma';
import { ok, fail } from "../utils/http";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/**
 * GET /api/contexto/obra-ativa
 * Retorna a obra ativa do usuário logado
 */
router.get("/obra-ativa", authMiddleware, async (req: any, res) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, "AUTH_REQUIRED", "Token não informado", 401);

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { obra_ativa_id: true },
  });

  if (!usuario) return fail(res, "NOT_FOUND", "Usuário não encontrado", 404);

  if (!usuario.obra_ativa_id) {
    return ok(res, { obraAtiva: null });
  }

  const obra = await prisma.obra.findUnique({
    where: { id: usuario.obra_ativa_id },
    select: {
      id: true,
      codigo: true,
      nome: true,
      cliente: true,
      status: true,
      orcamento_total: true,
      created_at: true,
      updated_at: true,
    },
  });

  // Transforma para formato canônico (camelCase)
  const obraResumo = obra ? {
    id: obra.id,
    codigo: obra.codigo,
    nome: obra.nome,
    cliente: obra.cliente,
    status: obra.status,
    orcamentoTotal: obra.orcamento_total?.toString() ?? null,
    createdAt: obra.created_at,
    updatedAt: obra.updated_at,
  } : null;

  return ok(res, { obraAtiva: obraResumo });
});

/**
 * PUT /api/contexto/obra-ativa
 * Body: { obraId: string }
 * Atualiza a obra ativa do usuário logado
 */
router.put("/obra-ativa", authMiddleware, async (req: any, res) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, "AUTH_REQUIRED", "Token não informado", 401);

  const { obraId } = req.body ?? {};
  
  // Se obraId for null, apenas limpa a obra ativa
  if (obraId === null || obraId === undefined) {
    await prisma.usuario.update({
      where: { id: userId },
      data: { obra_ativa_id: null },
    });
    return ok(res, { obraAtiva: null });
  }

  if (!obraId || typeof obraId !== 'string') {
    return fail(res, "VALIDATION_ERROR", "Campo obraId é obrigatório", 400);
  }

  // Verifica se a obra existe
  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    select: {
      id: true,
      codigo: true,
      nome: true,
      cliente: true,
      status: true,
      orcamento_total: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!obra) {
    return fail(res, "NOT_FOUND", "Obra não encontrada", 404);
  }

  // Verifica se o usuário tem permissão na obra
  // Admin tem acesso total
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { perfil: true },
  });

  if (usuario?.perfil !== 'admin') {
    const permissao = await prisma.usuarioObra.findFirst({
      where: { 
        usuario_id: userId, 
        obra_id: obraId, 
        is_ativo: true 
      },
      select: { permissao: true },
    });

    if (!permissao) {
      return fail(res, "FORBIDDEN", "Usuário não tem acesso a esta obra", 403, { obraId });
    }
  }

  // Atualiza obra ativa
  await prisma.usuario.update({
    where: { id: userId },
    data: { obra_ativa_id: obraId },
  });

  // Transforma para formato canônico (camelCase)
  const obraResumo = {
    id: obra.id,
    codigo: obra.codigo,
    nome: obra.nome,
    cliente: obra.cliente,
    status: obra.status,
    orcamentoTotal: obra.orcamento_total?.toString() ?? null,
    createdAt: obra.created_at,
    updatedAt: obra.updated_at,
  };

  return ok(res, { obraAtiva: obraResumo });
});

export default router;


