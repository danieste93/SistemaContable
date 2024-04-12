import React, { Component } from 'react'
import HelperFormapago from "./reusableComplex/helperFormaCred"
import {Animate} from "react-animate-mount"
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {connect} from 'react-redux';
import {updateVenta} from "../reduxstore/actions/regcont"
class Contacto extends Component {
   
state={
  loading:false,
  Fpago:[],
  Alert:{Estado:false},
  Tiempo:(new Date()).getTime()
}
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainviewcreds').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
      addAbono=(TotalAdeudado, TotalPagado)=>{
console.log(this.state)

if(this.state.loading == false){
  this.setState({loading:true})
  let TotalPago = 0
  if(this.state.Fpago.length > 0){

    for(let i = 0; i<this.state.Fpago.length;i++){
                    
      TotalPago += parseFloat(this.state.Fpago[i].Cantidad)
  }

  if(TotalPago > TotalAdeudado){
    let add = {
      Estado:true,
      Tipo:"warning",
      Mensaje:"El abono es mayor al total adeudado del credito"
  }
  this.setState({Alert: add, loading:false}) 

  }else{

    let data = {
      User: {DBname:this.props.state.userReducer.update.usuario.user.DBname},
      valoresCompra:this.props.datos,
      valstate:this.state
    }

    fetch("cuentas/addabono", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "x-access-token": this.props.state.userReducer.update.usuario.token
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {    console.log(response)
      if(response.status=="Error"){
        let add = {
          Estado:true,
          Tipo:"error",
          Mensaje:` ${response.message}`  
      }
      this.setState({Alert: add, loading:false}) 
      }
      else{
        let add = {
          Estado:true,
          Tipo:"success",
          Mensaje:"Abono Agregado"
        }
        this.setState({Alert: add, loading:false})
 
     this.props.dispatch(updateVenta(response.updateCredito));
     setTimeout(()=>{ this.Onsalida()},1000) 
    }
    
    
    })
 
 
 
 
    }


  }else{
                                        let add = {
                                            Estado:true,
                                            Tipo:"error",
                                            Mensaje:"Ingrese un metodo de pago"
                                        }
                                        this.setState({Alert: add, loading:false}) 
                                    }

}
      }
     
      Onsalida=()=>{
        document.getElementById('mainviewcreds').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
      renderCreds=()=>{
        if(this.props.datos.FormasCredito){
        if(this.props.datos.FormasCredito.length == 0){
        return(<div>No se ha abonado al Crédito</div>)
      }
        else{

          let generadorAbonos = this.props.datos.FormasCredito.map((item, i) =>{
            let tiempo =  new Date(item.Tiempo)  
            let mes = this.addCero(tiempo.getMonth()+1)
            let dia = this.addCero(tiempo.getDate())
            let date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
            let hora = tiempo.getHours()+" : "+   this.addCero(tiempo.getMinutes())
    
            let timeData= date +" || "+ hora 
            return(
<div className='contTitulos2Creds'>
<div className="Numeral ">
                {i+1}
                        </div> 
                        <div className="Artic150Fpago ">
                        {timeData}
                        </div>
                        <div className="Artic100Fpago ">
                        {item.Tipo}
                        </div>
                        <div className="Artic100Fpago ">
                        {item.Cuenta.NombreC}
                        </div>
                        <div className="Artic100Fpago ">
                        ${parseFloat(item.Cantidad).toFixed(2)}
                        </div>
   
                        
                        <style jsx >{`
                              .Numeral{
                                width: 5%;
                                min-width: 30px;
                                max-width: 60px;
                                align-items: center;
                                text-align: center;
                              }
                           .Artic150Fpago {
                            width: 25%;
                            min-width: 100px;
                            max-width: 150px;
                            align-items: center;
                            text-align: center;
                            word-break: break-word;
                        }
                             .contTitulos2Creds{
                              display:flex;
                             
                              font-size: 15px;
                           
                              justify-content: space-around;
                            
                              width: 100%;
                          }
                        
                        `}</style>
   
</div>
          )})
          return(generadorAbonos)

        }}
      }
      addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
    render () {
console.log(this.state)
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }

   let Inf = this.props.datos
   console.log(Inf)
   let now = new Date(Inf.tiempo)
   let año = now.getFullYear()
   let dia = this.addCero(now.getDate())
   let mes = this.addCero(now.getMonth() +1)
   
   let fecha =  `${dia} / ${mes} / ${año} ` 
let TotalPagado = 0
if(Inf.FormasCredito){
   if(Inf.FormasCredito.length > 0){
 
Inf.FormasCredito.forEach(element => {
  TotalPagado += parseFloat(element.Cantidad)
});


   }}
   let TotalAdeudado  = parseFloat(Inf.PrecioCompraTotal) - TotalPagado

   let Pagado = TotalAdeudado == 0?false:true

        return ( 

         <div >

<div className="maincontacto" id="mainviewcreds" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Visualizar Crédito - {this.props.datos.iDVenta} 

</div>



</div> 
<div className="Scrolled">
<div className="contHeader">
            <div className="contLogo">
           <img  className="empresaLogo" src={Inf.LogoEmp} />
         
            </div>
            <div className="contDataDetail">
            <div className="subtituloArtFT">
            {Inf.nombreComercial}
            </div>
         
            <div className="contdetail ContNumeracion">
            <div className="clave">
           Crédito Nº
            </div>
            <div className="valor">
            <span>{`  ${Inf.iDVenta}`}</span> 
            </div>
            </div>  
            <div className="contdetail">
            <div className="clave">
            Fecha:
            </div>
            <div className="valor">
            {fecha}
            </div>
            </div>          
            
            </div>
    </div>
    <div className="FinalData contMiddle">
        <div className="Cont2FactTo">
            <p className="enfData" >Generado a:</p>
            <span className="subenfData">{Inf.nombreCliente}</span>
            <span className="subenfData">{Inf.cedulaCliente}</span>
            <span className="subenfData">{Inf.direccionCliente}</span>
            <span className="subenfData">{Inf.ciudadCliente}</span>
        </div>
        <div className="Cont1FactTo">

        <p className="enfData" >Valor Total</p> 
        <span customTitulos2className="subenfData">${parseFloat(Inf.PrecioCompraTotal).toFixed(2)}</span> 
        <span className="subenfData">{}</span>
        <span className="subenfData">{}</span>

        </div>
    </div>
<div className='ContAbonos'>

  <span className='tituloArt'>Abonos</span>
  <div className="contContadoLista">
                          <div className=" customTitulos2Cred ">
                      <div className="Numeral ">
                #
                        </div> 
                        <div className="Artic150Fpago ">
                            Fecha
                        </div>
                        <div className="Artic100Fpago ">
                            Forma de Pago
                        </div>
                        <div className="Artic100Fpago ">
                            Cuenta
                        </div>
                        <div className="Artic100Fpago ">
                            Cantidad
                        </div>
                     
                        </div>
                        <div className="ContListaPagos">
                  {this.renderCreds()}
                  <div className='ContTotales'> 
                  <div className='contTitulos2Creds'>
                  <div className="Numeral ">
                  

                  </div>
                  <div className="Artic100Fpago ">
                  
                  </div>
                  <div className="Artic100Fpago ">
                  
                        </div>
                        <div className="Artic100Fpago ">
                      
                        </div>
                        <div className="Artic150Fpago enfTitle ">
                       Total Pagado:
                        </div>
                        <div className="Artic100Fpago enfTitle">
                       ${TotalPagado.toFixed(2)}
                        </div>
                  </div>
                  <div className='contTitulos2Creds'>
                  <div className="Numeral ">
                  
                  </div>
                  <div className="Artic100Fpago ">
              
                        </div>
                        <div className="Artic100Fpago ">
                  
                  </div>
                        <div className="Artic100Fpago ">
                        
                        </div>
                        <div className="Artic150Fpago enfTitle">
                   Adeudado:
                        </div>
                        <div className="Artic100Fpago  enfTitle">
                        ${TotalAdeudado.toFixed(2)}
                        </div>
                  </div>
                  </div>
                        </div>
                          </div>  
</div>
<Animate show={Pagado}>
<div className='ContAgregador AbonosPago'>

<HelperFormapago 
  valorSugerido={TotalAdeudado}
  onChange={(e)=>{this.setState(e)}}
/>
<div className="contBotonPago centrar">
<Animate show={!this.state.loading}>
 <button className={` btn btn-success botonedit2 `} onClick={()=>{this.addAbono(TotalAdeudado, TotalPagado)}}>
<p>Abonar</p>
<i className="material-icons">
payment
</i>

</button>
</Animate>

<Animate show={this.state.loading}>
<CircularProgress />
</Animate>

                    </div>
                   
</div>
</Animate>
</div>
</div>
        </div>
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
        <style jsx >{`
           .maincontacto{
            z-index: 1298;
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
            .Cont1FactTo{
              display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
-ms-flex-flow: column;
flex-flow: column;
-ms-flex-wrap: nowrap;
flex-wrap: nowrap;

          }
            .Cont2FactTo{

display: flex;

flex-flow: column;

flex-wrap: nowrap;
width: 300px;
          }
            .contcontacto{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
              .entradaaddc{
                left: 0%;
                }
                .contTitulos2Creds{
                  display:flex;
                 
                  font-size: 15px;
               
                  justify-content: space-around;
                
                  width: 100%;
              }
              .ContTotales{
                margin-top: 19px;
    font-size: 33px!important;

    font-weight: bold;
              }
            
                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
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
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 80vh;
                      padding: 5px;
                     
                     }
                     .FinalData{
                      display: -webkit-box;
                      display: -ms-flexbox;
                      display: flex;
                      margin-top: 2px;
                      margin-bottom: 10px;
                 
                      -webkit-box-pack: justify;
                          -ms-flex-pack: justify;
                              justify-content: space-between;
                  }
                  .customTitulos2Cred{
                    border-bottom: 2px solid black;
    padding-bottom: 5px;
    margin-bottom: 15px;
    border-radius: 10px; 
    background: #3bfff5;
    font-size:15px;
    display: flex;
    justify-content: space-around;
                  }
                       .FinalData p{
            font-weight: bolder;
            color: #1f177c;
            margin-bottom: 2px;
            font-size: 18px
        }
        .contHeader{   
          display: flex;
                justify-content: space-between;
       }
          .subenfData{
                display: inline-block;
         
                text-align: center;
                color: black;
                width: 100%;
                font-size:15px;
                
            }
            .enfData{
              text-transform: uppercase;
              color: black!important;
          margin-bottom: 10px;
          font-weight: bolder;
          text-align: center;
          width: 100%;
         
          }
                .contMiddle{
                font-size: 12px;
                margin-top: 5px;
                padding: 10px;
                border-radius: 15px;
                border: 1px solid black;
                border-bottom: 5px outset;
                margin-right: 10px;
                margin-left: 10px;
                padding-top: 0px;
                margin-bottom: 5px;
             }
               .contdetail{
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
        width: 290px;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
            }
       
          .Artic100Fpago {
            width: 18%;
            min-width: 80px;
            max-width: 100px;
            align-items: center;
            text-align: center;
        }
        .Numeral{
          width: 5%;
          min-width: 30px;
          max-width: 60px;
          align-items: center;
          text-align: center;
        }
        .Artic150Fpago {
          width: 25%;
          min-width: 120px;
          max-width: 150px;
          align-items: center;
          text-align: center;
          word-break: break-word;
      }
      .enfTitle{
        font-size: 20px;
      }
      .ContAbonos{
        width: 102vw;
        max-width: 1000px;
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
