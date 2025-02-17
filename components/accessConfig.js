import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';
import { Animate } from 'react-animate-mount/lib/Animate';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ElectroFact from "./modal-ElectroFact"
import Trabajadores from "./modal-Trabajadores"
import Clientes from "./modal-Clientes"
import Email from "./modal-CorreoConfig"
import fetchData from './funciones/fetchdata';
import DatabaseUsageBar from './cuentascompo/SubCompos/dataBarUsage';

 class accessPuntoVenta extends Component {
 
     state={
      FirmaArchivo:[],
      Alert:{Estado:false},
      archivos:null,
      passClient:null,
      ElectroFact:false,
      Trabajadores:false,
      Email:true,
      docsSize:{
        storage:0,
        datasize:0,
        indexSize:0
      }
     }
  
     async componentDidMount(){
      let databaseSize = await this.getDatabase()
    
  console.log(databaseSize)
      if(databaseSize.status =='Ok'){
        this.setState({docsSize:databaseSize.data})
  
      }
   
    }
     
       getDatabase=async()=>{
         let data = await fetchData(this.props.state.userReducer,
           "/public/getDatabaseSize",
           {})
           console.log(data)
           return(data)
         }
 
render(){

  console.log(this.state)

  const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const ClickFunctionItem = ({icono, titulo, func})=>{
 
    return(

    <div onClick={func} ><a>
    <div className="adminitem">
<span className="material-icons">
{icono}
</span>
       <p>{titulo}</p>
       <style >{`
      
 .adminitem{
   color: black;
border: 1px solid #2a28ff;
padding: 1px;
margin: 15px;
align-items: center;
display: flex;
flex-flow: column;
justify-content: space-around;
text-align: center;
height: 100px;
border-radius: 24px;
box-shadow: inside 1px 1px grey;
box-shadow: 0 8px 16px -6px black;
background:snow;
cursor:pointer;
min-width: 120px;
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
    </a></div> 
   
    )
}

    return(  <div style={{marginTop:"10vh"}} className="mainAccessCont" > 
    <div>
    <div className="ConfigCont">
    <label className="tituloArt">Configuración General</label>
    <ClickFunctionItem icono="post_add" titulo="Facturacion Electrónica" func={()=>{this.setState({ElectroFact:true})}} />
    <ClickFunctionItem icono="people" titulo="Trabajadores" func={()=>{this.setState({Trabajadores:true})}} />
    <ClickFunctionItem icono="emoji_people" titulo="Clientes" func={()=>{this.setState({Clientes:true})}} />
    <ClickFunctionItem icono="email" titulo="Correo" func={()=>{this.setState({Email:true})}} />
    <div style={{ marginTop:"10px", display: "flex", justifyContent: "center", alignItems: "center",  backgroundColor: "#f5f5f5" }}>
            <DatabaseUsageBar dbSize={this.state.docsSize.datasize} userSize={300} />
        </div>
    </div>
   
    </div>


     
  <Animate show={this.state.ElectroFact}>
<ElectroFact Flecharetro ={()=>this.setState({ElectroFact:false})} />
  </Animate>
  <Animate show={this.state.Trabajadores}>
<Trabajadores Flecharetro ={()=>this.setState({Trabajadores:false})} />
  </Animate>
  <Animate show={this.state.Clientes}>
  <Clientes Flecharetro ={()=>this.setState({Clientes:false})} />
  </Animate>
  <Animate show={this.state.Email}>
  <Email Flecharetro ={()=>this.setState({Email:false})} />
  </Animate>

 

  <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
     <style jsx>
                {                              
                ` .contBoton{
                  display:flex;
                  justify-content:center;
                  margin-top: 30px;
                }
                .botoupload{
                  width: 180px;
                }.mainAccessCont{
                  display:flex;
                  margin-top: 10vh;
                  flex-flow: column;
                  align-items: center;
                }
                .myinput{
                  display: flex;
    justify-content: space-around;
                }
                .ConfigCont{
                  display: flex;
                  flex-flow: column;
    box-shadow: 0px 4px 20px #00000099;
    width: 90%;
    padding: 20px;
    border-radius: 50px;
    margin: 20px;
    border: 2px inset blue;
    max-width:800px;
                  
                }
                .customInput {
                  display: flex;
                  align-items: center;
                  margin: 5px 10px;
                  justify-content: center;
              }
                ` } </style>

    </div>)
}
}
const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(accessPuntoVenta);