import React, { Component } from 'react'
import HelperFormapago from "../reusableComplex/helperFormapago"
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Animate} from "react-animate-mount"
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import FormasdePagoList from "../reusableComplex/formasPagoRender"
import { addArt, addCompra,addRegs, updateCuentas } from '../../reduxstore/actions/regcont';
import Cat from "./modalCategoriasArticulos"
import ModalComprobacionGeneral from './usefull/modal-comprobacion-general';
import DropFileInput from "../drop-file-input/DropFileInput"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';

class Contacto extends Component {
   
  state={
    cuentaInvSelect:9999998,
    cuentaInvNombre:"Principal",
    loading:false,
    codpunto:"001",
        codemision:"001",
        numeroFact:"0000000000",
        nombreComercial:"",
        Ruc:"",
    idReg:"",
    EqId:"",
  proveedor:"",
  idCompra:"",
  Medida:"Unidades",
  Cantidad:0,
  Precio_Compra:0,

   valUnitario:"",
  Precio_VentaAlt_Unitario:"",
  Precio_Venta_Unitario:"",
  masCampos:false,
  Precio_Compra_Total:"",

  tiempo: new Date().getTime(),
    
    Alert:{Estado:false},
    Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
      Id:this.props.state.userReducer.update.usuario.user._id,
      Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
     },
     urlImg:[],
        Fpago:[],
        payForm:true,
        archivos:[],
        CuentasInv:[],
        Fecha_Caducidad:" ",
        Categoria: "",
    
        Titulo: "",
        Garantia: "No",   
        Grupo: "",
        Departamento: "",
     
        Color: "",
        Calidad: "",
        Marca: "",
        Descripcion: "",
        DistribuidorID:"",
        Barcode:"",
    
        Precio_Venta: 1,
        Precio_Alt: 1,
        urlImg:"",
        Caduca:false,
        Iva:false,
     
        Vunitario:true,
        Vtotal:false,
        categoriaModal:false,
        Categoria:"",
        subCatSelect:"",
        catSelect:"",
        modalComprobacion:false,

      
  }
    componentDidMount(){

let populares =  this.props.state.userReducer.update.usuario.user.Factura.populares== "true"?true:false 

if(populares){
  this.setState({Iva:false})
}else{
  this.setState({Iva:true})
}


    
      setTimeout(function(){ 
        
        document.getElementById('mainAddMasive').classList.add("entradaaddc")

       }, 500);
        
     this.getid()
     this.getInvs()

     ValidatorForm.addValidationRule('requerido', (value) => {
      if (value === "" || value === " ") {
          return false;
      }
      return true;
  });
  ValidatorForm.addValidationRule('vacio', (value) => {
    
    return true;
});
      
      }
      getid=()=>{
        let datos = {User: this.props.state.userReducer.update.usuario.user}
        let lol = JSON.stringify(datos)
        var url = '/cuentas/rtyhgf456/getallCounters';
        
        fetch(url, {
          method: 'POST', // or 'PUT'
          body: lol,
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
  console.log(response)
            if(response.message == "error al decodificar el token"){
              this.props.dispatch(logOut());
              alert("Session expirada, vuelva a iniciar sesion para continuar");
                   
              Router.push("/")
            }else{
              this.setState({idCompra:response.cont.ContCompras,idReg:response.cont.ContRegs,EqId:response.cont.ContArticulos})
            }
      
       
        
        });
      
      }
      getInvs=()=>{
        let datos = {User: this.props.state.userReducer.update.usuario.user}
        let lol = JSON.stringify(datos)
        var url = '/cuentas/getInvs';
        
        fetch(url, {
          method: 'POST', // or 'PUT'
          body: lol,
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
   
            if(response.message == "error al decodificar el token"){
              this.props.dispatch(logOut());
              alert("Session expirada, vuelva a iniciar sesion para continuar");
                   
              Router.push("/")
            }else{
this.setState({CuentasInv:response.cuentasHabiles})
            }
      
       
        
        });
      
      }

    

      
      handleChangeInv=(e)=>{
     
        let passData = this.state.CuentasInv.find( x => x.iDcuenta == e.target.value)

        this.setState({cuentaInvSelect:passData.iDcuenta,
                      cuentaInvNombre:passData.NombreC
        
        })
      }
      handleInput=(e)=>{

        this.setState({[e.target.name]:e.target.value})
     
     }
   
      createFormaPago=(e)=>{

        let ramdon = Math.floor(Math.random() * 1000);

        let newid = "FP-" +ramdon 

        let DatatoAdd=  {Tipo:e.formaPagoAdd, Cantidad:e.Cantidad, Cuenta:e.CuentaSelect, Id:newid,Detalles:e.Detalles}
        let newstate = [...this.state.Fpago, DatatoAdd]

        this.setState({Fpago:newstate})
    }
    editFormaPago=(e)=>{
      this.setState({editFormaPago:true, SelectFormaPago:e})
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
       

     }
      Onsalida=()=>{
        document.getElementById('mainAddMasive').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }  
        handleChangeCantidad=(e)=>{
          this.setState({
            Medida:e.target.value,
                     
            })
        }
        handleChangeValor=(e)=>{
    
         if(e.target.value == "" || e.target.value == " " ){
          this.setState({
            Cantidad:e.target.value
            })
         }else{
          this.setState({
            Cantidad:parseFloat(e.target.value)
            })
         }
          
        }
        createArt=()=>{
          
           
          
            var url = '/public/generate-only-art';
            let newstate = {...this.state}
       
            newstate.Usuario ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
            var lol = JSON.stringify(newstate)
            fetch(url, {
              method: 'POST', // or 'PUT'
              body: lol, // data can be `string` or {object}!
              headers:{
                'Content-Type': 'application/json',
                "x-access-token": this.props.state.userReducer.update.usuario.token
              }
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
          
              if(response.status=="Error"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:` ${response.message}`  
              }
              this.setState({Alert: add, loading:false}) 
              }
             
            else {
             let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Articulo Ingresado"
            }
            this.setState({Alert: add})
            this.props.dispatch(addArt(response.Articulo))
            setTimeout(()=>{  this.Onsalida()},1200) 
            
            }
            })
            
            
        }
        
        comprobadorTypoUpload=(TotalPago, TotalValorCompra)=>{
          if(this.state.Cantidad == 0 ||this.state.Cantidad == ""||this.state.Cantidad == " "  ){
            
            this.createArt()
          }else{  
 
            
          
            let auth = false
            if(this.state.addFact){
            
              if(this.state.codpunto != "" && 
              this.state.codemision != "" &&
              this.state.numeroFact != "" &&
              this.state.UserSelect     
              
              
              ){
                auth = true
              }else{
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Revice los datos del distribuidor y/o factura "
              }
              this.setState({Alert: add, loading:false,})
              }
            }else{
              auth = true
            }

            if(auth){
          if(parseFloat(TotalValorCompra).toFixed(2) > parseFloat(TotalPago).toFixed(2)){
           
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Revice el pago total "
          }
          this.setState({Alert: add, loading:false})
          }
        else if(parseFloat(TotalValorCompra).toFixed(2) < parseFloat(TotalPago).toFixed(2)){
            let add = {
              Estado:true,
              Tipo:"warning",
              Mensaje:"El pago es mayor, al valor de compra "
          }
          this.setState({Alert: add, loading:false})
          }
          else if(parseFloat(TotalValorCompra).toFixed(2) == parseFloat(TotalPago).toFixed(2)&& parseFloat(TotalValorCompra).toFixed(2) > 0){
                  
            
            this.ingresador(TotalPago,TotalValorCompra)

            
          }  else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Error "
          }
          this.setState({Alert: add, loading:false})
          }}
        
        }
        
        }
        comprobadorAddInd=(TotalPago, TotalValorCompra)=>{
      
          if(this.state.loading == false){
            this.setState({loading:true})

            if(this.state.archivos.length>0){
              const miFormaData = new FormData()
              for(let i=0; i<=this.state.archivos.length;i++){
                miFormaData.append("file", this.state.archivos[i])
                miFormaData.append("folder", this.props.state.userReducer.update.usuario.user.DBname)
              
              
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
                this.comprobadorTypoUpload(TotalPago,TotalValorCompra)
              }
              }
                })
                .catch(error => {
               
                  console.log(error)}
                );
              }
             }else{
          this.comprobadorTypoUpload(TotalPago,TotalValorCompra)
             }
          
        }
        }
      
        setPreciosPago=(e)=>{
        
          let testFind =  this.state.Fpago.find(x => x.Id == e.Id)  
      
          let newIndex = this.state.Fpago.indexOf(testFind)
          let newArr = this.state.Fpago
          newArr[newIndex].Cantidad = e.Cantidad
          this.setState({Fpago:newArr})  
         }
         onFileChange = (files) => {
       
          this.setState({archivos:files})
        }
        handleChangeSwitch=(e)=>{
       
             let switchmame = e.target.name
       if(switchmame == "Iva"){
        let populares =  this.props.state.userReducer.update.usuario.user.Factura.populares== "true"?true:false 
        if(populares && this.state.Iva==false){
          this.setState({modalComprobacion:true,
            mensajeComprobacion:"Usted esta registrado como Negocios Populares, Seguro desea agregar el IVA?"
          })

        }else if(!populares && this.state.Iva==true){
          this.setState({modalComprobacion:true,
            mensajeComprobacion:"Usted esta registrado como Rimpe Emprendedores, Seguro desea quitar el IVA?"
          })
        }else{
          this.setState({[switchmame]:!this.state[switchmame]})
        }
      
       }else{
        this.setState({[switchmame]:!this.state[switchmame]})
       }
           
           
            
      
        }
      
        errorsSub=(err)=>{
          console.error(err)
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Revice los valores ingresados "
        }
        this.setState({Alert: add})
        }
        ingresador=(TotalPago, TotalValorCompra)=>{
                 
            
              let newstate = this.state
              newstate.TotalValorCompra = parseFloat(TotalValorCompra).toFixed(2)
              newstate.TotalPago = parseFloat(TotalPago).toFixed(2)
              newstate.Usuario ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
              
              var lol = JSON.stringify(newstate)

              fetch("/public/generate-compra-individual", {
                method: 'POST', // or 'PUT'
                body: lol, // data can be `string` or {object}!
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
                    Mensaje:` ${response.message}`  
                }
                this.setState({Alert: add, loading:false}) 
                }
               
              else {
               let add = {
                Estado:true,
                Tipo:"success",
                Mensaje:"Articulo Ingresada"
              }
              this.setState({Alert: add})
              setTimeout(()=>{
                this.props.dispatch(addArt(response.Articulo))
                this.props.dispatch(addCompra(response.Compra))
                this.props.dispatch(addRegs(response.Regs))
                this.props.dispatch(updateCuentas(response.Cuentas))
             
                this.Onsalida()},1200) 
              
              }
              })
        }
      
    render () {
      let tougleanimate = this.state.Cantidad > 0?true:false
      let flechaval = this.state.masCampos?"▲":"▼"
     
let buttonactiveVunit= this.state.Vunitario?"buttonactive":""
let buttonactivevtotal= this.state.Vtotal?"buttonactive":""
      var addToObject = function (obj, key, value, index) {

        // Create a temp object and index variable
        var temp = {};
        var i = 0;
      
        // Loop through the original object
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
      
            // If the indexes match, add the new item
            if (i === index && key && value) {
              temp[key] = value;
            }
      
            // Add the current item in the loop to the temp obj
            temp[prop] = obj[prop];
      
            // Increase the count
            i++;
      
          }
        }
      
        // If no index, add to the end
        if (!index && key && value) {
          temp[key] = value;
        }
      
        return temp;
      
      };
      let dataModel ={
        Iva: this.state.Iva,
       // Caduca: this.state.Caduca,
        EqId: {requerido:true,Tipo:"text"},
        Titulo: {requerido:true,Tipo:"text"},
        Categoria: {requerido:true,Tipo:"text"},
        SubCategoria: {requerido:false,Tipo:"text"},
        Garantia: {requerido:true,Tipo:"text"},
      

    
        
      }
      let dataModel2 ={
     
        DistribuidorID: {requerido:false,Tipo:"text"},
        Barcode:{requerido:false,Tipo:"text"},
        Grupo: {requerido:false,Tipo:"text"},
        Departamento: {requerido:false,Tipo:"text"},    
        Color: {requerido:false,Tipo:"text"},
        Calidad: {requerido:false,Tipo:"text"},
        Marca: {requerido:false,Tipo:"text"},
        Descripcion: {requerido:false,Tipo:"text"},
  
        
      }
     
    
     if(this.state.Caduca){
      var lunchWithTopping = addToObject(dataModel, 'Fecha_Caducidad', {requerido:true,Tipo:"date"}, 2);
      dataModel=lunchWithTopping
    }

 


      let dataArray  = Object.entries(dataModel)
      let dataArray2  = Object.entries(dataModel2)
    
 let datarender = dataArray.map((datillos,i,)=>{

let requerido = datillos[1].requerido ?["requerido"]:["vacio"]
let errmessage = datillos[1].requerido ?["Campo requerido"]:[""]

if(datillos[0]=="Caduca"||datillos[0]=="Iva"){
  return(
    <div key={i} className="contdetalleAIaddindi">
         <div className="boxp">
   <p >
     {datillos[0]}
     </p>
      <FormControlLabel
        control={
          <Switch
       
          onChange={this.handleChangeSwitch}
            name={datillos[0]}
            color="primary"
          checked={datillos[1]}
          />
        }
        label=""
      />
      </div>
</div>
  )
}
else if(datillos[0]=="Categoria"){
  console.log(datillos[1].requerido)
  return(
    <div key={i} className="contdetalleAIaddindi">
 
 <TextValidator
    label={datillos[0]}
     onClick={()=>{ this.setState({categoriaModal:true})}}
     name={datillos[0]}
     type={datillos[1].Tipo}
  value={this.state[datillos[0]]}
  validators={requerido }
  errorMessages={errmessage }
  InputProps={{
    readOnly: true, // Hace que el campo no sea editable
  }}
  style={{ cursor: 'pointer' }} 
 /> 
                <style >{`  
             .boxp{
              display: flex;
              justify-content: space-between;
              margin: 10px;
              width: 80%;
              align-items: center;
            }
           
                    .contdetalleAIaddindi {
                      display: flex;
                      flex-wrap: wrap;
                      justify-content: center;
                      margin: 25px;
                      padding: 5px;
                      border-radius: 9px;
                      box-shadow: 0px 1px 0px black;
                      width: 50%;
                      max-width: 225px;
                      min-width: 225px;
                      background: azure;
        }
   
      
  
                    
                     `}</style>
                </div>)
}
else if(datillos[0]=="SubCategoria"){
  return(
    <div key={i} className="contdetalleAIaddindi">
 
 <TextValidator
    label={datillos[0]}
 
     name={datillos[0]}
     type={datillos[1].Tipo}
  value={this.state.subCatSelect}
    
     validators={ requerido }
     errorMessages={errmessage }
     InputProps={{
      readOnly: true, // Hace que el campo no sea editable
    }}
    style={{ cursor: 'pointer' }} 
 /> 
                <style >{`  
             .boxp{
              display: flex;
              justify-content: space-between;
              margin: 10px;
              width: 80%;
              align-items: center;
            }
           
                    .contdetalleAIaddindi {
                      display: flex;
                      flex-wrap: wrap;
                      justify-content: center;
                      margin: 25px;
                      padding: 5px;
                      border-radius: 9px;
                      box-shadow: 0px 1px 0px black;
                      width: 50%;
                      max-width: 225px;
                      min-width: 225px;
                      background: azure;
        }
   
      
  
                    
                     `}</style>
                </div>)
}
else{
  return(
    <div key={i} className="contdetalleAIaddindi">
 
 <TextValidator
    label={datillos[0]}
     onChange={this.handleInput}
     name={datillos[0]}
     type={datillos[1].Tipo}
  value={this.state[datillos[0]]}

     validators={ requerido }
     errorMessages={errmessage }
    
 /> 
                <style >{`  
             .boxp{
              display: flex;
              justify-content: space-between;
              margin: 10px;
              width: 80%;
              align-items: center;
            }
           
                    .contdetalleAIaddindi {
                      display: flex;
                      flex-wrap: wrap;
                      justify-content: center;
                      margin: 25px;
                      padding: 5px;
                      border-radius: 9px;
                      box-shadow: 0px 1px 0px black;
                      width: 50%;
                      max-width: 225px;
                      min-width: 225px;
                      background: azure;
        }
   
      
  
                    
                     `}</style>
                </div>)
}


  
})

let datarender2 = dataArray2.map((datillos,i,)=>{

  let requerido = datillos[1].requerido ?["requerido"]:["vacio"]
  let errmessage = datillos[1].requerido ?["Campo requerido"]:[""]
  
  if(datillos[0]=="Caduca"||datillos[0]=="Iva"){
    return(
      <div key={i} className="contdetalleAIaddindi">
           <div className="boxp">
     <p >
       {datillos[0]}
       </p>
        <FormControlLabel
          control={
            <Switch
         
            onChange={this.handleChangeSwitch}
              name={datillos[0]}
              color="primary"
            checked={datillos[1]}
            />
          }
          label=""
        />
        </div>
  </div>
    )
  }
  
  else{
    return(
      <div key={i} className="contdetalleAIaddindi">
   
   <TextValidator
      label={datillos[0]}
       onChange={this.handleInput}
       name={datillos[0]}
       type={datillos[1].Tipo}
    value={this.state[datillos[0]]}
  
       validators={ requerido }
       errorMessages={errmessage }
      
   /> 
                  <style >{`  
               .boxp{
                display: flex;
                justify-content: space-between;
                margin: 10px;
                width: 80%;
                align-items: center;
              }
           
                      .contdetalleAIaddindi {
              display: flex;
              flex-wrap: wrap;
      justify-content:center;
      margin-top: 25px ;
      padding: 5px;
    border-radius: 9px;
    box-shadow: 0px 1px 0px black;
    width: 50%;
    max-width: 250px;
    min-width: 225px;
    background: azure;
          }
     
        
    
                      
                       `}</style>
                  </div>)
  }
  
  
    
  })
      let TotalPago = 0
      let generadorFormasdepago=""
      if(this.state.Fpago.length > 0){
         generadorFormasdepago= this.state.Fpago.map((item, i)=>(<FormasdePagoList
          key={item.Id}
          datos={item}  
          index={i}
          sendPrecio={(e)=>{this.setPreciosPago(e)}}
          editFormPago={(e)=>{this.editFormaPago(e)}}
          deleteForma={(e)=>{
      
            let nuevoarr = this.state.Fpago.filter(x => x.Id != e.Id)
            this.setState({Fpago:nuevoarr })
  
        }}
        />))

        for(let i = 0; i<this.state.Fpago.length;i++){
        
            TotalPago += parseFloat(this.state.Fpago[i].Cantidad)
        }
        
    }
    let TotalValorCompra=0
    if(this.state.Cantidad !="" && this.state.valUnitario !="")
{    if(this.state.Vunitario){
      TotalValorCompra= parseFloat(this.state.Cantidad) * parseFloat(this.state.valUnitario)
    }else{
      TotalValorCompra= parseFloat(this.state.valTotal)
    }}
    
      let  generadorArticulosListMasive = []    
    
    
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
   
        return ( 

         <div >

<div className="maincontacto" id="mainAddMasive" >
            <div className={`contcontacto `}  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Creación Individual </p>
           
        </div>
     
        </div>
     


  <div className="contDataScroll">
<div className="contImagenes ">
  <div className="titulocont"> 
    Imágenes
  </div>
  <DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />
            </div>
            <div className='jwFull centrar '>
              <div className='contdetalleAIaddindi custonbodega'>
              <p >
   Cuenta Inventario
       </p>    
            <select className="docRounded" value={this.state.cuentaInvSelect} onChange={this.handleChangeInv} >
  {this.state.CuentasInv.map((item,i)=>  <option key={i}  value={item.iDcuenta}>{item.NombreC} </option>)}
         </select>
         </div>
            </div>
            <div className="contForm">
            <ValidatorForm
   
   onSubmit={()=>this.comprobadorAddInd(TotalPago, TotalValorCompra)}
   onError={errors => {this.errorsSub(errors)}}
>
  <div className="datarenderCont">
 
           {datarender}
          




           <div  className="contdetalleAIaddindi"> 
      
      <div className="boxp">

   <TextValidator
    label="Cantidad"
     onChange={this.handleChangeValor}
     name="valCantidad"
     type="number"
     placeholder={0}
  value={this.state.Cantidad}
     validators={['requerido']}
     errorMessages={['Ingresa un valor'] }
     onWheel={(e) => e.target.blur()}
 /> 
     
     <select value={this.state.Medida} onChange={console.log("this.handleChangeCantidad")}>
     <option  value=""></option>
     <option  value="Unidades">Unidades</option>
     <option  value="Libras">Libras</option>
     <option  value="Kilos">Kilos</option>
     <option  value="Gramos">Gramos</option>
     </select>
     </div>
    </div>
    <div className="renderFilter">
      
      <span  onClick={()=>{this.setState({masCampos:!this.state.masCampos})}}> {flechaval}</span>
      
    
    <div className="masCampos">
<Animate show={this.state.masCampos}>
<div className="datarenderContno">
  
{datarender2}
</div>
</Animate>
</div>  
    </div>

 


    <div  className="contAdapt">
    <div  className="contdetalleAIaddindi"> 
    <div className="boxp">
    <button className={`buttonTotal ${buttonactiveVunit}`} onClick={(e)=>{e.preventDefault(); this.setState({Vunitario:true, Vtotal:false})}}>V.Unitario</button>
    <button className={`buttonTotal ${buttonactivevtotal}`} onClick={(e)=>{e.preventDefault();this.setState({Vunitario:false, Vtotal:true})}}>V.Total</button>
    </div>
    </div>
<Animate show={this.state.Vunitario}>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Compra Unitario"
     onChange={this.handleChangeGeneral}
     name="valUnitario"
     type="number"
  value={this.state.valUnitario}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     onWheel={(e) => e.target.blur()}
 /> 
</div>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Venta Unitario"
     onChange={this.handleChangeGeneral}
     name="Precio_Venta_Unitario"
     type="number"
  value={this.state.Precio_Venta_Unitario}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["Campo requerido "]}
     onWheel={(e) => e.target.blur()}
 /> 
</div>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Venta Alt Unitario"
     onChange={this.handleChangeGeneral}
     name="Precio_VentaAlt_Unitario"
     type="number"
  value={this.state.Precio_VentaAlt_Unitario}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     onWheel={(e) => e.target.blur()}
 /> 
</div>
</Animate>

<Animate show={this.state.Vtotal}>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Compra Total"
     onChange={this.handleChangeGeneral}
     name="valTotal"
     type="number"
  value={this.state.valTotal}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     onWheel={(e) => e.target.blur()}
 /> 
</div>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Venta Total"
     onChange={this.handleChangeGeneral}
     name="Precio_Venta_Total"
     type="number"
  value={this.state.Precio_Venta_Total}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     onWheel={(e) => e.target.blur()}
 /> 
</div>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Venta Alt Total"
     onChange={this.handleChangeGeneral}
     name="Precio_VentaAlt_Total"
     type="number"
  value={this.state.Precio_VentaAlt_Total}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     onWheel={(e) => e.target.blur()}
 /> 
</div>


</Animate>
</div>
    
           </div>

        
<Animate show={tougleanimate}>
<div className="contAddCompra">
                        <div className="grupoDatos totalcont">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total Compra: </p>
                     </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${parseFloat(TotalValorCompra).toFixed(2)}</p>
            
              </div>
                    </div></div>
<HelperFormapago
valorSugerido={parseFloat(TotalValorCompra).toFixed(2)}

onChange={(e)=>{this.setState(e)}}

/>

<div className="contBotonPago">
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
<button className={` btn btn-success botonedit2 `} type="submit">
<p>Comprar</p>
<i className="material-icons">
shopping_cart
</i>

</button>
  </Animate>
              
                    </div>  

          
                   
</Animate>
<Animate show={!tougleanimate}>  




<div className="contBotonPago">
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
<button className={` btn btn-primary botonedit2 `} type="submit">
<p>Crear</p>
<i className="material-icons">
add_circle_outline
</i>

</button>
  </Animate>
              
                    </div>  
</Animate>       
                    </ValidatorForm>
                    </div>
                    </div>

        </div>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>

  <Animate show={this.state.categoriaModal}>
       <Cat

       sendCatSelect={(cat)=>{
    this.setState({catSelect:cat, Categoria:cat.nombreCat,categoriaModal:false,subCatSelect:""})
       } }         

       sendsubCatSelect={(cat)=>{
        this.setState({catSelect:cat.estado.catSelect, subCatSelect:cat.subcat, Categoria:cat.estado.catSelect.nombreCat ,categoriaModal:false,})
           } }  

       Flecharetro3={
        ()=>{
          this.setState({categoriaModal:false, Categoria:"",catSelect:"",subCatSelect:""})
              
        }
       } 
       />
        </Animate >             
                    
       <Animate show={this.state.modalComprobacion}>
        <ModalComprobacionGeneral 
        Flecharetro={()=>{this.setState({modalComprobacion:false})}}
        Mensaje={this.state.mensajeComprobacion}
        SendOk={()=>{
          this.setState({Iva:!this.state.Iva,


          })

        }}
        
        />
        </Animate> 


           <style jsx>{`
           .datarenderCont{
        
            width: 100%;
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            
          }
            .contBotonPago{
              margin-top:20px;
              display: flex;
      justify-content: center;
      margin-bottom: 24px;
          }
         
                .cDc2{
                  margin-left:10px;
                }
           .cDc1{
            width:30%;
            text-align: right;
            
          }
          .proveedorInput{
            border-radius: 20px;
            text-align: center;
           }
               .totalcont{
                display: flex;
                background: #ffc903;
                align-items: center;
                border-radius: 12px;
                padding: 5px;
                border-bottom: 5px solid black;
                margin: 10px;
                max-width: 600px;
                width: 100%;
                height: 35px;
              }
              .contTitulos2{
                display:flex;
               
                font-size: 15px;
                font-weight: bolder;
                justify-content: space-around;
              
                width: 100%;
            }
            .titulocont{
              font-size: 20px;
    font-weight: bold;
    text-align: center;
            }
            .contImagenes{
              border-radius: 20px;
    padding: 5px;
    border:1px solid;
    width: 80%;
            }
            .contDataScroll{
              height: 78vh;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
            }
            .Artic100Fpago{
              width: 18%;  
              min-width:80px;
              max-width:100px;
              align-items: center;
              text-align:center;
          }
                    .contMainContado{
                      display:flex;
                      width: 100%;
                      justify-content: flex-end;
                      flex-flow: column;
                    }
                    .VendoresAgregados{
                      height: 200px;
                      border: 2px solid black;
                      margin: 5px;
                      border-radius: 11px;
                      background: #95f7f7;
                    }
                    

             .contenedorArticulos{
              overflow-x: scroll;
              min-height: 235px;
              background: #ffffff7a;
              padding: 15px;
              border-radius: 10px;
              max-width: 800px;
              margin: 8px;
              width: 100%;
              height: 40vh;
      }
      .botonAddCrom {
        display:flex;
    }
    .contAdapt{
      display: flex;
      width: 100%;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
    }
      .contContado{
        padding: 5px 10px;
        margin-top: 20px;
        border: 2px solid black;
        border-radius: 10px;
        background: aliceblue;
        max-width: 600px;
        width: 100%;
       }
       .contForm{
        width: 80%;
        padding-bottom: 25px;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
       }
       .totalp{
        text-align: center;
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 0px;
    }
           .inputUrl{
            width: 80%;
            border: 2px solid black;
            margin: 10px;
            padding: 5px;
            border-radius: 13px;
           }
           .totalcontPagos{
            background: #aecef4;
            align-items: center;
            border-radius: 12px;
            padding: 5px;
            width: 94%;
            display: flex;
            border-bottom: 2px solid black;
            margin-top: 20px;
        }
           .contColun{
            flex-flow: column;
           }
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:999999999
           }
             .contAddurl{
              display: flex;
              margin-bottom: 20px;
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
   .contdetalleAIaddindi2{
    display: flex;
    box-shadow: 0px 1px 0px black;
    max-width: 250px;
    min-width: 200px;
    box-shadow: 0px 1px 0px black;
    padding: 5px;
    margin-top: 20px ;
    border-radius: 9px;
    background: azure;
   }
           .cDc2{
     margin-left:10px;
   }
   .centerti{
    justify-content: center;
}
.contTitulosArt{
    display:inline-flex;
 
    font-size: 20px;
    font-weight: bolder;
}
  .eqIdart{
        width: 85px;  

        display: flex;
    }
    .renderFilter{
      cursor:pointer;
    }
    .tituloArtic{
        width: 250px;  
        display: flex;
    }
    .precioArtic{
        width: 100px; 
        display: flex;
    }
    .existenciaArtic{
        display: flex;
        width: 100px; 
        margin-right:10px;
    }

   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width:30%;
  text-align: right;
  
}
            


           .headercontact {

            display:flex;
            justify-content: space-around;

           }


           .inputUrl{
            width: 80%;
        }
      
           
       
   
        
        .maincontacto{
          z-index: 1001;
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
     
         width: 98%;
         background-color: white;
         min-height: 95vh;
         transition: 1s;
         height: 90vh;
       }
      
   .custonbodega p{
    margin:0px;
    padding-right:5px;
    padding-bottom:12px;
   }
      
      .docRounded{
        border-radius:10px;
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
     
       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
       }
          
       body {
            height:100%

           }

         

      

          .entradaaddc{
            left: 0%;
           }
           .buttonTotal{ 
           padding: 9px;
    border-radius: 20px;
    background: white;
    transition:1s;
           }
           .buttonactive{
            background: lightskyblue;
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
         .contcontacto{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
            .contcontacto{
              width: 85%;
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



