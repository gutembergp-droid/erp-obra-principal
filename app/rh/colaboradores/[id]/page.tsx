'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  Building,
  Edit,
  FileText
} from 'lucide-react';

// Dados mock para demonstração
const colaboradoresMock: Record<string, any> = {
  '001': {
    id: '001',
    nome: 'João Carlos Silva',
    cargo: 'Engenheiro Civil',
    setor: 'Engenharia',
    email: 'joao.silva@empresa.com.br',
    telefone: '(11) 99999-1234',
    admissao: '15/03/2020',
    status: 'Ativo',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    cpf: '***.***.***-12',
    rg: '**.***.***-1',
    ctps: '12345678',
    pis: '123.45678.90-1',
    salario: 12500,
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    conta: '12345-6',
  },
  '002': {
    id: '002',
    nome: 'Maria Santos Oliveira',
    cargo: 'Técnica de Segurança',
    setor: 'SSMA',
    email: 'maria.santos@empresa.com.br',
    telefone: '(11) 99999-5678',
    admissao: '20/06/2021',
    status: 'Ativo',
    endereco: 'Av. Principal, 456 - São Paulo/SP',
    cpf: '***.***.***-34',
    rg: '**.***.***-2',
    ctps: '87654321',
    pis: '987.65432.10-9',
    salario: 8500,
    banco: 'Itaú',
    agencia: '5678-9',
    conta: '98765-4',
  },
};

export default function ColaboradorDetalhePage() {
  const params = useParams();
  const { colors } = useTheme();
  const id = (params?.id as string) || '';
  
  const colaborador = colaboradoresMock[id] || {
    id: id,
    nome: 'Colaborador não encontrado',
    cargo: '-',
    setor: '-',
    email: '-',
    telefone: '-',
    admissao: '-',
    status: 'Desconhecido',
    endereco: '-',
    cpf: '-',
    rg: '-',
    ctps: '-',
    pis: '-',
    salario: 0,
    banco: '-',
    agencia: '-',
    conta: '-',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return { bg: '#10B98120', text: '#10B981' };
      case 'Férias': return { bg: '#F59E0B20', text: '#F59E0B' };
      case 'Afastado': return { bg: '#EF444420', text: '#EF4444' };
      default: return { bg: colors.bgCardHover, text: colors.textMuted };
    }
  };

  const statusColor = getStatusColor(colaborador.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/rh/colaboradores"
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <ArrowLeft size={20} style={{ color: colors.textMuted }} />
          </Link>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: colors.accent, color: '#FFFFFF' }}
            >
              {colaborador.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {colaborador.nome}
                </h1>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                >
                  {colaborador.status}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                {colaborador.cargo} • Matrícula #{colaborador.id}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{ borderColor: colors.borderPrimary, color: colors.textSecondary }}
          >
            <FileText size={18} /> Documentos
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: colors.accent }}
          >
            <Edit size={18} /> Editar Cadastro
          </button>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div 
          className="p-6 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <User size={20} style={{ color: colors.accent }} />
            Dados Pessoais
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={16} style={{ color: colors.textMuted }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>E-mail</p>
                <p style={{ color: colors.textPrimary }}>{colaborador.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} style={{ color: colors.textMuted }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Telefone</p>
                <p style={{ color: colors.textPrimary }}>{colaborador.telefone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} style={{ color: colors.textMuted }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Endereço</p>
                <p style={{ color: colors.textPrimary }}>{colaborador.endereco}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4" style={{ borderColor: colors.borderPrimary }}>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>CPF</p>
              <p className="font-mono" style={{ color: colors.textPrimary }}>{colaborador.cpf}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>RG</p>
              <p className="font-mono" style={{ color: colors.textPrimary }}>{colaborador.rg}</p>
            </div>
          </div>
        </div>

        {/* Dados Profissionais */}
        <div 
          className="p-6 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <Briefcase size={20} style={{ color: colors.accent }} />
            Dados Profissionais
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building size={16} style={{ color: colors.textMuted }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Setor</p>
                <p style={{ color: colors.textPrimary }}>{colaborador.setor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase size={16} style={{ color: colors.textMuted }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Cargo</p>
                <p style={{ color: colors.textPrimary }}>{colaborador.cargo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} style={{ color: colors.textMuted }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Data de Admissão</p>
                <p style={{ color: colors.textPrimary }}>{colaborador.admissao}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4" style={{ borderColor: colors.borderPrimary }}>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>CTPS</p>
              <p className="font-mono" style={{ color: colors.textPrimary }}>{colaborador.ctps}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>PIS</p>
              <p className="font-mono" style={{ color: colors.textPrimary }}>{colaborador.pis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info de Teste */}
      <div 
        className="p-4 rounded-lg border-2 border-dashed"
        style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10` }}
      >
        <p className="text-sm font-medium" style={{ color: colors.accent }}>
          🧪 Breadcrumb esperado (3 níveis): <strong>RH / Colaboradores / #{id}</strong>
        </p>
      </div>
    </div>
  );
}
