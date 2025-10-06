import React from 'react'
import {Animate} from "react-animate-mount"

const ArtRender = ({datos,  onDelete,}) => {
   let resultadoAdmin = false
 

let imgrender;
  
    return (   
                 
                <div className="contRepuesto">
<div className="firstcont">
<div className={`maincontDetalles   `} >
         
         <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD eqIdart"> {datos.Eqid}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                   
                   <div className="valorD "> <p className="parrafoD doscincuenta"> {datos.Titulo}  </p></div>
                   
                
                   </div>
         <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> ${parseFloat(datos.Precio_Compra.replace(",",".") ).toFixed(2)}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> {parseInt(datos.CantidadCompra)}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> ${(parseFloat(datos.Precio_Compra.replace(",",".") ) * parseInt(datos.CantidadCompra)).toFixed(2)}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    
                    <div className="valorD "> <p className="parrafoD miscien"> 
                    <img src={datos.Imagen[0]} className="miniimg" />
                     </p></div>
                    
                 
                    </div>
                    
                    <div className="botoneralist ">
                
    

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
                    width: 100px;   
                }
                  .contRepuesto{
                    display: inline-flex;
            padding: 5px;
            overflow: hidden;

            border-radius: 6px;
          border-bottom: 2px solid black;
            flex-wrap: wrap;
            justify-content: center;
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
            margin-right:30px; 
            word-break: break-word;
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
     
     `}</style>
        </div>
  
    )
}

export default ArtRender
