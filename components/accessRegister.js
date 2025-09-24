import React, { Component } from 'react'
import { Animate } from "react-animate-mount";

import postal from 'postal';
import Modaledit from "./cuentascompo/modal-edditreg"
import Modaldelete from "./cuentascompo/modal-delete"
import Modal from "./cuentascompo/modal-ingreso"
import {connect} from 'react-redux';
import Homepp1 from "./cuentascompo/homepp1"
import Detalles from "./cuentascompo/detalles"
import Croom from"./cuentascompo/croom"
import Searcher from"./cuentascompo/searcher"
import Router from 'next/router';

import {getcuentas,updateCounter,updateCuenta, updateRepsAddreps,addFirstRegs, gettipos,getcats, getRepeticiones, getCounter,getArts, cleanData,addRegs, } from "../reduxstore/actions/regcont";
import {loadingReps } from "../reduxstore/actions/configredu";
import {logOut } from "../reduxstore/actions/myact";
 
class RegistroContable extends Component {
    state={
      modaledit:false,
        modalagregador:false,
        home:true,
        detalles:false,
        searcher:false,
        cuentas:false,
        estadisticas:false,
        EditReg:{},
        modaldelete:false,
        DeleteReg:{},
        cuentaToAdd:{},
        idReg:0,
        loadingReps:false,

    }
    channel1 = null;
    channel2 = null;
    channel3 = null;
    channel4 = null;
    componentDidMount(){
      
      // Debug: verificar token en accessRegister
      const token = localStorage.getItem('token');
      console.log('🔍 [ACCESS-REGISTER] Token disponible:', token ? 'Sí (longitud: ' + token.length + ')' : 'No');
    
      this.channel2 = postal.channel();
      this.channel3 = postal.channel();
      this.channel4 = postal.channel();
   
  

setTimeout(()=>{
  console.log("esperando para ejecutarreps")

  if(this.props.state.RegContableReducer.Reps && this.props.state.configRedu.loading == false ){

    this.exeReps()
  }
  
},5000)

      this.channel2.subscribe('deletereg', (reg) => {
        this.setState({modaldelete:true, DeleteReg:reg} )
        
        
       });
       this.channel3.subscribe('editreg', (reg) => {
        console.log(reg)
        this.setState({modaledit:true, EditReg:reg} )
         
       });
       this.channel4.subscribe('sendCuenta', (data) => {
    
       this.setState({ cuentaToAdd:data} )
         
       });
       this.channel4.subscribe('resetCuenta', (data) => {
    
        this.setState({ cuentaToAdd:{}} )
          
        });

     

      

this.startData()
      

      
        }//findid



        getMaindata=()=>{
          console.log("ejecutando Get Main DATA")
          let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                              Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
          let lol = JSON.stringify(datos)
          fetch("/cuentas/getMainData", {
            method: 'POST', // or 'PUT'
            body: lol, // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => {console.error('Error:', error);
                 })
          .then(response => {  
              console.log(response,"maindata")
              if(response.status == 'error'){
                if(response.message == "error al decodificar el token"){
                  this.props.dispatch(logOut());
                  this.props.dispatch(cleanData());
                  alert("Session expirada, vuelva a iniciar sesion para continuar");
                  Router.push("/ingreso")
                }
              }else if(response.status == 'Ok'){
                this.props.dispatch(addFirstRegs(response.regsHabiles));
                // Usar tiposDeCuentas si existe, si no usar tiposHabiles
                const tiposFinal = response.tiposDeCuentas ? response.tiposDeCuentas : response.tiposHabiles;
                this.props.dispatch(gettipos(tiposFinal));
                this.props.dispatch(getcats(response.catHabiles)); 
                this.props.dispatch(getcuentas(response.cuentasHabiles)); 
                this.props.dispatch(getRepeticiones(response.repsHabiles)); 
                this.props.dispatch(getCounter(response.contadoresHabiles[0])); 
              }
          });
        }  
        startData=()=>{


         
           if(!this.props.state.RegContableReducer.Cuentas  ||!this.props.state.RegContableReducer.Tipos ){
            this.getRCR()
          }
          else if(!this.props.state.RegContableReducer.Categorias  ||!this.props.state.RegContableReducer.Repeticiones ||!this.props.state.RegContableReducer.Contador ){
            this.getRCR2()
          }

        }  
        getRCR=()=>{
        
          let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                              Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
          let lol = JSON.stringify(datos)
      
          fetch("/cuentas/getRCR", {
            method: 'POST', // or 'PUT'
            body: lol, // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => {console.error('Error:', error);
                 })
          .then(response => {  
              console.log(response,"maindata")
              if(response.status == 'error'){
            
                if(response.message == "error al decodificar el token"){
                  this.props.dispatch(logOut());
                  this.props.dispatch(cleanData());
                  alert("Session expirada, vuelva a iniciar sesion para continuar");
              
               
                  Router.push("/ingreso")
                     
                }
              }else if(response.status == 'Ok'){
                this.props.dispatch(gettipos(response.tiposHabiles));
                                     
                this.props.dispatch(getcuentas(response.cuentasHabiles)); 
             
                if(!this.props.state.RegContableReducer.Categorias  ||!this.props.state.RegContableReducer.Repeticiones ||!this.props.state.RegContableReducer.Contador ){
                  this.getRCR2()
                }
              }
          });
          
        }
        getRCR2=()=>{
          console.log("ejecutando getRCR2")
          let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                              Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
          let lol = JSON.stringify(datos)
      
          fetch("/cuentas/getrcr2", {
            method: 'POST', // or 'PUT'
            body: lol, // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => {console.error('Error:', error);
                 })
          .then(response => {  
              console.log(response,"getrcr2")
              if(response.status == 'error'){
            
                if(response.message == "error al decodificar el token"){
                  this.props.dispatch(logOut());
                  this.props.dispatch(cleanData());
                  alert("Session expirada, vuelva a iniciar sesion para continuar");
              
               
                  Router.push("/ingreso")
                     
                }
              }else if(response.status == 'Ok'){
                
                this.props.dispatch(getCounter(response.contadoresHabiles[0])); 
                this.props.dispatch(getRepeticiones(response.repsHabiles)); 
                this.props.dispatch(getcats(response.catHabiles)); 
             
              }
          });
          
        }

        exeReps = () => {
          console.log("exereps");
        
          let repsExecutadas = this.props.state.RegContableReducer.Reps;
          if (repsExecutadas && repsExecutadas.length > 0) {
            const limit = repsExecutadas.length;
            console.log('START!');
            let i = 0;
        
            const executeReps = async () => {
              if (i < limit) {
                let fechaactual = new Date().getTime();
                console.log("comprobando " + i);
                console.log(new Date(repsExecutadas[i].fechaEjecucion));
                if (fechaactual >= repsExecutadas[i].fechaEjecucion) {
                  if (!this.state.loadingReps) {
                    this.setState({ loadingReps: true });
                    let data = { ...repsExecutadas[i].reg };
                    console.log("ejecutando " + i);
              
                    data.Repid = repsExecutadas[i]._id;
                    data.Usuario = {
                      DBname: this.props.state.userReducer.update.usuario.user.DBname,
                      Usuario: this.props.state.userReducer.update.usuario.user.Usuario,
                      _id: this.props.state.userReducer.update.usuario.user._id,
                      Tipo: this.props.state.userReducer.update.usuario.user.Tipo,
                    };
                    data.Tiempo = repsExecutadas[i].fechaEjecucion;
                    data.TiempoReg = repsExecutadas[i].reg.Tiempo;
        
                    let lol = JSON.stringify(data);
        
                    try {
                      let res = await fetch("/cuentas/addrepeticiones", {
                        method: 'PUT',
                        body: lol,
                        headers: {
                          'Content-Type': 'application/json',
                          "x-access-token": this.props.state.userReducer.update.usuario.token
                        }
                      });
                      let responsex2 = await res.json();
                      console.log(responsex2);
        
                      if (responsex2.message === "error al registrar") {
                        alert("Error al Generar Repeticion");
                      } else if (responsex2.message === "Transferencia genereda") {
                        let micuenta2 = responsex2.cuenta2;
                        this.props.dispatch(updateCuenta(micuenta2));
                      }
        
                      let micuenta1 = responsex2.cuenta1;
                      let micont = responsex2.contador;
                      let repe = responsex2.repUpdate;
        
                      this.props.dispatch(updateCuenta(micuenta1));
                      this.props.dispatch(updateCounter(micont));
                      this.props.dispatch(updateRepsAddreps(repe));
                      this.props.dispatch(addRegs(responsex2.registrosGenerados));
                    } catch (error) {
                      console.error("Error during fetch:", error);
                    } finally {
                      this.setState({ loadingReps: false });
                      i++;
                      console.log(`message ${i}, appeared after ${i} seconds`);
        
                      if (i < limit) {
                        // Volvemos a llamar a la función con un timeout para esperar
                        setTimeout(executeReps, 1000);
                      } else {
                        this.props.dispatch(loadingReps());
                        console.log('Execution complete');
                      }
                    }
                  }
                }else {
                  // Si la condición no se cumple, simplemente incrementa `i` y pasa a la siguiente repetición
                  i++;
                  console.log(`Fecha no cumplida, saltando a la siguiente repetición: ${i}`);
                  if (i < limit) {
                    setTimeout(executeReps, 1000);  // Llama de nuevo para continuar con la siguiente
                  } else {
                    this.props.dispatch(loadingReps());
                    console.log('Execution complete');
                  }
                }
              
              }
            };
        
            // Inicia la ejecución
            executeReps();
          }
        }

  

  
    render() {
      console.log("ejecutando Render")



      let User = ""
let activeIconCuentas = this.state.home?"homeactive":"";
let activeIconRegistros = this.state.detalles?"homeactive":"";
let activeIconBuscar = this.state.searchrRoom?"homeactive":"";
let activeIconEstadisticas = this.state.estadisticas?"homeactive":"";
if(this.props.state.userReducer != ""){
  User = this.props.state.userReducer.update.usuario
}  
        return (
          <div style={{marginTop:"60px"}} >
          
          <Animate show={this.state.home}>
            <Croom   datosUsuario={User} />
  </Animate>
  <Animate show={this.state.searchrRoom}>
     < Searcher datosUsuario={User} SendRegs={this.props.state.RegContableReducer} />
  </Animate>
  <Animate show={this.state.estadisticas}>
  
  <Homepp1 SendRegs={this.props.state.RegContableReducer} />
  </Animate>
  <Animate show={this.state.detalles}>
  <Detalles/>
  </Animate>



{this.state.modalagregador&&<Modal  cuentaToAdd={this.state.cuentaToAdd} updateData={()=>{ console.log("updatedata")}}   flechafun={()=>{this.setState({modalagregador:false})}}/>
}

<Animate show={this.state.modaledit}>
<Modaledit CuentaEdit={this.state.EditReg} flechafun={()=>{this.setState({modaledit:false})}}/>
</Animate>

    <Animate show={this.state.modaldelete}>
<Modaldelete DeleteReg={this.state.DeleteReg} Flecharetro={()=>{this.setState({modaldelete:false})}}/>

    </Animate>
<div className="contbarra">


<div className='barraSubcont'> 
  <div className='cont2Buttons'>
    <div className={` contImagen ${activeIconCuentas}`} onClick={()=>{this.setState({home:true,detalles:false,estadisticas:false,searchrRoom:false})}} >
<img className='imgBarra' src="/barraicons/cuentas.png"  />
<span> Cuentas </span>
</div>
<div className={` contImagen ${activeIconBuscar}`} onClick={()=>{this.setState({searchrRoom:true,home:false,estadisticas:false,detalles:false})}}>
<img className='imgBarra' src="/barraicons/lupa.png"  />
<span>S.Buscador </span>
</div>


  </div>
  <div className="buttoncont" onClick={()=>{this.setState({modalagregador:true})}}>
<img src='/barraicons/addbutton.png' className="customPrinbar jwPointer" />
</div>
<div className='cont2Buttons'>
<div className={` contImagen ${activeIconRegistros}`} onClick={()=>{this.setState({detalles:true,home:false,estadisticas:false,searchrRoom:false})}}>
<img className='imgBarra' src="/barraicons/registros.png"  />
<span> Registros </span>
</div>


<div className={` contImagen ${activeIconEstadisticas}`} onClick={()=>{this.setState({estadisticas:true,home:false,detalles:false,searchrRoom:false})}}>
<img className='imgBarra' src="/barraicons/estadisticas.png"  />
<span> Estadisticas </span>
</div>



</div>
</div>


</div>


            <style >
                {
                                  
                ` 
                .contRegister{
                    display:flex
                }
              .contheader{
                display: flex;
                justify-content: space-around;
              }
                .saludo{
                    font-size: 22px;
                    margin: 5px 0px;
                    text-align: center;
                }
.fecha{
    width: 30%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}
.hora{
    width: 30%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

                .cuadro-doble{
                    display: flex;
    justify-content: flex-start;
                }
                .contgenerales{
                  width: 70%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
                }


              
                
                .contagregador{
                    width: 25%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .contagregador i{
                  font-size: 75px;
                  transition: 1s;
              
                }
              
                    .cont-Prin {
                        display: flex;
                        width: 100%;
                        justify-content: space-evenly;
                    }
                 
                    
                    .valor_activos{
                        color: black;
                        font-size: 28px;
                        font-style: italic;
                  
                    }
                    .valor{
                        color: black;
                        font-size: 30px;
                        font-weight: bold;
                    }
                    .contul{
                        margin-bottom: 30px;
                    }
                    .minilist{
                        margin-top: 9px;
                        border-top: 0px;
                        margin-left: 10px;
                        /* border: 2px outset #292626ab; */
                        padding: 10px;
                        width: 137px;
                        border-radius: 15px;
                        box-shadow: -8px 7px 12px #000000c4;
                        background: white;
                        z-index: 1;
                    }
                 .contULS{
                    width: 40%;
                 }
                 .conttitulo{
                    border-radius: 30px;
                    text-align: center;
                    padding: 5px;
                    box-shadow: rgb(38 57 77) 12px 35px 78px -20px;
                    width: 90%;
                    max-width: 350px;
                    border-bottom: 6px double black;

                 }
                 .conttotales{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50%;
                 }
                
                    
                    ul {
                        margin-top:20px;
                        padding: 0;
                        list-style-type: none;
                    }
                    
                   
                    
                  
                    
                   
                 
                    
                   
                
                  
.contgenerales i{
    border-left: 1px solid black;
    padding:3px;
    border-radius:5px;
    cursor:pointer;
    font-size:35px;
    transition: 1s;
  margin-left:5px;
  margin-right:5px;

}
.homeactive{
 
  /* margin-top: 5px; */
  color: #3c8ae0;
  font-weight: bolder;
}
.homeactive span{
  font-size: 12px !important;
  
}
                    
                    `
                }
            </style>
             
                </div>   
        )
    }
    componentDidUpdate(prevProps, prevState) {
      // Bloquear scroll cuando se abre el modal agregador
      if (this.state.modalagregador && !prevState.modalagregador) {
        document.body.style.overflow = 'hidden';
      }
      // Restaurar scroll cuando se cierra el modal agregador
      if (!this.state.modalagregador && prevState.modalagregador) {
        document.body.style.overflow = '';
      }
    }
}
const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(RegistroContable);