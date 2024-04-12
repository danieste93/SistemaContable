import React, { Component } from 'react'


class ListVenta extends Component {

    state={
        precioVenta:this.props.datos.PrecioVenta,
        precioVentaAlt:this.props.datos.PrecioVentaAlt,
        Salida:false,
        Vunitario:true, 
        Vtotal:false,
        Medida:this.props.datos.Unidad,
        Cantidad:1,
        unidadProducto:1,
        pesoProducto:1
    }
    channel2 = null;
    componentDidMount(){


       
    }
  
    handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
    handleChangeCantval=(e)=>{
  
       
        
    }
    
    ComprobadorTipoArt=(cantidadErr)=>{
        
        let item = this.props.datos
 
        if(item.Tipo == "Servicio"){
            return ""
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
    border-bottom:2px solid red;
}` }  </style>
            </div>
            
            
           
        }else if (item.Tipo == "Producto" && item.Medida == "Unidad"){
            return <div>
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
        border-bottom:2px solid red;
    }
` }  </style>
            </div> 
        }
    }
    handleChangePrecioAlt=(e)=>{
        let item = this.props.datos
        this.setState({
        [e.target.name]:e.target.value
        }) 
       
        this.props.sendPrecioAlt({value:parseFloat(e.target.value), item})
    }
    handleChangePrecio=(e)=>{
        let item = this.props.datos
        this.setState({
        [e.target.name]:e.target.value
        }) 
       
        this.props.sendPrecio({value:parseFloat(e.target.value), item})
        }
        handleChangeCantidad=(e)=>{
            let item = this.props.datos
     
          if(item.Tipo == "Producto" && item.Medida =="Peso"){
            
            if(this.state.Medida == "Gramos"){
                let newPrice = e.target.value * item.PrecioVenta
                let newPricealt = e.target.value  * item.PrecioVentaAlt
                this.setState({pesoProducto:e.target.value,
                                 precioVenta:newPrice,
                              precioVentaAlt:newPricealt, 
                 }) 
                 this.props.sendAll({value:newPrice,
                                    cantAlt:newPricealt,
                                     cant: e.target.value, 
                                     unidad:"Gramos",
                    item})  
                                                              
                }else if(this.state.Medida == "Libras"){

                    let pesoenlibras = (e.target.value * 453.592).toFixed(6)
                    let newPrice = pesoenlibras * item.PrecioVenta
                    let newPricealt = pesoenlibras * item.PrecioVentaAlt
                    this.setState({pesoProducto:e.target.value,
                                     precioVenta:newPrice,
                                  precioVentaAlt:newPricealt, 
                     }) 
                     this.props.sendAll({value:newPrice,
                        cantAlt:newPricealt,
                         cant: e.target.value, 
                         unidad:"Libras",
        item})  
                }else if(this.state.Medida == "Kilos"){

                    let pesoenk = (e.target.value * 1000).toFixed(6)
                    let newPrice = pesoenk * item.PrecioVenta
                    let newPricealt = pesoenk * item.PrecioVentaAlt
                    this.setState({pesoProducto:e.target.value,
                                     precioVenta:newPrice,
                                  precioVentaAlt:newPricealt, 
                     }) 
                     this.props.sendAll({value:newPrice,
                        cantAlt:newPricealt,
                         cant: e.target.value, 
                         unidad:"Kilos",
        item})   
                }
            }else if(item.Tipo == "Producto" && item.Medida =="Unidad"){
                let newPrice = e.target.value* item.PrecioVenta
                let newPricealt = e.target.value * item.PrecioVentaAlt
                this.setState({unidadProducto:e.target.value,
                    precioVenta:newPrice,
                 precioVentaAlt:newPricealt, 
    }) 
    this.props.sendAll({value:newPrice,
        cantAlt:newPricealt,
         cant: e.target.value, 
         unidad:"",
item})  


            }
          
          }
        
        handleChangeMedida=(e)=>{
           
            let item = this.props.datos
     
            if(e.target.value == "Gramos"){
                let pesocambio = this.state.pesoProducto 
            let newPriceG = pesocambio * item.PrecioVenta

  
            let newPricealt = pesocambio * item.PrecioVentaAlt
                        this.setState({precioVenta:newPriceG,
                            precioVentaAlt:newPricealt, 
                            Medida:"Gramos"})

                            this.props.sendAll({value:newPriceG,
                                cantAlt:newPricealt,
                                 cant: this.state.pesoProducto, 
                                 unidad:"Gramos",
                        item})  
            }else if(e.target.value == "Libras"){
                let pesoenlibras = (this.state.pesoProducto * 453.592).toFixed(6)
                let newPrice = pesoenlibras * item.PrecioVenta
                let newPricealt = pesoenlibras * item.PrecioVentaAlt
                            this.setState({precioVenta:newPrice,precioVentaAlt:newPricealt, Medida:"Libras"})
                            this.props.sendAll({value:newPrice,
                                cantAlt:newPricealt,
                                 cant: this.state.pesoProducto, 
                                 unidad:"Libras",
                        item}) 
                        }else if(e.target.value == "Kilos"){
                            let pesoenk = (this.state.pesoProducto * 1000).toFixed(6)
                            let newPrice = pesoenk * item.PrecioVenta
                            let newPricealt = pesoenk * item.PrecioVentaAlt
                                        this.setState({precioVenta:newPrice,precioVentaAlt:newPricealt, Medida:"Kilos"})
                                        this.props.sendAll({value:newPrice,
                                            cantAlt:newPricealt,
                                             cant: this.state.pesoProducto, 
                                             unidad:"Kilos",                                    
                                    item}) 
                                    }
            }
            
render(){
    
 let cantidadErr= ""
 let precioErr= ""
 let precioAltErr= ""
if(this.props.Errorlist.length >0){
    for(let i = 0; i<this.props.Errorlist.length;i++){
        if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="PrecioVenta" ){
            precioErr= "precioErr"
        }else if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="Cantidad"){
            cantidadErr= "cantidadErr"
        }else if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="PrecioVentaAlt"){
            precioAltErr= "precioErr"
        }
    }
}

let item = this.props.datos
 let contSalida = this.state.Salida?"onSalida":""
console.log(item)
    return (   
         <div  id={this.props.datos.id}> 
               
                <div className={` contListaCompra ${contSalida}`}>
<div className="contTitulos2">

<div className="Articid">{item.Eqid} </div>
           <div className="Artic100Fpago">{item.Titulo} </div>
           <div className="Artic100Fpago">
            {this.ComprobadorTipoArt(cantidadErr)}
          
             
             </div> 
             <div className="Artic100Fpago">
         <span className='FlexCenter'> $ <input type="number" name="precioVenta" className={` inputCustom ${precioErr}`}placeholder="0.00" value={this.state.precioVenta} onChange={this.handleChangePrecio  }/></span>
    
         <span className='FlexCenter'>$ <input type="number" name="precioVentaAlt" className={` inputCustom ${precioAltErr}`}placeholder="0.00" value={this.state.precioVentaAlt} onChange={this.handleChangePrecioAlt  }/></span>
             </div>                
                    
  <div className="accClass">
  <button id={item.Eqid} name={item.Eqid}  className="btn btn-danger mybtn " onClick={(e)=>{
  

this.props.deleteItem(item.Eqid)
  }
      }><span className="material-icons">
delete
    </span>
    </button> 
    </div>
  
         </div>
       
         
           
               <style jsx>{`
               
               .precioErr{
                     border-bottom:2px solid red;
               }
               .contTitulos2{
                display:flex;
                font-size: 15px;
                justify-content: space-around;
                width: 100%;
            }
           
               .Artic100Fpago{
                width: 18%;  
                min-width:80px;
                max-width:100px;
                align-items: center;
                text-align:center;
            }
            .Articid{
                width: 10%;  
                min-width:20px;
                max-width:50px;
                align-items: center;
                text-align:center;
                word-break: break-all;
            }
            .contListaCompra{
                margin-top: 10px;
                border-top: 2px solid black;
                padding-top: 10px;   
                opacity:1;
                transition:1s
            }
            .onSalida{
                opacity:0;
            }
               .inputCustom{   
                   width: 60%;           
                border-radius: 11px;
                transition:1s;
                padding: 4px;}
               .moneycont{
                   display:flex;
               }
               .miscien{
                width: 80%;
                margin-left:10%; 
 
            }
            .Numeral{
                width: 20px;  
            }
          
            .tituloFpago{
                width: 23%;    
            }
            .accClass{
                width:10%;
                display: flex;
    justify-content: center;
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
                 
                        .buttonTotal{ 
                            padding: 9px;
                     border-radius: 20px;
                     background: white;
                     transition:1s;
                            }
                            .buttonactive{
                             background: lightskyblue;
                            }
                   .mybtn{
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                 
                   }
                 

                   }
                   .ArticRes{
                    width: 23%;  
                    min-width:95px;
                    max-width:150px;
                    justify-content: center;
                    word-break: break-all;
                }
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .FlexCenter{
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 3px;
        }
        .contLista{
            display: inline-flex;
 
    overflow: hidden;
  
    border-radius: 6px;
  border-bottom: 2px solid black;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
}
        .parrafoD {
            margin-bottom:1px;
        }
  

        .maincontDetalles{
            display: flex;
            color: black;
           
            font-size: 20px;
            width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}
       
           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .cantidadErr{
            border-bottom:2px solid red;
        }
     
     `}</style>
        </div>
        </div>
    )
}

}

export default ListVenta
