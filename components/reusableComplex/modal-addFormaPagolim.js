import { Input } from '@material-ui/core';
import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Animate} from "react-animate-mount"
import {getcuentas} from "../../reduxstore/actions/regcont";

import CircularProgress from '@material-ui/core/CircularProgress';
class ModalAddFormaPago extends Component {
   
state={
  CuentaSelect:"",
  CuentaId:"",
  CuentasHabiles:[],
  formaPagoAdd:"No",
  Detalles:"",
  Cantidad:"",
  loadedData:false
}
    componentDidMount(){
      if(this.props.valorSugerido){
      
        if(this.props.valorSugerido != 0){
          this.setState({Cantidad:this.props.valorSugerido})
        }
       }
      setTimeout(function(){ 
        
        document.getElementById('addFormaCont').classList.add("entradaaddc")

       }, 500);
        
       if(!this.props.state.RegContableReducer.Cuentas){
        this.getCuentasData()
       }else{
        this.setState({loadedData:true})
       }
     
      
      }
   
      Onsalida=()=>{
        document.getElementById('addFormaCont').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
     
      

      getCuentas=()=>{
        if(this.props.state.RegContableReducer.Cuentas){
        let cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x => x.FormaPago == this.state.formaPagoAdd && x.Tipo != "Inventario" )

        if(cuentasFiltradas.length > 0){
          let cuentasrender = cuentasFiltradas.map((c, i)=>{

            return(
              <option value={c._id} key={i} >{c.NombreC}</option>
            )
          })
          return cuentasrender
        }else {
          return ""
        }}else  return  <option value={""} key={999} >Loading...</option>


      } 
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
      
        handleChangeCuentas=(e)=>{        
          let cuentax = this.props.state.RegContableReducer.Cuentas.find(x=> x._id === e.target.value )
       
          this.setState({CuentaSelect:cuentax,CuentaId:e.target.value})
        }
        comprobarFormaPago=(e)=>{
          e.preventDefault()
          if(this.state.CuentaSelect == "" || this.state.CuentaId == ""){
            this.setState({cuentaError1:true})
   
          }else{
            this.setState({cuentaOk:true})
          }

          if(this.state.formaPagoAdd =="No"){
            this.setState({formaPagoError1:true})
          }   else{
            this.setState({formaPagoOk:true})
          }
          
          if(this.state.Cantidad <= 0){
            this.setState({CantidaError1:true})
          }   else{
            this.setState({cantidadOk:true})
          }
          
          if(this.state.CuentaSelect != "" && this.state.formaPagoAdd !="No" && this.state.Cantidad > 0){
      
            if(this.props.tipoDeForma == "Contado"){
              this.props.sendFormaPago(this.state)
            }else if(this.props.tipoDeForma == "Credito"){
              this.props.sendFormaCredito(this.state)
            }
            this.Onsalida()
          }
  
        }
        generartitulo=()=>{
          if(this.props.tipoDeForma=="Contado"){
  
            return(   <p> Agregar Forma de Pago </p>)
          }else {
            return(   <p> Agregar Forma de Crédito </p>)
          }
        }
        getCuentasData=()=>{
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
        
          fetch("/cuentas/getcuentasdata", settings).then(res => res.json())
          .catch(error => {console.error('Error:', error);
                 })
          .then(response => {  
          console.log(response)
            if(response.status == 'error'){}
          else if(response.status == 'Ok'){
                
            this.props.dispatch(getcuentas(response.cuentasHabiles)); 
            this.setState({loadedData:true})
          }
        
          })
        }
    render () {

let okC= this.state.cuentaOk?"okactive":""
let okCant= this.state.cantidadOk?"okactive":""
let okFP= this.state.formaPagoOk?"okactive":""

   let erroC1= this.state.cuentaError1?"erroractive":""
   let erroFP1= this.state.formaPagoError1?"erroractive":""
   let erroCant1= this.state.CantidaError1?"erroractive":""
        return ( 

         <div >

<div className="maincontacto" id="addFormaCont" >
            <div className="contContactoaddfl"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida }
                />
              <div className="tituloventa">
                {this.generartitulo()}
      
           
        </div>
     
        </div>
        <div className="Scrolled">
        <Animate show={!this.state.loadedData}>
          <CircularProgress />
          </Animate>
          <Animate show={this.state.loadedData}>
        <div className="contFormulario">
       
        <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Forma de pago  </p>
            
              </div>
              <div className={`cDc2  `} >
              <select name="formaPagoAdd"   className={`customCantidad ${erroFP1}  ${okFP} `}  value={this.state.formaPagoAdd}onChange={this.handleChangeGeneral} >
              <option value="No"> </option>
              <option value="Efectivo"> Efectivo</option>
                <option value="Transferencia"> Transferencia</option>
                <option value="Tarjeta-de-Credito"> Tarjeta de Crédito</option>
                <option value="Tarjeta-de-Debito">Tarjeta de Débito </option>




</select>




            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cuenta  </p>
              
              </div>
              <div className={`cDc2    `} >
              <select name="CuentaId" className={`customCantidad ${erroC1}  ${okC} `}  value={this.state.CuentaId}onChange={this.handleChangeCuentas} >


<option value=""> </option>
{this.getCuentas()}



</select>




            
              </div>
              </div>

              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cantidad </p>
            
              </div>
              <div className={`cDc2  `} >
            <input name="Cantidad" value={this.state.Cantidad}  className={`customCantidad ${erroCant1}  ${okCant} `} type='number' onChange={this.handleChangeGeneral} />




            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Detalles </p>
            
              </div>
              <div className={`cDc2  `} >
            <input name="Detalles" className='customCantidad' type='text' onChange={this.handleChangeGeneral} />
            
              </div>
              </div>
        </div>
      
        <div className="contbregis">

<button className=" btn btn-success botonflex" onClick={this.comprobarFormaPago}>
<p>Agregar</p>
<span className="material-icons">
done
</span>

</button>

<button className=" btn btn-danger botonflex" onClick={()=>{
this.Onsalida()

}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
</div>
</Animate>
</div>

        </div>
        
        </div>
           <style jsx>{`
             .Scrolled{
 
              overflow-y: scroll;
              width: 100%;
              display: flex;
              flex-flow: column;
             
              align-items: center;
            
           
             
             }
           .erroractive{
             border:3px solid red
           }
           .okactive{
            border:3px solid green
          }
              .grupoDatos{
                display: flex;
                justify-content: space-around;
                margin-top: 15px;
               }
             .contPfinal{
              display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
             }
       
 
           .cDc2{
     margin-left:10px;
   }
  


   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width: 40%;
  display: flex;
  align-items: flex-end;
  word-break: break-word;
  justify-content: flex-start;
  text-align: left;
  
}
   
.cDc2{
  margin-left:10px;
  width:50%;

 display: flex;
 align-items: flex-end;
 transition: 0.5s;
}
.cDc2 p{
  margin:0px;

}          


           .headercontact {
            width:100%;
            display:flex;
            justify-content: space-around;

           }



      
           
       
   
             .contbregis{
              display: flex;
              justify-content: space-around;
              width: 100%;
    max-width: 500px;
              margin-bottom: 50px;
}
          }
        .maincontacto{
          z-index: 9999;
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
       .contContactoaddfl{
        border-radius: 30px;
     
         width: 90%;
         background-color: white;
         display: flex;
         flex-flow: column;
         align-items: center;
       }
      .contFormulario{

        background: whitesmoke;
        padding: 8px;
        border-radius: 17px;
        font-size: 20px;
        margin-bottom: 25px;
    margin-top: 25px;
    max-width: 600px;

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
          
     

           .contform{
            padding-bottom: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
           }

      .customCantidad{
        width: 80%;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 5px 3px 1px black;
    transition:1s
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
         .contContactoaddfl{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contContactoaddfl{
       
         width: 70%;
      
      
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

export default connect(mapStateToProps, null)(ModalAddFormaPago);