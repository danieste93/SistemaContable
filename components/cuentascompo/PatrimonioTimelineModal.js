import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Line } from 'react-chartjs-2';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

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

  const handleStartChange = (date) => {
    setPendingStart(date);
  };
  const handleEndChange = (date) => {
    setPendingEnd(date);
  };

  const handleBuscar = () => {
    setStartDate(pendingStart);
    setEndDate(pendingEnd);
    onPeriodChange({ start: pendingStart, end: pendingEnd });
  };

  let xLabel = 'Mes';
  if (granularity === 'day') xLabel = 'Día';
  if (granularity === 'year') xLabel = 'Año';

  const chartData = {
    labels: patrimonioData.map(d => d.label),
    datasets: [
      {
        label: 'Patrimonio',
        data: patrimonioData.map(d => d.value),
        fill: false,
        borderColor: '#1976d2',
        backgroundColor: '#1976d2',
        tension: 0.2,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { title: { display: true, text: xLabel } },
      y: { title: { display: true, text: 'Patrimonio ($)' } },
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
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 600, boxShadow: '0 4px 32px rgba(0,0,0,0.18)' }}>
          <h2 style={{ marginBottom: 16 }}>Patrimonio en Línea de Tiempo</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
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
                style={{ width: 120 }}
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
                style={{ width: 120 }}
              />
            </MuiPickersUtilsProvider>
            <button
              onClick={handleBuscar}
              disabled={loading}
              style={{
                marginLeft: 12,
                padding: '8px 18px',
                background: loading ? '#90caf9' : '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 32 }}>Cargando...</div>
          ) : (
            <Line data={chartData} options={chartOptions} height={220} />
          )}
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
