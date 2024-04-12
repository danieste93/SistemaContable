import React, { Component } from 'react'

import {connect} from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Animate } from "react-animate-mount";
class Contacto extends Component {
   state={
     cuentasSelect:[],
     Cuentasmodi:[],
     searchMode:false,
     cuentasSearcher:"",
   }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainMSC').classList.add("entradaaddc")

       }, 500);
        
       let cuentas = this.props.regC.Cuentas
      
       for(let i= 0;i<cuentas.length;i++){
        cuentas[i].FiltroSelect = false
       }
       this.setState({Cuentasmodi :cuentas})
      
      }
   
      Onsalida=()=>{
        document.getElementById('mainMSC').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      handleChangeSwitch=(e)=>{

   let indexCuentasState = this.state.Cuentasmodi.findIndex(element => element._id === e.target.id)
 
   let statemodificado = this.state.Cuentasmodi
   let malditoarreglo = this.state.cuentasSelect
   let newobject ={id:e.target.id, cuenta:e.target.name}

 if( statemodificado[indexCuentasState].FiltroSelect == false){
  statemodificado[indexCuentasState].FiltroSelect = "checked"
  this.setState({Cuentasmodi:statemodificado, cuentasSelect:[...this.state.cuentasSelect, newobject]})
 
 }else{
  statemodificado[indexCuentasState].FiltroSelect = false
  var array = malditoarreglo.filter(x => x.id != e.target.id); 
   this.setState({Cuentasmodi:statemodificado, cuentasSelect:array})
 }
    



  
      }

   

      sendcuentas=()=>{
  this.props.getCuentasFrom(this.state.cuentasSelect)
  this.Onsalida()
      }
      findCuentas=(cuentas)=>{
          
        let valor = this.state.cuentasSearcher
        if(valor !=""){
          if(cuentas.length > 0){
            let findCuentas = cuentas.filter(cuen =>
        
              cuen.NombreC.toLowerCase().includes(valor.toLowerCase())||
              cuen.Tipo.toLowerCase().includes(valor.toLowerCase())
                    )
                 
                    return findCuentas
          }
        }
                }
                handleChangeGeneral=(e)=>{

                  this.setState({
                  [e.target.name]:e.target.value
                  })
                  }
      displayCuentas=()=>{
        let cuentas = this.state.Cuentasmodi
     
            if(this.state.cuentasSearcher != ""){
      let  filtradospornombre =  this.findCuentas(cuentas)
    
      console.log(filtradospornombre)
      if(filtradospornombre.length >0){
        let renderNewCuentas = filtradospornombre.map((cuenta,i)=>{
         
           let cuenEditMode= this.state.cuenEditMode?"cseditmodeactive":"";
           let oculta= cuenta.Visibility?"":"hiddenCustom"
           return(
                <div key ={i}className={ `  cuentanameSearch jwPointer ${cuenEditMode} ${oculta}`} onClick={()=>{

                }}>
                  <div className="boxp">
                <p >
                {cuenta.NombreC}
                </p>
                <p >
                <FormControlLabel
        control={
          <Switch
          id={cuenta._id}
          onChange={this.handleChangeSwitch}
            name={cuenta.NombreC}
            color="primary"
            checked={cuenta.FiltroSelect}
          />
        }
        label=""
      />
                </p>
                </div>
                <div className="boxs">
                {cuenta.Tipo.toUpperCase()}
                </div>
                    </div>

           )

        })
return renderNewCuentas
      }
      else{
        return(<div>*-*</div>)
      }
    }
      }

    render () {
     console.log(this.state)
let Cuentas = this.state.Cuentasmodi
let Tipos = this.props.regC.Tipos
let tiposrender  =[]
   if(Tipos.length > 0){

    tiposrender = Tipos.map((tipo, i)=>{
      let cuentasrender  =[]
        if(Cuentas.length > 0){
            cuentasrender = Cuentas.filter(cuentaper => cuentaper.Tipo === tipo )
        }
        let cantidadCuentas = cuentasrender.length
       
        let   visible = cantidadCuentas == 0?"invisiblex":""
        return(<div className={`tipoMain ${visible}`}key={i}>
 <div className="titilulo">{tipo.toUpperCase()}</div> 
 <div className="contcuentas">
   {cuentasrender.map((cuenta, i)=>{
     
let mirutaEstado = cuenta.NombreC
let valor = "this.state." + mirutaEstado
     return(
   <div className="cuentaname" key={i}>
     <p >
     {cuenta.NombreC}
     </p>
     <p>
     <FormControlLabel
        control={
          <Switch
          id={cuenta._id}
          onChange={this.handleChangeSwitch}
            name={cuenta.NombreC}
            color="primary"
            checked={cuenta.FiltroSelect}
          />
        }
        label=""
      /> 
     </p>
      
        </div>
   )
         })}
 </div>


 <style>{`
  .invisiblex{
    display: none;
  }
 `}
 
   </style>

</div>)

  })
   }
        return ( 

         <div >

<div className="maincontacto" id="mainMSC" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida  }
                />
        <div className="tituloArt">Cuentas</div>        
        </div>
        <button className=" btn btn-light botonAddCrom" onClick={()=>{this.setState({searchMode:!this.state.searchMode})}}>
         
         <span className="material-icons">
       search
       </span>
       </button>
   
        <div className="contGnSC">
        <Animate show={!this.state.searchMode}>
          <div className="subContGnsc">
<div className="contTipos2">
    {tiposrender}
</div>  
</div>
</Animate>  




<Animate show={this.state.searchMode}> 
<div className="subContGnsc">
<div className="contCentrado">
    <div className="contSuggester">
    
      <div className="react-autosuggest__container">
    <input name="cuentasSearcher" className="react-autosuggest__input" onChange={this.handleChangeGeneral} placeholder="Busca tus Cuentas" /> 
    
      </div>
    </div>
    <div className="contCuentasSearch">
    {this.displayCuentas()}
    </div>
    </div>
    </div>
</Animate>  
</div> 

<div className="contBotonesDuales">
  <button className="botonesDuales btn-danger" onClick={ this.Onsalida }>
    Cancelar 
    </button>
    <button className="botonesDuales btn-success"onClick={this.sendcuentas }>
    OK
    </button>
</div>
        </div>
        </div>
           <style >{`
           .contSuggester{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
           }
           .contCuentasSearch{
            width: 80%;
            max-width:500px
           }
           .contCentrado{
            display:flex;
            flex-flow: column;
            align-items: center;
          }
           .subContGnsc{
            width: 80vw;
            max-width:500px
           }
           .boxp{
            display: flex;
justify-content: space-between;
margin:10px;
          }
          .boxs{
            display: flex;
            justify-content: center;
            font-size: 12px;
            background: #0505eb;
            width: 100%;
            color: white;
                             
         
          }
          .contAllcuentas{
            width: 100%;
          }
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
       .contcontacto{
        border-radius: 30px;
     
         width: 90%;
         background-color: white;
      
       }
      
   .contGnSC{
    display: flex;
    flex-flow: column;
    background: white;
    width: 100%; 
    border-radius: 31px;
    align-items: center;
    padding: 10px;
    overflow-y: scroll;
    height: 70vh;
   }
      .contTipos2{
        width: 100%;
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
          .cuentaname{
            display: flex;
    justify-content: space-between;
    align-items: center;
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

           .entradaaddc{
            left: 0%;
           }

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
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
    regC
  }
};

export default connect(mapStateToProps, null)(Contacto);