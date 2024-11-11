import React, { Component } from 'react'
import { Pie, Line } from 'react-chartjs-2';
import {Chart} from"chart.js"
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';


class Stats extends Component {
    state={
        Ingreso:true,
        Gasto:false,
        excluidos:[]

    }

    componentDidMount(){
     
     
  
        }

        filtrarVentasUnicasPorNota=(registros)=> {
            const ventasFiltradas = [];
            const numerosVentaUnicos = new Set();
          
            registros.forEach((registro) => {
              const match = registro.Nota.match(/Venta N°(\d+)/);
              if (match) {
                const numeroVenta = match[1];
          
                // Solo agregamos el registro si el número no ha sido registrado antes
                if (!numerosVentaUnicos.has(numeroVenta)) {
                  numerosVentaUnicos.add(numeroVenta);
                  ventasFiltradas.push(registro);
                }
              }
            });
          
            return ventasFiltradas;
          }

          render() {
    
            let superdata = {labels: [],
                datasets: [{
                   label: '',
                   data: [],
                } ]  }
      //      let catInventario = this.state.CategoriaElegida.idCat == 5?true:false
            let DetallesPorrender = this.props.data
        
            let toggleObjeto =(array, objeto)=> {
                const index = array.findIndex(item => item._id === objeto._id);
              
                if (index !== -1) {
                  // Si el objeto existe, lo eliminamos
                  array.splice(index, 1);
                } else {
                  // Si no existe, lo agregamos
                  array.push(objeto);
                }
                return array
              }

              let ingresosTotales = 0;
let gastosTotales = 0;
              
                


                
let activeB = this.state.Ingreso?"activeB":""
        let deactiveB = this.state.Gasto?"deactiveB":""
        
console.log(this.state)
        let datoTouP =[]
        if(this.props.data.length>0){
           
       // Arrays para acumular las categorías de ingreso y gasto
const categoriasIngreso = [];
const categoriasGasto = [];

let Colores = [
    "#66CC99", // Verde menta
    "#FF6B6B", // Rojo coral fuerte
    "#FF8A33", // Naranja cálido
    "#FFD93D", // Amarillo intenso
    "#6BCB77", // Verde brillante
 
    "#8A5FFF", // Morado vivo
    "#FF5D8F", // Rosa fuerte
    "#4DD2FF", // Turquesa claro
    "#FF914D", // Naranja profundo
    "#FFD36E", // Dorado cálido
    "#5C80BC", // Azul medio
    "#B15DFF", // Púrpura brillante
    "#FF6DAA", // Rosa encendido
    "#7AD7F0", // Cian claro
    "#FF7878", // Rojo fresa claro
    "#FFA07A", // Salmón
    "#668FFF", // Azul cielo medio

    "#FF9F9F", // Rosa suave
    "#4DC9E0", // Azul turquesa
    "#FFA860", // Naranja pastel fuerte
    "#FFD700", // Amarillo dorado
    "#FFC0CB", // Rosa
    "#20B2AA", // Verde mar claro
    "#FF4500", // Naranja rojo
    "#32CD32", // Verde lima
    "#1E90FF", // Azul dodger
    "#FF69B4", // Rosa caliente
    "#FFB6C1", // Rosa claro
   
    "#FF6347", // Tomate
    "#FFF8DC", // Maíz
    "#ADFF2F", // Verde amarillo
    "#8B4513", // Marrón
    "#DEB887", // Beige
    "#D2691E", // Chocolate
    "#B8860B", // Amarillo oscuro
    "#A0522D", // Marrón rojizo
    "#DAA520", // Amarillo dorado
    "#7FFF00", // Verde chartreuse
    "#FF1493", // Rosa profundo
    "#CD5C5C", // Rojo indio
    "#FFDAB9", // Durazno
    "#D8BFD8", // Orquídea pálido
    "#DCDCDC", // Gris claro
    "#F08080", // Rojo claro
    "#E6E6FA", // Lavanda
    "#FFF0F5", // Lava
]
// Variables para el total de ingresos y gastos


// Objeto para almacenar categorías y evitar duplicados
const categoriasMap = {};

// Iterar sobre los detalles
let segundoCont = 0
for (let z = 0; z < DetallesPorrender.length; z++) {
 
    let registro = DetallesPorrender[z];
    let cat = registro.CatSelect;
    let accion = registro.Accion;
    let importe = registro.Importe;
  
    // Identificador único de la categoría
    const catId = cat._id;
  
    // Si la categoría aún no existe en el mapa, inicialízala con los campos requeridos
    if (!categoriasMap[catId]) {
   
        categoriasMap[catId] = {
            idCat: cat.idCat,
            nombreCat: cat.nombreCat,
            totalImporte: 0,
            porcentaje: 0,
            _id: cat._id,
            Color:Colores[segundoCont]
        };
        segundoCont ++
    }

    // Sumar el importe a la categoría
    categoriasMap[catId].totalImporte += importe;

    // Dependiendo de la acción, agregar la categoría al array correspondiente y sumar el importe
    if (accion === "Ingreso") {
        const RegistroFilterCat = this.state.excluidos.find(obj => obj._id === registro.CatSelect._id);
        if (!RegistroFilterCat) {
            ingresosTotales += importe;
        }
     
        // Verificar si ya está en el array de categorías de ingreso, si no, agregarla
        if (!categoriasIngreso.some(c => c._id === cat._id)) {
            categoriasIngreso.push(categoriasMap[catId]);
        }
    } else if (accion === "Gasto") {
        const RegistroFilterCat = this.state.excluidos.find(obj => obj._id === registro.CatSelect._id);
        if (!RegistroFilterCat) {
            gastosTotales += importe;
        }
       

        // Verificar si ya está en el array de categorías de gasto, si no, agregarla
        if (!categoriasGasto.some(c => c._id === cat._id)) {
            categoriasGasto.push(categoriasMap[catId]);
        }
    }
    
}
// Calcular el porcentaje de cada categoría respecto al total de ingresos o gastos
categoriasIngreso.forEach(cat => {
    cat.porcentaje = ingresosTotales > 0 ? (cat.totalImporte / ingresosTotales) * 100 : 0;
});

categoriasGasto.forEach(cat => {
    cat.porcentaje = gastosTotales > 0 ? (cat.totalImporte / gastosTotales) * 100 : 0;
});
// Mostrar el resultado con las categorías separadas en ingresos y gastos
  

if(this.state.Ingreso){
   datoTouP = categoriasIngreso
  }else if(this.state.Gasto){
    datoTouP = categoriasGasto
  }




  for (let i = 0; i < datoTouP.length; i++) {
    const objetoConCategoriaN = this.state.excluidos.find(obj => obj._id === datoTouP[i]._id);
    if (objetoConCategoriaN) {
        datoTouP[i].excluido = true;
        datoTouP[i].porcentaje = 0;
    }
}

let graficData = datoTouP.filter(elem => 
    !this.state.excluidos.some(excluido => excluido._id === elem._id)
);
superdata = {
    labels: graficData.map(x=>x.nombreCat),
    datasets: [
        {label: 'asd',
        data:graficData.map(x=>x.totalImporte),
        backgroundColor:graficData.map(x=>x.Color),
        borderWidth: 1,
      }
    ]
}

        }
let stats = ""
        if(datoTouP.length >0){
            stats = datoTouP.sort((a, b) => b.totalImporte - a.totalImporte).map((item, i)=>{
                let excluido = item.excluido?"excluido":""
                let bcolor = item.Color
                return(<div className="crystal-rectangle" key={i} onClick={(e)=>{    
                  e.stopPropagation();
                  this.props.sendData(item)}}
                  
                  
                  >
                    <div className="contpercent" >
                        <div className="percent"
                         onClick={(e)=>{
                          e.stopPropagation();
                        
                          let filterCats= toggleObjeto(this.state.excluidos, item)
                  
                          this.setState({excluidos:filterCats})
                        
                      }}
                        
                        style={{background:bcolor}}>{item.porcentaje.toFixed(2)}%</div>
                        <div className={`npercent ${excluido} `}  >{item.nombreCat}</div>
        
                    </div>
                    <div className="contvalores">${item.totalImporte.toFixed(2)}</div>
                </div>)
             }) 
        }
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    backgroundColor: 'white',
                    formatter: (value, ctx) => {
                        const sum = ctx.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value * 100) / sum).toFixed(0) + '%';
                        return percentage;
                    },
                    color: 'black',
                    borderRadius: 25,
                    padding: 5,
                    font: {
                        size: '15px',
                        weight: 'bold'
                    }
                }
            },
            elements: {
                arc: {
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            },
            cutoutPercentage: 40,
            rotation: Math.PI, // Rotar el gráfico
            animation: {
                animateRotate: true,
                animateScale: true
            },
            perspective: 200 // Ajustar la perspectiva
        };
return(
<div>
<div className="inggasCont">
          <span className={`base ${activeB} `} onClick={()=>{this.setState({Ingreso:true, Gasto:false,excluidos:[] })}}>   <div className="asd">Ingreso</div> ${ingresosTotales.toFixed(2)}</span>
          <span style={{fontSize:"40px"}}>|</span>
          <span className={`base ${deactiveB} `} onClick={()=>{this.setState({Gasto:true, Ingreso:false,excluidos:[]})}} > <div className="asd">Gasto</div> ${gastosTotales.toFixed(2)}</span>
          <span style={{fontSize:"40px"}}>|</span>
          <span className={` baset`}  > <div className="asd">Total</div> ${(ingresosTotales - gastosTotales).toFixed(2)}</span>
  </div>
  <div className="centrar contMainDataChart">
  <div className="cont-Prin">
  <Pie data={superdata} plugins={[ChartDataLabels]} options={options} />
  </div>
<div className="contStatics">
    {stats}
</div>
  </div>
  <style jsx >
                {                                
                `
 .baset{
                    margin-top:8px;
                background-color: #f5f5f5; /* Gris claro neutro */
  color: #333333; /* Gris oscuro para el texto */
  font-size: 18px;
  font-weight: 500;
  padding: 10px 20px;
  border: 1px solid #dcdcdc; /* Borde suave */
  border-radius: 6px;
  
  transition: background-color 0.3s, box-shadow 0.3s; /* Suave transición */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05); /* Sombra sutil */
                  }

 .base{
                  margin-top:8px;
                  transition: 1s;
                  cursor: pointer;
                  border: 1px solid;
                 
                  border-radius: 17px;
                  box-shadow: inset 1px -1px 1px black;
                  min-width: 125px;
                  display: flex;
                  flex-flow: column;
                  justify-content: center;
                  align-items: center;              
                  }

                 .inggasCont{
                    display: flex;
                      width: 100%;
                      justify-content: space-around;
                      padding: 5px;
                      font-size: 17px;
                      flex-wrap: wrap;
                      border-radius: 11px;
                  }
                      /* Contenedor principal de cada elemento */
.crystal-rectangle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 80px;
    margin: 10px;
    padding: 10px;
    background-color: #f4f4f4; /* Fondo general */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
}

.crystal-rectangle:hover {
    transform: scale(1.05); /* Efecto de agrandamiento al pasar el ratón */
}

/* Contenedor para el porcentaje y el nombre de la categoría */
.contpercent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 5px;
}

/* Estilo para el porcentaje */
.percent {
    display: inline-block;
    padding: 5px;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
}

/* Clase adicional para la categoría excluida */
.npercent.excluido {
    text-decoration: line-through;
    opacity: 0.6;
    color: #888;
}

/* Nombre de la categoría */
.npercent {
    font-size: 14px;
    color: #333;
    margin-left: 10px;
    font-weight: 500;
}

/* Contenedor para el valor en dólares */
.contvalores {
    font-size: 16px;
    font-weight: bold;
    color: #4CAF50; /* Verde oscuro para resaltar */
    margin-top: 5px;
}

                
                ` }
                </style>
</div>

)
       


          }

}


export default Stats;