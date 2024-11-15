
import {Animate} from "react-animate-mount"
import React, { useState,useEffect } from 'react';
const ArtRender = ({datos, deleteVentaList,user,resendProcess,downloadFact,sendView,viewCreds}) => {
  const [visual, setvisual] = useState(false );
  const [visualCred, setvisualCred] = useState(false );
  const [backGroundVent, setbackGroundVent] = useState("");
  const [visualProcess, setvisualProcess] = useState(false);
useEffect(() => {

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
});
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

let tiempo = new Date(datos.tiempo)    
let mes = addCero(tiempo.getMonth()+1)
let dia = addCero(tiempo.getDate())
var date = tiempo.getFullYear()+'-'+mes+'-'+ dia;         
var hora = addCero(tiempo.getHours())+" : "+   addCero(tiempo.getMinutes())
    return (   
                 
                <div className="contVenta" onClick={()=>{
                  sendView(datos)
                }}>
<div className="firstcont">
<div className={`maincontdetalleVentas ${backGroundVent}  `} >
         
         <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD eqIdart"> {datos.iDVenta}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD doscincuenta">  {date } // {hora }  </p></div>
                    
                 
                    </div>
       
         <div className="contdetalleVenta">
                    
                    <div className="valorD "> 
                    <p className="parrafoD doscincuenta"> 
                    {datos.articulosVendidos.map((art,i)=>(
                                        <div className='tituloart' key={i}>
                                          {art.Titulo}      
                                        </div>))}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Doctype}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Estado}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Vendedor.Nombre}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.nombreCliente}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.TipoVenta}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalleVenta">
                    
                      {testTipe()}
                 
                    </div>
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
                    <Animate show={visualCred}>
                    <button  className="btn btn-warning mybtn " onClick={(e)=>{ e.stopPropagation();viewCreds(datos)}}><span className="material-icons">payments          
</span></button>
</Animate>
                    <Animate show={visual}>
                    <button  className="btn btn-danger mybtn " onClick={(e)=>{  e.stopPropagation(); deleteVentaList(datos)}}><span className="material-icons">delete
</span></button>
</Animate>
<button  className="btn btn-info mybtn " onClick={(e)=>{ e.stopPropagation();downloadFact(datos)}}><span className="material-icons">
get_app
</span></button>
<Animate show={visualProcess}>
                    <button  className="btn btn-warning mybtn " onClick={(e)=>{ e.stopPropagation();resendProcess(datos)}}><span className="material-icons">
send
</span></button>
</Animate>
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
                    width: 85px;  
                }
                 .miscien{
                    width: 140px;
                    word-break: break-word;
                }
                  .contVenta{
                    display: inline-flex;
cursor:pointer;
            overflow: hidden;

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
