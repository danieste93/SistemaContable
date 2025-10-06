import React, { Component } from 'react'
import {connect} from 'react-redux';
import postal from 'postal';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {updateUser2} from "../../reduxstore/actions/myact"

class Contacto extends Component {

  channel1 = null;
  state={
    loading:false,
    Alert:{Estado:false},
     idReg:"",
  }
    componentDidMount(){
    
   
      this.channel1 = postal.channel();
      setTimeout(function(){ 
        
        document.getElementById('maindeleteart').classList.add("entradaaddc")

       }, 500);
            
      }
   
   
      Onsalida=()=>{
        document.getElementById('maindeleteart').classList.remove("entradaaddc")
        console.log("en Onsalida")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      Deletedata=(data)=>{
    
        let allData = data
        allData.idUser = this.props.state.userReducer.update.usuario.user._id
        allData.User = {DBname:this.props.state.userReducer.update.usuario.user.DBname}
        fetch("/public/deleteseller", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(allData), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => {console.error('Error:', error);})
        .then(response => {

          if(response.status =="ok" ){

            const usuario= response.user
         this.props.dispatch(updateUser2({usuario}))
         
            let add = {
              Estado:true,
              Tipo:"info",
              Mensaje:"Vendedor Eliminado"
          }   
            this.setState({
              Alert: add,
            
            })
            this.Onsalida()
          }
        })  

      }

    render () {
console.log(this.props)





      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
console.log(this.props)
   
        return ( 

         <div >

<div className="maincontacto" id="maindeleteart" >
            <div className="contcontacto"  >
            <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
            <div className="headercontact">
               
              <div className="subtituloArt">
                
            <p> Seguro quieres eliminar al vendedor:</p>
    

                   </div>
                   <p className="tituloArt">"{this.props.dataDel.Usuario}"</p>
                   <p className="tituloArt">"{this.props.dataDel.Correo}"</p>
             </div>

    

             <div className="contBotonesDuales">
  <button className="botonesDuales btn-danger" onClick={ this.Onsalida }>
  Cancelar
    </button>
    <button className="botonesDuales btn-success" onClick={ (e)=>{
        e.stopPropagation(); 
      
      if(this.state.loading == false){
        this.setState({loading:true})
        this.Deletedata(this.props.dataDel)
      }
    
    }
      
      
      
      }>
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
            
                          
            .contBotonesDuales{ 
              display: flex;
              justify-content: space-around;
                       
              margin: 25px;}
             
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
  width: 150px;
  margin-right: 11px;
  text-align: right;  
}
            


           .headercontact {

            display:flex;
            justify-content: space-around;
            flex-flow: column;

    align-items: center;

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
          z-index: 1300;
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
         flex-flow: column;
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
       .Contwarning{
        background: orange;
        border-radius: 22px;
        padding: 10px;
        max-width: 500px;
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
           .grupoDatos{
           
            border-radius: 17px;
                display: flex;
            justify-content: center;
            
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