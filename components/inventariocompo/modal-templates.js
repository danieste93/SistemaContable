import React, { Component } from 'react'
import ModalDeleteGeneral from '../cuentascompo/modal-delete-general';
import {Animate} from "react-animate-mount"

class Contacto extends Component {
   
state={
  plantillasRender:[],
  deleteDesing:false,
}
    componentDidMount(){
      console.log(this.props)
      setTimeout(function(){ 
        
        document.getElementById('mainTemplates').classList.add("entradaaddc")

       }, 500);
        
     
this.loadTemplates()
      
      }
      loadTemplates=  ()=>{
        
        
           let datos = {User: {DBname:this.props.userdata.user.DBname,
   
           },          
          
         }
         let lol = JSON.stringify(datos)
         fetch("/public/gettemplates", {
           method: 'POST', // or 'PUT'
           body: lol, // data can be `string` or {object}!
           headers:{
             'Content-Type': 'application/json',
             "x-access-token": this.props.userdata.token
           }
         }).then(res => res.json())
         .catch(error => {console.error('Error:', error);
                })
         .then(response => {  
          console.log(response)
       
             if(response.status == 'error'){
           
                     if(response.message == "error al decodificar el token"){
                       this.props.dispatch(logOut());
                       this.props.dispatch(cleanData());
                       alert("Session expirada, vuelva a iniciar sesion para continuar");
                   
                   
                       Router.push("/")
                         
                     }
                     if(response.message=="error al registrar"){
                       let add = {
                         Estado:true,
                         Tipo:"error",
                         Mensaje:"Error en el sistema, porfavor intente en unos minutos"
                     }
                     this.setState({Alert: add, loading:false,}) 
                     }else if(response.message=="articuloHTML no encontrado"){
                       
                     }
   
             }else if(response.status == 'Ok'){             
              this.setState({plantillasRender:response.templates})
               
             }
         });
       
           }
      Onsalida=()=>{
        document.getElementById('mainTemplates').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      
      deleteDesing=  (item)=>{
        this.setState({itemTodelete:item, deleteDesing:true})
        
              }

    render () {

  const renderTemplates = ()=>{
    console.log(this.state)
    if(this.state.plantillasRender.length > 0){
      let plastillamaper = this.state.plantillasRender.map((item)=>{
        console.log(item)
       return (
       <div className='contHtml'>
 <div className='htmlcontent'   dangerouslySetInnerHTML={{ __html: item.publicHtml }}></div>
<div className="contBotones ">
<button className={` btn btn-success botonelegir `} onClick={()=>{this.props.SendDesing(item.Diseno);this.Onsalida()}}>
<p>Elegir</p>
<i className="material-icons">
payment
</i>

</button>
<button className={` btn btn-danger botonelegir `} onClick={()=>{this.deleteDesing(item)}}>
<p>Eliminar</p>
<i className="material-icons">
delete
</i>

</button>
</div>
       </div>
                         
      
      )})
      return(plastillamaper)
    }else{
      return ""
    }

  } 
        return ( 

         <div >

<div className="maincontacto" id="mainTemplates" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Biblioteca de Plantillas

</div>



</div> 
<div className="Scrolled">

<div className='containerhtml'>
{renderTemplates()}
</div>

</div>
</div>
        </div>
        <style  >{`
        .contBotones {
          display:flex;
       
    margin-top: 5px;
    justify-content: space-evenly;
        }
        .contHtml{
         
      
         
          width: 45%;
     
          display:flex;
          padding:5px;
          flex-flow: column
        }
        .htmlcontent{
          width: 100%;
          border:1px solid black;
          height: 288px;
          overflow: scroll;
          border-radius: 10px;
        }
        .containerhtml{
          display:flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
           .maincontacto{
            z-index: 1298;
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
                     
                      height: 90vh;
                      padding: 5px;
                     
                     }
                  
           `}</style>
        <Animate show ={this.state.deleteDesing}>
        <ModalDeleteGeneral
         sendSuccess={()=>{this.loadTemplates();this.setState({deleteDesing:false})} }
         sendError={()=>{console.log("deleteerror")}}
        itemTodelete={this.state.itemTodelete}
         mensajeDelete={{mensaje:"Estas seguro quieres eliminar esta plantilla", url:"/public/deleteplantillas" }}
        Flecharetro={()=>this.setState({deleteDesing:false})}
  
        />
        </Animate>
          
           </div>
        )
    }
}

export default Contacto