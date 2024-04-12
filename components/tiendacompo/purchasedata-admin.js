import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {updateOrder} from "../../reduxstore/actions/myact"
import {connect} from 'react-redux';
import HelperFormapago from "../reusableComplex/helperSoloPago"
import { Animate } from "react-animate-mount";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Forge  from 'node-forge';
import Head from 'next/head';
import SignerJS from "../snippets/signer"
import factGenerator from "../../public/static/FactTemplate"
import notaGenetor from "../../public/static/NotaTemplate"
import CircularProgress from '@material-ui/core/CircularProgress';
import Panelclientes from '../reusableComplex/panelclientes';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {addVenta,addRegs,updateCuentas,updateArts} from "../../reduxstore/actions/regcont"
import CryptoJS from "crypto-js";
/**
* @author
* @className purdata
**/

class purdata extends Component {
 state = {carritoimagen:this.props.compra.carrito[0].Imagen[0],
    artSelect:0,
    descuentoPer:0,
    descuentoVal:0,
detalles:false,
helperFormapago:false,
loading:false,
UserSelect:true,
Fpago:[],
viewComprobante:false,
Alert:{Estado:false},
doctype:"Factura",
userDisplay:true,
adduser:false,
id:this.props.compra.idCliente,
ArtVent:this.props.compra.carrito,
                usuario:this.props.compra.nombreCliente,
                readOnly:false,
                correo:this.props.compra.correoCliente,
                telefono:this.props.compra.telefonoCliente,
                ciudad:this.props.compra.ciudadCliente,
                direccion:this.props.compra.direccionCliente,
                cedula:this.props.compra.cedulaCliente,
                idcuenta:"",
                 ClientID:"Cedula",
                 outStock:false,
                 tipopago:"Contado"
}

componentDidMount(){

if(this.props.compra.urlComprobante.length > 0){
  this.setState({viewComprobante:true})
}


}
handleChangeSecuencial=(e)=>{

  this.setState({
  [e.target.name]:parseInt(e.target.value)
  })
  }
getSignature=(url, key, name)=>{
  let sha1_base64=(txt)=> {
    let md = Forge.md.sha1.create();
    md.update(txt,"utf8");
    return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
    }
let stringdata = name +""+key 
let base64 = sha1_base64(stringdata)

let signature = `s--${base64.slice(0, 8)}--` 
let chanceUrl = url.replace("x-x-x-x",signature)
let secureUrl = chanceUrl.replace("y-y-y-y",process.env.REACT_CLOUDY_CLOUDNAME)

return secureUrl

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
     console.log(response)
      if(response.status == 'error'){
    
        if(response.message == "error al decodificar el token"){
          this.props.dispatch(logOut());
          this.props.dispatch(cleanData());
          alert("Session expirada, vuelva a iniciar sesion para continuar");
                           
          Router.push("/")
             
        }
      }else if(response.status == 'Ok'){

         
      
          this.setState({
                                                              
              Counters:response.contadoresHabiles[0],
              idReg:response.contadoresHabiles[0].ContRegs,
              idVenta:response.contadoresHabiles[0].ContVentas,
              secuencialGen:response.contadoresHabiles[0].ContSecuencial,
              idCoti:response.contadoresHabiles[0].ContCotizacion
          })
        

      }
  });


}
setHeperdata=(e)=>{
         
  this.setState(e)
}

uploadOrder=(e)=>{
  
 if(e.estado == "PagadoButton"){
this.setState({helperFormapago:true})
 }else{
  var data = {idOrden: this.props.compra._id,
    Userdata: {DBname:this.props.state.userReducer.update.usuario.user.DBname},

    EstadoPago:e.estado 
  }

let stingdata = JSON.stringify(data)



const options = {
method: 'POST',
body: stingdata,

 headers: {
   'Content-Type': 'application/json',
   "x-access-token": this.props.state.userReducer.update.usuario.token
 }
}
fetch('/public/tienda/updateorder', options).then(response => response.json())
.then(res => {
console.log(res)
if(res.status == "Error"){
let add = {
  Estado:true,
  Tipo:"error",
  Mensaje:`Error: ${res.error} `
}
this.setState({Alert: add, loading:false,}) 
}else{

let indextoRemplace = this.props.state.configRedu.ordenesCompra.findIndex((item,i)=>(item._id === res.orden._id))

let ordenes = this.props.state.configRedu.ordenesCompra

ordenes[indextoRemplace] = res.orden

this.props.dispatch(updateOrder({ordenes}))
let add = {
  Estado:true,
  Tipo:"success",
  Mensaje:`Actualizacion correcta exitoso`
}
this.setState({Alert: add, loading:false,helperFormapago:false}) 
}
})
.catch(error => console.log(error)
);


 }
  

}
handleChangeform=(e)=>{
  this.setState({
      [e.target.name] : e.target.value
  })
   }
   handleClientID=(e)=>{
 
      this.setState({ClientID:e.target.value})
      
  }
 clickArt=(e)=>{

    this.setState({artSelect:e.i, carritoimagen:e.producto.Imagen[0]})

   }
   handleDocType=(e)=>{
       
  
    this.setState({doctype:e.target.value})

}
   handleContinue=(e)=>{


    console.log(e.target.id)
    

    this.props.modal(e.target.id)
    }
    genImpuestos=()=>{

      let artImpuestos  = this.state.ArtVent.filter(x=>x.Iva)
      let artSinImpuestos = this.state.ArtVent.filter(x=>x.Iva == false)
      let dataImpuestos = ""
      if(artSinImpuestos.length > 0){
          let baseImponibleSinImpuestos = 0
          let valtotal = 0
          for(let i=0;i<artSinImpuestos.length;i++){
              baseImponibleSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
          }
          let data = `            <totalImpuesto>\n`+
          `                <codigo>${2}</codigo>\n`+
          `                <codigoPorcentaje>${0}</codigoPorcentaje>\n`+
          `                <baseImponible>${baseImponibleSinImpuestos.toFixed(2)}</baseImponible>\n`+
          `                <tarifa>${0.00}</tarifa>\n`+
          `                <valor>${0.00}</valor>\n`+
          `            </totalImpuesto>\n`
          dataImpuestos += data
      }
      if(artImpuestos.length > 0){
         
       let baseImponibleImpuestos = 0
       let valtotal = 0
              for(let i=0;i<artImpuestos.length;i++){
                  baseImponibleImpuestos += (artImpuestos[i].PrecioCompraTotal / 1.12)
                  valtotal += (artImpuestos[i].PrecioCompraTotal)
              }
              
          
          let data = `            <totalImpuesto>\n`+
          `                <codigo>${2}</codigo>\n`+
          `                <codigoPorcentaje>${2}</codigoPorcentaje>\n`+
          `                <baseImponible>${baseImponibleImpuestos.toFixed(2)}</baseImponible>\n`+
          `                <tarifa>${12.00}</tarifa>\n`+
          `                <valor>${(valtotal - baseImponibleImpuestos.toFixed(2)).toFixed(2)}</valor>\n`+
          `            </totalImpuesto>\n`
       
          dataImpuestos += data
      }

      return dataImpuestos
     
  }   
  gendetalles=()=>{   

      let nuevosDetalles = this.state.ArtVent.map(item =>{
          let codigoPorcentajeDeta =item.Iva? 2 : 0 // 0:0%  2:12%  3:14%
      
          let codigoDeta ="2" //IVA:2 ICE:3 IRBPNR:5
        let tarifaDetal =item.Iva? "12.00" : "0" 
        let baseImponible =  (item.PrecioCompraTotal / 1.12).toFixed(2)
          let precioTotalSinImpuesto = item.Iva? baseImponible
                                      :   item.PrecioCompraTotal.toFixed(2) 

              
                                 let valor  = item.Iva?  ((item.PrecioCompraTotal) - baseImponible).toFixed(2):0                      
                                      
      let precioUnitarioval =  item.Iva? 1.12: 1
      let data = `        <detalle>\n`+
      `            <codigoPrincipal>${item.Eqid}</codigoPrincipal>\n`+
`            <codigoAuxiliar>00000${item.Eqid}</codigoAuxiliar>\n`+
`            <descripcion>${item.Titulo}</descripcion>\n`+
`            <cantidad>${item.CantidadCompra}</cantidad>\n`+
`            <precioUnitario>${(item.PrecioVendido / precioUnitarioval).toFixed(2)}</precioUnitario>\n`+
`            <descuento>0</descuento>\n`+
`            <precioTotalSinImpuesto>${precioTotalSinImpuesto}</precioTotalSinImpuesto>\n`+
`            <impuestos>\n`+
`                <impuesto>\n`+
`                    <codigo>${codigoDeta}</codigo>\n`+
`                    <codigoPorcentaje>${codigoPorcentajeDeta}</codigoPorcentaje>\n`+
`                    <tarifa>${tarifaDetal}</tarifa>\n`+
`                    <baseImponible>${precioTotalSinImpuesto}</baseImponible>\n`+
`                    <valor>${valor}</valor>\n`+
`                </impuesto>\n`+
`            </impuestos>\n`+
"        </detalle>\n"
      
      
      return data
      })
   
             return nuevosDetalles.join("")  
                 }
  ceroMaker=(val)=>{

      let cantidad = JSON.stringify(val).length
  
      let requerido = 9 - cantidad
  
      let gen = '0'.repeat(requerido)
   
      let added = `${gen}${JSON.stringify(val)}`
 
      return added
  }

    genfact = (SuperTotal, SubTotal, IvaEC, contP12, TotalDescuento ) => {
         
      let razon = this.props.state.userReducer.update.usuario.user.Factura.razon 
      let nombreComercial = this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
      let ruc = this.props.state.userReducer.update.usuario.user.Factura.ruc
      let codDoc = "01"
      let estab =this.props.state.userReducer.update.usuario.user.Factura.codigoEstab
      let ptoEmi= this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
      let secuencial= this.ceroMaker(this.state.secuencialGen)
//    let secuencial=  "000000034"
      let dirMatriz=this.props.state.userReducer.update.usuario.user.Factura.dirMatriz    
      let dirEstablecimiento=this.props.state.userReducer.update.usuario.user.Factura.dirEstab
      let obligadoContabilidad =this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO"
      let rimpeval = this.props.state.userReducer.update.usuario.user.Factura.rimpe?"        <contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>\n":""
      
      let tipoIdentificacionComprador = "07" // 04--ruc  05--cedula  06--pasaporte  07-VENTA A CONSUMIDOR FINAL  08--IDENTIFICACION DELEXTERIOR*//
      let razonSocialComprador ='CONSUMIDOR FINAL'
      let identificacionComprador ="9999999999999"
      let direccionComprador = " "


      if(this.state.UserSelect){
          tipoIdentificacionComprador=this.state.ClientID =="Cedula"?"05":
                                      this.state.ClientID == "RUC"?"04":
                                      this.state.ClientID =="Pasaporte"?"06":"07"
      razonSocialComprador = this.state.usuario
      identificacionComprador = this.state.cedula
      direccionComprador = this.state.direccion
      }
      let codigoPorcentaje ="2"  // 0:0%  2:12%  3:14%
      let valorIVA = IvaEC.toFixed(2)
      let tarifa = "12.00" 
      let artImpuestos  = this.state.ArtVent.filter(x=>x.Iva)
      let artSinImpuestos = this.state.ArtVent.filter(x=>x.Iva == false)

      let totalSinImpuestos = 0
      let baseImpoConImpuestos = 0
      let baseImpoSinImpuestos = 0
      if(artImpuestos.length > 0){
          for(let i=0;i<artImpuestos.length;i++){
              totalSinImpuestos += (artImpuestos[i].PrecioCompraTotal / 1.12)
              baseImpoConImpuestos += (artImpuestos[i].PrecioCompraTotal / 1.12)
          }
          
      }
      if(artSinImpuestos.length > 0){
          for(let i=0;i<artSinImpuestos.length;i++){
              totalSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
              baseImpoSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
          }
      }
      
      let baseImponible =  SubTotal.toFixed(2) 




      let totalDescuento = TotalDescuento
      let codigo ="2" //IVA:2 ICE:3 IRBPNR:5
     
      let propina ="0.00"
      let importeTotal= SuperTotal.toFixed(2)
      let ambiente = "1"

      let s1 = this.props.state.userReducer.update.usuario.user.Factura.codigoEstab
      let s2 = this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
      let serie = s1+""+s2
      let codNum ="12345678"//8 digitos
      let tiempo = new Date()    
      let mes = this.addCero(tiempo.getMonth()+1)
      let dia = this.addCero(tiempo.getDate())
      var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
      let fechaEmision =date
  
      let tipoEmision  = "1"
      let claveAcceso = dia+""+mes+""+tiempo.getFullYear()+""+codDoc+""+ruc+""+ambiente+""+serie+""+secuencial+""+codNum+""+tipoEmision
   

      let digVerificador =(claveAcceso)=>{

          let suma = 0
          let fact = 7

          for (let i =0;i<claveAcceso.length;i++){
              suma += claveAcceso[i] * fact
              if(fact == 2){
                  fact = 7
              }else{
                  fact--
              }
          }

     

          let dv = (11-(suma%11))
          if(dv ==10){
              return 1
          }else if(dv ==11 ){
              return 0
          }else{
              return dv
          }

      

      }



      let digitoverificador = digVerificador(claveAcceso)
      let clavefinal = claveAcceso +""+digitoverificador
 
      let xmlgenerator = 
     '<factura id="comprobante" version="1.0.0">\n' +
      "    <infoTributaria>\n" +
      `        <ambiente>${ambiente}</ambiente>\n` +
      `        <tipoEmision>${tipoEmision}</tipoEmision>\n`+
      `        <razonSocial>${razon}</razonSocial>\n`+
      `        <nombreComercial>${nombreComercial}</nombreComercial>\n`+
      `        <ruc>${ruc}</ruc>\n`+
      `        <claveAcceso>${clavefinal}</claveAcceso>\n`+        
      `        <codDoc>${codDoc}</codDoc>\n`+
      `        <estab>${estab}</estab>\n`+
      `        <ptoEmi>${ptoEmi}</ptoEmi>\n`+
      `        <secuencial>${secuencial}</secuencial>\n`+
      `        <dirMatriz>${dirMatriz}</dirMatriz>\n`+
                rimpeval +       
      `    </infoTributaria>\n`+
      `    <infoFactura>\n`+
      `        <fechaEmision>${fechaEmision}</fechaEmision>\n`+
      `        <dirEstablecimiento>${dirEstablecimiento}</dirEstablecimiento>\n`+
      `        <obligadoContabilidad>${obligadoContabilidad}</obligadoContabilidad>\n`+
      `        <tipoIdentificacionComprador>${tipoIdentificacionComprador}</tipoIdentificacionComprador>\n`+
      `        <razonSocialComprador>${razonSocialComprador}</razonSocialComprador>\n`+
      `        <identificacionComprador>${identificacionComprador}</identificacionComprador>\n`+
      `        <direccionComprador>${direccionComprador}</direccionComprador>`+
      `        <totalSinImpuestos>${totalSinImpuestos.toFixed(2)}</totalSinImpuestos>\n`+
      `        <totalDescuento>${totalDescuento.toFixed(2)}</totalDescuento>\n`+
      `        <totalConImpuestos>\n`+
      this.genImpuestos()+
      `        </totalConImpuestos>\n`+
      `        <propina>${propina}</propina>\n`+
      `        <importeTotal>${importeTotal}</importeTotal>\n`+
      `        <moneda>DOLAR</moneda>\n`+
      "        <pagos>\n"+
      "            <pago>\n"+
      "                <formaPago>01</formaPago>\n"+
      `                <total>${importeTotal}</total>\n`+
      `            </pago>\n`+
      `        </pagos>\n`+
      `    </infoFactura>\n`+
      `    <detalles>\n`+
  this.gendetalles()+
      `    </detalles>\n`+

      "</factura>"
     


   let link = document.createElement('a');
   let docFirmado = SignerJS(xmlgenerator, 
      contP12, 
     this.decryptData( this.props.state.userReducer.update.usuario.user.Firmdata.pass))


   let accumText = ""
  let mimapper =  this.state.Fpago.map(x=> accumText.concat(x.Detalles))

const url = window.URL.createObjectURL(
new Blob([docFirmado], { type: "text/plain"}),
);
link.href = url;
link.setAttribute(
'download',
`Consultores Asociados 001-001-100.xml`,
);

link.click()
   

  

let dataexample2 = {
ClaveAcceso:clavefinal, 
xmlDoc:docFirmado,
numeroAuto:"1511202201170655537000110010010000001001234567812",
fechaAuto:"2022-11-15T22:49:50-05:00",
secuencial:"100",
 SuperTotal,                                           
 TotalDescuento,
 IvaEC:valorIVA,
 fechaEmision,
 nombreComercial,
 dirEstablecimiento,
 baseImpoSinImpuestos,
 baseImpoConImpuestos,
 Doctype: this.state.doctype,
  UserId: this.state.id,

  razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
  ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
  estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
  ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
  secuencial:this.ceroMaker(this.state.secuencialGen),
  obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
  rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?true:false,
  razonSocialComprador:this.state.UserSelect?this.state.usuario:'CONSUMIDOR FINAL',
  ciudadComprador:this.state.UserSelect?this.state.ciudad:'',
  identificacionComprador:this.state.UserSelect?this.state.cedula:'9999999999999',
  direccionComprador:this.state.UserSelect?this.state.direccion:'',
  ArticulosVendidos:this.state.ArtVent,
  LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
   Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
   Estado:"AUTORIZADO",
   detalles:mimapper.map((x)=>  x +" ")
};
let generatedFact = factGenerator(dataexample2)

// this.setState({html:generatedFact})

let allData ={doc:docFirmado,
    codigo:clavefinal,
    idUser:this.props.state.userReducer.update.usuario.user._id,
    ambiente:ambiente==1?"Pruebas":"Produccion"  
       }


     fetch("/public/uploadSignedXml", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(allData), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": this.props.state.userReducer.update.usuario.token
      }
    }).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {
      console.log(response)
            if(response.status =="ok" ){
             if(response.resdata.estado == "AUTORIZADO"){
                 let numeroAuto = response.resdata.numeroAutorizacion
                 let fechaAuto = response.resdata.fechaAutorizacion
                 let accumText = ""
                 let mimapper =  this.state.Fpago.map(x=> accumText.concat(x.Detalles))
                
                 let vendedorCont ={
                     Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                     Id:this.props.state.userReducer.update.usuario.user._id,
                     Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                 }

                 let newdocFirmado =     `    <autorizacion>\n`+
                 `    <estado>AUTORIZADO</estado>\n`+
                  `    <numeroAutorizacion>${numeroAuto}</numeroAutorizacion>\n`+
                  `    <fechaAutorizacion>${fechaAuto}</fechaAutorizacion>\n`+
                  `    <ambiente>PRODUCCIÓN</ambiente>\n`+
                  `    <comprobante>
                  <![CDATA[<?xml version="1.0" encoding="UTF-8"?>
                  ${docFirmado}
              ]]>
                  </comprobante>\n`+
                  
                 `    </autorizacion>`

 

                 let PDFdata = {
                  ClaveAcceso:clavefinal, 
                  xmlDoc:docFirmado,
                  numeroAuto,
                   fechaAuto,
                   secuencial,
                     SuperTotal,                                           
                     TotalDescuento,
                     baseImpoSinImpuestos,
                     baseImpoConImpuestos,
                     IvaEC:valorIVA,
                     fechaEmision,
                     nombreComercial,
                     dirEstablecimiento,
                  
                     Doctype: this.state.doctype,
                      UserId: this.state.id,
                      razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                      ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                      estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                      ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                      secuencial:this.ceroMaker(this.state.secuencialGen),
                      obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                      rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?"CONTRIBUYENTE RÉGIMEN RIMPE":"",
                      razonSocialComprador:this.state.UserSelect?this.state.usuario:'CONSUMIDOR FINAL',
                      identificacionComprador:this.state.UserSelect?this.state.cedula:'9999999999999',
                      direccionComprador:this.state.UserSelect?this.state.direccion:'',
                      ArticulosVendidos:this.state.ArtVent,
                      LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                      
                       Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                       Estado:"AUTORIZADO",
                       detalles:mimapper.map((x)=>  x +" ")
                   };
                 let CompiladoFactdata = {
                                    iDCating:4,
                                     html:factGenerator(PDFdata),
                                     allData:PDFdata,
                                     xmlDoc:newdocFirmado,
                                    numeroAuto,
                                     fechaAuto,
                                     secuencial,                                      
                                       SuperTotal,   
                                       ClaveAcceso:clavefinal,                                        
                                       TotalDescuento,
                                       IvaEC:valorIVA,
                                       baseImponible,
                                       Doctype: "Factura-Electronica",
                                        UserId: this.state.id,
                                        UserName:this.state.usuario,
                                        Correo: this.state.correo,
                                        Telefono: this.state.telefono,
                                        Direccion: this.state.direccion,
                                         Cedula:this.state.cedula,
                                         Ciudad:this.state.ciudad,
                                         ArticulosVendidos:this.state.ArtVent,
                                         FormasPago:this.state.Fpago,
                                         idVenta:this.state.idVenta,
                                         idRegistro:this.state.idReg,
                                         Tiempo: new Date().getTime(),
                                         Vendedor: vendedorCont,
                                         Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 
                                         Estado:"AUTORIZADO",
                                         detalles:mimapper.map((x)=>  x +" ")
                                     };
                                     
                 fetch('/cuentas/generarventa', {
                     method: 'POST', // or 'PUT'
                     body: JSON.stringify(CompiladoFactdata), // data can be `string` or {object}!
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
                      this.props.dispatch(addVenta(response.VentaGen));
                      this.props.dispatch(addRegs(response.arrRegsSend));
                
                      if(this.props.state.RegContableReducer.Articulos){
                        this.props.dispatch(updateArts(response.Articulos));
                      }
                      if(this.props.state.RegContableReducer.Cuentas){
                        this.props.dispatch(updateCuentas(response.Cuentas));
                      }
                   
                   

                    var data = {AllData: this.props.compra,
                    
                      Userdata: {DBname:this.props.state.userReducer.update.usuario.user.DBname},
                      FormasPago:this.state.Fpago,
                   Venta:response.VentaGen
                    }
                    let stingdata = JSON.stringify(data)



                    const options = {
                    method: 'POST',
                    body: stingdata,
                    
                     headers: {
                       'Content-Type': 'application/json',
                       "x-access-token": this.props.state.userReducer.update.usuario.token
                     }
                    }
                    fetch('/public/tienda/updateorderpago', options).then(response => response.json())
                    .then(res => {
                    console.log(res)
                   if(res.status == "Error"){
                    let add = {
                      Estado:true,
                      Tipo:"error",
                      Mensaje:`Error: ${res.error} `
                  }
                  this.setState({Alert: add, loading:false,}) 
                   }else{
              
                    let indextoRemplace = this.props.state.configRedu.ordenesCompra.findIndex((item,i)=>(item._id === res.orden._id))
                    
                    let ordenes = this.props.state.configRedu.ordenesCompra
                    
                    ordenes[indextoRemplace] = res.orden
                    
                    this.props.dispatch(updateOrder({ordenes}))
                    let add = {
                      Estado:true,
                      Tipo:"success",
                      Mensaje:`Ingreso exitoso`
                  }
                  this.setState({Alert: add, loading:false,helperFormapago:false}) 

                    
                  let cleanData = {
                    loading:false,
                    UserSelect:false,
                    userDisplay:false,
                    id:"",
                    usuario:"",
                    readOnly:true,
                    correo:"",
                    telefono:"",
                    ciudad:"",
                    direccion:"",
                    cedula:"",
                    disableDoc:false,
                    SelectFormaPago:[],

                    ArtVent:[],
                    tipopago:"Contado",
                    Fpago:[  ],
                    Fcredito:[],
                    descuentoPer:0,
                    descuentoVal:0,
                    arrPrecios:[],
                   

                }
                this.setState(cleanData)
                   }
                    })
                    .catch(error => console.log(error)
                    );
                         
                 }
                 })
  
  
  
             }                  
  
       }else if( response.status =="error" ){
  
         if(response.resdata.estado == 'EN PROCESO'){
             let numeroAuto = "00000000000"
             let fechaAuto = "xx-en-espera--xx"
             

             let vendedorCont ={
                 Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                 Id:this.props.state.userReducer.update.usuario.user._id,
                 Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
             }
             let PDFproceso = {
              ClaveAcceso:clavefinal, 
              numeroAuto,
               fechaAuto,
               secuencial,
                 SuperTotal,                                           
                 TotalDescuento,
                 IvaEC:valorIVA,
                 fechaEmision,
                 nombreComercial,
                 dirEstablecimiento,
                 baseImpoSinImpuestos,
                 baseImpoConImpuestos,
                 Doctype: this.state.doctype,
                  UserId: this.state.id,
                  razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                  ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                  estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                  ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                  secuencial:this.ceroMaker(this.state.secuencialGen),
                  obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                  rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?"CONTRIBUYENTE RÉGIMEN RIMPE":"",
                  razonSocialComprador:this.state.UserSelect?this.state.usuario:'CONSUMIDOR FINAL',
                  identificacionComprador:this.state.UserSelect?this.state.cedula:'9999999999999',
                  direccionComprador:this.state.UserSelect?this.state.direccion:'',
                  ArticulosVendidos:this.state.ArtVent,
                  populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,            
                  
                   Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 
                   Estado:"EN PROCESO",
                   detalles:mimapper.map((x)=>  x +" ")
                               };
             var dataexample = {
                          
                               html:factGenerator(PDFproceso),
                                     allData:PDFproceso,
                                numeroAuto,
                                 fechaAuto,
                                 secuencial,
                                   SuperTotal,  
                                   xmlDoc:docFirmado, 
                                   ClaveAcceso:clavefinal,                                        
                                   TotalDescuento,
                                   IvaEC:valorIVA,
                                   baseImponible:baseImponible,
                                   Doctype: "Factura-Electronica",
                                    UserId: this.state.id,
                                    UserName:this.state.usuario,
                                    Correo: this.state.correo,
                                    Telefono: this.state.telefono,
                                    Direccion: this.state.direccion,
                                     Cedula:this.state.cedula,
                                     Ciudad:this.state.ciudad,
                                     ArticulosVendidos:this.state.ArtVent,
                                     FormasPago:this.state.Fpago,
                                     idVenta:this.state.idVenta,
                                     idRegistro:this.state.idReg,
                                     Tiempo: new Date().getTime(),
                                     Vendedor: vendedorCont,
                                     Estado:"EN PROCESO",
                                     detalles:mimapper.map((x)=>  x +" "),
                                     Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}  
                              };
             fetch('/cuentas/generarventa', {
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
                         Tipo:"warning",
                         Mensaje:"Factura en Proceso de Validacion, revisar "
                     }
                   
                     this.setState({Alert: add,
                      loading:false })

                  let accumText = ""
                  let mimapper =  this.state.Fpago.map(x=> accumText.concat(x.Detalles))
               
                
                
                  
                    
                    setTimeout(()=>{ 
                      this.setState({
                          UserSelect:false,  
                          userDisplay:false, 
                          id:"",
                          usuario:"",
                          readOnly:true,
                          correo:"",
                          telefono:"",
                          ciudad:"",
                          direccion:"",
                          cedula:"",
                          SelectFormaPago:[],

                          ArtVent:[],
                          tipopago:"Contado",
                          Fpago:[  ],
                          descuentoPer:0,
                          descuentoVal:0,
                          arrPrecios:[],
                         

                      })
                  
                  },100)
             }
             })
         }
         else {
          let add = {
         Estado:true,
         Tipo:"error",
         Mensaje:`Error en la factura, ${response.resdata.mensajes.mensaje.mensaje},  ${response.resdata.mensajes.mensaje.informacionAdicional
         } `
     }
  
     this.setState({Alert: add, 
         loading:false,
     })
      
       }
     }else if(response.status =="fatalerror" ){
     
              let add = {
                         Estado:true,
                         Tipo:"error",
                         Mensaje:"Error el los Servidores del SRI, intente en unos momentos"
                     }
                   
                     this.setState({Alert: add,
                                  loading:false,
                   })
     }
  });
  









     }
     decryptData = (text) => {
           
      const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     
      return (data)
    };
    comprobadorVenta=(IvaEC,valSinIva)=>{

      if(this.state.loading == false){
          this.setState({loading:true})
             
              let SuperTotal = this.props.compra.valorFinal
              let TotalPago = 0
              
              if(this.state.Fpago.length > 0){
      
                  for(let i = 0; i<this.state.Fpago.length;i++){
                  
                      TotalPago = TotalPago + parseFloat(this.state.Fpago[i].Cantidad)
                  }
                  
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
                             
                              
                              if (this.state.doctype =="Factura"){
                                
                                  if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){                
                             
                                      const baseData = localStorage.getItem("base64data")
                             
                                      if(baseData == null){
                                      let urlf = this.props.state.userReducer.update.usuario.user.Firmdata.url
                                    
                                  let GeneratedURL = this.getSignature(urlf, 
                                  process.env.REACT_CLOUDY_SECRET, 
                                  this.props.state.userReducer.update.usuario.user.Firmdata.publicId)
                                    console.log(GeneratedURL)
                                  fetch(GeneratedURL, {
                            method: 'GET',
                            headers: {
                              'Content-Type': "application/x-pkcs12",
                            },
                          })
                          .then((response) => response.blob())
                          .then((blob) => {
                            // Create blob link to download
                          
                            let readerSave = new FileReader();
                            readerSave.readAsDataURL(blob); 
                            readerSave.onloadend = ()=> {
                              let base64data = readerSave.result;                
                          
                              const dataEncripted = CryptoJS.AES.encrypt(
                                  JSON.stringify(base64data),
                                  process.env.REACT_CLOUDY_SECRET
                                ).toString();

                             
                              localStorage.setItem("base64data", dataEncripted)

                              }
                              let reader = new FileReader();
                              reader.readAsArrayBuffer(blob)
                              reader.addEventListener("loadend", (event) => {
                                  let bufferfile = event.target.result
    
                                  
                               this.genfact(SuperTotal,(SuperTotal - IvaEC), IvaEC,bufferfile,TotalDescuento )
                             
                            
                            });
                        
                          })}
                          else{

                              let base64Decript = this.decryptData(baseData)

                         
                              fetch(base64Decript, {
                                  method: 'GET',
                                  headers: {
                                    'Content-Type': "application/x-pkcs12",
                                  },
                                })
                                .then((response) => response.blob())
                                .then((blob) => {
                                  // Create blob link to download
                      
                                    let reader = new FileReader();
                                    reader.readAsArrayBuffer(blob)
                                    reader.addEventListener("loadend", (event) => {
                                        let bufferfile = event.target.result
          
                                        
                                     this.genfact(SuperTotal,(SuperTotal - IvaEC), IvaEC,bufferfile,TotalDescuento )
                                   
                                  
                                  });
                              
                                });


                          }
                                  
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
                                      ciudadComprador:this.state.UserSelect?this.state.ciudad:'',
                                         SuperTotal,                                           
                                         TotalDescuento,
                                         ciudadComprador:this.state.UserSelect?this.state.ciudad:'',
                                         fechaEmision,
                                         nombreComercial:this.props.state.userReducer.update.usuario.user.Factura.nombreComercial,
                                         dirEstablecimiento:this.props.state.userReducer.update.usuario.user.Factura.dirEstab,
                                       
                                         Doctype: this.state.doctype,
                                          UserId: this.state.id,
                                          razon:this.props.state.userReducer.update.usuario.user.Factura.razon ,
                                          ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc,
                                          estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab,
                                          ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                                          
                                          obligadoContabilidad :this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                                          rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?true:false,
                                          populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                                          razonSocialComprador:this.state.UserSelect?this.state.usuario:'CONSUMIDOR FINAL',
                                          identificacionComprador:this.state.UserSelect?this.state.cedula:'9999999999999',
                                          direccionComprador:this.state.UserSelect?this.state.direccion:'',
                                          ArticulosVendidos:this.state.ArtVent,
                                          LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                                          
                                           Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                                          
                                           detalles:mimapper.map((x)=>  x +" ")
                                       };


                                  let dataNotadeventa = {
                                    iDCating:4,
                                      numeroAuto:0,
                                      fechaAuto:0,
                                      ClaveAcceso:0,
                                      Secuencial:0,
                                      allData:PDFdata,
                                      html:notaGenetor(PDFdata),
                                                     numeroAuto,
                                                      fechaAuto,
                                                      secuencial,
                                                        SuperTotal,                                           
                                                        TotalDescuento,
                                                      IvaEC,
                                                        baseImponible:valSinIva,
                                                        Doctype: this.state.doctype,
                                                         UserId: this.state.id,
                                                         UserName:this.state.usuario,
                                                         Correo: this.state.correo,
                                                         Telefono: this.state.telefono,
                                                         Direccion: this.state.direccion,
                                                          Cedula:this.state.cedula,
                                                          Ciudad:this.state.ciudad,
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
                                          console.log(response)

                                      if(response.status=="Error"){
                                          let add = {
                                            Estado:true,
                                            Tipo:"error",
                                            Mensaje:`Error en el sistema, ${response.error}`
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
                                    
                                          if(this.props.state.RegContableReducer.Articulos){
                                            this.props.dispatch(updateArts(response.Articulos));
                                          }
                                          if(this.props.state.RegContableReducer.Cuentas){
                                            this.props.dispatch(updateCuentas(response.Cuentas));
                                          }
                                      
                                      
                                        

                                          var data = {AllData: this.props.compra,
                                          
                                            Userdata: {DBname:this.props.state.userReducer.update.usuario.user.DBname},
                                            FormasPago:this.state.Fpago,
                                         Venta:response.VentaGen
                                          }
                                          let stingdata = JSON.stringify(data)
      
      
      
                                          const options = {
                                          method: 'POST',
                                          body: stingdata,
                                          
                                           headers: {
                                             'Content-Type': 'application/json',
                                             "x-access-token": this.props.state.userReducer.update.usuario.token
                                           }
                                          }
                                          fetch('/public/tienda/updateorderpago', options).then(response => response.json())
                                          .then(res => {
                                          console.log(res)
                                         if(res.status == "Error"){
                                          let add = {
                                            Estado:true,
                                            Tipo:"error",
                                            Mensaje:`Error: ${res.error} `
                                        }
                                        this.setState({Alert: add, loading:false,}) 
                                         }else{
                                    
                                          let indextoRemplace = this.props.state.configRedu.ordenesCompra.findIndex((item,i)=>(item._id === res.orden._id))
                                          
                                          let ordenes = this.props.state.configRedu.ordenesCompra
                                          
                                          ordenes[indextoRemplace] = res.orden
                                          
                                          this.props.dispatch(updateOrder({ordenes}))
                                          let add = {
                                            Estado:true,
                                            Tipo:"success",
                                            Mensaje:`Ingreso exitoso`
                                        }
                                        this.setState({Alert: add, loading:false,helperFormapago:false}) 
                                        let cleanData = {
                                          loading:false,
                                          UserSelect:false,
                                          userDisplay:false,
                                          id:"",
                                          usuario:"",
                                          readOnly:true,
                                          correo:"",
                                          telefono:"",
                                          ciudad:"",
                                          direccion:"",
                                          cedula:"",
                                          disableDoc:false,
                                          SelectFormaPago:[],
              
                                          ArtVent:[],
                                          tipopago:"Contado",
                                          Fpago:[  ],
                                          Fcredito:[],
                                          descuentoPer:0,
                                          descuentoVal:0,
                                          arrPrecios:[],
                                         
              
                                      }
                                      this.setState(cleanData)
                                         }
                                          })
                                          .catch(error => console.log(error)
                                          );
                           
                                          
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
  }
    sendpayCompraOrder=(e)=>{
      this.setState({loading:true})
      console.log(this.state)
      if(this.state.Fpago.length == 0){
        console.log("asdasd")
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Agregue una forma de pago"
      }
      this.setState({Alert: add, loading:false,}) 
      }
     


    }
    addCero=(n)=>{
      if (n<10){
        return ("0"+n)
      }else{
        return n
      }
    }

 render() {
  console.log(this.state)
  let artssinIVA = []
let artsconIVA =[]
let valConIva= 0
var SubTotal = 0
let valSinIva = 0
let SuperTotal = 0
let IvaEC = 0
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

   SuperTotal  = valSinIva +  valConIva
  
   if(SuperTotal > 0){
    SubTotal = valConIva/1.12
   
    IvaEC = valConIva - (valConIva / 1.12)
   }
  }
  console.log(this.state)
  console.log(this.props)
  let tiempo = new Date(parseInt(this.props.compra.tiempo))    
                let mes = this.addCero(tiempo.getMonth()+1)
                let dia = this.addCero(tiempo.getDate())
                var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()

  const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props}  />;
  }

    const coloresPago = this.props.compra.estatus.pago.EstadoPago === "default"?"redEnf":
    this.props.compra.estatus.pago.EstadoPago === "Pagado"?"yellowEnf":
    this.props.compra.estatus.pago.EstadoPago === "Concluido"?"greenEnf":
    this.props.compra.estatus.pago.EstadoPago === "Revision-de-pago"?"orangeEnf":
    this.props.compra.estatus.pago.EstadoPago === "Revicion_Cliente"?"cianEnf":
    ""
const coloresCarrito = this.props.compra.estatus.pago.EstadoPago === "default"?"carritorojo":
this.props.compra.estatus.pago.EstadoPago === "Pagado"?"carritoamarillo":
this.props.compra.estatus.pago.EstadoPago === "Concluido"?"carritoverde":
this.props.compra.estatus.pago.EstadoPago === "Revision-de-pago"?"carritotomate":
this.props.compra.estatus.pago.EstadoPago === "Revicion_Cliente"?"carritocian":
    ""

    const producs = this.props.compra.carrito.map((producto, i)=>{

       let defa = i === this.state.artSelect ?"estiloSeleccionado":""


          if(this.props.compra.carrito.length > 1){
            return(<button  key={i} className={`artClick ${defa} `}
            onClick={()=>{this.clickArt({producto, i})}}
            >
              
              {producto.Titulo}
              </button>)
          }

else{        return(<button  key={i} className={`artClick  `}
onClick={()=>{this.clickArt({producto, i})}}
>
  
  {producto.Titulo}
  </button>)
           }
       })

console.log()

    return(



  <div className={`contCompra ${coloresPago}`}>
        <Head>
    <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      </Head>
        <div className={`contCarrito ${coloresCarrito}`}>
        <div className="contDatos" style={{width:"90%", fontSize:"13px"}}>
        <div className="jwClave">Fecha y hora:</div>
    <div className="jwValor">{date}</div>
              
      </div>
      <div className="contShop">
        <span className="material-icons">
    shopping_cart
    </span>
    <p>Nº{this.props.compra.carritoNumero}</p>
    </div>
        </div >
        <div className="contCompraPrincipal">
   
        <div className="contTitulo">
          <div className="contTituloSub1">
      <div className="jwClave">Estado de pago:</div>
    
    <div className="jwValorimg">
    
    {this.props.compra.estatus.pago.EstadoPago ==="default"?<span className="material-icons">
                                                    money_off
                                                    </span>:
                            this.props.compra.estatus.pago.EstadoPago ==="Pagado"?<span className="material-icons">
                            monetization_on
                            </span>:
                            
                            this.props.compra.estatus.pago.EstadoPago ==="Revision-de-pago"?<span className="material-icons">
                            zoom_in
                            </span>: 
    
    this.props.compra.estatus.pago.EstadoPago ==="Concluido"?<span className="material-icons">
                              thumb_up_alt
                                 </span>:  
                   
    this.props.compra.estatus.pago.EstadoPago ==="Revicion_Cliente"?<span className="material-icons">
hourglass_full
       </span>:             "" 
    }
       {this.props.compra.estatus.pago.EstadoPago ==="default"?"Por pagar":
                            this.props.compra.estatus.pago.EstadoPago ==="Pagado"?"Pagado":
                            this.props.compra.estatus.pago.EstadoPago ==="Revision-de-pago"?"Revisión de pago":
                            this.props.compra.estatus.pago.EstadoPago ==="Concluido"?"Concluido":
                            this.props.compra.estatus.pago.EstadoPago ==="Revicion_Cliente"?"Orden en Revisión":
                            ""       }
                            
    </div>
     </div>
    
     {this.props.compra.envio.status &&  <div className="contTituloSub1">
      <div className="jwClave">Estado de envio:</div>
    
    <div className="jwValorimg">
    
    {this.props.compra.estatus.pago.EstadoPago ==="default"?<span className="material-icons">
                                     hourglass_empty
                                                    </span>:
                            this.props.compra.estatus.pago.EstadoPago ==="Pagado"?<span className="material-icons">
                         local_shipping
                            </span>:
                            
                            this.props.compra.estatus.pago.EstadoPago ==="Revision-de-pago"?<span className="material-icons">
                           hourglass_full
                            </span>:         
                                this.props.compra.estatus.pago.EstadoPago ==="Concluido"?<span className="material-icons">
                              thumb_up_alt
                                 </span>:  
                                  this.props.compra.estatus.pago.EstadoPago ==="Revicion_Cliente"?<span className="material-icons">
                                 hourglass_full
                                     </span>: 
                                 ""  
                            
                            }
    
       {this.props.compra.estatus.pago.EstadoPago ==="default"?"Esperando confirmación":
                            this.props.compra.estatus.pago.EstadoPago ==="Pagado"?"Realizado":
                            this.props.compra.estatus.pago.EstadoPago ==="Revision-de-pago"?"Revisión de pago":         
                            this.props.compra.estatus.pago.EstadoPago ==="Concluido"?"Concluido": 
                            this.props.compra.estatus.pago.EstadoPago ==="Revicion_Cliente"?"Orden en Revisión ":    ""  } 
    </div>
     </div>
     }
      {this.props.compra.envio.status === false &&  <div className="contTituloSub1">
      <div className="jwClave">Estado de reserva:</div>
    
    <div className="jwValorimg">
    
    {this.props.compra.estatus.pago.EstadoPago ==="default"?<span className="material-icons">
    lock_open
                                                    </span>:
                            this.props.compra.estatus.pago.EstadoPago ==="Pagado"?<span className="material-icons">
                      lock
                            </span>:
                            
                            this.props.compra.estatus.pago.EstadoPago ==="Revision-de-pago"?<span className="material-icons">
                           lock
                            </span>:         
                               this.props.compra.estatus.pago.EstadoPago ==="Concluido"?<span className="material-icons">
                              thumb_up_alt
                                 </span>:   
                                   this.props.compra.estatus.pago.EstadoPago ==="Revicion_Cliente"?<span className="material-icons">
                                  hourglass_full
                                      </span>: 
                                 ""  
                            
                            }
    
       {this.props.compra.estatus.pago.EstadoPago ==="default"?"Esperando confirmación":
                            this.props.compra.estatus.pago.EstadoPago ==="Pagado"?"Reservado":
                            this.props.compra.estatus.pago.EstadoPago ==="Revision-de-pago"?"Revisión de pago":         
                            this.props.compra.estatus.pago.EstadoPago ==="Concluido"?"Concluido":
                            this.props.compra.estatus.pago.EstadoPago ==="Revicion_Cliente"?"Orden en Revisión ":    ""  } 
    </div>
     </div>
     }
     </div>
     <span className="barraprin">  </span>

     <div className="jwPaper custompaper">
       <div className="botonespago">
      
    <p>Botones Estados de Orden</p>
    <div>
    <Animate show={ this.props.compra.estatus.pago.EstadoPago !="default" && (this.props.compra.estatus.pago.EstadoPago == "Revicion_Cliente" || this.props.compra.estatus.pago.EstadoPago == "Revision-de-pago")}>
    <button className="btn btn-danger" onClick={()=>{this.uploadOrder({estado:"default"})}}>No Pagado</button>
    </Animate>
    <Animate show={ this.props.compra.estatus.pago.EstadoPago !="Pagado" &&  this.props.compra.estatus.pago.EstadoPago == "Revision-de-pago" }>
    <button className="btn btn-warning" onClick={()=>{this.getUA();this.uploadOrder({estado:"PagadoButton"})}}>Pagado</button>
    </Animate>
    <Animate show={ this.props.compra.estatus.pago.EstadoPago !="Revision-de-pago" && this.props.compra.estatus.pago.EstadoPago =="default" }>
    
    <button style={{background:"darkorange"}} className="btn btn-danger"  onClick={()=>{this.uploadOrder({estado:"Revision-de-pago"})}}>Revision de pago</button>
    </Animate>
    <Animate show={ this.props.compra.estatus.pago.EstadoPago !="Concluido" &&  (this.props.compra.estatus.pago.EstadoPago == "Revicion_Cliente" || this.props.compra.estatus.pago.EstadoPago == "Pagado")}>
    <button className="btn btn-success"  onClick={()=>{this.uploadOrder({estado:"Concluido"})}}>Concluido</button>
    </Animate>
    <Animate show={ this.props.compra.estatus.pago.EstadoPago !="Revicion_Cliente"&&  this.props.compra.estatus.pago.EstadoPago == "Concluido"}>
    <button className="btn btn-primary"  onClick={()=>{this.uploadOrder({estado:"Revicion_Cliente"})}}>Revisión</button>
   
    </Animate>

    </div>
    </div>
     </div>
     <ValidatorForm
   
   onSubmit={()=>{
    this.comprobadorVenta(IvaEC,valSinIva)
   }}
   onError={errors => console.log(errors)}
>
     <div className='jwCustomTry'> 
<Animate show={this.state.helperFormapago}>
<Animate show={this.props.compra.estatus.pago.FormasPago.length == 0}>
<div className=' jwFlex jwColumn jwFull'> 
<div className='jwFlex jwColumn '>
<select className="docRounded" value={this.state.doctype} onChange={this.handleDocType} >
          <option value="Factura"> Factura Electrónica</option>
    <option value="Nota de venta" > Nota de Venta </option>
   
         </select>
         
         <div className='contPanelCuentas'>
 <div className=" userwrap">
                     
                        <div className="contSuggester">
                        <div className="jwseccionCard buttoncont">


</div>
                       

                        </div>
                        
                     
                        <div className={  `contUsuario  `}>
                        <Animate show={this.state.userDisplay}>
                
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
       value={this.state.usuario}
       InputProps={{
        readOnly: this.state.readOnly,
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
      
       value={this.state.correo}
       InputProps={{
        readOnly: this.state.readOnly,
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
       errorMessages={['Ingresa una direccion'] }
       value={this.state.direccion}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
<select className="ClieniDInput" value={this.state.ClientID} onChange={this.handleClientID}  >
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
       onChange={this.handleChangeform}
       name="cedula"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa un numero identificacion '] }
       value={this.state.cedula}
       InputProps={{
        readOnly: this.state.readOnly,
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
       onChange={this.handleChangeform}
       name="telefono"
       type="number"
       validators={[]}
       errorMessages={[]}
       value={this.state.telefono}
       InputProps={{
        readOnly: this.state.readOnly,
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
       value={this.state.ciudad}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
   
   
   </div>

   </div>
   <div className="contb">
      

  

      
      
      
                        </div>

</Animate>
                        </div>
                     
                    </div>
    
            </div>
        
         </div>
         <div className='contPago jwFlex'>
         <HelperFormapago    
                    
                    valorSugerido={this.props.compra.valorFinal}

                    onChange={this.setHeperdata}/>  
                    <div className='jwFlex jwColumn'>
                      <Animate show={this.state.doctype=="Factura"}>
                    <div className="centrar spaceAround contsecuencial"> 
               <span > Secuencial</span>
               <input type="number" name="secuencialGen" className='percentInput' value={this.state.secuencialGen} onChange={this.handleChangeSecuencial }/>
               </div>
               </Animate>
                    <div className='contBotonLoading'>
                      <Animate show={!this.state.loading}>
<button className='btn btn-success custombutton'> 
<span className="material-icons" type="submit">
                                  done
                                      </span>
 </button>
 </Animate>
 <Animate show={this.state.loading}>
  <CircularProgress />
 </Animate>
 </div>
 </div>
         </div>

</div>
</Animate>
<Animate show={this.props.compra.estatus.pago.FormasPago.length > 0} >
<div className="contTitulo">
<div className="contTituloSub1">
<div className="jwValorimg">
      <span className="material-icons">

       </span>
      </div>
      <div className="jwClave"
       onClick={()=>{this.uploadOrder({estado:"Pagado"})}}
      >
        
        Venta Generada Nº{this.props.compra.estatus.pago.idVenta}</div>
    
      </div>
    
</div>
</Animate>
</Animate>
</div>
</ValidatorForm>
     <span className="barraprin">  </span>

     <div className="contDatos">
        <div className="jwClave">Nombre:</div>
    <div className="jwValor">{this.props.compra.nombreCliente}</div>
              
      </div>
      <div className="contDatos">
        <div className="jwClave">Correo:</div>
    <div className="jwValor">{this.props.compra.correoCliente}</div>
              
      </div>
      <div className="contDatos">
        <div className="jwClave">Telefono:</div>
    <div className="jwValor">{this.props.compra.telefonoCliente}</div>
              
      </div>
      <span className="barraprin">  </span>


     <div style={{  padding: "0px 5px",  display: "flex", justifyContent:"center", width:"100%"
    }
    
    }
    
     >
          <div className="contenedorDatosPrincipales">
      
     <div className="contDatosP">
      <div className="jwClave">Articulos:</div>
    
    <div className="jwValor"><ul className="ulart">{producs}</ul> </div>
     </div>
     <div className="contDatosP">
     <div className="jwClave">Precio Final:</div>
    <div className="jwValor">${this.props.compra.valorFinal}</div>
     </div>
     <Animate show={this.state.viewComprobante}>
     <div className="contDatosP">
     <div className="jwClave">Comprobante de Pago:</div>
    <div className="jwValor"> <img className='imgPago' src={this.props.compra.urlComprobante[0]} /></div>
     </div>
     </Animate>
     </div>
     <div className="contimagen">
       <img src={this.state.carritoimagen} alt="producto"/>
     </div>
     </div>
     <div className="jwW100percent">
     <Animate show ={!this.state.detalles } >
     <div className="jwW100percentC2 contbotonesduales" >
    <button className="btn btn-primary" onClick={()=>{this.setState({detalles:true})}}>Mas detalles</button>
  
    </div>
    
    </Animate>
    </div>
    
    
      </div>
     
      <Animate show ={this.state.detalles}>
      <div className="subContCompra">
      <div className="contDatos">
      <div className="jwClave">Entrega:</div>
      <Animate show={this.props.compra.envio.status}> 
      <div className="jwValor">Envio a domicilio</div>
      </Animate>
      <Animate show={!this.props.compra.envio.status }> 
      <div className="jwValor">Retiro en Tienda</div>
      </Animate>
      </div>
      <div className="contDatos">
      <div className="jwClave">Forma de Pago:</div>
    <div className="jwValor">{this.props.compra.formadePago}</div>
      </div>
     {this.props.compra.envio.status&& <div className="CondicionalCont"><div className="contDatos">
        <div className="jwClave">Ciudad:</div>
    <div className="jwValor">{this.props.compra.ciudadCliente}</div>
              
      </div>
      <div className="contDatos">
        <div className="jwClave">Direccion:</div>
    <div className="jwValor">{this.props.compra.direccionCliente}</div>
              
      </div>
      </div>}
       
      {this.props.compra.formadePago=== "Tarjeta" && <div className="CondicionalCont"><div className="contDatos">
      <div className="jwClave">Tarjeta Nombre:</div>
    <div className="jwValor">{this.props.compra.tarjetaNombre}</div>
              
      </div>
      <div className="contDatos">
      <div className="jwClave">Tarjeta Numero:</div>
    <div className="jwValor">{this.props.compra.tarjetaNumero?this.props.compra.tarjetaNumero.substring(0,4)+"-XXXX-XXXX-XXXX":""}</div>
              
      </div>
      </div>}
    
       
       
      
       
    {this.props.compra.formadePago === "Transferencia" && <div className="contDatos">
                <div className="jwClave">Banco:</div>
    <div className="jwValor">{this.props.compra.bancoCliente}</div>
    </div> }
     
       
    
       
          
      
       
     
    
    
      <div className="jwW100percent">
     <Animate show ={this.state.detalles } >
     <div className="jwW100percentC2 contbotonesduales" >
    <button className="btn btn-primary" onClick={()=>{this.setState({detalles:false})}}>Menos detalles</button>
    
    </div>
    
    </Animate>
    </div>
      </div>
      </Animate>
      <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
            <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
        
        </Alert>
      </Snackbar>
      <style >
        {`
        .custonCont{
          align-items: center;
        }
        .botonespago{
          display: flex;

    justify-content: center;
    align-items: center;
        }
        .botonespago div{
          display: flex;
    justify-content: space-around;

    flex-wrap: wrap;
        }
        .botonespago button{
         margin:5px;
    
        }
        .contsecuencial{
          margin-top:10px;
      }
      .contsecuencial input{
          border-radius: 26px;
          padding: 7px;
          text-align:center;
          height: 14px;
    width: 80px;
    margin: 30px;
      }
        .botonespago p{
          margin:0px;
     
         }
         .contShop{
          display: flex;
         }
        .barraprin{
          width: 90%;
        margin-left: 5%;
        color: green;
        background-color: #007bff;
        height: 1px;
        box-shadow: 0px 3px 4px black;
        border-radius: 24px;
        margin-top: 10px;
        margin-bottom: 10px;
        }
        .ulart{
         padding:0
        }
        .contenedorDatosPrincipales{
          width: 50%;
          padding-left: 15px;
        }
        .contDatosP{
          width:100%;
          margin: 22px 0px;
        }
        .contimagen{
          display: flex;
        width: 50%;
        justify-content: center;
        align-items: center;
        }
        .contimagen img{
          width: 86%;
        margin: 10px;
        max-width:150px;
        height: 200px;
        }
        .jwW95percentC{
      width: 95%;
      
    }
    .jwW45percent{
      width: 45%;
    }
    .jwW100percentC{
      width: 100%;
      display:flex;
    }
    .jwW100percent{
      width: 100%;
    
    }
    .jwW100percentC2{
      width: 100%;
      display:flex;
      justify-content:center;
      align-items:center
    }
    .contbotonesduales{
      margin: 15px 0px;
      display:flex;
      justify-content:space-around
    }
    .contTitulo{
      display: flex;
        width: 100%;
        margin-top: 20px;
    
        border-radius: 10px;
        padding: 5px;
        justify-content: space-around;
        align-items: center;}
    .contCarrito{
     
        border-radius: 14px 14px 0px 0px;
        display: flex;
        justify-content: flex-end;
      
        padding-right: 11px;
        padding-top: 16px;
      
        font-size: 25px;
        align-items: center;
    }
    .carritorojo{
      background-color: #ff8080;
    }
    .carritocian{
      background-color: darkcyan;
    }
    .carritotomate{
      background-color: orange;
    }
    .carritoamarillo{
      background-color: #ffffbb;
    }
    .carritoverde{
      background-color: lightgreen;
    }
    .custombutton{
      margin:5px;
      max-width:50px;
    }
    .contBotonLoading div{
      display: flex;
      justify-content: center;
    } 
    .contCarrito p{
      margin:0
    }
    .contCarrito span{
      font-size:25px
    }
    .imgPago{    width: 100%;
    }
    .docRounded{
      max-width: 170px;
      border-radius: 16px;
      padding-right: 10px;
      margin-left: 10px;
      border-bottom: 2px solid black;
      margin:20px;
  }
  .contenidoForm {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.editadd{
    background: #bbd8f7;
    border-bottom: 5px solid black;
}
.customInput {
    display: flex;
    align-items: center;
    margin: 5px 10px;
    justify-content: center;
    width: 250px;
}
        .contCompra{
          display: flex;
       
        padding-bottom: 24px;
        flex-flow: column;
     
        border-radius: 16px;
        margin: 20px 0px;
        }
        .redEnf{
          border: 1px solid red;box-shadow: 0px -1px 11px -1px red;
        }
        .orangeEnf{
          border: 1px solid orange;box-shadow: 0px -1px 11px -1px orange;
        }
        .yellowEnf{
          border: 1px solid #ffe074;box-shadow: 0px -1px 11px -1px yellow;
        }
        .greenEnf{
          border: 1px solid green;box-shadow: 0px -1px 11px -1px green;
    }
    .cianEnf{
          border: 1px solid darkcyan;box-shadow: 0px -1px 11px -1px darkcyan;
    }
        .contCompraPrincipal{
          text-align: left;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        }
        .jwCustomTry{
          width: 100%;
        }
      
        .CondicionalCont{
          width: 100%;
        display: flex;
        }
        .subContCompra{
          text-align: left;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        }
    .custompaper{
      width: 100%;
    justify-content: center;
    display: flex;
    margin: 15px;
    align-items: center;
    }
        .contDatos{
          margin: 0px 5px 5px 23px;
          width: 45%;
          display:flex;
          align-items: center;
        }
        .jwClave{
          font-size: 20px;
        font-weight: bold;
        }
        .jwValorimg{
          display: flex;
        justify-content: space-around;
        margin-top: 5px;
        padding: 0px 12px;
        }
    .contTituloSub1{
      margin: 5px;
     
        text-align: center;
        box-shadow: 0px 3px 3px grey;
        padding: 4px;
        border-radius: 12px;
    }
    .artClick {
      list-style: none;
        padding: 7px;
        margin: 5px 0px;
        border-radius: 9px;
        font-size: 15px;
    }
    .estiloSeleccionado{
      background-color: #a6ccf5;
        box-shadow: 0px 2px 2px black;
        transition: 1s;
    }
    
    
        `}</style>
      
    
        </div>
      
        



      
        )
  
   }
 }


 const mapStateToProps = state => {


  return {state}
};


export default connect(mapStateToProps)(purdata)

  
  
