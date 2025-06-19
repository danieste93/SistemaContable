import React, { Component } from 'react'

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class Contacto extends Component {
   
state={
  PrecioCompraServ:this.props.data.Precio_Compra
}
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainEditServ').classList.add("entradaaddc")

       }, 500);
        
     
console.log(this.props)
      
      }
   
      Onsalida=()=>{
        document.getElementById('mainEditServ').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChangePrecioServ=(e)=>{
        this.setState({
          [e.target.name]:e.target.value,
            })

            this.props.sendServData({item:this.props.data, value:e.target.value})
      }
      

    render () {

   
        return ( 

         <div >

<div className="maincontacto" id="mainEditServ" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Configuración de Servicio

</div>



</div> 
<div className="Scrolled">
  
<div style={{display:"none"}} className='contBotonesExtra'>
   <button className={` btn btn-primary botonedit2 extrabutton`} >



</button>
<button className={` btn btn-warning botonedit2 extrabutton`} >
<span>Generar Gasto</span>


</button>
   </div>
<div className="centrar">


<ValidatorForm
   
  
>

<div  className="contdetalleAI"> 
    <TextValidator
    label="Precio Compra"
     onChange={this.handleChangePrecioServ}
     name="PrecioCompraServ"
     type="number"
  value={this.state.PrecioCompraServ}
        placeHolder="0"
  
    
 /> 
    </div>
    </ValidatorForm>
    </div>   
  
    <div className="contBotonPago">
                    <button className={` btn btn-success botonedit2 okbutton`} onClick={this.Onsalida}>
<span>Ok</span>
<i className="material-icons">
done
</i>

</button>
</div>
    </div>


</div>
        </div>
        <style jsx >{`
        .okbutton{
          width: 50%;
          display: flex;
          max-width: 100px;
          justify-content: space-around;
          align-items: center;
          height: 40px;
        }
        .extrabutton{
          
          display: flex;
          width: 90px;
          justify-content: space-around;
          align-items: center;
          height: 50px;
          border-radius:30%;
          padding:14px;
        }
         .contBotonPago{
          margin-top: 20px;
          display: flex;S
          align-items: center;
          justify-content: space-around;
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
                    .contBotonesExtra{
                      display: flex;
    justify-content: space-around;
    margin: 20px ;
    
                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 30vh;
                      padding: 5px;
                     
                     }

                     @media only screen and (min-width: 1350px) {

                      
                  .contcontacto{
        
                    
                    width: 50%;
              
                    
                    }
                  }
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default Contacto