import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import ModalRep from "./modalrepetir"

import Cat from "./modalcategorias"
import Cuentas from "./modalcuentas"

import Addcat from "./modal-addcat"


import Edditcat from "./modal-editcat"
import TextField from '@material-ui/core/TextField';

import {connect} from 'react-redux';

import { DateTimePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import "moment/locale/es";
import FilledInput from '@material-ui/core/FilledInput';
import MomentUtils from '@date-io/moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import { updateRepEdit} from "../../reduxstore/actions/regcont"

import DropFileInput from "../drop-file-input/DropFileInput"
import postal from 'postal';
class Contacto extends Component {
   
  state={
  
    Ingreso:false,
    Gasto:false,
    Trans:false,
    Accion:"Sin",
    textorep:"",
    valdefault:"No",
    cuotamodal:false,
    Importe:"",
    
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
  
    CuentaEditar:"",
    addmitipo:false,
    CuentaCaller:"",
    tiempo: new Date(),
    agregarImagenes:false,
    archivos:[],
    urlImg:[],
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
    TipoRep:"",
    repetirmodal:false
  }
  myRef = React.createRef();
  channel1 = null;
    componentDidMount(){
   
      this.channel1 = postal.channel();

      setTimeout(function(){ 
        
        document.getElementById('maincont1').classList.add("opacityon")

       }, 500);
       
  if(this.props.reg){

let send = this.props.reg
console.log(send)
    if(send.Accion =="Ingreso"){
     
let categoriaToshow = send.CatSelect.subCatSelect == ""? send.CatSelect.nombreCat: send.CatSelect.nombreCat + "  //  " + send.CatSelect.subCatSelect

      this.setState({Ingreso:true,
        Accion:"Ingreso",
        cuentaSelect:{_id:send.CuentaSelec.idCuenta,
                      NombreC:send.CuentaSelec.nombreCuenta
        },
        catSelect:send.CatSelect,
      
        CuentaRender:send.CuentaSelec.nombreCuenta,
        CategoriaRender:categoriaToshow,
        subCatSelect:send.CatSelect.subCatSelect,
        catSelect:send.CatSelect,
        tiempo:new Date(send.Tiempo),      
        urlImg:send.urlImg,
        Nota:send.Nota,
        Descripcion:send.Descripcion,
        Importe:parseFloat(send.Importe.$numberDecimal),
        ImporteAntes:parseFloat(send.Importe.$numberDecimal),
        valdefault:send.TipoRep,
        textorep:send.Valrep,

        
      })

    }else if(send.Accion =="Gasto"){
    
      let categoriaToshow = send.CatSelect.subCatSelect == ""? send.CatSelect.nombreCat: send.CatSelect.nombreCat + "  //  " + send.CatSelect.subCatSelect

      this.setState({Gasto:true,
        Accion:"Gasto",
        cuentaSelect:{_id:send.CuentaSelec.idCuenta,
          NombreC:send.CuentaSelec.nombreCuenta
},
        catSelect:send.CatSelect,
       
       
        CuentaRender:send.CuentaSelec.nombreCuenta,
        CategoriaRender:categoriaToshow,
        subCatSelect:send.CatSelect.subCatSelect,
        catSelect:send.CatSelect,
        tiempo:new Date(send.Tiempo),      
        urlImg:send.urlImg,
        Nota:send.Nota,
        Descripcion:send.Descripcion,
        Importe:parseFloat(send.Importe.$numberDecimal),
        ImporteAntes:parseFloat(send.Importe.$numberDecimal),
        valdefault:send.TipoRep,
        textorep:send.Valrep,
      })


     }else if(send.Accion =="Trans"){
      this.setState({Trans:true,
        Accion:"Trans",
        cuentaSelectT1:{_id:send.CuentaSelec.idCuenta,
          NombreC:send.CuentaSelec.nombreCuenta
},
cuentaSelectT2:{_id:send.CuentaSelec2.idCuenta,
  NombreC:send.CuentaSelec2.nombreCuenta
},
        CuentaRenderT2:send.CuentaSelec2.nombreCuenta,
        CuentaRenderT1:send.CuentaSelec.nombreCuenta,
          
        CuentaRender:send.CuentaSelec.nombreCuenta,
        tiempo:new Date(send.Tiempo),      
        urlImg:send.urlImg,
        Nota:send.Nota,
        Descripcion:send.Descripcion,
        Importe:parseFloat(send.Importe.$numberDecimal),
        ImporteAntes:parseFloat(send.Importe.$numberDecimal),
        valdefault:send.TipoRep,
        textorep:send.Valrep,
      })
    
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

  this.setState({archivos:files})
}

   buttons3=(e)=>{
      
    
if(e.target.id ==="b1"){
  this.setState({Ingreso:true,
    Gasto:false,
   Trans: false,
   Accion:"Ingreso",

 
   CategoriaRender:"",
   subCatSelect:"",
   catSelect:""
})



}else if(e.target.id ==="b2"){

  
  this.setState({Ingreso:false,
                 Accion:"Gasto",
                 Gasto:true,
                Trans: false,
        
                CategoriaRender:"",
                subCatSelect:"",
                catSelect:""
                
  })






}
else if(e.target.id ==="b3"){

  this.setState({Ingreso:false,
                 Gasto:false,
                Trans: true,
                Accion:"Trans",
            
                CategoriaRender:"",
                subCatSelect:"",
                catSelect:"",
                cuentaSelect:"",
             
             
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

atributomain=(e)=>{
  this.setState({repetirmodal:false, textorep:e.target.innerText,valdefault:"Repetir"})

 

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
if(this.state.archivos.length > 0){

  this.uploadimages(mival)
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

  if(this.state.cuentaSelect == ""){
    this.setState({normalerr:true})
  }
 if(this.state.catSelect == ""){
    document.getElementById('cDc2Categoria').classList.add("err")
   }  
    if(this.state.Importe == "" ||this.state.Importe < 0){

    this.setState({importInput:true})
   }

   if(this.state.cuentaSelect != "" && this.state.catSelect != "" && this.state.Importe != "" && this.state.Importe > 0 ){
  
               
      let datatosend={
        idMongo:this.state.idMongo,
        Accion:this.state.Accion,
        Tiempo:this.state.tiempo.getTime(),
        iDReg:this.state.idReg,
        CuentaSelect:this.state.cuentaSelect,
        CatSelect:this.state.catSelect,
        subCatSelect:this.state.subCatSelect,
        Importe:parseFloat(this.state.Importe),
        ImporteAntes:parseFloat( this.state.ImporteAntes),
        Nota:this.state.Nota,
        Descripcion:this.state.Descripcion,
        urlImg:this.state.urlImg,
      Valrep:this.state.textorep,
      TipoRep:this.state.valdefault,
      TiempoExe:this.props.tiempoexe,
      Usuario : {
        DBname:this.props.state.userReducer.update.usuario.user.DBname,
        Usuario:this.props.state.userReducer.update.usuario.user.Usuario,
       _id:this.props.state.userReducer.update.usuario.user._id,
       Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
      },
     Id:this.props.id
      }
           
      console.log(datatosend)
      let lol = JSON.stringify(datatosend)
                
      let url = "/cuentas/edittrep"   
    fetch(url, {
    method: 'PUT', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
    }).then(res => res.json()).then(response =>{
      console.log(response)
      if(response.message=="error al registrar"){
        alert("Error al registrar, intentelo en unos minutos")
      }
      else{
        let repe= response.represult 
        this.props.dispatch(updateRepEdit({repe}))
        this.onFlechaRetro()
      }
  
    })
  
 
  





   }
}

ingresadorTrans=(mival)=>{
  console.log("Ingresador trans")
  if(this.state.cuentaSelectT1== ""){
    this.setState({trans1err:true, waitingtrans:false})
  }
  if(this.state.cuentaSelectT2 == ""){
    this.setState({trans2err:true,waitingtrans:false})
  }
  if(this.state.Importe == "" ||this.state.Importe <= 0){

    this.setState({importInput:true, waitingtrans:false})
   
   }

   if(this.state.cuentaSelectT1 != "" && this.state.cuentaSelectT2 != "" && this.state.Importe > 0 && this.state.Importe != ""){
 
   

      let datatosend={
        idMongo:this.state.idMongo,
        Accion:this.state.Accion,
        Tiempo:this.state.tiempo.getTime(),
        iDReg:this.state.idReg,
        CuentaSelect1:this.state.cuentaSelectT1,
        CuentaSelect2:this.state.cuentaSelectT2,
        Importe:parseFloat(this.state.Importe),
        ImporteAntes:parseFloat( this.state.ImporteAntes),
        Nota:this.state.Nota,
        Descripcion:this.state.Descripcion,
        urlImg:this.state.urlImg,
      Valrep:this.state.textorep,
      TipoRep:this.state.valdefault,
      TiempoExe:this.props.tiempoexe,
      Usuario : {
        DBname:this.props.state.userReducer.update.usuario.user.DBname,
        Usuario:this.props.state.userReducer.update.usuario.user.Usuario,
       _id:this.props.state.userReducer.update.usuario.user._id,
       Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
      },
      Id:this.props.id
      }
      console.log(this.state)       
    console.log(datatosend)
      let lol = JSON.stringify(datatosend)
     
      let url = "/cuentas/edittrep"   
    fetch(url, {
    method: 'PUT', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
    }).then(res => res.json()).then(response =>{
      console.log(response)
     
      if(response.message=="error al registrar"){
        alert("Error al registrar, intentelo en unos minutos")
      }
      else{
        let repe= response.represult 
        this.props.dispatch(updateRepEdit({repe}))
        this.onFlechaRetro()
      }
     
      


  
    })
  
 



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
openCategoria=()=>{
  this.setState({categoriaModal:true})
  document.getElementById('cDc2Categoria').classList.add("cdc2active2")
}

    render () {
      console.log(this.state)
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

    



        return ( 

         <div >

<div ref={this.myRef}   id="maincont1"  className="maincontacto" >
            <div id="contact1" className="contcontactoModalIng"  >
        
                <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.onFlechaRetro}/>
              <div className="tituloventa">
                
            <p> Editar Repetición</p>
           
        </div>
     
        </div>

        <div className="contbotones">
          <button id="b1" className={`botongeneral ${ingresoval} `}onClick={ this.buttons3} >Ingreso</button>
          <button id="b2" className={`botongeneral ${gastoval} `}onClick={ this.buttons3} >Gasto</button>
          <button id="b3" className={`botongeneral ${transval} `}onClick={ this.buttons3}>Trans</button>


        </div>

        <div className="contDatosC">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Fecha:  </p>
            
              </div>
              <div className="cdc21">
              <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <DateTimePicker
         
        variant="inline"
     
        label=""
        value={this.state.tiempo}
        onChange={this.handleChangeTiempo}
      />
              </MuiPickersUtilsProvider>
               </div>
               <div className="cDc3 cdc3active">

              <div className={`contMainCdc3  ${enablebuttons}`}>

              <Animate show={this.state.Trans==false}>
                 <div className="contCdc3" id="cdc3">
     
                   <div className="agrupador">

              
               <i className="material-icons">  sync_alt</i>
       
     

 
   
    <p style={{color:"black",textDecoration:"none"}}> Repetir </p>


   
        </div>
            <p style={{cursor:"pointer"}}onClick={this.cuoter}>{this.state.textorep.toLocaleLowerCase()}
          

            </p>
             
               </div>
         
               </Animate>
                        
               <Animate show={this.state.Trans==true}>
                 <div className="contCdc3" id="cdc3">
     
                   <div className="agrupador">

              
               <i className="material-icons">  sync_alt</i>
               <p style={{color:"black",textDecoration:"none"}}> Repetir </p>
        </div>
            <p style={{cursor:"pointer"}}onClick={this.cuoter}>{this.state.textorep.toLocaleLowerCase()}
            

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
              <div id ="cDc2Cuentas"className={`cDc2 ${Cactive} ${Cactiveerr} `} onClick={this.openCuentas} >
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
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Importe  </p>
            
              </div>
              <div className="cDc2">
             
          <FilledInput
          fullWidth
            id="filled-adornment-amount"
            type="number"
            style={{background:"white",paddingLeft:"0px"}}
            name="Importe"
            value={this.state.Importe}
            onChange={this.handleChangeGeneral}
            startAdornment={<InputAdornment 
              style={{marginTop:"16px"}}
              position="start">$</InputAdornment>}
              error={this.state.importInput}

          />
            
              </div>

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

              
<i className="material-icons i3D" onClick={this.uploadimages}>  add_a_photo</i>
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
  
  <button className="botoncontact" onClick={this.Comprobador}>Editar</button>
</div>
       </Animate >


       <Animate show ={this.state.Trans }>
        <div className="ContDatosG">
          <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  De  </p>
            
              </div>
              <div id ="cDc2CuentasTrans"className={`cDc2 ${Ct1active } ${Ct1activeerr }  `}onClick={this.openCuentasT1} >
              <p>  {this.state.CuentaRenderT1} </p>
            
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
              <div className="grupoDatos">
              <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Importe  </p>
            
              </div>
              <div className="cDc2">
              <FilledInput
          fullWidth
            id="filled-adornment-amount"
            type="number"
            style={{background:"white",paddingLeft:"0px"}}
            name="Importe"
            value={this.state.Importe}
            onChange={this.handleChangeGeneral}
            startAdornment={<InputAdornment 
              style={{marginTop:"16px"}}
              position="start">$</InputAdornment>}
              error={this.state.importInput}

          />
            
              </div>

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

              
<i className="material-icons i3D" onClick={this.uploadimages}>  add_a_photo</i>
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
      
  <button className="botoncontact" onClick={this.ComprobadorTrans}>Editar</button>
</div>

       
       </Animate >




        </div>
        </div>

        <Animate show={this.state.repetirmodal}>
       < ModalRep Flecharetro={()=>{this.setState({repetirmodal:false, valdefault:"No"})}} Atributomain={this.atributomain} />
        </Animate >
        

    

        <Animate show={this.state.cuentasmodal}>
       < Cuentas
        
       datosUsuario={this.props.state.userReducer.update.usuario}
       cuentacaller={this.state.CuentaCaller }
      
      
       sendCuentaSelect={(cuenta)=>{
        
    this.setState({cuentaSelect:cuenta, CuentaRender:cuenta.NombreC,cuentasmodal:false,})
       } }  
       sendCuentaSelectT1={(cuenta)=>{

        this.setState({cuentaSelectT1:cuenta, CuentaRenderT1:cuenta.NombreC,cuentasmodal:false,})
           } }  
           sendCuentaSelectT2={(cuenta)=>{
            this.setState({cuentaSelectT2:cuenta, CuentaRenderT2:cuenta.NombreC,cuentasmodal:false,})
               } }  
       
       Flecharetro3={
        ()=>{
          if(this.state.CuentaCaller ==="inggas"){
            this.setState({cuentasmodal:false,  CuentaRender:"",cuentaSelect:"", normal:false })
          }else if(this.state.CuentaCaller ==="trans1"){
            this.setState({cuentasmodal:false,  CuentaRenderT1:"",cuentaSelectT1:"",trans1:false})
          }else if(this.state.CuentaCaller ==="trans2"){
            this.setState({cuentasmodal:false, CuentaRenderT2:"",cuentaSelectT2:"",trans2:false})
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

    this.setState({catSelect:cat, CategoriaRender:cat.nombreCat,categoriaModal:false,})
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
        


        <Animate show={this.state.Addcat}>
        < Addcat datosUsuario={this.props.state.userReducer.update.usuario._id}     Flecharetro4={
         
         ()=>{
       
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

           .blockcompoent{
             display:none
           }

           enablecomponents{
            display:block
           }
           
           .cDc3{
           
            height: 70%;
            width: 25%;
            max-width: 110px;
            text-align: center;
            border-radius: 16px;
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

  
   .icoIMG{
     margin-top:10px;
     font-size:100px;
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
             .contTituloCont1{
              margin-top:10px;
               display:flex;
               display: flex;
    font-size: 25px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
    border: 1px solid blue;
    border-radius: 20px;
             }
             .contTituloCont1 p{
               margin-top:5px;
               margin-bottom:5px;
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
          z-index: 1297;
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
       .contcontactoModalIng{
        border-radius: 20px;
       
           
         width: 93%;
         background-color: white;

         padding: 20px 10px;
         transition: 0.5s ease-out;
         height: auto;
 
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