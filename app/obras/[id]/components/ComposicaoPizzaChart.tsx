'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ComposicaoPizzaChartProps {
  data: { grupo: string; descricao: string; valorMedido: number; percentual: number }[];
}

/**
 * Componente de Gráfico de Pizza de Composição
 * Mostra quanto cada grupo da EAP representa no total medido
 */
export function ComposicaoPizzaChart({ data }: ComposicaoPizzaChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir</p>
      </div>
    );
  }

  // Cores para o gráfico (tema escuro)
  const COLORS = [
    '#3b82f6', // Azul
    '#10b981', // Verde
    '#f59e0b', // Laranja
    '#ef4444', // Vermelho
    '#8b5cf6', // Roxo
    '#06b6d4', // Ciano
    '#ec4899', // Rosa
    '#84cc16', // Lima
  ];

  // Formata valor monetário
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Prepara dados para o gráfico
  const chartData = data.map((item, index) => ({
    name: item.descricao,
    value: Number(item.valorMedido),
    percentual: item.percentual,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="composicao-pizza-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentual }) => `${name}: ${percentual}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f1f1f',
              border: '1px solid #404040',
              borderRadius: '0.5rem',
              color: '#e5e5e5',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend
            wrapperStyle={{ color: '#e5e5e5' }}
            formatter={(value, entry: any) => `${value} (${entry.payload.percentual}%)`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}



