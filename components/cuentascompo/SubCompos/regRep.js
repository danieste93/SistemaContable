import React, { Component } from 'react'
import { Animate } from "react-animate-mount";

import Modaldelete from "../modal-delete-rep"
import Modaledit from "../modal-edit-rep"
export default class inggas extends Component {
    state={
        masDetalles:false,
        modalDelete:false,
        modalEdit:false,
    }
   
    componentDidMount() {
     
console.log(this.props)
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
    render() {



let inggastrans=""

let time = new Date(this.props.reg.Tiempo)
let time2 = new Date(this.props.tiempo)
var date = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();       
var hora = time.getHours()+" : "+   time.getMinutes()

var dateexe = time2.getFullYear()+'-'+(this.addCero(time2.getMonth()+1))+'-'+this.addCero(time2.getDate());       


  
  let cat    =""
  let subcat =""
  let estiloreg = this.props.reg.Accion =="Ingreso"?"ecingreso":
  this.props.reg.Accion=="Gasto"?"ecgasto":
  this.props.reg.Accion=="Trans"?"ectrans":""
  if(this.props.reg.Accion == "Ingreso"|| this.props.reg.Accion == "Gasto" ){
    cat = <p className="subcuentareg">{this.props.reg.CatSelect.nombreCat}</p>
    inggastrans =  <p className="cuentareg">{this.props.reg.CuentaSelec.nombreCuenta}</p>
  if(this.props.reg.CatSelect.subCatSelect != ""){
subcat = <p className="subcuentareg">{this.props.reg.CatSelect.subCatSelect}</p>
}

}
else if(this.props.reg.Accion == "Trans"){
  inggastrans =  <p className="cuentareg">{`${this.props.reg.CuentaSelec.nombreCuenta} -->${this.props.reg.CuentaSelec2.nombreCuenta} `} </p>
}
        return (
     
<div className= {`jwPointer contRegis  ${estiloreg} `} key={this.props.in} onClick={()=>{this.setState({masDetalles:!this.state.masDetalles})}}>
  <div className={` contreg  `}>
<div className="reglateral">
<p className="jwbolder"> Ejecución:</p>
<p>{dateexe}</p>
</div>
<div className="regcentral">
<p>{this.props.reg.Nota}</p>
{inggastrans}
{cat}
{subcat}
</div>
<div className="regfinal">

<p className={` formarep  `}>{this.props.reg.Valrep}</p>
<p className={` importegeneral  `}>${this.props.reg.Importe.$numberDecimal}</p> 
</div>
</div>
<Animate show={this.state.masDetalles}> 
<div className="detalles">
<div className="detallesgrupo">
<div className="jwContFlexCenter jwbolder">Tiempo: </div>
{date } // {hora } 
</div>
<div className="detallesgrupo">
<div className="jwContFlexCenter jwbolder">Descripción: </div>
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
  
  
  </div>
  <span> </span>

  </div>

</div>
<div className="detalles iconset">
<i className="material-icons i3D" onClick={(e)=>{

this.setState({modalEdit:true})
}} >  edit</i>


<i className="material-icons i3D" onClick={(e)=>{
 
  this.setState({modalDelete:true})
}} >  delete</i>
</div>
</Animate>

<Animate show={this.state.modalEdit}>
<Modaledit flechafun={()=>{
  this.props.actualizar()
  this.setState({modalEdit:false})

}} reg={this.props.reg} tiempoexe={this.props.tiempo} id={this.props.id}/>
</Animate>

<Animate show={this.state.modalDelete}>
<Modaldelete Flecharetro={()=>{
  this.setState({modalDelete:false})
  this.props.actualizar()

  }} regs={this.props.reg}  id={this.props.id}/>
</Animate>


                <style jsx>{`
               .contRegis{
                border-radius: 13px;
    padding: 6px;
    margin-top: 5px;
               }
               .importegeneral  {
                display: flex;
                justify-content: flex-end;
              }
               .ectrans{
                box-shadow: 0px 1px 0px grey;;
              }
                .formarep{
                  display: flex;
                  max-width: 100px;
    font-size: 10px;
    border: 2px inset #55b4e3;
    border-radius: 9px;
    padding: 3px;
    display: flex;
    justify-content: center;
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
                .regfinal{
                  
    width: 35%;
                }
               
                
                p{
                    margin:0px
                  }
            
                

                .reglateral{
                  flex-wrap:wrap;
                    width: 45%;
                
                  }
                  .reglateral p{
                    font-size: 15px;
                  color: grey;
                  margin-left:5px
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
                .cuentareg{
                  font-size: 20px;
                  color: grey;
                  }
                  .subcuentareg{
                    font-size: 14px;
                  color: grey;
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
