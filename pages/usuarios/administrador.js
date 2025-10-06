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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Fab, Grid, Typography, Box, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';



class admins extends Component {
  state = {
    modalagregador:false,
   
    pieValue:"gastos",
    barValue:"liquidez", // liquidez (posesión) o noliquidez (no posesión)
    cuentaToAdd:{},
    Alert:{Estado:false},
    tiempoValue:"diario",
    
    // Estados para personalización de widgets estilo Apple
    editMode: false, // Modo de edición de widgets
    showWidgetMenu: false, // Menú desplegable de widgets
    showAddWidgetsPanel: false, // Panel para agregar widgets
    showCustomizationPanel: false,
    draggedWidget: null, // Widget que se está arrastrando
    // Estados para touch (móvil)
    touchStartPos: null,
    touchTargetWidget: null,
    isDragging: false,
    touchStartTime: null,
  widgetOrder: ['showTimeFilter', 'showIncomeChart', 'showExpenseChart', 'showPieChart', 'showBarChart', 'showLiquidityChart', 'showPatrimonioChart'], // Orden de widgets
    widgetConfig: {
      showTimeFilter: true, // Nuevo widget de filtros de tiempo
      showIncomeChart: true,
      showExpenseChart: true,
      showPieChart: true,
      showBarChart: true,
      showLiquidityChart: true, // Nuevo widget de liquidez
  showPatrimonioChart: true, // Nuevo widget de patrimonio (siempre visible)
      incomeChartType: 'line', // line, bar, area
      expenseChartType: 'line',
      pieChartType: 'pie', // pie, doughnut
      barChartType: 'bar', // bar, horizontalBar
      liquidityChartType: 'line', // line, area
      patrimonioChartType: 'line', // line, area
      customColors: {
        income: '#8cf73a',
        expense: '#f1586e',
        liquidity: '#00d4aa', // Color para liquidez
        patrimonio: '#9c27b0', // Color para patrimonio (púrpura)
        pieColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    },
    // Estado para trackear cuentas ocultas en el bar chart
    hiddenBarChartAccounts: {},
    // Estado de conexión offline
    isOnline: true,
    offlineMode: false,
    showOfflineNotification: false
   }
   
   // Referencias para los charts
   chartRefs = {};
   
   channel2 = null;
   
   // Funciones para validación offline del usuario
   getOfflineUserData = () => {
     // Verificar que estemos en el cliente antes de usar localStorage
     if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
       return null;
     }
     
     try {
       const savedData = localStorage.getItem('offlineUserData');
       if (savedData) {
         const userData = JSON.parse(savedData);
         // Verificar que los datos no sean muy antiguos (24 horas)
         const now = new Date().getTime();
         const maxAge = 24 * 60 * 60 * 1000; // 24 horas
         
         if (now - userData.timestamp < maxAge) {
           console.log('💾 [ADMIN-OFFLINE] Datos del usuario recuperados desde offline');
           return userData.usuario;
         } else {
           console.log('⏰ [ADMIN-OFFLINE] Datos del usuario expirados, limpiando');
           localStorage.removeItem('offlineUserData');
         }
       }
     } catch (error) {
       console.error('Error recuperando usuario offline:', error);
     }
     return null;
   }

   getUserForRequest = () => {
     // Intentar obtener usuario desde Redux
     if (this.props.state.userReducer?.update?.usuario?.user?.DBname) {
       return this.props.state.userReducer.update.usuario;
     }
     
     // Si no está en Redux, intentar desde offline
     const offlineUser = this.getOfflineUserData();
     if (offlineUser) {
       console.log('🔄 [ADMIN-OFFLINE] Usando usuario desde datos offline');
       return offlineUser;
     }
     
     return null;
   }

   // 🌐 Configurar listeners para eventos de red
   setupNetworkListeners = () => {
     if (typeof window !== 'undefined') {
       // Estado inicial de la conexión
       this.setState({ isOnline: navigator.onLine });
       
       // Event listener para cuando se pierde la conexión
       window.addEventListener('offline', this.handleOffline);
       
       // Event listener para cuando se recupera la conexión
       window.addEventListener('online', this.handleOnline);
       
       console.log('🌐 [NETWORK] Listeners configurados, estado inicial:', navigator.onLine ? 'Online' : 'Offline');
     }
   }

   // 📶 Manejar evento de pérdida de conexión
   handleOffline = () => {
     console.log('📴 [NETWORK] Conexión perdida - activando modo offline');
     this.setState({ 
       isOnline: false, 
       offlineMode: true,
       showOfflineNotification: true 
     });
     
     // Evitar redirects automáticos
     if (typeof window !== 'undefined') {
       window.history.replaceState(null, '', window.location.pathname);
     }
   }

   // 📶 Manejar evento de recuperación de conexión
   handleOnline = () => {
     console.log('📶 [NETWORK] Conexión recuperada - modo online');
     this.setState({ 
       isOnline: true, 
       offlineMode: false,
       showOfflineNotification: false 
     });
   }

   // 🧹 Cleanup de event listeners
   componentWillUnmount() {
     if (typeof window !== 'undefined') {
       window.removeEventListener('offline', this.handleOffline);
       window.removeEventListener('online', this.handleOnline);
     }
   }
   
   componentDidMount(){
    // 🌐 Configurar event listeners para detectar cambios de conexión
    this.setupNetworkListeners();

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
  // Validar usuario antes de hacer la petición
  const usuario = this.getUserForRequest();
  if (!usuario) {
    console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para getMontRegs, saltando petición');
    return;
  }
  
  let datos = {
    User: {DBname: usuario.user.DBname,
      Tipo: usuario.user.Tipo, 
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
"x-access-token": usuario.token
}
}).then(res => {
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
})
.catch(error => {
  console.error('Error en getMontRegs:', error);
  console.log('🔴 [ADMIN-OFFLINE] Sin conexión a servidor, usando datos offline si están disponibles');
  return null; // Retornar null en lugar de undefined
})
.then(response => {  
  // Verificar que tenemos una respuesta válida
  if (!response) {
    console.log('📵 [ADMIN-OFFLINE] No hay respuesta del servidor, saltando actualización');
    return;
  }
  
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
  // Validar usuario antes de hacer la petición
  const usuario = this.getUserForRequest();
  if (!usuario) {
    console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para exeRegs, saltando petición');
    return;
  }
   
  let datos = {User: {DBname: usuario.user.DBname,
    Tipo: usuario.user.Tipo, 
    tiempo:new Date().getTime()
  
  }}
let lol = JSON.stringify(datos)

fetch("/cuentas/exeregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json',
"x-access-token": usuario.token
}
}).then(res => {
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
})
.catch(error => {
  console.error('Error en exeRegs:', error);
  console.log('🔴 [ADMIN-OFFLINE] Sin conexión a servidor para exeRegs');
  return null;
})
.then(response => {  
  // Verificar que tenemos una respuesta válida
  if (!response) {
    console.log('📵 [ADMIN-OFFLINE] No hay respuesta del servidor, saltando ejecución de registros');
    return;
  }

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
 // Validar usuario antes de hacer la petición
 const usuario = this.getUserForRequest();
 if (!usuario) {
   console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para getCuentasyCats, saltando petición');
   return;
 }
 
  let datos = {User: {DBname: usuario.user.DBname,
    Tipo: usuario.user.Tipo}}
let lol = JSON.stringify(datos)
  let settings = {
    method: 'POST', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": usuario.token
    }
  }

  fetch("/cuentas/getCuentasyCats", settings).then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .catch(error => {
    console.error('Error en getCuentasyCats:', error);
    console.log('🔴 [ADMIN-OFFLINE] Sin conexión a servidor para getCuentasyCats');
    return null;
  })
  .then(response => {  
    // Verificar que tenemos una respuesta válida
    if (!response) {
      console.log('📵 [ADMIN-OFFLINE] No hay respuesta del servidor, saltando actualización de cuentas y categorías');
      return;
    }
  
    if(response.status == 'error'){}
    else if(response.status == 'Ok'){
    //  this.props.dispatch(getVentas(response.ventasHabiles));       
    this.props.dispatch(getcats(response.catHabiles)); 
    this.props.dispatch(getcuentas(response.cuentasHabiles)); 
    
    }

  })
}
   getAllregs=()=>{
   // Validar usuario antes de hacer la petición
   const usuario = this.getUserForRequest();
   if (!usuario) {
     console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para getAllregs, saltando petición');
     return;
   }
   
    let datos = {User: {DBname: usuario.user.DBname,
      Tipo: usuario.user.Tipo   }}
let lol = JSON.stringify(datos)

fetch("/cuentas/getregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json',
"x-access-token": usuario.token
}
}).then(res => {
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
})
.catch(error => {
  console.error('Error en getAllregs:', error);
  console.log('🔴 [ADMIN-OFFLINE] Sin conexión a servidor para getAllregs');
  return null;
})
.then(response => {  
  // Verificar que tenemos una respuesta válida
  if (!response) {
    console.log('📵 [ADMIN-OFFLINE] No hay respuesta del servidor, saltando actualización de registros');
    return;
  }

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
    // Validar usuario antes de verificar membresía
    const usuario = this.getUserForRequest();
    if (!usuario) {
      console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para handleMember, usando membresía por defecto');
      return;
    }
     
    let Membership = usuario.user.Membresia
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

  // Limpieza al desmontar componente
  componentWillUnmount() {
    // Restaurar scroll por seguridad
    this.restorePageScroll();
    
    // Remover listeners globales si existen
    document.removeEventListener('touchmove', this.handleTouchMoveGlobal);
    document.removeEventListener('touchend', this.handleTouchEndGlobal);
  }

  updateWidgetVisibility = (widgetName, isVisible) => {
    this.setState(prevState => {
      let newWidgetOrder = [...prevState.widgetOrder];
      
      if (isVisible && !newWidgetOrder.includes(widgetName)) {
        // Agregar widget al final del orden
        newWidgetOrder.push(widgetName);
      } else if (!isVisible && newWidgetOrder.includes(widgetName)) {
        // Remover widget del orden
        newWidgetOrder = newWidgetOrder.filter(widget => widget !== widgetName);
      }

      return {
        widgetConfig: {
          ...prevState.widgetConfig,
          [widgetName]: isVisible
        },
        widgetOrder: newWidgetOrder
      };
    }, () => {
      // Guardar configuración después de actualizar el estado
      this.saveWidgetConfig();
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

  // Funciones para modo de edición estilo Apple
  toggleAddWidgetsPanel = () => {
    this.setState({
      showAddWidgetsPanel: !this.state.showAddWidgetsPanel,
      editMode: false // Salir del modo edición al agregar widgets
      // Mantener showWidgetMenu abierto para seguir usando opciones
    }, () => {
      console.log('🟢 New showAddWidgetsPanel state:', this.state.showAddWidgetsPanel);
    });
  }

  toggleWidgetMenu = () => {
    this.setState({
      showWidgetMenu: !this.state.showWidgetMenu
    });
  }

  removeWidget = (widgetName) => {
    this.setState({
      widgetConfig: {
        ...this.state.widgetConfig,
        [widgetName]: false
      }
    }, () => {
      // Guardar configuración después de actualizar el estado
      this.saveWidgetConfig();
    });
  }

  // Función para manejar eliminación de widgets con soporte móvil
  handleRemoveWidgetClick = (e, widgetName) => {
    e.preventDefault();
    e.stopPropagation();
    this.removeWidget(widgetName);
  }

  handleRemoveWidgetTouch = (e, widgetName) => {
    e.preventDefault();
    e.stopPropagation();
    this.removeWidget(widgetName);
  }

  addWidget = (widgetName) => {
    this.setState({
      widgetConfig: {
        ...this.state.widgetConfig,
        [widgetName]: true
      },
      showAddWidgetsPanel: false
    }, () => {
      // Guardar configuración después de actualizar el estado
      this.saveWidgetConfig();
    });
  }

  // Función de emergencia para restaurar scroll si algo falla
  restorePageScroll = () => {
    // Restaurar estilos del body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.top = '';
    
    // Restaurar posición del scroll si se guardó
    if (this.scrollPosition !== undefined) {
      window.scrollTo(0, this.scrollPosition);
      this.scrollPosition = undefined; // Limpiar después de usar
    }
  }

  // Limpiar al salir del modo edición
  toggleEditMode = () => {
    // Si se está saliendo del modo edición, restaurar scroll por seguridad
    if (this.state.editMode) {
      this.restorePageScroll();
    }
    
    this.setState({
      editMode: !this.state.editMode,
      showAddWidgetsPanel: false // Cerrar panel de agregar si está abierto
      // Mantener showWidgetMenu abierto para seguir usando opciones
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
      // Validar usuario antes de hacer la petición
      const usuario = this.getUserForRequest();
      if (!usuario) {
        console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para saveWidgetConfig, saltando petición');
        return;
      }
      
      const userId = usuario.user._id;
      
      const configData = {
        widgetConfig: this.state.widgetConfig,
        widgetOrder: this.state.widgetOrder,
        tiempoValue: this.state.tiempoValue,
        pieValue: this.state.pieValue,
        barValue: this.state.barValue
      };
      
      console.log('Guardando configuración:', configData);
      
      const response = await fetch("/users/save-config", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          configType: 'widgets',
          configData: configData
        })
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      
      if (result.status === "Ok") {
        console.log('Configuración de widgets guardada exitosamente');
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
      // Validar usuario antes de hacer la petición
      const usuario = this.getUserForRequest();
      if (!usuario) {
        console.log('❌ [ADMIN-OFFLINE] No hay usuario válido para loadWidgetConfig, usando configuración por defecto');
        return;
      }
      
      const userId = usuario.user._id;
      console.log('Cargando configuración para usuario:', userId);
      
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
      console.log('Configuración cargada desde servidor:', result);
      
      if (result.status === "Ok" && result.data) {
        // Manejo de datos cuando están anidados bajo 'widgets'
        if (result.data.widgets) {
          console.log('Usando formato anidado de configuración');
          
          if (result.data.widgets.widgetConfig) {
            // Migración automática: asegurar que nuevos widgets estén incluidos
            const migratedConfig = {
              ...this.state.widgetConfig, // valores por defecto
              ...result.data.widgets.widgetConfig, // configuración guardada
              // Forzar widgets nuevos si no existen
              showTimeFilter: result.data.widgets.widgetConfig.showTimeFilter !== undefined 
                ? result.data.widgets.widgetConfig.showTimeFilter 
                : true,
              showPatrimonioChart: result.data.widgets.widgetConfig.showPatrimonioChart !== undefined 
                ? result.data.widgets.widgetConfig.showPatrimonioChart 
                : false,
              patrimonioChartType: result.data.widgets.widgetConfig.patrimonioChartType || 'line',
              // Migración de colores
              customColors: {
                ...this.state.widgetConfig.customColors,
                ...result.data.widgets.widgetConfig.customColors,
                patrimonio: result.data.widgets.widgetConfig.customColors?.patrimonio || '#9c27b0'
              }
            };
            
            this.setState({
              widgetConfig: migratedConfig,
              tiempoValue: result.data.widgets.tiempoValue || this.state.tiempoValue,
              pieValue: result.data.widgets.pieValue || this.state.pieValue,
              barValue: result.data.widgets.barValue || this.state.barValue
            });
          }
          
          if (result.data.widgets.widgetOrder) {
            // Migración del orden: asegurar widgets nuevos
            let migratedOrder = result.data.widgets.widgetOrder;
            
            // Asegurar showTimeFilter
            if (!migratedOrder.includes('showTimeFilter')) {
              migratedOrder = ['showTimeFilter', ...migratedOrder];
            }
            
            // Agregar showPatrimonioChart si está activo pero no en el orden
            if (result.data.widgets.widgetConfig && 
                result.data.widgets.widgetConfig.showPatrimonioChart && 
                !migratedOrder.includes('showPatrimonioChart')) {
              migratedOrder.push('showPatrimonioChart');
            }
            
            console.log('Cargando orden de widgets migrado:', migratedOrder);
            this.setState({
              widgetOrder: migratedOrder
            });
          } else {
            // Sin orden previo en formato anidado, crear orden predeterminado
            const defaultOrder = ['showTimeFilter', 'showUtilidadChart', 'showVentasChart', 'showInventarioChart', 'showCostoChart'];
            
            // Agregar patrimonio al orden por defecto si está activo
            if (result.data.widgets.widgetConfig && result.data.widgets.widgetConfig.showPatrimonioChart) {
              defaultOrder.push('showPatrimonioChart');
            }
            
            this.setState({
              widgetOrder: defaultOrder
            });
          }
        }
        // Manejo de datos cuando están directamente en data (formato antiguo)
        else {
          if (result.data.widgetConfig) {
            // Migración automática: asegurar que nuevos widgets estén incluidos
            const migratedConfig = {
              ...this.state.widgetConfig, // valores por defecto
              ...result.data.widgetConfig, // configuración guardada
              // Forzar widgets nuevos si no existen
              showTimeFilter: result.data.widgetConfig.showTimeFilter !== undefined 
                ? result.data.widgetConfig.showTimeFilter 
                : true,
              showPatrimonioChart: result.data.widgetConfig.showPatrimonioChart !== undefined 
                ? result.data.widgetConfig.showPatrimonioChart 
                : false,
              patrimonioChartType: result.data.widgetConfig.patrimonioChartType || 'line',
              // Migración de colores
              customColors: {
                ...this.state.widgetConfig.customColors,
                ...result.data.widgetConfig.customColors,
                patrimonio: result.data.widgetConfig.customColors?.patrimonio || '#9c27b0'
              }
            };
            
            this.setState({
              widgetConfig: migratedConfig,
              tiempoValue: result.data.tiempoValue || this.state.tiempoValue,
              pieValue: result.data.pieValue || this.state.pieValue,
              barValue: result.data.barValue || this.state.barValue
            });
          }
          
          if (result.data.widgetOrder) {
            // Migración del orden: asegurar que showTimeFilter esté incluido
            let migratedOrder = result.data.widgetOrder;
            if (!migratedOrder.includes('showTimeFilter')) {
              migratedOrder = ['showTimeFilter', ...migratedOrder];
            }
            // Agregar showPatrimonioChart si está activo pero no en el orden
            if (result.data.widgetConfig && 
                result.data.widgetConfig.showPatrimonioChart && 
                !migratedOrder.includes('showPatrimonioChart')) {
              migratedOrder.push('showPatrimonioChart');
            }
            console.log('Cargando orden de widgets migrado:', migratedOrder);
            this.setState({
              widgetOrder: migratedOrder
            });
          } else {
            // Sin orden previo, crear orden predeterminado con todos los widgets disponibles
            const defaultOrder = ['showTimeFilter', 'showUtilidadChart', 'showVentasChart', 'showInventarioChart', 'showCostoChart'];
            
            // Agregar patrimonio al orden por defecto si está activo
            if (result.data.widgetConfig && result.data.widgetConfig.showPatrimonioChart) {
              defaultOrder.push('showPatrimonioChart');
            }
            
            this.setState({
              widgetOrder: defaultOrder
            });
          }
        }
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      // Si hay error, mantener la configuración por defecto
    }
  }

  // Funciones para drag & drop de widgets (Desktop)
  handleDragStart = (e, widgetName) => {
    this.setState({ draggedWidget: widgetName });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    
    // Agregar clase visual de arrastre
    e.target.classList.add('dragging');
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDrop = (e, targetWidget) => {
    e.preventDefault();
    const draggedWidget = this.state.draggedWidget;
    
    if (draggedWidget && draggedWidget !== targetWidget) {
      const currentOrder = [...this.state.widgetOrder];
      const draggedIndex = currentOrder.indexOf(draggedWidget);
      const targetIndex = currentOrder.indexOf(targetWidget);
      
      // Reordenar el array
      currentOrder.splice(draggedIndex, 1);
      currentOrder.splice(targetIndex, 0, draggedWidget);
      
      this.setState({ 
        widgetOrder: currentOrder,
        draggedWidget: null 
      }, () => {
        this.saveWidgetConfig();
      });
    }
    
    // Remover clase visual de arrastre
    e.target.classList.remove('dragging');
  }

  handleDragEnd = (e) => {
    this.setState({ draggedWidget: null });
    
    // Remover clase visual de arrastre
    e.target.classList.remove('dragging');
  }

  // Funciones para touch events (Mobile)
  handleTouchStart = (e, widgetName) => {
    if (!this.state.editMode) return;
    
    // SOLO PREVENIR SI ES EL ÍCONO DE ARRASTRE - Si no, permitir scroll normal
    const isDragIcon = e.target.closest('.drag-handle') || e.target.classList.contains('drag-handle');
    
    if (!isDragIcon) {
      // Si no es el ícono de arrastre, permitir comportamiento normal (scroll)
      return;
    }
    
    // Solo si ES el ícono de arrastre, prevenir y bloquear scroll
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    this.setState({ 
      draggedWidget: widgetName,
      touchStartPos: { x: touch.clientX, y: touch.clientY },
      isDragging: false,
      touchStartTime: Date.now()
    });
    
    console.log('🟡 Touch start en ícono de arrastre:', widgetName);
    
    // BLOQUEAR SCROLL DE LA PÁGINA COMPLETAMENTE (solo para ícono de arrastre)
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Agregar clase visual
    e.currentTarget.closest('[data-widget-name]').classList.add('dragging');
    
    // Agregar listeners globales para capturar movimiento fuera del elemento
    document.addEventListener('touchmove', this.handleTouchMoveGlobal, { passive: false });
    document.addEventListener('touchend', this.handleTouchEndGlobal, { passive: false });
  }

  // Nueva función específica para manejar touch en el ícono de arrastre
  handleDragIconTouchStart = (e, widgetName) => {
    if (!this.state.editMode) return;
    
    // ✅ BLOQUEAR SCROLL INMEDIATAMENTE para evitar el "flash" inicial en móviles reales
    e.preventDefault();
    e.stopPropagation();
    
    // BLOQUEAR scroll temporalmente (se puede restaurar si no hay drag real)
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    this.scrollPosition = scrollY;
    
    const touch = e.touches[0];
    this.setState({ 
      draggedWidget: widgetName,
      touchStartPos: { x: touch.clientX, y: touch.clientY },
      isDragging: false,
      touchStartTime: Date.now()
    });
    
    console.log('🟡 Touch start en ícono de arrastre:', widgetName, '- Scroll bloqueado inmediatamente');
    
    // Agregar clase visual
    const widgetElement = e.target.closest('[data-widget-name]');
    if (widgetElement) {
      widgetElement.classList.add('dragging');
    }
    
    // Agregar listeners globales para capturar movimiento fuera del elemento
    document.addEventListener('touchmove', this.handleTouchMoveGlobal, { passive: false });
    document.addEventListener('touchend', this.handleTouchEndGlobal, { passive: false });
  }

  handleTouchMove = (e) => {
    // Esta función ahora está vacía, usamos la global
  }

  handleTouchMoveGlobal = (e) => {
    if (!this.state.draggedWidget) return;
    
    // Prevenir scroll de la página
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const startPos = this.state.touchStartPos;
    
    // Calcular distancia movida
    const deltaX = Math.abs(touch.clientX - startPos.x);
    const deltaY = Math.abs(touch.clientY - startPos.y);
    const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Considerar drag si se mueve más de 15px
    if (totalDelta > 15) {
      if (!this.state.isDragging) {
        console.log('🔵 Confirmando drag real - scroll ya estaba bloqueado');
        
        // ✅ El scroll ya está bloqueado desde handleDragIconTouchStart
        // Solo marcamos como isDragging = true
        this.setState({ isDragging: true });
      }
      
      // Encontrar el elemento debajo del dedo
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const widgetElement = elementBelow?.closest('[data-widget-name]');
      
      if (widgetElement) {
        const targetWidget = widgetElement.getAttribute('data-widget-name');
        if (targetWidget !== this.state.draggedWidget) {
          console.log('🟢 Target widget:', targetWidget);
          this.setState({ touchTargetWidget: targetWidget });
          
          // Agregar feedback visual temporal
          document.querySelectorAll('[data-widget-name]').forEach(el => {
            el.style.transform = '';
            el.style.opacity = '';
          });
          
          if (elementBelow) {
            widgetElement.style.transform = 'scale(1.05)';
            widgetElement.style.opacity = '0.8';
          }
        }
      }
    }
  }

  handleTouchEnd = (e) => {
    // Esta función ahora está vacía, usamos la global
  }

  handleTouchEndGlobal = (e) => {
    if (!this.state.draggedWidget) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Remover listeners globales
    document.removeEventListener('touchmove', this.handleTouchMoveGlobal);
    document.removeEventListener('touchend', this.handleTouchEndGlobal);
    
    const draggedWidget = this.state.draggedWidget;
    const targetWidget = this.state.touchTargetWidget;
    const timeDiff = Date.now() - this.state.touchStartTime;
    
    console.log('🔴 Touch end - Dragged:', draggedWidget, 'Target:', targetWidget, 'IsDragging:', this.state.isDragging);
    
    // Determinar si hubo reordenamiento exitoso
    const wasReordered = this.state.isDragging && targetWidget && draggedWidget !== targetWidget && timeDiff > 200;
    
    // Solo reordenar si realmente se arrastró, hay un target válido y no fue un tap rápido
    if (wasReordered) {
      const currentOrder = [...this.state.widgetOrder];
      const draggedIndex = currentOrder.indexOf(draggedWidget);
      const targetIndex = currentOrder.indexOf(targetWidget);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        console.log('🟢 Reordenando de', draggedIndex, 'a', targetIndex);
        
        // Reordenar el array
        currentOrder.splice(draggedIndex, 1);
        currentOrder.splice(targetIndex, 0, draggedWidget);
        
        this.setState({ 
          widgetOrder: currentOrder
        }, () => {
          this.saveWidgetConfig();
          
          // 🎯 RESTAURAR SCROLL PERO LUEGO IR AL WIDGET REORDENADO
          this.restorePageScroll();
          
          setTimeout(() => {
            const movedWidgetElement = document.querySelector(`[data-widget-name="${draggedWidget}"]`);
            if (movedWidgetElement) {
              movedWidgetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' // Centrar el widget en la pantalla
              });
              console.log('📍 Scroll a widget reordenado:', draggedWidget);
            }
          }, 100); // Delay corto para que termine el restore
        });
      }
    } else {
      // Si NO hubo reordenamiento, simplemente restaurar a la posición original
      this.restorePageScroll();
    }
    
    // Limpiar todos los estilos temporales
    document.querySelectorAll('[data-widget-name]').forEach(el => {
      el.style.transform = '';
      el.style.opacity = '';
      el.classList.remove('dragging');
    });
    
    // Limpiar estado
    this.setState({ 
      draggedWidget: null,
      touchTargetWidget: null,
      isDragging: false,
      touchStartPos: null,
      touchStartTime: null
    });
  }

 render() {
  // Obtener usuario de forma segura para el render
  const usuario = this.getUserForRequest();
  let nameUser = usuario && usuario.user ? usuario.user.Usuario : ""
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

// Inicialización de variables de patrimonio
let patrimonioLabels = [];
let patrimonioData = [];

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
    sumaIng += (parseFloat(element.Importe) || 0)
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
      sumaGas += (parseFloat(element.Importe) || 0)
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

  // Cálculo específico de liquidez solo con cuentas de posesión
  let balanceLiquidez = capitalTotal + deberTotal; // Solo cuentas de posesión (CheckedP && CheckedA)

  // Cálculo simplificado de liquidez para el widget usando las variables ya inicializadas
  if (DetallesPorrender.length > 0) {
    // Obtener IDs de cuentas de posesión y no posesión
    const cuentasPosesionIds = this.props.state.RegContableReducer.Cuentas
      .filter(cuenta => cuenta.CheckedP && cuenta.CheckedA)
      .map(cuenta => cuenta._id);
      
    const cuentasNoPosesionIds = this.props.state.RegContableReducer.Cuentas
      .filter(cuenta => !cuenta.CheckedP || !cuenta.CheckedA)
      .map(cuenta => cuenta._id);
    
    let liquidezPorPeriodo = {};
    let acumuladoLiquidez = balanceLiquidez; // Usar balance de liquidez (solo cuentas de posesión)
    
    // Filtrar transacciones según el tiempo seleccionado
    let transaccionesFiltradas;
    if (this.state.tiempoValue === "diario") {
      transaccionesFiltradas = this.DiaryFilter(DetallesPorrender);
    } else {
      transaccionesFiltradas = this.MensualFilter(DetallesPorrender);
    }
    
    // Incluir transacciones que afecten la liquidez:
    // 1. Ingresos y gastos en cuentas de posesión
    // 2. Transferencias entre cuentas de posesión y no posesión
    const transaccionesLiquidez = transaccionesFiltradas.filter(x => {
      // Ingresos y gastos en cuentas de posesión
      if (x.Accion !== "Trans" && x.CuentaSelec && cuentasPosesionIds.includes(x.CuentaSelec.idCuenta)) {
        return true;
      }
      
      // Transferencias que afectan la liquidez
      if (x.Accion === "Trans" && x.CuentaSelec && x.CuentaSelec2) {
        const cuentaOrigenEsPosesion = cuentasPosesionIds.includes(x.CuentaSelec.idCuenta);
        const cuentaDestinoEsPosesion = cuentasPosesionIds.includes(x.CuentaSelec2.idCuenta);
        
        // Solo incluir transferencias que cambien la liquidez:
        // - De No posesión a Posesión (aumenta liquidez)
        // - De Posesión a No posesión (disminuye liquidez)
        return (!cuentaOrigenEsPosesion && cuentaDestinoEsPosesion) || 
               (cuentaOrigenEsPosesion && !cuentaDestinoEsPosesion);
      }
      
      return false;
    });
                   
    // Ordenar cronológicamente (más reciente primero)
    const transaccionesOrdenadas = transaccionesLiquidez
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
      
      // Calcular el impacto en la liquidez según el tipo de transacción
      if (transaccion.Accion === "Ingreso") {
        acumuladoLiquidez -= transaccion.Importe;
      } else if (transaccion.Accion === "Gasto") {
        acumuladoLiquidez += transaccion.Importe;
      } else if (transaccion.Accion === "Trans") {
        // Para transferencias, determinar si aumenta o disminuye la liquidez
        const cuentaOrigenEsPosesion = cuentasPosesionIds.includes(transaccion.CuentaSelec.idCuenta);
        const cuentaDestinoEsPosesion = cuentasPosesionIds.includes(transaccion.CuentaSelec2.idCuenta);
        
        if (!cuentaOrigenEsPosesion && cuentaDestinoEsPosesion) {
          // De No posesión a Posesión: aumenta liquidez (restar del acumulado histórico)
          acumuladoLiquidez -= transaccion.Importe;
        } else if (cuentaOrigenEsPosesion && !cuentaDestinoEsPosesion) {
          // De Posesión a No posesión: disminuye liquidez (sumar al acumulado histórico)
          acumuladoLiquidez += transaccion.Importe;
        }
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
    liquidezData = periodosOrdenados.map(periodo => (parseFloat(liquidezPorPeriodo[periodo]) || 0).toFixed(2));
  }

  // Cálculo de patrimonio total (todas las cuentas)
  if (DetallesPorrender.length > 0) {
    // Calcular patrimonio total actual (todas las cuentas)
    let patrimonioTotal = 0;
    if(this.props.state.RegContableReducer.Cuentas){
      this.props.state.RegContableReducer.Cuentas.forEach(cuenta => {
        patrimonioTotal += parseFloat(cuenta.DineroActual.$numberDecimal || 0);
      });
    }
    
    let patrimonioPorPeriodo = {};
    let acumuladoPatrimonio = patrimonioTotal;
    
    // Filtrar transacciones según el tiempo seleccionado
    let transaccionesFiltradas;
    if (this.state.tiempoValue === "diario") {
      transaccionesFiltradas = this.DiaryFilter(DetallesPorrender);
    } else {
      transaccionesFiltradas = this.MensualFilter(DetallesPorrender);
    }
    
    // Incluir todas las transacciones que afecten el patrimonio (ingresos, gastos y transferencias)
    const transaccionesPatrimonio = transaccionesFiltradas
      .filter(x => x.Accion !== "Trans") // Solo ingresos y gastos (las transferencias no cambian el patrimonio total)
      .sort((a, b) => b.Tiempo - a.Tiempo);
    
    // Agrupar transacciones por periodo y calcular patrimonio
    transaccionesPatrimonio.forEach(transaccion => {
      const fecha = new Date(transaccion.Tiempo);
      let periodo;
      
      if (this.state.tiempoValue === "diario") {
        periodo = fecha.getHours().toString().padStart(2, '0') + ":00";
      } else {
        periodo = fecha.getDate().toString();
      }
      
      // Solo almacenar el primer valor para cada periodo (el más reciente)
      if (!patrimonioPorPeriodo[periodo]) {
        patrimonioPorPeriodo[periodo] = acumuladoPatrimonio;
      }
      
      // Calcular el impacto en el patrimonio histórico
      if (transaccion.Accion === "Ingreso") {
        acumuladoPatrimonio -= transaccion.Importe;
      } else if (transaccion.Accion === "Gasto") {
        acumuladoPatrimonio += transaccion.Importe;
      }
    });
    
    // Ordenar periodos y crear arrays para el gráfico
    const periodosOrdenadosPatrimonio = Object.keys(patrimonioPorPeriodo).sort((a, b) => {
      if (this.state.tiempoValue === "diario") {
        // Para horas, ordenar numéricamente
        return parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]);
      }
      // Para días, ordenar numéricamente
      return parseInt(a) - parseInt(b);
    });
    
    patrimonioLabels = periodosOrdenadosPatrimonio;
    patrimonioData = periodosOrdenadosPatrimonio.map(periodo => (parseFloat(patrimonioPorPeriodo[periodo]) || 0).toFixed(2));
  }

  // Construir datos para el gráfico de barras según la selección
  let cuentasFiltradas;
  if (this.state.barValue === "liquidez") {
    // Cuentas con liquidez (posesión)
    cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x=> 
      x.DineroActual.$numberDecimal != "0" && 
      x.DineroActual.$numberDecimal != "0.00" && 
      x.CheckedP == true && 
      x.CheckedA == true &&
      x.Tipo != "Inventario" 
    );
  } else if (this.state.barValue === "noliquidez") {
    // Cuentas sin liquidez (no posesión) - INCLUIR inventario ya que no es líquido
    cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x=> 
      x.DineroActual.$numberDecimal != "0" && 
      x.DineroActual.$numberDecimal != "0.00" && 
      (x.CheckedP == false || x.CheckedA == false || x.Tipo == "Inventario") // ✅ Incluir inventario
    );
  } else {
    // Por defecto, mostrar cuentas con liquidez
    cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x=> 
      x.DineroActual.$numberDecimal != "0" && 
      x.DineroActual.$numberDecimal != "0.00" && 
      x.CheckedP == true && 
      x.CheckedA == true &&
      x.Tipo != "Inventario" 
    );
  }
  
  cuentasFiltradas
    .sort((a, b) => parseFloat(b.DineroActual.$numberDecimal) - parseFloat(a.DineroActual.$numberDecimal))
    .slice(0,10)
    .forEach(x=>{
      LabelsBar.push(x.NombreC)
      dataBar.push(x.DineroActual.$numberDecimal)
    });
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

      // Dataset para el widget de patrimonio
      let superdataPatrimonio = {
        labels: patrimonioLabels,
        datasets: [{
          label: 'Evolución de Patrimonio',
          data: patrimonioData,
          borderColor: this.state.widgetConfig.customColors.patrimonio,
          backgroundColor: this.state.widgetConfig.customColors.patrimonio + '20',
          fill: false, // Siempre mostrar como línea
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: this.state.widgetConfig.customColors.patrimonio,
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
     
     this.setState({tiempoValue:data}, () => {
       this.saveWidgetConfig();
     });
    };

    const handleChangeIndexPie = (index, data) => {
     
      this.setState({pieValue:data}, () => {
        this.saveWidgetConfig();
      });
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
                      checked={this.state.widgetConfig.showTimeFilter}
                      onChange={(e) => this.updateWidgetVisibility('showTimeFilter', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Filtros de Tiempo"
                />
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

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.widgetConfig.showPatrimonioChart}
                      onChange={(e) => this.updateWidgetVisibility('showPatrimonioChart', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Evolución de Patrimonio"
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

    // Panel para Agregar Widgets estilo Apple con Previews
    const AddWidgetsPanel = () => {
      const availableWidgets = [
        { 
          key: 'showTimeFilter', 
          name: 'Filtros de Tiempo', 
          description: 'Controles para filtrar datos por Diario/Mensual', 
          icon: '📅',
          color: '#2196f3',
          preview: 'Pestañas para seleccionar período temporal'
        },
        { 
          key: 'showIncomeChart', 
          name: 'Gráfico de Ingresos', 
          description: 'Muestra la evolución de ingresos en el tiempo', 
          icon: '📈',
          color: '#8cf73a',
          preview: 'Línea ascendente mostrando crecimiento de ingresos'
        },
        { 
          key: 'showExpenseChart', 
          name: 'Gráfico de Gastos', 
          description: 'Muestra la evolución de gastos en el tiempo', 
          icon: '📉',
          color: '#f1586e',
          preview: 'Línea mostrando fluctuaciones de gastos'
        },
        { 
          key: 'showPieChart', 
          name: 'Gráfico Circular', 
          description: 'Distribución de gastos por categorías', 
          icon: '🥧',
          color: '#36A2EB',
          preview: 'Gráfico circular con divisiones por categoría'
        },
        { 
          key: 'showBarChart', 
          name: 'Gráfico de Barras', 
          description: 'Comparación de cuentas con/sin liquidez', 
          icon: '📊',
          color: '#FFCE56',
          preview: 'Barras mostrando top 10 cuentas por tipo'
        },
        { 
          key: 'showLiquidityChart', 
          name: 'Evolución de Liquidez', 
          description: 'Seguimiento de liquidez y capital disponible', 
          icon: '💧',
          color: '#00d4aa',
          preview: 'Gráfico de área mostrando evolución de liquidez'
        },
        { 
          key: 'showPatrimonioChart', 
          name: 'Evolución de Patrimonio', 
          description: 'Seguimiento del patrimonio total (todas las cuentas)', 
          icon: '💎',
          color: '#9c27b0',
          preview: 'Gráfico mostrando evolución del patrimonio total'
        }
      ];

      const hiddenWidgets = availableWidgets.filter(widget => !this.state.widgetConfig[widget.key]);

      const renderWidgetPreview = (widget) => {
        return (
          <Box 
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${widget.color}20`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Preview específico para cada tipo de widget */}
            {widget.key === 'showTimeFilter' && (
              <svg width="100" height="60" style={{ opacity: 0.7 }}>
                <rect x="10" y="20" width="30" height="20" fill={widget.color} rx="3" opacity="0.8" />
                <rect x="50" y="20" width="35" height="20" fill="none" stroke={widget.color} strokeWidth="2" rx="3" />
                <text x="25" y="32" fill="white" fontSize="8" textAnchor="middle">DIA</text>
                <text x="67" y="32" fill={widget.color} fontSize="8" textAnchor="middle">MES</text>
              </svg>
            )}
            
            {widget.key === 'showIncomeChart' && (
              <svg width="100" height="60" style={{ opacity: 0.7 }}>
                <polyline 
                  points="10,50 30,40 50,25 70,15 90,10" 
                  fill="none" 
                  stroke={widget.color} 
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="90" cy="10" r="3" fill={widget.color} />
              </svg>
            )}
            
            {widget.key === 'showExpenseChart' && (
              <svg width="100" height="60" style={{ opacity: 0.7 }}>
                <polyline 
                  points="10,20 30,30 50,25 70,40 90,45" 
                  fill="none" 
                  stroke={widget.color} 
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="90" cy="45" r="3" fill={widget.color} />
              </svg>
            )}
            
            {widget.key === 'showPieChart' && (
              <svg width="80" height="80" style={{ opacity: 0.7 }}>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#e0e0e0" strokeWidth="15" />
                <circle 
                  cx="40" cy="40" r="30" 
                  fill="none" 
                  stroke={widget.color} 
                  strokeWidth="15"
                  strokeDasharray="56 188"
                  transform="rotate(-90 40 40)"
                />
                <circle 
                  cx="40" cy="40" r="30" 
                  fill="none" 
                  stroke="#36A2EB" 
                  strokeWidth="15"
                  strokeDasharray="47 188"
                  strokeDashoffset="-56"
                  transform="rotate(-90 40 40)"
                />
              </svg>
            )}
            
            {widget.key === 'showBarChart' && (
              <Box style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '60px' }}>
                <Box style={{ width: '12px', height: '40px', backgroundColor: widget.color, borderRadius: '2px 2px 0 0' }} />
                <Box style={{ width: '12px', height: '25px', backgroundColor: '#f1586e', borderRadius: '2px 2px 0 0' }} />
                <Box style={{ width: '12px', height: '50px', backgroundColor: widget.color, borderRadius: '2px 2px 0 0' }} />
                <Box style={{ width: '12px', height: '35px', backgroundColor: '#f1586e', borderRadius: '2px 2px 0 0' }} />
              </Box>
            )}
            
            {widget.key === 'showLiquidityChart' && (
              <svg width="100" height="60" style={{ opacity: 0.7 }}>
                <defs>
                  <linearGradient id="liquidityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={widget.color} stopOpacity="0.8"/>
                    <stop offset="100%" stopColor={widget.color} stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M 10,40 Q 30,20 50,30 T 90,25 L 90,50 L 10,50 Z" 
                  fill="url(#liquidityGradient)"
                  stroke={widget.color}
                  strokeWidth="2"
                />
              </svg>
            )}

            {widget.key === 'showPatrimonioChart' && (
              <svg width="100" height="60" style={{ opacity: 0.7 }}>
                <defs>
                  <linearGradient id="patrimonioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={widget.color} stopOpacity="0.8"/>
                    <stop offset="100%" stopColor={widget.color} stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M 10,45 Q 25,25 40,35 Q 55,15 70,20 Q 85,30 90,15 L 90,50 L 10,50 Z" 
                  fill="url(#patrimonioGradient)"
                  stroke={widget.color}
                  strokeWidth="2"
                />
              </svg>
            )}
            
            {/* Icono en la esquina */}
            <Box 
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '16px',
                opacity: 0.8
              }}
            >
              {widget.icon}
            </Box>
          </Box>
        );
      };

      return (
        <Dialog 
          open={this.state.showAddWidgetsPanel} 
          onClose={this.toggleAddWidgetsPanel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <AddIcon style={{ marginRight: 8, color: '#004a9b' }} />
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Agregar Widgets al Dashboard
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
              Selecciona los widgets que deseas agregar a tu dashboard
            </Typography>
          </DialogTitle>
          <DialogContent>
            {hiddenWidgets.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Box style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</Box>
                <Typography variant="h6" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                  ¡Todos los widgets están activos!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Actualmente tienes todos los widgets disponibles en tu dashboard
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {hiddenWidgets.map((widget) => (
                  <Grid item xs={12} sm={6} key={widget.key}>
                    <Box 
                      onClick={() => this.addWidget(widget.key)}
                      style={{
                        padding: '20px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = widget.color;
                        e.currentTarget.style.backgroundColor = '#fafbff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,74,155,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Preview del Widget */}
                      {renderWidgetPreview(widget)}
                      
                      {/* Información del Widget */}
                      <Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="8px">
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#333' }}>
                            {widget.name}
                          </Typography>
                          <Box 
                            style={{
                              backgroundColor: widget.color,
                              color: 'white',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px'
                            }}
                          >
                            <AddIcon style={{ fontSize: '16px' }} />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.4 }}>
                          {widget.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button 
              onClick={this.toggleAddWidgetsPanel} 
              color="primary"
              variant="outlined"
              style={{ borderRadius: '8px', marginRight: '12px' }}
            >
              Cerrar
            </Button>
            <Button
              onClick={() => {
                // Configuración por defecto de widgets
                this.setState({
                  widgetConfig: {
                    showTimeFilter: true,
                    showIncomeChart: true,
                    showExpenseChart: true,
                    showPieChart: true,
                    showBarChart: true,
                    showLiquidityChart: true,
                    showPatrimonioChart: true,
                    incomeChartType: 'line',
                    expenseChartType: 'line',
                    pieChartType: 'pie',
                    barChartType: 'bar',
                    liquidityChartType: 'line',
                    patrimonioChartType: 'line',
                    customColors: {
                      income: '#8cf73a',
                      expense: '#f1586e',
                      liquidity: '#00d4aa',
                      patrimonio: '#9c27b0',
                      pieColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                    }
                  },
                  widgetOrder: [
                    'showTimeFilter',
                    'showIncomeChart',
                    'showExpenseChart',
                    'showPieChart',
                    'showBarChart',
                    'showLiquidityChart',
                    'showPatrimonioChart'
                  ]
                }, () => {
                  this.saveWidgetConfig();
                  this.toggleAddWidgetsPanel();
                });
              }}
              color="secondary"
              variant="contained"
              style={{ borderRadius: '8px' }}
            >
              Restablecer widgets
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
        

      <p>$ {(parseFloat(balanceTotal) || 0).toFixed(2)}</p>
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

<div className='glassStyle widgetResponsive' style={{ position: 'absolute', top: '-9999px', visibility: 'hidden' }}>

{/* Contenedor para widgets que SÍ necesitan filtros de tiempo - MANTENIDO PARA FUNCIONALIDAD */}
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
        {/* Los widgets de ingresos y gastos fueron movidos a contenedores independientes */}
        
      </div>
</div>

</div>

{/* Contenedor unificado para TODOS los widgets - se pueden reordenar entre todos */}
<div className='contenedorWidgetsUnificado'>
  {/* Renderizar TODOS los widgets en el orden especificado */}
  {this.state.widgetOrder.map((widgetName, index) => {
    
    // Widget de Filtros de Tiempo
    if (widgetName === 'showTimeFilter' && this.state.widgetConfig.showTimeFilter) {
      return (
        <div key="timeFilter" className='glassStyle widgetResponsive' style={{ order: index }}>
          <div 
            style={{ position: 'relative' }}
            data-widget-name="showTimeFilter"
            draggable={this.state.editMode}
            onDragStart={(e) => this.handleDragStart(e, 'showTimeFilter')}
            onDragOver={this.handleDragOver}
            onDrop={(e) => this.handleDrop(e, 'showTimeFilter')}
            onDragEnd={this.handleDragEnd}
          >
            {/* Botón de eliminación estilo Apple */}
            {this.state.editMode && (
              <IconButton
                onClick={(e) => this.handleRemoveWidgetClick(e, 'showTimeFilter')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showTimeFilter')}
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  zIndex: 1002,
                  padding: '8px',
                  minWidth: '40px',
                  minHeight: '40px',
                  '&:hover': {
                    backgroundColor: '#d50000'
                  }
                }}
                size="small"
              >
                <CloseIcon style={{ fontSize: '18px' }} />
              </IconButton>
            )}

            {/* Indicador de arrastre en modo edición */}
            {this.state.editMode && (
              <DragIndicatorIcon 
                className="drag-handle"
                onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showTimeFilter')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  color: '#666',
                  opacity: 0.9,
                  fontSize: '48px', // 🔥 Más grande
                  cursor: 'grab',
                  padding: '12px', // 🔥 Más padding para área de toque
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                  border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra
                  transition: 'all 0.2s ease',
                  zIndex: 1010, // 🔥 ADELANTE DE TODO - más alto que la fecha
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'scale(1.05)'
                  },
                  // 🔥 Área táctil mínima
                  minWidth: '64px',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}

            {/* Contenido del widget de filtros de tiempo */}
            <div className='contenedorEstadisticas' style={{ 
              pointerEvents: this.state.editMode ? 'none' : 'auto',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '15px 0'
            }}>
              <div className='contFiltros' style={{
                margin: '0 auto', // 🔥 Solo centrar el contenido existente
                textAlign: 'center' // 🔥 Centrar texto para PC
              }}>
                <AppBar position="static" color="default" style={{ 
                  pointerEvents: this.state.editMode ? 'none' : 'auto'
                }}>
                  <Tabs
                    value={this.state.tiempoValue}
                    onChange={handleChangeIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    style={{ 
                      pointerEvents: this.state.editMode ? 'none' : 'auto'
                    }}
                  >
                    <Tab value={"diario"} label="Diario" {...a11yProps(0)} />
                    <Tab value={"mensual"} label="Mensual" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                
                {/* Indicador de fecha animado */}
                <div style={{
                  padding: '15px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: this.state.tiempoValue === 'diario' ? 'translateY(0)' : 'translateY(0)',
                  opacity: 1
                }}>
                  {this.state.tiempoValue === 'diario' ? (
                    <div style={{
                      animation: 'fadeInScale 0.6s ease-out',
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {new Date().getDate()}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        opacity: 0.9,
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      animation: 'fadeInScale 0.6s ease-out',
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {new Date().toLocaleDateString('es-ES', { month: 'long' })}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        opacity: 0.9,
                        letterSpacing: '1px'
                      }}>
                        {new Date().getFullYear()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Widget de Ingresos
    if (widgetName === 'showIncomeChart' && this.state.widgetConfig.showIncomeChart) {
      return (
        <div key="income" className='glassStyle widgetResponsive' style={{ 
          order: index,
          display: 'flex',
          justifyContent: 'center', // 🔥 Centrar horizontalmente
          alignItems: 'center', // 🔥 Centrar verticalmente
          padding: '5px' // 🔥 Padding súper mínimo
        }}>
          <div className='contCuadros' style={{
            width: '98%', // 🔥 Aumentado al 98% (máximo posible)
            maxWidth: '600px', // 🔥 Ancho máximo muy grande
            minWidth: '350px' // 🔥 Ancho mínimo aumentado
          }}>
            <div 
              className={`cuadroPlantilla cuadroIngreso ${ingresoActive}`} 
              style={{ 
                position: 'relative',
                height: 'auto', // 🔥 Altura automática y responsiva
                minHeight: '220px', // 🔥 Altura mínima menor para móvil
                maxHeight: '420px', // 🔥 Altura máxima limitada para PC
                display: 'flex', // 🔥 Flexbox para mejor control
                flexDirection: 'column', // 🔥 Dirección vertical
                margin: '18px 8px', // 🔥 Margen horizontal igual al de Gastos para separación uniforme
                boxShadow: '0 4px 16px 0 #8cf73a33' // 🔥 Sombra verde más visible y compatible
              }}
              data-widget-name="showIncomeChart"
              draggable={this.state.editMode}
              onDragStart={(e) => this.handleDragStart(e, 'showIncomeChart')}
              onDragOver={this.handleDragOver}
              onDrop={(e) => this.handleDrop(e, 'showIncomeChart')}
              onDragEnd={this.handleDragEnd}
            >
              {/* Botón de eliminación estilo Apple */}
              {this.state.editMode && (
                <IconButton
                  onClick={(e) => this.handleRemoveWidgetClick(e, 'showIncomeChart')}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showIncomeChart')}
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    zIndex: 1002,
                    padding: '8px',
                    minWidth: '40px',
                    minHeight: '40px',
                    '&:hover': {
                      backgroundColor: '#d50000'
                    }
                  }}
                  size="small"
                >
                  <CloseIcon style={{ fontSize: '18px' }} />
                </IconButton>
              )}

              {/* Indicador de arrastre en modo edición */}
              {this.state.editMode && (
                <DragIndicatorIcon 
                  className="drag-handle"
                  onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showIncomeChart')}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    color: '#666',
                    opacity: 0.9,
                    fontSize: '48px', // 🔥 Más grande
                    cursor: 'grab',
                    padding: '12px', // 🔥 Más padding
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                    border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra
                    transition: 'all 0.2s ease',
                    zIndex: 1010, // 🔥 ADELANTE DE TODO
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      transform: 'scale(1.05)'
                    },
                    // 🔥 Área táctil mínima
                    minWidth: '64px',
                    minHeight: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              )}

              <div className='contTextoscuadro'>
                <div className='tituloContenedor'>
                  <p>Ingresos</p>
                </div>
                <div className='valorCuadro'>
                  <p>$ {(parseFloat(sumaIng) || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className='contLIneChart' style={{
                height: '70%', // 🔥 Más contenido dentro del recuadro
                width: '100%', // 🔥 Que no se salga horizontalmente
                overflow: 'hidden', // 🔥 Oculta el desborde
                flex: '1', // 🔥 Tomar el espacio restante disponible
                minHeight: '120px' // 🔥 Altura mínima menor para móvil
              }}> {/* 🔥 Ajustado para respetar el contenedor verde */}
                {this.state.widgetConfig.incomeChartType === 'line' ? (
                  <Line data={superDataIng} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      yAxes:{ grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } },
                      xAxes: { grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } }
                    }
                  }} />
                ) : (
                  <Bar data={superDataIng} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      yAxes:{ grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } },
                      xAxes: { grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } }
                    }
                  }} />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Widget de Gastos
    if (widgetName === 'showExpenseChart' && this.state.widgetConfig.showExpenseChart) {
      return (
        <div key="expense" className='glassStyle widgetResponsive' style={{ 
          order: index,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px'
        }}>
          <div className='contCuadros' style={{
            width: '98%',
            maxWidth: '600px',
            minWidth: '350px'
          }}>
            <div 
              className={`cuadroPlantilla cuadroGasto ${gastoActive}`} 
              style={{ 
                position: 'relative',
                height: 'auto',
                minHeight: '220px',
                maxHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                margin: '18px 8px',
                boxShadow: '0 4px 16px 0 #f1586e33'
              }}
              data-widget-name="showExpenseChart"
              draggable={this.state.editMode}
              onDragStart={(e) => this.handleDragStart(e, 'showExpenseChart')}
              onDragOver={this.handleDragOver}
              onDrop={(e) => this.handleDrop(e, 'showExpenseChart')}
              onDragEnd={this.handleDragEnd}
            >
              {/* Botón de eliminación estilo Apple */}
              {this.state.editMode && (
                <IconButton
                  onClick={(e) => this.handleRemoveWidgetClick(e, 'showExpenseChart')}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showExpenseChart')}
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    zIndex: 1002,
                    padding: '8px',
                    minWidth: '40px',
                    minHeight: '40px',
                    '&:hover': {
                      backgroundColor: '#d50000'
                    }
                  }}
                  size="small"
                >
                  <CloseIcon style={{ fontSize: '18px' }} />
                </IconButton>
              )}

              {/* Indicador de arrastre en modo edición */}
              {this.state.editMode && (
                <DragIndicatorIcon 
                  className="drag-handle"
                  onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showExpenseChart')}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    color: '#666',
                    opacity: 0.9,
                    fontSize: '48px', // 🔥 Más grande
                    cursor: 'grab',
                    padding: '12px', // 🔥 Más padding
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                    border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra
                    transition: 'all 0.2s ease',
                    zIndex: 1010, // 🔥 ADELANTE DE TODO
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      transform: 'scale(1.05)'
                    },
                    // 🔥 Área táctil mínima
                    minWidth: '64px',
                    minHeight: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              )}

              <div className='contTextoscuadro'>
                <div className='tituloContenedor'>
                  <p>Gastos</p>
                </div>
                <div className='valorCuadro'>
                  <p>$ {(parseFloat(sumaGas) || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className='contLIneChart' style={{height:'85%'}}>
                {this.state.widgetConfig.expenseChartType === 'line' ? (
                  <Line data={superDataGas} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      yAxes:{ grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } },
                      xAxes: { grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } }
                    }
                  }} />
                ) : (
                  <Bar data={superDataGas} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      yAxes:{ grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } },
                      xAxes: { grid: { drawBorder: true, color: '#FFFFFF' }, ticks:{ beginAtZero: true, color: 'white', fontSize: 12 } }
                    }
                  }} />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Widget de Pie Chart
    if (widgetName === 'showPieChart' && this.state.widgetConfig.showPieChart) {
      return (
        <div key="pie" className='glassStyle custonPieCont widgetResponsive' style={{ order: index }}>
          <div 
            style={{ position: 'relative' }}
            data-widget-name="showPieChart"
            draggable={this.state.editMode}
            onDragStart={(e) => this.handleDragStart(e, 'showPieChart')}
            onDragOver={this.handleDragOver}
            onDrop={(e) => this.handleDrop(e, 'showPieChart')}
            onDragEnd={this.handleDragEnd}
          >
            {/* Botón de eliminación estilo Apple */}
            {this.state.editMode && (
              <IconButton
                onClick={(e) => this.handleRemoveWidgetClick(e, 'showPieChart')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showPieChart')}
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  zIndex: 1002,
                  padding: '8px',
                  minWidth: '40px',
                  minHeight: '40px',
                  '&:hover': {
                    backgroundColor: '#d50000'
                  }
                }}
                size="small"
              >
                <CloseIcon style={{ fontSize: '18px' }} />
              </IconButton>
            )}

            {/* Indicador de arrastre en modo edición */}
            {this.state.editMode && (
              <DragIndicatorIcon 
                className="drag-handle"
                onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showPieChart')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  color: '#666',
                  opacity: 0.9,
                  fontSize: '48px', // 🔥 Más grande
                  cursor: 'grab',
                  padding: '12px', // 🔥 Más padding
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                  border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra
                  transition: 'all 0.2s ease',
                  zIndex: 1010, // 🔥 ADELANTE DE TODO
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'scale(1.05)'
                  },
                  // 🔥 Área táctil mínima
                  minWidth: '64px',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}

            {/* Título dinámico del widget */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              {this.state.pieValue === "ingresos" 
                ? "Distribución de ingresos por categorías" 
                : "Distribución de gastos por categorías"}
            </div>

            {/* Controles para alternar entre ingresos y gastos */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <button
                onClick={() => this.setState({pieValue: "ingresos"}, () => this.saveWidgetConfig())}
                style={{
                  padding: '5px 15px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: this.state.pieValue === "ingresos" ? '#4CAF50' : '#e0e0e0',
                  color: this.state.pieValue === "ingresos" ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                Ingresos
              </button>
              <button
                onClick={() => this.setState({pieValue: "gastos"}, () => this.saveWidgetConfig())}
                style={{
                  padding: '5px 15px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: this.state.pieValue === "gastos" ? '#f44336' : '#e0e0e0',
                  color: this.state.pieValue === "gastos" ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                Gastos
              </button>
            </div>

            <div className='contPie'>
              <Pie data={superdataPie} plugins={[ChartDataLabels]} options={{
                maintainAspectRatio: false,
                responsive: true,
                cutoutPercentage: 80,
                plugins: {
                  legend: {
                    labels: { fontColor: "black" },
                    onClick: (e, legendItem, legend) => {
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
                    backgroundColor: function(context) { return "white"; },
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
                    font: { size:"15px", weight: 'bold' },
                  }
                }
              }} />
            </div>
          </div>
        </div>
      );
    }

    // Widget de Bar Chart
    if (widgetName === 'showBarChart' && this.state.widgetConfig.showBarChart) {
      return (
        <div key="bar" className='glassStyle custonBarrasCuentas widgetResponsive' style={{ 
          order: index,
          height: '420px', // 🔥 Altura fija
          overflow: 'hidden', // 🔥 Prevenir desborde
          display: 'flex',
          flexDirection: 'column' // 🔥 Layout vertical controlado
        }}>
          <div 
            style={{ 
              position: 'relative',
              flex: '1', // 🔥 Toma el espacio disponible
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0 // 🔥 Permite shrinking
            }}
            data-widget-name="showBarChart"
            draggable={this.state.editMode}
            onDragStart={(e) => this.handleDragStart(e, 'showBarChart')}
            onDragOver={this.handleDragOver}
            onDrop={(e) => this.handleDrop(e, 'showBarChart')}
            onDragEnd={this.handleDragEnd}
          >
            {/* Botón de eliminación estilo Apple */}
            {this.state.editMode && (
              <IconButton
                onClick={(e) => this.handleRemoveWidgetClick(e, 'showBarChart')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showBarChart')}
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  zIndex: 1002,
                  padding: '8px',
                  minWidth: '40px',
                  minHeight: '40px',
                  '&:hover': {
                    backgroundColor: '#d50000'
                  }
                }}
                size="small"
              >
                <CloseIcon style={{ fontSize: '18px' }} />
              </IconButton>
            )}

            {/* Indicador de arrastre en modo edición */}
            {this.state.editMode && (
              <DragIndicatorIcon 
                className="drag-handle"
                onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showBarChart')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  color: '#666',
                  opacity: 0.9,
                  fontSize: '48px', // 🔥 Más grande
                  cursor: 'grab',
                  padding: '12px', // 🔥 Más padding
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                  border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra
                  transition: 'all 0.2s ease',
                  zIndex: 1010, // 🔥 ADELANTE DE TODO
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'scale(1.05)'
                  },
                  // 🔥 Área táctil mínima
                  minWidth: '64px',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}

            {/* Título dinámico del widget */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              {this.state.barValue === "liquidez" 
                ? "Cuentas con liquidez (Top 10)" 
                : "Cuentas sin liquidez (Top 10)"}
            </div>

            {/* Controles para alternar entre liquidez y no liquidez */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <button
                onClick={() => this.setState({barValue: "liquidez"}, () => this.saveWidgetConfig())}
                style={{
                  padding: '5px 15px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: this.state.barValue === "liquidez" ? '#4CAF50' : '#e0e0e0',
                  color: this.state.barValue === "liquidez" ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                Con Liquidez
              </button>
              <button
                onClick={() => this.setState({barValue: "noliquidez"}, () => this.saveWidgetConfig())}
                style={{
                  padding: '5px 15px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: this.state.barValue === "noliquidez" ? '#FF9800' : '#e0e0e0',
                  color: this.state.barValue === "noliquidez" ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                Sin Liquidez
              </button>
            </div>

            <div className='contBarChart' style={{
              flex: '1', // 🔥 Toma la mayor parte del espacio
              minHeight: '200px', // 🔥 Gráfico más bajo pero con espacio para etiquetas
              maxHeight: '240px', // 🔥 Altura máxima reducida
              overflow: 'hidden', // 🔥 Prevenir desborde
              paddingBottom: '35px' // 🔥 Más espacio abajo para nombres verticales
            }}>
              <Bar 
                ref={(ref) => this.chartRefs['barChart-' + this.state.barValue] = ref}
                data={superdatabar} 
                options={{
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                  padding: {
                    bottom: 45 // 🔥 Más espacio para etiquetas verticales
                  }
                },
                plugins: {
                  legend: {
                    display: false, // ✅ Ocultar la leyenda que causa problemas
                  },
                  datalabels: {
                    backgroundColor: function(context) { return "white"; },
                    formatter: (value, ctx) => {
                      return value > 0 ? `$${value.toFixed(0)}` : '';
                    },
                    color: 'black',
                    borderRadius: 15,
                    padding: 3,
                    font: { size: "12px", weight: 'bold' },
                  }
                },
                onClick: (event, elements) => {
                  // ✅ Manejar click en las barras individuales
                  if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const chart = elements[0].element.chart;
                    
                    // 🔥 Validar que chart existe y tiene el método getDatasetMeta
                    if (chart && typeof chart.getDatasetMeta === 'function') {
                      const meta = chart.getDatasetMeta(0);
                      
                      // 🔥 Validar que meta y meta.data existen
                      if (meta && meta.data && meta.data[dataIndex]) {
                        // Toggle visibilidad usando el método correcto
                        if (meta.data[dataIndex].hidden) {
                          meta.data[dataIndex].hidden = false;
                        } else {
                          meta.data[dataIndex].hidden = true;
                        }
                        
                        chart.update();
                      }
                    }
                  }
                },
                scales: {
                  yAxes: {
                    grid: { drawBorder: true, color: '#FFFFFF' },
                    ticks: { beginAtZero: true, color: 'white', fontSize: 12 }
                  },
                  xAxes: {
                    grid: { drawBorder: true, color: '#FFFFFF' },
                    ticks: { 
                      beginAtZero: true, 
                      color: 'white', 
                      fontSize: 9, // 🔥 Texto un poco más grande para legibilidad
                      maxRotation: 45, // 🔥 Inclinación suave como antes
                      minRotation: 45  // 🔥 Inclinación suave como antes
                    }
                  }
                }
              }} />
            
            {/* Lista de cuentas clickeable para toggle */}
            <div style={{ 
              marginTop: '8px', 
              padding: '2px', // 🔥 Padding mínimo
              height: '50px', // 🔥 Altura reducida para botones más pequeños
              overflowY: 'auto',
              overflowX: 'hidden',
              flexShrink: 0,
              fontSize: '0' // 🔥 Eliminar espacios entre elementos inline-block
            }}>
              {(() => {
                // 🔥 Generar lista de cuentas localmente
                if (!this.props.state.RegContableReducer.Cuentas || 
                    !Array.isArray(this.props.state.RegContableReducer.Cuentas)) {
                  return <div style={{color: 'white', fontSize: '10px', textAlign: 'center'}}>
                    Cargando cuentas...
                  </div>;
                }
                
                let cuentasFiltradas = [];
                if (this.state.barValue === "liquidez") {
                  cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x=> 
                    x && x.DineroActual && x.DineroActual.$numberDecimal &&
                    x.DineroActual.$numberDecimal != "0" && 
                    x.DineroActual.$numberDecimal != "0.00" && 
                    x.CheckedP == true && 
                    x.CheckedA == true &&
                    x.Tipo != "Inventario" &&
                    x.NombreC // 🔥 Usar NombreC como en el gráfico
                  );
                } else if (this.state.barValue === "noliquidez") {
                  cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x=> 
                    x && x.DineroActual && x.DineroActual.$numberDecimal &&
                    x.DineroActual.$numberDecimal != "0" && 
                    x.DineroActual.$numberDecimal != "0.00" && 
                    (x.CheckedP == false || x.CheckedA == false || x.Tipo == "Inventario") &&
                    x.NombreC // 🔥 Usar NombreC como en el gráfico
                  );
                } else {
                  cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x=> 
                    x && x.DineroActual && x.DineroActual.$numberDecimal &&
                    x.DineroActual.$numberDecimal != "0" && 
                    x.DineroActual.$numberDecimal != "0.00" && 
                    x.CheckedP == true && 
                    x.CheckedA == true &&
                    x.Tipo != "Inventario" &&
                    x.NombreC // 🔥 Usar NombreC como en el gráfico
                  );
                }
                
                const cuentasTop10 = cuentasFiltradas
                  .sort((a, b) => parseFloat(b.DineroActual.$numberDecimal) - parseFloat(a.DineroActual.$numberDecimal))
                  .slice(0,10);
                
                return cuentasTop10.map((cuentaObj, index) => (
                  <div 
                    key={`cuenta-btn-${index}`}
                    onClick={() => {
                      console.log('🔥 Click cuenta:', cuentaObj?.NombreC || 'Sin nombre', 'Hidden state:', 
                        this.state.hiddenBarChartAccounts[index]);
                      // Toggle la cuenta específica
                      this.setState(prevState => ({
                        hiddenBarChartAccounts: {
                          ...prevState.hiddenBarChartAccounts,
                          [index]: !prevState.hiddenBarChartAccounts[index]
                        }
                      }), () => {
                        console.log('🔥 Nuevo estado hidden:', this.state.hiddenBarChartAccounts);
                        // Actualizar el chart después del setState
                        if (this.chartRefs.barChart) {
                          try {
                            this.chartRefs.barChart.update();
                            console.log('🔥 Chart actualizado');
                          } catch (error) {
                            console.error('🔥 Error actualizando chart:', error);
                          }
                        }
                      });
                    }}
                    style={{
                      display: 'inline-block',
                      backgroundColor: this.state.hiddenBarChartAccounts[index] ? '#888' : '#007BFF',
                      color: 'white',
                      padding: '1px 1px', // 🔥 Padding súper mínimo
                      margin: '0.5px 0.5px', // 🔥 Margen súper pequeño
                      borderRadius: '1px', // 🔥 Casi sin bordes redondeados
                      fontSize: '6px', // 🔥 Texto muy pequeño
                      cursor: 'pointer',
                      textDecoration: this.state.hiddenBarChartAccounts[index] ? 'line-through' : 'none',
                      opacity: this.state.hiddenBarChartAccounts[index] ? 0.6 : 1,
                      border: '0.5px solid rgba(255,255,255,0.3)', // 🔥 Borde más delgado
                      transition: 'all 0.2s ease',
                      wordBreak: 'break-word',
                      maxWidth: '35px', // 🔥 Ancho súper pequeño
                      minWidth: '25px', // 🔥 Ancho mínimo muy pequeño
                      textAlign: 'center',
                      lineHeight: '0.9', // 🔥 Altura de línea muy compacta
                      height: '12px', // 🔥 Altura fija muy pequeña
                      overflow: 'hidden' // 🔥 Cortar contenido que se desborde
                    }}
                    onMouseEnter={(e) => {
                      if (!this.state.hiddenBarChartAccounts[index]) {
                        e.target.style.backgroundColor = '#0056b3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = this.state.hiddenBarChartAccounts[index] ? '#888' : '#007BFF';
                    }}
                  >
                    {cuentaObj && cuentaObj.NombreC && cuentaObj.NombreC.length > 4 ? 
                      cuentaObj.NombreC.substring(0, 3) + '.' : // 🔥 Solo 3 caracteres + punto
                      (cuentaObj && cuentaObj.NombreC ? cuentaObj.NombreC.substring(0, 4) : 'Sin')
                    }
                  </div>
                ));
              })()}
            </div>
            </div>
          </div>
        </div>
      );
    }

    // Widget de Liquidity Chart
    if (widgetName === 'showLiquidityChart' && this.state.widgetConfig.showLiquidityChart) {
      return (
        <div key="liquidity" className='glassStyle custonLiquidez widgetResponsive' style={{ order: index }}>
          <div 
            style={{ position: 'relative' }}
            data-widget-name="showLiquidityChart"
            draggable={this.state.editMode}
            onDragStart={(e) => this.handleDragStart(e, 'showLiquidityChart')}
            onDragOver={this.handleDragOver}
            onDrop={(e) => this.handleDrop(e, 'showLiquidityChart')}
            onDragEnd={this.handleDragEnd}
          >
            {/* Botón de eliminación estilo Apple */}
            {this.state.editMode && (
              <IconButton
                onClick={(e) => this.handleRemoveWidgetClick(e, 'showLiquidityChart')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showLiquidityChart')}
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  zIndex: 1002,
                  padding: '8px',
                  minWidth: '40px',
                  minHeight: '40px',
                  '&:hover': {
                    backgroundColor: '#d50000'
                  }
                }}
                size="small"
              >
                <CloseIcon style={{ fontSize: '18px' }} />
              </IconButton>
            )}

            {/* Indicador de arrastre en modo edición */}
            {this.state.editMode && (
              <DragIndicatorIcon 
                className="drag-handle"
                onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showLiquidityChart')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  color: '#666',
                  opacity: 0.9,
                  fontSize: '48px', // 🔥 Más grande
                  cursor: 'grab',
                  padding: '12px', // 🔥 Más padding
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                  border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra
                  transition: 'all 0.2s ease',
                  zIndex: 1010, // 🔥 ADELANTE DE TODO
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'scale(1.05)'
                  },
                  // 🔥 Área táctil mínima
                  minWidth: '64px',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}

            <div className='contLiquidityChart' style={{
              height: '85%' // 🔥 Altura fija para evitar SSR error
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '12px',
                padding: '0 15px'
              }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  margin: 0 
                }}>
                  Evolución de Liquidez
                </h3>
              </div>
              <div style={{
                height: 'calc(100% - 70px)', // 🔥 Menos altura para dar más espacio abajo
                padding: '0 15px',
                paddingBottom: '18px', // 🔥 Más padding abajo para móvil
                minHeight: '200px' // 🔥 Altura mínima reducida
              }}>
                <Line data={superdataLiquidez} options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { fontColor: "white" },
                      position: 'top',
                    }
                  },
                  scales: {
                    yAxes: {
                      grid: { drawBorder: true, color: '#FFFFFF' },
                      ticks: { beginAtZero: true, color: 'white', fontSize: 12 }
                    },
                    xAxes: {
                      grid: { drawBorder: true, color: '#FFFFFF' },
                      ticks: { beginAtZero: true, color: 'white', fontSize: 12 }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Widget de Patrimonio Chart
    if (widgetName === 'showPatrimonioChart' && this.state.widgetConfig.showPatrimonioChart) {
      return (
        <div key="patrimonio" className='glassStyle custonPatrimonio widgetResponsive' style={{ order: index }}>
          <div 
            style={{ position: 'relative' }}
            data-widget-name="showPatrimonioChart"
            draggable={this.state.editMode}
            onDragStart={(e) => this.handleDragStart(e, 'showPatrimonioChart')}
            onDragOver={this.handleDragOver}
            onDrop={(e) => this.handleDrop(e, 'showPatrimonioChart')}
            onDragEnd={this.handleDragEnd}
          >
            {/* Botón de eliminación estilo Apple */}
            {this.state.editMode && (
              <IconButton
                onClick={(e) => this.handleRemoveWidgetClick(e, 'showPatrimonioChart')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showPatrimonioChart')}
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  zIndex: 1002,
                  padding: '8px',
                  minWidth: '40px',
                  minHeight: '40px',
                  '&:hover': {
                    backgroundColor: '#d50000'
                  }
                }}
                size="small"
              >
                <CloseIcon style={{ fontSize: '18px' }} />
              </IconButton>
            )}

            {/* Indicador de arrastre en modo edición */}
            {this.state.editMode && (
              <DragIndicatorIcon 
                className="drag-handle"
                onTouchStart={(e) => this.handleDragIconTouchStart(e, 'showPatrimonioChart')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  color: '#666',
                  opacity: 0.9,
                  fontSize: '48px', // 🔥 Más grande (era 32px)
                  cursor: 'grab',
                  padding: '12px', // 🔥 Más padding para área de toque
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', // 🔥 Más visible
                  border: '2px solid rgba(255, 255, 255, 0.3)', // 🔥 Borde para mejor visibilidad
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 🔥 Sombra para destacar
                  transition: 'all 0.2s ease',
                  zIndex: 1010, // 🔥 ADELANTE DE TODO
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'scale(1.05)'
                  },
                  // 🔥 Asegurar área táctil mínima para móviles
                  minWidth: '64px',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}

            <div className='contPatrimonioChart' style={{
              height: '82%' // 🔥 Altura fija para evitar SSR error
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '12px',
                padding: '0 15px'
              }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  margin: 0 
                }}>
                  Evolución de Patrimonio
                </h3>
              </div>
              <div style={{
                height: 'calc(100% - 72px)', // 🔥 Menos altura para dar más espacio abajo
                padding: '0 15px',
                paddingBottom: '18px', // 🔥 Más padding abajo para móvil
                minHeight: '190px' // 🔥 Altura mínima reducida
              }}>
                <Line data={superdataPatrimonio} options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { fontColor: "white" },
                      position: 'top',
                    }
                  },
                  scales: {
                    yAxes: {
                      grid: { drawBorder: true, color: '#FFFFFF' },
                      ticks: { beginAtZero: true, color: 'white', fontSize: 12 }
                    },
                    xAxes: {
                      grid: { drawBorder: true, color: '#FFFFFF' },
                      ticks: { beginAtZero: true, color: 'white', fontSize: 12 }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null; // Para widgets no reconocidos o deshabilitados
  })}
</div>
<div 
          className='glassStyle custonBarrasCuentas widgetResponsive' 
          style={{ position: 'relative', order: this.state.widgetOrder.indexOf('showBarChart'), display: 'none' }}
          data-widget-name="showBarChart"
          draggable={this.state.editMode}
          onDragStart={(e) => this.handleDragStart(e, 'showBarChart')}
          onDragOver={this.handleDragOver}
          onDrop={(e) => this.handleDrop(e, 'showBarChart')}
          onDragEnd={this.handleDragEnd}
          onTouchStart={(e) => this.handleTouchStart(e, 'showBarChart')}
        >

          {/* Botón de eliminación estilo Apple */}
          {this.state.editMode && (
            <IconButton
              onClick={(e) => this.handleRemoveWidgetClick(e, 'showBarChart')}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showBarChart')}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                zIndex: 1002,
                backgroundColor: '#ff4444',
                color: 'white',
                padding: '8px',
                minWidth: '40px',
                minHeight: '40px',
                '&:hover': {
                  backgroundColor: '#d50000'
                }
              }}
              size="small"
            >
              <CloseIcon style={{ fontSize: '18px' }} />
            </IconButton>
          )}

          {/* Indicador de arrastre en modo edición */}
          {this.state.editMode && (
            <DragIndicatorIcon 
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                color: '#999',
                opacity: 0.8,
                fontSize: '32px',
                cursor: 'grab',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            />
          )}

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

{/* Widget de Liquidez */}
{this.state.widgetConfig.showLiquidityChart && (
<div 
          className='glassStyle custonLiquidezCont widgetResponsive' 
          style={{ position: 'relative', order: this.state.widgetOrder.indexOf('showLiquidityChart'), display: 'none' }}
          data-widget-name="showLiquidityChart"
          draggable={this.state.editMode}
          onDragStart={(e) => this.handleDragStart(e, 'showLiquidityChart')}
          onDragOver={this.handleDragOver}
          onDrop={(e) => this.handleDrop(e, 'showLiquidityChart')}
          onDragEnd={this.handleDragEnd}
          onTouchStart={(e) => this.handleTouchStart(e, 'showLiquidityChart')}
        >

          {/* Botón de eliminación estilo Apple */}
          {this.state.editMode && (
            <IconButton
              onClick={(e) => this.handleRemoveWidgetClick(e, 'showLiquidityChart')}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchEnd={(e) => this.handleRemoveWidgetTouch(e, 'showLiquidityChart')}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                zIndex: 1002,
                backgroundColor: '#ff4444',
                color: 'white',
                padding: '8px',
                minWidth: '40px',
                minHeight: '40px',
                '&:hover': {
                  backgroundColor: '#d50000'
                }
              }}
              size="small"
            >
              <CloseIcon style={{ fontSize: '18px' }} />
            </IconButton>
          )}

          {/* Indicador de arrastre en modo edición */}
          {this.state.editMode && (
            <DragIndicatorIcon 
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                color: '#999',
                opacity: 0.8,
                fontSize: '32px',
                cursor: 'grab',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            />
          )}

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
  
  {/* Panel de Agregar Widgets */}
  <AddWidgetsPanel />
  
  {/* Botones Flotantes estilo Apple - Contenedor Widgets */}
  <div style={{
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  }}>
    
    {/* Botones desplegables (aparecen hacia arriba) */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
      transform: this.state.showWidgetMenu ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
      opacity: this.state.showWidgetMenu ? 1 : 0,
      visibility: this.state.showWidgetMenu ? 'visible' : 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: this.state.showWidgetMenu ? 'auto' : 'none',
    }}>
      
      {/* Botón Editar - Siempre visible cuando el menú está abierto */}
      <div style={{
        position: 'relative',
        transform: this.state.editMode ? 'scale(1.15)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Fab 
          size="small"
          color={this.state.editMode ? "secondary" : "primary"}
          aria-label={this.state.editMode ? "terminar edición" : "editar widgets"}
          onClick={this.toggleEditMode}
          style={{
            background: this.state.editMode 
              ? 'linear-gradient(45deg, #ff6b35 30%, #ff8c42 90%)' 
              : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: this.state.editMode 
              ? '0 6px 20px rgba(255, 107, 53, 0.4)' 
              : '0 4px 15px rgba(102, 126, 234, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            transform: this.state.editMode ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          {this.state.editMode ? <DoneIcon /> : <EditIcon />}
        </Fab>
      </div>

      {/* Botón Agregar Widgets - Siempre visible cuando el menú está abierto */}
      <div style={{
        position: 'relative',
        transform: this.state.showAddWidgetsPanel ? 'scale(1.15)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Fab 
          size="small"
          color="primary"
          aria-label="agregar widgets"
          onClick={this.toggleAddWidgetsPanel}
          style={{
            background: this.state.showAddWidgetsPanel 
              ? 'linear-gradient(45deg, #2e7d32 30%, #43a047 90%)'
              : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: this.state.showAddWidgetsPanel 
              ? '0 6px 20px rgba(46, 125, 50, 0.4)' 
              : '0 4px 15px rgba(102, 126, 234, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            transform: this.state.showAddWidgetsPanel ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <AddIcon />
        </Fab>
      </div>
      
    </div>
    
    {/* Botón Principal de Widgets */}
    <div style={{
      position: 'relative',
      transform: this.state.showWidgetMenu ? 'scale(1.1) rotate(180deg)' : 'scale(1) rotate(0deg)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <Fab 
        color="primary"
        aria-label="widgets menu"
        onClick={this.toggleWidgetMenu}
        style={{
          background: this.state.showWidgetMenu
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: this.state.showWidgetMenu 
            ? '0 8px 25px rgba(102, 126, 234, 0.5)' 
            : '0 6px 20px rgba(102, 126, 234, 0.4)',
          border: '2px solid rgba(255,255,255,0.3)',
          width: '60px',
          height: '60px',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.5px',
        }}>
          <div style={{
            fontSize: '18px',
            marginBottom: '2px',
            transform: this.state.showWidgetMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}>
            ⚙️
          </div>
          <div style={{
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            Widgets
          </div>
        </div>
      </Fab>
      
      {/* Indicador de estado activo */}
      {(this.state.editMode || this.state.showAddWidgetsPanel) && (
        <div style={{
          position: 'absolute',
          top: '-3px',
          right: '-3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.5)',
          animation: 'pulse 2s infinite',
          border: '2px solid white',
        }} />
      )}
      
    </div>
  </div>

   <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>    
    </Alert>
  </Snackbar>
  <style jsx>{`
   
.balanceCont{
  max-width: 1200px; /* 🔥 Ancho máximo para pantallas grandes */
  margin: 0 auto; /* 🔥 Centrar horizontalmente */
  padding: 0 20px; /* 🔥 Padding lateral */
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

.custonPatrimonio{
  width: 100%;
  max-width: 600px;
  height: 350px;
}

.contPatrimonioChart{
  height: 85%;
  padding: 10px 15px;
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
 .cuadroIngreso {
   box-shadow: 0px 0px 8px 3px #2e7d32 !important;
 }
 .cuadroGasto {
   box-shadow: 0px 0px 8px 3px #f1586e !important;
 }
 .ingresoActive{
   height: 210px;
 }
 .gastoActive{
   height: 210px;
 }

@media only screen and (max-width: 600px) {
  .cuadroIngreso.cuadroPlantilla, .cuadroGasto.cuadroPlantilla {
    margin-top: 24px !important;
    margin-bottom: 24px !important;
    height: 160px !important;
    min-width: 120px !important;
    max-width: 95vw !important;
    width: 95vw !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

@media only screen and (max-width: 600px) {
  .ingresoActive {
    height: 170px !important;
    min-width: 140px !important;
    max-width: 98vw !important;
    box-shadow: 0px 0px 8px 3px #2e7d32 !important;
  }
}
}
.gastoActive{
  box-shadow: 0px 0px 8px 3px red;
  height: 210px;

}
@media only screen and (min-width: 950px) {
  .contCuadros{ flex-wrap:nowrap; }
  .cuadroIngreso, .cuadroGasto {
    height: 210px !important;
    min-width: 220px !important;
    max-width: 350px !important;
    width: 350px !important;
    box-sizing: border-box !important;
  }
  /* Centrado del widget completo con el padre */
  .contCuadros {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
}

/* Estilos para drag & drop */
.cuadroPlantilla[draggable="true"] {
  cursor: move;
}

.cuadroPlantilla[draggable="true"]:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.glassStyle[draggable="true"] {
  cursor: move;
}

.glassStyle[draggable="true"]:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.cuadroPlantilla.dragging,
.glassStyle.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
}

/* Estilos responsive para widgets */
.widgetResponsive {
  min-height: 200px !important;
  max-height: 300px !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  width: 100% !important;
}

.contenedorWidgetsUnificado {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 100%;
  width: calc(100% - 20px);
  margin: 0 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 0 10px;
}

@media only screen and (max-width: 768px) {
  .widgetResponsive {
    min-height: 180px !important;
    max-height: 250px !important;
    flex: 1 1 calc(50% - 8px);
    min-width: 0 !important;
    max-width: calc(50% - 8px) !important;
    width: calc(50% - 8px) !important;
  }
  
  .contenedorWidgetsUnificado {
    gap: 8px;
    padding: 5px;
    margin: 0;
    width: calc(100% - 10px);
  }
  
  .glassStyle {
    margin-bottom: 8px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    padding: 10px !important;
  }
}

@media only screen and (max-width: 480px) {
  .widgetResponsive {
    flex: 1 1 calc(100% - 5px) !important;
    min-width: 0 !important;
    max-width: calc(100% - 5px) !important;
    width: calc(100% - 5px) !important;
  }
  
  .contenedorWidgetsUnificado {
    gap: 5px;
    padding: 5px;
    width: calc(100% - 10px);
  }
  
  .glassStyle {
    padding: 8px !important;
  }
}

@media only screen and (min-width: 769px) and (max-width: 1024px) {
  .widgetResponsive {
    flex: 1 1 calc(50% - 8px);
    min-width: 0;
    max-width: calc(50% - 8px);
    width: calc(50% - 8px);
  }
  
  .contenedorWidgetsUnificado {
    gap: 8px;
    padding: 0 10px;
    width: calc(100% - 20px);
  }
}

@media only screen and (min-width: 1025px) {
  .widgetResponsive {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    margin: 0 !important;
    min-height: 300px !important;
  }
  
  .contenedorWidgetsUnificado {
    max-width: 1200px !important;
    padding: 20px !important;
    margin: 0 auto !important;
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr !important;
    grid-template-rows: auto auto !important;
    gap: 20px !important;
    flex-direction: unset !important;
    flex-wrap: unset !important;
    justify-content: unset !important;
    align-items: unset !important;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
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