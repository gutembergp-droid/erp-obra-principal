import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar o banco de dados (em ordem reversa de dependências)
  console.log('🧹 Limpando banco de dados...');
  await prisma.medicao.deleteMany();
  await prisma.eapFatorConversao.deleteMany();
  await prisma.eap.deleteMany();
  await prisma.gate.deleteMany();
  await prisma.baselineComercial.deleteMany();
  await prisma.usuarioObra.deleteMany();
  await prisma.obra.deleteMany();
  await prisma.usuario.deleteMany();
  console.log('✅ Banco de dados limpo');

  // Criar usuários
  console.log('👤 Criando usuários...');
  const senhaHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@genesis.com',
      nome: 'Administrador',
      senha_hash: senhaHash,
      perfil: 'admin',
      is_ativo: true,
    },
  });

  const engenheiro = await prisma.usuario.create({
    data: {
      email: 'eng@genesis.com',
      nome: 'Engenheiro',
      senha_hash: senhaHash,
      perfil: 'engenheiro',
      is_ativo: true,
    },
  });
  console.log('✅ Usuários criados');

  // Criar obra
  console.log('🏗️ Criando obra...');
  const obra = await prisma.obra.create({
    data: {
      codigo: 'BR-101-LOTE-2',
      nome: 'Duplicação Rodovia BR-101 - Lote 2',
      descricao: 'Duplicação da Rodovia BR-101, Lote 2 - Trecho de infraestrutura rodoviária',
      cliente: 'DNIT',
      data_inicio: new Date('2025-01-01'),
      data_fim_prevista: new Date('2027-12-31'),
      status: 'em_andamento',
      orcamento_total: 45000000.00,
    },
  });
  console.log('✅ Obra criada');

  // Criar permissões de acesso
  console.log('🔐 Criando permissões de acesso...');
  await prisma.usuarioObra.createMany({
    data: [
      {
        usuario_id: admin.id,
        obra_id: obra.id,
        permissao: 'administrador',
        is_ativo: true,
      },
      {
        usuario_id: engenheiro.id,
        obra_id: obra.id,
        permissao: 'escrita',
        is_ativo: true,
      },
    ],
  });
  console.log('✅ Permissões criadas');

  // Criar Baseline Comercial (v2.1: com status de homologação)
  console.log('📊 Criando Baseline Comercial...');
  const baseline = await prisma.baselineComercial.create({
    data: {
      obra_id: obra.id,
      versao: 1,
      descricao: 'Baseline Inicial - Infraestrutura',
      valor_total: 45000000.00,
      // v2.1: Campos de homologação
      status: 'homologada', // Baseline já homologada no seed
      proposta_por: admin.id,
      proposta_em: new Date('2025-01-10'),
      homologada_por: admin.id,
      homologada_em: new Date('2025-01-15'),
      is_ativo: true, // Apenas baselines homologadas podem estar ativas
      // Campos legados (mantidos para compatibilidade)
      data_aprovacao: new Date('2025-01-15'),
      aprovado_por: admin.id,
    },
  });
  console.log('✅ Baseline criada e homologada');

  // Criar EAP Hierárquica
  console.log('📋 Criando EAP...');

  // 1.0 ADMINISTRAÇÃO LOCAL (pai)
  const eap1 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '1.0',
      descricao: 'ADMINISTRAÇÃO LOCAL',
      tipo: 'comercial',
      nivel: 1,
      eap_pai_id: null,
      unidade_medida: null,
      quantidade: null,
      valor_unitario: null,
      valor_total: null,
      ordem: 1,
      is_folha: false,
      usuario_id: admin.id,
    },
  });

  // 2.0 TERRAPLANAGEM (pai)
  const eap2 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '2.0',
      descricao: 'TERRAPLANAGEM',
      tipo: 'comercial',
      nivel: 1,
      eap_pai_id: null,
      unidade_medida: null,
      quantidade: null,
      valor_unitario: null,
      valor_total: null,
      ordem: 2,
      is_folha: false,
      usuario_id: admin.id,
    },
  });

  // 2.1 Escavação, Carga e Transporte
  const eap21 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '2.1',
      descricao: 'Escavação, Carga e Transporte',
      tipo: 'comercial',
      nivel: 2,
      eap_pai_id: eap2.id,
      unidade_medida: 'm³',
      quantidade: 50000.0000,
      valor_unitario: 15.00,
      valor_total: 750000.00, // 50.000 * 15.00
      ordem: 1,
      is_folha: true,
      usuario_id: admin.id,
    },
  });

  // 2.2 Compactação de Aterros
  const eap22 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '2.2',
      descricao: 'Compactação de Aterros',
      tipo: 'comercial',
      nivel: 2,
      eap_pai_id: eap2.id,
      unidade_medida: 'm³',
      quantidade: 45000.0000,
      valor_unitario: 12.00,
      valor_total: 540000.00, // 45.000 * 12.00
      ordem: 2,
      is_folha: true,
      usuario_id: admin.id,
    },
  });

  // 3.0 DRENAGEM (pai)
  const eap3 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '3.0',
      descricao: 'DRENAGEM',
      tipo: 'comercial',
      nivel: 1,
      eap_pai_id: null,
      unidade_medida: null,
      quantidade: null,
      valor_unitario: null,
      valor_total: null,
      ordem: 3,
      is_folha: false,
      usuario_id: admin.id,
    },
  });

  // 3.1 Tubo de Concreto D=60cm
  const eap31 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '3.1',
      descricao: 'Tubo de Concreto D=60cm',
      tipo: 'comercial',
      nivel: 2,
      eap_pai_id: eap3.id,
      unidade_medida: 'm',
      quantidade: 1200.0000,
      valor_unitario: 350.00,
      valor_total: 420000.00, // 1.200 * 350.00
      ordem: 1,
      is_folha: true,
      usuario_id: admin.id,
    },
  });

  // 4.0 PAVIMENTAÇÃO (pai)
  const eap4 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '4.0',
      descricao: 'PAVIMENTAÇÃO',
      tipo: 'comercial',
      nivel: 1,
      eap_pai_id: null,
      unidade_medida: null,
      quantidade: null,
      valor_unitario: null,
      valor_total: null,
      ordem: 4,
      is_folha: false,
      usuario_id: admin.id,
    },
  });

  // 4.1 Imprimação
  const eap41 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '4.1',
      descricao: 'Imprimação',
      tipo: 'comercial',
      nivel: 2,
      eap_pai_id: eap4.id,
      unidade_medida: 'm²',
      quantidade: 20000.0000,
      valor_unitario: 8.50,
      valor_total: 170000.00, // 20.000 * 8.50
      ordem: 1,
      is_folha: true,
      usuario_id: admin.id,
    },
  });

  // 4.2 CBUQ Faixa C
  const eap42 = await prisma.eap.create({
    data: {
      baseline_comercial_id: baseline.id,
      codigo: '4.2',
      descricao: 'CBUQ Faixa C',
      tipo: 'comercial',
      nivel: 2,
      eap_pai_id: eap4.id,
      unidade_medida: 'ton',
      quantidade: 5000.0000,
      valor_unitario: 450.00,
      valor_total: 2250000.00, // 5.000 * 450.00
      ordem: 2,
      is_folha: true,
      usuario_id: admin.id,
    },
  });

  console.log('✅ EAP criada');

  // Criar medições aprovadas em meses passados
  console.log('📏 Criando medições...');

  // Medição 1: Mês passado (Novembro 2025)
  const dataMedicao1 = new Date('2025-11-15');
  dataMedicao1.setHours(10, 0, 0, 0);
  
  const medicao1 = await prisma.medicao.create({
    data: {
      obra_id: obra.id,
      eap_id: eap21.id, // Escavação, Carga e Transporte
      usuario_id: engenheiro.id,
      tipo: 'MP', // Medição de Produção
      periodo_referencia: '2025-11',
      data_medicao: dataMedicao1,
      quantidade_medida: 12000.0000, // 24% do planejado (50.000)
      valor_medido: 180000.00, // 12.000 * 15.00
      observacoes: 'Medição mensal - Novembro 2025',
      status: 'aprovada',
      aprovado_por_id: admin.id,
      data_aprovacao: new Date('2025-11-20'),
    },
  });

  // Medição 2: Mês anterior (Outubro 2025)
  const dataMedicao2 = new Date('2025-10-15');
  dataMedicao2.setHours(10, 0, 0, 0);
  
  const medicao2 = await prisma.medicao.create({
    data: {
      obra_id: obra.id,
      eap_id: eap22.id, // Compactação de Aterros
      usuario_id: engenheiro.id,
      tipo: 'MP', // Medição de Produção
      periodo_referencia: '2025-10',
      data_medicao: dataMedicao2,
      quantidade_medida: 10000.0000, // ~22% do planejado (45.000)
      valor_medido: 120000.00, // 10.000 * 12.00
      observacoes: 'Medição mensal - Outubro 2025',
      status: 'aprovada',
      aprovado_por_id: admin.id,
      data_aprovacao: new Date('2025-10-20'),
    },
  });

  console.log('✅ Medições criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - Obra: ${obra.nome}`);
  console.log(`   - Valor Total: R$ ${obra.orcamento_total?.toFixed(2)}`);
  console.log(`   - Usuários: ${admin.email} (admin) e ${engenheiro.email} (engenheiro)`);
  console.log(`   - EAP: 8 itens criados`);
  console.log(`   - Medições: 2 medições aprovadas`);
  console.log('\n🔑 Credenciais de acesso:');
  console.log(`   Admin: ${admin.email} / 123456`);
  console.log(`   Engenheiro: ${engenheiro.email} / 123456`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

