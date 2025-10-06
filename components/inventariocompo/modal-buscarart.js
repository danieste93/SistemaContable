import React, { Component } from 'react'
import Autosuggestjw from '../suggesters/jwsuggest-autorender';

class Contacto extends Component {
   

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainbuscarart').classList.add("entradaaddc")

       }, 500);
        
     

      
      }

      getSugerencias=()=>{
        let data = this.props.Articulos?this.props.Articulos.filter(x=> x.Tipo != "Servicio" && x.Tipo != "Combo" ):""
  
return (data)
       }
     resetArtData=()=>{
   
                
            }
      Onsalida=()=>{
        document.getElementById('mainbuscarart').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {

   
        return ( 

         <div >

<div className="maincontactoba" id="mainbuscarart" >
<div className="contcontactov2"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <Autosuggestjw  sendClick={(e)=>{this.props.setArt(e);this.Onsalida()}} getvalue={(item)=>{console.log("")}} 
        sugerencias={this.getSugerencias()} resetData={this.resetArtData}   /> 
     

</div> 
<div className="">

</div>
</div>
        </div>
        <style jsx >{`
           .maincontactoba{
              z-index: 1299;
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
       
            
            }

            .contcontactov2{
               border-radius: 9px;
      width: 90vw;
        background-color: whitesmoke;
        padding: 5px 10px;
        position:absolute;
      height: 40vh;
        overflow: scroll;
              
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
                 
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default Contacto