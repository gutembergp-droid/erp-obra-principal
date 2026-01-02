import { createApp } from './app';

/**
 * Servidor Express
 * 
 * Inicia o servidor HTTP na porta especificada
 */
const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check em http://localhost:${PORT}/health`);
});



