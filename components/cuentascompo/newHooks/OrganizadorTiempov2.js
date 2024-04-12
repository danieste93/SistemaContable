import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import "moment/locale/es";
import moment from "moment";
import MomentUtils from '@date-io/moment';

class OrganizarTiempo extends Component {
state={
    diario:true,
    mensual:false,
    periodo:false,
    tiempo: new Date(),
        tiempomensual: new Date(),
        tiempoperiodoini: this.periodoini(),
        tiempoperiodofin: this.periodofin(),
}

componentDidMount(){

  
   let displayRegs = this.props.Regs
  
 this.filterTime(displayRegs)


}


filterTime =(regs)=>{
    let displayRegs = regs
    let  DetallesPorrender = []
    let  tiemposet = {tiempo:"",filter:""}
    if(this.state.diario){
        DetallesPorrender = this.DiaryFilter(displayRegs)
        tiemposet = {tiempo:this.state.tiempo,filter:"diario"}
      }else if(this.state.mensual){
        DetallesPorrender = this.MensualFilter(displayRegs)
        tiemposet = {tiempo:this.state.tiempomensual,filter:"mensual"}
      }
      else if(this.state.periodo){
        DetallesPorrender = this.PeriodoFilter(displayRegs)
        tiemposet = {tiempo:this.state.tiempoperiodoini,filter:"periodo"}
      }
console.log(DetallesPorrender)
  this.props.sendDataTime(DetallesPorrender)
    

    
}


periodofin(){
   
      

    let nuevo = new Date()
    let asd  = nuevo.getDate() + 30
    let add = nuevo.setDate(asd)
   
   
    let fechareturn = new Date(add)
    return(fechareturn)

}
periodoini(){ 

  let nuevo = new Date()
  let asd  = nuevo.getDate() - 60
  let add = nuevo.setDate(asd)
 
 
  let fechareturn = new Date(add)
  return(fechareturn)

}
getDayName = ()=> {
    var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
    
    return days[this.state.tiempo.getDay()];
    
    }

getMonthName = ()=> {
    var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
    return monthNames[this.state.tiempo.getMonth()];
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
      setTimeout(()=>{

        this.filterTime(this.props.Regs)
      },100)

        }
        

handleChangeTiempo=(e)=>{
    if(e){
  this.setState({
   tiempo:e._d
  })
  setTimeout(()=>{

    this.filterTime(this.props.Regs)
  },100)  
 }
}
    

handleChangeTiempoPeriodofin=(e)=>{
  if(e){ 
  this.setState({
    tiempoperiodofin:e._d
  })
  setTimeout(()=>{

    this.filterTime(this.props.Regs)
  },100)  
 }
}
handleChangeTiempoini=(e)=>{
  if(e){ 
  this.setState({
    tiempoperiodoini:e._d
  })
  setTimeout(()=>{

    this.filterTime(this.props.Regs)
  },100)  
 }
}

masunmes=()=>{
  let mesactual = this.state.tiempo.getMonth() + 1
  let nuevomes = this.state.tiempo.setMonth(mesactual)
  let newdate = new Date(nuevomes)

  this.setState({tiempo:newdate})
  setTimeout(()=>{

    this.filterTime(this.props.Regs)
  },100)     

}
menosunmes=()=>{
    let mesactual = this.state.tiempo.getMonth() - 1
    let nuevomes = this.state.tiempo.setMonth(mesactual)
    let newdate = new Date(nuevomes)

    this.setState({tiempo:newdate})
    setTimeout(()=>{

      this.filterTime(this.props.Regs)
    },100)     
  
  }

menosundia=()=>{
  let asd  = this.state.tiempo.getDate() - 1
  let add = this.state.tiempo.setDate(asd)

  let nuevafecha = new Date(add)
  this.setState({tiempo:nuevafecha})
 
  setTimeout(()=>{

    this.filterTime(this.props.Regs)

  },100)     

  }
  masundia=()=>{
      let asd  = this.state.tiempo.getDate() + 1
      let add = this.state.tiempo.setDate(asd)

      let nuevafecha = new Date(add)
      this.setState({tiempo:nuevafecha})
 
      setTimeout(()=>{
  
        this.filterTime(this.props.Regs)
      },100)      

  }

  DiaryFilter=(regs)=>{
      let fecha = new Date(this.state.tiempo)
              let fechaini = fecha.setHours(0, 0, 0)
              let fechafin = fecha.setHours(23, 59, 59)
             
              if(regs){
                let misregs = regs.filter(regs=> regs.Tiempo >= fechaini && regs.Tiempo <= fechafin  )
                return misregs
              }else{
                return regs
              }
    }
  MensualFilter=(regs)=>{

    let fecha = new Date(this.state.tiempo)
              var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getTime()
              var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
              var ultimahora = new Date(ultimoDia.setHours(23, 59, 59)).getTime()
              if(regs){
                let misregfiltrados = regs.filter(regs=> regs.Tiempo >= primerDia && regs.Tiempo <= ultimahora  )
              return misregfiltrados
              }else{
                return regs
              }
  
  }
  PeriodoFilter=(regs)=>{
    let fecha = new Date(this.state.tiempoperiodoini)
    let fechafin = new Date(this.state.tiempoperiodofin)

    var primerDiaP = fecha.setHours(0,0,0)
    var ultimoDiaP = fechafin.setHours(23,59,59)
  
    let fechainix = new Date(primerDiaP).getTime()
    let fechafinx = new Date(ultimoDiaP).getTime()
    if(regs){
      let misregsP = regs.filter(regs=> regs.Tiempo >= fechainix && regs.Tiempo <= fechafinx) 
      return misregsP
    }else{
      return regs
    }
  
  }
  OrderFilter=(regs)=>{
    let order = regs.sort((a, b) => b.Tiempo - a.Tiempo)

   return order
  } 
render(){
    let diarioval = this.state.diario?"activeval":"";
    let mensualval = this.state.mensual?"activeval":"";
    let periodoval = this.state.periodo?"activeval":"";

    if(this.state.diario){
   
      let DetallesPorrender = this.DiaryFilter(this.props.Regs)
   
    }

    return ( 
<div className="organizador">
<div className="cont-Bt2">

<div  id="diario" className={`botongeneral jwPointer ${diarioval}  `}onClick={ this.buttonsp}>Diario</div>
<div id="mensual" className={`botongeneral jwPointer ${mensualval} `}onClick={ this.buttonsp}>Mensual</div>
<div id="periodo" className={`botongeneral jwPointer ${periodoval} `}onClick={ this.buttonsp}> Periodo</div>


</div>
<div className="contfiltros">
<Animate show={this.state.mensual}>
<div className="contfiltromensual jwContFlexCenter">
                     <div className="subtituloArt">
                       {this.getMonthName()}
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
                <div className="subtituloArt">
                       {this.getDayName()}
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
                       <div className="contmensual">
                       <div className="separador">
<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <KeyboardDatePicker
          disableToolbar
          format="D/MM/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Fecha de inicio "
          value={this.state.tiempoperiodoini}
          onChange={this.handleChangeTiempoini}
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
<style jsx >{`
 
.organizador{
 
    border: 1px double #4695ec;
    border-radius: 18px;
    padding: 10px;
    box-shadow: inset 0px -2px 4px black;
    max-width: 530px;
    width: 95%;
    margin:  10px;
    display: flex;
    flex-flow: column;
    justify-content: center;
   }


   .cont-Bt2 {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    margin-top:5px;
    margin-bottom:10px;
}
.contfiltros{
    width: 90%;
    margin-left: 5%;
  }
  .contfiltromensual{
                 
    flex-flow: row;
flex-wrap: wrap;
justify-content: space-around;
  } 
  .botongeneral{
    border-radius: 10px;
    width: 25%;
    font-weight: bold;
    height: 20px;
    background: white;
    transition: 0.5s ease-out;
    display: flex;
    justify-content: center;
    align-items: center;
    color: lightgrey;
    min-width: 100px;
   }
  .contmensual{
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 500px;
    border: 3px outset;
    height: 57px;
    border-radius: 11px;
    margin: 3px 0px;
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
      .activeval{
        height: 25px;
        color: black;
        box-shadow: -5px 1px 5px #5498e3;  
                        
      }
`}</style>
</div>

     )}



}
export default OrganizarTiempo