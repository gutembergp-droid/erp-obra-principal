import { z } from 'zod';

/**
 * Schemas Zod para validação de Insumos
 */

/**
 * Schema para criação de Insumo
 */
export const CreateInsumoSchema = z.object({
  codigo: z
    .string()
    .min(1, 'Código é obrigatório')
    .max(50, 'Código deve ter no máximo 50 caracteres'),
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  unidade: z
    .string()
    .min(1, 'Unidade é obrigatória')
    .max(20, 'Unidade deve ter no máximo 20 caracteres'),
  categoria: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .max(100, 'Categoria deve ter no máximo 100 caracteres'),
  preco_estimado: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num) || num <= 0) {
        throw new Error('Preço deve ser um número maior que zero');
      }
      return num;
    })
    .refine((val) => val > 0, {
      message: 'Preço deve ser maior que zero',
    }),
  estoque: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) return undefined;
      return num;
    })
    .optional(),
});

/**
 * Schema para atualização de Insumo
 */
export const UpdateInsumoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional(),
  unidade: z
    .string()
    .min(1, 'Unidade é obrigatória')
    .max(20, 'Unidade deve ter no máximo 20 caracteres')
    .optional(),
  categoria: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .max(100, 'Categoria deve ter no máximo 100 caracteres')
    .optional(),
  preco_estimado: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) return undefined;
      return num;
    })
    .refine((val) => val === undefined || val > 0, {
      message: 'Preço deve ser maior que zero',
    })
    .optional(),
  estoque: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) return undefined;
      return num;
    })
    .optional(),
});

/**
 * Schema para query params de listagem
 */
export const ListInsumosQuerySchema = z.object({
  categoria: z.string().optional(),
  busca: z.string().optional(),
  includeDeleted: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
  page: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .optional(),
  pageSize: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .optional(),
});

/**
 * Inferência de tipos
 */
export type ICreateInsumoSchema = z.infer<typeof CreateInsumoSchema>;
export type IUpdateInsumoSchema = z.infer<typeof UpdateInsumoSchema>;
export type IListInsumosQuerySchema = z.infer<typeof ListInsumosQuerySchema>;

