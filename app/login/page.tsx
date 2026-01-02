'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '../../src/services/api/authApi';
import './page.css';

/**
 * Página de Login
 * 
 * Autentica usuário e salva tokens no localStorage
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verifica se usuário já está logado
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Se já tem token, redireciona para obras
        router.push('/obras');
      }
    }
  }, [router]);

  /**
   * Atualiza campo do formulário
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpa erro ao digitar
    if (error) {
      setError(null);
    }
  };

  /**
   * Submete formulário de login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Valida campos obrigatórios
      if (!formData.email || !formData.senha) {
        setError('Email e senha são obrigatórios');
        return;
      }

      // Faz login via API
      const response = await login({
        email: formData.email,
        senha: formData.senha,
      });

      // Tokens são salvos automaticamente pelo serviço login()
      // Redireciona para returnUrl se fornecido, senão para /obras
      const returnUrl = searchParams.get('returnUrl') || '/obras';
      router.push(returnUrl);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
      console.error('Erro ao fazer login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>ERP G-NESIS</h1>
          <p className="login-subtitle">Sistema de Gestão de Obras</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 ERP G-NESIS. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}

