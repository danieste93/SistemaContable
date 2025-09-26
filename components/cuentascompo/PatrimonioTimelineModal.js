
import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Line } from 'react-chartjs-2';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import TimelineIcon from '@material-ui/icons/Timeline';


export default function PatrimonioTimelineModal({ open, onClose, patrimonioData, onPeriodChange, period, loading, granularity }) {
  const [startDate, setStartDate] = useState(period.start);
  const [endDate, setEndDate] = useState(period.end);
  const [pendingStart, setPendingStart] = useState(period.start);
  const [pendingEnd, setPendingEnd] = useState(period.end);

  useEffect(() => {
    setStartDate(period.start);
    setEndDate(period.end);
    setPendingStart(period.start);
    setPendingEnd(period.end);
  }, [period]);

  const handleStartChange = (date) => setPendingStart(date);
  const handleEndChange = (date) => setPendingEnd(date);
  const handleBuscar = () => {
    setStartDate(pendingStart);
    setEndDate(pendingEnd);
    onPeriodChange({ start: pendingStart, end: pendingEnd });
  };

  let xLabel = 'Mes';
  if (granularity === 'day') xLabel = 'Día';
  if (granularity === 'year') xLabel = 'Año';

  // Resumen de patrimonio
  const patrimonioFinal = patrimonioData.length ? patrimonioData[patrimonioData.length - 1].value : 0;
  const patrimonioInicial = patrimonioData.length ? patrimonioData[0].value : 0;
  const variacion = patrimonioFinal - patrimonioInicial;

  const chartData = {
    labels: patrimonioData.map(d => d.label),
    datasets: [
      {
        label: '',
        data: patrimonioData.map(d => d.value),
        fill: true,
        borderColor: '#222',
        backgroundColor: 'rgba(33, 150, 243, 0.08)',
        tension: 0.22,
        pointRadius: 2.5,
        pointBackgroundColor: '#1976d2',
        pointBorderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    elements: {
      line: { borderWidth: 2.2 },
      point: { radius: 2.5 },
    },
    scales: {
      x: {
        title: { display: false },
        grid: { display: false },
        ticks: { font: { family: 'Inter, sans-serif', size: 13 }, color: '#444' },
      },
      y: {
        title: { display: false },
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { family: 'Inter, sans-serif', size: 13 }, color: '#444' },
      },
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}
    >
      <Fade in={open}>
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 18,
            padding: 0,
            minWidth: 340,
            maxWidth: 600,
            width: '100%',
            boxShadow: '0 6px 32px rgba(0,0,0,0.13)',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header minimalista */}
          <div style={{ background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '18px 28px 10px 22px', borderBottom: '1px solid #e3e8ee' }}>
            <TimelineIcon style={{ fontSize: 28, opacity: 0.92 }} />
            <div style={{ fontWeight: 600, fontSize: 19, letterSpacing: 0.2 }}>Patrimonio en Línea de Tiempo</div>
          </div>
          {/* Resumen */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px 0 22px', borderBottom: '1px solid #e3e8ee', background: '#f8fafc' }}>
            <div style={{ fontSize: 15, color: '#888', fontWeight: 500 }}>Patrimonio final</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1976d2', letterSpacing: 0.2 }}>${patrimonioFinal.toLocaleString('es-EC', {minimumFractionDigits:2})}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 28px 0 22px', background: '#f8fafc' }}>
            <div style={{ fontSize: 14, color: '#aaa', fontWeight: 400 }}>Variación</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: variacion >= 0 ? '#43a047' : '#e53935' }}>{variacion >= 0 ? '+' : ''}{variacion.toLocaleString('es-EC', {minimumFractionDigits:2})}</div>
          </div>
          {/* Filtros */}
          <div style={{ display: 'flex', gap: 14, margin: '18px 0 0 0', alignItems: 'center', justifyContent: 'center' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="start-date-picker"
                label="Desde"
                format="MM/YYYY"
                views={["year", "month"]}
                value={pendingStart}
                onChange={handleStartChange}
                maxDate={pendingEnd}
                style={{ width: 110, background: '#fff', borderRadius: 7, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
                InputProps={{ style: { fontSize: 14, fontFamily: 'Inter, sans-serif' } }}
              />
              <KeyboardDatePicker
                margin="normal"
                id="end-date-picker"
                label="Hasta"
                format="MM/YYYY"
                views={["year", "month"]}
                value={pendingEnd}
                onChange={handleEndChange}
                minDate={pendingStart}
                style={{ width: 110, background: '#fff', borderRadius: 7, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
                InputProps={{ style: { fontSize: 14, fontFamily: 'Inter, sans-serif' } }}
              />
            </MuiPickersUtilsProvider>
            <button
              onClick={handleBuscar}
              disabled={loading}
              style={{
                padding: '7px 18px',
                background: loading ? '#b3d2f7' : '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {/* Gráfica */}
          <div style={{ margin: '18px 0 0 0', padding: '0 18px 0 18px', background: 'transparent' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#888', fontSize: 16 }}>Cargando...</div>
            ) : (
              <Line data={chartData} options={chartOptions} height={210} />
            )}
          </div>
          {/* Footer */}
          <div style={{ textAlign: 'right', margin: '18px 18px 12px 0' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: 15,
                padding: '7px 18px',
                borderRadius: 7,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e3e8ee'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >Cerrar</button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
