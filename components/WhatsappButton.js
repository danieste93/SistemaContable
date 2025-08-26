import React from "react";

/**
 * Botón flotante de WhatsApp reutilizable
 * Props:
 * - phone (string): número de WhatsApp (ej: "+593962124673")
 * - message (string): mensaje predefinido para el chat
 * - title (string): texto para el tooltip/accesibilidad
 * - className (string): clases adicionales opcionales
 */
const WhatsappButton = ({
  phone = "+593962124673",
  message = "Hola, quiero más información sobre las membresías de Activos.ec",
  title = "Contáctanos por WhatsApp",
  className = ""
}) => {
  const url = `https://wa.me/${phone.replace(/[^\d+]/g, "")}?text=${encodeURIComponent(message)}`;
  return (
    <>
      <a
        href={url}
        className={`whatsapp-fab${className ? ` ${className}` : ""}`}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        aria-label={title}
      >
        <i className="fab fa-whatsapp"></i>
      </a>
      <style jsx>{`
        .whatsapp-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 62px;
          height: 62px;
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          box-shadow: 0 4px 18px rgba(37,211,102,0.25);
          z-index: 1200;
          transition: background 0.2s, transform 0.1s;
          border: none;
          text-decoration: none;
        }
        .whatsapp-fab:hover {
          background: linear-gradient(135deg, #128c7e 0%, #25d366 100%);
          color: #fff200;
          transform: scale(1.08);
        }
        @media (max-width: 600px) {
          .whatsapp-fab {
            width: 48px;
            height: 48px;
            font-size: 1.45rem;
            bottom: 70px; /* Subir para no tapar el mensaje flotante */
            right: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsappButton;
