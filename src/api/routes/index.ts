import { Router } from 'express';
import obrasRoutes from './obras.routes';
import eapRoutes from './eap.routes';
import medicoesRoutes from './medicoes.routes';
import gatesRoutes from './gates.routes';
import dashboardRoutes from './dashboard.routes';
import authRoutes from './auth.routes';
import comercialRoutes from './comercial.routes'; // FASE 1: Rotas do Comercial
import competenciasRoutes from './competencias.routes'; // Backend Mínimo: Competências e Gates

const router = Router();

// Rotas públicas (não requerem autenticação)
router.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
router.use('/obras', obrasRoutes);
router.use('/eap', eapRoutes);
router.use('/medicoes', medicoesRoutes);
router.use('/gates', gatesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/comercial', comercialRoutes); // FASE 1: Rotas do Comercial
router.use('/api', competenciasRoutes); // Backend Mínimo: Competências e Gates (prefixo /api já está no router principal)

export default router;
