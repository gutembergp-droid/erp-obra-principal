import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/http";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Log simples (por enquanto)
  console.error("API_ERROR:", err);

  // Erros conhecidos
  if (err?.name === "ZodError") {
    return fail(res, "VALIDATION_ERROR", "Dados inválidos.", 400, err.issues);
  }

  // Prisma / DB
  if (err?.code && String(err.code).startsWith("P")) {
    return fail(res, "DB_ERROR", "Erro de banco de dados.", 500, { prisma: err.code });
  }

  // Default
  return fail(res, "INTERNAL_ERROR", "Erro interno no servidor.", 500);
}



