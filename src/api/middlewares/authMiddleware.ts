import type { Request, Response, NextFunction } from 'express';
import prisma from '../../libs/prisma';
import { verifyAccessToken, extractTokenFromHeader, type JWTPayload } from '../../utils/jwt';

/**
 * Middleware de autenticação JWT
 * 
 * Extrai o token do header Authorization, verifica e decodifica,
 * busca o usuário no banco e injeta em req.user para uso nos Services
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        error: 'Não autenticado',
        message: 'Token de autenticação não fornecido',
      });
      return;
    }

    // Verifica e decodifica o token
    let payload: JWTPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (error: any) {
      res.status(401).json({
        error: 'Token inválido',
        message: error.message || 'Token de autenticação inválido ou expirado',
      });
      return;
    }

    // Busca o usuário no banco para validar se ainda existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.usuario_id },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        is_ativo: true,
        deleted_at: true,
      },
    });

    // Valida se o usuário existe
    if (!usuario) {
      res.status(401).json({
        error: 'Usuário não encontrado',
        message: 'Usuário associado ao token não existe',
      });
      return;
    }

    // Valida se o usuário está ativo
    if (!usuario.is_ativo) {
      res.status(403).json({
        error: 'Usuário inativo',
        message: 'Usuário está inativo e não pode acessar o sistema',
      });
      return;
    }

    // Valida se o usuário não foi deletado
    if (usuario.deleted_at) {
      res.status(403).json({
        error: 'Usuário deletado',
        message: 'Usuário foi deletado e não pode acessar o sistema',
      });
      return;
    }

    // Valida se o email do token corresponde ao email do usuário
    if (payload.email !== usuario.email) {
      res.status(401).json({
        error: 'Token inválido',
        message: 'Token não corresponde ao usuário atual',
      });
      return;
    }

    // Injeta o usuário no request para uso nos Services
    (req as any).user = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      perfil: usuario.perfil,
      is_ativo: usuario.is_ativo,
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao processar autenticação',
    });
  }
}

/**
 * Middleware opcional de autenticação
 * Não bloqueia se não houver token, mas popula req.user se houver
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // Se não houver token, continua sem autenticação
      return next();
    }

    // Se houver token, valida normalmente
    const payload = verifyAccessToken(token);
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.usuario_id },
      select: {
        id: true,
        email: true,
        nome: true,
        perfil: true,
        is_ativo: true,
        deleted_at: true,
      },
    });

    if (usuario && usuario.is_ativo && !usuario.deleted_at) {
      (req as any).user = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
        is_ativo: usuario.is_ativo,
      };
    }

    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação (não bloqueia)
    next();
  }
}



