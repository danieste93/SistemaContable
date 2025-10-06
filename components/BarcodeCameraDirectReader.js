import React, { useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

// Flujo directo: pide permiso y muestra video al instante
export default function BarcodeCameraDirectReader({ onDetected, onClose }) {
  const videoRef = useRef();
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [stream, setStream] = useState(null);

  // Iniciar cámara al hacer clic en "Iniciar escaneo"
  const startCamera = async () => {
    setError("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Tu navegador no soporta acceso a la cámara. Prueba en Chrome, Firefox o el navegador predeterminado actualizado.');
      setScanning(false);
      return;
    }
    setScanning(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      // Iniciar decodificación
      const codeReader = new BrowserMultiFormatReader();
      codeReader.decodeFromVideoElement(videoRef.current).then(result => {
        if (onDetected) onDetected(result.getText());
        stopCamera();
      }).catch(err => {
        setError('No se detectó código de barras.');
      });
    } catch (e) {
      setError('No se pudo acceder a la cámara: ' + (e.message || e.name));
      setScanning(false);
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
    if (onClose) onClose();
  };

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:24,borderRadius:8,boxShadow:'0 2px 12px #0003',maxWidth:420,width:'95vw',textAlign:'center'}}>
        <h3 style={{marginBottom:16}}>Escanear código de barras</h3>
        {error && <div style={{color:'#b71c1c',marginBottom:12,fontWeight:'bold'}}>{error}</div>}
        {!scanning ? (
          <button style={{padding:'10px 24px',fontSize:18,borderRadius:6,border:'1px solid #1976d2',background:'#1976d2',color:'#fff',cursor:'pointer'}} onClick={startCamera}>
            Iniciar escaneo
          </button>
        ) : (
          <video ref={videoRef} style={{width:'100%',maxWidth:380,minHeight:220,aspectRatio:'16/9',background:'#222',borderRadius:12}} autoPlay muted playsInline />
        )}
        <br />
        <button
          style={{marginTop:16,padding:'6px 16px',fontSize:14,borderRadius:4,border:'1px solid #bbb',background:'#fff',color:'#1976d2',cursor:'pointer'}}
          onClick={stopCamera}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
