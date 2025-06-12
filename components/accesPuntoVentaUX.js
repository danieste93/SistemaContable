import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';
import Autosuggest from '../components/suggesters/jwsuggest-general-venta';
import ModalAddIndividual from "../components/inventariocompo/modal-addArtIndividual"
import ModalAddServ from "../components/inventariocompo/modal-addServicio"
import ModalFormapago from "../components/reusableComplex/modal-addFormaPago"
import ModalEditFormapago from "../components/reusableComplex/modal-editFormaPago"


import ArticuloVentaUX from "./puntoventacompo/articuloventaRenderUX"
import ReactToPrint from "react-to-print";
import ArticuloVentaRenderImpersion from "./puntoventacompo/articuloventaRenderImpresion"
import Pagination from "./Pagination";
import BarcodeReader from 'react-barcode-reader'
import FormasdePagoList from "./reusableComplex/formasPagoRenderUX"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Sidebar from './puntoventacompo/sidebar';


import {addRegs,getArts,getcuentas,getClients, cleanData, addVenta,addClient,updateClient, addCuenta, updateCuentas, updateArts,updateArt } from "../reduxstore/actions/regcont";

import CircularProgress from '@material-ui/core/CircularProgress';
import {Animate} from "react-animate-mount"
import BotonExpandible from './puntoventacompo/bexpansivo';
import ArtRenderUX from './puntoventacompo/articuloListRenderUX';
import {paginationPipe} from "../reduxstore/pipes/paginationFilter";
import {Filtervalue,Searcher} from "./filtros/filtroeqid"
import { Height } from '@material-ui/icons';


class accessPuntoVentaUX extends Component {
     state={
      NumberSelect:0,
      createServ:false,
        cuentasmodal:false,
              createArt:false,
              cuentaAsignada:false,
              idCoti:"",     
              Resultados:false,
              html:"",
              disableDoc:false,
              impresion:false,
              Testing:false,
              valorAbuscar:"",
              loading:false,
              modalEditServ:false,
              cotiToClient:false,
                doctype:"Factura",
                
                Comprador:{
                  UserSelect:false,
                          id:"",
                          usuario:"Consumidor Final",
                        
                          correo:"activos.ec@gmail.com",
                          telefono:"",
                          ciudad:"",
                          direccion:"xxxxxxxxxx",
                          cedula:"9999999999999",
                          idcuenta:"",
                           ClientID:"Cedula",
               
                },
                         
                          Alert:{Estado:false},
                          readOnly:true,
                          perPage: 10,
                          currentPage: 1,
                          pagesToShow: 5,
                          addCompra:false,
                          ArtVent:[],
                          tipopago:"Contado",
                          Fpago:[
                           
                          ],
                          addFormaPago:false,
                          editFormaPago:false,
      
                          SelectFormaPago:[],
                          Fcredito:[],
                          descuentoPer:0,
                          descuentoVal:0,
                          userEditMode:false,
                          arrPrecios:[],
                          itemsExpirados:[],
                          idVenta:"",
                          idReg:"",
                          outStock:false,
                          creditLimit:0,
                          creditoCantidadIni:0,
      
                          ccinid:true,
                          ModalCaducadoCombo:false,
                          ventasErr:[],
                          ventasErrCombo:[],
                          secuencialGen:0,
                          secuencialBase:0,
                          userDisplay:false,
                          adduser:false,
           

     }
        componentRef = React.createRef(); 
          printRef  = React.createRef();
          channel1 = null;
          componentDidMount(){
             
     this.loadFromLocalStorage()
     
  this.startPuntoVentaData()
  }

      comprobadorAddArt=(e)=>{
           
              let findArt = this.state.ArtVent.find(x => x._id == e._id)
              let findA = this.props.state.RegContableReducer.Articulos.findIndex(x => x._id == e._id)
              if(findArt == undefined){
  if(e.Tipo == "Producto"){
   
  
      let acum = 0
      if(this.state.ArtVent.length > 0){
  
          let findCombos = this.state.ArtVent.filter(x=>x.Tipo == "Combo")
      
          let extractorArts = []
         
           findCombos.forEach(x=>{
             let valCompra = x.CantidadCompra
              x.Producs.forEach(j=>{
                  if (j._id == e._id){
                    
                      if(j.Medida == "Unidad"){
            
                          acum += (j.Cantidad*valCompra)
                      }else if(j.Medida == "Peso"){
                          if(j.Unidad == "Gramos"){
                              acum += ((j.Cantidad * 1)*valCompra)
                          }else if(j.Unidad == "Libras"){
                              acum += ((j.Cantidad * 453.592)*valCompra)
                          }else if(j.Unidad == "Kilos"){
                              acum += ((j.Cantidad * 1000)*valCompra)
                          }
                      }
                  }
              })
           })
         
          
     
       }
  
       if(e.Existencia < (acum+1)){
          let message = `Los productos "${e.Titulo}" tiene existencias insuficientes para ser agregado` 
          let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:message
          }
          this.setState({Alert: add,loading:false}) 
         }else{
          if(e.Caduca.Estado){
              let tiempoActual = new Date().getTime()
              let tiempoCaduca = new Date(e.Caduca.FechaCaducidad).getTime()
          
              if(tiempoActual > tiempoCaduca   ){
                  this.setState({ModalCaducado:true, itemCaduco:e})
              }else{
                  e.CantidadCacl=1
           
                  e.PrecioVendido= e.Precio_Venta
                  e.PrecioCompraTotal = e.Precio_Venta
                  e.Unidad ="Gramos"
                  e.CantidadCompra=1
                  let nuevoarr = [...this.state.ArtVent, e]  
                 
                   
                  this.setState({ArtVent:nuevoarr })
                  this.saveToLocalStorage({ArtVent:nuevoarr})
              }
          
          }else{
                  e.CantidadCompra=1
               
                  e.PrecioVendido= e.Precio_Venta
                  e.PrecioCompraTotal = e.Precio_Venta
                  e.Unidad ="Gramos"
                  e.CantidadCacl = 1
                  e.TipoPrecio ="Venta"
                  let nuevoarr = [...this.state.ArtVent, e]  
                 
                   
                  this.setState({ArtVent:nuevoarr })
                  this.saveToLocalStorage({ArtVent:nuevoarr})
              }
         }
   
      
  
  
  }else if(e.Tipo == "Combo"){
     
          
      let comboExpirados = []
      let comboEliminados = []
      let comboExistencias= []
      for(let i=0;i<e.Producs.length;i++){
          let valorProducto = 0
          let valorCombos = 0
          if(this.state.ArtVent.length > 0){ 
              let findCombos = this.state.ArtVent.filter(x=>x.Tipo == "Combo")
              let productoagregado = this.state.ArtVent.filter(x=> x._id == e.Producs[i]._id)
  
              if(productoagregado.length > 0){
         
                if(productoagregado[0].Medida == "Unidad"){
                  valorProducto = productoagregado[0].CantidadCompra
                }else if(productoagregado[0].Medida == "Peso"){
                  if(productoagregado[0].Unidad == "Gramos"){
                      valorProducto = parseFloat(productoagregado[0].CantidadCompra * 1)
                  }else if(productoagregado[0].Unidad == "Libras"){
                      valorProducto = parseFloat(productoagregado[0].CantidadCompra * 453.592)
                  }else if(productoagregado[0].Unidad == "Kilos"){
                      valorProducto = parseFloat(productoagregado[0].CantidadCompra * 1000)
                 
                }
              }
        
         }
         if(findCombos.length > 0){
        
        
          findCombos.forEach(x=>{
              let valCompra = x.CantidadCompra
               x.Producs.forEach(j=>{
                    
                   if (j._id == e.Producs[i]._id){
                      valorCombos += (valCompra * j.Cantidad)
                       
                   }
               })
            })
         }
   
          }
     
          let findArtComb = this.props.state.RegContableReducer.Articulos.find(x => x._id == e.Producs[i]._id)
     
          if(findArtComb == undefined){
              comboEliminados.push({Product:e.Producs[i].Titulo})
          }else{
              if(e.Producs[i].Caduca){
                  if(e.Producs[i].Caduca.Estado){
                  let tiempoActual = new Date().getTime()
                  let tiempoCaduca = new Date(e.Producs[i].Caduca.FechaCaducidad).getTime()
                  if(tiempoActual > tiempoCaduca   ){
                      comboExpirados.push({Product:e.Producs[i].Titulo, Caduca:e.Producs[i].Caduca})
                  }}
              }
              if(e.Producs[i].Tipo == "Producto"){
                  if(e.Producs[i].Medida == "Unidad"){
                       
                      if(findArtComb.Existencia >=(e.Producs[i].Cantidad+valorProducto+valorCombos)){
                          
  
                      }else{
                          comboExistencias.push({Product:e.Producs[i].Titulo, ExistenciaAct:findArtComb.Existencia, ExistenciaMin:e.Producs[i].Cantidad,}) 
                      }
  
  
                  }else if(e.Producs[i].Medida == "Peso"){
  
                      let cantidadActual = findArtComb.Existencia
                      let cantidadRequerida = ""
                      if(e.Producs[i].Unidad == "Gramos" ){
                          cantidadRequerida =parseFloat(e.Producs[i].Cantidad)
                        }else if(e.Producs[i].Unidad == "Kilos" ){
                          cantidadRequerida =parseFloat(e.Producs[i].Cantidad) * 1000
                        }else if(e.Producs[i].Unidad == "Libras"){
                          cantidadRequerida =parseFloat(e.Producs[i].Cantidad) * 453.592
                        } 
                     
                        let totalReqPeso =parseFloat(cantidadRequerida)+parseFloat(valorProducto)+parseFloat(valorCombos)
                       
                        if(cantidadActual < totalReqPeso){
                          comboExistencias.push({Product:e.Producs[i].Titulo, ExistenciaAct:findArtComb.Existencia, ExistenciaMin:e.Producs[i].Cantidad,}) 
                        }else{
                       
                        }
                  
                      }
              }
                 
          }
  
  
          
  
      }//fim for
  
      if(comboEliminados.length > 0){
      
         let nombreComb = comboEliminados.map(name =>(`${name.Product}, `))
          let message = `Los productos "${nombreComb}" han sido removidos del invetario` 
          let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:message
          }
          this.setState({Alert: add,loading:false})   
      }else  if(comboExistencias.length > 0){
  
          let nombreComb = comboExistencias.map(name =>(`${name.Product}, `))
          let message = `Los productos "${nombreComb}" son insuficientes para vender el combo` 
          let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:message
          }
          this.setState({Alert: add,loading:false})  
  
          
      }else  if(comboExpirados.length > 0){
   
          this.setState({ModalCaducadoCombo:true,itemsExpirados:comboExpirados, itemCaduco:e})
  
      }
      
      else{
      e.CantidadCompra=1
  
      e.PrecioVendido= e.Precio_Venta
      e.PrecioCompraTotal = e.Precio_Venta
      e.CantidadCacl = 1
      e.TipoPrecio ="Venta"
      let nuevoarr = [...this.state.ArtVent, e]  
      this.setState({ArtVent:nuevoarr})
      this.saveToLocalStorage({ArtVent:nuevoarr})
  }
  }else if(e.Tipo == "Servicio"){
      e.CantidadCompra=1
    
      e.PrecioVendido= e.Precio_Venta
      e.PrecioCompraTotal = e.Precio_Venta
      e.CantidadCacl = 1
       e.TipoPrecio ="Venta"
      let nuevoarr = [...this.state.ArtVent, e]  
      this.setState({ArtVent:nuevoarr})
      this.saveToLocalStorage({ArtVent:nuevoarr})
  }
            
  
              }else{
                  let add = {
                      Estado:true,
                      Tipo:"info",
                      Mensaje:"Item ya ingresado"
                  }
                  this.setState({Alert: add,loading:false})
              }
  }

   loadFromLocalStorage=(state)=>{
 
        try{
      
      const serializedState = localStorage.getItem("puntoVenta")
      
      if(serializedState === null) return undefined
   
      let parsedState = JSON.parse(serializedState)
   
      this.setState(parsedState)
 
    
        } catch(e){
          
          return undefined
        }
      }

      saveToLocalStorage=(state)=>{
        try{

      const Puntoventaitem = localStorage.getItem("puntoVenta")
      let Puntoventaparsed = JSON.parse(Puntoventaitem)
      let newdata = {...Puntoventaparsed, ...state}
    
      const serializedState = JSON.stringify(newdata)
 
      localStorage.setItem("puntoVenta", serializedState)
        } catch(e){
         console.log(e,"error")
        }
      }
       startPuntoVentaData =()=>{
        if(!this.props.state.RegContableReducer.Articulos){
            this.getAllArts()
          }
         
            this.getUA()
          
    }

     getAllArts=()=>{
            
              let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                  Tipo: this.props.state.userReducer.update.usuario.user.Tipo
                }}
              let lol = JSON.stringify(datos)
              fetch("/public/engine/art", {
                method: 'POST', // or 'PUT'
                body: lol, // data can be `string` or {object}!
                headers:{
                  'Content-Type': 'application/json',
                  "x-access-token": this.props.state.userReducer.update.usuario.token
                }
              }).then(res => res.json())
              .catch(error => {console.error('Error:', error);
                     })
              .then(response => {  
              
                  if(response.status == 'error'){
                
                    if(response.message == "error al decodificar el token"){
                      this.props.dispatch(logOut());
                      this.props.dispatch(cleanData());
                      alert("Session expirada, vuelva a iniciar sesion para continuar");
                  
                   
                      Router.push("/ingreso")
                         
                    }
                  }else if(response.status == 'Ok'){             
      
                      this.props.dispatch(getArts(response.articulosHabiles));
                
                  }
              });
      
      
            }
        regisUser=()=>{
     
            console.log("en regisUser")
      
       var datar = {Usuario:this.state.Comprador.usuario,
                   TelefonoContacto:this.state.Comprador.telefono,
                   Ciudad:this.state.Comprador.ciudad,
                   Cedula:this.state.Comprador.cedula,
                   Direccion:this.state.Comprador.direccion,
                   Correo:this.state.Comprador.correo.toLowerCase(),
                   Contrasena:"abc123",
                   RegistradoPor:"Vendedor",
                   Confirmacion:true,
                   TipoID:this.state.Comprador.ClientID,
                   Userdata:  {DBname:this.props.state.userReducer.update.usuario.user.DBname   }               
                   }
                 
      var lol = JSON.stringify(datar)
    
       fetch('/users/register-seller', {
         method: 'POST', // or 'PUT'
         body: lol, // data can be `string` or {object}!
         headers:{
           'Content-Type': 'application/json',
           "x-access-token": this.props.state.userReducer.update.usuario.token
         }
       }).then(res => res.json())
       .catch(error => console.error('Error:', error))
       .then(response => {
      
        if(response.status=="error"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:response.message
          }
          this.setState({Alert: add, loading:false,}) 
          }
    
      
          else{
    
    
        this.setState({ 
            Comprador:{...this.state.Comprador,
                UserSelect:true ,
                id:response.user._id,
            },
            
        
                        readOnly:true,
                        adduser:false,
                     
                        idcuenta:null,
                        creditLimit:0,
                        tipopago:"Contado",
    
                    }) 
                    this.props.dispatch(addClient(response.user));
                    
                 
                   
    
                }     
       })
    
        }
        editUser=()=>{
       
            
    
       var data = {
                    Id:this.state.Comprador.id,
                   Usuario:this.state.Comprador.usuario,
                   Telefono:this.state.Comprador.telefono,
                   Correo:this.state.Comprador.correo.toLowerCase(),
                   Ciudad:this.state.Comprador.ciudad,
                   Direccion:this.state.Comprador.direccion,
                   Cedula:this.state.Comprador.cedula,
                   Userdata:  {DBname:this.props.state.userReducer.update.usuario.user.DBname   }   ,            
                    TipoID:this.state.Comprador.ClientID
                
                }
    
      var lol = JSON.stringify(data)
    
       fetch('/users/update-seller', {
         method: 'POST', // or 'PUT'
         body: lol, // data can be `string` or {object}!
         headers:{
           'Content-Type': 'application/json',
           "x-access-token": this.props.state.userReducer.update.usuario.token
         }
       }).then(res => res.json())
       .catch(error => console.error('Error:', error))
       .then(response => {
        if(response.message=="error al actualizar"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Error al actualizar, porfavor intente en unos minutos"
          }
          this.setState({Alert: add, loading:false,}) 
          }
          else{
            this.props.dispatch(updateClient(response.user));
        this.setState({
            Comprador:{
                ...this.state.Comprador,
                UserSelect:true,
            },
             
            readOnly:true,
            userEditMode:false,
            })
           
        }
       })
    
        }
         getAllArts=()=>{
                
                  let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                      Tipo: this.props.state.userReducer.update.usuario.user.Tipo
                    }}
                  let lol = JSON.stringify(datos)
                  fetch("/public/engine/art", {
                    method: 'POST', // or 'PUT'
                    body: lol, // data can be `string` or {object}!
                    headers:{
                      'Content-Type': 'application/json',
                      "x-access-token": this.props.state.userReducer.update.usuario.token
                    }
                  }).then(res => res.json())
                  .catch(error => {console.error('Error:', error);
                         })
                  .then(response => {  
                  
                      if(response.status == 'error'){
                    
                        if(response.message == "error al decodificar el token"){
                          this.props.dispatch(logOut());
                          this.props.dispatch(cleanData());
                          alert("Session expirada, vuelva a iniciar sesion para continuar");
                      
                       
                          Router.push("/ingreso")
                             
                        }
                      }else if(response.status == 'Ok'){             
          
                          this.props.dispatch(getArts(response.articulosHabiles));
                    
                      }
                  });
          
          
                }
            regisUser=()=>{
         
        
          
           var datar = {Usuario:this.state.Comprador.usuario,
                       TelefonoContacto:this.state.Comprador.telefono,
                       Ciudad:this.state.Comprador.ciudad,
                       Cedula:this.state.Comprador.cedula,
                       Direccion:this.state.Comprador.direccion,
                       Correo:this.state.Comprador.correo.toLowerCase(),
                       Contrasena:"abc123",
                       RegistradoPor:"Vendedor",
                       Confirmacion:true,
                       TipoID:this.state.Comprador.ClientID,
                       Userdata:  {DBname:this.props.state.userReducer.update.usuario.user.DBname   }               
                       }
                     
          var lol = JSON.stringify(datar)
        
           fetch('/users/register-seller', {
             method: 'POST', // or 'PUT'
             body: lol, // data can be `string` or {object}!
             headers:{
               'Content-Type': 'application/json',
               "x-access-token": this.props.state.userReducer.update.usuario.token
             }
           }).then(res => res.json())
           .catch(error => console.error('Error:', error))
           .then(response => {
          
            if(response.status=="error"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:response.message
              }
              this.setState({Alert: add, loading:false,}) 
              }
        
          
              else{
        
        
            this.setState({ 
                Comprador:{...this.state.Comprador,
                    UserSelect:true ,
                    id:response.user._id,
                },
                
            
                            readOnly:true,
                            adduser:false,
                         
                            idcuenta:null,
                            creditLimit:0,
                            tipopago:"Contado",
        
                        }) 
                        this.props.dispatch(addClient(response.user));
                        
                     
                       
        
                    }     
           })
        
            }
            editUser=()=>{
           
                
        
           var data = {
                        Id:this.state.Comprador.id,
                       Usuario:this.state.Comprador.usuario,
                       Telefono:this.state.Comprador.telefono,
                       Correo:this.state.Comprador.correo.toLowerCase(),
                       Ciudad:this.state.Comprador.ciudad,
                       Direccion:this.state.Comprador.direccion,
                       Cedula:this.state.Comprador.cedula,
                       Userdata:  {DBname:this.props.state.userReducer.update.usuario.user.DBname   }   ,            
                        TipoID:this.state.Comprador.ClientID
                    
                    }
        
          var lol = JSON.stringify(data)
        
           fetch('/users/update-seller', {
             method: 'POST', // or 'PUT'
             body: lol, // data can be `string` or {object}!
             headers:{
               'Content-Type': 'application/json',
               "x-access-token": this.props.state.userReducer.update.usuario.token
             }
           }).then(res => res.json())
           .catch(error => console.error('Error:', error))
           .then(response => {
            if(response.message=="error al actualizar"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Error al actualizar, porfavor intente en unos minutos"
              }
              this.setState({Alert: add, loading:false,}) 
              }
              else{
                this.props.dispatch(updateClient(response.user));
            this.setState({
                Comprador:{
                    ...this.state.Comprador,
                    UserSelect:true,
                },
                 
                readOnly:true,
                userEditMode:false,
                })
               
            }
           })
        
            }

             editFormaPago=(e)=>{
               this.setState({editFormaPago:true, SelectFormaPago:e})
             
           }
            editFormaPagoState=(e)=>{
            let testFind =  this.state.Fpago.find(x => x.Id == e.Id) 
            let newIndex = this.state.Fpago.indexOf(testFind) 
            let newArr = this.state.Fpago
            let dataGenerate ={
                Cantidad:e.Cantidad,
                Cuenta:e.CuentaSelect,
                Detalles:e.Detalles,
                Id:e.Id,
                Tipo:e.formaPagoAdd
            }
            newArr[newIndex] = dataGenerate
            this.setState({Fpago:newArr}) 
            this.saveToLocalStorage({Fpago:newArr})

           }
getUA=()=>{
             
        
                let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                    Tipo: this.props.state.userReducer.update.usuario.user.Tipo,
                    Id:this.props.state.userReducer.update.usuario.user._id
                
                }}
                let lol = JSON.stringify(datos)
                fetch("/public/engine/getua", {
                  method: 'POST', // or 'PUT'
                  body: lol, // data can be `string` or {object}!
                  headers:{
                    'Content-Type': 'application/json',
                    "x-access-token": this.props.state.userReducer.update.usuario.token
                  }
                }).then(res => res.json())
                .catch(error => {console.error('Error:', error);
                       })
                .then(response => {  
                   
                    if(response.status == 'error'){
                  
                      if(response.message == "error al decodificar el token"){
                        this.props.dispatch(logOut());
                        this.props.dispatch(cleanData());
                        alert("Session expirada, vuelva a iniciar sesion para continuar");
                                         
                        Router.push("/ingreso")
                           
                      }
                    }else if(response.status == 'Ok'){

                       
                        this.props.dispatch(getClients(response.clientesHabiles));
                        this.props.dispatch(getcuentas(response.allCuentasHabiles)); 
                        this.setState({
                                                                            
                            Counters:response.contadoresHabiles[0],
                            idReg:response.contadoresHabiles[0].ContRegs,
                            idVenta:response.contadoresHabiles[0].ContVentas,
                            secuencialGen:response.contadoresHabiles[0].ContSecuencial,
                            secuencialBase:response.contadoresHabiles[0].ContSecuencial,
                            idCoti:response.contadoresHabiles[0].ContCotizacion
                        })
                      

                    }
                });
        
        
              }
  getDataUser=()=>{
        if(this.props.state.userReducer != ""){
            return (this.props.state.userReducer.update.usuario)
        }else {
            return {}
        }
    }

       
   ceroMaker =(val)=>{

        let cantidad = JSON.stringify(val).length
    
        let requerido = 9 - cantidad
    
        let gen = '0'.repeat(requerido)
     
        let added = `${gen}${JSON.stringify(val)}`
   
        return added
    }

  
    getAutoValue=(data)=>{
     
        let arts = []
        let valor = data.target.value
        this.setState({ currentPage:1, valorAbuscar: valor}) 
    
    }
           resetArtData=()=>{
          
let nuevoval= {Articulos:this.props.state.RegContableReducer.Articulos}
this.setState({ data:nuevoval})


           }

           getRandomInt(max) {
            return Math.floor(Math.random() * max);
          }

onPrev = () => {
        const updatedState = {...this.state};
        if(updatedState.currentPage >= 1){
        updatedState.currentPage = this.state.currentPage - 1;
        this.setState(updatedState);
        }
    };

    
    onNext = () => {
        this.setState({
            ...this.state,
            currentPage: this.state.currentPage + 1
        });
       
    };

    goPage = (n) => {
        this.setState({
            ...this.state,
            currentPage: n
        });
    };
     obtenerextension = (articulos )=>{
        if(articulos === undefined) return 0
        const numero = articulos.length
        return numero
    }
calcularPagesToShow = () => {
    const { perPage } = this.state;
    const totalItems = this.obtenerextension(this.props.state.RegContableReducer.Articulos);
    const totalPages = Math.ceil(totalItems / perPage);

    return Math.max(1, Math.min(5, totalPages));
}
    updateArtImg= (articulo )=>{
      console.log(articulo)
      this.props.dispatch(updateArt(articulo))
    }
    addCero=(n)=>{
            if (n<10){
              return ("0"+n)
            }else{
              return n
            }
          }
          setPrecios=(e)=>{
           
            let indexset =  this.state.ArtVent.findIndex(x=>x._id === e.Id)  
            let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
            deepClone[indexset].PrecioCompraTotal = parseFloat(e.Valor)
            deepClone[indexset].PrecioVendido=  parseFloat(e.Valor) / parseFloat(e.CantidadArts)
            this.setState({ArtVent:deepClone})
            this.saveToLocalStorage({ArtVent:deepClone})
        }
        setTipoPrecio=(e)=>{
        

            let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
                let indexset = this.state.ArtVent.indexOf(itemfind[0])
                let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
                deepClone[indexset].PrecioVendido=  parseFloat(e.PrecioVenta)
                deepClone[indexset].PrecioCompraTotal = parseFloat(e.Valor)
                deepClone[indexset].TipoPrecio = e.tipoPrecio
                this.setState({ArtVent:deepClone})
                this.saveToLocalStorage({ArtVent:deepClone})
        }


        setService=(e)=>{
            this.setState({modalEditServ:true, serviceToEdit:e})
        }

        setServData=(e)=>{
       
            let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
            let indexset = this.state.ArtVent.indexOf(itemfind[0])
            let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
            deepClone[indexset].Precio_Compra =  parseFloat(e.value)
            deepClone[indexset].Precio_Compra =  parseFloat(e.value)
         
            this.setState({ArtVent:deepClone})
              this.saveToLocalStorage({ArtVent:deepClone})
        }
          SetAll=(e)=>{
   
            let cantidad = parseFloat(e.cant)
       
            if(e.item.Tipo == "Producto" )
            {

               
                let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
                let indexset = this.state.ArtVent.indexOf(itemfind[0])
                   
            let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
            deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
            deepClone[indexset].CantidadCompra =  parseFloat(e.CantidadGramos)
            deepClone[indexset].Unidad = e.unidad
            deepClone[indexset].PrecioCompraTotal = parseFloat(e.value)
            deepClone[indexset].PrecioVendido=  parseFloat(e.value) / parseFloat(e.cant)
                let valorcompar = 0
                if(this.state.ArtVent.length > 0){
                    let findCombos = this.state.ArtVent.filter(x=>x.Tipo == "Combo")
                
                       if(findCombos){
                           findCombos.forEach(x=>{
                               let valCompra = x.CantidadCompra
                                x.Producs.forEach(i=>{
                                 
                                    if (i._id == e.item._id){
                                        if(i.Medida == "Unidad"){
          
                                            valorcompar  += (i.Cantidad*valCompra)
                                        }else if(i.Medida == "Peso"){
                                            if(i.Unidad == "Gramos"){
                                                valorcompar  += ((i.Cantidad* 1)*valCompra)
                                            }else if(i.Unidad == "Libras"){
                                                valorcompar  += ((i.Cantidad* 453.592)*valCompra)
                                            }else if(i.Unidad == "Kilos"){
                                                valorcompar  += ((i.Cantidad* 1000)*valCompra)
                                            }
                                        }
                                     
                                    }
                                })
                             })
                       } 
                   }
               
              
              
          
              
             let valorCompara = (parseFloat(valorcompar) +  parseFloat(e.CantidadGramos))
             
              this.setState({ArtVent:deepClone})
              this.saveToLocalStorage({ArtVent:deepClone})
                if(e.item.Existencia >= valorCompara){
                    if(this.state.ventasErr.length > 0){
                        let findmyerror = this.state.ventasErr.filter(x=>x.id != e.item._id)
                      
                        this.setState({ventasErr:findmyerror,outStock:false})
                    }
      
              }else{
              let nuevoserrores = [...this.state.ventasErr]
              nuevoserrores.push({id:e.item._id,
                titulo:e.item.Titulo,
                atri:"Cantidad"})
              this.setState({ventasErr:nuevoserrores, outStock:true})
           
              setTimeout(()=>{ 
               
                let nombreComb = nuevoserrores.map(name =>(`${name.titulo}, `))
                let message = `El Producto: "${nombreComb}" no tiene suficientes existencias ` 
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:message
              }
                  this.setState({Alert:add})},100)

              }
    

          }else if(e.item.Tipo == "Servicio"){
            let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
            let indexset = this.state.ArtVent.indexOf(itemfind[0])
               
        let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
        deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
        deepClone[indexset].PrecioCompraTotal = parseFloat(e.value)
        deepClone[indexset].PrecioVendido=  parseFloat(e.value) / parseFloat(e.cant)
        deepClone[indexset].CantidadCompra = parseFloat(e.cant)
        this.setState({ArtVent:deepClone})
        this.saveToLocalStorage({ArtVent:deepClone})
          }else if(e.item.Tipo == "Combo"){
            let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
            let indexset = this.state.ArtVent.indexOf(itemfind[0])
            let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
            deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
            deepClone[indexset].CantidadCompra = parseFloat(e.cant)
            let productosExedidos =[]
            let nuevoserrores = []
            let valorProducto = 0
            let valorCombos = 0
            for(let i=0;i<e.item.Producs.length;i++){
                if(this.state.ArtVent.length > 0){ 
                   
                    let findCombos = this.state.ArtVent.filter(x=>x.Tipo == "Combo" && x._id !=e.item._id )
                    let productoagregado = this.state.ArtVent.filter(x=> x._id == e.item.Producs[i]._id)
        
              if(productoagregado.length > 0){
               
              if(productoagregado[0].Medida == "Unidad"){
                valorProducto = productoagregado[0].CantidadCompra
              }else if(productoagregado[0].Medida == "Peso"){
                if(productoagregado[0].Unidad == "Gramos"){
                    valorProducto = parseFloat(productoagregado[0].CantidadCompra * 1)
                }else if(productoagregado[0].Unidad == "Libras"){
                    valorProducto = parseFloat(productoagregado[0].CantidadCompra * 453.592)
                }else if(productoagregado[0].Unidad == "Kilos"){
                    valorProducto = parseFloat(productoagregado[0].CantidadCompra * 1000)
               
              }
            }
      
       }
               
               if(findCombos.length > 0){
                
                findCombos.forEach(x=>{
                    let valCompra = x.CantidadCompra
                     x.Producs.forEach(i=>{
                      
                         if (i._id == e.item._id){
                             if(i.Medida == "Unidad"){

                                valorCombos  += (i.Cantidad*valCompra)
                             }else if(i.Medida == "Peso"){
                                 if(i.Unidad == "Gramos"){
                                    valorCombos  += ((i.Cantidad* 1)*valCompra)
                                 }else if(i.Unidad == "Libras"){
                                    valorCombos  += ((i.Cantidad* 453.592)*valCompra)
                                 }else if(i.Unidad == "Kilos"){
                                    valorCombos  += ((i.Cantidad* 1000)*valCompra)
                                 }
                             }
                          
                         }
                     })
                  })
               }
         
                }
                let itemfind =  this.props.state.RegContableReducer.Articulos.filter(x=>x._id === e.item.Producs[i]._id)  
        
                let cantidadreq = 0
                if(e.item.Producs[i].Medida == "Unidad"){
                    cantidadreq = e.item.Producs[i].Cantidad * parseFloat(e.cant)
                }else if(e.item.Producs[i].Medida == "Peso"){
                   if(e.item.Producs[i].Unidad  =="Kilos"){
                    cantidadreq =  (parseFloat(e.cant)*1000)
                      }else if(e.item.Producs[i].Unidad =="Libras"){
                        cantidadreq = (parseFloat(e.cant)*453.592)
                      }else if(e.item.Producs[i].Unidad =="Gramos"){
                        cantidadreq =  (parseFloat(e.cant))
                      }
                }
           
       
         let cantTotal=cantidadreq + parseFloat(valorCombos) +parseFloat(valorProducto)
         
           if(itemfind[0].Existencia >=  cantTotal){
            if(nuevoserrores.length >0){
            let idfind = nuevoserrores.findIndex(x=>  x.idProd == e.item.Producs[i]._id && x.idCombo == e.item._id   )
            nuevoserrores.filter( x => x.idProd != e.item.Producs[i]._id)
        }

           }else{
            let dataCombo = {idCombo:e.item._id,
                idProd:e.item.Producs[i]._id,
                Producto: e.item.Producs[i]}

             nuevoserrores.push(dataCombo)
             
          
           }
           
            }
          
        if(nuevoserrores.length > 0){
            let nombreComb = nuevoserrores.map(name =>(`${name.Producto.Titulo}, `))
            let message = `Los productos "${nombreComb}" son insuficientes para vender el combo` 
            let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:message
            }
            setTimeout(()=>{  
                this.setState({Alert: add,loading:false,outStock:true})},100)
          
        }
        let stock = false
        if(nuevoserrores.length > 0){
            stock = true
        }else{
            stock = false
        }
           
            this.setState({ArtVent:deepClone,
                ventasErrCombo:nuevoserrores,
                outStock:stock})
                this.saveToLocalStorage({ArtVent:deepClone})
          }
        }
        createFormaPago=(e)=>{

        let ramdon = Math.floor(Math.random() * 1000);

        let newid = "FP-" +ramdon 

        let DatatoAdd=  {Tipo:e.formaPagoAdd,
             Cantidad:e.Cantidad,
              Cuenta:e.CuentaSelect,
               Id:newid,
               Detalles:e.Detalles}
        let newstate = [...this.state.Fpago, DatatoAdd]
       
        this.setState({Fpago:newstate})
        this.saveToLocalStorage({Fpago:newstate})
    }
    setUserData=(e)=>{
     let data ={
        Comprador:{
            id:e._id,
            UserSelect:true,
            usuario:e.Usuario,
            correo:e.Email,
            telefono:e.Telefono,
            ciudad:e.Ciudad,
            direccion:e.Direccion,
            cedula:e.Cedula,
            idcuenta:e.IDcuenta,
            creditLimit:0,
            ClientID:e.TipoID,

        },
        adduser:false,
        userDisplay:true,     
        tipopago:"Contado",
        readOnly:true
    }
        this.setState(data)
        this.saveToLocalStorage(data)
    }
    resetUserData=(e)=>{
    
    let data = {
        userDisplay:false,
        readOnly:true,
        userEditMode:false,
      
        Comprador:{
            UserSelect:false,
                    id:"",
                    usuario:"Consumidor Final",
                    correo:"activos.ec@gmail.com'",
                    telefono:"",
                    ciudad:"",
                    direccion:"xxxxxxxxxx",
                    cedula:"9999999999999",
                    idcuenta:"",
                     ClientID:"Cedula",
         
          },
       
    }
        this.setState(data)
        
        this.saveToLocalStorage(data)
    }

    

    handleChangePrinter=()=>{
this.setState({impresion:!this.state.impresion})
    }
    addNewUser=()=>{
        this.setState({readOnly:false, 
            adduser:true, 
            userDisplay:true,
            Comprador:{
                UserSelect:false,
                        id:"",
                        usuario:"",
                      
                        correo:"",
                        telefono:"",
                        ciudad:"",
                        direccion:"",
                        cedula:"",
                        idcuenta:"",
                         ClientID:"Cedula",
             
              },
        
        
        })
    }
setPreciosPago=(e)=>{
        
            let testFind =  this.state.Fpago.find(x => x.Id == e.Id)  
        
            let newIndex = this.state.Fpago.indexOf(testFind)
            let newArr = this.state.Fpago
            newArr[newIndex].Cantidad = e.Cantidad
            this.setState({Fpago:newArr})  
            this.saveToLocalStorage({Fpago:newArr})
           }

             handleDocType=(e)=>{
       
    if(e.target.value == "Factura"){
           this.setState({ descuentoPer:0, descuentoVal:0})
         this.saveToLocalStorage({ descuentoPer:0, descuentoVal:0})
    }
         this.setState({doctype:e.target.value})
         this.saveToLocalStorage({doctype:e.target.value})
     }
     setTitulo=(e, props)=>{
 
         let testFind =  this.state.ArtVent.find(x => x.Eqid == props.Eqid)
     
         if(testFind) {
            let index = this.state.ArtVent.indexOf(testFind)
            
            let antarr = this.state.ArtVent[index]
       
            var xdata = {...antarr}
            xdata.Titulo = e
            let newArr = this.state.ArtVent
            newArr[index] = xdata     
       
            this.setState({ArtVent:newArr})  
            this.saveToLocalStorage({ArtVent:newArr})
         }
           }
           
  render() {

console.log(this.state)
let nombreComercial = ""
let dirEstab =""
let generarRimpeNota = ""
let SuggesterReady =    <CircularProgress  />              
if(this.props.state.RegContableReducer.Clients){
  
    SuggesterReady =  <Autosuggest placeholder="Busca Clientes"
                     sendClick={this.setUserData}  
                      sugerencias={this.props.state.RegContableReducer.Clients}
                       resetData={this.resetUserData}  />  
}
let logogen = ""
if(this.props.state.userReducer){
    logogen = this.props.state.userReducer.update.usuario.user.Factura.logoEmp != ""?
    this.props.state.userReducer.update.usuario.user.Factura.logoEmp:"/logomin.png"
    generarRimpeNota = this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?"RIMPE NEGOCIOS POPULARES":"CONTRIBUYENTE REGIMEN RIMPE"
    nombreComercial =this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
    dirEstab = this.props.state.userReducer.update.usuario.user.Factura.dirEstab
}

    
let CheckReadOnly = this.state.readOnly?true:false
        
        let UserCont = {Usuario:""}

        if(this.props.state.userReducer){
            UserCont =this.props.state.userReducer.update.usuario.user
        }
        let tiempo = new Date()     
        
        let mes = this.addCero(tiempo.getMonth()+1)
        let dia = this.addCero(tiempo.getDate())
        
          var date = tiempo.getFullYear()+'-'+mes+'-'+ dia;       
           var hora = tiempo.getHours()+" : "+   this.addCero(tiempo.getMinutes())

       
var TotalSum = 0
let SuperTotal = 0
var SubTotal = 0
let totalDescuentoVal = 0
let totalDescuentoPer = 0
var IvaEC = 0
let descuentoCalculo=0
let TotalPago = 0
let estiloerror =""

const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

if(this.state.Fpago.length > 0){

    for(let i = 0; i<this.state.Fpago.length;i++){
    
         TotalPago += parseFloat(this.state.Fpago[i].Cantidad)
    }
    
}
let artssinIVA = []
let artsconIVA =[]
let valConIva= 0
let valSinIva = 0
let TotalValores = 0
   if(this.state.ArtVent.length > 0){
   
   artsconIVA = this.state.ArtVent.filter(x=>x.Iva == true)
    artssinIVA  = this.state.ArtVent.filter(x=>x.Iva == false)
    
    if(artsconIVA.length > 0){
        artsconIVA.forEach(x=>{
            valConIva += x.PrecioCompraTotal
        })
    } 
    if(artssinIVA.length > 0){
     
        artssinIVA.forEach(x=>{
         
            valSinIva += x.PrecioCompraTotal
        })
    } 
   
   }
   SuperTotal  = valSinIva +  valConIva
   if(this.state.descuentoVal > 0){
           
  SuperTotal  -=  parseFloat(this.state.descuentoVal)
}

if(this.state.descuentoPer > 0){
    descuentoCalculo = (SuperTotal * this.state.descuentoPer) / 100
    SuperTotal  -=  parseFloat(descuentoCalculo)
}



   if(SuperTotal > 0){
    SubTotal = valConIva/ parseFloat(`1.${process.env.IVA_EC }`)
   
    IvaEC = valConIva - (valConIva /  parseFloat(`1.${process.env.IVA_EC }`))
   }

   let SubTotalNota = SuperTotal 

        let activeadd= this.state.adduser? "articeadd":""
       
        let editadd= this.state.userEditMode? "editadd":""


      

let generadorArticulosLista = <CircularProgress />  
if(this.props.state.RegContableReducer.Articulos){
            let arts = this.props.state.RegContableReducer.Articulos
            let renderArts = []
            if(this.state.valorAbuscar.trim() ==""){
                renderArts=  arts 
            }else{

              

                const valorfiltrado = Filtervalue(arts, this.state.valorAbuscar)
                const filtrados = Searcher(arts, this.state.valorAbuscar)


                renderArts=  valorfiltrado.concat(filtrados)

            }


            generadorArticulosLista = paginationPipe(renderArts, this.state).map((item, i) => ( <ArtRenderUX
                                                                                    key={item.Eqid}
                                                                                    datos={item} 
                                                                                    updateArtimg={this.updateArtImg}
                                                                                    Cuenta={ ()=> {let miC = this.props.state.RegContableReducer.Cuentas.filter(x => x.iDcuenta ==item.Bodega_Inv )
                                                                                           return miC
                                                                                        }
                                                                                             }
                                                                                    sendArt={(e)=>{
                                                                                       this.comprobadorAddArt(e)}}
                                                                                    /> 
                                                                                    ));
       
    }
   let generadorArticulosListaVenta = []
   let generadorArticulosListaImpresion = []

    if(this.state.ArtVent.length >0){
        generadorArticulosListaVenta = this.state.ArtVent.map((item, i) => (<ArticuloVentaUX
                                                                            key={item._id}
                                                                             index={i}
                                                                             datos={item} 
                                                                             Errorlist={this.state.ventasErr}
                                                                             ErrorlistCombo={this.state.ventasErrCombo}
                                                                             sendNewtitulo={(e, props)=>{this.setTitulo(e, props)}}
                                                                             sendTipoPrecio={this.setTipoPrecio}
                                                                             sendPrecio={this.setPrecios}
                                                                             sendAll={this.SetAll} 
                                                                             deleteitem={(e)=>{
                                                                              console.log(e)
                                                                                let nuevoarr = this.state.ArtVent.filter(x => x.Eqid != e.Eqid)
                                                                                let nuevosPrecios = this.state.arrPrecios.filter(x => x.Id != item._id) 
                                                                            
                                                                                this.setState({ArtVent:nuevoarr, arrPrecios:nuevosPrecios })
                                                                                this.saveToLocalStorage({ArtVent:nuevoarr, arrPrecios:nuevosPrecios })
                                                                            }}
                                                                            StockFuera={()=>{this.setState({outStock:true})}}
                                                                            Stockok={()=>{this.setState({outStock:false})}}
                                                                           
                                                                           setService={this.setService}
                                                                            />))

        generadorArticulosListaImpresion = this.state.ArtVent.map((item, i) => (<ArticuloVentaRenderImpersion
                                                                                key={item._id}
                                                                             
                                                                                 datos={item} 
                                                                               
                                                                                
                                                                                  />))

                                                                              

    }
    let generadorFormasdepago= this.state.Fpago.map((item, i)=>(<FormasdePagoList
                                                                  key={item.Id}
                                                                  datos={item}  
                                                                  index={i}
                                                                  sendPrecio={(e)=>{this.setPreciosPago(e)}}
                                                                  editFormPago={(e)=>{this.editFormaPago(e)}}
                                                                  deleteForma={(e)=>{
                                                               
                                                                    let nuevoarr = this.state.Fpago.filter(x => x.Id != e.Id)
                                                                    this.setState({Fpago:nuevoarr})
                                                                    this.saveToLocalStorage({Fpago:nuevoarr})

                                                                }}
                                                                />))

    console.log(this.state)

return(<div className='mainCompo'>
<div className='contenedor'>
    
<Sidebar
ArtVent={this.state.ArtVent.length}
NumberSelect={(num)=> this.setState({NumberSelect:num})} /> 

<div className='contVisual'>

  <Animate show={this.state.NumberSelect == 0} style={{height:"100%"}}>
    <div className='cont0'>
      <div className='contArts'>
 <div className='ContTop0'>
  <div className='contSearcher '>
               <BotonExpandible
  onArticuloClick={() => this.setState({ createArt: true })}
  onServicioClick={() => this.setState({ createServ: true })}
/>
       
  <input name="searcherIn" className="fullinput" onChange={this.getAutoValue} placeholder="Busca Productos o Servicios" />  
     
  </div>
       <i className="material-icons buttonSearch">search</i>

</div>
<div className='listadoArticulos'>

  {generadorArticulosLista} 
</div>
<div className="contPages">
                    <Pagination
                        totalItemsCount={this.obtenerextension(this.props.state.RegContableReducer.Articulos)}
                        currentPage={this.state.currentPage}
                        perPage={this.state.perPage}
                        pagesToShow={this.calcularPagesToShow()}
                        onGoPage={this.goPage}
                        onPrevPage={this.onPrev}
                        onNextPage={this.onNext}
                    />
                </div>
</div>
<div className='contCar'>
  <div className='vertCont'>
<div className="datos">
  <select
    className="docRounded"
    disabled={this.state.disableDoc}
    value={this.state.doctype}
    onChange={this.handleDocType}
  >
    <option value="Factura" className="option-factura">Factura Electrónica</option>
    <option value="Nota de venta" className="option-nota">Nota de Venta</option>
    <option value="Cotizacion" className="option-cotizacion">Cotización</option>
  </select>
</div>

<div className='contenedorartsventa'>
  
  {generadorArticulosListaVenta}
  </div>
<div className="total-container">
  <div className="total-label">
    <p>Total:</p>
  </div>
  <div className="total-value">
    <p>${SuperTotal.toFixed(2)}</p>
  </div>
</div></div>
  <div className="contContado">
                    <div className="contContadoButtons">
                   
                    </div>
                      <div className="contContadoLista">
                          <div className="contTitulos2 ">
                      <div className="Numeral ">
                #
                        </div> 
                        <div className="Artic100Fpago ">
                            Pago
                        </div>
                        <div className="Artic100Fpago ">
                            Cuenta
                        </div>
                        <div className="Artic100Fpago ">
                            Cantidad
                        </div>
                        <div className="accClass ">
                            Acc
                        </div>
                        </div>
                        <div className="ContListaPagos">
                        {generadorFormasdepago} 
                        </div>
                          </div>   

                          <div className="contSumaPago">
                        <div className="pago-container">
  <div className="pago-button">
    <button className="add-button" onClick={() => this.setState({ addFormaPago: true })}>
      <span className="material-icons">add</span>
    </button>
  </div>
  <div className="pago-info">
    <p className="pago-label">Total Pago:</p>
    <p className="pago-total">${TotalPago.toFixed(2)}</p>
  </div>
</div>

                          </div>
                          </div>
                          <button
  className={`confirm-button ${SuperTotal > 0 && TotalPago > 0 && SuperTotal === TotalPago ? 'enabled' : 'disabled'}`}
  onClick={() => {
    if (SuperTotal > 0 && TotalPago > 0 && SuperTotal === TotalPago) {
      // Tu lógica de confirmación
    }
  }}
  disabled={!(SuperTotal > 0 && TotalPago > 0 && SuperTotal === TotalPago)}
>
  Continuar
</button>
</div>
</div>
  </Animate>
    <Animate show={this.state.NumberSelect == 1}>
Clientes
  </Animate>
</div>
</div>

       <BarcodeReader
          onError={this.handleScanError}
          onScan={this.handleScan}
          minLength={5}
          />
       <Animate show={this.state.createArt}>
                        <ModalAddIndividual
                         User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({createArt:false})}}    
                        />

                    </Animate >
   <Animate show={this.state.createServ}>
                        <ModalAddServ
                         User={this.getDataUser()} 
                           Flecharetro={()=>{this.setState({createArt:false})}}    
                        />

                    </Animate >
                     <Animate show={this.state.addFormaPago}>
                                        <ModalFormapago valorSugerido={SuperTotal}
                                                         sendFormaPago={this.createFormaPago} 
                                                         sendFormaCredito={this.createFormaCredito}
                                                          tipoDeForma={this.state.tipopago} 
                                                          Flecharetro={()=>{this.setState({addFormaPago:false})}} />
                                        </Animate >
                                        <Animate show={this.state.editFormaPago}>
                                                            <ModalEditFormapago 
                                                            dataCredit={this.state.Fcredito} 
                                                            sendEditFormaCredito={(e)=>{this.editFormaCreditoState(e)}} 
                                        
                                                            data={this.state.SelectFormaPago} 
                                                            sendEditFormaPago={(e)=>{this.editFormaPagoState(e)}} 
                                                            
                                                            tipoDeForma={this.state.tipopago} 
                                                            Flecharetro={()=>{this.setState({editFormaPago:false})}} />
                                                            
                                                            </Animate >

                    <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>

      <style jsx>
                {                              
                 `
                 .pago-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px 24px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.pago-container:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.pago-button .add-button {
  background-color: #10b981;
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pago-button .add-button:hover {
  background-color: #059669;
  transform: scale(1.05);
}

.pago-button .add-button .material-icons {
  color: white;
  font-size: 20px;
}

.pago-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.pago-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
}

.pago-total {
  font-size: 24px;
  font-weight: bold;
  color: #10b981;
  margin: 4px 0 0 0;
  transition: color 0.3s ease;
}

.pago-total:hover {
  color: #059669;
}

                 .mainCompo{
                 background:#e5e5e5;
                 }
                 .contenedor{
                     padding: 5px;
                     display:flex;
                 }
.fullinput{
width: 100%;
    border-radius: 10px;
    padding: 7px;
    border: 0;
    font-size: 21px;
        margin-left: 2%;
}
    .buttonSearch{
    background: #17a2b8;
    color: white;
    font-size: 30px;
    padding: 5px;
    border-radius: 50%;
    cursor:pointer;
    border-bottom: 2px solid black;
    }
                 .contVisual{
                 margin-top:50px;
                  margin-left:50px;
                  width:100%;
                  height: 100%;
                 }
                 .cont0{
                display:flex;
                flex-wrap: wrap;
                justify-content: space-around;
                margin-left: 5px;

                 }
                .contArts{
    width: 95%;
    max-width: 900px;
    display: flex;
    flex-flow: column;
    }
    .listadoArticulos{
    margin-top: 10px;
    background: #e5e5e5;
    padding: 7px;
    min-height: 55vh;
    max-height: 700px;
    overflow-y:scroll;
        display: flex;
            flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    }
                 .ContTop0{
    display: flex;
    align-items: center;
    
     justify-content: space-between;
    background: white;
    border-radius: 15px;
    padding: 5px;
    box-shadow: 0px 1px 5px black;
                 }
                .contCar{
                  width: 90%;
    max-width: 350px;
    background: white;
    border-radius: 15px;
    padding: 5px;
    
                 display: flex
;
    flex-flow: column;
    justify-content: space-around;

                }
                 .contSearcher{
                     display: flex;
                width: 90%;
    align-items: center;
    }

    .contTitulos2{
    display:flex;
   
    font-size: 15px;
    font-weight: bolder;
    justify-content: space-around;
  
    width: 100%;
}
    .contContadoLista{
                    display: flex;
                    flex-flow: column;
                }
                    .Artic100Fpago{
    width: 23%;  
    min-width:80px;
    max-width:150px;
    align-items: center;
    text-align:center;
}
    .Numeral{
    width: 20px; 

}
    .confirm-button {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
  margin-top: 16px;
}

.confirm-button.enabled {
  background-color: #10b981; /* Verde vibrante */
  color: white;
}

.confirm-button.enabled:hover {
  background-color: #059669;
  transform: scale(1.02);
}

.confirm-button.disabled {
  background-color: #d1fae5; /* Verde opaco */
  color: #6b7280;
  cursor: not-allowed;
}
    .accClass{
    width:10%;
}
    .total-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px 24px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.total-container:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.total-label p {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280; /* Gris elegante */
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
}

.total-value p {
  font-size: 24px;
  font-weight: bold;
  color: #10b981; /* Verde moderno */
  margin: 0;
  transition: color 0.3s ease;
}

.total-value p:hover {
  color: #059669; /* Verde más intenso al hacer hover */
}
    .grupoDatos{
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                   }
                    .select-container {
  width: 100%;
  margin-bottom: 16px;
}


.datos {
  width: fit-content;
      margin: auto;
}



.docRounded {
  padding: 6px 10px;
  font-size: 13px;
  border: none;
  background:white;
  border-radius: 8px;
box-shadow: 0 4px 3px 0 rgb(11 136 255 / 27%);
backdrop-filter: blur( 5px );
-webkit-backdrop-filter: blur( 5px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
  transition: background 0.2s ease;
  cursor: pointer;
  margin-bottom: 8px;
    margin-top: 1px;
}

/* Indicador de desplegable minimal */
.docRounded::after {
  content: "▼";
  padding-left: 8px;
  font-size: 10px;
}

/* Hover/focus sutil */
.docRounded:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
}

/* Disabled */
.docRounded:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Opciones internas */
.docRounded option {
  color: #111;
  font-weight: 500;
  font-size: 13px;
  border-radius:10px;
}




  .vertCont{
    background: white;
    margin-bottom: 20px;
  }

    
                 `} 
                 
                   </style>

</div>)
  }


          }

          const mapStateToProps = state=>  {
             
              return {
                  state
              }
            };
            
            export default connect(mapStateToProps, null)(accessPuntoVentaUX);