import React, { useState } from 'react';

const calcularPendiente = (data, windowSize) => {
  const smoothData = data.map((_, i, arr) => {
    const start = Math.max(0, i - windowSize + 1);
    const end = i + 1;
    const window = arr.slice(start, end);
    return window.reduce((acc, val) => acc + val, 0) / window.length;
  });

  const n = smoothData.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = smoothData.reduce((acc, val) => acc + val, 0);
  const sumXY = smoothData.reduce((acc, val, i) => acc + x[i] * val, 0);
  const sumX2 = x.reduce((acc, val) => acc + val ** 2, 0);

  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
};
const calcularPendienteSinSuavizado = (data, windowSize) => {
    const filteredData = data.slice(-windowSize); // Tomar solo los últimos 'windowSize' elementos
    const n = filteredData.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((acc, val) => acc + val, 0);
    const sumY = filteredData.reduce((acc, val) => acc + val, 0);
    const sumXY = filteredData.reduce((acc, val, i) => acc + x[i] * val, 0);
    const sumX2 = x.reduce((acc, val) => acc + val ** 2, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  };

const TrendBox = ({ data }) => {
  const [windowSize, setWindowSize] = useState(20);

  // Calcular pendiente de datos normalizados
  const pendienteNormalizada = calcularPendiente(data, windowSize);
  // Calcular pendiente de datos originales
  const pendienteOriginal = calcularPendienteSinSuavizado(data, windowSize); // Sin suavizado

  // Función para determinar el color de la pendiente
  const getPendienteColor = (pendiente) => {
    if (pendiente > 0.001) return '#4CAF50'; // Verde para tendencia alta
    if (pendiente < -0.001) return '#F44336'; // Rojo para tendencia baja
    return '#FFC107'; // Amarillo para tendencia neutra
  };

  return (
    <div className="trend-box">
      <div className="pendiente">
        <h4 style={{ color: getPendienteColor(pendienteNormalizada) }}>
          Pendiente Normalizada: {pendienteNormalizada.toFixed(6)}
        </h4>
        <h4 style={{ color: getPendienteColor(pendienteOriginal) }}>
          Pendiente Original: {pendienteOriginal.toFixed(6)}
        </h4>
      </div>

      <div className="input-section">
        <label htmlFor="windowSize">Tamaño de Ventana:</label>
        <input
          type="number"
          id="windowSize"
          value={windowSize}
          onChange={(e) => setWindowSize(Math.max(1, e.target.value))}
          style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <style jsx>{`
        .trend-box {
          width: 300px;
          padding: 20px;
          border-radius: 12px;
          background: linear-gradient(145deg, #ffffff, #e6e9ec);
          box-shadow: 5px 5px 10px #c9cccf, -5px -5px 10px #ffffff;
        }

        .pendiente {
          text-align: center;
          margin-bottom: 15px;
        }

        .input-section {
          margin-top: 15px;
        }

        .input-section h4 {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default TrendBox;
