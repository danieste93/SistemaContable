import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import postal from 'postal';
import ModalRep from "./modalrepetir"
import CuotaRep from "./modalcuota"
import Cat from "./modalcategorias"
import Calcu from "./modalcalculadora"
import Cuentas from "./modalcuentas"
import Addcuenta from "./modal-addcuenta"
import Addcat from "./modal-addcat"
import Editcuenta from "./modal-editcuenta"
import Edditcat from "./modal-editcat"
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import Router from 'next/router';
import Addtipo from "./modal-addtipo"
import { DateTimePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import "moment/locale/es";
import {logOut} from "../../reduxstore/actions/myact"
import MomentUtils from '@date-io/moment';

import {getcuentas,getcats, updateCuenta,addRegs, getRepeticiones} from "../../reduxstore/actions/regcont"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DropFileInput from "../drop-file-input/DropFileInput"

import CircularProgress from '@material-ui/core/CircularProgress';


class Contacto extends Component {
   
  state={
    Alert:{Estado:false},
    cuentaEnviada:{_id:""},
    Ingreso:false,
    Gasto:false,
    Trans:false,
    Accion:"Sin",
    textorep:" ",
    valdefault:"No",
    cuotamodal:false,
    cuentasmodal:false,
    calcuModal:false,
    Importe:"",
    AddCuenta:false,
    err1:false,
    err2:false,
    err3:false,
    CuentaRender:"",
    CategoriaRender:"",
    subCatSelect:"",
    catSelect:"",
    cuentaSelect:"",
    cuentaSelectT2:"",
    cuentaSelectT1:"",
    EditCuenta:false,
    CuentaEditar:"",
    addmitipo:false,
    categoriaModal:false,
    CuentaCaller:"",
    tiempo:new Date(),
    agregarImagenes:false,
    archivos:[],
    urlImg:[],
    importInput:false,
waiting:false,
waiting2:false,
waitingtrans:false,
waitingtrans2:false,
    CuentaRenderT2:"",
    CuentaRenderT1:"",
    Nota:"",
    Descripcion:"",
    normal:false,
    trans1:false,
    trans2:false,
    normalerr:false,
    trans1err:false,
    trans2err:false,
  
    catError:false,

    loading:false,
  }
 
  channel2 = null;
  channelCroom = null;

  myRef = React.createRef();
  refScroll = React.createRef();
  refScroll2 = React.createRef();

   convertDateToUTC (date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }
    componentDidMount(){
     
      this.channelCroom = postal.channel();
      
      this.channel2 = postal.channel();
   
      

      setTimeout(function(){ 
        
        document.getElementById('maincont1').classList.add("opacityon")

       }, 500);
     
   
   

       
       if(Object.keys(this.props.cuentaToAdd).length != 0){
        if(this.props.cuentaToAdd.cuentaSend.Tipo != "Inventario"){
        
          this.setState({
           cuentaSelect:this.props.cuentaToAdd.cuentaSend,
           cuentaSelectT1:this.props.cuentaToAdd.cuentaSend,
           CuentaRender:this.props.cuentaToAdd.cuentaSend.NombreC,
           CuentaRenderT1:this.props.cuentaToAdd.cuentaSend.NombreC,
           normal:true ,
           trans1:true
          })
        }
      
        
       }


       if(!this.props.state.RegContableReducer.Cuentas || !this.props.state.RegContableReducer.Categorias){
      
            this.getCuentasyCats()
      }
      
      }
   
      getCuentasyCats=()=>{

        let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
          Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
      let lol = JSON.stringify(datos)
        let settings = {
          method: 'POST', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }
      
        fetch("/cuentas/getCuentasyCats", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
               })
        .then(response => {  
   
          if(response.status == 'error'){}
        else if(response.status == 'Ok'){
        //  this.props.dispatch(getVentas(response.ventasHabiles));       
        this.props.dispatch(getcats(response.catHabiles)); 
        this.props.dispatch(getcuentas(response.cuentasHabiles)); 
        
        }
      
        })
      }

      getReps=()=>{

        let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
          Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
      let lol = JSON.stringify(datos)
        let settings = {
          method: 'POST', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }
      
        fetch("/cuentas/getallreps", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
               })
        .then(response => {  
    
          if(response.status == 'error'){}
        else if(response.status == 'Ok'){
        //  this.props.dispatch(getVentas(response.ventasHabiles));       
        this.props.dispatch(getRepeticiones(response.repsHabiles)); 
        
        }
      
        })
      }


cuoter=(e)=>{

  
  if(this.state.valdefault === "Cuota"){
    this.setState({   cuotamodal:true})
  } else if(this.state.valdefault === "Repetir"){
    this.setState({   repetirmodal:true})
  }
}
handleimgChange=()=>{

}
onFileChange = (files) => {

  this.setState({archivos:files})
}

   buttons3=(e)=>{
   

    
if(e.target.id ==="b1"){
 
  this.setState({Ingreso:true,
    Gasto:false,
   Trans: false,
   Accion:"Ingreso",
   valdefault: "No",
   textorep:"",
   CategoriaRender:"",
   subCatSelect:"",
   catSelect:""
})

if( document.getElementById('cdc3')){
  document.getElementById('cdc3').classList.remove("cdc3active2")
  document.getElementById('cdc3').classList.remove("cdc3active")
}
}else if(e.target.id ==="b2"){
 
  
  this.setState({Ingreso:false,
                 Accion:"Gasto",
                 Gasto:true,
                Trans: false,
                valdefault: "No",
                textorep:"",
                CategoriaRender:"",
                subCatSelect:"",
                catSelect:""
                
  })
if( document.getElementById('cdc3')){
  document.getElementById('cdc3').classList.remove("cdc3active2")
  document.getElementById('cdc3').classList.remove("cdc3active")
}



}


else if(e.target.id ==="b3"){
  
  this.setState({Ingreso:false,
                 Gasto:false,
                Trans: true,
                Accion:"Trans",
                valdefault: "No",
                textorep:"",
                CategoriaRender:"",
                subCatSelect:"",
                catSelect:"",
                cuentaSelect:"",
                categoriaModal:false,
                cuentasmodal:false,
                CuentaRender:""
  })

 
}




}  
onFlechaRetro=()=>{
  document.getElementById('maincont1').classList.remove("opacityon")
  setTimeout(()=>{ 
    this.props.flechafun()
    
   }, 500);
} 
handlerepChange=(e)=>{
  if(e.target.value== "Repetir"){
    this.setState({repetirmodal:true, valdefault:"Repetir"})
    document.getElementById('cdc3').classList.remove("cdc3active2")
    document.getElementById('cdc3').classList.remove("cdc3active")
  } else   if(e.target.value== "No"){
    this.setState({repetirmodal:false, textorep:"",valdefault:"No"})

      document.getElementById('cdc3').classList.remove("cdc3active")
      document.getElementById('cdc3').classList.remove("cdc3active2")

  }
  else   if(e.target.value== "Cuota"){
    this.setState({cuotamodal:true, textorep:"",valdefault:"Cuota"})
    document.getElementById('cdc3').classList.remove("cdc3active")
  }
}
atributomain=(e)=>{

    this.setState({repetirmodal:false, textorep:e.target.innerText,valdefault:"Repetir"})
  document.getElementById('cdc3').classList.add("cdc3active")

}
envioCuotas=(e)=>{

  
  this.setState({cuotamodal:false, textorep:e.ncuotas, valdefault:"Cuota"})
  document.getElementById('cdc3').classList.remove("cdc3active")
  document.getElementById('cdc3').classList.add("cdc3active2")
}

handleimgChange=(e)=>{

}

openCuentas=()=>{
  if(this.state.cuentasmodal == false){
  this.setState({cuentasmodal:true, CuentaCaller:"inggas",normal:true })
  }else{
    this.setState({cuentasmodal:false, CuentaCaller:"inggas",normal:true })
  }

}
openCuentasT1=()=>{
   if(this.state.cuentasmodal == false){
    this.setState({cuentasmodal:true, CuentaCaller:"trans1",trans1:true})
  }else{
    this.setState({cuentasmodal:false, CuentaCaller:"trans1",trans1:true})
  }
}


openCuentasT2=()=>{
  if(this.state.cuentasmodal == false){
    this.setState({cuentasmodal:true, CuentaCaller:"trans2", trans2:true})
  }else{
    this.setState({cuentasmodal:false, CuentaCaller:"trans2", trans2:true})
  
  }

}


openCategoria=()=>{
 if(this.state.categoriaModal == false){
  this.setState({categoriaModal:true, calcuModal:false})
}else{
  this.setState({categoriaModal:false, calcuModal:false})

}
 



}

sendCat=()=>{
  let Cats = this.props.state.RegContableReducer.Categorias
if(Cats){
  let Catsing = Cats.filter(x => x.tipocat == "Ingreso")
  let Catsgas = Cats.filter(x => x.tipocat == "Gasto")

  

  if(this.state.Ingreso){
    return Catsing
  } 
  else if(this.state.Gasto){
    return Catsgas
  }else return []
}
}



handleChangeGeneral=(e)=>{

this.setState({
[e.target.name]:e.target.value
})
}
handleChangeTiempo=(e)=>{

 this.setState({
   tiempo:e._d
 })


  }



uploadimages=(mival,trans)=>{
const miFormaData = new FormData()
for(let i=0; i<=this.state.archivos.length;i++){
  miFormaData.append("file", this.state.archivos[i])


miFormaData.append("upload_preset","perpeis7")
const options = {
  method: 'POST',
  body: miFormaData,
  // If you add this, upload won't work
  // headers: {
  //   'Content-Type': 'multipart/form-data',
  // }
  };
  
  fetch('https://api.cloudinary.com/v1_1/registrocontabledata/image/upload', options)
  .then((response) => (
   response.json()
   )).then((data)=>{
     if(data.secure_url){
let archivos = this.state.urlImg
let stateactualizado = [...archivos, data.secure_url]
this.setState({urlImg:stateactualizado})
if(stateactualizado.length == this.state.archivos.length){

  if(trans =="Transferencia"){  

this.ingresadorTrans(mival)
  }else if(trans =="inggas"){
  
    this.ingresador(mival)
    } 
}
}
  })
  .catch(error => {
 
    console.log(error)}
  );
}



}

Comprobador=()=>{
  let mival = "Agregador"
  let trans = "inggas"
  this.setState({waiting2:true})
if(this.state.archivos.length > 0){

  this.uploadimages(mival, trans)
 }
 else{

this.ingresador(mival)
 
  }
}
ReiniciarTrans=()=>{
  let mival = "Reiniciar"
  let trans = "Transferencia"
if(this.state.archivos.length > 0){
  this.setState({waitingtrans:true})
   
  this.uploadimages(mival,trans)
    
  
 } else{
 
  this.ingresadorTrans(mival)
  }

}
Reiniciar=()=>{
  let mival = "Reiniciar"
  let trans = "inggas"
if(this.state.archivos.length > 0){
  this.setState({waiting:true})
  
  this.uploadimages(mival,trans)
  
    
  
 } else{
 
  this.ingresador(mival)
  }

}

ingresador=(mival)=>{
  if(this.state.loading == false){
    this.setState({loading:true})
  if(this.state.cuentaSelect == ""){
    this.setState({loading:false,normalerr:true,waiting:false,waiting2:false})
  }
 if(this.state.catSelect == ""){
   
    this.setState({loading:false,waiting:false,waiting2:false,catError:true})
   }  
    if(this.state.Importe == "" ||this.state.Importe < 0){

    this.setState({loading:false,importInput:true,waiting:false,waiting2:false})
   }

   if(this.state.cuentaSelect != "" && this.state.catSelect != "" && this.state.Importe != "" && this.state.Importe > 0 ){
   
               
      let datatosend={
        Accion:this.state.Accion,
        Tiempo:this.state.tiempo.getTime(),
        
        CuentaSelect:this.state.cuentaSelect,
        CatSelect:this.state.catSelect,
        SubCatSelect:this.state.subCatSelect,
        Importe:this.state.Importe,
        Nota:this.state.Nota,
        Descripcion:this.state.Descripcion,
        urlImg:this.state.urlImg,
      Valrep:this.state.textorep,
      TipoRep:this.state.valdefault,
      Usuario : {
        DBname:this.props.state.userReducer.update.usuario.user.DBname,
        Usuario:this.props.state.userReducer.update.usuario.user.Usuario,
       _id:this.props.state.userReducer.update.usuario.user._id,
       Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
      }
      }
           
    
      let lol = JSON.stringify(datatosend)
                
      let url = "/cuentas/addreg"   
    fetch(url, {
    method: 'PUT', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
    }).then(res => res.json()).then(response =>{

      if(  document.getElementById('cdc3')){
        document.getElementById('cdc3').classList.remove("cdc3active")
       }
    
      if(response.message=="error al registrar"){
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:"Error en el sistema, porfavor intente en unos minutos"
      }
      this.setState({Alert: add, loading:false, waiting:false, waiting2:false, waitingtrans:false, waitingtrans2:false}) 
      }
      else if(response.message=="error al decodificar el token"){
        this.props.dispatch(logOut());
        alert("Session expirada, vuelva a iniciar sesion para continuar");
             
        Router.push("/")
      }
      else if(response.message=="Exito registroIngGas individual") {
                 
      
       
        this.props.dispatch(addRegs(response.regCreate)); 
        this.props.dispatch(updateCuenta(response.cuenta)); 
        this.channelCroom.publish('UpdateCount', {
          message: 'enviado desde reset',
          cuenta:response.cuenta
       });
    

      }  else if(response.message=="repeticiones generadas" || response.message=="cuotas generadas" ) {

        this.props.dispatch(addRegs(response.registrosGenerados)); 
        this.getCuentasyCats()
        this.getReps()

      } else if(response.message=="repeticion futura creada"  ) {

        this.getReps()

      }
      if(mival =="Reiniciar"){
        if(  document.getElementById('cdc3').classList.contains("cdc3active")){
          document.getElementById('cdc3').classList.remove("cdc3active")
        }
        if(  document.getElementById('cdc3').classList.contains("cdc3active2")){
          document.getElementById('cdc3').classList.remove("cdc3active2")
        }
    
      this.setState({
        loading:false,
        cuentasmodal:true,
        normal:true,
        CuentaRender:"",
        CategoriaRender:"",
        CuentaCaller:"inggas",
        subCatSelect:"",
        catSelect:"",
        cuentaSelect:"",
        Importe:"",
        valdefault:"No",
        Nota:"",
        Descripcion:"",
        importInput:false,
        archivos:[],
        urlImg:[],
        agregarImagenes:false,
        waiting:false,
        textorep:""
      })
    }else if(mival=="Agregador"){
      this.onFlechaRetro()
    }
      
      
    })
  
   }
  }
}

ingresadorTrans=(mival)=>{
  if(this.state.loading == false){
    this.setState({loading:true})
  if(this.state.cuentaSelectT1 == ""){
    this.setState({trans1err:true, waitingtrans:false, loading:false})

  }
  if(this.state.cuentaSelectT2 == ""){
    this.setState({trans2err:true,waitingtrans:false,loading:false})
   
  }
  if(this.state.Importe == "" ||this.state.Importe <= 0){

    this.setState({importInput:true, waitingtrans:false, loading:false})
   
   }

   if(this.state.cuentaSelectT1 != "" && this.state.cuentaSelectT2 != "" && this.state.Importe > 0 && this.state.Importe != ""){


      let datatosend={
        Accion:this.state.Accion,
        Tiempo:this.state.tiempo.getTime(),
     
        CuentaSelect1:this.state.cuentaSelectT1,
        CuentaSelect2:this.state.cuentaSelectT2,
        Importe:this.state.Importe,
        Nota:this.state.Nota,
        Descripcion:this.state.Descripcion,
        urlImg:this.state.urlImg,
      Valrep:this.state.textorep,
      TipoRep:this.state.valdefault,
      Usuario : {
        DBname:this.props.state.userReducer.update.usuario.user.DBname,
        Usuario:this.props.state.userReducer.update.usuario.user.Usuario,
       _id:this.props.state.userReducer.update.usuario.user._id,
       Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
      }
      }
           
    
      let lol = JSON.stringify(datatosend)
                
      let url = "/cuentas/addreg"   
    fetch(url, {
    method: 'PUT', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
    }).then(res => res.json()).then(response =>{
     
     
     if(response.message=="error al registrar"){
      let add = {
        Estado:true,
        Tipo:"error",
        Mensaje:"Error en el sistema, porfavor intente en unos minutos"
    }
    this.setState({Alert: add, loading:false, waiting:false, waiting2:false, waitingtrans:false, waitingtrans2:false}) 
    } 
   
    else if(response.message=="Transferencia genereda") {
                 
      
      this.props.dispatch(addRegs(response.regCreate));

      this.getCuentasyCats()
                
  

    }else if(response.message=="repeticiones generadas"  || response.message=="cuotas generadas") {

      this.props.dispatch(addRegs(response.registrosGenerados)); 
      this.getCuentasyCats()
      this.getReps()

    }else if(response.message=="repeticion futura creada" ) {


      this.getReps()

    }

    if(mival =="Reiniciar"){
      if(  document.getElementById('cdc3').classList.contains("cdc3active")){
        document.getElementById('cdc3').classList.remove("cdc3active")
      }
      if(  document.getElementById('cdc3').classList.contains("cdc3active2")){
        document.getElementById('cdc3').classList.remove("cdc3active2")
      }
  
    this.setState({
      loading:false,
      cuentasmodal:true,
      normal:true,
      CuentaRender:"",
      CategoriaRender:"",
      CuentaCaller:"inggas",
      subCatSelect:"",
      catSelect:"",
      cuentaSelect:"",
      Importe:"",
      valdefault:"No",
      Nota:"",
      Descripcion:"",
      importInput:false,
      archivos:[],
      urlImg:[],
      agregarImagenes:false,
      waiting:false,
      textorep:""
    })
  }else if(mival=="Agregador"){
    this.onFlechaRetro()
  }


    })
  
 



   }
  }
}


ComprobadorTrans=()=>{
  let mival = "Agregador"
  let trans = "Transferencia"
  this.setState({waitingtrans2:true})
  if(this.state.archivos.length > 0){

    this.uploadimages(mival,trans)
  
   }
   else{

    this.ingresadorTrans(mival)
     
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
    let medioviewport = this.state.calcuModal?"medioviewport":""
    let scolledmodified = this.state.calcuModal?"scolledmodified":""


    let CatActive = this.state.catSelect?"cdc2active2":""

      let Cactive = this.state.normal?"cdc2active2":""
      let Ct1active = this.state.trans1?"cdc2active2":""
      let Ct2active2 = this.state.trans2?"cdc2active2":""
      
      let Cactiveerr = this.state.normalerr?"err":""
      let Ct1activeerr = this.state.trans1err?"err":""
      let Ct2active2err = this.state.trans2err?"err":""
      let CatActiveerr = this.state.catError?"err":""

      let ingresoval = this.state.Ingreso?"bingreso":"";
      let gastoval = this.state.Gasto?"bgasto":"";
      let transval = this.state.Trans?"btrans":"";
   

      let now = new Date()
      let año = now.getFullYear()
      let dia = now.getDate()
      let mes = now.getMonth()
      
      let fecha =  `${dia} / ${mes} / ${año} ` 
      let hora = `${now.getHours()} : ${now.getMinutes()} ` 
      let string = JSON.stringify(fecha).replace(/['"]+/g, '')
      let string2 = JSON.stringify(hora).replace(/['"]+/g, '')

      let enablebuttons = !this.state.Gasto && !this.state.Ingreso && !this.state.Trans?"blockcompoent":"enablecomponents ";

      let userData={_id:''}
    
if(this.props.state.userReducer != ""){
  userData=this.props.state.userReducer.update.usuario.user
}


        return ( 

         <div >

<div ref={this.myRef}   id="maincont1"  className="maincontacto" >
        
      
            <div id="contact1" className={`contcontactoModalIng  ${medioviewport}`}  >
        
                <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.onFlechaRetro}/>
              <div className="tituloventa">
                
            <p > Agregar Registro </p>
           
        </div>
     
        </div>
        <div className="contbotones">
          <button id="b1" className={`botongeneral ${ingresoval} `} onClick={ this.buttons3}>Ingreso</button>
          <button id="b2" className={`botongeneral ${gastoval} `} onClick={ this.buttons3}>Gasto</button>
          <button id="b3" className={`botongeneral ${transval} `}onClick={ this.buttons3}>Trans</button>


        </div>
      <Animate show ={this.state.Gasto || this.state.Ingreso || this.state.Trans }>
<div   className={`contscroled  ${scolledmodified}`} >

        <div className="contDatosC">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Fecha:  </p>
            
              </div>
              <div className="cdc21">
              <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <DateTimePicker
         
   
     
        label=""
        value={this.state.tiempo}
        onChange={this.handleChangeTiempo}
      />
              </MuiPickersUtilsProvider>
               </div>
               <div className="cDc3">

              <div className={`contMainCdc3  ${enablebuttons}`}>

               <Animate show={this.state.Trans==false}>
                 <div className="contCdc3" id="cdc3">
     
                   <div className="agrupador">

              
               <i className="material-icons">  sync_alt</i>
        <select className="rep" value={this.state.valdefault} onChange={this.handlerepChange} >
     

    <option value="No"> No repetir</option>
   
    <option value="Repetir" > Repetir </option>
 
    <option value="Cuota"> Cuota </option>

        </select>
        </div>
            <p style={{cursor:"pointer"}}onClick={this.cuoter}>{this.state.textorep.toLocaleLowerCase()}
            
            {this.state.valdefault==="Cuota"?" cuotas":""}
            </p>
             
               </div>
         
               </Animate>
                        
               <Animate show={this.state.Trans==true}>
                 <div className="contCdc3" id="cdc3">
     
                   <div className="agrupador">

              
               <i className="material-icons">  sync_alt</i>
        <select className="rep" value={this.state.valdefault} onChange={this.handlerepChange} >
     

    <option value="No"> No repetir</option>
   
    <option value="Repetir" > Repetir </option>
 
 

        </select>
        </div>
            <p style={{cursor:"pointer"}}onClick={this.cuoter}>{this.state.textorep.toLocaleLowerCase()}
            
            {this.state.valdefault==="Cuota"?" cuotas":""}
            </p>
             
               </div>
         
               </Animate>
                        
                        
               </div>      
                        
                        
                        
                            </div>

        </div>
       
       <Animate show ={this.state.Gasto || this.state.Ingreso}>
        <div className="ContDatosG">
          <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cuenta  </p>
            
              </div>
              <div id ="cDc2Cuentas"className={`cDc2 ${Cactive} ${Cactiveerr} `} onClick={this.openCuentas}>
              <p>  {this.state.CuentaRender} </p>
            
              </div>
              </div>
              <Animate show={!this.props.state.RegContableReducer.Categorias}>
              <CircularProgress />  
              </Animate>
              <Animate show={this.props.state.RegContableReducer.Categorias}>
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Categoria  </p>            
              </div>
            
       
             
                
              <div  id ="cDc2Categoria" className={`cDc2 ${CatActive} ${CatActiveerr} `} onClick={this.openCategoria}>
              <p>  {this.state.CategoriaRender} </p>
            
              </div>
             
     
              </div>
              </Animate>
              <div className="grupoDatos" ref={this.refScroll} >
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Importe  </p>
            
              </div>
              <span className="cDc2 currencyinput jwPointer">    
                <div className="jwFlex">$ <input type="number"className=" customInput" placeholder='0' name="Importe" value={this.state.Importe} onChange={this.handleChangeGeneral}    onWheel={(e) => e.target.blur()}/>        </div>      
                   <i className="material-icons calcuIcon" 
                   onClick={()=>{this.setState({calcuModal:true})
                   setTimeout(()=>{
                    this.refScroll.current.scrollIntoView({behavior: 'smooth'})
                }, 600);
                  
                   
                   }}>  calculate_icon</i></span>


              </div>
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Nota  </p>
            
              </div>
              <div className="cDc2"    onClick={()=>{this.setState({calcuModal:false})}}  >
              <TextField  fullWidth name="Nota" value={this.state.Nota} onChange={this.handleChangeGeneral} id="standard-basic" label="" />
            
              </div>

              </div>
        </div>
       
       <div className="contDatosC jwffc" >
         <div className="contlinea1">
         <div className="descripcont" onClick={()=>{this.setState({calcuModal:false})}} >
       <TextField value={this.state.Descripcion}  name="Descripcion"  onChange={this.handleChangeGeneral}  fullWidth id="standard-basic" label="Descripción" />
       </div>
       <div className="agrupador agrupper">

              

<i className="material-icons i3D" onClick={()=>{this.setState({agregarImagenes:!this.state.agregarImagenes})}}>  add_photo_alternate</i>

          
</div>
</div>
<Animate show={this.state.agregarImagenes}>
  
<DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />
</Animate>


       </div>
       <div className="jwContCenter">
  <button className="botoncontact" style={{backgroundColor:"red"}}onClick={this.Reiniciar}>
   <Animate show={this.state.waiting}>
   <div className="lds-facebook"><div></div><div></div><div></div></div>
     
   </Animate>
   <Animate show={this.state.waiting == false}>
    Continuar
    </Animate>
    </button>
  <button className="botoncontact" onClick={this.Comprobador}>
  <Animate show={this.state.waiting}>
   <div className="lds-facebook"><div></div><div></div><div></div></div>
     
   </Animate>
   <Animate show={this.state.waiting == false}>
      <Animate show={this.state.waiting2}>
   <div className="lds-facebook"><div></div><div></div><div></div></div>
     
   </Animate>
   <Animate show={this.state.waiting2 == false}>
    Agregar
    </Animate>
    </Animate>
    
   </button>
</div>
       </Animate >


       <Animate show ={this.state.Trans }>
        <div className="ContDatosG">
          <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  De  </p>
            
              </div>
              <div id ="cDc2CuentasTrans"className={` cDc2CuentasTrans cDc2 ${Ct1active } ${Ct1activeerr }  `} onClick={this.openCuentasT1}>
              <p>  {this.state.CuentaRenderT1} </p>
              <i className="material-icons calcuIcon customimport"
              onClick={(e)=>{
              
                e.stopPropagation()
                this.setState({
                  CuentaRenderT1:this.state.CuentaRenderT2,
                  CuentaRenderT2:this.state.CuentaRenderT1,
                  cuentaSelectT1:this.state.cuentaSelectT2,
                  cuentaSelectT2:this.state.cuentaSelectT1,
                })
              }}
              
              >
                import_export
              </i>
              </div>
              </div>
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  A  </p>
            
              </div>
              <div id ="cDc2CuentasTrans2"className={`cDc2 ${Ct2active2}  ${Ct2active2err } `}onClick={this.openCuentasT2}>
              <p>  {this.state.CuentaRenderT2} </p>
            
              </div>

              </div>
              <div className="grupoDatos" ref={this.refScroll2} >
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Importe  </p>
            
              </div>
              <span className="cDc2 currencyinput ">    
                <div className="jwFlex">$ 
                <input type="number" 
                 onWheel={(e) => e.target.blur()} 
                 className=" customInput" placeholder='0' 
                 name="Importe" value={this.state.Importe}
                  onChange={this.handleChangeGeneral} />      
                    </div>      
                   <i className="material-icons calcuIcon" 
                   onClick={()=>{this.setState({calcuModal:true})
                   setTimeout(()=>{
                    this.refScroll2.current.scrollIntoView({behavior: 'smooth'})
                }, 600);
                  
                   
                   }}>  calculate_icon</i></span>

              </div>
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Nota  </p>
            
              </div>
              <div className="cDc2">
              <TextField  fullWidth name="Nota" value={this.state.Nota} onChange={this.handleChangeGeneral} id="standard-basic" label="" />
            
              </div>

              </div>
        </div>
       
         
       <div className="contDatosC jwffc" >
         <div className="contlinea1">
         <div className="descripcont">
       <TextField  name="Descripcion" value={this.state.Descripcion}  onChange={this.handleChangeGeneral}  fullWidth id="standard-basic" label="Descripción" />
       </div>
       <div className="agrupador agrupper">

              

<i className="material-icons i3D" onClick={()=>{this.setState({agregarImagenes:!this.state.agregarImagenes})}}>  add_photo_alternate</i>

          
</div>
</div>
<Animate show={this.state.agregarImagenes}>
  
<DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />
</Animate>

       </div>
       <div className="jwContCenter">
       <button className="botoncontact" style={{backgroundColor:"red"}}onClick={this.ReiniciarTrans}>
   <Animate show={this.state.waitingtrans}>
   <div className="lds-facebook"><div></div><div></div><div></div></div>
     
   </Animate>
   <Animate show={this.state.waitingtrans == false}>
    Continuar
    </Animate>
    </button>
  <button className="botoncontact" onClick={this.ComprobadorTrans}>
    
    
    <Animate show={this.state.waitingtrans2}>
   <div className="lds-facebook"><div></div><div></div><div></div></div>
     
   </Animate>
   <Animate show={this.state.waitingtrans2 == false}>
   Agregar
    </Animate>
    
    
    </button>
</div>

       
       </Animate >

       </div>
       </Animate>
        </div>
        <Animate show={this.state.calcuModal}>
       <Calcu 
            inputNumero={(e)=>{this.setState({Importe:e})}}            
            Flecharetro3={
        ()=>{
          this.setState({calcuModal:false})
             }}
     />
        </Animate >
        <Animate show={this.state.categoriaModal}>
       <Cat
     
       Addcat={()=>{this.setState({Addcat:true})}}

       Categorias = {this.sendCat()}  
      
       editCat={(catae)=>{this.setState({EditCat:true, catEditar:catae})}}
    
       sendCatSelect={(cat)=>{
    this.setState({catSelect:cat, CategoriaRender:cat.nombreCat,categoriaModal:false,})
       } }         

       sendsubCatSelect={(cat)=>{
let nombreto = cat.estado.catSelect.nombreCat + "  //  " + cat.subcat
        this.setState({catSelect:cat.estado.catSelect, subCatSelect:cat.subcat, CategoriaRender:nombreto,categoriaModal:false,})
           } }  

       Flecharetro3={
        ()=>{
          this.setState({categoriaModal:false, CategoriaRender:"",catSelect:"",subCatSelect:""})
              
        }
       } 
      envioCuentas={this.envioCuentas} />
        </Animate >
        </div>

        <Animate show={this.state.repetirmodal}>
       < ModalRep Flecharetro={()=>{this.setState({repetirmodal:false, valdefault:"No"})}} Atributomain={this.atributomain} />
        </Animate >
 
        <Animate show={this.state.cuotamodal}>
       < CuotaRep      Flecharetro2={()=>{
                document.getElementById('cdc3').classList.remove("cdc3active2")
         this.setState({cuotamodal:false, valdefault:"No", textorep:""})}} envioCuotas={this.envioCuotas} />
        </Animate>

        <Animate show={this.state.cuentasmodal}>
       < Cuentas Addcuentas={()=>{this.setState({AddCuenta:true})}} 
       datosUsuario={userData}
       cuentacaller={this.state.CuentaCaller }
       cuentaEnviada={this.state.cuentaEnviada }
       editCuenta={(cuentae)=>{this.setState({EditCuenta:true, CuentaEditar:cuentae})}}
    
       sendCuentaSelect={(cuenta)=>{
    this.setState({cuentaEnviada:cuenta,cuentaSelect:cuenta, CuentaRender:cuenta.NombreC,cuentasmodal:false,})
       } }  
       sendCuentaSelectT1={(cuenta)=>{
        
        this.setState({cuentaEnviada:cuenta,cuentaSelectT1:cuenta, CuentaRenderT1:cuenta.NombreC,cuentasmodal:false,})
           } }  
           sendCuentaSelectT2={(cuenta)=>{
            this.setState({cuentaEnviada:cuenta,cuentaSelectT2:cuenta, CuentaRenderT2:cuenta.NombreC,cuentasmodal:false,})
               } }  
       
       Flecharetro3={
        ()=>{
          if(this.state.CuentaCaller ==="inggas"){
            this.setState({cuentaEnviada:{_id:""},cuentasmodal:false,  CuentaRender:"",cuentaSelect:"", normal:false })
          }else if(this.state.CuentaCaller ==="trans1"){
            this.setState({cuentaEnviada:{_id:""},cuentasmodal:false,  CuentaRenderT1:"",cuentaSelectT1:"",trans1:false})
          }else if(this.state.CuentaCaller ==="trans2"){
            this.setState({cuentaEnviada:{_id:""},cuentasmodal:false, CuentaRenderT2:"",cuentaSelectT2:"",trans2:false})
          }
        }
       } 
      envioCuentas={this.envioCuentas} />
        </Animate >

       

        <Animate show={this.state.AddCuenta}>
       < Addcuenta datosUsuario={userData._id}    Flecharetro4={
         
   ()=>{
    
    this.setState({AddCuenta:false, valdefault:"No"})}
  } 
  agregarTipo={()=>{
 
    this.setState({addmitipo:true})}}
          />
        </Animate >

        <Animate show={this.state.EditCuenta}>
       < Editcuenta
        datosUsuario={userData._id} 
   
          CuentaEditar={this.state.CuentaEditar}
          Flecharetro4={
   
   ()=>{
   
    this.setState({EditCuenta:false, valdefault:"No"})}} 
          />
        </Animate >


        <Animate show={this.state.Addcat}>
        < Addcat 
       AccionSend={{Ingreso:this.state.Ingreso, Gasto:this.state.Gasto}} 
        
        Flecharetro4={
         
         ()=>{
          
          this.setState({Addcat:false})}
        } 
    
                />
        </Animate >
        <Animate show={this.state.EditCat}>
        < Edditcat   Flecharetro4={
              ()=>{
         
          this.setState({EditCat:false})}
        } 
          catToEdit={this.state.catEditar}
                />
        </Animate >


        <Animate show={this.state.addmitipo}>
    
       < Addtipo id="adddtipe"   Flecharetro4={
   
   ()=>{

    this.setState({addmitipo:false, valdefault:"No"})}} 
          /> 
          
        </Animate >
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
           <style jsx>{`
    #video-stream  {
 
     background:#000000f2;
     
        border: 1px solid red;
        width: 98vw;
        height: 100vh;
        position: absolute;
        top: 0px;
        left: 1vw;
        bottom: 0px;
 display:flex;
      }
    
           .contlinea1{
            display: flex;
            width: 100%;
            justify-content: space-around;
           }

.MuiPopover-root{
  z-index: 9999999999;
}

.botoncontact{
      
  height: 100%;
  margin-left: 15px;

  font-size: 2vmax;
  padding: 0 16px;
  border-radius: 10px;
  background-color: #0267ffeb;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  color: white;
  transition: background-color 15ms linear,
  box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 2.25rem;
  font-family: Roboto, sans-serif;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: none;
  width: 60%;
  max-width: 250px;
    box-shadow: -4px 6px 8px #635c5cc4;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
}
           .descripcont{
            width: 70%;
           }

           .calcuIcon{
            font-size: 40px;
            width: 40px;
            display: flex;
            /* justify-content: flex-start; */
            margin: 0;
            max-width: 50px;
           }
           .grupoDatos{
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
           }


.ContDatosG{
  display: flex;
  flex-flow: column;
    width: 100%;
    box-shadow: -1px 8px 14px #000000c4;
    padding: 12px 5px;
    border-radius: 10px;

}

           .blockcompoent{
             display:none
           }

           enablecomponents{
            display:block
           }
           
           .cDc3{
           
            height: 70%;
            width: 35%;
            max-width: 110px;
            text-align: center;
            margin-left:10px;

           }
       
           .agrupador{
            display: flex;
            flex-flow: column;
            /* justify-content: center; */
            align-items: center;
           }
           .contCdc3{
            display: flex;
            justify-content: space-around;
            flex-flow: column;
            align-items: center;
            border-radius: 20px;
            border: none;
            border: 1px solid white;
            transition:1s;
            height: 100%;
            padding:5px
            
           }
           .cdc3active{
            border: 3px outset green;
       
           }
           .cdc3active2{
            border: 3px outset orange;
       
           }

           .cDc3 p{
            font-size: 12px;
            margin: 0;
            color: blue;
            text-decoration: underline;
           }
           .rep{
            width: 100%;
            font-size: 10px;
       cursor:pointer;
            border-radius: 11px;
            border: none;
    background: none;

           }
             .botongeneral{
              border-radius: 10px;
              width: 30%;
              font-weight: bold;
              height: 30px;
              background: white;
              transition: 0.3s ease-out;
             }
           .bingreso{
            border-color: green;
            color: darkgreen;
            height: 50px;
    
            
           }
           .bgasto{
            border-color: red;
            color: darkred;
            height: 50px;
         
            
           }
         
           .btrans{
            border-color: blue;
            color: darkblue;
            height: 50px;
   
            
           }

           .contbotones{
            display: flex;
            justify-content: space-around;
            align-items: center;
           }
           .flecharetro{
            height: 40px;
            width: 40px;
            padding: 5px;
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
   .PFCbuttons{
     margin-top:20px;

    display: flex;
    width: 100%;
    justify-content: space-around;
   }
           .cDc2{
     margin-left:10px;
     width:60%;
     border-bottom: 3px double grey;
    display: flex;
    align-items: flex-end;
    transition: 0.5s;
   }

   
   .cDc2 p{
    margin:0px;

  }
  .err{
    border-bottom: 5px double red;
  }
  .cdc2active2{
    border-bottom: 5px double green;
   }
   .customInput{
    border: 0;

    margin: 0px;
    margin-left:5px;
    width: 78%;
   }
 
   .currencyinput {
    display: flex;
    justify-content: space-between;
    border-bottom: 3px double grey;
}

   .cdc21{
    margin-left: 10px;
    width: 60%;
    display: flex;
    align-items: flex-end;
   }
   .cdc21 p{
 margin:0px;
   }

  .jwFlex{
    display:flex;
    width: 80%;
  }

   .contDatosC{
     display:flex;
     width: 100%;
     justify-content: space-around;
     align-items: center;
     box-shadow: -1px 6px 8px #000000c4;
     padding:20px 5px;
     border-radius: 5px;
     font-size: 15px;
     overflow: hidden;
   }
.cDc1{

  width: 30%;
  display: flex;
  align-items: flex-end;
  
}


.cDc1 p{

margin:0px;
  
}
             

.cdoptions{
  width: 40%;
    word-break: break-all;
    margin-left: 4%;
    margin-right: 4%;
    margin-top: 20px;
    border-bottom: 5px inset #ddba65;
    border-radius: 15px;
}
           .headercontact {

            display:flex;
            justify-content: space-around;

           }

           .lds-facebook {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .lds-facebook div {
            display: inline-block;
            position: absolute;
            left: 8px;
            width: 16px;
            background: #fff;
            animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
          }
          .lds-facebook div:nth-child(1) {
            left: 8px;
            animation-delay: -0.24s;
          }
          .lds-facebook div:nth-child(2) {
            left: 32px;
            animation-delay: -0.12s;
          }
          .lds-facebook div:nth-child(3) {
            left: 56px;
            animation-delay: 0;
          }
          @keyframes lds-facebook {
            0% {
              top: 8px;
              height: 64px;
            }
            50%, 100% {
              top: 24px;
              height: 32px;
            }
          }
          
           .contbotonventa{
             display:flex;
             justify-content:center;
             width:100%;
           }
           .cDc2CuentasTrans{
            position: relative;
    display: flex;
    justify-content: space-between;
           }
           .customimport{
            position: absolute;
            right: 1px;
            top: 5px;
            background: #000000;
            display: flex;
            justify-content: center;
            border-radius: 13px;
            width: 35px;
            border-bottom: 3px solid #1673ff;
            cursor: pointer;
            height: 35px;
            font-size: 33px;
            color: white;
           }

.asesoriaT{
  font-size: 20px;
    text-align: center;
    margin-top: 10px;
    border: 1px inset blue;
    border-radius: 13px;
    margin-bottom: 10px;
}
    
          .contsolicitador{

            display:flex;
            width:100%;
      
            justify-content: space-between;
         text-align: center;
         font-size:20px;
          }
       
          .option img {
    width: 100%;
    max-width: 120px;
}
        
        .maincontacto{
          z-index: 1299;
         width: 100vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left:0px;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition: 0.5s ;
         opacity: 0;
         overflow: scroll;
 
       }

    
       .i3D{
         cursor:pointer;
        font-size: 25px;
        margin-left: 6px;
        border-radius: 50%;
        box-shadow: inset 1px 1px 3px #1673ff;
        padding: 6px;
      }
       .contcontactoModalIng{
        border-radius: 20px;
       
           
         width: 95%;
         background-color: white;

         padding: 20px 10px;
        
         transition: 0.5s ease-out;
         margin-bottom: 30px;
       }
    .contscroled{
      height: 65vh;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 5px;
      padding-bottom: 20px;
      max-height: 450px;
      transition: 1s;
    }
       .opacityon{
        opacity: 1;
       }
       .medioviewport{
   
 
        margin-bottom: 45vh;
  
  
       }
       .contbotones{
        margin: 10px 0px;
       }
     
       .marginador{
         margin: 0px 35px 15px 35px;
         color: black;
         
         display: flex;
         flex-flow: column;
         align-items: center;
   
       }
        
       .agrupper{
        width: 21%;
  flex-flow: row;
  justify-content: space-around;
      }
       .tituloventa{
         display: flex;
         align-items: center;
         font-size: 30px;
         font-weight: bolder;
         text-align: center;
         justify-content: center;
         width: 91%;
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
          
       body {
            height:100%

           }
           .scolledmodified{
            height: 30vh;
           }
           .contform{
            padding-bottom: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
           }

          .contcontactoDirecto{
        
         
            text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
          }
        

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
          }
          .FULL{
               width:60%
             }
             .jwffc{
              flex-flow: column;
            
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
         .contcontactoModalIng{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoModalIng{
       
         width: 70%;
      
      
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

export default connect(mapStateToProps, null)(Contacto);