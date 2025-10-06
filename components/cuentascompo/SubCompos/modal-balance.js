import React, { Component } from 'react'
import Filtrostiempo from './filtrostiempoLim';
import GeneradorLineBalance from "../estadisticas/GeneradorLineBalance"

class Contacto extends Component {
  // Método para recibir los datos filtrados desde Filtrostiempo
  configData = (event) => {
    this.setState({ filteredTimeRegs: event });
  }
  state={
    tiempo:"mensual",
    filteredTimeRegs:[],
    entradaAnimada: false
  }

  handleDownloadPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    try {
      // Intenta cargar el logo desde /assets/logo1.png (público)
      let logoData = '';
      try {
        const response = await fetch('/assets/logo1.png');
        const blob = await response.blob();
        logoData = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) { logoData = undefined; }
      if (logoData) {
        doc.addImage(logoData, 'PNG', 40, 28, 90, 38);
      }
    } catch (e) { /* logo opcional */ }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor('#1976d2');
    doc.text('Reporte de Balance de Liquidez', 145, 55);
    doc.setFontSize(13);
    doc.setTextColor('#444');
    doc.text(`Tipo de periodo: ${this.state.tiempo}`, 40, 90);
    doc.setFontSize(12);
    doc.setTextColor('#1976d2');
    doc.text(`Total registros: ${this.state.filteredTimeRegs.length}`, 40, 110);
    const chartNode = document.querySelector('#balance-chart-pdf');
    if (chartNode) {
      const canvas = await html2canvas(chartNode, { backgroundColor: null, scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 40, 145, 500, 180);
    }
    let y = 340;
    doc.setFontSize(11);
    doc.setTextColor('#1976d2');
    doc.text('Fecha', 40, y);
    doc.text('Valor', 140, y);
           // Se elimina la variación
    doc.setTextColor('#444');
    this.state.filteredTimeRegs.forEach(d => {
      let fechaStr = '';
      if (d.Tiempo) {
        const fecha = new Date(d.Tiempo);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        fechaStr = `${dia}/${mes}/${anio}`;
      } else if (d.label) {
        fechaStr = String(d.label);
      } else {
        fechaStr = '';
      }
      doc.text(fechaStr, 40, y);
      doc.text(`$${(d.value || d.Balance || d.Importe || 0).toLocaleString('es-EC', {minimumFractionDigits:2})}`, 140, y);
      y += 14;
      if (y > 770) {
        doc.addPage();
        y = 40;
      }
    });
    doc.save('balance_liquidez.pdf');
  };

    componentDidMount(){
      setTimeout(() => {
        this.setState({ entradaAnimada: true });
      }, 500);
    }
   
      Onsalida=()=>{
        this.setState({ entradaAnimada: false });
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
  // ...existing code...
      paramTimeData = (event) => {

        this.setState({tiempo:event})

       }
      

    render () {
      // Resumen de balance
      let regs = this.state.filteredTimeRegs.filter(x => x.TiempoEjecucion !== 0);
      let balanceFinal = 0;
      let balanceInicial = 0;
      let datasets = [];
      if (regs.length) {
        // Agrupa por día y suma ingresos/gastos igual que en GeneradorLineBalance
        const balancePorDia = regs.reduce((acc, reg) => {
          const fecha = new Date(reg.Tiempo);
          const dia = fecha.getDate();
          if (!acc[dia]) acc[dia] = 0;
          if (reg.Accion === "Ingreso") acc[dia] += parseFloat(reg.Importe || 0);
          else if (reg.Accion === "Gasto") acc[dia] -= parseFloat(reg.Importe || 0);
          return acc;
        }, {});
        const diasOrdenados = Object.keys(balancePorDia).map(Number).sort((a, b) => b - a);
        let balanceAcum = this.props.balance || 0;
        const reversedArray = Object.entries(balancePorDia)
          .sort((a, b) => b[0] - a[0])
          .map(([key, value]) => value);
        let DataPoints = [];
        diasOrdenados.forEach((dia, i) => {
          let valorArestar = reversedArray[parseFloat(i-1)];
          if (i !== 0) balanceAcum -= valorArestar;
          DataPoints.push(parseFloat(balanceAcum));
        });
        datasets = DataPoints.reverse();
        if (datasets.length) {
          balanceInicial = datasets[0];
          balanceFinal = datasets[datasets.length-1];
        }
      }
  // Se elimina la variación
      return (
        <div
          id="mainxx"
          className={this.state.entradaAnimada ? 'entradaaddc' : ''}
          style={{
            zIndex: this.state.entradaAnimada ? 9999 : 1300,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'z-index 0.3s',
          }}
        >
            <div
              className="popup-balance-liquidez"
              style={{
                background: '#f8fafc',
                borderRadius: 7,
                padding: 0,
                minWidth: '480px',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '56vh',
                overflowY: 'auto',
                boxShadow: '0 6px 32px rgba(0,0,0,0.13)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
            <style>{`
              @media (max-width: 900px) {
                .popup-balance-liquidez {
                  min-width: 80vw !important;
                  max-width: 90vw !important;
                  width: 90vw !important;
                }
              }
              @media (max-width: 700px) {
                .popup-balance-liquidez {
                  min-width: 94vw !important;
                  max-width: 98vw !important;
                  width: 98vw !important;
                  border-radius: 10px !important;
                }
              }
            `}</style>
            <style>{`
              @media (max-width: 700px) {
                .popup-balance-liquidez {
                  min-width: 90vw !important;
                  max-width: 90vw !important;
                  width: 90vw !important;
                  max-height: 56vh !important;
                  border-radius: 6px !important;
                  padding: 0 !important;
                }
                .popup-balance-liquidez .footer-balance {
                  position: sticky;
                  bottom: 0;
                  background: #f8fafc;
                  z-index: 2;
                  padding-bottom: 4px;
                }
                .popup-balance-liquidez > * {
                  padding-left: 6px !important;
                  padding-right: 6px !important;
                }
              }
            `}</style>
            <style>{`
              @media (max-width: 700px) {
                .popup-balance-liquidez {
                  min-width: 94vw !important;
                  max-width: 94vw !important;
                  width: 94vw !important;
                  max-height: 70vh !important;
                  border-radius: 8px !important;
                  padding: 0 !important;
                }
                .popup-balance-liquidez .footer-balance {
                  position: sticky;
                  bottom: 0;
                  background: #f8fafc;
                  z-index: 2;
                  padding-bottom: 8px;
                }
              }
            `}</style>
            <style>{`
              @media (max-width: 700px) {
                .popup-balance-liquidez {
                  min-width: 98vw !important;
                  max-width: 98vw !important;
                  width: 98vw !important;
                  max-height: 88vh !important;
                  border-radius: 10px !important;
                  padding: 0 !important;
                }
                .popup-balance-liquidez .footer-balance {
                  position: sticky;
                  bottom: 0;
                  background: #f8fafc;
                  z-index: 2;
                  padding-bottom: 8px;
                }
              }
            `}</style>
            <style>{`
              @media (max-width: 700px) {
                .popup-balance-liquidez {
                  min-width: 90vw !important;
                  max-width: 98vw !important;
                  width: 98vw !important;
                  border-radius: 12px !important;
                  padding: 0 !important;
                }
              }
            `}</style>
            {/* Header azul */}
            <div style={{ background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '18px 28px 10px 22px', borderBottom: '1px solid #e3e8ee' }}>
              <img src="/static/flecharetro.png" alt="" style={{ height: 32, width: 32, cursor: 'pointer', opacity: 0.92 }} onClick={this.Onsalida} />
              <div style={{ fontWeight: 600, fontSize: 19, letterSpacing: 0.2 }}>Balance de Liquidez</div>
            </div>
            {/* Resumen */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px 0 22px', borderBottom: '1px solid #e3e8ee', background: '#f8fafc' }}>
              <div style={{ fontSize: 15, color: '#888', fontWeight: 500 }}>Balance final</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1976d2', letterSpacing: 0.2 }}>
                {balanceFinal !== null ? `$${balanceFinal.toLocaleString('es-EC', {minimumFractionDigits:2})}` : 'No disponible'}
              </div>
            </div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 14, margin: '18px 0 0 0', alignItems: 'center', justifyContent: 'center' }}>
              <Filtrostiempo getData={this.configData} paramTimeData={this.paramTimeData} />
            </div>
            {/* Gráfica */}
            <div style={{ margin: '18px 0 0 0', padding: '0 18px 0 18px', background: 'transparent' }}>
              <div id="balance-chart-pdf" style={{ background: '#fff', borderRadius: 12, padding: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <GeneradorLineBalance
                  data={regs}
                  tiempo={this.state.tiempo}
                  balance={this.props.balance}
                />
              </div>
            </div>
            {/* Footer */}
            <div className="footer-balance" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, margin: '18px 28px 12px 28px' }}>
              <button
                onClick={this.handleDownloadPDF}
                disabled={regs.length === 0}
                style={{
                  padding: '7px 14px',
                  background: '#fff',
                  color: '#1976d2',
                  border: '1px solid #1976d2',
                  borderRadius: 7,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: regs.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: regs.length === 0 ? 0.6 : 1,
                  marginBottom: 0,
                  marginLeft: 8
                }}
              >Descargar PDF</button>
              <button
                onClick={this.Onsalida}
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
                  marginRight: 8
                }}
                onMouseOver={e => e.currentTarget.style.background = '#e3e8ee'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >Cerrar</button>
            </div>
          </div>
        </div>
      );
    }
}

export default Contacto