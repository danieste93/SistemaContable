import React, { Component } from 'react'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import {Animate} from "react-animate-mount"
class ListVenta extends Component {

    state={
        tipoPrecio:"Venta",
        CantidadArts:1,
        precioRender:0,
        err1:{value:false,text:""},
        TituloArtic:"",
        Medida:this.props.datos.Unidad,
       
        unidadProducto:this.props.datos.unidadProducto,
        pesoProducto:1,
        loadedComp:false,
    }
    componentDidMount(){
console.log(this.props)
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
   
    handleT=(e)=>{
       
        this.setState({tipoPrecio:e.target.value})
    }
 

      checkService=(service)=>{
      
       let data = service.Tipo == "Servicio"? true:false
      
       return data
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
        
       
        ComprobadorIva=()=>{
            if(this.props.datos.Iva){
                if(this.state.precioRender ==0){ 
               

                return 0
                    }
                    else {
                        let diferencial = this.state.precioRender -  (this.state.precioRender / parseFloat(`1.${process.env.IVA_EC }`)).toFixed(2)
                        return diferencial.toFixed(2)
                    }
            }else{
               
                return "0"

            }
        }
        handleChangeCantidad=(e)=>{
            let item = this.props.datos
          console.log(item)
          let precioselect = item.PrecioVendido
          if(item.Tipo == "Producto" && item.Medida =="Peso"){
           
            console.log(precioselect)
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
               
                let precioselect = item.PrecioVendido
            
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
render(){
  
    let getunhide = this.state.loadedComp ?"unhide":""
    let cantidadErr= ""
   
  
    let generada = "stock" 
 
    ValidatorForm.addValidationRule(generada, (value) => {
       
        if (value <= this.props.datos.Existencia) {
            return true;
        }
        return false;
    });


 
 
    return (   
         <div className={`contPrinVentaRender ${getunhide}`}> 
                
                <div className="contArtVenta">
<div className="firstcont">
<ValidatorForm ref={this.props.datos._id} style={{width:"100%"}}>
         <div className="maincontDetalles">
         
         <div className="contdetalle">  
                    
                    <div className="valorD "> <p className="parrafoD Numeral"> {this.props.index + 1}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle titulo2Artic">
                   
                   <div className="valorD "> <input value={this.state.TituloArtic}className=" parrafoD docientos"  />   </div>
                   
                
                   </div>
              
         <div className="contdetalle ArticResPrecio">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> 
                 
                    <div className="boxp">
    
    <input
    className={` inputCantidad `}
     
    onChange={this.handleChangeCantidad}
      name="unidadProducto"
      type="number"
   
    value={this.state.unidadProducto}
    
     
    /> 
      
     
      </div> 
   
              
                      </p></div>
                    
                 
                    </div>
                
                    <div className="contdetalle ArticResPrecio">
                    
                    <div className="valorD "> 
                    <select className="tipoprecio miscien" value={this.state.tipoPrecio}  >
          <option value="Venta"> Venta</option>
          <option value="Alternativo" > Alternativo </option>
          <option value="Compra" > Compra </option>
         </select>
                    
                     </div>
                    
                    </div>
                    <div className="contdetalle ArticRes">
                    <div className="valorD "> <p className="parrafoD miscien">   
                   $ {this.ComprobadorIva()}
                    
                     </p></div>
                    </div>
               
                    <div className="contdetalle ArticRes">
                    
                    <div className="valorD ">
                    <p className="parrafoD miscien moneycont"> 
                    $
                    <TextValidator
 
 
 name="PrecioArt"
 onChange={this.handleChangeprecio}
 type="number"
 validators={['requerido']}
 errorMessages={['Escribe la cantidad'] }
 value={this.state.precioRender}
className="newstyle"
/>     
</p>

                         </div>
                                     
                    </div>
                   
                    <div className="botoneralist ArticRes ">
         
        <button  className="btn btn-danger mybtn " onClick={()=>{this.props.deleteitem(this.props.datos)}}><span className="material-icons">
delete
</span></button>

         </div>     
  
         </div>
         </ValidatorForm>   
         </div>
       
         
           
         
        </div>
        <style jsx>{`
            .newstyle{
                font-size:20px;
            }
               .tipoprecio{
                   border-radius:10px;
               }
               .moneycont{
                   display:flex;
                   font-size:20px;
                   align-items: center;
               }
               .moneycont input{
              
                font-size:20px;
                margin-left:5px;
            }
               .miscien{
                width: 80%;

 
            }
            .Numeral{
                width: 15px;  
          
            }
                 .customSelect{
        border-radius: 6px;
        padding: 2px;
      }
      .inputCantidad{
        width: 80%;       
        border: none;
        border-bottom: 1px solid blue;
        margin-bottom: 4px;
        text-align: center;
        border-radius: 8px;
        transition:1s;
    }
          
            .docientos{
                width: 50%;
                
                max-width: 300px;
                text-align: center;
                min-width: 250px;
                margin-right:0px; 
                border-radius: 10px;
            padding: 5px;
            font-size: 15px;
            }
            .titulo2Artic{
                width: 50%;  
                max-width: 300px;
                text-align:center;
                min-width: 250px; 
      
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
                   .valorD{
                   
                    width: 100%;
                    display: flex;
 justify-content: center;
 align-items: center;
  
}
                   
                 
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .contArtVenta{
            display: inline-flex;

    overflow: hidden;
    margin: 5px 0px;
    border-radius: 6px;
  border-bottom: 2px solid black;
    flex-wrap: wrap;
    justify-content: center;
    

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
        min-width: 100px;
        justify-content: center;
    
    }
    .ArticResPrecio{
        width: 15%;  
     
        max-width:150px;
        min-width: 100px;
        justify-content: center;
   
    }
        .maincontDetalles{
            display: flex;
            color: black;
           
            font-size: 20px;
          
           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .contPrinVentaRender{
            opacity: 0;
            transition:1s
           }
           .unhide{
            opacity: 1;
           }
        
     `}</style>

        </div>
    )
}

}

export default ListVenta
