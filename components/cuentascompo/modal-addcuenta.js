import React, { Component } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Animate } from "react-animate-mount";
import FilledInput from '@material-ui/core/FilledInput';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {connect} from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import {addCuenta, addRegs} from "../../reduxstore/actions/regcont"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import SelectIcons from "./modal-select-icons"
import SelectFondo from "./modal-select-fondo"
import Router from 'next/router';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { CircularProgress } from '@material-ui/core';
class ModalAddCuenta extends Component {
   constructor(props) {
    super(props);
    this.nombreInputRef = React.createRef();
   }
   state={
    Alert:{Estado:false},
    filtrosflecha:false,
     loading:false,
    checkedA:true,
    checkedP:true,
    visibility:true,
    Tipo:"",
    err1:false,
    err2:false,
    NombreC:"",
    Dinero:"",
    DineroActual:"",
    Permisos:["administrador"],
    Vendedor:false,
    Tesorero:false,
    Auxiliar:false,
    Tipos:[],
    Fpago:"Efectivo",
    limiteCredito:0,
    selectIcon:false,
    selectFondo:false,
    urlIcono:"/iconscuentas/coins.png",
    fondo:"Solido",
    colorCuenta:"#ffffff",
    fondoImagen:"/fondoscuentas/amex1.png"
   }

    componentDidMount(){

   
      var url = '/cuentas/rtyhgf456/getcounterAddcuentas';
      setTimeout(function(){ 

        document.getElementById('mainaddc').classList.add("entradaaddc")
  
       }, 200);

       // Retraso adicional para el focus del input después de que aparezca el popup
       setTimeout(() => {
         if (this.nombreInputRef.current) {
           this.nombreInputRef.current.focus();
         }
       }, 600);

      
      }

    


      handleChangeIncTotal=()=>{
this.setState({checkedA:!this.state.checkedA})
      }  

      handleChangePosesion=()=>{
        this.setState({checkedP:!this.state.checkedP, checkedA:false})
              } 
      
      getTipeCuentas=()=>{

if(this.props.state.RegContableReducer.Tipos && this.props.state.RegContableReducer.Tipos.length > 0){

  let gene = this.props.state.RegContableReducer.Tipos.map((tipo,i)=>(<option key={i}>{tipo}</option>))


  return  (gene)
}else{
  return  (<option>No existen tipos de cuenta</option>)
}   
      }
      handleChangeGeneraltougle=(e)=>{
if(e.target.name === "Vendedor"){
  this.setState({Vendedor:!this.state.Vendedor})
}else if
(e.target.name === "Tesorero"){
  this.setState({Tesorero:!this.state.Tesorero})
}
else if
(e.target.name === "Auxiliar"){
  this.setState({Auxiliar:!this.state.Auxiliar})
}
        }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
        comprobador=()=>{
          console.log(this.state)
          if(this.state.loading == false){
            this.setState({loading:true})
          if(this.state.Tipo != ""){
            document.getElementById('selectipo').classList.remove("errequerido")
          }
          else{
              document.getElementById('selectipo').classList.add("errequerido")
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:"El Tipo de Cuenta no puede estar vacio"
            }
            this.setState({ helper:"",  Alert: add, loading:false})
          }
          if(this.state.NombreC != ""){
            this.setState({err1:false, helper:"" })
          }
          else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"El Nombre no puede estar vacio"
          }
            this.setState({err1:true, Alert: add, loading:false })
          }
       

          if(this.state.Dinero >=0){            
          
            this.setState({err2:false })
          }
          else{
            console.log("dentro del error d")
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"El Importe no puede ser menor a 0"
          }
            this.setState({err2:true,Alert: add, loading:false })
          }
          if(this.state.Tipo != "" && this.state.NombreC != ""){
        
                 let permisos = this.state.Permisos
            

                      if(this.state.Vendedor){
                 permisos.push("vendedor")
                      }
                      if(this.state.Tesorero){
                      permisos.push("tesorero")
                     }
                     if(this.state.Auxiliar){
                   permisos.push("auxiliar")
                     }
                     let valores = this.state
                     if(this.state.Dinero == "" || this.state.Dinero == " "|| this.state.Dinero == "  "){
                      valores.Dinero = 0
                     }

                     let datos = {Permisos: permisos,
                      valores,
                      Usuario : {
                        DBname:this.props.state.userReducer.update.usuario.user.DBname,
                        Usuario:this.props.state.userReducer.update.usuario.user.Usuario,
                       _id:this.props.state.userReducer.update.usuario.user._id,
                       Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                      },
                    }      

           

            let lol = JSON.stringify(datos)
            
      let url = "/cuentas/addcount"   
  fetch(url, {
    method: 'PUT', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    console.log( response)
    if(response.status=="error"){
            
               let add = {
        Estado:true,
        Tipo:"error",
        Mensaje:response.message
    }
    this.setState({loading:false,Alert:add }) 
            
          }
    else {
             
              
  
        this.props.dispatch(addCuenta(response.Cuenta))
        this.props.dispatch(addRegs(response.Reg))
this.Onsalida()
    }
    
  });
          }

        }
        }

        Onsalida=()=>{
          document.getElementById('mainaddc').classList.remove("entradaaddc")
          setTimeout(()=>{ 
            this.props.Flecharetro4()
          }, 500);
        }
    render () {
      let flechaval = this.state.filtrosflecha?"▲":"▼"
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

    <div id="mainaddc" className={`maincontacto-modalcuentas entrada`} >
      <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Agregar Nueva Cuenta </p>
           
        </div>
     
        </div>


<div className="contPrin">

<div className="contDatosC">
        <div className="grupoDatos">
        <div className="cDc1 alinemiento">
              <p style={{fontWeight:"bolder"}}>  Tipo * </p>
       
              </div>
              <div id =""className="cDc2 alinemiento"style={{border:"none"}} >
              <select name="Tipo" id="selectipo" style={{width:"100%"}} className="tipe" value={this.state.tipo}onChange={this.handleChangeGeneral} >

<option value="No"> </option>
{this.getTipeCuentas()}



</select>
<i className="material-icons i3D" onClick={()=>{
  console.log("enaddtipo")
  this.props.agregarTipo()}} >  add</i>
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Nombre * </p>
            
              </div>
              <div id =""className="cDc2" >
              <TextField 
            error={this.state.err1}
               fullWidth 
               name="NombreC"
                onChange={this.handleChangeGeneral} 
                id="standard-basic"
                 label=""
                 helperText={this.state.helper}
                 inputRef={this.nombreInputRef}
                 
                 />
            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder", textAlign:"left"}}>  Dinero Inicial * </p>
            
              </div>
              <div id =""className="cDc2" >
              <FilledInput
          fullWidth
            id="filled-adornment-amount"
            type="number"
            style={{background:"white",paddingLeft:"0px"}}
            name="Dinero"
            placeholder={0}
            value={this.state.Dinero}
            onWheel={(e) => e.target.blur()}
            onChange={this.handleChangeGeneral}
            error={this.state.err2}
          
            startAdornment={<InputAdornment 
           
              style={{marginTop:"16px"}}
              position="start">$</InputAdornment>}
          />
            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1 ">
              <p style={{fontWeight:"bolder"}}>  Icono  </p>
            
              </div>
              <div id =""className="cDc2 customcd2 " >
              <div id =""className="contIcono " onClick={()=>{this.setState({selectIcon:true})}} >
                
           <img className='iconoCuenta jwPointer' src={this.state.urlIcono} />
            
              </div>
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1 ">
              <p style={{fontWeight:"bolder"}}>  Fondo  </p>
            
              </div>
              <div className="cDc2 customFondo" >
                <div className='jwFull jwCenter'>
              <RadioGroup aria-label="category" name="category1" value={this.state.fondo} >
              <div  className="radiobox"> 
              <FormControlLabel value="Solido" control={<Radio  />} label="Solido" onClick={(e)=>{this.setState({fondo:e.target.value})}}/>
           
         
            
              <FormControlLabel value="Imagen" control={<Radio  />} label="Imagen" onClick={(e)=>{this.setState({fondo:e.target.value})}}/>
   
              </div>
              
        </RadioGroup>
        </div>
        <div className='jwFlex jwColumn jwCenter'>
            <Animate show={this.state.fondo == 'Imagen'}>
            <div id =""className="contImagenFondo " onClick={()=>{this.setState({selectFondo:true})}} >
                
                <img className='fondoCuenta jwPointer' src={this.state.fondoImagen} />
                 
                   </div>
            </Animate>
            <Animate show={this.state.fondo == 'Solido'}>
            <input type="color" onChange={(e)=>{this.setState({colorCuenta:e.target.value})}} id="favcolor" name="favcolor" value={this.state.colorCuenta}/>
            </Animate>
              </div>
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1 ">
              <p style={{fontWeight:"bolder"}}>  Descripción  </p>
            
              </div>
              <div id =""className="cDc2 " >
              <TextField  fullWidth name="DescripC" onChange={this.handleChangeGeneral} id="standard-basic" label="" />
            
              </div>
              </div>
            

              </div>
            
          <div className="contDatosX">   
          <div className="grupoDatos">
        <div className="cDc1x">
              <p style={{fontWeight:"bolder"}}>  Posesión (Liquidez)  </p>
            
              </div>
              <div id =""className="cDc2x" >
        
      <FormControlLabel
        control={
          <Switch
            checked={this.state.checkedP}
            onChange={this.handleChangePosesion}
            name="checkedP"
            color="primary"
          />
        }
        label=""
      />
            
              </div>
        </div>
          <div className="grupoDatos">
        <div className="cDc1x">
              <p style={{fontWeight:"bolder"}}>  Incluir en el total (Capital)   </p>
            
              </div>
              <div id =""className="cDc2x" >
        
      <FormControlLabel
        control={
          <Switch
            checked={this.state.checkedA}
            onChange={this.handleChangeIncTotal}
            name="checkedB"
            color="primary"
            disabled={!this.state.checkedP}
          />
        }
        label=""
      />
            
              </div>
              </div>
              
              <div className="grupoDatos">
        <div className="cDc1x">
              <p style={{fontWeight:"bolder"}}>  Visible  </p>
            
              </div>
              <div id =""className="cDc2x" >
                <Animate show={this.state.visibility}>
              <i className="material-icons"  onClick={()=>{this.setState({visibility:!this.state.visibility})}}>  visibility</i>
              </Animate>
              <Animate show={!this.state.visibility}>
              <i className="material-icons"  onClick={()=>{this.setState({visibility:!this.state.visibility})}}>  visibility_off</i>
              </Animate>
              </div>
              </div>
      
      
      
          
          
           </div>
     
<div className="contDatosX">
<p className="subtituloArt">Permisos</p>
  <div className="grupoDatos">
   
<div className="contcheckbox">
  <div className="grupoch">
  <Checkbox
   name="Vendedor"
        checked={this.state.Vendedor}
        onChange={this.handleChangeGeneraltougle}
        color="primary"
      />
      <p>Vendedor</p>
  </div>
  <div className="grupoch">
  <Checkbox
   name="Tesorero"
        checked={this.state.Contador}
        onChange={this.handleChangeGeneraltougle}
        color="primary"
      />
      <p>Tesorero</p>
  </div>
  
</div>
  </div>
</div>

<div className="" onClick={()=>{this.setState({filtrosflecha:!this.state.filtrosflecha})}}>
              <div className="renderFilter " >
              <span> Configuración con Punto de Venta</span>
              <span className='jwPointer'>  {flechaval}</span>
                 
                 </div>
                 </div>
              <Animate show={this.state.filtrosflecha}>
              <div className="contDatosX">   
              <div className="grupoDatos">
        <div className="cDc1 ">
              <p style={{fontWeight:"bolder"}}>  Cuenta Acepta: </p>
            
              </div>
              <div id =""className="cDc2 " >
              <select name="Fpago" id="selectipo" style={{width:"100%"}} className="tipe" value={this.state.Fpago}onChange={this.handleChangeGeneral} >

<option value="Efectivo">Efectivo </option>
<option value="Tarjeta-de-Credito">Tarjeta de Crédito </option>
<option value="Tarjeta-de-Debito">Tarjeta de Débito </option>
<option value="Transferencia">Transferencia </option>
</select>
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1 ">
              <p style={{fontWeight:"bolder"}}>  Límite de Crédito   </p>
            
              </div>
              <div id =""className="cDc2 " >
               <FilledInput
          fullWidth
            id="filled-adornment-amount"
            type="number"
            style={{background:"white",paddingLeft:"0px"}}
            name="limiteCredito"
            onWheel={(e) => e.target.blur()}
            value={this.state.limiteCredito}
            onChange={this.handleChangeGeneral}

           
            startAdornment={<InputAdornment 
           
              style={{marginTop:"16px"}}
              position="start">$</InputAdornment>}
          />
            
              </div>
              </div>

              </div>
              </Animate>
     
    


     <Animate show={!this.state.loading}>
               <div className="jwContCenter">
  <button  onClick={this.comprobador} id="botonadd"  className="botoncontact jwPointer ">Agregar</button>
</div>
</Animate>

     <Animate show={this.state.loading}>
      <div className='centrar'>
        <CircularProgress/>
      </div>
</Animate>
</div>
        </div>
    
    
        <Animate show={this.state.selectIcon}>
<SelectIcons 
 Flecharetro={()=>{this.setState({selectIcon:false})}} 
 sendUrl={(url)=>{this.setState({urlIcono:url,selectIcon:false })}} 
/>
    </Animate>
    <Animate show={this.state.selectFondo}>
<SelectFondo
 Flecharetro={()=>{this.setState({selectFondo:false})}} 
 sendUrl={(url)=>{this.setState({fondoImagen:url,selectFondo:false })}} 
/>
    </Animate>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
  
           <style jsx>{`

          .contPrin{
            margin-top:5%;
         
    display: flex;
    flex-flow: column;
    justify-content: space-around;
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
          max-width:300px;
              box-shadow: -4px 6px 8px #635c5cc4;
          }
           .errequerido{
            border-color: red;

           }
           .MuiSnackbar-anchorOriginBottomCenter{
            z-index:2001;
           }
         .contcheckbox{
          display: flex;
          justify-content: space-around;
          width: 100%;
         }


           .cDc1x{
            width: 75%;
            display: flex;
            align-items: center;
           }
             .grupoDatos{
              display: flex;
              justify-content: space-around;
              margin-top: 15px;
              width: 100%;
             }
          
             
     .renderFilter{
      margin-top: 31px;
      display: flex;
      width: 70%;
      max-width: 300px;
      justify-content: space-around;
     }    
   
 
   .cDc2{
    margin-left:10px;
    width:60%;
    border-bottom: 3px double grey;
   display: flex;
   align-items: flex-end;
   transition:1s  easy-out

  }
  .customFondo{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    border: 1px double black;
    border-radius: 15px;
    padding: 5px;
    border-bottom: 3px solid black;
  }
  
  .cDc2x{
    margin-left:10px;

    width:15%;
   display: flex;
   align-items: center;
   trasition:1s  easy-out
   flex-flow: column;
   flex-flow: column;
   justify-content: center;
  }

  .cdc2active2{
   border-bottom: 5px double green;
  }
  .cDc2 p{
   margin:0px;

 }
 .cDc2x p{
  margin:0px;

}   
.cDc1x p{
  margin:0px;

} 
  

 .contDatosC{
  display:flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  box-shadow: -3px 6px 8px #000000c4;
  padding:20px 10px;
  border-radius: 5px;
  font-size: 15px;
  flex-flow: column;
}
.contDatosX{
  margin-top:15px;
  display:flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  box-shadow: -3px 6px 8px #000000c4;
  padding:20px 10px;
  border-radius: 5px;
  font-size: 15px;
  flex-flow: column;
}

   .cDc1{

    width: 30%;
    display: flex;
    align-items: flex-end;
    
  }
  
 
  .cDc1 p{
  
  margin:0px;
    
  }
       .contIcono{
        background: whitesmoke;
        border-radius: 50%;
        padding: 5px;
        display: flex;
        justify-content: center;
        border-bottom: 4px solid black;
        height: 80px;
        margin-top: 10px;
       } 
.iconoCuenta{
  width: 95%;
    border-radius: 50%;
}
.customcd2{
  border-bottom: none;
  justify-content: center;
}

           .headercontact {

            display:flex;
            justify-content: space-around;

           }


.contImagenFondo{
  width: 100%;
  max-width: 300px;
  display: flex;
}
      
  .fondoCuenta{
    width: 100%;
    margin-top: 10px;
  }
        
        .maincontacto{
          z-index: 1301;
         width: 100vw;
         height: 100vh;
         background: rgba(255,255,255,0.45);
         backdrop-filter: blur(8px);
         -webkit-backdrop-filter: blur(8px);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition: 0.5s;
         overflow: hidden;
       }

       .entradaaddc{
        left: 0%;
       }


       .contcontacto{
        animation: popupSlideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        border-radius: 30px;
        height: 95%;
        width: 96%;
         background-color: white;
         padding: 15px;
         overflow: scroll;
         overflow-x: hidden;
         padding-bottom: 40px;
         will-change: transform, opacity;
       }

@keyframes popupSlideDown {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    opacity: 0.8;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
     
   
      
       .alinemiento{
        align-items: center;
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

         
      
        
             @media only screen and (max-width: 600px) {
    .contcontacto {
      width: 98vw;
      min-width: 0;
      max-width: 340px;
      margin: 0 auto;
      padding: 0 4px 120px 4px;
      overflow-y: auto;
      max-height: 100vh;
      box-sizing: border-box;
      overscroll-behavior: contain;
    }
    .maincontacto {
      background: rgba(255,255,255,0.45) !important;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      margin: 0 auto !important;
      width: 100vw !important;
      height: 100vh !important;
    }
    .botoncontact {
      margin-bottom: 48px !important;
    }
    .jwFlex.column.centrar {
      flex-direction: row !important;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-bottom: 8px;
    }
    .botoncontact {
      width: 90vw;
      max-width: 320px;
      font-size: 1.1rem;
      padding: 12px 0;
      margin: 12px auto 8px auto;
      display: block;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
         .botoncontact {
          margin-bottom: 48px !important;
         }
         .botoncontact {
          margin-bottom: 48px !important;
         }
         .jwFlex.column.centrar {
          flex-direction: row !important;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 8px;
         }
         .botoncontact {
          width: 90vw;
          max-width: 320px;
          font-size: 1.1rem;
          padding: 12px 0;
          margin: 12px auto 8px auto;
          display: block;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
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

const mapStateToProps = (state, props) =>  {
 

  const usuario = state.userReducer

  return {
  
 state
  }
};

export default connect(mapStateToProps, null)(ModalAddCuenta);
