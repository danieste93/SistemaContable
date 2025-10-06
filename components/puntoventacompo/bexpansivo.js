import React, { useState } from "react";

export default function BotonExpandible({ onArticuloClick, onServicioClick }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="contenedor-boton-expandible">
      <button
        className={`btn botonedit ${expandido ? "expandido" : ""}`}
        onClick={() => setExpandido(!expandido)}
      >
        <span className="material-icons">add</span>
      </button>

      {expandido && (
        <div className="opciones">
          <button
            className="opcion articulo"
            onClick={() => {
              setExpandido(false);
              onArticuloClick();
            }}
          >
            <span className="material-icons">inventory_2</span>
            <p>Artículo</p>
          </button>
          <button
            className="opcion servicio"
            onClick={() => {
              setExpandido(false);
              onServicioClick();
            }}
          >
            <span className="material-icons">build</span>
            <p>Servicio</p>
          </button>
        </div>
      )}

      <style jsx>{`
        .contenedor-boton-expandible {
          position: relative;
          display: inline-block;
        }

        .botonedit {
          background-color: #17a2b8;
          color: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          font-size: 24px;
        }

        .botonedit.expandido {
          background-color: #138496;
          transform: rotate(45deg);
        }

        .opciones {
        z-index:1;
        background:white;
          position: absolute;
          top: 60px;
          left: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .opcion {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .opcion.articulo {
          background-color: #007bff;
        }

        .opcion.servicio {
          background-color: #28a745;
        }

        .opcion .material-icons {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}
