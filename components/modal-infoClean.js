import React, { Component } from 'react'
import fetchData from './funciones/fetchdata';
import {connect} from 'react-redux';
import ModalTerminos from "./modal-terminoseliminarRegs"
import { Animate } from 'react-animate-mount/lib/Animate';
import { Button, Checkbox, FormControlLabel, Typography, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
class InfoClean extends Component {
   state ={
    Years:{},
    findenData:{},
    showdata:false,
    selectYear:0,
    loading:false,
    modalTerminos:false,
     aceptado: false
   }
  handleCheckboxChange = (event) => {
    this.setState({ aceptado: event.target.checked });
  };
   async componentDidMount (){
      setTimeout(function(){ 
        
        document.getElementById('mainInfoClean').classList.add("entradaaddc")

       }, 500);
        
       let data = await fetchData(this.props.state.userReducer,
           "/public/findYearRegs",
           {})

           console.log(data)
          this.setState({Years:{...data}})
      
      } 
   
      Onsalida=()=>{
        document.getElementById('mainInfoClean').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }

      getyearData = async (year) => {
  this.setState({ loading:true, selectYear:year });

  const response = await fetch(
    "/public/findDataYearRegs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
 'x-access-token': this.props.state.userReducer.update.usuario.token,
       
        // Agrega tu token si usas auth
      },
      body: JSON.stringify({
        datos: { year },
        User: this.props.state.userReducer.update.usuario, // o el objeto necesario para DBname
      }),
    }
  );

  if (!response.ok) {
    console.error("Error al descargar archivo");
    return;
  }

  // Obtener el blob del archivo Excel
  const blob = await response.blob();

  // Crear una URL del blob y forzar la descarga
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `datos-${year}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  this.setState({ loading:false, showdata:true });
};

        
      

    render () {
const { Years, aceptado } = this.state;
   console.log(this.state)
        return ( 

         <div >

<div className="maincontacto" id="mainInfoClean" >
<div className="contcontactov2"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Liberar espacio de su Base de Datos

</div>


</div> 

<div className="year-buttons-container">
        {Object.keys(Years)
          .sort((a, b) => b - a)
          .map((year) => (
            <Button
              key={year}
              variant="contained"
              color={Years[year] ? "primary" : "default"}
              disabled={!Years[year]}
              className="year-button"
              onClick={()=>{this.getyearData(year)}}
            >
              {year}
            </Button>
          ))}
      </div>
      <Animate show={this.state.loading}>
        <div className='centrar' style={{marginTop:"20px"}}>   <CircularProgress/></div>
       
      </Animate>
      <Animate show={this.state.showdata}>
<div style={{marginTop:"20px"}}>
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        border="1px solid #ccc"
        borderRadius="8px"
        maxWidth="400px"
        margin="auto"
      >
        <Typography variant="h5" gutterBottom>
          Eliminar Registros {this.state.selectYear}
        </Typography>
<div className='jwFlex centrar'>
      <FormControlLabel
          control={
            <Checkbox
              checked={aceptado}
              onChange={this.handleCheckboxChange}
              color="primary"
            />
          }
          
        />
  <Typography variant="body2">
              Acepto los{' '}
              <span
              onClick={()=>{this.setState({modalTerminos:true})}}
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                términos y condiciones
              </span>
            </Typography>
</div>
    

        <Button 
        onClick={()=>{this.Onsalida()}}
          variant="contained"
          color="secondary"
          disabled={!aceptado}
          style={{
            backgroundColor: aceptado ? '#d32f2f' : undefined, // rojo fuerte si habilitado
            color: 'white',
            marginTop: '16px'
          }}
          startIcon={
            <span className="material-icons">
              delete_forever
            </span>
          }
        >
          Borrar
        </Button>
      </Box>
</div>
</Animate>
</div>
        </div>
        <Animate show={this.state.modalTerminos}>
<ModalTerminos Flecharetro={()=>{this.setState({modalTerminos:false})}} /> 
        </Animate>
        <style jsx >{`
        .year-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  justify-content: space-around; /* Puedes usar center o space-between si prefieres */
}

.year-button {
  min-width: 120px;
  font-weight: 600;
  border-radius: 12px;
  text-transform: none; /* Opcional, para que no esté en mayúsculas */
}
           .maincontacto{
              z-index: 1000;
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
     
        overflow: hidden;
              
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

const mapStateToProps = state=>  {
   
    return {
        state
    }
  };
  
  export default connect(mapStateToProps, null)(InfoClean);

