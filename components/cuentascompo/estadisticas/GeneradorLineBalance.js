import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import {connect} from 'react-redux';
class Stats extends Component {
  state = {
    historyData: {}, // Almacena el historial de datos procesados por mes
  };

  componentDidUpdate(prevProps) {
    const { data, tiempo } = this.props;
console.log(this.props)
    // Verificar si los datos o el tiempo han cambiado
    if(data.length >0){
    if (prevProps.data !== data ){
      const getData = this.generarDatapoints();
      const mesSeleccionado = new Date(data[0]?.Tiempo) // Obtener el mes actual
      let codigoMes = `${mesSeleccionado.getMonth()}` + `${mesSeleccionado.getFullYear()}`
      // Actualizar el estado con los nuevos datos procesados
      this.setState((prevState) => ({
        historyData: {
          ...prevState.historyData, // Mantener el historial existente
          [codigoMes]: {
            labels: getData.labels,
            datasets: getData.datasets,
          },
        },
      }));
    }}
  }

  generarDatapoints() {
    const { data, balance, tiempo } = this.props;

    let labels = [];
    let datasets = [];
    let RegsPosesion = [];

    const regsIngGas = data.filter((x) => x.Accion !== "Trans");
    const regsTrans = data.filter((x) => x.Accion === "Trans");

    const CuentasPosesion = this.props.Cuentas.filter((cuenta) => cuenta.CheckedP === true);

    CuentasPosesion.forEach((cuenta) => {
      const registrosRelacionados = regsIngGas.filter(
        (registro) => registro.CuentaSelec.idCuenta === cuenta._id
      );
      RegsPosesion.push(...registrosRelacionados);
    });

    const transIngreso = regsTrans.filter(
      (transferencia) =>
        this.props.Cuentas.some((cuenta) => cuenta.CheckedP === false && cuenta._id === transferencia.CuentaSelec.idCuenta) &&
        this.props.Cuentas.some((cuenta) => cuenta.CheckedP === true && cuenta._id === transferencia.CuentaSelec2.idCuenta)
    );

    const transGastos = regsTrans.filter(
      (transferencia) =>
        this.props.Cuentas.some((cuenta) => cuenta.CheckedP === true && cuenta._id === transferencia.CuentaSelec.idCuenta) &&
        this.props.Cuentas.some((cuenta) => cuenta.CheckedP === false && cuenta._id === transferencia.CuentaSelec2.idCuenta)
    );

    const transferenciasGastosConAccion = transGastos.map((elem) => ({
      ...elem,
      Accion: "Gasto",
    }));

    const transferenciasIngresosConAccion = transIngreso.map((elem) => ({
      ...elem,
      Accion: "Ingreso",
    }));

    const FinalArr = RegsPosesion.concat(transferenciasGastosConAccion).concat(transferenciasIngresosConAccion);

    if (tiempo === "mensual" || tiempo === "periodo") {
      const balancePorDia = FinalArr.reduce((acc, reg) => {
        const fecha = new Date(reg.Tiempo);
        const dia = fecha.getDate();

        if (!acc[dia]) {
          acc[dia] = 0;
        }

        if (reg.Accion === "Ingreso") {
          acc[dia] += parseFloat(reg.Importe || 0);
        } else if (reg.Accion === "Gasto") {
          acc[dia] -= parseFloat(reg.Importe || 0);
        }

        return acc;
      }, {});

      console.log(balancePorDia)

      const diasOrdenados = Object.keys(balancePorDia).map(Number).sort((a, b) => b - a);
      const mesSeleccionado = new Date(data[0]?.Tiempo) 
      let balanceActual = 0
      if(mesSeleccionado.getMonth()== new Date().getMonth()){
        balanceActual = balance;
      } 
      else{
        const primerDiaMesPosterior = new Date(mesSeleccionado.getFullYear(), mesSeleccionado.getMonth() + 1, 1);
      let codigoMes = `${primerDiaMesPosterior.getMonth()}` + `${primerDiaMesPosterior.getFullYear()}`
      let balancePrimerMes = this.state.historyData[codigoMes].datasets[0];
   
    
      balanceActual = parseFloat(balancePrimerMes)
      
      }


      const balanceAcumulado = {};

      diasOrdenados.forEach((dia) => {
        balanceAcumulado[dia] = balanceActual;
     
       let acc = 1;
let valorArestar = balancePorDia[parseFloat(dia) - acc];

// Verificamos si el valor es nulo y si es así, seguimos buscando
if (valorArestar == null) {
  while (valorArestar == null && acc <= 31) {
    acc++;  // Aumentamos el índice para buscar más atrás
    valorArestar = balancePorDia[parseFloat(dia) - acc];  // Intentamos con el nuevo índice
  }
}

// Si encontramos un valor válido, restamos
if (valorArestar != null) {
  balanceActual -= valorArestar;
}

       
      });

      labels = diasOrdenados.reverse().map((dia) => `${dia}`);
      datasets = diasOrdenados.map((dia) => balanceAcumulado[dia].toFixed(2));
    }

    return { labels, datasets };
  }

  render() {
    const { historyData } = this.state;
    const { data, balance, tiempo } = this.props;
    let labels =[]
    let datasets = []

    console.log("Historial de datos:", historyData);
    
    if (this.props.data.length > 0 && Object.keys(this.state.historyData).length > 0) {

      const mesSeleccionado = new Date(this.props.data[0]?.Tiempo) // Obtener el mes actual
      let codigoMes = `${mesSeleccionado.getMonth()}` + `${mesSeleccionado.getFullYear()}`
      if(this.state.historyData[codigoMes]){
      labels  = this.state.historyData[codigoMes].labels
      datasets  = this.state.historyData[codigoMes].datasets
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

const mapStateToProps = (state) => {
  let Cuentas = state.RegContableReducer.Cuentas;
  return {
    Cuentas,
  };
};

export default connect(mapStateToProps, null)(Stats);
