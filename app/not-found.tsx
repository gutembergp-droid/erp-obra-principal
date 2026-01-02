'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './not-found.css';

/**
 * Página de Erro 404
 * Exibida quando o usuário acessa uma rota que não existe
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="50" stroke="#404040" strokeWidth="2" />
            <path
              d="M40 40L80 80M80 40L40 80"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página não encontrada</h2>
        <p className="not-found-description">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="not-found-actions">
          <button
            className="not-found-button primary"
            onClick={() => router.push('/obras')}
          >
            Voltar para Obras
          </button>
          <button
            className="not-found-button secondary"
            onClick={() => router.back()}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}



