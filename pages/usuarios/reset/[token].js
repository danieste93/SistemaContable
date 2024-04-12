import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {connect} from 'react-redux';
import {updateUser} from "../../../reduxstore/actions/myact"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Router  from 'next/router';
/**
* @author
* @class userID
**/

class userID extends Component {
 state = {

    pass1:"",
    pass2:"",
    error1:false,
    error2:false
 }

 static async getInitialProps(ctx) {
   
    const token = ctx.query.token 
    
        return { token}
      }

 componentDidMount(){
console.log("en reset")
    ValidatorForm.addValidationRule('requerido', (value) => {
        if (value === "") {
            return false;
        }
        return true;
    });
    ValidatorForm.addValidationRule('minimo6', (value) => {
        let cadena = value.toString()
      
         if (cadena.length >= 6) {
             return true;
         }
         return false;
       });
       ValidatorForm.addValidationRule('igualanterior', (value) => {
       
         if (value === this.state.pass1) {
             return true;
         }
         return false;
       });
 }
 handleChangeform=(e)=>{
    this.setState({
        [e.target.name] : e.target.value
    })
     }
resetPassword=()=>{
    console.log("onreset")
    var url = '/users/confirmResetPassword';
    var data = {Newpass : this.state.pass1,
                PassToken: this.props.token,
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
 if(response.status === "contraseña actualizada"){
   this.setState({success:true})
   
 
    Router.push("/")    
   
  
 }
 else if(response.status ==="error"){
   if(response.message ==="server error"){
     this.setState({error1:true})
   }
   else if(response.message ==="Usuario no encontrado"){
    this.setState({error2:true})
  }
 }

})  
}
 render() {
  
    
   const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const handleClose = (event, reason) => {
  
     this.setState({error1:false,error2:false})
    
}
  return(
   <div style={{marginTop:"15vh", display:"flex", justifyContent:"center"}}>
       <div className="jwPaper jwW80percent">
           <div className="jwseccionCard">
           <span className="material-icons" style={{ fontSize: "71px",  margin: "15px"}}>
vpn_key
</span>
<p className="subtituloArt">Reinicia tu contraseña</p>
<p>Ingresa tu nueva contraseña</p>

<ValidatorForm
   id="formingtoken"
   onSubmit={this.resetPassword}
   onError={errors => console.log(errors)}
>
<div className="seccionForm">
<TextValidator
       label="Contraseña"
       onChange={this.handleChangeform}
       name="pass1"
       type="password"
       validators={["requerido", "minimo6"]}
       errorMessages={['Escribe una contraseña válida', "Mínimo 6 dígitos"]}
       value={this.state.pass1} 
   />
     <TextValidator
       label="Repite tu Contraseña"
       onChange={this.handleChangeform}
       name="pass2"
       type="password"
       validators={["requerido", "minimo6","igualanterior"]}
       errorMessages={['Escribe una contraseña válida', "Mínimo 6 dígitos","Las contraseñas deben ser iguales"]}
       value={this.state.pass2} 
   />
   </div>
   <div className="jwContFlexCenter" style={{marginTop:"15px"}}>
 
 <button className="btn btn-success" type="submit">Enviar</button>

                             </div>

     </ValidatorForm>


           </div>
       </div>
       <Snackbar open={this.state.error1} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="warning">
        <p style={{textAlign:"center"}}>Error, vuelva a intentarlo en unos minutos </p>
    
    </Alert>
  </Snackbar>
  <Snackbar open={this.state.error2} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="error">
        <p style={{textAlign:"center"}}>El enlace ha expirado, porfavor solicite uno nuevo</p>
    
    </Alert>
  </Snackbar>
  <Snackbar open={this.state.success} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="success">
        <p style={{textAlign:"center"}}>La contraseña se ha modificado con exito </p>
    
    </Alert>
  </Snackbar>

       <style jsx>{`
           .seccionForm{
             display:flex;
         
    flex-flow: column;
           }
           .jwContFlexCenter button{
               margin:5px
           }

           `}

       </style>
      </div>
    )
   }
 }


userID.propTypes = {}

const mapStateToProps = (state, props) =>  {
 let userFind = state

    return(userFind)
  
     
  };
export default connect(mapStateToProps)(userID)