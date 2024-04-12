import React, { Component } from 'react'
import Forge  from 'node-forge';
import DropFileInput from "./drop-file-input/DropFileInputp12"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {connect} from 'react-redux';
import {Animate} from "react-animate-mount"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import SignerJS from "./snippets/signer"
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import {updateUser2} from "../reduxstore/actions/myact"
import Head from 'next/head';
import CryptoJS from "crypto-js";
class Contacto extends Component {
   state={

    mensajeValidacion:false,
    areaValidacion:false,
    idUser:this.props.state.userReducer.update.usuario.user._id,
    passClient:"",
    readOnly:false,
    Alert:{Estado:false},
    FirmaData:{
      add:true,
      verified:false,
    },
    contP12:"",
    rimpe:this.props.state.userReducer.update.usuario.user.Factura.rimpe || false,
    contabilidad:this.props.state.userReducer.update.usuario.user.Factura.contabilidad || false,
    ruc:this.props.state.userReducer.update.usuario.user.Factura.ruc || "",
    razon:this.props.state.userReducer.update.usuario.user.Factura.razon || "",
    nombreComercial:this.props.state.userReducer.update.usuario.user.Factura.nombreComercial || "",
    dirMatriz:this.props.state.userReducer.update.usuario.user.Factura.dirMatriz || "",
    dirEstab:this.props.state.userReducer.update.usuario.user.Factura.dirEstab || "",
    codigoEstab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab || "",
    codigoPuntoEmision:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision || "",
    contriEspecial:this.props.state.userReducer.update.usuario.user.Factura.contriEspecial || "",
    retencion:this.props.state.userReducer.update.usuario.user.Factura.retencion || "",
  
    valiteFirma:this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma || false,
    validateFact:this.props.state.userReducer.update.usuario.user.Factura.validateFact || false,
    populares: this.props.state.userReducer.update.usuario.user.Factura.populares == "true"?true:false,
    uploadedFactData:false,
    loadingVal:false,
    logoemp:"",
    urlLogoEmp:this.props.state.userReducer.update.usuario.user.Factura.logoEmp ||"",
   }
   getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
    componentDidMount(){

console.log(this.state)
     
      setTimeout(function(){ 
        
        document.getElementById('mainElectroFact').classList.add("entradaaddc")

       }, 500);
        
       ValidatorForm.addValidationRule('requerido', (value) => {
        if (value === "" || value === " ") {
            return false;
        }
        return true;
    });

    
  
      if(this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){
      
        this.setState({FirmaData:{add:false, verified:true}})
      }
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

      valAlldata=()=>{
        console.log(this.state)
        if(this.state.loadingVal == false){
          this.setState({loadingVal:true})
  
        if(this.state.valiteFirma 
          && this.state.ruc !=""
          && this.state.razon.trim() !=""
          && this.state.nombreComercial.trim() !=""
          && this.state.dirMatriz.trim() !=""
          && this.state.dirEstab.trim() !=""
          && this.state.codigoEstab.trim() !=""
          && this.state.codigoPuntoEmision.trim() !=""
        
        ){
         
       
          let urlf = this.props.state.userReducer.update.usuario.user.Firmdata.url
     let GeneratedURL = this.getSignature(urlf, 
            process.env.REACT_CLOUDY_SECRET, 
            this.props.state.userReducer.update.usuario.user.Firmdata.publicId)
         
       
  
         
            fetch(GeneratedURL, {
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
       
   
       this.genfact(1.15, 1, 0.15,bufferfile )
      
        });

  });
  
        }
        else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Contraseña incorrecta"
        }
     
        this.setState({Alert: add})
        }
      }else{
        let add = {
          Estado:true,
          Tipo:"info",
          Mensaje:"Cargando, espere"
      }
   
      this.setState({Alert: add})
      }

      }
      ceroMaker=(val)=>{

        let cantidad = JSON.stringify(val).length
      
        let requerido = 9 - cantidad
      
        let gen = '0'.repeat(requerido)
     
        let added = `${gen}${JSON.stringify(val)}`
    
        return added
    }
    
    handleChangeLogo= (event) => {
      if(event.target.files[0]){
        this.setState({logoemp:event.target.files[0]})
      }

    }
    decryptData = (text) => {
      const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     
      return (data)
    };

      genfact = (SuperTotal, SubTotal, IvaEC, contP12 ) => {
     
        let razon = this.state.razon
        let nombreComercial = this.state.nombreComercial
        let ruc = this.state.ruc
        let codDoc = "01"
        let estab =this.state.codigoEstab
        let ptoEmi= this.state.codigoPuntoEmision
        let secuencial= this.ceroMaker(this.getRandomInt(999))
        let dirMatriz=this.state.dirMatriz     
        let dirEstablecimiento=this.state.dirEstab
        let obligadoContabilidad =this.state.contabilidad?"SI":"NO"
        let tipoIdentificacionComprador = "07" // 04--ruc  05--cedula  06--pasaporte  07-VENTA A CONSUMIDOR FINAL  08--IDENTIFICACION DELEXTERIOR*//
        let razonSocialComprador ='CONSUMIDOR FINAL'
        let identificacionComprador ="9999999999999"
        let direccionComprador = "alamos y aripos"
        let totalSinImpuestos = SubTotal.toFixed(2)
        let totalDescuento ="0.00"
        let codigo ="2" //IVA:2 ICE:3 IRBPNR:5
        let codigoPorcentaje =4  // 0:0%  2:12%  3:14%  4:15% 5:5% 10:13% 

        let baseImponible =  SubTotal.toFixed(2)
        let valorIVA = IvaEC.toFixed(2)
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
        let tarifa = "15.00"
        if(this.state.populares){

          codigoPorcentaje =0 
          valorIVA = 0
          tarifa = "0.00"
        }

        
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
       // `        <contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>\n`+
        `    </infoTributaria>\n`+
        `    <infoFactura>\n`+
        `        <fechaEmision>${fechaEmision}</fechaEmision>\n`+
        `        <dirEstablecimiento>${dirEstablecimiento}</dirEstablecimiento>\n`+
        `        <obligadoContabilidad>${obligadoContabilidad}</obligadoContabilidad>\n`+
        `        <tipoIdentificacionComprador>${tipoIdentificacionComprador}</tipoIdentificacionComprador>\n`+
        `        <razonSocialComprador>${razonSocialComprador}</razonSocialComprador>\n`+
        `        <identificacionComprador>${identificacionComprador}</identificacionComprador>\n`+
    //  `<direccionComprador>${direccionComprador}</direccionComprador>`+
        `        <totalSinImpuestos>${totalSinImpuestos}</totalSinImpuestos>\n`+
        `        <totalDescuento>${totalDescuento}</totalDescuento>\n`+
        `        <totalConImpuestos>\n`+
        `            <totalImpuesto>\n`+
        `                <codigo>${codigo}</codigo>\n`+
        `                <codigoPorcentaje>${codigoPorcentaje}</codigoPorcentaje>\n`+
        `                <baseImponible>${baseImponible}</baseImponible>\n`+
        `                <tarifa>${tarifa}</tarifa>\n`+
        `                <valor>${valorIVA}</valor>\n`+
        `            </totalImpuesto>\n`+
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
        `        <detalle>\n`+
        `            <codigoPrincipal>1020</codigoPrincipal>\n`+
        `            <codigoAuxiliar>000001020</codigoAuxiliar>\n`+
        `            <descripcion>TIJERAS</descripcion>\n`+
        `            <cantidad>1</cantidad>\n`+
        `            <precioUnitario>1</precioUnitario>\n`+
        `            <descuento>0</descuento>\n`+
        `            <precioTotalSinImpuesto>1.00</precioTotalSinImpuesto>\n`+
        `            <impuestos>\n`+
        `                <impuesto>\n`+
        `                    <codigo>${codigo}</codigo>\n`+
        `                    <codigoPorcentaje>${codigoPorcentaje}</codigoPorcentaje>\n`+
        `                    <tarifa>${tarifa}</tarifa>\n`+
        `                    <baseImponible>${baseImponible}</baseImponible>\n`+
        `                    <valor>${valorIVA}</valor>\n`+
        `                </impuesto>\n`+
        `            </impuestos>\n`+
        "        </detalle>\n"+
        `    </detalles>\n`+
        "</factura>"
       

     let link = document.createElement('a');
     let docFirmado = SignerJS(xmlgenerator, 
      contP12, 
     this.decryptData( this.props.state.userReducer.update.usuario.user.Firmdata.pass))


     const url = window.URL.createObjectURL(
         new Blob([docFirmado]),
       );
     link.href = url;
     link.setAttribute(
       'download',
       `result.xml`,
     );

  
     let allData ={doc:docFirmado,
      codigo:clavefinal,
      idUser:this.state.idUser,
      ambiente:"Pruebas" 
         
    }
 
     fetch("/public/uploadSignedXmlTest", {
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

   
          if(response.status =="ok" ){

            const usuario= response.user
         this.props.dispatch(updateUser2({usuario}))
            this.setState({validateFact:true,
              areaValidacion:false
            })




          }else if( response.status =="error" ){


            if(response.resdata.estado == 'EN PROCESO'){
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:`Servidor del SRI saturado Intente mas tarde`
            }
         
            this.setState({Alert: add,
              uploadedFactData:false,
              readOnly:false,
              areaValidacion:true,  
              loadingVal:false,
            })
            }
            else {
             let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:`Error en la factura, ${response.resdata.mensajes.mensaje.mensaje}, ${response.resdata.mensajes.mensaje.informacionAdicional}, Codigo de Error: ${response.resdata.mensajes.mensaje.identificador} `
        }
     
        this.setState({Alert: add, 
          loadingVal:false, 
          areaValidacion:true,  
          readOnly:false,
          uploadedFactData:false,
        })
         
          }
        }
 });

  

       }


      Onsalida=()=>{
        document.getElementById('mainElectroFact').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        

      
      uploadFacdata=async (e)=>{
        let newState = {...this.state}
   
            if(this.state.logoemp){
        const miFormaData = new FormData()
        miFormaData.append("file", this.state.logoemp)
        miFormaData.append("upload_preset","perpeis7")
        const options = {
          method: 'POST',
          body: miFormaData,        
          };
          let resdata = await fetch('https://api.cloudinary.com/v1_1/registrocontabledata/image/upload', options)
          let resjson = await resdata.json()
          newState.urlLogoEmp = resjson.secure_url
         
            }
            
          

             fetch("/public/upload-factdata", {
              method: 'POST', // or 'PUT'
              body: JSON.stringify(newState), // data can be `string` or {object}!
              headers:{
                'Content-Type': 'application/json',
                "x-access-token": this.props.state.userReducer.update.usuario.token
              }
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response =>{
              console.log('Success updateFact:', response)
              const usuario= response.user
             
              this.props.dispatch(updateUser2({usuario}))
              this.setState({uploadedFactData:true,
                validateFact:false,
                readOnly:true,
                areaValidacion:true  })
            })


     
      }
        
      valFirma=(e)=>{
        
        if(this.state.passClient != "" && this.state.contP12 != ""  ){
          let arrayUint8 = new Uint8Array(this.state.contP12);
      let p12B64 = Forge.util.binary.base64.encode(arrayUint8);
      let p12Der = Forge.util.decode64(p12B64);
      let p12Asn1 = Forge.asn1.fromDer(p12Der);
      try {
        let p12 = Forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.state.passClient);
      const formDatax = new FormData();
 
    
        const dataEncripted = CryptoJS.AES.encrypt(
          JSON.stringify(this.state.passClient),
          process.env.REACT_CLOUDY_SECRET
        ).toString();
    
 
     formDatax.append("img", this.state.fileupload);
        formDatax.append("idUser",this.state.idUser);
        formDatax.append("pass", dataEncripted);

         axios({
          method: 'post',
          url: '/public/generatesignaturecloudi',   //addyoururl
          data: formDatax,
         headers: {'Content-Type': 'multipart/form-data' }
          })
          .then( (response)=>  {
         
            const usuario= response.data.user                      
            this.props.dispatch(updateUser2({usuario}))
            let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Archivo Corecto"
          }       
        
            this.setState({
              FirmaData:{add:false, verified:true},
              contP12:"",
              fileupload:"",
              Alert: add

            })
          })
          .catch( (err)=> {
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:`Error al subir el archivo p12, ${err}`
          }
       
          this.setState({Alert: add})
          });

          


      }catch (e) {
        console.log('Error',e)
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Contraseña incorrecta"
      }
   
      this.setState({Alert: add})
        }
        }else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Ingrese el archivo con su contraseña"
        }
     
        this.setState({Alert: add})
        }
    
      }

      componentDidCatch(error, errorInfo) {
        //log the error to an error reporting service
        errorService.log({ error, errorInfo });
      }
      handleChangeSwitch=(e)=>{    
        let switchmame = e.target.name                    
         this.setState({[switchmame]:!this.state[switchmame]})
          
   }
     handleChangeGeneral=(e)=>{

      this.setState({
      [e.target.name]:e.target.value
      })
      }
      
    
      cargarContenidoP12=(evt)=>{
     
        let file = evt[0]
        if(evt[0].type ==  "application/x-pkcs12"){
       let reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.addEventListener("loadend", (event) => {
          
            this.setState({contP12:event.target.result, fileupload:file})
      
        });
        
        //reader.readAsDataURL(file);
       ;
      }else{
    
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Solo acepta archivos .p12"
      }
   
      this.setState({Alert: add})
      }
    }

    render () {

const handleClose = (event, reason) => {
  let AleEstado = this.state.Alert
  AleEstado.Estado = false
  this.setState({Alert:AleEstado})
 
}
const Alert=(props)=> {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
        return ( 

         <div>
    <Head>
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      </Head>
<div className="maincontacto" id="mainElectroFact" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
              <label className="tituloArt">Facturación Electrónica</label>  
           
           
        </div>
        <div className="FirmaCont">
        <label className="subtituloArt">Firma Digital</label>  
          <Animate show={this.state.FirmaData.add}>
     
      <DropFileInput
                      onFileChange={(files) => this.cargarContenidoP12(files)}
                  />
      <div className="myinput">
              <div className="contClave">
                        <span className="material-icons" style={{fontSize:"30px"}}>
                        vpn_key
                        </span>
                        <div className="textoin">
                  Contraseña
                 </div>
                 </div>
                
                 <input type="password"className='passClient'  name="passClient" onChange={this.handleChangeGeneral } value={this.state.passClient} />
                 <div className="contBoton">
             
          <button className="botoncontact botoupload" onClick={this.valFirma}>
                     Validar
                    </button>  
                 
                   
                    </div> 
      </div>
      </Animate>
      <Animate show={this.state.FirmaData.verified}>
     
     <div className='contVerified'>
      <img src='./static/vistillo.png' style={{height:"50px", weight:"50px"}} />
      <span>  Verificada</span>
     </div>
     <div className='centrar'>
      <button  className="btn btn-primary mybtnef " onClick={()=>{
          let firmd2 = {...this.state.FirmaData}
          firmd2.add = true 
          firmd2.verified = false
          this.setState({FirmaData:firmd2})
        
 }}><span className="material-icons">
edit
</span></button>
</div>
      </Animate>
      </div>
       
      
              
        
        </div>
        
     <div className='datosGenerales'
>
<ValidatorForm
   
   onSubmit={this.uploadFacdata}
   onError={errors => console.log(errors)}
>
<div className="contValores"> 

   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
business
</span>
</div>
      <TextValidator
      label="RUC"
       onChange={this.handleChangeGeneral}
       name="ruc"
       type="number"
       validators={ ["requerido"]}  
       errorMessages={["Campo requerido"]}
       value={this.state.ruc}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
account_box
</span>
</div>
      <TextValidator
      label="Razon Social"
       onChange={this.handleChangeGeneral}
       name="razon"
       type="text"
       validators={["requerido"]}
       errorMessages={["Campo requerido"]}
       value={this.state.razon}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
store_front
</span>
</div>
      <TextValidator
      label="Nombre Comercial"
       onChange={this.handleChangeGeneral}
       name="nombreComercial"
       type="text"
       validators={["requerido"]}
       errorMessages={["Campo requerido"]}
       value={this.state.nombreComercial}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
room
</span>
</div>
      <TextValidator
      label="Dirección Matriz"
       onChange={this.handleChangeGeneral}
       name="dirMatriz"
       type="text"
       validators={["requerido"]}
       errorMessages={["Campo requerido"]}
       value={this.state.dirMatriz}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
person_pin_circle
</span>
</div>
      <TextValidator
      label="Dirección Establecimiento "
       onChange={this.handleChangeGeneral}
       name="dirEstab"
       type="text"
       validators={["requerido"]}
       errorMessages={["Campo requerido"]}
       value={this.state.dirEstab}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
dialpad
</span>
</div>
      <TextValidator
      label="Código Establecimiento / Ej 001"
       onChange={this.handleChangeGeneral}
       name="codigoEstab"
       type="number"
       validators={["requerido"]}
       errorMessages={["Campo requerido"]}
       value={this.state.codigoEstab}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
    dialpad
</span>
</div>
      <TextValidator
      label="Código del Punto de Emisión / Ej 001"
       onChange={this.handleChangeGeneral}
       name="codigoPuntoEmision"
       type="number"
       validators={["requerido"]}
       errorMessages={["Campo requerido"]}
       value={this.state.codigoPuntoEmision}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
gavel
</span>
</div>
      <TextValidator
      label="Contribuyente Especial Nº Resolución"
       onChange={this.handleChangeGeneral}
       name="contriEspecial"
       type="number"
       validators={[]}
       errorMessages={[]}
       value={this.state.contriEspecial}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
supervised_user_circle
</span>
</div>
<FormControlLabel
        control={
          <Switch
          id={""}
          onChange={this.handleChangeSwitch}
            name="contabilidad"
            color="primary"
            checked={this.state.contabilidad}
          />
        }
        label="Obligado a llevar contabilidad"
      />
 
   
   </div>
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
storage
</span>
</div>
<FormControlLabel
        control={
          <Switch
          id={""}
          onChange={this.handleChangeSwitch}
            name="rimpe"
            color="primary"
            checked={this.state.rimpe}
          />
        }
        label="Contribuyente RIMPE"
      />
 
   
   </div>
 
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
people_alt
</span>
</div>
<FormControlLabel
        control={
          <Switch
          id={""}
          onChange={this.handleChangeSwitch}
            name="populares"
            color="primary"
            checked={this.state.populares}
          />
        }
        label="Negocios populares"
      />
 
   
   </div>
 
   <div className="customInputEF">
        <div className="jwminilogoEF">
    <span className="material-icons">
perm_contact_calendar
</span>
</div>
      <TextValidator
      label="Agente de Retención Nº Resolución"
       onChange={this.handleChangeGeneral}
       name="retencion"
       type="number"
       validators={[]}
       errorMessages={[]}
       value={this.state.retencion}
       InputProps={{
        readOnly: this.state.readOnly,
      }}
   />
 
   
   </div>
   <div className="customInputEF contLogo" >
        <div className="jwminilogoEF">
    <span className="material-icons">
apple
</span>
Logo
</div>
<input type="file"
 className="Logo" name="rimagen" onChange={this.handleChangeLogo}
accept="image/png, image/jpeg" />


 
   
   </div>
   
   </div>

    <Animate show={!this.state.uploadedFactData}>
    <div className='centrar botoncontxD'>
       <button className="botoncontact botoupload rojo" onClick={this.Onsalida }>
                     Cancelar
                    </button> 
                    <button  className="botoncontact botoupload azul"  type="submit">
                     Actualizar
                    </button>  
                    </div>
                     </Animate>

                     <Animate show={this.state.uploadedFactData}>
                      <p className='subtituloArt'>Datos actualizados, continue con la validación </p>
                     </Animate>

   </ValidatorForm>
  <div className='centrar'>
<div className='validatorCont '>
  <Animate show={this.state.validateFact}>
  <div className='centrar column validCont'>
    <div className='ContDatosValidos'>
    <span className="material-icons">
ok
</span>
      <span className='subtituloArt'> Factura Autorizada por el SRI</span>
  
                    </div>
                  
                    <button className=" botoncontact botoupload azul" onClick={this.Onsalida}>
                    Continuar
                    </button>



                    </div>
  </Animate>
  <Animate show={this.state.mensajeValidacion}>
      Esta configuracion ya ha sido aceptada por el SRI
  </Animate>
  <Animate show={this.state.areaValidacion}>
    <div className='centrar column novalidCont'>
    <div className='ContDatosInvalidos'>
    <span className="material-icons">
    warning
    </span>
<span className='subtituloArt'> Datos no validados</span>
  
                    </div>
                    <Animate show={!this.state.loadingVal}>
                    <button className=" botonValidate verde" onClick={this.valAlldata}>
                     Validar
                    </button>
                    </Animate>
  
                    <Animate show={this.state.loadingVal}>
                    <CircularProgress />
                    </Animate>



                    </div>
</Animate>


</div>
</div>
  </div>  
        </div>
        </div>

        <Snackbar open={this.state.Alert.Estado} autoHideDuration={20000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>


  
           <style >{`


          .rojo{
            background:red;
          }
          .verde{
            background:green;
          }
          .rojo{
            background:red;
          }

             .botoncontxD{
              justify-content: space-around;
              flex-wrap: wrap;
              margin: 20px 0px;
             }
          .contClave{
            display: flex;
    align-items: center;
          }
      
 .myinput{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
 }
     
  
           .headercontact {
            display:flex;
            justify-content: space-around;
            flex-wrap: wrap;
           }
.jwminilogoEF span{
  
  font-size: 35px;
}
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
       .contVerified{
        border: 3px double green;
        padding: 10px;
        border-radius: 19px;
        margin: 10px;
        display: flex;
    justify-content: center;
    align-items: center;
       }
       .contcontacto{
        display: flex;
        border-radius: 30px;
        flex-flow: column;
         width: 90%;
         background-color: whitesmoke;
         height: 95vh;
         overflow-y: scroll;
       }
      
       .contValores{
        display:flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .botoupload {
        text-transform: none;
        padding: 15px;
        border-radius: 50px;
        box-shadow: 6px 1px 9px black;
        border: 1px solid black;
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
       .validatorCont{
        width: 50%;
        min-width: 300px;
        max-width: 600px;
        display: flex;
        justify-content: center;
        margin: 20px 0px;      
        border-radius: 25px;
        flex-flow: column;
       }
       .novalidCont{
        padding: 15px;
        box-shadow: 0px 5px 10px red;
        border-radius: 50px;
       }
       .validCont{
        padding: 15px;
        box-shadow: 0px 5px 10px green;
        border-radius: 50px;
       }
       .botonValidate{
        color: white;
    width: 85px;
    border-radius: 50%;
    padding: 5px;
    font-size: 21px;
    height: 85px;
       }
     .ContDatosInvalidos{
      border: 2px outset red;
      padding: 15px;
      border-radius: 25px;
      margin-bottom: 16px;
      justify-content: center;
      align-items: center;
      text-align: center;
     }
     .ContDatosValidos{
      border: 2px outset green;
      padding: 15px;
      border-radius: 25px;
      margin-bottom: 16px;
      justify-content: center;
      align-items: center;
      text-align: center;
     }
     .contLogo{
      display: flex;
      flex-flow: column;
      height: 100px;
      justify-content: space-around;
     }
       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
       }
          
       .jwminilogoEF{
        width: 20%;
        display: flex;
    
       }
.passClient{
  width: 48%;
    margin: 8px;
    border-radius: 17px;
}

           .FirmaCont{
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            border: 3px outset #58c2ff;
            border-radius: 15px;
            margin: 20px;
            width: 80%;
            padding-bottom: 20px;
            max-width: 400px;
                    background: #d2d2cd59;
           }
           .MuiInputBase-input{
            height: 30px;
           }

      .customInputEF{
        display: flex;
        align-items: center;
        margin: 15px 0px;
        width: 80%;
        justify-content: center;
        max-width: 400px;
     
        border-radius: 19px;
        padding: 5px;
        margin: 15px;
        box-shadow: 0px -8px 12px #0000007a;
      }
      .mybtnef{
        padding: 4px;
        margin: 3px;
        height: 35px;
        max-width: 50px;
       }
     
          .entradaaddc{
            left: 0%;
           }
           .Logo{
            width: 92%;
    margin-top: 7px;
    border-radius: 3px;
    padding: 2px;
           }
           .MuiFormControlLabel-root{
            width: 50%;
           }
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
              
               .marginador{
                margin: 0px 2px 15px 2px;
               }
         .contcontacto{
          width: 95%;
         }
        
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontacto{
       
         width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
           
      
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