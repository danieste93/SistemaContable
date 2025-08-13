import React, { Component } from 'react'
import ArticuloNota from "./articuloNotas";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { CircularProgress } from '@material-ui/core';
import { Animate } from 'react-animate-mount/lib/Animate';
import {connect} from 'react-redux';
import SignerJS from "../snippets/signer"
import fetchData from '../funciones/fetchdata'
import CryptoJS from "crypto-js";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Forge  from 'node-forge';
import Checkbox from '@material-ui/core/Checkbox';
import SecureFirm from '../snippets/getSecureFirm';
import NotaCredito from "../../public/static/NotaCreditoTemplate"
import {updateVenta} from "../../reduxstore/actions/regcont"


class Contacto extends Component {
   
state={
  ArtVent:this.props.datos.articulosVendidos,
  loading:false,
  descargarNota:false,
  ClientID:"",
  secuencialGen:0,
  secuencialBase:0,
  Justificacion:"",
  Alert:{Estado:false},
}
    componentDidMount(){

      console.log(this.props)
      console.log(this.state)
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);

this.getUserData()
        
      }

      handleChangeCheckbox=()=>{
        this.setState({descargarNota:!this.state.descargarNota})
            }
          decryptData = (text) => {
                 
                  const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
                  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                 
                  return (data)
                };
       ceroMaker=(val)=>{

        let cantidad = JSON.stringify(val).length
    
        let requerido = 9 - cantidad
    
        let gen = '0'.repeat(requerido)
     
        let added = `${gen}${JSON.stringify(val)}`
   
        return added
    }
      getUserData=async(val)=>{

let data = await fetchData(this.props.state.userReducer,
    "/public/getClientData",
    this.props.datos.idCliente)

    this.setState({ClientID:data.Client.TipoID,
              secuencialGen:data.Counters,
              secuencialBase:data.Counters,

    })
       }
       addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
       gendetalles=()=>{   

        let nuevosDetalles = this.state.ArtVent.map(item =>{
            let codigoPorcentajeDeta =item.Iva? 4 : 0 // 0:0%  2:12%  3:14%  4:15% 5:5% 10:13% 
            let codigoDeta =2 //IVA:2 ICE:3 IRBPNR:5

          let tarifaDetal =item.Iva? parseFloat(process.env.IVA_EC) : 0
          let baseImponible =  (item.PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`)).toFixed(2)
            let precioTotalSinImpuesto = item.Iva? baseImponible
                                        :   item.PrecioCompraTotal.toFixed(2) 

                
                                   let valor  = item.Iva?  ((item.PrecioCompraTotal) - baseImponible).toFixed(2):0                      
                                        
        let precioUnitario =  (precioTotalSinImpuesto / item.CantidadCompra).toFixed(2)
        let data = `        <detalle>\n`+
        `            <codigoInterno>${item.Eqid}</codigoInterno>\n`+
`            <codigoAdicional>${item.Eqid}</codigoAdicional>\n`+
`            <descripcion>${item.Titulo}</descripcion>\n`+
`            <cantidad>${item.CantidadCompra.toFixed(2)}</cantidad>\n`+
`            <precioUnitario>${precioUnitario}</precioUnitario>\n`+
`            <descuento>0</descuento>\n`+
`            <precioTotalSinImpuesto>${precioTotalSinImpuesto}</precioTotalSinImpuesto>\n`+
`            <impuestos>\n`+
`                <impuesto>\n`+
`                    <codigo>${codigoDeta}</codigo>\n`+
`                    <codigoPorcentaje>${codigoPorcentajeDeta}</codigoPorcentaje>\n`+
`                    <tarifa>${tarifaDetal.toFixed(2)}</tarifa>\n`+
`                    <baseImponible>${precioTotalSinImpuesto}</baseImponible>\n`+
`                    <valor>${valor}</valor>\n`+
`                </impuesto>\n`+
`            </impuestos>\n`+
"        </detalle>\n"
        
        
        return data
        })
     
               return nuevosDetalles.join("")  
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
      ceroMaker=(val)=>{

        let cantidad = JSON.stringify(val).length
    
        let requerido = 9 - cantidad
    
        let gen = '0'.repeat(requerido)
     
        let added = `${gen}${JSON.stringify(val)}`
   
        return added
    }

    genImpuestos=()=>{
        let codigoPorcentajeDeta = 4 // 0:0%  2:12%  3:14%  4:15% 5:5% 10:13% 
        let codigoDeta =2 //IVA:2 ICE:3 IRBPNR:5
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
            `                <valor>${0.00}</valor>\n`+
            `            </totalImpuesto>\n`
            dataImpuestos += data
        }
        if(artImpuestos.length > 0){
           
         let baseImponibleImpuestos = 0
         let valtotal = 0
                for(let i=0;i<artImpuestos.length;i++){
                    baseImponibleImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
                    valtotal += (artImpuestos[i].PrecioCompraTotal)
                }
              
        let valor=valtotal - baseImponibleImpuestos

            
            let data = `            <totalImpuesto>\n`+
            `                <codigo>${codigoDeta}</codigo>\n`+
            `                <codigoPorcentaje>${codigoPorcentajeDeta}</codigoPorcentaje>\n`+
            `                <baseImponible>${baseImponibleImpuestos.toFixed(2)}</baseImponible>\n`+
            `                <valor>${valor.toFixed(2)}</valor>\n`+
            `            </totalImpuesto>\n`
         
            dataImpuestos += data
        }

        return dataImpuestos
       
    }  


      genNotaCredito= async(SuperTotal, IvaEC)=>{

        this.setState({loading:true})
        
        let razon = this.props.state.userReducer.update.usuario.user.Factura.razon 
        let nombreComercial = this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
        let ruc = this.props.state.userReducer.update.usuario.user.Factura.ruc
        let codDoc = "04" // 04 nota de credito, 01 factura, 
        let estab =this.props.state.userReducer.update.usuario.user.Factura.codigoEstab
        let ptoEmi= this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
     let secuencial= this.ceroMaker(this.state.secuencialGen)
    //  let secuencial=  "000000009"
        let dirMatriz=this.props.state.userReducer.update.usuario.user.Factura.dirMatriz    
        let dirEstablecimiento=this.props.state.userReducer.update.usuario.user.Factura.dirEstab
        let obligadoContabilidad =this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO"
        let rimpeval = this.props.state.userReducer.update.usuario.user.Factura.rimpe?"        <contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>\n":""
        
      
      
    
        let  tipoIdentificacionComprador=this.state.ClientID =="Cedula"?"05":
                                        this.state.ClientID == "RUC"?"04":
                                        this.state.ClientID =="Pasaporte"?"06":"07"
                                     
        let razonSocialComprador = this.props.datos.nombreCliente
        let identificacionComprador = this.props.datos.cedulaCliente
        let direccionComprador = this.props.datos.direccionCliente
        let correoComprador = this.props.datos.correoCliente
        let ciudadComprador = this.props.datos.ciudadCliente
        
        
       
 
        let artImpuestos  = this.state.ArtVent.filter(x=>x.Iva)
        let artSinImpuestos = this.state.ArtVent.filter(x=>x.Iva == false)
        

        let baseImpoConImpuestos = 0
        let baseImpoSinImpuestos = 0
        
        if(artImpuestos.length > 0){
            for(let i=0;i<artImpuestos.length;i++){
            
                baseImpoConImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))

            
            
            }
            
        }
      
        if(artSinImpuestos.length > 0){
            for(let i=0;i<artSinImpuestos.length;i++){
              
                baseImpoSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
            }
        }

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


        let tiempoDocSustento = new Date(this.props.datos.FactFechaAutorizacion)    
        let mesDocSustento = this.addCero(tiempoDocSustento.getMonth()+1)
        let diaDocSustento = this.addCero(tiempoDocSustento.getDate())
        var dateDocSustento = diaDocSustento+ "/"+ mesDocSustento+"/"+tiempoDocSustento.getFullYear()
        let fechaEmisionDocSustento =dateDocSustento
        let numDocModificado = `${estab}-${ptoEmi}-${this.ceroMaker(this.props.datos.Secuencial)}`
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
 //    `   <?xml version="1.0" encoding="UTF-8"?>\n`+
        `<notaCredito id="comprobante" version="1.0.0">\n` +
        "    <infoTributaria>\n" +
        `        <ambiente>${ambiente}</ambiente>\n`+
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
        `        <contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>\n`+       
        `    </infoTributaria>\n`+
        "    <infoNotaCredito>\n" +
        `        <fechaEmision>${fechaEmision}</fechaEmision>\n`+
        `        <dirEstablecimiento>${dirEstablecimiento}</dirEstablecimiento>\n`+
        `        <tipoIdentificacionComprador>${tipoIdentificacionComprador}</tipoIdentificacionComprador>\n` +
        `        <razonSocialComprador>${razonSocialComprador}</razonSocialComprador>\n` +
        `        <identificacionComprador>${identificacionComprador}</identificacionComprador>\n` +
        `        <obligadoContabilidad>${obligadoContabilidad}</obligadoContabilidad>\n`+
        `        <codDocModificado>01</codDocModificado>\n` +
        `        <numDocModificado>${numDocModificado}</numDocModificado>\n` +
        `        <fechaEmisionDocSustento>${fechaEmisionDocSustento}</fechaEmisionDocSustento>\n` +
        `        <totalSinImpuestos>${(baseImpoSinImpuestos + baseImpoConImpuestos).toFixed(2)}</totalSinImpuestos>\n` +
        `        <valorModificacion>${(this.props.datos.PrecioCompraTotal - SuperTotal).toFixed(2)}</valorModificacion>\n` +
        `        <moneda>DOLAR</moneda>\n`+
        "        <totalConImpuestos>\n" +
                 this.genImpuestos()+
        "        </totalConImpuestos>\n" +
        `        <motivo>${this.state.Justificacion}</motivo>\n` +
        "    </infoNotaCredito>\n" +
        "    <detalles>\n" +
                  this.gendetalles()+  
        "    </detalles>\n" +
        "    <infoAdicional>\n" +
        `        <campoAdicional nombre="Dirección">${direccionComprador}</campoAdicional>\n` +
        `        <campoAdicional nombre="Email">${correoComprador}</campoAdicional>\n` +
        "     </infoAdicional>\n" +
    
"</notaCredito>"


 if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){                
   let bufferfile = ""                    
    try {
      bufferfile = await SecureFirm(this.props.state.userReducer)
        console.log('Bufferfile obtenido:', bufferfile);
    
      } catch (error) {
        console.error('Error al obtener bufferfile:', error);
      }   
      
      

      let docFirmado = SignerJS(xmlgenerator, 
        bufferfile, 
       this.decryptData( this.props.state.userReducer.update.usuario.user.Firmdata.pass))
    
       if(docFirmado.status == "Error"){

         let add = {
             Estado:true,
             Tipo:"error",
             Mensaje:`Error con la firma electronica, ${docFirmado.message}`
         }
         this.setState({Alert: add, loading:false}) 
        }else{
       

       let allData ={doc:docFirmado,
        codigo:clavefinal,
        idUser:this.props.state.userReducer.update.usuario.user._id,
        ambiente:ambiente==1?"Pruebas":"Produccion"  
           }
       
           let link = document.createElement('a');
           const url = window.URL.createObjectURL(
            new Blob([docFirmado], { type: "text/plain"}),
          );
        link.href = url;
        link.setAttribute(
          'download',
          `Consultores Asociados 001-001-100.xml`,
        );
        
         link.click()

      
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

                let vendedorCont ={
                    Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                    Id:this.props.state.userReducer.update.usuario.user._id,
                    Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                }

                let PDFdata = {
                    vendedorCont,
                    IDVenta:this.props.datos._id,
                    ClaveAcceso:clavefinal, 
                    numeroAuto,
                     fechaAuto,
                     fechaEmisionDocSustento, 
                     numDocModificado,
                     secuencial,
                       SuperTotal,                                           
                       populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                       baseImpoSinImpuestos,
                       baseImpoConImpuestos,
                       IvaEC:IvaEC.toFixed(2),
                       fechaEmision,
                       nombreComercial,
                       dirEstablecimiento,
                       Doctype: "Nota-de-Credito",
                      //  UserId: this.state.id,
                        razon ,
                        ruc,
                        estab,
                        ptoEmi,
                        secuencial,
                        obligadoContabilidad,
                        rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?"CONTRIBUYENTE RÉGIMEN RIMPE":"",
                        razonSocialComprador,
                        identificacionComprador,
                        direccionComprador,
                        correoComprador,
                        ciudadComprador,
                        ArticulosVendidos:this.state.ArtVent,
                        LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                         Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                         Estado:"AUTORIZADO",
                         Justificacion:this.state.Justificacion,
                     };
        

                  if(this.state.descargarNota){

                    fetch("/public/downloadPDFbyHTML", {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify({
                            Html:NotaCredito(PDFdata)

                        }), // data can be `string` or {object}!
                        headers:{
                          'Content-Type': 'application/json',
                          "x-access-token": this.props.state.userReducer.update.usuario.token
                        }
                      }).then(res => res.json())
                      .then(response =>{
                        if(response.status == "Ok"){
                            const url = window.URL.createObjectURL(
                              new Blob([Buffer.from(response.buffer)], { type: "application/pdf"}),
                            );
                          let link = document.createElement('a');
                          link.href = url;
                          link.setAttribute(
                            'download',
                            `Nota-de-Crédito ${secuencial}`,
                          );
                          link.click()
                          
                        
                        }


                      })


                  }

                  fetch('/cuentas/agregarNotaCredito', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        newdocFirmado,
                        Html:NotaCredito(PDFdata),
                        PDFdata,
                        docFirmado,
                        Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 

                    }), // data can be `string` or {object}!
                    headers:{
                      'Content-Type': 'application/json',
                      "x-access-token": this.props.state.userReducer.update.usuario.token
                    }
                  }).then(res => res.json())
                  .catch(error => console.error('Error:', error))
                  .then(response => { 
                    console.log(response)
                    if(response.status== "Ok"){

                      this.props.dispatch(updateVenta(response.updateVenta));
                      this.Onsalida()
                      let add = {
                        Estado:true,
                        Tipo:"success",
                        Mensaje:"Nota de Crédito generada exitosamente"
                    }
                    this.setState({Alert: add,  loading:false, })

                    }
                 

                  })

            }                  
 
      }else if(response.status =="error" ){
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:response.resdata.mensajes.mensaje.mensaje
      }
      this.setState({Alert: add, loading:false })
      }
        })
                   

       



 }
      
      
                                    
                                    }else{
                                        let add = {
                                            Estado:true,
                                            Tipo:"error",
                                            Mensaje:"Es necesario validar la factura y firma digital"
                                        }
                                        this.setState({Alert: add, loading:false}) 
                                    }



      }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
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
           
          
          
      
          

         
          this.setState({ArtVent:deepClone})
   
          


      }else if(e.item.Tipo == "Servicio"){
        let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
        let indexset = this.state.ArtVent.indexOf(itemfind[0])
           
    let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
    deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
    deepClone[indexset].PrecioCompraTotal = parseFloat(e.value)
    deepClone[indexset].PrecioVendido=  parseFloat(e.value) / parseFloat(e.cant)
    deepClone[indexset].CantidadCompra = parseFloat(e.cant)
    this.setState({ArtVent:deepClone})
  
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

    setPrecios=(e)=>{
           
      if(parseFloat(e.Valor) >= 0){
      let indexset =  this.state.ArtVent.findIndex(x=>x._id === e.Id)  
      let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
      deepClone[indexset].PrecioCompraTotal = parseFloat(e.Valor)
      deepClone[indexset].PrecioVendido=  parseFloat(e.Valor) / parseFloat(e.CantidadArts)
      this.setState({ArtVent:deepClone})
    }else{
      let add = {
        Estado:true,
        Tipo:"error",
        Mensaje:"El valor no puede ser menor o igual a 0"
    }
    this.setState({Alert: add })
    }

  }
   
      Onsalida=()=>{
        document.getElementById('mainxx').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {
        console.log(this.state)
let artsconIVA = 0
let artssinIVA = 0
let valSinIva = 0
let valConIva = 0
let SuperTotal = 0
let IvaEC = 0

const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


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
        IvaEC = valConIva - (valConIva /  parseFloat(`1.${process.env.IVA_EC }`))
    let  generadorArticulosListaVenta = this.state.ArtVent.map((item, i) => (<ArticuloNota
        key={item._id}
         index={i}
         datos={item} 
         sendTipoPrecio={this.setTipoPrecio}
         sendPrecio={this.setPrecios}
         sendAll={this.SetAll} 
         deleteitem={(e)=>{
            let nuevoarr = this.state.ArtVent.filter(x => x.Eqid != e.Eqid)
           // let nuevosPrecios = this.state.arrPrecios.filter(x => x.Id != item._id) 
        
            this.setState({ArtVent:nuevoarr,  })
           
        }}
   
      
        />))
        return ( 

         <div >

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Generar Nota de Crédito 

</div>



</div> 
<div className="Scrolled">
<ValidatorForm
   
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
       name="usuario"
       type="text"         
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.props.datos.nombreCliente}
       InputProps={{
        readOnly: true,
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
    
       name="correo"
       type="mail"
   
       validators={['requerido']}
       errorMessages={['Escribe un correo'] }
      
       value={this.props.datos.correoCliente}
       InputProps={{
        readOnly: true,
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
      
       name="direccion"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.props.datos.direccionCliente
       }
       InputProps={{
        readOnly: true,
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
      
       name="cedula"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa '] }
       value={this.props.datos.cedulaCliente       }
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>
   <div className="customInput">
   <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
   <select className="ClieniDInput" value={this.state.ClientID}  >
          <option value="Cédula"> Cédula</option>
    <option value="RUC" > RUC </option>
    <option value="Pasaporte" > Pasaporte </option>
         </select>
   
   </div>

      

   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
phone
</span>
</div>
      <TextValidator
      label="Teléfono"
       
       name="telefono"
       type="number"
       validators={[]}
       errorMessages={[]}
       value={this.props.datos.telefonoCliente}
       InputProps={{
        readOnly: true,
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
       name="ciudad"
       type="text"
       validators={[]}
       errorMessages={[] }
       value={this.props.datos.ciudadCliente }
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>

   </div>
  
</ValidatorForm>
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
   <div className={`contTotal `}>
    <p className="totalp">Total:</p>
           <p className="totalp">${SuperTotal.toFixed(2)}</p>
       
         </div>
         <ValidatorForm
   
   onSubmit={()=>this.genNotaCredito(SuperTotal, IvaEC)}
   onError={errors => console.log(errors)}
>
    <div className="ContJustificacion">
                    <TextValidator
      label="Justificacion"
       onChange={this.handleChangeGeneral}
       name="Justificacion"
       type="text"
    value={this.state.Justificacion}
      
       validators={['requerido']}
       errorMessages={['Campo requerido'] }
      
   />
                    </div>
                    
              <div className="contDual">
                        <div className="textoPrint">
                        <i className="material-icons"style={{fontSize:"30px"}}>
                            download
                            </i>
                        <span className="textContimp"> Descargar  </span>
                        </div>
                        <Checkbox
       name="Descargar"
            checked={this.state.descargarNota}
            onChange={this.handleChangeCheckbox}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
                        </div>           
                        <div className="centrar spaceAround contsecuencial"> 
               <span > Secuencial</span>
               <input type="number" name="secuencialGen" className='percentInput' value={this.state.secuencialGen} onChange={this.handleChangeSecuencial }/>
               </div>
              
         <div className="contBotonPago">
               <button className={` btn btn-success botonedit2  `} type='submit'>
<p>Generar</p>
<i className="material-icons">
 assignment
</i>

</button>

<div style={{width:"50%"}}>
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
</div>
               </div>
               </ValidatorForm>
</div>
</div>
        </div>

                   <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
                <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
            
            </Alert>
          </Snackbar>
        <style jsx >{`
           .maincontacto{
            z-index: 1298;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition:0.5s;
            
            }

            .contcontacto{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
                  .contenidoForm {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                      .customInput {
                    display: flex;
                    align-items: center;
                    margin: 5px 10px;
                    justify-content: center;
                    width: 250px;
                }
              .entradaaddc{
                left: 0%;
                }

                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
                  }
                  .tituloventa{
                    display: flex;
                    align-items: center;
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: center;
                    justify-content: center;
                    }
                    .tituloventa p{
                    margin-top:5px;
                    margin-bottom:5px
                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 70vh;
                      padding: 5px;
                     
                     }

                     .contTitulos{
    display:flex;
 
    font-size: 20px;
    font-weight: bolder;
  
  
}
    .contventa{
    margin-top: 50px;
    width: 100%;
    max-width: 920px;
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
    .contsecuencial input{
    border-radius: 26px;
    padding: 7px;
    text-align:center
}

  .percentInput{
                    width: 30%;
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
             .contBotonPago{
                    margin: 20px 0px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
                       .botonedit2{
                    display:flex;
                    padding:5px;
              
                    border-radius: 20px;
                    box-shadow: -2px 3px 3px black;
                    justify-content: space-around;
                    width: 200px;
                }
                    .contTotal{
                    display: flex;
    margin: 12px 26px;
    justify-content: flex-end;
                    }

                .contDual{
                    display: flex;
    margin: 10px 0px;
    border: 1px solid red;
    width: 200px;
    border-radius: 10px;
    justify-content: center;}
                  
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
  
  export default connect(mapStateToProps, null)(Contacto);