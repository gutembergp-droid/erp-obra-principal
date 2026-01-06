import { z } from 'zod';

/**
 * Schemas Zod para validação de Obras
 */

/**
 * Schema para criação de Obra
 */
export const CreateObraSchema = z.object({
  codigo: z
    .string()
    .min(1, 'Código é obrigatório')
    .max(50, 'Código deve ter no máximo 50 caracteres'),
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  descricao: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  cliente: z
    .string()
    .max(255, 'Cliente deve ter no máximo 255 caracteres')
    .optional(),
  data_inicio: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  data_fim_prevista: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  orcamento_total: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || val > 0, {
      message: 'Orçamento total deve ser maior que zero',
    })
    .optional(),
  status: z
    .enum(['planejamento', 'em_andamento', 'pausada', 'concluida', 'cancelada'])
    .optional(),
});

/**
 * Schema para atualização de Obra
 */
export const UpdateObraSchema = z.object({
  codigo: z
    .string()
    .min(1, 'Código é obrigatório')
    .max(50, 'Código deve ter no máximo 50 caracteres')
    .optional(),
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional(),
  descricao: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  cliente: z
    .string()
    .max(255, 'Cliente deve ter no máximo 255 caracteres')
    .optional(),
  data_inicio: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  data_fim_prevista: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  data_fim_real: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  orcamento_total: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || val > 0, {
      message: 'Orçamento total deve ser maior que zero',
    })
    .optional(),
  status: z
    .enum(['planejamento', 'em_andamento', 'pausada', 'concluida', 'cancelada'])
    .optional(),
});

/**
 * Schema para query params de listagem
 */
export const ListObrasQuerySchema = z.object({
  status: z.string().optional(),
  cliente: z.string().optional(),
  includeDeleted: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
});

/**
 * Inferência de tipos
 */
export type ICreateObraSchema = z.infer<typeof CreateObraSchema>;
export type IUpdateObraSchema = z.infer<typeof UpdateObraSchema>;
export type IListObrasQuerySchema = z.infer<typeof ListObrasQuerySchema>;

