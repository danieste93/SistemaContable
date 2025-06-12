import React, { useState, useEffect } from "react";

const fallbackImages = [
  "/iconspv/a1.png",
  "/iconspv/a2.png",
  "/iconspv/a3.png",
  "/iconspv/a4.png",
  "/iconspv/a5.png",
  "/iconspv/a6.png",
  "/iconspv/a7.png",
  "/iconspv/a8.png",
];

export default function ItemCard({updateArtimg ,datos,sendArt, Cuenta }) {
  const [expanded, setExpanded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (datos.Imagen && datos.Imagen[0]) {
      setImageSrc(datos.Imagen[0]);
    } else {
      const random = Math.floor(Math.random() * fallbackImages.length);
      setImageSrc(fallbackImages[random]);
      let miart = datos
      miart.Imagen[0] = fallbackImages[random]
      updateArtimg(miart)  
      console.log(miart)


    }
  }, [datos]);

  const handleToggleTitle = () => {
    setExpanded(!expanded);
  };

  const handleClick = () => {
  if (datos.Existencia === 0 && datos.Tipo !== "Servicio") return;
  setClicked(true);
  sendArt(datos)
  setTimeout(() => setClicked(false), 150);
};

  const formatPrice = (price) => {
    return `$${Number(price).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  const toggleFlip = (e) => {
    e.stopPropagation(); // para evitar conflicto con handleClick
    setFlipped(!flipped);
  };

  const isOutOfStock = datos.Existencia === 0;

  return (
<div
  className={`card-container ${flipped ? "flipped" : ""} ${
    datos.Existencia === 0 && datos.Tipo !== "Servicio" ? "" : "hoverable"
  }`}
  onClick={handleClick}
>
  <div
    className={`card ${
      datos.Existencia === 0 && datos.Tipo !== "Servicio" ? "out-of-stock" : ""
    } ${clicked ? "clicked" : ""}`}
  >
        {/* Lado frontal */}
        <div className="front">
          <div className="arrow" onClick={toggleFlip}>
            ➤
          </div>
          <img src={imageSrc} alt="Producto" className="product-image" />
          <div className="info">
            <div className="left">
              <span className="title"  onClick={(e) => {
    e.stopPropagation();
   
  }} >
                {expanded || datos.Titulo.length <= 15
                  ? datos.Titulo
                  : `${datos.Titulo.slice(0, 15)}...`}
              </span>
             {datos.Titulo.length > 15 && (
  <div className="tooltip">{datos.Titulo}</div>
)}
            </div>
            <div className="right">
              <span className="price">{formatPrice(datos.Precio_Venta)}</span>
            </div>
          </div>
        </div>

        {/* Lado trasero */}
        <div className="back">
          <div className="arrow" onClick={toggleFlip}>
            ⬅
          </div>
          <div className="details">
            <p>Más info:</p>
            <p>Categoría: {datos.Categoria.nombreCat || "N/A"}</p>
            <p>Stock: {datos.Existencia}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-container {
          perspective: 1000px;
          width: 130px;
          height: 170px;
          margin: 3px;
          
        }

        .card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

        .card.clicked {
          transform: scale(0.90);
        }

        .card-container.flipped .card {
          transform: rotateY(180deg);
        }
.card.out-of-stock {
  background-color: #ffe5e5;
}

.card.out-of-stock .info .title {
  pointer-events: auto;
}

        .front,
        .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          padding: 16px;
          box-sizing: border-box;
          border-radius: 12px;
        }

        .front {
          z-index: 2;
        }

        .back {
          transform: rotateY(180deg);
          background-color: #f9f9f9;
        }

        .arrow {
          position: absolute;
          top: 6px;
          right: 10px;
          font-size: 18px;
          cursor: pointer;
        }

        .product-image {
          width: 80%;
          margin: 0 auto 12px;
          display: block;
          border-radius: 8px;
          object-fit: contain;
        }

        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          user-select: none;
          position: relative;
        }

        .tooltip {
          position: absolute;
          top: 25%;
          left: 0;
          margin-top: 6px;
          background: #333;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 15px;
          z-index: 20;
          text-wrap: wrap;
          user-select: none;
        }
          .tooltip {
  display: none;
}

.title:hover + .tooltip {
  display: block;
}

        .price {
          font-weight: bold;
          color: #222;
          font-size: 14px;
        }

        .details {
          font-size: 13px;
          color: #444;
        }

        .card.out-of-stock .arrow {
          pointer-events: auto;
        }
   .card-container.hoverable {
  transition: transform 0.25s ease;
}

.card-container.hoverable:hover {
  transform: scale(1.03);
  cursor: pointer;
}
      `}</style>
    </div>
  );
}
