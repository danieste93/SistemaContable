import React, { useState, useEffect, useRef } from "react";

const fallbackImages = [
  "/iconspv/a1.png",
  "/iconspv/a2.png",
  "/iconspv/a3.png",
  "/iconspv/a4.png",
  "/iconspv/a5.png",
  "/iconspv/a6.png",
  "/iconspv/a7.png",
  "/iconspv/a8.png",
  "/iconspv/a9.png",
  "/iconspv/a10.png",
  "/iconspv/a11.png",
  "/iconspv/a12.png",
  "/iconspv/a13.png",
  "/iconspv/a14.png",
  "/iconspv/a15.png",
  "/iconspv/a16.png",
  "/iconspv/a17.png",
  "/iconspv/a18.png",
  "/iconspv/a19.png",
  "/iconspv/a20.png",

];

export default function ItemCard({updateArtimg ,datos,sendArt, Cuenta , onEdit}) {
  let getCuenta = Cuenta()
  const [expanded, setExpanded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [flipped, setFlipped] = useState(false);
    const [visible, setVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
const cardRef = useRef(null);
const tooltipTimeout = useRef(null);

  useEffect(() => {
    if (datos.Imagen && datos.Imagen[0]) {
      setImageSrc(datos.Imagen[0]);
    } else {
      const random = Math.floor(Math.random() * fallbackImages.length);
      setImageSrc(fallbackImages[random]);
      let miart = datos
      miart.Imagen[0] = fallbackImages[random]
      updateArtimg(miart)  

    }

     // Animación con timeout
    const timer = setTimeout(() => {
     setVisible(true)
    }, 500);

    return () => clearTimeout(timer); // limpieza del timeout
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

  const handleTouchStart = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    // Oculta el tooltip automáticamente después de 2 segundos
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 2000);
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    // Opcional: puedes ocultar el tooltip aquí si prefieres
    // setShowTooltip(false);
  };

  // Limpieza del timeout al desmontar
  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    };
  }, []);

  return (
<div
id="cardCont"
ref={cardRef}
  className={`card-container ${visible ? "visibleXD" : ""} ${flipped ? "flipped" : ""} ${
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
              <span
  className="title"
  onClick={(e) => { e.stopPropagation(); }}
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
                {expanded || datos.Titulo.length <= 30
                  ? datos.Titulo
                  : `${datos.Titulo.slice(0, 25)}...`}
              </span>
              {datos.Titulo.length > 25 && showTooltip && (
  <div
    className="tooltip"
    onClick={(e) => { e.stopPropagation(); }}
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
  >
    {datos.Titulo}
  </div>
)}
            </div>
            <div className="right">
               <span className="exis">{datos.Tipo=="Producto"?datos.Existencia: 
                                       datos.Tipo=="Servicio"?"∞":""  
                
                }</span>
              <span className="price">{formatPrice(datos.Precio_Venta)}</span>
           
           
           
            </div>
          </div>
        </div>

        {/* Lado trasero */}
        <div className="back">
              <div className="edit-icon">
    <span className="material-icons editP"  onClick={(e) => { e.stopPropagation(); onEdit(datos); }} >
      edit
    </span>
     <div className="arrow" onClick={toggleFlip}>
            ⬅
          </div>
  </div>
         
       <div className="firstBackCont ">
        {/* Parte izquierda */}
         <div className="categoria-info">
     <div className="categoria-titulo">Cat:</div>
          <div className="categoria-nombre">{datos.Categoria.nombreCat}</div>
          <div className="subcategoria">{datos.SubCategoria=="default"?"":datos.SubCategoria}</div>
</div>
        {/* Parte derecha (imagen) */}
        <div className="categoria-icono">
          <img src={datos.Categoria.urlIcono} alt="Icono categoría" />
        </div>
      </div>
       <div className="custonCont">
     <div className="categoria-titulo">IVA:</div>
          <div className="categoria-nombre"><i
  className="material-icons"
  style={{
    color: datos.Iva ? 'green' : 'red'
  }}
>
  {datos.Iva ? 'done' : 'block'}
</i></div>
          </div>
 <div className="custonCont">
     <div className="categoria-titulo">Tipo:</div>
          <div className="categoria-nombre">{datos.Tipo}</div>
          </div>
 <div className="custonCont">
     <div className="categoria-titulo">Bodega:</div>
          <div className="categoria-nombre">{getCuenta[0]?.NombreC}</div>
          </div>

      {/* Parte inferior (ID centrado) */}
      <div className="categoria-id">ID: {datos.Eqid}</div>
        </div>
      </div>

      <style jsx>{`
      .custonCont{
     
    display: flex
;
    align-items: center;
    justify-content: space-between; 
      }
      .firstBackCont{
      display:flex;
     align-items: center;
    justify-content: space-between;
      }

        .card-container {
          perspective: 1000px;
           flex: 1 1 130px;         /* crecen, se encogen, ancho mínimo */
  max-width: 130px;  
          width: 130px;
          height: 180px;
          margin: 3px;
          margin-bottom:6px;
          opacity:0;
          transition:1s;
        }
          .visibleXD{
          opacity:1;
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

.categoria-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.categoria-info {
margin-top:5px;
  display: flex;
  flex-direction: column;
}

.categoria-titulo {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}



.categoria-nombre {
  font-size: 12px;

  color: #333;
}

.subcategoria {
  font-size: 12px;
  color: grey;
}

.categoria-icono img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.categoria-id {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #777;
}

.left{
  width: 100%;
  
    height: 40px;
    display: flex;
     position: relative;
    justify-content: center;
    align-items: center;
    text-align: center;
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
          padding: 8px;
          padding-top:12px;
          box-sizing: border-box;
          border-radius: 12px;
              display: flex;
    flex-flow: column;
    justify-content: space-between;
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
            top: -2px;
    right: 1px;
          font-size: 16px;
          cursor: pointer;
        }
           .editP {
          position: absolute;
            top: -5px;
                padding: 2px;
    left: 3px;
      
          font-size: 16px;
              border-bottom: 1px solid;
    border-radius: 10px;
          cursor: pointer;
          color: black;
        }

        .product-image {
          width: 75%;
          max-height: 60%;
          max-width: 90px;
          margin: auto ;
          display: block;
          border-radius: 8px;
          object-fit: contain;
        }

        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-flow: column;
}
        }

        .title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          user-select: none;
          position: relative;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Limita a 2 líneas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-width: 200px; /* Ajusta según tu diseño */
        }

        .tooltip {
         position: absolute;
  top: -175%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  background:#d3f1f4;
  color: black;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 999999; /* Súbelo aún más */
  text-wrap: wrap;
  user-select: none;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
  pointer-events: auto;
  min-width: 120px;
  max-width: 220px;
  text-align: center;
        }
    
.right{
    flex-flow: row;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 96%;
}
    .exis{
           background:rgba(23, 163, 184, 0.81);
    padding: 3px;
    border-radius: 50%;
    width: 14px;
    text-align: center;
    color: white;
    font-size: 12px;}
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
   
  transition:  0.25s ;
}

.card-container.hoverable:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  
  cursor: pointer;
}

.cardCont {
  opacity: 0;
  transform: scale(0.95);
  transition: all 400ms ease;
}

/* Clase que activa la animación */
.cardCont.visible {
  opacity: 1;
  transform: scale(1);
}

      `}</style>
    </div>
  );
}
