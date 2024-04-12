import React, { Component } from 'react'
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Animate } from "react-animate-mount";
import OrganizarTiempo from '../cuentascompo/newHooks/OrganizadorTiempov2';
import {getDistribuidor,getAllcuentas,getCompras,getVentas, getCounter,getArts,getcuentas,addRegs, addFirstRegs } from "../../reduxstore/actions/regcont";
class Contacto extends Component {
   
state={
  resultadosEncontrados:0,
  arrReport:[],
  loading:true,
  compras:true,
  ventas:true,
  regs:true,
  
}
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainReportInv').classList.add("entradaaddc")

       }, 500);


       if(!this.props.state.RegContableReducer.Regs){
        this.setState({regs:false})
        console.log("llamando Regs")
       
        this.getRegs()
      }else if(this.props.state.RegContableReducer.Regs){
        if(this.props.state.RegContableReducer.Regs.length < 50){
          this.setState({regs:false})
          this.getRegs()
        }
      }

      if(!this.props.state.RegContableReducer.Compras){
        this.setState({compras:false})
        console.log("llamando Compras")
       
        this.getComprasdata()
      }else if(this.props.state.RegContableReducer.Compras){
        if(this.props.state.RegContableReducer.Compras.length < 50){
          this.setState({compras:false})
          this.getComprasdata()
        }
      }
      
      if(!this.props.state.RegContableReducer.Ventas){
        console.log("llamando ventas")
        this.setState({ventas:false})
            this.getVendData()
      }else if(this.props.state.RegContableReducer.Ventas){
        if(this.props.state.RegContableReducer.Ventas.length < 50){
          this.setState({ventas:false})
          this.getVendData()
        }
      }

  
      
      }
      jsonToCsv=(items)=> {
        const header = ["DocId","Documento","Tiempo","MongoID","Eqid","Titulo","CantidadCompra","Precio_Compra","Precio_Venta"];
        const tring = header.join(',');
        // handle null or undefined values here
        const replacer = (key, value) => value ?? '';
        const rowItems = items.map((row) =>
          header
            .map((fieldName) => {
              if(fieldName == 'Precio_Compra'){
                return parseFloat(row[fieldName])
              }
              else if(fieldName == 'Titulo'){
                var regex = new RegExp("\"", "g");
                let sinbackslash = row[fieldName].replace(/\\/g, "/").replace(regex, "'");
              
                return JSON.stringify(sinbackslash, replacer)
              }
              
              
              else{
                
              
                return JSON.stringify(row[fieldName], replacer)
              }
  
  
  
            })
            .join(',')
        );
        // join header and body, and break into separate lines
        const csv = [tring, ...rowItems].join('\r\n');
        return csv;
      }
      getRegs=()=>{
        console.log("ejecutando GetRegs")
        let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
          Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
let lol = JSON.stringify(datos)

fetch("/cuentas/getregs", {
method: 'POST', // or 'PUT'
body: lol, // data can be `string` or {object}!
headers:{
  'Content-Type': 'application/json',
  "x-access-token": this.props.state.userReducer.update.usuario.token
}
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
console.log(response,"maindata")
if(response.status == 'error'){
alert("error al actualizar registros")
      }
else{
 
  this.props.dispatch(addFirstRegs(response.regsHabiles));
 this.setState({regs:true})
}   
    })
  }
  getComprasdata=()=>{
    console.log("en Compras")
    let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
      Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
  let lol = JSON.stringify(datos)
    let settings = {
      method: 'POST', // or 'PUT'
      body: lol, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": this.props.state.userReducer.update.usuario.token
      }
    }
  
    fetch("/cuentas/getallcompras", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
    console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      this.props.dispatch(getCompras(response.comprasHabiles));       
      this.setState({compras:true})
  
    }
  
    })
  }
  getVendData=()=>{
     
    let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
      Tipo: this.props.state.userReducer.update.usuario.user.Tipo}}
  let lol = JSON.stringify(datos)
    let settings = {
      method: 'POST', // or 'PUT'
      body: lol, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": this.props.state.userReducer.update.usuario.token
      }
    }
  
    fetch("/cuentas/getventas", settings).then(res => res.json())
    .catch(error => {console.error('Error:', error);
           })
    .then(response => {  
    console.log(response)
      if(response.status == 'error'){}
    else if(response.status == 'Ok'){
      this.props.dispatch(getVentas(response.ventasHabiles));       
      this.setState({ventas:true})
    
    }
  
    })
  }
      Onsalida=()=>{
        document.getElementById('mainReportInv').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
      orderDataTime=(data)=>{
        console.log(data)
        if(data){
      
        let compras = data.filter(x=> x.ArtComprados)
        let ventas = data.filter(x=> x.articulosVendidos)
        let registrosGasto =data.filter(x=> x.Descripcion2)
        let arrReport = []
        for (let i = 0; i<compras.length;i++){
          
          
          for (let x = 0; x< compras[i].ArtComprados.length;x++){

            let tiempo = new Date(compras[i].Tiempo)    
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()

            arrReport.push({
              Documento:"Compra",
              DocId:compras[i].CompraNumero,
              MongoID:compras[i].ArtComprados[x]._id,
              Eqid:compras[i].ArtComprados[x].Eqid,
              Titulo:compras[i].ArtComprados[x].Titulo,
              Precio_Compra:compras[i].ArtComprados[x].Precio_Compra,
              CantidadCompra:compras[i].ArtComprados[x].CantidadCompra,
              Precio_Venta:compras[i].ArtComprados[x].Precio_Venta||0 ,
              Tiempo:date
            })

          }

        }

        for (let i = 0; i<ventas.length;i++){
     
          for (let x = 0; x< ventas[i].articulosVendidos.length;x++){
            let tiempo = new Date(ventas[i].Tiempo)    
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
            arrReport.push({
              Documento:"Venta",
              DocId:ventas[i].iDVenta,
              MongoID:ventas[i].articulosVendidos[x]._id,
              Eqid:ventas[i].articulosVendidos[x].Eqid,
              Titulo:ventas[i].articulosVendidos[x].Titulo,
              Precio_Compra:ventas[i].articulosVendidos[x].Precio_Compra,
              CantidadCompra:ventas[i].articulosVendidos[x].CantidadCompra,
              Precio_Venta:ventas[i].articulosVendidos[x].PrecioVendido||0 ,
              Tiempo:date
            })
             
            
          

          }

        }
       console.log(registrosGasto)
        for (let i = 0; i<registrosGasto.length;i++){     
          
          for (let x = 0; x< registrosGasto[i].Descripcion2.articulosVendidos.length;x++){
        
            let tiempo = new Date(registrosGasto[i].Tiempo)    
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()

            arrReport.push({
              Documento:"Reg Salida",
              DocId:registrosGasto[i].IdRegistro,
              Eqid:registrosGasto[i].Descripcion2.articulosVendidos[x].Eqid,
              MongoID:registrosGasto[i].Descripcion2.articulosVendidos[x]._id,
              Titulo:registrosGasto[i].Descripcion2.articulosVendidos[x].Titulo,
              Precio_Compra:registrosGasto[i].Descripcion2.articulosVendidos[x].Precio_Compra,
              CantidadCompra:registrosGasto[i].Descripcion2.articulosVendidos[x].CantidadCompra,
              Precio_Venta:registrosGasto[i].Descripcion2.articulosVendidos[x].Precio_Venta,
              Tiempo:date
            })
        

        }
      
      }
      console.log(arrReport)
      this.setState({resultadosEncontrados:arrReport.length, arrReport})
}
      }
      donwloaddata=()=>{
     
        let data= this.state.arrReport
       
        let csv = this.jsonToCsv(data)
  
        let link = document.createElement('a');
        const url = window.URL.createObjectURL(
            new Blob([csv]),
          );
        link.href = url;
        link.setAttribute(
          'download',
          `ReporteInv.csv`,
        );
           
        link.click();
  
       }
    render () {
console.log(this.state)
let downloadData = this.state.compras && this.state.ventas && this.state.regs?true:false

   let dataRegs = []

   if(this.props.state.RegContableReducer.Regs && this.props.state.RegContableReducer.Ventas && this.props.state.RegContableReducer.Compras){
    console.log("ejecutandoRegs")
    let NuevasVentas = []
  
    this.props.state.RegContableReducer.Ventas.forEach(element => {
        NuevasVentas.push({...element, Tiempo:element.tiempo})
    }); 

    let registrosGasto = this.props.state.RegContableReducer.Regs.filter(x=>x.Accion =="Gasto"  && x.CatSelect.nombreCat =="Salida Inventario")

dataRegs = registrosGasto.concat(NuevasVentas).concat(this.props.state.RegContableReducer.Compras)


   }
        return ( 

         <div >

<div className="maincontacto" id="mainReportInv" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Reporte Movimientos Inventario 

</div>



</div> 
<div className="Scrolled">

<OrganizarTiempo  Regs={dataRegs} sendDataTime={this.orderDataTime}/>
<Animate show={!downloadData}>
  <CircularProgress />
</Animate>
<Animate show={downloadData}>
<p className='subtituloArt'>Se han encontrado {this.state.resultadosEncontrados} resultados</p>
<div className='centrar'>
<button style={{width:"50px",color:"white", borderRadius:"36px",  background:"black", paddingTop:"5px"}} onClick={this.donwloaddata} >       <span className="material-icons">
               download
</span></button>
</div>
</Animate>

</div>
</div>
        </div>
        <style jsx >{`
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
                     
                      height: 50vh;
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