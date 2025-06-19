import React, { Component } from 'react';

class Contacto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      billetes: { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 },
      monedas: { 1.0: 0, 0.50: 0, 0.25: 0, 0.10: 0, 0.05: 0, 0.01: 0 }
    };
  }

  componentDidMount() {
    setTimeout(() => {
      document.getElementById('mainxx').classList.add('entradaaddc');
    }, 50);
  }

  Onsalida = () => {
    document.getElementById('mainxx').classList.remove('entradaaddc');
    setTimeout(() => {
      this.props.Flecharetro();
    }, 500);
  };

  handleChange = (tipo, denom, valor) => {
    this.setState(prev => ({
      [tipo]: {
        ...prev[tipo],
        [denom]: Number(valor)
      }
    }));
  };

  calcularTotal = () => {
    const { billetes, monedas } = this.state;
    const totalBilletes = Object.entries(billetes).reduce(
      (acc, [denom, cant]) => acc + parseFloat(denom) * cant, 0
    );
    const totalMonedas = Object.entries(monedas).reduce(
      (acc, [denom, cant]) => acc + parseFloat(denom) * cant, 0
    );
    return (totalBilletes + totalMonedas).toFixed(2);
  };

  render() {
    const total = this.calcularTotal();

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
              <div className="tituloventa">
                <p><i className="material-icons">attach_money</i>&nbsp;Contador de Dinero</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="dinero-col">
                <h3><i className="material-icons">money</i> Billetes</h3>
                {Object.keys(this.state.billetes).map(denom => (
                  <div className="linea" key={denom}>
                    <input
                      type="number"
                      min="0"
                      value={this.state.billetes[denom]}
                      onChange={e => this.handleChange('billetes', denom, e.target.value)}
                    />
                    <span>${denom}</span>
                  </div>
                ))}
              </div>

              <div className="dinero-col">
                <h3><i className="material-icons">monetization_on</i> Monedas</h3>
                {Object.keys(this.state.monedas).map(denom => (
                  <div className="linea" key={denom}>
                    <input
                      type="number"
                      min="0"
                      value={this.state.monedas[denom]}
                      onChange={e => this.handleChange('monedas', denom, e.target.value)}
                    />
                    <span>${denom}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <span className="total">Total: ${total}</span>
              <button
                disabled={parseFloat(total) === 0}
                className="continuar-btn"
                onClick={() => {this.props.sendData(total);this.Onsalida()}}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
     
          .maincontacto {
            z-index: 1299;
            width: 99vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s;
            overflow-y: scroll;
          }

          .contcontactov2 {
              top: 0px;
            border-radius: 9px;
            width: 95vw;
            background-color: whitesmoke;
            padding: 15px 20px;
            position: absolute;
            overflow: hidden;
          }

          .entradaaddc {
            left: 0%;
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
            width: 80%;
            margin-bottom: 20px;
          }

          .tituloventa {
            display: flex;
            align-items: center;
            font-size: 26px;
            font-weight: bolder;
            justify-content: center;
          }

          .modal-body {
            display: flex;
            gap: 40px;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .dinero-col {
            flex: 1;
            min-width: 250px;
                display: flex
;box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    flex-flow: column;
    /* justify-content: center; */
    align-items: center;
          }

          .dinero-col h3 {
            display: flex;
            align-items: center;
            font-size: 1.2em;
            margin-bottom: 12px;
            gap: 6px;
            color: #444;
          }

          .linea {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
                width: 50%;
    justify-content: space-between;
          }

          .linea input {
            width: 60px;
            padding: 6px;
            font-size: 1em;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-right: 10px;
            text-align: center;
          }

          .linea span {
            font-size: 1em;
            color: #333;
          }

          .modal-footer {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .total {
            font-size: 1.2em;
            font-weight: bold;
            color: #222;
          }

          .continuar-btn {
            padding: 10px 18px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.3s;
          }

          .continuar-btn:disabled {
            background-color: #999;
            cursor: not-allowed;
          }

          .continuar-btn:hover:not(:disabled) {
            background-color: #0056b3;
          }
        `}</style>
      </div>
    );
  }
}

export default Contacto;
