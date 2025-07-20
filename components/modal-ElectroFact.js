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
import fetchData from './funciones/fetchdata';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import {updateUser,updateUser2} from "../reduxstore/actions/myact"
import Head from 'next/head';
import CryptoJS from "crypto-js";
import SecureFirm from './snippets/getSecureFirm';
import genFact from './snippets/GeneradorFactura';
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
    loading:false,
    logoemp:"",
    urlLogoEmp:this.props.state.userReducer.update.usuario.user.Factura.logoEmp ||"",
  


    ClientID:"",
  secuencialGen:"",
  secuencialBase:"",
   }
   getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
    componentDidMount(){


     
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

      this.getUserData()
      }
      getUserData=async()=>{

        let data = await fetchData(this.props.state.userReducer,
            "/public/getClientData",
            "")
        
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
     

      valAlldata= async()=>{
        console.log(this.state)
        if(this.state.loading == false){
          this.setState({loading:true})
  
          if(this.state.valiteFirma 
            && this.state.ruc !=""
            && this.state.razon.trim() !=""
            && this.state.nombreComercial.trim() !=""
            && this.state.dirMatriz.trim() !=""
            && this.state.dirEstab.trim() !=""
            && this.state.codigoEstab.trim() !=""
            && this.state.codigoPuntoEmision.trim() !=""
          ){
         
            let  bufferfile =""
       try {
      bufferfile = await SecureFirm(this.props.state.userReducer)
        console.log('Bufferfile obtenido:', bufferfile);
      } catch (error) {
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:`Error ${error.message}`
      }
        console.error('Error al obtener bufferfile:', error);
        this.setState({Alert: add, loading:false})
      }
       
        let factGenerated = await genFact(54,54,
        [{Detalles:""} ], //Formasdepago
        [{Iva:true, PrecioCompraTotal:1.15,
          Titulo:"TituloPrueba",
          Eqid:"5454",  CantidadCompra:1
        }],
        {UserSelect:false},
        this.state.secuencialGen,
        1.15, 1, 0.15,
        bufferfile,
        0,//descuento 
        1//ambiente
        )

        console.log(factGenerated)
        if(factGenerated.status =="Ok" ){
          let allData ={
            idUser:this.state.idUser   }
              // Realizamos el fetch
          const response = await fetch("public/updateUser", {
            method: 'POST', // o 'PUT'
            body: JSON.stringify(allData),
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.state.userReducer.update.usuario.token,
            },
          });
       
          const data = await response.json(); 
          console.log(data)
          if(data.status == "ok"){
            const usuario= data.user
            this.props.dispatch(updateUser2({usuario}))
            this.setState({validateFact:true,
              areaValidacion:false
            })
          }else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:`Error actualizando el usuario`
          }
       
          this.setState({Alert: add, 
            loading:false, })

          }

        }else if( factGenerated.status =="Error" ){

          if(factGenerated.resdata){
          if(factGenerated.resdata.estado == 'EN PROCESO'){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:`Servidor del SRI saturado Intente mas tarde`
          }
       
          this.setState({Alert: add,
            uploadedFactData:false,
            readOnly:false,
            areaValidacion:true,  
            loading:false,
          })
          }
        }
        else{
           let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:` ${factGenerated.mensaje} `
          }
   
      this.setState({Alert: add, 
        loading:false, 
        areaValidacion:true,  
        readOnly:false,
        uploadedFactData:false,
      })
       
    }
      } 

      
  
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

    


      Onsalida=()=>{
        document.getElementById('mainElectroFact').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        

      
      uploadFacdata=async (e)=>{
        let newState = {...this.state}
        let DBname = this.props.state.userReducer.update.usuario.user.DBname
        const userFolder = DBname ? `${DBname}/FactData` : "uploads/default";

            if(this.state.logoemp){
        const miFormaData = new FormData()
        miFormaData.append("file", this.state.logoemp)
        miFormaData.append("upload_preset","perpeis7")
        miFormaData.append("folder", userFolder); // Aquí se define la carpeta del usuario
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
      console.log(this.state)

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
    <div className='jwFlex' style={{width:"100%", justifyContent:"space-around"}}>
        <div className="jwminilogoEF">
    <span className="material-icons">
apple
</span>
Logo
</div>
{this.state.urlLogoEmp !="" && <img style={{maxHeight:"100px", maxWidth:"60px",}} src={this.state.urlLogoEmp} />}
</div>
<input type="file"
 className="Logo" name="rimagen" onChange={this.handleChangeLogo}
accept="image/png, image/jpeg" />


 
   
   </div>
   
   </div>

    <Animate show={!this.state.uploadedFactData}>
    <div className='centrar botoncontxD'>
       <button className="botoncontact botoupload rojo" onClick={(e)=>{e.preventDefault()
        e.stopPropagation()
        this.Onsalida()

       } }>
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
                    <Animate show={!this.state.loading}>
                   <div className='centrar jwColumn' >
                    <div className="centrar spaceAround contsecuencial"> 
               <span > Secuencial</span>
               <input type="number" name="secuencialGen" className='percentInput' value={this.state.secuencialGen} onChange={this.handleChangeSecuencial }/>
               </div>

               <button className=" botonValidate verde" onClick={this.valAlldata}>
                     Validar
                    </button>
                    </div>
                    </Animate>
  
                    <Animate show={this.state.loading}>
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
            align-items: center;
    
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
                       .contsecuencial{
  
}
.contsecuencial input{
    border-radius: 26px;
    padding: 7px;
        width: 100px;
    text-align:center;
    margin:10px
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