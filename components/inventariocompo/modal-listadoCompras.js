import React, { Component } from 'react'
import moment from "moment";
import "moment/locale/es";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {connect} from 'react-redux';
import {Animate} from "react-animate-mount"
import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getCompras} from "../../reduxstore/actions/regcont"
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import CompraR from "./compraRender"
import ComprasRenderList from "./compraRenderListView"
import ModalDeleteCompra from './modal-delete-compra';
import Estadisticas from './modal-estadisticasArticulos';
import DropdownButtonCompras from './usefull/dropdownbuttonCompras';


class Contacto extends Component {
  state={
    vista:"listmode",
    diario:true,
    Alert:{Estado:false},
    mensual:false,
    periodo:false,
    chartModal:false,
    listmode:true,
    pickmode:false,
    Compras:[],
    tiempo: new Date(),
    tiempomensual: new Date(),
    tiempoperiodoini: new Date(),
    tiempoperiodofin: this.periodofin(),
    deleteCompra:false,
    filterid:1,
    vtotalfilter:1,
    vendedorFilter:1,
    ProveFilter:1,
    loadingData:false,
   }
   periodofin(){
   
    let nuevo = new Date()
    let asd  = nuevo.getDate() + 1
    let add = nuevo.setDate(asd)
   
   
    let fechareturn = new Date(add)
    return(fechareturn)

}
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainListCompras').classList.add("entradaaddc")

       }, 500);
        
   
       if(!this.props.state.RegContableReducer.Compras){
        console.log("llamando compras")
            this.getComprasdata()
      }
    
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
      
        fetch("/cuentas/getcompras", settings).then(res => res.json())
        .catch(error => {console.error('Error:', error);
               })
        .then(response => {  
        console.log(response)
          if(response.status == 'error'){}
        else if(response.status == 'Ok'){
          this.props.dispatch(getCompras(response.comprasHabiles));       
     
          console.log("finalCompras")
        }
      
        })
      }
      getAllComprasdata=()=>{
        this.setState({loadingData:true})
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
          this.setState({loadingData:false})
          console.log("finalCompras")
        }
      
        })
      }
      buttonsp=(e)=>{
  
        let namex = e.target.id
            this.setState({
            diario:false,
mensual:false,
periodo:false
          })
          setTimeout(()=>{this.setState({
            [namex]:true
          })},10)
            

            }
      getDayName = ()=> {
        var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
        
        return days[this.state.tiempo.getDay()];
        
        }
        menosundia=()=>{
          let asd  = this.state.tiempo.getDate() - 1
          let add = this.state.tiempo.setDate(asd)
        
          let nuevafecha = new Date(add)
          this.setState({tiempo:nuevafecha})
         
        
          }
          masundia=()=>{
              let asd  = this.state.tiempo.getDate() + 1
              let add = this.state.tiempo.setDate(asd)
        
              let nuevafecha = new Date(add)
              this.setState({tiempo:nuevafecha})
                          
        
          }
      
  
        

        
      
 
    ProveFilter=()=>{
      let nuevoval = this.state.ProveFilter + 1
      if(nuevoval ==2){
           console.log("ascendente nombre")
           function SortArray(x, y){
            if (x.Factdata.nombreComercial< y.Factdata.nombreComercial) {return -1;}
            if (x.Factdata.nombreComercial > y.Factdata.nombreComercial) {return 1;}
            return 0;
              
           }
           let regs = this.props.state.RegContableReducer.Compras
           let order = regs.sort(SortArray)
             this.setState({ProveFilter:nuevoval})
          }else if(nuevoval ==3){
            console.log("decendente nombre")
            function SortArraydec(x, y){
              if (y.Factdata.nombreComercial < x.Factdata.nombreComercial ) {return -1;}
              if (y.Factdata.nombreComercial > x.Factdata.nombreComercial ) {return 1;}
                return 0;
            }
            let regs = this.props.state.RegContableReducer.Compras
            let order = regs.sort(SortArraydec)
        
            this.setState({ProveFilter:nuevoval})
           }else if(nuevoval ==4){
            console.log("ascendente nombre")
            function SortArray(x, y){
             if (x.Factdata.nombreComercial < y.Factdata.nombreComercial) {return -1;}
             if (x.Factdata.nombreComercial > y.Factdata.nombreComercial) {return 1;}
             return 0;
               
            }
            let regs = this.props.state.RegContableReducer.Compras
            let order = regs.sort(SortArray)
            this.setState({ProveFilter:2})
           }
    }
    getMonthName = ()=> {
      var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
      return monthNames[this.state.tiempo.getMonth()];
  }
    vendedorFilter=()=>{
      let nuevoval = this.state.vendedorFilter + 1
      if(nuevoval ==2){
           console.log("ascendente nombre")
           function SortArray(x, y){
            if (x.Vendedor.Nombre < y.Vendedor.Nombre) {return -1;}
            if (x.Vendedor.Nombre > y.Vendedor.Nombre) {return 1;}
            return 0;
              
           }
           let regs = this.props.state.RegContableReducer.Compras
           let order = regs.sort(SortArray)
             this.setState({vendedorFilter:nuevoval})
          }else if(nuevoval ==3){
            console.log("decendente nombre")
            function SortArraydec(x, y){
              if (y.Vendedor.Nombre < x.Vendedor.Nombre  ) {return -1;}
              if (y.Vendedor.Nombre > x.Vendedor.Nombre  ) {return 1;}
                return 0;
            }
            let regs = this.props.state.RegContableReducer.Compras
            let order = regs.sort(SortArraydec)
        
            this.setState({vendedorFilter:nuevoval})
           }else if(nuevoval ==4){
            console.log("ascendente nombre")
            function SortArray(x, y){
             if (x.Vendedor.Nombre < y.Vendedor.Nombre) {return -1;}
             if (x.Vendedor.Nombre > y.Vendedor.Nombre) {return 1;}
             return 0;
               
            }
            let regs = this.props.state.RegContableReducer.Compras
            let order = regs.sort(SortArray)
            this.setState({vendedorFilter:2})
           }
    }
   
    vtotalfilter=()=>{
      let nuevoval = this.state.vtotalfilter + 1

      if(nuevoval ==2){
        console.log("ascendente")
        let regs = this.props.state.RegContableReducer.Compras
        let order = regs.sort((a, b) =>a.ValorTotal  - b.ValorTotal)
      
        this.setState({vtotalfilter:nuevoval})
       }else if(nuevoval ==3){
        let regs = this.props.state.RegContableReducer.Compras
        let order = regs.sort((a, b) =>b.ValorTotal - a.ValorTotal )
        
        this.setState({vtotalfilter:nuevoval})
       }else   if(nuevoval ==4){
        console.log("ascendente")
        let regs = this.props.state.RegContableReducer.Compras
        let order = regs.sort((a, b) =>a.ValorTotal  - b.ValorTotal)
      
        this.setState({vtotalfilter:2})
       }
    }

    filteridfunc=()=>{
      let nuevoval = this.state.filterid + 1

      if(nuevoval ==2){
        console.log("ascendente")
        let regs = this.props.state.RegContableReducer.Compras
        let order = regs.sort((a, b) =>a.CompraNumero  - b.CompraNumero)
      
        this.setState({filterid:nuevoval})
       }else if(nuevoval ==3){
        let regs = this.props.state.RegContableReducer.Compras
        let order = regs.sort((a, b) =>b.CompraNumero - a.CompraNumero )
        
        this.setState({filterid:nuevoval})
       }else   if(nuevoval ==4){
        console.log("ascendente")
        let regs = this.props.state.RegContableReducer.Compras
        let order = regs.sort((a, b) =>a.CompraNumero  - b.CompraNumero)
      
        this.setState({filterid:2})
       }

    }

      Onsalida=()=>{
        document.getElementById('mainListCompras').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      DiaryFilter=(regs)=>{
    
        let fecha = new Date(this.state.tiempo)
                let fechaini = fecha.setHours(0, 0, 0)
                let fechafin = fecha.setHours(23, 59, 59)
            
                  let misregs = regs.filter(regs=> regs.Tiempo >= fechaini && regs.Tiempo <= fechafin  )
        
                  return misregs
              
      }
      MensualFilter=(regs)=>{
       
        let fecha = new Date(this.state.tiempo)
                  var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getTime()
                  var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
                  var ultimahora = new Date(ultimoDia.setHours(23, 59, 59)).getTime()
                  if(regs.length >0){
                    let misregfiltrados = regs.filter(regs=> regs.Tiempo >= primerDia && regs.Tiempo <= ultimahora  )
                  return misregfiltrados
                  }else{
                    return regs
                  }
      
      }
      PeriodoFilter=(regs)=>{
        console.log(regs)
        let fecha = new Date(this.state.tiempo)
        let fechafin = new Date(this.state.tiempoperiodofin)
    
        var primerDiaP = fecha.setHours(0,0,0)
        var ultimoDiaP = fechafin.setHours(23,59,59)
      
        let fechainix = new Date(primerDiaP).getTime()
        let fechafinx = new Date(ultimoDiaP).getTime()
        if(regs.length >0){
          let misregsP = regs.filter(regs=> regs.Tiempo >= fechainix && regs.Tiempo <= fechafinx) 
          return misregsP
        }else{
          return regs
        }
      
      }
      FilterSistem=(regs)=>{
        if(this.state.diario){
          console.log("en diario")
        let FiltradoPordia = this.DiaryFilter(regs)

        return FiltradoPordia
      }
      else if(this.state.mensual){
     
        let FiltradoPormes = this.MensualFilter(regs)
        return FiltradoPormes
      }
      else if(this.state.periodo){
        
        let FiltradoPorPeriodo = this.PeriodoFilter(regs)
        return FiltradoPorPeriodo
      }
      }
      handleChangeTiempo=(e)=>{

        this.setState({
          tiempo:e._d
        })
       
       
         }
         masunmes=()=>{
          let mesactual = this.state.tiempo.getMonth() + 1
          let nuevomes = this.state.tiempo.setMonth(mesactual)
          let newdate = new Date(nuevomes)

          this.setState({tiempo:newdate})
        
        
        }
        menosunmes=()=>{
          let mesactual = this.state.tiempo.getMonth() - 1
          let nuevomes = this.state.tiempo.setMonth(mesactual)
          let newdate = new Date(nuevomes)
          this.setState({tiempo:newdate})
        
        }
        handleChangeTiempoini=(e)=>{
          if(e){ 
          this.setState({
            tiempoperiodoini:e._d
          })
         }
        }
        handleChangeTiempoPeriodofin=(e)=>{
          if(e){ 
          this.setState({
            tiempoperiodofin:e._d
          })
         }
        }
    render () {
     
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }


      let diarioval = this.state.diario?"activeval":"";
      let mensualval = this.state.mensual?"activeval":"";
      let periodoval = this.state.periodo?"activeval":"";
      let listActive = this.state.vista=="listmode"?"listActive":""
let imageActive = this.state.vista=="pickmode"?"listActive":""
      let listComp =""
      let listviewcomp =  <CircularProgress />
   let sendData = []
let filtrados=[]
    
      if(this.props.state.RegContableReducer.Compras){
         filtrados = this.FilterSistem(this.props.state.RegContableReducer.Compras)
      
        if(filtrados){
          sendData = filtrados
          listComp =filtrados.map((comp, i)=>{
      
            return(<CompraR key={comp._id} datos={comp}/>)
          })
         
          listviewcomp=filtrados.map((comp, i)=>{
          
            return(<ComprasRenderList user={this.props.state.userReducer.update.usuario.user.Tipo} onDelete={(e)=>{this.setState({deleteCompra:true, deletedata:e})}} key={comp._id} datos={comp}/>)
          })
        }
      
    }
        return ( 

         <div >

<div className="maincontacto" id="mainListCompras" >
            <div className="contcontactoCompras"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
          
        <div>
          <DropdownButtonCompras arrData={filtrados} 
          img={this.props.state.userReducer.update.usuario.user.Factura.logoEmp}
          state={{
            diario:this.state.diario,
            mensual:this.state.mensual,
            periodo:this.state.periodo,
            tiempo:this.state.tiempo,
            tiempoperiodofin:this.state.tiempoperiodofin,
              estab:this.props.state.userReducer.update.usuario.user.Factura.codigoEstab ,
          ptoEmi:this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision ,
          nombreComercial:this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
           }}
          />
      </div>
      <div className="tituloventa">
                
                <p> Listado Compras</p>
          
            </div>
        </div>

        <div className="filtros">
        <div className="cont-Prin">

<div  id="diario" className={`botongeneral jwPointer ${diarioval}  `}onClick={ this.buttonsp}>Diario</div>
<div id="mensual" className={`botongeneral jwPointer ${mensualval} `}onClick={ this.buttonsp}>Mensual</div>
<div id="periodo" className={`botongeneral jwPointer ${periodoval} `}onClick={ this.buttonsp}> Periodo</div>


</div>
        <Animate show={this.state.mensual}>
<div className="contfiltromensual jwContFlexCenter">
<div className="subtituloArt contNameButtons">
                       {this.getMonthName()}
                       <div className="Contdonwloadbutton">
            <Animate show={!this.state.loadingData}>
            <button className="downloadbutton"onClick={this.getAllComprasdata} >       <span className="material-icons">
              find_replace
</span></button>
</Animate>
<Animate show={this.state.loadingData}>
<CircularProgress />
</Animate>
</div>
<button className="downloadbutton"onClick={()=>{this.setState({chartModal:true})}} >       <span className="material-icons">
               pie_chart
</span></button>
                     </div>
                   <div className="contmensual " >
    <div className="flechalateral" onClick={this.menosunmes}> {'<'}</div>
    <div className="fechacentral">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="DD/MM/YYYY"
          margin="normal"
          views={["month"]}
          id="date-picker-inline"
          label="Selecciona la fecha"
          value={this.state.tiempo}
          onChange={this.handleChangeTiempo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>
               </div>
               <div className="flechalateral" onClick={this.masunmes}> {'>'}</div>
               </div>
                     
                   </div>

                   </Animate>   
                   <Animate show={this.state.diario}>
                <div className="contfiltromensual jwContFlexCenter">
                <div className="subtituloArt contNameButtons">
                       {this.getDayName()}
                       <div className="Contdonwloadbutton">
            <Animate show={!this.state.loadingData}>
            <button className="downloadbutton"onClick={this.getAllComprasdata} >       <span className="material-icons">
              find_replace
</span></button>
</Animate>
<Animate show={this.state.loadingData}>
<CircularProgress />
</Animate>
</div>
<button className="downloadbutton"onClick={()=>{this.setState({chartModal:true})}} >       <span className="material-icons">
               pie_chart
</span></button>
                     </div>
                   <div className="contmensual " >
    <div className="flechalateral" onClick={this.menosundia}> {'<'}</div>
    <div className="fechacentral">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="DD/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Selecciona la fecha"
          value={this.state.tiempo}
          onChange={this.handleChangeTiempo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>
               </div>
               <div className="flechalateral" onClick={this.masundia}> {'>'}</div>
               </div>
                     
                   </div>
          
            
                  </Animate>    
                  <Animate show={this.state.periodo}>
                 
                  <div className="contfiltromensual jwContFlexCenter">
                  <div className="subtituloArt contNameButtons">
                 
                       <div className="Contdonwloadbutton">
            <Animate show={!this.state.loadingData}>
            <button className="downloadbutton"onClick={this.getAllComprasdata} >       <span className="material-icons">
              find_replace
</span></button>
</Animate>
<Animate show={this.state.loadingData}>
<CircularProgress />
</Animate>
</div>
<button className="downloadbutton"onClick={()=>{this.setState({chartModal:true})}} >       <span className="material-icons">
               pie_chart
</span></button>
                     </div>
                       <div className="contmensual">
                       <div className="separador">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="DD/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Fecha de inicio "
          value={this.state.tiempo}
          onChange={this.handleChangeTiempo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>
               </div>
               <div className="separador">
               <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
           format="DD/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Fecha fin "
          value={this.state.tiempoperiodofin}
          onChange={this.handleChangeTiempoPeriodofin}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
            
          
               </MuiPickersUtilsProvider>

               </div>
               </div>
                     
                   </div>

                  </Animate>   
    </div>
    
    <div className="visualization">
                <button className={`btn btn-primary botonVisualite ${listActive} `} onClick={()=>{this.setState({pickmode:false, listmode:true,vista:"listmode"})}}>
                <span className="material-icons">
                list
</span>
    
  </button>

  <button className={`btn btn-primary botonVisualite ${imageActive} `} onClick={()=>{this.setState({pickmode:true, listmode:false,vista:"pickmode"})}}>
                <span className="material-icons">
               image
</span>
    
  </button>

</div>
<Animate show={this.state.pickmode}>
    <div className="listvent">
    {listComp}
      </div>
      </Animate>
      <Animate show={this.state.listmode}>
                      <div className="centrar">
                  <div className="contenedorArticulos">
                  <div className="contTitulosArt">
                        
                        <div className="eqIdart">
                        <div className="textPrint">  ID </div>
                        <div className="contFlechaFiltro">
                         
                            <Animate show={this.state.filterid == 1}>
              <i className="material-icons filtroini"  onClick={this.filteridfunc}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.filterid == 2}>
              <i className="material-icons"  onClick={this.filteridfunc}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.filterid == 3}>
              <i className="material-icons"  onClick={this.filteridfunc}>  arrow_drop_down</i>
              </Animate>
                           </div>
                        
                        </div>
                        <div className="tituloArtic">
                        <div className="textPrint">      Fecha</div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.filterid == 1}>
              <i className="material-icons filtroini"  onClick={this.filteridfunc}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.filterid == 2}>
              <i className="material-icons"  onClick={this.filteridfunc}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.filterid == 3}>
              <i className="material-icons"  onClick={this.filteridfunc}>  arrow_drop_down</i>
              </Animate></div>
                        </div>
                        <div className="detallesartic">
                          
                        <div className="setenta"> Eqid  </div>
                            <div className="doscien">   Detalles  </div>
                                          <div className="miscien"> Precio  </div>
                                          <div className="miscien"> Cant.  </div>
                        </div>
                        <div className="vendedorArticlc">
                        <div className="textPrint">     Usuario</div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.vendedorFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.vendedorFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.vendedorFilter == 2}>
              <i className="material-icons"  onClick={this.vendedorFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.vendedorFilter == 3}>
              <i className="material-icons"  onClick={this.vendedorFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic ">
                        <div className="textPrint">     Prove.</div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.ProveFilter == 1}>
              <i className="material-icons filtroini"  onClick={this.ProveFilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.ProveFilter == 2}>
              <i className="material-icons"  onClick={this.ProveFilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.ProveFilter == 3}>
              <i className="material-icons"  onClick={this.ProveFilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic ">
                        <div className="textPrint">    V.Total</div>
                        <div className="contFlechaFiltro">
                        <Animate show={this.state.vtotalfilter == 1}>
              <i className="material-icons filtroini"  onClick={this.vtotalfilter}>      panorama_fish_eye</i>
              </Animate>
              <Animate show={this.state.vtotalfilter == 2}>
              <i className="material-icons"  onClick={this.vtotalfilter}>  arrow_drop_up</i>
              </Animate>
              <Animate show={this.state.vtotalfilter == 3}>
              <i className="material-icons"  onClick={this.vtotalfilter}>  arrow_drop_down</i>
              </Animate>
              </div>
                        </div>
                        <div className="existenciaArtic centerti">
                            Acc
                        </div>
                    </div>
                      {listviewcomp} 
                          </div>
                          </div>
                  </Animate>
        </div>
        </div>
        <Animate show={this.state.deleteCompra}>
        <ModalDeleteCompra DeleteReg={this.state.deletedata} 
        
        
        errorExistencias={(data)=>{
    console.log(data)
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:`Existencias insuficientes, del articulo ${data.Titulo}, con el codigo ${data.Eqid}`
        }
          this.setState({deleteCompra:false, Alert: add })
        }}

        errorEliminado={(data)=>{
          console.log(data)
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:`El articulo ${data.Titulo}, con el codigo ${data.Eqid}, ha sido eliminado del inventario`
              }
                this.setState({deleteCompra:false, Alert: add })
              }}
        
        
        
        Flecharetro={()=>{this.setState({deleteCompra:false, deletedata:{}})}  }/>
        </Animate>

        <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
<Animate show={this.state.chartModal}>
<Estadisticas datos={sendData} tipo={"compras"} Flecharetro={()=>{this.setState({chartModal:false})}} />

</Animate>

           <style jsx>{`
           i{
             cursor:pointer
           }
              .contenedorArticulos{
                overflow: scroll;
                margin-top: 15px;
                background: #ffffff7a;
                padding: 15px;
                border-radius: 10px;
                max-width: 1000px;
                height: 50vh;
        }
        .detallesartic{
          
          width: 400px;
    display: flex;
    justify-content: space-around;
        }
                .centrar{
                  width: 100%;
                  display: flex;
                  justify-content: center;
              }
    .botonVisualite{
      padding: 6px;
      border-radius: 36px;
      display: flex;
      box-shadow: 0px 0px 0px 0px #1e214c;
      transition: 1s
    }
    .listActive{
      box-shadow: -1px -1px 2px 4px #1e214c;
  }
  .visualization{
      display: flex;
      width: 100%;
      
  justify-content: space-around;


  }
  
  .doscien{
    width: 200px;
  }
  .setenta{
    width: 70px;
  }
  .contTitulosArt{
    display:inline-flex;
 
    font-size: 20px;
    font-weight: bolder;
}
.eqIdart{
  width: 85px;  
  display: flex;
}
.tituloArtic{
  width: 250px;  
  display: flex;
}
.cont-Prin {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin-top:5px;
  margin-bottom:5px;
}
.botongeneral{
  border-radius: 10px;
  width: 30%;
  font-weight: bold;
  height: 30px;
  background: white;
  transition: 0.5s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  color: lightgrey;
 }
.precioArtic{
  width: 100px; 
  display: flex;
}
.existenciaArtic{
  width: 90px; 
  margin-right:10px;
  display: flex;
}
.vendedorArticlc{
  width: 125px; 
  display: flex;
}
             .listvent{
              overflow: scroll;
              overflow-x: hidden;
              height: 62vh;
              margin-top: 10px;
              display: flex;
              flex-flow: column;
              align-items: center;
             }
             .contPfinal{
              display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
             }
           .imgventa{
            margin-top: 30px;
    height: 100px;
    width: 100px;
   }
 
           .cDc2{
     margin-left:10px;
   }
   .downloadbutton{
    color: white;
    border-radius: 36px;
    background: #5253ff;
    /* padding-top: 5px; */
    height: 44px;
 
   }
   
  
   .centerti{
    text-align: center;
    justify-content: center;
   }
   .Contdonwloadbutton{
    display:flex;
    flex-flow:column
   }

   .contDatosC{
     display:flex;
     width: 100%;
   }
       .headercontact {

            display:flex;
            justify-content: space-around;

           }

            .botonventa{
            
              margin-top: 17px;
    border-radius: 10px;

    background-color: #048b0b;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
    color: #fff;
    transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4,0,0.2,1);
    height: 36px;
    line-height: 2.25rem;
    font-family: Roboto,sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    -webkit-letter-spacing: 0.06em;
    -moz-letter-spacing: 0.06em;
    -ms-letter-spacing: 0.06em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: none;
    width: 40%;
             }
               
        .maincontacto{
          z-index: 1299;
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
       .contcontactoCompras{
        border-radius: 9px;
        width: 98%;
        background-color: whitesmoke;
        padding: 5px 10px;
        height: 97vh;
        overflow: hidden;
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
     
       .flecharetro{
         height: 40px;
         width: 40px;
         padding: 5px;
       }
       .filtroini{
        font-size:15px;
        cursor:pointer;
    }
       body {
            height:100%

           }

           .contform{
            padding-bottom: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
           }

      

       
          .entradaaddc{
            left: 0%;
           }
           .minigen{
            text-align: center;
         } 
          .contsgens{
            display: flex;
          width: 100%;
          justify-content: space-around;
          }
          .dineroresum2{
            margin: 5px 0px;
            box-shadow: 0px 0px 2px #292323;
            padding: 10px;
            border-radius: 13px;
            background: #ecf5ff;
            width: 100%;
            max-width: 500px
          }  
          .contdinerosum2{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80%;
          }
         
          .contfiltromensual{
          display: flex;
         flex-wrap:wrap;
          } 
          .flechalateral{
            display: flex;
            align-items: center;
            box-shadow: inset 1px 2px 3px;
            width: 25px;
            height:25px;
            padding: 4px;
            text-align: center;
            justify-content: center;
            cursor:pointer;
            border-radius: 48%;
          }
          .fechacentral{
            width: 60%;
          }
          .contmensual{
            display: flex;
            justify-content: space-around;
          align-items: center;
          max-width: 500px;
          
          border: 6px outset;
          border-radius: 11px;
          margin: 10px 0px;
          }
          .activeval{
            height: 40px;
            color: black;
            box-shadow: -5px 1px 5px #5498e3;  
          
          }
          .contNameButtons{
            display:flex;
            justify-content: space-around;
            align-items: center;
            width: 80%;
            max-width: 300px;
          }
             .marginator{
    margin:0px 10px
    }
             @media only screen and (max-width: 320px) { 
               .subtituloArt{
                margin-top:2px;
                margin-bottom:2px;
               }
               .comunicacionart{
                 margin-bottom:2px;
               }
               .marginador{
                margin: 0px 2px 15px 2px;
               }
         .contcontactoCompras{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontactoCompras{
       
         width: 70%;
      
      
       }
          }
          @media only screen and (min-width: 950px) { 
           
              .imgventa{
            margin-top: 40px;
    height: 150px;
    width: 150px;
   }
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