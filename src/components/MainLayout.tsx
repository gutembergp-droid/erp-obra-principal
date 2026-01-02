'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  HardHat, 
  Package, 
  BadgeDollarSign, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Lock,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Wrench,
  CheckCircle2,
  Shield,
  Leaf,
  Factory
} from 'lucide-react';
import { logout } from '@/services/api/authApi';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [comercialOpen, setComercialOpen] = useState(true);

  // Não exibe a Sidebar na página de login
  if (pathname === '/login') return <>{children}</>;

  // Dados do projeto ativo (TODO: buscar da API)
  const projetoAtivo = {
    codigo: 'PRA-2024-001',
    nome: 'Ponte Rio Azul',
    cliente: 'Governo do Estado - Secretaria de Infraestrutura',
    status: 'Em Andamento',
  };

  const menuItems = [
    { 
      name: 'Intranet', 
      icon: <LayoutDashboard size={20} />, 
      path: '/',
      badge: 7,
    },
    { name: 'Obras', icon: <HardHat size={20} />, path: '/obras' },
    { 
      name: 'Comercial', 
      icon: <DollarSign size={20} />, 
      path: '#',
      submenu: [
        { name: 'Estruturação', path: '/comercial/estruturacao', icon: <Lock size={16} /> },
        { name: 'EAP Comercial', path: '/comercial/eap' },
        { name: '$ Receita', path: '/comercial/receita' },
        { name: 'Custos', path: '/comercial/custos' },
      ],
    },
    { name: 'Engenharia', icon: <Wrench size={20} />, path: '/engenharia' },
    { name: 'Produção', icon: <Factory size={20} />, path: '/producao' },
    { name: 'SST', icon: <Shield size={20} />, path: '/sst' },
    { name: 'Qualidade', icon: <CheckCircle2 size={20} />, path: '/qualidade' },
    { name: 'Administração', icon: <Settings size={20} />, path: '/administracao' },
    { name: 'Meio Ambiente', icon: <Leaf size={20} />, path: '/meio-ambiente' },
    { name: 'Suprimentos', icon: <Package size={20} />, path: '/suprimentos', hasArrow: true },
    { name: 'Financeiro', icon: <BadgeDollarSign size={20} />, path: '/financeiro' },
    { name: 'Gerencial', icon: <TrendingUp size={20} />, path: '/gerencial' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Cabeçalho do Projeto */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">GENESIS</p>
              <p className="text-sm font-semibold text-gray-800">{projetoAtivo.codigo}</p>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{projetoAtivo.nome}</h3>
          <p className="text-xs text-gray-500 mb-2">{projetoAtivo.cliente}</p>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {projetoAtivo.status}
          </span>
        </div>
        
        {/* Menu de Navegação */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.submenu && item.submenu.some(sub => pathname === sub.path));
            
            if (item.submenu) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setComercialOpen(!comercialOpen)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {comercialOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {comercialOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                            pathname === sub.path
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {sub.icon && <span className="text-gray-400">{sub.icon}</span>}
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.hasArrow && (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => logout()}
            className="flex items-center space-x-3 p-3 w-full hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}