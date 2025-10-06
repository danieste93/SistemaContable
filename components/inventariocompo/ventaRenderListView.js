
import {Animate} from "react-animate-mount"
import Dropdown from 'react-bootstrap/Dropdown';

import CustomDropdown from "./CustomDropdown"
import React, { useState,useEffect } from 'react';
const ArtRender = ({ Titulos,uploadToFact, datos,getNota,getNotaDeb, getRetencion, watchRetencion, watchNotaCredito, watchNotaDebito,deleteVentaList,user,resendProcess,sendView,viewCreds}) => {
  // Estado para controlar apertura/cierre del Dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [visual, setvisual] = useState(false );
  const [visualUploadFact, setvisualUploadFact] = useState(false );
  const [visualCred, setvisualCred] = useState(false );
  const [backGroundVent, setbackGroundVent] = useState("");
  const [visualProcess, setvisualProcess] = useState(false);
  const [visualNota, setvisualNota] = useState(false);
   const [visualRet, setvisualRet] = useState(false);
  const [visualNotaDeb, setvisualNotaDeb] = useState(false);
  const [watchNota, setwatchNota] = useState(false);
  const [watchNotaDeb, setwatchNotaDeb] = useState(false);
    const [watchRet, setwatchRet] = useState(false);

useEffect(() => {
console.log(datos)
setwatchNotaDeb(false);
setvisualNotaDeb(false);
setvisualNota(false);
setwatchNota(false);
setwatchRet(false);

if(datos.TipoVenta == "Credito"){
  setvisualCred(true)
  if(datos.FormasCredito.length > 0){
    let acc = 0
    datos.FormasCredito.forEach(element => {
      acc += parseFloat(element.Cantidad)
    });
      if(acc == datos.PrecioCompraTotal){
        setbackGroundVent("backGreen")
      }else{
        setbackGroundVent("backNaranja") 
      }


  }else{
    setbackGroundVent("backNaranja") 
  }

}
  if(datos.Estado == "AUTORIZADO"){
    setbackGroundVent("backGreen")
  }else if(datos.Estado == "EN PROCESO"){
    setbackGroundVent("backYellow")
    setvisualProcess(true)
  }

  if(user == "administrador" || user == "tesorero" ){
    setvisual(true)
  }

  if(datos.Doctype == "Factura-Electronica" &&datos.nombreCliente != "" &&datos.nombreCliente != "Consumidor Final" && (datos.Retencion == null || datos.Retencion == "") ){
  
    setvisualRet(true)
  }

  if(datos.Doctype == "Factura-Electronica" &&datos.nombreCliente != "" &&datos.nombreCliente != "Consumidor Final" && (datos.NotaCredito == null || datos.NotaCredito == "")){
  
    setvisualNota(true)
  }
   if(datos.Doctype == "Factura-Electronica" &&  datos.nombreCliente != "" &&datos.nombreCliente != "Consumidor Final" && (!datos.NotaDebito  || datos.NotaDebito == "")){

    setvisualNotaDeb(true)
  }
  if(datos.Doctype == "Factura-Electronica" &&datos.nombreCliente != "" && datos.NotaCredito && datos.NotaCredito.Doctype == "Nota-de-Credito"){
  
    setwatchNota(true)
  }

  if(datos.Doctype == "Factura-Electronica" &&datos.nombreCliente != "" && datos.NotaDebito && datos.NotaDebito.Doctype == "Nota-de-Debito"){

    setwatchNotaDeb(true)
    
  }
    if(datos.Doctype == "Factura-Electronica" &&datos.nombreCliente != "" && datos.Retencion && datos.Retencion.Doctype == "Retención-Recibida"){

    setwatchRet(true)
    
  }
  if(datos.Doctype == "Nota de venta" ){
  
    setvisualUploadFact(true)
  }



},[datos]);// fin del set effect


let ganancia=0
let valtotal =0
let valorinvertido =0
if(datos){
  for(let i=0;i<datos.articulosVendidos.length;i++){
    valtotal = datos.articulosVendidos[i].Precio_Compra *  datos.articulosVendidos[i].CantidadCompra

    valorinvertido += valtotal
  }

 ganancia = parseFloat(datos.PrecioCompraTotal) - parseFloat(valorinvertido)
 
}


    let buttonRender = ()=>{
        if(datos.Existencia < 1){
            return         <button style={{fontSize:"20px"}}  className="btn btn-danger mybtn " >-</button>
        }
        else{
            return         <button  style={{fontSize:"20px"}} className="btn btn-success mybtn " onClick={()=>{sendArt(datos)}}>+</button>
        }
     }
    let addCero=(n)=>{
        if (n<10){
          return ("0"+n)
        }else{
          return n
        }
      }

      let handleDeleteCompra=(e)=>{
       
      }
      let testTipe=()=>{
        if(datos.TipoVenta == "Contado"){
          return( <div className="valorD "> <p className="parrafoD miscien" style={{width:"140px"}}>  {datos.formasdePago.map((pago,i)=>(
            <div className='tituloart' key={i}>
              {pago.Cuenta.NombreC}      
            </div>))}    </p></div>)
        }else if(datos.TipoVenta == "Credito"){
          return( <div className="valorD "> <p className="parrafoD miscien" style={{width:"140px"}}> Crédito    </p></div>)
        }
      }

let tiempo = new Date(datos.tiempo);
const mesesCorto = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
let dia = addCero(tiempo.getDate());
let mesNombre = mesesCorto[tiempo.getMonth()];
let year = tiempo.getFullYear();
let horaNum = tiempo.getHours();
let horaStr = addCero(horaNum) + ':' + addCero(tiempo.getMinutes());
// Emoji de reloj dinámico según la hora
const getClockEmoji = (h) => {
  const clockEmojis = ['🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛'];
  const idx = ((h % 12) + 12) % 12;
  return clockEmojis[idx];
};
var date = (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgb(65, 143, 226)',
    borderRadius: '8px',
    padding: '4px 8px',
    fontSize: '15px',
    color: '#222',
    boxShadow: '0 1px 4px #e3e8ff',
    justifyContent: 'space-around'
  }}>
    <div style={{width:"45%"}}>
      <span style={{ }}>📅</span>
      <span style={{fontWeight:'500', color:"white"}}>{dia} {mesNombre}</span>
    </div>
    <div>
      <span style={{  fontSize:'20px'}}>{getClockEmoji(horaNum)}</span>
      <span style={{fontWeight:'500', color:'white'}}>{horaStr}</span>
    </div>
  </span>
);
    return (   
                 
                <div className="contVenta" onClick={()=>{
                  sendView(datos)
                }}>
<div className="firstcont">
<div className={`maincontdetalleVentas ${backGroundVent}  `} >

         <Animate show={Titulos}>
         <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD eqIdart"> 

                 
                      {datos.iDVenta}  
                      
                      </p></div>
                    
                 
                    </div>
</Animate>

                    <div className="contdetalleVenta" style={{display:"flex", flexFlow:"column"}}>
                         <Animate show={watchNota}>
                      <span style={{fontSize:"12px", border:"1px solid blue", borderRadius:"5px", textAlign:"center", width:"80px" }}>N.Crédito</span>  

                      </Animate>
                           <Animate show={watchNotaDeb}>
                      <span style={{fontSize:"12px", border:"1px solid blue", borderRadius:"5px", textAlign:"center", width:"80px" }}>N.Débito</span>  

                      </Animate>
                          <Animate show={watchRet}>
                      <span style={{fontSize:"12px", border:"1px solid blue", borderRadius:"5px", textAlign:"center", width:"80px" }}>Retención</span>  

                      </Animate>
                    <div className="valorD "> <p className="parrafoD doscincuenta">  {date}  </p></div>
                    
                 
                    </div>
       
         <div className="contdetalleVenta">
                    
                    <div className="valorD "> 
                    <p className="parrafoD doscincuenta"> 
                    {datos.articulosVendidos.map((art,i)=>(
                                        <div className='tituloart' key={i}>
                                          {art.Titulo}      
                                        </div>))}  </p></div>
                    
                 
                    </div>

<Animate show={Titulos}>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Doctype}  </p></div>
                    
                 
                    </div>

 </Animate>
 <Animate show={Titulos}>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Estado}  </p></div>
                    
                 
                    </div>
                    </Animate>
                     <Animate show={Titulos}>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Vendedor.Nombre}  </p></div>
                    
                 
                    </div></Animate>
              
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.nombreCliente}  </p></div>
                    
                 
                    </div>
                    
  <Animate show={Titulos}>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.TipoVenta}  </p></div>
                    
                 
                    </div>
</Animate>
                 <Animate show={Titulos}>
                    <div className="contdetalleVenta">
                    
                      {testTipe()}
                 
                    </div>
                   </Animate>
                    <div className="contdetalleVenta">
                
                    <div className="valorD miscien">

                    <Animate show={visual}>
                       <p className="parrafoD ">$ {ganancia.toFixed(2)}  </p>
                       </Animate>
                       </div>
             
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien">$ {datos.PrecioCompraTotal.toFixed(2)}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta miscien butondelete">
                          
                            <CustomDropdown
                            onClick={() => console.log(datos)}
                items={[
                  visualNota && {
                    key: `nota-credito-${datos.iDVenta}`,
                    label: 'Nota de Crédito',
                    icon: 'receipt',
                    className: 'btn btn-warning btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); getNota(datos); }
                  },
                  visualNotaDeb && {
                    key: `nota-debito-${datos.iDVenta}`,
                    label: 'Nota de Débito',
                    icon: 'post_add',
                    className: 'btn btn-success btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); getNotaDeb(datos); }
                  },
                  visualRet && {
                    key: `Retención-${datos.iDVenta}`,
                    label: 'Retención',
                    icon: 'money_off',
                    className: 'btn btn-warning btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); getRetencion(datos); }
                  },
                  watchNota && {
                    key: `ver-nota-credito-${datos.iDVenta}`,
                    label: 'Visualizar Nota de Crédito',
                    icon: 'receipt',
                    className: 'btn btn-info btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); watchNotaCredito(datos); }
                  },
                  watchNotaDeb && {
                    key: `ver-nota-debito-${datos.iDVenta}`,
                    label: 'Visualizar Nota de Débito',
                    icon: 'post_add',
                    className: 'btn btn-success btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); watchNotaDebito(datos); }
                  },
                  watchRet && {
                    key: `ver-retencion-${datos.iDVenta}`,
                    label: 'Visualizar Retención',
                    icon: 'money_off',
                    className: 'btn btn-warning btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); watchRetencion(datos); }
                  },
                  visualProcess && {
                    key: `reenviar-${datos.iDVenta}`,
                    label: 'Re-enviar',
                    icon: 'send',
                    className: 'btn btn-warning btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); resendProcess(datos); }
                  },
                  visualUploadFact && {
                    key: `generar-factura-${datos.iDVenta}`,
                    label: 'Generar Factura',
                    icon: 'send',
                    className: 'btn btn-info btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); uploadToFact(datos); }
                  },
                  visualCred && {
                    key: `abonos-${datos.iDVenta}`,
                    label: 'Abonos',
                    icon: 'payments',
                    className: 'btn btn-warning btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); viewCreds(datos); }
                  },
                  visual && {
                    key: `eliminar-${datos.iDVenta}`,
                    label: 'Eliminar',
                    icon: 'delete',
                    className: 'btn btn-danger btnDropDowm',
                    onClick: (e) => { e.stopPropagation(); deleteVentaList(datos); }
                  }
                ].filter(Boolean)}
              />
      
</div>
                   
  
         </div>
    </div>
           
               <style jsx>{`
                 
               .miniimg{
                width: 80px;
               }
                  .botoneralist{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    margin: 10px 0px;
                    width: 100px;
                   }

                .eqIdart{
                display:flex;
                flex-flow:column;
                    width: 85px;  
                }
                 .miscien{
                    width: 140px;
                    word-break: break-word;
                }
                  .contVenta{
                    display: inline-flex;
cursor:pointer;
       

            border-radius: 6px;
            margin-bottom:10px;
    border: 2px solid #a89f9f;
          border-bottom: 2px solid black;
            flex-wrap: wrap;
            justify-content: center;
        }
        .existenciaArtic{
          width: 131px;
    margin-right: 10px;
        }
        .backNaranja{
          background:orange;
        }
                          .contdetalleVenta {
                            display: flex;
                            flex-wrap: wrap;
                    justify-content: space-between;
                            margin:3px 0px;
               
                        }
                        .parrafoD{margin: 0}
                        .tituloD{
                      
                            font-weight:bolder;
                        margin-right:10px
                       
                        }
                        .valorD{
                        
                            word-break: break-all;
                           
                          
                        }
                   .mybtn{
                    padding: 4px;
                    margin: 3px;
                    height: 35px;
                   }
                   .botonera{
                       margin-top:15px;
                   }
                  
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
    justify-content: space-around;
        }
        .ItemListView{
            display: inline-flex;
            padding: 5px;
            overflow: hidden;
            margin: 5px 10px;
            border-radius: 6px;
          border-bottom: 2px solid black;
            flex-wrap: wrap;
            justify-content: center;
}
        }

        .doscincuenta{
            width: 230px;  
            margin-right:20px; 
            word-break: break-word;
        }
        

        .maincontdetalleVentas{
            display: flex;
            color: black;
         
            font-size: 20px;
       
            align-items: center;
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .contImagen {
            display: flex;
            align-items: center;
   margin-bottom:10px;
    border: 2px solid black;
    overflow: hidden;
      max-height: 500px;
    border-radius: 15px;
    max-width:300px;
    justify-content: center;
        }
        .backYellow{
          background: #fff4c1;
        }
        .backGreen{
          background: #dfffdf;
        }
        
        .butondelete{
          display: flex;
          justify-content: center;
         }
     `}</style>
        </div>
  
    )
}

export default ArtRender
