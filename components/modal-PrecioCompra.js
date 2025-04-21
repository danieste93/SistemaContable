import React, { Component } from 'react';
import { Animate } from 'react-animate-mount/lib/Animate';
import HelperFormapago from './reusableComplex/helperSoloPago';
import fetchData from './funciones/fetchdata';
import { CircularProgress } from '@material-ui/core';


class Contacto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      precioCompra: props.ArtData.Precio_Compra,
      justificacion: '',
      Fpago:[],
      helperReady: false, // Esto puede cambiar si HelperFormapago necesita enviar confirmación
    };
  }

  componentDidMount() {
    
    setTimeout(() => {
      document.getElementById('mainxx').classList.add('entradaaddc');
    }, 100);
  }

  Onsalida = () => {
    document.getElementById('mainxx').classList.remove('entradaaddc');
    setTimeout(() => {
      this.props.Flecharetro();
    }, 500);
  };

  handlePrecioChange = (e) => {
    const valor = parseFloat(e.target.value);
    this.setState({ precioCompra: isNaN(valor) ? 0 : valor });
  };

  handleJustificacionChange = (e) => {
    this.setState({ justificacion: e.target.value });
  };

  handleEnviar = async (esMayor, esMenor) => {
    this.setState({loading:true})
    if(this.state.loading === false){
    let data= {
    
      PrecioCompraNuevo: this.state.precioCompra,
      Justificacion: this.state.justificacion,
      Fpago:this.state.Fpago,
      esMayor,esMenor,
      allData:this.props,
    }


    let dataSend = await fetchData(this.props.User,
      "/public/editarPrecioCompra",
    data)

      if(dataSend.status == "Ok"){
        this.props.updatePrecioCompra(dataSend)
        this.Onsalida()
      }

    }
  };

  render() {


    const  PrecioCompra = this.props.ArtData.Precio_Compra;
    console.log(this.state)
    const  Cantidad = this.props.ArtData.Existencia;
    const { precioCompra, justificacion } = this.state;

let newCantidad = Cantidad

    const totalOriginal = PrecioCompra * newCantidad;
    const totalNuevo = precioCompra * newCantidad;

    const esMayor = totalNuevo > totalOriginal;
    const esMenor = totalNuevo < totalOriginal;
let SumaTotal = 0
    if(esMayor && this.state.Fpago.length > 0){
this.state.Fpago.forEach(x=>  SumaTotal += x.Cantidad)
    }
    console.log(SumaTotal)
    const cantidadEsCero = newCantidad === 0;
let validadorSum = SumaTotal === (totalNuevo - totalOriginal)?true:false
    const puedeEnviar =
      cantidadEsCero ||
      (esMayor && validadorSum) ||
      (esMenor && justificacion.trim().length > 0);

    return (
      <div>
        <div className="maincontacto" id="mainxx">
          <div className="contcontactov2">
            <div className="headercontact">
              <img
                src="/static/flecharetro.png"
                alt="volver"
                className="flecharetro"
                onClick={this.Onsalida}
              />
              <div className="tituloventa">Editar Precio Compra</div>
            </div>

            <div className="cuerpoform">
              <div className="jwFlex">
                <div>
                  <label>Precio Compra:</label>
                  <input
                    type="number"
                    value={precioCompra}
                    onChange={this.handlePrecioChange}
                    className="inputform"
                  />
                </div>
                <div>
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    value={newCantidad}
                    disabled
                    className="inputform"
                  />
                </div>
              </div>

              <div className="resumen-totales">
  <div className="box-totales invertido">
    <span className="label">Total Invertido</span>
    <span className="valor">${totalOriginal.toFixed(2)}</span>
  </div>
  <div className="box-totales actual">
    <span className="label">Valor Actual</span>
    <span className="valor">${totalNuevo.toFixed(2)}</span>
  </div>
  <div className="box-totales diferencia">
    <span className="label">Diferencia</span>
    <span className="valor">${(totalNuevo - totalOriginal).toFixed(2)}</span>
  </div>
</div>
              <Animate show={esMenor}>
                <div className="animado">
                  <label>Justificación por la baja de precio:</label>
                  <input
                    type="text"
                    value={justificacion}
                    onChange={this.handleJustificacionChange}
                    className="inputform"
                  />
                </div>
              </Animate>

              <Animate show={esMayor}>
                <div className="animado helperforma">
                  <HelperFormapago 
                        valorSugerido={totalNuevo - totalOriginal}

                        onChange={(e)=>{
                          this.setState(e)
                        }}
                  />
                </div>
              </Animate>

              <div className="center-button">

               <div className="contBotonPago">
                                 
                                  <Animate show={this.state.loading}>
              <CircularProgress />
              </Animate>
                           
              <Animate  show={!this.state.loading}>
              <button
                  onClick={()=>{this.handleEnviar(esMayor, esMenor)}}
                  className="botonenviar"
                  disabled={!puedeEnviar}
                >
                  Enviar
                </button></Animate>
              
                                  </div>
              
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .maincontacto {
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
            transition: 0.5s;
          }

          .entradaaddc {
            left: 0%;
          }

          .contcontactov2 {
            border-radius: 9px;
            width: 90vw;
            background-color: whitesmoke;
            padding: 20px;
            position: absolute;
            overflow: hidden;
          }

          .flecharetro {
            height: 40px;
            width: 40px;
            padding: 5px;
            cursor: pointer;
          }

          .headercontact {
            display: flex;
            justify-content: space-around;
            width: 100%;
          }

          .tituloventa {
            display: flex;
            align-items: center;
            font-size: 30px;
            font-weight: bolder;
            text-align: center;
            justify-content: center;
          }

          .cuerpoform {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .inputform {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            width: 100%;
          }

          .botonenviar {
            background-color: #1e90ff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
          }

          .botonenviar:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .animado {
            background-color: #ffe5e5;
            padding: 10px;
            border-radius: 6px;
            margin-top: 10px;
          }

          .helperforma {
            background-color: #e5ffe5;
              display: flex
;
    justify-content: center;
        
          }

       .resumen-totales {
  display: flex; 
  justify-content: space-around;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.box-totales {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 30%;
  min-width: 120px;
}

.box-totales .label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 6px;
}

.box-totales .valor {
  font-size: 18px;
  font-weight: bold;
}

.invertido {
  background-color: #f0f8ff;
}

.actual {
  background-color: #f5f5dc;
}

.diferencia {
  background-color: #fff0f5;
  cursor: pointer;
}

.diferencia:hover {
  transform: scale(1.1);
  background-color: #ffc0cb;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
}
          .center-button {
            display: flex;
            justify-content: center;
            margin-top: 10px;
          }

          .jwFlex {
            display: flex;
            justify-content: space-around;
            gap: 10px;
          }
        `}</style>
      </div>
    );
  }
}

export default Contacto;
