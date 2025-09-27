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
        {/* SVG logo WhatsApp */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path d="M22.1 18.7c-.3-.2-1.7-.8-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.2.1-.3 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.7.7-.7 1.7 0 1 .7 2 1.1 2.5.4.5 1.6 2.5 3.9 3.3.5.2.9.3 1.2.4.5.1.9.1 1.2.1.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1.1z" fill="#fff"/>
        </svg>
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
        .whatsapp-fab.static-whatsapp {
          position: static !important;
          width: 48px;
          height: 48px;
          font-size: 1.45rem;
          box-shadow: 0 2px 8px rgba(37,211,102,0.18);
          margin-left: 0;
          margin-right: 0;
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
            bottom: 70px;
            right: 12px;
          }
          .whatsapp-fab.static-whatsapp {
            width: 42px;
            height: 42px;
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsappButton;
