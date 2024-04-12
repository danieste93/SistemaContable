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
   if(response.status != 'unknown'){
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
    }}

 render() {
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      const handleClose = (event, reason) => {
      
         this.setState({snackerror1:false,snackerror2:false,snackerror3:false})
        
    }
  return(
   <div className="jwMainContainer">

     

	<div className="screen">
  <div className="screen__content">
  <Animate show={this.state.login}>
 
			<div className="login">
      <div className="loginSeccion">
            <ValidatorForm
   id="forming"
   onSubmit={this.loginFuncion}
   onError={errors => console.log(errors)}
>
<div className="contenidoForm">
    <div className="customInputIndex">
        <div className="jwminilogoIndex">
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
   <div className="customInputIndex">
   <div className="jwminilogoIndex">
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
   <Animate show={this.state.loading}>
<CircularProgress />
</Animate>
<Animate show={!this.state.loading}>

<button type="submit" className="button login__submit">
					<span className="button__text">Ingresa</span>
					<i className="material-icons button__icon">
      arrow_forward_ios
          </i>
				</button>	
</Animate>

</ValidatorForm>
	

<div className="buttoncont customContrasena">
<p style={{color:"blue", fontStyle:"italic", marginTop:"10px", textDecoration:"underline", cursor:"pointer", fontSize:"13px"}}onClick={()=>{this.setState({resetpass:true, login:false})}}>Olvidaste tu contraseña?</p>
 
</div>

<button  className="button login__submit botonregistro" onClick={()=>{this.setState({registro:true, login:false})}}>
					<span className="button__text">Regístrate</span>
				
				</button>	


            </div>
					
			</div>
			<div className="social-login">
				<h3>Ingresa con </h3>
				<div className="social-icons">
				
					<a href="#" className="social-login__icon fab fa-facebook"></a>
					<FacebookLogin
 size="medium"
    appId="1072382560151619"

    disableMobileRedirect={true}
 
    fields="name,email,picture"
    onClick={this.componentClicked}
    callback={this.loginRegisFacebook}
    render={renderProps => (
     
        <img src="/static/social/logofb.png" onClick={renderProps.onClick} alt="facebook" className="imagenboton"/>
      
      
      )}
    
    />
				</div>
			</div>
	
    </Animate>
    <Animate show={this.state.registro}>
 
    
      <div className="RegisSeccion">
    
<div className="jwFlex jwCenter">
<div className="jwPointer" onClick={()=>{this.setState({registro:false,login:true})}}>
<span className="material-icons">
undo
</span>


</div>
      <p className="tituloArt">Registrate</p>
      </div>
      <div className="jwseccionCard customRegis">
    
       
    <ValidatorForm

onSubmit={ this.registroFuncion}
onError={errors => console.log(errors)}
>
<div className="RegisSeccion">

<div className="jcustomInputRegis">
<div className="jwminilogoIndex">
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
<div className="jcustomInputRegis">
<div className="jwminilogoIndex">
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
<div className="jcustomInputRegis">
<div className="jwminilogoIndex">
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

<div className="jcustomInputRegis">
<div className="jwminilogoIndex">
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
<div className="jcustomInputRegis">
<div className="jwminilogoIndex">
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
<span>Acepto los         <Link href="/terminos-y-condiciones"><a target="_blank" > Terminos y condiciones<a /></a></Link> </span>

</div>

<div className="jwseccionCard buttoncont centrar">
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
<Animate show={!this.state.loading}>

<button type="submit" className="botonGeneral Regisbutton">Registrarse</button>
</Animate>


</div>
</div>
</ValidatorForm>



    </div>
      </div>	
     
     
  
    </Animate>
    </div>
		<div className="screen__background">
			<span className="screen__background__shape screen__background__shape4"></span>
			<span className="screen__background__shape screen__background__shape3"></span>		
			<span className="screen__background__shape screen__background__shape2"></span>
			<span className="screen__background__shape screen__background__shape1"></span>
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
                  border: 1px solid darkblue;
                  border-radius: 15px;
                  background: white;
                  border-bottom: 3px solid black;
                  margin-top: 36px;
                }


* {
	box-sizing: border-box;

}



.container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
}

.screen {		
	background: linear-gradient(90deg, #5D54A4, #7C78B8);		
	position: relative;	
  margin-top: 0px;
	width: 320px;	
  border-radius: 10px;
  display:flex;
  flex-flow:column;
    overflow: hidden;
	box-shadow: 0px 0px 24px #5C5696;
  z-index: 1;

}

.screen__content {
	z-index: 1;
	position: relative;	
	height: 100%;
}
.customContrasena{
  width:100px;
  margin-top:20px;
}
.screen__background {		
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	-webkit-clip-path: inset(0 0 0 0);
	clip-path: inset(0 0 0 0);	
}

.screen__background__shape {
	transform: rotate(45deg);
	position: absolute;
}

.screen__background__shape1 {
	height: 520px;
	width: 520px;
	background: #FFF;	
	top: -50px;
	right: 120px;	
	border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
	height: 220px;
	width: 220px;
	background: #6C63AC;	
	top: -172px;
	right: 0;	
	border-radius: 32px;
}

.screen__background__shape3 {
	height: 540px;
	width: 190px;
	background: linear-gradient(270deg, #5D54A4, #6A679E);
	top: -24px;
	right: 0;	
	border-radius: 32px;
}

.screen__background__shape4 {
	height: 400px;
	width: 200px;
	background: #7E7BB9;	
	top: 420px;
	right: 50px;	
	border-radius: 60px;
}

.login {
	width: 320px;

}

.login__field {
	padding: 20px 0px;	
	position: relative;	
}

.login__icon {
	position: absolute;
	top: 30px;
	color: #7875B5;
}
.customInputIndex{
  display: flex;
  align-items: center;
  margin:35px 0px;
  justify-content: center;
}
.jcustomInputRegis{
  display: flex;
  align-items: center;
  margin:10px 0px;
  justify-content: center;
}
.login__input {
	border: none;
	border-bottom: 2px solid #D1D1D4;
	background: none;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 75%;
	transition: .2s;
}

.login__input:active,
.login__input:focus,
.login__input:hover {
	outline: none;
	border-bottom-color: #6A679E;
}

.login__submit {
	background: #fff;
	font-size: 14px;
	margin-top: 10px;
	padding: 16px 20px;
	border-radius: 26px;
	border: 1px solid #D4D3E8;
	text-transform: uppercase;
	font-weight: 700;
	display: flex;
	align-items: center;
	width: 100%
	color: #4C489D;
	box-shadow: 0px 2px 2px #5C5696;
	cursor: pointer;
	transition: .2s;
}

.login__submit:active,
.login__submit:focus,
.login__submit:hover {
	border-color: #6A679E;
	outline: none;
}

.button__icon {
	font-size: 24px;
	margin-left: auto;
	color: #7875B5;
}
.loginbutton{
    
  width: 129px;
  height: 48px;
  text-decoration: none;
  margin-top: 81px;
  box-shadow: 0px 0px 0px black;
}
.loginbutton p{
    
  margin: 0px;
  text-decoration: none!important;
 
}
.Regisbutton{
    
  width: 129px;
  height: 48px;
  text-decoration: none;
  margin-top: 10px;
  box-shadow: 0px 0px 0px black;
}
.social-login {	
	position: absolute;
	height: 140px;
	width: 160px;
	text-align: center;
	bottom: 0px;
	right: 0px;
	color: #fff;
}
.social-icons {
	display: flex;
	align-items: center;
	justify-content: center;
}

.social-login__icon {
	padding: 20px 10px;
	color: #fff;
	text-decoration: none;	
	text-shadow: 0px 0px 8px #7875B5;
}
.jwminilogoIndex{
  width: 19%;
  padding-top: 20px;
}
.social-login__icon:hover {
	transform: scale(1.5);	
}
.loginSeccion{
  display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: flex-start;
    padding-top: 100px;
    padding-left: 19px;
}
.RegisSeccion{
  display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: flex-start;
    padding-top: 5px;
    padding-left: 10px;
}
.customRegis{
margin-top:0px;
}
.contenidoFormRegis{

}
.botonregistro{
  padding: 12px;
  margin-top: 31px;
  margin-bottom: 25px;

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