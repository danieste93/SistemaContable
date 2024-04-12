import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import { CircularProgress } from '@material-ui/core';
class Contacto extends Component {
   state={
    Compras:[],
    Ventas:[],
    RegsElim:[],
    ListadoRegs:[],
    cantidadArtComprados:0,
    cantidadArtVendidos:0,
    cantidadArtEliminados:0,
    dataLoaded:false,
    viewRegs:false,
    TotalArts:0,
    getLoaderinv:true
   }

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainResearch').classList.add("entradaaddc")

       }, 500);
        
     console.log(this.props.art)
     var url = '/public/researchart';
                
     let newdata = {id:this.props.art._id}
     newdata.UserData =    {DBname:this.props.state.userReducer.update.usuario.user.DBname   }               
   var lol = JSON.stringify(newdata)

   fetch(url, {
     method: 'POST', // or 'PUT'
     body: lol, // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json',
       "x-access-token": this.props.state.userReducer.update.usuario.token
     }
   }).then(res => res.json())
   .catch(error => console.error('Error:', error))
   .then(response => {
    console.log(response)
if(response.message=="error al registrar"){
let add = {
Estado:true,
Tipo:"error",
Mensaje:"Error en el sistema, porfavor intente en unos minutos"
}
this.setState({Alert: add, loading:false,}) 
}else{
  let cantidadArtComprados =0
  let cantidadArtVendidos =0
  let cantidadArtEliminados =0
  let arrCompras=[]
  let arrRegs=[]
  let arrVentas=[]
  if(response.Compras.length > 0){
    let compras = response.Compras
   
    for (let i = 0; i<compras.length;i++){
  
      for (let x = 0; x< compras[i].ArtComprados.length;x++){
        if(compras[i].ArtComprados[x]._id == this.props.art._id){
          cantidadArtComprados += compras[i].ArtComprados[x].CantidadCompra
      
          let tiempo = new Date(compras[i].Tiempo)    
          let mes = this.addCero(tiempo.getMonth()+1)
          let dia = this.addCero(tiempo.getDate())
          var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
          arrCompras.push({
            Documento:"Compra",
            DocId:compras[i].CompraNumero,
            MongoID:compras[i].ArtComprados[x]._id,
            Eqid:compras[i].ArtComprados[x].Eqid,
            Titulo:compras[i].ArtComprados[x].Titulo,
            Precio_Compra:parseFloat(compras[i].ArtComprados[x].Precio_Compra).toFixed(2),
            CantidadCompra:compras[i].ArtComprados[x].CantidadCompra,
            Precio_Venta:parseFloat(compras[i].ArtComprados[x].Precio_Venta).toFixed(2)||0 ,
            Tiempo:date
          })
  
        } 
  
      }
  
  
    }
  }
  if(response.Ventas.length > 0){
  for (let i = 0; i<response.Ventas.length;i++){
    let ventas = response.Ventas
    for (let x = 0; x< ventas[i].articulosVendidos.length;x++){
      let tiempo = new Date(ventas[i].tiempo)    
      let mes = this.addCero(tiempo.getMonth()+1)
      let dia = this.addCero(tiempo.getDate())
      var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
      if(ventas[i].articulosVendidos[x]._id == this.props.art._id){
        cantidadArtVendidos += ventas[i].articulosVendidos[x].CantidadCompra
        arrVentas.push({
          Documento:"Venta",
          DocId:ventas[i].iDVenta,          
          Eqid:ventas[i].articulosVendidos[x].Eqid,
          Titulo:ventas[i].articulosVendidos[x].Titulo,
          Precio_Compra:parseFloat(ventas[i].articulosVendidos[x].Precio_Compra).toFixed(2),
          CantidadCompra:ventas[i].articulosVendidos[x].CantidadCompra,
          Precio_Venta:parseFloat(ventas[i].articulosVendidos[x].Precio_Venta).toFixed(2)||0 ,
          Tiempo:date
        })
      } 

    }

  } }
  if(response.Registros.length > 0){
    for (let i = 0; i< response.Registros.length;i++){
      let registrosGasto = response.Registros
      let tiempo = new Date(registrosGasto[i].Tiempo)    
      let mes = this.addCero(tiempo.getMonth()+1)
      let dia = this.addCero(tiempo.getDate())
      var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()

      if(registrosGasto[i].Descripcion2){
      for (let x = 0; x< registrosGasto[i].Descripcion2.articulosVendidos.length;x++){
      if(registrosGasto[i].Descripcion2.articulosVendidos[x]._id == this.props.art._id){
        cantidadArtEliminados += registrosGasto[i].Descripcion2.articulosVendidos[x].CantidadCompra
        arrRegs.push({
          Documento:"Reg Salida",
          DocId:registrosGasto[i].IdRegistro,
          Eqid:registrosGasto[i].Descripcion2.articulosVendidos[x].Eqid,
          MongoID:registrosGasto[i].Descripcion2.articulosVendidos[x]._id,
          Titulo:registrosGasto[i].Descripcion2.articulosVendidos[x].Titulo,
          Precio_Compra:registrosGasto[i].Descripcion2.articulosVendidos[x].Precio_Compra.toFixed(2),
          CantidadCompra:registrosGasto[i].Descripcion2.articulosVendidos[x].CantidadCompra,
          Precio_Venta:registrosGasto[i].Descripcion2.articulosVendidos[x].Precio_Venta.toFixed(2),
          Tiempo:date
        })
      }
  }}
    }
  }

  let newarr =[]
   
  let ListadoRegs = newarr.concat(arrCompras).concat(arrVentas).concat(arrRegs)
  let TotalArts =cantidadArtComprados-cantidadArtVendidos - cantidadArtEliminados
  this.setState({
    viewRegs:true,
    Compras:arrCompras,cantidadArtComprados,
    Ventas:arrVentas,cantidadArtVendidos,
    RegsElim:arrRegs,cantidadArtEliminados,
    TotalArts,
    ListadoRegs,
   
})
 }  
 
 })
      
      }
      addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
   
      Onsalida=()=>{
        document.getElementById('mainResearch').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {
console.log(this.state)




let ListadoRegsArt = []
if(this.state.ListadoRegs.length > 0){
    ListadoRegsArt = this.state.ListadoRegs.map((item,i)=>{


    return(
      <div className="contTitulos2"> 
<div className="Articid">
  {item.DocId}
</div>
<div className="Artic100">
{item.Documento}
</div>
<div className="Artic100">
{item.Tiempo}
</div>
<div className="Artic100">
{item.Eqid}
</div>
<div className="Artic150">
{item.Titulo}
</div>
<div className="Artic100">
{item.CantidadCompra}
</div>
<div className="Artic100">
${item.Precio_Compra}
</div>
<div className="Artic100">
${item.Precio_Venta}
</div>
 <style jsx >{`    
  .contTitulos2{
    display:flex;
   margin-top:5px;
    font-size: 15px;
   
    justify-content: space-around;
  
    width: 100%;
}
  .Artic100{
    width: 18%;  
    min-width:100px;
    max-width:130px;
    align-items: center;
    text-align:center;
    word-break:break-word
}
.Artic150{
  width: 18%;  
  min-width:150px;
  max-width:180px;
  align-items: center;
  text-align:center;
}
.Articid{
  width: 10%;  
  min-width:20px;
  max-width:50px;
  align-items: center;
  text-align:center;
}
 `}</style>
      </div>
    )
   })}


console.log()
        return ( 

         <div >

<div className="maincontacto" id="mainResearch" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Rastrear {this.props.art.Titulo}

</div>



</div> 
<div className="Scrolled">

<Animate show={this.state.getLoaderinv}>
  
  </Animate>
<div className='ContBotonesGenerales spaceAround'>
<div className='ContBotonGeneral ContCompras' onClick={()=>{this.setState({viewRegs:true,ListadoRegs:this.state.Compras})}}>
<div className='SubContBotonGental'>
          <span> Compras: </span>
          <span>{this.state.cantidadArtComprados} </span>
          </div>
         
</div>
<div className='ContBotonGeneral ContVendidos' onClick={()=>{this.setState({viewRegs:true,ListadoRegs:this.state.Ventas})}}>
<div className='SubContBotonGental'>
          <span> Ventas: </span>
          <span>{this.state.cantidadArtVendidos} </span>
          </div>
         
</div>
<div className='ContBotonGeneral ContEliminados' onClick={()=>{this.setState({viewRegs:true,ListadoRegs:this.state.RegsElim})}}>
<div className='SubContBotonGental'>
          <span>Eliminados: </span>
          <span>{this.state.cantidadArtEliminados} </span>
          </div>
         
</div>
</div>

<div className='contTablaResponsive'>
<div className="contTitulos2"> 
<div className="Articid">
                          ID
                        </div>
                        <div className="Artic100">
                        Documento
                        </div>
                        <div className="Artic100 ">
                        Tiempo
                        </div>
                        <div className="Artic100 ">
                        Eqid
                        </div>
                        <div className="Artic150">
                        Titulo
                        </div>
                        <div className="Artic100">
                        Cantidad
                        </div>
                        <div className="Artic100">
                        Precio Compra
                        </div>
                        <div className="Artic100">
                        Precio Venta
                        </div>
                        </div> 
                        <Animate show={!this.state.viewRegs}>
                          <CircularProgress />
                          </Animate> 
                        <Animate show={this.state.viewRegs}>
          {ListadoRegsArt}
          </Animate>
                        </div>                 

<div className='flexEnd' >
  <div className='ContBotonGeneral ContTotal'>
  <div className='SubContBotonGental'>
          <span> Total: </span>
          <span>{this.state.TotalArts} </span>
          </div>
         

    
  </div>
</div>
</div>
</div>
        </div>
        <style jsx >{`
        .contTablaResponsive{
     
          display: inline-grid;
          overflow-x: scroll;
        }
        .Articid{
          width: 10%;  
          min-width:20px;
          max-width:50px;
          align-items: center;
          text-align:center;
      }

      .contTitulos2{
        display:flex;
       
        font-size: 18px;
        font-weight: bolder;
        justify-content: space-around;
      border-bottom:1px solid blue;
      padding-bottom:4px;
        width: 100%;
    }
      .Artic100{
        width: 18%;  
        min-width:100px;
        max-width:130px;
        align-items: center;
        text-align:center;
        word-break:break-word
    }
    .Artic150{
      width: 18%;  
      min-width:150px;
      max-width:180px;
      align-items: center;
      text-align:center;
  }
        .SubContBotonGental{
          display: flex;
    justify-content: space-around;
    width: 100%;
        }
        .ContBotonGeneral {
          flex-flow: column;
          cursor:pointer;
          color: white;
          margin: 15px;
          border: 1px solid black;
          min-width: 200px;
          width: 100%;
          max-width: 270px;
          display: flex;
          justify-content: space-around;
          font-size: 30px;
          border-radius: 11px;
          border-bottom: 5px solid black;
       
          align-items: center;
          padding: 6px 0px;
          box-shadow: inset 3px 4px 6px white;

        }
        .ContBotonesGenerales{
          display:flex;
          flex-wrap:wrap;
        }
        .ContCompras{
          background: #2f3ce0;
        }
        .ContVendidos{
          background: green
        }
        .ContEliminados{
          background: red
        }
           .maincontacto{
            z-index: 1298;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition:0.5s;
            
            }
        
         
            .contcontacto{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .ContTotal{
                background:black;
                font-weight:bolder;
              }
              .flexEnd{
                display:flex;
                justify-content:flex-end;
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
              .entradaaddc{
                left: 0%;
                }

                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
                  }
                  .tituloventa{
                    display: flex;
                    align-items: center;
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: center;
                    justify-content: center;
                    }
                    .tituloventa p{
                    margin-top:5px;
                    margin-bottom:5px
                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 70vh;
                      padding: 5px;
                     
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

export default connect(mapStateToProps, null)(Contacto);