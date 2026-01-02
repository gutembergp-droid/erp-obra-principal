/**
 * Catch-all API Route Handler
 * 
 * Integra o servidor Express com Next.js API Routes para funcionar no Vercel.
 * 
 * NOTA: Esta é uma solução simplificada. Para produção, considere migrar
 * as rotas para Next.js API Routes individuais ou usar next-connect.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createApp } from '@/api/app';

// Singleton do Express app
let expressAppInstance: any = null;

function getExpressApp() {
  if (!expressAppInstance) {
    expressAppInstance = createApp();
  }
  return expressAppInstance;
}

/**
 * Handler para todas as rotas da API
 */
async function handleRequest(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\/api/, '') || '/';
    const method = request.method;
    
    // Prepara body
    let body: any = undefined;
    if (method !== 'GET' && method !== 'DELETE' && method !== 'HEAD') {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          body = await request.json();
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData();
          body = Object.fromEntries(formData.entries());
        }
      } catch {
        // Ignora erros de parsing do body
      }
    }

    // Cria um mock de Request/Response do Express
    const expressReq = {
      method,
      url: pathname + url.search,
      path: pathname,
      query: Object.fromEntries(url.searchParams),
      headers: Object.fromEntries(request.headers.entries()),
      body,
      params: {},
      get: (name: string) => request.headers.get(name),
    } as any;

    let statusCode = 200;
    const headers: Record<string, string> = {};
    let responseData: any = null;
    let responseSent = false;

    const expressRes = {
      status: (code: number) => {
        statusCode = code;
        return expressRes;
      },
      json: (data: any) => {
        if (responseSent) return expressRes;
        responseData = data;
        headers['Content-Type'] = 'application/json';
        responseSent = true;
        return expressRes;
      },
      send: (data: any) => {
        if (responseSent) return expressRes;
        responseData = data;
        responseSent = true;
        return expressRes;
      },
      setHeader: (name: string, value: string) => {
        headers[name] = value;
        return expressRes;
      },
      getHeader: (name: string) => headers[name],
      end: (chunk?: any) => {
        if (responseSent) return expressRes;
        if (chunk) responseData = chunk;
        responseSent = true;
        return expressRes;
      },
    } as any;

    // Executa o Express app
    const app = getExpressApp();
    
    await new Promise<void>((resolve) => {
      // Timeout de segurança
      const timeout = setTimeout(() => {
        if (!responseSent) {
          responseSent = true;
          resolve();
        }
      }, 30000); // 30 segundos

      app(expressReq, expressRes, () => {
        clearTimeout(timeout);
        if (!responseSent) {
          responseSent = true;
        }
        resolve();
      });
    });

    // Retorna resposta
    if (responseData !== null) {
      if (typeof responseData === 'object' && !headers['Content-Type']) {
        return NextResponse.json(responseData, { status: statusCode, headers });
      }
      return new NextResponse(
        typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
        { status: statusCode, headers }
      );
    }

    return new NextResponse(null, { status: statusCode, headers });
  } catch (error: any) {
    console.error('Erro no handler da API:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Ocorreu um erro inesperado',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}
