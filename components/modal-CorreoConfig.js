import React, { Component } from 'react';

import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Animate } from "react-animate-mount";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button, CircularProgress, Box } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import fetchData from "./funciones/fetchdata";
import ModalDeleteGeneral from "./cuentascompo/modal-delete-general"


class Contacto extends Component {
  state = {
    Alert: { Estado: false },
    senderEmail: "",
    token: "",
    loading: false, // Estado para mostrar el loader
    status: null, // "Ok" o "Error"
    registrado:false,
    registerData:{Data:[{user:""}]},
    deleteConfig:false
  };

  async componentDidMount () {
    let data = await fetchData(this.props.state.userReducer, 
      "/public/getCorreoConfig", {});
    console.log(data);
    if(data.dataconfig.length > 0){
this.setState({registrado:true,
  registerData:data.dataconfig[0]

})
    }
    setTimeout(() => {
      document.getElementById('mainxx').classList.add("entradaaddc");
    }, 500);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    this.setState({ loading: true, status: null });

    let data = await fetchData(this.props.state.userReducer, "/public/correoconfigverify", this.state);
    console.log(data);

    this.setState({
      loading: false,
      status: data.status, // Puede ser "Ok" o "Error"
    });


  };

  Onsalida = () => {
    document.getElementById('mainxx').classList.remove("entradaaddc");
    setTimeout(() => {
      this.props.Flecharetro();
    }, 500);
  };

  render() {
    const { loading, status, registrado } = this.state;

let displayName = this.state.registerData.Data[0].user?this.state.registerData.Data[0].user:""
    const handleClose = () => {
      this.setState({ Alert: { Estado: false } });
    };

    return (
      <div>
        <div className="maincontacto" id="mainxx">
          <div className="contcontacto">
            <div className="headercontact">
              <img src="/static/flecharetro.png" alt="" className="flecharetro" onClick={this.Onsalida} />
              <div className="tituloventa">Configuración de correo</div>
            </div>

            <div className="Scrolled">
              <Box style={{ maxWidth: 400, margin: "auto", padding: 24, textAlign: "center" }}>
                <ValidatorForm onSubmit={this.handleSubmit}>
                  <Animate show={!loading && status !== "Ok" && !registrado}>
                    <TextValidator
                      label="Correo Emisor"
                      name="senderEmail"
                      value={this.state.senderEmail}
                      onChange={this.handleChange}
                      validators={["required", "isEmail"]}
                      errorMessages={["Este campo es obligatorio", "Correo no válido"]}
                      fullWidth
                      margin="normal"
                      autoComplete="off"
                    />
                    <TextValidator
                      label="Token"
                      name="token"
                      type="password"
                      value={this.state.token}
                      onChange={this.handleChange}
                      validators={["required"]}
                      errorMessages={["Este campo es obligatorio"]}
                      fullWidth
                      margin="normal"
                      autoComplete="new-password"
                    />
                      <Button type="submit" variant="contained" color="primary" startIcon={<SendIcon />} style={{ marginTop: 16 }}>
                      Comprobar
                    </Button>
                  </Animate>
                  </ValidatorForm>
                  <Animate show={!loading  && registrado}>
                    Ya Configurado
                    <div className='usuarioCofig'>{displayName}</div>
                    <div className='jwFlex spaceAround'>
                    <button className=" btn btn-primary botonedit" onClick={(e)=>{e.stopPropagation;this.setState({registrado:false})}}>
       
       <span className="material-icons">
     edit
     </span>
     <p>Editar</p>
     </button>
     <button type="" className=" btn btn-danger botonedit" onClick={()=>{this.setState({deleteConfig:true})}}>


<span className="material-icons">
delete
</span>
<p>Eliminar</p>
</button>
</div>
                  </Animate>
                  {/* Loader mientras se valida */}
                  <Animate show={loading}>
                    <CircularProgress style={{ marginTop: 16 }} />
                  </Animate>

                  {/* Botón de enviar (desaparece si está cargando) */}
                
        

                {/* Mensajes de éxito o error */}
                <Animate show={status === "Ok"}>
                  <div style={{ marginTop: 16, color: "green", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircleIcon style={{ marginRight: 8 }} /> Cuenta agregada exitosamente.
                  </div>
                </Animate>

                <Animate show={status === "Error"}>
                  <div style={{ marginTop: 16, color: "red", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ErrorIcon style={{ marginRight: 8 }} /> Error al agregar cuenta.
                  </div>
                </Animate>
              </Box>
            </div>
          </div>
        </div>

        <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
          <MuiAlert onClose={handleClose} severity={this.state.Alert.Tipo}>
            <p style={{ textAlign: "center" }}>{this.state.Alert.Mensaje}</p>
          </MuiAlert>
        </Snackbar>
    <Animate show={this.state.deleteConfig}> 
                <ModalDeleteGeneral
                 sendSuccess={(e)=>{this.setState({   registrado:false,loading: false,deleteConfig:false})}}
                 sendError={()=>{console.log("deleteerror")}}
                itemTodelete={this.state.registerData}
                 mensajeDelete={{mensaje:"Seguro quieres eliminar el correo emisor? ", 
                  url:"/public/deleteCorreoConfigurado" }}
                Flecharetro={()=>this.setState({deleteConfig:false})}
                />
                   </Animate>
        <style jsx>{`
          .maincontacto {
            z-index: 1298;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s;
          }
          .contcontacto {
            border-radius: 30px;
            width: 90%;
            background-color: white;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            align-items: center;
          }
          .flecharetro {
            height: 40px;
            width: 40px;
            padding: 5px;
          }
          .entradaaddc {
            left: 0%;
          }
          .headercontact {
            display: flex;
            justify-content: space-around;
            width: 80%;
          }
          .tituloventa {
            display: flex;
            align-items: center;
            font-size: 30px;
            font-weight: bolder;
            text-align: center;
            justify-content: center;
          }
          .Scrolled {
            overflow-y: scroll;
            width: 98%;
            display: flex;
            flex-flow: column;
            padding: 5px;
          }
            .usuarioCofig{
            font-size: 23px;
    margin: 16px;
    border-bottom: 1px solid black;
    padding-bottom: 3px;
    padding: 4px;
    border-radius: 10px;
    box-shadow: 0px 2px 5px -2px;
}
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { state };
};

export default connect(mapStateToProps, null)(Contacto);
