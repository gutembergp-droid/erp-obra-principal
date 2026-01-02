/**
 * Catch-all API Route Handler
 * 
 * Integra o servidor Express com Next.js API Routes para funcionar no Vercel.
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
    // Mantém o pathname completo incluindo /api para o Express
    const pathname = url.pathname || '/';
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
        } else {
          body = await request.text();
        }
      } catch (error) {
        // Ignora erros de parsing do body
      }
    }

    // Cria um objeto de requisição compatível com Express
    const expressReq = {
      method,
      url: pathname + (url.search || ''),
      path: pathname,
      query: Object.fromEntries(url.searchParams),
      headers: Object.fromEntries(request.headers.entries()),
      body,
      params: {},
      get: (name: string) => {
        const header = request.headers.get(name);
        return header;
      },
    } as any;

    // Cria um objeto de resposta compatível com Express
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
        if (chunk !== undefined) responseData = chunk;
        responseSent = true;
        return expressRes;
      },
      statusCode: 200,
      locals: {},
    } as any;

    // Executa o Express app
    const app = getExpressApp();
    
    await new Promise<void>((resolve) => {
      let resolved = false;
      
      // Timeout de segurança
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (!responseSent) {
            responseSent = true;
            responseData = { error: 'Timeout', message: 'A requisição demorou muito para processar' };
            statusCode = 504;
          }
          resolve();
        }
      }, 25000);

      try {
        // Chama o Express app handler
        app(expressReq, expressRes, (err?: any) => {
          if (resolved) return;
          
          clearTimeout(timeout);
          resolved = true;
          
          if (err) {
            console.error('[API Handler] Erro do Express:', err);
            if (!responseSent) {
              responseSent = true;
              responseData = {
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado',
              };
              statusCode = 500;
            }
          }
          
          if (!responseSent) {
            responseSent = true;
            // Se nenhuma resposta foi enviada, retorna 404
            responseData = { error: 'Rota não encontrada', message: `Rota ${pathname} não encontrada` };
            statusCode = 404;
          }
          
          resolve();
        });
      } catch (error: any) {
        clearTimeout(timeout);
        if (!resolved) {
          resolved = true;
          console.error('[API Handler] Erro ao executar Express:', error);
          if (!responseSent) {
            responseSent = true;
            responseData = {
              error: 'Erro interno do servidor',
              message: process.env.NODE_ENV === 'development' ? error.message : 'Ocorreu um erro inesperado',
            };
            statusCode = 500;
          }
          resolve();
        }
      }
    });

    // Retorna resposta Next.js
    if (responseData !== null && responseData !== undefined) {
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
    console.error('[API Handler] Erro crítico:', error);
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
