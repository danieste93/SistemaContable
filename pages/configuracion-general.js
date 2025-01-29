import React, { Component } from 'react'
import Header from "../components/header";

import ComponentAcess from "../components/accessConfig";
import {connect} from 'react-redux';
import fetchData from "../components/funciones/fetchdata"




import Router from 'next/router';
import "../styles/uploader.css"
class Repuestouploader extends Component {

  state={
    Access:false
 
  }

  componentDidMount () {

    let databaseSize = this.getDatabase()
    console.log(databaseSize)

    if(localStorage.length !== 0){

      const dataStored = localStorage.state;
      const data = JSON.parse(dataStored);
      if(data.userReducer != ""){
      const userData = data.userReducer.update.usuario.user

      if(userData.Membresia== "Gratuita"){
   
        this.setState({Access:false})
        alert("Solo Habilitado para cuentas Premium, contactese al 0992546367/092492619")
        Router.back()
      }else if(userData.Membresia== "Premium" ){
        if(userData.Tipo === "administrador"  ){
          this.setState({Access:true})
        }
      }
    }
  
      }
           
    
  

  }
  getDatabase=async()=>{
    let data = await fetchData(this.props.state.userReducer,
      "/public/getDatabaseSize",
      {})
      return(data)
    }
  
  render () {

  
    const Comprobador = this.state.Access?  <ComponentAcess /> :   <div style={{marginTop:"10vh"}}>Sin acceso a esta área</div>
   
        return (
         <div>
   <Header/>


{Comprobador}
         </div>
        )
    }
}



 const mapStateToProps = state=>  {
   
  return {
      state
  }
};
 export default connect(mapStateToProps)(Repuestouploader)