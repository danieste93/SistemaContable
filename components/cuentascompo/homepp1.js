import React, { Component } from 'react'
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import {connect} from 'react-redux';
import { Animate } from "react-animate-mount";
import GraficadorPie from "./estadisticas/generadorPie"
import GraficadorSubPie from "./estadisticas/generadorsubCats"
import { Pie, Line } from 'react-chartjs-2';
import {Chart} from"chart.js"
import 'chart.js/auto';


import MomentUtils from '@date-io/moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "moment/locale/es";
import { install } from "resize-observer";
 class Stats extends Component {
    state={
   
      Cuentas:false,
      Categorias:true,
      Pie:true, 
      Line:false,
      Pieview:false,
      allData:true,
      catdetail:false,
      CategoriaElegida:{RegistrosF:[]},
      InvOption:"categoria",
        
        TotalData:false,

        diario:false,
        mensual:true,
        periodo:false,
        tiempo: new Date(),
        tiempomensual: new Date(),
        tiempoperiodoini: this.periodoini(),
        tiempoperiodofin: this.periodofin(),
        ingCatRender:{},
        bundleSubCat:"Todo",
        excluidos:[],
        subCatRegs:[]
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
    componentDidMount(){
     
     
        setTimeout(function(){ 
  
          document.getElementById('mainhomeapp').classList.add("entradaaddc")
    
         }, 200);
  
         if (typeof window !== "undefined") {
          install();
          }
  
 
        
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
          handleOptionChange = (event) => {
            this.setState({ InvOption: event.target.value });
          };
          OrderFilter=(regs)=>{
            let order = regs.sort((a, b) => b.Tiempo - a.Tiempo)
        
           return order
          } 




    render() {
      console.log(this.state)
    

      


        let displayRegs =[]
        let diarioval = this.state.diario?"activeval":"";
        let mensualval = this.state.mensual?"activeval":"";
        let periodoval = this.state.periodo?"activeval":"";
        
        let pieActive = this.state.Pie?"activeB":""
        let lineActive = this.state.Line?"activeB":""
        let cuentasActive = this.state.Cuentas?"activeB":""
        let categoriasActive = this.state.Categorias?"activeB":""
        
        let superdata = {labels: [],
            datasets: [{
               label: '',
               data: [],
            } ]  }
            let superdata2 = {labels: [],
              datasets: [{
                 label: '',
                 data: [],
              } ]  }
      






let registros  = this.props.regC.Regs? this.props.regC.Regs.filter(x=> x.Accion=="Ingreso"|| x.Accion=="Gasto" ):[]
let DetallesPorrender=[]


displayRegs = this.OrderFilter(registros)
if(this.state.diario){
    DetallesPorrender = this.DiaryFilter(displayRegs)
  }else if(this.state.mensual){
    DetallesPorrender = this.MensualFilter(displayRegs)
  }
  else if(this.state.periodo){
    DetallesPorrender = this.PeriodoFilter(displayRegs)
  }

  
 const sendPiedata=(data)=>{

       let getRegs = DetallesPorrender.filter(x=> x.CatSelect._id == data._id)     

       setTimeout(()=> {
        this.setState({catdetail:true})

        }, 400);
        this.setState({ subCatRegs:getRegs, allData:false})

  }

        return (
            <div id="mainhomeapp"className="mainstats">

         <div className="contPieview">
<div className="contAllStatics">
<div className="contPieview contdetails">
<div className="minifilterCont">
<span className={`base basealt ${pieActive} `} onClick={()=>{this.setState({Pie:true, Line:false, })}}>   <div className="">Pie</div> 
<span className="material-icons">
                           pie_chart
                            </span>

</span>
<span style={{fontSize:"30px"}}>|</span>
          <span className={`base basealt ${lineActive} `} onClick={()=>{this.setState({Line:true, Pie:false,})}} > <div className="asd">Line</div> 
          
          <span className="material-icons">
                           show_chart
                            </span>
          
          </span>


</div>
<div className="minifilterCont">
<span className={`base basealt ${cuentasActive} `} onClick={()=>{this.setState({Cuentas:true, Categorias:false, })}}>   <div className="">Cuentas</div> 


</span>
<span style={{fontSize:"30px"}}>|</span>
          <span className={`base basealt ${categoriasActive} `} onClick={()=>{this.setState({Categorias:true, Cuentas:false,})}} > <div className="asd">Categorias</div> 
          
         
          
          </span>


</div>
</div> 
<Animate show={this.state.allData}> 
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
</div>

  <Animate show={this.state.Pie}>  
 <GraficadorPie data={DetallesPorrender}
                 criterio={"categoria"}
                   sendData={sendPiedata} />
</Animate> 
<Animate show={this.state.Line}> 
<div className="centrar contLineChart">
<Line data={superdata2}   options={{
  
  responsive: true,
  maintainAspectRatio: false,
  
      legend: { display: true},
      plugins: {
        datalabels: {
            backgroundColor: function(context) {
                return "white";
              },
           
            color: 'black',
            borderRadius: 25,
            padding: 5,
            font: {
                size:"15px",
                weight: 'bold'
              },
        }}
   
    }} />
</div>
</Animate> 
</Animate> 
</div>
<div className="contcatdetail">
<Animate show={this.state.catdetail}>
<GraficadorSubPie data={this.state.subCatRegs}
 Flecharetro={()=>{
  

  setTimeout(()=> {
    this.setState({allData:true})

    }, 400);
  
  this.setState( {catdetail:false, subCatRegs:[]})


}
 
 }
/>
</Animate>
</div>
</div>


<style >
                {                                
                ` .excluido{
                color:red
                }
                .fullw{
                  width: 100%;  
              }
                .contMainDataChart{
                  flex-wrap: wrap;
                  min-height: 300px;
                  align-items: flex-start;
                }
                .contLineChart {
                  margin: 15px 0px;
                  min-height: 350px;
                }
                .contfiltros{
                  width: 90%;
                  margin-left: 5%;
                }
               
                .fechacentral{
                    width: 60%;
                  }
                .contfiltromensual{
                 
                    flex-flow: row;
    flex-wrap: wrap;
    justify-content: space-around;
                  } 
                .contpercent{
                    display: flex;
                    width: 70%;
                   align-items: center
                      
                    
                }
                .activeB{
                    font-size:20px;
                    color: #3f51b5;
                      font-weight: bolder;
                  }
                  .activeBgreen{
                    font-size:20px;;
                    color: green;
                      font-weight: bolder;
                  }
                  .deactiveB{
                    font-size:20px;
                    color: red;
                      font-weight: bolder;
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
                  .contcatdetail{
                    box-shadow: -2px 1px 3px #8ebaeb;
                    background: white;
                    margin: 5px;
                    border-radius: 10px;
                    padding: 15px 9px 0px 8px;
                    width: 96%;
                    margin-left: 2%;
                  }
                
                .mainstats{
                    transition: 0.5s;
   
                    padding-bottom: 9.5vh;
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
                    transition: 0.5s;
                    left: -100%;
                    flex-flow:column
                }
                .entradaaddc{
                    left: 0%;
                   }
                   .cont-Bt2 {
                    display: flex;
                    width: 100%;
                    justify-content: space-evenly;
                    margin-top:5px;
                    margin-bottom:10px;
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
                   .percent{
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
                  .npercent{
                   margin-left: 25px;
                       word-break: break-all;
                  }
                   .minigen{
                    text-align: center;
                 }
                    
                 .minifilterCont{
                  display: flex;
                  width: 45%;
                  justify-content: space-around;
                  align-items: center;
                  flex-wrap: wrap;
                }
                 .contsgens{
                  display: flex;
                width: 100%;
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
                   .activeval{
                    height: 25px;
                    color: black;
                    box-shadow: -5px 1px 5px #5498e3;  
                                    
                  }
                   .contvalores{
                    font-size: 20px;
                    font-weight: bolder;
                    margin-right: 15px;
                   }
                   .contstat{
                    display: flex;
                    width: 100%;
                    padding: 12px 0px;
                    justify-content: space-between;
                    height: auto;
                    min-height: 40px;
                    margin: 6px 0px;
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
                .contStatics{
                  display: flex;
                  flex-flow: column;
                  width: 100%;
               
                  margin: 20px;
                 
                  max-width: 450px;
                  border-radius: 14px;
                  padding: 10px;
                  justify-content: center;
                }
                .contULS{
                    width: 40%;
                 }
                 .organizador{
                  margin-top: 10px ;
                  border: 1px double #4695ec;
                  border-radius: 18px;
                  padding: 10px;
                  box-shadow: inset 0px -2px 4px black;
                 }
                
                 
               

                 .conttitulo{
                    border-radius: 30px;
                    text-align: center;
                    padding: 5px;
                    box-shadow: rgb(38 57 77) 12px 35px 78px -20px;
                    width: 90%;
                    max-width: 350px;
                    border-bottom: 6px double black;

                 }
           .contSubCats{
            display: flex;
    flex-flow: column;

    align-items: center;
           }
           .contSubCat{
            display: flex;
            width: 99%;
            justify-content: space-between;
            transition:1s;
            margin-bottom: 12px;
            border-bottom: 1px solid;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            background-color: #59c6f812
           }
              .crystal-rectangle {
      width: 100%;
      height: auto;
        margin: 10px 0px;
                    min-height: 40px;
          padding: 12px 0px;
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
 
    
                  cursor:pointer;
     
    }




    .contSubCat {
  padding: 15px;
  margin: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.contSubCatSelect {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.contSubCatBloqueado {
  opacity: 0.5;
  pointer-events: none; /* Desactiva el clic si está bloqueado */
}

.contSubCatHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blockButton {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s;
}

.blockButton:hover {
  color: rgba(255, 255, 255, 1);
}

.contSubCatporcentaje, .contSubCatvalor {
  font-weight: bold;
  font-size: 14px;
  color: black;
}
           .contSubCatporcentaje{
            width: 30%;
            text-align: center;
           }
           .contSubCatvalor{
            width: 20%;
            text-align: right;
           }
           .contSubCatName{
            width: 20%;
           }
           .contPieview{
            width: 95%;
            max-width: 1000px;
          }
           .contSubCatSelect{
            background-color: #428de0fc;
            color: white;
            height: 50px;
           }
           .contAllStatics{
            box-shadow: -2px 1px 3px #8ebaeb;
            background: white;
            margin: 0px;
            border-radius: 10px;
            padding: 15px 9px 0px 8px;
            width: 99%;
           }
               
                    
                   .contdetails{
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                   }

      .contSubCat {
  padding: 20px;
  margin: 15px;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  color: #ffffff;
}

.contSubCatSelect {
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.contSubCatBloqueado {
  opacity: 0.4;
  pointer-events: none;
}

 .base{
                  margin-top:8px;
                  transition: 1s;
                  cursor: pointer;
                  border: 1px solid;
                 
                  border-radius: 17px;
                  box-shadow: inset 1px -1px 1px black;
                  min-width: 125px;
                  display: flex;
                  flex-flow: column;
                  justify-content: center;
                  align-items: center;              
                  }
                      .basealt{
                    margin-top:5px;
                   
                    flex-flow: row;
                    justify-content: space-around;
                    height: 30px;
                    
                  }

.contSubCatHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contSubCatName {
  font-size: 1.2em;
  font-weight: bold;
}

.blockButton {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 5px;
  padding: 5px;
  color: #ffffff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.blockButton:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.contSubCatInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  margin-top: 10px;
}

.contSubCatporcentaje {
  font-weight: bold;
}

.contSubCatvalor {
  font-size: 1em;
}

                
                ` }
    </style>
</div>



        )
    }
}
const mapStateToProps = state=>  {
    let regC =   state.RegContableReducer
    return {
      regC
    }
  };
  
  export default connect(mapStateToProps, null)(Stats);