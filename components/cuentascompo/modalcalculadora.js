import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';

import Calculadora from "./calculalator"
import postal from 'postal';
class Contacto extends Component {
   
state={
  editmode:false,
  subCategoria:[],
  catSelect:{
    nombreCat:""
  }
}
channel1 = null;
    componentDidMount(){
      this.channel1 = postal.channel();
  
      this.channel1.subscribe('desdeingreso', (data) => {
       
  this.setState({subCategoria:[]})
         
       });
      setTimeout(function(){ 
        
        document.getElementById('maincontcalc').classList.add("entradaCalcu")
  
       }, 50);
        
        }
         
        onEditmode=()=>{
          
        }
        
    
    render () {

console.log(this.state)
     
  
   
        return ( 

         <div >

<div id="maincontcalc" className="maincontactoCalcu" >
            <div className="contcontacto"  >
        
                <div className="headercontact cuentasheader">
                <i className="material-icons" onClick={()=>{
   setTimeout(()=>{   this.props.Flecharetro3()},50)
    
       
       document.getElementById('maincontcalc').classList.remove("entradaCalcu")
       }}>  close</i>
            
     

        </div>
<div className="Generalcont">
<Calculadora inputNumber={(e)=>{this.props.inputNumero(e)}} closeCalc={()=>{
     setTimeout(()=>{   this.props.Flecharetro3()},50)
}} />

</div>    
     
        </div>
        </div>
           <style>{`
           .barr{
             width:20%;
             color: #418fe2;
           }
          .contlist{
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
           .minisub{
            text-align: center;
            border: 1px solid black;
            border-radius: 7px;
            padding: 0px;
            margin: 5px 0px;
            cursor:pointer;
           }
     
            .subcatCont {
              width: 45%;
              display: flex;
              flex-flow: column;
              justify-content: center;
              background: #f1f1f1;
              border-radius: 7px;
              padding: 13px;
          }
       
        
           .Generalcont{
            display: flex;
            justify-content: space-around;
            height: 93%;
           
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
        
           }

           .contx{
            display: flex;
            justify-content: center;
            align-items: center;
           }
         
           .cuentasheader{
         
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
           .contcat{
            width: 45%;
            padding: 5px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            height: 100%;
            flex-flow: column;
 
           }

.nombrem{
  font-weight: bold;
    font-size: 25px;
    margin: 0px;

    width: 70%;
}



.catRender{
  box-shadow: 1px 0px 4px black;
  border-radius: 10px;
  width: 100%;
  display: flex;
  height: auto;
  text-align: center;
  flex-flow: column;
  max-width: 180px;
  margin: 5px 0px;
  transition: 0.5s;
  justify-content: space-around;
cursor:pointer;
  min-height: 20%;
}
.bordeazul{
  box-shadow: -8px 7px 8px #031552;
  min-height: 35%;
}
 i{
  cursor:pointer;
}
           .conticonos{
            display: flex;
            width: 45%;
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
        
        .maincontactoCalcu{
          z-index: 9999;
         width: 100vw;
         height: 45vh;
   
         background-color: rgb(0 0 0 / 85%);
         left:0px;
         position: fixed;
         bottom: -40%;
         display: flex;
         justify-content: center;
         align-items: flex-start;
         transition: 0.6s ;
         min-height:380px;
       }
       .contcontacto{
         margin-top:5px;
        border-radius: 15px;
        width: 98%;
         background-color: white;
         height: 100%;
        
       }
       .marginador{
         margin: 0px 35px 15px 35px;
         color: black;
         
         display: flex;
         flex-flow: column;
         align-items: center;
   
       }
   
      
    
     
   
       .tituloventacal{
         display: flex;
         align-items: center;
         font-size: 20px;
         font-weight: bolder;
         text-align: center;
         justify-content: space-around;
       }
       .tituloventacal p{
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
          .entradaCalcu{
            bottom:0%
          }
          .catactive{
            color: #010306;
          transition: 0.5s;
            display: flex;
            justify-content: center;
            background-color: #c9fddb;
            min-height: 80px;
        }

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

const mapStateToProps = (state, props) =>  {
 

  const usuario = state.userReducer

  return {
  
 state
  }
};

export default connect(mapStateToProps, null)(Contacto);