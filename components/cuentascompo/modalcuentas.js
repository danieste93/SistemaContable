import React, { Component } from 'react';
import { Animate } from "react-animate-mount";
import { connect } from 'react-redux';
import './modalcuentas.css';

import Editcuenta from './modal-editcuenta';
import Addcuenta from './modal-addcuenta';
import { deleteCuenta } from '../../reduxstore/actions/regcont';

class Cuentas extends Component {
  handleChangeSearcher = (e) => {
    this.setState({ cuentasSearcher: e.target.value });
  }
  constructor(props) {
    super(props);
    this.state = {
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
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    setTimeout(() => {
      const mainCuentas = document.getElementById('maincuentas');
      mainCuentas.classList.add("entrada");
      // Si es PC, elimina el top forzado por JS (corrige bug de centrado)
      if (window.innerWidth >= 1024) {
        mainCuentas.style.top = '';
      }
      // Al abrir, mostrar solo cuentas ocultas
      this.setState({ visibility: true });
      // Forzar scroll al tope en móvil
      if (window.innerWidth < 768) {
        const container = document.querySelector('.contcuentasCx');
        if (container) container.scrollTop = 0;
      }
    }, 50);

    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    // Restaurar scroll del fondo
    document.body.style.overflow = '';
  }

  handleDeleteCuenta = async () => {
    if (this.state.CuentaPorDel) {
      // Obtener token y DBname desde el estado global como en el resto de la app
      const cuenta = this.state.CuentaPorDel;
      const token = this.props.userToken;
      const DBname = this.props.userDBname;
      const datos = {
        Usuario: {
          DBname: DBname
        },
        valores: cuenta
      };
      try {
        const response = await fetch("/cuentas/deleteCount", {
          method: "POST",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || ""
          }
        });
        const result = await response.json();
        if (result.status === "Ok") {
          this.props.deleteCuenta(result.Cuenta);
        } else {
          alert("Error al eliminar la cuenta: " + (result.message || "Error desconocido"));
        }
      } catch (error) {
        alert("Error de conexión al eliminar la cuenta");
      }
    }
    this.setState({ ModalDeleteC: false, CuentaPorDel: null });
  }

  render() {
      const cuentas = this.props.regC?.Cuentas || [];
      const lapizctive = this.state.editmode ? 'lapizctive' : '';
      let generadorDeCuentas;
      let cuentasFiltradas = cuentas
        .filter(cuenta => cuenta.Tipo !== 'Inventario')
        .filter(cuenta => {
          const search = this.state.cuentasSearcher.toLowerCase();
          return (
            cuenta.NombreC?.toLowerCase().includes(search) ||
            cuenta.Tipo?.toLowerCase().includes(search)
          );
        });
      let cuentasAMostrar;
      if (this.state.visibility) {
        // Mostrar solo cuentas visibles (Visibility !== false)
        cuentasAMostrar = cuentasFiltradas.filter(cuenta => cuenta.Visibility !== false);
        if (cuentasAMostrar.length > 0) {
          generadorDeCuentas = cuentasAMostrar.map((cuenta, i) => {
            let backgroundSolido = cuenta.Background?.Seleccionado === "Solido" ? cuenta.Background?.colorPicked : undefined;
            let backgroundImagen = cuenta.Background?.Seleccionado === "Imagen" ? cuenta.Background?.urlBackGround : undefined;
            let style = {};
            let textColor = undefined;
            let nombreShadow = {};
            function isWhite(color) {
              if (!color) return false;
              let c = color.trim().toLowerCase();
              if (c === '#fff' || c === '#ffffff') return true;
              if (c.startsWith('rgb')) {
                const vals = c.match(/\d+/g);
                if (!vals || vals.length < 3) return false;
                return vals[0] === '255' && vals[1] === '255' && vals[2] === '255';
              }
              return false;
            }
            function isDark(color) {
              if (!color) return false;
              let c = color.trim();
              if (c.startsWith('#')) {
                c = c.substring(1);
                if (c.length === 3) c = c.split('').map(x => x + x).join('');
                if (c.length !== 6) return false;
                const r = parseInt(c.substring(0, 2), 16);
                const g = parseInt(c.substring(2, 4), 16);
                const b = parseInt(c.substring(4, 6), 16);
                return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
              }
              if (c.startsWith('rgb')) {
                const vals = c.match(/\d+/g);
                if (!vals || vals.length < 3) return false;
                const r = parseInt(vals[0]);
                const g = parseInt(vals[1]);
                const b = parseInt(vals[2]);
                return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
              }
              return false;
            }
            if (backgroundSolido) {
              style.background = backgroundSolido;
              if (isDark(backgroundSolido)) textColor = '#fff';
              if (cuenta.Visibility === false) textColor = '#fff';
            }
            if (backgroundImagen) {
              style.backgroundImage = `url(${backgroundImagen})`;
              style.backgroundSize = 'cover';
              style.backgroundPosition = 'center';
              textColor = '#fff';
              nombreShadow = { textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 0px 2px #000, 0 0px 24px #000' };
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
                style={{
                  ...style,
                  border: isWhite(backgroundSolido)
                    ? '2.5px solid rgba(30,30,30,0.18)'
                    : style.border,
                  boxShadow: isWhite(backgroundSolido)
                    ? '0 2px 12px rgba(30,30,30,0.10)'
                    : style.boxShadow
                }}
              >
                {this.state.editmode && (
                  <i
                    className="material-icons close cuenta-delete-btn"
                    style={{ position: 'absolute', top: 6, right: 8, fontSize: 22, color: '#e53935', cursor: 'pointer', zIndex: 2 }}
                    title="Eliminar cuenta"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ ModalDeleteC: true, CuentaPorDel: cuenta });
                    }}
                  >close</i>
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
                    <img 
                      src={cuenta.urlIcono} 
                      alt="icono" 
                      style={{ 
                        width: 32, 
                        height: 32, 
                        marginBottom: 4, 
                        opacity: cuenta.Visibility === false ? 0.8 : 1,
                        border: isWhite(backgroundSolido) ? '2px solid rgba(30,30,30,0.45)' : undefined,
                        borderRadius: '50%',
                        boxShadow: isWhite(backgroundSolido) ? '0 2px 8px rgba(30,30,30,0.12)' : undefined,
                        objectFit: 'cover'
                      }} 
                    />
                  )}
                  {/* Barra blanca para fondo personalizado, barra negra para fondo blanco */}
                  {(backgroundSolido || backgroundImagen) ? (
                    isWhite(backgroundSolido) ? (
                      <div style={{
                        width: '90%',
                        margin: '0 auto 4px auto',
                        borderRadius: '7px',
                        background: 'rgba(30,30,30,0.82)',
                        padding: '2px 8px',
                        display: 'inline-block',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <p className="nombrem" style={{ color: '#fff', fontWeight: 700, marginBottom: 2, textAlign: 'center' }}>{cuenta.NombreC}</p>
                        <p className="" style={{ color: '#fff', fontWeight: 500, marginBottom: 2, textAlign: 'center' }}>${cuenta.DineroActual?.$numberDecimal}</p>
                      </div>
                    ) : (
                      <div style={{
                        width: '90%',
                        margin: '0 auto 4px auto',
                        borderRadius: '7px',
                        background: 'rgba(255,255,255,0.85)',
                        padding: '2px 8px',
                        display: 'inline-block',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <p className="nombrem" style={{ color: '#222', fontWeight: 700, marginBottom: 2, textAlign: 'center' }}>{cuenta.NombreC}</p>
                        <p className="" style={{ color: '#222', fontWeight: 500, marginBottom: 2, textAlign: 'center' }}>${cuenta.DineroActual?.$numberDecimal}</p>
                      </div>
                    )
                  ) : (
                    <>
                      <p className="nombrem" style={Object.assign({}, textColor ? { color: textColor } : {}, nombreShadow)}>{cuenta.NombreC}</p>
                      <p className="" style={Object.assign({}, textColor ? { color: textColor } : {}, nombreShadow)}>${cuenta.DineroActual?.$numberDecimal}</p>
                    </>
                  )}
                  <div className="tipomcont" style={textColor ? { color: textColor } : {}}>
                    <p className="tipom" style={textColor ? { color: textColor } : {}}>{cuenta.Tipo}</p>
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
            let backgroundSolido = cuenta.Background?.Seleccionado === "Solido" ? cuenta.Background?.colorPicked : undefined;
            let backgroundImagen = cuenta.Background?.Seleccionado === "Imagen" ? cuenta.Background?.urlBackGround : undefined;
            let style = {};
            let textColor = undefined;
            let nombreShadow = {};
            // Reglas de color de texto y sombra
            function isDark(color) {
              if (!color) return false;
              let c = color.trim();
              if (c.startsWith('#')) {
                c = c.substring(1);
                if (c.length === 3) c = c.split('').map(x => x + x).join('');
                if (c.length !== 6) return false;
                const r = parseInt(c.substring(0, 2), 16);
                const g = parseInt(c.substring(2, 4), 16);
                const b = parseInt(c.substring(4, 6), 16);
                return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
              }
              if (c.startsWith('rgb')) {
                const vals = c.match(/\d+/g);
                if (!vals || vals.length < 3) return false;
                const r = parseInt(vals[0]);
                const g = parseInt(vals[1]);
                const b = parseInt(vals[2]);
                return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
              }
              return false;
            }
            if (backgroundSolido) {
              style.background = backgroundSolido;
              if (isDark(backgroundSolido)) textColor = '#fff';
            }
            if (backgroundImagen) {
              style.backgroundImage = `url(${backgroundImagen})`;
              style.backgroundSize = 'cover';
              style.backgroundPosition = 'center';
              textColor = '#fff';
              nombreShadow = { textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 0px 2px #000, 0 0px 24px #000' };
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
                  <i
                    className="material-icons close cuenta-delete-btn"
                    style={{ position: 'absolute', top: 6, right: 8, fontSize: 22, color: '#e53935', cursor: 'pointer', zIndex: 2 }}
                    title="Eliminar cuenta"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ ModalDeleteC: true, CuentaPorDel: cuenta });
                    }}
                  >close</i>
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
                  <p className="nombrem" style={Object.assign({}, textColor ? { color: textColor } : {}, nombreShadow)}>{cuenta.NombreC}</p>
                  <p className="" style={Object.assign({}, textColor ? { color: textColor } : {}, nombreShadow)}>${cuenta.DineroActual?.$numberDecimal}</p>
                  <div className="tipomcont" style={textColor ? { color: textColor } : {}}>
                    <p className="tipom" style={Object.assign({}, textColor ? { color: textColor } : {}, nombreShadow)}>{cuenta.Tipo}</p>
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
          <div id="maincuentas" className="maincontacto-modalcuentas">
            <div className="contcontacto">
              <div className="headercontact cuentasheader">
                <div className="tituloventa">
                  <p> Cuentas </p>
                </div>
                <div className="conticonos">
                  <i className={`material-icons ${lapizctive}`} onClick={() => this.setState({ editmode: !this.state.editmode })}>edit</i>
                  <i className="material-icons" onClick={() => this.setState({ AddCuenta: true })}>add</i>
                  <i
                    className="material-icons"
                    title={this.state.visibility ? 'Ocultar cuentas' : 'Mostrar cuentas'}
                    onClick={() => this.setState({ visibility: !this.state.visibility })}
                    style={{ transition: 'color 0.2s, transform 0.2s' }}
                  >
                    {this.state.visibility ? 'visibility_off' : 'visibility'}
                  </i>
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
            {/* Modal de confirmación para eliminar cuenta */}
            {this.state.ModalDeleteC && this.state.CuentaPorDel && (
              <div className="modal-delete-cuenta-overlay">
                <div className="modal-delete-cuenta">
                  <p>¿Seguro que deseas eliminar la cuenta <b>{this.state.CuentaPorDel.NombreC}</b>?</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
                    <button className="btn-cancelar" onClick={() => this.setState({ ModalDeleteC: false, CuentaPorDel: null })}>Cancelar</button>
                    <button className="btn-eliminar" onClick={() => this.handleDeleteCuenta()}>Eliminar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
}

const mapStateToProps = state => ({
  regC: state.RegContableReducer,
  userToken: state.userReducer?.update?.usuario?.token,
  userDBname: state.userReducer?.update?.usuario?.user?.DBname,
});

const mapDispatchToProps = {
  deleteCuenta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cuentas);