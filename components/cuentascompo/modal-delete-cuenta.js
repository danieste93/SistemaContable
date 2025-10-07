import React, { Component } from 'react'
import {connect} from 'react-redux';
import io from 'socket.io-client';

import  {deleteCuenta} from "../../reduxstore/actions/regcont"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
class Contacto extends Component {
  state={
    Alert:{Estado:false},
    loading:false
  }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('maindeletecuenta').classList.add("entradaaddc")

       }, 500);
        
     
console.log(this.props.CuentaDelete)
      
      }
   
      Onsalida=()=>{
        document.getElementById('maindeletecuenta').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }

      // 🔄 WEBSOCKETS: Notificar eliminación de cuenta a otros dispositivos
      notifyAccountDeleted = (cuentaEliminada) => {
        try {
          const socketUrl = process.env.NODE_ENV === 'production' 
            ? window.location.origin 
            : 'http://localhost:3000';
          
          const socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            timeout: 5000
          });

          socket.on('connect', () => {
            console.log('🔌 [DELETE-CUENTA-WS] Conectado para notificar eliminación de cuenta');
            
            const userId = this.props.state.userReducer?.update?.usuario?.user?._id;
            if (userId) {
              // Enviar notificación de cuenta eliminada
              socket.emit('account-deleted', {
                userId: userId,
                cuenta: cuentaEliminada,
                timestamp: new Date().toISOString()
              });
              
              console.log('📨 [DELETE-CUENTA-WS] Notificación de cuenta eliminada enviada:', cuentaEliminada.nombreCuenta || cuentaEliminada.NombreC);
              
              // Desconectar después de enviar
              setTimeout(() => socket.disconnect(), 1000);
            }
          });

          socket.on('connect_error', (error) => {
            console.error('🚨 [DELETE-CUENTA-WS] Error de conexión:', error);
          });

        } catch (error) {
          console.error('🚨 [DELETE-CUENTA-WS] Error notificando eliminación de cuenta:', error);
        }
      }
        
      deleteCount=(cuenta)=>{
        console.log(cuenta)

        if(this.state.loading == false){
          this.setState({loading:true})
          if(parseFloat(cuenta.DineroActual.$numberDecimal) == 0)  {
           
        let datos = {
          Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname},                   
                  valores:cuenta
          }  
      let lol = JSON.stringify(datos)
 
      fetch("/cuentas/deleteCount", {
        method: 'POST', // or 'PUT'
        body: lol, // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log('DeleteCuenta:', response)
        if(response.message=="error al registrar"){
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Error en el sistema, porfavor intente en unos minutos"
        }
        this.setState({Alert: add, loading:false})
        }
        else {
       
this.props.dispatch(deleteCuenta(response.Cuenta))

       // 🔄 WEBSOCKETS: Notificar eliminación de cuenta a otros dispositivos
       this.notifyAccountDeleted(response.Cuenta);

       this.Onsalida()
      }
      }) 
          }else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"No se puede eliminar cuentas que no esten con saldo $0"
          }
          this.setState({Alert: add, loading:false}) 
          }
        }


       
      }
   

    render () {
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

<div className="maincontacto-deletecuenta" id="maindeletecuenta" >
            <div className="contcontacto-deletecuenta"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Seguro quieres eliminar la cuenta "{this.props.CuentaDelete.NombreC}" </p>

                   </div>
             </div>
             <div className="contBotonesDuales">
  <button className="botonesDuales btn-danger" onClick={ this.Onsalida }>
  Cancelar
    </button>
    <button className="botonesDuales btn-success" onClick={ (e)=>{
        e.stopPropagation(); 
  
      if(this.state.loading == false){
        this.setState({loading:true})
        console.log("llamando")
        
        this.deleteCount(this.props.CuentaDelete)
      }
      
      
      }}>
   Aceptar 
    </button>
</div>


     
        </div>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
           <style jsx>{`
             .botonesDuales{border-radius: 15px;
              padding: 7px;
              border-bottom: 4px solid black;}
            
                          
            .contBotonesDuales{ display: flex;
              justify-content: space-around;
              width: 80%;
              margin: 20px;}
             
             .contPfinal{
              display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
             }
           .imgventa{
            margin-top: 30px;
    height: 100px;
    width: 100px;
   }
 
           .cDc2{
     margin-left:10px;
   }
  


   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width:30%;
  text-align: right;
  
}
            


           .headercontact {

            display:flex;
            justify-content: space-around;

           }



      
            .botonventa{
            
              margin-top: 17px;
    border-radius: 10px;

    background-color: #048b0b;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
    color: #fff;
    transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4,0,0.2,1);
    height: 36px;
    line-height: 2.25rem;
    font-family: Roboto,sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    -webkit-letter-spacing: 0.06em;
    -moz-letter-spacing: 0.06em;
    -ms-letter-spacing: 0.06em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: none;
    width: 40%;
             }
       
   
        
        .maincontacto-deletecuenta{
             z-index: 1300;
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
       .contcontacto-deletecuenta{
        border-radius: 30px;
     
         width: 90%;
         background-color: white;
      
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
     
       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
       }
          
       body {
            height:100%

           }

           .contform{
            padding-bottom: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
           }

      

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
          }
          .entradaaddc{
            left: 0%;
           }
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
               .comunicacionart{
                 margin-bottom:2px;
               }
               .marginador{
                margin: 0px 2px 15px 2px;
               }
         .contcontacto-deletecuenta{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontacto-deletecuenta{
       
         width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
           
              .imgventa{
            margin-top: 40px;
    height: 150px;
    width: 150px;
   }
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