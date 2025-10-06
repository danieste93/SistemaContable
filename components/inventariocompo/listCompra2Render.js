import React, { Component } from 'react'
import {Animate} from "react-animate-mount" 

class ListVenta extends Component {

    state={
        Precio_Compra:this.props.datos.Precio_Compra,
        PrecioCompraTotal:(this.props.datos.PrecioCompraTotal).toFixed(2),
        precioVentaAlt:this.props.datos.PrecioVentaAlt,
        Salida:false,
        Vunitario:true, 
        Vtotal:false,
        Medida:this.props.datos.Unidad,
        Cantidad:this.props.datos.Cantidad,
        unidadProducto:1,
        pesoProducto:1,
        caducableInput:this.props.datos.Caduca.FechaCaducidad
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
  
    handleChangeExp=(e)=>{
        let item = this.props.datos
        this.setState({
            
            [e.target.name]:e.target.value
            })   
            this.props.sendExp({value:e.target.value, item})
    }

    handleChangePrecio=(e)=>{
      
        let item = this.props.datos
        let cantidad = item.CantidadCacl * 1
        if(this.state.Medida == "Gramos"){
            cantidad = item.CantidadCacl * 1
        }else if(this.state.Medida == "Libras"){
            cantidad = item.CantidadCacl * 453.592
        }else if(this.state.Medida == "Kilos"){
            cantidad = item.CantidadCacl * 1000
        }
        let PrecioTotal = (cantidad * e.target.value).toFixed(2)
        this.setState({
        [e.target.name]:e.target.value,
        PrecioCompraTotal: PrecioTotal
        }) 
       
        this.props.sendPrecio({value:parseFloat(e.target.value),
                                cantidadGramos: cantidad,
                                PrecioTotal,
            
            
            item})
        }
        handleChangePrecioTotal=(e)=>{
            let item = this.props.datos
            let cantidad = item.CantidadCacl * 1
            if(this.state.Medida == "Gramos"){
                cantidad = item.CantidadCacl * 1
            }else if(this.state.Medida == "Libras"){
                cantidad = item.CantidadCacl * 453.592
            }else if(this.state.Medida == "Kilos"){
                cantidad = item.CantidadCacl * 1000
            }
            let precioIndi = (e.target.value)/cantidad
            this.setState({
            [e.target.name]:e.target.value,
            Precio_Compra:precioIndi
            }) 
           
            this.props.sendPrecioTotal({value:parseFloat(e.target.value), 
                item,
                precioIndi})
            }
        handleChangeCantidad=(e)=>{
            let item = this.props.datos
          console.log(e.target)
          if(item.Tipo == "Producto" && item.Medida =="Peso"){
            let newPrice= 0
            let pesoEngramos = 0
            if(this.state.Medida == "Gramos"){
                 newPrice = e.target.value * this.state.Precio_Compra
                 pesoEngramos = e.target.value
             
                                                              
                }else if(this.state.Medida == "Libras"){

                    pesoEngramos = (e.target.value * 453.592).toFixed(6)
                    newPrice = pesoEngramos * this.state.Precio_Compra
               
           
                }else if(this.state.Medida == "Kilos"){

                    pesoEngramos = (e.target.value * 1000).toFixed(6)
                     newPrice = pesoEngramos * this.state.Precio_Compra
          
                }

                this.setState({pesoProducto:e.target.value,
                    PrecioCompraTotal:newPrice,
                        
                 }) 
                 this.props.sendAll({value:newPrice,
                                  cantGramos:pesoEngramos,
                                     cant: e.target.value, 
                                     unidad:this.state.Medida,
                    item})  


            }else if(item.Tipo == "Producto" && item.Medida =="Unidad"){
                let newPrice = e.target.value* item.Precio_Compra
               
                this.setState({unidadProducto:e.target.value,
                    PrecioCompraTotal:newPrice, 
                           
    }) 
    this.props.sendAll({value:newPrice,
        cantGramos: e.target.value,
         cant: e.target.value, 
         unidad:"",
item})  


            }
          
          }
        
        handleChangeMedida=(e)=>{
           console.log(e)
            let item = this.props.datos
            console.log(e.target.value)
            let newPrice = 0
            let pesoEngramos = 0
            if(e.target.value == "Gramos"){
               pesoEngramos = item.CantidadCacl * 1
           newPrice = pesoEngramos * this.state.Precio_Compra
        
            }else if(e.target.value == "Libras"){
                pesoEngramos = (item.CantidadCacl * 453.592).toFixed(6)
                newPrice = (pesoEngramos * this.state.Precio_Compra).toFixed(2)
              
                         
                 }else if(e.target.value == "Kilos"){
                    pesoEngramos = (item.CantidadCacl* 1000).toFixed(6)
               newPrice = (pesoEngramos * this.state.Precio_Compra).toFixed(2)
                    
                              
                                    }


                                    this.setState({PrecioCompraTotal:newPrice,
                       
                                        Medida:e.target.value})
            
                                        this.props.sendAll({value:newPrice,
                                       
                                             cant: this.state.pesoProducto, 
                                             unidad:this.state.Medida,
                                             cantGramos:pesoEngramos,
                                    item})  


            }
            
render(){
    
 let cantidadErr= ""
 let precioErr= ""
 let precioAltErr= ""
 let fechaexpErr= ""
if(this.props.Errorlist.length >0){
    for(let i = 0; i<this.props.Errorlist.length;i++){
        if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="Precio_Compra" ){
            precioErr= "precioErr"
        }else if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="CantidadCacl"){
            cantidadErr= "cantidadErr"
        }else if(this.props.Errorlist[i].id == this.props.datos.Eqid && this.props.Errorlist[i].atri =="fechaexp"){
            fechaexpErr= "cantidadErr"
        }
        
    }
}

let item = this.props.datos
 let contSalida = this.state.Salida?"onSalida":""
console.log(item)
    return (  
         
         <div  id={this.props.datos.id}> 
              <div  className="contlist"> 
                <div className={` contListaCompra ${contSalida}`}>
<div className="contTitulos2">

<div className="Articid">{item.Eqid} </div>
           <div className="Artic100Fpago">{item.Titulo} </div>
           <div className="Artic100Fpago">
            {this.ComprobadorTipoArt(cantidadErr)}
          
             
             </div> 
             <div className="Artic100Fpago">
                <Animate show={true}>
         <span className='FlexCenter'> $ <input type="number" name="Precio_Compra" className={` inputCustom `}placeholder="0.00" value={this.state.Precio_Compra} onChange={this.handleChangePrecio }/></span>
         </Animate>
        
             </div> 
             <div className="Artic100Fpago">
         <span className='FlexCenter'> $ <input type="number" name="PrecioCompraTotal" className={` inputCustom ${precioErr}`}placeholder="0.00" value={this.state.PrecioCompraTotal} onChange={this.handleChangePrecioTotal }/></span>
    
        
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
       
         
           
        
        </div>
        <div className="caducablecont">
        <Animate show={this.props.datos.Caduca.Estado}>
            <div className="FechaInput">
            <p>Fecha de caducidad</p>
<input className={`${fechaexpErr}`} label="Fecha" type="date" name="caducableInput"value={this.state.caducableInput} onChange={this.handleChangeExp} / >
</div>
        </Animate>
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
        .caducablecont{
            width: 100%;
    max-width: 300px;
        }
        .FechaInput{
            border: 1px solid;
            padding: 10px;
            border-radius: 15px;
            text-align: center;
            margin-top: 13px;
        }
        .contlist{
            display: flex;
            flex-flow: column;
            align-items: center;
        }
     
     `}</style>
        </div>
    )
}

}

export default ListVenta
