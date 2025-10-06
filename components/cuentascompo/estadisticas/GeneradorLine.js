import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';

class Stats extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const { data, criterio, tiempo } = this.props;



    let labels = [];
    let datasets = [];
    
    let Colores = [
      '#FF5733', // Rojo vivo
      '#33FF57', // Verde lima
      '#3357FF', // Azul intenso
      '#FF33A8', // Rosa brillante
      '#A833FF', // Morado vibrante
      '#33FFF2', // Cian claro
      '#FFD133', // Amarillo dorado
      '#8CFF33', // Verde neón
      '#FF338C', // Fucsia fuerte
      '#33A8FF', // Azul cielo
      '#FF8C33', // Naranja cálido
      '#33FFD1', // Turquesa eléctrico
      '#A8FF33', // Verde fluorescente
      '#8C33FF', // Violeta eléctrico
      '#FF33FF', // Magenta puro
      '#33FF8C', // Verde agua
      '#57FF33', // Verde primavera
      '#5733FF', // Azul púrpura
      '#FF33D1', // Magenta pastel
      '#D1FF33', // Amarillo pastel
      '#33D1FF', // Azul celeste
      '#FF8CD1', // Rosa suave
      '#8CD1FF', // Azul perla
      '#D1FF8C', // Verde musgo
      '#8CD1D1', // Cian grisáceo
      '#D18CFF', // Lavanda brillante
      '#8CD18C', // Verde oliva claro
    ];
    
    // Generación de etiquetas y datos
    if (tiempo === 'diario') {
      data.forEach((item) => {
        const time = new Date(item.Tiempo);
        const label = time.getHours();
        if (!labels.includes(label)) {
          labels.push(label); // Añadir solo horas con datos
        }
      });
    } else if (tiempo === 'mensual' || tiempo === 'periodo') {
      data.forEach((item) => {
        const time = new Date(item.Tiempo);
        const label = time.getDate();
        if (!labels.includes(label)) {
          labels.push(label); // Añadir solo días con datos
        }
      });
     
    }
    labels.sort((a, b) => a - b);
    // Estructuración de los datos
    const groupedByCategory = {};
    const groupedByCuentas = {};
    if(criterio == "categorias"){

let filteredData = data.filter(x=>x.Accion != "Trans")

filteredData.forEach((item) => {
      const categoryId = item.CatSelect._id;
      if(!groupedByCategory[categoryId]) {
        groupedByCategory[categoryId] = {
          label: item.CatSelect.nombreCat,
          data: new Array(labels.length).fill(0), // Inicializamos con 0 en todas las etiquetas
          borderColor: Colores[Object.keys(groupedByCategory).length % Colores.length],
          backgroundColor: Colores[Object.keys(groupedByCategory).length % Colores.length],
          pointBackgroundColor: Colores[Object.keys(groupedByCategory).length % Colores.length],
          pointBorderColor: '#000',
          tension: 0.2,
          fill: false,
        };
      }

      const time = new Date(item.Tiempo);
      const labelinside = tiempo === 'diario' ? time.getHours() : time.getDate();
      if (labels.includes(labelinside)) {
        const index = labels.indexOf(labelinside);
      
        // Evaluar si la acción es "Ingreso" o "Gasto"
        if (item.Accion === 'Ingreso') {
          groupedByCategory[categoryId].data[index] += item.Importe; // Sumar el Importe
        } else if (item.Accion === 'Gasto') {
          groupedByCategory[categoryId].data[index] -= item.Importe; // Restar el Importe
        }
      }
    });


    // Calcular el importe total por categoría
    const categoryTotals = Object.values(groupedByCategory).map((category) => {
      const totalImporte = category.data.reduce((acc, value) => acc + value, 0);
      return { ...category, totalImporte };
    });

    // Ordenar las categorías de mayor a menor por importe total
    categoryTotals.sort((a, b) => b.totalImporte - a.totalImporte);

    // Convertir a array de datasets y ordenar
     datasets = categoryTotals.map((category, index) => {
      return {
        ...category,
        hidden: ![0, 1, 2].includes(index), // Solo las 3 primeras activas
      };
    });
     }else if(criterio == "cuentas"){
      console.log(data)
        data.forEach((item) => {

     
          let colorIndex = 0; // Índice global para los colores
          if (item.Accion === "Trans") {
            const categoryId = item.CuentaSelec.idCuenta;
            const categoryId2 = item.CuentaSelec2.idCuenta;
          
            if (!groupedByCuentas[categoryId]) {
              groupedByCuentas[categoryId] = {
                label: item.CuentaSelec.nombreCuenta,
                data: new Array(labels.length).fill(0), // Inicializamos con 0 en todas las etiquetas
                borderColor: Colores[colorIndex + Object.keys(groupedByCuentas).length % Colores.length],
                backgroundColor: Colores[colorIndex + Object.keys(groupedByCuentas).length % Colores.length],
                pointBackgroundColor: "white",
                pointBorderColor: '#000',
                tension: 0.2,
                fill: false,
              };
              colorIndex++; // Incrementamos el índice de colores
            }
          
            if (!groupedByCuentas[categoryId2]) {
              groupedByCuentas[categoryId2] = {
                label: item.CuentaSelec2.nombreCuenta,
                data: new Array(labels.length).fill(0), // Inicializamos con 0 en todas las etiquetas
                borderColor: Colores[colorIndex + Object.keys(groupedByCuentas).length % Colores.length],
                backgroundColor: Colores[colorIndex + Object.keys(groupedByCuentas).length % Colores.length],
                pointBackgroundColor: "white",
                pointBorderColor: '#000',
                tension: 0.2,
                fill: false,
              };
              colorIndex++; // Incrementamos el índice de colores
            }
          
            const time = new Date(item.Tiempo);
            const labelinside = tiempo === 'diario' ? time.getHours() : time.getDate();
            if (labels.includes(labelinside)) {
              const index = labels.indexOf(labelinside);
          
              groupedByCuentas[categoryId].data[index] -= item.Importe;
              groupedByCuentas[categoryId2].data[index] += item.Importe;
            }
          }else{

            const categoryId = item.CuentaSelec.idCuenta;

                 if (!groupedByCuentas[categoryId]) {
                      groupedByCuentas[categoryId] = {
                        label: item.CuentaSelec.nombreCuenta,
                        data: new Array(labels.length).fill(0), // Inicializamos con 0 en todas las etiquetas
                        borderColor: Colores[Object.keys(groupedByCuentas).length % Colores.length],
                        backgroundColor: Colores[Object.keys(groupedByCuentas).length % Colores.length],
                        pointBackgroundColor: "white",
                        pointBorderColor: '#000',
                        tension: 0.2,
                        fill: false,
                      };
                      colorIndex ++
                    }

      const time = new Date(item.Tiempo);
      const labelinside = tiempo === 'diario' ? time.getHours() : time.getDate();
      if (labels.includes(labelinside)) {
        const index = labels.indexOf(labelinside);
      
        // Evaluar si la acción es "Ingreso" o "Gasto"
        if (item.Accion === 'Ingreso') {
          groupedByCuentas[categoryId].data[index] += item.Importe; // Sumar el Importe
        } else if (item.Accion === 'Gasto') {
          groupedByCuentas[categoryId].data[index] -= item.Importe; // Restar el Importe
        }
      }



          }

        })

        console.log(groupedByCuentas)
    // Calcular el importe total por categoría
    const cuentasTotals = Object.values(groupedByCuentas).map((cuentas) => {
      const totalImporte = cuentas.data.reduce((acc, value) => acc + value, 0);
      return { ...cuentas, totalImporte };
    });

    
    // Ordenar las categorías de mayor a menor por importe total
    cuentasTotals.sort((a, b) => b.totalImporte - a.totalImporte);

    datasets = cuentasTotals.map((cuentas, index) => {
      return {
        ...cuentas,
        hidden: ![0, 1, 2].includes(index), // Solo las 3 primeras activas
      };
    });


     }




    return (
      <div className="centrar contMainDataChart">
        <Line
          data={{
            labels,
            datasets,
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

export default Stats;
