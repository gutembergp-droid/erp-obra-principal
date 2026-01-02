import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware de validação de acesso à obra
 * 
 * Garante que um usuário de uma 'Obra A' nunca consiga ver ou editar dados da 'Obra B'.
 * 
 * Funciona de duas formas:
 * 1. Se obra_id estiver nos parâmetros da rota (/:obra_id/...)
 * 2. Se obra_id estiver no body da requisição
 * 
 * O middleware verifica se a obra existe e se o usuário tem acesso a ela.
 * Por enquanto, valida apenas existência. Em produção, adicionar verificação de permissões.
 */
export async function validateObraAccess(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extrai obra_id de diferentes fontes
    let obraId: string | undefined;

    // 1. Dos parâmetros da rota
    if (req.params.obra_id) {
      obraId = req.params.obra_id;
    }

    // 2. Do body da requisição
    if (!obraId && req.body.obra_id) {
      obraId = req.body.obra_id;
    }

    // 3. Do query string (para listagens)
    if (!obraId && req.query.obra_id) {
      obraId = req.query.obra_id as string;
    }

    // Se não há obra_id, não precisa validar (ex: listagem geral)
    if (!obraId) {
      return next();
    }

    // Valida se a obra existe
    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
    });

    if (!obra) {
      res.status(404).json({
        error: 'Obra não encontrada',
        message: `Obra com ID ${obraId} não existe`,
      });
      return;
    }

    // Verifica se a obra foi deletada (soft delete)
    if (obra.deleted_at) {
      res.status(404).json({
        error: 'Obra não encontrada',
        message: `Obra com ID ${obraId} foi deletada`,
      });
      return;
    }

    // Verifica permissões do usuário (se usuário estiver autenticado)
    const usuarioId = (req as any).user?.id;
    
    if (usuarioId) {
      // Busca o usuário para verificar perfil
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuario || !usuario.is_ativo) {
        res.status(403).json({
          error: 'Acesso negado',
          message: 'Usuário não encontrado ou inativo',
        });
        return;
      }

      // Admin tem acesso a todas as obras
      if (usuario.perfil === 'admin') {
        // Admin tem acesso total - continua
      } else {
        // Verifica se o usuário tem permissão específica para esta obra
        const permissao = await prisma.usuarioObra.findUnique({
          where: {
            usuario_id_obra_id: {
              usuario_id: usuarioId,
              obra_id: obraId,
            },
          },
        });

        if (!permissao || !permissao.is_ativo || permissao.deleted_at) {
          res.status(403).json({
            error: 'Acesso negado',
            message: `Usuário não tem permissão para acessar a obra ${obraId}`,
          });
          return;
        }
      }
    }

    // Adiciona a obra ao request para uso posterior
    (req as any).obra = obra;
    (req as any).obraId = obraId;

    next();
  } catch (error) {
    console.error('Erro ao validar acesso à obra:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível validar o acesso à obra',
    });
  }
}

/**
 * Middleware que exige obra_id obrigatório
 * Para rotas que SEMPRE precisam de uma obra específica
 */
export function requireObraId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const obraId = req.params.obra_id || req.body.obra_id || req.query.obra_id;

  if (!obraId) {
    res.status(400).json({
      error: 'obra_id obrigatório',
      message: 'Esta rota requer o parâmetro obra_id',
    });
    return;
  }

  next();
}

