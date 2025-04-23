import React, { useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function calcularPendiente(valores) {
  const N = valores.length;
  const x = [...Array(N).keys()];{

console.log("pediente")

  }

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = valores.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * valores[i], 0);
  const sumX2 = x.reduce((acc, val, i) => acc + val * val, 0);

  const numerador = (N * sumXY) - (sumX * sumY);
  const denominador = (N * sumX2) - (sumX * sumX);

  return numerador / denominador;
}

const TrendBackgroundChart = (props) => {
  const { data, result, indicesOperativos } = props;
  const dataRecortada = data.slice(-indicesOperativos);

  const pendiente = useMemo(() => calcularPendiente(dataRecortada), [dataRecortada]);

  const trend = useMemo(() => {
    if (pendiente > 0.001) return 'alcista';
    if (pendiente < -0.001) return 'bajista';
    return 'neutra';
  }, [pendiente]);

  useEffect(() => {
    if (result && typeof result === 'function') {
      result(trend);
    }
  }, [trend, result]);

  const backgroundColor = {
    alcista: '#e0f7e9',
    bajista: '#fdecea',
    neutra: '#f0f0f0',
  }[trend];

  const N = dataRecortada.length;
  const minX = 0;
  const maxX = N - 1;

  const inclinacionFactor = 5;
  const midY = 5;
  const deltaY = pendiente * (maxX - minX) * inclinacionFactor;

  const tendenciaLine = [
    { x: minX, y: midY - deltaY / 2 },
    { x: maxX, y: midY + deltaY / 2 },
  ];

  const datosOriginales = [
    { x: minX, y: midY - deltaY / 2 },
    { x: maxX, y: midY + deltaY / 2 },
  ];

  const chartData = {
    labels: Array.from({ length: N }, (_, i) => i),
    datasets: [
      {
        label: 'Línea de tendencia (visual)',
        data: tendenciaLine,
        borderColor: '#28a745',
        borderWidth: 3,
        fill: false,
        pointRadius: 0,
        showLine: true,
        parsing: false,
      },
      {
        label: 'Datos originales (ángulo)',
        data: datosOriginales,
        borderColor: '#f2c744',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        showLine: true,
        parsing: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: N - 1,
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 10,
        grid: { display: false },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor,
        padding: '1rem',
        borderRadius: '1rem',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '300px',
        height: '300px',
      }}
    >
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
        Tendencia: {trend.toUpperCase()} (pendiente: {pendiente.toFixed(4)})
      </h2>
      <div style={{ width: '100%', height: '220px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TrendBackgroundChart;
