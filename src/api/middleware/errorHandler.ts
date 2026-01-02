import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de tratamento de erros
 * 
 * Captura erros lançados pelos serviços e retorna respostas HTTP apropriadas
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Erro na API:', err);

  // Erro de validação (lançado pelos serviços)
  if (err.message.includes('não encontrada') || err.message.includes('não encontrado')) {
    res.status(404).json({
      error: 'Recurso não encontrado',
      message: err.message,
    });
    return;
  }

  // Erro de validação (dados inválidos)
  if (err.message.includes('já existe') || err.message.includes('duplicado')) {
    res.status(409).json({
      error: 'Conflito',
      message: err.message,
    });
    return;
  }

  // Erro de validação (dados inválidos)
  if (err.message.includes('inválido') || err.message.includes('obrigatório')) {
    res.status(400).json({
      error: 'Dados inválidos',
      message: err.message,
    });
    return;
  }

  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado',
  });
}



