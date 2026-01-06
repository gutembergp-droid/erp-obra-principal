import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { fail } from '../../api/utils/apiResponse';

/**
 * Locais onde a validação pode ser aplicada
 */
type TLocais = 'body' | 'query' | 'params';

/**
 * Tipo para função de validação
 */
type TValidation = (schema: ZodObject<any>, local?: TLocais) => RequestHandler;

/**
 * Factory Pattern - Middleware de Validação
 * 
 * Valida dados de requisição usando schemas Zod antes de chegar ao controller.
 * Sanitiza automaticamente os dados validados.
 * 
 * @param schema - Schema Zod para validação
 * @param local - Local onde aplicar validação ('body', 'query', 'params'). Default: 'body'
 * @returns Middleware Express
 * 
 * @example
 * ```typescript
 * export const createValidator = validation(EstabelecimentoSchema);
 * 
 * router.post('/rota', createValidator, controller.create);
 * ```
 */
export const validation: TValidation = (schema, local = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Determina o local de validação
      const dataToValidate = local === 'body' 
        ? req.body 
        : local === 'query' 
          ? req.query 
          : req.params;

      // Valida com Zod
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        // Formata erros de validação
        const errors = result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));

        return fail(res, 'Dados inválidos', StatusCodes.BAD_REQUEST, {
          validationErrors: errors,
        });
      }

      // Substitui dados originais pelos dados sanitizados e validados
      if (local === 'body') {
        req.body = result.data;
      } else if (local === 'query') {
        req.query = result.data as any;
      } else {
        req.params = result.data as any;
      }

      next();
    } catch (error) {
      console.error('Erro no middleware de validação:', error);
      return fail(
        res,
        'Erro ao processar validação',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };
};

