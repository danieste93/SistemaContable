import {Animate} from "react-animate-mount"
import React, { useState,useEffect } from 'react';


const ArtRender = ({datos, onEdicion, onDelete,user}) => {

  const [visual, setvisual] = useState(false );


useEffect(() => {
  console.log(datos)
  // Update the document title using the browser API
  if(user == "administrador" || user == "tesorero" ){
    setvisual(true)
  }
});

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


let tiempo = new Date(datos.Tiempo)    
let mes = addCero(tiempo.getMonth()+1)
let dia = addCero(tiempo.getDate())
var date = tiempo.getFullYear()+'-'+mes+'-'+ dia;         
var hora = addCero(tiempo.getHours())+" : "+   addCero(tiempo.getMinutes())
    return (   
                 
<div className="contRepuesto">
<div className="firstcont">
<div className={`maincontDetalles   `} >
         
         <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD eqIdart"> {datos.CompraNumero}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD doscincuenta">  {date } // {hora }  </p></div>
                    
                 
                    </div>
       
         <div className="contdetalle">
                    
                    <div className="valorD "> 
                    <p className="parrafoD cuatrocientos"> 
                    {datos.ArtComprados.map((art,i)=>(
                                        <div className='contdetail' key={i}>
                                            <div className="setenta">  {art.Eqid}  </div>
                                          <div className="doscien">  {art.Titulo}  </div>
                                          <div className="miscien">$  {parseFloat(art.Precio_Compra).toFixed(2)}  </div>
                                          <div className="miscien">  {parseFloat(art.CantidadCompra).toFixed(2)}  </div>
                                            
                                        </div>))}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD vendedorArtic"> {datos.Usuario.Nombre}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {datos.Factdata.nombreComercial}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien">$ {datos.ValorTotal.toFixed(2)}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle miscien butondelete" >
                      <Animate show={visual}>
                    <button  className="btn btn-danger mybtn " onClick={()=>{onDelete(datos)}}><span className="material-icons">
delete
</span></button></Animate>
</div>
                   
  
         </div>
    </div>
           
               <style jsx>{`
             .contdetail{
              display: flex;
              justify-content: space-around;
              border-bottom: 1px solid black;
    margin-bottom: 6px;
             }
               .miniimg{
                width: 80px;
               }
               .doscien{
                width: 200px;
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
                    width: 100px;   
                } 
                .setenta{
                  
                  width: 70px;   
              } 

                  .contRepuesto{
                    display: inline-flex;

            overflow: hidden;

            border-radius: 6px;
          border-bottom: 2px solid black;
            flex-wrap: wrap;
            justify-content: center;
            padding:0px;
        }
              
                          .contdetalle {
                            display: flex;
                            flex-wrap: wrap;
                    justify-content: space-between;
                    margin: 10px 0px;
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
        .cuatrocientos{
          width: 400px;  
          
        }

        .maincontDetalles{
            display: flex;
            color: black;
         
            font-size: 20px;

           
        }
        .contImagen img{
            height: 250px;
       
   
    margin: auto;
       
      
        }
       
        .butondelete{
          display: flex;
          justify-content: center;
         }
         .vendedorArtic{
          width: 115px; 
          margin-right:10px;
        }
     `}</style>
        </div>
  
    )
}

export default ArtRender
