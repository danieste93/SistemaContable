import React, { Component } from 'react'



class Contacto extends Component {
   

    componentDidMount(){
   
      setTimeout(function(){ 
        
        document.getElementById('maincuota').classList.add("entradaaddc")

       }, 300); 
     

      
      }

      Onsalida=()=>{
        document.getElementById('maincuota').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro2()
        }, 300);
      }  

      handleForm=(e)=>{
        this.setState({
          [e.target.name] : e.target.value
      })
      }   

        
      

    render () {

   
        return ( 

         <div >

<div id="maincuota" className="maincontacto" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.Onsalida}/>
              <div className="tituloventa">
                
            <p> Cuota  </p>
           
        </div>
     
        </div>
<div className="contcuotas">
        <input name="ncuotas" type="number" onChange={this.handleForm}/>
        <p>meses</p>
        </div>
        <div className="conbotoncentral contcuotas">
        <button  className="botonventa " onClick={()=>{
                
                document.getElementById('maincuota').classList.remove("entradaaddc")
                setTimeout(()=>{ 
          this.props.envioCuotas(this.state)
        }, 300);
          
          }}>Continuar</button>
        </div>
     
        </div>
        </div>
           <style jsx>{`
           .conbotoncentral{
       
           }
           .contcuotas{
            display: flex;
            align-items: center;
            justify-content: center;
           }
           .contcuotas p{
            margin:0;
            margin-left:5px;
           }
           
           .contcuotas input{
            width: 25%;
            border-radius: 9px;
            text-align: center;
            height: 41px;
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
              .tituloventa{
                display: flex;
                align-items: center;
                font-size: 30px;
                font-weight: bolder;
                text-align: center;
                justify-content: center;
                width: 90%;
                margin-right: 5%;
              }
              .tituloventa p{
                margin-top:5px;
                margin-bottom:5px
              }
.optionrep{
  margin: 10px;
}
             .contopciones{
              padding: 30px;
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

         
          

           .headercontact {

            display:flex;
            justify-content: space-around;
            margin-bottom: 30px;
           }





        
        .maincontacto{
          z-index: 9999;
         width: 100vw;
         height: 100vh;
         background-color: rgb(239 185 124 / 96%);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition:0.5s;
         
       }
       .entradaaddc{
        left: 0%;
       }
       .contcontacto{
        border-radius: 30px;
     
         width: 90%;
         background-color: white;
         padding: 15px;
       }
  

   
     .asesort{
        margin-top: 20px;
  
         text-align: center;
         font-size: 20px;
         margin-bottom: 0;
       }
       .engrane{
         height: 75px;
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
          .FULL{
               width:60%
             }
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
               .comunicacionart{
                 margin-bottom:2px;
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

export default Contacto