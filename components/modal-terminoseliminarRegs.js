import React, { Component } from 'react'
import { Box, Typography, Divider } from '@material-ui/core';


class Contacto extends Component {
   

    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainTerminosEliminarRegs').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
   
      Onsalida=()=>{
        document.getElementById('mainTerminosEliminarRegs').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
        
      

    render () {

   
        return ( 

         <div >

<div className="maincontacto" id="mainTerminosEliminarRegs" >
<div className="contcontactov2"  >
      <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
<div className="headercontact">
  
 <Box
      p={4}
      m={4}
      border="1px solid #ccc"
      borderRadius="12px"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      maxWidth="800px"
      margin="auto"
      bgcolor="#fafafa"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <span className="material-icons" style={{ color: '#f44336', marginRight: '8px' }}>
          warning
        </span>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          Aviso Importante sobre la Eliminación de Registros
        </Typography>
      </Box>

      <Divider style={{ marginBottom: 16 }} />

      {/* 1. Eliminación de registros */}
      <Typography variant="h6" gutterBottom>
        1. Eliminación Permanente de la Base de Datos
      </Typography>
      <Typography variant="body1" paragraph>
        Al confirmar esta acción, <b>los registros serán eliminados permanentemente de la base de datos MongoDB</b>. 
        Esta operación es irreversible y eliminará toda la información seleccionada de forma definitiva del sistema.
      </Typography>

      {/* 2. Archivo de respaldo */}
      <Typography variant="h6" gutterBottom>
        2. Archivo de Respaldo
      </Typography>
      <Typography variant="body1" paragraph>
        Antes de proceder, el sistema le permitirá <b>descargar un archivo de respaldo</b> que contiene toda la información eliminada.
        Este archivo será <b>el único respaldo disponible</b>, por lo que <b>nos eximimos de toda responsabilidad sobre la pérdida de información</b> posterior a la descarga.
      </Typography>

      {/* 3. Seguridad del archivo */}
      <Typography variant="h6" gutterBottom>
        3. Seguridad y Protección del Archivo
      </Typography>
      <Typography variant="body1" paragraph>
        Por motivos de seguridad, <b>el archivo no puede ser modificado</b>. 
        Está protegido con una <b>clave única</b> almacenada exclusivamente en nuestros servidores y bajo estrictas medidas de seguridad.
        <b> No se entregará esta clave a ningún usuario</b>, ya que salvaguarda la integridad del sistema contable.
      </Typography>

      {/* 4. Visualización de archivos antiguos */}
      <Typography variant="h6" gutterBottom>
        4. Visualización de Registros Históricos
      </Typography>
      <Typography variant="body1" paragraph>
        En el módulo de <b>“Cuentas”</b>, dentro del área de <b>“Registros”</b>, 
        puede cargar este archivo para <b>visualizar la información correspondiente a años anteriores</b>.
        Esta función es únicamente de lectura y no afectará la base de datos activa.
      </Typography>

      {/* 5. Recomendación de respaldo */}
      <Typography variant="h6" gutterBottom>
        5. Recomendación de Almacenamiento
      </Typography>
      <Typography variant="body1" paragraph>
        Se recomienda realizar <b>una copia de seguridad adicional en Google Drive</b> u otro servicio confiable 
        y conservar el archivo con estricta cautela para futuras consultas.
      </Typography>

      <Divider style={{ marginTop: 24 }} />

      <Box display="flex" alignItems="center" mt={2}>
        <span className="material-icons" style={{ color: '#4caf50', marginRight: '8px' }}>
          check_circle
        </span>
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
          Este procedimiento garantiza la seguridad, organización y trazabilidad de su sistema contable.
        </Typography>
      </Box>
    </Box>



</div> 
<div className="">

</div>
</div>
        </div>
        <style jsx >{`
           .maincontacto{
              z-index: 1299;
         width: 98.5vw;
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

            .contcontactov2{
               border-radius: 9px;
      width: 90vw;
        background-color: whitesmoke;
        padding: 5px 10px;
        position:absolute;
        overflow: scroll;
    height: 90%;
        display: flex
;
    justify-content: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
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
                 
                  
           `}</style>
        

          
           </div>
        )
    }
}

export default Contacto