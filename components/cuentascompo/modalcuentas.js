import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import Addcuenta from "./modal-addcuenta"
import Editcuenta from "./modal-editcuenta"
import Addtipo from "./modal-addtipo"

import  {deleteCuenta} from "../../reduxstore/actions/regcont"
import ModalDeleteC from "./modal-delete-cuenta";
import fetchData from '../funciones/fetchdata';
import {gettipos} from "../../reduxstore/actions/regcont"
class Contacto extends Component {
   
state={
  AddCuenta:false,
  EditCuenta:false,
  CuentaEditar:"",
  addmitipo:false,
  CuentasHabiles:[],
  editmode:false,
  CuentasD:[],
  Buscador:false,
  visibility:false,
  cuentasSearcher:"",
ModalDeleteC:false,
}
channel1 = null;
  async  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown);
      if(!this.props.state.RegContableReducer.Tipos){
  
        let data = await fetchData(this.props.state.userReducer,
          "/cuentas/gettipos",
          {})
          console.log(data)

          if(data.status == 'Ok'){
         
                         this.props.dispatch(gettipos(data.tiposHabiles));
                    }

      }
   //   this.getCuentas()

     
      setTimeout(function(){ 
        
        document.getElementById('maincuentas').classList.add("entrada")
  
       }, 50);
        
        }

        handleKeyDown = (event) => {
          // Si el buscador ya está activo, no hace falta reactivarlo
          if (!this.state.Buscador) {
            this.setState({ Buscador: true });
          }
        };
        componentWillUnmount() {
          document.removeEventListener("keydown", this.handleKeyDown);
        }
         
        onEditmode=()=>{
          
        }
        handleChangeGeneral=(e)=>{

          this.setState({
          [e.target.name]:e.target.value
          })
          }
        handleChangeSearcher=(e)=>{
          if(this.state.visibility == false){
            this.setState({
              [e.target.name]:e.target.value, visibility:true
            })
          } else{
            this.setState({
              [e.target.name]:e.target.value
              })
          }
        }
            
      
        FilterSearcher=(e)=>{
          if(this.state.cuentasSearcher ==""){
            return(e)
          }else{

 let cuentasFind = e.filter(cuenta => cuenta.NombreC.toLowerCase().includes(this.state.cuentasSearcher.toLowerCase()) )
 return cuentasFind
          }
        }
        /*getCuentas=(e)=>{
          let datos = {User: this.props.state.userReducer.update.usuario}
          let lol = JSON.stringify(datos)
          fetch("/cuentas/getcuentas", {
            method: 'POST', // or 'PUT'
            body: lol, // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .catch(error => {console.error('Error:', error);
                 })
          .then(response => {  
 
 let cuentash = response.cuentasgen
 
 this.setState({CuentasHabiles:cuentash})
          });
        }*/
    render () {
      let userData={_id:''}
    
      if(this.props.state.userReducer != ""){
        userData=this.props.state.userReducer.update.usuario.user
      }
      let generadorDeCuentas
    let cuentactive= this.state.editmode?"bordeazul":""
    let lapizctive= this.state.editmode?"lapizctive":""
      if(this.props.regC.Cuentas.length > 0){

let cuentasGenerales = this.props.regC.Cuentas
let cuentasporFiltar = cuentasGenerales
if(this.props.FiltroP){
  if(this.props.FiltroP == "CuentasNoPosesion"){
    cuentasporFiltar = cuentasGenerales.filter(x=>!x.CheckedP )
  }


}


let cuentasSinInv = cuentasporFiltar.filter(x=>x.Tipo != "Inventario" 
  
 // && x._id != this.props.cuentaEnviada._id
)

      generadorDeCuentas = this.FilterSearcher(cuentasSinInv).map((cuenta,i)=>{
        if(cuenta.Visibility){
       
        return(<div key={i} className={`cuentaRender jwPointer ${cuentactive}`}                             >
          <Animate show={this.state.editmode}>
          <div className="contx" >
<i className="material-icons close " onClick={(e)=>{
   e.stopPropagation()
   this.setState({ModalDeleteC:true, CuentaPorDel:cuenta})

}}>  close</i>
</div>  
</Animate>
<div onClick={()=>{
        if(this.state.editmode == false){


          if(this.props.cuentacaller ==="trans1"){
            setTimeout(()=>{  
              
              this.props.sendCuentaSelectT1(cuenta)},300)
                         
            document.getElementById('maincuentas').classList.remove("entrada")
            
  
  
           }else if(this.props.cuentacaller ==="inggas"){
            setTimeout(()=>{  
              
              this.props.sendCuentaSelect(cuenta)},300)
                         
            document.getElementById('maincuentas').classList.remove("entrada")
            
           }
          else if(this.props.cuentacaller ==="trans2"){
        
           setTimeout(()=>{  
             
             this.props.sendCuentaSelectT2(cuenta)},300)
                        
           document.getElementById('maincuentas').classList.remove("entrada")
           
 
 
          }
        
        }
          else{
          this.setState({
            EditCuenta:true,
            CuentaEditar:cuenta
          })
            
          }
        }
        }>
        <p className="nombrem">{cuenta.NombreC}</p>
        <p className="">(${cuenta.DineroActual.$numberDecimal})</p>
        <div className="tipomcont">
        <p className="tipom">{cuenta.Tipo}</p>
        </div>
        </div>
      </div>)
      }else{
        let cuentaOculDisplay = this.state.visibility?"cuentaview":"cuentanoview"
        return(<div key={i} className={`cuentaRender ${cuentaOculDisplay} oculta`}  >
   
          <div key={i} className={` jwPointer ${cuentactive} `}  >
          <Animate show={this.state.editmode}>
          <div className="contx" >
<i className="material-icons close " onClick={(e)=>{
    e.stopPropagation()
    this.setState({ModalDeleteC:true, CuentaPorDel:cuenta})

}}>  close</i>
</div>  
</Animate>
<div onClick={()=>{
        if(this.state.editmode == false){

          if(this.props.cuentacaller ==="trans1"){
            setTimeout(()=>{  
              
              this.props.sendCuentaSelectT1(cuenta)},300)
                         
            document.getElementById('maincuentas').classList.remove("entrada")
            
  
  
           }else if(this.props.cuentacaller ==="inggas"){
            setTimeout(()=>{  
              
              this.props.sendCuentaSelect(cuenta)},300)
                         
            document.getElementById('maincuentas').classList.remove("entrada")
            
           }
          else if(this.props.cuentacaller ==="trans2"){
          
           setTimeout(()=>{  
             
             this.props.sendCuentaSelectT2(cuenta)},300)
                        
           document.getElementById('maincuentas').classList.remove("entrada")
           
 
 
          }
        
        }
          else{
          
            this.props.editCuenta(cuenta)
          }
        }
        }>
        <p className="nombrem">{cuenta.NombreC}</p>
        <p className="">(${cuenta.DineroActual.$numberDecimal})</p>
        <div className="tipomcont">
        <p className="tipom">{cuenta.Tipo}</p>
        </div>
        </div>

        </div>
         

        </div>)
      }
      })
    }
      else{
   
        generadorDeCuentas =   <div>Aun no tienes cuentas creadas</div>
     
              }

       
  
   
        return ( 

         <div >

<div id="maincuentas" className="maincontacto-modalcuentas" >
            <div className="contcontacto"  >
        
                <div className="headercontact cuentasheader">
             
              <div className="tituloventa">
                
            <p> Cuentas  </p>
           
        </div>

     <div className="conticonos">
     <i className="material-icons" onClick={()=>this.setState({AddCuenta:true})}>  add</i>
     <i className={`material-icons ${lapizctive}`}  onClick={()=>{this.setState({editmode:!this.state.editmode})}}>  edit</i>
 
   
         <i className="material-icons" onClick={()=>{this.setState({Buscador:!this.state.Buscador})}}>
       search
       </i>
       <div id =""className="cDc2x" >
                    <Animate show={this.state.visibility}>
                  <i className="material-icons"  onClick={()=>{this.setState({visibility:!this.state.visibility})}}>  visibility</i>
                  </Animate>
                  <Animate show={!this.state.visibility}>
                  <i className="material-icons"  onClick={()=>{this.setState({visibility:!this.state.visibility})}}>  visibility_off</i>
                  </Animate>
                  </div>
                  <i className="material-icons" onClick={()=>{
   setTimeout(()=>{   this.props.Flecharetro3()},300)
    
       
       document.getElementById('maincuentas').classList.remove("entrada")
       }}>  close</i>

    
        </div>
        </div>
        <Animate show={this.state.Buscador}>
     <div className="buscadorCuentas">
     <div className="react-autosuggest__container">
    <input autoFocus name="cuentasSearcher" className="react-autosuggest__input" onChange={this.handleChangeSearcher} placeholder="Busca tus Cuentas" /> 
    
      </div>
     </div>
     </Animate>
<div className="contcuentasCx">
 {generadorDeCuentas}
</div>
     
        </div>
        </div>
        <Animate show={this.state.ModalDeleteC}>
         <ModalDeleteC CuentaDelete={this.state.CuentaPorDel} Flecharetro={()=>{this.setState({ModalDeleteC:false})}}/>
          </Animate>
           <Animate show={this.state.AddCuenta}>
                 < Addcuenta datosUsuario={userData._id}    Flecharetro4={
                   
             ()=>{
              
              this.setState({AddCuenta:false, })}
            } 
            agregarTipo={()=>{
           
              this.setState({addmitipo:true})}}
                    />
                  </Animate >
          
                  <Animate show={this.state.EditCuenta}>
                 < Editcuenta
                  datosUsuario={userData._id} 
             
                    CuentaEditar={this.state.CuentaEditar}
                    Flecharetro4={
             
             ()=>{
             
              this.setState({EditCuenta:false, valdefault:"No"})}} 
                    />
                  </Animate >
           <Animate show={this.state.addmitipo}>
           
              < Addtipo id="adddtipe"   Flecharetro4={
          
          ()=>{
       
           this.setState({addmitipo:false, valdefault:"No"})}} 
                 /> 
                 
               </Animate >
       
       
       
           <style >{`
          

          .buscadorCuentas{
            display: flex;
    justify-content: center;
    margin-bottom: 15px;
          }
           .lapizctive{
            color: white;
           }
           .close{
            color: red;
            border: 2px outset red;
            border-radius: 50%;
            margin-top: 5px;
            cursor:pointer;
            font-size: 15px;
           }

           .contx{
            display: flex;
          
            align-items: center;
            justify-content: flex-end;
            margin-right: 5px;
           }
         
           .cuentasheader{
            margin-bottom: 16px;
            background: #00f1e6;
            color: #1f0707;
            border-radius: 10px 10px 0px 0px;
           }
           .tipom{
            font-size: 12px;
     font-style: italic;
     margin-bottom: 0;
           }
           .tipomcont{
            background: #0061f1;
            color: white;
            border-radius:  0px 0px 11px 10px;
           }
           .contcuentasCx{
            padding: 5px;
            display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    height: 78%;
    overflow-y: scroll;
    overflow-x: hidden;
    align-items: center;
           }

.nombrem{
  font-weight: bold;
    font-size: 20px;
    margin-top: 3px;
    margin-bottom:3px;
    word-break: break-all;
    line-height: normal;
}



.cuentaRender{
  box-shadow: 1px 0px 4px black;
  border-radius: 10px;
  width: 28%;
  display: flex;
  text-align: center;
  flex-flow: column;
  max-width: 180px;
  margin: 10px 5px;
  transition: 0.5s;
  justify-content: flex-end;
  opacity: 1;
}
.bordeazul{
  box-shadow: -8px 7px 8px #031552;
}
.conticonos i{
  cursor:pointer;
}
           .conticonos{
            display: flex;
            width: 60%;
            justify-content: space-around;
            align-items: center;
           }
             
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
             .contTituloCont1{
              margin-top:10px;
               display:flex;
               display: flex;
    font-size: 25px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
    border: 1px solid blue;
    border-radius: 20px;
             }
             .contTituloCont1 p{
               margin-top:5px;
               margin-bottom:5px;
             }


           .headercontact {

            display:flex;
            justify-content: space-between

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
       
          .option{
            width: 44%;
    box-shadow: 0px 3px 4px black;
    border-radius: 13px;
    padding-bottom: 5%;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    height: 290px;
    word-break: break-word;
    cursor: pointer;
    flex-flow: column;
    display: flex;
    justify-content: space-around;
    margin: 14px 0px;
    border-bottom:2px inset blue;
    align-items: center;
          }
          .option img {
    width: 100%;
    max-width: 120px;
}
.cuentaview{

}

.cuentanoview{
  font-size: 5px;
  width: 0%;
  opacity: 0;
  height: 50%;
  display: none;
  justify-content: center;
    align-items: center;
    margin: 0px
    ;
}
.oculta{maincontacto-modalcuentas
  background:grey
}
        
        .maincontacto-modalcuentas{
          z-index: 1300;
         width: 100vw;
         height: 50%;
         min-height: 350px;
         background-color: rgb(0 0 0 / 85%);
         left:0px;
         position: fixed;
         top: -50%;
         display: flex;
         justify-content: center;
         align-items: flex-start;
         transition: 0.6s ;
         overflow: hidden;
         border-bottom: 3px solid black
       }
       .contcontacto{
         margin-top:5px;
        border-radius: 15px;
        width: 98%;
         background-color: white;
         height: 100%;
       
         border-bottom: 5px solid black;
       }
       .marginador{
         margin: 0px 35px 15px 35px;
         color: black;
         
         display: flex;
         flex-flow: column;
         align-items: center;
   
       }
   
      
       .cDc2x{


        display: flex;
        align-items: center;
        flex-flow: column;
        justify-content: center;
        width: 15px;
 

        cursor:pointer;
      } 
     
   
       .tituloventa{
         display: flex;
         align-items: center;
         font-size: 30px;
         font-weight: bolder;
         text-align: center;
         justify-content: space-around;
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
          .entrada{
            top:0%}
          .react-autosuggest__container {
            position: relative;
            border-radius: 6px;
            border: 2px solid #ffffff;
            box-shadow: -1px 5px 9px #418fe2;
            margin: 0px;
        
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
         .contcontacto{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontacto{
       
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
  let regC =   state.RegContableReducer
  return {
    regC,
    state
  }
};

export default connect(mapStateToProps, null)(Contacto);