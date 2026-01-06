import { Request, Response, NextFunction } from 'express';
import { CompetenciaStatus } from '@prisma/client';
import prisma from '../../libs/prisma';
import { fail } from '../utils/apiResponse';
import { getObraAtivaFromUser } from './validateObra';

/**
 * Middleware de trava global por competência fechada
 * 
 * Bloqueia operações de escrita (POST, PUT, DELETE) e ações de workflow
 * (submit, approve, reject) se a competência da obra estiver fechada.
 * 
 * Uso:
 * - Aplicar em rotas de escrita de módulos sensíveis
 * - Verifica competência ativa da obra (via obra ativa do usuário ou obra_id)
 */
export async function requireCompetenciaAberta(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extrai obra_id do request
    let obraId: string | null = null;

    // Tenta obter da obra ativa do usuário
    obraId = await getObraAtivaFromUser(req, res);
    
    // Se não conseguiu pela obra ativa, tenta por parâmetro/body
    if (!obraId) {
      obraId = req.params.obra_id || req.body.obra_id || (req as any).obraId;
    }

    if (!obraId) {
      fail(res, 'Obra não identificada. Defina uma obra ativa ou forneça obra_id.', 400);
      return;
    }

    // Busca competência ativa (aberta) da obra
    const competencia = await prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: CompetenciaStatus.aberta,
        deleted_at: null,
      },
      orderBy: {
        aberta_em: 'desc',
      },
    });

    // Se não há competência aberta, bloqueia
    if (!competencia) {
      fail(
        res,
        'Competência está fechada. Não é possível realizar esta operação.',
        403,
        {
          obra_id: obraId,
          motivo: 'Nenhuma competência aberta encontrada para esta obra',
        }
      );
      return;
    }

    // Se a competência está fechada (status fechada), bloqueia
    if (competencia.status === CompetenciaStatus.fechada) {
      fail(
        res,
        'Competência está fechada. Não é possível realizar esta operação.',
        403,
        {
          competencia_id: competencia.id,
          periodo: competencia.periodo,
          fechada_em: competencia.fechada_em,
        }
      );
      return;
    }

    // Adiciona competência ao request para uso posterior
    (req as any).competenciaAtiva = competencia;

    // Permite continuar
    next();
  } catch (error: any) {
    console.error('Erro ao validar competência aberta:', error);
    fail(res, 'Erro ao validar competência aberta', 500, error.message);
  }
}

/**
 * Helper para verificar se competência está aberta (sem bloquear)
 * Retorna true se aberta, false se fechada ou não encontrada
 */
export async function isCompetenciaAberta(obraId: string): Promise<boolean> {
  try {
    const competencia = await prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: CompetenciaStatus.aberta,
        deleted_at: null,
      },
      orderBy: {
        aberta_em: 'desc',
      },
    });

    return !!competencia && competencia.status === CompetenciaStatus.aberta;
  } catch (error) {
    console.error('Erro ao verificar competência aberta:', error);
    return false;
  }
}



