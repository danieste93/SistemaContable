import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import postal from 'postal';
export default class Transrender extends Component {
    state={
        masDetalles:false
    }
    channel1 = null;
    channel2 = null;
    componentDidMount() {
      this.channel1 = postal.channel();
     this.channel2 = postal.channel();

   }
   addCero=(n)=>{
    if (n<10){
      return ("0"+n)
    }else{
      return n
    }
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
    render() {

        
      let tiempo = new Date(this.props.reg.Tiempo)     
      let mes = this.addCero(tiempo.getMonth()+1)
      let dia = this.addCero(tiempo.getDate())
      
        var date = tiempo.getFullYear()+'-'+mes+'-'+ dia;         
        var hora = this.addCero(tiempo.getHours())+" : "+   this.addCero(tiempo.getHours())
  
 
        return (
     
<div className= {`jwPointer contDetalleGAS   `} key={this.props.in} onClick={()=>{this.setState({masDetalles:!this.state.masDetalles})}}>
  <div className={` contreg  `}>
  <div className="reglateral">
<p className="jwbolder"> Transferencia</p>
</div>
<div className="regcentral">
<p>{this.props.reg.Nota}</p>
<p className="cuentareg">{`${this.props.reg.CuentaSelec.nombreCuenta} -->${this.props.reg.CuentaSelec2.nombreCuenta} `} </p>
</div>
<div className="regfinal">
<p className={` importegeneral  `}>${this.props.reg.Importe}</p> 
</div>
</div>
<Animate show={this.state.masDetalles}> 
<div className="detalles">
<div className="detallesgrupo">
<div className="jwContFlexCenter jwbolder">Tiempo </div>
{date } // {hora }
</div>
<div className="detallesgrupo">
<div className="jwContFlexCenter jwbolder">Descripción </div>
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


                <style >{`
            
                .idreg{
                  display: flex;
    font-size: 14px;
    background: black;
    color: white;
    justify-content: center;
    padding: 5px;
    border-radius: 11px;
    border-top: 5px double grey;
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
                
                .contDetalleGAS{
                    padding: 10px;
                    background: white;
                  box-shadow: 0px 1px 0px #0d100d;
                  margin: 4px 0px;
                  border-radius: 6px;
               
                  width: 100%;
                  }
                 .cuentareg{
                    font-size: 15px;
                    color: grey;
                  }
                p{
                    margin:0px
                  }
                  
                .reglateral{
                  word-break: break-all;
                    width: 45%;
                  }
                  .reglateral p{
                    font-size: 15px;
                  color: grey;
                  }
             
                  .regcentral{
                    width: 60%;
                    margin-left: 10px;
                }
                .textid{
                margin-bottom: 10px;
    font-size: 15px;
    font-style: italic;
    color: grey;}
                `}
                </style>
            </div>
        )
    }
}
