'use client';

import * as React from 'react';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    AreaChart,
    Area,
} from 'recharts';

// Dados de exemplo para os gráficos com valores diferentes para 'uv'
const barChartData = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
    { name: 'Abr', uv: 2780, pv: 3908 },
    { name: 'Mai', uv: 1890, pv: 4800 },
    { name: 'Jun', uv: 2390, pv: 3800 },
    { name: 'Jul', uv: 3490, pv: 4300 },
];

const areaChartData = [
    { name: 'Jan', uv: 2400, pv: 2400 },
    { name: 'Feb', uv: 1398, pv: 1398 },
    { name: 'Mar', uv: 9800, pv: 9800 },
    { name: 'Abr', uv: 3908, pv: 3908 },
    { name: 'Mai', uv: 4800, pv: 4800 },
    { name: 'Jun', uv: 3800, pv: 3800 },
    { name: 'Jul', uv: 4300, pv: 4300 },
];

export default function Graficovendas() {
   

    return (
        <div style={{ margin: '80px', display: 'flex', alignItems: 'flex-start', gap: 'px' }}>
            <div style={{ flex: 1 }}>
                <h2>Gráfico de Faturamento e Vendas</h2>
                <BarChart
                    width={410}
                    height={350}
                    data={barChartData}
                    margin={{ top: 0, right: 0, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </div>
            <div style={{ flex: 1 }}>
                <h2>Área de Cadastrados</h2>
                <AreaChart
                    width={400}
                    height={320}
                    data={areaChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </div>
        </div>
    );
};
