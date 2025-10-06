import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import NotaCredito from "../public/static/NotaCreditoTemplate"
import ModalDeleteGeneral from './cuentascompo/modal-delete-general';
import { Animate } from "react-animate-mount";

class Contacto extends Component {
  state={
Html:"",
modalDelete:false
  }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainViewVentas').classList.add("entradaaddc")

       }, 500);

    let viewHTML = NotaCredito(this.props.datos.NotaCredito)
  
   this.setState({Html:viewHTML})
      
      }
   
      Onsalida=()=>{
        document.getElementById('mainViewVentas').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      downloadFact=()=>{  
        console.log("en download")
       
        let datos = {
      Html:NotaCredito(this.props.datos.NotaCredito)
    }


        fetch("/public/downloadPDFbyHTML", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(datos), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.userData.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
       
          if(response.status == "Ok"){
            const url = window.URL.createObjectURL(
              new Blob([Buffer.from(response.buffer)], { type: "application/pdf"}),
            );
          let link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Nota-de-Crédito ${this.props.datos.NotaCredito.secuencial}`,
          );
          link.click()
          
          let add = {
            Estado:true,
            Tipo:"success",
            Mensaje:"Operacion exitosa, espere unos segundos"
        }
        this.setState({Alert: add })
        }
        })
      
      
      }
      

    render () {
console.log(this.state)

        return ( 

         <div >

<div className="maincontacto" id="mainViewVentas" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Nota de Crédito de la Venta Nro - {this.props.datos.iDVenta} 




</div>
<div>
  <button className=" btn btn-dark btnDropDowm" onClick={this.downloadFact} >
            <span className="material-icons" >
            download
          </span>
          <p>Descargar Nota C.</p>
          </button>

          <button  className="btn btn-danger btnDropDowm " onClick={(e)=>{ this.setState({modalDelete:true}) }}><span className="material-icons">delete
</span>
<p>Eliminar</p>

</button>
</div>



</div> 
<div className="Scrolled">
  {this.state.Html==""?<CircularProgress />:<div contentEditable='true' dangerouslySetInnerHTML={{ __html: this.state.Html }}></div>}

</div>
</div>
        </div>
          <Animate show={this.state.modalDelete}> 
                <ModalDeleteGeneral
                 sendSuccess={(e)=>{console.log(e);this.props.updateNotaCred(e);this.Onsalida() }}
                 sendError={(e)=>{console.log("error al eliminar", e)}}
                itemTodelete={{...this.props.datos, ...this.props.userData}}
                 mensajeDelete={{mensaje:"Seguro quieres eliminar esta Nota de Crédito? Recuerda que aun debes eliminarla en portal del SRI", 
                  url:"/public/deleteNotaCredito" }}
                Flecharetro={()=>this.setState({modalDelete:false})}
          
                />
                   </Animate>
        <style jsx >{`
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
                     
                      height: 80vh;
                      padding: 5px;
                     
                     }
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default Contacto