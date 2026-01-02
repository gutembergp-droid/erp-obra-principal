import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateObraAccess } from '../middleware/validateObra';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/dashboard/obra/:obra_id
 * Retorna dados agregados do dashboard para uma obra
 * Query params: periodo (30, 90, todos)
 */
router.get('/obra/:obra_id', authMiddleware, validateObraAccess, async (req, res, next) => {
  try {
    const obraId = req.params.obra_id;
    const periodo = req.query.periodo as '30' | '90' | 'todos' || 'todos';

    // Calcula data de corte baseado no período
    let dataCorte: Date | null = null;
    if (periodo === '30') {
      dataCorte = new Date();
      dataCorte.setDate(dataCorte.getDate() - 30);
    } else if (periodo === '90') {
      dataCorte = new Date();
      dataCorte.setDate(dataCorte.getDate() - 90);
    }

    // Busca obra para obter orçamento
    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
      include: {
        baseline_comercial: {
          // v2.1: Buscar baseline homologada e ativa
          where: { 
            status: 'homologada',
            is_ativo: true, 
            deleted_at: null 
          },
          take: 1,
        },
      },
    });

    if (!obra) {
      return res.status(404).json({
        error: 'Obra não encontrada',
        message: `Obra com ID ${obraId} não existe`,
      });
    }

    // Valor Total Contratado (soma de todas as EAPs comerciais da baseline ativa)
    const baselineAtiva = obra.baseline_comercial[0];
    let valorTotalContratado = 0;

    if (baselineAtiva) {
      const eapsComerciais = await prisma.eap.findMany({
        where: {
          baseline_comercial_id: baselineAtiva.id,
          tipo: 'comercial',
          deleted_at: null,
        },
      });

      valorTotalContratado = eapsComerciais.reduce((sum, eap) => {
        return sum + Number(eap.valor_total || 0);
      }, 0);
    }

    // Busca medições aprovadas (com filtro de período se aplicável)
    const whereMedicoes: any = {
      obra_id: obraId,
      status: 'aprovada',
      deleted_at: null,
    };

    if (dataCorte) {
      whereMedicoes.data_medicao = { gte: dataCorte };
    }

    const medicoes = await prisma.medicao.findMany({
      where: whereMedicoes,
      include: {
        eap: true,
      },
      orderBy: {
        data_medicao: 'asc',
      },
    });

    // Valor Total Medido
    const valorTotalMedido = medicoes.reduce((sum, m) => {
      return sum + Number(m.valor_medido || 0);
    }, 0);

    // Percentual de Avanço
    const percentualAvanco = valorTotalContratado > 0
      ? Math.round((valorTotalMedido / valorTotalContratado) * 100)
      : 0;

    // Evolução (acumulado ao longo do tempo)
    const evolucaoMap = new Map<string, number>();
    let acumulado = 0;

    medicoes.forEach(medicao => {
      acumulado += Number(medicao.valor_medido || 0);
      const dataKey = medicao.data_medicao.toISOString().split('T')[0];
      evolucaoMap.set(dataKey, acumulado);
    });

    const evolucao = Array.from(evolucaoMap.entries())
      .map(([data, acumulado]) => ({
        data,
        acumulado,
      }))
      .sort((a, b) => a.data.localeCompare(b.data));

    // Composição por Grupo (primeiro nível da EAP)
    const composicaoMap = new Map<string, { descricao: string; valorMedido: number }>();

    medicoes.forEach(medicao => {
      if (medicao.eap) {
        // Extrai o primeiro nível do código EAP (ex: "1" de "1.1.2.3")
        const primeiroNivel = medicao.eap.codigo.split('.')[0];
        const atual = composicaoMap.get(primeiroNivel) || {
          descricao: `Grupo ${primeiroNivel}`,
          valorMedido: 0,
        };
        atual.valorMedido += Number(medicao.valor_medido || 0);
        composicaoMap.set(primeiroNivel, atual);
      }
    });

    // Busca descrições dos grupos (primeiro nível) na EAP
    if (baselineAtiva) {
      const gruposEap = await prisma.eap.findMany({
        where: {
          baseline_comercial_id: baselineAtiva.id,
          tipo: 'comercial',
          nivel: 1, // Primeiro nível
          deleted_at: null,
        },
      });

      gruposEap.forEach(grupo => {
        const primeiroNivel = grupo.codigo.split('.')[0];
        const composicao = composicaoMap.get(primeiroNivel);
        if (composicao) {
          composicao.descricao = grupo.descricao;
        }
      });
    }

    // Calcula percentuais
    const composicao = Array.from(composicaoMap.values())
      .map(item => ({
        grupo: item.descricao.split(' ')[1] || 'N/A', // Extrai número do grupo
        descricao: item.descricao,
        valorMedido: item.valorMedido,
        percentual: valorTotalMedido > 0
          ? Math.round((item.valorMedido / valorTotalMedido) * 100)
          : 0,
      }))
      .sort((a, b) => b.valorMedido - a.valorMedido);

    res.json({
      kpi: {
        valorTotalContratado,
        valorTotalMedido,
        percentualAvanco,
      },
      evolucao,
      composicao,
    });
  } catch (error) {
    next(error);
  }
});

export default router;



