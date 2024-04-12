import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import { loadingOrdenesCompra } from "../../reduxstore/actions/configredu";
import Purdata from "../../components/tiendacompo/purchasedata-admin"
import Head from "next/head"
import CryptoJS from "crypto-js";
import Forge  from 'node-forge';
/**
* @author
* @class controlcompras
**/

class controlcompras extends Component {
 state = {}
 componentDidMount() {
this.getComprasData()

    }
   

    getComprasData=()=>{
       
      let datos = {Userdata: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
        Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
    let lol = JSON.stringify(datos)
      let settings = {
        method: 'POST', // or 'PUT'
        body: lol, // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }
    
      fetch("/public/getallordenescompra", settings).then(res => res.json())
      .catch(error => {console.error('Error:', error);
             })
      .then(response => {  
      console.log(response)
        if(response.status == 'error'){}
      else if(response.status == 'getOrdenes'){
       this.props.dispatch(loadingOrdenesCompra(response.ordenesHabiles));       
            
      }
    
      })
    }
 render() {

console.log(this.props)
  
  const datasecure = ()=>{
    let items = []


    if(this.props.state.userReducer !==""){
      if(this.props.state.configRedu.ordenesCompra.length > 0){
        items = this.props.state.configRedu.ordenesCompra.map((item,i)=>{
   
         return(   <Purdata key={item._id}  compra={item} />)
       })
   }
      if(this.props.state.userReducer.update.usuario.user.Tipo==="administrador"){
        return(
  <div  className="contcompras" > 
  <div className="contcompras" >
          <p className="subtituloArt">Ordenes existentes</p>
          {items}
          </div>
           </div>
     )
      }

    }

    else{
      return(<div>No tienes acceso a recursos de administrador</div>)
    }
  }

  return(

   <div style={{marginTop:"15vh"}} className="supercont" >
     
{datasecure()}

 <style>
   {`
   .contcompras{
    
 
    max-width: 800px;
   

   }
   .supercont{
  display:flex;
  justify-content: center;
   

   }
   `}
 </style>
   </div>
    )
   }
 }



const mapStateToProps = state => {


  return {state}
};
export default connect(mapStateToProps)(controlcompras)