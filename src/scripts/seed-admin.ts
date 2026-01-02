import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Resetando senha do administrador...');

  const email = 'admin@genesis.com';
  const novaSenha = 'admin123';

  try {
    // Busca o usuário admin
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      console.log(`📋 Usuário ${email} encontrado. Deletando...`);
      
      // Deleta o usuário existente (hard delete para garantir limpeza)
      await prisma.usuario.delete({
        where: { email },
      });
      
      console.log('✅ Usuário deletado com sucesso');
    } else {
      console.log(`ℹ️  Usuário ${email} não encontrado. Criando novo...`);
    }

    // Gera hash da nova senha
    console.log('🔒 Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Cria o novo usuário admin
    console.log('👤 Criando novo usuário admin...');
    const admin = await prisma.usuario.create({
      data: {
        email,
        nome: 'Administrador',
        senha_hash: senhaHash,
        perfil: 'admin',
        is_ativo: true,
      },
    });

    console.log('\n✅ Usuário admin criado com sucesso!');
    console.log('\n📋 Credenciais:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: ${novaSenha}`);
    console.log(`   Perfil: ${admin.perfil}`);
    console.log(`   ID: ${admin.id}`);
    console.log('\n🔑 Você pode fazer login agora com essas credenciais.');
  } catch (error: any) {
    console.error('❌ Erro ao resetar senha do admin:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

