import { Input } from '@material-ui/core';
import React, { Component } from 'react'
import {connect} from 'react-redux';





import Cuentas from "../cuentascompo/modalcuentas"
import { Animate } from 'react-animate-mount/lib/Animate';

class ModalAddFormaPago extends Component {
   
state={
  CuentaSelect:"",
  CuentasHabiles:[],
  formaPagoAdd:"",
  Detalles:"",
  Cantidad:"",
  cuentasmodal:false,

}
    componentDidMount(){
console.log(this.props)
      setTimeout(()=>{ 
        
        document.getElementById('addFormaCont').classList.add("entradaaddc")

       }, 200);
       setTimeout(()=>{ 
        
        this.setState({cuentasmodal:true})

       }, 300);
        
     if(this.props.valorSugerido){
      
      if(this.props.valorSugerido != 0){
        this.setState({Cantidad:this.props.valorSugerido})
      }
     }
     
      
      }
   
      Onsalida=()=>{
        document.getElementById('addFormaCont').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
     
      

  
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }

     
        comprobarFormaPago=()=>{
          if(this.state.CuentaSelect == "" ){
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
          
          if(this.state.CuentaSelect != "" && this.state.formaPagoAdd !="" && this.state.Cantidad > 0){
      
              this.props.sendFormaPago(this.state)
           
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
    render () {
console.log(this.state)
let tituloCuenta= this.state.CuentaSelect == ''?"Seleccione..":this.state.CuentaSelect.NombreC

let okC= this.state.cuentaOk?"okactive":""
let okCant= this.state.cantidadOk?"okactive":""
let okFP= this.state.formaPagoOk?"okactive":""

   let erroC1= this.state.cuentaError1?"erroractive":""
   let erroFP1= this.state.formaPagoError1?"erroractive":""
   let erroCant1= this.state.CantidaError1?"erroractive":""
        return ( 

         <div >

<div className="maincontacto" id="addFormaCont" >
            <div className="contcontactoFpago"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida }
                />
              <div className="tituloventa">
                {this.generartitulo()}
      
           
        </div>
     
        </div>
        <div className="Scrolled">
        <div className="contFormulario">
  
       
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cuenta  </p>
              
              </div>
      
              <div id ="cDc2Cuentas"className={`cDc2  `} onClick={()=>{this.setState({cuentasmodal:true})}}>
              <button className="select-button">
    {tituloCuenta}
      </button>
            
            




            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Forma de pago  </p>
            
              </div>
              <div className={`cDc2  `} >
              <p>  {this.state.formaPagoAdd} </p>
            

              </div>
              </div>

              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cantidad </p>
            
              </div>
              <div className={`cDc2  `} >
            <input type='number' name="Cantidad" value={this.state.Cantidad}  className={`customCantidad ${erroCant1}  ${okCant} `}  onChange={this.handleChangeGeneral} />




            
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
</div>

  
        </div>
        </div>

           
           {  this.state.cuentasmodal&&  < Cuentas 
        
               cuentacaller={"" }
               cuentaEnviada={"" }
               sendCuentaSelect={(cuenta)=>{
 
           this.setState({cuentasmodal:false, 
            CuentaSelect:cuenta,
            formaPagoAdd:cuenta.FormaPago
          })
             
               } }  
            
               Flecharetro3={
                ()=>{
                    this.setState({cuentasmodal:false, CuentaSelect:"" })
                  }
                        } 
                      
                       />}
                       
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

.select-button {
  background-color: #1976d2;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-transform: none;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.select-button:hover {
  background-color: #1565c0;
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
          z-index: 1000;
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
       .contcontactoFpago{
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
         .contcontactoFpago{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoFpago{
       
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