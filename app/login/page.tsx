'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '../../src/services/api/authApi';
import './page.css';

/**
 * Página de Login
 * 
 * Autentica usuário e salva tokens no localStorage
 */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const returnUrl = searchParams?.get('returnUrl') || '/obras';
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
          <h1 className="login-logo">
            <span className="logo-g">G-</span>
            <span className="logo-nesis">NESIS</span>
          </h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
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
              type={showPassword ? 'text' : 'password'}
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

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                disabled={loading}
              />
              <span>Mostrar a senha</span>
            </label>
            <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
              Esqueci a senha
            </a>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}