import React from "react";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';


class ArticuloVentaRender extends React.Component {
  
    
    state = {
      titulo: this.props.datos.Titulo,
    
     
       tipoPrecio:"Venta",
        CantidadArts:1,
        precioRender:0,
        err1:{value:false,text:""},
        TituloArtic:"",
        Medida:this.props.datos.Unidad,
       
        unidadProducto:this.props.datos.unidadProducto,
        pesoProducto:1,
        loadedComp:false,
    };
  
      componentDidMount(){
       
    setTimeout(()=>{
        this.setState({loadedComp:true})
        
    },10)
    
          this.setState({TituloArtic:this.props.datos.Titulo,
            unidadProducto:this.props.datos.CantidadCacl ,
           pesoProducto:this.props.datos.CantidadCacl,
        
           tipoPrecio:this.props.datos.TipoPrecio,
           precioRender:this.props.datos.PrecioCompraTotal
        })
    
    
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

 handleChangeCantidad=(e)=>{
        let item = this.props.datos
      
      if(item.Tipo == "Producto" && item.Medida =="Peso"){
        let precioselect = this.state.tipoPrecio == "Venta"? this.props.datos.Precio_Venta:
        this.state.tipoPrecio == "Alternativo" ? this.props.datos.Precio_Alt.toFixed(2):
        this.state.tipoPrecio == "Compra" ? this.props.datos.Precio_Compra.toFixed(2):0

        let pesoengramos = 0
        if(this.state.Medida == "Gramos"){
            pesoengramos = (e.target.value * 1)
        }else if(this.state.Medida == "Libras"){
            pesoengramos = (e.target.value * 453.592)
        }else if(this.state.Medida == "Kilos"){
            pesoengramos = (e.target.value * 1000)
        }
    let newPrice = (pesoengramos * precioselect).toFixed(2)
    this.setState({pesoProducto:e.target.value,
        precioRender:newPrice,
  
}) 
this.props.sendAll({value:newPrice,
    CantidadGramos:pesoengramos,
     cant: e.target.value, 
     unidad:this.state.Medida,
item})  

        }else if(item.Tipo == "Producto" && item.Medida =="Unidad" || item.Tipo == "Servicio"|| item.Tipo == "Combo" ){
           
          
            let precioselect = this.state.tipoPrecio == "Venta"? this.props.datos.Precio_Venta:
            this.state.tipoPrecio == "Alternativo" ? this.props.datos.Precio_Alt.toFixed(2):
            this.state.tipoPrecio == "Compra" ? this.props.datos.Precio_Compra.toFixed(2):0
        
        
            let newPrice = (e.target.value* precioselect).toFixed(2)
           
            this.setState({unidadProducto:e.target.value,
                precioRender:newPrice,
          
}) 


this.props.sendAll({value:newPrice,    
     cant: e.target.value, 
     CantidadGramos:e.target.value, 
     unidad:"",
item})  


        }
      
      }
 handleChangeCantidadflecha=(valor)=>{
        let item = this.props.datos
      let valoractual = parseFloat(this.state.unidadProducto)
      
if(valor == "sumar"){
 valoractual +=1
}
else if(valor == "restar"){
 valoractual -= 1
}
console.log(valor)
console.log(valoractual)
  if(item.Tipo == "Producto" && item.Medida =="Unidad" || item.Tipo == "Servicio"|| item.Tipo == "Combo" ){
           
          
            let precioselect = this.state.tipoPrecio == "Venta"? this.props.datos.Precio_Venta:
            this.state.tipoPrecio == "Alternativo" ? this.props.datos.Precio_Alt.toFixed(2):
            this.state.tipoPrecio == "Compra" ? this.props.datos.Precio_Compra.toFixed(2):0
        
        
            let newPrice = (valoractual* precioselect).toFixed(2)
           
            this.setState({unidadProducto:valoractual,
                precioRender:newPrice,
          
}) 


this.props.sendAll({value:newPrice,    
     cant: valoractual, 
     CantidadGramos:valoractual, 
     unidad:"",
item})  


        }
      
      }

   handleChangeTipoprecio=(e)=>{
            
            this.setState({
                tipoPrecio : e.target.value
            }) 
            setTimeout(()=>{this.PrecioFinal(e)},50)
         }
        handleChangeprecio=(e)=>{
          
            this.setState({
                precioRender: e.target.value
            })
            let  pesoengramos = 1
                 
            if(this.state.Medida == "Gramos" || this.state.Medida == "" || this.state.Medida == undefined ){
                pesoengramos = parseFloat(this.state.unidadProducto) * 1
            }else if(this.state.Medida == "Libras"){
                pesoengramos =   (parseFloat(this.state.unidadProducto) * 453.592)
            }else if(this.state.Medida == "Kilos"){
                pesoengramos =   (parseFloat(this.state.unidadProducto) * 1000)
            }
            let dataKey = {index:this.props.index,Valor:e.target.value, Id:this.props.datos._id, 
                CantidadArts:pesoengramos }
               
         this.props.sendPrecio(dataKey)
         }
         PrecioFinal=()=>{
        
            let PrecioFin = 0
            let precioselect = this.state.tipoPrecio == "Venta"? this.props.datos.Precio_Venta:
            this.state.tipoPrecio == "Alternativo" ? this.props.datos.Precio_Alt:
            this.state.tipoPrecio == "Compra" ? this.props.datos.Precio_Compra:0
        
         
            let  pesoengramos = 1
                 
            if(this.state.Medida == "Gramos" || this.state.Medida == "" ||this.state.Medida == undefined){
                pesoengramos = (parseInt(this.state.unidadProducto) * 1)
            }else if(this.state.Medida == "Libras"){
                pesoengramos =   (parseInt(this.state.unidadProducto) * 453.592)
            }else if(this.state.Medida == "Kilos"){
                pesoengramos =   (parseInt(this.state.unidadProducto) * 1000)
            }
         
            PrecioFin = (precioselect  * pesoengramos).toFixed(2)
            
            this.setState({precioRender:PrecioFin})
         
            let dataKey = {index:this.props.index,
                Valor:PrecioFin,

                Id:this.props.datos._id, 
                CantidadGramos:pesoengramos,
                tipoPrecio:this.state.tipoPrecio,
                PrecioVenta:precioselect,
                item:this.props.datos
            }
             
            this.props.sendTipoPrecio(dataKey)
          
        }


  render() {
    const { datos, index } = this.props;
    const { titulo, tipoPrecio, existencia } = this.state;

    const precio = datos[tipoPrecio];

    return (
      <div className="articulo">
        
        <img className="imagen" src={datos.Imagen[0]} alt="producto" />
<ValidatorForm ref={this.props.datos._id} style={{width:"100%"}}>

        <div className="info">

            <div className="contSuperior">
          <input
            type="text"
            className="titulo"
            value={titulo}
            onChange={(e) => {this.setState({ titulo: e.target.value });
          
          this.props.sendNewtitulo(e.target.value, this.props.datos)
          }}
          />
         
            <div className="cantidad-container">
            <i className="material-icons flecha" onClick={() => this.handleChangeCantidadflecha("restar")}>keyboard_arrow_left</i>
            <input
              type="number"
              className="cantidad"
              value={this.state.unidadProducto}
           onChange={this.handleChangeCantidad}
            />
            <i className="material-icons flecha" onClick={() => this.handleChangeCantidadflecha("sumar")}>keyboard_arrow_right</i>
          </div>
          </div>

          <div className="precio-container">
            $
            <div style={{width:"25%"}}>
                         <TextValidator
            
            onChange={this.handleChangeprecio}
            name="PrecioArt"
            type="number"
            validators={['requerido']}
            errorMessages={['Escribe la cantidad'] }
            value={this.state.precioRender}
           className="newstyle"
           />  
           </div>
            <select
              className="select-precio"
              value={tipoPrecio}
              onChange={this.handleChangeTipoprecio}
            >
             <option value="Venta"> Venta</option>
          <option value="Alternativo" > Alternativo </option>
          <option value="Compra" > Compra </option>
            </select>
           <div className="contIva">
          <span className={`iva ${datos.Iva ? 'activo' : 'inactivo'}`}>
            <small>IVA</small>
            </span>
</div>
          </div>

        
        </div>
  </ValidatorForm>  
        <i
          className="material-icons borrar"
          onClick={ ()=>{this.props.deleteitem(this.props.datos)}}
          title="Eliminar"
        >
          delete
        </i>

        <style jsx>{`
          .articulo {
            display: flex;
            align-items: center;
                background: #d3f1f4;
            border-radius: 10px;
            padding: 5px;
            margin: 10px 0;
            position: relative;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .imagen {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            margin-right: 10px;
          }

          .info {
            flex: 1;
          }

          .titulo {
            width: 70%;
            font-size: 12px;
            margin-bottom: 5px;
            padding: 4px;
            border-radius: 4px;
            border: 1px solid #ccc;
        
          }

          .precio-container {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 0px;
          }

          .precio {
            width: 40px;
            padding: 2px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }

          .select-precio {
            padding: 2px;
              width: 18px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }

          .iva {
          
            color: #ccc;
          }

          .iva.activo {
            color: orange;
          }

          .existencia-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 50px;
          }

          .existencia {
            width: 100%;
            text-align: center;
            border-radius: 10px;
            border: 1px solid #ccc;
            padding: 2px;
          }

      

          .borrar {
            position: absolute;
            bottom: 5px;
            right: 10px;
            color: #999;
            cursor: pointer;
            transition: color 0.2s ease;
          }

          .borrar:hover {
            color: red;
          }
            .contSuperior{
            display:flex;
                justify-content: space-between;
                align-items: center;
            }
            .cantidad-container{
            width:30%;
                flex-flow: row;
                display:flex;
    justify-content: center;
    align-items: center;
            }
            .cantidad{
                width:30px;
                text-align:center;
                border-radius:15px
                
            }
                /* Para Chrome, Safari, Edge, Opera */
.cantidad::-webkit-inner-spin-button,
.cantidad::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Para Firefox */
.cantidad {
  -moz-appearance: textfield;
}
  .contIva{
  display: flex;
    justify-content: flex=start;
    align-items: center;
  }
        `}</style>
      </div>
    );
  }
}

export default ArticuloVentaRender;
