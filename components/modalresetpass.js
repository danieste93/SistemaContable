import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Link from "next/link"
import Router from "next/router"


class Modal extends Component {
  
            state={
              correoReset:"",
              pinicial:true,
              despedida:false,
    
        }

       
    componentDidMount(){
    
              
      ValidatorForm.addValidationRule('correoval', (value) => {
        console.log(value)
      const regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
      var regex2 = /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z\-]{3,8}\.)+[a-zA-Z]{2,4}$/;
     
        if (regex2.test(value)) {
            return true;
        }
        return false;
      });
  
       ValidatorForm.addValidationRule('requerido', (value) => {
        if (value === "") {
            return false;
        }
        return true;
    });
      }

 
           


        onFlechaRetro=()=>{
         
            this.props.flechafun()
         
        }
        handleChangeform=(e)=>{
          this.setState({
              [e.target.name] : e.target.value
          })
           }

           resetpass=()=>{
            var url = '/users/resetpassword';

            var mailreset = {Correo:this.state.correoReset.toLocaleLowerCase(),
               
                              }
           
            var lol = JSON.stringify(mailreset)
            console.log(lol)
             fetch(url, {
               method: 'POST', // or 'PUT'
               body: lol, // data can be `string` or {object}!
               headers:{
                'Content-Type': 'application/json',
               
              }
             }).then(res => res.json())
             .catch(error => console.error('Error:', error))
             .then(response => {console.log('Success:', response)
            
             if(response.status === "ok"){
              this.setState({despedida:true, pinicial:false})
              }
            else if(response.status ==="error"){

                      if(response.message === "erroneo"){
                      this.setState({error1:true})
                
                      }
                      else if(response.message === "no existe el correo"){
                        this.setState({error2:true})
                      }
            }
            
            })
         
           }


       
                    
            
          
    render () {
      console.log(this.state)
      const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      const handleClose = (event, reason) => {
      
         this.setState({error1:false,error2:false})
        
    }
             return ( 
            <div >
    

            <div className="maincontactoResetpass" >
            <div className="contcontactoResetpass"  >
              <div style={{width:"100%", display:"flex", justifyContent:"flex-start"}}>

           
            <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.onFlechaRetro}/>
            </div>
            <div className="jwCard jwW100percent bgwhite jwWrap">
    
      <Animate show={this.state.pinicial}>
      <div className="jwseccionCard jwW100percent"> 
          
          <span className="material-icons jwIcofont" >
lock_open
</span>
             <p className="subtituloArt">Recuperar contraseña</p>

             <p>Ingresa tu correo electrónico</p>
<div className="seccionForm">
             <ValidatorForm
  id="formingreset"
  onSubmit={this.resetpass}
  onError={errors => console.log(errors)}
>
<TextValidator
     label="Correo"
      onChange={this.handleChangeform}
      name="correoReset"
      type="email"
      validators={['requerido',"correoval"]}
      errorMessages={['Escribe tu correo electrónico',"Escribe un correo válido"]
     
     }
      value={this.state.correoReset}
  />


             <div className="contbotonventa" style={{marginTop:"20px"}}>
<button  className="btn btn-primary" type="submit" >Enviar</button>
</div>
</ValidatorForm>
         
</div>      
           </div>

      </Animate>
      
 <Animate show={this.state.despedida}>
      <div className="jwseccionCard jwW100percent"> 
      <span className="material-icons jwIcofont" >
email
</span>
<p> Se ha enviado un correo con instucciones para restablecer su contraseña, revice su bandeja de entrada</p>
<p className="jwTextspecial">(En caso de no encontrarlo, Revice su correo no deseado y marquelo como deseado)</p>
      </div>

      <div className="jwContFlexCenter">
  <button className="btn btn-success" onClick={this.onFlechaRetro}>Home</button>

                              </div>
     </Animate>
     <Snackbar open={this.state.error1} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="warning">
        <p style={{textAlign:"center"}}>Error, vuelva a intentarlo en unos minutos </p>
    
    </Alert>
  </Snackbar>
  <Snackbar open={this.state.error2} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="error">
        <p style={{textAlign:"center"}}>El usuario no existe </p>
    
    </Alert>
  </Snackbar>
            </div>
  
       </div>
          </div>
          
         


           <style jsx>{`
             .seccionForm{
               display:flex;
             }
             .contEnf{
              background-color: #96e696;
    margin: 24px 6px;
    padding: 12px 10px;
    border-radius: 17px;
             }
             
             .grupo{
            display: flex;
    flex-flow: column;
    margin: 15px;}

             .contenedorPago{
              width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
             }
             .contenedorcontaco{
               display:flex;
               flex-flow:row;
             
    justify-content: space-evenly;
               
             }
             .jwBolder{
               font-weight:bolder;
             }
           .contactcont{
   height:100%;
   background-color: white;
   display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-evenly;
    width: 45%;
}
.imgventafull{
  width: 50%;
    margin: 10px;
}
      
.bgwhite{
  background-color: white;
           } 
                 .contLogin{
              display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: center;
    text-align: center;
    background-color: honeydew;
    padding: 20px 0px;
    border-radius: 20px;
    margin: 10px 0px;
            }
         
.minimensaje{
  text-align: center;
    font-size: 11px;
}
             .contenidoForm{
               margin: 20px 0px;
              display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
             }
             .contSoporte{  
            
 margin-top:5vw;
    border: 2px outset #75c1ff;
    display: flex;

    align-items: center;
 
    justify-content: center;
    border-radius: 12px;
    box-shadow: 3px 3px 12px black;
     
    align-items: center;
    align-content: space-around;
    justify-content: space-evenly;
    padding: 0px 10px;
    text-align: center;
             }
             .textoSoporte{
margin-bottom:0px;
             }
             .soportetec{
               width: 20%;
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
     width: 40%;
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
    padding: 0px;
   
    display: flex;
    width: 100%;


    background-color: #bdbdbd;
    border-radius: 15px;
    margin: 5px 0px;
 
    align-items: center;
  
    padding: 17px 8px 2px 8px;
   }
.cDc1{
  width: 50%;
  text-align: left;
  
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

    border-radius: 15px;
    
    padding: 9px;
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

            display:flex;
            justify-content: space-around;
            flex-flow: column;
  
    align-items: center;
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
    
    border-radius: 13px;
    margin-bottom: 20px;
    padding: 5px;
    background-color: aliceblue;
    box-shadow: 0px 1px 1px black;
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
         
            margin-bottom: 10%;
            display:flex;
            width:100%;
            align-items: center;
            justify-content: space-around;
         text-align: center;
         font-size:20px;
         flex-wrap: wrap;
          }
          .option{
            width: 45%;
    box-shadow: 0px 3px 4px black;
    border-radius: 13px;
    padding-bottom: 5%;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    height: 250px;
    word-break: break-word;
          }
          .option img{
            width:100%;
            max-width:120px;
          }
          .option3{
            margin-bottom: 20px;
    width: 135px;
    box-shadow: 0px 3px 4px black;
    border-radius: 13px;
    padding-bottom: 5%;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    margin: 5px 2vw 5vw 5px;
    height: 230px;
    word-break: break-word;
}
.option3 img{
            width:100%;
            max-width:120px;
          }
      
        
        .maincontactoResetpass{
          overflow: scroll;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    left: 0px;
    position: fixed;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
         
       }
       .contcontactoResetpass{
        position: absolute;
    top: 5%;
    border-radius: 30px;
    margin-bottom: 5%;
    width: 90%;
    background-color: white;
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: center;
      
       }
       .marginador{
         margin: 0px 15px 15px 15px;
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
   
       .iconotitulo{
         width: 60px;
         height: 60px;
         margin: 15px;
   
       }
   
       .tituloventa{
         display: flex;
         align-items: center;
         font-size: 30px;
         font-weight: bolder;
         text-align: center;
   
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
        .quejabox{
          width: 80%;
    border: 1px solid darkcyan;
    margin: 15px 0px;
    padding: 2px;
    border-radius: 3px;
        }

          .titulocontactd{
            font-size:20px;
            font-weight:bolder;
            color:black;
            height: 35%;
          }
         
             .imgEnf img{
                max-width:250px;
              }
              .botonventa-Enf{
               background-color:rgb(65, 143, 226);
             }
             .sinmargen{
              margin:0;
            }
            .doblebuttonCont{
              display: flex;
       align-items: center;
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: space-around;
            }
            
            .customfb{
             
              display: flex;
    justify-content: center;
    align-items: center;
            }
            .customfbButton{
              max-width:300px;
              height: 50px;
    font-size: 14px;
            }
            .subContactCont {
               margin:10px 0px
             }
             .contactcont i {
margin-top:10px;
margin-top:10px
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
         .contcontactoResetpass{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
            
            .soportetec{
               width: 15%;
             }
            

              .contcontactoResetpass{
       
         width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
         
            .soportetec{
               width: 15%;
             }
            
              
              
             
              .imgventa{
            margin-top: 40px;
    height: 150px;
    width: 150px;
   }
   .contsolicitador{
    margin-top: 4%;
    

   }
          }
          @media only screen and (min-width: 1200px) { 
            
            .soportetec{
               width: 10%;
             }
           
              
              .imgventa{
            margin-top: 40px;
    height: 150px;
    width: 150px;
   }
          }
          .w60percent{
               width:60%
             }
             .w100percent{
               width:100%
             }
           `}</style>
        
        
           </div>
        )
    }
}

const mapStateToProps = (state, props) =>  {
 

  return(state)

   
};

export default connect(mapStateToProps, null)(Modal);
