import { z } from 'zod';

/**
 * Schemas Zod para validação de Competências
 */

/**
 * Schema para abertura de competência
 */
export const AbrirCompetenciaSchema = z.object({
  periodo: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Período deve estar no formato YYYY-MM (ex: 2026-01)'),
  obra_id: z.string().uuid('obra_id deve ser um UUID válido').optional(),
});

/**
 * Schema para aprovação de gate
 */
export const ApproveGateSchema = z.object({
  observacoes: z.string().max(1000, 'Observações deve ter no máximo 1000 caracteres').optional(),
});

/**
 * Schema para rejeição de gate
 */
export const RejectGateSchema = z.object({
  motivo: z
    .string()
    .min(1, 'Motivo é obrigatório')
    .max(500, 'Motivo deve ter no máximo 500 caracteres'),
});

/**
 * Schema para query params de listagem
 */
export const ListCompetenciasQuerySchema = z.object({
  obra_id: z.string().uuid('obra_id deve ser um UUID válido').optional(),
});

/**
 * Inferência de tipos
 */
export type IAbrirCompetenciaSchema = z.infer<typeof AbrirCompetenciaSchema>;
export type IApproveGateSchema = z.infer<typeof ApproveGateSchema>;
export type IRejectGateSchema = z.infer<typeof RejectGateSchema>;
export type IListCompetenciasQuerySchema = z.infer<typeof ListCompetenciasQuerySchema>;

