import React, { Component } from 'react'

import { Animate } from "react-animate-mount";
export default class homepp1 extends Component {
    state={
        Activos:false,
        Pasivos:false,
     

    }
    componentDidMount(){
   
     
        setTimeout(function(){ 
  
          document.getElementById('mainhomeapp').classList.add("entradaaddc")
    
         }, 200);
  
   
   
  
        
        }
    libutton=()=>{
        this.setState({Activos:!this.state.Activos})
    }
    pabutton=()=>{
        this.setState({Pasivos:!this.state.Pasivos})
    }
    render() {

        let sumaing = 0  
        let sumagas = 0
let misregs = this.props.SendRegs.Regs
if(misregs){
if(misregs.length > 0  ){


    let misregsing = misregs.filter(regsing => regsing.Accion == "Ingreso")
  
    if(misregsing.length > 0){
        for (let x=0; x < misregsing.length; x++ ){
            sumaing = sumaing + misregsing[x].Importe
    }
     
        } 

        let misregsgas = misregs.filter(regsgas => regsgas.Accion == "Gasto")
      
        if(misregsgas.length > 0){
            for (let i=0; i < misregsgas.length; i++ ){
               sumagas = sumagas + misregsgas[i].Importe
              }
             
       }
 
}
}

   let estilo = this.state.Activos?"clicked":"";
let estilo2 = this.state.Pasivos?"clicked":"";

        return (
            <div id="mainhomeapp"className="mainhomeapp">
 
<div className="cont-Prin">
<div className="contULS">
                <div className="contul">
                <ul>
  <li className={`${estilo} `} style={{color:"Green"}} onClick={this.libutton} ><span >Activos <div className="valor_activos" >${sumaing.toFixed(2)}</div></span> </li>
  <Animate show={this.state.Activos}>
 <div className="minilist">
<p>- Posesion</p>
<p>- No Posesion</p>
<p>- Inventario</p>
</div>
</Animate>
</ul>
</div>
<div className="contul2">
<ul>
  <li className={`${estilo2} `} style={{color:"red"}} onClick={this.pabutton}><span >Pasivos <div className="valor_activos" >${sumagas.toFixed(2)}</div></span></li>
  <Animate show={this.state.Pasivos}>
  <div className="minilist">
<p> Ariendos</p>
<p>Sueldos</p>
</div>
</Animate>
</ul>
</div>
</div>

<div className="conttotales">
    <div className="conttitulo">
        <div className="titulo">TOTAL</div>
        <div className="valor valor_activos">${sumaing.toFixed(2) - sumagas.toFixed(2)}</div>
    </div>
</div>

<style >
                {                                
                `  .mainhomeapp{
                    transition: 0.5s;
   

    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
                    transition: 0.5s;
                    left: -100%;
                }
                .entradaaddc{
                    left: 0%;
                   }
            
                .cont-Prin {
                    display: flex;
                    width: 100%;
                    justify-content: space-evenly;
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
                 p{

                 }
                    
                    ul {
                        margin-top:20px;
                        padding: 0;
                        list-style-type: none;
                    }
                    
                    li {
                        z-index: 1;
                        font-size: 25px;
                        width: 100%;
                        height: 100%;
                        color: black;
                        border-left: 0.08em solid;
                        position: relative;
                        margin-top: 0.8em;
                        cursor: pointer;
                    }
                    
                    li::before,
                    li::after
                     {
                        content: '';
                        position: absolute;
                        width: inherit;
                        border-left: inherit;
                        z-index: -1;
                    }
                    
                    li::before {
                        height: 85%;
                        top: 8%;
                        left: calc(-0.15em - 0.08em * 2);
                        filter: brightness(0.9);
                    }
                    
                    li::after {
                        height: 65%;
                        top: 20%;
                        left: calc(-0.15em * 2 - 0.08em * 3);
                        filter: brightness(0.6);
                    }
                    
                    li span {
                        position: relative;
                   
            
                        height:90px;
                        box-sizing: border-box;
                        border: 0.08em solid;
                        background-color: whitesmoke;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: sans-serif;
                        text-transform: capitalize;
                        transform: translateX(calc(-0.15em * 3 - 0.08em * 2));
                        transition: 0.3s;
                        border-radius:15px;
                        flex-flow: column;
                        max-width:300px;
                        box-shadow: rgb(38 57 77) 0px 20px 30px -20px;
                    }
                    
                    li.clicked span {
                        transform: translateX(0.15em);
                    }
                  
.contgenerales i{
    border-left: 1px solid black;
    padding:3px;
    border-radius:5px;
    cursor:pointer
}
      
                
                ` }
    </style>
</div>


</div>
        )
    }
}
