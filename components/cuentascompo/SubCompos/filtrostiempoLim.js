import React, { Component } from 'react'
import { CircularProgress } from '@material-ui/core';
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";
import {addFirstRegs} from "../../../reduxstore/actions/regcont";
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from '@date-io/moment';
class Stats extends Component {
    state={
        diario:false,
        mensual:true,
        periodo:false,
        tiempo: new Date(),
        tiempomensual: new Date(),
        tiempoperiodoini: this.periodoini(),
        tiempoperiodofin: this.periodofin(),
     }

     

     periodofin(){
   
        let nuevo = new Date()
        let asd  = nuevo.getDate() 
        let add = nuevo.setDate(asd)
       
       
        let fechareturn = new Date(add)
        return(fechareturn)
   
    }
    periodoini(){ 

      let nuevo = new Date()
      let asd  = nuevo.getDate() - 7
      let add = nuevo.setDate(asd)
    
      let fechareturn = new Date(add)
      return(fechareturn)
 
  }
     componentDidMount(){

     
      }

      downloadTimeRegs=async()=>{
        let datos = {
          User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
          },
        
          diario:this.state.diario,
          mensual:this.state.mensual,
          periodo:this.state.periodo,
          tiempoperiodoini:this.state.tiempoperiodoini,
          tiempoperiodofin:this.state.tiempoperiodofin,
          tiempo:this.state.tiempo,
          tiempomensual:this.state.tiempomensual
        }
        let lol = JSON.stringify(datos)
        this.setState({downloadData:true})
            fetch("/cuentas/getregstime", {
            method: 'POST', // or 'PUT'
            body: lol, // data can be `string` or {object}!
            headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
            }
            }).then(res => res.json())
            .catch(error => {console.error('Error:', error);
            })  .then(response => {  
        console.log(response)
            if(response.status == 'error'){
              alert("error al actualizar registros")
             
                }
              else{
                let misarrs = this.props.regC.Regs.slice() 
              

                let finalars= misarrs.concat(response.regsHabiles)
             let sinRepetidosObjeto= finalars.filter((value, index, self) => {
                  return(            
                    index === self.findIndex((t) => (
                      t._id === value._id && t._id === value._id
                    ))
                )
          
                });
               
                this.props.dispatch(addFirstRegs(sinRepetidosObjeto));
                this.setState({downloadData:false})
              }
          })
        
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

           this.props.paramTimeData(namex)
              
              }


      handleChangeTiempo=(e)=>{
        if(e){
      this.setState({
       tiempo:e._d
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
    handleChangeTiempoini=(e)=>{
      if(e){ 
      this.setState({
        tiempoperiodoini:e._d
      })
     }
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
                 
                  if(regs.length >0){
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
                  if(regs.length >0){
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
        if(regs.length >0){
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


      render() {
        let diarioval = this.state.diario?"activeval":"";
        let mensualval = this.state.mensual?"activeval":"";
        let periodoval = this.state.periodo?"activeval":"";
        let registros = this.props.regC.Regs
      
        
        let DetallesPorrender=[]
        
     if(registros){
        let displayRegs = this.OrderFilter(registros)
        if(this.state.diario){
            DetallesPorrender = this.DiaryFilter(displayRegs)
          }else if(this.state.mensual){
            DetallesPorrender = this.MensualFilter(displayRegs)
          }
          else if(this.state.periodo){
            DetallesPorrender = this.PeriodoFilter(displayRegs)
          }

this.props.getData(DetallesPorrender)
}
        return (
            <div >
<div className="organizador">
<div className="cont-Bt2">


</div>
<div className="contfiltros">
<Animate show={this.state.mensual}>
<div className="contfiltromensual jwContFlexCenter">
                     <div style={{margin:"0px 10px"}} className="subtituloArt">
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
               <div className="Contdonwloadbutton">
                              <Animate show={!this.state.downloadData}>
                              <button className="downloadbutton"onClick={this.downloadTimeRegs} >       <span className="material-icons">
                                 download
                  </span></button>
                  
                  </Animate>
                  <Animate show={this.state.downloadData}>
                  <CircularProgress />
                  </Animate>
                  </div> 
                   </div>

                   </Animate>   



                   
                   <Animate show={this.state.diario}>
                <div className="contfiltromensual jwContFlexCenter">
                <div style={{margin:"0px 10px"}} className="subtituloArt">
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
          format="DD/MM/YYYY"
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
</div>

<style jsx >
{` 
.excluido {
    color: red;
}

.fullw {
    width: 100%;
}

.contMainDataChart {
    flex-wrap: wrap;
    min-height: 300px;
    align-items: flex-start;
}

.contLineChart {
    margin: 15px 0;
    min-height: 350px;
}

.contfiltros {
    width: 90%;
    margin-left: 5%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
}

.fechacentral {
    width: 60%;
}

.contfiltromensual {
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: space-around;
}

.contpercent {
    display: flex;
    width: 70%;
    align-items: center;
}







.contmensual {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 500px;
    border: 3px outset;
    height: 57px;
    border-radius: 11px;
    margin: 3px 0;
}

.flechalateral {
    display: flex;
    align-items: center;
    box-shadow: inset 1px 2px 3px;
    width: 25px;
    height: 25px;
    padding: 4px;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 48%;
}

.contcatdetail {
    box-shadow: -2px 1px 3px #8ebaeb;
    background: white;
    margin: 5px;
    border-radius: 10px;
    padding: 15px 9px 0 8px;
    width: 96%;
    margin-left: 2%;
}

.mainstats {
    transition: 0.5s;
    padding-bottom: 9.5vh;
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    left: -100%;
}

.entradaaddc {
    left: 0;
}

.cont-Bt2 {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    margin-top: 5px;
    margin-bottom: 10px;
}

.dineroresum2 {
    margin: 5px 0;
    box-shadow: 0 0 2px #292323;
    padding: 10px;
    border-radius: 13px;
    background: #ecf5ff;
    width: 100%;
    max-width: 500px;
}

.percent {
    display: flex;
    align-items: center;
    border: 1px solid black;
    border-radius: 19px;
    font-weight: bold;
    padding: 5px;
    justify-content: center;
    width: 30%;
    max-width: 65px;
    margin-left: 15px;
    min-width: 60px;
    height: 30px;
}

.npercent {
    margin-left: 25px;
    word-break: break-all;
}

.minigen {
    text-align: center;
}

.minifilterCont {
    display: flex;
    width: 45%;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
}

.contsgens {
    display: flex;
    width: 100%;
    justify-content: space-around;
}

.botongeneral {
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

.activeval {
    height: 25px;
    color: black;
    box-shadow: -5px 1px 5px #5498e3;
}

.contvalores {
    font-size: 20px;
    font-weight: bolder;
    margin-right: 15px;
}

.contstat {
    display: flex;
    width: 100%;
    padding: 12px 0;
    justify-content: space-between;
    height: auto;
    min-height: 40px;
    margin: 6px 0;
    background: white;
    box-shadow: inset 2px -1px 5px black;
    border-radius: 18px;
    cursor: pointer;
}

.cont-Prin {
    display: flex;
    width: 70%;
    justify-content: center;
    max-width: 400px;
    flex-flow: column;
    margin: 20px;
}

.cont-Prin2 {
    display: none;
    width: 70%;
    justify-content: center;
    max-width: 400px;
    flex-flow: column;
}

.contStatics {
    display: flex;
    flex-flow: column;
    width: 100%;
    margin: 20px;
    max-width: 450px;
    border-radius: 14px;
    padding: 10px;
    justify-content: center;
}

.contULS {
    width: 40%;
}

.organizador {
    margin-top: 10px;
    border: 1px double #4695ec;
    border-radius: 18px;
    padding: 10px;
    box-shadow: inset 0 -2px 4px black;
}

.conttitulo {
    border-radius: 30px;
    text-align: center;
    padding: 5px;
    box-shadow: rgb(38 57 77) 12px 35px 78px -20px;
    width: 90%;
    max-width: 350px;
    border-bottom: 6px double black;
}

.contSubCats {
    display: flex;
    flex-flow: column;
    align-items: center;
}

.contSubCat {
    display: flex;
    width: 99%;
    justify-content: space-between;
    transition: 1s;
    margin-bottom: 12px;
    border-bottom: 1px solid;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #59c6f812;
}

.crystal-rectangle {
    width: 100%;
    height: auto;
    margin: 10px 0;
    min-height: 40px;
    padding: 12px 0;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    box-shadow: 
        inset 5px 5px 10px rgba(255, 255, 255, 0.2),
        inset -5px -5px 10px rgba(0, 0, 0, 0.15),
        5px 5px 15px rgba(0, 0, 0, 0.3),
        -5px -5px 15px rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.downloadbutton {
    color: white;
    border-radius: 36px;
    background: #5253ff;
      }


`}
</style>
            </div>
        )
      }
 }

 const mapStateToProps = state=>  {
     let regC =   state.RegContableReducer
     return {
       regC,
       state
     }
   };
   
   export default connect(mapStateToProps, null)(Stats);