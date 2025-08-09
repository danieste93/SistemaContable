import React, { Component } from 'react';

class Contacto extends Component {
  state = {
    campos: [
      { clave: '', valor: '' },
      { clave: '', valor: '' },
      { clave: '', valor: '' },
      { clave: '', valor: '' },
    ],
  };

  componentDidMount() {
    // Si onReload tiene datos, los monta en el state
    console.log('onReload:', this.props.onReload);

    let camposCargados = [];
    if (
      Array.isArray(this.props.onReload) &&
      this.props.onReload.length > 0 &&
      typeof this.props.onReload[0] === 'object'
    ) {
      camposCargados = this.props.onReload.slice(0, 4); // máximo 4
    }

    // Rellena hasta 4 campos, los que falten quedan vacíos
    while (camposCargados.length < 4) {
      camposCargados.push({ clave: '', valor: '' });
    }

    this.setState({ campos: camposCargados });

    setTimeout(() => {
      document.getElementById('mainxx').classList.add('entradaaddc');
    }, 500);
  }

  Onsalida = () => {
    document.getElementById('mainxx').classList.remove('entradaaddc');
    setTimeout(() => {
      this.props.Flecharetro();
    }, 500);
  };

  handleInputChange = (index, field, value) => {
    const campos = [...this.state.campos];
    campos[index][field] = value;
    this.setState({ campos });
  };

  agregarCampos = () => {
    const nuevos = this.state.campos.filter(
      (item) => item.clave.trim() !== '' && item.valor.trim() !== ''
    );
    if (nuevos.length > 0) {
      this.props.onCamposChange(nuevos);
      this.Onsalida();
    }
  };

  render() {
    const { campos } = this.state;

    return (
      <div>
        <div className="maincontacto" id="mainxx">
          <div className="contcontactov2">
            <div className="headercontact">
              <img
                src="/static/flecharetro.png"
                alt=""
                className="flecharetro"
                onClick={this.Onsalida}
              />
              <div className="tituloventa">Información Adicional</div>
            </div>

            <div className="tablaCampos">
              <div className="tablaHeader">
                <div className="colHeader">Nombre del campo</div>
                <div className="colHeader">Descripción</div>
              </div>

              {/* Inputs para campos */}
              {campos.map((item, index) => (
                <div key={index} className="tablaFila">
                  <input
                    className="inputDato"
                    type="text"
                    placeholder=""
                    value={item.clave}
                    onChange={(e) =>
                      this.handleInputChange(index, 'clave', e.target.value)
                    }
                  />
                  <input
                    className="inputDato"
                    type="text"
                    placeholder=""
                    value={item.valor}
                    onChange={(e) =>
                      this.handleInputChange(index, 'valor', e.target.value)
                    }
                  />
                </div>
              ))}
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button className="btnAgregar" onClick={this.agregarCampos}>
                  Agregar campos
                </button>
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
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s;
          }

          .entradaaddc {
            left: 0%;
          }

          .contcontactov2 {
            border-radius: 12px;
            width: 90vw;
            max-width: 650px;
            background-color: #fff;
            padding: 25px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          .headercontact {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
          }

          .flecharetro {
            height: 35px;
            width: 35px;
            cursor: pointer;
          }

          .tituloventa {
            font-size: 26px;
            font-weight: bold;
          }

          .tablaCampos {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .tablaHeader,
          .tablaFila {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            align-items: center;
          }

          .tablaHeader {
            font-weight: bold;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }

          .colHeader {
            font-size: 14px;
          }

          .colDato {
            font-size: 15px;
            padding: 8px 10px;
            background-color: #f3f3f3;
            border-radius: 6px;
            margin-bottom: 8px;
          }

          .inputDato {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 10px;
          }

          .btnAgregar {
            padding: 10px 20px;
            background: #1976d2;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: background 0.2s;
          }

          .btnAgregar:hover {
            background: #125a9c;
          }
        `}</style>
      </div>
    );
  }
}

export default Contacto;
