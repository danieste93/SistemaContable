import React, { Component } from 'react'
import {Animate} from "react-animate-mount" 
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {connect} from 'react-redux';
import Autosuggestjw from '../suggesters/jwsuggest-autorender';
class ListVenta extends Component {

    state={
        Precio_Compra:0,
        PrecioCompraTotal:0,
        precioVentaAlt:0,
        Salida:false,
        Vunitario:true, 
        Vtotal:false,
        Medida:"Unidades",
        Cantidad:0,
        unidadProducto:1,
        pesoProducto:1,
        caducableInput:false,
        caduca:false,
        iva:this.setIva(),
        insumo:false,
        selectItem:false,
        artSelected:"",
        tituloArts:this.props.datos.descripcion[0]
     
    }
    channel2 = null;
    componentDidMount(){
  
    let articuloElegido = this.props.datos
    let articulos = this.props.state.RegContableReducer.Articulos

    let miart = articulos.filter(x=> x.Diid == articuloElegido.codigoPrincipal[0])

  
    if(miart.length > 0){
        this.setState({artSelected:miart[0]})
        this.props.sendItem({itemselect:miart[0],
            item:this.props.datos})  
    }

   
    }

    setNombre=(e)=>{

this.setState({tituloArts:e.target.value})
setTimeout(()=>{
    this.props.sendNombre({...this.state,
        item:this.props.datos})  
},200)
    }

    setIva(){
    
        if(this.props.state.userReducer.update.usuario.user.Factura.populares == "true"){
       
            setTimeout(()=>{
                this.props.sendSwich({...this.state,
                    item:this.props.datos})  
            },200)
            return false
            
        }else if(this.props.state.userReducer.update.usuario.user.Factura.populares == "false"){
         
            setTimeout(()=>{
                this.props.sendSwich({...this.state,
                    item:this.props.datos})  
            },200)
            return true
        }

       
    }
  
    testPrecioUni=(e)=>{
        if(this.props.datos.impuestos){

            if(parseInt(this.props.datos.impuestos[0].
                impuesto[0].codigoPorcentaje[0]) ==   0){  

                    return parseFloat(this.props.datos.precioUnitario[0]) 
              
                
        }else if(
            parseInt(this.props.datos.impuestos[0].
                impuesto[0].codigoPorcentaje[0]) ==   2
        ){

            return (parseFloat(this.props.datos.precioUnitario[0]) * 1.12).toFixed(2)
        }
        
 
    }else{
        return ""
    }
 }

    handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
    handleChangeCantval=(e)=>{
  
       
        
    }
    comprobadorSelect=(e)=>{
  
        
  
            if(this.state.insumo){
                alert("Error, articulo es un insumo")
                this.setState({artSelected:"",selectItem:false})
            }else{
                this.setState({selectItem:!this.state.selectItem})
            }
            
        
    }

    handleChangeSwitchCaduca=(e)=>{
        this.setState({caduca:!this.state.caduca})
    }


    handleChangeSwitch=(e)=>{        
           let switchmame = e.target.name
         
           let swichval = !this.state[switchmame]
         
            this.setState({[switchmame]:swichval})
            setTimeout(()=>{
                this.props.sendSwich({...this.state,
                    item:this.props.datos})  
            },100)
    
      }
      getSugerencias=()=>{
        let data = this.props.state.RegContableReducer.Articulos?this.props.state.RegContableReducer.Articulos.filter(x=> x.Tipo != "Servicio" && x.Tipo != "Combo" ):""
    
return (data)
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
            
            [e.target.name]:e.target.value,
        
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
           
            let item = this.props.datos
           
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
            SelectArt=(e)=>{
               this.setState({artSelected:e,selectItem:false})
            }
            resetArtData=()=>{
   
                
            }
            deleteItem=()=>{
                    this.setState({artSelected:""})
                    this.props.sendErrace({
                        item:this.props.datos})  
                
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


let estiloElegido = this.state.artSelected != ""?"artElegido":""
let idArt =this.state.artSelected != ""?this.state.artSelected.Eqid :""
let itemSelected =this.state.artSelected != ""?"done" :"error"
let tituloSelected = this.state.artSelected  != ""?this.state.artSelected.Titulo :""

return (  
         
        
       <div  className="Princont">
        <div className={` ContCompraFact ${contSalida} ${estiloElegido}`}>
       <div className="Articid">{idArt} </div>
<div className="Articid"  name="nombreitem" >{item.codigoPrincipal[0]}</div>
           <div className="Artic100FpagoName titulosseg">
           <input className='' value={this.state.tituloArts} onChange={this.setNombre} />
          <span className="invTitulo">  {tituloSelected}</span>
            </div>
          
           <div className="Artic100Fpago">
           <select value={this.state.Medida} >

     <option  value="Unidades">Unidades</option>
     <option  value="Libras">Libras</option>
     <option  value="Kilos">Kilos</option>
     <option  value="Gramos">Gramos</option>
     </select>
           </div> 
             <div className="Artic100Fpago">

                
         <span className='FlexCenter'> <div type="number" name="Cantidad" className={` inputCustom `}  >{parseFloat(this.props.datos.cantidad[0]).toFixed(0)}</div> </span>
   
        
             </div> 
             <div className="Artic100Fpago">
         <span className='FlexCenter'> $ <div type="number" name="Precio_Compra" className={` inputCustom ${precioErr}`}>{
            this.testPrecioUni()
   }</div></span>
    
        
             </div>     
             <div className="Artic100Fpago">
         <span className='FlexCenter'> $ <div type="number" name="PrecioTotal" className={` inputCustom ${precioErr}`}>{
         
         
         (parseFloat(this.props.datos.cantidad[0])
         *
    (      this.testPrecioUni())
         
         ).toFixed(2)
         
         
         }</div></span>
    
        
             </div> 
             <div className="Artic100Fpago">
          
          
          <FormControlLabel
      control={
        <Switch
     
        onChange={this.handleChangeSwitch}
          name={"insumo"}
          color="primary"
        checked={this.state.insumo}
        />
      }
      label=""
    />
           </div> 
           <div className="Artic100Fpago">
          
          
          <FormControlLabel
      control={
        <Switch
     
        onChange={this.handleChangeSwitch}
          name={"iva"}
          color="secondary"
        checked={this.state.iva}
        />
      }
      label=""
    />
           </div>  
             <div className="Artic100Fpago">
          
          
          <FormControlLabel
      control={
        <Switch
     
     
          name={"caduca"}
          color="secondary"
        checked={this.state.caduca}
        />
      }
      label=""
    />
           </div>              
           <div className="accClass">
  <span className="material-icons">
{itemSelected}
    </span>
  </div>            
  <div className="Artic100Fpago">
 
  <button id={item.Eqid} name={item.Eqid}  className="btn btn-primary mybtn " onClick={this.comprobadorSelect
      }><span className="material-icons">
send
    </span>
    
    </button> 
    <button id={item.Eqid} name={item.Eqid}  className="btn btn-danger mybtn " onClick={this.deleteItem        }><span className="material-icons">
  delete
      </span>
      
      </button> 
    </div>
 

       </div>
       <div  className="contAnimadores">
    <Animate show={this.state.caduca}>
    <div className="caducablecont">
   
    <div className="FechaInput">
   <p>Fecha de caducidad</p>
<input className={`${fechaexpErr}`}
 label="Fecha"
  type="date"
   name="caducableInput"
   value={this.state.caducableInput} onChange={this.handleChangeExp} />
</div>

</div>
        </Animate>
        <Animate show={this.state.selectItem}>

        <Autosuggestjw  sendClick={(e)=>{this.SelectArt(e)}} getvalue={(item)=>{console.log("")}} 
        sugerencias={this.getSugerencias()} resetData={this.resetArtData}   /> 
        </Animate>
        </div>
    <style>
        {`.MuiFormControlLabel-root{
    margin-left:0px;
    margin-right:0px;
}`}
        </style>
        <style jsx>{`
.contAnimadores{
    display: flex;
    justify-content: center;
}
.titulosseg{
    display: flex;
    flex-flow: column;
    justify-content: space-around;
}
.invTitulo{
    font-size: 12px;
    font-style: italic;
    font-weight: bolder;
}
               .precioErr{
                     border-bottom:2px solid red;
               }
               .contTitulosaddFact{
                display:flex;
                font-size: 15px;
                width: fit-content;
            }
           
               .Artic100Fpago{
                width: 18%;  
                min-width:100px;
                max-width:125px;
                align-items: center;
                text-align:center;
            }
            .Articid{
                width: 10%;  
                min-width:100px;
                max-width:120px;
                align-items: center;
                text-align:center;
                word-break: break-all;
              
            }
            .Artic100FpagoName{
                width: 25%;  
                min-width:200px;
                max-width:225px;
                align-items: center;
                text-align:center;
             
              }
            .ContCompraFact{
                margin-top: 7px;
                border-top: 2px solid black;
                padding-top: 10px;   
                opacity:1;
                transition:1s;
                margin-bottom: 7px;
    display: flex;

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
                width: 10%;  
                min-width:50px;
                max-width:60px;
                align-items: center;
                text-align:center;
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
            width: fit-content;
            font-size: 20px;
            width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
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
           
        }
        .artElegido{
            border: 3px solid #11d511;
    border-radius: 11px
        }
     
     `}</style>
       </div>   
      
    )
}

}

const mapStateToProps = state=>  {
   
   return {
       state
   }
 };
 
 export default connect(mapStateToProps, null)(ListVenta);
