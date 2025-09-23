import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Link from "next/link"
import Head from "next/head"
import {logOut} from "../../reduxstore/actions/myact"
import Router from "next/router"
import Modal from "../../components/cuentascompo/modal-ingreso"
import {Animate} from "react-animate-mount"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {getClients,addFirstRegsDelete,addFirstRegs,getArts,getDistribuidor,getAllcuentas,getCompras,getcuentas,getCounter, getVentas, gettipos,getcats, updateRegs, } from "../../reduxstore/actions/regcont";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {Chart} from"chart.js"
import 'chart.js/auto';
import AddCero from '../../components/funciones/addcero';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Fab, Grid, Typography, Box } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';



class admins extends Component {
  state = {
    modalagregador:false,
   
    pieValue:"ingresos",
    cuentaToAdd:{},
    Alert:{Estado:false},
    tiempoValue:"diario",
    
    // Estados para personalización de widgets
    showCustomizationPanel: false,
    widgetConfig: {
      showIncomeChart: true,
      showExpenseChart: true,
      showPieChart: true,
      showBarChart: true,
      showLiquidityChart: true, // Nuevo widget de liquidez
      incomeChartType: 'line', // line, bar, area
      expenseChartType: 'line',
      pieChartType: 'pie', // pie, doughnut
      barChartType: 'bar', // bar, horizontalBar
      liquidityChartType: 'line', // line, area
      customColors: {
        income: '#8cf73a',
        expense: '#f1586e',
        liquidity: '#00d4aa', // Color para liquidez
        pieColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    }
   }
   channel2 = null;
   componentDidMount(){


    if(!this.props.state.RegContableReducer.Regs){
   
       this.getMontRegs()
    }

    if(!this.props.state.RegContableReducer.Cuentas  || !this.props.state.RegContableReducer.Categorias ){
     
          this.getCuentasyCats()
    }

    // Cargar configuración de widgets guardada
    this.loadWidgetConfig();

   }

   getMontRegs=()=>{
  let datos = {
    User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
      Tipo: this.props.state.userReducer.update.usuario.user.Tipo, 
    },
    tiempo:new Date().getTime()
  }
  
  console.log(datos)
let lol = JSON.stringify(datos)

fetch("/cuentas/getmontregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json',
"x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
console.log(response,"getmontregs")
if(response.status == 'error'){
alert("error al actualizar registros")
  }
else{
  let regsToSend = []
this.props.dispatch(addFirstRegs(response.regsHabiles));
this.props.dispatch(addFirstRegsDelete(response.regsHabilesDelete));
this.exeRegs()
}   
})
}

exeRegs=()=>{
   
  let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
    Tipo: this.props.state.userReducer.update.usuario.user.Tipo, 
    tiempo:new Date().getTime()
  
  }}
let lol = JSON.stringify(datos)

fetch("/cuentas/exeregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json',
"x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
console.log(response,"exeregs")
if(response.status == 'error'){
alert("error al actualizar registros")
}
else{

  if(response.registrosUpdate.length > 0){

  this.props.dispatch(updateRegs(response.registrosUpdate)); 
this.getCuentasyCats()
  }

}   
})
}
getCuentasyCats=()=>{
 
  let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
    Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
let lol = JSON.stringify(datos)
  let settings = {
    method: 'POST', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
  }

  fetch("/cuentas/getCuentasyCats", settings).then(res => res.json())
  .catch(error => {console.error('Error:', error);
         })
  .then(response => {  
  
    if(response.status == 'error'){}
  else if(response.status == 'Ok'){
  //  this.props.dispatch(getVentas(response.ventasHabiles));       
  this.props.dispatch(getcats(response.catHabiles)); 
  this.props.dispatch(getcuentas(response.cuentasHabiles)); 
  
  }

  })
}
   getAllregs=()=>{
   
    let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
      Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
let lol = JSON.stringify(datos)

fetch("/cuentas/getregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json',
"x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  

if(response.status == 'error'){
alert("error al actualizar registros")
  }
else{

this.props.dispatch(addFirstRegs(response.regsHabiles));

}   
})
}
   
 logOut=()=>{

  this.props.dispatch(logOut())
  Router.push("/ingreso")
  localStorage.clear()

  }

  handleMember=(e)=>{
     
    let Membership = this.props.state.userReducer.update.usuario.user.Membresia
    let aprovedURL = ""


  if(e !=="/registro-contable"){
 
   if( Membership== "Gratuita"){
    
    let add = {
      Estado:true,
      Tipo:"error",
      Mensaje:"Solo Habilitado para cuentas Premium, contactese al 0992546367/092492619"
     }
     this.setState({Alert: add})
    }else if (Membership== "Premium"){
  
      Router.push(e)
    }
 
  }else{
    Router.push(e)
  }
 
  }
  DiaryFilter=(regs)=>{
    let fecha = new Date()
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
     
    let fecha = new Date()
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

  // Funciones para personalización de widgets
  toggleCustomizationPanel = () => {
    this.setState({
      showCustomizationPanel: !this.state.showCustomizationPanel
    });
  }

  updateWidgetVisibility = (widgetName, isVisible) => {
    this.setState({
      widgetConfig: {
        ...this.state.widgetConfig,
        [widgetName]: isVisible
      }
    });
  }

  updateChartType = (chartName, newType) => {
    this.setState({
      widgetConfig: {
        ...this.state.widgetConfig,
        [chartName]: newType
      }
    });
  }

  updateCustomColor = (colorName, newColor) => {
    this.setState({
      widgetConfig: {
        ...this.state.widgetConfig,
        customColors: {
          ...this.state.widgetConfig.customColors,
          [colorName]: newColor
        }
      }
    });
  }

  saveWidgetConfig = async () => {
    try {
      const userId = this.props.state.userReducer.update.usuario.user._id;
      
      const response = await fetch("/users/save-config", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          configType: 'widgets',
          configData: this.state.widgetConfig
        })
      });

      const result = await response.json();
      
      if (result.status === "Ok") {
        this.setState({
          Alert: {
            Estado: true,
            Tipo: "success",
            Mensaje: "Configuración de widgets guardada exitosamente"
          }
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      this.setState({
        Alert: {
          Estado: true,
          Tipo: "error",
          Mensaje: "Error al guardar configuración: " + error.message
        }
      });
    }
  }

  loadWidgetConfig = async () => {
    try {
      const userId = this.props.state.userReducer.update.usuario.user._id;
      
      const response = await fetch("/users/get-config", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId
        })
      });

      const result = await response.json();
      
      if (result.status === "Ok" && result.data.widgetConfig) {
        this.setState({
          widgetConfig: {
            ...this.state.widgetConfig,
            ...result.data.widgetConfig
          }
        });
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      // Si hay error, mantener la configuración por defecto
    }
  }
 render() {
  let nameUser = this.props.state.userReducer !=""? this.props.state.userReducer.update.usuario.user.Usuario:""
  const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
  const pieDoughnutLegendClickHandler =  Chart.overrides.pie.plugins.legend.onClick


let gasLabels = []
let arrGas = []
let arrGasCats = []
let arrIngCats = []
let ingLabels = []
let valoresArrIng = []
let valoresArrGas = []
let dataBar =[]
let dataBarGeneral =[]
let labelCat = []
let valCat = []
let coloresElegidos = []
let sumaGas=0
let sumaIng=0
let balanceTotal=0
let capitalTotal=0
let deberTotal=0
let ingresoActive = this.state.pieValue == "ingresos"?"ingresoActive":""
let gastoActive = this.state.pieValue == "gastos"?"gastoActive":""

// Inicialización de variables de liquidez
let liquidezLabels = [];
let liquidezData = [];
let DetallesPorrender = []; // Inicializar array vacío por defecto

if(this.props.state.RegContableReducer.Regs){
  DetallesPorrender = this.props.state.RegContableReducer.Regs.filter(x => {
   
    return x.TiempoEjecucion  !=0
  }
       ) 

 let DetallesIng = DetallesPorrender.filter(x => x.Accion=="Ingreso"   ) 
 let DetallesGas = DetallesPorrender.filter(x => x.Accion=="Gasto"   ) 

 


let LabelsLine =[]
let LabelsLineIng =[]



let grupoIngs=[]
let DetallesFilterIng =[]

if(DetallesIng.length > 0){
    if(this.state.tiempoValue == "diario"){
      DetallesFilterIng = this.DiaryFilter(DetallesIng)
    }else{
      DetallesFilterIng= this.MensualFilter(DetallesIng)
    }


  
  DetallesFilterIng.forEach(element => {
    arrIngCats.push(element.CatSelect._id)
    sumaIng += element.Importe
    let newtime 
    if(this.state.tiempoValue == "diario"){
       newtime = new Date(element.Tiempo).getHours()
    }
    else if(this.state.tiempoValue == "semanal" || this.state.tiempoValue == "mensual" ){
      newtime = new Date(element.Tiempo).getDate() 
   }

 
      let newStructureVal ={label:newtime,valor:element.Importe}
     let etiquetaExistente = grupoIngs.findIndex(x=> x.label == newtime )
    
     if(etiquetaExistente != -1){
      
      let newval = grupoIngs[etiquetaExistente].valor + element.Importe
      grupoIngs[etiquetaExistente] = {label:newtime,valor:newval}

     }else{
      grupoIngs.push(newStructureVal)
     }
   

    
  });



 
      
  
  
  let OrderLabels = grupoIngs.sort((a,b) => a.label - b.label) 

  
  if(this.state.tiempoValue == "diario"){
    ingLabels = OrderLabels.map(x=>AddCero(x.label) +":00")
  }else if(this.state.tiempoValue == "semanal" || this.state.tiempoValue == "mensual"   ){
    ingLabels = OrderLabels.map(x=>AddCero(x.label) )
  }
  valoresArrIng  = OrderLabels.map(x=>x.valor)
  
  }
  
let grupoGas=[]
let DetallesFilterGas =[]
  if(DetallesGas.length > 0){
    if(this.state.tiempoValue == "diario"){
      DetallesFilterGas = this.DiaryFilter(DetallesGas)
    }else{
      DetallesFilterGas = this.MensualFilter(DetallesGas)
    }
   
    DetallesFilterGas.forEach(element => {
      arrGasCats.push(element.CatSelect._id)
      sumaGas += element.Importe
      let newtime 
      if(this.state.tiempoValue == "diario"){
         newtime = new Date(element.Tiempo).getHours()
      }
      else if(this.state.tiempoValue == "semanal" || this.state.tiempoValue == "mensual" ){
        newtime = new Date(element.Tiempo).getDate() 
     }
  
  
        let newStructureVal ={label:newtime,valor:element.Importe}
       let etiquetaExistente = grupoGas.findIndex(x=> x.label == newtime )
      
       if(etiquetaExistente != -1){
        
        let newval = grupoGas[etiquetaExistente].valor + element.Importe
        grupoGas[etiquetaExistente] = {label:newtime,valor:newval}
  
       }else{
        grupoGas.push(newStructureVal)
       }
     
  
      
    });
  

    let OrderLabels = grupoGas.sort((a,b) => a.label - b.label) 
  
    
    if(this.state.tiempoValue == "diario"){
      gasLabels = OrderLabels.map(x=>AddCero(x.label) +":00")
    }else if(this.state.tiempoValue == "semanal" || this.state.tiempoValue == "mensual"   ){
      gasLabels = OrderLabels.map(x=>AddCero(x.label) )
    }
    valoresArrGas = OrderLabels.map(x=>x.valor)
    
    }

  let arrCatGeneral
  
  let detallesGenerales
  if(this.state.pieValue == "ingresos"){
    arrCatGeneral =arrIngCats
    detallesGenerales=DetallesFilterIng
  }else if(this.state.pieValue == "gastos"){
    arrCatGeneral =arrGasCats
    detallesGenerales=DetallesFilterGas
  }

  let sinRepetidosCats = arrCatGeneral.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);

 
  let Colores = [
    "red",
    "yellow",
    
    "orange",
    "lightGreen",
    '#00457E',
    
    "#2F70AF",
    "#806491",
  ]
  let ColoresIngresos = [
    "darkgreen",
    "#02315E",
    
    "#B9848C",
    "lightGreen",
    '#00457E',
    
    "#2F70AF",
  
   
    "#806491",
  ]

  if(this.props.state.RegContableReducer.Categorias){

  sinRepetidosCats.forEach((cat,i)=>{

   let catArr = this.props.state.RegContableReducer.Categorias.find(x=> x._id == cat )

   labelCat.push(catArr.nombreCat)
   let newsum = 0
   detallesGenerales.forEach(reg=>{
  
        if(cat == reg.CatSelect._id){
         
          newsum += reg.Importe
         
        }
    
      })
  
      valCat.push(newsum)
      if(this.state.pieValue == "ingresos"){
        coloresElegidos.push(ColoresIngresos[i])
      }else{
        coloresElegidos.push(Colores[i])
      }
    
  
  })
}

  
}
let LabelsBar =[]
if(this.props.state.RegContableReducer.Cuentas){

  let cuentasCapital = this.props.state.RegContableReducer.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal) > 0 && x.CheckedA && x.CheckedP)
  let cuentasDeber = this.props.state.RegContableReducer.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal) < 0 && x.CheckedP && x.CheckedA)
  if(cuentasCapital.length > 0){
    for(let i = 0; i < cuentasCapital.length; i++){
    capitalTotal  += parseFloat(cuentasCapital[i].DineroActual.$numberDecimal)
  }
    }
    if(cuentasDeber.length > 0){
   
      for(let i = 0; i < cuentasDeber.length; i++){
        deberTotal += parseFloat(cuentasDeber[i].DineroActual.$numberDecimal)
       
      }
    
      }


      balanceTotal = capitalTotal + deberTotal 

  // Cálculo simplificado de liquidez para el widget usando las variables ya inicializadas
  if (DetallesPorrender.length > 0) {
    let liquidezPorPeriodo = {};
    let acumuladoLiquidez = balanceTotal;
    
    // Filtrar transacciones según el tiempo seleccionado
    let transaccionesFiltradas;
    if (this.state.tiempoValue === "diario") {
      transaccionesFiltradas = this.DiaryFilter(DetallesPorrender);
    } else {
      transaccionesFiltradas = this.MensualFilter(DetallesPorrender);
    }
    
    // Solo ingresos y gastos, ordenados cronológicamente (más reciente primero)
    const transaccionesOrdenadas = transaccionesFiltradas
      .filter(x => x.Accion !== "Trans")
      .sort((a, b) => b.Tiempo - a.Tiempo);
    
    // Agrupar transacciones por periodo y calcular liquidez
    transaccionesOrdenadas.forEach(transaccion => {
      const fecha = new Date(transaccion.Tiempo);
      let periodo;
      
      if (this.state.tiempoValue === "diario") {
        periodo = fecha.getHours().toString().padStart(2, '0') + ":00";
      } else {
        periodo = fecha.getDate().toString();
      }
      
      // Solo almacenar el primer valor para cada periodo (el más reciente)
      if (!liquidezPorPeriodo[periodo]) {
        liquidezPorPeriodo[periodo] = acumuladoLiquidez;
      }
      
      // Restar del acumulado para obtener liquidez histórica
      if (transaccion.Accion === "Ingreso") {
        acumuladoLiquidez -= transaccion.Importe;
      } else if (transaccion.Accion === "Gasto") {
        acumuladoLiquidez += transaccion.Importe;
      }
    });
    
    // Ordenar periodos y crear arrays para el gráfico
    const periodosOrdenados = Object.keys(liquidezPorPeriodo).sort((a, b) => {
      if (this.state.tiempoValue === "diario") {
        // Para horas, ordenar numéricamente
        return parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]);
      }
      // Para días, ordenar numéricamente
      return parseInt(a) - parseInt(b);
    });
    
    liquidezLabels = periodosOrdenados;
    liquidezData = periodosOrdenados.map(periodo => liquidezPorPeriodo[periodo].toFixed(2));
  }

  this.props.state.RegContableReducer.Cuentas.filter(x=> x.DineroActual.$numberDecimal != "0" && x.DineroActual.$numberDecimal != "0.00" && x.CheckedP == true && x.Tipo != "Inventario" ).sort((a, b) =>parseFloat(b.DineroActual.$numberDecimal)  - parseFloat(a.DineroActual.$numberDecimal)).slice(0,10)
  .forEach(x=>{

    LabelsBar.push(x.NombreC)
    dataBar.push(x.DineroActual.$numberDecimal)

    

  })
}



    let superDataGas = {labels: gasLabels,
    datasets: [{
     
       data: valoresArrGas,
     
       borderColor:"white",
       borderWidth: 6,
    } ]  }
    let superDataIng = {labels: ingLabels,
      datasets: [{
       
         data: valoresArrIng,
       
         borderColor:"white",
         borderWidth: 6,
      } ]  }

      let superdatabar = {labels: LabelsBar,
      datasets: [{
        borderRadius: 20,
         data: dataBar,
         backgroundColor: "#5f57a3",
         borderColor:"white",
         borderWidth: 1,
      } ]  }

   
      let superdataPie = {labels: labelCat,
        datasets: [{
           label: '',
           data: valCat,
           backgroundColor: coloresElegidos
        } ]  }

      // Dataset para el widget de liquidez
      let superdataLiquidez = {
        labels: liquidezLabels,
        datasets: [{
          label: 'Evolución de Liquidez',
          data: liquidezData,
          borderColor: this.state.widgetConfig.customColors.liquidity,
          backgroundColor: this.state.widgetConfig.customColors.liquidity + '20',
          fill: this.state.widgetConfig.liquidityChartType === 'area',
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: this.state.widgetConfig.customColors.liquidity,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      };


  const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

    const Adminfunitem = ({icono, titulo, url})=>{
 
         return(
     
          <div className='contAdminfun' onClick={()=>{this.handleMember(url)}} ><a>
          <div className="adminitem">
            <div className="button__content ">
 <span className="material-icons icontarget">
 {icono}
 </span>
          
             </div>
             
       
          </div>
         
          </a>
          
          <p>{titulo}</p>
          <style >{`
             .contAdminfun{
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              color: white;
             }
             .button__content {
              position: relative;
            
         
              width: 100%;
              height: 100%;
             
              box-shadow: inset 0px -5px 0px #dddddd, 0px -8px 0px #f4f5f6;
              border-radius: 40px;
              transition: 0.13s ease-in-out;
              z-index: 1;
              display: flex;
              flex-flow: column;
              justify-content: space-around;

             }
            
       .adminitem{
         color: black;
     

     margin: 5px 8px;
     align-items: center;
     display: flex;
     flex-flow: column;
     justify-content: space-around;
     text-align: center;
     height: 50px;
    
     background:snow;
  
    width: 70px;
     border:2px solid #888888;
     outline:none;
     background-color:#f4f5f6;
     border-radius: 40px;
     box-shadow:  -0px 0px 5px #ffffff, -0px -0px 5px #ffffff, -0px 0px 5px #ffffff, 1px 5px 5px rgba(0,0,0,0.2);
     transition: .13s ease-in-out;
     cursor:pointer;
     margin-bottom: 15px;
 }
     .icontarget{
      
     
      font-size: 25px;
      margin-bottom:5px;

      color: grey;
      text-align: center;
    
      transition:1s
       }
       .adminitem a{
         width:30%;
       }
  .adminitem:active{
    box-shadow:none;
    
  
  }
  .button__content:active{
    box-shadow:none;
  
  }

   `}
 
   </style>
          </div> 
        
         )
     }

     const a11yProps =(index)=> {
      return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
      };
    }

    const handleChangeIndex = (index, data) => {
     
     this.setState({tiempoValue:data})
    };

    const handleChangeIndexPie = (index, data) => {
     
      this.setState({pieValue:data})
     };

    // Componente del Panel de Personalización de Widgets
    const CustomizationPanel = () => {
      return (
        <Dialog 
          open={this.state.showCustomizationPanel} 
          onClose={this.toggleCustomizationPanel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <SettingsIcon style={{ marginRight: 8 }} />
              <Typography variant="h6">Personalizar Dashboard</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              
              {/* Sección de Visibilidad de Widgets */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom style={{ color: '#004a9b', marginBottom: 16 }}>
                  Mostrar/Ocultar Widgets
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.widgetConfig.showIncomeChart}
                      onChange={(e) => this.updateWidgetVisibility('showIncomeChart', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Gráfico de Ingresos"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.widgetConfig.showExpenseChart}
                      onChange={(e) => this.updateWidgetVisibility('showExpenseChart', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Gráfico de Gastos"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.widgetConfig.showPieChart}
                      onChange={(e) => this.updateWidgetVisibility('showPieChart', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Gráfico Circular"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.widgetConfig.showBarChart}
                      onChange={(e) => this.updateWidgetVisibility('showBarChart', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Gráfico de Barras"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.widgetConfig.showLiquidityChart}
                      onChange={(e) => this.updateWidgetVisibility('showLiquidityChart', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Evolución de Liquidez"
                />
              </Grid>

              {/* Sección de Tipos de Gráficos */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom style={{ color: '#004a9b', marginTop: 16, marginBottom: 16 }}>
                  Tipos de Gráficos
                </Typography>
              </Grid>

              {this.state.widgetConfig.showIncomeChart && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo Gráfico Ingresos</InputLabel>
                    <Select
                      value={this.state.widgetConfig.incomeChartType}
                      onChange={(e) => this.updateChartType('incomeChartType', e.target.value)}
                    >
                      <MenuItem value="line">Línea</MenuItem>
                      <MenuItem value="bar">Barras</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {this.state.widgetConfig.showExpenseChart && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo Gráfico Gastos</InputLabel>
                    <Select
                      value={this.state.widgetConfig.expenseChartType}
                      onChange={(e) => this.updateChartType('expenseChartType', e.target.value)}
                    >
                      <MenuItem value="line">Línea</MenuItem>
                      <MenuItem value="bar">Barras</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {this.state.widgetConfig.showPieChart && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo Gráfico Circular</InputLabel>
                    <Select
                      value={this.state.widgetConfig.pieChartType}
                      onChange={(e) => this.updateChartType('pieChartType', e.target.value)}
                    >
                      <MenuItem value="pie">Pastel</MenuItem>
                      <MenuItem value="doughnut">Dona</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {this.state.widgetConfig.showBarChart && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo Gráfico Barras</InputLabel>
                    <Select
                      value={this.state.widgetConfig.barChartType}
                      onChange={(e) => this.updateChartType('barChartType', e.target.value)}
                    >
                      <MenuItem value="bar">Barras Verticales</MenuItem>
                      <MenuItem value="horizontalBar">Barras Horizontales</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {this.state.widgetConfig.showLiquidityChart && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo Gráfico Liquidez</InputLabel>
                    <Select
                      value={this.state.widgetConfig.liquidityChartType}
                      onChange={(e) => this.updateChartType('liquidityChartType', e.target.value)}
                    >
                      <MenuItem value="line">Línea</MenuItem>
                      <MenuItem value="area">Área</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleCustomizationPanel} color="secondary">
              Cancelar
            </Button>
            <Button onClick={() => {
              this.saveWidgetConfig();
              this.toggleCustomizationPanel();
            }} color="primary" variant="contained">
              Guardar Configuración
            </Button>
          </DialogActions>
        </Dialog>
      );
    };

  return(
 
  <div className='fondoAdmin'> 
  <div className='contenedorPrincipal'>
 
     
     
     <div className='balanceCont'>
    
    
      <div className='contDinero'>
        

      <p>$ {balanceTotal.toFixed(2)}</p>
<span>Saldo Disponible</span>
      </div>

   
<div className="adminitemConts">
<Adminfunitem icono="attach_money" titulo="Cuentas" url="/registro-contable" />
  <Adminfunitem icono="app_registration" titulo="Inventario" url="/inventario" />

  <Adminfunitem icono="local_atm" titulo="P.Venta" url="/punto-de-venta" />
 {/* <Adminfunitem icono="local_grocery_store" titulo="E-market" url="/administrador/control-compras" />*/}
  {/*<Adminfunitem icono="book" titulo="Blogg" url="/blog" />*/}
</ div>

     </ div>

<div className='glassStyle'>



<div className='contenedorEstadisticas'>
<div className='contFiltros'>
<AppBar position="static" color="default">
        <Tabs
          value={this.state.tiempoValue}
          onChange={handleChangeIndex}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab value={"diario"}  label="Diario" {...a11yProps(0)} />
         
          <Tab  value={"mensual"} label="Mensual" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      </div>
      <div className='contCuadros'>
        {this.state.widgetConfig.showIncomeChart && (
        <div className={`cuadroPlantilla cuadroIngreso ${ingresoActive}`}>
          <div className='contTextoscuadro'>
            <div className='jwFlex tituloCard'>
            <i className="material-icons ">
            trending_up
</i>
            <span className='cuadroTituloPlantilla tituloIngreso'> Ingresos </span>
            </div>
      
          <span className='valorCuadro'>${sumaIng.toFixed(2)}</span>
          </div>
          <div className="centrar contLineChart" onClick={()=>{
            
           
            if(this.state.pieValue == "ingresos"){
              this.setState({pieValue:"gastos"})
            }else{
              this.setState({pieValue:"ingresos"})
            }
            
            }}>
{this.state.widgetConfig.incomeChartType === 'line' ? (
<Line data={superDataIng}   options={{
   tension: 0.4,
  responsive: true,
  maintainAspectRatio: false,

      plugins: {
        legend: {
     
          display: false,
        },
       
      },
     scales: {
                            yAxes:{
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'white',
                                    fontSize: 12,
                                }
                            },
                            xAxes: {
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                    display:false,
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'white',
                                    fontSize: 12,
                                }
                            },
                        }
    }} />
) : (
<Bar data={superDataIng} options={{
   responsive: true,
  maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
     scales: {
                            yAxes:{
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'white',
                                    fontSize: 12,
                                }
                            },
                            xAxes: {
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                    display:false,
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'white',
                                    fontSize: 12,
                                }
                            },
                        }
    }} />
)}
</div>
          </div>  
        )}
       
        {this.state.widgetConfig.showExpenseChart && (
          <div className={`cuadroPlantilla cuadroGasto ${gastoActive}`}>
          <div className='contTextoscuadro'>
          <div className='jwFlex tituloCard'>
            <i className="material-icons ">
            trending_down
</i>
            <span className='cuadroTituloPlantilla tituloIngreso'> Gastos </span>
            </div>
          <span className='valorCuadro'>${sumaGas.toFixed(2)}</span>
          </div>
          <div className="centrar contLineChart" onClick={()=>{
            
            
            if(this.state.pieValue == "gastos"){
              this.setState({pieValue:"ingresos"})
            }else{
              this.setState({pieValue:"gastos"})
            }
            }}>
{this.state.widgetConfig.expenseChartType === 'line' ? (
<Line data={superDataGas}   options={{
   tension: 0.4,
  responsive: true,
  maintainAspectRatio: false,

      plugins: {
        legend: {
     
          display: false,
        },
       
      },
     scales: {
                            yAxes:{
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'white',
                                    fontSize: 12,
                                }
                            },
                            xAxes: {
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                    display:false,
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'White',
                                    fontSize: 12,
                                }
                            },
                        }
    }} />
) : (
<Bar data={superDataGas} options={{
   responsive: true,
  maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
     scales: {
                            yAxes:{
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'white',
                                    fontSize: 12,
                                }
                            },
                            xAxes: {
                                grid: {
                                    drawBorder: true,
                                    color: '#FFFFFF',
                                    display:false,
                                },
                                ticks:{
                                    beginAtZero: true,
                                    color: 'White',
                                    fontSize: 12,
                                }
                            },
                        }
    }} />
)}
</div>
          </div> 
        )}
      </div>
</div>

</div>
{this.state.widgetConfig.showPieChart && (
<div className='glassStyle custonPieCont'>

      <div className='contPie'>
<Pie data={superdataPie} plugins={[ChartDataLabels]}  options={{
  maintainAspectRatio : false,
  responsive: true,
      cutoutPercentage: 80,
 
      plugins: {
      
        legend : {
          labels:{
            fontColor:"black"
          },
          onClick:   (e, legendItem, legend) =>{
           
  
         
            const index = legendItem.datasetIndex;
            const type = legend.chart.config.type;
          
            if (type === 'pie' || type === 'doughnut') {
              pieDoughnutLegendClickHandler(e, legendItem, legend)
            } else {
              defaultLegendClickHandler(e, legendItem, legend);
            }
          
            
      
          },
          position: 'right',
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
</div>
)}
{this.state.widgetConfig.showBarChart && (
<div className='glassStyle custonBarrasCuentas'>
<Bar data={superdatabar}   options={{
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes:{
        grid: {
            drawBorder: true,
            color: '#FFFFFF',
        
        },
        ticks:{
            beginAtZero: true,
            color: 'white',
            fontSize: 12,
        }
    },
    xAxes: {
        grid: {
            drawBorder: true,
            color: '#FFFFFF',
            display:false,
        },
        ticks:{
            beginAtZero: true,
            color: 'black',
            fontSize: 15,
        }
    },
},
plugins: {
  legend: {

    display: false,
  },
 
},
}} />
</div>
)}

{/* Widget de Liquidez */}
{this.state.widgetConfig.showLiquidityChart && (
<div className='glassStyle custonLiquidezCont'>
  <div className='contLiquidez'>
    <div className='headerLiquidez'>
      <div className='jwFlex tituloCard'>
        <i className="material-icons">
          trending_up
        </i>
        <span className='tituloLiquidez'>Evolución de Liquidez</span>
      </div>
    </div>
    <div className="centrar contLiquidezChart">
      <Line 
        data={superdataLiquidez}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => `Liquidez: $${context.parsed.y}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(255,255,255,0.1)',
              },
              ticks: {
                color: 'white',
                callback: function(value) {
                  return '$' + value;
                }
              }
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'white',
              }
            }
          }
        }}
      />
    </div>
  </div>
</div>
)}

     </div>
     <div className="contbarra">


<div className="contagregador" onClick={()=>{this.setState({modalagregador:true})}}>
<img src='/barraicons/addbutton.png' className="customPrinbar jwPointer" />


</div>
</div>
  
{this.state.modalagregador && <Modal updateData={()=>{ }}  cuentaToAdd={this.state.cuentaToAdd}  flechafun={()=>{this.setState({modalagregador:false})}}/>
  }

  {/* Panel de Personalización */}
  <CustomizationPanel />
  
  {/* Botón Flotante para Personalización */}
  <Fab 
    color="primary" 
    aria-label="personalizar" 
    onClick={this.toggleCustomizationPanel}
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      background: 'linear-gradient(45deg, #004a9b 30%, #0066cc 90%)',
      color: 'white'
    }}
  >
    <SettingsIcon />
  </Fab>

   <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>    
    </Alert>
  </Snackbar>
  <style jsx>{`
   
.balanceCont{
 
}
.contCuadros{
  display: flex;
  flex-wrap:wrap;
    justify-content: center;
}
.contTextoscuadro{
  display: flex;
justify-content: space-between;
align-items: flex-end;
padding: 0px 25px;
}
.valorCuadro{
font-size:25px
}
.glassStyle{
  background: rgba(255,255,255,0.3);
 
  backdrop-filter: blur(7px);
  border: 1px solid rgba(255,255,255,0.3);

  margin:10px;
  
  border-radius: 20px ;

 
  padding-top: 20px;
}

.custonBarrasCuentas{
  height: 300px;

  width: 100%;
  
  max-width: 765px;
}
.custonPieCont{
  width: 100%;
  max-width: 450px;
  height:300px
}

.custonLiquidezCont{
  width: 100%;
  max-width: 600px;
  height: 350px;
}

.contLiquidez{
  height: 90%;
  padding: 10px 20px;
}

.headerLiquidez{
  margin-bottom: 10px;
}

.tituloLiquidez{
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.contLiquidezChart{
  height: 85%;
}
 
  .adminitemConts{
    display:flex;
    justify-content: space-around;
    margin-top: 10px;
    flex-wrap:wrap;}
  
.contenedorPrincipal{
  width: 100%;
  justify-content: space-around;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}
.contDinero{
  padding-left: 20px;
  color: white;
  margin-bottom: 20px;
}
.contDinero p{
 
    font-size: calc(25px + 2vw);
    margin-bottom: 5px;
} 

.tituloData{
  font-size: calc(25px + 1vw);
  color: #004a9b;
  font-weight:bolder;
}
.cuadroPlantilla {
  height: 200px;
  margin: 5px;
  width: 100%;
  max-width: 285px;
    border-radius: 15px;
    cursor:pointer;
    color: white;
    padding: 5px;
    border-bottom: 3px solid black;
    transition:1s;
}
.contPie{
  margin-top:20px;
  height: 90%;
}
.cuadroIngreso{
  
  background-image: linear-gradient(17deg,#8cf73a 0%,#0bed18 100%)
}
.cuadroGasto{
 
  background-image: linear-gradient(17deg,#f1586e 0%,#fb0000 100%);
}
.contFiltros{
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
  width: 98%;
}

.contenedorEstadisticas{
  display: flex;
    flex-flow: column;
    align-items: center;
}
.tituloCard{
  width: 100px;
    justify-content: space-around;
    align-items: center;

}

.tituloCard i{
  font-size: 30px;
}
.ingresoActive{
  box-shadow: 0px 0px 8px 3px green;
  height: 210px;

}
.gastoActive{
  box-shadow: 0px 0px 8px 3px red;
  height: 210px;

}
@media only screen and (min-width: 950px) {
  .contCuadros{  flex-wrap:nowrap;}

}

  `
  
  
  }</style>
  </ div>
   
 
  )
   }
 }



 const mapStateToProps = state=>  {
   
  return {
      state
  }
};
 export default connect(mapStateToProps)(admins)