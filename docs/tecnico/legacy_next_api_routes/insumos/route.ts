import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/insumos
 * Lista todos os insumos (sem soft delete)
 */
export async function GET() {
  try {
    const insumos = await prisma.insumo.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(insumos, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao listar insumos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar insumos', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insumos
 * Cria um novo insumo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, codigo, unidade, categoria, preco } = body;

    // Validação de campos obrigatórios
    if (!nome || !codigo || !unidade || !categoria || preco === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando', message: 'Nome, código, unidade, categoria e preço são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de preço
    if (parseFloat(preco) <= 0) {
      return NextResponse.json(
        { error: 'Preço inválido', message: 'Preço deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Verifica se código já existe
    const insumoExistente = await prisma.insumo.findUnique({
      where: { codigo },
    });

    if (insumoExistente && !insumoExistente.deleted_at) {
      return NextResponse.json(
        { error: 'Código já existe', message: 'Já existe um insumo com este código' },
        { status: 409 }
      );
    }

    // Cria o insumo
    const novoInsumo = await prisma.insumo.create({
      data: {
        codigo,
        nome,
        unidade,
        categoria,
        preco_estimado: parseFloat(preco),
        estoque: 0,
      },
    });

    return NextResponse.json(novoInsumo, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar insumo:', error);
    
    // Tratamento de erros do Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Código duplicado', message: 'Já existe um insumo com este código' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar insumo', message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



