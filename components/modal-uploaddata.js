import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {addRegs, addVentas, addCompras, addRegsDelete} from "../reduxstore/actions/regcont"
import { Animate } from 'react-animate-mount/lib/Animate';

class InfoClean extends Component {
  state = {
    loading: false,
    registros: [],
         Alert:{Estado:false},
    compras: [],
    ventas: [],
    eliminados: [],
    archivoCargado: false,
  };

  fileInputRef = React.createRef();

  async componentDidMount() {
    setTimeout(() => {
      const main = document.getElementById('mainInfoClean');
      if (main) main.classList.add('entradaaddc');
    }, 500);
  }
parsearCamposJSON(array) {
  return array.map(row => {
    const nuevo = {};
    for (const [clave, valor] of Object.entries(row)) {
      if (typeof valor === 'string') {
        let limpio = valor.trim();

        // Quitar comillas dobles alrededor (ej: '"texto"' => 'texto')
        if (limpio.startsWith('"') && limpio.endsWith('"')) {
          limpio = limpio.slice(1, -1);
        }

        // Intentar parsear si es JSON válido
        try {
          const parseado = JSON.parse(limpio);

          // Solo si el resultado es objeto, array o número (para evitar que "Reg" se vuelva error)
          if (
            typeof parseado === 'object' ||
            Array.isArray(parseado) ||
            typeof parseado === 'number'
          ) {
            nuevo[clave] = parseado;
          } else {
            nuevo[clave] = limpio;
          }
        } catch {
          nuevo[clave] = limpio;
        }
      } else {
        nuevo[clave] = valor;
      }
    }
    return nuevo;
  });
}

  
  handleFileChange = (e) => {
  if (this.state.loading) return; // evitar doble carga

  this.setState({ loading: true })
  setTimeout( async() => {
    const file = e.target.files[0];
    if (!file) {
      this.setState({ loading: false });
      return;
    }

    const data =  await file.arrayBuffer();
    const workbook = await XLSX.read(data, { type: 'array' });

    const getSheetData = (name) =>
      workbook.SheetNames.includes(name)
        ? XLSX.utils.sheet_to_json(workbook.Sheets[name])
        : [];

    const registrosRaw = getSheetData('Registros');
    const registros = this.parsearCamposJSON(registrosRaw);

    const comprasRaw = getSheetData('Compras');
    const compras = this.parsearCamposJSON(comprasRaw);

    const ventasRaw = getSheetData('Ventas');
    const ventas = this.parsearCamposJSON(ventasRaw);

    const eliminadosRaw = getSheetData('Eliminados');
    const Eliminados = this.parsearCamposJSON(eliminadosRaw);

    let misRegs = (this.props.state.RegContableReducer.Regs || []).slice();
    let misCompras = (this.props.state.RegContableReducer.Compras || []).slice();
    let misVentas = (this.props.state.RegContableReducer.Ventas || []).slice();
    let misregsDelete = (this.props.state.RegContableReducer.RegsDelete || []).slice();

    const obtenerIds = (arr) =>
      new Set(
        arr.map(r => {
          try {
            return typeof r._id === 'object' ? r._id.toString() : String(r._id);
          } catch {
            return null;
          }
        })
      );

    const filtrarNuevos = (nuevos, existentesSet) =>
      nuevos.filter(r => {
        const id = typeof r._id === 'object' ? r._id.toString() : String(r._id);
        return !existentesSet.has(id);
      });

    const finalregs = filtrarNuevos(registros, obtenerIds(misRegs));
    const finalCompras = filtrarNuevos(compras, obtenerIds(misCompras));
    const finalVentas = filtrarNuevos(ventas, obtenerIds(misVentas));
    const finalEliminados = filtrarNuevos(Eliminados, obtenerIds(misregsDelete));

    this.props.dispatch(addRegs(finalregs));
    this.props.dispatch(addCompras(finalCompras));
    this.props.dispatch(addVentas(finalVentas));
    this.props.dispatch(addRegsDelete(finalEliminados));

    const add = {
      Estado: true,
      Tipo: "success",
      Mensaje: "Informacion cargada con exito"
    };

    this.setState({
      Alert: add,
      loading: false,
    });

    setTimeout(() => {
      this.Onsalida();
    }, 300);

  }, 500);
};


  Onsalida = () => {
    const main = document.getElementById('mainInfoClean');
    if (main) main.classList.remove('entradaaddc');
    setTimeout(() => {
      this.props.Flecharetro();
    }, 500);
  };

  render() {
    const { archivoCargado, loading } = this.state;
    const buttonColor = archivoCargado ? '#17a2b8' : '#28a745';
    const hoverColor = archivoCargado ? '#138496' : '#218838';
console.log(this.props)
   const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      
    return (
      <div>
        <div className="maincontacto" id="mainInfoClean">
          <div className="contcontactov2">
            <div className="headercontact">
              <img
                src="/static/flecharetro.png"
                alt=""
                className="flecharetro"
                onClick={this.Onsalida}
              />
              <div className="tituloventa">Visualizar información antigua</div>
            </div>
           
<div style={{display:"flex", justifyContent:"center", flexFlow:"column", margin:"20px", alignItems:"center"}}>
            <Animate show={!loading} >
            <label htmlFor="excel-upload" className="upload-button">
              <span className="material-icons">upload_file</span>
              Subir Excel
            </label>

           
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx"
              ref={this.fileInputRef}
              onChange={this.handleFileChange}
              className="hidden-input"
            />
             </Animate>
   <Animate show={loading} >

         <CircularProgress />
   </Animate>
           
               </div>
           
          </div>
        </div>
     <Snackbar open={this.state.Alert.Estado} autoHideDuration={10000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
        <style jsx>{`
          .maincontacto {
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
            transition: 0.5s;
          }

          .contcontactov2 {
            border-radius: 9px;
            width: 90vw;
            background-color: whitesmoke;
            padding: 5px 10px;
            position: absolute;
            overflow: hidden;
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

          .upload-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: ${buttonColor};
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: transform 0.1s ease, background-color 0.3s ease;
                width: 200px;
    display: flex;
    justify-content: center;
    margin: 10px auto;
          }

          .upload-button:hover {
            background-color: ${hoverColor};
          }

          .upload-button:active {
            transform: scale(0.96);
          }

          .material-icons {
            font-size: 20px;
          }

          .hidden-input {
            display: none;
          }

          .centrar {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

export default connect(mapStateToProps, null)(InfoClean);
