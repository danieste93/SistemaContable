import React, { Component } from 'react'
import RegRep from "./SubCompos/regRep"
import postal from 'postal';
import {Animate} from "react-animate-mount"

class Contacto extends Component {
   state={
     Ingresos:[],
     Gastos:[],
     Trans:[],
     Repeticiones:{}
   }
   channel1 = null;
    componentDidMount(){
      this.channel1 = postal.channel();

      setTimeout(function(){ 
        
        document.getElementById('contrepeticiones').classList.add("entradaaddc")

       }, 500);
        
     
this.getRep()
      
      }
      getRep=()=>{
        
     
      if(this.props.rep.length > 0){
  
      //let data = reponse.rep[0].reg.Usuario.Nombre
      
      let CantidadIngresos =this.props.rep.filter(x=> x.reg.Accion == "Ingreso")
      let CantidadGastos = this.props.rep.filter(x=> x.reg.Accion == "Gasto")
      let CantidadTrans = this.props.rep.filter(x=> x.reg.Accion == "Trans")
     
      this.setState({Trans:CantidadTrans,Ingresos:CantidadIngresos,Gastos:CantidadGastos})
   

      }else{
        this.setState({
          Ingresos:[],
          Gastos:[],
          Trans:[],
        })
      }
        
              
         
      }
      Onsalida=()=>{
        document.getElementById('contrepeticiones').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      generadortituloTrans=()=>{
        if(this.state.Trans.length > 0){
          return (<div className="subtituloArt tituloRepeticiont "> Transferencias <style>{
            ` .tituloRepeticiont{ margin: 22px 0px 3px 0px; color:grey ;    text-align: left;}
            `
            }</style> </div>)
        }else return""
      }
      generadortituloIngreso=()=>{
        if(this.state.Ingresos.length > 0){
          return (<div className="subtituloArt tituloRepeticioni ">Ingresos <style>{
            ` .tituloRepeticioni{    margin: 22px 0px 3px 0px; color:darkgreen ;    text-align: left;}
            `
            }</style> </div>)
        }else return""
      }
      generadortituloGastos=()=>{
        if(this.state.Gastos.length > 0){
          return (<div className="subtituloArt tituloRepeticiong ">Gastos Totales<style>{
            ` .tituloRepeticiong{ margin: 0px 0px 3px 0px; color:darkred ;    text-align: left;}
            `
            }</style> </div>)
        }else return""
      }

    render () {
     
     let generadorTrans
     let generadorIng
     let generadorGas
     let generadorGasDiario = []
     let generadorGasSemanal= []
     let generadorGasMensual= []
     let generadorGasAnual= []    
     let sumaGasDiario = 0
     let sumaGasSemanal = 0
     let sumaGasMensual = 0
     let sumaGasAnual = 0

     let generadorTransDiario = []
     let generadorTransSemanal= []
     let generadorTransMensual= []
     let generadorTransAnual= []
     let sumaTransDiario = 0
    let sumaTransSemanal = 0
    let sumaTransMensual = 0
    let sumaTransAnual = 0


    let generadorIngresosDiario = []
    let generadorIngresosSemanal= []
    let generadorIngresosMensual= []
    let generadorIngresosAnual= []    
    let sumaIngresosDiario = 0
    let sumaIngresosSemanal = 0
    let sumaIngresosMensual = 0
    let sumaIngresosAnual = 0
    
     let sumarepIng = 0
     let sumarepGas = 0
     let sumarepTrans = 0
      if(this.state.Trans.length > 0){

        console.log(this.state.Trans)
        let  regsTransDiario = this.state.Trans.filter(x=>x.reg.Valrep =="Cada Día") 
        let  regsTransSemanal = this.state.Trans.filter(x=>x.reg.Valrep =="Cada Semana") 
        let  regsTransMensual = this.state.Trans.filter(x=>x.reg.Valrep =="Cada Mes") 
        let  regsTransAnual = this.state.Trans.filter(x=>x.reg.Valrep =="Cada Año") 

        if(regsTransDiario.length > 0){
          generadorTransDiario = regsTransDiario.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )

          })
          regsTransDiario.forEach(element => {            
            sumaTransDiario += parseFloat(element.reg.Importe.$numberDecimal)
                }); }

        if(regsTransSemanal.length > 0){
          generadorTransSemanal = regsTransDiario.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )

          })
          regsTransSemanal.forEach(element => {            
            sumaTransSemanal += parseFloat(element.reg.Importe.$numberDecimal)
                }); }
           if(regsTransMensual.length > 0){
          generadorTransMensual = regsTransMensual.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )

          })
          regsTransMensual.forEach(element => {            
            sumaTransMensual += parseFloat(element.reg.Importe.$numberDecimal)
                }); }
                if(regsTransAnual.length > 0){
                  generadorTransAnual = regsTransAnual.map((gen,i)=>{
                    return(           
                      <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
        
                  })
                  regsTransAnual.forEach(element => {            
                    sumaTransAnual += parseFloat(element.reg.Importe.$numberDecimal)
                        }); }

                        for (let i=0; i < this.state.Trans.length; i++ ){
                          sumarepTrans+= parseFloat(this.state.Trans[i].reg.Importe.$numberDecimal)
                          
                      }
     
      }
   
      if(this.state.Ingresos.length > 0){
   
        let  regsIngresosDiario = this.state.Ingresos.filter(x=>x.reg.Valrep =="Cada Día") 
        let  regsIngresosSemanal = this.state.Ingresos.filter(x=>x.reg.Valrep =="Cada Semana") 
        let  regsIngresosMensual = this.state.Ingresos.filter(x=>x.reg.Valrep =="Cada Mes") 
        let  regsIngresosAnual = this.state.Ingresos.filter(x=>x.reg.Valrep =="Cada Año") 
        
        if(regsIngresosDiario.length > 0){
          generadorIngresosDiario = regsIngresosDiario.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
  
          })
          regsIngresosDiario.forEach(element => {            
            sumaIngresosDiario += parseFloat(element.reg.Importe.$numberDecimal)
                }); }
  
        if(regsIngresosSemanal.length > 0){
          generadorIngresosSemanal = regsIngresosSemanal.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
  
          })
          regsIngresosSemanal.forEach(element => {            
            sumaIngresosSemanal += parseFloat(element.reg.Importe.$numberDecimal)
                }); }
           if(regsIngresosMensual.length > 0){
          generadorIngresosMensual = regsIngresosMensual.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
  
          })
          regsIngresosMensual.forEach(element => {            
            sumaIngresosMensual += parseFloat(element.reg.Importe.$numberDecimal)
                }); }
                if(regsIngresosAnual.length > 0){
                  generadorIngresosAnual = regsIngresosAnual.map((gen,i)=>{
                    return(           
                      <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
        
                  })
                  regsIngresosAnual.forEach(element => {            
                    sumaIngresosAnual += parseFloat(element.reg.Importe.$numberDecimal)
                        }); }
        
        for (let i=0; i < this.state.Ingresos.length; i++ ){
          sumarepIng += parseFloat(this.state.Ingresos[i].reg.Importe.$numberDecimal)
  
      }
      }
      if(this.state.Gastos.length > 0){

        console.log(this.state.Gastos)

      let  regsGasDiario = this.state.Gastos.filter(x=>x.reg.Valrep =="Cada Día") 
      let  regsGasSemanal = this.state.Gastos.filter(x=>x.reg.Valrep =="Cada Semana") 
      let  regsGasMensual = this.state.Gastos.filter(x=>x.reg.Valrep =="Cada Mes") 
      let  regsGasAnual = this.state.Gastos.filter(x=>x.reg.Valrep =="Cada Año") 
    

      
        if(regsGasDiario.length > 0){
          generadorGasDiario = regsGasDiario.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )

          })
                regsGasDiario.forEach(element => {            
                  sumaGasDiario += parseFloat(element.reg.Importe.$numberDecimal)
                }); }
        if(regsGasSemanal.length > 0){
        generadorGasSemanal= regsGasSemanal.map((gen,i)=>{
          return(           
            <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )

        })
                regsGasSemanal.forEach(element => {            
                sumaGasSemanal+= parseFloat(element.reg.Importe.$numberDecimal)
              }); }
        if(regsGasMensual.length > 0){
          generadorGasMensual= regsGasMensual.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
  
          })
          regsGasMensual.forEach(element => {            
                  sumaGasMensual+= parseFloat(element.reg.Importe.$numberDecimal)
                }); }
        if(regsGasAnual.length > 0){
          generadorGasAnual= regsGasAnual.map((gen,i)=>{
            return(           
              <RegRep key={i} reg={gen.reg} tiempo={gen.fechaEjecucion} id={gen._id} actualizar={()=>{this.getRep()}} /> )
  
          })
          regsGasAnual.forEach(element => {            
                  sumaGasAnual+= parseFloat(element.reg.Importe.$numberDecimal)
                }); }

        for (let i=0; i < this.state.Gastos.length; i++ ){
          sumarepGas+= parseFloat(this.state.Gastos[i].reg.Importe.$numberDecimal)
          
      }

      }

        return ( 

         <div >

<div className="maincontacto" id="contrepeticiones" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Repeticiones </p>
           
        </div>
     
        </div>
       
        <Animate show={this.state.Ingresos.length>0}>
<div className="contCentral">               
  <div className="contarriba">
  {this.generadortituloIngreso()}
 <span className="sumstyle">${sumarepIng.toFixed(2)}</span> 
  </div>
  <Animate show={generadorIngresosDiario.length > 0}>
  <div className="contarriba">
    <p className='subtituloreps ingEnf'>Ingresos Diarios</p>
    <span className="sumstylesub">${sumaIngresosDiario.toFixed(2)}</span> 
    </div>
  {generadorIngresosDiario}
  </Animate>
  <Animate show={generadorIngresosSemanal.length > 0}>
  <div className="contarriba">
    <p className='subtituloreps ingEnf'>Ingresos Semanales</p>
    <span className="sumstylesub">${sumaIngresosSemanal.toFixed(2)}</span> 
    </div>
  {generadorIngresosSemanal}
  </Animate>
  <Animate show={generadorIngresosMensual.length > 0}>
  <div className="contarriba">
    <p className='subtituloreps ingEnf'>Ingresos Mensuales</p>
    <span className="sumstylesub">${sumaIngresosMensual.toFixed(2)}</span> 
    </div>
  {generadorIngresosMensual}
  </Animate>
  <Animate show={generadorIngresosAnual.length > 0}>
  <div className="contarriba">
    <p className='subtituloreps ingEnf'>Ingresos Anuales</p>
    <span className="sumstylesub">${sumaIngresosAnual.toFixed(2)}</span> 
    </div>
  {generadorIngresosAnual}
  </Animate>
</div>
</Animate>
          <Animate show={this.state.Gastos.length>0}>
          <div className="contCentral">
        
            <div className="contarriba">
            {this.generadortituloGastos()}
           <span className="sumstyle">${sumarepGas.toFixed(2)}</span> 
            </div>
        
            <Animate show={generadorGasDiario.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps'>Gastos Diarios</p>
              <span className="sumstylesub">${sumaGasDiario.toFixed(2)}</span> 
              </div>
            {generadorGasDiario}
            </Animate>
            <Animate show={generadorGasSemanal.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps'>Gastos Semanales</p>
              <span className="sumstylesub">${sumaGasSemanal.toFixed(2)}</span> 
              </div>
            {generadorGasSemanal}
            </Animate>
            <Animate show={generadorGasMensual.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps'>Gastos Mensuales</p>
              <span className="sumstylesub">${sumaGasMensual.toFixed(2)}</span> 
              </div>
            {generadorGasMensual}
            </Animate>
            <Animate show={generadorGasAnual.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps'>Gastos Anuales</p>
              <span className="sumstylesub">${sumaGasAnual.toFixed(2)}</span> 
              </div>
            {generadorGasAnual}
            </Animate>
          </div>
          </Animate>
          <Animate show={this.state.Trans.length>0}>
          <div className="contCentral">               
            <div className="contarriba">
            {this.generadortituloTrans()}
           <span className="sumstyle">${sumarepTrans.toFixed(2)}</span> 
            </div>
            <Animate show={generadorTransDiario.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps transEnf'>Transferencias Diarios</p>
              <span className="sumstylesub">${sumaTransDiario.toFixed(2)}</span> 
              </div>
            {generadorTransDiario}
            </Animate>
            <Animate show={generadorTransSemanal.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps transEnf'>Transferencias Semanales</p>
              <span className="sumstylesub">${sumaTransSemanal.toFixed(2)}</span> 
              </div>
            {generadorTransSemanal}
            </Animate>
            <Animate show={generadorTransMensual.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps transEnf'>Transferencias Mensuales</p>
              <span className="sumstylesub">${sumaTransMensual.toFixed(2)}</span> 
              </div>
            {generadorTransMensual}
            </Animate>
            <Animate show={generadorTransAnual.length > 0}>
            <div className="contarriba">
              <p className='subtituloreps transEnf'>Transferencias Anuales</p>
              <span className="sumstylesub">${sumaTransAnual.toFixed(2)}</span> 
              </div>
            {generadorTransAnual}
            </Animate>
          </div>
          </Animate>
        </div>
        </div>
           <style jsx>{`
   .subtituloreps{
    margin: 0px 0px 3px 0px;
    color: #d60000;
    font-size: 16px;
    text-align: left;
   }
   .transEnf{
    color: grey;
   }
   .ingEnf{
    color: green;
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
  


   .contDatosC{
     display:flex;
     width: 100%;
   }

.cDc1{
  width:30%;
  text-align: right;
  
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
          z-index: 1000;
         width: 100vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
   
         justify-content: center;
         align-items: flex-start;
         transition:0.5s;
         overflow: scroll
         
       }
       .contcontacto{
        border-radius: 30px;
        padding: 25px 15px;
         width: 96%;
         background-color: white;
      
       }
      
     
      .contarriba{
        display: flex;
    align-items: center;
    width: 80%;
    margin-top: 25px;
    justify-content: space-between;
      }
    
     .sumstyle{
      font-size: 25px;
      font-weight: bold;
     }
     .sumstylesub{
      font-size: 16px;
      font-weight: bold;
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

      

          .titulocontactd{
            font-size:23px;
            font-weight:bolder;
            color:black;
            height: 35%;
          }
          .entradaaddc{
            left: 0%;
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
         .contcontacto{
          width: 95%;
         }
          }
          @media only screen and (min-width: 600px) { 
         

              .contcontacto{
       
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

export default Contacto