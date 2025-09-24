import React, { Component } from 'react';
import { Animate } from "react-animate-mount";
import { connect } from 'react-redux';
import './modalcuentas.css';
import Editcuenta from './modal-editcuenta';
import Addcuenta from './modal-addcuenta';

class Cuentas extends Component {
  componentDidMount() {
    setTimeout(() => {
      document.getElementById('maincuentas').classList.add("entrada");
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
      // Al abrir, mostrar solo cuentas ocultas
      this.setState({ visibility: true });
    }, 50);

    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden';

    // Listener global para teclado
    window.addEventListener('keydown', this.handleGlobalKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleGlobalKeyDown);
    // Restaurar scroll del fondo
    document.body.style.overflow = '';
  }

  handleGlobalKeyDown = (e) => {
    // Si el popup está abierto y el input existe
    const modalActivo = document.getElementById('maincuentas')?.classList.contains('entrada');
    const input = this.inputRef.current;
    if (modalActivo && input) {
      input.focus();
      // Si es una tecla alfanumérica, agregamos al valor
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.setState({ cuentasSearcher: this.state.cuentasSearcher + e.key });
        e.preventDefault();
      }
      // Si es Backspace, borramos el último caracter
      if (e.key === 'Backspace') {
        this.setState({ cuentasSearcher: this.state.cuentasSearcher.slice(0, -1) });
        e.preventDefault();
      }
    }
  }
  state = {
    editmode: false,
    AddCuenta: false,
    cuentasSearcher: '',
    visibility: true, // Mostrar solo cuentas ocultas al abrir
    ModalDeleteC: false,
    CuentaPorDel: null,
    EditCuenta: false,
    CuentaEditar: null,
    addmitipo: false,
    Buscador: true,
  };

  inputRef = React.createRef();

  componentDidMount() {
    setTimeout(() => {
      document.getElementById('maincuentas').classList.add("entrada");
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
    }, 50);
  }

  handleChangeSearcher = (e) => {
    this.setState({ cuentasSearcher: e.target.value });
  };

  render() {
    const cuentas = this.props.regC?.Cuentas || [];
    const lapizctive = this.state.editmode ? 'lapizctive' : '';
    let generadorDeCuentas;
    let cuentasFiltradas = cuentas.filter(cuenta =>
      cuenta.NombreC?.toLowerCase().includes(this.state.cuentasSearcher.toLowerCase())
    );
    let cuentasAMostrar;
    if (this.state.visibility) {
      // Mostrar solo cuentas visibles (Visibility !== false)
      cuentasAMostrar = cuentasFiltradas.filter(cuenta => cuenta.Visibility !== false);
      if (cuentasAMostrar.length > 0) {
        generadorDeCuentas = cuentasAMostrar.map((cuenta, i) => {
          let backgroundSolido = cuenta.Background?.Seleccionado === "Solido" ? cuenta.Background?.colorPicked : undefined;
          let backgroundImagen = cuenta.Background?.Seleccionado === "Imagen" ? cuenta.Background?.urlBackGround : undefined;
          let style = {};
          if (backgroundSolido) {
            style.background = backgroundSolido;
          }
          if (backgroundImagen) {
            style.backgroundImage = `url(${backgroundImagen})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
          }
          style.borderRadius = '10px';
          style.boxShadow = '1px 0px 4px #0002';
          style.width = '160px';
          style.minHeight = '80px';
          style.display = 'flex';
          style.flexDirection = 'column';
          style.alignItems = 'center';
          style.textAlign = 'center';
          style.margin = '8px 4px';
          style.transition = 'box-shadow 0.2s, background 0.2s';
          style.cursor = 'pointer';
          style.opacity = 1;
          return (
            <div
              key={i}
              className={`cuentaRender jwPointer`}
              style={style}
            >
              {this.state.editmode && (
                <div className="contx">
                  <i className="material-icons close" onClick={(e) => {
                    e.stopPropagation();
                    this.setState({ ModalDeleteC: true, CuentaPorDel: cuenta });
                  }}>close</i>
                </div>
              )}
              <div onClick={() => {
                if (this.state.editmode) {
                  this.setState({ EditCuenta: true, CuentaEditar: cuenta });
                } else {
                  if (this.props.cuentacaller === "trans1") {
                    setTimeout(() => { this.props.sendCuentaSelectT1(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  } else if (this.props.cuentacaller === "inggas") {
                    setTimeout(() => { this.props.sendCuentaSelect(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  } else if (this.props.cuentacaller === "trans2") {
                    setTimeout(() => { this.props.sendCuentaSelectT2(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  } else {
                    setTimeout(() => { this.props.sendCuentaSelect(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  }
                }
              }}>
                {cuenta.urlIcono && (
                  <img src={cuenta.urlIcono} alt="icono" style={{ width: 32, height: 32, marginBottom: 4, opacity: cuenta.Visibility === false ? 0.8 : 1 }} />
                )}
                <p className="nombrem">{cuenta.NombreC}</p>
                <p className="">(${cuenta.DineroActual?.$numberDecimal})</p>
                <div className="tipomcont">
                  <p className="tipom">{cuenta.Tipo}</p>
                </div>
              </div>
            </div>
          );
        });
      } else {
        generadorDeCuentas = <div style={{textAlign:'center',padding:'32px',color:'#888'}}>No hay cuentas visibles</div>;
      }
    } else {
      // Mostrar todas las cuentas, destacando las ocultas
      cuentasAMostrar = cuentasFiltradas;
      if (cuentasAMostrar.length > 0) {
        generadorDeCuentas = cuentasAMostrar.map((cuenta, i) => {
          // ...existing code para renderizar cuentas...
          let backgroundSolido = cuenta.Background?.Seleccionado === "Solido" ? cuenta.Background?.colorPicked : undefined;
          let backgroundImagen = cuenta.Background?.Seleccionado === "Imagen" ? cuenta.Background?.urlBackGround : undefined;
          let style = {};
          if (backgroundSolido) {
            style.background = backgroundSolido;
          }
          if (backgroundImagen) {
            style.backgroundImage = `url(${backgroundImagen})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
          }
          style.borderRadius = '10px';
          style.boxShadow = '1px 0px 4px #0002';
          style.width = '160px';
          style.minHeight = '80px';
          style.display = 'flex';
          style.flexDirection = 'column';
          style.alignItems = 'center';
          style.textAlign = 'center';
          style.margin = '8px 4px';
          style.transition = 'box-shadow 0.2s, background 0.2s';
          style.cursor = 'pointer';
          style.opacity = cuenta.Visibility === false ? 0.55 : 1;
          style.border = cuenta.Visibility === false ? '2px dashed #343a40' : undefined;
          return (
            <div
              key={i}
              className={`cuentaRender jwPointer${cuenta.Visibility === false ? ' cuenta-oculta' : ''}`}
              style={style}
            >
              {this.state.editmode && (
                <div className="contx">
                  <i className="material-icons close" onClick={(e) => {
                    e.stopPropagation();
                    this.setState({ ModalDeleteC: true, CuentaPorDel: cuenta });
                  }}>close</i>
                </div>
              )}
              <div onClick={() => {
                if (this.state.editmode) {
                  this.setState({ EditCuenta: true, CuentaEditar: cuenta });
                } else {
                  if (this.props.cuentacaller === "trans1") {
                    setTimeout(() => { this.props.sendCuentaSelectT1(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  } else if (this.props.cuentacaller === "inggas") {
                    setTimeout(() => { this.props.sendCuentaSelect(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  } else if (this.props.cuentacaller === "trans2") {
                    setTimeout(() => { this.props.sendCuentaSelectT2(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  } else {
                    setTimeout(() => { this.props.sendCuentaSelect(cuenta); }, 300);
                    document.getElementById('maincuentas').classList.remove("entrada");
                  }
                }
              }}>
                {/* Icono personalizado si existe */}
                {cuenta.urlIcono && (
                  <img src={cuenta.urlIcono} alt="icono" style={{ width: 32, height: 32, marginBottom: 4, opacity: cuenta.Visibility === false ? 0.8 : 1 }} />
                )}
                <p className="nombrem">{cuenta.NombreC}</p>
                <p className="">(${cuenta.DineroActual?.$numberDecimal})</p>
                <div className="tipomcont">
                  <p className="tipom">{cuenta.Tipo}</p>
                </div>
              </div>
            </div>
          );
        });
      } else {
        generadorDeCuentas = <div>Aun no tienes cuentas creadas</div>;
      }
    }

    return (
      <div>
        {/* Overlay bloqueador */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1999,
          pointerEvents: 'auto',
        }} />
        <div id="maincuentas" className="maincontacto-modalcuentas" style={{zIndex: 2000}}>
          <div className="contcontacto">
            <div className="headercontact cuentasheader">
              <div className="tituloventa">
                <p> Cuentas </p>
              </div>
              <div className="conticonos">
                <i className={`material-icons ${lapizctive}`} onClick={() => this.setState({ editmode: !this.state.editmode })}>edit</i>
                <i className="material-icons" onClick={() => this.setState({ AddCuenta: true })}>add</i>
                <div className="cDc2x">
                  <Animate show={this.state.visibility}>
                    <i className="material-icons" onClick={() => this.setState({ visibility: !this.state.visibility })}>visibility_off</i>
                  </Animate>
                  <Animate show={!this.state.visibility}>
                    <i className="material-icons" onClick={() => this.setState({ visibility: !this.state.visibility })}>visibility</i>
                  </Animate>
                </div>
                <i className="material-icons" onClick={() => {
                  setTimeout(() => { this.props.Flecharetro3(); }, 300);
                  document.getElementById('maincuentas').classList.remove("entrada");
                }}>close</i>
              </div>
            </div>
            <div className="contcuentasCx">
              <div className="react-autosuggest__container">
                  <input
                    ref={this.inputRef}
                    autoFocus
                    name="cuentasSearcher"
                    className="react-autosuggest__input"
                    onChange={this.handleChangeSearcher}
                    placeholder="Busca tus Cuentas"
                    value={this.state.cuentasSearcher}
                  />
                </div>
              <div className='coninternoCuentas'>
                {generadorDeCuentas}
              </div>
            </div>
          </div>
          {/* Modal para editar cuenta */}
          {this.state.EditCuenta && (
            <Animate show={true}>
              <Editcuenta
                datosUsuario={this.props.regC?.user?._id || ''}
                CuentaEditar={this.state.CuentaEditar}
                Flecharetro4={() => this.setState({ EditCuenta: false, CuentaEditar: null })}
                state={{ RegContableReducer: { Tipos: this.props.regC?.Tipos || [] } }}
              />
            </Animate>
          )}
          {/* Modal para agregar cuenta */}
          {this.state.AddCuenta && (
            <Animate show={true}>
              <Addcuenta
                datosUsuario={this.props.regC?.user?._id || ''}
                Flecharetro4={() => this.setState({ AddCuenta: false })}
                agregarTipo={() => {/* función para agregar tipo si es necesaria */}}
                state={{ RegContableReducer: { Tipos: this.props.regC?.Tipos || [] } }}
              />
            </Animate>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  regC: state.RegContableReducer,
});

export default connect(mapStateToProps)(Cuentas);