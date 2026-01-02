import express, { Express } from 'express';
import cors from 'cors';
import obrasRoutes from './routes/obras.routes';
import eapRoutes from './routes/eap.routes';
import medicoesRoutes from './routes/medicoes.routes';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import gatesRoutes from './routes/gates.routes';
import { errorHandler } from './middleware/errorHandler';

/**
 * Configuração da aplicação Express
 * 
 * Centraliza todas as rotas e middlewares da API
 */
export function createApp(): Express {
  const app = express();

  // Middlewares globais
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Rotas públicas (sem autenticação)
  app.use('/api/auth', authRoutes);

  // Rotas protegidas (com autenticação)
  app.use('/api/obras', obrasRoutes);
  app.use('/api/eap', eapRoutes);
  app.use('/api/medicoes', medicoesRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/gates', gatesRoutes);

  // Middleware de tratamento de erros (deve ser o último)
  app.use(errorHandler);

  return app;
}


