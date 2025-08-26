// pages/firma-electronica.js
// Firma Electrónica - Página principal (versión corregida y funcional)

import React, { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import WhatsappButton from "../components/WhatsappButton";

// Importa el formulario de firma electrónica de forma dinámica
const FormularioPage = dynamic(() => import("./firmas/formulario"), { ssr: false });

export default function FirmaElectronica() {
  const [isDark, setIsDark] = useState(false); // Modo nocturno
  const [modalOpen, setModalOpen] = useState(false); // Modal de envío
  const [iframeSrc, setIframeSrc] = useState(""); // Fuente del iframe
  const [showIframe, setShowIframe] = useState(false); // Mostrar iframe
  const [selectedDuracion, setSelectedDuracion] = useState(""); // Duración seleccionada

  const iframeRef = useRef(null);

  // Al montar, lee el modo nocturno desde localStorage (solo en cliente)
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
      setIsDark(stored === "dark");
    } catch (_) {
      // no-op si localStorage no está disponible
    }
  }, []);

  // Agrega/remueve clase del body cuando el modal está abierto
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (modalOpen) {
      document.body.classList.add("modal-abierto");
    } else {
      document.body.classList.remove("modal-abierto");
    }
    return () => {
      document.body.classList.remove("modal-abierto");
    };
  }, [modalOpen]);

  // Alterna el modo nocturno y guarda en localStorage
  const handleThemeToggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("theme", next ? "dark" : "light");
        }
      } catch (_) {
        // ignorar
      }
      return next;
    });
  }, []);

  // Abre el modal para enviar documentos
  const abrirModalApp = useCallback((duracion = "") => {
    setModalOpen(true);
    setIframeSrc("/public/index.html"); // ajusta la ruta si fuera necesario
    setShowIframe(true);
    setSelectedDuracion(String(duracion || ""));
  }, []);

  // Cierra el modal de envío
  const cerrarModalApp = useCallback(() => {
    setModalOpen(false);
    setShowIframe(false);
    setIframeSrc("");
  }, []);

  // Cuando el iframe carga, selecciona la duración automáticamente
  const handleIframeLoad = useCallback(() => {
    const dur = selectedDuracion;
    if (iframeRef.current && dur) {
      try {
        const doc = iframeRef.current.contentWindow?.document;
        if (!doc) return;
        const select = doc.getElementById("duracionAnual");
        if (select) {
          select.value = dur;
          const event = doc.createEvent("HTMLEvents");
          event.initEvent("change", true, false);
          select.dispatchEvent(event);
        }
      } catch (_) {
        // El acceso al contenido del iframe puede estar bloqueado por CORS
      }
    }
  }, [selectedDuracion]);

  // Maneja el clic en el botón de compra para abrir el modal
  const handleBtnCompra = useCallback((e, duracion) => {
    if (!(e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1)) {
      e.preventDefault();
      abrirModalApp(duracion);
    }
  }, [abrirModalApp]);

  return (
    <div>
      {/* Head: fuentes y estilos globales */}
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Botón de modo nocturno */}
      <button
        className="dark-toggle"
        id="darkModeToggle"
        title="Cambiar modo claro/oscuro"
        onClick={handleThemeToggle}
        aria-label="Cambiar modo claro/oscuro"
      >
        <i className={isDark ? "fas fa-moon" : "fas fa-sun"} />
      </button>

      {/* Contenido principal */}
      <div className={`container${isDark ? " dark" : ""}`}>
        {/* Encabezado y tabla de precios */}
        <h1>
          <img
            src="https://i.ibb.co/bgPZ03R7/Chat-GPT-Image-19-jul-2025-09-07-33-p-m-removebg-preview.png"
            alt="Icono Firma Ecuador"
            style={{
              width: 60,
              height: 60,
              objectFit: "contain",
              display: "inline-block",
              marginRight: 8,
              verticalAlign: "middle",
              borderRadius: 16,
              border: "2.5px solid #a5b4fc",
              boxShadow: "0 0 0 6px #7c3aed33,0 2px 12px #6366f144",
              backdropFilter: "blur(1.5px)",
              background: "transparent",
            }}
            loading="lazy"
          />
          <span
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              lineHeight: 1.1,
              letterSpacing: "1.2px",
              fontSize: "2.1rem",
              fontWeight: 800,
              color: "#fff",
              textShadow: "0 4px 24px #312e81cc,0 1px 0 #fff",
            }}
          >
            Firma Electrónica Ecuador
          </span>
        </h1>

        <table>
          <thead>
            <tr>
              <th>Tipo firma / Años</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Firma p12</td>
              {[1, 2, 3, 4, 5].map((dur) => (
                <td key={`p12-${dur}`}>
                  <div className="precio-celda">
                    <span className="precio-numero">
                      {["$20", "$29", "$38", "$47", "$55"][dur - 1]}
                    </span>
                    <a
                      className="btn-circular btn-compra"
                      data-duracion={dur}
                      data-tipo="p12"
                      href={`https://wa.me/+593962124673?text=Quiero%20comprar%20una%20firma%20electr%C3%B3nica%20archivo%20p12%20por%20${dur}%20a%C3%B1o${dur > 1 ? "s" : ""}`}
                      onClick={(e) => handleBtnCompra(e, String(dur))}
                    >
                      <i className="fas fa-shopping-cart cart-icon" />
                    </a>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td>Firma token</td>
              {[1, 2, 3, 4, 5].map((dur) => (
                <td key={`token-${dur}`}>
                  <div className="precio-celda">
                    <span className="precio-numero">
                      {["$30", "$40", "$50", "$60", "$70"][dur - 1]}
                    </span>
                    <a
                      className="btn-circular"
                      href={`https://wa.me/+593962124673?text=Quiero%20comprar%20una%20firma%20electr%C3%B3nica%20token%20por%20${dur}%20a%C3%B1o${dur > 1 ? "s" : ""}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fas fa-shopping-cart cart-icon" />
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <a href="/precios" className="free-button">
          Obtenla gratis
        </a>

        <div className="description">
          <h2 className="titulo-seccion" style={{ textAlign: "center" }}>
            Requisitos:
          </h2>
          <ul style={{ textAlign: "left", listStylePosition: "outside", paddingLeft: 20 }}>
            <li>
              <i className="fas fa-user-circle" /> Foto con cédula (sin lentes)
            </li>
            <li>
              <i className="fas fa-id-card" /> Cédula (frente y dorso)
            </li>
            <li>
              <i className="fas fa-file-pdf" /> RUC en PDF
            </li>
            <li>
              <i className="fas fa-envelope" /> Correo electrónico
            </li>
            <li>
              <i className="fas fa-phone" /> Teléfono celular
            </li>
          </ul>

          <h2 className="titulo-seccion" style={{ textAlign: "center" }}>
            Pasos a seguir:
          </h2>

          <div className="pasos-flex">
            <div className="paso-circulo" style={{ justifyContent: "flex-start" }}>
              <div className="paso-circulo-inner">
                <span className="paso-numero">1</span>
                <i className="fas fa-folder-open" />
                <span>
                  Juntar documentos + recibo
                  <br />(o realizar pago)
                </span>
              </div>
            </div>

            <div className="paso-circulo" style={{ justifyContent: "center" }}>
              <div className="paso-circulo-inner" style={{ gap: "10px", padding: "0 12px" }}>
                <span className="paso-numero">2</span>
                <button
                  className="whatsapp-button paso-boton"
                  type="button"
                  style={{ marginBottom: "4px", marginTop: "0", width: "100%", fontSize: "0.92em", padding: "7px 0" }}
                  onClick={() => abrirModalApp()}
                >
                  ENVIAR DOCUMENTOS
                </button>
                <span style={{ fontSize: "0.92em", lineHeight: "1.22", wordBreak: "break-word" }}>
                  Subir información
                  <br />
                  (haz clic en el botón)
                </span>
              </div>
            </div>

            <div className="paso-circulo" style={{ justifyContent: "flex-end" }}>
              <div className="paso-circulo-inner">
                <span className="paso-numero">3</span>
                <i className="fas fa-link" />
                <span>
                  Recibir enlace por correo
                  <br />
                  para contraseña y descargar p12
                </span>
              </div>
            </div>
          </div>

          <p style={{ marginTop: 16, fontSize: 14 }}>
            Nota: Si la información requerida es correcta, la firma electrónica estaría lista en 30 minutos.
          </p>
        </div>

        {/* Formulario de envío de firma electrónica */}
        <div style={{ marginTop: 40, marginBottom: 40 }}>
          <FormularioPage />
        </div>

        <div className="precaution">
          <h2>
            <i className="fas fa-exclamation-triangle" /> Precauciones importantes
          </h2>
          <ul>
            <li>
              <strong>Cerciórese de escribir correctamente su dirección de correo electrónico.</strong> Una vez enviada la firma electrónica, no se podrá recuperar si hay errores en el correo proporcionado.
            </li>
            <li>
              <strong>Guarde el archivo p12 en un lugar seguro.</strong> No hay forma de recuperarlo si se pierde.
            </li>
            <li>
              <strong>Al recibir el enlace del correo para crear una nueva contraseña,</strong> úselo desde una computadora o laptop para evitar problemas técnicos.
            </li>
          </ul>
        </div>

        {/* Modal simple para iframe */}
        {modalOpen && (
          <div className="modal-auth-overlay" onClick={cerrarModalApp} role="dialog" aria-modal="true">
            <div className="modal-auth-pro" onClick={(e) => e.stopPropagation()}>
              <button className="modal-auth-close btncerrarCustom" onClick={cerrarModalApp} aria-label="Cerrar">
                ✕
              </button>
              {showIframe && (
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  onLoad={handleIframeLoad}
                  style={{ width: "100%", height: "70vh", border: "1px solid #e5e7eb", borderRadius: 12 }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botón flotante global para comenzar */}
      <button className={`boton-flotante-comenzar${isDark ? " dark" : ""}`} type="button">
        <i className="fas fa-play" style={{ marginRight: 8 }} /> COMENZAR
      </button>

      {/* Estilos de la página */}
      <style jsx>{`
          .modal-auth-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 16px;
          }
          .modal-auth-pro {
            width: min(960px, 96vw);
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 10px 40px rgba(0,0,0,.2);
            position: relative;
            padding: 16px;
          }
          .modal-auth-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
          }
          .boton-flotante-comenzar {
            position: fixed;
            left: 50%;
            bottom: 32px;
            transform: translateX(-50%);
            z-index: 2147483647;
            background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
            color: #fff;
            font-size: 1.25em;
            font-weight: 700;
            padding: 18px 44px;
            border-radius: 32px;
            box-shadow: 0 8px 32px rgba(60,60,120,0.18);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            letter-spacing: 1px;
            transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
          }
          .boton-flotante-comenzar:hover {
            background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
            box-shadow: 0 12px 40px rgba(60,60,120,0.28);
            transform: translateX(-50%) scale(1.06);
          }
          * { box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #111827; transition: background-color 0.3s ease, color 0.3s ease; }
          .container { max-width: 100%; padding: 30px 20px 140px 20px; margin: auto; }
          .container.dark {
            background: linear-gradient(120deg, #18181b 60%, #23232a 100%);
            color: #e5e7eb;
            border-radius: 24px;
            box-shadow: 0 8px 36px 0 #18181b44, 0 2px 0 #fff1, 0 1px 0 #6366f1;
            backdrop-filter: blur(8px);
            border: 1.5px solid #312e81;
            transition: background 0.3s, color 0.3s;
          }
          .container.dark h1 {
            color: #fff;
            background: linear-gradient(100deg, #312e81 0%, #6366f1 60%, #38bdf8 100%);
            border-color: #6366f1;
            text-shadow: 0 4px 24px #18181bcc, 0 1px 0 #fff;
            box-shadow: 0 8px 36px 0 #312e8144, 0 2px 0 #fff1;
            backdrop-filter: blur(2px);
          }
          .container.dark table {
            background: rgba(40,40,60,0.85);
            color: #e5e7eb;
            border-color: #6366f1;
            box-shadow: 0 4px 24px #312e8144;
          }
          .container.dark th, .container.dark td:nth-child(1), .container.dark th:nth-child(1) {
            background: linear-gradient(90deg, #312e81 60%, #6366f1 100%);
            color: #fff;
            border-right: 1.5px solid #6366f1;
          }
          .container.dark tr:hover { background: rgba(60,60,120,0.18); }
          .container.dark .description {
            background: rgba(30,30,40,0.85);
            border-color: #6366f1;
            color: #e5e7eb;
            box-shadow: 0 2px 12px #6366f122;
            backdrop-filter: blur(2px);
          }
          .container.dark .btn-circular { background: linear-gradient(90deg, #6366f1 60%, #312e81 100%); color: #fff; box-shadow: 0 2px 8px #6366f144; }
          .container.dark .btn-circular:hover { background: linear-gradient(90deg, #312e81 60%, #6366f1 100%); }
          .container.dark .whatsapp-button { background: linear-gradient(90deg, #6366f1 60%, #38bdf8 100%); color: #fff; box-shadow: 0 2px 8px #6366f144; }
          .container.dark .paso-numero {
            background: linear-gradient(120deg, #312e81 60%, #6366f1 100%);
            color: #fff;
            border-color: #6366f1;
            box-shadow: 0 4px 18px #6366f133, 0 1px 0 #fff1;
          }
          .container.dark .precaution { background: rgba(30,30,40,0.85); border-color: #6366f1; color: #e5e7eb; box-shadow: 0 2px 12px #6366f122; backdrop-filter: blur(2px); }
          .container.dark .precaution h2 { color: #e5e7eb; }
          .container.dark .dark-toggle { background: linear-gradient(90deg, #6366f1 60%, #312e81 100%); color: #fff; box-shadow: 0 2px 8px #6366f144; }
          .container.dark .dark-toggle:hover { background: linear-gradient(90deg, #312e81 60%, #6366f1 100%); }
          .container.dark .free-button { background: linear-gradient(90deg, #6366f1 60%, #312e81 100%); color: #fff; box-shadow: 0 2px 8px #6366f144; }
          .container.dark .free-button:hover { background: linear-gradient(90deg, #312e81 60%, #6366f1 100%); }
          .container.dark .boton-flotante-comenzar {
            background: linear-gradient(90deg, #6366f1 0%, #312e81 100%);
            color: #fff;
            box-shadow: 0 8px 32px rgba(60,60,120,0.28);
            border: 1.5px solid #6366f1;
          }
          .container.dark .boton-flotante-comenzar:hover { background: linear-gradient(90deg, #312e81 0%, #6366f1 100%); }
          h1 {
            text-align: center;
            font-size: 2.7rem;
            font-weight: 800;
            margin-bottom: 38px;
            margin-top: 36px;
            letter-spacing: 1.2px;
            line-height: 1.13;
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            color: #fff;
            background: linear-gradient(100deg, #7c3aed 0%, #6366f1 60%, #38bdf8 100%);
            border-radius: 32px;
            padding: 36px 44px 28px 44px;
            border: 2.5px solid #a5b4fc;
            box-shadow: 0 8px 36px 0 #7c3aed44, 0 2px 0 #fff, 0 1px 0 #c7d2fe;
            text-shadow: 0 4px 24px #312e81cc, 0 1px 0 #fff;
            filter: none;
            transition: all 0.2s;
            width: 100%;
            max-width: 720px;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            position: relative;
            overflow: hidden;
            border-bottom: 5px solid #6366f1;
            backdrop-filter: blur(3px);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 14px;
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
          }
          .precio-celda { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
          .precio-numero {
            font-size: 1.7em; font-weight: 800; color: #7c3aed; margin-bottom: 2px; letter-spacing: 0.5px; line-height: 1.1; font-family: 'Inter', sans-serif;
            text-shadow: 0 2px 12px #e0e7ff40, 0 1px 0 #fff; background: linear-gradient(120deg, #ede9fe 60%, #c7d2fe 100%);
            border-radius: 16px; border: 2px solid #a5b4fc; box-shadow: 0 2px 12px #a5b4fc22; padding: 8px 22px 6px 22px; display: inline-block; margin-top: 2px;
          }
          @media (max-width: 700px) {
            .precio-numero { display: block; width: 100%; min-width: 0; max-width: 100%; font-size: 1.25em; padding: 10px 0 8px 0; margin-left: auto; margin-right: auto; border-radius: 14px; box-sizing: border-box; }
            .precio-celda { gap: 4px; }
          }
          .precio-celda .btn-circular { margin-top: 2px; }
          th, td { border: 1px solid #e5e7eb; padding: 12px 8px; text-align: center; }
          th { background-color: #8b5cf6; color: white; position: sticky; top: 0; }
          td:nth-child(1), th:nth-child(1) { background-color: #8b5cf6; position: sticky; left: 0; z-index: 2; font-weight: 600; color: white; }
          tr:hover { background-color: #f3f4f6; }
          .btn-circular { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background-color: #3b82f6; color: white; border-radius: 50%; text-decoration: none; transition: background 0.3s ease; }
          .btn-circular:hover { background-color: #2563eb; }
          .cart-icon { font-size: 16px; }
          .description { background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-top: 30px; border: 1px solid #e5e7eb; }
          .step { display: flex; align-items: center; margin-bottom: 12px; }
          .step i { font-size: 20px; color: #3b82f6; margin-right: 10px; }
          .whatsapp-button {
            display: flex; align-items: center; justify-content: center; background-color: #25d366; color: #fff; padding: 6px 14px; border-radius: 999px; text-decoration: none; font-weight: 600; text-align: center; margin: 0 auto 8px auto; font-size: 0.85em; max-width: 110px; min-width: 80px; box-shadow: 0 2px 8px #25d36633, 0 1px 0 #fff; border: none; background: linear-gradient(90deg, #25d366 60%, #38bdf8 100%); color: #fff; gap: 6px; letter-spacing: 0.5px; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; transition: background 0.2s, box-shadow 0.2s;
          }
          .whatsapp-button:hover { background-color: #1da851; }
          @media (max-width: 600px) {
            .whatsapp-button.paso-boton {
              width: 140px; min-width: 110px; max-width: 140px; font-size: 0.95em; padding: 7px 10px; margin-bottom: 8px; margin-top: 0; border-radius: 18px; box-shadow: none; display: flex; align-items: center; justify-content: center; color: #fff; border: none; transition: background 0.2s;
            }
          }
          .whatsapp-button:hover { background-color: #1da851; transform: scale(1.08); box-shadow: 0 0 18px #25d36688, 0 2px 8px #38bdf888; }
          .whatsapp-button { transition: background 0.2s, box-shadow 0.3s, transform 0.3s; }
          li i { margin-right: 6px; }
          .precaution { background-color: #fefce8; border: 1px solid #f59e0b; padding: 20px; border-radius: 12px; margin-top: 40px; margin-bottom: 120px; color: #92400e; }
          .precaution h2 { display: flex; align-items: center; gap: 10px; font-size: 18px; margin-bottom: 12px; color: #92400e; }
          .precaution ul { padding-left: 30px; margin: 0; }
          .precaution li { margin-bottom: 8px; }
          .dark-toggle { position: fixed; top: 100px; right: 20px; z-index: 9999; background-color: #8b5cf6; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; transition: background 0.3s ease; }
          .dark-toggle:hover { background-color: #7c3aed; }
          .free-button { display: block; background-color: rgb(255, 0, 170); color: white; padding: 14px 20px; border-radius: 30px; text-decoration: none; font-weight: 600; text-align: center; margin: 20px auto 10px; font-size: 18px; max-width: 240px; transition: background 0.3s ease; }
          .free-button:hover { background-color: #ff33cc; }
          body.modal-abierto .boton-flotante { display: none !important; }
          html, body { height: 100%; min-height: 100%; position: relative; overflow-x: hidden; }
          body { position: relative; min-height: 100vh; }
          .boton-flotante { position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%); z-index: 2147483647 !important; box-shadow: 0 6px 24px rgba(60,60,120,0.18); max-width: 420px; width: 94vw; margin: 0; font-size: 18px; padding: 18px 24px; border-radius: 32px; transition: background 0.2s, box-shadow 0.2s; display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto; }
          .boton-flotante:hover { background-color: #1da851 !important; box-shadow: 0 10px 32px rgba(60,60,120,0.22); }
          @media (max-width: 700px) { .boton-flotante { font-size: 16px; padding: 14px 10px; max-width: 99vw; width: 99vw; left: 50%; bottom: 10px; } }
          .pasos-flex { display: flex; justify-content: space-between; align-items: flex-end; gap: 18px; margin: 32px 0 18px 0; width: 100%; flex-wrap: wrap; }
          .paso-circulo { display: flex; flex: 1 1 0; min-width: 120px; max-width: 220px; align-items: flex-end; justify-content: center; margin: 0 8px; }
          .paso-circulo-inner {
            background: linear-gradient(135deg, #f3f4f6 40%, #ede9fe 80%, #c7d2fe 100%);
            border-radius: 50%;
            border: 3px solid #7c3aed;
            box-shadow: 0 6px 32px 0 #7c3aed22, 0 2px 12px #a5b4fc33, 0 1px 0 #fff;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            width: 240px;
            height: 240px;
            position: relative;
            overflow-wrap: break-word;
            word-break: break-word;
            text-align: center;
            font-size: 0.92em;
            white-space: normal;
            line-height: 1.28;
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            color: #312e81;
            transition: box-shadow 0.3s, border 0.2s, transform 0.3s;
          }
          .paso-circulo-inner:hover { transform: scale(1.07); box-shadow: 0 0 32px 0 #7c3aed66, 0 8px 32px #a5b4fc66, 0 1px 0 #fff; border-color: #6366f1; }
          .paso-numero {
            display: flex; align-items: center; justify-content: center; font-size: 2.1em; font-weight: 800; color: #fff; background: linear-gradient(120deg, #7c3aed 60%, #6366f1 100%);
            border-radius: 50%; border: 3px solid #a5b4fc; box-shadow: 0 4px 18px #a5b4fc33, 0 1px 0 #fff; padding: 8px 18px 6px 18px; margin-bottom: 6px; margin-top: -18px; position: relative; top: 0; z-index: 2; text-shadow: 0 2px 12px #312e81cc, 0 1px 0 #fff; letter-spacing: 1px; min-height: 48px;
          }
          @media (max-width: 700px) {
            .pasos-flex { flex-direction: row; justify-content: center; align-items: center; gap: 18px; width: 100%; }
            .paso-circulo { min-width: 99vw; max-width: 99vw; margin: 0 0 18px 0; }
            .paso-circulo-inner { width: 88vw; height: 88vw; max-width: 340px; max-height: 340px; min-width: 180px; min-height: 180px; border-radius: 50%; overflow: hidden; padding: 18px 10px 18px 10px; font-size: 0.92em; gap: 20px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .paso-numero { font-size: 1.6em; padding: 10px 18px 8px 18px; margin-top: -24px; top: -12px; }
          }
        `}
      </style>

      <WhatsappButton
        phone="+593962124673"
        message="Hola, quiero más información sobre la firma electrónica de Activos.ec"
        title="Contáctanos por WhatsApp"
      />
    </div>
  );
}
