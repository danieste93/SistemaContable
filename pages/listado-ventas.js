import React, { Component } from 'react'
import Header from "../components/header";

import ListadoVentas from "../components/accessListadoVentas";

import "../styles/uploader.css"
class Repuestouploader extends Component {

  state={
    Access:false
 
  }

  componentDidMount () {


    if(localStorage.length !== 0){

      const dataStored = localStorage.state;
      const data = JSON.parse(dataStored);
      const userData = data.userReducer.update.usuario
  
  if(userData.Tipo === "administrador" || userData.Tipo === "tesorero" ){
    this.setState({Access:true})
  }
      }
           
    
  

  }

  
  render () {

  
    const Comprobador = this.state.Access?  <ListadoVentas /> : "SOLO ACCESO PARA ADMINISTRADORES "
   
        return (
         <div>
   <Header/>


{Comprobador}
         </div>
        )
    }
}

export default Repuestouploader