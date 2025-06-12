import React, { useState } from "react";

import Carrito from '../puntoventacompo/carritoAnimado';

export default function sidebarPVUX({NumberSelect, ArtVent}) {
  const [selected, setSelected] = useState(0);

  const icons = [
    { name: "calculate" },
    { name: "emoji_people" },
    { name: "payment" },
    { name: "settings" },
  ];

  return (
    <div className="sidebarPVUX">
      <div className="logo">
       
      </div>

      <div className="icons">
        {icons.map((icon, index) => (
          <div
            key={index}
            className={`icon-wrapper ${selected === index ? "selected" : ""}`}
            onClick={() => {setSelected(index) 
NumberSelect(index)
            }}
          >
            <i className="material-icons">{icon.name}</i>
          </div>
        ))}
      </div>

      <div className="info">
        <Carrito ArtVent={ArtVent}/>
      </div>

      <style jsx>{`
        .sidebarPVUX {
        position:fixed;
          width: 60px;
          height: 90vh;
          background-color: #00c2d4;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
        }

        .logo,
        .info {
          margin: 12px 0;
        }

        .logo i,
        .info i {
          font-size: 32px;
          color: white;
        }

        .icons {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          justify-content: center;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s;
          cursor: pointer;
        }

        .icon-wrapper i {
          font-size: 28px;
          color: white;
          opacity: 0.8;
        }

        .icon-wrapper.selected {
          background-color: #44e1eb;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }

        .icon-wrapper.selected i {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
