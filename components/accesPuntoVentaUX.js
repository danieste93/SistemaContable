import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';
import AutosuggestUX from '../components/suggesters/jwsuggest-clientesUX';
import ModalAddIndividual from "../components/inventariocompo/modal-addArtIndividual"
import ModalAddServ from "../components/inventariocompo/modal-addServicio"
import ModalFormapago from "../components/reusableComplex/modal-addFormaPago"
import ModalEditFormapago from "../components/reusableComplex/modal-editFormaPago"
import Autosuggest from '../components/suggesters/jwsuggest-general-venta';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Checkbox from '@material-ui/core/Checkbox';
import ModalEditPrecioCompraServ from "./puntoventacompo/modal-editPrecioCompraServ"
import ModalDeleteGeneral from './cuentascompo/modal-delete-general';
import ArticuloVentaUX from "./puntoventacompo/articuloventaRenderUX"
import ReactToPrint from "react-to-print";
import ArticuloVentaRenderImpersion from "./puntoventacompo/articuloventaRenderImpresion"
import Pagination from "./Pagination";
import BarcodeReader from 'react-barcode-reader'
import FormasdePagoList from "./reusableComplex/formasPagoRenderUX"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Sidebar from './puntoventacompo/sidebar';
import ModalCompartir from './modal-compartir';

import {addRegs,getArts,getcuentas,getClients, cleanData, addVenta,addClient,updateClient, addCuenta, updateCuentas, updateArts,updateArt, deleteClient } from "../reduxstore/actions/regcont";

import CircularProgress from '@material-ui/core/CircularProgress';
import {Animate} from "react-animate-mount"
import BotonExpandible from './puntoventacompo/bexpansivo';
import ArtRenderUX from './puntoventacompo/articuloListRenderUX';
import {paginationPipe} from "../reduxstore/pipes/paginationFilter";
import {Filtervalue,Searcher} from "./filtros/filtroeqid"

import cotiGenetor from "../public/static/cotiTemplate"
import notaGenetor from "../public/static/NotaTemplate"
import Head from 'next/head';
import Resultados from "./puntoventacompo/modal-cuentasVend"

import GeneradorFactura  from "./snippets/GeneradorFactura"
import SecureFirm from './snippets/getSecureFirm';
import EditArt from"./inventariocompo/modal-editArt"
import EditServ from"./inventariocompo/modal-editServicio"
import ModalDetallesAdicionales from "./puntoventacompo/modal-detallesadicionales"

class accessPuntoVentaUX extends Component {
     state={
      adicionalInfo:[],
      ModalDeleteGeneral:false,
      modalCompartir:false,
      createCount:false,
      errorSecuencial:false,
      NumberSelect:0,
      createServ:false,
        cuentasmodal:false,
              createArt:false,
              cuentaAsignada:false,
                 edicion:false,
                 edicionServ:false,
        itemPoreditar:{Grupo:"",Marca:""},
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
                         
                          Alert:{Estado:false,  Tipo:"",},
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
                          userLoading:false
           

     }
     carrito = React.createRef(); 
     pagos = React.createRef(); 
        componentRef = React.createRef(); 
          printRef  = React.createRef();
          listadoRef = React.createRef();
          channel1 = null;
          componentDidMount(){
             
     this.loadFromLocalStorage()
          
            ValidatorForm.addValidationRule('requerido', (value) => {
             if (value.trim() === "" ) {
                 return false;
             }
             return true;
         });
  this.startPuntoVentaData()
   window.addEventListener('resize', this.handleResize);
    this.handleResize(); // Llamada inicial
  }

  handleChangeCompartir = () => {
   
    this.setState({compartir:!this.state.compartir})


     }
   
    componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

 





  handleResize = () => {
    const contenedor = this.listadoRef.current;
    if (contenedor) {
      const contenedorWidth = contenedor.offsetWidth;
      const itemWidth = 130 + 6; // 130px width + 6px margin (3px x 2)
      const itemsPorLinea = Math.floor(contenedorWidth / itemWidth);
      const nuevoPerPage = Math.min(30, Math.max(8, itemsPorLinea * 2));
      this.setState({ perPage: nuevoPerPage  });
    }
  };



   handleChangeIdentificacion = (e) => {
        const { name, value } = e.target;
    
        // Validamos que el valor solo contenga números (permitiendo ceros a la izquierda)
        if (/^\d*$/.test(value)) {
            this.setState((prevState) => {
                const nuevoTipoID = value.length > 10 ? "RUC" : "Cedula";
    
                return {
                    Comprador: {
                        ...prevState.Comprador,
                        [name]: value,
                        ClientID: nuevoTipoID
                    }
                };
            });
        }
    };


       handleChangeform=(e)=>{
        this.setState((prevState) => ({
            Comprador: {
              ...prevState.Comprador,
              [e.target.name] : e.target.value
            }
          }));
         }
         handleChangeSecuencial=(e)=>{
    if(e.target.value >= this.state.secuencialBase){

    
    this.setState({
    [e.target.name]:parseInt(e.target.value)
    })}
    else{

        let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:`No se puede elegir un secuencial menor`
        }
        this.setState({Alert: add, }) 

    }
    } 
         handleClientID = (e) => {
            const { value } = e.target;
            const { cedula } = this.state.Comprador;
        
            // Verificamos la longitud del campo cedula
            if (cedula.length > 10 && value === "Cedula") {
                this.setState({ 
                    Alert: { 
                        Estado: true, 
                        Tipo: "error", 
                        Mensaje: "Cedula solo hasta 10 dígitos"
                    } 
                });
                return; // Salimos de la función sin actualizar el estado
            }
        
            if (cedula.length <= 10 && value === "RUC") {
                this.setState({ 
                    Alert: { 
                        Estado: true, 
                        Tipo: "info", 
                        Mensaje: "RUC debe tener más de 10 dígitos"
                    } 
                });
                return;
            }
        
            // Si la validación es correcta, actualizamos ClientID
            this.setState((prevState) => ({
                Comprador: {
                    ...prevState.Comprador,
                    ClientID: value
                },
                Alert: { Estado: false } // Reseteamos la alerta si todo está bien
            }));
        };
        handleDeleteCliente=(e)=>{
            if(e.status == "usuario eliminado"){
                this.props.dispatch(deleteClient(e.Usuario));
                this.setState({
                    Alert: {
                        Estado: true,
                        Tipo: "info",
                        Mensaje: "usuario eliminado"
                    }
                });
                this.resetUserData();
            }
        }
        handleChangeGeneral=(e)=>{

    this.setState({
    [e.target.name]:e.target.value
    })
    }
        handleDocType=(e)=>{
       
    if(e.target.value == "Factura"){
           this.setState({ descuentoPer:0, descuentoVal:0})
         this.saveToLocalStorage({ descuentoPer:0, descuentoVal:0})
    }
         this.setState({doctype:e.target.value})
         this.saveToLocalStorage({doctype:e.target.value})
     }

      comprobadorAddArt=(e)=>{
           
              let findArt = this.state.ArtVent.find(x => x._id == e._id)
         //     let findArtRedux = this.props.state.RegContableReducer.Articulos.findIndex(x => x._id == e._id)
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

               if(e.Tipo == "Producto"){
              
                let numeroArticulosIngresados = findArt.CantidadCompra


 if((numeroArticulosIngresados + 1) <= e.Existencia){
 let nuevoarr;
  const index = this.state.ArtVent.findIndex(x => x._id === e._id);
 let artAnterior = { ...this.state.ArtVent[index] };
  artAnterior.CantidadCompra = (artAnterior.CantidadCompra ) + 1;
  artAnterior.CantidadCacl = (artAnterior.CantidadCacl ) + 1;
  artAnterior.PrecioCompraTotal = (artAnterior.PrecioCompraTotal ) + e.Precio_Venta;
  artAnterior.PrecioVendido = (artAnterior.PrecioVendido ) + e.Precio_Venta;

  nuevoarr = [...this.state.ArtVent];
  nuevoarr[index] = artAnterior;

this.setState({ ArtVent: nuevoarr });
this.saveToLocalStorage({ ArtVent: nuevoarr });

 }else{
                    let add = {
                      Estado:true,
                      Tipo:"warning",
                      Mensaje:`Existencias insuficientes para agregar ${e.Titulo}`
                  }
                  this.setState({Alert: add,loading:false})
                }

                }else{
                    let add = {
                      Estado:true,
                      Tipo:"info",
                      Mensaje:"Servicio ya ingresado"
                  }
                  this.setState({Alert: add,loading:false})
                }
                  
              }
  }

  handleChangePrinter=()=>{
this.setState({impresion:!this.state.impresion})
    }

  
    comprobadorVentaPRIT=()=>{
        if(this.state.impresion){
                               
            this.printRef.current.handleClick();
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

     comprobadorCoti=(IvaEC,valSinIva)=>{
        if(this.state.loading == false){
            this.setState({loading:true})
                let TotalSum = 0
                let SuperTotal = 0
                let TotalPago = 0
                let descuentoCalculo=0
                if(this.state.Fpago.length > 0){
        
                    for(let i = 0; i<this.state.Fpago.length;i++){
                    
                        TotalPago = TotalPago + parseFloat(this.state.Fpago[i].Cantidad)
                    }
                    
                }
                
                   if(this.state.ArtVent.length > 0){
                       
                       for (let i=0;i<this.state.ArtVent.length;i++){
                   
                        TotalSum= TotalSum + parseFloat(this.state.ArtVent[i].PrecioCompraTotal)
                      
                    }
                   
                  
                   }
                   if(this.state.descuentoVal > 0){
                           
                  SuperTotal = TotalSum -  parseFloat(this.state.descuentoVal)
                }else{
                    SuperTotal = TotalSum
                }
                
                if(this.state.descuentoPer > 0){
                    descuentoCalculo = (TotalSum * this.state.descuentoPer) / 100
                    SuperTotal = SuperTotal -  parseFloat(descuentoCalculo)
                }
               
             
               let TotalDescuento = this.state.descuentoVal  + this.state.descuentoPer
               if( SuperTotal > 0 ){   
               if(this.state.outStock ==false){
                       
                                                       
                                   
                                   this.genCoti(SuperTotal,(SuperTotal - IvaEC), IvaEC,TotalDescuento )
            
            }else{
                let add = {
                    Estado:true,
                    Tipo:"error",
                    Mensaje:"Revice Cantidad de sus productos"
                }
                this.setState({Alert: add,loading:false}) 
            }}else{
                let add = {
                    Estado:true,
                    Tipo:"warning",
                    Mensaje:"Agregue Productos"
                }
                this.setState({Alert: add, loading:false})
              }
        
        }
    }
  genCoti = (SuperTotal, SubTotal, IvaEC, TotalDescuento ) => {


            let nombreComercial = this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
           let tiempo = new Date()    
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
            let fechaEmision =date
            let dirEstablecimiento=this.props.state.userReducer.update.usuario.user.Factura.dirEstab
            let baseImponible =  SubTotal.toFixed(2)
            let valorIVA = IvaEC.toFixed(2)
            let cotiData = {
                idCoti:this.state.idCoti,
               SuperTotal,      
               ciudadComprador:this.state.Comprador.UserSelect?this.state.Comprador.ciudad:'',                                     
               TotalDescuento,
               IvaEC:valorIVA,
               fechaEmision,
               nombreComercial,
               dirEstablecimiento,
               baseImponible:baseImponible,
               Doctype: this.state.doctype,
                UserId: this.state.Comprador.id,
                razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                secuencial:this.ceroMaker(this.state.secuencialGen),
                obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?true:false,
                razonSocialComprador:this.state.Comprador.UserSelect?this.state.Comprador.usuario:'CONSUMIDOR FINAL',
                identificacionComprador:this.state.Comprador.UserSelect?this.state.Comprador.cedula:'9999999999999',
                direccionComprador:this.state.Comprador.UserSelect?this.state.Comprador.direccion:'',
                ArticulosVendidos:this.state.ArtVent,
                populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                nombreComercial: this.props.state.userReducer.update.usuario.user.Factura.nombreComercial,
                 Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                 Estado:"",
                
             };
    

     let newData = {html:cotiGenetor(cotiData),
     //   correo: this.state.Comprador.correo ,
     Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 
            correo:this.state.Comprador.correo,
          allData:cotiData,
          cotiToClient:this.state.cotiToClient
}

     fetch("/public/enviarCoti", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(newData), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
     
        const url = window.URL.createObjectURL(
            new Blob([Buffer.from(response.buffer)], { type: "application/pdf"}),
          );
     let link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Cotizacion ${newData.allData.nombreComercial}-${newData.allData.idCoti}`,
        );
        link.click()
              
               let add = {
            Estado:true,
            Tipo:"success",
            Mensaje:"Cotización Generada"
        }
        this.setState({Alert: add, loading:false, cotiToClient:false,
        
        
        }) 
        setTimeout(()=>{ 
            let cleanData = {
              adicionalInfo:[],
                userDisplay:false,
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
                 readOnly:true,

                SelectFormaPago:[],
                Fcredito:[],
                disableDoc:false,
                ArtVent:[],
                tipopago:"Contado",
                Fpago:[  ],
                descuentoPer:0,
                descuentoVal:0,
                arrPrecios:[],
               

            }
            this.setState(cleanData)

            this.saveToLocalStorage(cleanData)
        
        },100)
      })

    
  

          }
         
           genfact = async (SuperTotal, SubTotal, IvaEC, contP12, TotalDescuento ) => {
         
       
          
            let factGenerated = await GeneradorFactura(this.state.idVenta,this.state.idReg,this.state.Fpago,this.state.ArtVent, this.state.Comprador, this.state.secuencialGen, 

                      SuperTotal, SubTotal, IvaEC, contP12, TotalDescuento, this.state.adicionalInfo, 2 //ambiente
            )

          console.log("factGenerated",factGenerated)
          
            if(factGenerated.status == "Ok"){
              let compilado = factGenerated.CompiladoFactdata
              console.log("compilado",compilado)
              compilado.Compartir = this.state.compartir
            
                fetch('/cuentas/generarventa', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({...compilado}), // data can be `string` or {object}!
                    headers:{
                      'Content-Type': 'application/json',
                      "x-access-token": this.props.state.userReducer.update.usuario.token
                    }
                  }).then(res => res.json())
                  .catch(error => console.error('Error:', error))
                  .then(response => {
                  console.log(response)
                    if(response.message=="error al registrar"){
                        let add = {
                          Estado:true,
                          Tipo:"error",
                          Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                      }
                    return {status:"Error",mensaje:`Error con la firma electronica, ${docFirmado.message}`}
                      }
                      else if(response.message=="fatalerror"){
                         let add = {
                             Estado:true,
                             Tipo:"error",
                             Mensaje:"Error en el sistema del SRI, porfavor intente mas tarde"
                         }
                         this.setState({Alert: add, loading:false}) 
                      }
                      else{
                        let add = {
                            Estado:true,
                            Tipo:"success",
                            Mensaje:"Factura Electrónica Generada Satisfactoriamente"
                        }
                        this.setState({Alert: add,
                         loading:false, 
                       errorSecuencial:false,
                     })
                          if(this.state.compartir){
                                                console.log("Compartir", response)

                                                  const base64 = response.pdfBase64;
                                                  if (!base64) return;
                                                  const link = document.createElement('a');
                                                  link.href = `data:application/pdf;base64,${base64}`;
                                                  link.download = response.filename;
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  document.body.removeChild(link);
                                                
                                                   }

                       setTimeout(()=>{

                         let cleanData = {
                          compartir:false,
                            adicionalInfo:[],
                            idReg:response.updatedCounter.ContRegs,
                            idVenta:response.updatedCounter.ContVentas,
                            secuencialGen:response.updatedCounter.ContSecuencial,
                            secuencialBase:response.updatedCounter.ContSecuencial,
                            idCoti:response.updatedCounter.ContCotizacion,
       
                             loading:false,
                             
                             userDisplay:false,
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
                             disableDoc:false,
                             SelectFormaPago:[],
                             Fcredito:[],
                             ArtVent:[],
                             tipopago:"Contado",
                             Fpago:[  ],
                             descuentoPer:0,
                             descuentoVal:0,
                             arrPrecios:[],
                            
 
                         }
                        this.setState(cleanData)
                        this.saveToLocalStorage(cleanData)
                        this.props.dispatch(addVenta(response.VentaGen));
                        this.props.dispatch(addRegs(response.arrRegsSend));
                        this.props.dispatch(updateCuentas(response.Cuentas));
                        this.props.dispatch(updateArts(response.Articulos));
                     },100)
                       
                        
                }
                })




            }else if(factGenerated.status == "Error"){
          
                let messageShow  = factGenerated.mensaje

                if(messageShow == 'Error :  Error en la factura, CLAVE ACCESO REGISTRADA,  undefined '){

                    messageShow ="Ese Secuencial ya ha sido utilizado, se ha aumentado un numero. Vuelva a intentar"
                }

                let add = {
                    Estado:true,
                    Tipo:"error",
                    Mensaje:messageShow
                }
                this.setState({Alert: add, loading:false, errorSecuencial:true, secuencialGen:this.state.secuencialGen + 1 }) 

            }
            
      
           }
onEditArt=async(art)=>{
   // Lógica para editar el artículo
 if(art.Tipo == "Producto"){
    this.setState({edicion:true,  itemPoreditar:art})
   }else if(art.Tipo == "Servicio"){
    this.setState({edicionServ:true,  itemPoreditar:art})
   }else if(art.Tipo == "Combo"){
    this.setState({editComb:true,  itemPoreditar:art})
   }
   console.log("Editar artículo:", art);  
 }

    comprobadorVenta=async(IvaEC,valSinIva)=>{
        if(this.state.adduser == false){
        if(this.state.loading == false){
            this.setState({loading:true})
                let TotalSum = 0
                let SuperTotal = 0
                let TotalPago = 0
                let descuentoCalculo=0
                if(this.state.Fpago.length > 0){
        
                    for(let i = 0; i<this.state.Fpago.length;i++){
                    
                        TotalPago = TotalPago + parseFloat(this.state.Fpago[i].Cantidad)
                    }
                    
                }
                
                   if(this.state.ArtVent.length > 0){
                       
                       for (let i=0;i<this.state.ArtVent.length;i++){
                   
                        TotalSum= TotalSum + parseFloat(this.state.ArtVent[i].PrecioCompraTotal)
                      
                    }
                   
                  
                   }
                   if(this.state.descuentoVal > 0){
                           
                  SuperTotal = TotalSum -  parseFloat(this.state.descuentoVal)
                }else{
                    SuperTotal = TotalSum
                }
                
                if(this.state.descuentoPer > 0){
                    descuentoCalculo = (TotalSum * this.state.descuentoPer) / 100
                    SuperTotal = SuperTotal -  parseFloat(descuentoCalculo)
                }
               
             
               let TotalDescuento = this.state.descuentoVal  + this.state.descuentoPer
        
               if(this.state.outStock ==false){
                let tiempo = new Date()    
                let mes = this.addCero(tiempo.getMonth()+1)
                let dia = this.addCero(tiempo.getDate())
                var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
                let fechaEmision =date
                if(this.state.tipopago =="Contado"){
                    if( SuperTotal > 0 ){
                            if(SuperTotal.toFixed(2) == TotalPago){
                                if(this.state.impresion){
                               
                                    this.printRef.current.handleClick();
                                }
                                
                                if (this.state.doctype =="Factura"){
                                  
                                    if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){                
                                        let bufferfile = ""                    
                                        try {
                                          bufferfile = await SecureFirm(this.props.state.userReducer )
                                         
                                          } catch (error) {
                                            console.error('Error al obtener bufferfile:', error);
                                            alert("Error al firmar")
                                            alert("Error al firmar",error)
                                          }   

                                            
                                     this.genfact(SuperTotal,(SuperTotal - IvaEC), IvaEC,bufferfile,TotalDescuento )
                 
                                    }else{
                                        let add = {
                                            Estado:true,
                                            Tipo:"error",
                                            Mensaje:"Es necesario validar la factura y firma digital"
                                        }
                                        this.setState({Alert: add, loading:false}) 
                                    }
                                }else if(this.state.doctype =="Nota de venta"){
                                     
                                    let numeroAuto = 0
                                    let fechaAuto = ""
                                    let secuencial = 0
                                 
                                 
                                    let vendedorCont ={
                                        Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                                        Id:this.props.state.userReducer.update.usuario.user._id,
                                        Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                                    }
                                    let accumText = ""
                                    let mimapper =  this.state.Fpago.map(x=> accumText.concat(x.Detalles))
                                    let PDFdata = {
                                        idVenta:this.state.idVenta,
                                        
                                           SuperTotal,                                           
                                           TotalDescuento,
                                           ciudadComprador:this.state.Comprador.UserSelect?this.state.Comprador.ciudad:'',
                                           fechaEmision,
                                           nombreComercial:this.props.state.userReducer.update.usuario.user.Factura.nombreComercial,
                                           dirEstablecimiento:this.props.state.userReducer.update.usuario.user.Factura.dirEstab,
                                         
                                           Doctype: this.state.doctype,
                                            UserId: this.state.Comprador.id,
                                            razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                                            ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                                            estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                                            ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                                            
                                            obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                                            rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?true:false,
                                            populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                                            razonSocialComprador:this.state.Comprador.UserSelect?this.state.Comprador.usuario:'CONSUMIDOR FINAL',
                                            correoComprador:this.state.Comprador.UserSelect?this.state.Comprador.correo:'',
                                            identificacionComprador:this.state.Comprador.UserSelect?this.state.Comprador.cedula:'9999999999999',
                                            direccionComprador:this.state.Comprador.UserSelect?this.state.Comprador.direccion:'',
                                            ciudadComprador:this.state.Comprador.UserSelect?this.state.Comprador.ciudad:'',
                                            ArticulosVendidos:this.state.ArtVent,
                                            LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                                            
                                             Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                                            
                                             detalles:mimapper.map((x)=>  x +" ")
                                         };


                                    let dataNotadeventa = {
                                        numeroAuto:0,
                                        fechaAuto:0,
                                        ClaveAcceso:0,
                                        Secuencial:0,
                                        allData:PDFdata,
                                        iDCating:5,
                                        html:notaGenetor(PDFdata),
                                                       numeroAuto,
                                                        fechaAuto,
                                                        secuencial,
                                                          SuperTotal,                                           
                                                          TotalDescuento,
                                                        IvaEC,
                                                          baseImponible:valSinIva,
                                                          Doctype: this.state.doctype,
                                                           UserId: this.state.Comprador.id,
                                                           UserName:this.state.Comprador.usuario,
                                                           Correo: this.state.Comprador.correo,
                                                           Telefono: this.state.Comprador.telefono,
                                                           Direccion: this.state.Comprador.direccion,
                                                            Cedula:this.state.Comprador.cedula,
                                                            Ciudad:this.state.Comprador.ciudad,
                                                            ArticulosVendidos:this.state.ArtVent,
                                                            Compartir:this.state.compartir,
                                                            FormasPago:this.state.Fpago,
                                                            idVenta:this.state.idVenta,
                                                            idRegistro:this.state.idReg,
                                                            Tiempo: new Date().getTime(),
                                                            Vendedor: vendedorCont,
                                                            Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 
                                                            Estado:"",
                                                            xmlDoc:"",
                                                          
                                                        };
                                    fetch("/cuentas/generarventa", {
                                        method: 'POST', // or 'PUT'
                                        body: JSON.stringify(dataNotadeventa), // data can be `string` or {object}!
                                        headers:{
                                          'Content-Type': 'application/json',
                                          "x-access-token": this.props.state.userReducer.update.usuario.token
                                        }
                                      }).then(res => res.json())
                                      .catch(error => console.error('Error:', error))
                                      .then(response => {
                                          
                                        
                                        if(response.status =="Error"){
                                            let add = {
                                              Estado:true,
                                              Tipo:"error",
                                              Mensaje:`Error en el sistema, ${response.error}porfavor intente en unos minutos`
                                          }
                                          this.setState({Alert: add, loading:false}) 
                                          }else{
                                          
                                            let add = {
                                                Estado:true,
                                                Tipo:"success",
                                                Mensaje:"Nota de Venta generada"
                                            }

                                            this.setState({Alert: add,})
                                              if(this.state.compartir){
                                                console.log("Compartir", response)

                                                  const base64 = response.pdfBase64;
                                                  if (!base64) return;
                                                  const link = document.createElement('a');
                                                  link.href = `data:application/pdf;base64,${base64}`;
                                                  link.download = response.filename;
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  document.body.removeChild(link);
                                                
                                                                                            }




                                            this.props.dispatch(addVenta(response.VentaGen));
                                            this.props.dispatch(addRegs(response.arrRegsSend));
                                            this.props.dispatch(updateCuentas(response.Cuentas));
                                            this.props.dispatch(updateArts(response.Articulos));
                                            let cleanData = { 

                                              adicionalInfo:[],
                                              compartir:false,
                                                idReg:response.updatedCounter.ContRegs,
                                                idVenta:response.updatedCounter.ContVentas,
                                                secuencialGen:response.updatedCounter.ContSecuencial,
                                                secuencialBase:response.updatedCounter.ContSecuencial,
                                                idCoti:response.updatedCounter.ContCotizacion,
                           
                                                 loading:false,
                                                 
                                                 userDisplay:false,
                                                 Comprador:{
                                                    UserSelect:false,
                                                    id:"",
                                                    usuario:"",
                                                    correo:"",
                                                    telefono:"",
                                                        idcuenta:"",
                                                    ciudad:"",
                                                    direccion:"",
                                                    cedula:"",
                                                 },
                                                 readOnly:true,
                                                 disableDoc:false,
                                                 SelectFormaPago:[],
                                                 Fcredito:[],
                                                 ArtVent:[],
                                                 tipopago:"Contado",
                                                 Fpago:[  ],
                                                 descuentoPer:0,
                                                 descuentoVal:0,
                                                 arrPrecios:[],
                                                
                     
                                             }
                                            this.setState(cleanData)

                                            this.saveToLocalStorage(cleanData)
                                        
                                            
                                    }
                                    })

                                }
                                  //fin primer if
                               }else if(TotalPago > SuperTotal.toFixed(2)){
                                let add = {
                                    Estado:true,
                                    Tipo:"Warning",
                                    Mensaje:"El Pago es mayor al Total"
                                }
                                this.setState({Alert: add, loading:false})
                            }else if(TotalPago < SuperTotal.toFixed(2) ){
                          
                                let add = {
                                    Estado:true,
                                    Tipo:"Error",
                                    Mensaje:"Revice las Formas de Pago"
                                }
                                this.setState({Alert: add, loading:false})
                            }


                       }else{
                        let add = {
                            Estado:true,
                            Tipo:"Warning",
                            Mensaje:"Agregue Productos"
                        }
                        this.setState({Alert: add, loading:false})
                      }
                }else if(this.state.tipopago =="Credito"){
                    if(SuperTotal > 0){
                        if((SuperTotal - this.state.creditoCantidadIni) <= 0 ){
                            let add = {
                                Estado:true,
                                Tipo:"Warning",
                                Mensaje:"No se necesita generar un crédito"
                            }
                            this.setState({Alert: add,loading:false})  
                        }
        
                       else if((SuperTotal - this.state.creditoCantidadIni)<=  this.state.Comprador.creditLimit ){
                        if(this.state.impresion){
                        
                            this.printRef.current.handleClick();
                        }
                      
                      
                        let vendedorCont ={
                            Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                            Id:this.props.state.userReducer.update.usuario.user._id,
                            Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                        }

                        let PDFdata = {
                            idVenta:this.state.idVenta,

                               SuperTotal,                                           
                               TotalDescuento,
                               ciudadComprador:this.state.Comprador.UserSelect?this.state.Comprador.ciudad:'',
                               fechaEmision,
                               nombreComercial:this.props.state.userReducer.update.usuario.user.Factura.nombreComercial,
                               dirEstablecimiento:this.props.state.userReducer.update.usuario.user.Factura.dirEstab,
                             
                               Doctype: this.state.doctype,
                                UserId: this.state.Comprador.id,
                                razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                                ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                                estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                                ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                                
                                obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                                rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?true:false,
                                populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                         
                                razonSocialComprador:this.state.Comprador.UserSelect?this.state.Comprador.usuario:'CONSUMIDOR FINAL',
                                correoComprador:this.state.Comprador.UserSelect?this.state.Comprador.correo:'',
                                identificacionComprador:this.state.Comprador.UserSelect?this.state.Comprador.cedula:'9999999999999',
                                direccionComprador:this.state.Comprador.UserSelect?this.state.Comprador.direccion:'',
                                ArticulosVendidos:this.state.ArtVent,
                                LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                                
                                 Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                                
                                 detalles:""
                             };


                        var dataexample = {
                            html:notaGenetor(PDFdata),
                            IvaEC,
                            baseImponible:valSinIva,
                            SuperTotal,
                             TotalDescuento: TotalDescuento,
                            Doctype: this.state.doctype,
                            UserIdCuenta:this.state.Comprador.idcuenta,
                             UserId: this.state.Comprador.id,
                             UserName:this.state.Comprador.usuario,
                             Correo: this.state.Comprador.correo,
                             Telefono: this.state.Comprador.telefono,
                             Direccion: this.state.Comprador.direccion,
                             Cedula:this.state.Comprador.cedula,
                              Ciudad:this.state.Comprador.ciudad,
                              ArticulosVendidos:this.state.ArtVent,
                              idVenta:this.state.idVenta,
                              idRegistro:this.state.idReg,
                              Tiempo: new Date().getTime(),
                              Vendedor: vendedorCont,
                              Cuotainicial: parseFloat(this.state.creditoCantidadIni),
                              CreditoTotal: parseFloat((SuperTotal - this.state.creditoCantidadIni)),
                              Fcredito:this.state.Fcredito,
                              Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}   
                           
                           };
                           
                           fetch("/cuentas/generarcredito", {
                            method: 'POST', // or 'PUT'
                            body: JSON.stringify(dataexample), // data can be `string` or {object}!
                            headers:{
                              'Content-Type': 'application/json',
                              "x-access-token": this.props.state.userReducer.update.usuario.token
                            }
                          }).then(res => res.json())
                          .catch(error => console.error('Error:', error))
                          .then(response => {
                              
                    
                            if(response.message=="error al registrar"){
                                let add = {
                                  Estado:true,
                                  Tipo:"error",
                                  Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                              }
                              this.setState({Alert: add, loading:false}) 
                              }else{
                                let add = {
                                    Estado:true,
                                    Tipo:"Success",
                                    Mensaje:"Credito Generado"
                                }
                                let cleanData = {Alert: add,
                                    loading:false,
                                   adicionalInfo:[],
                                    userDisplay:false,
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
                                     readOnly:true,
                                    loading:false,
                                    SelectFormaPago:[],                
                                    ArtVent:[],
                                    tipopago:"Contado",
                                    Fpago:[ ],
                                    descuentoPer:0,
                                    descuentoVal:0,
                                    arrPrecios:[],
                                    disableDoc:false,
                                    Fcredito:[],
                                }
                                this.setState(cleanData)
                                this.saveToLocalStorage(cleanData)
                              
                                this.props.dispatch(addVenta(response.creditoC[0]));
                                this.props.dispatch(addRegs(response.arrRegsSend));
                                this.props.dispatch(updateCuentas(response.Cuentas));
                                this.props.dispatch(updateArts(response.Articulos));
                         
                            }
                
                        })
        
                    }
                        
                        else{
                            let add = {
                                Estado:true,
                                Tipo:"Error",
                                Mensaje:"Crédito insuficiente"
                            }
                            this.setState({Alert: add, loading:false})  
                        }
        
        
        
                    }else{
                        let add = {
                            Estado:true,
                            Tipo:"Error",
                            Mensaje:"Ingrese productos para generar un crédito"
                        }
                        this.setState({Alert: add,loading:false})   
                    }
                }
              
            }else{
                let add = {
                    Estado:true,
                    Tipo:"Error",
                    Mensaje:"Revice Cantidad de sus productos"
                }
                this.setState({Alert: add,loading:false}) 
            }
        
        } 
    }else{
        let add = {
            Estado:true,
            Tipo:"info",
            Mensaje:"Porfavor, acepte o cancele el registro del cliente"
        }
        this.setState({Alert: add, loading:false}) 
    }
    }
        handleChangeformNumeros = (e) => {
        const { name, value } = e.target;
        
        // Validamos que el valor solo contenga números (permitiendo ceros a la izquierda)
        if (/^\d*$/.test(value)) {
            this.setState((prevState) => ({
                Comprador: {
                    ...prevState.Comprador,
                    [name]: value
                }
            }));
        }



    };
       
        editUser=()=>{
            this.setState({userLoading:true})
         let vendedorCont ={
                            Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                            Id:this.props.state.userReducer.update.usuario.user._id,
                            Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                        }
            
    
       var data = {
                    Id:this.state.Comprador.id,
                   Usuario:this.state.Comprador.usuario,
                   Telefono:this.state.Comprador.telefono,
                   Correo:this.state.Comprador.correo.toLowerCase(),
                   Ciudad:this.state.Comprador.ciudad,
                   Direccion:this.state.Comprador.direccion,
                   Cedula:this.state.Comprador.cedula,
                   Userdata:  {DBname:this.props.state.userReducer.update.usuario.user.DBname   }   ,            
                    TipoID:this.state.Comprador.ClientID,
                    Cuenta:this.state.createCount,
                     
                                               vendedorCont  
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
        
        if(response.status=="error"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:response.message
              }
              this.setState({Alert: add, userLoading:false,}) 
              }else{
            this.props.dispatch(updateClient(response.user));
             if(response.cuenta.length>0){
                          this.props.dispatch(addCuenta(response.cuenta[0]));
                        
                        }
                        if(response.regs.length>0){
                          this.props.dispatch(addRegs(response.regs));
                        
                        }
        this.setState({
            Comprador:{
                ...this.state.Comprador,
                UserSelect:true,
                idcuenta:response.user.IDcuenta
            },
                userLoading:false,
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
         
         this.setState({userLoading:true})
           let vendedorCont ={
                            Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                            Id:this.props.state.userReducer.update.usuario.user._id,
                            Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                        }
          
           var datar = {Usuario:this.state.Comprador.usuario,
                       TelefonoContacto:this.state.Comprador.telefono,
                       Ciudad:this.state.Comprador.ciudad,
                       Cedula:this.state.Comprador.cedula,
                       Direccion:this.state.Comprador.direccion,
                       Correo:this.state.Comprador.correo.toLowerCase(),
                       Contrasena:"abc123",
                       Clase:"Cliente",
                       RegistradoPor:"Vendedor",
                       Cuenta:this.state.createCount,
                       Confirmacion:true,
                       TipoID:this.state.Comprador.ClientID,
                       Userdata:  {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                                               },   
                                               vendedorCont            
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
              this.setState({Alert: add, userLoading:false,}) 
              } else{
        
        
            this.setState({ 
                Comprador:{...this.state.Comprador,
                    UserSelect:true ,
                    id:response.user._id,
                    idcuenta:response.user.IDcuenta
                },
                
                userLoading:false,
                            readOnly:true,
                            adduser:false,
                         
                           
                            
                            
        
                        }) 
                        this.props.dispatch(addClient(response.user));
                        if(response.cuenta.length>0){
                          this.props.dispatch(addCuenta(response.cuenta[0]));
                        
                        }
                        if(response.regs.length>0){
                          this.props.dispatch(addRegs(response.regs));
                        
                        }
                     
                       
        
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
     
      this.props.dispatch(updateArt(articulo))
    }
    addCero=(n)=>{
            if (n<10){
              return ("0"+n)
            }else{
              return n
            }
          }
          handleCheckbox=(e)=>{


              if(this.state.createCount && 
                this.state.Comprador.idcuenta != "" && 
                this.state.userEditMode){
let add = {
           Estado:true,
           Tipo:"info",
           Mensaje:"No se puede desasignar la cuenta de un cliente"
       }  
       this.setState({Alert: add})
              }else{

                this.setState({createCount:!this.state.createCount})

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
    
     let checkbox = e.IDcuenta && e.IDcuenta != ""? true:false
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
        createCount:checkbox,
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
          NumberSelect:1,
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
  handleNumberSelect = (num) => {
    if (num === 0 || num === 1) {
      this.setState({ NumberSelect: num });
    } else if (num === 2) {
      this.setState({ NumberSelect: 0 }, () => {
        setTimeout(() => {
          this.carrito.current?.scrollIntoView({ behavior: "smooth",block: "start"});
        }, 300);
      });
    } else if (num === 4) {
       
   this.setState({Resultados:true })
    }
  };   
   handleScanError=(e)=>{
       console.log("en error scan")
  if(e.length > 6){
          if(e != null && e !=undefined && e !=""   ){
          let findArt = this.props.state.RegContableReducer.Articulos.find(x => x.Eqid.toUpperCase().trim() == e.toUpperCase().trim())
      
          if(findArt == undefined){
              let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Articulo no encontado en la base de datos"
              }
              this.setState({Alert: add,loading:false})
          }else{
  
              let findArtState = this.state.ArtVent.find(x => x.Eqid.toUpperCase().trim() == e.toUpperCase().trim())
  
  
              if(findArtState == undefined){
                  if(findArt.Tipo == "Producto"){
  
                      if(findArt.Existencia < 1){
                          let message = `Los productos "${findArt.Titulo}" tiene existencias insuficientes para ser agregado` 
                          let add = {
                              Estado:true,
                              Tipo:"error",
                              Mensaje:message
                          }
                          this.setState({Alert: add,loading:false})
                      }else{
                          if(findArt.Caduca.Estado){
                              let tiempoActual = new Date().getTime()
                              let tiempoCaduca = new Date(findArt.Caduca.FechaCaducidad).getTime()
                          
                              if(tiempoActual > tiempoCaduca   ){
                                  this.setState({ModalCaducado:true, itemCaduco:findArt})
                              }else{
                                  findArt.CantidadCompra=1
                   
                                  findArt.PrecioVendido= findArt.Precio_Venta
                                  findArt.PrecioCompraTotal = findArt.Precio_Venta
                      findArt.Unidad ="Gramos"
                      findArt.CantidadCacl = 1
                      findArt.TipoPrecio ="Venta"
                      let nuevoarr = [...this.state.ArtVent, findArt]  
                     
                       
                      this.setState({ArtVent:nuevoarr })
                      this.saveToLocalStorage({ArtVent:nuevoarr})
      
                              }
                          
                          }else{
                              findArt.CantidadCompra=1
               
                              findArt.PrecioVendido= findArt.Precio_Venta
                              findArt.PrecioCompraTotal = findArt.Precio_Venta
                  findArt.Unidad ="Gramos"
                  findArt.CantidadCacl = 1
                  findArt.TipoPrecio ="Venta"
                  let nuevoarr = [...this.state.ArtVent, findArt]  
                 
                   
                  this.setState({ArtVent:nuevoarr })
                  this.saveToLocalStorage({ArtVent:nuevoarr})
                  let add = {
                      Estado:true,
                      Tipo:"success",
                      Mensaje:"Item agregado"
                  }
                  this.setState({Alert: add,loading:false})
                          }
                      }
  
                  }
              }else{
                  let add = {
                      Estado:true,
                      Tipo:"info",
                      Mensaje:"Item ya ingresado"
                  }
                  this.setState({Alert: add,loading:false})
              }
          }}else{
              
              let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Error al escanear vuelva a intentarlo"
              }
              this.setState({Alert: add,loading:false}) 
          }
      }
  }
      handleScan=(e)=>{
        
  
          if(!this.state.createArt && !this.state.createServ &&!this.state.edicion && !this.state.edicionServ){
   let findArt = this.props.state.RegContableReducer.Articulos.find(
  x => x.Eqid.toUpperCase().trim() === e.toUpperCase().trim()
);

if (!findArt) {
  findArt = this.props.state.RegContableReducer.Articulos.find(
    x => x.Barcode === e
  );
}  

          if(findArt == undefined){
              let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Articulo no encontado en la base de datos"
              }
              this.setState({Alert: add,loading:false})
          }else{
  
              let findArtState = this.state.ArtVent.find(x => x.Eqid.toUpperCase().trim() == findArt.Eqid.toUpperCase().trim())
  
            
  
              if(findArtState == undefined){
                  if(findArt.Tipo == "Producto"){
  
                      if(findArt.Existencia < 1){
                          let message = `Los productos "${findArt.Titulo}" tiene existencias insuficientes para ser agregado` 
                          let add = {
                              Estado:true,
                              Tipo:"error",
                              Mensaje:message
                          }
                          this.setState({Alert: add,loading:false})
                      }else{
                          if(findArt.Caduca.Estado){
                              let tiempoActual = new Date().getTime()
                              let tiempoCaduca = new Date(findArt.Caduca.FechaCaducidad).getTime()
                          
                              if(tiempoActual > tiempoCaduca   ){
                                  this.setState({ModalCaducado:true, itemCaduco:findArt})
                              }else{
                                  findArt.CantidadCompra=1
                   
                                  findArt.PrecioVendido= findArt.Precio_Venta
                                  findArt.PrecioCompraTotal = findArt.Precio_Venta
                      findArt.Unidad ="Gramos"
                      findArt.CantidadCacl = 1
                      findArt.TipoPrecio ="Venta"
                      let nuevoarr = [...this.state.ArtVent, findArt]  
                     
                       
                      this.setState({ArtVent:nuevoarr })
                      this.saveToLocalStorage({ArtVent:nuevoarr})
      
                              }
                          
                          }else{
                              findArt.CantidadCompra=1
               
                              findArt.PrecioVendido= findArt.Precio_Venta
                              findArt.PrecioCompraTotal = findArt.Precio_Venta
                  findArt.Unidad ="Gramos"
                  findArt.CantidadCacl = 1
                  findArt.TipoPrecio ="Venta"
                  let nuevoarr = [...this.state.ArtVent, findArt]  
                 
                   
                  this.setState({ArtVent:nuevoarr })
                  this.saveToLocalStorage({ArtVent:nuevoarr})
                  let add = {
                      Estado:true,
                      Tipo:"success",
                      Mensaje:"Item agregado"
                  }
                  this.setState({Alert: add,loading:false})
                          }
                      }
  
                  }
              }else{
                   if(findArt.Tipo == "Producto"){
              
                let numeroArticulosIngresados = findArtState.CantidadCompra


 if((numeroArticulosIngresados + 1) <= findArt.Existencia){
 let nuevoarr;
  const index = this.state.ArtVent.findIndex(x => x._id === findArt._id);
 let artAnterior = { ...this.state.ArtVent[index] };
  artAnterior.CantidadCompra = (artAnterior.CantidadCompra ) + 1;
  artAnterior.CantidadCacl = (artAnterior.CantidadCacl ) + 1;
  artAnterior.PrecioCompraTotal = (artAnterior.PrecioCompraTotal ) + findArt.Precio_Venta;
  artAnterior.PrecioVendido = (artAnterior.PrecioVendido ) + findArt.Precio_Venta;

  nuevoarr = [...this.state.ArtVent];
  nuevoarr[index] = artAnterior;

this.setState({ ArtVent: nuevoarr });
this.saveToLocalStorage({ ArtVent: nuevoarr });

 }else{
                    let add = {
                      Estado:true,
                      Tipo:"warning",
                      Mensaje:`Existencias insuficientes para agregar ${findArtState.Titulo}`
                  }
                  this.setState({Alert: add,loading:false})
                }

                }else{
                    let add = {
                      Estado:true,
                      Tipo:"info",
                      Mensaje:"Servicio ya ingresado"
                  }
                  this.setState({Alert: add,loading:false})
                }

                 
              }
          }
  }
      }
      deleteUser=()=>{
    
          
    
     var data = {
                  idCuenta:this.state.Comprador.idcuenta||"",
                  Id:this.state.Comprador.id,
                  Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}        
                 }
  
    var lol = JSON.stringify(data)
  
     fetch('/users/delete', {
       method: 'POST', // or 'PUT'
       body: lol, // data can be `string` or {object}!
       headers:{
         'Content-Type': 'application/json',
         "x-access-token": this.props.state.userReducer.update.usuario.token
       }
     }).then(res => res.json())
     .catch(error => console.error('Error:', error))
     .then(response => {
     
      if(response.message=="error al registrar"){
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Error en el sistema, porfavor intente en unos minutos"
        }
        this.setState({Alert: add, loading:false}) 
        }else if(response.message=="Cuentas no 0"){
          let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"No se puede eliminar usuario, que tenga deudas o valores a favor"
          }
          this.setState({Alert: add, loading:false}) 
        }else{
          let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Usuario Eliminador"
          }
          this.setState({Alert: add, loading:false}) 
          this.resetUserData();
              this.getUA()
        }
         
     })
  
      }
        
  render() {

console.log(this.state)
let nombreComercial = ""
let dirEstab =""
let generarRimpeNota = ""
let SuggesterReady =    <CircularProgress  />  
let SuggesterReady2 =    <CircularProgress  />              
if(this.props.state.RegContableReducer.Clients){
  
    SuggesterReady =  <AutosuggestUX placeholder="Busca Clientes"
                       clientData={this.state.Comprador}
                     sendClick={this.setUserData}  
                      sugerencias={this.props.state.RegContableReducer.Clients}
                       resetData={this.resetUserData}  />  
        SuggesterReady2 =  <Autosuggest placeholder="Busca Clientes"
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


   let renderArts = []    

let generadorArticulosLista = <CircularProgress />  
if(this.props.state.RegContableReducer.Articulos){
            let arts = this.props.state.RegContableReducer.Articulos
           
            if(this.state.valorAbuscar.trim() ==""){
                renderArts=  arts 
            }else{

              

                const valorfiltrado = Filtervalue(arts, this.state.valorAbuscar)
                const filtrados = Searcher(arts, this.state.valorAbuscar)


                renderArts=  valorfiltrado.concat(filtrados)

            }


            generadorArticulosLista = paginationPipe(renderArts, this.state).map((item, i) => ( <ArtRenderUX
                                                                                    key={item.Eqid}
                                                                                    onEdit={(item)=>{this.onEditArt(item)}}
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
                                                                            key={item._id + '-' + item.CantidadCompra} // <-- clave única y reactiva
                                                                             index={i}
                                                                             datos={item} 
                                                                             Errorlist={this.state.ventasErr}
                                                                             ErrorlistCombo={this.state.ventasErrCombo}
                                                                             sendNewtitulo={(e, props)=>{this.setTitulo(e, props)}}
                                                                             sendTipoPrecio={this.setTipoPrecio}
                                                                             sendPrecio={this.setPrecios}
                                                                             sendAll={this.SetAll} 
                                                                             deleteitem={(e)=>{
                                                                              
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

  
  const setDisableButton= () => {

    if( this.state.doctype == "Cotizacion"){
      return "enabled"
    }else{
     if(SuperTotal > 0 && TotalPago > 0 && SuperTotal === TotalPago ){
        return "enabled"
      }else{
        return "disabled"
      }

    }

   }


return(<div className='mainCompo'>
<div className='contenedor'>
    
<Sidebar
getNumber={this.state.NumberSelect}
ArtVent={this.state.ArtVent.length}
NumberSelect={this.handleNumberSelect} /> 

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
<div ref={this.listadoRef} className='listadoArticulos'>

  {generadorArticulosLista} 
</div>
<div className="contPages">
                    <Pagination
                        totalItemsCount={this.obtenerextension(renderArts)}
                        currentPage={this.state.currentPage}
                        perPage={this.state.perPage}
                        pagesToShow={this.calcularPagesToShow()}
                        onGoPage={this.goPage}
                        onPrevPage={this.onPrev}
                        onNextPage={this.onNext}
                    />
                </div>
</div>
<div className='contCar' ref={this.carrito}>
  <div className="contFactOptions">
 
  <div className='contClient'>
    <div style={{width:"28px"}}>
  <Animate show={!this.state.Comprador.UserSelect}>  
    
   <button className=" btn btn-success customAddb " onClick={this.addNewUser}
                    >
   <span className="material-icons">
  add
  </span>  
  </button>

  </Animate> 
  
  </div>
                         
  
  {SuggesterReady} 
</div>
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
<button className="btnAdicional" onClick={() => this.setState({ showAdicionalInfo: true })}>
  <span className="material-icons">add</span>
  Información
</button>

  </div>
  <div className='vertCont'>

<div className='contenedorartsventa' >
  
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
<Animate show={SuperTotal > 0 }>
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
  <div className="pago-info" ref={this.pagos}>
    <p className="pago-label">Total Pago:</p>
    <p className="pago-total">${TotalPago.toFixed(2)}</p>
  </div>
</div>

                          </div>

                          </div>
                          </Animate>
<div style={{display:"flex", justifyContent:"flex-end"}}>
  <div className="impresion">
    <i className="material-icons" style={{ fontSize: "30px" }}>
      download
    </i>
    <Checkbox
      name="compartir"
      checked={this.state.compartir || false}
      onChange={this.handleChangeCompartir}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  </div>
        <Animate show={this.state.doctype =="Cotizacion"}>  <div className="impresion">
                                              <i className="material-icons"style={{fontSize:"30px"}}>
                                                  email
                                                  </i>
                                            
                                            
                                              <Checkbox
                             name="impresion"
                                  checked={this.state.cotiToClient}
                                    onChange={()=>{
       
       if(this.state.Comprador.UserSelect){
           
       this.setState({cotiToClient:!this.state.cotiToClient})
      
   }else{
       let add = {
           Estado:true,
           Tipo:"error",
           Mensaje:"Seleccione un usuario"
       }  
       this.setState({Alert: add, cotiToClient:false})
   }
   
   }}
                                  inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                
                                              </div>
                                              </Animate>
<Animate show={SuperTotal > 0 && SuperTotal === TotalPago}>

<Animate show={this.state.errorSecuencial}>
       <div className="centrar spaceAround contsecuencial"> 
               <span > Secuencial</span>
               <input type="number" name="secuencialGen" className='percentInput' value={this.state.secuencialGen} onChange={this.handleChangeSecuencial }/>
               </div>
</Animate>
                             <div className="contSubOptions">



                                              <div className="impresion">
                                              <i className="material-icons"style={{fontSize:"30px"}}>
                                                  print
                                                  </i>
                                            
                                            
                                              <Checkbox
                             name="impresion"
                                  checked={this.state.impresion}
                                  onChange={this.handleChangePrinter}
                                  inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                              </div>


                                        
 
                                                </div>
                                              </Animate>

</div>

                                         <ReactToPrint 
                                             trigger={() => <React.Fragment/>}
                                             content={() => this.componentRef.current}
                                             ref={this.printRef}
                                          
                                           
                                         />

                                         <div className='centrar'>
                   <Animate show={!this.state.loading}>                       
                          <button
  className={`confirm-button ${setDisableButton()}`}
  onClick={() => {
      
      if(this.state.doctype =="Factura" || this.state.doctype =="Nota de venta"){
        this.comprobadorVenta(IvaEC,valSinIva)
      }else if(this.state.doctype =="Cotizacion"){
        this.comprobadorCoti(IvaEC,valSinIva)
      }


    
  }}

>
  Continuar
</button>
</Animate>
   <Animate show={this.state.loading}>    
    <CircularProgress/>    
    </Animate>
</div>
</div>
</div>
  </Animate>
    <Animate show={this.state.NumberSelect == 1}>
   <div className='cont1'>
 <div className=" userwrap">
                     
                        <div className="contSuggester">
                        <div className="jwseccionCard buttoncont2">

   <Animate show={this.state.Comprador.UserSelect}>                       
<div className="contButtonsUserSelect">
 <button type="button" className=" btn btn-primary botonedit" onClick={()=>{this.setState({readOnly:false, userEditMode:true})}}>
<p>Editar</p>

<span className="material-icons">
create
</span>

</button>
<button type="" className=" btn btn-danger botonedit" onClick={()=>{this.setState({modalDelete:true})}}>
<p>Eliminar</p>

<span className="material-icons">
delete
</span>

</button>
</div>
</Animate> 

<Animate show={!this.state.Comprador.UserSelect}>  
 <button className=" btn btn-success botonedit" onClick={this.addNewUser}>
 <span className="material-icons">
add
</span>
<p>Cliente</p>


</button>
</Animate> 

</div>
                       

{SuggesterReady2} 
                        </div>
                        
                     
                        <div className={  `contUsuario ${activeadd} ${editadd} `}>
                        <Animate show={this.state.userDisplay}>
                        <ValidatorForm
   
   onSubmit={this.regisUser}
   onError={errors => console.log(errors)}
>
<div className="contenidoForm">
    <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
account_circle
</span>
</div>
      <TextValidator
      label="Nombre"
       onChange={this.handleChangeform}
       name="usuario"
       type="text"         
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.state.Comprador.usuario}
       InputProps={{
        readOnly: this.state.readOnly,
        style: this.state.readOnly ? { pointerEvents: "none", backgroundColor: "#f0f0f0" } : {}
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
mail
</span>
</div>
      <TextValidator
      label="Correo"
       onChange={this.handleChangeform}
       name="correo"
       type="mail"
   
       validators={['requerido']}
       errorMessages={['Escribe un correo'] }
      
       value={this.state.Comprador.correo}
       InputProps={{
        readOnly: this.state.readOnly,
        style: this.state.readOnly ? { pointerEvents: "none", backgroundColor: "#f0f0f0" } : {}
      }}
   />
   
   
   </div>

   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    house
</span>
</div>
      <TextValidator
      label="Dirección"
       onChange={this.handleChangeform}
       name="direccion"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.state.Comprador.direccion}
       InputProps={{
        readOnly: this.state.readOnly,
        style: this.state.readOnly ? { pointerEvents: "none", backgroundColor: "#f0f0f0" } : {}
      }}
   />
   
   
   </div>

   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
      <TextValidator
      label="Número Identificación"
       onChange={this.handleChangeIdentificacion}
       name="cedula"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa '] }
       value={this.state.Comprador.cedula}
       InputProps={{
        readOnly: this.state.readOnly,
        style: this.state.readOnly ? { pointerEvents: "none", backgroundColor: "#f0f0f0" } : {}
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
phone
</span>
</div>
      <TextValidator
      label="Teléfono"
       onChange={this.handleChangeformNumeros}
       name="telefono"
       type="text"
     
       validators={[]}
       errorMessages={[]}
       value={this.state.Comprador.telefono}
       InputProps={{
        readOnly: this.state.readOnly,
        style: this.state.readOnly ? { pointerEvents: "none", backgroundColor: "#f0f0f0" } : {}
      }}
   />

   </div>
 
  
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    location_city
</span>
</div>
      <TextValidator
      label="Ciudad"
       onChange={this.handleChangeform}
       name="ciudad"
       type="text"
       validators={[]}
       errorMessages={[] }
       value={this.state.Comprador.ciudad}
    
       InputProps={{
        readOnly: this.state.readOnly,
        style: this.state.readOnly ? { pointerEvents: "none", backgroundColor: "#f0f0f0" } : {}
     
      }}
   />

   
   </div>
      <div className="customInput">
        <div className="jwminilogo " style={{padding:0}} >
    <span className="material-icons">
    perm_identity
</span>
</div>
<select className="ClieniDInput" value={this.state.Comprador.ClientID} onChange={this.handleClientID} disabled= {CheckReadOnly} >
          <option value="Cedula"> Cédula</option>
    <option value="RUC" > RUC </option>
    <option value="Pasaporte" > Pasaporte </option>
         </select>
   
   </div>
    <div className="customInput">
        <div className="jwminilogo" style={{padding:0}}>
    <span className="material-icons">
   account_balance_wallet
</span>
</div>
<div className='alinearInicio'>
  <span>Cuenta</span>
    <Checkbox
      name="crearCuenta"
      disabled ={this.state.readOnly}
          checked={this.state.createCount}
          onChange={this.handleCheckbox}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
</div>
    
   
   </div>
  
   </div>
   <div className="contb">
      <Animate show={this.state.adduser}>
      <div className="contbregis">
       
<button className=" btn btn-danger botonflex" onClick={(e)=>{
    e.preventDefault()
     e.stopPropagation();
    this.resetUserData();
    this.setState({adduser:false, readOnly:true,userDisplay:false})}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
 <div className='jwFlex column'>
<Animate show={!this.state.userLoading}>
      <button className=" btn btn-success botonflex" type='submit' >
<p>Registrar</p>
<span className="material-icons">
done
</span>

</button>
</Animate>
<Animate show={this.state.userLoading}>
  <CircularProgress/>
</Animate>
</div>
</div>
      </Animate>

      <Animate show={this.state.userEditMode}>
      <div className="contbregis">
<button className=" btn btn-danger botonflex" onClick={(e)=>{
        e.preventDefault()
        e.stopPropagation();
    this.resetUserData();
    this.setState({userEditMode:false, readOnly:true})}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
     
 <div className='jwFlex column'>
<Animate show={!this.state.userLoading}>
     <button type='button' className=" btn btn-primary botonflex" onClick={this.editUser}>
<p>Guardar</p>
<span className="material-icons">
done
</span>

</button>
</Animate>
<Animate show={this.state.userLoading}>
  <CircularProgress/>
</Animate>
</div>



</div>
      </Animate>

      
      
      
                        </div>
</ValidatorForm>
</Animate>
                        </div>
                     
                    </div>

</div>
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
                           Flecharetro={()=>{this.setState({createServ:false})}}    
                        />

                    </Animate >
                     <Animate show={this.state.showAdicionalInfo}>
                        <ModalDetallesAdicionales
                          onReload={this.state.adicionalInfo}
                          onCamposChange={(e)=>{this.setState({adicionalInfo:e})}}
                         User={this.getDataUser()}
                           Flecharetro={()=>{this.setState({showAdicionalInfo:false})}}
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
<div style={{display:"none"}}>
                <div  className="Areaimpresion" ref={this.componentRef}>  
                   
                   <img className='logoPrint'src={logogen} alt="logotipo empresa"/>
                  
                                <p className="tituloArtEdit">{nombreComercial}</p>
                                <p className="subtituloArtPrint">{dirEstab}</p>
                                <p className="textoArt">--------------------------------------------------</p>
                                <div className="dataarea" >
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Cliente: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'> {this.state.Comprador.usuario} </p>  
                                </div> 
                                </div> 
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  ID: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'> {this.state.Comprador.cedula} </p>  
                                </div> 
                                </div>
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Correo: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'> {this.state.Comprador.correo} </p>  
                                </div> 
                                </div>
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Dirección: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'> {this.state.Comprador.direccion} </p>  
                                </div> 
                                </div>
                                <p className="textoArt">--------------------------------------------------</p>
                          
                            
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Fecha: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'>  {date} </p>  
                                </div> 
                                </div> 
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Hora: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'>  {hora} </p>  
                                </div> 
                                </div>
                              
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Venta Nº: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'>  {this.state.idVenta} </p>  
                                </div> 
                                </div> 
                                <div className="grupoDatosPrint" >
                                <div className="cDc1" >
                                <p className='textoArtTituloPrint'>  Cajero: </p>
                                </div> 
                                <div className="cDc2" >
                                    <p className='textoArt'>  {UserCont.Usuario} </p>  
                                </div> 
                                </div> 
                                
                                </div>  
                                <p className="textoArt">--------------------------------------------------</p>
                           
                                <div className=" contarticulos">
                                <div className=" contTitulosPrint">
                              
                                       <div className="titulo2Print">
                                           Nombre
                                       </div>
                                       <div className="ArticImp">
                                           Cant
                                       </div>
                                       <div className="ArticImp">
                                           Val
                                       </div>
                                      
                               </div>
                               {generadorArticulosListaImpresion}
                               </div>
                               <p className="textoArt">--------------------------------------------------</p>
                             
                                <div className="contTotalesPrint">
                                <div className="grupoDatos">
              <div className="cDc1x">
              <p className="textoArtTituloPrint">  Descuento(val) </p>
            
              </div>
              <div className={`cDc2 percentFlexImp`}>
              <p className={`textoArt`}>${parseFloat(this.state.descuentoVal).toFixed(2)}    </p>
            
              </div>

              </div>
              <div className="grupoDatos">
              <div className="cDc1x ">
              <p className="textoArtTituloPrint">  Descuento(%) </p>
            
              </div>
              <div className={`cDc2 percentFlexImp`}>
              <p className={`textoArt`}>${descuentoCalculo.toFixed(2)} </p>
             
              </div>

              </div>
              <Animate show={this.state.doctype =="Factura"}>
              <div className="grupoDatos">
                    <div className="cDc1x">
              <p className="textoArtTituloPrint">  Subtotal </p>
            
              </div>
              <div className={`cDc2 percentFlexImp `}>
                <p className="textoArt">${SubTotal.toFixed(2)}</p>
            
              </div>
                    </div>
                    </Animate>
                    <Animate show={this.state.doctype =="Nota de venta"}>
              <div className="grupoDatos">
                    <div className="cDc1">
              <p className="textoArtTituloPrint">  Subtotal </p>
            
              </div>
              <div className={`cDc2 percentFlexImp `}>
                <p className="textoArtTituloPrint">${SubTotalNota.toFixed(2)}</p>
            
              </div>
                    </div>
                    </Animate>
                    <Animate show={this.state.doctype =="Factura"}>
              <div className="grupoDatos">
                    <div className="cDc1x">
              <p className="textoArtTituloPrint">  IVA({process.env.IVA_EC } %) </p>
            
              </div>
              <div className={`cDc2 inputDes `}>
                <p className="textoArt"> ${IvaEC.toFixed(2)}</p>
            
              </div>
                    </div>
                    </Animate>
                    <hr  />
              <div className="grupoDatos totalcontPrint">
                    <div className="cDc1x">
              <p  className='subtituloArt '>  Total: </p>
            
              </div>
              <div className={`cDc2 `}>
                <p className="subtituloArt">${SuperTotal.toFixed(2)}</p>            
              </div>
                    </div> 
                                </div>
                                <hr className='finalline'  />
                                <div className='finalData'>
<p>
    {generarRimpeNota}
</p>
<p>
Documento electrónico generado en activos.ec
</p>
</div>

                                  </div>
                </div>
   <Animate show={this.state.Resultados}>
<Resultados

    FilteredRegs = {this.props.state.RegContableReducer.Regs}
 
  Flecharetro={()=>{this.setState({Resultados:false, NumberSelect:0})}} 
/>
                    </Animate >
                        <Animate show={this.state.modalEditServ}>
                                            <ModalEditPrecioCompraServ 
                                            data={this.state.serviceToEdit}
                                            sendServData={this.setServData}
                                            Flecharetro={()=>{this.setState({modalEditServ:false})}} 
                                            />
                                        </Animate >
                                         <Animate show={this.state.modalCompartir}> 
                                            <ModalCompartir 
                                               data={this.state.pdfBase64}
                                                 Flecharetro={()=>this.setState({modalCompartir:false})}
                                          
                                            />
                                              </Animate >
                                             <Animate show={this.state.modalDelete}> 
                                                <ModalDeleteGeneral
                                                 sendSuccess={(e)=>{this.handleDeleteCliente(e)}}
                                                 sendError={()=>{console.log("deleteerror")}}
                                                itemTodelete={this.state.Comprador}
                                                 mensajeDelete={{mensaje:`Estas seguro/a quieres eliminar a: ${this.state.Comprador.usuario} `, url:"/users/delete" }}
                                                Flecharetro={()=>this.setState({modalDelete:false})}
                                          
                                                />
                                                   </Animate>
     <Animate show={this.state.edicion}>
        <EditArt 
        data={this.state.itemPoreditar}
         Flecharetro={()=>{this.setState({edicion:false})}}
       User={this.getDataUser()} 
          />
      </Animate>
             <Animate show={this.state.edicionServ}>
              <EditServ
              data={this.state.itemPoreditar}
           
               Flecharetro={()=>{this.setState({edicionServ:false})}}
           
               User={this.getDataUser()} 
       
               
               />
           
      
                        </Animate>
      <style jsx>
                {                              
                 `.userwrap{
                     width: 100%;
                         width: 100%;
    display: flex
;
    flex-flow: column;
    justify-content: center;
    align-items: center;

                 }
                 .customInput {
    display: flex
;
    align-items: center;
    margin: 10px 0px;.
        width: 40%;
  min-width: 215px;
    justify-content: flex-start;
}
    .jwminilogo {
    width: 15%;
    padding-top: 20px;
}
                    .contButtonsUserSelect{
                    display:flex;
                   
                }
    .contSuggester {
                    display: flex;
                    align-items: center;
                    flex-flow: row;
                   flex-wrap: wrap;
                    justify-content: center;
                    margin-bottom:20px;
                 }
                    .contbregis{
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
        margin-bottom: 20px;
}

                    .contenidoForm {
    
    display: flex
;
   aling-items:center;
    justify-content: space-around;
    flex-wrap: wrap;

}
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
  .customAddb{
  height: 25px;
    display: flex
;
    justify-content: center;
    align-items: center;
    width: 25px;
}}

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
                     background: #f5f5f5;
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
                  margin-left:60px;
                  width:100%;
                  height: 100%;
                 }
                   .botonedit{
                    display:flex;
                    padding:4px;
                    margin: 4px;
                }
                .botonedit p{
                    margin:0px
                }
                 .cont0{
               
                display:flex;
                flex-wrap: wrap;
                justify-content: space-around;
                margin-left: 5px;
        

                 }
                   .cont1{
                 width:93%;
                display:flex;
                flex-wrap: wrap;
                justify-content: space-around;
                margin-left: 15px;
        

                 }

.logoPrint{
    width: 100px;
    border-radius: 15px;
    margin: 5px;
   }
   .tituloPrint {
    width: 50%;
   }
   .subtituloArtPrint{
   padding: 5px;
    text-align: center;
    font-style: italic;
    font-size: 15px;
   }
    .contarticulos{
    width: 95%;
    
  }
    .dataarea{
    width: 100%;
    margin-left:15px;
   }
   .contTitulosPrint{
   
    width: 100%;
    display:flex; 
    font-weight: bolder;
    justify-content: space-around;
    text-align: center;
   }
    .Areaimpresion{
    display: flex;
    flex-flow: column;
  
    align-items: center;
}

                     .tituloArtEdit{
   
        font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin: 15px 0px;

    }      
    .textoArtTituloPrint{
         font-size: 15px;
    font-weight: bold;
    }        
                .react-autosuggest__input {
    height: 30px;
    padding: 0px 20px;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border: 1px solid #aaa;
    border-radius: 4px;
    text-align: center;
    width: 150px;
}
                .contArts{
 flex:1;
      min-width: 800px;
    display: flex;
    flex-flow: column;
      margin-right:15px
    }
    .listadoArticulos{
    margin-top: 10px;
       background: #f5f5f5;
    padding: 7px;
    min-height: 55vh;
    
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
    min-height:600px;
    
    
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
    .contClient{
        display: flex;
    align-items: center;
    margin:10px
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

.contsecuencial{
    margin:10px;
    width:90%;
    
}
.contsecuencial input{
    border-radius: 26px;
    padding: 7px;
    text-align:center;
        width: 30%;
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
  .buttoncont2{
  display: flex;
    flex-flow: column;
    align-items: center;
    width: 160px;

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
  .textoArtTituloPrint{
         font-size: 15px;
    font-weight: bold;
    }        
     .textoArt{
        font-size:14px;
    }
     .grupoDatosPrint{
                    display: flex;
                 
                    margin-top: 15px;
                    width: 100%;
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


.contFactOptions {
  width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
        flex-wrap: wrap;
  margin-top: 10px;
  margin-bottom: 10px;
}
 .articeadd{
                    background: #d2ffd2;
                    border-bottom: 5px solid black;
                }
                .editadd{
                    background: #bbd8f7;
                    border-bottom: 5px solid black;
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
  .contUsuario{
                    width: 100%;
                    transition: 1s;
                    border-radius: 12px;
               
                    max-width: 1000px;
            
                
                }
                    .contSubOptions{
                    display: flex
;
    justify-content: flex-end;
                    }

.impresion{
    width: 90px;
    display: flex;
    border: 1px solid #1ffc8b;
    justify-content: center;
    align-items: center;
    margin-left:10px;
    border-radius: 20px;
}

  .vertCont{
    background: white;
    margin-bottom: 20px;
  }
      .contTotalesPrint{
    width: 100%;  
} 
    .titulo2Print{
        width: 60%;  
    
    }
         .btnAdicional {
    display: inline-flex;
    align-items: center;
 
    background-color: white;
    color: #333;
    border: none;
    border-radius: 8px;
    padding: 5px 9px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }

  .btnAdicional:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }
    @media print {

    .titulo2Print{
        width: 60%;  
    
    }
    .ArticImp{
        width: 20%;  
        
        max-width:250px;
        justify-content: center;
    }
}
  @media only screen and (max-width: 768px) { 

    .contArts{
 
      min-width: 300px;
 
    }
      .contCar{
      max-width: 500px;
      }
  
  }
        @media only screen and (max-width: 1235px) { 

    
      .contCar{
      max-width: 650px;
      }
  
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