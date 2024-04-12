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
    handleChangeMedida=(e)=>{
        let item = this.props.datos
     
        let precioselect = this.state.tipoPrecio == "Venta"? this.props.datos.Precio_Venta:
        this.state.tipoPrecio == "Alternativo" ? this.props.datos.Precio_Alt.toFixed(2):
        this.state.tipoPrecio == "Compra" ? this.props.datos.Precio_Compra.toFixed(2):0
        
        let pesocambio =     this.state.pesoProducto
        let CantidadGramos =     0
        if(e.target.value == "Gramos"){
            CantidadGramos =  (pesocambio  * 1)
        }else if(e.target.value == "Libras"){
            CantidadGramos =  (pesocambio  * 453.592)
        }else if(e.target.value == "Kilos"){
            CantidadGramos =  (pesocambio  * 1000)
        }


        let newPrice = (CantidadGramos * precioselect).toFixed(2)
    
        this.props.sendAll({value:newPrice,                
            cant: this.state.pesoProducto, 
            unidad:e.target.value,
            CantidadGramos,
   item})  
        this.setState({precioRender:newPrice,           
           Medida:e.target.value})
            

         
        }
    handleT=(e)=>{
       
        this.setState({tipoPrecio:e.target.value})
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

      checkService=(service)=>{
      
       let data = service.Tipo == "Servicio"? true:false
      
       return data
      }


         handleCambioTitulo=(e)=>{

this.setState({
    TituloArtic: e.target.value
}) 
this.props.sendNewtitulo(e.target.value, this.props.datos)
         }
         
         handleChangeTipoprecio=(e)=>{
            
            this.setState({
                tipoPrecio : e.target.value
            }) 
            setTimeout(()=>{this.PrecioFinal(e)},10)
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
         ComprobadorTipoArt=(cantidadErr, comboErr)=>{
        
            let item = this.props.datos
     
            if(item.Tipo == "Servicio"){
                return (<div>
                    <div className="boxp">
       
       <input
       className={` inputCantidad ${cantidadErr}`}
        
         onChange={this.handleChangeCantidad}
         name="unidadProducto"
         type="number"
         placeholder={0}
       value={this.state.unidadProducto}
       
        
       /> 
         
        
         </div>
         <style>  {`
      
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
           .cantidadErr{
               border:4px solid red;
           }
       ` }  </style>
                   </div> )
            }else if(item.Tipo == "Producto" && item.Medida == "Peso"){
                return <div>
                 <div className="boxp">
    
    <input
    
    className={` inputCantidad ${cantidadErr}`}
      onChange={this.handleChangeCantidad}
      name="pesoProducto"
      type="number"
      placeholder={0}
    value={this.state.pesoProducto}
    
     
    /> 
      
      <select className='customSelect' value={this.state.Medida} onChange={this.handleChangeMedida}>
      <option  value="Gramos">Gramos</option>
      <option  value="Libras">Libras</option>
      <option  value="Kilos">Kilos</option>
    
      </select>
      </div>
      <style>  {`
      
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
    }
    .cantidadErr{
        border:4px solid red;
    }` }  </style>
                </div>
                
                
               
            }else if (item.Tipo == "Producto" && item.Medida == "Unidad"  ){
                return (<div>
                 <div className="boxp">
    
    <input
    className={` inputCantidad ${cantidadErr}`}
     
      onChange={this.handleChangeCantidad}
      name="unidadProducto"
      type="number"
      placeholder={0}
    value={this.state.unidadProducto}
    
     
    /> 
      
     
      </div>
      <style>  {`
   
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
        .cantidadErr{
            border:4px solid red;
        }
    ` }  </style>
                </div> )
            }else if ( item.Tipo == "Combo" ){
                return (<div>
                 <div className="boxp">
    
    <input
    className={` inputCantidad ${comboErr}`}
     
      onChange={this.handleChangeCantidad}
      name="unidadProducto"
      type="number"
      placeholder={0}
    value={this.state.unidadProducto}
    
     
    /> 
      
     
      </div>
      <style>  {`
   
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
        .cantidadErr{
            border:4px solid red;
        }
    ` }  </style>
                </div> )
            }
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
render(){
  
    let getunhide = this.state.loadedComp ?"unhide":""
    let cantidadErr= ""
    let comboErr = this.props.ErrorlistCombo.length > 0 ?"cantidadErr":""
  
    if(this.props.Errorlist.length >0){
     
        for(let i = 0; i<this.props.Errorlist.length;i++){
            if(this.props.Errorlist[i].id == this.props.datos._id && this.props.Errorlist[i].atri =="PrecioVenta" ){
                precioErr= "precioErr"
            }else if(this.props.Errorlist[i].id == this.props.datos._id && this.props.Errorlist[i].atri =="Cantidad"){
                cantidadErr= "cantidadErr"
              
            }
        }
    }
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
                   
                   <div className="valorD "> <input value={this.state.TituloArtic}className=" parrafoD docientos" onChange={this.handleCambioTitulo}  />   </div>
                   
                
                   </div>
              
         <div className="contdetalle ArticResPrecio">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> 
                 
                    {this.ComprobadorTipoArt(cantidadErr, comboErr)}
   
              
                      </p></div>
                    
                 
                    </div>
                
                    <div className="contdetalle ArticResPrecio">
                    
                    <div className="valorD "> 
                    <select className="tipoprecio miscien" value={this.state.tipoPrecio} onChange={this.handleChangeTipoprecio} >
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
 
 onChange={this.handleChangeprecio}
 name="PrecioArt"
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
                    <Animate show={this.checkService(this.props.datos)}>
<button  className="btn btn-primary mybtn " onClick={()=>{this.props.setService(this.props.datos)}}><span className="material-icons">
settings
</span></button>
</Animate>
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
