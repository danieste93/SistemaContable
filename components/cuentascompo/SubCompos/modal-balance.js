import React, { Component } from 'react'
import Filtrostiempo from './filtrostiempo';
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

         <div >

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
data={this.state.filteredTimeRegs}
tiempo={this.state.tiempo}
balance={this.props.balance}
/>

</div>
</div>
        </div>
        <style jsx >{`
           .maincontacto{
            z-index: 12;
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
                     
                     
                      padding: 5px;
                     
                     }
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default Contacto