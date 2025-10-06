import React,{useEffect, useState} from 'react'
import { addFirstRegs,getCompras,getVentas  } from '../../../reduxstore/actions/regcont';
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Animate } from "react-animate-mount";
const hookRedux  = (props) => {

    const [loadRegs, setloadRegs] = useState(true);
    const [loadCompras, setloadCompras] = useState(true);
    const [loadVentas, setloadVentas] = useState(true);

   const getRegs=()=>{
        console.log("ejecutando GetRegs")
        let datos = {User: {DBname:props.state.userReducer.update.usuario.user.DBname,
          Tipo: props.state.userReducer.update.usuario.user.Tipo   }}
let lol = JSON.stringify(datos)

fetch("/cuentas/getregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
  'Content-Type': 'application/json',
  "x-access-token": props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
console.log(response,"maindata")
if(response.status == 'error'){
alert("error al actualizar registros")
      }
else{
 
  props.dispatch(addFirstRegs(response.regsHabiles));
  setloadRegs(true)
}   
    })
  }

 const getComprasdata=()=>{
    console.log("en Compras")
    let datos = {User: {DBname:props.state.userReducer.update.usuario.user.DBname,
      Tipo: props.state.userReducer.update.usuario.user.Tipo}}
  let lol = JSON.stringify(datos)
    let settings = {
      method: 'POST', // or 'PUT'
      body: lol, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": props.state.userReducer.update.usuario.token
      }
    }
  
    fetch("/cuentas/getallcompras", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
    console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      props.dispatch(getCompras(response.comprasHabiles));       
      setloadCompras(true)
  
    }
  
    })
  }
  const getVendData=()=>{
     
    let datos = {User: {DBname:props.state.userReducer.update.usuario.user.DBname,
      Tipo: props.state.userReducer.update.usuario.user.Tipo}}
  let lol = JSON.stringify(datos)
    let settings = {
      method: 'POST', // or 'PUT'
      body: lol, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": props.state.userReducer.update.usuario.token
      }
    }
  
    fetch("/cuentas/getventas", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
    console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      props.dispatch(getVentas(response.ventasHabiles));       
    
      setloadVentas(true)
    }
  
    })
  }
    useEffect(() => {
     
    
        if(!props.state.RegContableReducer.Regs){
            setloadRegs(false)      
            console.log("llamando Regs")           
            getRegs()
          }


          if(!props.state.RegContableReducer.Compras){
            setloadCompras(false)
            console.log("llamando Compras")
           
            getComprasdata()
          }
          
          if(!props.state.RegContableReducer.Ventas){
            console.log("llamando ventas")
            setloadVentas(false)       
                getVendData()
          }
          setTimeout(()=>{
            let dataloaded = loadRegs&&loadCompras&&loadVentas?true:false
        console.log("ejecucion")
              if(dataloaded){
                console.log("mmalada")
                props.loadedDataSend()
              }
        
        },1000)

      },[]);

  

    return ( <div>
   
<CircularProgress />


<style jsx >{` `}</style>
    </div>  )
}
const mapStateToProps = state=>  {
   
    return {
    
      state
    }
  };
  
  export default connect(mapStateToProps, null)(hookRedux);