import React, { Component } from 'react'
import Inggas from './inggasCuentas';

import moment from "moment";
export default class GenGroupRegs extends Component {
    render() {

console.log(this.props)
        let detallesrender=""
        let datex = this.props.Registros
       
       // let Counterregs = this.props.Registros.filter(x=>x.TiempoEjecucion == 0)

        let midata =[...datex]
       
        let midata_deepcopy = JSON.parse(JSON.stringify(midata));
    
      let reversemidata =midata_deepcopy.reverse()
    
    
        let nuevoSaldo = parseFloat(this.props.datosGene.saldo) - parseFloat(this.props.datosGene.balance) 

   
   
      

   
        
        for(let i=0;i<reversemidata.length;i++){
          if(reversemidata[i].TiempoEjecucion != 0){
          if(reversemidata[i].Accion == "Ingreso"){
            
            nuevoSaldo += reversemidata[i].Importe
    
          }else if(reversemidata[i].Accion == "Gasto"){
            nuevoSaldo -= reversemidata[i].Importe
       
          }else if(reversemidata[i].Accion == "Trans"){
          
            if(reversemidata[i].CuentaSelec.idCuenta == this.props.cuentaSelect._id){
              nuevoSaldo -= reversemidata[i].Importe
           
            } else if(reversemidata[i].CuentaSelec2.idCuenta == this.props.cuentaSelect._id){
           
              nuevoSaldo += reversemidata[i].Importe
             
            }

        } 
          reversemidata[i].SaldoVal = nuevoSaldo
        }else{
          reversemidata[i].SaldoVal = 0
        }
        }

      
     
        let finaldata =    JSON.parse(JSON.stringify(reversemidata));

        if(this.props.Registros.length > 0){
      const groups = _.groupBy(finaldata.reverse(), (item)=>{
              let view = new Date(item.Tiempo)
              let viewx = moment(view).startOf('day').format();
              return viewx
            });
       
            const groupArrays = Object.keys(groups).map((date,i) => {
              return {
                i,
                date,
                registros: groups[date]
              };
            });
       
            detallesrender =  groupArrays.map((grupo,i)=>{
              let reging = grupo.registros.filter(regsing => regsing.Accion == "Ingreso")
              let sumaing = 0
              if(reging.length > 0){
                for (let i=0; i < reging.length; i++ ){
                  sumaing = sumaing + reging[i].Importe
              } 
            }
            let regsgas = grupo.registros.filter(regsgas => regsgas.Accion == "Gasto")
    let sumagas = 0
    let sumatransgas = 0
    let sumatransing = 0

    if(regsgas.length > 0){
     for (let i=0; i < regsgas.length; i++ ){
        sumagas = sumagas + regsgas[i].Importe
       }
      }
    
      let regstrans = grupo.registros.filter(regsgas => regsgas.Accion == "Trans")   
      
      if(regstrans.length > 0){
        for (let i=0; i < regstrans.length; i++ ){
  
        if(this.props.cuentaSelect._id ==  regstrans[i].CuentaSelec.idCuenta){
      sumatransgas +=  regstrans[i].Importe
        
        }
        else if(this.props.cuentaSelect._id ==  regstrans[i].CuentaSelec2.idCuenta){
          sumatransing +=  regstrans[i].Importe
          } 
      }}

     


      
              var days = ['Dom.','Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.' ];
              let tiempo = new Date(grupo.date)
              var dayName = days[tiempo.getDay()];
              let addZ=(n)=>{return n<10? '0'+n:''+n;}
              let fecha = addZ(tiempo.getMonth()+ 1) + "." + tiempo.getFullYear()
        
            
              var numerodia=    addZ(tiempo.getDate())
              let generadorDias = ()=>{
                let color = dayName == 'Lun.'?"contgrey":
                            dayName == 'Mar.'?"contred":
                            dayName == 'Mie.'?"contorange":
                            dayName == 'Jue.'?"contblue":
                            dayName == 'Vie.'?"contgreen":
                            dayName == 'Sab.'?"contcian":"contfin"
                            return(<div className={`contGenDay  `}  >
                              <span className={`numeroDia  `} >
                              {numerodia}
                                  </span>
                              <span  className={`contNombredia ${color} `}>
                              {dayName}
                              </span>
                              <span className="fechacont">
{fecha}
                              </span>
                            </div>)
              }
              let regist = [...grupo.registros]
         
              let registrosInvetidos = regist
            
             let generadorRegistros = registrosInvetidos.map((detail,i)=>{

                let   elegido = <Inggas reg={detail} in={i} cuentaActual={this.props.cuentaSelect} saldoActive={false} />
                                  
   
                  return(elegido)
    })
             let superIng = sumaing + sumatransing
             let superGas = sumagas + sumatransgas
             return(<div className="SuperContGrupo" key ={i}>
                <div className="contGrupo">
                <div className="contenedorFecha">
                {generadorDias()}
                </div>
                <div className="contenedorImportes">
                  <div className="imporing">${superIng.toFixed(2)}</div>
                  <div className="imporgas">${superGas.toFixed(2)}</div>
                </div>
                </div>
                <div className="registrosConte">
              {generadorRegistros}
                </div>
              </div>)
            })
        }
        return (
            <div className="supercontreg">
                {detallesrender}
                <style >
                {   


`   .imporing{
 color: blue;
}
.imporgas{
 color: red;
}
.SuperContGrupo{
  width: 100%;
  padding: 2px;
  margin-bottom: 30px;

  border-radius: 15px;
}
.contGrupo {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid;
  border-radius: 5px;
  margin-bottom: 6px;
  padding: 5px;
 
}
.contenedorImportes{
  display: flex;
  width: 40%;
  justify-content: space-around;
}

.contNombredia{
 padding: 4px;
 box-shadow: -1px -1px 1px black;
 border-radius: 12px;
}
.numeroDia{
 font-size: 22px;
 margin-right: 8px;
 font-weight: bolder;
}
.contgrey {
 background: grey;
 color: white;
}
.contorange{
 background: darkorange;
 color: white;
}
.contblue{
 background: darkblue;
 color: white;
}
.contgreen{
 background: darkgreen;
 color: white;
}
.contred{
  background: darkred;
  color: white;
}
.contfin{
  background: #8f00fb;
  color: white;
}
.contcian{
  background:   #09aabb;
  color: white;
}
.registrosConte{
  width: 99%;
}

` }  </style>
            </div>
        )
    }
}
