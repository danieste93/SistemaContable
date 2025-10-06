import React, { Component } from 'react'
import {connect} from 'react-redux';
import  {deleteCat} from "../../reduxstore/actions/regcont"

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
class Contacto extends Component {
   
  state={
    Alert:{Estado:false},
    loading:false
  }
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('maindeletecaut').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('maindeletecaut').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      deleteCat=(cat)=>{
        let datos = {Id: this.props.datosUsuario,
          Usuario:{DBname:this.props.state.userReducer.update.usuario.user.DBname},              
          valores:cat
        }  
        let lol = JSON.stringify(datos)
        let url = "/cuentas/deletecat"   
        fetch(url, {
          method: 'PUT', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log('Delete Cat:', response)
          if(response.message=="error al registrar"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Error en el sistema, porfavor intente en unos minutos"
          }
        }else{
          
          const cat = response.Categoria
    this.props.dispatch(deleteCat({cat}))
    this.Onsalida()
          }
        })
    
      }

    render () {
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
   
        return ( 

         <div >

<div className="maincontacto" id="maindeletecaut" >
            <div className="contDeleteCat"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Seguro quieres eliminar la categoria "{this.props.catDelete.nombreCat}" </p>

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
console.log("llamando")
this.deleteCat(this.props.catDelete)
}
    }}>
 Aceptar 
  </button>
</div>


     
        </div>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
           <style jsx>{`
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
          z-index: 1301;
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
       .contDeleteCat{
        border-radius: 30px;
     
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
         .contDeleteCat{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contDeleteCat{
       
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