import React, { Component } from 'react'
import { addFirstRegs,getCompras,getVentas  } from '../../../reduxstore/actions/regcont';
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';



  class ClasicClass extends Component {


state={
loadRegs:false,
loadCompras:false,
loadVentas:false,
}

componentDidMount() {

     
    
    if(!this.props.state.RegContableReducer.Regs){
        
        console.log("llamando Regs")           
        this.getRegs()
      }else{
        this.setState({loadRegs:true})   
      }


      if(!this.props.state.RegContableReducer.Compras){
          
        console.log("llamando Compras")
       
        this.getComprasdata()
      }else{
        this.setState({loadCompras:true})    
      }
      
      if(!this.props.state.RegContableReducer.Ventas){
        console.log("llamando ventas")
       
        this.getVendData()
      }else{
        this.setState({loadVentas:true})    
      }

      

}


   getRegs=()=>{
        console.log("ejecutando GetRegs")
        let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
          Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
let lol = JSON.stringify(datos)

fetch("/cuentas/getregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
  'Content-Type': 'application/json',
  "x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
console.log(response,"maindata")
if(response.status == 'error'){
alert("error al actualizar registros")
      }
else{
 
  this.props.dispatch(addFirstRegs(response.regsHabiles));
  this.setState({loadRegs:true})  
}   
    })
  }
 getComprasdata=()=>{
    console.log("en Compras")
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
  
    fetch("/cuentas/getallcompras", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
    console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      this.props.dispatch(getCompras(response.comprasHabiles));       
      this.setState({loadCompras:true})
  
    }
  
    })
  }
 getVendData=()=>{
     
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
  
    fetch("/cuentas/getventas", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
    console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      this.props.dispatch(getVentas(response.ventasHabiles));       
    
      this.setState({loadVentas:true})
    }
  
    })
  }
  
componentDidUpdate(){
  let dataloaded = this.state.loadRegs&&this.state.loadCompras&&this.state.loadVentas?true:false
 console.log(this.state)

  
           
              if(dataloaded ){
                console.log("dataloaded")
             
               
                 this.props.loadedDataSend()
               }

         
}

render() {

            
        
    return ( <div>
   
<CircularProgress />


<style jsx >{` `}</style>
    </div>  )}
}
const mapStateToprops = state=>  {
   
    return {
    
      state
    }
  };
  
  export default connect(mapStateToprops, null)(ClasicClass);