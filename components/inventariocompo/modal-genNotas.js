import React, { Component } from 'react'
import ArticuloNota from "./articuloNotas";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { CircularProgress } from '@material-ui/core';
import { Animate } from 'react-animate-mount/lib/Animate';
import {connect} from 'react-redux';
class Contacto extends Component {
   
state={
  ArtVent:this.props.datos.articulosVendidos,
  loading:false
}
    componentDidMount(){

      console.log(this.props)
      setTimeout(function(){ 
        
        document.getElementById('mainxx').classList.add("entradaaddc")

       }, 500);
        
      }
      ceroMaker=(val)=>{

        let cantidad = JSON.stringify(val).length
    
        let requerido = 9 - cantidad
    
        let gen = '0'.repeat(requerido)
     
        let added = `${gen}${JSON.stringify(val)}`
   
        return added
    }
      genNotaCredito=(SuperTotal)=>{

        this.setState({loading:true})
        
        let razon = this.props.state.userReducer.update.usuario.user.Factura.razon 
        let nombreComercial = this.props.state.userReducer.update.usuario.user.Factura.nombreComercial
        let ruc = this.props.state.userReducer.update.usuario.user.Factura.ruc
        let codDoc = "01"
        let estab =this.props.state.userReducer.update.usuario.user.Factura.codigoEstab
        let ptoEmi= this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
        let secuencial= this.ceroMaker(this.state.secuencialGen)
  //    let secuencial=  "000000034"
        let dirMatriz=this.props.state.userReducer.update.usuario.user.Factura.dirMatriz    
        let dirEstablecimiento=this.props.state.userReducer.update.usuario.user.Factura.dirEstab
        let obligadoContabilidad =this.props.state.userReducer.update.usuario.user.Factura.ObligadoContabilidad?"SI":"NO"
        let rimpeval = this.props.state.userReducer.update.usuario.user.Factura.rimpe?"        <contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>\n":""
        
        let tipoIdentificacionComprador = "07" // 04--ruc  05--cedula  06--pasaporte  07-VENTA A CONSUMIDOR FINAL  08--IDENTIFICACION DELEXTERIOR*//
        let razonSocialComprador ='CONSUMIDOR FINAL'
        let identificacionComprador ="9999999999999"
        let direccionComprador = " "


        if(this.state.UserSelect){
            tipoIdentificacionComprador=this.state.ClientID =="Cedula"?"05":
                                        this.state.ClientID == "RUC"?"04":
                                        this.state.ClientID =="Pasaporte"?"06":"07"
        razonSocialComprador = this.state.usuario
        identificacionComprador = this.state.cedula
        direccionComprador = this.state.direccion
        }

        let valorIVA = IvaEC.toFixed(2)
 
        let artImpuestos  = this.state.ArtVent.filter(x=>x.Iva)
        let artSinImpuestos = this.state.ArtVent.filter(x=>x.Iva == false)

        let totalSinImpuestos = 0
        let baseImpoConImpuestos = 0
        let baseImpoSinImpuestos = 0
        if(artImpuestos.length > 0){
            for(let i=0;i<artImpuestos.length;i++){
                totalSinImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
                baseImpoConImpuestos += (artImpuestos[i].PrecioCompraTotal /  parseFloat(`1.${process.env.IVA_EC }`))
            }
            
        }
        if(artSinImpuestos.length > 0){
            for(let i=0;i<artSinImpuestos.length;i++){
                totalSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
                baseImpoSinImpuestos += artSinImpuestos[i].PrecioCompraTotal
            }
        }
        
        let baseImponible =  SubTotal.toFixed(2) 




        let totalDescuento = TotalDescuento
        let codigo ="2" //IVA:2 ICE:3 IRBPNR:5
       
        let propina ="0.00"
        let importeTotal= SuperTotal.toFixed(2)
        let ambiente = "2"

        let s1 = this.props.state.userReducer.update.usuario.user.Factura.codigoEstab
        let s2 = this.props.state.userReducer.update.usuario.user.Factura.codigoPuntoEmision
        let serie = s1+""+s2
        let codNum ="12345678"//8 digitos
        let tiempo = new Date()    
        let mes = this.addCero(tiempo.getMonth()+1)
        let dia = this.addCero(tiempo.getDate())
        var date = dia+ "/"+ mes+"/"+tiempo.getFullYear()
        let fechaEmision =date
    
        let tipoEmision  = "1"
        let claveAcceso = dia+""+mes+""+tiempo.getFullYear()+""+codDoc+""+ruc+""+ambiente+""+serie+""+secuencial+""+codNum+""+tipoEmision
     

        let digVerificador =(claveAcceso)=>{

            let suma = 0
            let fact = 7

            for (let i =0;i<claveAcceso.length;i++){
                suma += claveAcceso[i] * fact
                if(fact == 2){
                    fact = 7
                }else{
                    fact--
                }
            }

       

            let dv = (11-(suma%11))
            if(dv ==10){
                return 1
            }else if(dv ==11 ){
                return 0
            }else{
                return dv
            }

        

        }


  
        let digitoverificador = digVerificador(claveAcceso)
        let clavefinal = claveAcceso +""+digitoverificador
   
   

        let xmlgenerator = 
       "<notaCredito id=\"comprobante\" version=\"1.0.0\">\n" +
    "    <infoTributaria>\n" +
        `        <ambiente>${ambiente}</ambiente>\n` +
        `        <tipoEmision>${tipoEmision}</tipoEmision>\n` +
        `        <razonSocial>${razon}</razonSocial>\n` +
        `         <nombreComercial>${nombreComercial}</nombreComercial>\n`+
        `        <ruc>${ruc}</ruc>\n`+
       `        <claveAcceso>${clavefinal}</claveAcceso>\n`+        
            `        <codDoc>${codDoc}</codDoc>\n`+
            `        <estab>${estab}</estab>\n`+
            `        <ptoEmi>${ptoEmi}</ptoEmi>\n`+
            `        <secuencial>${secuencial}</secuencial>\n`+
            `        <dirMatriz>${dirMatriz}</dirMatriz>\n`+
                      rimpeval +       
            `    </infoTributaria>\n`+
        `        <fechaEmision>{}</fechaEmision>\n` +
        `        <dirEstablecimiento>{}</dirEstablecimiento>\n` +
        `        <tipoIdentificacionComprador>{}</tipoIdentificacionComprador>\n` +
        `        <razonSocialComprador>{}</razonSocialComprador>\n` +
        `        <identificacionComprador>{}</identificacionComprador>\n` +
        `        <obligadoContabilidad>{}</obligadoContabilidad>\n` +
        `        <codDocModificado>{}</codDocModificado>\n` +
        `        <numDocModificado>{}</numDocModificado>\n` +
        `        <fechaEmisionDocSustento>{}</fechaEmisionDocSustento>\n` +
        `        <totalSinImpuestos>{}</totalSinImpuestos>\n` +
        `        <valorModificacion>{}</valorModificacion>\n` +
        `        <moneda>{}</moneda>\n` +
        "        <totalConImpuestos>\n" +
            "            <totalImpuesto>\n" +
                `                <codigo>{}</codigo>\n` +
                `                <codigoPorcentaje>{}</codigoPorcentaje>\n` +
                `                <baseImponible>{}</baseImponible>\n` +
                `                <valor>{}</valor>\n` +
            "            </totalImpuesto>\n" +
        "        </totalConImpuestos>\n" +
        `        <motivo>{}</motivo>\n` +
    "    </infoNotaCredito>\n" +
    "    <detalles>\n" +
        "        <detalle>\n" +
            `            <codigoInterno>{}</codigoInterno>\n` +
            `            <codigoAdicional>{}</codigoAdicional>\n` +
            `            <descripcion>{}</descripcion>\n` +
            `            <cantidad>{}</cantidad>\n` +
            `            <precioUnitario>{}</precioUnitario>\n` +
            `            <descuento>{}</descuento>\n` +
            `            <precioTotalSinImpuesto>{}</precioTotalSinImpuesto>\n` +
            "            <impuestos>\n" +
                "                <impuesto>\n" +
                    `                    <codigo>{}</codigo>\n` +
                    `                    <codigoPorcentaje>{}</codigoPorcentaje>\n` +
                    `                    <tarifa>{}</tarifa>\n` +
                    `                    <baseImponible>{}</baseImponible>\n` +
                    `                    <valor>{}</valor>\n` +
                "                </impuesto>\n" +
            "            </impuestos>\n" +
        "        </detalle>\n" +
    "    </detalles>\n" +
    "    <infoAdicional>\n" +
        `        <campoAdicional nombre=\"Dirección\">{}</campoAdicional>\n` +
        `        <campoAdicional nombre=\"Email\">{}</campoAdicional>\n` +
    "    </infoAdicional>\n" +
"</notaCredito>\n"
      }

      SetAll=(e)=>{
   
        let cantidad = parseFloat(e.cant)
   
        if(e.item.Tipo == "Producto" )
        {

           
            let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
            let indexset = this.state.ArtVent.indexOf(itemfind[0])
               
        let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
        deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
        deepClone[indexset].CantidadCompra =  parseFloat(e.CantidadGramos)
        deepClone[indexset].Unidad = e.unidad
        deepClone[indexset].PrecioCompraTotal = parseFloat(e.value)
        deepClone[indexset].PrecioVendido=  parseFloat(e.value) / parseFloat(e.cant)
            let valorcompar = 0
            if(this.state.ArtVent.length > 0){
                let findCombos = this.state.ArtVent.filter(x=>x.Tipo == "Combo")
            
                   if(findCombos){
                       findCombos.forEach(x=>{
                           let valCompra = x.CantidadCompra
                            x.Producs.forEach(i=>{
                             
                                if (i._id == e.item._id){
                                    if(i.Medida == "Unidad"){
      
                                        valorcompar  += (i.Cantidad*valCompra)
                                    }else if(i.Medida == "Peso"){
                                        if(i.Unidad == "Gramos"){
                                            valorcompar  += ((i.Cantidad* 1)*valCompra)
                                        }else if(i.Unidad == "Libras"){
                                            valorcompar  += ((i.Cantidad* 453.592)*valCompra)
                                        }else if(i.Unidad == "Kilos"){
                                            valorcompar  += ((i.Cantidad* 1000)*valCompra)
                                        }
                                    }
                                 
                                }
                            })
                         })
                   } 
               }
           
          
          
      
          

         
          this.setState({ArtVent:deepClone})
   
          


      }else if(e.item.Tipo == "Servicio"){
        let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
        let indexset = this.state.ArtVent.indexOf(itemfind[0])
           
    let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
    deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
    deepClone[indexset].PrecioCompraTotal = parseFloat(e.value)
    deepClone[indexset].PrecioVendido=  parseFloat(e.value) / parseFloat(e.cant)
    deepClone[indexset].CantidadCompra = parseFloat(e.cant)
    this.setState({ArtVent:deepClone})
  
      }else if(e.item.Tipo == "Combo"){
        let itemfind =  this.state.ArtVent.filter(x=>x.Eqid === e.item.Eqid)  
        let indexset = this.state.ArtVent.indexOf(itemfind[0])
        let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
        deepClone[indexset].CantidadCacl =  parseFloat(e.cant)
        deepClone[indexset].CantidadCompra = parseFloat(e.cant)
        let productosExedidos =[]
        let nuevoserrores = []
        let valorProducto = 0
        let valorCombos = 0
        for(let i=0;i<e.item.Producs.length;i++){
            if(this.state.ArtVent.length > 0){ 
               
                let findCombos = this.state.ArtVent.filter(x=>x.Tipo == "Combo" && x._id !=e.item._id )
                let productoagregado = this.state.ArtVent.filter(x=> x._id == e.item.Producs[i]._id)
    
          if(productoagregado.length > 0){
           
          if(productoagregado[0].Medida == "Unidad"){
            valorProducto = productoagregado[0].CantidadCompra
          }else if(productoagregado[0].Medida == "Peso"){
            if(productoagregado[0].Unidad == "Gramos"){
                valorProducto = parseFloat(productoagregado[0].CantidadCompra * 1)
            }else if(productoagregado[0].Unidad == "Libras"){
                valorProducto = parseFloat(productoagregado[0].CantidadCompra * 453.592)
            }else if(productoagregado[0].Unidad == "Kilos"){
                valorProducto = parseFloat(productoagregado[0].CantidadCompra * 1000)
           
          }
        }
  
   }
           
           if(findCombos.length > 0){
            
            findCombos.forEach(x=>{
                let valCompra = x.CantidadCompra
                 x.Producs.forEach(i=>{
                  
                     if (i._id == e.item._id){
                         if(i.Medida == "Unidad"){

                            valorCombos  += (i.Cantidad*valCompra)
                         }else if(i.Medida == "Peso"){
                             if(i.Unidad == "Gramos"){
                                valorCombos  += ((i.Cantidad* 1)*valCompra)
                             }else if(i.Unidad == "Libras"){
                                valorCombos  += ((i.Cantidad* 453.592)*valCompra)
                             }else if(i.Unidad == "Kilos"){
                                valorCombos  += ((i.Cantidad* 1000)*valCompra)
                             }
                         }
                      
                     }
                 })
              })
           }
     
            }
            let itemfind =  this.props.state.RegContableReducer.Articulos.filter(x=>x._id === e.item.Producs[i]._id)  
    
            let cantidadreq = 0
            if(e.item.Producs[i].Medida == "Unidad"){
                cantidadreq = e.item.Producs[i].Cantidad * parseFloat(e.cant)
            }else if(e.item.Producs[i].Medida == "Peso"){
               if(e.item.Producs[i].Unidad  =="Kilos"){
                cantidadreq =  (parseFloat(e.cant)*1000)
                  }else if(e.item.Producs[i].Unidad =="Libras"){
                    cantidadreq = (parseFloat(e.cant)*453.592)
                  }else if(e.item.Producs[i].Unidad =="Gramos"){
                    cantidadreq =  (parseFloat(e.cant))
                  }
            }
       
   
     let cantTotal=cantidadreq + parseFloat(valorCombos) +parseFloat(valorProducto)
     
       if(itemfind[0].Existencia >=  cantTotal){
        if(nuevoserrores.length >0){
        let idfind = nuevoserrores.findIndex(x=>  x.idProd == e.item.Producs[i]._id && x.idCombo == e.item._id   )
        nuevoserrores.filter( x => x.idProd != e.item.Producs[i]._id)
    }

       }else{
        let dataCombo = {idCombo:e.item._id,
            idProd:e.item.Producs[i]._id,
            Producto: e.item.Producs[i]}

         nuevoserrores.push(dataCombo)
         
      
       }
       
        }
      
    if(nuevoserrores.length > 0){
        let nombreComb = nuevoserrores.map(name =>(`${name.Producto.Titulo}, `))
        let message = `Los productos "${nombreComb}" son insuficientes para vender el combo` 
        let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:message
        }
        setTimeout(()=>{  
            this.setState({Alert: add,loading:false,outStock:true})},100)
      
    }
    let stock = false
    if(nuevoserrores.length > 0){
        stock = true
    }else{
        stock = false
    }
       
        this.setState({ArtVent:deepClone,
            ventasErrCombo:nuevoserrores,
            outStock:stock})
            this.saveToLocalStorage({ArtVent:deepClone})
      }
    }

    setPrecios=(e)=>{
           
      let indexset =  this.state.ArtVent.findIndex(x=>x._id === e.Id)  
      let deepClone = JSON.parse(JSON.stringify(this.state.ArtVent));
      deepClone[indexset].PrecioCompraTotal = parseFloat(e.Valor)
      deepClone[indexset].PrecioVendido=  parseFloat(e.Valor) / parseFloat(e.CantidadArts)
      this.setState({ArtVent:deepClone})

  }
   
      Onsalida=()=>{
        document.getElementById('mainxx').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {
let artsconIVA = 0
let artssinIVA = 0
let valSinIva = 0
let valConIva = 0
let SuperTotal = 0

      if(this.state.ArtVent.length > 0){
   
        artsconIVA = this.state.ArtVent.filter(x=>x.Iva == true)
         artssinIVA  = this.state.ArtVent.filter(x=>x.Iva == false)
         
         if(artsconIVA.length > 0){
             artsconIVA.forEach(x=>{
                 valConIva += x.PrecioCompraTotal
             })
         } 
         if(artssinIVA.length > 0){
          
             artssinIVA.forEach(x=>{
              
                 valSinIva += x.PrecioCompraTotal
             })
         } 
        
        }
        SuperTotal  = valSinIva +  valConIva
    let  generadorArticulosListaVenta = this.state.ArtVent.map((item, i) => (<ArticuloNota
        key={item._id}
         index={i}
         datos={item} 
         sendTipoPrecio={this.setTipoPrecio}
         sendPrecio={this.setPrecios}
         sendAll={this.SetAll} 
         deleteitem={(e)=>{
            let nuevoarr = this.state.ArtVent.filter(x => x.Eqid != e.Eqid)
           // let nuevosPrecios = this.state.arrPrecios.filter(x => x.Id != item._id) 
        
            this.setState({ArtVent:nuevoarr,  })
           
        }}
   
      
        />))
        return ( 

         <div >

<div className="maincontacto" id="mainxx" >
<div className="contcontacto"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Generar Nota de Credito 

</div>



</div> 
<div className="Scrolled">
<ValidatorForm
   
   onSubmit={this.regisUser}
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
<div className=" contTitulos ">
                <div className="Numeral">
                #
                        </div>
                        <div className="titulo2Artic ">
                            Nombre
                        </div>
                        <div className="ArticResPrecio ">
                            Cant
                        </div>
                        <div className="ArticResPrecio">
                            Tipo
                        </div>
                        <div className="ArticRes">
                            IVA
                        </div>
                        <div className="ArticRes">
                            Val
                        </div>
                        <div className="ArticRes ">
                              Acc
                        </div>
                        </div>   
                        
                        
                        {generadorArticulosListaVenta}                    
   </div>
   <div className={`cDc2 inputDes `}>
           <p className="totalp">${SuperTotal.toFixed(2)}</p>
       
         </div>

         <div className="contBotonPago">
               <button className={` btn btn-success botonedit2  `} onClick={()=>this.genNotaCredito(SuperTotal)}>
<p>Generar</p>
<i className="material-icons">
 assignment
</i>

</button>

<div style={{width:"50%"}}>
<Animate show={this.state.loading}>
<CircularProgress />
</Animate>
</div>
               </div>

</div>
</div>
        </div>
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
                     
                      height: 50vh;
                      padding: 5px;
                     
                     }

                     .contTitulos{
    display:flex;
 
    font-size: 20px;
    font-weight: bolder;
  const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
}
    .contventa{
    width: 80%;
        max-width: 920px;
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
                    margin-top: 20px;
                    display: flex;
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