import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Pie, Line } from 'react-chartjs-2';
import {Chart} from"chart.js"
import 'chart.js/auto';
import Head from 'next/head';
import { io } from "socket.io-client";
//import TrendBox from './trendBox';

class purdata extends Component {

state={
  resData:"",
  ARIMA:0,
  indicesOperativos:50,
  iniciales:[],
  newIndex:[],
  identicalData:[],
  inidata:[],
  superdata:{
    labels:[],
    datasets: [
      {
        data:[]
      }
    ]
  },
  superRSIdata:{
    labels:[],
    datasets: [
      {
        data:[]
      }
    ]
  },
  superRSIdata2:{
    labels:[],
    datasets: [
      {
        data:[]
      }
    ]
  }
}
 calculateEMAWithTrend =(data, windowSize, threshold = 0.01)=> {
  if (data.length < windowSize) {
    console.log('No hay suficientes datos para calcular el EMA');
}

let alpha = 2 / (windowSize + 1);
let sma = data.slice(0, windowSize).reduce((acc, val) => acc + val, 0) / windowSize;
let emaPrev = sma;

// Calcular el EMA hasta el último valor
for (let i = windowSize; i < data.length; i++) {
    emaPrev = (data[i] * alpha) + (emaPrev * (1 - alpha));
}

// Determinar la tendencia comparando el último EMA con el penúltimo valor
let lastValue = data[data.length - 1];
let diff = lastValue - emaPrev;
let trend = 'neutro'; // Tendencia neutra por defecto

if (diff > threshold) {
    trend = 'alcista';
} else if (diff < -threshold) {
    trend = 'bajista';
}

return { ema: diff.toFixed(6), trend };
}
setterRSI = (indicesIniciales) =>{
  let indices=[0]
  let colores=["orange"]
  indicesIniciales.map((x,i)=>{
    
 
  
  
  })
let inidata = {
  labels: Array.from({ length: indicesIniciales.length+2 }, (v, k) => k + 1), 
 datasets: [{
    label: 'RSI DATA',
    data: indicesIniciales,
    fill: false,
    borderColor: 'grey',
    backgroundColor:colores,
    borderWidth:1,
    tension: 0.2,
    pointRadius:6,
  }]
}

return inidata
}

 TranformIndex=(indicesIniciales, inicial,iniColor)=>{

 
  let indices=[inicial]
 
  let colores=[iniColor]
  indicesIniciales.map((x,i)=>{
    
    
 
  
  let valorData = indices[i]
  if(x==1){
  colores.push("fuchsia")
  let newval = valorData-1
  indices.push(newval)
  }else if(x<2){
    colores.push("lightblue")
    let newval = valorData-1
    indices.push(newval)
  }
  
  else{
    let newval = valorData+1
   indices.push(newval)
   if(x>=2 && x<3){
    colores.push("green")
   }else if(x>=3 && x<10){
    colores.push("purple")
   }else if(x>=10 ){
    colores.push("fuchsia")
   }
  }
  
  
  })

  return{indices, colores}
 }

 setterData = (indicesIniciales, indicesTranformados) =>{
 
 
let iniIndex= indicesTranformados.indices[indicesTranformados.indices.length-indicesIniciales.length]

let iniColor =indicesTranformados.indices[indicesTranformados.colores.length-indicesIniciales.length]
let datos = this.TranformIndex(indicesIniciales, iniIndex,iniColor)
    
    let inidata = {
      labels: Array.from({ length: indicesIniciales.length +3 }, (v, k) => k + 1), 
     datasets: [{
        label: 'My First Dataset',
        data: datos.indices,
        fill: false,
        borderColor: 'grey',
        backgroundColor:datos.colores,
    
        borderWidth:1,
        tension: 0,
        pointRadius:6,
      }]
    }
    
   return inidata
}

 getColor = (x) =>{

  let nuevosColores=[]
  if(x==1){
    nuevosColores.push("fuchsia")

  }else if(x<2){
    nuevosColores.push("lightblue")

  }
  
  else{

   if(x>=2 && x<3){
    nuevosColores.push("green")
   }else if(x>=3 && x<10){
    nuevosColores.push("purple")
   }else if(x>=10 ){
    nuevosColores.push("fuchsia")
   }
  }

  return nuevosColores[0]
 }
AR= (data, order) => {
  const n = data.length;

  // Ajustar la validación para asegurar que hay suficientes datos
  if (n < order + 1) {
      throw new Error(`La longitud de los datos (${n}) debe ser mayor o igual que el orden AR más 1 (${order + 1}).`);
  }

  const X = [];
  const Y = data.slice(order); // Valores objetivo (predicciones)

  // Verificar la longitud de Y
  if (Y.length < 1) {
      throw new Error(`La longitud de la serie Y (${Y.length}) no es suficiente para continuar con la predicción.`);
  }

  // Construcción de la matriz X
  for (let i = 0; i < n - order; i++) {
      const row = [];
      for (let j = 0; j < order; j++) {
          row.push(data[i + j]);
      }
      X.push(row);
  }

  // Verificar la longitud de X
  if (X.length === 0 || X[0].length !== order) {
      throw new Error("La matriz X no tiene suficientes datos o no tiene la forma adecuada.");
  }

  // Calcular los coeficientes AR
  const XMatrix = math.matrix(X);
  const YMatrix = math.matrix(Y);

  // Validar que las matrices tengan dimensiones adecuadas
  if (XMatrix.size()[0] !== YMatrix.size()[0] || XMatrix.size()[1] === 0) {
      throw new Error("La matriz X no tiene suficientes datos para calcular los coeficientes AR.");
  }

  // Resolviendo XT * X * coef = XT * Y
  const XT = math.transpose(XMatrix);
  const XT_X = math.multiply(XT, XMatrix);
  const XT_Y = math.multiply(XT, YMatrix);

  // Resolver para los coeficientes
  const coefficients = math.lusolve(XT_X, XT_Y);

  // Predicción del siguiente valor basado en los últimos 'order' valores
  const lastValues = data.slice(-order);

  // Convertimos 'coefficients' a un array unidimensional para la multiplicación
  const coeffsArray = coefficients.map((row) => row[0]);
  const prediction = math.dot(coeffsArray, lastValues);

  return prediction;
}
MA= (data, windowSize) => {
  if (data.length < windowSize) {
      // Si hay menos datos que el tamaño de la ventana, retornar la media de todos los valores
      return data.reduce((acc, val) => acc + val, 0) / data.length;
  } else {
      // Calcular la media de los últimos 'windowSize' elementos
      const windowData = data.slice(data.length - windowSize);
      const prediction = windowData.reduce((acc, val) => acc + val, 0) / windowSize;
      return prediction;
  }
}


    componentDidMount(){
  /*
      let indicesIniciales =this.setterData(this.state.inidata)


      this.setState({
                      
                     superdata:indicesIniciales   
      
      })
*/

   const socket = io("http://localhost:5000");
   socket.on("ARIMA", (arg) => {
   
    let fixedArg = parseFloat(arg[0]).toFixed(2)
this.setState({ARIMA:fixedArg})
  });
  
  socket.on("inidata", (arg) => {
     // world
  });
  socket.on("finaldata", (arg) => {
    
  let igualarray = arg.reverse()
 
 // let sliceIndex= igualarray.slice(-(this.state.indicesOperativos))
 
let indicesTranformados =this.TranformIndex(igualarray, 0,"blue")

//let modifiedArg = igualarray.map(x=> x>10?10:x)
//let indicesIniciales =this.setterData(igualarray.slice(-this.state.indicesOperativos), indicesTranformados)
let indicesIniciales =this.setterData(igualarray, indicesTranformados)

let rsiData = this.calculateRSI(indicesIniciales.datasets[0].data, 14);
let rsiData2 = this.calculateRSI(igualarray, 14);
let newArrRSI = this.setterRSI(rsiData)
let newArrRSI2 = this.setterRSI(rsiData2)

this.setState({

           
                inidata:igualarray,
              
               superdata:indicesIniciales,
              superRSIdata:newArrRSI,   
              superRSIdata2:newArrRSI2


})

    
  });

  socket.on("newindex", (arg) => {
    this.setState({loadingData:true})
    let igualarg = arg
    let tempVar = this.state.inidata.slice()

  tempVar.push(arg)
  let superData = this.state.superdata.datasets[0].data.slice()
  let superColor = this.state.superdata.datasets[0].backgroundColor.slice()

 
  let ultimovalor=igualarg>=2?1:-1
 
  let ultimodatoTransformado= superData[superData.length -1]
  let newval = ultimodatoTransformado +ultimovalor

  superData.push(newval)
  superColor.push(this.getColor(igualarg))



  let newEstate = {
    labels: Array.from({ length: superData.length +3 }, (v, k) => k + 1), 
   datasets: [{
      label: 'My First Dataset',
      data: superData,
      fill: false,
      borderColor: 'grey',
      backgroundColor:superColor,
  
      borderWidth:1,
      tension: 0,
      pointRadius:5,
    }]
  }


  

 

 
 // let modifiedArg = tempVar.map(x=> x>10?10:x)



  let rsiData = this.calculateRSI(superData, 14);


  let newArrRSI = this.setterRSI(rsiData)
 
    this.setState({
      inidata:tempVar,
     superdata:newEstate,
     superRSIdata:newArrRSI,
  
    loadingData:false
})
  });
  



    }
    calculateRSI =(data, period = 14) =>{
      let gains = [];
      let losses = [];
  
      for (let i = 1; i < data.length; i++) {
          let difference = data[i] - data[i - 1];
          if (difference > 0) {
              gains.push(difference);
              losses.push(0);
          } else {
              gains.push(0);
              losses.push(Math.abs(difference));
          }
      }
 
      let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
      let rsiArray = [];
      let rs = avgGain / avgLoss;
      let rsi = 100 - (100 / (1 + rs));
      rsiArray.push(rsi);
  
      // Cálculo del RSI para cada periodo sucesivo
      for (let i = period; i < data.length; i++) {
          let gain = gains[i] || 0;
          let loss = losses[i] || 0;
  
          avgGain = ((avgGain * (period - 1)) + gain) / period;
          avgLoss = ((avgLoss * (period - 1)) + loss) / period;
  
          rs = avgGain / avgLoss;
          rsi = 100 - (100 / (1 + rs));
  
          rsiArray.push(rsi);
      }
  
      return rsiArray;
  }
    detectPeaks=(data, threshold = 1 )=> {
      let peaks = [];

      for (let i = 1; i < data.length - 1; i++) {
          // Detectar resistencias (máximos) con diferencia de 1
          if ((data[i] - data[i - 1] >= threshold) && (data[i] - data[i + 1] >= threshold)) {
              peaks.push({ type: 'resistencia', index: i, value: data[i] });
          }
          // Detectar soportes (mínimos) con diferencia de 1
          else if ((data[i - 1] - data[i] >= threshold) && (data[i + 1] - data[i] >= threshold)) {
              peaks.push({ type: 'soporte', index: i, value: data[i] });
          }
      }
      return peaks;
  }
  detectSupportResistance= (peaks)=> {
    let peakCounts = {};

    peaks.forEach(peak => {
        // Crear una clave única basada en 'type' y 'value'
        const key = `${peak.type}-${peak.value}`;

        // Si ya existe la clave, incrementar el contador
        if (peakCounts[key]) {
            peakCounts[key].count += 1;
        } else {
            // Si no existe, inicializar con count en 1 y guardar el 'type' y 'value'
            peakCounts[key] = { type: peak.type, value: peak.value, count: 1 };
        }
    });

    return Object.values(peakCounts).filter(peak=> peak.count >= 2);
   

    
}

     calcularPendienteEdit=(data)=> {
      const n = data.length;
      const x = Array.from({ length: n }, (_, i) => i); // Índices 0, 1, 2, ..., n-1
      let newData= data.map(x=> x>10?10:x)
    
      const sumX = x.reduce((acc, val) => acc + val, 0);
      const sumY = newData.reduce((acc, val) => acc + val, 0);
      const sumXY = newData.reduce((acc, val, i) => acc + x[i] * val, 0);
      const sumX2 = x.reduce((acc, val) => acc + val ** 2, 0);
  
      const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
 
      return m
  }
  calcularPendiente=(data, )=> {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i); // Índices 0, 1, 2, ..., n-1

    const sumX = x.reduce((acc, val) => acc + val, 0);
    const sumY = data.reduce((acc, val) => acc + val, 0);
    const sumXY = data.reduce((acc, val, i) => acc + x[i] * val, 0);
    const sumX2 = x.reduce((acc, val) => acc + val ** 2, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
   
    return (m) // Si la pendiente es menor que el umbral, considerarla como 0 (neutra)
}
getLineStyle=(value, levels)=> {
  const level = levels.find(l => Math.abs(l.value - value) <= 0.1);
  if (level) {
      if (level.type === 'soporte') {
          // Soporte: Verde
          if (level.count === 2) {
              return { color: 'rgb(0, 255, 0)', width: 4 }; // Verde intenso y grosor 4
          } else if (level.count >= 3) {
              return { color: 'rgb(102, 255, 102)', width: 3 }; // Verde menos intenso y grosor 3
          }
      } else if (level.type === 'resistencia') {
          // Resistencia: Rojo
          if (level.count === 2) {
              return { color: 'rgb(255, 0, 0)', width: 4 }; // Rojo intenso y grosor 4
          } else if (level.count >= 3) {
              return { color: 'rgb(255, 102, 102)', width: 3 }; // Rojo menos intenso y grosor 3
          }
      }
  }
  return { color: 'rgba(75, 192, 192, 1)', width: 2 }; // Color y grosor por defecto
}
    render() {
      const yellowLinePlugin = {
        id: 'yellowLinePlugin',
        afterEvent: (chart, args) => {
            const {ctx, tooltip} = chart;
    
            // Si el tooltip está activo y está mostrando un punto específico
            if (tooltip._active && tooltip._active.length) {
                const activePoint = tooltip._active[0];
                const y = activePoint.element.y;
    
                // Limpiar el canvas y dibujar la línea horizontal
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(chart.chartArea.left, y);
                ctx.lineTo(chart.chartArea.right, y);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'yellow';
                ctx.stroke();
                ctx.restore();
            } else {
                // Si el cursor no está sobre un punto, limpia el gráfico para ocultar la línea
                chart.draw();
            }
        },
    };


      console.log(this.state)
      let dataLength = this.state.superdata.datasets[0].data.length;
      let indicesOperativos = this.state.indicesOperativos;
      
      // Determinar cuántos elementos tomar (el mínimo entre indicesOperativos y dataLength)
      let sliceCount = Math.min(indicesOperativos, dataLength);
      
      // Obtener los últimos datos
      let recentData = this.state.superdata.datasets[0].data.slice(-sliceCount);
      
      // Calcular getmin y getmax
      let getmin = Math.min(...recentData) - 3;
      let getmax = Math.max(...recentData) + 2;
   
      let LineOptions ={
        animation: {
          duration: 1000,  // Duración de la animación en milisegundos
          easing: 'linear', // Estilo de animación lineal para suavizar
      },
        responsive: true, 
        maintainAspectRatio: false, 
        scales: {
          y:{
              beginAtZero:true,
              ticks: {
                stepSize: 1,  // Si también quieres que haya líneas cada nivel en el eje Y
            },
            min: getmin, // Ajusta el mínimo para hacer espacio debajo del último valor
            max: getmax, // Ajusta el máximo para hacer espacio arriba si lo deseas

           
          },
          x:{
            min: Math.max(
              0,
              this.state.superdata.datasets[0].data.length - this.state.indicesOperativos
            ),
            max: this.state.superdata.datasets[0].data.length + 5, // Ajusta el máximo para hacer espacio arriba si lo deseas
            ticks: {
              font: {
                  size: 8, // Tamaño de fuente constante para prueba
              },
              color: 'black', // Cambia a un color visible para verificar
          }
          },
       
        },
      

        plugins: {
          tooltip: {
              mode: 'nearest', // Modo de interacción
              intersect: false // Permite mostrar el tooltip al acercarse a un punto
          }
      },
      interaction: {
          mode: 'nearest', // Modo de interacción
          intersect: false // Permite mostrar la interacción sin intersectar directamente un punto
      }


        
      
      }
   
      const peaks = this.detectPeaks(this.state.superdata.datasets[0].data);
   
      
      const levels = this.detectSupportResistance(peaks);
   
      let ColorLinea =""
      let ultimoElemento =  this.state.superdata.datasets[0].data[this.state.superdata.datasets[0].data.length - 1];
      let peniultimoElemento =  this.state.superdata.datasets[0].data[this.state.superdata.datasets[0].data.length - 2];
      let PosicionLinea = levels.filter(x=> x.value==ultimoElemento)
      if(PosicionLinea){
        let Formallegada = ultimoElemento > peniultimoElemento?"subiendo":"bajando"

        for(let x=0;x<PosicionLinea.length;x++){
       
          if(PosicionLinea[x].type=="resistencia" && Formallegada == "subiendo"){
            LineOptions.scales.y.grid = {
                                        color: (ctx)=>ctx.tick.value == ultimoElemento?"red":"",
                                        lineWidth:()=>{
                                          if(PosicionLinea[x].count == 2){
                                            return 4
                                          }else if(PosicionLinea[x].count == 3){
                                            return 3
                                          }else if(PosicionLinea[x].count == 4){
                                            return 2
                                          }else if(PosicionLinea[x].count >= 5){
                                            return 1
                                          }
                                        }
                                      }
                                     
          }else if(PosicionLinea[x].type=="soporte" && Formallegada == "bajando"){
            
            LineOptions.scales.y.grid = {
              color: (ctx)=>ctx.tick.value == ultimoElemento?"green":"",
              lineWidth:()=>{
                if(PosicionLinea[x].count == 2){
                  return 4
                }else if(PosicionLinea[x].count == 3){
                  return 3
                }else if(PosicionLinea[x].count == 4){
                  return 2
                }else if(PosicionLinea[x].count >= 5){
                  return 1
                }
              }
             
            }
          }
        }
      }
      let Labels = []
let indicesRender = this.state.inidata.map((value,i)=>{

  return(
    <div style={{margin:"5px"}}> {value}</div>
  )
})
       let   superdata = {
        labels:Labels,
        datasets: this.state.indices
    }
    const orderAR = 2; 

   //let prediccionAR =  this.AR(this.state.inidata,2)
    //let predicionARIMA = this.calcularArima(this.state.inidata)
    let prediccionMA =  this.MA(this.state.inidata,15).toFixed(2)
    
    let pendiente = this.calcularPendiente(this.state.inidata).toFixed(6);;
    let pendienteConUmbral = (Math.abs(pendiente) < 0.001 ? 0 : pendiente)
    const pendienteEdit = this.calcularPendienteEdit(this.state.inidata).toFixed(6);
    let pendienteEditConUmbral = (Math.abs(pendienteEdit) < 0.001 ? 0 : pendienteEdit);
    
    let pendienteEstadistica = this.calcularPendiente(this.state.superdata.datasets[0].data);
    let pendienteSuperDataUmbral = (Math.abs(pendienteEstadistica) < 0.001 ? 0 : pendienteEstadistica);
let PendienteRender = pendienteConUmbral > 0?  'Alcista' : 
                      pendienteConUmbral < 0 ? 'Bajista' : 
                      'Neutra'
let PendienteRenderEdit = pendienteEditConUmbral > 0?  'Alcista' : 
                          pendienteEditConUmbral < 0 ? 'Bajista' : 
                          'Neutra'
  let PendienteRendersuperdata = pendienteSuperDataUmbral > 0?  'Alcista' : 
                                  pendienteSuperDataUmbral < 0 ? 'Bajista' : 
                                    'Neutra'


                                    const resultEMA = this.calculateEMAWithTrend(this.state.inidata, 5 );
                                    const resultEMASuperData = this.calculateEMAWithTrend(this.state.superdata.datasets[0].data, 8);

          return(
            <div className='mainGrafic' style={{marginTop:"15vh"}}>
             <p>Bienvenidos</p>
          
            <div className='contindexes'>
            <p> Operando con </p>
            <div className='contInput'>
              <input type='number' value={this.state.indicesOperativos}
              onChange={(e)=>{
                const max = this.state.superdata.datasets[0].data.length -1
                let value 
                if (parseInt(e.target.value) > max) {
                  value= max;  // Si lo es, establece el valor máximo permitido
                }else{
                  value =parseInt(e.target.value) 
                }
                this.setState({indicesOperativos:value})
              
              
              }}
              max={this.state.superdata.datasets[0].data.length -1}
              />

              </div>
<p>de {this.state.inidata.length }  indices totales </p>
            </div>
            
             <div className='contLineas'>
             <div style={{ height: '350px', width: '100%' }}>
             <Line data={this.state.superdata} 
              plugins = {[yellowLinePlugin]}
             
options = {LineOptions}
 />
 </div>
 </div>
 <div className='contLineas2'>
 <Line data={this.state.superRSIdata} 
options={{
  responsive: true, 
        maintainAspectRatio: false, 
  scales: {
    y: {
        min: 0,
        max: 100,
        title: {
            display: true,
            text: 'RSI'
        },
        ticks: {
            stepSize: 10  // Intervalo de las marcas en el eje Y
        },
        grid: {
            drawBorder: true,
            color: function(context) {
                // Dibujar líneas de sobrecompra y sobreventa
                if (context.tick.value === 70) {
                    return 'red';  // Línea de sobrecompra
                } else if (context.tick.value === 30) {
                    return 'green';  // Línea de sobreventa
                }
                return 'rgba(0, 0, 0, 0.1)';  // Otras líneas
            },
            lineWidth: function(context) {
                // Ajustar el ancho de las líneas de sobrecompra y sobreventa
                if (context.tick.value === 70 || context.tick.value === 30) {
                    return 2;
                }
                return 1;  // Ancho de otras líneas
            }
        }
    },
    x: {
      min: this.state.superdata.datasets[0].data.length - this.state.indicesOperativos , // Ajusta el mínimo para hacer espacio debajo del último valor
      max: this.state.superdata.datasets[0].data.length + 5, // Ajusta el máximo para hacer espacio arriba si lo deseas

        title: {
            display: true,
            text: 'Data Points'
        }
    }
},
plugins: {
    legend: {
        display: true,
        position: 'top'
    }

}}
}
 />
 </div>


 <div className='contDatos'>
             {indicesRender}
             </div>

     <style jsx>    {`
     .contLineas{
            width: 90vw;
    margin-left: 5vw;


     }
       .contLineas2{
            width: 90vw;
    margin-left: 5vw;
    height: 300px;

     }
    .contDatos{
    display:flex;
    flex-wrap:wrap;
    }

.contindexes{
display: flex;
    margin-top: 20px;
    justify-content: space-around;

    border-radius: 5px;
}
.contindexes input{
    width: 50px;
    text-align: center;
    border-radius: 20px;
    padding: 2px;
    border-bottom: 2px solid blue;
}


     `}

     </style>
            </div>

          )

    }


}



const mapStateToProps = state => {


    return {state}
  };
  
  
  export default connect(mapStateToProps)(purdata)