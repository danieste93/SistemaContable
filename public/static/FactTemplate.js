import * as ReactDOMServer from 'react-dom/server'
import Barcode  from 'react-barcode';


const genProds = (arts, Inf)=>{
    console.log(Inf)
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
        .divigual{
            width: 100px;
            text-align: center;
        }
        .divigualTitulo{
            width: 250px; 
            text-align: center;
        }
        
        .divigualData{
            width: 200px;
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

export const Bodygen = (data)=>{
   
    let Inf = data.data
    console.log(Inf)
let Rimpeval =""
    if(Inf.rimpeval && !Inf.populares){
        Rimpeval = "Contribuyente Régimen RIMPE"
    }else if(Inf.rimpeval && Inf.populares){
        Rimpeval = "Contribuyente Negocio Popular - Régimen RIMPE"
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
            Factura Nº
            </div>
            <div class="valor">
            <span>{`  ${Inf.estab} - ${Inf.ptoEmi} - ${Inf.secuencial}`}</span> 
            </div>
            </div>  
            <div class="contdetail">
            <div class="clave">
            Fecha:
            </div>
            <div class="valor">
            {Inf.fechaEmision}
            </div>
            </div>          
            <div class="contdetail">
            <div class="clave">
           RUC:
            </div>
            <div class="valor">
           {Inf.ruc}
            </div>
            </div>
            </div>
    </div>
    <div class="FinalData contMiddle">
        <div class="Cont2FactTo">
            <p class="enfData" >Facturado a:</p>
            <span class="subenfData">{Inf.razonSocialComprador}</span>
            <span class="subenfData">{Inf.identificacionComprador}</span>
            <span class="subenfData">{Inf.correoComprador}</span>
            <span class="subenfData">{Inf.direccionComprador}</span>
            <span class="subenfData">{Inf.ciudadComprador}</span>
        </div>
        <div class="Cont1FactTo">

        <p class="enfData" >Valor Total</p> 
        <span class="subenfData">${Inf.SuperTotal.toFixed(2)}</span> 
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
    <div class="MainContValues">
    <div class="ContDetalle contValues" >
        <div class="divigualData">
         Subtotal {process.env.IVA_EC}%:
        </div>
     
        <div class="divigual">
    
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
    
        </div>
        <div class="divigual">
      $  {Inf.SuperTotal.toFixed(2)}
        </div>
        </div>
        </div>
    </div>
    <div class="Contfinal">
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
<span> {Inf.detalles}</span>
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

.subTitledetail{
    width: 30%;
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
            font-size: 11px;
        }
        .Cont1{
            width: 300px;
            max-width: 600px;
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
            font-size: 12px
        }
       
        .contValues{
        
            margin-top: 15px;
            font-weight: bolder
        }
        .ContTitulos{
            font-size: 12px;
        margin-bottom: 8px;
        font-weight: bold;
        border-bottom: 1px solid #1346ff;
        padding-bottom: 5px;
        }
        .divigual{
            width: 100px; 
            text-align: center;
        }
        .divigualTitulo{
            width: 250px; 
            text-align: center;
        }
        .divigualData{
            width: 200px;
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
             .empresaLogo{
                width:110px;
          
                margin-left: 10px;
                border-radius: 10px;
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

             .contProducts{
              
                padding: 3px 10px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                border-radius: 15px;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-flow: column;
                        flex-flow: column;
                background: white;
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
            display: flex;
          -webkit-box-pack: justify;
              -ms-flex-pack: justify;
                  justify-content: space-between;
         }
         .invoice-box {
            max-width: 700px;
            margin: auto;
            padding: 5px;
            border: 1px solid #eee;
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                    box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 11px;
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
                color: black;
                width: 300px;
                font-size: 15px;
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

                    .MainContValues{
                        border: 1px solid black;
                        border-radius: 15px;
                        margin-top: 10px;
                        padding: 5px;
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
                        font-size:15px;
                        

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
           width: 300px;
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