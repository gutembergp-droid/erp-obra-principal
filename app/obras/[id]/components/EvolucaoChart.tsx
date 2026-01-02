'use client';

import React from 'react';

interface EvolucaoChartProps {
  data: { mes: string; acumulado: number }[];
}

/**
 * Componente de Gráfico de Evolução
 * Gráfico de linha simples mostrando acumulado de medições ao longo dos meses
 */
export function EvolucaoChart({ data }: EvolucaoChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir</p>
      </div>
    );
  }

  // Calcula valores para o gráfico
  const maxValue = Math.max(...data.map(d => d.acumulado), 0);
  const minValue = 0;
  const range = maxValue - minValue;
  const chartHeight = 200;
  const chartWidth = 100;
  const padding = 20;

  // Formata mês para exibição
  const formatMes = (mes: string): string => {
    const [ano, mesNum] = mes.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mesNum) - 1]}/${ano.slice(2)}`;
  };

  // Calcula pontos da linha
  const points = data.map((item, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1 || 1);
    const y = padding + chartHeight - padding - ((item.acumulado - minValue) / (range || 1)) * (chartHeight - 2 * padding);
    return { x, y, ...item };
  });

  // Cria path para a linha
  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <div className="evolucao-chart">
      <svg
        viewBox={`0 0 ${chartWidth + padding * 2} ${chartHeight + padding * 2}`}
        className="chart-svg"
      >
        {/* Grid horizontal */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + (chartHeight - 2 * padding) * (1 - ratio);
          const value = minValue + range * ratio;
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth + padding}
                y2={y}
                stroke="#404040"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              <text
                x={padding - 5}
                y={y + 3}
                fill="#9ca3af"
                fontSize="8"
                textAnchor="end"
              >
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  notation: 'compact',
                }).format(value)}
              </text>
            </g>
          );
        })}

        {/* Linha do gráfico */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#3b82f6"
              stroke="#1f1f1f"
              strokeWidth="1"
            />
            {/* Tooltip on hover */}
            <title>
              {formatMes(point.mes)}: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(point.acumulado)}
            </title>
          </g>
        ))}

        {/* Labels dos meses */}
        {points.map((point, index) => {
          if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
            return (
              <text
                key={index}
                x={point.x}
                y={chartHeight + padding + 15}
                fill="#9ca3af"
                fontSize="9"
                textAnchor="middle"
              >
                {formatMes(point.mes)}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}



