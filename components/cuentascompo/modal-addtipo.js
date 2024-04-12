import React, { Component } from 'react'

import { Animate } from "react-animate-mount";

import TextField from '@material-ui/core/TextField';

import {connect} from 'react-redux';
import {addTipo} from "../../reduxstore/actions/regcont"
class Contacto extends Component {
   state={
    err1:false,
 editmode:false,
 addactive:false,
 helperText:"",
 newtipo:"",
 Tipos:[]
 
   }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainaddtipe').classList.add("entradaaddc")

       }, 500);
 
      }
      deleteTipo=(tipo)=>{

        let datos = {Id: this.props.datosUsuario,
          Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname},           
          valores:tipo
        }  
        let lol = JSON.stringify(datos)
        let url = "/cuentas/deletetipe"  
        fetch(url, {
          method: 'PUT', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log('Success AdminData:', response)
          if(response.message=="error al registrar"){
            alert("Error al registrar, intentelo en unos minutos")
           }
           else{
          let arr = response.user.Tipos
          this.props.dispatch(addTipo(arr))
           }
       
        })
   
      }
        
      agregarNuevoTipo=()=>{
        this.setState({addactive:!this.state.addactive})
        if(this.state.newtipo !=  ""){

          let datos = {
            Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname},           
            valores:this.state.newtipo.trim()
          }  
          let lol = JSON.stringify(datos)
          let url = "/cuentas/addnewtipe"  
          fetch(url, {
            method: 'PUT', // or 'PUT'
            body: lol, // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json',
              "x-access-token": this.props.state.userReducer.update.usuario.token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
            console.log( response)
            if(response.message=="error al registrar"){
             alert("Error al registrar, intentelo en unos minutos")
            }
            else{
 
        console.log(response)
        let arr = response.user.Tipos
              this.props.dispatch(addTipo(arr))
             this.setState({newtipo:""})
          }
          })
     
        }
           }
     
      getTipeCuentas=()=>{

        if(this.props.state.RegContableReducer.Tipos.length > 0){
       return(
        this.props.state.RegContableReducer.Tipos.map((tipo, i)=>(
            <div key={i} className="textotipor">
                <div  className="conttipor">
<p>-</p><div className="tiporender"key={i}>{tipo}</div>
</div>
<div className="contbotones">
  <Animate show={this.state.editmode}> 
<i className="material-icons jwPointer" onClick={()=>{
  this.deleteTipo(tipo)
}}>  close</i>
</Animate> 
</div>
<style>
{`
.textotipor{
            display: flex;
            justify-content: space-between;
           }
           .conttipor{
            display: flex;
            justify-content: space-between;
          
           }
           .tiporender{margin-left:8px;
                font-size: 18px;
          }
`}
</style>
</div>
          ))
          )
       
        }
        else{
          return(
         
  <div >No existen tipos de cuenta</div>
    
            )
        }
      }

      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }


        Onsalida=()=>{
          document.getElementById('mainaddtipe').classList.remove("entradaaddc")
          setTimeout(()=>{ 
            this.props.Flecharetro4()
          }, 500);
        }
    render () {

      let lapizctive= this.state.editmode?"lapizctive":""
      let colorwhite= this.state.addactive?"lapizctive":""
   
        return ( 

         <div >

<div id="mainaddtipe"className="maincontacto" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Gestor de Tipo  de Cuentas </p>
           
        </div>
     
        </div>


<div className="contPrin">

<div className="contDatosC">
<div className="conticonos">
  <div className="subcontenedor">
     <i className={`material-icons i3D ${colorwhite}`}  onClick={this.agregarNuevoTipo}>  add</i>
     <i className={`material-icons i3D ${lapizctive}`}  onClick={()=>{this.setState({editmode:!this.state.editmode})}}>  edit</i>
     </div>
    
     </div>
 
       <div style={{width: "90%"}}>
       <Animate show={this.state.addactive}>
       <div className="contaddtipe">
        <TextField  
            error={this.state.err1}
        fullWidth 
        name="newtipo" 
        onChange={this.handleChangeGeneral}
        value={this.state.newtipo}
         id="standard-basic" 
         label="Agregar Nuevo Tipo"
         helperText={this.state.helperText}
          />

       <div className="borderok jwPointer">
        <i className="material-icons " onClick={this.agregarNuevoTipo}>  done</i>
        </div>
        </div>
        </Animate>
        </div>
     
       
        <div className="grupoDatos">
     
        <div className="contTipos">
{this.getTipeCuentas()}
</div >

              </div>
        
          
              </div>

     
   
</div>
        </div>
    
    
    
        </div>
 
           <style jsx>{`
           .contaddtipe{
            display: flex;
            align-items: flex-end;
           }
        .borderok{
          box-shadow: inset 0px 3px 5px green;
          border-radius: 50%;
          padding: 7px;
          text-align: center;
          display: flex;
      
          margin-left: 20px;
        }
         .subcontenedor{
          width: 26%;
          justify-content: space-around;
          display: flex;
         }

          .contPrin{
            margin-top:5%;
         
    display: flex;
    flex-flow: column;
    justify-content: space-around;
          }

           .botoncontact{
      
            height: 100%;
            margin-left: 15px;
          
            font-size: 2vmax;
            padding: 0 16px;
            border-radius: 10px;
            background-color: #0267ffeb;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
              0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 1px 5px 0 rgba(0, 0, 0, 0.12);
            color: white;
            transition: background-color 15ms linear,
              box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
          
            line-height: 2.25rem;
            font-family: Roboto, sans-serif;
           
            font-weight: 500;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            border: none;
            width: 60%;
          max-width:300px;
              box-shadow: -4px 6px 8px #635c5cc4;
          }
           .errequerido{
            border-color: red;

           }
           
         

.i3D{
  font-size: 35px;
    margin-left: 6px;
    /* border: 1px inset #212529; */
    border-radius: 50%;
    box-shadow: inset 1px 1px 3px;
    padding: 2px;
}
           .cDc1x{
            width: 75%;
            display: flex;
            align-items: center;
           }
             .grupoDatos{
              display: flex;
              justify-content: space-around;
              margin-top: 15px;
              width: 100%;
             }
          
             
         
   
 
  
  
             .lapizctive{
              color: white;
             }
.conticonos{
  width: 100%;
  background-color: aqua;
  display: flex;
  justify-content: flex-end;
  border-radius: 5px 10px 0px 0px;
  padding: 10px;
}

 .contDatosC{
  display:flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  box-shadow: -3px 6px 8px #000000c4;

  border-radius: 5px;
  font-size: 15px;
  flex-flow: column;

}


 
        

           .headercontact {

            display:flex;
            justify-content: space-around;

           }



      
  
        
        .maincontacto{
          z-index: 9999;
         width: 100vw;
         height: 100vh;
         background: #00f1e6;
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition: 0.5s;
         
       }

       .entradaaddc{
        left: 0%;
       }


       .contcontacto{
        border-radius: 30px;
        height: 98%;
        width: 96%;
         background-color: white;
         padding: 15px;
         overflow: scroll;
         overflow-x: hidden;
       }
     
   
      
       .alinemiento{
        align-items: center;
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

       
      
        
             @media only screen and (max-width: 320px) { 
            
           
         .contcontacto{
          width: 95%;
         }
          }
          
           
           .conttipor{
            display: flex;
            justify-content: space-between;
           }
           .contTipos{
            width: 90%;
            max-width: 500px;
           }
          @media only screen and (min-width: 600px) { 
         

              .contcontacto{
       
         width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
           
  
          }
          
           `}</style>
        

          
           </div>
        )
    }
}

const mapStateToProps = (state, props) =>  {
 

  const usuario = state.userReducer

  return {
  
 state
  }
};

export default connect(mapStateToProps, null)(Contacto);
