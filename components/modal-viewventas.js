import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import NotaVentaTemplate from "../public/static/NotaTemplate"
import FacturaTemplate from "../public/static/FactTemplate"
import { teal } from '@material-ui/core/colors';


class Contacto extends Component {
  state={
Html:""
  }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainViewVentas').classList.add("entradaaddc")

       }, 500);

      console.log(this.props)
      console.log("enview")

      let TemplateAsignado 

      if(this.props.datos.Doctype == "Nota de venta"){
TemplateAsignado = NotaVentaTemplate

      }else{
        TemplateAsignado = FacturaTemplate
      }

      let artImpuestos  = this.props.datos.articulosVendidos.filter(x=>x.Iva)
      let artSinImpuestos = this.props.datos.articulosVendidos.filter(x=>x.Iva == false)
      let totalSinImpuestos = 0
      let baseImpoConImpuestos = 0
      let baseImpoSinImpuestos = 0
      if(artImpuestos.length > 0){
          for(let i=0;i<artImpuestos.length;i++){
             
              baseImpoConImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
          }
          
      }
      if(artSinImpuestos.length > 0){
          for(let i=0;i<artSinImpuestos.length;i++){
              totalSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
              baseImpoSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
          }
      }

      let tiempo = new Date(this.props.datos.tiempo) 
      let mes = this.addCero(tiempo.getMonth()+1)
      let dia = this.addCero(tiempo.getDate())
      var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()

      let viewHTML = TemplateAsignado({...this.props.datos,
        baseImpoConImpuestos,
        baseImpoSinImpuestos,
        totalSinImpuestos,
       SuperTotal:this.props.datos.PrecioCompraTotal,
        ArticulosVendidos:this.props.datos.articulosVendidos,
        razonSocialComprador:this.props.datos.nombreCliente == ""?"CONSUMIDOR FINAL":this.props.datos.nombreCliente,
        identificacionComprador:this.props.datos.cedulaCliente==""?"9999999999999":this.props.datos.cedulaCliente,
        correoComprador:this.props.datos.correoCliente,
        direccionComprador:this.props.datos.direccionCliente,
        ciudadComprador:this.props.datos.ciudadCliente,
        LogoEmp:this.props.usuario.user.Factura.logoEmp,
        rimpeval:this.props.usuario.user.Factura.rimpe,
        populares:JSON.parse(this.props.usuario.user.Factura.populares),
        estab:this.props.usuario.user.Factura.codigoEstab,
        ptoEmi:this.props.usuario.user.Factura.codigoPuntoEmision,
        secuencial:this.props.datos.Secuencial,
        fechaEmision:date,
        ruc:this.props.usuario.user.Factura.ruc,
        dirEstablecimiento:this.props.usuario.user.Factura.dirEstab,
        fechaAuto:this.props.datos.FactFechaAutorizacion,
        numeroAuto:this.props.datos.FactAutorizacion,
        obligadoContabilidad:this.props.usuario.user.Factura.ObligadoContabilidad?"Si":"No",
        idVenta:this.props.datos.iDVenta


      })
  
      this.setState({Html:viewHTML})
      
      
      }
      addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
      Onsalida=()=>{
        document.getElementById('mainViewVentas').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {
console.log(this.state)
console.log(this.props)
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