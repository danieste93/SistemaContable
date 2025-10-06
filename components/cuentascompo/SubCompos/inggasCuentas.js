import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import postal from 'postal';
import fetchData from '../../funciones/fetchdata';
import ViewVenta from '../../modal-viewventas';
export default class inggas extends Component {
    state={
        masDetalles:false,
        version:"Act",
        filtersUsers:false,
        filtersExe:false,
        filtersUsersDelete:false,
        viewVenta:false,
        dataventa:"",
        detectDoc:"",
        
    }
    channel1 = null;
    channel2 = null;
    componentDidMount() {
    
       this.channel1 = postal.channel();
      this.channel2 = postal.channel();
console.log(this.props)

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

    addCero=(n)=>{
      if (n<10){
        return ("0"+n)
      }else{
        return n
      }
    }
    genEditMode=(n)=>{
      if(this.props.reg.Accion == "Trans"){//es necesario xq las trans no tienen categoria
       return(<i className="material-icons i3D" onClick={(e)=>{
          e.stopPropagation(); 
         this.sendEdit(this.props.reg)
       }} >  edit</i>)
      }else{
       
        return( this.props.reg.CatSelect.idCat != 18  && <i className="material-icons i3D" onClick={(e)=>{
          e.stopPropagation(); 
         this.sendEdit(this.props.reg)
       }} >  edit</i>)
      }
    }
 
    render() {

let deleteReg = this.props.reg.TiempoDelete != null?true:false
let dataProvider = this.props.reg

let matchVenta = null;
let matchNotaDebito = null;
let matchNotaCredito = null;


let importeCheck = ""
let cuenta1Check = ""
let cuenta2Check = ""
let catCheck = ""
let subCatCheck = ""
let tiempoCheck = ""
let descripCheck = ""
let notaCheck = ""
let userCheck = ""
let upcont=''
let matchSelect = null;

if (dataProvider.Accion == "Ingreso") {
    if (dataProvider.CatSelect.idCat == 5) {
        // Match "Venta N°"
        matchVenta = dataProvider.Nota && dataProvider.Nota.match(/^(?!.*Nota de (?:Débito|Crédito) de la ).*Venta N°(\d+)/);
        // Match "Nota de Débito de la Venta N°"
        matchNotaDebito = dataProvider.Nota && dataProvider.Nota.match(/Nota de Débito de la Venta N°(\d+)/);
  
        // Match "Nota de Crédito de la Venta N°"
        matchNotaCredito = dataProvider.Nota && dataProvider.Nota.match(/Nota de Crédito de la Venta N°(\d+)/);
   }
}
console.log(matchVenta)

matchSelect = matchVenta || matchNotaDebito || matchNotaCredito



if(this.state.version != "Act" && this.props.reg.Versiones && this.props.reg.Versiones[this.state.version]){
  dataProvider= this.props.reg.Versiones[this.state.version]
  importeCheck= this.props.reg.Importe == this.props.reg.Versiones[this.state.version].Importe?"":"enfatizado"
  cuenta1Check= this.props.reg.CuentaSelec.idCuenta  == this.props.reg.Versiones[this.state.version].CuentaSelec._id  ?"":"enfatizado"
 
  tiempoCheck= this.props.reg.Tiempo  == this.props.reg.Versiones[this.state.version].Tiempo ?"":"enfatizado"
  descripCheck= this.props.reg.Descripcion  == this.props.reg.Versiones[this.state.version].Descripcion ?"":"enfatizado"
  notaCheck= this.props.reg.Nota  == this.props.reg.Versiones[this.state.version].Nota ?"":"enfatizado"
  userCheck= this.props.reg.Usuario.Id  == this.props.reg.Versiones[this.state.version].Usuario.Id ?"":"enfatizado"
  if(dataProvider.Accion != "Trans"){
    catCheck= this.props.reg.CatSelect._id  == this.props.reg.Versiones[this.state.version].CatSelect._id  ?"":"enfatizado"
    subCatCheck= this.props.reg.CatSelect.subCatSelect  == this.props.reg.Versiones[this.state.version].CatSelect.subCatSelect ?"":"enfatizado"
  }
  if(dataProvider.Accion == "Trans"){
    cuenta2Check= this.props.reg.CuentaSelec2.idCuenta  == this.props.reg.Versiones[this.state.version].CuentaSelec2._id  ?"":"enfatizado"
  }
}

let urlIco = dataProvider.Accion == "Trans"?"/iconscuentas/transfer.png":dataProvider.CatSelect.urlIcono
let genNombreCat = dataProvider.Accion == "Trans"?"Transferencia":dataProvider.CatSelect.nombreCat

let operadorGen =""

if(dataProvider.Accion == "Ingreso"){
  operadorGen = "+"
}else if(dataProvider.Accion == "Gasto"){
  operadorGen = "-"
}else if(dataProvider.Accion == "Trans"){
  if(dataProvider.CuentaSelec.idCuenta ==  this.props.cuentaActual._id){
    operadorGen = "-"
  }else {
    operadorGen = "+"
  }
}



if(dataProvider.urlImg.length != 0){

  upcont = "upCont"

}
let genNombreCuentas=()=>{

if(dataProvider.Accion == "Trans"){
  return(<p className={` cuentareg `} > <span className={` ${cuenta1Check} `}>{dataProvider.CuentaSelec.nombreCuenta}</span>
  <i className="material-icons" style={{color: "blue"}}>
  arrow_right_alt
      </i>
      <span className={` ${cuenta2Check} `}>{dataProvider.CuentaSelec2.nombreCuenta}</span>
  </p>)
}else{
  return(<p className={` cuentareg `} > <span className={` ${cuenta1Check} `}>{dataProvider.CuentaSelec.nombreCuenta}</span></p>)
}

}
let generadorDescrip=()=>{
    
    
  if(typeof dataProvider.Descripcion2 == "object"){
  let midata = dataProvider.Descripcion2.articulosVendidos.map((art)=>     


{

let generadorPrecio = dataProvider.Accion == "Gasto"? (art.CantidadCompra * art.Precio_Compra).toFixed(2):parseFloat(art.PrecioCompraTotal).toFixed(2)
return (<div className='contArtventa'>
    <span className='titleEqid'>{art.Eqid} </span>
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
  }else if(typeof dataProvider.Descripcion2 == "string") {
   return this.props.reg.Descripcion2
  }
  
  
      }
let generadorSaldo =()=>{
  if(this.state.version == "Act"){
    return(<div>(${this.props.reg.SaldoVal.toFixed(2)})</div>)
  }else{
    let saldoSinModi = this.props.reg.SaldoVal -this.props.reg.Importe
  
    let nuevoSaldo = saldoSinModi + dataProvider.Importe
    return(<div>(${nuevoSaldo.toFixed(2)})</div>)
  }
}

let renderimg=()=>{

  
  if(dataProvider.urlImg.length > 0){

  let  imagenes = dataProvider.urlImg.map((image, i)=>(
 <img key={i} src={image} className="imgrender" />
   ))
   return(imagenes)
 }


}



      let exeData =  dataProvider.TiempoEjecucion != 0?<i className="material-icons" style={{color: "green"}}>
      done
      </i>:
      <i className="material-icons" style={{color: "red"}}>
      alarm
      </i>
      let flechavalUser = this.state.filtersUsers?"▲":"▼"
      let flechavalExe = this.state.filtersExe?"▲":"▼"
   
      let idSpliced = dataProvider.Usuario.Id.slice(0, 5)
      let idSplicedDelete = deleteReg? this.props.reg.UsuarioDelete.Id.slice(0, 5):""
        let tiempo = new Date(dataProvider.Tiempo)     
        let mes = this.addCero(tiempo.getMonth()+1)
        let dia = this.addCero(tiempo.getDate())
        
        let date = tiempo.getFullYear()+'-'+mes+'-'+ dia;                 
        let hora = this.addCero(tiempo.getHours())+" : "+   this.addCero(tiempo.getMinutes())
        let date2 = "Registro"
        let hora2 = "Aun no ejecutado"
        if(dataProvider.TiempoEjecucion != 0){
         let tiempo2 = new Date(dataProvider.TiempoEjecucion)   
          let mes2 = this.addCero(tiempo2.getMonth()+1)
          let dia2 = this.addCero(tiempo2.getDate())
         
          date2 = tiempo2.getFullYear()+'-'+mes2+'-'+ dia2;                 
          hora2 = this.addCero(tiempo2.getHours())+" : "+   this.addCero(tiempo2.getMinutes())

        }
        let date3 = ""
        let hora3 = ""
        if(deleteReg){
          let tiempo3 = new Date(this.props.reg.TiempoDelete)   
          let mes3 = this.addCero(tiempo3.getMonth()+1)
          let dia3 = this.addCero(tiempo3.getDate())
         
          date3 = tiempo3.getFullYear()+'-'+mes3+'-'+ dia3;                 
          hora3 = this.addCero(tiempo3.getHours())+" : "+   this.addCero(tiempo3.getMinutes())

        }
 
        
let renderVersionsArr = [{_id:""}]
let renderVersions = ""
let getarr = []
if(this.props.reg.Versiones && this.props.reg.Versiones.length > 0){

  getarr= renderVersionsArr.concat(this.props.reg.Versiones)

}


renderVersions = getarr.map((ver,i)=>{
  if(ver._id == ""){
    let active = this.state.version == "Act"?"Vactive":""
    return(<div  onClick={(e)=>{e.stopPropagation();this.setState({version:"Act"})}} className={`buttonVer ${active} ` }>Act</div>)
  }else{
    let active = this.state.version == i-1?"Vactive":""
    
  return(<div onClick={(e)=>{
  
    e.stopPropagation()
     this.setState({version:i-1})}} className={`buttonVer ${active} ` }>{i}</div>)}
})



  let subcat =""
  let estiloreg = dataProvider.Accion =="Ingreso"?"ecingreso":
  dataProvider.Accion=="Gasto"?"ecgasto":
  dataProvider.Accion=="Trans"?"ectrans":""

  let ampliado = this.state.masDetalles? "detallesact":""
  if(dataProvider.Accion != "Trans"){
   if(dataProvider.CatSelect.subCatSelect){
subcat = dataProvider.CatSelect.subCatSelect != ""? dataProvider.CatSelect.subCatSelect:""
}}
        return (
     
<div className= {`jwPointer contDetalleING  ${estiloreg} ${ampliado}`} key={this.props.in} onClick={()=>{
    
console.log(this.props)
  this.setState({masDetalles:!this.state.masDetalles})
  if(this.state.masDetalles == true){
    this.setState({ version:"Act", filtersUsers:false})
  }
  
  }}>

  <div className={` contreg  `}>

<div className="reglateral">
  
  <img src={urlIco} className='imgReg' />
  <div className="centrar jwColumn jwAlignCenter">
<p className={` jwbolder ${catCheck} `}> {genNombreCat}</p>
<p className={` ${subCatCheck} `}>{subcat}</p>
</div>

</div>



<div className="regcentral">
<p
  className={`  ${notaCheck} `}
  style={
    matchSelect
      ? { color: "#1976d2", textDecoration: "underline", cursor: "pointer" }
      : {}
  }
  onClick={
    matchSelect
      ? async (e) => {
        console.log(matchSelect)
          e.stopPropagation();
          e.preventDefault()
          // Aquí puedes poner la función que desees para el hipervínculo
          // Por ejemplo: this.handleVentaClick();
          let findVentaState = undefined
if (this.props.stateData.RegContableReducer.Ventas) {
 
    findVentaState = this.props.stateData.RegContableReducer.Ventas.find(x => {
       
        return x.iDVenta == matchSelect[1];
    });
}

let detectDoc = matchNotaDebito? "Nota de Débito":
matchNotaCredito? "Nota de Crédito": 
matchVenta? "Venta":""
        if(findVentaState == undefined) {
    console.log("descargando");
    let data = await fetchData(this.props.stateData.userReducer, "/public/getVentaID", { id: matchSelect[1] });
    console.log(data);
    if (data.status == "Ok") {
        this.props.addVenta(data.findVenta[0]);
        this.setState(
            { viewVenta: true, dataventa: data.findVenta[0], detectDoc }, // Actualiza el estado
           
        );
    }
} else {
    // Encontrado en Redux
    this.setState(
        { viewVenta: true, dataventa: findVentaState, detectDoc }, // Actualiza el estado
   
    );
}
     }  : undefined
  }
>
  {dataProvider.Nota}
</p>
{genNombreCuentas()}
</div>
<div className="regfinal">
<div className="contPlata">
{ dataProvider.TiempoEjecucion == 0 &&

<i className="material-icons" style={{color: "red"}}>
    alarm
    </i>
  }
{ this.props.cuentaActual._id != 0 && <span className="operador"> {operadorGen} </span>}
<p className={` importegeneral ${importeCheck} `}>${(parseFloat(dataProvider.Importe) || 0).toFixed(2)}</p> 
</div>
{this.props.saldoActive && <p className={` importegeneral valormodificado  `}>{generadorSaldo()}</p> }

</div>
</div>
<Animate show={this.state.masDetalles}> 
<div className="detalles">
<div className=" tiempoCont">
<div className={` tiempoSub ${tiempoCheck} `} ><span className="tituloSub ">Tiempo Creado :</span> <span>{date } // {hora }</span>  </div>
{deleteReg &&  <div className={` tiempoSub`} ><span className="tituloSub ">Tiempo Eliminado :</span> <span>{date3 } // {hora3 }</span>  </div>}
<div className="tiempoSub"><span className="tituloSub "> Ejecutado:</span><span
className='centrar'
onClick={(e)=>{e.stopPropagation();this.setState({filtersExe:!this.state.filtersExe})}}
>{exeData }{flechavalExe} </span>  </div>
<div className="tiempoSub">
<Animate show={this.state.filtersExe}>
<div className="almostSub">
<span className="tituloSub ">Tiempo Ejecutado :</span> <span>{date2 } // {hora2 }</span>  
</div>
</Animate>
</div>
</div>


</div>


<div className=" ContCompartido">
  <div className='contDual'>
  <div className='contDataDeta'>
  <div className="subContDetaData">
<div className=" tituloDetaData">Descripción: </div>


<span className={`  ${descripCheck} `}>{dataProvider.Descripcion }</span> 
</div>
<div className="subContDetaData">
<div className=" tituloDetaData">
  Registrado Por:
  </div>
  <span
  className={`  ${userCheck} `}
   onClick={(e)=>{e.stopPropagation();this.setState({filtersUsers:!this.state.filtersUsers})}}
  > {dataProvider.Usuario.Nombre}
  
   <span 
  
   >{flechavalUser}</span></span>

  </div>


  <Animate show={this.state.filtersUsers}>
  <div className="subContDetaData">
  <div className=" tituloDetaData"> Tipo de Usuario:</div>
  <span> {dataProvider.Usuario.Tipo}</span>
  </div>
  <div className="subContDetaData">
  <div className=" tituloDetaData">Identificacion:</div>
  <span> {idSpliced}...</span>
  </div>
  </Animate>

{deleteReg && <div className="subContDetaData">
<div className=" tituloDetaData">
  Eliminado Por:
  </div>
  <span
  className={`  ${userCheck} `}
   onClick={(e)=>{e.stopPropagation();this.setState({filtersUsersDelete:!this.state.filtersUsersDelete})}}
  > {this.props.reg.UsuarioDelete.Nombre}
  
   <span 
  
   >{flechavalUser}</span></span>

  </div>}
  {deleteReg && <Animate show={this.state.filtersUsersDelete}>
  <div className="subContDetaData">
  <div className=" tituloDetaData"> Tipo de Usuario:</div>
  <span> {this.props.reg.UsuarioDelete.Tipo}</span>
  </div>
  <div className="subContDetaData">
  <div className=" tituloDetaData">Identificacion:</div>
  <span> {idSplicedDelete}...</span>
  </div>
  </Animate>}

  <div className="subContDetaData">
<div className=" tituloDetaData">
Registro Número:
  </div>
  <span> {dataProvider.IdRegistro}</span>

  </div>
  <Animate show={this.props.reg.Versiones && this.props.reg.Versiones.length > 0}>
  <div className="subContDetaData">
  <div className=" tituloDetaData">
 Versiones:
  </div>
  <span className='contVersiones'> {renderVersions}</span>
  </div>
  </Animate>
  </div>
  <div className='contDescrip2'>
  {generadorDescrip() }
  </div>
  </div>
  <div className={`contImagenes  ${upcont}`}>
{renderimg()}
</div>
</div>
<Animate show={dataProvider.Estado && !deleteReg}>
<div className="detalles iconset">


{ this.genEditMode()}


<i className="material-icons i3D" onClick={(e)=>{
   e.stopPropagation(); 
  this.sendDelete(this.props.reg)
}} >  delete</i>
</div>
</Animate>
</Animate>
 <Animate show={this.state.viewVenta}>
        <ViewVenta token={this.props.stateData.userReducer.update.usuario.token} 
        usuario={this.props.stateData.userReducer.update.usuario} 
        detectDoc={this.state.detectDoc}
        datos={this.state.dataventa} Flecharetro={()=>{this.setState({viewVenta:false, dataventa:""})}  }/>
        </Animate>

                <style >{`
                 .contArtventa{
                  display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    border-bottom: 1px solid;
    margin: 4px 0px;
    border-radius: 5px;
    padding:3px;
                }
                .titleEqid{
                  width:20%;
                  word-break: break-all;
                }
                .titleVent{
                  max-width: 50%;
                  word-break: break-all;
                }
               .mitabla{
                border: 1px solid black;
    
    padding: 5px;
    border-radius: 10px;
    background: #d1e7ff;
               }
              .regfinal{
                display: flex;
    flex-flow: column;
    /* justify-content: flex-end; */
    min-width: 80px;
    align-items: flex-end;
              }
               .contPlata{
                display: flex;
                align-items: center;
              }
              .operador{
            
              font-weight: bolder;
              font-size: 20px;
              /* color: green; */
              margin-right: 5px;
              margin-bottom: 5px;
            
    width: 25%;
              }
.valormodificado{
  font-size: 14px;
    font-weight: bold;
}

                .imgrender{
                  max-width: 300px;
                  border-radius: 10px;
                  margin: 8px;
                  width:90%;
                  max-height: 90%;
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
    font-size:15px;
    align-items: center;
                }
                .iconset{
                  margin-top: 15px;
                  justify-content: space-around;
                  padding-top: 16px;
                }
                
                
                 .cuentareg{
                    font-size: 15px;
                    color: darkgrey;
                    display: flex;
                  flex-wrap: wrap;
                  }
                p{
                    margin:0px
                  }
          
                
.cuentareg{
font-size: 15px;
color: grey;
}
              
.descripCont{
  width: 38%;
  max-width: 300px;
    padding: 5px;
}
.tiempoCont{
  width: 100%;
  padding: 2px;
  background: #ffffffc9;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.tiempoSub{
  max-width: 350px;
  width: 100%;
  display: flex;
  align-items: center;

}
.almostSub{
  max-width: 350px;
  width: 100%;
  display: flex;
  align-items: center;

}
 .importegeneral{
  transition:1s;
 }
.tituloSub {
  font-weight: bold;
  font-size: 17px;
  display: flex;
  width: 100%;
 
  word-break: break-word;
  min-width: 160px;
  max-width: 160px;
}
                  .imgReg{
                    width: 50%;
                    max-width: 60px;

                  }
                  .tituloDetaData{
                    width: 100%;
                    max-width: 150px;
                    font-size: 16px;
                    font-weight: bold;
                  }
                  .subContDetaData{
                    display:flex;
                    flex-wrap: wrap;
                    margin-top: 10px;
                  }
                  .ContCompartido{
                    display:flex;
                    border-top: 3px solid grey;
                    margin-top: 8px;
                    flex-wrap:wrap;
                    padding-top: 5px;
                    justify-content: space-around;
                    align-items: center;
                  }
                  .contDual{
                    min-width: 300px;
                    display:flex;
                    flex-flow: column;
                    max-width: 380px;
                  }
                  .contDescrip2{
                    margin-top:10px
                  }
                  .contDataDeta{
                 
             
                    padding: 5px;
                    background: white;
                    border-radius: 15px;
                  }
                  .contImagenes{
                    min-width: 350px;
                    max-width: 350px;
                    height: 1px;
                    transition: 1s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap:wrap;
                    overflow-y: scroll;
                  }
                  .upCont{
                    height:250px;  
                  }
                 
                  .subContimagenes{
                    display: flex;
                    justify-content: center;
                    opacity:1;
                    transition:1s;
                  }
                  .noviewimg{
                    opacity:0;
                 
                  }
                  .displaynone{
                    display:none
                  }
                  .reglateral p{
                    font-size: 15px;
                  color: grey;
                  word-break: break-word;
                  overflow:hidden;
                  }
               
                .ecingreso {
                  box-shadow: 0px 1px 0px #2bfd4c;
    background: #2fff5e38
                  }
                  .ecgasto {
                    box-shadow: 0px 1px 0px #ff0000;
                    background: #ff919154;}
                  .reglateral{
                    width: 45%;
                    display: flex;
                    min-width: 155px;
                    max-width: 200px;
                    }
                    
                  .regcentral{
                    width: 35%;
                }
                .enfatizado{
                  background: #e7ff11b8;
                  border-radius: 11px;
                
                }
             
                
                .textid{
                margin-bottom: 10px;
    font-size: 15px;
    font-style: italic;
    color: grey;}

    .detallesact{
      border: 1.5px solid black;
    }
    .detallesgrupo {
      width: 38%;
      display:flex;
      justify-content: center;
      flex-wrap: wrap;
      max-width: 300px;
    }
    .buttonVer{
      border: 1px solid #000000;
      width: 26px;
      height: 26px;
      text-align: center;
      border-radius: 9px;
      display: flex;
      background: white;
      color: black;
      padding: 0px;
      justify-content: center;
      align-items: center;
      transition:1s;
      border-bottom: 2px solid black;
      margin:5px
    }
    .contVersiones{
      display: flex;
      width: 100%;
      justify-content: space-around;
      max-width: 250px;
      flex-wrap: wrap;
      margin-top: 5px;
      align-items: center;
      
    }
    .Vactive{
      background:black;
      color:white;
      width: 27px;
      height: 27px;
    }
    .ectrans {
      box-shadow: 0px 1px 0px #0407fd;
      background: #ecf5ff;
      }
                `}
                </style>
            </div>
        )
    }
}
