import React, { Component } from 'react'
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";

import { Pie, Line } from 'react-chartjs-2';
import {Chart} from"chart.js"
import 'chart.js/auto';
import GenGroupRegs from './SubCompos/GenGroupRegsCuentasNuevas';
import MomentUtils from '@date-io/moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "moment/locale/es";
import { install } from "resize-observer";
 class Stats extends Component {
    state={
   
      Cuentas:false,
      Categorias:true,
      Pie:true, 
      Line:false,
      Pieview:false,
      allData:true,
      catdetail:false,
      CategoriaElegida:{RegistrosF:[]},
      InvOption:"categoria",
        Ingreso:true,
        Gasto:false,
        TotalData:false,

        diario:false,
        mensual:true,
        periodo:false,
        tiempo: new Date(),
        tiempomensual: new Date(),
        tiempoperiodoini: this.periodoini(),
        tiempoperiodofin: this.periodofin(),
        ingCatRender:{},
        bundleSubCat:"Todo",
        excluidos:[]

    }
    periodofin(){
   
      

        let nuevo = new Date()
        let asd  = nuevo.getDate() + 30
        let add = nuevo.setDate(asd)
       
       
        let fechareturn = new Date(add)
        return(fechareturn)
   
    }
    periodoini(){ 

      let nuevo = new Date()
      let asd  = nuevo.getDate() - 60
      let add = nuevo.setDate(asd)
     
     
      let fechareturn = new Date(add)
      return(fechareturn)
 
  }
    componentDidMount(){
     
     
        setTimeout(function(){ 
  
          document.getElementById('mainhomeapp').classList.add("entradaaddc")
    
         }, 200);
  
         if (typeof window !== "undefined") {
          install();
          }
  
 
        
        }
        getDayName = ()=> {
            var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
            
            return days[this.state.tiempo.getDay()];
            
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
        getMonthName = ()=> {
            var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
            return monthNames[this.state.tiempo.getMonth()];
        }
        buttonsp=(e)=>{
  
            let namex = e.target.id
                this.setState({
                diario:false,
    mensual:false,
    periodo:false
              })
              setTimeout(()=>{this.setState({
                [namex]:true
              })},10)
                
    
                }
                
      
        handleChangeTiempo=(e)=>{
            if(e){
          this.setState({
           tiempo:e._d
          })
         }
        }
            
    
        handleChangeTiempoPeriodofin=(e)=>{
          if(e){ 
          this.setState({
            tiempoperiodofin:e._d
          })
         }
        }
        handleChangeTiempoini=(e)=>{
          if(e){ 
          this.setState({
            tiempoperiodoini:e._d
          })
         }
        }
        
        masunmes=()=>{
          let mesactual = this.state.tiempo.getMonth() + 1
          let nuevomes = this.state.tiempo.setMonth(mesactual)
          let newdate = new Date(nuevomes)

          this.setState({tiempo:newdate})
        
        
        }
        menosunmes=()=>{
            let mesactual = this.state.tiempo.getMonth() - 1
            let nuevomes = this.state.tiempo.setMonth(mesactual)
            let newdate = new Date(nuevomes)
      
            this.setState({tiempo:newdate})
          
          
          }
        
        menosundia=()=>{
          let asd  = this.state.tiempo.getDate() - 1
          let add = this.state.tiempo.setDate(asd)
        
          let nuevafecha = new Date(add)
          this.setState({tiempo:nuevafecha})
         
        
          }
          masundia=()=>{
              let asd  = this.state.tiempo.getDate() + 1
              let add = this.state.tiempo.setDate(asd)
        
              let nuevafecha = new Date(add)
              this.setState({tiempo:nuevafecha})
                          
        
          }
  
          DiaryFilter=(regs)=>{
              let fecha = new Date(this.state.tiempo)
                      let fechaini = fecha.setHours(0, 0, 0)
                      let fechafin = fecha.setHours(23, 59, 59)
                     
                      if(regs.length >0){
                        let misregs = regs.filter(regs=> regs.Tiempo >= fechaini && regs.Tiempo <= fechafin  )
                        return misregs
                      }else{
                        return regs
                      }
            }
          MensualFilter=(regs)=>{
     
            let fecha = new Date(this.state.tiempo)
                      var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getTime()
                      var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
                      var ultimahora = new Date(ultimoDia.setHours(23, 59, 59)).getTime()
                      if(regs.length >0){
                        let misregfiltrados = regs.filter(regs=> regs.Tiempo >= primerDia && regs.Tiempo <= ultimahora  )
                      return misregfiltrados
                      }else{
                        return regs
                      }
          
          }
          PeriodoFilter=(regs)=>{
            let fecha = new Date(this.state.tiempoperiodoini)
            let fechafin = new Date(this.state.tiempoperiodofin)
        
            var primerDiaP = fecha.setHours(0,0,0)
            var ultimoDiaP = fechafin.setHours(23,59,59)
          
            let fechainix = new Date(primerDiaP).getTime()
            let fechafinx = new Date(ultimoDiaP).getTime()
            if(regs.length >0){
              let misregsP = regs.filter(regs=> regs.Tiempo >= fechainix && regs.Tiempo <= fechafinx) 
              return misregsP
            }else{
              return regs
            }
          
          }
          handleOptionChange = (event) => {
            this.setState({ InvOption: event.target.value });
          };
          OrderFilter=(regs)=>{
            let order = regs.sort((a, b) => b.Tiempo - a.Tiempo)
        
           return order
          } 
    render() {
      console.log(this.state)
      let catInventario = this.state.CategoriaElegida.idCat == 5?true:false
      const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
      const pieDoughnutLegendClickHandler =  Chart.overrides.pie.plugins.legend.onClick
   
      let toggleObjeto =(array, objeto)=> {
        const index = array.findIndex(item => item.CategoriaN === objeto.CategoriaN);
      
        if (index !== -1) {
          // Si el objeto existe, lo eliminamos
          array.splice(index, 1);
        } else {
          // Si no existe, lo agregamos
          array.push(objeto);
        }
        return array
      }
      let getRandomInt =(max)=> {
        return Math.floor(Math.random() * max);
      }
      let superIng= 0
      let superGas= 0
      let sumaing = 0
      let sumagas = 0
      let detallesrender= ""

let subcats = []
let arrToDisplay = []

let linedata = {labels: [],
  datasets: [{
     label: '',
     data: [],
  } ]  }
      if(this.state.CategoriaElegida.RegistrosF.length > 0){

        let misregs2ing = this.state.CategoriaElegida.RegistrosF.filter(regsing => regsing.Accion == "Ingreso")
        
                if(misregs2ing.length > 0){
                  for (let i=0; i < misregs2ing.length; i++ ){
                    sumaing = sumaing + misregs2ing[i].Importe
                }
              }
              let misregsgas = this.state.CategoriaElegida.RegistrosF.filter(regsgas => regsgas.Accion == "Gasto")
             
        
                if(misregsgas.length > 0){
                for (let i=0; i < misregsgas.length; i++ ){
                    sumagas = sumagas + misregsgas[i].Importe
                   }
                  } 
        
        
        superIng=  sumaing 
        superGas= sumagas 
        
        
//modulo sub cats
let balance = superIng +superGas

for(let i = 0;i<this.state.CategoriaElegida.RegistrosF.length;i++){

  subcats.push(this.state.CategoriaElegida.RegistrosF[i].CatSelect.subCatSelect)  

}

let sinRepetidos = subcats.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
sinRepetidos.push("Otros")
let cleanarr = sinRepetidos.filter(x => x != '')

let coloresUsados= []
let arrToRender =[]
let alldatasets=[]
if(catInventario){

  if(this.state.InvOption == "categoria"){

    const ventasUnicas = this.filtrarVentasUnicasPorNota(this.state.CategoriaElegida.RegistrosF);
    console.log(ventasUnicas);

    function extraerCategoriasConImporte(ventasUnicas) {
      const categoriasConImporte = {};
    
      ventasUnicas.forEach((venta) => {
        if (venta.Descripcion2 && Array.isArray(venta.Descripcion2.articulosVendidos)) {
          venta.Descripcion2.articulosVendidos.forEach((articulo) => {
            const categoria = articulo.Categoria;
            
            if (categoria) {
              const idCat = categoria._id;
    
              // Si la categoría ya existe en el objeto, suma el Importe, si no, inicialízala
              if (categoriasConImporte[idCat]) {
                let sumavalor = categoriasConImporte[idCat].valorTotal + articulo.PrecioCompraTotal
                categoriasConImporte[idCat].valorTotal = sumavalor
                categoriasConImporte[idCat].porcentaje = parseFloat(((sumavalor * 100) / balance).toFixed(2))


                 
              } else {
                // Inicializamos la categoría con todos sus atributos y el Importe inicial
                categoriasConImporte[idCat] = {nombreSubCat: categoria.nombreCat,
                                              _id:categoria._id,
                                                valorTotal: articulo.PrecioCompraTotal,
                                               porcentaje: parseFloat(((articulo.PrecioCompraTotal * 100) / balance).toFixed(2))
                                              };
              }
              console.log(categoriasConImporte)
            }
          });
        }
      });
    let objeto = Object.values(categoriasConImporte)
      // Convertimos el objeto a un array de categorías únicas con Importe acumulado
      return objeto.sort((a, b) => a.valorTotal - b.valorTotal);
    }
    
    const categorias = extraerCategoriasConImporte(ventasUnicas);
console.log(categorias);
arrToRender.push(...categorias)
  }// fin subcats 


}else{
  for(let x=0;x<cleanarr.length;x++){
 
    let misSubcat =""
    if(cleanarr[x] == "Otros"){
      misSubcat= this.state.CategoriaElegida.RegistrosF.filter(regs => regs.CatSelect.subCatSelect == "")
      
    }else{
      misSubcat= this.state.CategoriaElegida.RegistrosF.filter(regs => regs.CatSelect.subCatSelect == cleanarr[x])
    }
 
  
    let acc = 0
    let vals = []
  misSubcat.forEach((element,i) => {
  
    if(element.Accion == "Ingreso"){
  acc = acc + element.Importe
  
    }else{
      acc-= element.Importe
    }
    vals.push(element.Importe)
  
  });
  
    let data = {
                nombreSubCat: cleanarr[x],
                valorTotal: acc,
                porcentaje: parseFloat(((acc * 100) / balance).toFixed(2))
    }
    
  let customdataset={
    label:cleanarr[x],
    data:vals,
    backgroundColor:Colores[x],
    borderWidth: 1,
  }
  
    arrToRender.push(data)
  
    alldatasets.push(customdataset)
  
  }
}


linedata = {labels: ["Enero, Febrero"],
  datasets: alldatasets  }


arrToRender.push({
  nombreSubCat: "Todo",
  valorTotal: balance,
  porcentaje: 100
})
arrToRender.reverse()
const vividColors = [
  "#FF0000", // Rojo Carmesí
  "#FF4500", // Naranja Intenso
  "#FFD700", // Amarillo Sol
  "#FF8C00", // Naranja Oscuro
  "#FF1493", // Rosa Profundo
  "#00FF00", // Verde Esmeralda
  "#32CD32", // Verde Lima
  "#00FF7F", // Verde Primavera
  "#00CED1", // Turquesa Eléctrico
  "#00FFFF", // Cian
  "#1E90FF", // Azul Dodger
  "#4169E1", // Azul Real
  "#0000FF", // Azul Puro
  "#4B0082", // Índigo
  "#9400D3", // Púrpura Violeta
  "#FF00FF", // Magenta
  "#FF69B4", // Rosa Claro
  "#FFA07A", // Salmón Claro
  "#FF6347", // Tomate
  "#B22222"  // Rojo Fuego
];

console.log(arrToRender)
 arrToDisplay = arrToRender.map((item, i) => {
  let setClass = "";
  if (item.nombreSubCat === this.state.bundleSubCat) {
    setClass = "contSubCatSelect";
  }
  if (item.bloqueado) {
    setClass += " contSubCatBloqueado";
  }

  return (
    <div
      className={`contSubCat ${setClass}`}
      style={{ backgroundColor: vividColors[i] }}
      onClick={() => {
        this.setState({ bundleSubCat: item.nombreSubCat });
      }}
    >
      <div className="contSubCatHeader">
        <div className="contSubCatName">{item.nombreSubCat}</div>
        <button
          className="blockButton"
          onClick={(e) => {
            e.stopPropagation();
            this.setState((prevState) => ({
              ...prevState,
              items: prevState.items.map((subCat) =>
                subCat.nombreSubCat === item.nombreSubCat
                  ? { ...subCat, bloqueado: !subCat.bloqueado, porcentaje: 0 }
                  : subCat
              ),
            }));
          }}
        >
          {item.bloqueado ? "🔒" : "🔓"}
        </button>
      </div>
      <div className="contSubCatInfo">
        <div className="contSubCatporcentaje">{item.bloqueado ? "0%" : `${item.porcentaje}%`}</div>
        <div className="contSubCatvalor">${item.valorTotal.toFixed(2)}</div>
      </div>
    </div>
  );
});
let allRegs =""
if(this.state.bundleSubCat =="Todo"){
allRegs = this.state.CategoriaElegida.RegistrosF
}
else if(this.state.bundleSubCat =="Otros"){
  allRegs = this.state.CategoriaElegida.RegistrosF.filter(x=>x.CatSelect.subCatSelect == "")
}
else{
  allRegs = this.state.CategoriaElegida.RegistrosF.filter(x=>x.CatSelect.subCatSelect == this.state.bundleSubCat)
}

detallesrender = <GenGroupRegs Registros={allRegs} cuentaSelect={{_id:0}} datosGene={{saldo:0, balance:0,saldoActive:false}} />  


        }
        let displayRegs =[]
        let diarioval = this.state.diario?"activeval":"";
        let mensualval = this.state.mensual?"activeval":"";
        let periodoval = this.state.periodo?"activeval":"";
        let activeB = this.state.Ingreso?"activeB":""
        let deactiveB = this.state.Gasto?"deactiveB":""
        let activeTotalB = this.state.TotalData?"activeBgreen":""
        let pieActive = this.state.Pie?"activeB":""
        let lineActive = this.state.Line?"activeB":""
        let cuentasActive = this.state.Cuentas?"activeB":""
        let categoriasActive = this.state.Categorias?"activeB":""
        
        let superdata = {labels: [],
            datasets: [{
               label: '',
               data: [],
            } ]  }
            let superdata2 = {labels: [],
              datasets: [{
                 label: '',
                 data: [],
              } ]  }
      
let data = this.state.CatIng
let stats =""


let response  = this.props.regC.Regs? this.props.regC.Regs.filter(x=> x.Accion=="Ingreso"|| x.Accion=="Gasto" ):[]

let cuentasCapital = this.props.regC.Cuentas.filter(x =>  x.CheckedA && x.CheckedP)



let RegistrosRecopilados = []

if(this.props.regC.Cuentas.length>0){
for(let j = 0; j<this.props.regC.Cuentas.length; j++){
  let cap = response.filter(x=> x.CuentaSelec.idCuenta == this.props.regC.Cuentas[j]._id )

  RegistrosRecopilados.push(...cap)
}
}


let  DetallesPorrender=[]
let  DetallesIng=[]
let  DetallesIngCatFilter=[]
let  DetallesGasCatFilter=[]
let  DetallesGas=[]

displayRegs = this.OrderFilter(RegistrosRecopilados)
if(this.state.diario){
    DetallesPorrender = this.DiaryFilter(displayRegs)
  }else if(this.state.mensual){
    DetallesPorrender = this.MensualFilter(displayRegs)
    
  }
  else if(this.state.periodo){
    DetallesPorrender = this.PeriodoFilter(displayRegs)
  }


   DetallesIng  = DetallesPorrender.filter(obj2 => obj2.Accion=="Ingreso");
    
   
    DetallesGas = DetallesPorrender.filter(x => x.Accion=="Gasto"  ) 
 

    if(this.state.Categorias){
      DetallesIngCatFilter  = DetallesIng.filter(obj2 => 
        !this.state.excluidos.some(obj1 => obj1.CategoriaN === obj2.CatSelect.nombreCat) 
    
        );

        DetallesGasCatFilter  = DetallesGas.filter(obj2 => 
          !this.state.excluidos.some(obj1 => obj1.CategoriaN === obj2.CatSelect.nombreCat) 
      
          );


    }
    


    let categoriasRegistros =[]
    let cuentasRegistros =[]
  
    let cuentasGasRegistros =[]
    let categoriasGasRegistros =[]


    let cuentasRegistrosTotal =[]
    let categoriaRegistrosTotal =[]
    for(let z=0;z<DetallesPorrender.length ;z++){
      let cat = DetallesPorrender[z].CatSelect
      let cuenta = DetallesPorrender[z].CuentaSelec
      categoriaRegistrosTotal.push(cat)
      cuentasRegistrosTotal.push(cuenta)
    }
   
    let CategoriasTotalesSR= categoriaRegistrosTotal.filter((value, index, self) => {
      return(            
        index === self.findIndex((t) => (
          t.nombreCat === value.nombreCat && t.nombreCat === value.nombreCat
        ))
    )
    
    });

    let CuentasTotalesSR= cuentasRegistrosTotal.filter((value, index, self) => {
      return(            
        index === self.findIndex((t) => (
          t.nombreCuenta === value.nombreCuenta && t.nombreCuenta === value.nombreCuenta
        ))
    )
    
    });

    if(DetallesIng.length > 0){
   
      for(let z=0;z<DetallesIng.length ;z++){
    
        let cat = DetallesIng[z].CatSelect
      let cuenta = DetallesIng[z].CuentaSelec
        categoriasRegistros.push(cat)
        cuentasRegistros.push(cuenta)
      }
    }
    let CategoriasIngSR= categoriasRegistros.filter((value, index, self) => {
          return(            
            index === self.findIndex((t) => (
              t.nombreCat === value.nombreCat && t.nombreCat === value.nombreCat
            ))
      )
    
    });

    let CuentasIngSR= cuentasRegistros.filter((value, index, self) => {
      return(            
        index === self.findIndex((t) => (
          t.nombreCuenta === value.nombreCuenta && t.nombreCuenta === value.nombreCuenta
        ))
  )

});


    if(DetallesGas.length > 0){
      for(let z=0;z<DetallesGas.length ;z++){
        let cat = DetallesGas[z].CatSelect
        let cuenta = DetallesGas[z].CuentaSelec
        categoriasGasRegistros.push(cat)
        cuentasGasRegistros.push(cuenta)
      }
    }
   

    let CategoriasGasSR= categoriasGasRegistros.filter((value, index, self) => {
          return(            
            index === self.findIndex((t) => (
              t.nombreCat === value.nombreCat && t.nombreCat === value.nombreCat
            ))
      )
    
    });
    let CuentasGasSR= cuentasGasRegistros.filter((value, index, self) => {
      return(            
        index === self.findIndex((t) => (
          t.nombreCuenta === value.nombreCuenta && t.nombreCuenta === value.nombreCuenta
        ))
    )
    
    });
  


  let sumaTotaling=0
  let sumaTotalgas=0
  let sumaTotal = 0
  if(DetallesPorrender.length>0){
if(this.state.Categorias){

     
  for(let x = 0; x < DetallesIngCatFilter.length; x++){
    sumaTotaling = sumaTotaling + DetallesIngCatFilter[x].Importe
  }

  for(let x = 0; x < DetallesGasCatFilter.length; x++){
    sumaTotalgas = sumaTotalgas + DetallesGasCatFilter[x].Importe
  }
}
 
   

      sumaTotal = sumaTotaling -sumaTotalgas
     
    

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
      "#FFD700"  // Amarillo dorado
    ];
    let LabelsLine = []

    let DetallesDataLabel = ""
    if(this.state.Ingreso){
      DetallesDataLabel = DetallesIng
    }else if(this.state.Gasto){
      DetallesDataLabel = DetallesGas
    }else if(this.state.TotalData){
      DetallesDataLabel = DetallesPorrender
    }
    for(let x = 0; x < DetallesDataLabel.length; x++){
      if(this.state.diario){
      let newtime = new Date(DetallesDataLabel[x].Tiempo).getHours()
      LabelsLine.push(newtime)
    }else if(this.state.mensual){
      let newtime = new Date(DetallesDataLabel[x].Tiempo).getDate() 
      LabelsLine.push(newtime)
    }else if(this.state.periodo){
      let newtime = new Date(DetallesDataLabel[x].Tiempo).getMonth() 
    
      LabelsLine.push(newtime)
    }
    }

    let sinRepetidosLabels = LabelsLine.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    let OrderLabels = sinRepetidosLabels.sort((a,b) => a - b) 

    let gruposCuentas = []
   let gruposCats = []
   if(this.state.Ingreso && CategoriasIngSR.length > 0 && this.state.Categorias  ){
    gruposCats= CategoriasIngSR
   }else if(this.state.Gasto && CategoriasGasSR.length > 0  && this.state.Categorias  ){  
    gruposCats = CategoriasGasSR
   }else if(this.state.TotalData && this.state.Categorias ){
    gruposCats = CategoriasTotalesSR
   }

  console.log(gruposCats)
let filteredCats = gruposCats.filter(obj2 => 
  !this.state.excluidos.some(obj1 => obj1.CategoriaN === obj2.nombreCat)
);


   if(this.state.Ingreso && CuentasIngSR.length > 0  && this.state.Cuentas  ){
    gruposCuentas= CuentasIngSR
   }else if(this.state.Gasto && CuentasGasSR.length > 0  && this.state.Cuentas ){
    gruposCuentas = CuentasGasSR
 
   }else if(this.state.TotalData && this.state.Cuentas ){
    gruposCuentas = CuentasTotalesSR
   }
   
  
 

        let regsCat = []

        let regsCuenta = []
        let titulos=[]

        let vals = []
        let coloresUsados= []
        let datoTouP =[]
        let dataSetGen = []
   
if(this.state.Categorias){
 
        for(let i = 0; i < filteredCats.length; i++){

          if(this.state.Ingreso){
            regsCat = DetallesIng.filter(x=> x.CatSelect.idCat == filteredCats[i].idCat)
          }else if(this.state.Gasto){
            regsCat = DetallesGas.filter(x=> x.CatSelect.idCat == filteredCats[i].idCat)
          }else if(this.state.TotalData){
            regsCat = DetallesPorrender.filter(x=> x.CatSelect.idCat == filteredCats[i].idCat)
          }

        
        let sinColoresExcluidos = Colores.filter(obj2 => 
          !this.state.excluidos.some(obj1 => obj1.Color === obj2) 
      
          );

            if(regsCat.length > 0){
              let ValsLine = []
              let dataConf =""
                titulos.push(filteredCats[i].nombreCat)
                coloresUsados.push(sinColoresExcluidos[i])
                let sumaRegistros = 0
                for (let i=0; i < regsCat.length; i++ ){
               
                  sumaRegistros += regsCat[i].Importe

                         }

              
         
              for (let x=0; x < OrderLabels.length; x++ ){
               let finddata =[]
                           
             
                   finddata = regsCat.filter((cat)=>{
                    let timeregis
                    if(this.state.diario){
                      timeregis = new Date(cat.Tiempo).getHours()
                  }else if(this.state.mensual){
                    timeregis = new Date(cat.Tiempo).getDate()
                  }else if(this.state.periodo){
                    timeregis = new Date(cat.Tiempo).getMonth() 
                  }
                    if(timeregis == OrderLabels[x]){
                      return true                      
                    }else{
                      return false
                    }


                  } )
              
                  if(finddata.length > 0){
                   let accum = 0
                   finddata.forEach(x => accum += x.Importe)
                   ValsLine.push(accum)
                  }else{
                    ValsLine.push(0)
                  }
                
 
              }
          

              vals.push(sumaRegistros)
         
              dataConf=  {label: filteredCats[i].nombreCat,
                data: ValsLine,
                backgroundColor: Colores[i],
                borderColor: Colores[i],
                borderWidth: 6,}
  
                dataSetGen.push(dataConf)
            }
    
         
       
          }//fin for
          
        for(let i = 0; i < gruposCats.length; i++){

          if(this.state.Ingreso){
            regsCat = DetallesIng.filter(x=> x.CatSelect.idCat == gruposCats[i].idCat)
          }else if(this.state.Gasto){
            regsCat = DetallesGas.filter(x=> x.CatSelect.idCat == gruposCats[i].idCat)
          }else if(this.state.TotalData){
            regsCat = DetallesPorrender.filter(x=> x.CatSelect.idCat == gruposCats[i].idCat)
          }
          let sumaRegistros = 0
          let percent = 0
          let excluido = false
          if(regsCat.length > 0){
            coloresUsados.push(Colores[i])
           
            for (let i=0; i < regsCat.length; i++ ){
           
              sumaRegistros += regsCat[i].Importe

                     }
           
                  
                     if(sumaRegistros > 0){
                       
                      const objetoConCategoriaN = this.state.excluidos.find(obj => obj.CategoriaN == gruposCats[i].nombreCat);
                     
                      if(objetoConCategoriaN){
                          percent = 0
                          excluido = true
                        }
                  else if(this.state.Ingreso){
                       percent = (sumaRegistros *100) / sumaTotaling
                      
                     }else if(this.state.Gasto){
                       percent = (sumaRegistros *100) / sumaTotalgas
                     }else if(this.state.TotalData){
                       percent = (sumaRegistros *100) / sumaTotal
                     }}


           }

          let newarr = {idCat:gruposCats[i].idCat,CategoriaN:gruposCats[i].nombreCat, Cantidad:sumaRegistros, Color:Colores[i],Porcentaje:percent.toFixed(2), RegistrosF:regsCat,excluido}
        
          datoTouP.push(newarr)
        

        }
        
      }

      else if(this.state.Cuentas){

        for(let i = 0; i < gruposCuentas.length; i++){
         
          if(this.state.Ingreso){
            
            regsCuenta = DetallesIng.filter(x=> x.CuentaSelec.idCuenta == gruposCuentas[i].idCuenta)
          }else if(this.state.Gasto){
           
            regsCuenta = DetallesGas.filter(x=> x.CuentaSelec.idCuenta == gruposCuentas[i].idCuenta)
          }else if(this.state.TotalData){
            regsCuenta = DetallesPorrender.filter(x=> x.CuentaSelec.idCuenta == gruposCuentas[i].idCuenta)
          }
          
         
          if(regsCuenta.length > 0){
          
            let ValsLine = []
            let dataConf =""
           
            titulos.push(gruposCuentas[i].nombreCuenta)
                      coloresUsados.push(Colores[i])
                      let sumaRegistros = 0
                      for (let i=0; i < regsCuenta.length; i++ ){
                     if (this.state.TotalData){
                      if(regsCuenta[i].Accion == "Ingreso"){
                        sumaRegistros += regsCuenta[i].Importe
                      }else if(regsCuenta[i].Accion == "Gasto"){
                        sumaRegistros -= regsCuenta[i].Importe
                      }
                     

                     }else{
                        sumaRegistros += regsCuenta[i].Importe
                      }
                    
                               }
                    for (let x=0; x < OrderLabels.length; x++ ){
                      let finddata =[]
                                 
                   
                      finddata = regsCuenta.filter((cat)=>{
                       let timeregis
                       if(this.state.diario){
                         timeregis = new Date(cat.Tiempo).getHours()
                     }else if(this.state.mensual){
                       timeregis = new Date(cat.Tiempo).getDate()
                     }else if(this.state.periodo){
                       timeregis = new Date(cat.Tiempo).getMonth() 
                     }
                       if(timeregis == OrderLabels[x]){
                         return true                      
                       }else{
                         return false
                       }
      
      
                     } )
                     if(finddata.length > 0){

                      let accum = 0
                    
                      finddata.forEach(x => {
                        if(x.Accion == "Ingreso"){
                          return accum += x.Importe
                        }else if(x.Accion == "Gasto"){
                          return accum -= x.Importe
                        }
                      })
                   
                      ValsLine.push(accum)
                     }else{
                       ValsLine.push(0)
                     }
      
      
                             }
      
                             let percent = 0
                       
                         
                             if(this.state.Ingreso){
                              percent = (sumaRegistros *100) / sumaTotaling
                             
                            }else if(this.state.Gasto){
                              percent = (sumaRegistros *100) / sumaTotalgas
                            }
                            else if(this.state.TotalData){
                              percent = (sumaRegistros *100) / sumaTotal
                     
                            }
                          
                             let newarr = {CategoriaN:gruposCuentas[i].nombreCuenta, Cantidad:sumaRegistros, Color:Colores[i],Porcentaje:percent.toFixed(2), RegistrosF:regsCuenta}
                          
                         
                              vals.push(sumaRegistros)
                           
                             datoTouP.push(newarr)
                         
                             dataConf=  {label: gruposCuentas[i].nombreCuenta,
                               data: ValsLine,
                               backgroundColor: Colores[i],
                               borderColor: Colores[i],
                               borderWidth: 6,} 
                                     
                               dataSetGen.push(dataConf)
                             
          }
        
        }
      
      
    
      }
 
        superdata = {
            labels: titulos,
            datasets: [
                {label: 'asd',
                data:vals,
                backgroundColor:coloresUsados,
                borderWidth: 1,
              }
            ]
        }
       let addCero=(n)=>{
          if (n<10){
            return ("0"+n)
          }else{
            return n
          }
        }
    let superLabels2 = []
    var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
          if(this.state.diario){
            superLabels2 = OrderLabels.map(x=>x +":00")
          }else if(this.state.mensual){
            superLabels2 = OrderLabels.map(x=>addCero(x) )
          }else if(this.state.periodo){
            superLabels2 = OrderLabels.map(x=>monthNames[x] )
          }
        
        superdata2 = {
          labels:superLabels2,
          datasets: dataSetGen
      }



        if(datoTouP.length >0){
            stats = datoTouP.sort((a, b) => b.Cantidad - a.Cantidad).map((item, i)=>{
                let excluido = item.excluido?"excluido":""
                let bcolor = item.Color
                return(<div className="crystal-rectangle" key={i} onClick={(e)=>{
                  
                  e.stopPropagation();
                  this.setState({CategoriaElegida:item,allData:false, catdetail:true})}}>
                    <div className="contpercent" >
                        <div className="percent"
                         onClick={(e)=>{
                          e.stopPropagation();
                        
                          let filterCats= toggleObjeto(this.state.excluidos, item)
                  
                          this.setState({excluidos:filterCats})
                        
                      }}
                        
                        style={{background:bcolor}}>{item.Porcentaje}%</div>
                        <div className={`npercent ${excluido} `}  >{item.CategoriaN}</div>
        
                    </div>
                    <div className="contvalores">${item.Cantidad.toFixed(2)}</div>
                </div>)
             }) 
        }

    

   
  }

 


        return (
            <div id="mainhomeapp"className="mainstats">

         <div className="contPieview">
<div className="contAllStatics">
<div className="contPieview contdetails">
<div className="minifilterCont">
<span className={`base basealt ${pieActive} `} onClick={()=>{this.setState({Pie:true, Line:false, })}}>   <div className="">Pie</div> 
<span className="material-icons">
                           pie_chart
                            </span>

</span>
<span style={{fontSize:"30px"}}>|</span>
          <span className={`base basealt ${lineActive} `} onClick={()=>{this.setState({Line:true, Pie:false,})}} > <div className="asd">Line</div> 
          
          <span className="material-icons">
                           show_chart
                            </span>
          
          </span>


</div>
<div className="minifilterCont">
<span className={`base basealt ${cuentasActive} `} onClick={()=>{this.setState({Cuentas:true, Categorias:false, })}}>   <div className="">Cuentas</div> 


</span>
<span style={{fontSize:"30px"}}>|</span>
          <span className={`base basealt ${categoriasActive} `} onClick={()=>{this.setState({Categorias:true, Cuentas:false,})}} > <div className="asd">Categorias</div> 
          
         
          
          </span>


</div>
</div> 
<Animate show={this.state.allData}> 
<div className="organizador">
<div className="cont-Bt2">

<div  id="diario" className={`botongeneral jwPointer ${diarioval}  `}onClick={ this.buttonsp}>Diario</div>
<div id="mensual" className={`botongeneral jwPointer ${mensualval} `}onClick={ this.buttonsp}>Mensual</div>
<div id="periodo" className={`botongeneral jwPointer ${periodoval} `}onClick={ this.buttonsp}> Periodo</div>


</div>
<div className="contfiltros">
<Animate show={this.state.mensual}>
<div className="contfiltromensual jwContFlexCenter">
                     <div className="subtituloArt">
                       {this.getMonthName()}
                     </div>
                   <div className="contmensual " >
    <div className="flechalateral" onClick={this.menosunmes}> {'<'}</div>
    <div className="fechacentral">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="DD/MM/YYYY"
          margin="normal"
          views={["month"]}
          id="date-picker-inline"
          label="Selecciona la fecha"
          value={this.state.tiempo}
          onChange={this.handleChangeTiempo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>
               </div>
               <div className="flechalateral" onClick={this.masunmes}> {'>'}</div>
               </div>
                     
                   </div>

                   </Animate>   
                   <Animate show={this.state.diario}>
                <div className="contfiltromensual jwContFlexCenter">
                <div className="subtituloArt">
                       {this.getDayName()}
                     </div>
                   <div className="contmensual " >
    <div className="flechalateral" onClick={this.menosundia}> {'<'}</div>
    <div className="fechacentral">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="DD/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Selecciona la fecha"
          value={this.state.tiempo}
          onChange={this.handleChangeTiempo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>
               </div>
               <div className="flechalateral" onClick={this.masundia}> {'>'}</div>
               </div>
                     
                   </div>
          
                  
           
           
           
           
           
                  </Animate>    
                  <Animate show={this.state.periodo}>
                  <div className="contfiltromensual jwContFlexCenter">
                       <div className="contmensual">
                       <div className="separador">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="DD/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Fecha de inicio "
          value={this.state.tiempoperiodoini}
          onChange={this.handleChangeTiempoini}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>
               </div>
               <div className="separador">
               <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
           format="DD/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Fecha fin "
          value={this.state.tiempoperiodofin}
          onChange={this.handleChangeTiempoPeriodofin}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>

               </div>
               </div>
                     
                   </div>

                  </Animate>   
</div>
</div>
<div className="inggasCont">
          <span className={`base ${activeB} `} onClick={()=>{this.setState({Ingreso:true, Gasto:false, TotalData:false,excluidos:[] })}}>   <div className="asd">Ingreso</div> ${sumaTotaling.toFixed(2)}</span>
          <span style={{fontSize:"40px"}}>|</span>
          <span className={`base ${deactiveB} `} onClick={()=>{this.setState({Gasto:true, Ingreso:false,TotalData:false,excluidos:[]})}} > <div className="asd">Gasto</div> ${sumaTotalgas.toFixed(2)}</span>
          <span style={{fontSize:"40px"}}>|</span>
          <span className={` baset`}  > <div className="asd">Total</div> ${sumaTotal.toFixed(2)}</span>
  </div>
  <Animate show={this.state.Pie}>  
  <div className="centrar contMainDataChart">
 <div className="cont-Prin">
 <Pie data={superdata} plugins={[ChartDataLabels]}  options={{
  
  responsive: true,
      cutoutPercentage: 80,
      legend: { display: false},
      plugins: {
        legend : {
          display: false,
          onClick:   (e, legendItem, legend) =>{
           
  
           
            const index = legendItem.datasetIndex;
            const type = legend.chart.config.type;
          
            if (type === 'pie' || type === 'doughnut') {
              pieDoughnutLegendClickHandler({}, {
            
  
index: 1,



              }, )
            } else {
              defaultLegendClickHandler(e, legendItem, legend);
            }
          
            
      
          }
          },
        datalabels: {
            backgroundColor: function(context) {
                return "white";
              },
            formatter: (value, ctx) => {
                let sum = 0;
                let ci = ctx.chart;
             
                let dataArr = ctx.chart.data.datasets[0].data;
                let acc = 0
                dataArr.forEach((d, i) => {
                  if (ci.getDataVisibility(i)) {
                    acc += d;
                  }
                });
                let percentage = (value*100 / acc).toFixed(0)+"%";
                return percentage;
            },
            color: 'black',
            borderRadius: 25,
            padding: 5,
            font: {
                size:"15px",
                weight: 'bold'
              },
        }}
   
    }} />
</div>
<div className="contStatics">
    {stats}
</div>
</div>
</Animate> 
<Animate show={this.state.Line}> 
<div className="centrar contLineChart">
<Line data={superdata2}   options={{
  
  responsive: true,
  maintainAspectRatio: false,
  
      legend: { display: true},
      plugins: {
        datalabels: {
            backgroundColor: function(context) {
                return "white";
              },
           
            color: 'black',
            borderRadius: 25,
            padding: 5,
            font: {
                size:"15px",
                weight: 'bold'
              },
        }}
   
    }} />
</div>
</Animate> 
</Animate> 
</div>
<div className="contcatdetail">
<Animate show={this.state.catdetail}>
<div className="contGnCroom">
<div className="headercroom">
  <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                  onClick={()=>{this.setState({catdetail:false, allData:true})}  }
                  />
               <div className=' centrar' >      
  <div className="tituloArt">Detalles de {this.state.CategoriaElegida.CategoriaN} </div>
  
  <Animate show={catInventario}>
<div  style={{ marginLeft: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="radio"
            value="item"
            checked={this.state.InvOption === 'item'}
            onChange={this.handleOptionChange}
          />
          <label style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
            <span className="material-icons" style={{ marginRight: '8px' }}>
              attach_money
            </span>
            Item
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            value="categoria"
            checked={this.state.InvOption === 'categoria'}
            onChange={this.handleOptionChange}
          />
          <label style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
            <span className="material-icons" style={{ marginRight: '8px' }}>
              category
            </span>
            Categoría
          </label>
        </div>
        </div>
        </Animate>
      </div>
      </div>
    <div className="contSubCats">
    
<div className='contStatics'></div>
{arrToDisplay}
    </div>
   
    <div className="cont-Prin2">

    </div>

                     <div className="supercontreg">
                  {detallesrender}
                  </div>
</div>
</Animate>
</div>
</div>


<style >
                {                                
                ` .excluido{
                color:red
                }
                .fullw{
                  width: 100%;  
              }
                .contMainDataChart{
                  flex-wrap: wrap;
                  min-height: 300px;
                  align-items: flex-start;
                }
                .contLineChart {
                  margin: 15px 0px;
                  min-height: 350px;
                }
                .contfiltros{
                  width: 90%;
                  margin-left: 5%;
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
                .fechacentral{
                    width: 60%;
                  }
                .contfiltromensual{
                 
                    flex-flow: row;
    flex-wrap: wrap;
    justify-content: space-around;
                  } 
                .contpercent{
                    display: flex;
                    width: 70%;
                   align-items: center
                      
                    
                }
                .activeB{
                    font-size:20px;
                    color: #3f51b5;
                      font-weight: bolder;
                  }
                  .activeBgreen{
                    font-size:20px;;
                    color: green;
                      font-weight: bolder;
                  }
                  .deactiveB{
                    font-size:20px;
                    color: red;
                      font-weight: bolder;
                  }
                .contmensual{
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  max-width: 500px;
                  border: 3px outset;
                  height: 57px;
                  border-radius: 11px;
                  margin: 3px 0px;
                  }
                  .flecharetro{
                    height: 40px;
                    width: 40px;
                    padding: 5px;
                  }
                  .flechalateral{
                    display: flex;
                    align-items: center;
                    box-shadow: inset 1px 2px 3px;
                    width: 25px;
                    height:25px;
                    padding: 4px;
                    text-align: center;
                    justify-content: center;
                    cursor:pointer;
                    border-radius: 48%;
                  }
                  .contcatdetail{
                    box-shadow: -2px 1px 3px #8ebaeb;
                    background: white;
                    margin: 5px;
                    border-radius: 10px;
                    padding: 15px 9px 0px 8px;
                    width: 96%;
                    margin-left: 2%;
                  }
                
                .mainstats{
                    transition: 0.5s;
   
                    padding-bottom: 9.5vh;
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
                    transition: 0.5s;
                    left: -100%;
                    flex-flow:column
                }
                .entradaaddc{
                    left: 0%;
                   }
                   .cont-Bt2 {
                    display: flex;
                    width: 100%;
                    justify-content: space-evenly;
                    margin-top:5px;
                    margin-bottom:10px;
                }
                  
                  .dineroresum2{
                    margin: 5px 0px;
                    box-shadow: 0px 0px 2px #292323;
                    padding: 10px;
                    border-radius: 13px;
                    background: #ecf5ff;
                    width: 100%;
                    max-width: 500px
                }
                   .percent{
                  display: flex;
                  align-items: center;
                  border: 1px solid black;
                  border-radius: 19px;
                  font-weight: bold;
                  padding: 5px;
                  justify-content: center;
                  width: 30%;
                  max-width: 65px;
                  margin-left: 15px;
                      min-width: 60px;
    height: 30px;
                   }
                  .npercent{
                   margin-left: 25px;
                       word-break: break-all;
                  }
                   .minigen{
                    text-align: center;
                 }
                    
                 .minifilterCont{
                  display: flex;
                  width: 45%;
                  justify-content: space-around;
                  align-items: center;
                  flex-wrap: wrap;
                }
                 .contsgens{
                  display: flex;
                width: 100%;
                justify-content: space-around;
                }
                   .botongeneral{
                    border-radius: 10px;
                    width: 25%;
                    font-weight: bold;
                    height: 20px;
                    background: white;
                    transition: 0.5s ease-out;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: lightgrey;
                    min-width: 100px;
                   }
                   .activeval{
                    height: 25px;
                    color: black;
                    box-shadow: -5px 1px 5px #5498e3;  
                                    
                  }
                   .contvalores{
                    font-size: 20px;
                    font-weight: bolder;
                    margin-right: 15px;
                   }
                   .contstat{
                    display: flex;
                    width: 100%;
                    padding: 12px 0px;
                    justify-content: space-between;
                    height: auto;
                    min-height: 40px;
                    margin: 6px 0px;
                    background: white;
                    box-shadow: inset 2px -1px 5px black;
                    border-radius: 18px;
                    cursor: pointer;
                  }
                .cont-Prin {
                    display: flex;
                    width: 70%;
                    justify-content: center;
                    max-width: 400px;
                    flex-flow: column;
                    margin: 20px;
                }
                .cont-Prin2 {
                  display: none;
                  width: 70%;
                  justify-content: center;
                  max-width: 400px;
                  flex-flow: column;
              }
                .contStatics{
                  display: flex;
                  flex-flow: column;
                  width: 100%;
               
                  margin: 20px;
                 
                  max-width: 450px;
                  border-radius: 14px;
                  padding: 10px;
                  justify-content: center;
                }
                .contULS{
                    width: 40%;
                 }
                 .organizador{
                  margin-top: 10px ;
                  border: 1px double #4695ec;
                  border-radius: 18px;
                  padding: 10px;
                  box-shadow: inset 0px -2px 4px black;
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
                  .basealt{
                    margin-top:5px;
                   
                    flex-flow: row;
                    justify-content: space-around;
                    height: 30px;
                    
                  }

                 .conttitulo{
                    border-radius: 30px;
                    text-align: center;
                    padding: 5px;
                    box-shadow: rgb(38 57 77) 12px 35px 78px -20px;
                    width: 90%;
                    max-width: 350px;
                    border-bottom: 6px double black;

                 }
           .contSubCats{
            display: flex;
    flex-flow: column;

    align-items: center;
           }
           .contSubCat{
            display: flex;
            width: 99%;
            justify-content: space-between;
            transition:1s;
            margin-bottom: 12px;
            border-bottom: 1px solid;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            background-color: #59c6f812
           }
              .crystal-rectangle {
      width: 100%;
      height: auto;
        margin: 10px 0px;
                    min-height: 40px;
          padding: 12px 0px;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 15px;
      box-shadow: 
        inset 5px 5px 10px rgba(255, 255, 255, 0.2),
        inset -5px -5px 10px rgba(0, 0, 0, 0.15),
        5px 5px 15px rgba(0, 0, 0, 0.3),
        -5px -5px 15px rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
 
    
                  cursor:pointer;
     
    }




    .contSubCat {
  padding: 15px;
  margin: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.contSubCatSelect {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.contSubCatBloqueado {
  opacity: 0.5;
  pointer-events: none; /* Desactiva el clic si está bloqueado */
}

.contSubCatHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blockButton {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s;
}

.blockButton:hover {
  color: rgba(255, 255, 255, 1);
}

.contSubCatporcentaje, .contSubCatvalor {
  font-weight: bold;
  font-size: 14px;
  color: black;
}
           .contSubCatporcentaje{
            width: 30%;
            text-align: center;
           }
           .contSubCatvalor{
            width: 20%;
            text-align: right;
           }
           .contSubCatName{
            width: 20%;
           }
           .contPieview{
            width: 95%;
            max-width: 1000px;
          }
           .contSubCatSelect{
            background-color: #428de0fc;
            color: white;
            height: 50px;
           }
           .contAllStatics{
            box-shadow: -2px 1px 3px #8ebaeb;
            background: white;
            margin: 0px;
            border-radius: 10px;
            padding: 15px 9px 0px 8px;
            width: 99%;
           }
                 p{

                 }
                    
                   .contdetails{
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                   }

      .contSubCat {
  padding: 20px;
  margin: 15px;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  color: #ffffff;
}

.contSubCatSelect {
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.contSubCatBloqueado {
  opacity: 0.4;
  pointer-events: none;
}

.contSubCatHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contSubCatName {
  font-size: 1.2em;
  font-weight: bold;
}

.blockButton {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 5px;
  padding: 5px;
  color: #ffffff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.blockButton:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.contSubCatInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  margin-top: 10px;
}

.contSubCatporcentaje {
  font-weight: bold;
}

.contSubCatvalor {
  font-size: 1em;
}

                
                ` }
    </style>
</div>



        )
    }
}
const mapStateToProps = state=>  {
    let regC =   state.RegContableReducer
    return {
      regC
    }
  };
  
  export default connect(mapStateToProps, null)(Stats);