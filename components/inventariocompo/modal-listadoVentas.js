import React, { Component } from 'react'
import moment from "moment";
import "moment/locale/es";
import {Animate} from "react-animate-mount"
import MomentUtils from '@date-io/moment';
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import {connect} from 'react-redux';
import VentaRenderList from "./ventaRenderListView"
import VentaR from "./ventaRender"
import ModalDeleteVentas from './modal-delete-ventas';
import {updateVenta,getVentas} from "../../reduxstore/actions/regcont"
import CircularProgress from '@material-ui/core/CircularProgress';
import ViewVenta from "../modal-viewventas"
import ReactToPrint from "react-to-print";
import Button from '@material-ui/core/Button';
import ViewNotas from "./modal-genNotas"
import ViewNotasCred from "../modal-viewvNotaCred"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ViewCreds from "../modal-viewCreds"
import "./mediaprint.css"
import DropdownButtonVentas from './usefull/dropdownbuttonVentas';
import DoubleScrollbar from "react-double-scrollbar";
import Estadisticas from './modal-estadisticasArticulos';

class Listvent extends Component {
  state={
    chartModal:false,
    viewerNota:false,
    searcherIn:"",
    searcherOut:"",
    filtrosTiempo:true,
    viewCreds:false,
    viewNota:false,
    vista:"listmode",
    diario:true,
    mensual:false,
    periodo:false,
    VentaSelected:{},
    dataNota:{},
    deleteVenta:false,
    listmode:true,
    pickmode:false,
    Ventas:[],
 
    filterid:1,
    filterganacia:1,
    filtervtotal:1,
    vendedorFilter:1,

    clienteFilter:1,
    TipoFilter:1,
    documentoFilter:1,
    estadoFilter:1,
    CuentaFilter:1,
    tiempo: new Date(),
    tiempomensual: new Date(),
    tiempoperiodoini: new Date(),
    tiempoperiodofin: this.periodofin(),
    loadingData:false,
    dataventa:"",
    viewVenta:false,
    anchorEl:null
   }
   componentRef = React.createRef(); 
   periodofin(){
   
    let nuevo = new Date()
    let asd  = nuevo.getDate() + 1
    let add = nuevo.setDate(asd)
   
   
    let fechareturn = new Date(add)
    return(fechareturn)

}

    componentDidMount(){
     
if(!this.props.state.RegContableReducer.Ventas){
  console.log("llamando ventas")
 
      this.getVendData()
}else if(this.props.state.RegContableReducer.Ventas){
  if(this.props.state.RegContableReducer.Ventas.length < 50){
    this.getVendData()
  }
}


      setTimeout(function(){ 
        
        document.getElementById('mainListVentas').classList.add("entradaaddc")

       }, 500);
        
   
    
      }
      jsonToCsv=(items)=> {
        console.log(items)
        const header = ["Factura Nº", "Clave de Acceso", "Numero Autorizacion","Fecha Autorizacion", "Cedula Receptor", "Nombre Receptor", "Detalle", "Sub-Total","IvaEC","Total" ];
        const tring = header.join(',');
        // handle null or undefined values here
        const replacer = (key, value) => value ?? '';
        const rowItems = items.map((row) =>
          header
            .map((fieldName) => {
              if(fieldName == 'Factura Nº'){
                return "004"+"010"+row["Secuencial"]
              }
              else if(fieldName == 'Clave de Acceso'){               
                return JSON.stringify(row["ClaveAcceso"], replacer)
              }
              else if(fieldName == 'Numero Autorizacion'){             
                return JSON.stringify( row["FactAutorizacion"], replacer)
              }
              else if(fieldName == 'Fecha Autorizacion'){             
                return JSON.stringify( row["FactFechaAutorizacion"], replacer)
              }
              else if(fieldName == 'Cedula Receptor'){             
                return JSON.stringify( row["cedulaCliente"], replacer)
              }
              else if(fieldName == 'Nombre Receptor'){             
                return JSON.stringify( row["nombreCliente"], replacer)
              }
              else if(fieldName == 'Detalle'){    
                let dataDeta = row.articulosVendidos.map(x=>{
                  var regex = new RegExp("\"", "g");
              let sinbackslash = x.Titulo.replace(/\\/g, "/").replace(regex, "'").replace(",",".");
            
                  
              return (sinbackslash + " -")}
              
              ).join(' ')

              let result = JSON.stringify(dataDeta).replace(",",".").replace(/[\[\]]/g,'')
                console.log(result)
                return result
              }
              else if(fieldName == 'Sub-Total'){             
                return JSON.stringify( parseFloat(row["baseImponible"]).toFixed(2), replacer)
              }
              else if(fieldName == 'IvaEC'){             
                return JSON.stringify( parseFloat(row["IvaEC"]).toFixed(2), replacer)
              }
              else if(fieldName == 'Total'){             
                return JSON.stringify( parseFloat(row["PrecioCompraTotal"]).toFixed(2), replacer)
              }
             
            
  
            })
            .join(',')
        );
        // join header and body, and break into separate lines
        const csv = [tring, ...rowItems].join('\r\n');
        return csv;
      }

      downloadFactReport=(data)=>{
     
        let dataFact=  this.FilterSistem(this.props.state.RegContableReducer.Ventas)
        let factFilter = dataFact.filter((x)=>x.Doctype == "Factura-Electronica")

       
        let csv = this.jsonToCsv(factFilter)
  
      let link = document.createElement('a');
        const url = window.URL.createObjectURL(
            new Blob([csv]),
          );
        link.href = url;
        link.setAttribute(
          'download',
          `Facturas.csv`,
        );
           
        link.click();
  
       }

      getVendData=()=>{
       if(this.state.loadingData == false){
        this.setState({loadingData:true})
        let datos = {
          User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                Tipo: this.props.state.userReducer.update.usuario.user.Tipo},
           dataTime:{diario:this.state.diario,
                      mensual:this.state.mensual,
                      periodo:this.state.periodo,
                      tiempo:this.state.tiempo.getTime(),
                      tiempomensual:this.state.tiempomensual.getTime(),
                      tiempoperiodoini:this.state.tiempoperiodoini.getTime(),
                      tiempoperiodofin:this.state.tiempoperiodofin.getTime(),
 
                    }
 
        }

      let lol = JSON.stringify(datos)
        let settings = {
          method: 'POST', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }
      
        fetch("/cuentas/getventasbytime", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
        this.setState({loadingData:false})        
      
      })
        .then(response => {  
        console.log(response)
          if(response.status == 'error'){}
        else if(response.status == 'Ok'){
          this.props.dispatch(getVentas(response.ventasHabiles));       
          this.setState({loadingData:false})   
        
        }
      
        })}
      }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
   
      displayGanancia=()=>{
        let ganancia=0
  let valtotal =0
  let valorinvertido =0
  let totalventas = this.displayVentas()
  
        if(this.props.state.RegContableReducer.Ventas){
          let filtradosAll = this.FilterSistem(this.props.state.RegContableReducer.Ventas)
            if(filtradosAll){
              let filtrados = filtradosAll.filter(x => x.TipoVenta == "Contado")
           
              

                for(let i=0;i<filtrados.length;i++){
                  
                
                  for(let x=0;x<filtrados[i].articulosVendidos.length;x++){
               
                    valtotal = filtrados[i].articulosVendidos[x].Precio_Compra *  filtrados[i].articulosVendidos[x].CantidadCompra
                 
                  

                    valorinvertido += valtotal
                  }
                  
                }
             
                return (totalventas - valorinvertido).toFixed(2)
              }
        }else{ return ""}
     
      }
      displayCreds=()=>{
        if(this.props.state.RegContableReducer.Ventas){
          let sumacred= 0
        let filtrados = this.FilterSistem(this.props.state.RegContableReducer.Ventas)
        if(filtrados){
        let misventasCred = filtrados.filter(regsing => regsing.TipoVenta == "Credito")
        
        
        if(misventasCred.length > 0){
          for (let i=0; i < misventasCred.length; i++ ){
            sumacred = sumacred + misventasCred[i].PrecioCompraTotal
        }
      }
      
    }
      return (sumacred.toFixed(2))
      
      }
    }
      displayVentas=()=>{
        if(this.props.state.RegContableReducer.Ventas){
        let filtrados = this.FilterSistem(this.props.state.RegContableReducer.Ventas)
    if(filtrados){
        let misventasCred = filtrados.filter(regsing => regsing.TipoVenta == "Contado")
        let sumacred= 0
      
        if(misventasCred.length > 0){
          for (let i=0; i < misventasCred.length; i++ ){
            sumacred = sumacred + misventasCred[i].PrecioCompraTotal
        }
      }
   
      let misprimerasC = filtrados.filter(regsing => regsing.TipoVenta == "Credito" && regsing.FormasCredito.Cantidad > 0)
     
     let sumares= 0
     if(misprimerasC.length > 0){
      for (let i=0; i < misprimerasC.length; i++ ){
        sumares += misprimerasC[i].FormasCredito.Cantidad
    }
    }
    let sumatotal = sumacred+sumares
      return (parseFloat(sumatotal).toFixed(2))
      
    }

      }
    }
    filtervtotal=()=>{
      let nuevoval = this.state.filtervtotal + 1
      let regs = this.props.state.RegContableReducer.Ventas
      if(nuevoval ==2){
       
    
        let order = regs.sort((a, b) =>a.PrecioCompraTotal  - b.PrecioCompraTotal)
      
        this.setState({filtervtotal:nuevoval})
       }else if(nuevoval ==3){
     
        let order = regs.sort((a, b) =>b.PrecioCompraTotal - a.PrecioCompraTotal )
        
        this.setState({filtervtotal:nuevoval})
       }
       else   if(nuevoval ==4){
       
       
        let order = regs.sort((a, b) =>a.PrecioCompraTotal  - b.PrecioCompraTotal)
      
        this.setState({filtervtotal:2})
       }
    }
    filterid=()=>{
      let regs = this.props.state.RegContableReducer.Ventas
      let nuevoval = this.state.filterid + 1
      if(nuevoval ==2){
     
      
       
        let order = regs.sort((a, b) =>a.iDVenta  - b.iDVenta)
      
        this.setState({filterid:nuevoval})
       }else if(nuevoval ==3){
     
        let order = regs.sort((a, b) =>b.iDVenta - a.iDVenta )
        
        this.setState({filterid:nuevoval})
       }
       else   if(nuevoval ==4){
    
       
        let order = regs.sort((a, b) =>a.iDVenta  - b.iDVenta)
      
        this.setState({filterid:2})
       }
    }
      getDayName = ()=> {
        var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
        
        return days[this.state.tiempo.getDay()];
        
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
    
   
      Onsalida=()=>{
        document.getElementById('mainListVentas').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }

      documentoFilter=()=>{
        let nuevoval = this.state.documentoFilter + 1
        let SortArray = (x, y) =>{
          if (x.Doctype < y.Doctype) {return -1;}
          if (x.Doctype > y.Doctype) {return 1;}
          return 0;
            
         }
         function SortArraydec(x, y){
          if (y.Doctype < x.Doctype  ) {return -1;}
          if (y.Doctype > x.Doctype ) {return 1;}
            return 0;
        }
        let regs = this.props.state.RegContableReducer.Ventas
        if(nuevoval ==2){
 
         
      
           regs.sort(SortArray)
            this.setState({documentoFilter:nuevoval})
         }else if(nuevoval ==3){
           
             
              
              regs.sort(SortArraydec)
          
              this.setState({documentoFilter:nuevoval})
             }else if(nuevoval ==4){
            
            
             
              regs.sort(SortArray)
              this.setState({documentoFilter:2})
             }
      }

      estadoFilter=()=>{
        let nuevoval = this.state.estadoFilter + 1
        let SortArray = (x, y) =>{
          if (x.Estado < y.Estado) {return -1;}
          if (x.Estado > y.Estado) {return 1;}
          return 0;
            
         }
         function SortArraydec(x, y){
          if (y.Estado < x.Estado  ) {return -1;}
          if (y.Estado > x.Estado ) {return 1;}
            return 0;
        }
        let regs = this.props.state.RegContableReducer.Ventas
        if(nuevoval ==2){

         
       
           regs.sort(SortArray)
            this.setState({estadoFilter:nuevoval})
         }else if(nuevoval ==3){
             
             
            
              regs.sort(SortArraydec)
          
              this.setState({estadoFilter:nuevoval})
             }else if(nuevoval ==4){
             
            
              
              regs.sort(SortArray)
              this.setState({estadoFilter:2})
             }
      }

      vendedorFilter=()=>{
        let nuevoval = this.state.vendedorFilter + 1
        let regs = this.props.state.RegContableReducer.Ventas
        if(nuevoval ==2){
       
             
             function SortArray(x, y){
              if (x.Vendedor.Nombre < y.Vendedor.Nombre) {return -1;}
              if (x.Vendedor.Nombre > y.Vendedor.Nombre) {return 1;}
              return 0;
                
             }
           
             let order = regs.sort(SortArray)
               this.setState({vendedorFilter:nuevoval})
            }else if(nuevoval ==3){
            
              function SortArraydec(x, y){
                if (y.Vendedor.Nombre < x.Vendedor.Nombre  ) {return -1;}
                if (y.Vendedor.Nombre > x.Vendedor.Nombre  ) {return 1;}
                  return 0;
              }
            
              let order = regs.sort(SortArraydec)
          
              this.setState({vendedorFilter:nuevoval})
             }else if(nuevoval ==4){
            
              function SortArray(x, y){
               if (x.Vendedor.Nombre < y.Vendedor.Nombre) {return -1;}
               if (x.Vendedor.Nombre > y.Vendedor.Nombre) {return 1;}
               return 0;
                 
              }
                   let order = regs.sort(SortArray)
              this.setState({vendedorFilter:2})
             }
      }
      clienteFilter=()=>{
        let nuevoval = this.state.clienteFilter + 1
        let regs = this.props.state.RegContableReducer.Ventas
        if(nuevoval ==2){
       
             
             function SortArray(x, y){
              if (x.nombreCliente < y.nombreCliente) {return -1;}
              if (x.nombreCliente > y.nombreCliente) {return 1;}
              return 0;
                
             }
           
             let order = regs.sort(SortArray)
               this.setState({clienteFilter:nuevoval})
            }else if(nuevoval ==3){
            
              function SortArraydec(x, y){
                if (y.nombreCliente< x.nombreCliente ) {return -1;}
                if (y.nombreCliente> x.nombreCliente  ) {return 1;}
                  return 0;
              }
            
              let order = regs.sort(SortArraydec)
          
              this.setState({clienteFilter:nuevoval})
             }else if(nuevoval ==4){
            
              function SortArray(x, y){
               if (x.nombreCliente< y.nombreCliente) {return -1;}
               if (x.nombreCliente > y.nombreCliente) {return 1;}
               return 0;
                 
              }
                   let order = regs.sort(SortArray)
              this.setState({clienteFilter:2})
             }
      }
      TipoFilter=()=>{
        let nuevoval = this.state.TipoFilter + 1
      let regs = this.props.state.RegContableReducer.Ventas
        if(nuevoval ==2){
        
             function SortArray(x, y){
              if (x.TipoVenta < y.TipoVenta) {return -1;}
              if (x.TipoVenta > y.TipoVenta) {return 1;}
              return 0;
                
             }
           
             let order = regs.sort(SortArray)
               this.setState({TipoFilter:nuevoval})
            }else if(nuevoval ==3){
          
              function SortArraydec(x, y){
                if (y.TipoVenta< x.TipoVenta  ) {return -1;}
                if (y.TipoVenta> x.TipoVenta  ) {return 1;}
                  return 0;
              }
          
              let order = regs.sort(SortArraydec)
          
              this.setState({TipoFilter:nuevoval})
             }else if(nuevoval ==4){
       
              function SortArray(x, y){
               if (x.TipoVenta < y.TipoVenta) {return -1;}
               if (x.TipoVenta > y.TipoVenta) {return 1;}
               return 0;
                 
              }
             
              let order = regs.sort(SortArray)
              this.setState({TipoFilter:2})
             }
      }
      CuentaFilter=()=>{
        let nuevoval = this.state.CuentaFilter + 1
        let regs = this.props.state.RegContableReducer.Ventas
        if(nuevoval ==2){
          
             function SortArray(x, y){
              if (x.formasdePago[0].Cuenta.NombreC < y.formasdePago[0].Cuenta.NombreC) {return -1;}
              if (x.formasdePago[0].Cuenta.NombreC  > y.formasdePago[0].Cuenta.NombreC) {return 1;}
              return 0;
                
             }
          
             let order = regs.sort(SortArray)
               this.setState({CuentaFilter:nuevoval})
            }else if(nuevoval ==3){
         
              function SortArraydec(x, y){
                if (y.formasdePago[0].Cuenta.NombreC< x.formasdePago[0].Cuenta.NombreC  ) {return -1;}
                if (y.formasdePago[0].Cuenta.NombreC> x.formasdePago[0].Cuenta.NombreC  ) {return 1;}
                  return 0;
              }
          
              let order = regs.sort(SortArraydec)
          
              this.setState({CuentaFilter:nuevoval})
             }else if(nuevoval ==4){
          
              function SortArray(x, y){
               if (x.TipoVenta < y.TipoVenta) {return -1;}
               if (x.TipoVenta > y.TipoVenta) {return 1;}
               return 0;
                 
              }
             
              let order = regs.sort(SortArray)
              this.setState({TipoFilter:2})
             }
      }
      DiaryFilter=(regs)=>{
       
        let fecha = new Date(this.state.tiempo)
                let fechaini = fecha.setHours(0, 0, 0)
                let fechafin = fecha.setHours(23, 59, 59)
            
                  let misregs = regs.filter(regs=> regs.tiempo >= fechaini && regs.tiempo <= fechafin  )
        
                  return misregs
              
      }
  
      MensualFilter=(regs)=>{
      
        let fecha = new Date(this.state.tiempo)
                  var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getTime()
                  var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
                  var ultimahora = new Date(ultimoDia.setHours(23, 59, 59)).getTime()
                  if(regs){
                    let misregfiltrados = regs.filter(regs=> regs.tiempo >= primerDia && regs.tiempo <= ultimahora  )
                  return misregfiltrados
                  }else{
                    return regs
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
      PeriodoFilter=(regs)=>{
       
        let fecha = new Date(this.state.tiempo)
        let fechafin = new Date(this.state.tiempoperiodofin)
    
        var primerDiaP = fecha.setHours(0,0,0)
        var ultimoDiaP = fechafin.setHours(23,59,59)
      
        let fechainix = new Date(primerDiaP).getTime()
        let fechafinx = new Date(ultimoDiaP).getTime()
        if(regs.length >0){
          let misregsP = regs.filter(regs=> regs.tiempo >= fechainix && regs.tiempo <= fechafinx) 
          return misregsP
        }else{
          return regs
        }
      
      }
      getMonthName = ()=> {
        var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
        return monthNames[this.state.tiempo.getMonth()];
    }
     removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } 
      FilterSistem=(regs)=>{

          let regis = []
        if(this.state.diario){
  
        let FiltradoPordia = this.DiaryFilter(regs)

        regis = FiltradoPordia
      }
      else if(this.state.mensual){
     
        let FiltradoPormes = this.MensualFilter(regs)
        regis =  FiltradoPormes
      }
      else if(this.state.periodo){
        
        let FiltradoPorPeriodo = this.PeriodoFilter(regs)
        regis = FiltradoPorPeriodo
      }

      if(this.state.searcherIn != ""){
        let valor = this.state.searcherIn
        let regisFiltradoVenta =  regis.filter((reg)=>{

          let telefono = reg.telefonoCliente? reg.telefonoCliente : 0

       return(
            this.removeAccents(reg.nombreCliente.toLowerCase()).includes(valor.toLowerCase())||
            this.removeAccents(reg.correoCliente.toLowerCase()).includes(valor.toLowerCase())||
            this.removeAccents(reg.direccionCliente.toLowerCase()).includes(valor.toLowerCase())||
            this.removeAccents(reg.cedulaCliente.toLowerCase()).includes(valor.toLowerCase())||
            this.removeAccents(reg.ciudadCliente.toLowerCase()).includes(valor.toLowerCase())||
           reg.iDVenta == valor||
           reg.telefono == valor
            
            )
        })
        return regisFiltradoVenta
      }else{
        return regis
      }


      }
      handleChangeTiempo=(e)=>{

        this.setState({
          tiempo:e._d
        })
        
       
         }
         handleChangeTiempoPeriodofin=(e)=>{
          if(e){ 
          this.setState({
            tiempoperiodofin:e._d
          })
         }
        }
         deleteVentaList=(e)=>{
          console.log("delete",e)

          this.setState({VentaSelected:e,deleteVenta:true })
        }
        resendProcess=(e)=>{ 
           console.log(e)
          let allData  = {}

          allData.nombreComercial =this.props.state.userReducer.update.usuario.user.Factura.nombreComercial || ""
          allData.secuencial =e.Secuencial|| ""
          allData.razon = this.props.state.userReducer.update.usuario.user.Factura.razon || ""
          allData.ruc =this.props.state.userReducer.update.usuario.user.Factura.ruc || ""
          allData.razonSocialComprador =  e.nombreCliente|| ""
          allData.identificacionComprador = e.cedulaCliente|| ""
          allData.estab =this.props.state.userReducer.update.usuario.user.Factura.codigoEstab || ""
          allData.ptoEmi =this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision || ""
          allData.SuperTotal = e.PrecioCompraTotal|| ""
          allData.ClaveAcceso = e.ClaveAcceso  || ""
          
          let dataTosend = {
            allData,
            Usuario : {DBname:this.props.state.userReducer.update.usuario.user.DBname},
            extradata:e
          
          }

       
          fetch("/public/resendauthfact", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(dataTosend), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
            console.log(response)
            if(response.status == "ok"){
              this.props.dispatch(updateVenta(response.nuevaVenta));
              let add = {
                Estado:true,
                Tipo:"success",
                Mensaje:"Autorizado"
            }
            this.setState({Alert: add })
            }else{
              let add = {
                Estado:true,
                Tipo:"info",
                Mensaje:"Factura aun en proceso"
            }
            this.setState({Alert: add })
            }
          })
         

        }
        downloadFact=(e)=>{  
        
          let valorNumero = e.Doctype =="Factura"?e.Secuencial:e.iDVenta
          let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,

          },
        ...e
        }

          fetch("/public/downloadfact", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(datos), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
         
            if(response.status == "Ok"){
              const url = window.URL.createObjectURL(
                new Blob([Buffer.from(response.buffer)], { type: "application/pdf"}),
              );
            let link = document.createElement('a');
            link.href = url;
            link.setAttribute(
              'download',
              `${e.Doctype} ${valorNumero}`,
            );
            link.click()
            
            let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Operacion exitosa, espere unos segundos"
          }
          this.setState({Alert: add })
          }
          })
        
        
        }
      
    render () {
 
      let flechaval = this.state.filtrosTiempo?"▲":"▼"
      let diarioval = this.state.diario?"activeval":"";
      let mensualval = this.state.mensual?"activeval":"";
      let periodoval = this.state.periodo?"activeval":"";
      let filtrados = []
      let listActive = this.state.vista=="listmode"?"listActive":""
let imageActive = this.state.vista=="pickmode"?"listActive":""
      let listComp= <CircularProgress />
      let listviewcomp =  <CircularProgress />
  
      if(this.props.state.RegContableReducer.Ventas){
       filtrados = this.FilterSistem(this.props.state.RegContableReducer.Ventas)
    
        if(filtrados){
        listComp =filtrados.map((comp, i)=>{
      
        return(<VentaR key={comp._id} 
          datos={comp}
          onClick={()=>{
         
            this.setState({viewVenta:true, dataventa:datos})}}
          />)
      })
     
      listviewcomp=filtrados.map((comp, i)=>{
      
        return(<VentaRenderList 
          key={comp._id} 
          datos={comp} 
          getNota={(datos)=>{ this.setState({viewNota:true, dataNota:datos})}} 
          watchNotaCredito={(datos)=>{ this.setState({viewerNota:true, viewerdataNota:datos})}}
          viewCreds={(datos)=>{ this.setState({viewCreds:true, dataCred:datos})}} 
          sendView={(datos)=>{ this.setState({viewVenta:true, dataventa:datos})}} 
            

          user={this.props.state.userReducer.update.usuario.user.Tipo}
           deleteVentaList={(datos)=>{this.deleteVentaList(datos)}}
        
           resendProcess={(datos)=>{this.resendProcess(datos)}} 
           />)
      })}
    }
    const handleClick = (event) => {
      this.setState({anchorEl:event.currentTarget});
    };
    const handleClose = () => {
      this.setState({anchorEl:null});
    };


        return ( 

       

<div className="maincontacto" id="mainListVentas" >
            <div className="contcontactoCompras"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Listado Ventas</p>
            <div>
          <DropdownButtonVentas arrData={filtrados} 
          img={this.props.state.userReducer.update.usuario.user.Factura.logoEmp}
          state={{
            diario:this.state.diario,
            mensual:this.state.mensual,
            periodo:this.state.periodo,
            tiempo:this.state.tiempo,
            tiempoperiodofin:this.state.tiempoperiodofin,
              estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab ,
          ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision ,
          nombreComercial:this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
           }}
          />
      </div>
         
         
        </div>
     
        </div>
<div className='Newcontainter'  ref={this.componentRef} >
        <div className="filtros">
        <div className="renderFilter" onClick={()=>{this.setState({filtrosTiempo:!this.state.filtrosTiempo})}}> {flechaval}</div>

        <div className='ContFiltoscentral'>
          <Animate show={this.state.filtrosTiempo}>
        <div className="cont-Prin">

<div  id="diario" className={`botongeneral jwPointer ${diarioval}  `}onClick={ this.buttonsp}>Diario</div>
<div id="mensual" className={`botongeneral jwPointer ${mensualval} `}onClick={ this.buttonsp}>Mensual</div>
<div id="periodo" className={`botongeneral jwPointer ${periodoval} `}onClick={ this.buttonsp}> Periodo</div>


</div>
<div className='ContFiltrosgeneral'>
<div className='contAnimacion'>
<Animate show={this.state.mensual}>
<div className="contfiltromensual jwContFlexCenter">
<div className="subtituloArt contNameButtons">
                       {this.getMonthName()}
                       <div className="Contdonwloadbutton">
            <Animate show={!this.state.loadingData}>
            <button className="downloadbutton"onClick={this.getVendData} >       <span className="material-icons">
              find_replace
</span></button>
</Animate>
<Animate show={this.state.loadingData}>
<CircularProgress />
</Animate>
</div>
<button className="downloadbutton"onClick={()=>{this.setState({chartModal:true})}} >       <span className="material-icons">
               pie_chart
</span></button>
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
                <div className="subtituloArt contNameButtons">
                       {this.getDayName()}
                       <div className="Contdonwloadbutton">
            <Animate show={!this.state.loadingData}>
            <button className="downloadbutton"onClick={this.getVendData} >       <span className="material-icons">
              find_replace
</span></button>
</Animate>
<Animate show={this.state.loadingData}>
<CircularProgress />
</Animate>
</div>
<button className="downloadbutton"onClick={()=>{this.setState({chartModal:true})}} >       <span className="material-icons">
               pie_chart
</span></button>
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
                  <div className="subtituloArt contNameButtons">
                 
                       <div className="Contdonwloadbutton">
            <Animate show={!this.state.loadingData}>
            <button className="downloadbutton"onClick={this.getVendData} >       <span className="material-icons">
              find_replace
</span></button>
</Animate>
<Animate show={this.state.loadingData}>
<CircularProgress />
</Animate>
</div>
<button className="downloadbutton"onClick={()=>{this.setState({chartModal:true})}} >       <span className="material-icons">
               pie_chart
</span></button>
                     </div>  
                       <div className="contmensual">
                       <div className="separador">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="D/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Fecha de inicio "
          value={this.state.tiempo}
          onChange={this.handleChangeTiempo}
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
                  <div className='conFiltroNombres'>
<div className="react-autosuggest__container">
<input name="searcherOut" className="react-autosuggest__input" onChange={this.handleChangeGeneral} placeholder="Busca Ventas" /> 
<div className='contSearcher'>
<i className={`material-icons  `} onClick={()=>{this.setState({searcherIn:this.state.searcherOut})}}>
search
</i>
</div>
  </div>

</div>
</div>
</Animate>


</div>
    </div>
    <div className="Customcont centrar">
    <div className="contdinerosum2 ">
                <div className="dineroresum2 ">
                   
                   <div className="contsgens">
                       <div className="minigen">
                           <div style={{color:"blue"}}>Ventas</div>
                           <div>${this.displayVentas()}</div>
                       </div>
                       <div className="minigen">
                           <div style={{color:"red"}}>Créditos</div>
                           <div>${this.displayCreds()}</div>
                       </div>
                       <Animate show={this.props.state.userReducer.update.usuario.user.Tipo == "administrador"}>
                       <div className="minigen">
                           <div style={{color:"green"}}>Ganancia</div>
                           <div>${this.displayGanancia()}</div>
                       </div>
                       </Animate>
                       </div>
                   </div>
                   </div>
                   <div className="visualization">
                <button className={`btn btn-primary botonVisualite ${listActive} `} onClick={()=>{this.setState({pickmode:false, listmode:true,vista:"listmode"})}}>
                <span className="material-icons">
                list
</span>
    
  </button>

  <button className={`btn btn-primary botonVisualite ${imageActive} `} onClick={()=>{this.setState({pickmode:true, listmode:false,vista:"pickmode"})}}>
                <span className="material-icons">
               image
</span>
    
  </button>

</div>
                   </div>
                   <Animate show={this.state.pickmode}>
    <div className="listvent">
    {listComp}
      </div>
      </Animate>
      <Animate show={this.state.listmode}>
        <DoubleScrollbar>
        <div className="contTitulosArt">
                        
                        <div className="eqIdart">
                        <div className="textPrint">     ID     </div>
                        <div className="contFlechaFiltro">
                         
                         <Animate show={this.state.filterid == 1}>
           <i className="material-icons filtroini"  onClick={this.filterid}>      panorama_fish_eye</i>
           </Animate>
           <Animate show={this.state.filterid == 2}>
           <i className="material-icons"  onClick={this.filterid}>  arrow_drop_up</i>
           </Animate>
           <Animate show={this.state.filterid == 3}>
           <i className="material-icons"  onClick={this.filterid}>  arrow_drop_down</i>
           </Animate>
                        </div>
                        </div>
                        <div className="tituloArtic">
                        <div className="textPrint">      Fecha  </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.filterid == 1}>
           <i className="material-icons filtroini"  onClick={this.filterid}>      panorama_fish_eye</i>
           </Animate>
           <Animate show={this.state.filterid == 2}>
           <i className="material-icons"  onClick={this.filterid}>  arrow_drop_up</i>
           </Animate>
           <Animate show={this.state.filterid == 3}>
           <i className="material-icons"  onClick={this.filterid}>  arrow_drop_down</i>
           </Animate> </div>
                        </div>
                        
                        <div className="tituloArtic">
                        <div className="textPrint">     Artículos </div>
                        
                        </div>
                        <div className="existenciaArtic">
                        <div className="textPrint">     Documento </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.documentoFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.documentoFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.documentoFilter == 2}>
              <i className="material-icons"  onClick={this.documentoFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.documentoFilter == 3}>
              <i className="material-icons"  onClick={this.documentoFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic">
                        <div className="textPrint">     Estado </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.estadoFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.estadoFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.estadoFilter == 2}>
              <i className="material-icons"  onClick={this.estadoFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.estadoFilter == 3}>
              <i className="material-icons"  onClick={this.estadoFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic ">
                        <div className="textPrint">         Vendedor  </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.vendedorFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.vendedorFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.vendedorFilter == 2}>
              <i className="material-icons"  onClick={this.vendedorFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.vendedorFilter == 3}>
              <i className="material-icons"  onClick={this.vendedorFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic ">
                        <div className="textPrint">         Cliente  </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.clienteFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.clienteFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.clienteFilter == 2}>
              <i className="material-icons"  onClick={this.clienteFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.clienteFilter == 3}>
              <i className="material-icons"  onClick={this.clienteFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic  ">
                        <div className="textPrint">    Tipo     </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.TipoFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.TipoFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.TipoFilter == 2}>
              <i className="material-icons"  onClick={this.TipoFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.TipoFilter == 3}>
              <i className="material-icons"  onClick={this.TipoFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic  ">
                        <div className="textPrint">        Cuenta   </div>
                     
                        </div>
                        <div className="existenciaArtic  ">
                        <div className="textPrint">    Ganancia     </div>
                     
                        </div>
                        <div className="existenciaArtic  ">
                        <div className="textPrint">    V.Total </div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.filtervtotal == 1}>
           <i className="material-icons filtroini"  onClick={this.filtervtotal}>      panorama_fish_eye</i>
           </Animate>
           <Animate show={this.state.filtervtotal == 2}>
           <i className="material-icons"  onClick={this.filtervtotal}>  arrow_drop_up</i>
           </Animate>
           <Animate show={this.state.filtervtotal == 3}>
           <i className="material-icons"  onClick={this.filtervtotal}>  arrow_drop_down</i>
           </Animate> </div>
                        </div>
                        <div className="existenciaArtic centerti">
                            Acc
                        </div>
                    </div>
                    <div style={{marginBottom:"100px"}}>
                    {listviewcomp}
                    </div> 
                          </DoubleScrollbar>
                  </Animate>
                   </div>

        </div>
        <Animate show={this.state.deleteVenta}>
        <ModalDeleteVentas DeleteReg={this.state.VentaSelected} Flecharetro={()=>{this.setState({deleteVenta:false, VentaSelected:{}});this.props.updateArt()}  }/>
        </Animate>
        <Animate show={this.state.viewVenta}>
        <ViewVenta token={this.props.state.userReducer.update.usuario.token} usuario={this.props.state.userReducer.update.usuario}datos={this.state.dataventa} Flecharetro={()=>{this.setState({viewVenta:false, dataventa:""})}  }/>
        </Animate>
        <Animate show={this.state.viewCreds}>
        <ViewCreds datos={this.state.dataCred} Flecharetro={()=>{this.setState({viewCreds:false, dataCred:""})}  }/>
        </Animate>

        <Animate show={this.state.chartModal}>
        <Estadisticas datos={filtrados} tipo={"ventas"} Flecharetro={()=>{this.setState({chartModal:false})}} />
        </Animate>

<Animate show={this.state.viewNota}>
<ViewNotas datos={this.state.dataNota} Flecharetro={()=>{this.setState({viewNota:false})}} />
</Animate>
<Animate show={this.state.viewerNota}>
<ViewNotasCred updateNotaCred={(e)=>{console.log(e);
  
  this.props.dispatch(updateVenta(e.updatedVenta))}} 
 
  
  userData={this.props.state.userReducer.update} datos={this.state.viewerdataNota} Flecharetro={()=>{this.setState({viewerNota:false})}} />
</Animate>

           <style jsx>{`
         .conFiltroNombres{R
          display:flex;
           }
         .ContFiltrosgeneral{
          display:flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 10px;
         }
            .contdinerosum2{
              display: flex;
              justify-content: center;
              align-items: center;
              width: 80%;
              

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
              .contenedorArticulosVentas{
             
                margin-top: 15px;
                background: #ffffff7a;
                padding: 15px;
                border-radius: 10px;
                overflow-x: scroll;  
                padding-bottom: 50px
                max-width: 1000px;
              
        }
        .cont-Prin {
          display: flex;
          width: 100%;
          justify-content: space-evenly;
          margin-top:5px;
          margin-bottom:5px;
        }
        .botongeneral{
          border-radius: 10px;
          width: 30%;
          font-weight: bold;
          height: 30px;
          background: white;
          transition: 0.5s ease-out;
          display: flex;
          justify-content: center;
          align-items: center;
          color: lightgrey;
         }
                .centrar{
                  width: 100%;
                  display: flex;
                  justify-content: center;
              }
   
    .listActive{
      box-shadow: -1px -1px 2px 4px #1e214c;
  }
  .visualization{
      display: flex;
      width: 50%;
      
  justify-content: space-around;
  align-items: center;

  }
  .contTitulosArt{
    margin-top: 15px;
    display:inline-flex;
 
    font-size: 20px;
    font-weight: bolder;
}
i{
  cursor:pointer;
}
.contSearcher{
  display: flex;
  cursor: pointer;
  padding: 5px;
  background: blue;
  color: white;
  border-radius: 5px;
  margin: 2px 9px;
}
.eqIdart{
  width: 85px;  
  display: flex;
}
.tituloArtic{
  width: 250px;  
  display: flex;
}
.precioArtic{
  width: 100px; 
  display: flex;
}
.existenciaArtic{
  width: 131px; 
  margin-right:10px;
  display: flex;
}
.botonVisualite{
  padding: 6px;
  border-radius: 36px;
  display: flex;
  box-shadow: 0px 0px 0px 0px #1e214c;
  transition: 1s;
  max-height: 40px;
}
             .listvent{
              overflow: scroll;
              overflow-x: hidden;
              height: 55vh;
              margin-top: 10px;
              display: flex;
              flex-flow: column;
              align-items: center;
             }
             .contPfinal{
              display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
             }
           .imgventa{
            margin-top: 30px;
    height: 100px;
    width: 100px;
   }
 
           .cDc2{
     margin-left:10px;
   }
   .filtroini{
    font-size:15px;
    cursor:pointer;
}

.centerti{
  text-align:center;
  justify-content: center;
}
   .contDatosC{
     display:flex;
     width: 100%;
   }
       .headercontact {

            display:flex;
            justify-content: space-around;

           }

            .botonventa{
            
              margin-top: 17px;
    border-radius: 10px;

    background-color: #048b0b;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
    color: #fff;
    transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4,0,0.2,1);
    height: 36px;
    line-height: 2.25rem;
    font-family: Roboto,sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    -webkit-letter-spacing: 0.06em;
    -moz-letter-spacing: 0.06em;
    -ms-letter-spacing: 0.06em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: none;
    width: 40%;
             }
               
        .maincontacto{
      z-index: 1299;
         width: 98.5vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition:0.5s;
         overflow-y: scroll;  
         
       }
       .contcontactoCompras{
        border-radius: 9px;
      width: 90vw;
        background-color: whitesmoke;
        padding: 5px 10px;
        position:absolute;
        top:0px;
        overflow: hidden;
       }
      
      
       .tituloventa{
         display: flex;
         align-items: center;
         font-size: 30px;
         font-weight: bolder;
         text-align: center;
     
         justify-content: space-evenly;
    width: 100%;
       }
       .tituloventa p{
         margin-top:5px;
         margin-bottom:5px
       }
     
       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
       }
    
      
          .react-autosuggest__container{
            position: relative;
          border-radius: 6px;
          border: 2px solid #ffffff;
          box-shadow: -1px 5px 9px #418fe2;
          margin: 0px;
          margin-right: 20px;
        display:flex;
        
        align-items: center;
          }         
          
       body {
            height:100%

           }

           .contform{
            padding-bottom: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
           }

      

       
          .entradaaddc{
            left: 0%;
           }
           .minigen{
            text-align: center;
         } 
          .contsgens{
            display: flex;
          width: 100%;
          justify-content: space-around;
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
     
         
          .contfiltromensual{
            display: flex;
         flex-wrap:wrap;
          } 
          .Contdonwloadbutton{
            display:flex;
            flex-flow:column
           }
           .downloadbutton{
            color: white;
            border-radius: 36px;
            background: #5253ff;
            /* padding-top: 5px; */
            height: 44px;
         
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
          .fechacentral{
            width: 60%;
          }

          .contmensual{
            display: flex;
            justify-content: space-around;
          align-items: center;
          max-width: 500px;
          
          border: 6px outset;
          border-radius: 11px;
          margin: 10px 0px;
          }
          .contNameButtons{
            display:flex;
            justify-content: space-around;
            align-items: center;
            width: 80%;
            max-width: 300px;
          }
          .activeval{
            height: 40px;
            color: black;
            box-shadow: -5px 1px 5px #5498e3;  
          
          }
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
               .comunicacionart{
                 margin-bottom:2px;
               }
               .marginador{
                margin: 0px 2px 15px 2px;
               }
        
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoCompras{
       
      //   width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
           
              .imgventa{
            margin-top: 40px;
    height: 150px;
    width: 150px;
   }
          }
          
           `}</style>
        </div>
       
        

        
        )
    }
}

const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(Listvent);