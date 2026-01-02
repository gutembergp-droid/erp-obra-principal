/**
 * Extensão dos tipos do Express para incluir propriedades customizadas
 */
declare namespace Express {
  export interface Request {
    obra?: {
      id: string;
      codigo: string;
      nome: string;
      [key: string]: any;
    };
    obraId?: string;
    user?: {
      id: string;
      email: string;
      nome: string;
      perfil: string;
      [key: string]: any;
    };
  }
}



