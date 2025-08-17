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
import NotaDebito from "../../public/static/NotaDebitoTemplate"
import {updateVenta, addRegs, updateCuentas} from "../../reduxstore/actions/regcont"
import HelperFormapago from "../reusableComplex/helperSoloPago"
import ModalDetallesAdicionales from "../puntoventacompo/modal-detallesadicionales"



class Contacto extends Component {
   
state={
  ArtVent:this.props.datos.articulosVendidos,
  loading:false,
    adicionalInfo:[],
    showAdicionalInfo:false,
  descargarNota:false,
  ClientID:"",
  secuencialGen:0,
  secuencialBase:0,
  Fpago: [{Cantidad:0}],
  Alert:{Estado:false},
  motivos: [
    { motivo: '', iva: true, valor: "" }
  ],
}
    componentDidMount(){

    
      console.log(this.state)
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);

this.getUserData()
        
      }

      handleChangeCheckbox=()=>{
        this.setState({descargarNota:!this.state.descargarNota})
            }
            handleDeleteMotivo = (index) => {
  const motivos = [...this.state.motivos];
  motivos.splice(index, 1);
  // Siempre debe haber al menos un motivo
  if (motivos.length === 0) {
    motivos.push({ motivo: '', iva: false, valor: '' });
  }
  this.setState({ motivos });
};
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


 genMotivos=()=>{ 

return this.state.motivos.map((item, idx) => {
let baseImponible =  (parseFloat(item.valor) /  parseFloat(`1.${process.env.IVA_EC }`)).toFixed(2)

  return (
  `            <motivo>\n`+
            `                <razon>${item.motivo}</razon>\n`+
            `                <valor>${baseImponible}</valor>\n`+
            `            </motivo>\n`
  );
});

}

 genPagos=()=>{ 

return this.state.Fpago.map((item, idx) => {

  const codigosSRI = {
    "Efectivo": "01",
    "Transferencia": "20",
    "Tarjeta-de-Debito": "16",
    "Tarjeta-de-Credito": "19"
  };
     const tipo = item.Tipo;
    const codigo = codigosSRI[tipo] || "00";

  return (
  `            <pago>\n`+
            `                <formaPago>${codigo}</formaPago>\n`+
            `                <total>${item.Cantidad}</total>\n`+
            `            </pago>\n`
  );
});

}

    genImpuestos=()=>{
      let codigoPorcentajeDeta = ({
    "0": 0,   // IVA 0%
    "12": 2,  // IVA 12%
    "14": 3,  // IVA 14%
    "15": 4,  // IVA 15%
    "5": 5,   // IVA 5%
    "13": 10  // IVA 13%
}[process.env.IVA_EC] ?? null);
        let codigoDeta =2 //IVA:2 ICE:3 IRBPNR:5
        let artImpuestos  = this.state.motivos.filter(x=>x.iva)
        let artSinImpuestos = this.state.motivos.filter(x=>x.iva == false)
        let dataImpuestos = ""
      
        if(artSinImpuestos.length > 0){
            let baseImponibleSinImpuestos = 0
            let valtotal = 0
            for(let i=0;i<artSinImpuestos.length;i++){
                baseImponibleSinImpuestos += parseFloat(artSinImpuestos[i].valor)
            }
            let data = `            <impuesto>\n`+
            `                <codigo>${2}</codigo>\n`+
            `                <codigoPorcentaje>${0}</codigoPorcentaje>\n`+
             `                <tarifa>${0.00}</tarifa>\n`+
            `                <baseImponible>${baseImponibleSinImpuestos.toFixed(2)}</baseImponible>\n`+
            `                <valor>${0.00}</valor>\n`+
            `            </impuesto>\n`
            dataImpuestos += data
        }

            
        if(artImpuestos.length > 0){
           
         let baseImponibleImpuestos = 0
         let valtotal = 0
                for(let i=0;i<artImpuestos.length;i++){
                    baseImponibleImpuestos += (parseFloat(artImpuestos[i].valor) /  parseFloat(`1.${process.env.IVA_EC }`))
                    valtotal += parseFloat(artImpuestos[i].valor)
                }
              
        

            
            let data = `            <impuesto>\n`+
            `                <codigo>${codigoDeta}</codigo>\n`+
            `                <codigoPorcentaje>${codigoPorcentajeDeta}</codigoPorcentaje>\n`+
                        `                <tarifa>${process.env.IVA_EC}</tarifa>\n`+
            `                <baseImponible>${baseImponibleImpuestos.toFixed(2)}</baseImponible>\n`+
            `                <valor>${(valtotal - baseImponibleImpuestos ).toFixed(2)}</valor>\n`+
            `            </impuesto>\n`
         
            dataImpuestos += data
        }

        return dataImpuestos
       
    }  


      genNotaDebito= async(SuperTotal, IvaEC)=>{

        this.setState({loading:true})
        
        let razon = this.props.state.userReducer.update.usuario.user.Factura.razon 
        let nombreComercial = this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
        let ruc = this.props.state.userReducer.update.usuario.user.Factura.ruc
        let codDoc = "05" // 05 nota de debito, 01 factura, 
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
        
        


        let artImpuestos  = this.state.motivos.filter(x=>x.iva)
        let artSinImpuestos = this.state.motivos.filter(x=>x.iva == false)


        let baseImpoConImpuestos = 0
        let baseImpoSinImpuestos = 0
        console.log(artImpuestos)
        if(artImpuestos.length > 0){
            for(let i=0;i<artImpuestos.length;i++){
            
                baseImpoConImpuestos += (parseFloat(artImpuestos[i].valor) /  parseFloat(`1.${process.env.IVA_EC }`))

            
            
            }
            
        }
      
        if(artSinImpuestos.length > 0){
            for(let i=0;i<artSinImpuestos.length;i++){

                baseImpoSinImpuestos += parseFloat(artSinImpuestos[i].valor)
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
     
function genInfoAdicional(campos) {
  let info = '<infoAdicional>\n';

  if (Array.isArray(campos)) {
    campos.forEach(({ clave, valor }) => {
      const claveEscapada = escapeXml(clave);
      const valorEscapado = escapeXml(valor);
      info += `  <campoAdicional nombre="${claveEscapada}">${valorEscapado}</campoAdicional>\n`;
    });
  }

  info += '</infoAdicional>';
  if (campos.length > 0) {
    return info;
  } else {
    return '';
  }
}
function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
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
        `<notaDebito id="comprobante" version="1.0.0">\n` +
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
                         rimpeval +       
        `    </infoTributaria>\n`+
        "    <infoNotaDebito>\n" +
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

        "        <impuestos>\n" +
                 this.genImpuestos()+
        "        </impuestos>\n" +
        `        <valorTotal>${(SuperTotal).toFixed(2)}</valorTotal>\n` +
             "        <pagos>\n" +
   this.genPagos()+
        "        </pagos>\n" +
        "    </infoNotaDebito>\n" +
       "    <motivos>\n" +
        this.genMotivos()+
        "    </motivos>\n" +
         genInfoAdicional(this.state.adicionalInfo)+

    
"</notaDebito>"


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
                  Tiempo:new Date().getTime(),
                   Vendedor: vendedorCont,
                    IDVenta:this.props.datos._id,
                    ClaveAcceso:clavefinal, 
                    numeroAuto,
                     fechaAuto,
                     fechaEmisionDocSustento, 
                     numDocModificado,
                     secuencial,
                       SuperTotal,                                           
                       baseImpoSinImpuestos,
                       baseImpoConImpuestos,
                       IvaEC:IvaEC.toFixed(2),
                       fechaEmision,
                       nombreComercial,
                       dirEstablecimiento,
                         FormasPago:this.state.Fpago,
                         adicionalInfo:this.state.adicionalInfo,
                       Doctype: "Nota-de-Debito",
                      //  UserId: this.state.id,
                        razon ,
                        ruc,
                        estab,
                        ptoEmi,
                        secuencial,
                        obligadoContabilidad,

  rimpeval : this.props.state.userReducer.update.usuario.user.Factura.rimpe?true:false,
                                populares:  this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,  
                         

                       razonSocialComprador,
                        identificacionComprador,
                        direccionComprador,
                        correoComprador,
                        ciudadComprador,
                 motivos:this.state.motivos,
                        LogoEmp : this.props.state.userReducer.update.usuario.user.Factura.logoEmp,       
                         Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                         Estado:"AUTORIZADO",
                      };
         

                  if(this.state.descargarNota){

                    fetch("/public/downloadPDFbyHTML", {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify({
                            Html:NotaDebito(PDFdata)

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
                            `Nota-de-Débito ${secuencial}`,
                          );
                          link.click()
                          
                        
                        }


                      })


                  }

                  fetch('/cuentas/agregarNotaDebito', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                        newdocFirmado,
                        Html:NotaDebito(PDFdata),
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
                       this.props.dispatch(addRegs(response.arrRegsSend));
                       this.props.dispatch(updateCuentas(response.arrCuentas));
                      this.Onsalida()
                      let add = {
                        Estado:true,
                        Tipo:"success",
                        Mensaje:"Nota de Débito generada exitosamente"
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
    

  
  handleIvaSwitch = (index) => {
  const motivos = [...this.state.motivos];
  motivos[index].iva = !motivos[index].iva;
  this.setState({ motivos });
};
handleAddMotivo = () => {
  if (this.state.motivos.length < 6) { // máximo 6 motivos, puedes cambiar el límite
    this.setState({
      motivos: [...this.state.motivos, { motivo: '', iva: false, valor: '' }]
    });
  }
};
handleMotivoChange = (index, field, value) => {
  const motivos = [...this.state.motivos];
  motivos[index][field] = value;
  this.setState({ motivos });
};
   
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


      if(this.state.motivos.length > 0){

        artsconIVA = this.state.motivos.filter(x=>x.iva == true)
         artssinIVA  = this.state.motivos.filter(x=>x.iva == false)

         if(artsconIVA.length > 0){
             artsconIVA.forEach(x=>{
                 valConIva += parseFloat(x.valor)
             })
         } 
         if(artssinIVA.length > 0){
          
             artssinIVA.forEach(x=>{
              
                 valSinIva += parseFloat(x.valor)
             })
         } 
        
        }
        SuperTotal  = valSinIva +  valConIva
        IvaEC = valConIva - (valConIva /  parseFloat(`1.${process.env.IVA_EC }`))

let TotalPago = 0

        if(this.state.Fpago.length > 0){

    for(let i = 0; i<this.state.Fpago.length;i++){
    
         TotalPago += parseFloat(this.state.Fpago[i].Cantidad)
    }
    
}


  const setDisableButton= () => {

     if(SuperTotal > 0 && TotalPago > 0 && SuperTotal === TotalPago ){
        return "enabled"
      }else{
        return "disabled"
      }

    

   }


        
        return ( 

         <div >

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Generar Nota de Débito

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
 <button
        className="btnAddMotivo"
        type="button"
        onClick={this.handleAddMotivo}
        disabled={this.state.motivos.length >= 6}
        title="Agregar otro motivo"
      >
        <span className="material-icons">add</span>
      </button>
<div className=" contTitulos ">
                <div className="Numeral">
                #
                        </div>
                        <div className="titulo2Artic ">
                            Motivo
                        </div>
                        <div className="ArticResPrecio ">
                            IVA
                        </div>
                      
                       
                        <div className="ArticRes">
                            Val
                        </div>
                        <div className="ArticRes ">
                              Acc
                        </div>
                        </div>   
                        
                        
                        {this.state.motivos.map((item, idx) => (
  <div key={idx} className="filaMotivo">
    <div className="Numeral">{idx + 1}</div>
    <div className="titulo2Artic">
      <input
        className="inputMotivoElegante"
        type="text"
        placeholder="Motivo"
        value={item.motivo}
        onChange={e => this.handleMotivoChange(idx, 'motivo', e.target.value)}
      />
    </div>
    <div className="ArticResPrecio">
      <label className="switch">
        <input
          type="checkbox"
          checked={item.iva}
          onChange={() => this.handleIvaSwitch(idx)}
        />
        <span className="slider"></span>
      </label>
    </div>
    <div className="ArticRes">
      <input
        className="inputValorElegante"
        type="number"
        min="0"
        step="0.01"
        placeholder="Valor"
        value={item.valor}
        onChange={e => this.handleMotivoChange(idx, 'valor', e.target.value)}
      />
    </div>
    <div className="ArticRes">
      <button
        className="btnDeleteMotivo"
        type="button"
    onClick={() => this.handleDeleteMotivo(idx)}
        disabled={this.state.motivos.length >= 6}
        title="Agregar otro motivo"
      >
        <span className="material-icons">delete</span>
      </button>
    </div>
  </div>
))}                    
   </div>
   <div className={`contTotal `}>
    <p className="totalp">Total:</p>
           <p className="totalp">${isNaN(SuperTotal) ? 0 : SuperTotal.toFixed(2)}</p>

         </div>

 
<HelperFormapago
valorSugerido={parseFloat(SuperTotal).toFixed(2)}

onChange={(e)=>{this.setState(e)}}

/>

<button className="btnAdicional" onClick={(e) => { e.stopPropagation();
  e.preventDefault();
  this.setState({ showAdicionalInfo: true }) }}>
  <span className="material-icons">add</span>
  Información
</button>

         <ValidatorForm
   
   onSubmit={()=>this.genNotaDebito(SuperTotal, IvaEC)}
   onError={errors => console.log(errors)}
>
   
                    
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
               <button 
               disabled={setDisableButton() === "disabled"}
               className={` btn btn-success botonedit2 ${setDisableButton()} `} type='submit'>
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

               <Animate show={this.state.showAdicionalInfo}>
                                <ModalDetallesAdicionales
                                  onReload={this.state.adicionalInfo}
                                  onCamposChange={(e)=>{
                                
                                    this.setState({adicionalInfo:e})}}
                               
                                   Flecharetro={()=>{this.setState({showAdicionalInfo:false})}}
                                />
        
                            </Animate >      

                   <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
                <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
            
            </Alert>
          </Snackbar>
        <style jsx >{`
           .maincontacto{
            z-index: 1299;
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
             .btnAdicional {
    display: inline-flex;
    align-items: center;
 width: 150px;
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
                  
                   .inputMotivoElegante {
  width: 90%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  font-size: 16px;
  background: #f5faff;
  transition: border 0.2s;
}
.inputMotivoElegante:focus {
  border: 2px solid #1976d2;
  outline: none;
}
.inputValorElegante {
  width: 80px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  font-size: 16px;
  background: #f5faff;
  transition: border 0.2s;
}
.inputValorElegante:focus {
  border: 2px solid #1976d2;
  outline: none;
}
.btnAddMotivo {
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
  .btnDeleteMotivo {
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.btnAddMotivo:disabled {
  background: #b0bec5;
  cursor: not-allowed;
}
.filaMotivo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 22px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.switch input:checked + .slider {
  background-color: #1976d2;
}
.switch input:checked + .slider:before {
  transform: translateX(16px);
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