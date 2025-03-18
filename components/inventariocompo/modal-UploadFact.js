import React, { Component } from 'react'
import { Animate } from 'react-animate-mount/lib/Animate';
import { CircularProgress } from '@material-ui/core';
import {connect} from 'react-redux';
import { updateVenta,addRegs } from '../../reduxstore/actions/regcont';
import fetchData from '../funciones/fetchdata';
import SecureFirm from '../snippets/getSecureFirm';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import GeneradorFactura from  "../snippets/GeneradorFactura"
class Contacto extends Component {
   state={
    secuencialGen:0,
    secuencialBase:0,
    loading:false,
    ClientID:"",
    Alert:{Estado:false},
   }

    componentDidMount(){
      console.log(this.props)
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);
        
     this.getUserData()

      
      }
     
      GenerarFactura=async()=>{
      if(this.state.loading == false){
        this.setState({loading:true})
      
        if(this.props.state.userReducer.update.usuario.user.Factura.validateFact && this.props.state.userReducer.update.usuario.user.Firmdata.valiteFirma){                
          let bufferfile = ""                    
          try {
            bufferfile = await SecureFirm(this.props.state.userReducer)
            console.log('Bufferfile obtenido:', bufferfile);
          
              let datos= this.props.dataUpload
              console.log(datos)

              let factGenerated = await GeneradorFactura(datos.iDVenta,datos.iDRegistro,datos.formasdePago,datos.articulosVendidos, 
              {
                 id:datos.idCliente,
                 usuario:datos.nombreCliente, 
                 correo:datos.correoCliente,
                 telefono:datos.telefonoCliente,
                 ciudad:datos.ciudadCliente,
                 direccion:datos.direccionCliente,
                 cedula:datos.cedulaCliente,
                 ClientID:this.state.ClientID,
                 UserSelect:datos.nombreCliente!="Consumidor Final"?true:false,
               }
              ,  this.state.secuencialGen, 
                 datos.PrecioCompraTotal,
             ( datos.PrecioCompraTotal-datos.IvaEC), 
                   datos.IvaEC, 
                   bufferfile,
                   datos.valorDescuento,
                   2 // ambiente
                     )

           
                     if(factGenerated.status == "Ok"){
                      let data ={...factGenerated.CompiladoFactdata,
                        Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                             IdVentaMongo:this.props.dataUpload._id,
                             arrRegs:this.props.dataUpload.arrRegs                 
  
                       }
                      fetch('/cuentas/uploadfact', {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(data), // data can be `string` or {object}!
                        headers:{
                          'Content-Type': 'application/json',
                          "x-access-token": this.props.state.userReducer.update.usuario.token
                        }
                      }).then(res => res.json())
                      .catch(error => console.error('Error:', error))
                       .then(response => {
                       console.log(response)
                       if(response.status =="Error"){
                        let add = {
                          Estado:true,
                          Tipo:"error",
                          Mensaje:`Error en el sistema, ${response.error}`
                      }
                      this.setState({Alert: add, loading:false}) 
                      }else{
                        let add = {
                          Estado:true,
                          Tipo:"success",
                          Mensaje:"Factura Electrónica Generada Satisfactoriamente"
                      }
                      this.setState({Alert: add,
                         })
 this.props.dispatch(addRegs(response.Regs));
  this.props.dispatch(updateVenta(response.Venta));
 
 setTimeout(this.Onsalida(),500) 
                      }                  })
                      }else if(factGenerated.status == "Error"){
          
                        let messageShow  = factGenerated.mensaje
        
                        if(messageShow == 'Error :  Error en la factura, CLAVE ACCESO REGISTRADA,  undefined '){
        
                            messageShow ="Ese Secuencial ya ha sido utilizado, aumente un numero en el secuencial"
                        }
        
                        let add = {
                            Estado:true,
                            Tipo:"error",
                            Mensaje:messageShow
                        }
                        this.setState({Alert: add, loading:false}) 
        
                    }

            } catch (error) {

             console.log(error)
              alert("Error al firmar",error)
              this.setState({loading:false})
            }   
          }else{
            alert("Datos no validados, valide la configuracion de la Firma Electronica")
          }

     
        }

       }
       getUserData=async()=>{

        let data = await fetchData(this.props.state.userReducer,
            "/public/getClientData",
            this.props.dataUpload.idCliente)
        
            this.setState({ClientID:data.Client.TipoID,
                      secuencialGen:data.Counters,
                      secuencialBase:data.Counters,
        
            })
           
               }
   
      Onsalida=()=>{
        document.getElementById('mainxx').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      handleChangeSecuencial=(e)=>{
        if(e.target.value >= this.state.secuencialBase){
    
        
        this.setState({
        [e.target.name]:parseInt(e.target.value)
        })}
        else{
    
            let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:`No se puede elegir un secuencial menor`
            }
            this.setState({Alert: add, }) 
    
        }
        } 

    render () {
console.log(this.state)
   const handleClose = (event, reason) => {
       let AleEstado = this.state.Alert
       AleEstado.Estado = false
       this.setState({Alert:AleEstado})
      
   }
   const Alert=(props)=> {
       return <MuiAlert elevation={6} variant="filled" {...props} />;
     }
        return ( 

         <div >

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Generar Factura de una Nota de Venta 

</div>



</div> 
<div className="Scrolled">
<div className="centrar spaceAround contsecuencial"> 
               <span > Secuencial</span>
               <input type="number" name="secuencialGen" className='percentInput' value={this.state.secuencialGen} onChange={this.handleChangeSecuencial }/>
               </div>
                 <div className="contBotonPago centrar">
                              <button className={` btn btn-success botonedit2 `} onClick={()=>this.GenerarFactura()}>
               <p>Generar Factura</p>
               <i className="material-icons">
               payment
               </i>
               
               </button>
               
               <div>
               <Animate show={this.state.loading}>
               <CircularProgress />
               </Animate>
               </div>
                              </div>
</div>
</div>
        </div>
                  <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
                <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
            
            </Alert>
          </Snackbar>
          
        <style jsx >{`
           .maincontacto{
            z-index: 1298;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition:0.5s;
            
            }

            .contcontacto{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .contBotonPago{
              margin-top:10px}
              .contsecuencial{
    margin-top:10px;
}
.contsecuencial input{
    border-radius: 26px;
    padding: 7px;
    text-align:center
}
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
              .entradaaddc{
                left: 0%;
                }

                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
                  }
                  .tituloventa{
                    display: flex;
                    align-items: center;
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: center;
                    justify-content: center;
                    }
                    .tituloventa p{
                    margin-top:5px;
                    margin-bottom:5px
                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                   
                      padding: 15px;
                     
                     }
                       .botonedit2{
                    display:flex;
                    padding:5px;
              
                    border-radius: 20px;
                    box-shadow: -2px 3px 3px black;
                    justify-content: space-around;
                    width: 200px;
                }
                .botonedit2 p{
                    margin:0px
                }
                  
           `}</style>
        

          
           </div>
        )
    }
}



const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(Contacto);