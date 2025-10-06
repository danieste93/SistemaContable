import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import postal from 'postal';
export default class inggas extends Component {
    state={
        masDetalles:false
    }
    channel1 = null;
    channel2 = null;
    componentDidMount() {
       this.channel1 = postal.channel();
      this.channel2 = postal.channel();

    }
    
    sendDelete=(reg)=>{
      this.channel2.publish('deletereg', {
        reg
     });
    }
    sendEdit=(reg)=>{
      this.channel1.publish('editreg', {
        reg
     });
    }
    renderimg=()=>{
      if(this.props.reg.urlImg.length){

        let imagenes = this.props.reg.urlImg.map((image, i)=>(
      <img key={i} src={image} className="imgrender" />
        ))
        return(imagenes)
      }
      else{
        return(<div>No hay imagenes</div>)
      }
    }
    addCero=(n)=>{
      if (n<10){
        return ("0"+n)
      }else{
        return n
      }
    }
    generadorDescrip=()=>{
    
    
      if(typeof this.props.reg.Descripcion2 == "object"){
      let midata = this.props.reg.Descripcion2.articulosVendidos.map((art)=>     

    
 {
  
  let generadorPrecio = this.props.reg.Accion == "Gasto"? (art.CantidadCompra * art.Precio_Compra).toFixed(2):parseFloat(art.PrecioCompraTotal).toFixed(2)
  return (<div className='contArtventa'>
        <span className=''>{art.Eqid} </span>
        <span className='titleVent'>{art.Titulo} </span>
        <span>x</span>
        <span> {art.CantidadCompra.toFixed(2)}</span>
        <span>=</span>
        <span style={{fontWeight:"bolder"}}>  ${generadorPrecio}</span>
      
      </div>)}
      
      
      )
      
      return (<div className='mitabla'>
        {midata}
      </div>)
      }else if(typeof this.props.reg.Descripcion2 == "string") {
       return this.props.reg.Descripcion2
      }
      
      
          }
    render() {

        let tiempo = new Date(this.props.reg.Tiempo)     
        
let mes = this.addCero(tiempo.getMonth()+1)
let dia = this.addCero(tiempo.getDate())

  var date = tiempo.getFullYear()+'-'+mes+'-'+ dia;       
  var hora = this.addCero(tiempo.getHours())+" : "+   this.addCero(tiempo.getHours())
  let subcat =""
  let estiloreg = this.props.reg.Accion =="Ingreso"?"ecingreso":
  this.props.reg.Accion=="Gasto"?"ecgasto":
  this.props.reg.Accion=="Trans"?"ectrans":""
   if(this.props.reg.CatSelect.subCatSelect){
subcat = this.props.reg.CatSelect.subCatSelect != ""? this.props.reg.CatSelect.subCatSelect:""
}
        return (
     
<div className= {`jwPointer contDetalleING  ${estiloreg} `} key={this.props.in} onClick={()=>{console.log(this.props);this.setState({masDetalles:!this.state.masDetalles})}}>
  <div className={` contreg  `}>
<div className="reglateral">
<p>{date}</p>
<p className="jwbolder"> {this.props.reg.CatSelect.nombreCat}</p>
<p>{subcat}</p>

</div>
<div className="regcentral">
<p>{this.props.reg.Nota}</p>
<p className="cuentareg">{this.props.reg.CuentaSelec.nombreCuenta}</p>
</div>
<div className="regfinal">
<p className={` importegeneral  `}>${this.props.reg.Importe}</p> 
</div>
</div>
<Animate show={this.state.masDetalles}> 
<div className="detalles">
<div className="detallesgrupo">
<div className="jwContFlexCenter jwbolder">Tiempo: </div>
{date } // {hora }
</div>
<div className="detallesgrupo descripCont" >
<div className="jwContFlexCenter jwbolder">Descripción: </div>
{this.generadorDescrip() }
{this.props.reg.Descripcion }
</div>
</div>
<div className="imagenes">
{this.renderimg()}
</div>
<div className="detalles">
<div className="detallesgrupo ">

  <div className="jwContFlexCenter jwbolder">
  Registrado Por :
  </div>
  <span> {this.props.reg.Usuario.Nombre}</span>

  </div>
  <div className="detallesgrupo ">
  <div className="jwContFlexCenter jwbolder">
    Registro Número :
  
  </div>
  <span> {this.props.reg.IdRegistro}</span>

  </div>

</div>
<Animate show={this.props.reg.Estado}>
<div className="detalles iconset">
<i className="material-icons i3D" onClick={(e)=>{
   e.stopPropagation(); 
  this.sendEdit(this.props.reg)
}} >  edit</i>
<i className="material-icons i3D" onClick={(e)=>{
   e.stopPropagation(); 
  this.sendDelete(this.props.reg)
}} >  delete</i>
</div>
</Animate>
</Animate>


                <style >{`
               .descripCont{
                width: 70%;
                max-width: 500px;
                  padding: 5px;
              }
                .imgrender{
                  max-width: 500px;
                  border-radius: 10px;
                  margin: 8px;
                  width:80%;
    
                }
                .imagenes{
                  border-top: 3px solid grey;
                  margin-top: 8px;
                  padding: 10px 0px 10px 0px;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: center;
                }
              
                .detalles{
                  display: flex;
    justify-content: space-between;
    border-top: 3px solid grey;
    margin-top: 8px;
    padding-top: 5px;
    font-size:15px
                }
                .iconset{
                  margin-top: 15px;
                  justify-content: space-around;
                  padding-top: 16px;
                }
                
                
                 .cuentareg{
                    font-size: 15px;
                    color: grey;
                  }
                p{
                    margin:0px
                  }
 
                
.cuentareg{
font-size: 15px;
color: grey;
}
                .reglateral{
                    width: 45%;
                  }
                  .reglateral p{
                    font-size: 15px;
                  color: grey;
                  }
                .ecingreso {
                    box-shadow: 0px 1px 0px #00b31c;
                    background: #d6fdd61a;
                  }
                  .ecgasto{
                    box-shadow: 0px 1px 0px #ff0000;;
                    background: #fda4880f;
                  }
                  .regcentral{
                    width: 60%;
                }
                .textid{
                margin-bottom: 10px;
    font-size: 15px;
    font-style: italic;
    color: grey;}
          .contArtventa{
                  display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    border-bottom: 1px solid;
    margin: 4px 0px;
    border-radius: 5px;
    padding:3px;
                }
                .titleVent{
  width: 50%;
  word-break: break-word;
}
.mitabla{
                  border: 1px solid black;
    
      padding: 5px;
      border-radius: 10px;
      background: #d1e7ff;
                 }
                `}
                </style>
            </div>
        )
    }
}
