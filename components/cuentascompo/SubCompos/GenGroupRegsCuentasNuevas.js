import React, { Component } from 'react'
import Inggas from './inggasCuentas';
import { connect } from 'react-redux';
import { addVenta } from '../../../reduxstore/actions/regcont';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import moment from "moment";
 class GenGroupRegs extends Component {
    render() {


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
              let reging = grupo.registros.filter(regsing => regsing.Accion == "Ingreso"&& regsing.TiempoEjecucion != 0)
              let sumaing = 0
              if(reging.length > 0){
                for (let i=0; i < reging.length; i++ ){
                  sumaing = sumaing + (parseFloat(reging[i].Importe) || 0)
              } 
            }
            let regsgas = grupo.registros.filter(regsgas => regsgas.Accion == "Gasto"&& regsgas.TiempoEjecucion != 0)
    let sumagas = 0
    let sumatransgas = 0
    let sumatransing = 0

    if(regsgas.length > 0){
     for (let i=0; i < regsgas.length; i++ ){
        sumagas = sumagas + (parseFloat(regsgas[i].Importe) || 0)
       }
      }
    
      let regstrans = grupo.registros.filter(regsgas => regsgas.Accion == "Trans")   
      
      if(regstrans.length > 0){
        for (let i=0; i < regstrans.length; i++ ){
  
        if(this.props.cuentaSelect._id ==  regstrans[i].CuentaSelec.idCuenta){
      sumatransgas +=  (parseFloat(regstrans[i].Importe) || 0)
        
        }
        else if(this.props.cuentaSelect._id ==  regstrans[i].CuentaSelec2.idCuenta){
          sumatransing +=  (parseFloat(regstrans[i].Importe) || 0)
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
         
              let registrosInvetidos = regist.sort((a, b) => b.Tiempo - a.Tiempo);
            
              let generadorRegistros = registrosInvetidos.length > 0 
              ? registrosInvetidos.map((detail, i) => (
                  <CSSTransition
                    key={detail._id || i}
                    timeout={500}
                    classNames="fade"
                  >
                    <Inggas
                     stateData={this.props.state}
                    addVenta={(e) => this.props.dispatch(addVenta(e))}
                      reg={detail}
                      in={i}
                      cuentaActual={this.props.cuentaSelect}
                      saldoActive={this.props.datosGene.saldoActive}
                    />
                  </CSSTransition>
                ))
              : (
                  <CSSTransition
                    key="placeholder"
                    timeout={500}
                    classNames="fade"
                  >
                    <div className="placeholder">No hay registros</div> {/* Placeholder */}
                  </CSSTransition>
                );
             let superIng = sumaing + sumatransing
             let superGas = sumagas + sumatransgas
             return(<div className="SuperContGrupo" key ={i}>
                <div className="contGrupo">
                <div className="contenedorFecha">
                {generadorDias()}
                </div>
                <div className="contenedorImportes">
                  <div className="imporing">${(parseFloat(superIng) || 0).toFixed(2)}</div>
                  <div className="imporgas">${(parseFloat(superGas) || 0).toFixed(2)}</div>
                </div>
                </div>
                <div className="registrosConte">
                <TransitionGroup>
    {generadorRegistros}
  </TransitionGroup>
                </div>
              </div>)
            })
        }
        return (
            <div className="supercontreg">
                {detallesrender}
                <style >
                {  
                 


`  

.supercontreg{
    width: 100%;
    max-width: 800px;

}

.imporing{
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


.fade-enter {
  opacity: 0;
  transform: translateY(-10px); /* Efecto de desplazamiento */
}
.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 500ms, transform 500ms; /* Tiempo y tipo de transición */
}

/* Animación para los elementos que salen */
.fade-exit {
  opacity: 1;
  transform: translateY(0);
}
.fade-exit-active {
  opacity: 0;
  transform: translateY(-10px); /* Efecto de desplazamiento al salir */
  transition: opacity 500ms, transform 500ms;
}

` }  </style>
            </div>
        )
    }
}

const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(GenGroupRegs);
