import React, { Component } from 'react'

import SubCat from "../components/subcompo/imgtel";
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Sugerencias from "./suggesters/telsuggest"
import {ModelosCelulares} from "./data/modelostelefono"
import {Filter} from "./filtros/filtro"
import postal from 'postal';
import { updateUser} from "../reduxstore/actions/myact"

class Contacto extends Component {
   
  state = {
 
    modelosSeleccion:ModelosCelulares
          };    
          channel3 = null;
          channelladd = null;

    componentDidMount(){
   
        
     
      this.channel3 = postal.channel();
      this.channelladd = postal.channel();
      
      }
      getAutoValue=(valor)=>{
        this.setState({valor})
        if(valor === ""){
          this.setState({modelosSeleccion:ModelosCelulares})
        }
        else{
              let datos = Filter(ModelosCelulares, valor)  
          this.setState({modelosSeleccion:datos}) 
        }
        
        

         
         }
         getClick=()=>{
          console.log("getclick")
      var field = document.createElement('input');
field.setAttribute('type', 'text');
document.body.appendChild(field);
console.log(field)
setTimeout(()=> {
field.focus();
setTimeout(()=> {
    field.setAttribute('style', 'display:none;');
}, 50);
}, 50);
        }

        onFlechaRetro=()=>{
          this.channel3.publish('modalteloff', {
            message: 'enviado desde reset'
         });
        }

handClicktel=(item)=>{



const userupdate =  this.props.usuario.update.usuario

userupdate.ModeloTel.push(item)
userupdate.Id = userupdate._id

let lugar = userupdate.ModeloTel.indexOf(item)

console.log( userupdate)

var url = '/users/update';  
var lol = JSON.stringify(userupdate)

fetch(url, {
  method: 'PUT', // or 'PUT'
  body: lol, // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => {
 
  console.log('Success:', response);
    let usuario = response.user

    this.props.dispatch(updateUser({usuario}))


});

this.channelladd.publish('addphone', {
  message: item,
  lugar
});

this.onFlechaRetro();

}


    render () {
   


      const generadorModelos = this.state.modelosSeleccion.map((item, i) => ( <SubCat
        key={i}
        titulo={item.titulo} 
          img={item.rutaimg}
          onClickF={()=>{this.handClicktel(item)}}/> 
          ));  
  
        return ( 

         <div >

<div className="maincontacto" >
            <div className="contcontacto"  >
            <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.onFlechaRetro}/>
                <div className="headercontact">
                <div className="tituloArt" >
                  Ingresa el modelo de tu celular
                </div>
                <Sugerencias sendClick={this.getClick}   getvalue={(item)=>{this.getAutoValue(item)}} modelos={ModelosCelulares}  />
             <div className="contcelulares">  

            
           <Grid  container spacing={2} style={{width:"100%"}}>
           {generadorModelos}
                  </Grid> 
                  </div>
                
        </div>

     
        </div>
        </div>
           <style >{`
        .contcelulares{
          height: 60%;
          overflow-x: hidden; /* Hide horizontal scrollbar */
          display: flex;
    justify-content: center;
        }
            .react-autosuggest__container {
              position: relative;
              border-radius: 6px;
              border: 2px solid #ffffff;
              box-shadow: -1px 5px 9px #418fe2;
          width:85%;
          margin-left: 20px;
          margin-bottom: 8px;
          display:flex;
            }
            
      
            
            .react-autosuggest__input:focus {
              outline: none;
            }
            
            .react-autosuggest__container--open .react-autosuggest__input {
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
            }
            
            .react-autosuggest__suggestions-container {
              position: absolute;
              top: 51px;
              width: 280px;
              margin: 0;
              padding: 0;
              list-style-type: none;
              border: 0px solid #aaa;
              background-color: #fff;
              font-family: Helvetica, sans-serif;
              font-weight: 300;
              font-size: 16px;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              z-index: 10;
            }
            
            .react-autosuggest__suggestion {
              cursor: pointer;
              padding: 10px 20px;
            }
            
            .react-autosuggest__suggestion--focused {
              background-color: #ddd;
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
   .PFCbuttons{
     margin-top:20px;

    display: flex;
    width: 100%;
    justify-content: space-around;
   }
           .cDc2{
     margin-left:10px;
   }
   .urgente{
    text-align: center;
    border: 1px outset blue;
    margin-top: 10px;
    border-radius: 15px;
    padding: 5px;
   }
   .urgente p{
  margin-top:0px;
  margin-bottom:15px;
   }
   .buttonURG{
     padding:8px;
     border-radius: 20px;
     background-color: #e611113d;
   }
   .icoIMG{
     margin-top:10px;
     font-size:100px;
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

.cdoptions{
  width: 40%;
    word-break: break-all;
    margin-left: 4%;
    margin-right: 4%;
    margin-top: 20px;
    border-bottom: 5px inset #ddba65;
    border-radius: 15px;
}
           .headercontact {
            flex-flow: column;
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 100%;
        }

           }

.chat{

width:100px;
margin: 5px
}


           .contbotonventa{
             display:flex;
             justify-content:center;
             width:100%;
           }

.asesoriaT{
  font-size: 20px;
    text-align: center;
    margin-top: 10px;
    border: 1px inset blue;
    border-radius: 13px;
    margin-bottom: 10px;
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
          .contsolicitador{

            display:flex;
            width:100%;
      
            justify-content: space-between;
         text-align: center;
         font-size:20px;
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
        
        .maincontacto{
          z-index: 9999;
         width: 100vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left:0px;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         
       }
       .contcontacto{
        border-radius: 30px;
     
         width: 90%;
         background-color: white;
         height: 90vh;
         overflow: hidden;
       }
       .marginador{
         margin: 0px 35px 15px 35px;
         color: black;
         
         display: flex;
         flex-flow: column;
         align-items: center;
   
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
   
       .banderaec{
         width: 40px;
         height: 40px;
         margin: 10px;
   
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

          .contcontactoDirecto{
        
         
            text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
          }
        

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
          }
        

          .react-autosuggest__suggestions-container{
           
          
    overflow: scroll;

    overflow-x: hidden; /* Hide horizontal scrollbar */
                      }


                      .react-autosuggest__suggestions-container::-webkit-scrollbar {
                        display: none;
                      }
             @media only screen and (max-width: 320px) { 
              
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
           
  
          }
          
           `}</style>
        

          
           </div>
        )
    }
}


const mapStateToProps = (state, props) =>  {
  const usuario = state.userReducer
  return { usuario}

};

export default connect(mapStateToProps, null)(Contacto);