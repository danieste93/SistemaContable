import React, { Component } from 'react'
import ReactToPrint from "react-to-print";
import Barcode  from 'react-barcode';
import Autosuggestjw from '../suggesters/jwsuggest-autorender';
import {connect} from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ListArtsBarras from "./listArtsBarraRender";
import {Animate} from "react-animate-mount"
class Contacto extends Component {
   

state={
  ArtAdd:[],
  Errorlist:[],
  precioVenta:true,
  tituloArt:true,
  ValorData:true,
  TituloData:true,
  CodeData:true,
}

  printRef  = React.createRef();
  componentRef  = React.createRef();
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainBarCode').classList.add("entradaaddc")

       }, 500);
      }
      SetPrecios=(e)=>{
      
        let itemfind =  this.state.ArtAdd.filter(x=>x.Eqid === e.item.Eqid)  
        let indexset = this.state.ArtAdd.indexOf(itemfind[0])
     

let deepClone = JSON.parse(JSON.stringify(this.state.ArtAdd));

deepClone[indexset].Precio_Venta = e.value

this.setState({ArtAdd:deepClone})
 
      }
      addArt=(e)=>{
        console.log(e)
        let findArt = this.state.ArtAdd.find(x => x._id == e._id)

        if(findArt == undefined){
          let   newData ={...e,
                          CantidadImpresion:e.Existencia,
          
          }
      
      

      let newarr = [...this.state.ArtAdd, newData]

      this.setState({ArtAdd:newarr})} else{
    
      
        let add = {
          Estado:true,
          Tipo:"info",
          Mensaje:"Articulo ya ingresado"
            
      }
      this.setState({Alert: add, loading:false}) 
      }
    }
    deleteItem=(e)=>{

      let newarr = this.state.ArtAdd.filter(x=>x.Eqid != e)
      this.setState({ArtAdd:newarr})
    }
    SetCantidad=(e)=>{
         
      let itemfind = this.state.ArtAdd.filter(x=>x.Eqid == e.item.Eqid)  
             
      let indexset = this.state.ArtAdd.indexOf(itemfind[0])
      let deepClone = JSON.parse(JSON.stringify(this.state.ArtAdd));
  
  deepClone[indexset].CantidadImpresion = parseInt(e.value)

  this.setState({ArtAdd:deepClone})
          }
    
    GenerarBarras = ()=> {
      let barrasitem = this.state.ArtAdd.map((datos)=>{

        let itemMap = [...Array(datos.CantidadImpresion)].map((e,i)=>{
     
            return (
<div  className="Areaimpresa" >
  <div className="areaDatos">

  <span className="areaDatos1">

  {this.state.CodeData && datos.Eqid}
    </span>
  <span className="areaDatos2">
  
     {this.state.ValorData &&`$${datos.Precio_Venta.toFixed(2)}`}
     </span>
  </div>

              <Barcode displayValue={false} height={57}  width={1.6}value={datos.Eqid}  />
<span className=' limitedatos'>    {this.state.TituloData && datos.Titulo}</span>
<style>{`

.Areaimpresa{
  font-size:10px;
min-height: 112px;
max-height: 112px;
 
  display:flex;
  padding-top:1px;       
              width:98%;
  overflow:hidden;
  justify-content: center;
              align-items: center;
              flex-flow: column;
                  
 
}
.areaDatos{
  display:flex;
  width:80%;
  height: 10%;
  max-height: 10%;
  justify-content: flex-end;
  font-size:12px;
  
}
.limitedatos{
  text-align: center;
   height: 10%;
   max-height: 10%;
   width:80%;
   display:flex;
   justify-content: flex-end;
    overflow: hidden;
    text-overflow: ellipsis;
  
}
.areaDatos1{
 width:80%
}
.areaDatos2{
  font-weight:bolder
}
`
  }

</style>
                                               </div>
                
                
          

          )
        })

        return(itemMap)

      })
         return barrasitem
        }
        getSugerencias=()=>{
          let data = this.props.state.RegContableReducer.Articulos?this.props.state.RegContableReducer.Articulos.filter(x=> x.Tipo != "Servicio" && x.Tipo != "Combo" ):[]
      console.log(data)
  return (data)

         }
         resetArtData=()=>{
   
                
         }
      Onsalida=()=>{
        document.getElementById('mainBarCode').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      handleChangeSwitch=(e)=>{   
        let switchmame = e.target.name                    
        this.setState({[switchmame]:!this.state[switchmame]})
      }

    render () {
      let listaItems =""
   console.log(this.state)
      if(this.state.ArtAdd.length > 0){
     
        listaItems= this.state.ArtAdd.map((item, i)=>{
          return(<ListArtsBarras
            index={i} 
            key={item.id} 
            Errorlist={this.state.Errorlist} 
            datos={item} 
            sendCantidad={(e)=>{this.SetCantidad(e)}} 
            sendPrecio={(e)=>{this.SetPrecios(e)}} 
            deleteItem={(e)=>{this.deleteItem(e)}} 
             />
         )
        })
      }
   
        return ( 

         <div >

<div className="maincontacto" id="mainBarCode" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Generador Codigos de barra

</div>



</div> 
<div className="Scrolled">

<div className="contSuperior">
        <Autosuggestjw  sendClick={(e)=>{this.addArt(e)}} getvalue={(item)=>{console.log("")}} 
        sugerencias={this.getSugerencias()} resetData={this.resetArtData}   /> 
<div className='contSwitch'>
<FormControlLabel
        control={
          <Switch
         
          onChange={this.handleChangeSwitch}
            name="ValorData"
            color="primary"
            checked={this.state.ValorData}
          />
        }
        label="Precio"
      />
      <FormControlLabel
        control={
          <Switch
         
          onChange={this.handleChangeSwitch}
            name="TituloData"
            color="primary"
            checked={this.state.TituloData}
          />
        }
        label="Titulo"
      />
      <FormControlLabel
        control={
          <Switch
         
          onChange={this.handleChangeSwitch}
            name="CodeData"
            color="primary"
            checked={this.state.CodeData}
          />
        }
        label="Codigo"
      />
</div>
        </div>
        <div className="contAgregadorCompras">
        <div className="contTitulos2 ">
                  
                  <div className="Articid">
                    ID
                  </div>
                  <div className="Artic100Fpago">
                     Nombre
                  </div>
                  <div className="Artic100Fpago ">
                      Cantidad
                  </div>
                  <div className="Artic100Fpago ">
                      P.Individual
                  </div>
       
                  <div className="accClass ">
                      Acc
                  </div>
                
                  </div>

                  <div className="maincontDetalles">
                        <div className="contListaCompra ">
                         { listaItems}
                          </div>
                        </div>
                        </div>

<div className='jwFlexEnd'>
<ReactToPrint 
                        trigger={() => <div className='printButton'>
                          
                          <i className="material-icons"style={{fontSize:"20px"}}>
                        print
                        </i>
                           Imprimir
                        
                        <style>
                          {`
                          .printButton{
                            display: flex;
                              border: 1px solid black;
                              width: 150px;
                              justify-content:  space-evenly;
                              align-items: center;
                              border-radius: 20px;
                              color: white;
                              border-bottom: 3px solid black;
                              height: 30px;
                              background: blue;
                              margin-top:50px;
                              cursor:pointer;
                          }
                          `}
                        </style>
                         </div>}
                        content={() => this.componentRef.current}
                        ref={this.printRef}  
                    />   
                    </div>
<div style={{display:"none"}} >
  <div  className="Areaimpresion" ref={this.componentRef}> 
    {this.GenerarBarras()}   
    </div>
    </div>

</div>
</div>
        </div>
        <style jsx >{`
        @media print {
         
          
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
            .Areaimpresion{
              
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-flow:column;
              width: 245px;  
             
           
             
          }
         
          .Areaimpresape{              
           
              margin: auto;
              display: flex;
              height: 120px;
              padding:1px ;
              margin-bottom: 35px;
              margin-left: auto;
              justify-content: center;
              align-items: center;
         
              flex-flow: column;
          }
          .contTitulos2{
            display:flex;
           
            font-size: 15px;
            font-weight: bolder;
            justify-content: space-around;
          
            width: 100%;
        }
        .Articid{
          width: 10%;  
          min-width:20px;
          max-width:50px;
          align-items: center;
          text-align:center;
      }
        .Artic100Fpago{
          width: 18%;  
          min-width:80px;
          max-width:100px;
          align-items: center;
          text-align:center;
      }
      .contListaCompra{
        width: 100%;
    }
      .accClass{
        width:10%;
        display: flex;
    justify-content: center;
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
                    .contSuperior{
                      display:flex;
                    }
                    .contSwitch{
                      margin-left:10px;
                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 90vh;
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