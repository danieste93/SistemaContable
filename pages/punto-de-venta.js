import React, { Component } from 'react'
import Header from "../components/header";

import PUNTOVENTA from "../components/accessPuntoVenta";






import Router from 'next/router';
import "../styles/uploader.css"
class Repuestouploader extends Component {

  state={
    Access:false
 
  }

  componentDidMount () {

console.log(localStorage)
    if(localStorage.state){

      const dataStored = localStorage.state;
      const data = JSON.parse(dataStored);
      if(data.userReducer != ""){
      const userData = data.userReducer.update.usuario.user

      if(userData.Membresia== "Gratuita" ){
   
        this.setState({Access:false})
        alert("Solo Habilitado para cuentas Premium, contactese al 0992546367/092492619")
        Router.back()
      }else if(userData.Membresia== "Premium"|| userData.Membresia === "trabajador"){
      
          this.setState({Access:true})
        
      }
    }
  
      }
           
    
  

  }

  
  render () {

  
    const Comprobador = this.state.Access?  <PUNTOVENTA /> :   <div style={{marginTop:"10vh"}}>Sin acceso a esta área</div>
   
        return (
         <div>
   <Header/>


{Comprobador}
         </div>
        )
    }
}

export default Repuestouploader