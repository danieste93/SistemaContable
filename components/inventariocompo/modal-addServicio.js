import React, { Component } from 'react'

import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Animate} from "react-animate-mount"
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { addArt} from '../../reduxstore/actions/regcont';
import DropFileInput from "../drop-file-input/DropFileInput"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ModalComprobacionGeneral from './usefull/modal-comprobacion-general';
import Cat from "./modalCategoriasArticulos"
class Contacto extends Component {
   
  state={
    loading:false,
    idReg:"",
    EqId:"",
    PrecioCompraServ:"",
  tiempo: new Date().getTime(),
  modalComprobacion:false,
    Alert:{Estado:false},
    Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
      Id:this.props.state.userReducer.update.usuario.user._id,
      Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
     },
     urlImg:[],
     archivos:[],
     
     TituloServ:"",
     Timereq:"",
     Iva:true,
     TimeMesuare:"Horas",   
     PrecioServ:"",
     PrecioServAlt:""   ,
     categoriaModal:false,
     Categoria:"",
     subCatSelect:"",
     catSelect:"",  
  }
    componentDidMount(){

      let populares =  this.props.state.userReducer.update.usuario.user.Factura.populares== "true"?true:false 

if(populares){
  this.setState({Iva:false})
}else{
  this.setState({Iva:true})
}

      setTimeout(function(){ 
        
        document.getElementById('mainAddServ').classList.add("entradaaddc")

       }, 500);
        
     this.getid()

     ValidatorForm.addValidationRule('requerido', (value) => {
      if (value === "" || value === " ") {
          return false;
      }
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
          console.log('response:', response)
            if(response.message == "error al decodificar el token"){
              this.props.dispatch(logOut());
              alert("Session expirada, vuelva a iniciar sesion para continuar");
                   
              Router.push("/ingreso")
            }else{
              this.setState({idCompra:response.cont.ContCompras,idReg:response.cont.ContRegs,EqId:response.cont.ContArticulos})
            }
      
       
        
        });
      
      }
      handleChangeSwitch=(e)=>{
       console.log(e)
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
      onFileChange = (files) => {
        console.log(files);
        this.setState({archivos:files})
      }
      comprobadorAddInd=()=>{
        let DBname = this.props.state.userReducer.update.usuario.user.DBname

        const userFolder = DBname ? `${DBname}/Articulos` : "uploads/default";
 
        if(this.state.loading == false){
          if(this.state.archivos.length>0){
            const miFormaData = new FormData()
            for(let i=0; i<=this.state.archivos.length;i++){
              miFormaData.append("file", this.state.archivos[i])
            
            
            miFormaData.append("upload_preset","perpeis7")
            miFormaData.append("folder", userFolder); // Aquí se define la carpeta del usuario
            
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
                 console.log(data)
                 if(data.secure_url){

            let archivos = this.state.urlImg
            let stateactualizado = [...archivos, data.secure_url]
            this.setState({urlImg:stateactualizado})
            if(stateactualizado.length == this.state.archivos.length){
              this.ingresador()
            }
            }
              })
              .catch(error => {
             
                console.log(error)}
              );
            }
           }else{
            console.log("ssasdcas")
            this.ingresador()
           }
        }
      }

      ingresador=()=>{
        var url = '/public/generate-service';
        let newstate = {...this.state}

        newstate.Usuario ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
        newstate.PrecioCompraServ = this.state.PrecioCompraServ == ""?0:this.state.PrecioCompraServ
        
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
          console.log('Success add Servicio:', response)
          if(response.message=="error al registrar"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Error en el sistema, porfavor intente en unos minutos"
          }
          this.setState({Alert: add, loading:false}) 
          }
          else if(response.message=="Nombre ya existente"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Nombre ya existente, modifícalo"
          }
          this.setState({Alert: add, loading:false}) 
          }
        else {
         let add = {
          Estado:true,
          Tipo:"success",
          Mensaje:"Servicio Ingresado"
      }
      this.setState({Alert: add})
      setTimeout(()=>{
        
        this.props.dispatch(addArt(response.Articulo))
        this.Onsalida()},1200) 

  }
        })
      }


      Onsalida=()=>{
        document.getElementById('mainAddServ').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
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

         <div >

<div className="maincontacto" id="mainAddServ" >
            <div className={`contcontacto `}  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Crear Servicio </p>
           
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
            <div className="contForm">
            <ValidatorForm
   
   onSubmit={()=>this.comprobadorAddInd()}
   onError={errors => {this.errorsSub(errors)}}
>
  <div className="datarenderCont">
  <div  className="contdetalleAI">
         <div className="boxp">
   <p >
IVA
     </p>
      <FormControlLabel
        control={
          <Switch
       
          onChange={this.handleChangeSwitch}
            name="Iva"
            color="primary"
          checked={this.state.Iva}
          />
        }
        label=""
      />
      </div>
</div>
  <div  className="contdetalleAI"> 
    <TextValidator
    label="Categoria"
    onClick={()=>{ this.setState({categoriaModal:true})}}
     name="Categoria"
     type="text"
  value={this.state.Categoria}

     validators={ ["requerido"] }
     errorMessages={ ["requerido"]  }
     InputProps={{
      disableUnderline: true, // Elimina el subrayado del input
      style: {
        pointerEvents: "none", // Bloquea la interacción del input, evita el cursor de escritura
      },
    }}
    style= {{
      cursor: "pointer",
      backgroundColor: "rgb(39 98 255 / 10%)",
      padding:"2px",
      borderRadius: "5px",
      borderBottom:"1px solid black"
    } }
 /> 
    </div>
    <div  className="contdetalleAI"> 
    <TextValidator
    label="Sub Categoria"
   onClick={()=>{ this.setState({categoriaModal:true})}}
     name="SubCategoria"
     type="text"
  value={this.state.subCatSelect}
   InputProps={{
      disableUnderline: true, // Elimina el subrayado del input
      style: {
        pointerEvents: "none", // Bloquea la interacción del input, evita el cursor de escritura
      },
    }}
    style= {{
      cursor: "pointer",
      backgroundColor: "rgb(39 98 255 / 10%)",
      padding:"2px",
      borderRadius: "5px",
      borderBottom:"1px solid black"
    } }
 /> 
    </div>
        

         
    <div  className="contdetalleAI"> 
    <TextValidator
    label="Titulo"
     onChange={this.handleChangeGeneral}
     name="TituloServ"
     type="text"
  value={this.state.TituloServ}

     validators={ ["requerido"] }
     errorMessages={ ["requerido"]  }
    
 /> 
    </div>
    <div  className="contdetalleAI"> 
    <TextValidator
    label="Precio Compra"
     onChange={this.handleChangeGeneral}
     name="PrecioCompraServ" 
     type="number"
  value={this.state.PrecioCompraServ}
        placeHolder="0"
  
    
 /> 
    </div>
    <div  className="contdetalleAI"> 
      
      <div className="boxp">

   <TextValidator
    label="Tiempo Requerido"
     onChange={this.handleChangeGeneral}
     name="Timereq"
     type="number"
     placeholder={0}
  value={this.state.Timereq}
     validators={['requerido']}
     errorMessages={['Ingresa un valor'] }
    
 /> 
     
     <select name ="TimeMesuare" value={this.state.TimeMesuare} onChange={this.handleChangeGeneral}>
    
     <option  value="Horas">Horas</option>
     <option  value="Libras">Minutos</option>
  
     </select>
     </div>
    </div>
    <div  className="contdetalleAI"> 
    <TextValidator
    label="Valor"
     onChange={this.handleChangeGeneral}
     name="PrecioServ"
     type="number"
  value={this.state.PrecioServ}
        placeholder={1}
     validators={ ["requerido"] }
     errorMessages={ ["requerido"]  }
    
 /> 
    </div>
    <div  className="contdetalleAI"> 
    <TextValidator
    label="Valor Alternativo"
     onChange={this.handleChangeGeneral}
     name="PrecioServAlt"
     type="number"
  value={this.state.PrecioServAlt}
  placeholder={1}
     validators={ ["requerido"] }
     errorMessages={ ["requerido"]  }
    
 /> 
    </div>

           </div>

           <div className="contBotonPago">
                    <button className={` btn btn-success botonedit2 `} type="submit">
<p>Agregar</p>
<i className="material-icons">
add
</i>

</button>
                    </div>
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
 {this.state.categoriaModal &&
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
       />}
        
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
            .contBotonPago{
              margin-top:30px;
              display: flex;
      justify-content: center;
      margin-bottom: 24px;
          }
            .Artic100Fpago{
              width: 18%;  
              min-width:80px;
              max-width:100px;
              align-items: center;
              text-align:center;
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
           
    .boxp{
      display: flex;
      justify-content: space-between;
      margin: 10px;
      width: 80%;
      align-items: center;
    }
           
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:999999999
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


          
      
            
       
             .contdetalleAI {
              display: flex;
              flex-wrap: wrap;
      justify-content:center;
      margin-top: 25px ;
      padding: 5px;
    border-radius: 9px;
    box-shadow: 0px 1px 0px black;
    width: 40%;
    min-width: 280px;
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

         

      

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
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



