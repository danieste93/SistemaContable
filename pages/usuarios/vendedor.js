import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Link from "next/link"
import Head from "next/head"
import {Animate} from "react-animate-mount"
import {logOut} from "../../reduxstore/actions/myact"
import Router from "next/router"
import Modal from "../../components/cuentascompo/modal-ingreso"
import {getClients,addFirstRegs,getArts,getDistribuidor,getAllcuentas,getCompras,getcuentas,getCounter, getVentas, gettipos,getcats, cleanData, } from "../../reduxstore/actions/regcont";
/**
* @author
* @class admins
**/

class vendedorCont extends Component {
 state = {
  modalagregador:false,
  cuentaToAdd:{},
 }
 componentDidMount(){

  this.getCuentasyCatsIni()
  if(!this.props.state.RegContableReducer.Cuentas  || !this.props.state.RegContableReducer.Categorias ){
    console.log("Ejecutando cuenta o catNegativo")
    this.getCuentasyCats()
}
 
 
}

exeRegs=()=>{
   
  let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
    Tipo: this.props.state.userReducer.update.usuario.user.Tipo, 
    tiempo:new Date().getTime()
  
  }}
let lol = JSON.stringify(datos)

fetch("/cuentas/exeregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json',
"x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
console.log(response,"exeregs")
if(response.status == 'error'){
alert("error al actualizar registros")
}
else{

  if(response.registrosUpdate.length > 0){

  this.props.dispatch(updateRegs(response.registrosUpdate)); 

  }
  
}   
})
}
getCuentasyCats=()=>{
 console.log("catycuentas")
  let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
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

  fetch("/cuentas/getCuentasyCats", settings).then(res => res.json())
  .catch(error => {console.error('Error:', error);
         })
  .then(response => {  
  
    if(response.status == 'error'){}
  else if(response.status == 'Ok'){
  //  this.props.dispatch(getVentas(response.ventasHabiles));       
  this.props.dispatch(getcats(response.catHabiles)); 
  this.props.dispatch(getcuentas(response.cuentasHabiles)); 
  let datos2 = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname},
  Cuentas: response.cuentasHabiles}
 
 


  }

  })
}
getCuentasyCatsIni=()=>{
  console.log("catycuentasINIII")
   let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
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
 
   fetch("/cuentas/getCuentasyCats", settings).then(res => res.json())
   .catch(error => {console.error('Error:', error);
          })
   .then(response => {  
   
     if(response.status == 'error'){}
   else if(response.status == 'Ok'){
   //  this.props.dispatch(getVentas(response.ventasHabiles));       
   this.props.dispatch(getcats(response.catHabiles)); 
   this.props.dispatch(getcuentas(response.cuentasHabiles)); 
   let datos2 = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname},
   Cuentas: response.cuentasHabiles}
   let settings2 = {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(datos2), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json',
       "x-access-token": this.props.state.userReducer.update.usuario.token
     }
   }
  
   fetch("/cuentas/getregsbycuentas", settings2).then(res => res.json())
   .catch(error => {console.error('Error:', error);
          })
   .then(response => {
  
     this.props.dispatch(addFirstRegs(response.regsHabiles));
 
      this.exeRegs()
   })
 
   }
 
   })
 }



 render() {
  let nameVendedor = this.props.state.userReducer !=""? this.props.state.userReducer.update.usuario.user.Usuario:""
let tipoVend = this.props.state.userReducer !="" && this.props.state.userReducer.update.usuario.user.Tipo =="tesorero"?true:false
     const Adminfunitem = ({icono, titulo, url})=>{
        
         return(
     
         <Link href={url}><a>
         <div className="adminitem">
<span className="material-icons">
{icono}
</span>
            <p>{titulo}</p>
            <style >{`
           
           .adminitem{
             color: black;
         border: 1px solid #2a28ff;
         padding: 20px;
         margin: 15px;
         align-items: center;
         display: flex;
         flex-flow: column;
         justify-content: space-around;
         text-align: center;
         height: 148px;
         border-radius: 24px;
         box-shadow: inside 1px 1px grey;
         box-shadow: 0 8px 16px -6px black;
         background:snow;
         cursor:pointer;
         min-width: 160px;
     }
         .adminitem span{
          
         
           font-size:40px;
           margin-top:10px
           }
           .adminitem a{
             width:30%;
           }
      
        
       `}
     
       </style>
         </div>
         </a></Link> 
        
         )
     }


  return(
 
  <div style={{marginTop:"10vh"}}> 


     <div className="tituloArt contitulo">
     Bienvenido {nameVendedor}
     </div>
     <div className="adminitemConts">
 
  


    { tipoVend && <Adminfunitem icono="attach_money" titulo="Cuentas" url="/registro-contable" />}

  <Adminfunitem icono="app_registration" titulo="Inventario" url="/inventario" />

  <Adminfunitem icono="local_atm" titulo="Venta" url="/punto-de-venta" />
  <Adminfunitem icono="local_grocery_store" titulo="Emarket" url="/configuracion-emarket" />
  </div>
  <div className="contbarra">

<div className="contgenerales">

</div>
<div className="contagregador" onClick={()=>{this.setState({modalagregador:true})}}>
<i className="material-icons jwPointer">
add_circle
</i>
</div>
</div>
<Animate show={this.state.modalagregador}>
<Modal updateData={()=>{ }} cuentaToAdd={this.state.cuentaToAdd}  flechafun={()=>{this.setState({modalagregador:false})}}/>

    </Animate>
  <style >{`
    .contgenerales{
      width: 70%;
display: flex;
justify-content: space-around;
align-items: center;
flex-wrap: wrap;
    }
    .contagregador i{
      font-size: 75px;
      transition: 1s;
  
    }

 .contitulo{
  margin-top: 8%;
 }
  .adminitemConts{
    display:flex;
    justify-content: space-around;
    margin-top: 5%;
    flex-wrap:wrap;
  
  `}</style>
  </ div>
   
 
  )
   }
 }



const mapStateToProps = state => {
 
 
    return {state}
 };
 export default connect(mapStateToProps)(vendedorCont)