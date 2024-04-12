import React from 'react'

import {Animate} from "react-animate-mount"

const ArtRender = ({datos,sendArt,Cuenta}) => {
    
  
    let dataCombo = false
 let getCuenta = Cuenta()
 
let buttonRender = ()=>{

   if(datos.Tipo == "Producto"){
    if(datos.Existencia < 1){
        return         <button style={{fontSize:"20px"}}  className="btn btn-danger mybtn " >-</button>
    }
    else{
        return         <button  style={{fontSize:"20px"}} className="btn btn-success mybtn " onClick={()=>{sendArt(datos)}}>+</button>
    }
   }
   else{
    return         <button  style={{fontSize:"20px"}} className="btn btn-success mybtn " onClick={()=>{sendArt(datos)}}>+</button>
   }
}

let imgrender;
let fondorender = ""
if(datos.Tipo == "Producto"){
   
    if(datos.Existencia < 1){
        fondorender="fondorojo"
    }
}

let medida = datos.Medida == "Unidad"?"u":"g"
let combProd = medida == "u"?parseFloat(datos.Existencia) + medida:parseFloat(datos.Existencia).toFixed(2) + medida
let resultadoTipo = datos.Tipo =="Producto"?combProd:
                    datos.Tipo == "Servicio"? <p style={{fontSize:"40px"}}>∞</p>:
                    datos.Tipo == "Combo"?" ":""
let generadorTituloCombo = ""
if(datos.Tipo == "Combo"){
    dataCombo = true
    generadorTituloCombo = datos.Producs.map(item=>{
    
     let genUnidad =()=>{
      
        if(item.Medida == "Peso" ){

            return(      <p>&nbsp; {item.Unidad }</p>)
         }else{
            return(      <p>&nbsp; Unidad </p>)
         }
         
         }
    return (
    <div className='ContdataCombo'>              
        <p>{item.Titulo}</p>
        <div className='ContCantComb'>
        <p>{item.Cantidad}</p>
         {genUnidad()}
         </div>
    </div>)})

}
let resultTitulo = datos.Tipo =="Combo" ?generadorTituloCombo:""


    return (   
         <div > 
                
                <div className="contRepuesto">
<div className="firstcont">

       
         <div className={`maincontDetalles  ${fondorender} `} >
         <div className="botoneralist">

{buttonRender()}
         </div>
         <div className="contdetalle ">
                    
                    <div className="valorD  "> <p className="parrafoD miscien eqId"> {datos.Eqid}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                   
                   <div className="valorD customtitulo ">
  
                     <p className="parrafoD doscincuenta"> {datos.Titulo}  </p>
                     <Animate show={dataCombo}>
                     <p className="parrafoD doscincuenta resultComb"> {resultTitulo}  </p>
                     </Animate>
                     </div>
                   
                
                   </div>
         <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> ${(datos.Precio_Venta).toFixed(2)}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">                    
                    <div className="valorD "> <p className="parrafoD miscien"> {resultadoTipo}  </p></div>                                     
                    </div>
                    <div className="contdetalle">                    
                    <div className="valorD "> <p className="parrafoD miscien centrarlu"> {datos.Color}  </p></div>                                     
                    </div>
                    <div className="contdetalle">                    
                    <div className="valorD "> <p className="parrafoD miscien centrarlu"> {datos.Marca}  </p></div>                                     
                    </div>
                    <div className="contdetalle">                    
                    <div className="valorD "> <p className="parrafoD miscien centrarlu"> {datos.Calidad}  </p></div>                                     
                    </div>
                      <div className="contdetalle">                    
                    <div className="valorD "> <p className="parrafoD miscien centrarlu"> {getCuenta[0].NombreC}  </p></div>                                     
                    </div>
                   
  
         </div>
         </div>
       
         
           
               <style >{`
               .centrarlu{
                text-align:center;
               }

               .miscien{
                width: 100px;   
                 }
                 
           .resultComb{
            border: 1px solid;
            padding: 4px;
            border-radius: 13px;
            margin-top: 10px;
            font-size: 15px;
            display: flex;
            flex-wrap: wrap;
           }
          .ContCantComb{
            display: flex;
            width: 100%;
            
          }
          .ContdataCombo p{
margin-bottom:2px;
          }
            .doscincuenta{
                width: 230px;  
                margin-right:30px; 
                word-break: break-word;
            }
       

                          .contdetalle {
                            display: flex;
                            flex-wrap: wrap;
                    justify-content: space-between;
                    margin: 10px 0px;
                        }
                      
                        .tituloD{
                      
                            font-weight:bolder;
                        margin-right:10px
                       
                        }
                      
                   .mybtn{
                   
                
                   }
                   .botoneralist{
                    font-size: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: 10px;
                    margin-right: 25px;
                   }
                   .valorD{
                    
                       display: flex;
    justify-content: center;
    align-items: center;
}
.customtitulo{
    flex-flow: column;
}
                   }
                
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .contRepuesto{
            display: inline-flex;
    padding: 5px;
    overflow: hidden;
    margin: 5px 10px;
    border-radius: 6px;
  border-bottom: 2px solid black;
    flex-wrap: wrap;
    justify-content: center;
}
        .parrafoD {
            margin-bottom:1px;
        }

       
        

        .maincontDetalles{
            display: flex;
            color: black;
           
            font-size: 20px;
            background:none;
            transition: 1s;
           
        }
        .fondorojo{background:#dc35458a;}
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
        .eqId{
            word-break: break-all;
            padding-right: 5px;
           }
        .ContdataCombo{
            display: flex;
        
            justify-content: space-between;
            flex-flow: column;
            border-bottom: 2px solid #197ee9;
    margin: 5px;
    padding:2px;
        }
     
     `}</style>
        </div>
        </div>
    )
}

export default ArtRender
