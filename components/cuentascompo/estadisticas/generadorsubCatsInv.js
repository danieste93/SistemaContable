import React, { Component } from 'react'
import { Pie, Line } from 'react-chartjs-2';
import {Chart} from"chart.js"
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import GenGroupRegs from '../SubCompos/GenGroupRegsCuentasNuevas';

class Stats extends Component {
    state={
        Ingreso:true,
        Gasto:false,
        excluidos:[], 
        subCatClick:{},

    }

    componentDidMount(){
     
     console.log(this.props)
  
        }

        FiltrarRegistroUnicoSistema=(registros)=> {
            const ventasFiltradas = [];
            const numerosVentaUnicos = new Set();
      let match = false
            registros.forEach((registro) => {
              if(this.props.data[0].CatSelect.idCat==5){
                 match = registro.Nota.match(/Venta N°(\d+)/);
              }else if(this.props.data[0].CatSelect.idCat==16){
                 match = registro.Nota.match(/Compra N°(\d+)/);
              }else if(this.props.data[0].CatSelect.idCat==19){
                 match = registro.Nota.match(/Precio-de-Compra Inventario \/\/ Venta Física N°(\d+)/);
              }else if(this.props.data[0].CatSelect.idCat==17){
                match = registro.Nota.match(/Compra N°(\d+)/);
              }
           
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
            console.log(this.state)
            let DetallesPorrender = this.props.data
            let showData = this.props.data
            let catInventario = false
            if(DetallesPorrender.length > 0){
            catInventario = DetallesPorrender[0].CatSelect.idCat == 5?true:
                            DetallesPorrender[0].CatSelect.idCat == 16?true:
                            DetallesPorrender[0].CatSelect.idCat == 19?true:
                            DetallesPorrender[0].CatSelect.idCat == 17?true:
            false
            }
            let sumavalor = 0


if(Object.keys(this.state.subCatClick).length != 0){
if(catInventario){

  console.log(this.state.subCatClick)
if(this.state.subCatClick.nombreSubCat== "sin-subcategoria" ){
showData = showData.filter(objeto => 
  objeto.Descripcion2.articulosVendidos &&
  objeto.Descripcion2.articulosVendidos.length > 0 &&
  objeto.Descripcion2.articulosVendidos.some(articulo => 
    articulo.SubCategoria === "default"|| articulo.SubCategoria === ""
  )
);
}else{
  showData = showData.filter(objeto => 
  objeto.Descripcion2.articulosVendidos &&
  objeto.Descripcion2.articulosVendidos.length > 0 &&
  objeto.Descripcion2.articulosVendidos.some(articulo => 
    articulo.SubCategoria === this.state.subCatClick._id
  )
);
}



  
}else{
 
  showData = showData.filter(objeto =>
    objeto.CatSelect.subCatSelect == this.state.subCatClick.nombreSubCat
  )

}
 }


            if(this.state.excluidos.length > 0){
              showData = showData.filter(item =>
                !this.state.excluidos.some(obj => obj.nombreSubCat === item.CatSelect.subCatSelect)
              );
          
            }

            let superdata = {labels: [],
                datasets: [{
                   label: '',
                   data: [],
                } ]  }
      //      let catInventario = this.state.CategoriaElegida.idCat == 5?true:false
        
           
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
    "#4D96FF", // Azul vibrante
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
    "#A780FF", // Lavanda
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
    "#8A2BE2", // Azul violeta
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
const categoriasMapInv = {};
// Iterar sobre los detalles
let segundoCont = 0


   
  

   

  const extraerCategoriasPrinicipales=(DetallesPorrender)=> { 

for (let z = 0; z < DetallesPorrender.length; z++) {

    let registro = DetallesPorrender[z];

    let cat = registro.CatSelect.subCatSelect == "" ||registro.CatSelect.subCatSelect == undefined
               ?"":registro.CatSelect.subCatSelect;

    let accion = registro.Accion;
    let importe = registro.Importe;
  
    // Identificador único de la categoría
    
    // Si la categoría aún no existe en el mapa, inicialízala con los campos requeridos
    if (!categoriasMap[cat]) {
   
        categoriasMap[cat] = {
        
            nombreSubCat: cat,
            totalImporte: 0,
            porcentaje: 0,
            
            Color:Colores[segundoCont]
        };
        segundoCont ++
    }

    // Sumar el importe a la categoría
    categoriasMap[cat].totalImporte += importe;

    // Dependiendo de la acción, agregar la categoría al array correspondiente y sumar el importe
   
        
        const RegistroFilterCat = this.state.excluidos.find(obj => obj.nombreSubCat == registro.CatSelect.subCatSelect);
        if (!RegistroFilterCat) {
            ingresosTotales += importe;
        }
     
        // Verificar si ya está en el array de categorías de ingreso, si no, agregarla
        if (!categoriasIngreso.some(c => c.nombreSubCat === cat)) {
            categoriasIngreso.push(categoriasMap[cat]);
        }
   
    
}
// Calcular el porcentaje de cada categoría respecto al total de ingresos o gastos
categoriasIngreso.forEach(cat => {
    cat.porcentaje = ingresosTotales > 0 ? (cat.totalImporte / ingresosTotales) * 100 : 0;
});

categoriasGasto.forEach(cat => {
    cat.porcentaje = gastosTotales > 0 ? (cat.totalImporte / gastosTotales) * 100 : 0;
});

return {categoriasIngreso, categoriasGasto}

}


const ventasUnicas = this.FiltrarRegistroUnicoSistema(DetallesPorrender);

const extraerCategoriasConImporte =(ventasUnicas)=> {
 
    let counter = 0


    ventasUnicas.forEach((venta) => {
    
        venta.Descripcion2.articulosVendidos.forEach((articulo, i) => {
          const categoria = articulo.SubCategoria;
   
            const idCat = articulo.SubCategoria =="" || articulo.SubCategoria == "default"?"sin-subcategoria":articulo.SubCategoria;
  
            if (!categoriasMapInv[idCat]) {
   
              categoriasMapInv[idCat] = {
                  _id:idCat,
                  nombreSubCat: idCat,
                  totalImporte: 0,
                  porcentaje: 0,
                  Color:Colores[counter]
              };
              counter ++
          }
        
            categoriasMapInv[idCat].totalImporte += articulo.PrecioCompraTotal;
          
            
          
       
         
       
        });

    });
    
    

    const valoresArray = Object.values(categoriasMapInv);
    

    const filteredArray = valoresArray.filter(item1 => 
      !this.state.excluidos.some(item2 => item2._id === item1._id)
    );

    sumavalor = filteredArray.reduce((acc, item) => acc + item.totalImporte, 0);
      
    valoresArray.forEach(cat => {
      cat.porcentaje = sumavalor > 0 ? (cat.totalImporte / sumavalor) * 100 : 0;
  });
   
  return valoresArray
  
  }
  
  

let resultCats = extraerCategoriasPrinicipales(DetallesPorrender)


    datoTouP = resultCats.categoriasIngreso
    if(catInventario){
        datoTouP = extraerCategoriasConImporte(ventasUnicas);
    }
 

  for (let i = 0; i < datoTouP.length; i++) {
    const objetoConCategoriaN = this.state.excluidos.find(obj => obj.nombreSubCat === datoTouP[i].nombreSubCat);
    if (objetoConCategoriaN) {
        datoTouP[i].excluido = true;
        datoTouP[i].porcentaje = 0;
    }
}

let graficData = datoTouP.filter(elem => 
    !this.state.excluidos.some(excluido => excluido.nombreSubCat === elem.nombreSubCat)
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
              let SelectedSubCat = this.state.subCatClick.nombreSubCat == item.nombreSubCat?"clickCat":""
          
              let excluido = item.excluido?"excluido":""
                let bcolor = item.Color
                let nameSubCat = item.nombreSubCat==""?"sin-subcategoria":item.nombreSubCat
                return(<div className={`crystal-rectangle ${SelectedSubCat} `}   key={i} onClick={(e)=>{
                  
                  e.stopPropagation();
                  if(this.state.subCatClick.nombreSubCat == item.nombreSubCat){
                    this.setState({subCatClick:{}})
                  }else{
                    this.setState({subCatClick:item})
                    
                  }
               
                
                }
                
                
                }
                  
                  
                  >
                    <div className="contpercent" >
                        <div className="percent"
                         onClick={(e)=>{
                          e.stopPropagation();
                        
                          let filterCats= toggleObjeto(this.state.excluidos, item)
                  
                          this.setState({excluidos:filterCats})
                        
                      }}
                        
                        style={{background:bcolor}}>{item.porcentaje.toFixed(2)}%</div>
                        <div className={`npercent ${excluido} `}  >{nameSubCat}</div>
        <style>
        { `
        .clickCat{
        background: beige!important;
        }
        ` }
        </style>
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

let nombreCuenta = ""
if(this.props.catClicked != ""){
    nombreCuenta = this.props.catClicked
}
let setTotal =ingresosTotales
if(catInventario){

  setTotal = sumavalor
}

return(
<div>
<img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.props.Flecharetro }
                />
<div className='centrar jwJustifySpace'>

<p  className='subtituloArt' >Sub-Categorias de:  <span style={{fontStyle:"italic"}}>{nombreCuenta}</span> </p>
<span className={` baset`}  > <div className="asd">Total</div> ${(setTotal).toFixed(2)}</span>
</div>
  <div className="centrar contMainDataChart">
  <div className="cont-Prin">
  <Pie data={superdata} plugins={[ChartDataLabels]} options={options} />
  </div>
<div className="contStatics">
    {stats}
</div>
  </div>
  <div className="supercontreg">
  <GenGroupRegs Registros={showData} cuentaSelect={{_id:0}} datosGene={{saldo:0, balance:0,saldoActive:false}} />  
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
 .clickCat{
        background: beige
        }
   

.crystal-rectangle:hover {
    transform: scale(1.05); /* Efecto de agrandamiento al pasar el ratón */
}
    .selectedCat{
                color:blue;
                  height: 80px;

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
       .clickCat{
        background: beige;
        }

       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
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