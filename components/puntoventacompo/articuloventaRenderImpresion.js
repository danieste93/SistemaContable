import React, { Component } from 'react'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';

class ListVenta extends Component {

    state={
        tipoPrecio:"Venta",
        CantidadArts:1,
        precioRender:0,
        err1:{value:false,text:""},
        TituloArtic:""
    }
    componentDidMount(){
      this.setState({TituloArtic:this.props.datos.Titulo})
        ValidatorForm.addValidationRule('requerido', (value) => {
            if (value === "") {
                return false;
            }
            return true;
        });

   


    }
    componentWillReceiveProps(){
  
    }
    componentWillUnmount() {
        // remove rule when it is not needed
        ValidatorForm.removeValidationRule('stock');
    }
    handleT=(e)=>{       
        this.setState({tipoPrecio:e.target.value})
    }
  
         PrecioFinal=()=>{
            let PrecioFin = 0
            let precioselect = this.state.tipoPrecio == "Venta"? this.props.datos.Precio_Venta:
            this.state.tipoPrecio == "Alternativo" ? this.props.datos.Precio_Alt.toFixed(2):
            this.state.tipoPrecio == "Compra" ? this.props.datos.Precio_Compra.toFixed(2):0
        
        
            PrecioFin = precioselect *  this.state.CantidadArts 
       
           this.setState({precioRender:PrecioFin})
           let dataKey = {index:this.props.index,Valor:PrecioFin, Id:this.props.datos._id, 
            CantidadArts:this.state.CantidadArts, TipoPrecio:this.state.tipoPrecio}
           this.props.sendPrecio(dataKey)
         }

render(){
 

 let arti = this.props.datos

 return (   
  
                
               


         <div className="maincontDetalles">
         
        
                    <div className="contdetalle titulo2Print">
                   
                   <div className="valorDRed textoArtredu"> 
                {arti.Titulo}
                    </div>
                   
                   
               </div>
              
       
                    <div className="contdetalle ArticImp">
                    
                    <div className="valorDRed textoArtRenderImp"> 

                    {arti.CantidadCompra}
                     </div>
                    
                    </div>
                    <div className="contdetalle ArticImp">
                    
                    <div className="valorDRed textoArtRenderImp"> 
              
                    $    {arti.PrecioVendido}
                     </div>
                    
                    </div>
               
                
  
  
        
         
       
         
           
               <style jsx>{`
            
               .tipoprecio{
                   border-radius:10px;
               }
               .moneycont{
                   display:flex;
               }
               .miscien{
                width: 80%;

 
            }
            .Numeral{
                width: 15px;  
            }
          
            .docientos{
                width: 50%;
                max-width: 300px;
                text-align: center;
                min-width: 250px;
     
            }
            .titulo2Print{
                width: 60%;  
           
            }
            .botoneralist{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                margin: 10px 0px;
                width: 10%;
               }
                          .contdetalle {
                            display: flex;
                            flex-wrap: wrap;
                    justify-content: space-between;
                    margin: 10px 0px;
                        }
                      
                        .tituloD{
                      
                            font-weight:bolder;
                        margin-right:10px
                       
                        }
                    
                   .mybtn{
                    font-size: 20px;
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                   }
                  .accClass{
                      width:10%;
                  }
                   .valorDRed{
                   
                    width: 100%;
                    display: flex;
 justify-content: center;
 align-items: center;
  
}
                   }
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .contRepuesto{
            display: inline-flex;

    overflow: hidden;
    margin: 5px 0px;
    border-radius: 6px;
  border-bottom: 2px solid black;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;

}
        .parrafoD {
            margin-bottom:1px;
            word-break: break-all;
        }

       form{
        width: 100%;
       }
        
       .ArticRes{
        width: 10%;  
        align-items: center;
        max-width:150px;
        justify-content: center;
    
    }
    .ArticImp{
        width: 20%;  
        
        max-width:250px;
        justify-content: center;
    }
        .maincontDetalles{
            display: flex;
            color: black;
            width: 100%;  
            font-size: 20px;
            justify-content: space-around;
           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        @media print {      
            .textoArtRenderImp{
                font-size:14px;
            }
            .textoArtredu{
                font-size:12px;
            }

        }
     
     `}</style>
        </div>
    
    )
}

}

export default ListVenta
