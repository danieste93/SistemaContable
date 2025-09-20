import * as ReactDOMServer from 'react-dom/server'


const genProds = (arts, Inf)=>{
    
let mapeador = arts.map((item)=>{
  
    let precioGenerado = item.Iva?((item.PrecioVendido / parseFloat(`1.${process.env.IVA_EC }`))).toFixed(2)
    : (item.PrecioVendido).toFixed(2)
   
    let precioVentaFinal = item.Iva?(item.PrecioCompraTotal / parseFloat(`1.${process.env.IVA_EC }`)).toFixed(2)
    : (item.PrecioCompraTotal).toFixed(2)
  
    return(<div class="ContDetalle">
        <div class="divigualTitulo">
        {item.Titulo}
        </div>
        <div class="divigual">
        {item.CantidadCompra}
        </div>
        <div class="divigual">
        {precioGenerado}
        </div>
        <div class="divigual">
        {precioVentaFinal}
        </div>
        <style> {`
      
      
               .divigualCantidad{
            width: 70px; 
            text-align: center;
        }
        
        
        .ContDetalle{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: 100%;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
        }
        .contDetailbajo{
            display: -webkit-box;
display: -ms-flexbox;
display: flex;
word-break: break-word;
margin-top: 4px;
-webkit-box-pack: justify;
-ms-flex-pack: justify;
justify-content: space-between;
        }
        `}
        </style>
    </div>)
})
    return mapeador
}
const renderPagos = (Fpago) => {

  return (
    <div className="ContPagos">
      <table className="tablaPagos">
        <thead>
          <tr>
            <th>Forma de Pago</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {Fpago.map((pago, i) => {
            
                 let tituloRender = pago.Tipo.replace(/-/g, " ")
    if(pago.Tipo === "Transferencia"){

        tituloRender  = "Otros con utilización del sistema financiero"
     }
      else if(pago.Tipo === "Efectivo"){

        tituloRender  = "Sin utilización del sistema financiero"
     }
       else if(pago.Tipo === "Tarjeta-de-Credito"){

        tituloRender  = "Tarjeta de Crédito"
     }
       else if(pago.Tipo === "Tarjeta-de-Debito"){

        tituloRender  = "Tarjeta de Débito"
     }
           return(
            <tr key={i}>
              <td>{tituloRender}</td>
              <td>${pago.Cantidad.toFixed(2)}</td>
            </tr>
          )})}
        </tbody>
      </table>
      <style>{`
        .ContPagos {
        
        }
        .tablaPagos {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .tablaPagos th {
          background-color: #f7f9fc;
          font-weight: bold;
          padding: 12px 15px;
          text-align: left;
          border-bottom: 2px solid #e0e0e0;
        }
        .tablaPagos td {
          background-color: #ffffff;
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
        }
        .tablaPagos tr:last-child td {
          border-bottom: none;
        }
        .tablaPagos tr:hover td {
          background-color: #f1f6fb;
        }
        .tablaPagos td:first-child, .tablaPagos th:first-child {
          border-top-left-radius: 10px;
        }
        .tablaPagos td:last-child, .tablaPagos th:last-child {
          border-top-right-radius: 10px;
        }
      `}</style>
    </div>
  );
};



export const Bodygen = (data)=>{
   
    let Inf = data.data
 console.log(Inf)
let Rimpeval =""
    if(Inf.rimpeval && !Inf.populares){
        Rimpeval = "Contribuyente Régimen RIMPE"
    }else if(Inf.rimpeval && Inf.populares){
        Rimpeval = "Contribuyente Negocio Popular - Régimen RIMPE"
    }else if(!Inf.rimpeval&& !Inf.populares){
             Rimpeval = "Contribuyente Regimen General"
    }

    return( <div class="invoice-box">
        <div class="fondogen">
    <div class="contHeader">
            <div class="contLogo">
           <img  class="empresaLogo" src={Inf.LogoEmp} />
         
            </div>
            <div class="contDataDetail">
            <div class="subtituloArtFT">
            {Inf.nombreComercial}
            </div>
         
            <div class="contdetail ContNumeracion">
            <div class="clave">
            Retención Nº
            </div>
            <div class="valorFact">
            <span>{`  ${Inf.estab} - ${Inf.ptoEmi} - ${Inf.secuencial}`}</span> 
            </div>
            </div>  
            <div class="contdetail">
            <div class="clave">
            Fecha:
            </div>
            <div class="valorFact">
            {Inf.fechaEmision}
            </div>
            </div>          
            <div class="contdetail">
            <div class="clave">
           RUC:
            </div>
            <div class="valorFact">
           {Inf.ruc}
            </div>
            </div>
            </div>
    </div>
    <div class="FinalData contMiddle">
  <div class="Cont2FactTo">
  <p class="enfData">Retenido a:</p>
  <div class="gridComprador">
  <div class="rowComprador">
    <div class="datoItem">
      <span class="emoji">Razón:</span>
      <span>{Inf.razonSocialComprador}</span>
    </div>
    <div class="datoItem">
      <span class="emoji">ID:</span>
      <span>{Inf.identificacionComprador}</span>
    </div>
 
  </div>
  <div class="rowComprador">
       <div class="datoItem">
      <span class="emoji">Correo:</span>
      <span>{Inf.correoComprador}</span>
    </div>
    <div class="datoItem">
      <span class="emoji">Dir:</span>
      <span>{Inf.direccionComprador}{Inf.ciudadComprador != "" && `, ${Inf.ciudadComprador}`}</span>
    </div>
   
  </div>
</div>

</div>
        <div class="Cont1FactTo">

        <p class="enfData" >Total Retenido</p> 
        <span class="subenfData">${Inf.TotalRetenido.toFixed(2)}</span> 
        <span class="subenfData">{}</span>
        <span class="subenfData">{}</span>

        </div>
    </div>

    <div class="contProducts">
    <div class="ContDetalle ContTitulos">
        <div class="divigualTitulo">
        Detalles
        </div>
        <div class="divigual">
       Cantidad
        </div>
        <div class="divigual">
      Precio. U
        </div>
        <div class="divigual">
      Total
        </div>
        </div>
    {genProds(Inf.ArticulosVendidos, Inf)}
   
  
    </div>
      <div class="contValores">
        <div class="contFormasdePago">
{renderPagos(Inf.Fpago)}
            </div>  
  <div class="MainContValues">
    <div class="ContDetalle contValues" >
        <div class="divigualData">
         Subtotal {process.env.IVA_EC}%:
        </div>
     
        <div class="divigual">
      $ {Inf.baseImpoConImpuestos.toFixed(2)}
        </div>
        </div>
        <div class="ContDetalle contValues" >
        <div class="divigualData">
         Subtotal IVA 0%:
        </div>
     
        
        <div class="divigual">
        $ {Inf.baseImpoSinImpuestos.toFixed(2)}
        </div>
        </div>
        <div class="ContDetalle contValues" >
        <div class="divigualData">
        Valor {process.env.IVA_EC}%: 
        </div>
        
       
        <div class="divigual">
      $   {Inf.IvaEC}
        </div>
        </div>
    <div class="ContDetalle contValues" >
        <div class="divigualData">
        V.Total: 
        </div>
        
        
        <div class="divigual">
      $  {Inf.SuperTotal.toFixed(2)}
        </div>
        </div>
        </div>
     </div>
    <div class="Contfinal">
      <div style={{marginTop:"20px",marginBottom  :"20px"}}>
    <div class="FinalData">
<div class="Cont1">
<p>Dirección Establecimiento:</p>
<span>{Inf.dirEstablecimiento}</span>
</div>
<div class="Cont1">
<p>Estado:</p>
<span> {Inf.Estado}</span>
</div>
</div>
<div class="FinalData">
<div class="Cont1">
<p>Detalles:</p>
  {Inf.adicionalInfo.length > 0  && Inf.adicionalInfo.map((item, index) => (
    <div className="lineaInfo" key={index}>
      <span className="clave">{item.clave}:</span>
      <span className="valorFact">{item.valor}</span>
    </div>
  ))}
</div>
</div>
      </div>


<div className="contExtraData">
<div className="contDetailbajo">
    <span className=" subTitledetail Bolder ">
        Fecha Autorización:
    </span>
    <div class="divigual">
    </div>
    <span>
    {Inf.fechaAuto}
    </span>
    </div>
    <div className="contDetailbajo">
    <span className="subTitledetail Bolder">
        Numero Autorización: 
    </span>
    <div class="divigual">
    </div>
    <span>
    {Inf.numeroAuto}
    </span>
</div>
<div className="contDetailbajo">
    <span className="subTitledetail Bolder">
        Clave Acceso: 
    </span>
    <div class="divigual">
    </div>
    <span>
    {Inf.ClaveAcceso}
    </span>
</div>
<div className="contDetailbajo">
    <span className=" subTitledetail Bolder">
        OBLIGADO A LLEVAR CONTABILIDAD: 
    </span>
    <div class="divigual">
    </div>
    <span>
    {Inf.obligadoContabilidad}
    </span>
</div>
<div>
    <span className="Bolder subTitledetail">
    {Rimpeval}
    </span>
  
</div>


</div>


    </div>
    <div className="Creditos">
    FACTURA GENERADA EN ACTIVOS.EC® 2024 - 2025
</div>
</div>
<style> {`
.emoji {width:55px;
font-weight: bold;
   
    min-width: 55px;
}
.subTitledetail{
    width: 30%;
} 
    .contFormasdePago{  
   margin-top: 25px;
   max-width: 300px;
   
    }
     .contValores{
        display:flex;
        justify-content: space-around;
       flex-wrap: wrap; 
align-items: center;
    
    width: 100%;
     
            display: -ms-flexbox;
               -webkit-box-pack: justify;
              -ms-flex-pack: justify;
        }

                .infoAdicionalPDF {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-family: 'Arial', sans-serif;
      background-color: #f9f9f9;
      max-width: 100%;
    }

    .lineaInfo {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .clave {
      font-weight: bold;
      width: 120px;
      min-width: 100px;
      color: #333;
      margin-right: 10px;
    }

    .valorFact {
      color: #555;
      flex: 1;
    }
       `}
        
     </style>
  
  </div>)
}


const factData = (data) => {

    const html = ReactDOMServer.renderToStaticMarkup(<Bodygen  data={data} />);
    let renderedhtml = html.toString()
    const today = new Date();
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
          .Bolder{
            font-weight: bold;
            margin-right: 19px;
        }
        .contExtraData{
           
        }
        .Cont1{
            width: 300px;
            max-width: 700px;
            display:flex;
            -webkit-box-orient:vertical;
            -webkit-box-direction:normal;
                -ms-flex-flow:column;
                    flex-flow:column;
                    text-align: center;
        }
        .subTitledetail{
            width: 30%;
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
        .FinalData p{
            font-weight: bolder;
            color: #1f177c;
            margin-bottom: 2px;
            
        }
       
        .contValues{
        
            margin-top: 15px;
            font-weight: bolder
        }
        .ContTitulos{
           
        margin-bottom: 8px;
        font-weight: bold;
        border-bottom: 1px solid #1346ff;
        padding-bottom: 5px;
        }
        .divigual{
            width: 80px; 
            text-align: center;
        }
        .divigualTitulo{
       
        width: 180px;
        }
              .divigualCantidad{
            width: 70px; 
            text-align: center;
        }
        .divigualData{
            width: 150px;
            text-align: center;
        }
         
        .contDetailbajo{
            display: -webkit-box;
display: -ms-flexbox;
display: flex;
word-break: break-word;
margin-top: 4px;
-webkit-box-pack: justify;
-ms-flex-pack: justify;
justify-content: space-between;
        }
             .empresaLogo{
              
      height: auto;


    border-radius: 10px;
             }
               .contLogo{
                  min-width: 150px;
    max-width: 250px;
    display: flex;

    width: 25%;
    justify-content: center;
       margin: 18px;
             }
             .contClient{
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                display: -webkit-flex;
                -webkit-box-orient: vertical;      
                  -webkit-box-direction: normal;     
                     -ms-flex-flow: column;      
                       flex-flow: column;
                       -ms-flex-wrap:wrap;
                       flex-wrap:wrap
             }
             .contValue{
                display: -webkit-box;
           display: -ms-flexbox;
                display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-flow: column;
                flex-flow: column;
        -ms-flex-pack: distribute;
            justify-content: space-around;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
                width: 50%;
                -ms-flex-wrap: wrap;flex-wrap: wrap;
             }
             .contMiddle{
            
    margin-top: 10px!important;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    /* border: 1px solid black; */
    border-bottom: 2px outset;
  margin:auto;
    padding-top: 10px;
    margin-bottom: 35px;
    width: 90%;
             }

             .contProducts{
              
              
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                border-radius: 15px;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-flow: column;
                        flex-flow: column;
                background: white;
                margin:auto;
                    width: 90%;
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
         .contHeader{
            display: -webkit-box;
            display: -ms-flexbox;
               -webkit-box-pack: justify;
              -ms-flex-pack: justify;
            display: flex;
            flex-wrap: wrap;
              justify-content: space-around;
         }
         .invoice-box {
         font-size:14px;
            max-width: 850px;
           min-width: 400px;
            margin: auto;
        
            border: 1px solid #eee;
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                    box-shadow: 0 0 10px rgba(0, 0, 0, .15);
          
            line-height: 20px;
            font-family: 'Helvetica Neue', 'Helvetica';
            color: #555;
  
     
            background: white;
            padding-bottom: 5px;   
        }
          
            .Creditos{
                color: black;
        margin-top: 15px;
        margin-top: 15px;
        text-align: center;
        border-top: 3px double #00000042;
            }
            .justify-center {
            text-align: center;
            }
            .subenfData{
                display: inline-block;
         
                text-align: center;
                color: black;
                width: 100%;
                
            }
            .contDataDetail{
            font-size: 15px;
                color: black;
                width: 300px;
              
                display: -webkit-box;
                text-align: center;    display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-flow: column;
                        flex-flow: column;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                        -webkit-box-pack: justify;
                        -ms-flex-pack: justify;
                            justify-content: space-between;
                            margin-right: 30px;

               }

      .MainContValues {
     
     max-width: 250px;
      margin-top: 20px;
      
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      background-color: #ffffff;
     
      padding: 5px;
    }

    .ContDetalle {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eaeaea;
    }

    .ContDetalle:last-child {
      border-bottom: none;
    }

    .divigualData {
      flex: 1.5;
      font-weight: 500;
      color: #333;
    }

    .divigual {
      flex: 1;
      text-align: right;
      color: #111;
    }

    .totalFinal {
      font-weight: bold;
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 12px 10px;
      margin-top: 10px;
    }
                    .contValues{
                    
                        margin-top: 5px;
                        font-weight: bolder
                    }
                    .Contfinal{
                        background: white;
    border-radius: 18px;
    padding: 0px 15px;

   

}
                    
                    .enfData{
                        text-transform: uppercase;
                        color: black!important;
                    margin-bottom: 10px;
                    font-weight: bolder;
                    text-align: center;
                    width: 100%;
                    }
                  

                    .subtituloArtFT{
                        text-transform: uppercase;
                        font-weight: bold;
                          
    margin-bottom: 15px;
    margin-top: 15px;
                        

                    }
                    .clave{
                        font-weight: bold;
                    }
                        .Bolder{
                            font-weight: bold;
                            margin-right: 19px;
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
                            display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-flow: column;
            flex-flow: column;
            -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
    width: 80%;
                        }
    .gridComprador {
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-top: 10px;
}

.rowComprador {

  display: flex;
  justify-content: space-between;

   flex-wrap: wrap;
            display: -ms-flexbox;
               -webkit-box-pack: justify;
              -ms-flex-pack: justify;
}

.datoItem {
  display: flex;
  align-items: center;
word-break: break-word;
max-width: 250px; 
  color: #333;
  width: 100%;

}



              @media print {
              
                       .invoice-box {
         font-size:10px;
          }
         .contDataDetail {
          font-size:12px;
          }
         
    .contValores{
   display: -webkit-box;
  -webkit-box-lines: multiple; /* permite "wrap" */
  -webkit-box-pack: justify;   /* space-around */
  width: 100%;

  /* Fallbacks para navegadores viejos */
  display: -ms-flexbox;
  -ms-flex-pack: justify;

  display: flex;
  justify-content: space-around;
        }
  .rowComprador {
  display: -webkit-box;           /* Soporte WebKit antiguo */
  -webkit-box-pack: justify;      /* justify-content: space-between */
  -webkit-box-lines: multiple;    /* intenta simular flex-wrap */
  width: 100%;

  /* Fallback para IE10 */
  display: -ms-flexbox;
  -ms-flex-pack: justify;

  /* Modern browsers (por si acaso) */
  display: flex;
  justify-content: space-between;
  /* flex-wrap no soportado en PhantomJS, pero sí en modernos */
}
  }
@media only screen and (min-width: 768px) { 


   .contHeader{
            display: -webkit-box;
            display: -ms-flexbox;
               -webkit-box-pack: justify;
              -ms-flex-pack: justify;
            display: flex;
            flex-wrap: wrap;
              justify-content: space-between;
         }

  .divigualTitulo{
       
        width: 280px;
        }
        .datoItem {

  width: 50%;

}

}

            }</style>
       </head>
       <body>
       ${renderedhtml}
       </body>
    </html>
    `;
};

export default factData