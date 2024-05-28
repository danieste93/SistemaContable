import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import CuentaSelect from "./modal-selectCount"
import CatSelect from "./modal-selectCat"
import InggasSearcher from './SubCompos/inggasSearcher';
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import "moment/locale/es";
import Checkbox from '@material-ui/core/Checkbox';
import MomentUtils from '@date-io/moment';
import TransrenderSearcher from './SubCompos/transrenderSearcher';
export default class homepp1 extends Component {
    state={
      incProducts:false,
      tiempo: new Date(),
      tiempomensual: new Date(),
      tiempoperiodoini: new Date(),
      tiempoperiodofin: this.periodofin(),
      TiempoFilter:"",
      filters:true,
      searcherIn:"",
      searcherOut:"",
      addcount:false,
      addcat:false,
      CuentasRender:"",
      Categorias:[],
      subCategorias:[],
      CuentasElegidas:[],
      RegsElegidos:[],
      UserFilter:"",
      minImport:0,
      maxImport:0,
      AccionFilter:"",
      superIng:0,
      superGas:0,
    }

    periodofin(){
   
     

      let nuevafecha = new Date(add)

      let nuevo = new Date()
      let asd  = nuevo.getDate() + 1
      let add = nuevo.setDate(asd)
     
     
      let fechareturn = new Date(add)
      return(fechareturn)
 
  }

componentDidMount(){
  
      
}  
handleChangeGeneral=(e)=>{

  this.setState({
  [e.target.name]:e.target.value
  })
  }
  handleChangeNumeros=(e)=>{

    this.setState({
    [e.target.name]:parseInt(e.target.value)
    })
    }
findRegisters=(regs)=>{

let valor = this.state.searcherIn
if(valor !=""){
  if(regs.length > 0){




    let inggas = regs.filter(x => x.Accion == "Ingreso" || x.Accion =="Gasto")
    let trans = regs.filter(x => x.Accion == "Trans" )
    
    let regsinv = regs.filter(x => x.Descripcion2)
    
    let regsSeleccionados = []
if(this.state.incProducts){
  for(let o = 0;o<regsinv.length;o++)
  {
        let regsfiltraods = regsinv[o].Descripcion2.articulosVendidos.filter((x)=>{
          return(x.Titulo.toLowerCase().includes(valor.toLocaleLowerCase()) 
          //||  x.Eqid.includes(valor.toLowerCase())
          )
        })

        if(regsfiltraods.length > 0){
          regsSeleccionados.push(regsinv[o])
        }

  }}


    let testfilter = regs.filter(regfi =>  regfi.Nota.toLowerCase().split(" ").reverse().join(" ").includes(valor.toLowerCase())
       
    )
    
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } 
   // console.log(regs[125].Nota.toLowerCase().trim().split(" ").reverse().join(" "))



    let findRegs = inggas.filter(regfi =>{
    
  let descrip = ""
if(typeof regfi.Descripcion == "string"){
  descrip = regfi.Descripcion
}




  return (      removeAccents(descrip.toLowerCase()).includes(valor.toLowerCase())||
  descrip.toLowerCase().includes(valor.toLowerCase())||
  descrip.toLowerCase().split(" ").reverse().join(" ").includes(valor.toLowerCase()) ||
    


    removeAccents(regfi.Nota.toLowerCase()).includes(valor.toLowerCase())||
       regfi.Nota.toLowerCase().includes(valor.toLowerCase())||
       regfi.Nota.toLowerCase().split(" ").reverse().join(" ").includes(valor.toLowerCase()) ||      
       regfi.Importe === parseInt(valor) ||
       regfi.IdRegistro === parseInt(valor) ||
     //  regfi.CatSelect.nombreCat.toLowerCase().includes(valor.toLowerCase())||
     //  regfi.CatSelect.subCatSelect.toLowerCase().includes(valor.toLowerCase())||
       regfi.CuentaSelec.nombreCuenta.toLowerCase().includes(valor.toLowerCase()))}
       )

       let findTrans = trans.filter(regfi =>
        removeAccents( regfi.Descripcion.toLowerCase()).includes(valor.toLowerCase())||
        regfi.Descripcion.toLowerCase().includes(valor.toLowerCase())||
        regfi.Descripcion.toLowerCase().split(" ").reverse().join(" ").includes(valor.toLowerCase()) ||
       
        regfi.Nota.toLowerCase().includes(valor.toLowerCase())||
        regfi.Nota.toLowerCase().split(" ").reverse().join(" ").includes(valor.toLowerCase()) ||
       
        regfi.Importe === parseInt(valor) ||
        regfi.IdRegistro === parseInt(valor) ||
        regfi.CuentaSelec2.nombreCuenta.toLowerCase().includes(valor.toLowerCase())||
        regfi.CuentaSelec.nombreCuenta.toLowerCase().includes(valor.toLowerCase())
        )

    let Resultado =  findRegs.concat(findTrans).concat(regsSeleccionados)
      
       return Resultado
       }
      }
      else{return(regs)}
       this.displayRegs()
       this.displayIngresos()
this.displayGastos()
  
}
micatFilter=(registros)=>{
  if(this.state.Categorias.length > 0){
    let acc =[]
    let inggas = registros.filter(x => x.Accion == "Ingreso" || x.Accion =="Gasto")
    for(let i=0; i<this.state.Categorias.length;i++){
 let asd = inggas.filter(x => x.CatSelect.nombreCat === this.state.Categorias[i])

 acc=acc.concat(asd); 
  }

  return acc
}
else{return(registros)}
}
miSubcatFilter=(registros)=>{
  if(this.state.subCategorias.length > 0){

    let getvalue = []
    let inggas = registros.filter(x => x.Accion == "Ingreso" || x.Accion =="Gasto")
    for(let i=0; i< this.state.subCategorias.length; i++){
  
      let res1 = inggas.filter(x => x.CatSelect.subCatSelect ==   this.state.subCategorias[i])
       
      getvalue=getvalue.concat(res1); 
     }
   
     return(getvalue)

  }
  else{return(registros)}
}
setCuentas=(cuentas)=>{

  if(cuentas.length > 0){
    let nombre =""
  for(let i =0; i< cuentas.length;i++){

nombre = nombre + "/ " + cuentas[i].cuenta
  }

  this.setState({CuentasRender : nombre, CuentasElegidas:cuentas})
  this.displayRegs()
  this.displayIngresos()
this.displayGastos()
  }
}

getDayName = ()=> {
  var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];
  
  return days[this.state.tiempo.getDay()];
  
  }
  getMonthName = ()=> {
    var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviebre", "Diciembre" ];
    return monthNames[this.state.tiempo.getMonth()];
  }
  menosunmes=()=>{
    let mesactual = this.state.tiempo.getMonth() - 1
    let nuevomes = this.state.tiempo.setMonth(mesactual)
    let newdate = new Date(nuevomes)
   this.setState({tiempo:newdate})
  
  }

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
    handleChangeTiempo=(e)=>{
 
    if(e){
      this.setState({
       tiempo:e._d
      })
     }
         
    }
     handleChangeTiempoPeriodofin=(e)=>{
    
       this.setState({
         tiempoperiodofin:e._d
       })
      }

miMinimoFilter=(registros)=>{

  if(this.state.minImport > 0){
    let minimo = registros.filter(x=> x.Importe >= this.state.minImport)

    return minimo
  }
  else return registros

}
miMaximoFilter=(registros)=>{
  
  if(this.state.maxImport > 0){
    let maximo = registros.filter(x=> x.Importe <= this.state.maxImport)
  
    return maximo
  }
  else return registros
}

miFiltrocuentas=(registros)=>{

  let getvalue = []
if(this.state.CuentasElegidas.length > 0){
  
  for(let i=0; i< this.state.CuentasElegidas.length; i++){

    let regsingGas = registros.filter(x => x.Accion ==   "Ingreso" ||x.Accion == "Gasto")

    let regsTrans = registros.filter(x => x.Accion ==   "Trans" )
  
   let res1 = regsingGas.filter(x => x.CuentaSelec.idCuenta ==   this.state.CuentasElegidas[i].id)

   let res2 = regsTrans.filter(x => x.CuentaSelec.idCuenta ==   this.state.CuentasElegidas[i].id ||x.CuentaSelec2.idCuenta ==   this.state.CuentasElegidas[i].id )

   getvalue=getvalue.concat(res1).concat(res2); 
  }

 
return(getvalue)

}else{return(registros)}

}
miFiltoUsuario=(registros)=>{
  if(this.state.UserFilter !=""){


    let regUser = registros.filter(x => x.Usuario.Id === this.state.UserFilter)
 
return regUser
  }
  else return registros

}
DiaryFilter=(regs)=>{

  let fecha = new Date(this.state.tiempo)
          let fechaini = fecha.setHours(0, 0, 0)
          let fechafin = fecha.setHours(23, 59, 59)
         
          if(this.state.TiempoFilter ==="Dia"){
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
            if(this.state.TiempoFilter ==="Mes"){
              let misregfiltrados = regs.filter(regs=> regs.Tiempo >= primerDia && regs.Tiempo <= ultimahora  )
            return misregfiltrados
            }else{
              return regs
            }

}
PeriodoFilter=(regs)=>{
  let fecha = new Date(this.state.tiempo)
  let fechafin = new Date(this.state.tiempoperiodofin)

  var primerDiaP = fecha.setHours(0,0,0)
  var ultimoDiaP = fechafin.setHours(23,59,59)

  let fechainix = new Date(primerDiaP).getTime()
  let fechafinx = new Date(ultimoDiaP).getTime()
  if(this.state.TiempoFilter ==="Periodo"){
    let misregsP = regs.filter(regs=> regs.Tiempo >= fechainix && regs.Tiempo <= fechafinx) 
    return misregsP
  }else{
    return regs
  }

}
IngFilter=(regs)=>{

  if(this.state.AccionFilter =="Ingreso"){
    let misregsIng = regs.filter(regs=> regs.Accion == "Ingreso") 

    return misregsIng
  }else{
    return regs
  }
}
GasFilter=(regs)=>{
  
  if(this.state.AccionFilter =="Gasto"){
    let misregsIng = regs.filter(regs=> regs.Accion == "Gasto") 

    return misregsIng
  }else{
    return regs
  }
}
TransFilter=(regs)=>{

  if(this.state.AccionFilter =="Transferencia"){
    let misregsIng = regs.filter(regs=> regs.Accion == "Trans") 
   
    return misregsIng
  }else{
    return regs
  }
}

FilterSistem=(regs)=>{
  
  let registros = regs

  let filtradospornombre =  this.findRegisters(registros)
  
  let FiltradoPorCuentas = this.miFiltrocuentas(filtradospornombre)
  let FiltradoPorUsuario= this.miFiltoUsuario(FiltradoPorCuentas)
  let FiltradoPorCategoria = this.micatFilter(FiltradoPorUsuario)
  let FiltradoPorSubcategoria = this.miSubcatFilter(FiltradoPorCategoria)
  
  let FiltradoPorMinimo = this.miMinimoFilter(FiltradoPorSubcategoria)
  let FiltradoPorMaximo = this.miMaximoFilter(FiltradoPorMinimo)
  
  let FiltradoPordia = this.DiaryFilter(FiltradoPorMaximo)
  let FiltradoPormes = this.MensualFilter(FiltradoPordia)
  let FiltradoPorperiodo = this.PeriodoFilter(FiltradoPormes)
  
  let FiltradoPorIngreso = this.IngFilter(FiltradoPorperiodo)
  let FiltradoPorGasto = this.GasFilter(FiltradoPorIngreso)
  let FiltradoPorTrans = this.TransFilter(FiltradoPorGasto)
  
  let registrosenseñar = FiltradoPorTrans

  return registrosenseñar
}

displayIngresos =()=>{
  let registros = this.props.SendRegs.Regs
  let  registrosenseñar = this.FilterSistem(registros)
  
  if(this.state.CuentasElegidas.length > 0 || this.state.searcherIn !="" ||this.state.UserFilter !=""||this.state.Categorias.length >0||this.state.subCategorias.length >0||this.state.minImport > 0 ||this.state.maxImport >0||this.state.TiempoFilter !=""||this.state.AccionFilter !=""){

  let misregs2ing = registrosenseñar.filter(regsing => regsing.Accion == "Ingreso")
  let sumaing = 0
              if(misregs2ing.length > 0){
                for (let i=0; i < misregs2ing.length; i++ ){
                  sumaing = sumaing + misregs2ing[i].Importe
              }
            }

 
  return (sumaing.toFixed(2))
}else{
  return(0)
}

        

}
displayGastos =()=>{
  let registros = this.props.SendRegs.Regs
  let  registrosenseñar = this.FilterSistem(registros)

  if(this.state.CuentasElegidas.length > 0 || this.state.searcherIn !="" ||this.state.UserFilter !=""||this.state.Categorias.length >0||this.state.subCategorias.length >0||this.state.minImport > 0 ||this.state.maxImport >0||this.state.TiempoFilter !=""||this.state.AccionFilter !=""){

  let misregsgas = registrosenseñar.filter(regsgas => regsgas.Accion == "Gasto")
  let sumagas = 0

  if(misregsgas.length > 0){
  for (let i=0; i < misregsgas.length; i++ ){
      sumagas = sumagas + misregsgas[i].Importe
     }
    } 
    return (sumagas.toFixed(2))
  }else{
    return(0)
  }
        

}
addCero=(n)=>{
  if (n<10){
    return ("0"+n)
  }else{
    return n
  }
}
jsonToCsv=(items)=> {
  const header = ["IdRegistro", 'Tiempo','CuentaSelec','CatSelect','Nota',"Accion","Descripcion",'Importe','Documento',"Valrep",'Usuario'];
  const tring = header.join(',');
  // handle null or undefined values here
  const replacer = (key, value) => value ?? '';
  const rowItems = items.map((row) =>
    header
      .map((fieldName) => {
   
        if(fieldName == 'Tiempo'){
          let tiempo = new Date(row[fieldName])    
          let mes = this.addCero(tiempo.getMonth()+1)
          let dia = this.addCero(tiempo.getDate())
          var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
    

          return date
        }
        else if(fieldName == 'CuentaSelec'){
          return JSON.stringify(row[fieldName].nombreCuenta, replacer)
        }
        else if(fieldName == 'CatSelect'){
        
          let catres = row[fieldName] == undefined? " ": JSON.stringify(row[fieldName].nombreCat + " / " + row[fieldName].subCatSelect, replacer)
          return catres
        }
        else if(fieldName == 'Usuario'){
          return JSON.stringify(row[fieldName].Nombre, replacer)
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
displayRegs=()=>{
  let registros = this.props.SendRegs.Regs

let  registrosenseñar = this.FilterSistem(registros)
if(this.state.CuentasElegidas.length > 0 || this.state.searcherIn !="" ||this.state.UserFilter !=""||this.state.Categorias.length >0||this.state.subCategorias.length >0||this.state.minImport > 0 ||this.state.maxImport >0||this.state.TiempoFilter !=""||this.state.AccionFilter !=""){

  if(registrosenseñar.length >0){
   


    let asdx = registrosenseñar.map((reg, i)=>{
      let elegido
      if(reg.Accion =="Ingreso" || reg.Accion =="Gasto" ){
        elegido = <InggasSearcher reg={reg} in={i} />
    
    }else if(reg.Accion =="Trans"){
      
      elegido = <TransrenderSearcher reg={reg} in={i} />
    }

return(elegido)
    })
   
return asdx
  
  }
    }else{
      return(<div>*-*</div>)
    }
}

handleSelectChange=(e)=>{
  
  if(e.target.value !=""){

  
  this.setState({UserFilter:e.target.value})
}
else   this.setState({UserFilter:""})
}
handleSelectChangeTime=(e)=>{
 
  if(e.target.value !=""){
  
  this.setState({TiempoFilter:e.target.value})
}
else   this.setState({TiempoFilter:""})
}
handleSelectChangeAccion=(e)=>{

  if(e.target.value !=""){
    this.setState({AccionFilter:e.target.value})
}
else   this.setState({AccionFilter:""})
}


donwloaddata=()=>{
  let registros = this.props.SendRegs.Regs

let  registrosenseñar = this.FilterSistem(registros)

  let csv = this.jsonToCsv(registrosenseñar)

  let link = document.createElement('a');
  const url = window.URL.createObjectURL(
      new Blob([csv]),
    );
  link.href = url;
  link.setAttribute(
    'download',
    `Registros.csv`,
  );
     
  link.click();

}
handleChangeGeneraltougle=(e)=>{
   this.setState({
  [e.target.name]:!this.state[e.target.name]
  })
  }
renderUsers=()=>{
  let usuariosEncontrados =[]
  let registros = this.props.SendRegs.Regs
  let optionUser =""

  if(registros){
  for(let i=0; i<registros.length;i++){

    usuariosEncontrados.push({Username:registros[i].Usuario.Nombre,UserID:registros[i].Usuario.Id})

  }

  var hash = {};
 let sinRepetidos = usuariosEncontrados.filter((user)=>{
var exists = !hash[user.UserID]
hash[user.UserID] = true;
return exists;
  })

 optionUser = sinRepetidos.map((optiUser,i)=>(
    <option key={i} value={optiUser.UserID}>{optiUser.Username} </option>
  ))
  
}
  return(
    <select className="sUsers" value={this.state.user} onChange={this.handleSelectChange} >
     
    <option value=""> </option>
{optionUser}
    </select >
  )
}

    render() {
       
           let Cactive = this.state.cuentas?"cdc2active2":""
           let Catactive = this.state.cat?"cdc2active2":""
           let subCatactive = this.state.subCategorias.length >0?"cdc2active2":""
           let flechaval = this.state.filters?"▲":"▼"
           let filtrocuentas
           let displaycuentas =[ ]
           let renderRegs
           let valx = this.state.CuentasElegidas.length > 0?<div className="xCont" onClick={()=>{this.setState({CuentasElegidas:[],CuentasRender:""})}}>x</div>:""
           let valy = this.state.Categorias.length > 0?<div className="xCont" onClick={()=>{this.setState({Categorias:[],CategoriasRender:""})}}>x</div>:""
           let valSubCat = this.state.subCategorias.length > 0?<div className="xCont" onClick={()=>{this.setState({subCategorias:[],SubCatRender:""})}}>x</div>:""
           
        
         

        return (
            <div id="mainsearcher"className="Contsearcher">
  
  <div className="contGn">

<div className="ContSearch">
<div className="contSuggester">

  <div className="react-autosuggest__container">
<input name="searcherOut" className="react-autosuggest__input" onChange={this.handleChangeGeneral} placeholder="Busca tus registros" /> 
<div className='contSearcher'>
<i className={`material-icons  `} onClick={()=>{this.setState({searcherIn:this.state.searcherOut})}}>
search
</i>
</div>
  </div>
</div> 
<div className='contOptions'>
<div className="grupoch">
  <Checkbox
   name="incProducts"
        checked={this.state.incProducts}
        onChange={this.handleChangeGeneraltougle}
        color="primary"
      />
      <p>Incluir Productos</p>
  </div>

</div>

  </div> 
<Animate show={this.state.filters}>
<div className="contFilters">
<div className="grupoDatos">
<div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cuenta  </p>
   </div>
  <div id =""className={`cDc2 ${Cactive}  `} onClick={()=>{this.setState({addcount:true})}}>
              <p>  {this.state.CuentasRender} </p>
           
              </div>
              <span className="spanX">{valx}</span>
</div>
<div className="grupoDatos">
<div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Categorias </p>
   </div>
  <div id =""className={`cDc2 ${Catactive} `} onClick={()=>{this.setState({addcat:true})}}>
              <p>  {this.state.CategoriasRender}  </p>
            
              </div>
              <span className="spanX">{valy}</span>
</div>

<Animate show={this.state.subCategorias.length > 0}>
<div className="grupoDatos">
<div className="cDc1">
<p style={{fontWeight:"bolder"}}>  SubCategorias </p>
</div>
<div id =""className={`cDc2 ${subCatactive} `} >
              <p>  {this.state.SubCatRender}  </p>
            
              </div>
              <span className="spanX">{valSubCat}</span>
</div>
  </Animate>
<div className="grupoDatos">
  <div className="cDc1">
  <p style={{fontWeight:"bolder"}}>    Importe </p>
  </div>

  <div className="cDc2x"> 
  <input type="number" className="inputtrace" placeholder="Mínimo" name="minImport" onChange={this.handleChangeNumeros} />
 <span> - </ span>
  <input type="number" className="inputtrace" placeholder="Máximo" name="maxImport" onChange={this.handleChangeNumeros} />
   </div>
</div>
<div className="grupoDatos">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>    Usuario </p>
  </div>
  <div className="cDc2">

    {this.renderUsers()}

 
     
  </div>
</div>

<div className="grupoDatos">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>    Acción </p>
  </div>
  <div className="cDc2">

  <select className="sUsers" value={this.state.AccionFilter} onChange={this.handleSelectChangeAccion} >
  <option value=""> </option>
  <option value="Ingreso">Ingreso </option>
  <option value="Gasto">Gasto </option>
  <option value="Transferencia">Transferencia </option>
  
  </select >
 
     
  </div>
</div>

<div className="grupoDatos">
<div className="cDc1">
  <p style={{fontWeight:"bolder"}}>    Tiempo </p>
  </div>
  <div className="cDc2">

  <select className="sUsers" value={this.state.TiempoFilter} onChange={this.handleSelectChangeTime} >
  <option value=""> </option>
  <option value="Dia">Día </option>
  <option value="Mes">Mes </option>
  <option value="Periodo">Periodo </option>
  
  </select >
 
     
  </div>
</div>
<div className="contfiltrosTiempo">
<Animate show={this.state.TiempoFilter == "Dia"}>
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

                  <Animate show={this.state.TiempoFilter == "Periodo"}>
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

                  <Animate show={this.state.TiempoFilter == "Mes"}>
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
          views={["month"]}
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
               <div className="flechalateral" onClick={this.masunmes}> {'>'}</div>
               </div>
                     
                   </div>

                   </Animate>   
</div>


</div>
</ Animate>
<div className="renderFilter" >
  
   <div onClick={()=>{this.setState({filters:!this.state.filters})}}>   {flechaval}</div>

   <button style={{color:"white", borderRadius:"36px",  background:"black", paddingTop:"5px"}} onClick={this.donwloaddata} >       <span className="material-icons">
               download
</span></button>
   
   </div>
</div> 

<div className="contdinerosum2 ">
                <div className="dineroresum2 ">
                   <p className="subtituloArt " >{}</p>
                   <div className="contsgens">
                       <div className="minigen">
                           <div style={{color:"blue"}}>Ingreso</div>
                           <div>${this.displayIngresos()}</div>
                       </div>
                       <div className="minigen">
                           <div style={{color:"red"}}>Gasto</div>
                           <div>${this.displayGastos()}</div>
                       </div>
                       <div className="minigen">
                           <div>Balance</div>
                           <div>${(this.displayIngresos() - this.displayGastos()).toFixed(2)} </div>
                     
                       </div>
                       </div>
                   </div>
                   </div>

<div className="contGn displayreg">
  <div className="supercontreg2">
{this.displayRegs()}
</div>
</div>
<Animate show={this.state.addcount}>
<CuentaSelect getCuentasFrom={(cuentas)=>{this.setCuentas(cuentas)}} Flecharetro={()=>{this.setState({addcount:false})}} />

</ Animate>
<Animate show={this.state.addcat}>
<CatSelect setCat={(e)=>{
if(e.Categorias.length > 0){


    let cat =""
  for(let i =0; i< e.Categorias.length;i++){

cat = cat + "/ " + e.Categorias[i]
  }

  this.setState({Categorias:e.Categorias, CategoriasRender:cat})
}

if(e.subCategorias.length > 0){
  let subcat =""
  for(let i =0; i< e.subCategorias.length;i++){

subcat = subcat + "/ " + e.subCategorias[i]
  }


  this.setState({subCategorias:e.subCategorias, SubCatRender:subcat})
}


this.displayRegs()
this.displayIngresos()
this.displayGastos()

}} Flecharetro={()=>{this.setState({addcat:false})}} />

</ Animate>

<style>     
     {`
     .contfiltrosTiempo{
       margin-top:15px;
     }
     .xCont{
      border-bottom: 3px inset red;
      width: 28px;
      /* padding: 10px; */
      text-align: center;
      border-radius: 10px;
     }
     .spanX{
      display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
    color: red;
     }
       .supercontreg2{
                    
        padding-bottom: 150px;
        width: 100%;
        align-items: center;
display: flex;
justify-content: center;
flex-flow: column;
    }
.renderFilter{
  font-size: 25px;
  margin-top: 15px;
  width: 100%;
  max-width: 451px;
  display: flex;

  justify-content: space-around;
}
     .inputtrace{
      width: 31%;
      border-radius: 5px;
      border: none;
      box-shadow: -2px 1px 4px #77afea;
      padding: 2px;
      text-align: center;
     }

     .sUsers{
      width: 100%;
      border-radius: 15px;
     }

       .cDc1{

    width: 40%;
    display: flex;
    align-items: flex-end;
    word-break: break-all;
    justify-content: flex-start;
    text-align: left;
  }
   .contFilters{
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
   }

   .cDc2x{
    width:70%;
    display: flex;
    justify-content: space-around;
   }
 
   .cDc2{
    margin-left:10px;
    width:70%;
    border-bottom: 3px double grey;
   display: flex;
   align-items: flex-end;
   transition: 0.5s;
  }
  .cDc2 p{
    margin:0px;

  }
  .cdc2active2{
    border-bottom: 5px double green;
   }
   .grupoDatos{
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
   }
   .contSearcher{
    display: flex;
    cursor: pointer;
    padding: 5px;
    background: blue;
    color: white;
    border-radius: 5px;
    margin: 2px 9px;
}

   
   .grupoch{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
    border: 1px solid #7f0000;
    padding: 0px;
    font-size: 11px;
    width: 108px;
    border-radius: 14px;
}
   
   .ContSearch{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    max-width: 800px;
    flex-flow: column;
   }


    .react-autosuggest__container{
      position: relative;
    border-radius: 6px;
    border: 2px solid #ffffff;
    box-shadow: -1px 5px 9px #418fe2;
    margin: 0px;
    margin-right: 20px;
  display:flex;
  
  align-items: center;
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





                    .flecharetro{
                      height: 40px;
                      width: 40px;
                      padding: 5px;
                    }
                .contGn{
                  display: flex;
                  flex-flow: column;
               
    background: white;
    width: 90%;
    border-radius: 31px;

            
                  align-items: center;
                  padding: 10px;
                }
                .Contsearcher{
                  width: 100%;
                  display: flex;
                  flex-flow: column;
                  justify-content: center;
                  align-items: center;
                }
                .contRespon{
                  width: 100%;
                  max-width: 800px;
                }
                .contcuentas{
                  padding: 5px;
                }
                .titilulo{
                  font-weight: bold;
                  font-size: 20px;
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
.fechacentral{
  width: 60%;
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

                   
                ` }
    </style>

</div>
        )
    }
}
