import React, { Component } from 'react'
import Header from "../components/header";

import REGISTER from "../components/accessRegister";

import "../styles/uploader.css"
class Repuestouploader extends Component {

  state={
    Access:false
 
  }

  componentDidMount () {


    if(localStorage.length !== 0){

      const dataStored = localStorage.state;
      const data = JSON.parse(dataStored);
      console.log(data)
      if(data.userReducer != ""){
      const userData = data.userReducer.update.usuario.user
  
  if(userData.Tipo === "administrador"|| userData.Tipo === "tesorero"){
    this.setState({Access:true})
  }
}else{
  this.setState({Access:false})
}
      }
           
    
  

  }

  
  render () {

  
    const Comprobador = this.state.Access?  <REGISTER /> : "SOLO ACCESO PARA ADMINISTRADORES Y TESOREROS"
   
        return (
         <div>
   <Header/>


{Comprobador}
         </div>
        )
    }
}

export default Repuestouploader