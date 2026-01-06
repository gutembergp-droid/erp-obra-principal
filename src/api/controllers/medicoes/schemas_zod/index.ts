import { z } from 'zod';

/**
 * Schemas Zod para validação de Medições
 */

/**
 * Schema para criação de medição
 */
export const CreateMedicaoSchema = z.object({
  obra_id: z.string().uuid('obra_id deve ser um UUID válido'),
  eap_id: z.string().uuid('eap_id deve ser um UUID válido').optional(),
  tipo: z.enum(['MP', 'MC'], {
    errorMap: () => ({ message: 'Tipo deve ser MP ou MC' }),
  }),
  periodo_referencia: z
    .string()
    .min(1, 'Período de referência é obrigatório')
    .max(20, 'Período de referência deve ter no máximo 20 caracteres'),
  data_medicao: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
  quantidade_medida: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num) || num < 0) {
        throw new Error('Quantidade medida deve ser um número maior ou igual a zero');
      }
      return num;
    }),
  valor_medido: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : num;
    })
    .optional(),
  observacoes: z.string().max(1000, 'Observações deve ter no máximo 1000 caracteres').optional(),
  competencia_id: z.string().uuid('competencia_id deve ser um UUID válido').optional(),
});

/**
 * Schema para atualização de medição
 */
export const UpdateMedicaoSchema = z.object({
  eap_id: z.string().uuid('eap_id deve ser um UUID válido').optional(),
  periodo_referencia: z
    .string()
    .min(1, 'Período de referência é obrigatório')
    .max(20, 'Período de referência deve ter no máximo 20 caracteres')
    .optional(),
  data_medicao: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  quantidade_medida: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || val >= 0, {
      message: 'Quantidade medida deve ser maior ou igual a zero',
    })
    .optional(),
  valor_medido: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : num;
    })
    .optional(),
  observacoes: z.string().max(1000, 'Observações deve ter no máximo 1000 caracteres').optional(),
  competencia_id: z.string().uuid('competencia_id deve ser um UUID válido').optional(),
});

/**
 * Schema para aprovação de medição
 */
export const AprovarMedicaoSchema = z.object({
  observacoes: z.string().max(1000, 'Observações deve ter no máximo 1000 caracteres').optional(),
});

/**
 * Schema para rejeição de medição
 */
export const RejeitarMedicaoSchema = z.object({
  motivo_rejeicao: z
    .string()
    .min(1, 'Motivo de rejeição é obrigatório')
    .max(500, 'Motivo de rejeição deve ter no máximo 500 caracteres'),
});

/**
 * Schema para query params de listagem
 */
export const ListMedicoesQuerySchema = z.object({
  obra_id: z.string().uuid('obra_id deve ser um UUID válido').optional(),
  eap_id: z.string().uuid('eap_id deve ser um UUID válido').optional(),
  usuario_id: z.string().uuid('usuario_id deve ser um UUID válido').optional(),
  periodo_referencia: z.string().optional(),
  periodo: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).optional(),
  includeDeleted: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
});

/**
 * Inferência de tipos
 */
export type ICreateMedicaoSchema = z.infer<typeof CreateMedicaoSchema>;
export type IUpdateMedicaoSchema = z.infer<typeof UpdateMedicaoSchema>;
export type IAprovarMedicaoSchema = z.infer<typeof AprovarMedicaoSchema>;
export type IRejeitarMedicaoSchema = z.infer<typeof RejeitarMedicaoSchema>;
export type IListMedicoesQuerySchema = z.infer<typeof ListMedicoesQuerySchema>;

