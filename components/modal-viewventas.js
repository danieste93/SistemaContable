import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';

class Contacto extends Component {
  state={
Html:""
  }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainViewVentas').classList.add("entradaaddc")

       }, 500);

       let datos = {
        User: {DBname:this.props.usuarioDBname,
              },
              ...this.props
        

      }
       let settings = {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(datos), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.token
        }
      }
       fetch("/cuentas/getVentasHtml", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
        this.setState({loadingData:false})        
      
      })
        .then(response => {  
        console.log(response)
         this.setState({Html:response.ventasHabiles.Html})
      
        })

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainViewVentas').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
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
    
{this.props.datos.TipoVenta} - {this.props.datos.iDVenta} 

</div>



</div> 
<div className="Scrolled">
  {this.state.Html==""?<CircularProgress />:<div contentEditable='true' dangerouslySetInnerHTML={{ __html: this.state.Html }}></div>}

</div>
</div>
        </div>
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