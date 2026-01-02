import { Router } from 'express';
import obrasRoutes from './obras.routes';
import eapRoutes from './eap.routes';
import medicoesRoutes from './medicoes.routes';
import gatesRoutes from './gates.routes';
import dashboardRoutes from './dashboard.routes';
import authRoutes from './auth.routes';

const router = Router();

// Rotas públicas (não requerem autenticação)
router.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
router.use('/obras', obrasRoutes);
router.use('/eap', eapRoutes);
router.use('/medicoes', medicoesRoutes);
router.use('/gates', gatesRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
