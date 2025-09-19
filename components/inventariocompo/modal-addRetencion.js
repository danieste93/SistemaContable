import React, { Component } from 'react'
import Xml2js from 'xml2js';
import moment from "moment";
import "moment/locale/es";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { CircularProgress } from '@material-ui/core';
import { Animate } from 'react-animate-mount/lib/Animate';
import {connect} from 'react-redux';

import fetchData from '../funciones/fetchdata'
import CryptoJS from "crypto-js";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import DoubleScrollbar from "react-double-scrollbar";

import {updateVenta, addRegs, updateCuentas} from "../../reduxstore/actions/regcont"

import ListaCompra2Render from './listCompra2RenderRet'

class Contacto extends Component {
   
state={
  
  loading:false,
    adicionalInfo:[],
    
  descargarNota:false,
     xmlData:{fechaAutorizacion:[""]},
     Comprobante:"",
  ClientID:"",
  secuencialGen:0,
  secuencialBase:0,
  Fpago: [{Cantidad:0}],
  Alert:{Estado:false},
  motivos: [
    { motivo: '', iva: true, valor: "" }
  ],
}
componentRef = React.createRef(); 
    componentDidMount(){

    
      
     
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);

this.getUserData()
        
      }

AgregarRetencion=async(totalRet)=>{
  this.setState({loading:true})

     let vendedorCont ={
                    Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
                    Id:this.props.state.userReducer.update.usuario.user._id,
                    Tipo:this.props.state.userReducer.update.usuario.user.Tipo,
                }
 let cuentaPago = this.props.datos.formasdePago[0].Cuenta

 let razon = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].razonSocial[0]
 let nombreComercial = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].nombreComercial[0]
 let ruc = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].ruc[0]
 let dirMatriz=this.state.Comprobante.comprobanteRetencion.infoTributaria[0].dirMatriz[0]    
 let secuencial = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].secuencial[0]
let estab = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].estab[0]
let ptoEmi = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].ptoEmi[0]
let clavefinal = this.state.Comprobante.comprobanteRetencion.infoTributaria[0].claveAcceso[0]
let numeroAuto = this.state.xmlData.numeroAutorizacion[0]
let fechaAuto = this.state.xmlData.fechaAutorizacion[0]

let razonSocialComprador = this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].razonSocialSujetoRetenido[0] 
let identificacionComprador = this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].identificacionSujetoRetenido[0]
let direccionComprador = this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].dirEstablecimiento[0]
let periodoFiscal = this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].periodoFiscal[0]
        let correoComprador = this.props.state.userReducer.update.usuario.user.Email

let fechaEmisionDocSustento = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].fechaEmisionDocSustento[0]
let fechaRegistroContable = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].fechaRegistroContable[0]
let numDocModificado = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].numDocSustento[0]
let numAutoDocSustento = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].numAutDocSustento[0]

let fechaEmision = this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].fechaEmision[0]
              
let totalSinImpuestos = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].totalSinImpuestos[0]
 let TotalRetenido = totalRet
 let retenciones = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].retenciones[0].retencion
let importeTotal = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].importeTotal[0]
let infoAdicional = this.state.Comprobante.comprobanteRetencion.infoAdicional ? this.state.Comprobante.comprobanteRetencion.infoAdicional[0].campoAdicional : []

    let PDFdata = {
                     Vendedor: vendedorCont,
                      cuentaPago,
                    Tiempo:new Date().getTime(),
                    _id:this.props.datos._id,
                    TotalRetenido,
                     IDVenta:this.props.datos.iDVenta,
                    ClaveAcceso:clavefinal, 
                    periodoFiscal,
                    retenciones,
                    infoAdicional,
                    importeTotal,
                    totalSinImpuestos,
                    numAutoDocSustento,
                    fechaRegistroContable,
                    dirMatriz,
                    numeroAuto,
                     fechaAuto,
                     fechaEmisionDocSustento, 
                     numDocModificado,
                     secuencial,
                       fechaEmision,
                       nombreComercial,
                       
                       Doctype: "Retención-Recibida",
                        razon ,
                        ruc,
                        estab,
                        ptoEmi,
                         razonSocialComprador,
                        identificacionComprador,
                        direccionComprador,
                        correoComprador,
                    
                         Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname}, 
                         Estado:"AUTORIZADO",
                      
                     };

 fetch('/cuentas/agregarRetencion', {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({
                      
                        PDFdata,
                    
                        Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 

                    }), // data can be `string` or {object}!
                    headers:{
                      'Content-Type': 'application/json',
                      "x-access-token": this.props.state.userReducer.update.usuario.token
                    }
                  }).then(res => res.json())
                  .catch(error => console.error('Error:', error))
                  .then(response => { 
                    console.log(response)
                    if(response.status== "Ok"){

                      this.props.dispatch(updateVenta(response.updateVenta));
                       this.props.dispatch(addRegs(response.arrRegsSend));
                        this.props.dispatch(updateCuentas(response.arrCuentas));
                        this.Onsalida()
                      let add = {
                        Estado:true,
                        Tipo:"success",
                        Mensaje:"Retencion agregada exitosamente"
                    }
                    this.setState({Alert: add,  loading:false, })

                    }
                 

                  })


                     }


       setChangeinput=(e)=>{
    
 this.setState({xmlData:{fechaAutorizacion:[""]},  Comprobante:"",})
        let selectedFile = this.componentRef.current.files[0];
           if(selectedFile.type=="text/xml")  {
 
 let readXml=null;
 let reader = new FileReader();
       reader.onload =  (e) => {
           
           readXml = e.target.result;
           let parserX = new Xml2js.Parser();
                        function validarFecha(fecha) {
                          const date = new Date(fecha);
                          return !isNaN(date.getTime()); // Verifica si la fecha es válida
                      }
        const findComprobanteYFecha = (obj) => {
          if (typeof obj !== 'object' || obj === null) return false;
      
          let resultado = {
              comprobante: null,
              fechaAutorizacion: null,
              numeroAutorizacion: null
          };
      
          for (const key in obj) {
          
              if (key === "comprobante" && Array.isArray(obj[key]) && obj[key].length > 0) {
                  resultado.comprobante = obj[key][0]; // Toma el primer comprobante
              }
              if (key === "numeroAutorizacion" && Array.isArray(obj[key]) && obj[key].length > 0) {

                resultado.numeroAutorizacion = obj[key][0]; // Toma el primer comprobante
                }
      
              if (key === "fechaAutorizacion" && Array.isArray(obj[key]) && obj[key].length > 0) {
                let fecha = obj[key][0]; // Tomar el primer elemento del array
                
                if (typeof fecha === "string" && validarFecha(fecha)) {
                  resultado.fechaAutorizacion = fecha;
              }
              
              
              }
      
              // Si encontró ambos valores, detiene la búsqueda
              if (resultado.comprobante && resultado.fechaAutorizacion && resultado.numeroAutorizacion) {
                
                return resultado;
              }
      
              // Si el valor es un objeto o array, busca recursivamente dentro
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                  const nestedResult = findComprobanteYFecha(obj[key]);
                  if (nestedResult.comprobante) resultado.comprobante = nestedResult.comprobante;
                  if (nestedResult.fechaAutorizacion) resultado.fechaAutorizacion = nestedResult.fechaAutorizacion;
                  if (nestedResult.numeroAutorizacion) resultado.numeroAutorizacion = nestedResult.numeroAutorizacion;
                  // Si encontró ambos valores en la recursión, retorna inmediatamente
                  if (resultado.comprobante && resultado.fechaAutorizacion&& resultado.numeroAutorizacion) {
                      return resultado;
                  }
              }
          }
      
          // Retorna el resultado, ya sea con valores encontrados o con `null`
          return resultado.comprobante || resultado.fechaAutorizacion|| resultado.numeroAutorizacion ? resultado : false;
         };
           parserX.parseString(readXml, (err, result) => {
              if (err) {
                console.error('Error al parsear XML:', err);
                return;
              }

             
              // Buscar cualquier objeto que tenga .comprobante[0]
              const getData = findComprobanteYFecha(result);
            
               if (getData && getData.comprobante && getData.fechaAutorizacion) {
                parserX.parseString(getData.comprobante, (err, xml) => {
                  if (err) {
                    console.error('Error al parsear comprobante:', err);
                    return;
                  }
                  console.log(xml)

            // Verificación del RUC del comprador
            let estructuraXml = {fechaAutorizacion:[getData.fechaAutorizacion],numeroAutorizacion:[getData.numeroAutorizacion]}
        if(xml.comprobanteRetencion){
           let numDocSustento = xml.comprobanteRetencion.docsSustento[0].docSustento[0].numDocSustento[0]

          let PtoEmi= this.props.datos.PtoEmi
          let Estab= this.props.datos.Estab
          let Secuencial= this.props.datos.Secuencial

        let  formatNumDocSustento = (PtoEm, Estab, secuencial) => {
  // Helper function to pad numbers with leading zeros
  const padNumber = (num, length) => {
    console.log(num)
    return num.toString().padStart(length, '0');
  };

  // Format the variables
  const formattedEstab = padNumber(Estab, 3);
  const formattedPtoEm = padNumber(PtoEm, 3);
  const formattedSecuencial = padNumber(secuencial, 9);

  // Concatenate and return the result
  return `${formattedEstab}${formattedPtoEm}${formattedSecuencial}`;
            };

          let genNumDocSustento = formatNumDocSustento(PtoEmi, Estab, Secuencial);
//numDocSustento == genNumDocSustento
          if(true){
            this.setState({ xmlData: estructuraXml, Comprobante: xml });

           }else{
            let add = {
                  Estado: true,
                  Tipo: "warning",
                  Mensaje: `No corresponde esta retencion a esta factura, El número de Factura es  ${genNumDocSustento}  y el de la Retención ${numDocSustento}`
                };
                this.setState({ Alert: add });
           }

          
     }else if(xml.factura){
         let add = {
                  Estado: true,
                  Tipo: "warning",
                  Mensaje: "Archivo .XML incompatible, es una Factura"
                };
                this.setState({ Alert: add });
     }else{
         let add = {
                  Estado: true,
                  Tipo: "error",
                  Mensaje: "Archivo .XML incompatible"
                };
                this.setState({ Alert: add });
     }
                });
              }    else {
                // Si no encuentra comprobante, muestra un mensaje de error
                let add = {
                  Estado: true,
                  Tipo: "error",
                  Mensaje: "Archivo .XML incompatible, enviar el archivo al soporte para agregar compatibilidad"
                };
                this.setState({ Alert: add });
              }




          })

                       }           

  reader.readAsText(selectedFile);
       }else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Solo son validos los archivos .xml"
        }
        this.setState({Alert: add}) 
        }
      }
        
      

      handleChangeCheckbox=()=>{
        this.setState({descargarNota:!this.state.descargarNota})
            }
            handleDeleteMotivo = (index) => {
  const motivos = [...this.state.motivos];
  motivos.splice(index, 1);
  // Siempre debe haber al menos un motivo
  if (motivos.length === 0) {
    motivos.push({ motivo: '', iva: false, valor: '' });
  }
  this.setState({ motivos });
};
          decryptData = (text) => {
                 
                  const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
                  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                 
                  return (data)
                };
                
      getUserData=async(val)=>{

let data = await fetchData(this.props.state.userReducer,
    "/public/getClientData",
    this.props.datos.idCliente)

    this.setState({ClientID:data.Client.TipoID,
             

    })
       }
       addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }
     

  






  

   
      handleChangeGeneral=(e)=>{

        this.setState({
        [e.target.name]:e.target.value
        })
        } 
      
    

  
  handleIvaSwitch = (index) => {
  const motivos = [...this.state.motivos];
  motivos[index].iva = !motivos[index].iva;
  this.setState({ motivos });
};
handleAddMotivo = () => {
  if (this.state.motivos.length < 6) { // máximo 6 motivos, puedes cambiar el límite
    this.setState({
      motivos: [...this.state.motivos, { motivo: '', iva: false, valor: '' }]
    });
  }
};
handleMotivoChange = (index, field, value) => {
  const motivos = [...this.state.motivos];
  motivos[index][field] = value;
  this.setState({ motivos });
};
   
      Onsalida=()=>{
        document.getElementById('mainxx').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {
let listaCompra = ""
let totalRet = 0;
 console.log(this.props)
 console.log(this.state )
        if(this.state.Comprobante !=""){
             
try {
  const docs =
    this.state?.Comprobante?.comprobanteRetencion?.docsSustento?.[0]?.docSustento?.[0]
      ?.retenciones?.[0]?.retencion || [];
  totalRet = docs.reduce((sum, r) => {
    const v = parseFloat((r?.valorRetenido?.[0]) || 0);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
} catch (e) {
  totalRet = 0;
}
                listaCompra = this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].retenciones[0].retencion.map((item, i)=>{
                  return(<ListaCompra2Render
                    index={i} 
                    key={i} 
                   datos={item}
                    />
                 )
                })
      

            }
        console.log(this.state)

const handleClose = (event, reason) => {
    let AleEstado = this.state.Alert
    AleEstado.Estado = false
    this.setState({Alert:AleEstado})
   
}
const Alert=(props)=> {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  
        return ( 

         <div >

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Agregar Retención

</div>



</div> 
<div className="Scrolled">
<ValidatorForm
   
   onError={errors => console.log(errors)}
>
<div className="contenidoForm">
    <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
account_circle
</span>
</div>
      <TextValidator
       label="Nombre"
       name="usuario"
       type="text"         
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.props.datos.nombreCliente}
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
mail
</span>
</div>
      <TextValidator
      label="Correo"
    
       name="correo"
       type="mail"
   
       validators={['requerido']}
       errorMessages={['Escribe un correo'] }
      
       value={this.props.datos.correoCliente}
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>

   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    house
</span>
</div>
      <TextValidator
      label="Dirección"
      
       name="direccion"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa un nombre'] }
       value={this.props.datos.direccionCliente
       }
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>
  
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
      <TextValidator
      label="Número Identificación"
      
       name="cedula"
       type="text"
       validators={['requerido']}
       errorMessages={['Ingresa '] }
       value={this.props.datos.cedulaCliente       }
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>
   <div className="customInput">
   <div className="jwminilogo">
    <span className="material-icons">
    perm_identity
</span>
</div>
   <select className="ClieniDInput" value={this.state.ClientID}  >
          <option value="Cédula"> Cédula</option>
    <option value="RUC" > RUC </option>
    <option value="Pasaporte" > Pasaporte </option>
         </select>
   
   </div>

      

   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
phone
</span>
</div>
      <TextValidator
      label="Teléfono"
       
       name="telefono"
       type="number"
       validators={[]}
       errorMessages={[]}
       value={this.props.datos.telefonoCliente}
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>
 
  
   <div className="customInput">
        <div className="jwminilogo">
    <span className="material-icons">
    location_city
</span>
</div>
      <TextValidator
      label="Ciudad"
       name="ciudad"
       type="text"
       validators={[]}
       errorMessages={[] }
       value={this.props.datos.ciudadCliente }
       InputProps={{
        readOnly: true,
      }}
   />
   
   
   </div>

   </div>
  
</ValidatorForm>
<div className="contventa">

<div className="Contxml" style={{ textAlign: 'center' }}>
          <label 
            htmlFor="myfile" 
            style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Seleccione un xml:
          </label>
          <input
            ref={this.componentRef}
            type="file"
            id="myXMLfile"
            name="myXMLfile"
            onChange={this.setChangeinput}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              background: 'linear-gradient(145deg, #e0e0e0, #ffffff)',
              boxShadow: '5px 5px 10px #babecc, -5px -5px 10px #ffffff',
              transition: 'all 0.3s ease',
              color: '#007BFF',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => {
              e.target.style.boxShadow = 'inset 5px 5px 10px #babecc, inset -5px -5px 10px #ffffff';
              e.target.style.background = 'linear-gradient(145deg, #d1d9e6, #ffffff)';
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = '5px 5px 10px #babecc, -5px -5px 10px #ffffff';
              e.target.style.background = 'linear-gradient(145deg, #e0e0e0, #ffffff)';
            }}
          />
        </div>

    <Animate show={this.state.Comprobante != ""}>

        <div className="contAgregadorCompras">
                       <DoubleScrollbar>
      <div className="contTitulosaddFact ">
                  
                        
                        <div className="Artic100Fpago">
                           Numero Fact
                        </div>
                        <div className="Artic100Fpago ">
                            Fecha Emisión
                        </div>
                        <div className="Artic100Fpago ">
                            Ejercicio Fiscal
                        </div>
                        <div className="Artic100Fpago ">
                            Base imponible Retención
                        </div>
                         <div className="Artic100Fpago ">
                            Impuesto
                        </div>
                        <div className="Artic100Fpago ">
                            Porcentaje Retención
                        </div>
                        <div className="Artic100Fpago ">
                            Valor Retenido
                        </div>
                        </div>
                        <div className="jwFlex">
                        <div className="jwFlex">
<div className="Artic100">   {this.state.Comprobante != "" ? this.state.Comprobante.comprobanteRetencion.docsSustento[0].docSustento[0].numDocSustento[0] : ""} </div>
<div className="Artic100">   {this.state.Comprobante != "" ? this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].fechaEmision : ""} </div>
<div className="Artic100">   {this.state.Comprobante != "" ? this.state.Comprobante.comprobanteRetencion.infoCompRetencion[0].periodoFiscal: ""} </div>

                        </div>
                        <div> 

{listaCompra}
                        </div>
   
                        </div>
                {/* Bloque del total (imponente) */}
         <div className="totalRow">
           <div className="totalLabel">Total Retenido:</div>
           <button className="totalBtn">${totalRet.toFixed(2)}</button>
         </div>
                           
            </DoubleScrollbar> 

 

           <div className="contBotonPago">
             <Animate show={this.state.loading}>
  <CircularProgress />
  </Animate>
  <Animate show={!this.state.loading}>
   <button style={{maxWidth:"200px"}} className={` btn btn-success botonedit2 `} onClick={()=>{this.AgregarRetencion(totalRet )}}>
<p>Agregar</p>
<i className="material-icons">
add
</i>

</button>
  </Animate>
                 
</div>   

      </div>

    </Animate>



</div>

 


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
            z-index: 1299;
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
              justify-content: space-around;
              align-items: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
                  .contenidoForm {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                      .customInput {
                    display: flex;
                    align-items: center;
                    margin: 5px 10px;
                    justify-content: center;
                    width: 250px;
                }
              .entradaaddc{
                left: 0%;
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
                     
                      height: 70vh;
                      padding: 5px;
                     
                     }

                     .contTitulos{
    display:flex;
 
    font-size: 20px;
    font-weight: bolder;
  
  
}
    .contventa{
    margin-top: 50px;
    width: 100%;
   
    }
     .tituloArtic{
    width: 250px;  
}
.titulo2Artic{
    width: 50%;  
    max-width: 300px;
    text-align:center;
    min-width: 250px;
 
}
    .contsecuencial input{
    border-radius: 26px;
    padding: 7px;
    text-align:center
}
             .btnAdicional {
    display: inline-flex;
    align-items: center;
 width: 150px;
    background-color: white;
    color: #333;
    border: none;
    border-radius: 8px;
    padding: 5px 9px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }

  .btnAdicional:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }

  .percentInput{
                    width: 30%;
                }
.ArticResPrecio{
   
    width: 15%;  
    max-width:150px;
    min-width: 100px;
    justify-content: center;
    text-align: center;
}     
    .ArticRes{
    
    width: 10%;  
    align-items: center;
    max-width:150px;
    min-width: 100px;
    justify-content: center;
    text-align: center;
}  
     .totalRow{
                 display:flex;
                 justify-content:flex-end;
                 align-items:center;
                 gap:12px;
                 width:100%;
                 margin:12px 0;
               }
               .totalLabel{
                 font-weight:800;
                 font-size:18px;
                 color:#222;
               }
               .totalBtn{
                 background: linear-gradient(90deg,#ff7a18,#ff4e50);
                 color:#fff;
                 font-weight:900;
                 font-size:18px;
                 padding:10px 20px;
                 border-radius:12px;
                 box-shadow: 0 6px 18px rgba(255,78,80,0.28);
                 border:none;
                 cursor:default;
               }
               .totalBtn:active{ transform: translateY(1px); }
               
    .totalp{
    text-align: center;
    font-size: 28px;
    font-weight: bolder;
    margin-bottom: 0px;
}     
     .inputDes{
            border-radius:5px;
            width: 50%;
            overflow: hidden;
            max-width: 150px;
        }     
             .contBotonPago{
                    margin: 20px 0px;
                    display: flex;
                    width: 200px;
                    flex-flow: column;
                    align-items: center;
                    justify-content: space-around;
                }
                       .botonedit2{
                    display:flex;
                    padding:5px;
              
                    border-radius: 20px;
                    box-shadow: -2px 3px 3px black;
                    justify-content: space-around;
                    width: 200px;
                }
                    .contTotal{
                    display: flex;
    margin: 12px 26px;
    justify-content: flex-end;
                    }

                .contDual{
                    display: flex;
    margin: 10px 0px;
    border: 1px solid red;
    width: 200px;
    border-radius: 10px;
    justify-content: center;}
                  
                   .inputMotivoElegante {
  width: 90%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  font-size: 16px;
  background: #f5faff;
  transition: border 0.2s;
}
.inputMotivoElegante:focus {
  border: 2px solid #1976d2;
  outline: none;
}
.inputValorElegante {
  width: 80px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  font-size: 16px;
  background: #f5faff;
  transition: border 0.2s;
}
.inputValorElegante:focus {
  border: 2px solid #1976d2;
  outline: none;
}
.btnAddMotivo {
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
   .contTitulosaddFact{
    display:flex;
   margin-top: 10px;
    font-size: 15px;
    font-weight: bolder;  
    /* visual only */
    background: linear-gradient(180deg, rgba(250,251,255,0.9), rgba(245,247,255,0.85));
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(12, 24, 48, 0.06);
    border: 1px solid rgba(10,20,40,0.05);
    color: #0b1720;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
.contAgregadorCompras{
  display:flex;
  flex-flow: column;
  overflow-x: scroll;
      align-items: center;
}
    .Artic100Fpago{
   width: 120px;
  min-width: 120px;
    align-items: center;
    text-align:center;
     /* visual only */
     background: linear-gradient(180deg, #ffffff, #fbfdff);
     border: 1px solid rgba(40,130,60,0.12);
     border-radius: 8px;
     box-shadow: 0 4px 10px rgba(10,20,40,0.03);
     color: #0b2a16;
     font-weight: 800;
     margin: 6px;
}
      .Artic100{
      margin: 6px;
     word-break: break-all;
    width: 120px;
    display: flex;
    align-items: center;
    text-align:center;
    border: 1px solid #1976d2;
    justify-content: center;
}
  .btnDeleteMotivo {
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.btnAddMotivo:disabled {
  background: #b0bec5;
  cursor: not-allowed;
}
.filaMotivo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 22px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.switch input:checked + .slider {
  background-color: #1976d2;
}
.switch input:checked + .slider:before {
  transform: translateX(16px);
}
  .confirm-button.enabled {
  background-color: #10b981; /* Verde vibrante */
  color: white;
}

.confirm-button.enabled:hover {
  background-color: #059669;
  transform: scale(1.02);
}

.confirm-button.disabled {
  background-color: #d1fae5; /* Verde opaco */
  color: #6b7280;
  cursor: not-allowed;
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