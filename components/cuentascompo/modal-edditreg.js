import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import ModalRep from "./modalrepetir"
import CuotaRep from "./modalcuota"
import Cat from "./modalcategorias"
import Cuentas from "./modalcuentas"
import Addcuenta from "../cuentascompo/modal-addcuenta"
import Addcat from "../cuentascompo/modal-addcat"
import Calcu from "./modalcalculadora"
import postal from 'postal';
import Editcuenta from "./modal-editcuenta"
import Edditcat from "./modal-editcat"
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import Addtipo from "./modal-addtipo"
import { DateTimePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import "moment/locale/es";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';

import { updateCuenta, updateReg} from "../../reduxstore/actions/regcont"

import DropFileInput from "../drop-file-input/DropFileInput"

class Contacto extends Component {
   
  state={
    Alert:{Estado:false},
    cuentaEnviada:{_id:""},
    idReg:"",
    idMongo:"",
    Ingreso:false,
    Gasto:false,
    Trans:false,
    Accion:"Sin",
    textorep:"",
    valdefault:"No",
    cuotamodal:false,
    Importe:"",
    AddCuenta:false,
    err1:false,
    err2:false,
    err3:false,
    CuentaRender:"",
    CategoriaRender:"",
    catSelect:"",
    subCatSelect:"",
    catSelect:"",
    cuentaSelec:"",
    cuentaSelectT2:"",
    cuentaSelectT1:"",
    EditCuenta:false,
    CuentaEditar:"",
    addmitipo:false,
    CuentaCaller:"",
    tiempo: "",
    agregarImagenes:false,
    archivos:[],
    urlImg:[],
    imgGuardadas:false,
    importInput:false,
  waiting:false,
  waitingtrans:false,
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
    ImporteAntes:0,
    calcuModal:false,
    loading:false
  }
  myRef = React.createRef();
  refScroll = React.createRef();
  refScroll2 = React.createRef();
    componentDidMount(){
   
      this.channel1 = postal.channel();

      setTimeout(function(){ 
        
        document.getElementById('maincont1').classList.add("opacityon")

       }, 500);
       
  if(this.props.CuentaEdit){

let send = this.props.CuentaEdit.reg




    if(send.Accion =="Ingreso"){
     
      let nombreto =  send.CatSelect.nombreCat 
      if(send.CatSelect.subCatSelect != ""){
        nombreto = send.CatSelect.nombreCat + "  //  " + send.CatSelect.subCatSelect
      }

      this.setState({Ingreso:true,
        Accion:"Ingreso",
        cuentaSelec:send.CuentaSelec,
        cuentaEnviada:send.CuentaSelec,
        CuentaRenderT1:send.CuentaSelec.nombreCuenta,
        catSelect:send.CatSelect,
        idReg:send.IdRegistro,
        textorep:send.textorep || "",
        valdefault:send.valdefault,
        CuentaRender:send.CuentaSelec.nombreCuenta,
        CategoriaRender:nombreto,
        subCatSelect:send.CatSelect.subCatSelect,
        catSelect:send.CatSelect,
        tiempo:send.Tiempo,      
        urlImg:send.urlImg,
        Nota:send.Nota,
        Descripcion:send.Descripcion,
        Importe:send.Importe,
        ImporteAntes:send.Importe,
        idMongo:send._id,
        Versiones:send.Versiones
  
      })

    }else if(send.Accion =="Gasto"){
      let nombreto =  send.CatSelect.nombreCat 
      if(send.CatSelect.subCatSelect != ""){
        nombreto = send.CatSelect.nombreCat + "  //  " + send.CatSelect.subCatSelect
      }
      this.setState({Gasto:true,
        Accion:"Gasto",
        CuentaRenderT1:send.CuentaSelec.nombreCuenta,
        cuentaSelec:send.CuentaSelec,
        cuentaEnviada:send.CuentaSelec,
        catSelect:send.CatSelect,
        idReg:send.IdRegistro,
        textorep:send.textorep || "",
        valdefault:send.valdefault,
        CuentaRender:send.CuentaSelec.nombreCuenta,
        CategoriaRender:nombreto,
        subCatSelect:send.CatSelect.subCatSelect,
        catSelect:send.CatSelect,
        tiempo:send.Tiempo,      
        urlImg:send.urlImg,
        Nota:send.Nota,
        Descripcion:send.Descripcion,
        Importe:send.Importe,
        ImporteAntes:send.Importe,
        idMongo:send._id,
        Versiones:send.Versiones
      })


     }else if(send.Accion =="Trans"){
      this.setState({Trans:true,
        Accion:"Trans",
        cuentaSelec:send.CuentaSelec,
        cuentaEnviada:send.CuentaSelec,
        cuentaSelec2:send.CuentaSelec2,
        CuentaRenderT2:send.CuentaSelec2.nombreCuenta,
        CuentaRenderT1:send.CuentaSelec.nombreCuenta,
        idReg:send.IdRegistro,
        textorep:send.textorep || "",
        valdefault:send.valdefault,
        CuentaRender:send.CuentaSelec.nombreCuenta,
        tiempo:send.Tiempo,      
        urlImg:send.urlImg,
        Nota:send.Nota,
        Descripcion:send.Descripcion,
        Importe:send.Importe,
        ImporteAntes:send.Importe,
        idMongo:send._id,
        Versiones:send.Versiones
      })
    
  }

if(send.urlImg.length > 0){
  console.log("enimgguard")
  this.setState({imgGuardadas:true})
  
}

} 
      }//fin did
   

   
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
  console.log(files);
  this.setState({archivos:files})
}

   buttons3=(e)=>{
   
    
if(e.target.id ==="b1"){
  this.setState({Ingreso:true,
    Gasto:false,
   Trans: false,
   Accion:"Ingreso",
   CategoriaRender:"",
    catSelect:"",

  
})


}else if(e.target.id ==="b2"){

  
  this.setState({Ingreso:false,
                 Accion:"Gasto",
                 Gasto:true,
                Trans: false,                 
                CategoriaRender:"",
                catSelect:"",
                
  })

 




}
else if(e.target.id ==="b3"){

  this.setState({Ingreso:false,
                 Gasto:false,
                Trans: true,
                Accion:"Trans",
                valdefault: "No",
                textorep:"",
                CategoriaRender:"",
                catSelect:"",        
             
             
  })

 
}




}  
onFlechaRetro=()=>{
  document.getElementById('maincont1').classList.remove("opacityon")
  setTimeout(()=>{ 
    this.props.flechafun()
    
   }, 500);
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

sendCat=()=>{
  let Cats = this.props.state.RegContableReducer.Categorias
if(Cats.length > 0){
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
   tiempo:new Date(e._d).getTime()
 })


  }
  openCuentas=()=>{
    this.setState({cuentasmodal:true, CuentaCaller:"inggas",normal:true })
   
  }
  openCuentasT1=()=>{
    this.setState({cuentasmodal:true, CuentaCaller:"trans1",trans1:true})
  
  }
  openCuentasT2=()=>{
    if(this.state.cuentasmodal){
  
    }else{
      this.setState({cuentasmodal:true, CuentaCaller:"trans2", trans2:true})
    
    }
  
  }
uploadimages=(mival,trans)=>{
const miFormaData = new FormData()
let sumaimagenes = this.state.archivos.length + this.state.urlImg.length
console.log(sumaimagenes)
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

if(stateactualizado.length == sumaimagenes){
  console.log("en listado para ingresar ")
  if(trans =="Transferencia"){  
    console.log("Trans")
this.ingresadorTrans(mival)
  }else if(trans =="inggas"){
    console.log("uploader inggas")
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
if(this.state.archivos.length > 0){

  this.uploadimages(mival, trans)
 }
 else{

this.ingresador(mival)
 
  }
}



ingresador=(mival)=>{
  let send = this.props.CuentaEdit.reg

  console.log(this.state)
  console.log(send)
  if(this.state.Accion != send.Accion  ||
    this.state.tiempo != send.Tiempo  ||
    this.state.cuentaSelec.idCuenta != send.CuentaSelec.idCuenta||
    this.state.catSelect._id != send.CatSelect._id ||
    this.state.subCatSelect !=send.CatSelect.subCatSelect||
    this.state.urlImg != send.urlImg  ||
    this.state.Nota != send.Nota  ||
    this.state.Importe != send.Importe  ||
    this.state.Descripcion != send.Descripcion 

    ){console.log("Ejecutar")
    if(this.state.loading == false){
      this.setState({loading:true})
    console.log(mival)
    if(this.state.cuentaSelec == ""){
      this.setState({normalerr:true, loading:false})
    }
   if(this.state.catSelect == ""){
      document.getElementById('cDc2Categoria').classList.add("err")
      this.setState({ loading:false})
     }  
      if(this.state.Importe == "" ||this.state.Importe < 0){
  
      this.setState({importInput:true, loading:false})
     }
  
     if(this.state.cuentaSelec != "" && this.state.catSelect != "" && this.state.Importe != "" && this.state.Importe !== "" ){
      
                 
        let datatosend={
          Accion:this.state.Accion,
          Tiempo:this.state.tiempo,
          iDReg:this.state.idReg,
          idMongo:this.state.idMongo,
          CuentaSelec:this.state.cuentaSelec,
          CatSelect:this.state.catSelect,
          SubCatSelect:this.state.subCatSelect,
          Importe:parseFloat(this.state.Importe),
          ImporteAntes:parseFloat( this.state.ImporteAntes),
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
        },
        Versiones:this.state.Versiones,
        }
          
      
        let lol = JSON.stringify(datatosend)
                  
        let url = "/cuentas/edittreg"   
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
      else{
        console.log(response)
     
        this.channel1.publish('UpdateCount', {
          message: 'enviado desde reset',
          cuenta:response.cuenta
       });
    
        
        this.props.dispatch(updateCuenta(response.cuenta))
      
        this.props.dispatch(updateReg(response.registro))
      
        this.channel1.publish('updateSearcher', {
          reg: response.registro
       });
      
        this.onFlechaRetro()
      }
  
       
  
    
  
        
      })
     }
  
    }
 
}else{

    let add = {
      Estado:true,
      Tipo:"info",
      Mensaje:"Edite un campo antes de continuar"
  }
  this.setState({Alert: add, loading:false, waiting:false, waiting2:false, waitingtrans:false, waitingtrans2:false}) 
  }
}

ingresadorTrans=(mival)=>{
  if(this.state.loading == false){
    this.setState({loading:true})
  if(this.state.cuentaSelec== ""){
    this.setState({trans1err:true, waitingtrans:false, loading:false})
  }
  if(this.state.cuentaSelec2 == ""){
    this.setState({trans2err:true,waitingtrans:false,loading:false})
  }
  if(this.state.Importe == "" ||this.state.Importe <= 0){

    this.setState({importInput:true, waitingtrans:false, loading:false})
   
   }

   if(this.state.cuentaSelec != "" && this.state.cuentaSelec2 != "" && this.state.Importe > 0 && this.state.Importe != ""){
   
    
      let datatosendTrans={
        idMongo:this.state.idMongo,
        Accion:this.state.Accion,
        Tiempo:this.state.tiempo,
        iDReg:this.state.idReg,
        CuentaSelect1:this.state.cuentaSelec,
        CuentaSelect2:this.state.cuentaSelec2,
        Importe:parseFloat(this.state.Importe),
        ImporteAntes:parseFloat( this.state.ImporteAntes),
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
      },
      Versiones:this.state.Versiones,
      }
 
      let Transdata = JSON.stringify(datatosendTrans)
      
      let url = "/cuentas/edittreg"   
    fetch(url, {
    method: 'PUT', // or 'PUT'
    body: Transdata, // data can be `string` or {object}!
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
      else {
    
 
     this.props.dispatch(updateReg(response.registro)) 
     this.props.dispatch(updateCuenta(response.cuenta1))
     this.props.dispatch(updateCuenta(response.cuenta2))
                        
      this.setState({importInput:false})
 
       this.onFlechaRetro()
     
      }
  
    })
  
 
   }
  }
}


ComprobadorTrans=()=>{
  let mival = "Agregador"
  let trans = "Transferencia"
  if(this.state.archivos.length > 0){

    this.uploadimages(mival,trans)
  
   }
   else{

    this.ingresadorTrans(mival)
 
      }
   
}
removeImg=(img)=>{
console.log(img)
let arraysin = this.state.urlImg.filter(x => x != img)
this.setState({urlImg:arraysin})

}
openCategoria=()=>{
  this.setState({categoriaModal:true})
  document.getElementById('cDc2Categoria').classList.add("cdc2active2")
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
      let imgRender=""

      let scolledmodified = this.state.calcuModal?"scolledmodified":""
      let Cactive = this.state.normal?"cdc2active2":""
      let Ct1active = this.state.trans1?"cdc2active2":""
      let Ct2active2 = this.state.trans2?"cdc2active2":""
      
      let Cactiveerr = this.state.normalerr?"err":""
      let Ct1activeerr = this.state.trans1err?"err":""
      let Ct2active2err = this.state.trans2err?"err":""

      let ingresoval = this.state.Ingreso?"bingreso":"";
      let gastoval = this.state.Gasto?"bgasto":"";
      let transval = this.state.Trans?"btrans":"";
   
      let User = this.props.state.userReducer.update.usuario
      let now = new Date()
      let año = now.getFullYear()
      let dia = now.getDate()
      let mes = now.getMonth()
      
      let fecha =  `${dia} / ${mes} / ${año} ` 
      let hora = `${now.getHours()} : ${now.getMinutes()} ` 
      let string = JSON.stringify(fecha).replace(/['"]+/g, '')
      let string2 = JSON.stringify(hora).replace(/['"]+/g, '')

      let enablebuttons = !this.state.Gasto && !this.state.Ingreso && !this.state.Trans?"blockcompoent":"enablecomponents ";

    
      if(this.state.urlImg.length > 0){
     imgRender = this.state.urlImg.map((image, i)=>{
       
      return(<div key={i} className='contImgGuard'>
        <img src={image} className='imageGuard' />
        <span className='xdel' onClick={()=>{this.removeImg(image)}} >x</span>

        <style>
          {`
              .contImgGuard{
                display:flex;
                padding:15px;
                justify-content:space-between;
                max-width: 500px;
              }
              .imageGuard{
               width: 80%;
              }
              .xdel{
                width: 40 px;
                    height: 40 px ;
                color: red;
                cursor:pointer;
               }
              ` }
        </style>
      </div>)
     })

      }


        return ( 

         <div >

<div ref={this.myRef}   id="maincont1"  className="maincontacto" >
            <div id="contact1" className="contcontactoModalIng"  >
        
                <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.onFlechaRetro}/>
              <div className="tituloventa">
                
            <p> Editar Registro </p>
           
        </div>
     
        </div>

        <div className="contbotones">
          <button id="b1" onClick={ this.buttons3} className={`botongeneral ${ingresoval} `} >Ingreso</button>
          <button id="b2" onClick={ this.buttons3}className={`botongeneral ${gastoval} `} >Gasto</button>
          <button id="b3"  onClick={ this.buttons3}className={`botongeneral ${transval} `}>Trans</button>


        </div>
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
                
         
               </Animate>
                        
               <Animate show={this.state.Trans==true}>
                 <div className="contCdc3" id="cdc3">
     
              
        
             
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
              <div id ="cDc2Cuentas"className={`cDc2 ${Cactive} ${Cactiveerr} `}  onClick={this.openCuentas} >
              <p>  {this.state.CuentaRender} </p>
            
              </div>
              </div>
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Categoria  </p>
            
              </div>
              <div  id ="cDc2Categoria" className="cDc2" onClick={this.openCategoria} >
              <p>  {this.state.CategoriaRender} </p>
            
              </div>

              </div>
              <div className="grupoDatos" ref={this.refScroll} >
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Importe  </p>
            
              </div>
              <span className="cDc2 currencyinput ">    
                <div className="jwFlex">$ <input 
                   onWheel={(e) => e.target.blur()} 
                type="number"className=" customInput" placeholder='0' name="Importe" value={this.state.Importe} onChange={this.handleChangeGeneral} />        </div>      
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
              <div className="cDc2">
              <TextField  fullWidth name="Nota" value={this.state.Nota} onChange={this.handleChangeGeneral} id="standard-basic" label="" />
            
              </div>

              </div>
        </div>
       
       <div className="contDatosC jwffc" >
         <div className="contlinea1">
         <div className="descripcont">
       <TextField value={this.state.Descripcion}  name="Descripcion"  onChange={this.handleChangeGeneral}  fullWidth id="standard-basic" label="Descripción" />
       </div>
       <div className="agrupador agrupper">

              

<i className="material-icons i3D" onClick={()=>{this.setState({agregarImagenes:!this.state.agregarImagenes,archivos:{}})}}>  add_photo_alternate</i>

          
</div>
</div>
<Animate show={this.state.agregarImagenes}>
  
<DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />
</Animate>
<Animate show={this.state.imgGuardadas}> 
{imgRender}
</Animate>

       </div>
       <div className="jwContCenter">
  
       <Animate show={this.state.loading}>
                    <CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
                    <button onClick={this.Comprobador} className={` btn btn-primary botonedit2 `}  >
<p>Editar</p>
<i className="material-icons">
edit
</i>

</button>
</Animate>
</div>
       </Animate >


       <Animate show ={this.state.Trans }>
        <div className="ContDatosG">
          <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  De  </p>
            
              </div>
              <div id ="cDc2CuentasTrans"className={` cDc2CuentasTrans cDc2 ${Ct1active } ${Ct1activeerr }  `}  onClick={this.openCuentasT1}>
              <p>  {this.state.CuentaRenderT1} </p>
              <i className="material-icons calcuIcon customimport"
              onClick={(e)=>{
              
                e.stopPropagation()
                this.setState({
                  CuentaRenderT1:this.state.CuentaRenderT2,
                  CuentaRenderT2:this.state.CuentaRenderT1,
                  cuentaSelec:this.state.cuentaSelec2,
                  cuentaSelec2:this.state.cuentaSelec,
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
                <div className="jwFlex">$ <input
                   onWheel={(e) => e.target.blur()} 
                type="number"className=" customInput" placeholder='0' name="Importe" value={this.state.Importe} onChange={this.handleChangeGeneral} />        </div>      
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
<Animate show={this.state.imgGuardadas}> 
{imgRender}
</Animate>
       </div>
       <div className="jwContCenter">
       <Animate show={this.state.loading}>
                    <CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
                    <button  onClick={this.ComprobadorTrans}className={` btn btn-primary botonedit2 `}  >
<p>Editar</p>
<i className="material-icons">
edit
</i>

</button>
</Animate>  

</div>

       
       </Animate >

       </div>


        </div>
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
        <Animate show={this.state.repetirmodal}>
       < ModalRep Flecharetro={()=>{this.setState({repetirmodal:false, valdefault:"No"})}} Atributomain={this.atributomain} />
        </Animate >
        
        <Animate show={this.state.cuotamodal}>
       < CuotaRep      Flecharetro2={()=>{this.setState({cuotamodal:false, valdefault:"No"})}} envioCuotas={this.envioCuotas} />
        </Animate >

        <Animate show={this.state.cuentasmodal}>
       < Cuentas Addcuentas={()=>{this.setState({AddCuenta:true})}} 
       datosUsuario={this.props.state.userReducer.update.usuario}
       cuentacaller={this.state.CuentaCaller }
       cuentaEnviada={this.state.cuentaEnviada }
       editCuenta={(cuentae)=>{this.setState({EditCuenta:true, CuentaEditar:cuentae})}}
    
       sendCuentaSelect={(cuenta)=>{
        let data = {
          idCuenta: cuenta._id,
          nombreCuenta:cuenta.NombreC,
          valorCambiar:cuenta.DineroActual.$numberDecimal
        }
    this.setState({cuentaEnviada:cuenta,cuentaSelec:data, CuentaRender:cuenta.NombreC,cuentasmodal:false,})
       } }  
       sendCuentaSelectT1={(cuenta)=>{
      
         let data = {
          idCuenta: cuenta._id,
          nombreCuenta:cuenta.NombreC,
          valorCambiar:cuenta.DineroActual.$numberDecimal
        }
        this.setState({cuentaEnviada:cuenta,cuentaSelec:data, CuentaRenderT1:cuenta.NombreC,cuentasmodal:false,})
           } }  

           sendCuentaSelectT2={(cuenta)=>{
             let data = {
               idCuenta: cuenta._id,
               nombreCuenta:cuenta.NombreC,
               valorCambiar:cuenta.DineroActual.$numberDecimal
             }
            this.setState({cuentaEnviada:cuenta,cuentaSelec2:data, CuentaRenderT2:cuenta.NombreC,cuentasmodal:false,})
               } }  
       
       Flecharetro3={
        ()=>{
          if(this.state.CuentaCaller ==="inggas"){
            this.setState({cuentaEnviada:{_id:""},cuentasmodal:false,  CuentaRender:"",cuentaSelec:"", normal:false })
          }else if(this.state.CuentaCaller ==="trans1"){
            this.setState({cuentaEnviada:{_id:""},cuentasmodal:false,  CuentaRenderT1:"",cuentaSelectT1:"",trans1:false})
          }else if(this.state.CuentaCaller ==="trans2"){
            this.setState({cuentaEnviada:{_id:""},cuentasmodal:false, CuentaRenderT2:"",cuentaSelectT2:"",trans2:false})
          }
         
        }
       } 
      envioCuentas={this.envioCuentas} />
        </Animate >

        <Animate show={this.state.categoriaModal}>
       <Cat 
       Addcat={()=>{this.setState({Addcat:true})}}
       Categorias = {this.sendCat()}  
       datosUsuario={this.props.state.userReducer.update.usuario._id}
       editCat={(catae)=>{this.setState({EditCat:true, catEditar:catae})}}
    
       sendCatSelect={(cat)=>{

    this.setState({catSelect:cat, CategoriaRender:cat.nombreCat,categoriaModal:false,subCatSelect:""})
       } }  
       

       sendsubCatSelect={(cat)=>{
let nombreto = cat.estado.catSelect.nombreCat + "  //  " + cat.subcat
        this.setState({catSelect:cat.estado.catSelect, subCatSelect:cat.subcat, CategoriaRender:nombreto,categoriaModal:false,})
           } }  

       Flecharetro3={
        ()=>{
          this.setState({categoriaModal:false, CategoriaRender:"",catSelect:"",subCatSelect:""})
          let linearcat =  document.getElementById('cDc2Categoria')
          if(linearcat){
            linearcat.classList.remove("cdc2active2")
          }
          
          if(linearcat.classList.contains("err")){
            linearcat.classList.remove("err")
          }
        }
       } 
      envioCuentas={this.envioCuentas} />
        </Animate >

       

        <Animate show={this.state.AddCuenta}>
       < Addcuenta datosUsuario={this.props.state.userReducer.update.usuario._id}    Flecharetro4={
         
   ()=>{
     console.log("enretro4")
    this.setState({AddCuenta:false, valdefault:"No"})}
  } 
  agregarTipo={()=>{
 
    this.setState({addmitipo:true})}}
          />
        </Animate >

        <Animate show={this.state.EditCuenta}>
       < Editcuenta
        datosUsuario={this.props.state.userReducer.update.usuario._id} 
   
          CuentaEditar={this.state.CuentaEditar}
          Flecharetro4={
   
   ()=>{
   
    this.setState({EditCuenta:false, valdefault:"No"})}} 
          />
        </Animate >


        <Animate show={this.state.Addcat}>
        < Addcat datosUsuario={this.props.state.userReducer.update.usuario._id}     Flecharetro4={
         
         ()=>{
           console.log("enretro4")
          this.setState({Addcat:false})}
        } 
    
                />
        </Animate >
        <Animate show={this.state.EditCat}>
        < Edditcat datosUsuario={this.props.state.userReducer.update.usuario._id}   Flecharetro4={
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
           .grupoDatos{
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
           }
.ContDatosG{display: flex;
  flex-flow: column;
    width: 100%;
    box-shadow: -6px 8px 14px #000000c4;
    padding: 12px 5px;
    border-radius: 10px;

}

 .contscroled{
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 20px;
  max-height: 450px;
  transition: 1s;
}
.scolledmodified{
  height: 30vh;
 }
           .blockcompoent{
             display:none
           }

           enablecomponents{
            display:block
           }
        
           ing
           .cDc3{
           
            height: 70%;
            width: 25%;
            max-width: 110px;
            text-align: center;

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
   .urgente{
    text-align: center;
    border: 1px outset blue;
    margin-top: 10px;
    border-radius: 15px;
    padding: 5px;
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

   .currencyinput {
    display: flex;
    justify-content: space-between;
    border-bottom: 3px double grey;
}
   
   .contDatosC{
     display:flex;
     width: 100%;
     justify-content: space-around;
     align-items: center;
     box-shadow: -3px 6px 8px #000000c4;
     padding:20px 5px;
     border-radius: 5px;
     font-size: 15px;
   }
.cDc1{

  width: 30%;
  display: flex;
  align-items: flex-end;
  
}

.bordeinf{

}
.cDc1 p{

margin:0px;
  
}
.calcuIcon{
  font-size: 40px;
  width: 20%;
  display: flex;
  /* justify-content: flex-start; */
  margin: 0;
  max-width: 50px;
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
          .jwFlex{
            display:flex;
            width: 80%;
          }
          .customInput{
            border: 0;
        
            margin: 0px;
            margin-left:5px;
            width: 78%;
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
          z-index: 1298;
         width: 100vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left:0px;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: flex-start;
         transition: 0.3s ;
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
       .contcontactoModalIng{
        border-radius: 20px;
        width: 93%;
        background-color: white;
        padding: 20px 10px;
         transition: 0.5s ease-out;
 
       }
    
       .opacityon{
        opacity: 1;
       }
       .contbotones{
        margin: 30px 0px;
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