import React from 'react'
import Grid from '@material-ui/core/Grid';
import {Animate} from "react-animate-mount"

const ArtRender = ({datos, onEdicion, onDelete,userReducer}) => {
    let resultadoAdmin = false
    if(userReducer != ""){

        if(userReducer.update.usuario.Tipo == "administrador" || userReducer.update.usuario.Tipo == "tesorero"){
          resultadoAdmin = true
      }
      }



let imgrender;
    if(datos.Imagen.length > 0){
        imgrender =   datos.Imagen[0]
    }
    else {
        imgrender = "./static/profile.jpg"
    }
    return (   
         <Grid item xs={12} md={6} lg={4} > 
                
                <div className="contRepuesto">
<div className="firstcont">
<div className="contImagen">
               <img src={imgrender} alt=""/>
               </div>
         <div className="maincontDetalles">
      
         <div className="contdetalle">
                    <div className="tituloD"> <p className="parrafoD">Categoria:</p> </div>
                    <div className="valorD"> <p className="parrafoD"> {datos.Categoria}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    <div className="tituloD"> <p className="parrafoD">Nombre:</p> </div>
                    <div className="valorD"> <p className="parrafoD"> {datos.Titulo}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    <div className="tituloD"> <p className="parrafoD">Existencia:</p> </div>
                    <div className="valorD"> <p className="parrafoD"> {datos.Existencia}  </p></div>
                    
                 
                    </div>
                    <div className="contdetalle">
                    <div className="tituloD"> <p className="parrafoD">EqID:</p> </div>
                    <div className="valorD"> <p className="parrafoD"> {datos.Eqid}  </p></div>
                    
                 
                    </div>
  
         </div>
         </div>
         <Animate show={resultadoAdmin}>
         <div className="botonera">
        <button  className="btn btn-primary mybtn" onClick={onEdicion}>Editar</button>
        <button className="btn btn-danger mybtn" onClick={onDelete}>Borrar</button>
         </div>
         </Animate>  
               <style jsx>{`
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
                       margin:10px;
                   }
                   .botonera{
                       margin-top:15px;
                   }
                   .valorD{
                       margin-left: 10px
                   }
        .firstcont{
            width:100%;
            display: flex;
            flex-wrap: wrap;
    justify-content: space-around;
        }
        .contRepuesto{
            display: flex;
    padding: 30px;
    overflow: hidden;
    margin: 10px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 11px black;
    flex-wrap: wrap;
    justify-content: center;
}
        }

       
        

        .maincontDetalles{
            display: flex;
            color: black;
            flex-flow: column;
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
        </Grid>
    )
}

export default ArtRender
