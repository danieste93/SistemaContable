import { Input } from '@material-ui/core';
import React, { Component } from 'react'
import {connect} from 'react-redux';


class ModalAddFormaPago extends Component {
   
state={
  CuentaSelect:"",
  CuentaId:"",
  CuentasHabiles:this.props.state.RegContableReducer.Cuentas,
  formaPagoAdd:"No",
  Detalles:"",
  Cantidad:"",
}
    componentDidMount(){
console.log(this.props)
if(this.props.tipoDeForma == "Contado"){

  if(this.props.data){
   
    this.setState({
      CuentaSelect:this.props.data.datos.Cuenta,
      CuentaId:this.props.data.datos.Cuenta._id,
      formaPagoAdd:this.props.data.datos.Tipo,
      Detalles:this.props.data.datos.Detalles,
      Cantidad:this.props.data.datos.Cantidad,
      Id:this.props.data.Id
    })
  }
 
}else if(this.props.tipoDeForma == "Credito"){
  if(this.props.dataCredit[0]){
    this.setState({
      CuentaSelect:this.props.dataCredit[0].Cuenta,
      CuentaId:this.props.dataCredit[0].Cuenta._id,
      formaPagoAdd:this.props.dataCredit[0].Tipo,
      Detalles:this.props.dataCredit[0].Detalles,
      Cantidad:this.props.dataCredit[0].Cantidad,
      Id:""
    })

  }
}
      setTimeout(function(){ 
        
        document.getElementById('editFormaCont').classList.add("entradaaddc")

       }, 500);
        
     
       let datos = {User: this.props.state.userReducer.update.usuario}
       let lol = JSON.stringify(datos)
       
        

      
      }
   
      Onsalida=()=>{
        document.getElementById('editFormaCont').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
     
      

      getCuentas=()=>{
       
        let cuentasFiltradas = this.props.state.RegContableReducer.Cuentas.filter(x => x.FormaPago == this.state.formaPagoAdd)
    
        if(cuentasFiltradas.length > 0){
          let cuentasrender = cuentasFiltradas.map((c, i)=>{

            return(
              <option value={c._id} key={i} >{c.NombreC}</option>
            )
          })
          return cuentasrender
        }else {
          return ""
        }


      } 
      handleChangeGeneralFormaPago=(e)=>{

        this.setState({
        [e.target.name]:e.target.value,
        CuentaSelect:"",
        CuentaId:"",
        })
        }
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        }
        handleChangeGeneralNumeros=(e)=>{

          this.setState({
          [e.target.name]:parseFloat(e.target.value)
          })
          }
        handleChangeCuentas=(e)=>{        
          let cuentax = this.state.CuentasHabiles.find(x=> x._id === e.target.value )
       
          this.setState({CuentaSelect:cuentax,CuentaId:e.target.value})
        }
        comprobarFormaPago=(e)=>{
        
          if(this.state.CuentaSelect == "" || this.state.CuentaId == ""){
            this.setState({cuentaError1:true})
          
          }else{
            this.setState({cuentaOk:true})
          }

          if(this.state.formaPagoAdd =="No"){
            this.setState({formaPagoError1:true})
          }   else{
            this.setState({formaPagoOk:true})
          }
          
          if(this.state.Cantidad <= 0){
            this.setState({CantidaError1:true})
          }   else{
            this.setState({cantidadOk:true})
          }
          
          if(this.state.CuentaSelect != "" && this.state.formaPagoAdd !="No" && this.state.Cantidad > 0){
            console.log("ejecutar")
            if(this.props.tipoDeForma == "Contado"){
              this.props.sendEditFormaPago(this.state)
            }else if(this.props.tipoDeForma == "Credito"){
              this.props.sendEditFormaCredito(this.state)
            }
            this.Onsalida()
          }
  
        }
    render () {
console.log(this.state)
let okC= this.state.cuentaOk?"okactive":""
let okCant= this.state.cantidadOk?"okactive":""
let okFP= this.state.formaPagoOk?"okactive":""

   let erroC1= this.state.cuentaError1?"erroractive":""
   let erroFP1= this.state.formaPagoError1?"erroractive":""
   let erroCant1= this.state.CantidaError1?"erroractive":""
        return ( 

         <div >

<div className="maincontacto" id="editFormaCont" >
            <div className="contcontacto"  >
        
            <div className="headercontact">
                <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                onClick={  this.Onsalida       }
                />
              <div className="tituloventa">
                
            <p> Editar Forma de Pago </p>
           
        </div>
     
        </div>

        <div className="contFormulario">
        <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Forma de pago  </p>
            
              </div>
              <div className={`cDc2 ${erroFP1}  ${okFP}  `} >
              <select name="formaPagoAdd"   className="customCantidad"  value={this.state.formaPagoAdd}onChange={this.handleChangeGeneralFormaPago} >
              <option value="No"> </option>
              <option value="Efectivo"> Efectivo</option>
                <option value="Transferencia"> Transferencia</option>
                <option value="Tarjeta-de-Credito"> Tarjeta de Crédito</option>
                <option value="Tarjeta-de-Debito">Tarjeta de Débito </option>




</select>




            
              </div>
              </div>
        <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cuenta  </p>
            
              </div>
              <div className={`cDc2 ${erroC1}  ${okC} `} >
              <select name="CuentaId"  className="customCantidad" value={this.state.CuentaId}onChange={this.handleChangeCuentas} >


<option value=""> </option>
{this.getCuentas()}



</select>




            
              </div>
              </div>
  
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Cantidad </p>
            
              </div>
              <div className={`cDc2 ${erroCant1} ${okCant}  `} >
            <input name="Cantidad" value={this.state.Cantidad} className='customCantidad' type='number' onChange={this.handleChangeGeneralNumeros} />




            
              </div>
              </div>
              <div className="grupoDatos">
        <div className="cDc1">
              <p style={{fontWeight:"bolder"}}>  Detalles </p>
            
              </div>
              <div className={`cDc2  `} >
            <input name="Detalles" value={this.state.Detalles}className='customCantidad' type='text' onChange={this.handleChangeGeneral} />
            
              </div>
              </div>
        </div>
        <div className="contbregis">

<button className=" btn btn-primary botonflex" 
onClick={(e)=>{
  e.preventDefault()
  e.stopPropagation()
  this.comprobarFormaPago()

}
  
  }>
<p>Guardar</p>
<span className="material-icons">
done
</span>

</button>

<button className=" btn btn-danger botonflex" onClick={()=>{
this.Onsalida()

}}>
<p>Cancelar</p>
<span className="material-icons">
cancel
</span>

</button>
</div>
     
        </div>
        </div>
           <style jsx>{`
           .erroractive{
             border-bottom:2px solid red
           }
           .okactive{
            border-bottom:2px solid green
          }
              .grupoDatos{
                display: flex;
                justify-content: space-around;
                margin-top: 15px;
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
  width: 40%;
  display: flex;
  align-items: flex-end;
  word-break: break-all;
  justify-content: flex-start;
  text-align: left;
  
}
   
.cDc2{
  margin-left:10px;
  width:50%;

 display: flex;
 align-items: flex-end;
 transition: 0.5s;
}
.cDc2 p{
  margin:0px;

}          


           .headercontact {
            width:100%;
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
       
   
             .contbregis{
              display: flex;
              justify-content: space-around;
              width: 50%;
              margin-bottom: 50px;
}
          }
        .maincontacto{
          z-index: 9999;
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
       .contcontacto{
        border-radius: 30px;
     
         width: 90%;
         background-color: white;
         display: flex;
         flex-flow: column;
         align-items: center;
       }
      .contFormulario{
        width: 80%;
        background: whitesmoke;
        padding: 20px;
        border-radius: 17px;
        font-size: 27px;
        margin: 20px;
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

      .customCantidad{
        width: 80%;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 5px 3px 1px black;
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

const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(ModalAddFormaPago);