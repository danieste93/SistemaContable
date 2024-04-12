import React, { Component } from 'react'

import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Animate} from "react-animate-mount"
import HtmlDescrip from "./modal-htmldescrip"
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { addArt, addCompra,addRegs,updateArt,updateCuentas } from '../../reduxstore/actions/regcont';


import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DropFileInput from "../drop-file-input/DropFileInput"
import HelperFormapago from "../reusableComplex/helperFormapago"
import CircularProgress from '@material-ui/core/CircularProgress';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "../reusableComplex/herlperDrag"
import Cat from "./modalCategoriasArticulos"
class Contacto extends Component {
   
  state={
    
    loading:false,
    htmlDescrip:false,
    Fpago:[],
    addFormaPago:false,
    ContContado:false,
    ContEgreso: false,
    categoriaModal:false,
    Justificacion:"",
    cuentaInvSelect:this.props.data.Bodega_Inv,
    codpunto:"001",
        codemision:"001",
        numeroFact:"0000000000",
        nombreComercial:"",
        Ruc:"",
    Precio_Compra:this.props.data.Precio_Compra,
    Precio_Compra_Total:this.props.data.Precio_Compra,
    Eqid:this.props.data.Eqid,
  tiempo: new Date().getTime(),
    
    Alert:{Estado:false},
    Vendedor :{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
      Id:this.props.state.userReducer.update.usuario.user._id,
      Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
    },
     urlImg:this.props.data.Imagen,
     
     masCampos:false,
     readOnly:false,
        archivos:[],
        id:this.props.data._id,
        Categoria:this.props.data.Categoria.nombreCat,
  
        subCatSelect:this.props.data.SubCategoria,
        catSelect:this.props.data.Categoria,
        Grupo: this.props.data.Grupo,
        Departamento: this.props.data.Departamento,
        Titulo: this.props.data.Titulo,
        Color: this.props.data.Color,
        Calidad: this.props.data.Calidad,
        Marca: this.props.data.Marca,
        Descripcion: this.props.data.Descripcion,
        Garantia: this.props.data.Garantia,
        AntiExis: this.props.data.Existencia,  
        Existencia: this.props.data.Existencia,  
        Cantidad:this.props.data.Existencia,
         Precio_Compra: this.props.data.Precio_Compra,
        Precio_Venta: this.props.data.Precio_Venta,
        Precio_Alt: this.props.data.Precio_Alt,
        newImg:"",
        idCompra:"",
        idReg:"",
        Caduca:this.props.data.Caduca.Estado,
        Iva:this.props.data.Iva,
        Fecha_Caducidad:this.props.data.Caduca.FechaCaducidad,
        Medida:this.props.data.Medida=="Unidad"?"Unidades":"Gramos",
        Vunitario:true,
        Vtotal:false,
        Precio_VentaAlt_Total:this.props.data.Precio_VentaAlt_Lote,
      
        Precio_Venta_Unitario: this.props.data.Precio_Venta.toFixed(2),
        Precio_VentaAlt_Unitario: this.props.data.Precio_Alt.toFixed(2),
        valTotal: this.props.data.Precio_Venta_Lote,
        Precio_Venta_Total: this.props.data.Precio_Venta_Lote,
        DistribuidorID:this.props.data.Diid,
        Barcode:this.props.data.Barcode,
  }
    componentDidMount(){
    
    console.log(this.props)
      setTimeout(function(){ 
        
        document.getElementById('mainAddMasive').classList.add("entradaaddc")

       }, 500);
    


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
  
      onDragEnd = async ({ destination, source }) => {
        // dropped outside the list
        if (!destination) return;
    
        const newItems = reorder(this.state.urlImg, source.index, destination.index);
    
   
        // Create a new array here!
      
        
       

        this.setState({urlImg:newItems})

         

      };
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

      handleInput=(e)=>{

        this.setState({[e.target.name]:e.target.value})
     
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
        handleClickCat=(e)=>{
          
          this.setState({categoriaModal:true})
        }
     
         onFileChange = (files) => {
        
          this.setState({archivos:files})
        }
        
        errorsSub=(err)=>{
          
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Revice los valores ingresados "
        }
        this.setState({Alert: add ,loading:false})
        }
        setPreciosPago=(e)=>{
        
          let testFind =  this.state.Fpago.find(x => x.Id == e.Id)  
      
          let newIndex = this.state.Fpago.indexOf(testFind)
          let newArr = this.state.Fpago
          newArr[newIndex].Cantidad = e.Cantidad
          this.setState({Fpago:newArr})  
         }
        uploadimages=(TotalPP, TotalPago,cantidadEgreso)=>{
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
          let archivos = this.state.newImg
          let stateactualizado = [...archivos, data.secure_url]
          this.setState({newImg:stateactualizado})
      
          if(stateactualizado.length == this.state.archivos.length){
           
            this.ingresadorEdirArt(TotalPP, TotalPago, cantidadEgreso)
          }
          }
            })
            .catch(error => {
           
              console.log(error)}
            );
          }
          
          
          
          }

           justUploadimages=()=>{
          
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
            let archivos = this.state.newImg
            let stateactualizado = [...archivos, data.secure_url]
          
            this.setState({newImg:stateactualizado})
        
            if(stateactualizado.length == this.state.archivos.length){
       
              this.submitFunc()
            }
            }
              })
              .catch(error => {
             
                console.log(error)}
              );
            }
            
            
            
            }

            submitFunc=()=>{
              if(this.state.ContContado == false && this.state.ContEgreso == false){   
              
                let user = this.props.state.userReducer.update.usuario.user.Tipo
                if(this.state.Existencia > this.props.data.Existencia ){
               
                  if(user == "administrador" || user == "tesorero"|| user == "vendedor"){
                           let add = {
                            Estado:true,
                            Tipo:"info",
                            Mensaje:"Existencia superior, agruegue una cuenta para generar una compra "
                        }
                        this.setState({Alert: add, ContContado:true,ContEgreso:false,readOnly:true,loading:false})
                      }else{
                        let add = {
                          Estado:true,
                          Tipo:"warning",
                          Mensaje:"Sin permisos para editar, cantidades de inventario. Solicitar al administrador o tesorero "
                      }
                      this.setState({Alert: add,})
                      
                      }
                      
                        }
                        else if(this.state.Existencia < this.props.data.Existencia ){
                          if(user == "administrador" || user == "tesorero"){
                          let add = {
                            Estado:true,
                            Tipo:"warning",
                            Mensaje:"Es menor el numero de existencias, se generara una baja de inventario. Justifique en el recuadro"
                        }
                        this.setState({Alert: add, ContEgreso:true,ContContado:false,readOnly:true,loading:false})
                          } else{
                           
                              let add = {
                                Estado:true,
                                Tipo:"warning",
                                Mensaje:"Sin permisos para editar, cantidades de inventario. Solicitar al administrador o tesorero "
                            }
          
                            this.setState({Alert: add,})
                          }
                           
                      }
                        
                   
                       else if (this.state.Existencia == this.props.data.Existencia ) {
                             
                              var url = '/public/editart';
                
                              let newdata = {...this.state}
                              newdata.UserData =    {DBname:this.props.state.userReducer.update.usuario.user.DBname   }               
                            var lol = JSON.stringify(newdata)
              
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
                             
                if(response.message=="error al registrar"){
                    let add = {
                      Estado:true,
                      Tipo:"error",
                      Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                  }
                  this.setState({Alert: add, loading:false,}) 
                  }else{
                
                              let add = {
                              Estado:true,
                              Tipo:"success",
                              Mensaje:"Articulo Actualizado"
                            }
                            this.setState({Alert: add})
                            setTimeout(()=>{
                              console.log(response)
                              this.props.dispatch(updateArt(response.artUpdate))
                              this.Onsalida()},1000) 
                          }  
                          
                          })
                            
                            }
                         }
            }

          handleChangeSwitch=(e)=>{

           
          
               let switchmame = e.target.name
               if(switchmame == "Caduca"){
                if(this.state.Caduca){
               
                  this.setState({[switchmame]:true})
                }else{
               
                  this.setState({[switchmame]:false})
                }                

               }else{
             
             
                this.setState({[switchmame]:!this.state[switchmame]})
              }
        
          }
        
          editFormaPagoact=(e)=>{
            this.setState({editFormaPago:true, SelectFormaPago:e})
        }
          ingresadorEdirArt=(TotalPP, TotalPago, cantidadEgreso)=>{


                        if(this.state.ContContado  && this.state.ContEgreso == false){

           
            
                        if(parseFloat(TotalPP).toFixed(2) > parseFloat(TotalPago).toFixed(2)){
                          let add = {
                            Estado:true,
                            Tipo:"error",
                            Mensaje:"Revice el pago total"
                        }
                        console.log("pasando")
                        this.setState({Alert: add ,loading:false})
                        setTimeout(()=>{
                          this.setState({loading:false})
                        },500)
                        }
                        else if(parseFloat(TotalPP).toFixed(2) < parseFloat(TotalPago).toFixed(2)){
                          let add = {
                            Estado:true,
                            Tipo:"warning",
                            Mensaje:"El pago es mayor, al valor de compra "
                        }
                        this.setState({Alert: add,loading:false})
                        setTimeout(()=>{
                          this.setState({loading:false})
                        },500)
                        }
                        else  if(parseFloat(TotalPP).toFixed(2) == parseFloat(TotalPago).toFixed(2) && parseFloat(TotalPP) > 0 ){
                          
                          if(this.state.loading == false){
                            this.setState({loading:true})
                       
                          var url = '/public/editartcompra';
                          let newdata = {...this.state}
                          newdata.TotalPago = parseFloat(TotalPago).toFixed(2)
                          newdata.UserData =    {DBname:this.props.state.userReducer.update.usuario.user.DBname   }               
                          var lol = JSON.stringify(newdata)
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
                           
                            if(response.message=="error al registrar"){
                              let add = {
                                Estado:true,
                                Tipo:"error",
                                Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                            }
                            this.setState({Alert: add, loading:false})
                          }
                          else{
                            let add = {
                             Estado:true,
                             Tipo:"success",
                             Mensaje:"Articulo Actualizado y Compra Generada"
                         }
                         this.setState({Alert: add})
                         
                        setTimeout(()=>{ 
                          this.props.dispatch(updateArt(response.Articulo))
                          this.props.dispatch(addRegs(response.Regs))
                          this.props.dispatch(addCompra(response.Compra))
                          this.props.dispatch(updateCuentas(response.Cuentas))
                          
                          
                          this.Onsalida()},1200) 
                         
                        
                      }
                        })
                        }
                        }
                        else{
                          let add = {
                            Estado:true,
                            Tipo:"error",
                            Mensaje:"Error"
                        }
                        this.setState({Alert: add, loading:false})
                        }
                        
                        }

                        else if(this.state.ContContado== false  && this.state.ContEgreso ){
                          if(this.state.Justificacion != ""){
                          var url = '/public/editart-salida-inventario';
                          let newdata = {...this.state}
                          newdata.TotalPP = TotalPP * -1
                          newdata.TotalEgreso = cantidadEgreso
                          newdata.UserData =    {DBname:this.props.state.userReducer.update.usuario.user.DBname   }       
                          var lol2 = JSON.stringify(newdata)
                          fetch(url, {
                            method: 'POST', // or 'PUT'
                            body: lol2, // data can be `string` or {object}!
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
                                Mensaje:"Salida de Inventario, Generada"
                            }
                            this.setState({Alert: add})
                            setTimeout(()=>{ 
                              this.props.dispatch(updateArt(response.Articulo))
                              this.props.dispatch(addRegs(response.Regs))
                              this.props.dispatch(updateCuentas(response.Cuentas))
                              this.Onsalida()},1200) 
                            }
                          })}   else{
                            let add = {
                              Estado:true,
                              Tipo:"error",
                              Mensaje:"Justifique la perdida"
                          }
                          this.setState({Alert: add, loading:false})
                          }
                        }
                      
                      
                      

            
          
        }
      
        
     comprobadorEdit=(TotalPP, TotalPago, cantidadEgreso)=>{
      if(this.state.loading == false){
        console.log("pasando2222")
        this.setState({loading:true})
       if(this.state.archivos.length > 0 && this.state.ContContado == false){
     
       this.uploadimages(TotalPP, TotalPago, cantidadEgreso)
      }else {
       

        this.ingresadorEdirArt(TotalPP, TotalPago, cantidadEgreso)
        
      }
}
     }
     deleteImg=(img)=>{

let newimg = this.state.urlImg.filter(x=> x !=img)
this.setState({urlImg:newimg})
     }
    render () {
      console.log(this.state)
      let flechaval = this.state.masCampos?"▲":"▼"
      let buttonactiveVunit= this.state.Vunitario?"buttonactive":""
      let buttonactivevtotal= this.state.Vtotal?"buttonactive":""
    let findCuenta = {NombreC:"asd"}

    if(this.props.state.RegContableReducer.Cuentas){
      findCuenta = this.props.state.RegContableReducer.Cuentas.find(x => x.iDcuenta ==this.state.cuentaInvSelect )
    }

      let TotalPago = 0
      if(this.state.Fpago.length > 0){

        for(let i = 0; i<this.state.Fpago.length;i++){
        
            TotalPago = TotalPago + this.state.Fpago[i].Cantidad
        }
      }
     let cantidadComprar = this.state.Existencia - this.props.data.Existencia
     let cantidadEgreso =this.props.data.Existencia - this.state.Existencia
    
     let TotalPP=  (cantidadComprar * this.state.Precio_Compra).toFixed(2)

      let imgpreview =""
      const itemPoreditar = this.props.data
   

if(this.state.urlImg.length > 0){
  imgpreview = this.state.urlImg.map((imagen, i)=>{
    return(
      <Draggable
    draggableId={`${imagen}`}
    index={i}
    key={imagen}
  >
{(provided, snapshot) =>{
  let isDragging = snapshot.isDragging ? "draggingListItem" : ""
return(
      <div 
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    
      className={`contimg ${isDragging}`}
      
      >
      <img  src={imagen} style={{width:"40%", maxWidth:"250px", margin:"10px"}}/>
      <button className=" btn btn-danger botoneditArt" onClick={()=>{this.deleteImg(imagen)}}>

x

</button>
<style >{`
  .botoneditArt{
    height: 25px;
     width: 25px;
     padding:1px;
     border-radius:10px;
     margin:3px;
   }
.contimg{
  border:1px solid darkblue;
  border-radius:15px;
  max-width: 250px;
  margin: 6px;
  display:flex;
  justify-content: space-between;
    align-items: center;
}
.draggingListItem: {
  background: "rgb(235,235,235)"
}
 .contForm{
  width: 80%;
  padding-bottom: 25px;
display: flex;
flex-flow: column;
justify-content: center;
align-items: center;
 }
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
      .contContado{
        padding: 5px 10px;
        margin-top: 20px;
        border: 2px solid black;
        border-radius: 10px;
        background: aliceblue;
        max-width: 600px;
        width: 100%;
       }
     
       .totalp{
        text-align: center;
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 0px;
    }
           
         
           .contColun{
            flex-flow: column;
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


        
      
            .botonventa{
            
              margin-top: 17px;
    border-radius: 10px;

    background-color: #048b0b;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
    color: #fff;
    transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4,0,0.2,1);
    height: 36px;
    line-height: 2.25rem;
    font-family: Roboto,sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    -webkit-letter-spacing: 0.06em;
    -moz-letter-spacing: 0.06em;
    -ms-letter-spacing: 0.06em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: none;
    width: 40%;
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
       }
      
   
      
       .ContData{
        min-height:95vh;
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
          
      

          

      
          
          
           `}</style>
      </div>)
 
}}

      </Draggable>
      )
  })
}
      
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
        Caduca: this.state.Caduca,
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
 
if(datillos[0]=="Iva"){
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
}else if(datillos[0]=="Caduca" ){
  return(
  <div key={i} className="contdetalleAIaddindi">
     <div className="boxp">
  <p >
  {datillos[0]}
  </p>
  <FormControlLabel
    control={
      <Switch
      disabled
 
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
   
    return(
      <div key={i} className="contdetalleAIaddindi">
  
   <TextValidator
      label={datillos[0]}
       onClick={this.handleClickCat}
       name={datillos[0]}
       type={datillos[1].Tipo}
    value={this.state[datillos[0]]}
    validators={["requerido"] }
    errorMessages={["Campo requerido"] }  
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
  let requerido = datillos[1].requerido ?["requerido"]:["vacio"]
let errmessage = datillos[1].requerido ?["Campo requerido"]:[""]
return(
<div key={i} className="contdetalleAIaddindi">

<TextValidator
label={datillos[0]}
onChange={this.handleInput}
name={datillos[0]}
type={datillos[1].Tipo}
value={this.state[datillos[0]]}
disabled={datillos[1].disable}
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
let datarender2 = dataArray2.map((datillos,i,)=>{

  let requerido = datillos[1].requerido ?["requerido"]:["vacio"]
  let errmessage = datillos[1].requerido ?["Campo requerido"]:[""]
  

  

    return(
      <div key={i} className="contDetallesEditArt">
   
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
           
                      .contDetallesEditArt {
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
  
  
  
    
  })
      let  generadorArticulosListMasive = []    
    
      let contData = this.state.ContData?"ContData":""
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
            <div className={`contcontacto ${contData}`}  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Editar Articulo</p>
           
        </div>
     
        </div>
     


  <div className="contDataScroll">
<div className="contImagenes ">
  <div className="titulocont"> 
    Imágenes
  </div>
  
<DragDropContext onDragEnd={this.onDragEnd}>
    <Droppable droppableId="droppable-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  
               <div className='contDrop'>
                  {imgpreview}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
      </DragDropContext>
  <DropFileInput
                onFileChange={(files) => this.onFileChange(files)}
            />
            </div>
            <div className='jwFull centrar '>
              <div className='contdetalleAIaddindi custonbodegaeditart'>
              <p >
   Cuenta Inventario
       </p>    
       <select  className="docRounded" value={this.state.cuentaInvSelect}  >
 <option  value={this.state.cuentaInvSelect}>{findCuenta.NombreC} </option>
         </select>
         </div>
            </div>
            <div className="contForm">
            <ValidatorForm
   
   onSubmit={  (e)=> {
    if(this.state.loading == false){
   this.setState({loading:true})
    if(this.state.archivos.length > 0 && this.state.ContContado == false){
     
  this.justUploadimages()
     }else{
      this.submitFunc()
     }}

  
 
  
  }}
   onError={errors => {this.errorsSub(errors); this.setState({loading:false})}}
>
  <div className="datarenderCont">
 
           {datarender}

           <div className='fullw'>
       
           <div  className="contdetalleAIaddindi"> 
      
      <div className="boxp">

   <TextValidator
    label="Cantidad"
    onWheel={(e) => e.target.blur()}
    onChange={this.handleChangeGeneral}
     name="Existencia"
     type="number"
     placeholder={0}
  value={this.state.Existencia}
     validators={['requerido']}
     errorMessages={['Ingresa un valor'] }
     InputProps={{
      readOnly: this.state.readOnly,
    }}
 /> 
     
     <select  disabled value={this.state.Medida} onChange={this.handleChangeCantidad}>
     <option  value=""></option>
     <option  value="Unidades">Unidades</option>
     <option  value="Libras">Libras</option>
     <option  value="Kilos">Kilos</option>
     <option  value="Gramos">Gramos</option>
     </select>
     </div>
    </div>
   
    <div className="renderFilter" onClick={()=>{this.setState({masCampos:!this.state.masCampos})}}> {flechaval}</div>
    </div>
    <div className="datarenderContno">
           <Animate show={this.state.masCampos}>

  <div className="subcampos">
{datarender2}

</div>
<div className='centrar'>
<button className={` customper` } onClick={(e)=>{this.setState({htmlDescrip:true});e.stopPropagation(); e.preventDefault()}}> Descripcion HTML</button> 
</div>
</Animate>
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
     name="Precio_Compra"
     type="number"
  value={this.state.Precio_Compra}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     InputProps={{
      readOnly: this.state.readOnly,
    }}
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
     errorMessages={["requerido"]}
     InputProps={{
      readOnly: this.state.readOnly,
    }}
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
     InputProps={{
      readOnly: this.state.readOnly,
    }}
    
 /> 
</div>
</Animate>

<Animate show={this.state.Vtotal}>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Compra Total"
  
     name="valTotal"
     type="number"
  value={this.props.data.Precio_Compra * this.props.data.Existencia}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     InputProps={{
      readOnly: this.state.readOnly,
    }}
 /> 
</div>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Venta Total"
     name="Precio_Venta_Total"
     type="number"
     disabled={true}
  value={this.state.Precio_Venta_Total}
     placeholder={0}     
     validators={ ["requerido"]}
     errorMessages={["requerido"]}
     InputProps={{
      readOnly: this.state.readOnly,
    }}
 /> 
</div>
<div  className="contdetalleAIaddindi2"> 
<TextValidator
    label="Precio Venta Alt Total"
    disabled={true}
     onChange={this.handleChangeGeneral}
     name="Precio_VentaAlt_Total"
     type="number"
  value={this.state.Precio_VentaAlt_Total}
     placeholder={0}     
     InputProps={{
      readOnly: this.state.readOnly,
    }}
    
 /> 
</div>


</Animate>
</div>



           </div>



        

            <Animate show={this.state.ContContado == false && this.state.ContEgreso == false}>
                    <div className="contBotonPago">
                    <Animate show={this.state.loading}>
                    <CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
                    <button type='submit'  className={` btn btn-primary botonedit2 `}  >
<p>Editar</p>
<i className="material-icons">
edit
</i>

</button>
</Animate>
                    </div>
                    </Animate>
                    <Animate show={this.state.ContContado}>
                 
               
                    <div className="grupoDatos totalcontCompra">
                    <div className="cDc1">

              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Cantidad por comprar: </p>
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total Compra: </p>
              </div>
              <div className={`cDc2 inputDes `}>
             
                <p className="totalp">{cantidadComprar}</p>
                <p className="totalp">${TotalPP}</p>
              </div>
                    </div> 
                    <HelperFormapago    
                    
                    valorSugerido={TotalPP}

                    onChange={(e)=>{this.setState(e)}}
                    
                    />  
      
                    <div className="contBotonPago">

                    <Animate show={this.state.loading}>
<CircularProgress />
</Animate>
<Animate show={!this.state.loading}>
                    <button onClick={()=>   this.comprobadorEdit(TotalPP, TotalPago, cantidadEgreso)}  className={` btn btn-success botonedit2 `} >
<p>Editar y Comprar</p>
<i className="material-icons">
shopping_cart
</i>

</button></Animate>
                    </div>
         </Animate>
         <Animate show={this.state.ContEgreso}>
         <div className="grupoDatos totalcontCompra">
                    <div className="cDc1">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'> Salida Total de Inventario: </p>
            
              </div>
              <div className={`cDc2 inputDes `}>
                <p className="totalp">${TotalPP * -1}</p>
            
              </div>
                    </div> 
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
                    <div className="contBotonPago">
                   
                    <Animate show={this.state.loading}>
<CircularProgress />
</Animate>
             
<Animate  show={!this.state.loading}>
                    <button onClick={(e)=>   {this.comprobadorEdit(TotalPP, TotalPago, cantidadEgreso)}}  className={` btn btn-warning botonedit2 `} >
<p>Editar y Egresar</p>
<i className="material-icons">
shopping_cart
</i>

</button></Animate>

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
  <Animate show={this.state.htmlDescrip}>
    <HtmlDescrip userData={this.props.User} data={this.props.data}   Flecharetro={()=>{this.setState({htmlDescrip:false})}} />
  </Animate>

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
                    <style jsx>{`
           .datarenderCont{
        
            width: 100%;
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            
          }
          .spinnerCoti{
            width: 50%;
            display: flex;
            justify-content: center;
            margin-top: 20px;
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
            .customper{
              max-width: 200px;
              margin-top: 20px;
              background: lightgreen;
              font-size: 20px;
              font-weight: bolder;
              padding: 10px;
              border-radius: 22px;
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
                    .fullw{
                      width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
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
    .datarenderContno{
      width: 100%; 
    
    }
    .subcampos{
      display:flex;
      
    flex-wrap: wrap;
    display: flex;
    justify-content: space-around;
    margin-top: 5px;

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
    .totalcontCompra{
      display: flex;
    border: 1px solid;
    margin-top: 14px;
    justify-content: space-around;
    align-items: center;
    border-radius: 22px;
    }
       
          
           .contColun{
            flex-flow: column;
           }
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:999999999
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
   .contDetallesEditArt2{
    display: flex;
    box-shadow: 0px 1px 0px black;
    max-width: 250px;
    min-width: 200px;
    box-shadow: 0px 1px 0px black;
    padding: 5px;
    margin-top: 20px ;
    border-radius: 9px;
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
    .custonbodegaeditart p{
      margin:0px;
      padding-right:15px;
    
     }
        
        .docRounded{
          border-radius:10px;
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
     
       .contDrop{
      display:flex;
      flex-flow: column;
        width: 100%;
        align-items: center;
       }
       body
            {
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
           p{
            margin-bottom:0px;
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