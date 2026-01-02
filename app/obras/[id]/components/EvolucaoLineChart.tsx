'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EvolucaoLineChartProps {
  data: { data: string; acumulado: number }[];
}

/**
 * Componente de Gráfico de Linha de Evolução
 * Mostra o acumulado de medições ao longo do tempo
 */
export function EvolucaoLineChart({ data }: EvolucaoLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir</p>
      </div>
    );
  }

  // Formata data para exibição
  const formatData = (dataStr: string): string => {
    const date = new Date(dataStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  // Formata valor monetário
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Prepara dados para o gráfico
  const chartData = data.map(item => ({
    data: formatData(item.data),
    dataFull: item.data,
    acumulado: Number(item.acumulado),
  }));

  return (
    <div className="evolucao-line-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="data"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `R$ ${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `R$ ${(value / 1000).toFixed(1)}K`;
              }
              return `R$ ${value}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f1f1f',
              border: '1px solid #404040',
              borderRadius: '0.5rem',
              color: '#e5e5e5',
            }}
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend
            wrapperStyle={{ color: '#e5e5e5' }}
          />
          <Line
            type="monotone"
            dataKey="acumulado"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Valor Acumulado"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}



