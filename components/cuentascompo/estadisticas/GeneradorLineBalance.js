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
            balanceini: getData.BalanceInicial
          },
        },
      }));
    }}
  }

  generarDatapoints() {
    const { data, balance, tiempo } = this.props;

    let labels = [];
    let datasets = [];
    let BalanceInicial = 0
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
      let balancePrimerMes = this.state.historyData[codigoMes].balanceini;
   
    
      balanceActual = parseFloat(balancePrimerMes)
      
      }


console.log(balanceActual)


const reversedArray = Object.entries(balancePorDia)
  .sort((a, b) => b[0] - a[0]) // Ordena de mayor a menor por clave
  .map(([key, value]) => value); // Mapea solo los valores

 console.log(reversedArray) 

 let balanceAcum = balanceActual
 let DataPoints = []

let limite = diasOrdenados.length

      diasOrdenados.forEach((dia,i) => {
  
     console.log(i)
let valorArestar = reversedArray[parseFloat(i-1)];
if(  i == 0){ 
  
}else
{
  balanceAcum -= valorArestar
}

console.log(balanceAcum)
   DataPoints.push(balanceAcum.toFixed(2))
   if(i==limite-1){
    let valorArestarfinal = reversedArray[parseFloat(i)];
    
    BalanceInicial =  balanceAcum -= valorArestarfinal
   }
  
      });
      console.log(DataPoints)

      labels = diasOrdenados.reverse().map((dia) => `${dia}`);
      datasets = DataPoints.reverse();
    }

    return { labels, datasets, BalanceInicial };
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
                        padding: 1,
                        font: {
                          size: 9,
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
                        display: false,
                        text: 'Importe total',
                        font: {
                          size: 13,
                        },
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
                  margin-top: 18px;
    padding-bottom: 11px;
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
