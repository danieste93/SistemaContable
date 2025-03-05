import React, { Component } from 'react'
import Filtrostiempo from './filtrostiempoLim';
import GeneradorLineBalance from "../estadisticas/GeneradorLineBalance"

class Contacto extends Component {
   state={
    tiempo:"mensual",
    filteredTimeRegs:[]
   }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainxx').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      configData = (event) => {

        this.setState({filteredTimeRegs:event})

       }
      paramTimeData = (event) => {

        this.setState({tiempo:event})

       }
      

    render () {

      console.log(this.state)
        return ( 

         

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Gráfico Evolución 

</div>



</div> 
<div className="Scrolled">

<Filtrostiempo 
getData={this.configData}
paramTimeData={this.paramTimeData} />

<GeneradorLineBalance
data={this.state.filteredTimeRegs.filter(x=>x.TiempoEjecucion != 0)}
tiempo={this.state.tiempo}
balance={this.props.balance}
/>

</div>
</div>
       
        <style jsx >{`
           .maincontacto{
      z-index: 1000;
         width: 98.5vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition:0.5s;
         overflow-y: scroll;  
         
       }

            .contcontacto{
              border-radius: 30px;
    
          border-radius: 9px;
        width: 95%;
        max-width:800px;
        background-color: whitesmoke;
        padding: 5px 5px;
        position:absolute;
        top:0px;
        overflow: hidden;
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
 
             
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                     
                      padding: 5px;
                     
                     }
                  
           `}</style>
        
        </div>
          
         
        )
    }
}

export default Contacto