import React, { Component } from 'react'
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import {connect} from 'react-redux';
import "moment/locale/es";
import {getcuentas,addFirstRegs,addTipo,addRegsDelete } from "../../reduxstore/actions/regcont";
import MomentUtils from '@date-io/moment';
import { Animate } from "react-animate-mount";
import GenGroupRegs from './SubCompos/GenGroupRegsCuentasNuevas';
import RepCont from "./modal-repeticiones"
import postal from 'postal';
import Dropdown from 'react-bootstrap/Dropdown';
import CircularProgress from '@material-ui/core/CircularProgress';
import fetchData from '../funciones/fetchdata';
import { Switch, FormControlLabel } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"; // Ícono de dinero en Material-UI v4




const CustomSwitch = ({ color, ...props }) => {
  const StyledSwitch = withStyles({
    switchBase: {
      color: color || '#f44336', // Rojo por defecto
      '&$checked': {
        color: color || '#f44336',
      },
      '&$checked + $track': {
        backgroundColor: color || '#f44336',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  return <StyledSwitch {...props} />;
};

class homepp1 extends Component {
    state={
        diario:true,
        mensual:false,
        periodo:false,
        Regs:[],
        Alert:{Estado:false},
        tiempo: new Date(),
        tiempomensual: new Date(),
        tiempoperiodoini: new Date(),
        tiempoperiodofin: this.periodofin(),
        RegsDisplay:[],
        RegsDisplayMensual:[],
        RegsDisplayPeriodo:[],
        TotalMensualGas:0,
        TotalMensualIng:0,
        TotalDiarioIng:0,
        TotalDiarioGas:0,
        TotalPeriodoGas:0,
        TotalPeriodoIng:0,
        Repeticiones:[],
        modalrep:false,
        deletedRegs:false,
        liquidez:false,
        downloadData:false,
        donwloadDeleteRegs:false,
    }
    channel1 = null;
    periodofin(){
   
     

        let nuevafecha = new Date(add)

        let nuevo = new Date()
        let asd  = nuevo.getDate() + 1
        let add = nuevo.setDate(asd)
       
       
        let fechareturn = new Date(add)
        return(fechareturn)
   
    }
    componentDidMount(){
      this.channel1 = postal.channel();
      this.channel1.subscribe('updatereps', () => {
        console.log("desderep")
        this.getRep()
         
       });
    
        
   
        setTimeout(function(){ 
  
          document.getElementById('maindetalles').classList.add("entradaaddc")
    
         }, 200);
  
      
   
  
        
        }

        getDeteleRegs  = async ()=> {
          if(this.state.deletedRegs ==false){
this.setState({donwloadDeleteRegs:true})
let datos = {  diario:this.state.diario,
  mensual:this.state.mensual,
  periodo:this.state.periodo,
  tiempoperiodoini:this.state.tiempoperiodoini,
  tiempoperiodofin:this.state.tiempoperiodofin,
  tiempo:this.state.tiempo,
  tiempomensual:this.state.tiempomensual}

let data = await fetchData(this.props.state.userReducer,
                      "/cuentas/getregsdeletetime",
                      datos)
console.log(data)
if(data.status =="Ok"){

  if(data.regsHabiles.length > 0){
    this.props.dispatch(addRegsDelete(data.regsHabiles))
  }
 

}
this.setState({donwloadDeleteRegs:false, deletedRegs:true})

}else{

  this.setState({deletedRegs:false, })

}
         }







        updateData= async ()=> {
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
          if(!this.state.deletedRegs){
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
          })}else{
            this.setState({donwloadDeleteRegs:true})
            let data = await fetchData(this.props.state.userReducer,
              "/cuentas/getregsdeletetime",
              datos)
console.log(data)
if(data.status =="Ok"){

if(data.regsHabilesDelete.length > 0){
  let misarrs = this.props.regC.RegsDelete.slice() 
              
  let finalars= misarrs.concat(response.regsHabilesDelete)
let sinRepetidosObjeto= finalars.filter((value, index, self) => {
    return(            
      index === self.findIndex((t) => (
        t._id === value._id && t._id === value._id
      ))
  )

  });
  
this.props.dispatch(addRegsDelete(sinRepetidosObjeto))
}

}
this.setState({donwloadDeleteRegs:false})
      
      
            
          }
         }
       
        getMonthName = ()=> {
            var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
            return monthNames[this.state.tiempomensual.getMonth()];
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
          handleToggle = (e) => {
            const { name } = e.target;
            this.setState((prevState) => ({
              [name]: !prevState[name], // Se usa el valor de name correctamente
            }));
          };

          masunmes=()=>{
            let mesactual = this.state.tiempo.getMonth() + 1
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
               
                        let fechaini = fecha.setHours(0, 0, 0) - 500
                
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

              getDayName = ()=> {
                var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
                
                return days[this.state.tiempo.getDay()];
                
                }
                getMonthName = ()=> {
                    var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
                    return monthNames[this.state.tiempo.getMonth()];
                  }
                  
                menosunmes=()=>{
                    let mesactual = this.state.tiempo.getMonth() - 1
                    let nuevomes = this.state.tiempo.setMonth(mesactual)
                    let newdate = new Date(nuevomes)
              
                    this.setState({tiempo:newdate})
                  
                  
                  }


                  genRegs=(detallesrender)=>{ 
                    console.log(detallesrender)
                    if( detallesrender) return detallesrender
                    else{
                      return(<div style={{display:"flex", alignItems:"center", 

                        marginTop:"20px"
                      }}>
                        <span className="material-icons">
warning
</span>
                         Sin resultos que mostrar. 

                      </div>)
                    }


                  }

                  generadorRep=()=>{
                    if(this.props.regC.Reps){
                      if(this.props.regC.Reps.length >0){
                      return(
                        <div className="contRep" onClick={()=>{this.setState({modalrep:true})}}>
                          <div>   
                            Repeticiones                  
                          </div>
                          <div> 
                          {this.props.regC.Reps.length }
                          </div>
                        </div>
                      )
                      }  else return ""
                    }
                    else return ""
                  }

    render() {
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
        let balanceinggas = 0

      console.log(this.state.donwloadDeleteRegs)
let displayDetalles =[]
let detallesrender= ""
let detallesDeleterender= ""
let Detallesfiltrados =""
let DetallesOrdenados  =""
let  DetallesPorrender=[]
let superIng= 0
     let superGas= 0
     let response  = []
     if(this.props.regC){
if(this.props.regC.Regs  || this.props.regC.RegsDelete ){


  if(this.state.deletedRegs){

      response  =  this.props.regC.RegsDelete
    
    
  }else if(!this.state.deletedRegs){
    response = this.props.regC.Regs 
  }




displayDetalles = this.OrderFilter(response)

if(this.state.diario){
  DetallesPorrender = this.DiaryFilter(displayDetalles)
}else if(this.state.mensual){
  DetallesPorrender = this.MensualFilter(displayDetalles)
}
else if(this.state.periodo){
  DetallesPorrender = this.PeriodoFilter(displayDetalles)
}



}

  
      let tiposrender = ""

if(this.props.regC.Tipos){



    tiposrender = this.props.regC.Tipos.map((tipo, i)=>{
        let cuentasrender  =[]
        let visible=""
        let sumatoria= 0
          if(this.props.regC.Cuentas){
              cuentasrender = this.props.regC.Cuentas.filter(cuentaper => cuentaper.Tipo === tipo )
              if(cuentasrender.length > 0){
               for(let i = 0; i < cuentasrender.length; i++){
                        sumatoria = sumatoria + cuentasrender[i].DineroActual
               }
            
              }
           
          }
          visible = cuentasrender.length == 0?"invisiblex":""
          let color = sumatoria > 0? "setBlue":"setRed"

      

return(<div className={`tipoMain ${visible}`}key={i}>
  <div className="contFlexSpaceB">  
   <div className="titilulo">{tipo.toUpperCase()}</div> 
   <div className={`valorcuentas  ${color} `}>${sumatoria} </div>
   
   </div>

   <div className="contcuentas">
     {cuentasrender.map((cuenta, i)=>(
     <div key ={i}className="cuentaname jwPointer" onClick={()=>{this.getcuentaRegs(cuenta)}}>
       <p >
       {cuenta.NombreC}
       </p>
       <p>
       {`$ ${cuenta.DineroActual.$numberDecimal}` }
       </p>
        
          </div>
          
          ))}
   </div>
</div>)

    })
}

}
if(DetallesPorrender.length > 0){
  detallesrender = <GenGroupRegs Registros={DetallesPorrender} cuentaSelect={{_id:0}} datosGene={{saldo:0, balance:0,saldoActive:false}} />

    let misregs2ing = DetallesPorrender.filter(regsing => regsing.Accion == "Ingreso"&& regsing.TiempoEjecucion != 0)
    let sumaing = 0
                if(misregs2ing.length > 0){
                  for (let i=0; i < misregs2ing.length; i++ ){
                    sumaing = sumaing + misregs2ing[i].Importe
                }
              }
              let misregsgas = DetallesPorrender.filter(regsgas => regsgas.Accion == "Gasto"&& regsgas.TiempoEjecucion != 0)
                let sumagas = 0

                if(misregsgas.length > 0){
                for (let i=0; i < misregsgas.length; i++ ){
                    sumagas = sumagas + misregsgas[i].Importe
                   }
                  } 

              
let sumatransing = 0
let sumatransgas = 0




superIng=  sumaing + sumatransing
    superGas= sumagas + sumatransgas

    balanceinggas=  superIng - superGas

}//fin display detalles 

        return (
            <div id="maindetalles"className="mainhomeapp">
        
        <div className="contGnCroom">
  <div className="headerDetalles">
<div className='jwFlexSpaceRound'>
<div className="tituloArt" style={{marginRight:"10px"}}>Registros</div>

<Dropdown>
        
        <Dropdown.Toggle variant="primary" className="contDropdown" id="dropdownm" style={{marginRight:"15px"}}>
        <span className="material-icons">
        more_vert
        </span>
    </Dropdown.Toggle>
  
     <Dropdown.Menu>
    
     <Dropdown.Item>
        <button className=" btn  btn-primary btnDropDowmRegs" onClick={this.updateData}>
       
        <span className="material-icons" style={{width:"45px"}}>
        search
     </span>
     <p>Buscar</p>
     </button>
        </Dropdown.Item>
        <Dropdown.Item>
        <button className=" btn  btn-info btnDropDowmRegs"
         onClick={()=>{
          if(this.props.regC.Reps){ 
            this.setState({modalrep:true})
          }else{
            let add = {
              Estado:true,
              Tipo:"info",
              Mensaje:"No hay repeticiones para mostar"
          }
          this.setState({Alert: add, })
          

          }
          
        
        }
        }
          
          >
       
        <span className="material-icons" style={{width:"45px"}}>
   repeat
     </span>
     <p>Repeticiones </p>
     </button>
        </Dropdown.Item>

      

           
     </Dropdown.Menu>
          
           </Dropdown>
           <div className="glass-container">
           <FormControlLabel
          control={
            <CustomSwitch color="#f44336"
             checked={this.state.deletedRegs}
              onChange={this.handleToggle}
                  name="deletedRegs"
              /> /* Rojo */
          }
          label={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon
                style={{
                  color: this.state.deletedRegs ? '#f44336' : 'gray',
                  marginRight: '5px',
                }}
              />
              {"Eliminados"}
            </span>
          }
        />
</div>
           <Animate show={this.state.downloadData}>
            <CircularProgress />
           </Animate>
</div>

</div>
<div className="contTipos">
  
<div className="tipoMain">
<div className="cont-Prin">

<div  id="diario" className={`botongeneral jwPointer ${diarioval}  `}onClick={ this.buttonsp}>Diario</div>
<div id="mensual" className={`botongeneral jwPointer ${mensualval} `}onClick={ this.buttonsp}>Mensual</div>
<div id="periodo" className={`botongeneral jwPointer ${periodoval} `}onClick={ this.buttonsp}> Periodo</div>


</div>
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
             <div className="contdinerosum ">
                <div className="dineroresum2 ">
                   <p className="subtituloArt " >{}</p>
                   <div className="contsgens">
                       <div className="minigen">
                           <div style={{color:"blue"}}>Ingreso</div>
                           <div>${superIng.toFixed(2)}</div>
                       </div>
                       <div className="minigen">
                           <div style={{color:"red"}}>Gasto</div>
                           <div>${superGas.toFixed(2)}</div>
                       </div>
                       <div className="minigen">
                           <div>Balance</div>
                           <div>${balanceinggas.toFixed(2)} </div>
                     
                       </div>
                       </div>

      



                   </div>
                   </div>
                   <Animate show={this.state.deletedRegs}>
                <div className="DeleteRegs">
                  Eliminados
                </div>
          
                </Animate>
                   <div className="supercontreg">
          {this.state.donwloadDeleteRegs &&  <CircularProgress />  }
                {this.genRegs(detallesrender)}
                </div>
                  
              
              
</div>
</div>
</div>

<Animate show={this.state.modalrep}> 
<RepCont rep={this.props.regC.Reps} Flecharetro={()=>{this.setState({modalrep:false})}}  />
</Animate>
<Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>

<style > {  `  

  .cont-Prin {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    margin-top:5px;
    margin-bottom:20px;
}
.fechacentral{
  width: 60%;
}
.contfiltromensual{
  flex-flow:column
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
.valorcuentas{
  margin-right: 15px;
  font-weight: bold;
}
.setBlue{
  color:blue;
}
.setRed{
  color:red;
}
.invisiblex{
  display: none;
}

.headerDetalles{
  display: flex;
  width: 100%;
  justify-content: space-around;
  flex-flow: column;
  max-width: 800px;
  align-items: center;
  min-height: 35px;
  margin-bottom: 20px;
  margin-top: 30px;
}
   .fechacont{
    font-size: 16px;
    color: darkgrey;
   }
.contGrupo{
  width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid;
    border-radius:5px;
    margin-bottom: 6px;
    padding: 5px;
    max-width: 800px;
}




              .contdinerosum{
                display: flex;
                justify-content: center;
                align-items: center;
              }
             .dineroresum2{
              margin: 5px 0px;
              box-shadow: 0px 0px 2px #292323;
              padding: 0px;
              border-radius: 13px;
              background: #ecf5ff;
              width: 100%;
              max-width: 500px
          }
                        .supercontreg{
                    
                          padding-bottom: 150px;
                          width: 100%;
                          align-items: center;
         display: flex;
          justify-content: center;
          flex-flow: column;
          background: whitesmoke;
                      }
     
                      
 .cuentareg{
  font-size: 15px;
  color: grey;
}

p{
  margin:0px
}


.dineroresum{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 5%;
  margin-top: 3%;
  margin-bottom: 5%;
  /* border-top: 2px solid white; */
  box-shadow: 0px 0px 2px #292323;
  padding: 10px;
  border-radius: 13px;
  background: #ecf5ff;
  flex-flow:column;
  max-width: 500px
}

.contRep{
  display: flex;
    width: 190px;
    justify-content: space-around;
    border-bottom: 7px double lightgreen;
    border-radius: 15px;
    cursor:pointer;
    margin-bottom: 20px;
    margin-top: 10px;
}



                    .flecharetro{
                      height: 40px;
                      width: 40px;
                      padding: 5px;
                    }
                .contGnCroom{
                  display: flex;
                  flex-flow: column;
              
                  width: 100%;
                  align-items: center;
                }
                .Contcronn{
                  width: 100%;
                }
                .contTipos{
                  width: 95%;
                  max-width: 800px;
                }
                .contcuentas{
                  padding: 5px;
                }
                .titilulo{
                  font-weight: bold;
                  font-size: 20px;
                }
                
                .btnDropDowmRegs{
                  display:flex;
                  align-items: center;
                  justify-content: space-between;
                }
                  .cuentaname{
            
                    border-bottom: 2px solid grey;
                    padding: 11px 11px 1px 15px;
                    border-radius: 13px;
                    margin-bottom: 10px;
                    justify-content: space-between;
                    align-items: center;
                    display: flex;
                  }
                  .cuentaname p{
                    margin:0
                  }

            
                .full{
                    width: 90%;
                }
       
  .minigen{
    text-align: center;
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
 }
 .activeval{
  height: 25px;
  color: black;
  box-shadow: -5px 1px 5px #5498e3;  
                  
}
 
.glass-container {
  background: rgba(255, 255, 255, 0.1); /* Fondo semi-transparente */
  backdrop-filter: blur(10px); /* Efecto desenfoque */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Bordes sutiles */
  border-radius: 15px; /* Bordes redondeados */
  padding: 5px 10px; /* Espaciado interno */
  
  max-width: 90%; /* Responsivo */
  text-align: center; /* Centrado del contenido */

  margin: 20px auto; /* Centrado vertical y horizontal */
  font-family: 'Arial', sans-serif; /* Fuente limpia */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-container:hover {
  transform: scale(1.05); /* Efecto de agrandamiento */
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2); /* Más sombra al hacer hover */
}
.separador{
    margin: 6px 14px  ;
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
      regC, state
    }
  };
  
  export default connect(mapStateToProps, null)(homepp1);