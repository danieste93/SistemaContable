import React, { useState, useEffect} from "react";

import Carrito from '../puntoventacompo/carritoAnimado';

export default function sidebarPVUX({NumberSelect, ArtVent,getNumber}) {
  console.log(getNumber)
  const [selected, setSelected] = useState(getNumber);
 useEffect(() => {
    setSelected(getNumber);
  }, [getNumber]);
 

  return (
    <div className="sidebarPVUX">
      <div className="logo">
       
      </div>

      <div className="icons">
       <div
          className={`icon-wrapper ${selected === 0 ? "selected" : ""}`}
          onClick={() => {
            setSelected(0);
            NumberSelect(0);
          }}
        >
          <i className="material-icons">home</i>
        </div>
           <div
          className={`icon-wrapper ${selected === 1 ? "selected" : ""}`}
          onClick={() => {
            setSelected(1);
            NumberSelect(1);
          }}
        >
          <i className="material-icons">emoji_people</i>
        </div>
           <div
          className={`icon-wrapper ${selected === 2 ? "selected" : ""}`}
          onClick={() => {
            setSelected(2);
            NumberSelect(2);
          }}
        >
          <Carrito ArtVent={ArtVent}/>
        </div>
      
      </div>

      <div className="info">
     <div
          className={`icon-wrapper ${selected === 4 ? "selected" : ""}`}
          onClick={() => {
            setSelected(4);
            NumberSelect(4);
          }}
        >
          <i className="material-icons">attach_money</i>
        </div>
      </div>

      <style jsx>{`
        .sidebarPVUX {
        position:fixed;
          width: 60px;
          height: 95vh;
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
