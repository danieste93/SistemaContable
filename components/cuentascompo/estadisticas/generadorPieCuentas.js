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

        

          render() {
 
    let objetData =[]
            let superdata = {labels: [],
                datasets: [{
                   label: '',
                   data: [],
                } ]  }
      //      let catInventario = this.state.CategoriaElegida.idCat == 5?true:false
            let DetallesPorrender = this.props.data
            
        
            let toggleObjeto =(array, objeto)=> {
                const index = array.findIndex(item => item.Tipo=== objeto.Tipo);
              
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
        

        let datoTouP =[]
        if(this.props.data.length>0){
           
       // Arrays para acumular las categorías de ingreso y gasto
const categoriasIngreso = [];
const categoriasGasto = [];

let Colores = [
    "#57A773", // Verde bosque suave
    "#E63946", // Rojo intenso
    "#F4A261", // Naranja arena
    "#F7B801", // Amarillo brillante
    "#379683", // Verde agua profundo

    "#6A4C93", // Morado oscuro
    "#FF3E96", // Rosa fucsia
    "#2EC4B6", // Turquesa marino
    "#E76F51", // Naranja terracota
    "#F4D06F", // Amarillo crema
    "#3D5A80", // Azul océano
    "#9C51E0", // Púrpura lavanda
    "#FA7268", // Rosa coral suave
    "#81E6D9", // Cian hielo
    "#E63975", // Rojo frambuesa
    "#FFA07A", // Melocotón claro
    "#5A9FD4", // Azul niebla

    "#E4A8A8", // Rosa pastel vintage
    "#56B4D3", // Azul caribe
    "#F48C06", // Naranja caramelo
    "#FFD700", // Amarillo oro puro
    "#FFB5C5", // Rosa bailarina
    "#10AC84", // Verde esmeralda
    "#FF2400", // Rojo escarlata
    "#28A745", // Verde brillante
    "#1565C0", // Azul real
    "#FF77AA", // Rosa burbuja
    "#FFC1CC", // Rosa algodón de azúcar

    "#FA8072", // Coral salmón
    "#FFFACD", // Limón claro
    "#BFFF00", // Verde ácido
    "#8B3A3A", // Marrón teja
    "#BC8F8F", // Marrón rosado
    "#8B4513", // Tierra quemada
    "#8B0000", // Rojo oscuro
    "#CC7722", // Ocre
    "#FFA400", // Naranja vibrante
    "#9AFF99", // Verde lima pastel
    "#FF1493", // Rosa eléctrico
    "#DC143C", // Carmesí profundo
    "#FFE4C4", // Beige almendra
    "#DA70D6", // Orquídea
    "#B0B0B0", // Gris mediano
    "#F2A0A0", // Rojo claro empolvado
    "#C3B1E1", // Lavanda azulada
    "#FFE6F7", // Rosa claro brumoso
];
// Variables para el total de ingresos y gastos


// Objeto para almacenar categorías y evitar duplicados
const CuentasMap = {};

let DetallesPorrender = this.props.data
// Iterar sobre los detalles
let segundoCont = 0
for (let z = 0; z < DetallesPorrender.length; z++) {
 
    let registro = DetallesPorrender[z];
    let cuenta = registro.CuentaSelec;
   // console.log(registro)
  //  console.log(cuenta)
    let cuenta2 = registro.CuentaSelec2;
    let importe = registro.Importe;
    let accion = registro.Accion;
    const cuentaId = cuenta.idCuenta;
    let cuenta2Id = ""
    

    if (!CuentasMap[cuentaId]) { 
        let Cuentafind = this.props.Cuentas.find(cuenta =>cuenta._id == cuentaId )

        CuentasMap[cuentaId] = {
            nombre: cuenta.nombreCuenta,
            Tipo:Cuentafind?.Tipo || "Otros", 
            totalImporte: 0,
            porcentaje: 0,
            _id: cuentaId,
            Color:Colores[segundoCont]
        };
        segundoCont ++


    }
    
    if(cuenta2){
        cuenta2Id = cuenta2.idCuenta;
      let Cuentafind = this.props.Cuentas.find(cuenta =>cuenta._id == cuenta2Id )
       if (!CuentasMap[cuenta2Id]) { 
           CuentasMap[cuenta2Id] = {
               nombre: cuenta2.nombreCuenta,
               Tipo:Cuentafind.Tipo,
               totalImporte: 0,
               porcentaje: 0,
               _id: cuenta2Id,
               Color:Colores[segundoCont]
           };
           segundoCont ++
   
   
       }
   }
    if (accion === "Ingreso") {
        CuentasMap[cuentaId].totalImporte += importe;
     }else if (accion === "Gasto") {
        CuentasMap[cuentaId].totalImporte -= importe;
      }else if (accion ==="Trans"){
        CuentasMap[cuentaId].totalImporte -= importe;
        CuentasMap[cuenta2Id].totalImporte += importe;
      }
    
}

 objetData = Object.values(CuentasMap)

const TiposMap = {};
for (let z = 0; z < objetData.length; z++) {

    let registro = objetData[z];
    let Tipo = registro.Tipo;
    let Color = registro.Color;
    let importe = registro.totalImporte

    if (!TiposMap[Tipo]) { 
        TiposMap[Tipo] ={
            Tipo,
            Color,
            totalImporte: 0,
            porcentaje: 0,

        }


    }

  
    const tipoExcluido = this.state.excluidos.find(obj => obj.Tipo === registro.Tipo);
   
        TiposMap[Tipo].totalImporte += importe;
    

}


let objetTipoData = Object.values(TiposMap)

objetTipoData.forEach(x=> {
    if(x.totalImporte > 0){
        categoriasIngreso.push(x)
    }else{
        categoriasGasto.push(x)
    }

})


 ingresosTotales = categoriasIngreso.reduce((suma, obj) => {
    const RegistroFilterCat = this.state.excluidos.find(exc => exc.Tipo === obj.Tipo);
    if (!RegistroFilterCat) {
        suma += obj.totalImporte ; // Corrige la suma aquí
    }
    return suma; // Asegúrate de retornar el acumulador
}, 0);

  
gastosTotales = Math.abs(
    categoriasGasto.reduce((suma, obj) => {
        const RegistroFilterCat = this.state.excluidos.find(exc => exc.Tipo === obj.Tipo);
        if (!RegistroFilterCat) {
            suma += obj.totalImporte || 0; // Sumar el importe si no está excluido
        }
        return suma; // Retornar el acumulador
    }, 0)
);

// Calcular el porcentaje de cada categoría respecto al total de ingresos o gastos
categoriasIngreso.forEach(cat => {
    cat.porcentaje = ingresosTotales > 0 ? (cat.totalImporte / ingresosTotales) * 100 : 0;
});

categoriasGasto.forEach(cat => {
    cat.porcentaje = gastosTotales > 0 ? (Math.abs(cat.totalImporte) / gastosTotales) * 100 : 0;
});
// Mostrar el resultado con las categorías separadas en ingresos y gastos
  

if(this.state.Ingreso){

    
   datoTouP = categoriasIngreso
  }else if(this.state.Gasto){
    datoTouP = categoriasGasto
  }

  for (let i = 0; i < datoTouP.length; i++) {
    const objetoConCategoriaN = this.state.excluidos.find(obj => obj.Tipo === datoTouP[i].Tipo);
    if (objetoConCategoriaN) {
        datoTouP[i].excluido = true;
        datoTouP[i].porcentaje = 0;
    }
}


let graficData = datoTouP.filter(elem => 
    !this.state.excluidos.some(excluido => excluido.Tipo === elem.Tipo)
);

superdata = {
    labels: graficData.map(x=>x.Tipo),
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
                  let filterobjet =objetData.filter(x => x.Tipo == item.Tipo)
                  this.props.sendData(filterobjet)}}
                
                  >
                    <div className="contpercent" >
                        <div className="percent"
                         onClick={(e)=>{
                          e.stopPropagation();
                        
                          let filterCats= toggleObjeto(this.state.excluidos, item)
                  
                          this.setState({excluidos:filterCats})
                        
                      }}
                        
                        style={{background:bcolor}}>{item.porcentaje.toFixed(2)}%</div>
                        <div className={`npercent ${excluido} `}  >{item.Tipo}</div>
        
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
          <span className={`base ${activeB} `} onClick={()=>{this.setState({Ingreso:true, Gasto:false,excluidos:[] })}}>   <div className="asd">Positivo</div> ${ingresosTotales.toFixed(2)}</span>
          <span style={{fontSize:"40px"}}>|</span>
          <span className={`base ${deactiveB} `} onClick={()=>{this.setState({Gasto:true, Ingreso:false,excluidos:[]})}} > <div className="asd">Negativo</div> ${gastosTotales.toFixed(2)}</span>
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