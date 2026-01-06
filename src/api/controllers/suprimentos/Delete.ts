import type { Request, Response, NextFunction } from 'express';
import prisma from '../../../libs/prisma';
import { SuprimentosService } from '../../../services/SuprimentosService';
import { AuditService } from '../../../services/AuditService';
import { ok, notFound } from '../../utils/apiResponse';

/**
 * Soft delete de um insumo
 * DELETE /api/suprimentos/insumos/:id
 */
export const deletar = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suprimentosService = new SuprimentosService(prisma);
    const auditService = new AuditService(prisma);

    // Busca insumo antes de deletar para auditoria
    const insumo = await suprimentosService.getInsumoById(req.params.id);
    if (!insumo) {
      notFound(res, `Insumo com ID ${req.params.id} não encontrado`);
      return;
    }

    await suprimentosService.deleteInsumo(req.params.id);

    // Registra evento de auditoria
    const usuarioId = (req as any).user?.id;
    if (usuarioId) {
      auditService
        .registrarEvento({
          obra_id: null,
          usuario_id: usuarioId,
          entity_type: 'Insumo',
          entity_id: req.params.id,
          action: 'DELETE',
          payload: {
            codigo: insumo.codigo,
            nome: insumo.nome,
          },
        })
        .catch((err) =>
          console.error('Erro ao registrar evento de auditoria:', err)
        );
    }

    ok(res, { message: 'Insumo deletado com sucesso' });
  } catch (error: any) {
    if (error.message?.includes('não encontrado')) {
      notFound(res, error.message);
      return;
    }

    next(error);
  }
};

