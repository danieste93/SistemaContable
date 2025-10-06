import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { Animate } from "react-animate-mount";
import Router from 'next/router';
import {connect} from 'react-redux';
import {updateUser} from "../reduxstore/actions/myact"
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Modal from "../components/modalregister"
import Modalreset from "../components/modalresetpass"
import Head from "next/head"
import postal from 'postal';
import CircularProgress from '@material-ui/core/CircularProgress';
import {logOut} from "../reduxstore/actions/myact"
import { cleanData} from "../reduxstore/actions/regcont";
import Checkbox from '@material-ui/core/Checkbox';
import Link from "next/link"
class Mainpage extends Component {
 state = {
    correoLogin:"",
    passLogin:"",
    registro:false,
    login:true,
    passReg:"",
    passReg2:"",
     telefonoReg:"",
    emailReg:"",
    usuarioReg:"",
    snackerror1:false,
    snackerror2:false,
    snackerror3:false,
    mailtoshow:"",
    modal:false,
    condiciones:false,
    resetpass:false,
    loading:false,
 }
 channel1 = null;
 channel2 = null;
 componentDidMount(){
console.log(this.props)
  this.channel1 = postal.channel();
  this.channel2 = postal.channel();
  if(this.props.state.userReducer != ""){
    let user = this.props.state.userReducer.update.usuario.user


if( this.props.state.userReducer != ""){
  console.log("token valido")
let tiempo = new Date().getTime() / 1000

  let decode  = this.props.state.userReducer.update.usuario.decodificado 
  if(tiempo < decode.exp){
 
    if(user.Tipo === "administrador"){

      Router.push("/usuarios/administrador")
  
    }else if(user.Tipo === "vendedor" || user.Tipo === "tesorero" ){
      Router.push("/usuarios/vendedor")
    }
  }

}
 

  }


  
    ValidatorForm.addValidationRule('requerido', (value) => {
      if (value === "") {
          return false;
      }
      return true;
  });
  ValidatorForm.addValidationRule('soloNumeros', (value) => {
    if (isNaN(value)) {
        return false;
    }
    return true;
});
ValidatorForm.addValidationRule('minimo7', (value) => {
 let cadena = value.toString()

  if (cadena.length >= 7) {
      return true;
  }
  return false;
});
ValidatorForm.addValidationRule('minimo6', (value) => {
  let cadena = value.toString()

   if (cadena.length >= 6) {
       return true;
   }
   return false;
 });
        
 ValidatorForm.addValidationRule('correoval', (value) => {

 const regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
 var regex2 = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z\-]{3,8}\.)+[a-zA-Z]{2,4}$/;

   if (regex2.test(value)) {
       return true;
   }
   return false;
 });

    }//fin did
    handleChangeCondiciones=(e)=>{
      this.setState({
        condiciones: !this.state.condiciones
      })
       }

    handleChangeform=(e)=>{
        this.setState({
            [e.target.name] : e.target.value
        })
         }

         generadorTokens=()=>{
          console.log("en generadador tokens ")
          this.channel2.publish('setTokenTimerset2', {
            message: this.props.state.userReducer.update.usuario.decodificado
         });
         }
          
registroFuncion=(e)=>{

console.log(this.state)

  if(this.state.loading == false){
  
    this.setState({loading:true})
    if(this.state.passReg2 == this.state.passReg){
      if(this.state.condiciones){
   var url = '/users/register';
   var data = {Usuario:this.state.usuarioReg.trim().replace(" ", "-"),
               TelefonoContacto:this.state.telefonoReg,
               Correo:this.state.emailReg.toLowerCase(),
               Contrasena:this.state.passReg,
               RegistradoPor:"usuario",
               Confirmacion:false,
               }

  var lol = JSON.stringify(data)

   fetch(url, {
     method: 'POST', // or 'PUT'
     body: lol, // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .catch(error => console.error('Error:', error))
   .then(response => {console.log('Success:', response)

   if(response.status === "Ok"){
            
   this.setState({ modal:true,loading:false})
      
   }
   else if(response.status =="error"){

    if(response.message === "El correo ya esta registrado"){
       this.setState({snackerror1:true, loading:false})
    }
   else if(response.message === "error al registrar"){
    this.setState({ loading:false})
      alert("Error al registrar, vuelva a intentar")
   }
}
  
});}else {
  alert("Acepte los terminos y condiciones")
  this.setState({loading:false})
}



}else {
  alert("las Contraseñas no coinciden")
  this.setState({loading:false})
}
}
 }

 loginFuncion=(e)=>{
  if(this.state.loading == false){
    this.setState({loading:true})
    var url = '/users/authenticate';
    var data = {Correo:this.state.correoLogin.toLowerCase(),
                Contrasena:this.state.passLogin
                              }
  
   var lol = JSON.stringify(data)

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: lol, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response)

        if(response.status === "Ok"){
            const usuario = response.data
            this.channel1.publish('setTokenTimer', {
              message: response.data.decodificado
           });
           let localstate = {userReducer: usuario.user, }


           const serializedState = JSON.stringify(localstate)
           localStorage.setItem("state", serializedState)
           this.props.dispatch(cleanData());
           this.props.dispatch(logOut());
           
           this.props.dispatch(updateUser({usuario}))  
                  
            if(response.data.user.Tipo === "administrador"){
              Router.push("/usuarios/administrador")
            
            }
            else if(response.data.user.Tipo === "vendedor" || response.data.user.Tipo === "tesorero" ){
              Router.push("/usuarios/vendedor")
            }

        }

        else if(response.status =="error"){
         
            if(response.message === "no existe el correo"){
               this.setState({snackerror2:true,loading:false})
            }
           else if(response.message === "Invalid password!!"){
                this.setState({snackerror3:true,loading:false})
             }
        
        
        }
       
    }
    );}
  }

  componentClicked = (response) => {
   
  console.log(response)
  }
  loginRegisFacebook= (response) => {
   
      let passgenerator = response.id 


    var url = '/users/checkfbdata';
    var datafb = {Usuario:response.name,           
      Correo:response.email,   
      Contrasena:passgenerator,
      Imagen:  response.picture.data.url,
      RegistradoPor:"facebook",
      Confirmacion:true
      }
      var lolfb = JSON.stringify(datafb)  
     
      fetch(url, {
        method: 'POST', // or 'PUT'
        body: lolfb, // data can be `string` or {object}!
       headers:{
          'Content-Type': 'application/json'
       }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log( response)
        if(response.message == "Exito en el registro" || response.message == "Exito en el login"){
          this.channel1.publish('setTokenTimer', {
            message: response.data.decodificado
         });
          const usuario = response.data
          let localstate = {userReducer: usuario.user, }


          const serializedState = JSON.stringify(localstate)
          localStorage.setItem("state", serializedState)
          this.props.dispatch(cleanData());
          this.props.dispatch(logOut());
          this.props.dispatch(updateUser({usuario}))  


         if(usuario.user.Tipo === "administrador"){
              Router.push("/usuarios/administrador")
            
            }
            else if(usuario.user.Tipo=== "vendedor"|| response.data.user.Tipo === "tesorero" ){
              Router.push("/usuarios/vendedor")
            }
        
        }
       
      })
    }

 render() {
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      const handleClose = (event, reason) => {
      
         this.setState({snackerror1:false,snackerror2:false,snackerror3:false})
        
    }
  return(
   <div className="jwMainContainer">

     <Head>
     <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

     </Head>
        <div className="jwSubContainer">
        <div className="jwCard">
            <div className="jwContCard">
<Animate show={this.state.login}>
           
            <p className="tituloArt">Ingresa</p>

            <div className="jwseccionCard">
            <ValidatorForm
   id="forming"
   onSubmit={this.loginFuncion}
   onError={errors => console.log(errors)}
>
<div className="contenidoForm">
    <div className="customInput">
        <div className="jwminilogo">
        <img src="/icons/account_box.svg" alt=""/>
</div>
      <TextValidator
      label="Correo"
       onChange={this.handleChangeform}
       name="correoLogin"
       type="email"
       validators={['requerido',"correoval"]}
       errorMessages={['Escribe tu correo Electronico',"Escribe un correo válido"]
      
      }
       value={this.state.correoLogin}
   />
   </div>
   <div className="customInput">
   <div className="jwminilogo">
   <img src="/icons/key.svg" alt=""/>
</div>
   <TextValidator
       label="Contraseña"
       onChange={this.handleChangeform}
       name="passLogin"
       type="password"
       validators={["requerido", "minimo6"]}
       errorMessages={['Escribe una contraseña válida', "Mínimo 6 dígitos"]}
       value={this.state.passLogin} 
   />
   </div>
   </div>
   <div className="jwseccionCard buttoncont " style={{marginBottom:0}}>

    <button type="submit" className="botonGeneral loginbutton">Ingresar</button>
   
</div>
</ValidatorForm>

<div className="buttoncont">
<FacebookLogin
 size="medium"
    appId="1072382560151619"

    disableMobileRedirect={true}
 
    fields="name,email,picture"
    onClick={this.componentClicked}
    callback={this.loginRegisFacebook}
    render={renderProps => (
        <button className="logFacebook" onClick={renderProps.onClick}  >
        <img src="/static/social/logofb.png" alt="facebook" className="imagenboton"/>
        <p>Ingresa con Facebook</p>
        </button > 
      )}
    
    />
 
</div>
<div className="buttoncont">
<p style={{color:"blue", fontStyle:"italic", marginTop:"10px", textDecoration:"underline", cursor:"pointer", fontSize:"16px"}}onClick={()=>{this.setState({resetpass:true, login:false})}}>Olvidaste tu contraseña?</p>
 
</div>
<div className="buttoncont">
<p style={{color:"blue", fontStyle:"italic", textAlign:"center", marginTop:"100px", textDecoration:"underline", cursor:"pointer"}}onClick={()=>{this.setState({registro:true, login:false})}}>Regístrate</p>
 
</div>
            </div>



          
            </Animate>
            <Animate show={this.state.registro}>
       
            <p className="tituloArt">Área de Registro</p>
   
            <div className="jwseccionCard">
            
                <p className="jwcomentario">Los campos que contengan un * son obligatorios</p>
            <ValidatorForm

   onSubmit={this.registroFuncion}
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
      label="Usuario*"
      onChange={this.handleChangeform}
      name="usuarioReg"
      type="text"
      validators={['requerido']}
       errorMessages={['Escribe tu usuario'] }
       value={this.state.usuarioReg}
   />
   </div>
   <div className="customInput">
   <div className="jwminilogo">
   <span className="material-icons">
email 
</span>
</div>
   <TextValidator
       label="Correo Electrónico*"
       onChange={this.handleChangeform}
       name="emailReg"
       type="email"
       validators={['requerido',"correoval"]}
       errorMessages={['Escribe tu correo Electronico',"Escribe un correo válido"]}
       value={this.state.emailReg} 
   />
   </div>
   <div className="customInput">
   <div className="jwminilogo">
   <span className="material-icons">
contact_phone
   </span>
</div>
   <TextValidator
       label="Teléfono de contacto"
       onChange={this.handleChangeform}
       name="telefonoReg"
       type="number"
       validators={["minimo7"]}
       errorMessages={["Mínimo 7 números"]}
       value={this.state.telefonoReg} 
   />
   </div>
  
   <div className="customInput">
   <div className="jwminilogo">
   <span className="material-icons">
vpn_key
</span>
</div>
   <TextValidator
       label="Contraseña*"
       onChange={this.handleChangeform}
       name="passReg"
       type="password"
       validators={["requerido", "minimo6"]}
       errorMessages={['Escribe una contraseña válida', "Mínimo 6 caracteres"]}
       value={this.state.passReg} 
   />
   </div>
   <div className="customInput">
   <div className="jwminilogo">
   <span className="material-icons">
vpn_key
</span>
</div>
   <TextValidator
       label="Confirma Contraseña*"
       onChange={this.handleChangeform}
       name="passReg2"
       type="password"
       validators={["requerido", "minimo6"]}
       errorMessages={['Escribe una contraseña válida', "Mínimo 6 caracteres"]}
       value={this.state.passReg2} 
   />
   </div>
<div className='centrar custonCondiciones'>
   <Checkbox
   name="condiciones"
        checked={this.state.condiciones}
        onChange={this.handleChangeCondiciones}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      /> 
      <span>Acepto los 
                                                    <Link href="/terminos-y-condiciones"><a target="_blank" > Terminos y condiciones<a /></a></Link> </span>
</div>
   <div className="jwseccionCard buttoncont">
   <Animate show={this.state.loading}>
    <CircularProgress />
   </Animate>
    <Animate show={!this.state.loading}>

<button type="submit" className="botonGeneral loginbutton">Registrarse</button>
</Animate>


</div>
   </div>
</ValidatorForm>


<div className="jwseccionCard jwW100percent">
    <div className="jwminiCard" onClick={()=>{this.setState({registro:false,login:true})}}>
<span className="material-icons">
undo
</span>
<p> Regresa al ingreso</p>

</div>
</div>
            </div>




           
            </Animate>
     
        </div>
      
        </div>
            </div>
            <Animate show={this.state.modal}>
            <Modal flechafun={()=>{this.setState({modal:false,   registro:false,
    login:true,})}} datos={this.state.datos} />
            </Animate>
            <Animate show={this.state.resetpass}>
            <Modalreset flechafun={()=>{this.setState({resetpass:false, login:true})}}  />
            </Animate>

            <Snackbar open={this.state.snackerror1} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="error">
        <p style={{textAlign:"center"}}>Ya estas registrado con ese correo electrónico {this.state.mailtoshow} </p>
    
    </Alert>
  </Snackbar>
  <Snackbar open={this.state.snackerror2} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="error">
        <p style={{textAlign:"center"}}>El correo electrónico {this.state.mailtoshow} no existe </p>
    
    </Alert>
  </Snackbar>
  <Snackbar open={this.state.snackerror3} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="error">
        <p style={{textAlign:"center"}}>La Contraseña es Incorrecta </p>
    
    </Alert>
  </Snackbar>
            <style jsx> {`
            form{
                    width:100%
                }
                .custonCondiciones{
                  border:1px solid darkblue;
                  border-radius:15px;
                }
                `}
               
            </style>
   </div>
    )
   }
 }



const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(Mainpage);