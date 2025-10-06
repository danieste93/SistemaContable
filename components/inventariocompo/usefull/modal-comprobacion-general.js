import React, { Component } from 'react'
import {connect} from 'react-redux';


class Contacto extends Component {
   
  state={
    Alert:{Estado:false},
    loading:false
  }
    componentDidMount(){


      setTimeout(function(){ 
        
        document.getElementById('maindeletecaut').classList.add("entradaaddc")

       }, 100);
        
       

      
      }
   
      Onsalida=()=>{
        document.getElementById('maindeletecaut').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
   

    render () {
    
  
   
        return ( 

         <div >

<div className="maincontacto" id="maindeletecaut" >
            <div className="contcontactoModalDelete"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="titulogen">
                
            <p> {this.props.Mensaje}  <span style={{fontWeight:"bolder"}}> </span>  </p>
           

                   </div>
             </div>
             <div className="contBotonesDuales">
  <button className="botonesDuales btn-danger" onClick={ this.Onsalida }>
  Cancelar
    </button>
  
    <button className="botonesDuales btn-success" onClick={ (e)=>{
      
      e.stopPropagation(); 
if(this.state.loading == false){
this.setState({loading:true})

this.props.SendOk()

this.Onsalida()

}
    }}>
 Aceptar 
  </button>
</div>


     
        </div>
        </div>
   
           <style jsx>{`
           .titulogen{
            font-size: 22px;
            text-align: center;
            padding: 13px;
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
            flex-flow: column;
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
          z-index: 1303;
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
       .contcontactoModalDelete{
        border-radius: 30px;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        padding: 5px;
         width: 90%;
         background-color: white;
      
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
         .contcontactoModalDelete{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoModalDelete{
       
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
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(Contacto);