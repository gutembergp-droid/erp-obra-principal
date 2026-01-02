import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { comparePassword } from '../../utils/bcrypt';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

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
      return res.status(400).json({
        error: 'Campos obrigatórios',
        message: 'Email e senha são obrigatórios',
      });
    }

    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Valida se o usuário existe
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos',
      });
    }

    // Valida se o usuário está ativo
    if (!usuario.is_ativo) {
      return res.status(403).json({
        error: 'Usuário inativo',
        message: 'Usuário está inativo e não pode fazer login',
      });
    }

    // Valida se o usuário não foi deletado
    if (usuario.deleted_at) {
      return res.status(403).json({
        error: 'Usuário deletado',
        message: 'Usuário foi deletado e não pode fazer login',
      });
    }

    // Compara a senha fornecida com o hash armazenado
    const senhaValida = await comparePassword(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos',
      });
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

    // Retorna tokens e dados do usuário (sem senha_hash)
    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
        is_ativo: usuario.is_ativo,
      },
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
      return res.status(400).json({
        error: 'Refresh token obrigatório',
        message: 'O refresh_token é obrigatório',
      });
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
      return res.status(401).json({
        error: 'Refresh token inválido',
        message: 'Usuário associado ao token não existe ou está inativo',
      });
    }

    // Gera novo access token
    const accessToken = generateAccessToken({
      usuario_id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    res.json({
      access_token: accessToken,
    });
  } catch (error: any) {
    if (error.message.includes('expirado') || error.message.includes('inválido')) {
      return res.status(401).json({
        error: 'Refresh token inválido',
        message: error.message,
      });
    }
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Retorna informações do usuário autenticado
 * Requer autenticação
 */
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Usuário não autenticado',
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        is_ativo: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe',
      });
    }

    res.json(usuario);
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
  res.json({
    message: 'Logout realizado com sucesso',
  });
});

export default router;



