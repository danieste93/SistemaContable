import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import {connect} from 'react-redux';

class Stats extends Component {
  state = {};

  componentDidMount() {



  }

  render() {
    const { data, balance, tiempo } = this.props;

    
  let labels = [];
  let datasets = [];
    console.log(this.props)

    let regsIngGas = data.filter(x=>x.Accion != "Trans") 

    let regsTrans = data.filter(x=>x.Accion == "Trans")

    
    let RegsPosesion = []
if(this.props.Cuentas){
let CuentasPosesion = this.props.Cuentas.filter(cuenta => cuenta.CheckedP === true)
let CuentasNoPosesion = this.props.Cuentas.filter(cuenta => cuenta.CheckedP === false)
  
CuentasPosesion.forEach(cuenta => {
    // Filtrar los registros que correspondan a la cuenta
    const registrosRelacionados = regsIngGas.filter(
      registro => registro.CuentaSelec.idCuenta === cuenta._id
    );

    // Almacenar los registros relacionados en el objeto usando el id de la cuenta como clave
  RegsPosesion.push(...registrosRelacionados)
  });
 

  let transIngreso=  regsTrans.filter(transferencia =>
      this.props.Cuentas.some(cuenta => cuenta.CheckedP === false && cuenta._id === transferencia.CuentaSelec.idCuenta) &&
      this.props.Cuentas.some(cuenta => cuenta.CheckedP === true && cuenta._id === transferencia.CuentaSelec2.idCuenta)
    ); 
    let transGastos=  regsTrans.filter(transferencia =>
      this.props.Cuentas.some(cuenta => cuenta.CheckedP === true  && cuenta._id === transferencia.CuentaSelec.idCuenta) &&
      this.props.Cuentas.some(cuenta => cuenta.CheckedP === false && cuenta._id === transferencia.CuentaSelec2.idCuenta)
    ); 

    const transferenciasGastosConAccion = transGastos.map(elem => ({
      ...elem,
      Accion: "Gasto",
    }));
    
    const transferenciasIngresosConAccion = transIngreso.map(elem => ({
      ...elem,
      Accion: "Ingreso",
    }));
    console.log(transferenciasGastosConAccion)
    console.log(transferenciasIngresosConAccion)
   
    let FinalArr = RegsPosesion.concat(transferenciasGastosConAccion).concat(transferenciasIngresosConAccion)



    
  if (tiempo === 'diario') {
  
  } else if (tiempo === 'mensual' || tiempo === 'periodo') {
  
    const balancePorDia = FinalArr.reduce((acc, reg) => {
      const fecha = new Date(reg.Tiempo);
      const dia = fecha.getDate(); // Extraer el día del registro
    
      // Si no existe aún, inicializamos con 0
      if (!acc[dia]) {
        acc[dia] = 0;
      }
    
      // Acumulamos según el tipo de acción
      if (reg.Accion === "Ingreso") {
        acc[dia] += parseFloat(reg.Importe || 0);
      } else if (reg.Accion === "Gasto") {
        acc[dia] -= parseFloat(reg.Importe || 0);
      }
    
      return acc;
    }, {});

    
    const diasOrdenados = Object.keys(balancePorDia)
    .map(Number)
    .sort((a, b) => b - a); // Orden descendente por día
  
console.log(diasOrdenados)

  let balanceActual = balance; // Balance inicial (ejemplo: fecha actual)
  const balanceAcumulado = {};
  
  // Iterar desde el día actual hacia atrás, ajustando balances acumulados
  diasOrdenados.forEach((dia) => {
    balanceAcumulado[dia] = balanceActual; // Asignar el balance acumulado al día actual
    balanceActual -= balancePorDia[dia]; // Ajustar el balance actual restando el balance del día
  });
  
  // Convertir balance acumulado en un formato adecuado para los puntos del gráfico
   labels = diasOrdenados.reverse().map((dia) => ` ${dia}`); // Etiquetas ordenadas cronológicamente
   datasets = diasOrdenados.map((dia) => balanceAcumulado[dia].toFixed(2)); // Valores del gráfico
  
  console.log({ labels, datasets });
   
  }

  
  }
    return (
      <div className="centrar contMainDataChart">
      <Line
                data={{
                  labels,
                  datasets:[{
                    label:"Liquidez",
                    data: datasets,
                    pointBorderColor: '#000',
                    tension: 0.2,
         borderColor:"darkblue",
         borderWidth: 2,
                  
                 } ],
                 
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      align: 'center', // Centrado de leyendas
                      labels: {
                        boxWidth: 15,
                        padding: 10,
                        font: {
                          size: 12,
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          return `Importe: ${tooltipItem.raw}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: tiempo === 'diario' ? 'Horas del día' : 'Días del mes',
                      },
                      ticks: {
                        autoSkip: false,
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Importe total',
                      },
                    },
                  },
                }}
              />
        <style jsx>
          {`
            .centrar {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .contMainDataChart {
              width: 100%;
              height: 100%;
              max-width: 1200px;
              min-height: 500px;
            }
          `}
        </style>
      </div>
    );
  }
}

const mapStateToProps = state=>  {
  let Cuentas =   state.RegContableReducer.Cuentas
  return {
    Cuentas
  }
};

export default connect(mapStateToProps, null)(Stats);
