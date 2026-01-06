import type { Response } from "express";

/**
 * Helpers para respostas canônicas da API
 * Seguem o formato definido em CONTRATO_CANONICO_API_MVP.md
 */

export type ApiMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
  [k: string]: any;
} | null;

/**
 * Resposta de sucesso canônica
 */
export function ok<T>(res: Response, data: T, meta: ApiMeta = null, status = 200) {
  return res.status(status).json({ data, meta });
}

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

/**
 * Resposta de erro canônico
 */
export function fail(res: Response, code: string, message: string, status = 400, details?: any) {
  const payload: ApiErrorPayload = { error: { code, message, details } };
  return res.status(status).json(payload);
}




