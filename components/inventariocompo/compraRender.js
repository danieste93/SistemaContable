import React, { Component } from 'react'


import {connect} from 'react-redux';

import { Animate } from "react-animate-mount";


/**
* @author
* @className purdata
**/

class purdata extends Component {
 state = {
  carritoimagen:this.props.datos.ArtComprados[0].Imagen[0],
  artSelect:0,
  Precio_Compra:this.props.datos.ArtComprados[0].Precio_Compra,
  CantidadCompra:this.props.datos.ArtComprados[0].CantidadCompra,
  detalles:false
}

componentDidMount(){
console.log(this.props)
}


 

addCero=(n)=>{
    if (n<10){
      return ("0"+n)
    }else{
      return n
    }
  }
  clickArt=(e)=>{
console.log(e)

    this.setState({artSelect:e.i,
       carritoimagen:e.producto.Imagen[0],
       Precio_Compra:e.producto.Precio_Compra, 
       CantidadCompra:e.producto.CantidadCompra})
   
   }
 

 render() {
 
  
   let data = this.props.datos
   console.log(data)
   let tiempo = new Date(data.Tiempo)    
   let mes = this.addCero(tiempo.getMonth()+1)
   let dia = this.addCero(tiempo.getDate())
 

   var date = tiempo.getFullYear()+'-'+mes+'-'+ dia;         
   var hora = this.addCero(tiempo.getHours())+" : "+   this.addCero(tiempo.getMinutes())
   
   const producs = data.ArtComprados.map((producto, i)=>{

    let defa = this.state.artSelect == i ?"estiloSeleccionado":""


       if(data.ArtComprados.length > 1){
         return(<button  key={i} className={`artClick ${defa} `}
         onClick={()=>{this.clickArt({producto, i})}}
         >
           
           {producto.Titulo}
           </button>)
       }

else{        return(<button  key={i} className={`artClick  `}
onClick={()=>{this.clickArt({producto, i})}}
>

{producto.Titulo}
</button>)
        }
    })

   
   return(



  <div className={`contCompra  `}>
        <div className={`contCarrito `}>
         
         <span className="material-icons">
     shopping_cart
     </span>
     <p>Nº{data.CompraNumero}</p>
         </div >
         <div className="contCompraPrincipal">
         <div className="contDatos" style={{width:"90%", fontSize:"13px"}}>
        <div className="jwClave">Fecha y hora:</div>
    <div className="jwValor"> {date } // {hora }</div>
              
      </div>
       
      <span className="barraprin">  </span>
      <div className="contenedorDatosPrincipales">
      
      <div className="contDatosP">
  <div className="jwClave">Articulos:</div>

<div className="jwValor"><ul className="ulart">{producs}</ul> </div>
 </div>
 <div className="contDatosP">
 <div className="jwClave">Precio de Compra:</div>
<div className="jwValor">${this.state.Precio_Compra}</div>
 </div>
 <div className="contDatosP">
 <div className="jwClave">Cantidad:</div>
<div className="jwValor">{this.state.CantidadCompra}</div>
 </div>

 </div>
 <div className="contimagen">
       <img src={this.state.carritoimagen} alt="producto"/>
     </div>
         </div >
         <span className="barraprin">  </span>
         <div className="contenedorDatosPrincipales">
         <div className="contDatosP">
 <div className="jwClave">Proveedor:</div>
<div className="jwValor">{this.props.datos.Proveedor}</div>
 </div>
 <div className="contDatosP">
 <div className="jwClave">Valor Total:</div>
<div className="jwValor">${this.props.datos.ValorTotal}</div>
 </div></div>
         <div className="jwW100percent">
     <Animate show ={!this.state.detalles } >
     <div className="jwW100percentC2 contbotonesduales" >
       
    <button className="btn btn-primary" onClick={()=>{this.setState({detalles:true})}}>Mas detalles</button>
  
    </div>
    
    </Animate>
    </div>
      <Animate show ={this.state.detalles}>
      <span className="barraprin">  </span>
      <div className="subContCompra">
    
      <div className="contDatos">
      <div className="jwClave">Vendedor: </div>
    <div className="jwValor">{data.Usuario.Nombre}</div>
      </div>
  
      <span className="barraprin">  </span>
    
    
      <div className="jwW100percent">
     <Animate show ={this.state.detalles } >
     <div className="jwW100percentC2 contbotonesduales" >
    <button className="btn btn-primary" onClick={()=>{this.setState({detalles:false})}}>Menos detalles</button>
    
    </div>
    
    </Animate>
    </div>
      </div>
      </Animate>
    
      <style  >
        {`
       .contDatosCred{
        width: 100%;
    display: flex;

    justify-content: space-around;
    align-items: center;
    margin-left: 0px;
    text-align: center;
       }
        .botonespago{
          display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
        }
        .botonespago div{
          display: flex;
    justify-content: space-around;

    flex-wrap: wrap;
        }
        .botonespago button{
         margin:5px;
    
        }
        .barraprin{
          width: 90%;
        margin-left: 5%;
        color: green;
        background-color: #007bff;
        height: 1px;
        box-shadow: 0px 3px 4px black;
        border-radius: 24px;
        margin-top: 10px;
        margin-bottom: 10px;
        }
        .ulart{
         padding:0
        }
        .contenedorDatosPrincipales{
          width: 50%;
          padding-left: 15px;
        }
        .contCliente{
          display: flex;
          padding: 10px;
          flex-wrap: wrap;
        }
        .contDatosP{
          width:100%;
          margin: 10px 0px;
        }
        .contimagen{
          display: flex;
        width: 50%;
        justify-content: center;
        align-items: center;
        }
        .contimagen img{
          width: 86%;
        margin: 10px;
        max-width:150px;
        height: 200px;
        }
        .jwW95percentC{
      width: 95%;
      
    }
    .jwW45percent{
      width: 45%;
    }
    .jwW100percentC{
      width: 100%;
      display:flex;
    }
    .jwW100percent{
      width: 100%;
    
    }
    .jwW100percentC2{
      width: 100%;
      display:flex;
      justify-content:center;
      align-items:center
    }
    .contbotonesduales{
      margin: 15px 0px;
      display:flex;
      justify-content:space-around
    }
    .contTitulo{
      display: flex;
        width: 100%;
        margin-top: 0px;
    
        border-radius: 10px;
        padding: 5px;
        justify-content: space-around;
        align-items: center;}
    .contCarrito{
     
        border-radius: 14px 14px 0px 0px;
        display: flex;
        justify-content: flex-end;
      
        padding-right: 11px;
        padding-top: 16px;
      
        font-size: 25px;
        align-items: center;
    }
    .carritorojo{
      background-color: #ff8080;
    }
    .carritocian{
      background-color: darkcyan;
    }
    .carritotomate{
      background-color: orange;
    }
    .carritoamarillo{
      background-color: #ffffbb;
    }
    .carritoverde{
      background-color: lightgreen;
    }
    .contCarrito p{
      margin:0
    }
    .contCarrito span{
      font-size:25px
    }
        .contCompra{
          display: flex;
          width: 100%;
        padding-bottom: 24px;
        flex-flow: column;
        max-width: 600px;
        border-radius: 16px;
        margin: 20px 0px;
        border: 2px solid black;
        }
        .blueEnf{
          border: 1px solid blue;box-shadow: 0px -1px 11px -1px blue;
        }
        .orangeEnf{
          border: 1px solid orange;box-shadow: 0px -1px 11px -1px orange;
        }
        .yellowEnf{
          border: 1px solid #ffe074;box-shadow: 0px -1px 11px -1px yellow;
        }
        .greenEnf{
          border: 1px solid green;box-shadow: 0px -1px 11px -1px green;
    }
    .cianEnf{
          border: 1px solid darkcyan;box-shadow: 0px -1px 11px -1px darkcyan;
    }
        .contCompraPrincipal{
          text-align: left;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        }
        .CondicionalCont{
          width: 100%;
        display: flex;
        }
      
    .custompaper{
      width: 100%;
    justify-content: center;
    display: flex;
    margin: 15px;
    }
        .contDatos{
          margin: 0px 0px 15px 15px;
          width: 45%;
        }
        .jwClave{
          font-size: 20px;
        font-weight: bold;
        }
        
    .contTituloSub1{
      margin: 5px;
     
        text-align: center;
        box-shadow: 0px 3px 3px grey;
        padding: 4px;
        border-radius: 12px;
    }
    .artClick {
      list-style: none;
        padding: 7px;
        margin: 5px 0px;
        border-radius: 9px;
        font-size: 15px;
    }
    .estiloSeleccionado{
      background-color: #a6ccf5;
        box-shadow: 0px 2px 2px black;
        transition: 1s;
    }
      .subContCompra{
      text-align: left;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-flow: column;
    }
    .contDatosCont{
      display: flex;
      /* flex-wrap: wrap; */
      margin-left: 15px;
      width: 100%;
    }
    
        `}</style>
      
    
        </div>
      
        



      
        )
  
   }
 }


 const mapStateToProps = state => {


  return {state}
};


export default connect(mapStateToProps)(purdata)

  
  
