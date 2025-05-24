import React, { Component } from 'react'
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import {deleteCompra, updateCuentas, deleteReg, updateArts, addRegsDelete } from "../../reduxstore/actions/regcont"
import {Animate} from "react-animate-mount"
class Contacto extends Component {
   
  state={
    loading:false
  }
    componentDidMount(){
   
      setTimeout(function(){ 
        
        document.getElementById('maindeleteCompras').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('maindeleteCompras').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
    
      DeleteCompra=(reg)=>{
    
      
        let datos = {
          UserData:{DBname:this.props.state.userReducer.update.usuario.user.DBname},                   
                 ...reg,
                 UsuarioDelete:{
            
                  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                  Id:this.props.state.userReducer.update.usuario.user._id,
                  Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
              
              }  
          } 
        let lol = JSON.stringify(datos)
      
        var url= '/public/deletecompra';
    
        fetch(url, {
          method: 'POST', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {console.log('DeleteCompra:', response)

       if (response.message === "Error al registrar") {
  if (response.error && response.error.includes("Artículo no encontrado")) {
    alert("Uno de los artículos fue eliminado: " + response.error);
  } else {
    alert("Error en el sistema, por favor intente en unos minutos");
  }
  this.setState({ loading: false });
}
        
        else {
          this.props.dispatch(deleteCompra(response.Compra))
       response.arrRegs.forEach(x => {
                   
                   this.props.dispatch(deleteReg(x))
                 });
       
                 this.props.dispatch(updateCuentas(response.arrCuentas))
                 this.props.dispatch(updateArts(response.arrArts))
                     this.props.dispatch(addRegsDelete(response.arrRegsDell))
       
               this.Onsalida()
    } 
      //  this.setState({idReg:response.counter.ContRegs})
      })
    
          

      }

    render () {

  
        return ( 

         <div >

<div className="maincontacto" id="maindeleteCompras" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Seguro quieres eliminar la Compra N°{this.props.DeleteReg.CompraNumero} </p>

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
  
  this.DeleteCompra(this.props.DeleteReg)
}
      }}>
   Aceptar 
    </button>
    <Animate show={this.state.loading}>
<CircularProgress />
</Animate>
</div>


     
        </div>
        </div>
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
          z-index: 9999;
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

const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(Contacto);