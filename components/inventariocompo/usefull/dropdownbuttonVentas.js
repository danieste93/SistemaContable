import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import generarReporteVentasPDF from '../generadorReporte';
import generarReporteVentasExcel from "../generadorReporteExcelVentas";
import generadorReporteFacturas from "../generadorReporteFacturas"
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const downloadSellReport = (ventas, state, img) => {

  generarReporteVentasPDF(ventas, img, state);
};

const DropdownButton = ({ arrData, state, img }) => {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [facturaSubMenuOpen, setFacturaSubMenuOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleMenuClick = () => setOpen(!open);
  const handleSubMenuClick = () => setSubMenuOpen(!subMenuOpen);
  const handleFacturaMenuClick = () => setFacturaSubMenuOpen(!facturaSubMenuOpen);




  const handleClickPDF = (event) => {
    if (arrData.length === 0) {
      event.stopPropagation();
      setAlertOpen(true);
    } else {
      downloadSellReport(arrData, state, img);
    }
  };

  const handleClickExcel = (event) => {
    if (arrData.length === 0) {
      event.stopPropagation();
      setAlertOpen(true);
    } else {
       
        generarReporteVentasExcel(arrData, state, img);
    }
  };

  const handleClickFacturas = (event) => {
    if (arrData.length === 0) {
        event.stopPropagation();
        setAlertOpen(true);
      } else {

        let facturas = arrData.filter(x=>x.Doctype=="Factura-Electronica")
         
        generadorReporteFacturas(facturas, state);
      }
 
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-btn" onClick={handleMenuClick}>
        Reportes
      </button>
      {open && (
        <div className="dropdown-menu animated-menu">
          <button className="menu-item" onClick={handleSubMenuClick}>
            Reporte Ventas
          </button>
          {subMenuOpen && (
            <div className="submenu animated-submenu">
              <button className="submenu-item pdf" onClick={handleClickPDF}>
                <span className="material-icons">picture_as_pdf</span> PDF
              </button>
              <button className="submenu-item excel" onClick={handleClickExcel}>
                <span className="material-icons">table_chart</span> EXCEL
              </button>
            </div>
          )}
          <button className="menu-item" onClick={handleFacturaMenuClick}>
            Reporte Facturas
          </button>
          {facturaSubMenuOpen && (
            <div className="submenu animated-submenu">
             
              <button className="submenu-item excel" onClick={handleClickFacturas}>
                <span className="material-icons">table_chart</span> EXCEL
              </button>
            </div>
          )}
        </div>
      )}

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Error: No hay datos disponibles.
        </Alert>
      </Snackbar>

      <style jsx>
        {`
          /* Main Button Styling */
          .dropdown-container {
            position: relative;
            display: inline-block;
          }

          .dropdown-btn {
            background-color: #3a76d3; /* Azul confianza */
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }

          .dropdown-btn:hover {
            transform: translateY(-2px);
          }

          /* Dropdown Menu Styling */
          .dropdown-menu {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #f9f9f9;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            width: 200px;
            padding: 10px;
            z-index: 10;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
          }

          .menu-item {
            background: none;
            border: none;
            color: #3a76d3;
            font-size: 16px;
            font-weight: bold;
            padding: 8px 15px;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .menu-item:hover {
            background-color: #e3f2fd;
          }

          /* Submenu Styling */
          .submenu {
            display: flex;
            flex-direction: column;
            padding-left: 15px;
            opacity: 0;
            animation: slideIn 0.3s forwards;
          }

          .submenu-item {
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 8px 15px;
            border: none;
            background: none;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .submenu-item span.material-icons {
            margin-right: 8px;
          }

          /* Specific Colors for PDF and Excel */
          .pdf {
            color: #ff4c4c; /* Rojo bajo */
          }

          .pdf:hover {
            background-color: #ff4c4c;
            color: #fff;
          }

          .excel {
            color: #4caf50; /* Verde alto */
          }

          .excel:hover {
            background-color: #4caf50;
            color: #fff;
          }

          /* Animation Keyframes */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default DropdownButton;
