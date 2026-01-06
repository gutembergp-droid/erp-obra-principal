import { Router } from 'express';
import prisma from '../../libs/prisma';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { comparePassword } from '../../utils/bcrypt';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ok, fail } from '../utils/http';

const router = Router();

/**
 * POST /api/auth/login
 * Autentica um usuário e retorna tokens JWT
 * 
 * Body:
 * {
 *   "email": "usuario@example.com",
 *   "senha": "senha123"
 * }
 * 
 * Response:
 * {
 *   "access_token": "jwt_token",
 *   "refresh_token": "refresh_jwt_token",
 *   "usuario": {
 *     "id": "uuid",
 *     "email": "usuario@example.com",
 *     "nome": "Nome do Usuário",
 *     "perfil": "admin"
 *   }
 * }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Validação de campos obrigatórios
    if (!email || !senha) {
      return fail(res, 'VALIDATION_ERROR', 'Email e senha são obrigatórios', 400);
    }

    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Valida se o usuário existe
    if (!usuario) {
      return fail(res, 'AUTH_INVALID', 'Email ou senha incorretos', 401);
    }

    // Valida se o usuário está ativo
    if (!usuario.is_ativo) {
      return fail(res, 'FORBIDDEN', 'Usuário está inativo e não pode fazer login', 403);
    }

    // Valida se o usuário não foi deletado
    if (usuario.deleted_at) {
      return fail(res, 'FORBIDDEN', 'Usuário foi deletado e não pode fazer login', 403);
    }

    // Compara a senha fornecida com o hash armazenado
    const senhaValida = await comparePassword(senha, usuario.senha_hash);

    if (!senhaValida) {
      return fail(res, 'AUTH_INVALID', 'Email ou senha incorretos', 401);
    }

    // Gera tokens JWT
    const accessToken = generateAccessToken({
      usuario_id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    const refreshToken = generateRefreshToken({
      usuario_id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    // Retorna tokens no formato canônico
    return ok(res, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Renova o access token usando o refresh token
 * 
 * Body:
 * {
 *   "refresh_token": "refresh_jwt_token"
 * }
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return fail(res, 'VALIDATION_ERROR', 'O refresh_token é obrigatório', 400);
    }

    // Verifica o refresh token
    const { verifyRefreshToken } = await import('../../utils/jwt');
    const payload = verifyRefreshToken(refresh_token);

    // Busca o usuário para validar
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.usuario_id },
      select: {
        id: true,
        email: true,
        perfil: true,
        is_ativo: true,
        deleted_at: true,
      },
    });

    if (!usuario || !usuario.is_ativo || usuario.deleted_at) {
      return fail(res, 'AUTH_INVALID', 'Usuário associado ao token não existe ou está inativo', 401);
    }

    // Gera novo access token
    const accessToken = generateAccessToken({
      usuario_id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    return ok(res, {
      accessToken: accessToken,
      refreshToken: refresh_token,
    });
  } catch (error: any) {
    if (error.message.includes('expirado') || error.message.includes('inválido')) {
      return fail(res, 'AUTH_INVALID', error.message || 'Refresh token inválido', 401);
    }
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Retorna informações do usuário autenticado com contexto completo
 * Requer autenticação
 */
router.get('/me', authMiddleware, async (req: any, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return fail(res, 'AUTH_REQUIRED', 'Token não informado', 401);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        obra_ativa_id: true,
        is_ativo: true,
      },
    });

    if (!usuario) {
      return fail(res, 'NOT_FOUND', 'Usuário não encontrado', 404);
    }

    // Obras permitidas do usuário
    const obrasPerm = await prisma.usuarioObra.findMany({
      where: { usuario_id: userId, is_ativo: true },
      select: {
        permissao: true,
        obra: {
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
        },
      },
    });

    // Define obra ativa: se não existir, tenta setar a primeira obra permitida
    let obraAtivaId = usuario.obra_ativa_id;

    if (!obraAtivaId && obrasPerm.length > 0) {
      obraAtivaId = obrasPerm[0].obra.id;

      await prisma.usuario.update({
        where: { id: userId },
        data: { obra_ativa_id: obraAtivaId },
      });
    }

    const obraAtiva = obraAtivaId
      ? obrasPerm.find((x) => x.obra.id === obraAtivaId)?.obra ?? null
      : null;

    const permissaoNaObraAtiva = obraAtivaId
      ? (obrasPerm.find((x) => x.obra.id === obraAtivaId)?.permissao ?? null)
      : null;

    // Transforma obras para formato canônico (camelCase)
    const obrasPermitidas = obrasPerm.map((x) => ({
      permissao: x.permissao,
      obra: {
        id: x.obra.id,
        codigo: x.obra.codigo,
        nome: x.obra.nome,
        cliente: x.obra.cliente,
        status: x.obra.status,
        orcamentoTotal: x.obra.orcamento_total?.toString() ?? null,
        createdAt: x.obra.created_at,
        updatedAt: x.obra.updated_at,
      },
    }));

    const obraAtivaResumo = obraAtiva
      ? {
          id: obraAtiva.id,
          codigo: obraAtiva.codigo,
          nome: obraAtiva.nome,
          cliente: obraAtiva.cliente,
          status: obraAtiva.status,
          orcamentoTotal: obraAtiva.orcamento_total?.toString() ?? null,
          createdAt: obraAtiva.created_at,
          updatedAt: obraAtiva.updated_at,
        }
      : null;

    return ok(res, {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
        isAtivo: usuario.is_ativo,
      },
      obraAtiva: obraAtivaResumo,
      permissaoNaObraAtiva,
      obrasPermitidas,
      // departamentoDefault: null (por enquanto)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout do usuário (por enquanto apenas validação, tokens são stateless)
 * Requer autenticação
 */
router.post('/logout', authMiddleware, async (req, res) => {
  // JWT é stateless, então logout é apenas uma confirmação
  // Em produção, pode-se implementar blacklist de tokens
  return ok(res, { ok: true });
});

export default router;



