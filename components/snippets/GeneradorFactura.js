import React from 'react';

import SignerJS from "./signer"
import CryptoJS from "crypto-js";
import factGenerator from "../../public/static/FactTemplate"
import {store} from "../../pages/_app"
import addCero from "../../components/funciones/addcero"


const genFact = async (idVenta, idReg, Fpago, ArtVent, Comprador, secuencialGen, SuperTotal, SubTotal, IvaEC, contP12, TotalDescuento) => {
    const ceroMaker =(val)=>{

        let cantidad = JSON.stringify(val).length
    
        let requerido = 9 - cantidad
    
        let gen = '0'.repeat(requerido)
     
        let added = `${gen}${JSON.stringify(val)}`
    
        return added
    }
    const decryptData = (text) => {
               
        const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
       
        return (data)
      };

    const state = store.getState();
    const genImpuestos=()=>{
        let codigoPorcentajeDeta = 4 // 0:0%  2:12%  3:14%  4:15% 5:5% 10:13% 
        let codigoDeta =2 //IVA:2 ICE:3 IRBPNR:5
        let artImpuestos  = ArtVent.filter(x=>x.Iva)
        let artSinImpuestos = ArtVent.filter(x=>x.Iva == false)
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
                    baseImponibleImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
                    valtotal += (artImpuestos[i].PrecioCompraTotal)
                }
              
            
            let data = `            <totalImpuesto>\n`+
            `                <codigo>${codigoDeta}</codigo>\n`+
            `                <codigoPorcentaje>${codigoPorcentajeDeta}</codigoPorcentaje>\n`+
            `                <baseImponible>${baseImponibleImpuestos.toFixed(2)}</baseImponible>\n`+
            `                <tarifa>${process.env.IVA_EC}</tarifa>\n`+
            `                <valor>${(valtotal - baseImponibleImpuestos.toFixed(2)).toFixed(2)}</valor>\n`+
            `            </totalImpuesto>\n`
         
            dataImpuestos += data
        }

        return dataImpuestos
       
    }   
 const   gendetalles=()=>{   

        let nuevosDetalles = ArtVent.map(item =>{
            let codigoPorcentajeDeta =item.Iva? 4 : 0 // 0:0%  2:12%  3:14%  4:15% 5:5% 10:13% 
            let codigoDeta =2 //IVA:2 ICE:3 IRBPNR:5

          let tarifaDetal =item.Iva? parseFloat(process.env.IVA_EC) : 0
          let baseImponible =  (item.PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`)).toFixed(2)
            let precioTotalSinImpuesto = item.Iva? baseImponible
                                        :   item.PrecioCompraTotal.toFixed(2) 

                
                                   let valor  = item.Iva?  ((item.PrecioCompraTotal) - baseImponible).toFixed(2):0                      
                                        
        let precioUnitarioval =  item.Iva?  parseFloat(`1.${process.env.IVA_EC }`): 1
        let data = `        <detalle>\n`+
        `            <codigoPrincipal>${item.Eqid}</codigoPrincipal>\n`+
`            <codigoAuxiliar>00000${item.Eqid}</codigoAuxiliar>\n`+
`            <descripcion>${item.Titulo}</descripcion>\n`+
`            <cantidad>${item.CantidadCompra}</cantidad>\n`+
`            <precioUnitario>${(precioTotalSinImpuesto / item.CantidadCompra).toFixed(2)}</precioUnitario>\n`+
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
                   let razon = state.userReducer.update.usuario.user.Factura.razon 
                   let nombreComercial = state.userReducer.update.usuario.user.Factura.nombreComercial
                   let ruc = state.userReducer.update.usuario.user.Factura.ruc
                   let codDoc = "01"
                   let estab =state.userReducer.update.usuario.user.Factura.codigoEstab
                   let ptoEmi= state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
                   let secuencial= ceroMaker(secuencialGen)
                   //    let secuencial=  "000000034"
                   let dirMatriz=state.userReducer.update.usuario.user.Factura.dirMatriz    
                   let dirEstablecimiento=state.userReducer.update.usuario.user.Factura.dirEstab
                   let obligadoContabilidad =state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO"
                   let rimpeval = state.userReducer.update.usuario.user.Factura.rimpe?"        <contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>\n":""
                   
                   let tipoIdentificacionComprador = "07" // 04--ruc  05--cedula  06--pasaporte  07-VENTA A CONSUMIDOR FINAL  08--IDENTIFICACION DELEXTERIOR*//
                   let razonSocialComprador ='CONSUMIDOR FINAL'
                   let identificacionComprador ="9999999999999"
                   let direccionComprador = ""
                   if(Comprador.UserSelect){
                       tipoIdentificacionComprador=Comprador.ClientID =="Cedula"?"05":
                                                   Comprador.ClientID == "RUC"?"04":
                                                   Comprador.ClientID =="Pasaporte"?"06":"07"
                   razonSocialComprador = Comprador.usuario
                   identificacionComprador = Comprador.cedula
                   direccionComprador = Comprador.direccion
                   }
                   if(Comprador.UserSelect){
                       tipoIdentificacionComprador=Comprador.ClientID =="Cedula"?"05":
                                                   Comprador.ClientID == "RUC"?"04":
                                                   Comprador.ClientID =="Pasaporte"?"06":"07"
                   razonSocialComprador = Comprador.usuario
                   identificacionComprador = Comprador.cedula
                   direccionComprador = Comprador.direccion
                   }
               
                     let valorIVA = IvaEC.toFixed(2)
                        
                               let artImpuestos  = ArtVent.filter(x=>x.Iva)
                               let artSinImpuestos = ArtVent.filter(x=>x.Iva == false)
                   
                               let totalSinImpuestos = 0
                               let baseImpoConImpuestos = 0
                               let baseImpoSinImpuestos = 0
                               if(artImpuestos.length > 0){
                                   for(let i=0;i<artImpuestos.length;i++){
                                       totalSinImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
                                       baseImpoConImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
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
                               let ambiente = "2"
                   
                               let s1 = state.userReducer.update.usuario.user.Factura.codigoEstab
                               let s2 = state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
                               let serie = s1+""+s2
                               let codNum ="12345678"//8 digitos
                               let tiempo = new Date()    
                               let mes = addCero(tiempo.getMonth()+1)
                               let dia = addCero(tiempo.getDate())
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
                                genImpuestos()+
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
                            gendetalles()+
                                `    </detalles>\n`+
                    
                                "</factura>"
                               
                          
                        
                             let link = document.createElement('a');
                     
                            

    try {
      
        let docFirmado = SignerJS(xmlgenerator, 
            contP12, 
           decryptData( state.userReducer.update.usuario.user.Firmdata.pass))
           if (docFirmado.status == "Error") {
            throw new Error(`Firma electrónica fallida: ${docFirmado.message}`);
        }      else{
     
            let accumText = ""
            let mimapper =  Fpago.map(x=> accumText.concat(x.Detalles))
       
    /*
    const url = window.URL.createObjectURL(
        new Blob([docFirmado], { type: "text/plain"}),
      );
    link.href = url;
    link.setAttribute(
      'download',
      `Consultores Asociados 001-001-100.xml`,
    );
    
     link.click()
     
     */
             
    
            
       
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
           Doctype: "Factura",
            UserId: Comprador.id,
    
            razon:state.userReducer.update.usuario.user.Factura.razon ,
            ruc:state.userReducer.update.usuario.user.Factura.ruc,
            estab:state.userReducer.update.usuario.user.Factura.codigoEstab,
            ptoEmi:state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
            secuencial:ceroMaker(secuencialGen),
            obligadoContabilidad :state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
            rimpeval : state.userReducer.update.usuario.user.Factura.rimpe?true:false,
            razonSocialComprador:Comprador.UserSelect?Comprador.usuario:'CONSUMIDOR FINAL',
            ciudadComprador:Comprador.UserSelect?Comprador.ciudad:'',
            correoComprador:Comprador.UserSelect?Comprador.correo:'',
            identificacionComprador:Comprador.UserSelect?Comprador.cedula:'9999999999999',
            direccionComprador:Comprador.UserSelect?Comprador.direccion:'',
            ArticulosVendidos:ArtVent,
            LogoEmp : state.userReducer.update.usuario.user.Factura.logoEmp,       
          populares:  state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
             Userdata:{DBname:state.userReducer.update.usuario.user.DBname}, 
             Estado:"AUTORIZADO",
             detalles:mimapper.map((x)=>  x +" ")
         };
        let generatedFact = factGenerator(dataexample2)
    
     // this.setState({html:generatedFact})
    
    let allData ={doc:docFirmado,
              codigo:clavefinal,
              idUser:state.userReducer.update.usuario.user._id,
              ambiente:ambiente==1?"Pruebas":"Produccion"  
                 }
             

                 let uploadedSignedXml = await fetch("/public/uploadSignedXml", {
                    method: "POST",
                    body: JSON.stringify(allData),
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": state.userReducer.update.usuario.token,
                    },
                });
        
                const response = await uploadedSignedXml.json();
                console.log(response)
                if(response.status =="ok" ){
                    if(response.resdata.estado == "AUTORIZADO"){
                        let numeroAuto = response.resdata.numeroAutorizacion
                        let fechaAuto = response.resdata.fechaAutorizacion
                        let accumText = ""
                        let mimapper =  Fpago.map(x=> accumText.concat(x.Detalles))
                       
                        let vendedorCont ={
                            Nombre:state.userReducer.update.usuario.user.Usuario,
                            Id:state.userReducer.update.usuario.user._id,
                            Tipo:state.userReducer.update.usuario.user.Tipo,
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
                         
                            Doctype: "Factura",
                             UserId: Comprador.id,
                             razon:state.userReducer.update.usuario.user.Factura.razon ,
                             ruc:state.userReducer.update.usuario.user.Factura.ruc,
                             estab:state.userReducer.update.usuario.user.Factura.codigoEstab,
                             ptoEmi:state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                             secuencial:ceroMaker(secuencialGen),
                             obligadoContabilidad :state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                             rimpeval : state.userReducer.update.usuario.user.Factura.rimpe?"CONTRIBUYENTE RÉGIMEN RIMPE":"",
                             razonSocialComprador:Comprador.UserSelect?Comprador.usuario:'CONSUMIDOR FINAL',
                             identificacionComprador:Comprador.UserSelect?Comprador.cedula:'9999999999999',
                             direccionComprador:Comprador.UserSelect?Comprador.direccion:'',
                             correoComprador:Comprador.UserSelect?Comprador.correo:'',
                             ciudadComprador:Comprador.UserSelect?Comprador.ciudad:'',
                             ArticulosVendidos:ArtVent,
                             LogoEmp : state.userReducer.update.usuario.user.Factura.logoEmp,       
                             populares:  state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                              Userdata:{DBname:state.userReducer.update.usuario.user.DBname}, 
                              Estado:"AUTORIZADO",
                              detalles:mimapper.map((x)=>  x +" ")
                          };
                        let CompiladoFactdata = {
                                            iDCating:5,
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
                                               UserId: Comprador.id,
                                               UserName:Comprador.usuario,
                                               Correo: Comprador.correo,
                                               Telefono: Comprador.telefono,
                                               Direccion: Comprador.direccion,
                                                Cedula:Comprador.cedula,
                                                Ciudad:Comprador.ciudad,
                                                ArticulosVendidos:ArtVent,
                                                FormasPago:Fpago,
                                                idVenta:idVenta,
                                                idRegistro:idReg,
                                                Tiempo: new Date().getTime(),
                                                Vendedor: vendedorCont,
                                                Userdata:{DBname:state.userReducer.update.usuario.user.DBname} , 
                                                Estado:"AUTORIZADO",
                                                detalles:mimapper.map((x)=>  x +" ")
                                            };
                                            
                        
                 return {
                    PDFdata,
                    CompiladoFactdata,
                    status: "Ok",
                    mensaje: "Factura generada correctamente",
                };
         
         
                    }                  
         
              }else if( response.status =="error" ){
                 
                if(response.resdata.estado == 'EN PROCESO'){
                    let numeroAuto = "00000000000"
                    let fechaAuto = "xx-en-espera--xx"
                    
 
                    let vendedorCont ={
                        Nombre:state.userReducer.update.usuario.user.Usuario,
                        Id:state.userReducer.update.usuario.user._id,
                        Tipo:state.userReducer.update.usuario.user.Tipo,
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
                        Doctype: "Factura",
                         UserId: Comprador.id,
                         razon:state.userReducer.update.usuario.user.Factura.razon ,
                         ruc:state.userReducer.update.usuario.user.Factura.ruc,
                         estab:state.userReducer.update.usuario.user.Factura.codigoEstab,
                         ptoEmi:state.userReducer.update.usuario.user.Factura.codigoPuntoEmision,
                         secuencial:this.ceroMaker(secuencialGen),
                         obligadoContabilidad :state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO",
                         rimpeval : state.userReducer.update.usuario.user.Factura.rimpe?"CONTRIBUYENTE RÉGIMEN RIMPE":"",
                         razonSocialComprador:Comprador.UserSelect?Comprador.usuario:'CONSUMIDOR FINAL',
                         identificacionComprador:Comprador.UserSelect?Comprador.cedula:'9999999999999',
                         direccionComprador:Comprador.UserSelect?Comprador.direccion:'',
                         correoComprador:Comprador.UserSelect?Comprador.correo:'',
 
                         ArticulosVendidos:ArtVent,
                         populares:  state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,            
                                                     correoComprador:Comprador.UserSelect?Comprador.correo:'',
                          Userdata:{DBname:state.userReducer.update.usuario.user.DBname} , 
                          Estado:"EN PROCESO",
                          detalles:mimapper.map((x)=>  x +" ")
                                      };
                    var CompiladoFactdataProceso = {
                                 
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
                                           UserId: Comprador.id,
                                           UserName:Comprador.usuario,
                                           Correo: Comprador.correo,
                                           Telefono: Comprador.telefono,
                                           Direccion: Comprador.direccion,
                                            Cedula:Comprador.cedula,
                                            Ciudad:Comprador.ciudad,
                                            ArticulosVendidos:ArtVent,
                                            FormasPago:Fpago,
                                            idVenta:idVenta,
                                            idRegistro:idReg,
                                            Tiempo: new Date().getTime(),
                                            Vendedor: vendedorCont,
                                            Estado:"EN PROCESO",
                                            detalles:mimapper.map((x)=>  x +" "),
                                            Userdata:{DBname:state.userReducer.update.usuario.user.DBname}  
                                     };

                                     return {
                                        PDFdata:PDFproceso,
                                        CompiladoFactdata:CompiladoFactdataProceso,
                                        status: "Ok",
                                        mensaje: "Factura en Proceso, validar despues en listado de ventas",
                                    };
                 
                }
                else {
                 let data = {
              
                Mensaje:`Error en la factura, ${response.resdata.mensajes.mensaje.mensaje},  ${response.resdata.mensajes.mensaje.informacionAdicional} `
            }
         
            throw new Error(` ${data.Mensaje}`);
       
             
              }
            }
            else if(response.status =="fatalerror" ){
                    
                let data = {
                        
                           Mensaje:"Error el los Servidores del SRI, intente en un par de horas."
                       }
                       throw new Error(` ${data.Mensaje}`);
                     
                    
       }

     }

       
    }catch (error) {
        
            return { status: "Error", mensaje: `Error : ${error.message}` };
        
    }
};

export default genFact;