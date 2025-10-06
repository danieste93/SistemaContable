import React, { Component } from 'react'
import postal from 'postal';
import {connect} from 'react-redux';



import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import moment from "moment";
import "moment/locale/es";
import MomentUtils from '@date-io/moment';
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";

import VentaR from "./inventariocompo/ventaRender"

 class accessPuntoVenta extends Component {
 
     state={
      Ventas:[],
      tiempo: new Date(),
     }
     channel1 = null;
    
     componentDidMount(){
        this.getVentas()

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
      DiaryFilter=(regs)=>{
    
        let fecha = new Date(this.state.tiempo)
                let fechaini = fecha.setHours(0, 0, 0)
                let fechafin = fecha.setHours(23, 59, 59)
              
                  let misregs = regs.filter(regs=> regs.tiempo >= fechaini && regs.tiempo <= fechafin  )

                  return misregs
              
      }
      handleChangeTiempo=(e)=>{
 
        if(e){
          this.setState({
           tiempo:e._d
          })
         }
             
        }
     getDayName = ()=> {
      var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
      
      return days[this.state.tiempo.getDay()];
      
      }

    FilterSistem=(regs)=>{
      let registros = regs
      let FiltradoPordia = this.DiaryFilter(registros)
   
      return FiltradoPordia
    }
    displayCreds=()=>{
      if(this.state.Ventas.length > 0){
      let filtrados = this.FilterSistem(this.state.Ventas)
  
      let misventasCred = filtrados.filter(regsing => regsing.TipoVenta == "Credito")
      let sumacred= 0
    
      if(misventasCred.length > 0){
        for (let i=0; i < misventasCred.length; i++ ){
          sumacred = sumacred + misventasCred[i].CreditoTotal
      }
    }
    

    return (sumacred)
    
    }
  }
  displayVentas=()=>{
    if(this.state.Ventas.length > 0){
    let filtrados = this.FilterSistem(this.state.Ventas)

    let misventasCred = filtrados.filter(regsing => regsing.TipoVenta == "Contado")
    let sumacred= 0
    console.log(misventasCred)
    if(misventasCred.length > 0){
      for (let i=0; i < misventasCred.length; i++ ){
        sumacred = sumacred + misventasCred[i].PrecioCompraTotal
    }
  }
  let misprimerasC = filtrados.filter(regsing => regsing.TipoVenta == "Credito" && regsing.FormasCredito.Cantidad > 0)
 console.log(misprimerasC)
 let sumares= 0
 if(misprimerasC.length > 0){
  for (let i=0; i < misprimerasC.length; i++ ){
    sumares= sumares + misprimerasC[i].FormasCredito.Cantidad
}
}
let sumatotal = sumacred+sumares
  return (sumatotal)
  
  }
}
render(){
  let listVent

if(this.state.Ventas.length > 0){
  let filtrados = this.FilterSistem(this.state.Ventas)
listVent =filtrados.map((vent, i)=>{

  return(<VentaR key={vent._id} datos={vent}/>)
})
}

    return(  <div style={{marginTop:"10vh"}} > 
 
    
  <div className={`contCompras `}>
    <div className="filtros">
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
    </div>
    <div className="contdinerosum2 ">
                <div className="dineroresum2 ">
                   <p className="subtituloArt " >{}</p>
                   <div className="contsgens">
                       <div className="minigen">
                           <div style={{color:"green"}}>Ventas</div>
                           <div>${this.displayVentas()}</div>
                       </div>
                       <div className="minigen">
                           <div style={{color:"blue"}}>Créditos</div>
                           <div>${this.displayCreds()}</div>
                       </div>
                     
                       </div>
                   </div>
                   </div>
    <div className="listvent">
      
    </div>
{listVent}
  </div>

     <style jsx>
                {                              
                ` .minigen{
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
                .contCompras{
                  display: flex;
               
                padding-bottom: 24px;
                flex-flow: column;
             
                border-radius: 16px;
                margin: 20px ;
              
                justify-content: center;
                align-items: center
                }
                .contfiltromensual{
                  flex-flow:column
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
                ` } </style>

    </div>)
}
}
const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(accessPuntoVenta);