import type { Response } from 'express';

/**
 * Helpers para respostas canônicas da API
 * Formato obrigatório conforme CONTRATO_CANONICO_API_MVP.md
 * 
 * Formato de sucesso:
 * {
 *   "data": <dados>,
 *   "meta": { ... } | null,
 *   "error": null
 * }
 * 
 * Formato de erro:
 * {
 *   "data": null,
 *   "meta": null,
 *   "error": {
 *     "message": "...",
 *     "details": <detalhes opcionais>
 *   }
 * }
 */

export type ApiMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
  [k: string]: any;
} | null;

export type ApiErrorDetails = any;

export interface CanonicalResponse<T = any> {
  data: T | null;
  meta: ApiMeta;
  error: {
    message: string;
    details?: ApiErrorDetails;
  } | null;
}

/**
 * Resposta de sucesso canônica (200 OK)
 */
export function ok<T>(res: Response, data: T, meta: ApiMeta = null): Response {
  const response: CanonicalResponse<T> = {
    data,
    meta,
    error: null,
  };
  return res.status(200).json(response);
}

/**
 * Resposta de criação canônica (201 Created)
 */
export function created<T>(res: Response, data: T, meta: ApiMeta = null): Response {
  const response: CanonicalResponse<T> = {
    data,
    meta,
    error: null,
  };
  return res.status(201).json(response);
}

/**
 * Resposta de erro canônica
 */
export function fail(
  res: Response,
  message: string,
  statusCode: number = 400,
  details?: ApiErrorDetails
): Response {
  const response: CanonicalResponse = {
    data: null,
    meta: null,
    error: {
      message,
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
}

/**
 * Resposta de erro 404 (Not Found)
 */
export function notFound(res: Response, message: string = 'Recurso não encontrado'): Response {
  return fail(res, message, 404);
}

/**
 * Resposta de erro 401 (Unauthorized)
 */
export function unauthorized(res: Response, message: string = 'Não autenticado'): Response {
  return fail(res, message, 401);
}

/**
 * Resposta de erro 403 (Forbidden)
 */
export function forbidden(res: Response, message: string = 'Acesso negado'): Response {
  return fail(res, message, 403);
}

/**
 * Resposta de erro 500 (Internal Server Error)
 */
export function internalError(res: Response, message: string = 'Erro interno do servidor', details?: ApiErrorDetails): Response {
  return fail(res, message, 500, details);
}



