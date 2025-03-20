import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';
import {Animate} from "react-animate-mount"
import ArticulolistRender from "./puntoventacompo/articulolistRender"
import ArticuloVentaRender from "./puntoventacompo/articuloventaRender"
import ArticuloVentaRenderImpersion from "./puntoventacompo/articuloventaRenderImpresion"
import FormasdePagoList from "./reusableComplex/formasPagoRender"
import {Filtervalue,Searcher} from "./filtros/filtroeqid"
import Pagination from "./Pagination";
import {paginationPipe} from "../reduxstore/pipes/paginationFilter";
import Autosuggest from '../components/suggesters/jwsuggest-general-venta';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Radio from '@material-ui/core/Radio';
import CircularProgress from '@material-ui/core/CircularProgress';
import {addRegs,getArts,getcuentas,getClients, cleanData, addVenta,addClient,updateClient, addCuenta, updateCuentas, updateArts } from "../reduxstore/actions/regcont";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ReactToPrint from "react-to-print";
import ModalFormapago from "../components/reusableComplex/modal-addFormaPago"
import ModalEditFormapago from "../components/reusableComplex/modal-editFormaPago"
import ModalCaducado from "./puntoventacompo/modal-caducado"
import ModalCaducadoCombo from "./puntoventacompo/modal-caducadoCombo"
import BarcodeReader from 'react-barcode-reader'
import ModalEditPrecioCompraServ from "./puntoventacompo/modal-editPrecioCompraServ"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import cotiGenetor from "../public/static/cotiTemplate"
import notaGenetor from "../public/static/NotaTemplate"
import Head from 'next/head';
import Resultados from "./puntoventacompo/modal-cuentasVend"

import GeneradorFactura  from "./snippets/GeneradorFactura"
import SecureFirm from './snippets/getSecureFirm'; 
 class accessPuntoVenta extends Component {
     state={
        cuentasmodal:false,
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
                    perPage: 5,
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

    
        this.channel1 = postal.channel();
        ValidatorForm.addValidationRule('requerido', (value) => {
            if (value === "") {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('correoval', (value) => {
           
          const regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
          var regex2 = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z\-]{3,20}\.)+[a-zA-Z]{2,4}$/;
         
            if (regex2.test(value)) {
                return true;
            }
            return false;
          });

         
       
     }
  
     
     handleKeyDown = (event) => {
     
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

    comprobadorVentaPRIT=(IvaEC,valSinIva)=>{
        if(this.state.impresion){
                               
            this.printRef.current.handleClick();
        }
    }

    handleDeleteformaCredito=()=>{
        this.setState({Fcredito:[], ccinid:true, creditoCantidadIni:0 })

            this.saveToLocalStorage({Fcredito:[], ccinid:true, creditoCantidadIni:0 })

   
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
                                            console.log('Bufferfile obtenido:', bufferfile);
                                        
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
                                            this.props.dispatch(addVenta(response.VentaGen));
                                            this.props.dispatch(addRegs(response.arrRegsSend));
                                            this.props.dispatch(updateCuentas(response.Cuentas));
                                            this.props.dispatch(updateArts(response.Articulos));
                                            let cleanData = { 


                       
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
                                 
                                    userDisplay:false,
                                    Comprador:{
                                        UserSelect:false,
                                        id:"",
                                        usuario:"", 
                                        correo:"",
                                        telefono:"",
                                        ciudad:"",
                                        direccion:"",
                                        cedula:"",
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
    desasignarCuenta=(e)=>{

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
     handleChangeform=(e)=>{
        this.setState((prevState) => ({
            Comprador: {
              ...prevState.Comprador,
              [e.target.name] : e.target.value
            }
          }));
         }
         handleClientID=(e)=>{
       
            this.setState({ClientID:e.target.value})
            
        }
        handleDocType=(e)=>{
       
    
         this.setState({doctype:e.target.value})
         this.saveToLocalStorage({doctype:e.target.value})
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
                                         
                        Router.push("/")
                           
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
            

handleRadio=(e)=>{
    if(e.target.value=="Credito"){
        if(this.state.Comprador.UserSelect){
       this.setState({doctype: "Nota de venta",disableDoc:true,tipopago:"Credito"})
            if(this.state.Comprador.idcuenta == undefined || this.state.Comprador.idcuenta == ""|| this.state.Comprador.idcuenta == null  ){
               
                let datos = {
                    Permisos: ["administrador","vendedor","tesorero"],
                    valores:{
                checkedA:false,
                checkedP:false,
                visibility:true,
                Tipo:"Cuentas por Cobrar",
                NombreC:this.state.Comprador.usuario,
                Dinero:0,
                DineroActual:0,
                 Fpago:"Efectivo",
                limiteCredito:100,
                idCuenta:this.state.Counters.Contmascuenta,
                idReg:this.state.Counters.ContRegs,
                fondo:"Solido",
                colorCuenta:"#ffffff",
                fondoImagen:"/fondoscuentas/amex1.png",
                urlIcono:"/iconscuentas/icon.png",
                    },
                    Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname,
                        Usuario:this.props.state.userReducer.update.usuario.user.Usuario,
                        _id:this.props.state.userReducer.update.usuario.user._id,
                        Tipo:this.props.state.userReducer.update.usuario.user.Tipo,}
                  }     

                  let lol = JSON.stringify(datos)
                 
         
            fetch("/cuentas/addcount" , {
                method: 'PUT', // or 'PUT'
                body: lol, // data can be `string` or {object}!
                headers:{
                  'Content-Type': 'application/json',
                  "x-access-token": this.props.state.userReducer.update.usuario.token
                }
              }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => {
                this.props.dispatch(addCuenta(response.Cuenta));       
                this.setState({idcuenta:response.Cuenta._id,
                            tipopago:e.target.value,
                            creditLimit:response.Cuenta.LimiteCredito
                        
                        })
                        let datosUP = {
                            Id:this.state.Comprador.id,
                            idcuenta:response.Cuenta._id,
                            Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname}
            
                        }
                        let lolUP = JSON.stringify(datosUP)

                        fetch("/users/update-cuentaid", {
                            method: 'POST', // or 'PUT'
                            body: lolUP, // data can be `string` or {object}!
                            headers:{
                              'Content-Type': 'application/json',
                              "x-access-token": this.props.state.userReducer.update.usuario.token
                            }
                          }).then(res => res.json())   
                          .catch(error => console.error('Error:', error))
                          .then(response => {
       
            this.props.dispatch(updateClient(response.user));          
            
                          })
                     
                                    
            })
        
            
          
             
            }else{
            


             
                var data2 = {
              
                    idcuenta:this.state.Comprador.idcuenta,
                    Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname}
                                             }
        var lol2 = JSON.stringify(data2)
        fetch('/cuentas/findcuenta', {
            method: 'POST', // or 'PUT'
            body: lol2, // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
        
            let lim = response.cuenta.LimiteCredito
            this.setState({
                tipopago:e.target.value, 
                creditLimit:lim   
                             
            }) 
          })    
              
            }
           
        }else{
            let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:"Agregue o Seleccione un usuario para usar Crédito"
            }
            this.setState({Alert: add,loading:false})
        }
    }else{
        this.setState({tipopago:"Contado",disableDoc:false})
      
    }


    
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
handleChangeGeneral=(e)=>{

    this.setState({
    [e.target.name]:e.target.value
    })
    }

    createFormaCredito=(e)=>{
     

        let DatatoAddc=  {Tipo:e.formaPagoAdd,
            Cantidad:e.Cantidad,
             Cuenta:e.CuentaSelect,
             Detalles:e.Detalles,
          Tiempo: new Date().getTime()}
 

        this.setState({Fcredito:[DatatoAddc], ccinid:false, creditoCantidadIni: e.Cantidad })
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
    validarSoloNumeros = (event) => {
        const { value } = event.target;
        const soloNumeros = value.replace(/\D/g, ''); // Elimina cualquier carácter que no sea un número
      
        this.setState((prevState) => ({
          Comprador: {
            ...prevState.Comprador,
            [event.target.name]: soloNumeros
          }
        }));
      };
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
              
               
                  Router.push("/")
                     
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
  
    if(response.message=="error al registrar"){
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Error en el sistema, porfavor intente en unos minutos"
      }
      this.setState({Alert: add, loading:false,}) 
      }

      else if(response.message=="El correo ya esta registrado"){
        let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"El correo ya esta registrado"
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
    handleChangeCantidadini=(e)=>{


this.setState({creditoCantidadIni:parseFloat(e.target.value) })
    }
    handleScanError=(e)=>{
     
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
    filterAccesorio=(art)=>{
        if (art && art.length > 0 ){

            //const uppercase= payload.toUpperCase() 

    //let result = arr.filter(product => product.Titulo.includes(uppercase)); 

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
              
                userDisplay:false,
                Comprador:{
                    UserSelect:false,
                    id:"",
                    usuario:"", 
                    correo:"",
                    telefono:"",
                    ciudad:"",
                    direccion:"",
                    cedula:"",
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

                      SuperTotal, SubTotal, IvaEC, contP12, TotalDescuento, 2 //ambiente 
            )

          
          
            if(factGenerated.status == "Ok"){
            
                fetch('/cuentas/generarventa', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(factGenerated.CompiladoFactdata), // data can be `string` or {object}!
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
                      
                     })
                
                  
                       setTimeout(()=>{ 
                                       
                         let cleanData = { 


                       
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
                                readOnly:true,
                                correo:"",
                                telefono:"",
                                ciudad:"",
                                direccion:"",
                                cedula:"",
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

                    messageShow ="Ese Secuencial ya ha sido utilizado, aumente un numero en el secuencial"
                }

                let add = {
                    Estado:true,
                    Tipo:"error",
                    Mensaje:messageShow
                }
                this.setState({Alert: add, loading:false}) 

            }
          
   
          
         
       
      

           }
          
           addCaducadoCombo = () => {
        
            let e = this.state.itemCaduco
            e.CantidadCompra=1
        
            e.PrecioCompraTotal = e.Precio_Venta
            e.Unidad ="Gramos"
            let nuevoarr = [...this.state.ArtVent, e]
  
            this.setState({ArtVent:nuevoarr, ModalCaducadoCombo:false})
            this.saveToLocalStorage({ArtVent:nuevoarr,ModalCaducadoCombo:false,})
           }
           addCaducado = (e) => {
            let findA = this.props.state.RegContableReducer.Articulos.findIndex(x => x._id == e._id)

            e.CantidadCompra=1
         
            e.PrecioCompraTotal = e.Precio_Venta
            e.Unidad ="Gramos"
    
       
            let nuevoarr = [...this.state.ArtVent, e]
  
            this.setState({ArtVent:nuevoarr, ModalCaducado:false                 
            })
            this.saveToLocalStorage({ArtVent:nuevoarr,ModalCaducadoCombo:false,})

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
   
           setPreciosPago=(e)=>{
        
            let testFind =  this.state.Fpago.find(x => x.Id == e.Id)  
        
            let newIndex = this.state.Fpago.indexOf(testFind)
            let newArr = this.state.Fpago
            newArr[newIndex].Cantidad = e.Cantidad
            this.setState({Fpago:newArr})  
            this.saveToLocalStorage({Fpago:newArr})
           }
           editFormaPago=(e)=>{
               this.setState({editFormaPago:true, SelectFormaPago:e})
             
           }
           editFormaCreditoState=(e)=>{
         
          
               let dataGenerate ={
                Cantidad:e.Cantidad,
                Cuenta:e.CuentaSelect,
                Detalles:e.Detalles,
                Tipo:e.formaPagoAdd,
                Tiempo: new Date().getTime()
            }
            this.setState({Fcredito:[dataGenerate], creditoCantidadIni:parseFloat(e.Cantidad) }) 
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


            generadorArticulosLista = paginationPipe(renderArts, this.state).map((item, i) => ( <ArticulolistRender
                                                                                    key={item.Eqid}
                                                                                    datos={item} 
                                                                                    Cuenta={
                                                                                        ()=> {
                                                                                            
                                                                                            let miC = this.props.state.RegContableReducer.Cuentas.filter(x => x.iDcuenta ==item.Bodega_Inv )
                                                                                             
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
        generadorArticulosListaVenta = this.state.ArtVent.map((item, i) => (<ArticuloVentaRender
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
let generadorFormasdeCredito =0
let creditRest =  SuperTotal - this.state.creditoCantidadIni
        return (
            <div style={{marginTop:"10vh"}} >
             <Head>
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      </Head>
                <div className="contgeneral">
                    <div className="grupodatos doctype">
                        <div className="contdatos">
                        <div className="titulodatos">
                            Documento
                        </div>
                        <div className="datos">

                        <select className="docRounded" disabled={this.state.disableDoc} value={this.state.doctype} onChange={this.handleDocType} >
          <option value="Factura"> Factura Electrónica</option>
    <option value="Nota de venta" > Nota de Venta </option>
    <option value="Cotizacion" > Cotización</option>
         </select>


                        </div>

                      
                    </div>
                    <div className="contdatos jwPointer"  onClick={()=>{this.setState({Resultados:true})}}>
                  
                        <span className="material-icons">
                           attach_money
                            </span>
                            <div className="titulodatos">
                          Resultados
                        </div>
                    </div>
                 
      
                    </div>
               
                    <div className=" userwrap">
                     
                        <div className="contSuggester">
                        <div className="jwseccionCard buttoncont">

   <Animate show={this.state.Comprador.UserSelect}>                       
<div className="contButtonsUserSelect">
 <button type="button" className=" btn btn-primary botonedit" onClick={()=>{this.setState({readOnly:false, userEditMode:true})}}>
<p>Editar</p>

<span className="material-icons">
create
</span>

</button>
<button type="" className=" btn btn-danger botonedit" onClick={this.deleteUser}>
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
<p>Agregar</p>


</button>
</Animate> 

</div>
                       

{SuggesterReady} 
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
<select className="ClieniDInput" value={this.state.Comprador.ClientID} onChange={this.handleClientID} disabled= {CheckReadOnly} >
          <option value="Cedula"> Cédula</option>
    <option value="RUC" > RUC </option>
    <option value="Pasaporte" > Pasaporte </option>
         </select>
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
      <TextValidator
      label="Número Identificación"
       onChange={this.handleChangeformNumeros}
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
  
   </div>
   <div className="contb">
      <Animate show={this.state.adduser}>
      <div className="contbregis">

      <button className=" btn btn-success botonflex" type='submit'>
<p>Registrar</p>
<span className="material-icons">
done
</span>

</button>

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
</div>
      </Animate>

      <Animate show={this.state.userEditMode}>
      <div className="contbregis">

      <button type='button' className=" btn btn-primary botonflex" onClick={this.editUser}>
<p>Guardar</p>
<span className="material-icons">
done
</span>

</button>

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
</div>
      </Animate>

      
      
      
                        </div>
</ValidatorForm>
</Animate>
                        </div>
                     
                    </div>
            <div className="contBajo">
                <div className="subContBajo inventario">

                <input name="searcherIn" className="react-autosuggest__input" onChange={this.getAutoValue} placeholder="Busca Productos o Servicios" />  
                    <div className="contenedorArticulos">
                    <div className="contTitulosArt">
                        <div className="add">
                            Add
                        </div>
                        <div className="eqIdart">
                            ID
                        </div>
                        <div className="tituloArtic">
                            Nombre
                        </div>
                        <div className="precioArtic">
                            Precio
                        </div>
                        <div className="existenciaArtic">
                            Existencia
                        </div>
                        <div className="existenciaArtic centrarlu">
                            Color
                        </div>
                        <div className="existenciaArtic centrarlu">
                            Marca
                        </div>
                        <div className="existenciaArtic centrarlu">
                            Calidad
                        </div>
                        <div className="existenciaArtic centrarlu">
                            Inventario
                        </div>
                    </div>
                    {generadorArticulosLista} 
                    </div>
                    <div className="contPages">
                    <Pagination
                        totalItemsCount={this.obtenerextension(this.props.state.RegContableReducer.Articulos)}
                        currentPage={this.state.currentPage}
                        perPage={this.state.perPage}
                        pagesToShow={this.state.pagesToShow}
                        onGoPage={this.goPage}
                        onPrevPage={this.onPrev}
                        onNextPage={this.onNext}
                    />
                </div>
                </div>
               
                <div className=" venta">
                <div className="contArtVent">
                  
              
                
               
                <div className="contventa">
                <div className=" contTitulos ">
                <div className="Numeral">
                #
                        </div>
                        <div className="titulo2Artic ">
                            Nombre
                        </div>
                        <div className="ArticResPrecio ">
                            Cant
                        </div>
                        <div className="ArticResPrecio">
                            Tipo
                        </div>
                        <div className="ArticRes">
                            IVA
                        </div>
                        <div className="ArticRes">
                            Val
                        </div>
                        <div className="ArticRes ">
                              Acc
                        </div>
                </div>
                    {generadorArticulosListaVenta}
                </div>
                </div>
        
             <Animate show={this.state.doctype =="Factura" || this.state.doctype =="Nota de venta"  }>
         
                    </Animate>

      
                
                <div className="contVentaFinal">
                    <div className='contFlex'>
          
                <div className="contFormasDepago">
                    <Animate show={this.state.tipopago == "Contado"}>
                        <div className="contContado">
                    <div className="contContadoButtons">
                    <div className="contBotones">
                    <button className=" btn btn-success botonAddCrom" onClick={()=>{this.setState({addFormaPago:true, tipopago:"Contado"})}}>
         
         <span className="material-icons">
       add
       </span>
       </button>
                    </div>
                    </div>
                      <div className="contContadoLista">
                          <div className="contTitulos2 ">
                      <div className="Numeral ">
                #
                        </div> 
                        <div className="Artic100Fpago ">
                            Forma de Pago
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
                          <div className="grupoDatos totalcontPagos">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total Pago: </p>
            
              </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${TotalPago.toFixed(2)}</p>
            
              </div>
                    </div> 
                          </div>
                          </div>
                    </Animate>
                    <Animate show={this.state.tipopago == "Credito"}>
                    <div className="contContado">   
                    <div className="contLimite">
                        <p>Límite Crédito: </p>
                        <p style={{fontWeight:"bolder"}}>${this.state.Comprador.creditLimit}</p>
                    </div>
                    <button className=" btn btn-warning botonAddCrom" onClick={()=>{this.setState({addFormaPago:true, tipopago:"Credito"})}}>
         
         <span className="material-icons">
       add
       </span>
       </button>
                    <div className="contContadoLista">
                          <div className="contTitulos2 ">
                      <div className="Numeral ">
                #
                        </div> 
                        <div className="Artic100Fpago">
                           Cuenta / Forma
                        </div>
                        <div className="Artic100Fpago">
                            Cuota inicial
                        </div>
                        <div  style={{display:"flex", justifyContent:"center"}}className="accClass ">
                             Acc
                        </div>
                        <div className="Artic100Fpago">
                        
                           Cantidad Crédito
                        </div>
                      
                        </div>
                 
                        <div className="maincontDetallesPuntoVenta">
                          <div className="Numeral">
                          <div className=" "> <p className="parrafoD "> 1  </p></div>                                    
                    </div>
                    <div className="Artic100Fpago">
                          <div className=" "> <p className="parrafoD "> {this.state.Fcredito.length > 0?this.state.Fcredito[0].Cuenta.NombreC +" / " + this.state.Fcredito[0].Cuenta.FormaPago:""  }  </p></div>         
                                   
                    </div>
                    <div className="Artic100Fpago">
                    
                    <div className=" "> <p className="parrafoD "> 
                    <span> $
                 <input disabled={this.state.ccinid} type='number' className='inputCustom' name="creditoCantidadIni" value={this.state.creditoCantidadIni} onChange={this.handleChangeCantidadini} />
                 </span>
              
                      </p></div>
                    
                 
                    </div>
                    <div className="">
                        <div className="">
                 
                    <div className="botoneralist">
                        <Animate show={!this.state.ccinid}>
                    <button  className="btn btn-primary mybtn " onClick={()=>{
                
                        this.setState({editFormaPago:true})
 
                        }}><span className="material-icons">
edit
</span></button>
        <button  className="btn btn-danger mybtn " onClick={this.handleDeleteformaCredito}><span className="material-icons">
delete
</span></button>
</Animate>
         </div>  
  
         </div> 
                
                   </div>
                
                    <div className="Artic100Fpago">
                    
                    <div className="valorPV "> <p className="parrafoD "> 
                    <div className="valorPV "> <p className="parrafoD "style={{fontSize:"20px", fontWeight:"bolder"}} > ${creditRest.toFixed(2) }</p></div>
              
                      </p></div>
                    
                 
                    </div>
                          </div>
                     
                          </div> 
                     
                    </div> 
                    </Animate>
                </div>
                    </div>
                     <div  className="contFlex">
                     <div className="contTotales">
               
                  
               <div className="grupoDatos">
         <div className="cDc1">
         <p style={{fontWeight:"bolder"}}>  Descuento (valor) </p>
       
         </div>
         <div className={`cDc2 inputDes `}>
         <input type="number" name="descuentoVal" className='' value={this.state.descuentoVal} onChange={this.handleChangeGeneral }/>
       
         </div>

         </div>
         <div className="grupoDatos">
         <div className="cDc1 ">
         <p style={{fontWeight:"bolder"}}>  Descuento (%) </p>
       
         </div>
         <div className={`cDc2 percentFlex`}>
         <input type="number" name="descuentoPer" className='percentInput' value={this.state.descuentoPer} onChange={this.handleChangeGeneral }/>
       <span className='percentRender' >${descuentoCalculo.toFixed(2)}</span>
         </div>

         </div>
         <Animate show={this.state.doctype =="Factura" || this.state.doctype =="Cotizacion" }>
         <div className="grupoDatos">
               <div className="cDc1">
         <p style={{fontWeight:"bolder"}}>  Subtotal </p>
       
         </div>
         <div className={`cDc2 inputDes `}>
           <p className="subtotalp">${SubTotal.toFixed(2)}</p>
       
         </div>
               </div>
               </Animate>
               <Animate show={this.state.doctype =="Nota de venta"}>
         <div className="grupoDatos">
               <div className="cDc1">
         <p style={{fontWeight:"bolder"}}>  Subtotal </p>
       
         </div>
         <div className={`cDc2 inputDes `}>
           <p className="subtotalp">${SubTotalNota.toFixed(2)}</p>
       
         </div>
               </div>
               </Animate>
               <Animate show={this.state.doctype =="Factura"  || this.state.doctype =="Cotizacion"}>
         <div className="grupoDatos">
               <div className="cDc1">
         <p style={{fontWeight:"bolder"}}>  IVA({process.env.IVA_EC }%) </p>
       
         </div>
         <div className={`cDc2 inputDes `}>
           <p className="subtotalp">${IvaEC.toFixed(2)}</p>
       
         </div>
               </div>
               <div className="grupoDatos">
               <div className="cDc1">
         <p style={{fontWeight:"bolder"}}> Sub-Total(0%) </p>
       
         </div>
         <div className={`cDc2 inputDes `}>
           <p className="subtotalp">${parseFloat(valSinIva).toFixed(2)}</p>
       
         </div>
               </div>
               </Animate>
         <div className="grupoDatos totalcont">
               <div className="cDc1">
         <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total: </p>
       
         </div>
         <div className={`cDc2 inputDes `}>
           <p className="totalp">${SuperTotal.toFixed(2)}</p>
       
         </div>
               </div>

               
               <Animate show={this.state.doctype =="Factura"}>
               <div className="centrar spaceAround contsecuencial"> 
               <span > Secuencial</span>
               <input type="number" name="secuencialGen" className='percentInput' value={this.state.secuencialGen} onChange={this.handleChangeSecuencial }/>
               </div>
              
               </Animate>
               <div className="contImpresiones">
                    <div className="textoPrint">
                    <i className="material-icons"style={{fontSize:"30px"}}>
                        print
                        </i>
                    <span className="textContimp"> Imprimir  </span>
                    </div>
                    <Checkbox
   name="impresion"
        checked={this.state.impresion}
        onChange={this.handleChangePrinter}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
                    </div>
               <ReactToPrint 
                   trigger={() => <React.Fragment/>}
                   content={() => this.componentRef.current}
                   ref={this.printRef}
                
                 
               />
             

           </div>
           <Animate show={this.state.doctype =="Factura" || this.state.doctype =="Nota de venta" }>
               <div className="contBotonPago">
               <button className={` btn btn-success botonedit2 ${estiloerror} `} onClick={()=>this.comprobadorVenta(IvaEC,valSinIva)}>
<p>Pagar</p>
<i className="material-icons">
payment
</i>

</button>

<div style={{width:"50%"}}>
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
</div>
               </div>
               
               </Animate>
               <Animate show={this.state.doctype =="Cotizacion" }>
               <div className="contBotonCoti">
               <div className="contCVwCH">
               <div className="textoPrint">
               <i className="material-icons"style={{fontSize:"30px"}}>
                  email
                   </i>
               <span className="textContimp"> Enviar Cliente  </span>
               </div>
               <Checkbox
name="cotiToCLient"
color="primary"
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

 />
               </div>

               <button className={` btn btn-primary botonedit2 ${estiloerror} `} onClick={()=>this.comprobadorCoti(IvaEC,valSinIva)}>
<p>Cotizar</p>
<i className="material-icons">
post_add
</i>

</button>

<div className="spinnerCoti">
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
</div>
               </div> 
             
               </Animate>
                     </div>
               
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
              <p  className='subtituloArt marginb'>  Total: </p>
            
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

                </div>
                </div>
                
            </div>

                </div>
                <div contentEditable='true' dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
                <Animate show={this.state.addFormaPago}>
                    <ModalFormapago valorSugerido={SuperTotal}
                                     sendFormaPago={this.createFormaPago} 
                                     sendFormaCredito={this.createFormaCredito}
                                      tipoDeForma={this.state.tipopago} 
                                      Flecharetro={()=>{this.setState({addFormaPago:false})}} />
                    </Animate >

                    <Animate show={this.state.ModalCaducado}>
                    <ModalCaducado 
                    item={this.state.itemCaduco}
                    forceadd={this.addCaducado}
                    Flecharetro={()=>{this.setState({ModalCaducado:false})}} 
                    />
                    </Animate >

                    <Animate show={this.state.ModalCaducadoCombo}>
                    <ModalCaducadoCombo
                    item={this.state.itemsExpirados}
                   
                    forceadd={this.addCaducadoCombo}
                    Flecharetro={()=>{this.setState({ModalCaducadoCombo:false})}} />
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

                    <Animate show={this.state.Resultados}>
<Resultados
    updateData ={()=>{this.getAllArts()}}
    FilteredRegs = {this.props.state.RegContableReducer.Regs}
 
  Flecharetro={()=>{this.setState({Resultados:false})}} 
/>
                    </Animate >
                    <Animate show={this.state.modalEditServ}>
                        <ModalEditPrecioCompraServ 
                        data={this.state.serviceToEdit}
                        sendServData={this.setServData}
                        Flecharetro={()=>{this.setState({modalEditServ:false})}} 
                        />
                    </Animate >   
                      
                    <BarcodeReader
          onError={this.handleScanError}
          onScan={this.handleScan}
          minLength={5}
          />



                    <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
  
                <style jsx>
                {                              
                 ` 
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
                 .centrarlu{
                    text-align:center;
                   }
                
                .miscienCred{
                    width: 80%;   
     
                }
                .contLimite{
                    display: flex;
                    width: 50%;
                    max-width: 250px;
                    justify-content: space-around;
               
                    border-radius: 14px;
                    margin-bottom: 14px;
                    font-size: 16px;
                    height: 42px;
                    align-items: center;
                    padding:10px 10px;
                }
                 .contLimite p{
margin-bottom:0px;
                }
                .contBotonPago{
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                .contBotonCoti{
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    flex-flow: column;
                    justify-content: space-around;
                }
                .finalData{
                    display: flex;
                    align-items: center;
                    flex-flow: column;
                    justify-content: center;
                }
                .contImpresiones{
             
                    justify-content: space-around;
                    margin-top: 20px;
                    display: flex;
                    border: 4px double #28a745;
                    border-radius: 15px;
                    padding: 0px;
                    width: 200px;
                }
                .contCVwCH{
             
                    justify-content: space-around;
                    margin: 10px;
  
                    display: flex;
        
                    border-radius: 15px;
                    padding: 5px;
                    border: 4px double #007bff;
              
                }
                .textoPrint{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    min-width: 118px;
                    width: 80%;
                }
                .Accionc{
                    width: 50px;
                }
                .tituloFpago{
                    width: 15%;
                }
                
                .contdatos{
                    display: flex;
                    border: 1px solid grey;
                    box-shadow: inset -1px 0px 19px #05121e63;
                    padding: 15px;
                    margin-left: 60px;
                    border-radius: 19px;
                    width: 37%;
                    max-width: 330px;
                    justify-content: space-around;
                    font-size: 20px;
                    min-width: 300px;
                    margin-top: 15px;
                }
                .grupoDatos{
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                   }
                   .grupoDatosPrint{
                    display: flex;
                 
                    margin-top: 15px;
                    width: 100%px;
                   }
               
                .botoneralist{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    flex-flow: column;
   
                   }
                   .mybtn{
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                 
                   }
                .contVentaFinal{
                    margin-top:20px;
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    
                }
                .contSuggester {
                    display: flex;
                    align-items: center;
                    flex-flow: row;
                   
                    justify-content: center;
                 
}
.contenedorSup{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
                .doctype{
                 
                    display: flex;
                    flex-wrap: wrap;
                }
                .contContado{
                    flex-flow: column;
                    background: #ffffff7a;
                    width: 100%;
                    max-width: 400px;
                    padding: 10px;
                    border-radius: 15px;     
            
                  
                }
                .center{
                    text-align:center
                }
                .inputCustom{   
                     width: 80%;
           
                    border-radius: 11px;
                    padding: 4px;}
                .maincontDetallesPuntoVenta{
                
                    display: flex;
                    font-size: 15px;
                    font-weight: bolder;
                
                    justify-content: space-around;
                    width: 100%;
                    margin-top: 13px;
                    border-bottom: 5px solid;
                    border-radius: 25px;
               
               
        }
               
                   
                
               
                .percentFlex{
                    display: flex;
                    justify-content: space-between;
                    width: 50%;
                    max-width: 150px;
                    border-radius:15px;
              
                }
                .fullw{
                    width: 100%;  
                }
                .percentInput{
                    width: 30%;
                }
                .percentRender{
                    width: 35%;
    display: flex;
    justify-content: center;
    align-items: center;
                }
                .botonAddCrom {
                    display:flex;
                }
                .contContadoLista{
                    display: flex;
                    flex-flow: column;
                }
                .contgeneral{
                    display: flex;
                    flex-flow: column;
                }
           
                .contUsuario{
                    width: 100%;
                    transition: 1s;
                    border-radius: 12px;
                    padding: 10px;
                    max-width: 1000px;
                
                }
                .articeadd{
                    background: #d2ffd2;
                    border-bottom: 5px solid black;
                }
                .editadd{
                    background: #bbd8f7;
                    border-bottom: 5px solid black;
                }
                .contenidoForm {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
               
                .botonedit2{
                    display:flex;
                    padding:5px;
              
                    border-radius: 20px;
                    box-shadow: -2px 3px 3px black;
                    justify-content: space-around;
                    width: 200px;
                }
                .botonedit2 p{
                    margin:0px
                }
                .contButtonsUserSelect{
                    display:flex;
                    flex-flow:column;
                }
                .botonedit{
                    display:flex;
                    padding:4px;
                    margin: 4px;
                }
                .botonedit p{
                    margin:0px
                }
                .subtotalp{
                text-align: center;
    background: #efb096;
}
                .customInput {
                    display: flex;
                    align-items: center;
                    margin: 5px 10px;
                    justify-content: center;
                    width: 250px;
                }
                .valorPV{
                 
                    display: flex;
                    font-size:20px;  
                 } 
                   
.contFlex{
    display: flex;
    flex-flow:column;
    justify-content: space-around;
    align-items: center;
}

.accClass{
    width:10%;
}
.totalcont{
    background: #ffc903;
    align-items: center;
    border-radius: 12px;
    padding: 5px;
    border-bottom: 5px solid black
}
.totalcontPagos{
    background: #ff00000a;
    align-items: center;
    border-radius: 12px;
    padding: 5px;
    width:94%;
    border-bottom: 2px solid black
}
.marginb{
    margin-bottom: 0px;
}
.totalp{
    text-align: center;
    font-size: 28px;
    font-weight: bolder;
    margin-bottom: 0px;
}

        .inputDes{
            border-radius:5px;
            width: 50%;
            overflow: hidden;
            max-width: 150px;
        }
.contBajo{
    margin-top:5px;
    display:flex;
    width: 100%;
    flex-wrap:wrap;
      justify-content: space-around;
}
.subContBajo{
  
  
    max-width: 698px;
    width:90%;
      padding: 10px;
    border-radius: 16px;
    box-shadow: -5px -4px 8px #000000ad;
    background: #abfbfb87;
    margin-bottom:20px;
    margin-left:20px;
    margin-right:20px;
}
.venta{
    width:95%;
    background: #ffa62059;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0px 1px 11px black;
    margin-bottom:20px;
    max-width: 830px;
    margin-left: 10px;
    margin-right:10px;
    overflow-x: scroll;
    transition: 1s;
}
.botonflex{
    margin:10px;
    display:flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
}
.textContimp{
    width: 100px;
}

.botonflex p{
  margin:0px
}

.contPages{
    margin-top: 20px;
    display: flex;
    overflow: hidden;
}
.contbregis{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.ClieniDInput{
    width: 80%;
    padding: 5px;
    border-radius: 17px;
}
.finalline{
    height: 1px;
    background: #63a1e6;
    width: 100%;
    
}
.contArtVent{
   
    display: flex;
    flex-flow: column;
    overflow-x: scroll;
}
.contenedorArticulos{
    overflow-x: scroll;
    height: 580px;
    background: #ffffff7a;
    padding: 15px;
    border-radius: 10px;
}
.contContadoButtons{
    
    margin: 15px 0px;

}

.contTitulos{
    display:flex;
 
    font-size: 20px;
    font-weight: bolder;
  
}

.contTitulosArt{
    display:inline-flex;
 
    font-size: 20px;
    font-weight: bolder;
}
.contTitulos2{
    display:flex;
   
    font-size: 15px;
    font-weight: bolder;
    justify-content: space-around;
  
    width: 100%;
}
.spinnerCoti{
    width: 50%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.tipoPago{
    display: flex;
    border: 1px solid black;
    justify-content: space-around;
    align-items: center;
    border-radius: 8px;
    margin: 25px 0px;
    border-bottom: 5px solid black;
}
.tipoPago p{
    margin-bottom:0px;
}
.add{
    width: 100px; 
    text-align: center;  
}
.eqId{
    width: 80px;  
}
.eqIdart{
    width: 85px;  
}
.Numeral{
    width: 20px; 

}
.tituloArtic{
    width: 250px;  
}
.titulo2Artic{
    width: 50%;  
    max-width: 300px;
    text-align:center;
    min-width: 250px;
 
}
.ArticResPrecio{
   
    width: 15%;  
    max-width:150px;
    min-width: 100px;
    justify-content: center;
    text-align: center;
}
.ArticRes{
    
    width: 10%;  
    align-items: center;
    max-width:150px;
    min-width: 100px;
    justify-content: center;
    text-align: center;
}
.titulo2Print{
    width: 60%;  

}
   
.ArticImp{
    width: 20%;  
    
    max-width:250px;
    justify-content: center;
}
.Artic100Fpago{
    width: 23%;  
    min-width:95px;
    max-width:150px;
    align-items: center;
    text-align:center;
}
.precioArtic{
    width: 100px; 
}
.Artic100{
    width: 100px; 
}
.existenciaArtic{
    width: 100px; 
}
.docRounded{
    max-width: 170px;
    border-radius: 16px;
    padding-right: 10px;
    margin-left: 10px;
    border-bottom: 2px solid black;
}
.userwrap{
    display: flex;
    justify-content: space-around;   
    background: aliceblue;  
    flex-flow: row;
    flex-wrap: wrap;
    border-radius: 100px;
    margin: 15px 15px;
    padding: 20px;
    border-bottom: 5px solid grey;
}
.contsecuencial{
    margin-top:10px;
}
.contsecuencial input{
    border-radius: 26px;
    padding: 7px;
    text-align:center
}
.Areaimpresion{
    display: flex;
    flex-flow: column;
  
    align-items: center;
}
.dataarea{
    width: 100%;
    margin-left:15px;
   }
   .cDc1{
    width: 30%;
  }
  .contarticulos{
    width: 95%;
    
  }
  .contTotalesPrint{
    width: 100%;  
} 
.textoArtTitulo{
    font-size:55px;
    font-weight:bolder;
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
   .contTitulosPrint{
   
    width: 100%;
    display:flex; 
    font-weight: bolder;
    justify-content: space-around;
    text-align: center;
   }

    p{
        margin:0px
    }
    .totalp{
       
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 0px;
    }
.contTotalesPrint{
    width: 90%;  
}
    .Areaimpresion{
        display: flex;
        flex-flow: column; 
        width: 250px;  
    }

    .tituloArt{
        font-size:25px;
    }
    .textoArt{
        font-size:14px;
    }
    .textoArtTitulo{
        font-size:14px;
        font-weight:bolder;

    }
   .logoPrint{
    width: 100px;
    border-radius: 15px;
    margin: 5px;
   }
  .cDc1{
    width: 35%;
  }
  .cDc1x{
    width: 45%;
  }
  
  
  .grupoDatosPrint{
    display: flex;

    margin-top: 3px;
    width: 100%;
   }
   .dataarea{
    width: 100%;
 
   }
   .contTitulosPrint{
    text-align: center;
    width: 100%;
    display:flex; 
    font-weight: bolder;
    justify-content: space-around;
   }
   .subtituloArt{
    font-size:16px;
  }
 
  .contenedorSup{
    display: flex;
    justify-content: space-around;
  }
  
  @media only screen and (min-width: 1200px) {

    .subContBajo{
        width:30%
    }
 
        .contUsuario{
            width: 60%;
        
        }
}

@media only screen and (max-width: 550px) {

           
.contContado{
    width:100%;
    margin-bottom: 50px ;
    min-width:375px;
}
.totalcontPrint{
   
    align-items: center;
    border-radius: 12px;
    padding: 5px;
    border-bottom: 3px solid black
}

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



` }
                </style>
            </div>
        )
    }
}
const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(accessPuntoVenta);