import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import postal from 'postal';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import OrganizadorTiempo from "../cuentascompo/newHooks/OrganizadorTiempo"
import GenGroupRegs from '../cuentascompo/SubCompos/GenGroupRegsCuentasNuevas';
import CircularProgress from '@material-ui/core/CircularProgress';
import {addFirstRegs,addRegs,gettipos,getcuentas} from "../../reduxstore/actions/regcont"

class Contacto extends Component {
   
state={
  fechaSeleccionada:"",
  filtrosTiempo:false,
  ShowDetalles:"",
  DetallesCuenta:false,
  Cuentas:true,
  genTrans:false,
  CuentaSelect:{NombreC:"",_id :""},

  CantidadAtrans:"",

  
  Alert:{Estado:false},
  CuentaDestinoAll:"",
  CuentaDestino:"",
  loading:false,
  tiempo: new Date(),
  Allcuentas:this.props.state.RegContableReducer.Cuentas,
  Regs:[],
  ProcessRegs:null,
  diario:false,
  mensual:false,
  periodo:false,
}
channel1 = null;
    componentDidMount(){
      this.channel1 = postal.channel();
      setTimeout(function(){ 
        
        document.getElementById('maincuentasVend').classList.add("entradaaddc")

       }, 500);
      // if(!this.props.state.RegContableReducer.Registros|| !this.props.state.RegContableReducer.Cuentas||!this.props.state.RegContableReducer.Tipos){
  
            this.getVendData()
      

      
      
      }

      getVendData=()=>{
        console.log("en venddata")
        let datos = {Usuario: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
          Tipo: this.props.state.userReducer.update.usuario.user.Tipo,
        _id:this.props.state.userReducer.update.usuario.user._id
        }}
      let lol = JSON.stringify(datos)
        let settings = {
          method: 'POST', // or 'PUT'
          body: lol, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }
      
        fetch("/public/venddata", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
               })
        .then(response => {  
        console.log(response)
          if(response.status == 'error'){}
        else if(response.status == 'Ok'){
          this.props.dispatch(addFirstRegs(response.regsHabiles));
          this.props.dispatch(gettipos(response.tiposHabiles));

          this.setState({filtrosTiempo:true,})
        }
      
        })
      }


    

      sendTrans=(restante)=>{

if(this.state.CuentaDestinoAll != ""  ){
if(parseFloat(restante).toFixed(2) == parseFloat(this.state.CantidadAtrans).toFixed(2)){

let datatosend={
  
  Tiempo:this.state.tiempo.getTime(),
  CuentaSelect1:this.state.CuentaSelect,
  CuentaSelect2:this.state.CuentaDestinoAll,
  Importe:this.state.CantidadAtrans,
  Nota:"Cierre de Caja",
  Descripcion:`Transferencia Diaria`,


Usuario:this.props.state.userReducer.update.usuario.user
}



             
let url = "/cuentas/addcierrecaja"   
fetch(url, {
method: 'POST', // or 'PUT'
body: JSON.stringify(datatosend), // data can be `string` or {object}!
headers:{
  'Content-Type': 'application/json',
  "x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json()).then(response =>{
 
 console.log("response",response)
 if(response.message=="error al registrar"){
  let add = {
    Estado:true,
    Tipo:"error",
    Mensaje:"Error en el sistema, porfavor intente en unos minutos"
}
this.setState({Alert: add, loading:false}) 
} 
else{
  let add = {
    Estado:true,
    Tipo:"success",
    Mensaje:"Cierre de Caja realizado"
}
this.setState({Alert: add, loading:false, Cuentas:true, genTrans:false}) 

this.props.dispatch(addRegs(response.Reg))

setTimeout(()=>{
  this.channel1.publish('updateDataVend', {
    message: 'enviado desde reset'
  });
},800)


}
})

}else{
  let add = {
    Estado:true,
    Tipo:"error",
    Mensaje:"No puede haber dinero restante o exedente"
}
this.setState({Alert: add, loading:false}) 
}
}else{
  let add = {
    Estado:true,
    Tipo:"error",
    Mensaje:"Seleccione una cuenta destino"
}
this.setState({Alert: add, loading:false}) 
}

      }


    
    
      Onsalida=()=>{
        document.getElementById('maincuentasVend').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      handleChangeCuentas=(e)=>{
     

        let cuentaAsig  = this.state.Allcuentas.filter(x=>x._id == e.target.value)
    

        this.setState({CuentaDestino:cuentaAsig[0]._id,
          CuentaDestinoAll:cuentaAsig[0]
                
        })
          }  
      
      
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:parseFloat(e.target.value)
        })
        }  
      
        getCuentas=()=>{
     
          if(this.state.Allcuentas.length>0){
  
          let cuentasFiltradas = this.state.Allcuentas.filter(x=>x._id!=this.state.CuentaSelect._id
            && x.iDcuenta != 9999998 && x.Tipo != "Distribuidores" && x.Tipo != "Trabajadores"
            
            )
    
          if(cuentasFiltradas.length > 0){
            let cuentasrender = cuentasFiltradas.map((c, i)=>{
  
              return(
                <option value={c._id} key={i} >{c.NombreC}</option>
              )
            })
            return cuentasrender
          }else {
            return ""
          }}else {
            return ""
          }
  
  
        } 
        getDatatime=(e)=>{
       
          let tiempo = new Date(e)    
          let mes = tiempo.getMonth()+1
          let dia = tiempo.getDate()
          var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
          
          this.setState({fechaSeleccionada:date})
        }
  
    render () {


console.log(this.state)

      let flechaval = this.state.filtrosTiempo?"▲":"▼"
     
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
      }
      let cuentasData = this.state.genTrans? this.getCuentas():""
      let cuentasEnPosecion = this.state.Allcuentas.length > 0? this.state.Allcuentas.filter(x => x.CheckedP).map(x=>x._id):[]
      let arrValidos = this.props.state.RegContableReducer.Cuentas? this.props.state.RegContableReducer.Cuentas.map(x=>x._id):[]
      let cuentasValidas = this.props.state.RegContableReducer.Cuentas? this.props.state.RegContableReducer.Cuentas.filter(x =>x.CheckedP == true ):[]
console.log(cuentasEnPosecion)
      const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      

    // console.log(this.state.CuentaSelect.DineroActual,this.state.CantidadAtrans,this.state.CantidadAdejar,)


let tiposrender = ""
let cuentasrender  =[]
let detallesrender= ""
let ingresoTotal  = 0
let gastoTotal  = 0
let balanceTotal = 0
let DineroDisponible = 0
let DetallesCuenta =[]
let TransferenciasTotales = 0
let Restante = 0
let getCuentasToRender = []

if(this.state.ProcessRegs){

//let RegIngsValidos = this.state.ProcessRegs.filter(x => (x.Accion=="Ingreso" ||x.Accion=="Gasto") )




let RegsIng = this.state.ProcessRegs.filter(x => x.Accion=="Ingreso" && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id &&  cuentasEnPosecion.includes(x.CuentaSelec.idCuenta) ).reverse()
let RegsGas = this.state.ProcessRegs.filter(x => x.Accion=="Gasto" && x.Usuario.Id  == this.props.state.userReducer.update.usuario.user._id   &&  cuentasEnPosecion.includes(x.CuentaSelec.idCuenta)) .reverse()



let RegsIngAvailable  = this.state.ProcessRegs.filter(x => x.Accion=="Ingreso" && arrValidos.includes(x.CuentaSelec.idCuenta) && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id ) 
let DetallesAvailable  = this.state.ProcessRegs.filter(x =>  arrValidos.includes(x.CuentaSelec.idCuenta) && (x.Accion=="Ingreso" ||x.Accion=="Gasto")  && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id ) 



let misCuentas = DetallesAvailable.map(x=> x.CuentaSelec )
let sinRepetidosObjeto= misCuentas.filter((value, index, self) => {
  return(            
    index === self.findIndex((t) => (
      t.idCuenta === value.idCuenta && t.idCuenta === value.idCuenta
    ))
)

});



if(this.props.regC.Cuentas){
for(let i = 0;i<this.props.regC.Cuentas.length;i++){

  for(let j = 0;j<sinRepetidosObjeto.length;j++){

    if(sinRepetidosObjeto[j].idCuenta == this.props.regC.Cuentas[i]._id    ){
      getCuentasToRender.push(this.props.regC.Cuentas[i])
    }

  }
 
}}



console.log(this.state.ProcessRegs)

let transGenerated = this.state.ProcessRegs.filter(x =>x.Accion=="Trans"  && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id)

if(transGenerated.length > 0){
 
  TransferenciasTotales = transGenerated.reduce( (acc, obj)=>  acc + obj.Importe, 0).toFixed(2);
}
console.log(transGenerated)



if(this.state.CuentaSelect._id != ""){

   DetallesCuenta  = this.state.ProcessRegs.filter(x =>  x.CuentaSelec.idCuenta == this.state.CuentaSelect._id && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id   )
   

}

if(RegsIng.length > 0){
 
  ingresoTotal = RegsIng.reduce( (acc, obj)=>  acc + obj.Importe, 0).toFixed(2);
}

if(RegsGas.length > 0){
 
  gastoTotal = RegsGas.reduce( (acc, obj)=>  acc + obj.Importe, 0).toFixed(2);
}
if(RegsIngAvailable.length > 0){
 
  DineroDisponible = (RegsIngAvailable.reduce( (acc, obj)=>  acc + obj.Importe, 0) - gastoTotal).toFixed(2);
}

if(this.state.CuentaSelect != ""){

  let transGeneratedthiscount = this.state.ProcessRegs.filter(x =>x.Accion=="Trans" && 
  !arrValidos.includes(x.CuentaSelec2.idCuenta&& 
    x.CuentaSelec._id==this.state.CuentaSelect._id
    ))
    let datasum  = transGeneratedthiscount.reduce( (acc, obj)=>  acc + obj.Importe, 0)
  let  RegsFiltraCuenta  = this.state.ProcessRegs.filter(x =>  x.CuentaSelec.idCuenta == this.state.CuentaSelect._id  && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id )
    Restante = RegsFiltraCuenta.reduce((acc, item)=>{
            
      if(item.Accion == "Ingreso"){
        return acc + item.Importe
      }else if(item.Accion == "Gasto"){
        return acc - item.Importe
      }else if(item.Accion == "Trans"){
        return acc - item.Importe
      }
    },0)



 // Restante = ((DineroDisponible-datasum) - this.state.CantidadAtrans).toFixed(2);
 }
balanceTotal = ingresoTotal - gastoTotal

let RegistrosMostrar = ""
if(this.state.ShowDetalles == "AllIng"){
  RegistrosMostrar=RegsIng
}else if(this.state.ShowDetalles == "AllGas"){
  RegistrosMostrar=RegsGas
}



else if(this.state.ShowDetalles == "DetallesCuenta"){
  RegistrosMostrar=DetallesCuenta
  
}else if(this.state.ShowDetalles == "DetallesAvailable"){
 
  RegistrosMostrar=DetallesAvailable
}else if(this.state.ShowDetalles == "AllTrans"){
  RegistrosMostrar=transGenerated
}


detallesrender = <GenGroupRegs Registros={RegistrosMostrar} cuentaSelect={{_id:0}} datosGene={{saldo:0, balance:0,saldoActive:false}}   />

}


      if(this.props.regC.Tipos){

        tiposrender = this.props.regC.Tipos.map((tipo, i)=>{
        
        let visible=""
        let sumatoria= 0
        
        let sumatoriaST= 0
        if(this.props.regC.Cuentas){
          if(this.props.regC.Cuentas.length > 0){
      
   
              cuentasrender = getCuentasToRender.filter(cuentaper => cuentaper.Tipo === tipo )
      
           
          }
        }
          let cantidadCuentas = cuentasrender.length 
          visible = cantidadCuentas == 0?"invisiblex":""
          let color = sumatoria > 0? "setBlue":"setRed"
        
        //let cuenEditMode= this.state.cuenEditMode?"ceditmodeactive":""
        
        return(<div className={`tipoMainVend ${visible}`}key={i}>
        <div className="contFlexSpaceB">  
        <div className="titilulo">{tipo.toUpperCase()}</div> 
        <div className={`valorcuentas  ${color} `}> </div>
        
        </div>
        
        <div className="contcuentas">
        { cuentasrender.map((cuenta, i)=>{
    let sumatoriaRegs = 0    

let DiaComplete = DineroDisponible == TransferenciasTotales &&
(DineroDisponible != 0 ||TransferenciasTotales != 0 )?true:false

let tiempo = new Date()    
let mes = tiempo.getMonth()+1
let dia = tiempo.getDate()
var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()


let comp3 = date == this.state.fechaSeleccionada?true:false

let comp2 = DiaComplete?false:
!DiaComplete && this.state.diario?true:""

   let   RegsFiltradosCuenta = []
    
        if(this.state.ProcessRegs) {
          RegsFiltradosCuenta  = this.state.ProcessRegs.filter(x =>  x.CuentaSelec.idCuenta == cuenta._id  && x.Usuario.Id == this.props.state.userReducer.update.usuario.user._id )
        
      

          sumatoriaRegs = RegsFiltradosCuenta.reduce((acc, item)=>{
            
            if(item.Accion == "Ingreso"){
              return acc + item.Importe
            }else if(item.Accion == "Gasto"){
              return acc - item.Importe
            }else if(item.Accion == "Trans"){
              return acc - item.Importe
            }
          },0)
        
    
        
        }
        let tintura = (sumatoriaRegs)=>{
        
        
          if(sumatoriaRegs == 0){
            return ""
          }else if(sumatoriaRegs > 0){
            return "setBlue"
          }else if(sumatoriaRegs < 0){
            return "setRed"
          }
      
     
        }
        return(
          <div className='ContCuentaVend'>
        <div key ={i}className={ `  cuentaname jwPointer `} onClick={(e)=>{
        
         
        this.setState({CuentaSelect:cuenta, ShowDetalles:"DetallesCuenta", DetallesCuenta:true, Cuentas:false, genTrans:false })
  
      }} >
        <p className='namecont' >
        {cuenta.NombreC}
        </p>
        <div className="conteliminal">
  <p className={tintura(sumatoriaRegs)}>
 {`$ ${sumatoriaRegs.toFixed(2)}` }
  </p>
 
  </div>
       
        
          </div>
          <Animate show={comp2 && comp3}>
          <div className='transcont' onClick={(e)=>{


 
          e.preventDefault()
          if(   sumatoriaRegs  > 0){
          this.setState({
            
            DetallesCuenta:false, 
            Cuentas:false,
             genTrans:true, 
            CuentaSelect:cuenta,          
            CantidadAtrans:   sumatoriaRegs
          
          })}else{
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"No hay dinero disponible"
          }
          this.setState({Alert: add, loading:false}) 
          }
        }}>
          <span>Cierre Diario</span>
        <i className="material-icons " >  send</i>
        </div>
        </Animate>
          </div>
          )
        })}
        
   
        </div>
        <style  >{`
        .ContCuentaVend{
          display: flex;
          justify-content: space-around;
        }
        .tipoMainVend{
          box-shadow: -2px 1px 3px #8ebaeb;
background: white;
margin: 5px;
border-radius: 10px;
padding: 15px 9px 15px 8px;
width: 96%;
margin-left: 2%;
        }
        .titilulo{
          font-weight: bold;
          font-size: 20px;
        }

        .cuentaname{

          border-bottom: 2px solid grey;
          padding: 11px 11px 1px 15px;
          border-radius: 13px;
          margin-bottom: 10px;
          justify-content: space-between;
          align-items: center;
          display: flex;
  min-height:40px;
          transition:1s;
          box-shadow: -1px 3px 4px black;
          
          background: ghostwhite;
          width: 60%;
          margin: 10px;
        }
        .transcont{
          align-items: center;
          width: 113px;
          display: flex;
          border: 1px solid;
          border-radius: 9px;
          padding: 6px;
          margin: 3px;
          background: mintcream;
          text-align: center;
          justify-content: center;
          border-bottom:4px solid ;
          cursor:pointer;
          }
          .valorcuentas{
            margin-right: 15px;
            font-weight: bold;
            }
            .namecont{
              width: 100px;
             }
          .conteliminal{
            width: 100px;
            display: flex;
            max-width: 200px;
              justify-content: flex-end;
             }
        
             .invisiblex{
              display: none;
              }
             
              .setBlue{
                color:blue;
                }
                .setRed{
                color:red;
                }
        `}</style>
        </div>)
        
        }) 
      }


    let DiaComplete = DineroDisponible == TransferenciasTotales &&
    (parseFloat(DineroDisponible) != 0 ||parseFloat(TransferenciasTotales) != 0 )?true:false

    
      let fondoCondo = DineroDisponible == 0 &&TransferenciasTotales == 0 ?" ":
      DineroDisponible == undefined &&TransferenciasTotales == undefined ?" ":
      DiaComplete?"fondoVerde":
                  parseFloat(DineroDisponible) > parseFloat(TransferenciasTotales)?"fondoAmarillo":
                  parseFloat(DineroDisponible) < parseFloat(TransferenciasTotales)?"":""
 
 
                 

       



        return ( 

         <div >

<div className="maincuentasVend" id="maincuentasVend" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Resultados

</div>



</div> 
<div className="Scrolled">
<div className="renderFilter" onClick={()=>{this.setState({filtrosTiempo:!this.state.filtrosTiempo})}}> {flechaval} Filtro Tiempos</div>
<div className="Topdata">
<Animate show={!this.state.filtrosTiempo}>
<CircularProgress/>
</Animate>
<Animate show={this.state.filtrosTiempo}>
<OrganizadorTiempo 
  Regs={this.props.state.RegContableReducer.Regs}
  sendDataTime={this.getDatatime}
  ProcessRegs={(regs)=>{
   

    this.setState({ProcessRegs:regs})}}
  Timesend={(data)=>{
  
let newstate = data["filter"]

if(newstate == "diario"){
    this.setState({tiempo:data.tiempo, [newstate]:true  })
    }
    else{
      this.setState({tiempo:data.tiempo, diario:false  })
    }
    }}         
/>
</Animate>
<div className="ContDineroManjear">
<div className={`ContData ${fondoCondo} `}>
<div className="grupodatosResumen">
  <div className="cDc1resumen">
  <i className="material-icons"style={{fontSize:"30px"}}>
            shopping_basket
            </i>
  <p style={{fontWeight:"bolder"}}>  Balance : </p>

  </div>
  <div className={`cDc2 `}>
 ${parseFloat(balanceTotal).toFixed(2)}

  </div>

  </div>
  <div className="contExtradata">
  <div className="grupodatosResumen2" 
  onClick={()=>{
    let CuentaSelect = { NombreC:"Ingresos",_id :""}
    this.setState({CuentaSelect, 
      ShowDetalles:"AllIng",
      DetallesCuenta:true, 
      Cuentas:false,
       genTrans:false 
    
    })
  
  }}>
  <div className="cDc1resumen">
  <i className="material-icons"style={{fontSize:"30px", color:"green"}}>
  arrow_upward
            </i>
  <p style={{fontWeight:"bolder"}}>  Ingresos: </p>

  </div>
  <div className={`cDc2 `}>
  ${parseFloat(ingresoTotal).toFixed(2)}

  </div>

  </div>
  <div className="grupodatosResumen2"  onClick={()=>{
    let CuentaSelect = { NombreC:"Gastos",_id :""}
    this.setState({CuentaSelect, 
      ShowDetalles:"AllGas",
      DetallesCuenta:true, 
      Cuentas:false,
       genTrans:false 
    
    })
  
  }}>
  <div className="cDc1resumen">
  <i className="material-icons"style={{fontSize:"30px", color:"red"}}>
  arrow_downward
            </i>
  <p style={{fontWeight:"bolder"}}>  Gastos: </p>

  </div>
  <div className={`cDc2 `}>
  ${parseFloat(gastoTotal).toFixed(2)}

  </div>

  </div>
  </div>
  <div className="contExtradata">
  <div className="grupodatosResumen2"  onClick={()=>{
    let CuentaSelect = { NombreC:"Dinero Disponible",_id :""}
    this.setState({CuentaSelect, 
      ShowDetalles:"DetallesAvailable",
      DetallesCuenta:true, 
      Cuentas:false,
       genTrans:false 
    
    })
  
  }}>
  <div className="cDc1resumen">
  <i className="material-icons"style={{fontSize:"30px", color:"goldenrod"}}>
            event_available
            </i>
  <p style={{fontWeight:"bolder"}}>  Dinero Disponible: </p>

  </div>
  <div className={`cDc2 `}>
  ${parseFloat(DineroDisponible).toFixed(2)}

  </div>

  </div>
  <div className="grupodatosResumen2"
  onClick={()=>{
    let CuentaSelect = { NombreC:"Total Trans",_id :""}
    this.setState({CuentaSelect, 
      ShowDetalles:"AllTrans",
      DetallesCuenta:true, 
      Cuentas:false,
       genTrans:false 
    
    })
  
  }}
  
  >
  <div className="cDc1resumen">
  <i className="material-icons"style={{fontSize:"30px", color:"blue"}}>
  import_export
            </i>
  <p style={{fontWeight:"bolder"}}>  Total Trans: </p>

  </div>
  <div className={`cDc2 `}>
  ${parseFloat(TransferenciasTotales).toFixed(2)}

  </div>

  </div>
  </div>
</div>
  
  </div>
  </div> 
  <Animate show={this.state.Cuentas}>

<div className="contTipos">
{tiposrender}
</div>
</Animate>
<Animate show={this.state.DetallesCuenta}>
   <div className="headercroom">
  <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                  onClick={()=>{this.setState({DetallesCuenta:false,
                     Cuentas:true, 
                     CuentaSelec:{NombreC:""},
                     ShowDetalles:""})
                  
                }  }
                  />
  <div className="tituloArt">Detalles de  {this.state.CuentaSelect.NombreC}</div>
  </div>
<div className="contRegistrosDetallado">
                  {detallesrender}
                  </div>
</Animate>
<Animate show={this.state.genTrans}>
<div className="contTrans">
<div className="grupodatosCuentasvend">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>  De:  </p>

  </div>
  <div id ="cDc2CuentasTrans"className={`cDc2  `} >
 {this.state.CuentaSelect.NombreC}

  </div>
  </div>
  <div className="grupodatosCuentasvend">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>  A:  </p>

  </div>
  <div id ="cDc2CuentasTrans"className={`cDc2  `} >
  <select name="CuentaDestino" className={`customCantidad  `}  value={this.state.CuentaDestino}onChange={this.handleChangeCuentas} >


<option value=""> </option>
{cuentasData}



</select>

  </div>
  </div>
 
  <div className="grupodatosCuentasvend">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>  Cantidad Transferir:  </p>

  </div>
  <div id ="cDc2CuentasTrans"className={`cDc2  `} >
 
$  <input type="number" name="CantidadAtrans" className='inputtrans' value={this.state.CantidadAtrans} onChange={this.handleChangeGeneral }/>
  </div>
  </div>

  <div className="grupodatosCuentasvend">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>  Restante:  </p>

  </div>
  <div id ="cDc2CuentasTrans"className={`cDc2  `} >
 
  ${Restante}
  </div>
  </div>

  <div className="contBotonesDuales">
<button className="botonesDuales btn-danger" onClick={ ()=>{this.setState({genTrans:false,Cuentas:true,DetallesCuenta:false})}}>
Cancelar
</button>
<button className="botonesDuales btn-success" onClick={ (e)=>{
e.stopPropagation(); 

if(this.state.loading == false){
this.setState({loading:true})

this.sendTrans(Restante)
}


}}>
Aceptar 
</button>
</div>

</div>
</Animate>
</div>
</div>

        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
           <style jsx >{`

           /* ContVendedores*/
           .headercroom{
            display:flex;
          }
           .ContDineroManjear{
            display:flex;
            justify-content: center;
            width: 100%;
            max-width: 600px;
          }
          .contRegistrosDetallado{                    
            padding-bottom: 150px;
            width: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
            flex-flow: column;
            background: whitesmoke;
           }
          .grupodatosResumen2{
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 155px;
            max-width: 300px;
            width: 50%;
            border-bottom: 2px outset;
            border-radius: 9px;
            margin: 0px 5px;
            padding: 6px 8px;
            border: 1px solid black;
            box-shadow: 0px 3px 2px black;
            cursor:pointer;
            background: #f8f8ff9e;
        }
            
            }
            .ContData{
             
              display: flex;
              flex-flow: column;
              width: 100%;
              margin: 5px;
            
              box-shadow: 0px 1px 3px black;
              border-radius: 12px;
              padding: 10px;
              
              }
              .ContDataSucess{
             
                display: flex;
                flex-flow: column;
                width: 100%;
                margin: 5px;
                box-shadow: -2px 3px 5px #3a7403;
                border-radius: 5px;
                padding: 10px;
                background: #daefcf2e;
                }
            .grupodatosResumen{
              display: flex;
              justify-content: center;
              align-items: center;
              
              min-width: 200px;
              width: 100%;
              border-bottom: 2px outset ;
              border-radius: 9px;
              }
              
            .cDc1resumen{

           
              display: flex;
              align-items: center;
              max-width: 60%;
              flex-wrap: wrap;
              min-width: 84px;
              }
              
              .cDc1resumen i{
                margin-right: 5px;
              }
              .cDc1resumen p{
                max-width: 100px;
              }
              .contExtradata{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10px;
                }
                .fondoAmarillo{
                  background: #feffb185;
              }
              .fondoVerde{
                background: #c8f1c885;
              }
               
          /* ---- */
          .contTrans{
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            width: 90%;
    margin-left: 5%;
            }
          .grupodatosCuentasvend{
            display: flex;
            justify-content: space-around;
            margin-top: 22px;
            min-width: 320px;
            width: 100%;
            border-bottom: 2px outset #0000ff99;
            border-radius: 9px;
            
            }
           .maincuentasVend{
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
              
              width: 98%;
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
                .OrganizadorTiempo{
                  display:flex;
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
                    .contBotonesDuales{ display: flex;
                      justify-content: space-around;
                      width: 80%;
                      margin: 20px;}
                    .Topdata{
                      display: flex;
                      justify-content: space-around;
                     padding: 5px;
                     flex-wrap:wrap

                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 90vh;
                      padding: 5px;
                     
                     }



                     p{
                      margin-bottom:0px
                     }
                     .cDc1{
                      width: 40%;
                      max-width: 200px;
                     }
                     .cDc2 {
                      margin-left: 10px;
                      width: 50%;
                      max-width: 300px;
                     }
                     .inputtrans{
                      width: 100%;
                      border-radius: 17px;
                      padding: 5px;
                      text-align: center;
                      max-width:100px;
                    }
                    
                      .renderFilter{
                        border-bottom: 1px solid blue;
                        width: 50%;
                        max-width: 250px;
                        border-radius: 0px 0px 16px;
                      }

                     

                     @media only screen and (min-width: 700px) { 
                      .Topdata{
                        flex-wrap:nowrap
                      }
                     }
                  
           `}</style>
        

          
           </div>
        )
    }
}

const mapStateToProps = state=>  {
  let regC =   state.RegContableReducer
  return {
    regC,
    state,
  }
};

export default connect(mapStateToProps, null)(Contacto);