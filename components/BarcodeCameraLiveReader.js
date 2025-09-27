import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

// BarcodeCameraLiveReader: Escaneo en tiempo real usando la cámara

export default function BarcodeCameraLiveReader({ onDetected, onClose }) {
  const videoRef = useRef();
  const [error, setError] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Listar cámaras disponibles
  useEffect(() => {
    setLoadingDevices(true);
    setTimeoutReached(false);
    let timeout = setTimeout(() => setTimeoutReached(true), 5000);
    navigator.mediaDevices?.enumerateDevices().then(list => {
      clearTimeout(timeout);
      const videoInputs = list.filter(d => d.kind === 'videoinput');
      setDevices(videoInputs);
      setSelectedDeviceId(videoInputs[0]?.deviceId || null);
      setLoadingDevices(false);
    }).catch(() => {
      clearTimeout(timeout);
      setDevices([]);
      setSelectedDeviceId(null);
      setLoadingDevices(false);
    });
    return () => clearTimeout(timeout);
  }, [reloading]);

  // Iniciar cámara
  useEffect(() => {
    if (!selectedDeviceId) return;
    setError("");
    let active = true;
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
      if (!active) return;
      if (result) {
        if (onDetected) onDetected(result.getText());
        if (onClose) onClose();
        try {
          if (typeof codeReader.reset === 'function') codeReader.reset();
          else if (codeReader._controls && typeof codeReader._controls.stop === 'function') codeReader._controls.stop();
        } catch (e) {}
      }
      if (err && err.name) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Permiso de cámara denegado. Actívalo en tu navegador.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No se encontró cámara disponible en este dispositivo.');
        } else if (err.name === 'NotReadableError') {
          setError('La cámara está siendo usada por otra aplicación.');
        } else {
          setError('Error al acceder a la cámara: ' + err.message);
        }
      }
    }).catch(e => {
      setError('No se pudo iniciar la cámara: ' + (e.message || e.name));
    });
    return () => {
      active = false;
      try {
        if (typeof codeReader.reset === 'function') codeReader.reset();
        else if (codeReader._controls && typeof codeReader._controls.stop === 'function') codeReader._controls.stop();
      } catch (e) {}
    };
  }, [selectedDeviceId, onDetected, onClose, reloading]);

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:24,borderRadius:8,boxShadow:'0 2px 12px #0003',maxWidth:420,width:'95vw',textAlign:'center'}}>
        <h3 style={{marginBottom:16}}>Escanear código de barras en vivo</h3>
        {loadingDevices ? (
          <div style={{margin:'16px 0'}}>
            Buscando cámaras...
            {timeoutReached && (
              <div style={{color:'#b71c1c',marginTop:10}}>
                No se detectan cámaras ni permisos.<br/>
                <button style={{marginTop:8,padding:'6px 12px',fontSize:14,borderRadius:4,border:'1px solid #bbb',background:'#f5f5f5',color:'#1976d2',cursor:'pointer'}}
                  onClick={() => {
                    setReloading(r=>!r);
                    setTimeoutReached(false);
                  }}>
                  Reintentar y pedir permisos
                </button>
                <br/>
                Si no aparece el diálogo de permisos, revisa la configuración del navegador o prueba otro navegador/dispositivo.
              </div>
            )}
          </div>
        ) : devices.length === 0 ? (
          <div style={{color:'#b71c1c',marginBottom:12,fontWeight:'bold'}}>
            No se detectaron cámaras.<br/>Conecta una cámara o revisa permisos.<br/>
            <button
              style={{marginTop:10,padding:'6px 12px',fontSize:14,borderRadius:4,border:'1px solid #bbb',background:'#f5f5f5',color:'#1976d2',cursor:'pointer'}}
              onClick={async () => {
                try {
                  await navigator.mediaDevices.getUserMedia({ video: true });
                  setTimeout(() => setReloading(r => !r), 500); // Espera y reintenta enumerar
                } catch (e) {
                  alert('No se pudo obtener permiso de cámara: ' + (e.message || e.name));
                }
              }}
            >
              Solicitar permiso de cámara
            </button>
            <br/>
            Si no aparece el diálogo de permisos, revisa la configuración del navegador o prueba otro navegador/dispositivo.<br/>
            {typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && (
              <div style={{marginTop:10, color:'#b71c1c', fontWeight:'bold', fontSize:15}}>
                <span role="img" aria-label="alerta">⚠️</span> En algunos navegadores móviles, el diálogo de permisos puede no aparecer.<br/>
                Prueba lo siguiente:<br/>
                - Usa Chrome o Firefox actualizado.<br/>
                - Borra permisos y caché del sitio.<br/>
                - Si usas una app o PWA, prueba desde el navegador normal.<br/>
                - Si el problema persiste, prueba en otro dispositivo.<br/>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{marginBottom:8}}>
              <select value={selectedDeviceId || ''} onChange={e => setSelectedDeviceId(e.target.value)} style={{padding:6,borderRadius:4,border:'1px solid #bbb',fontSize:15}}>
                {devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Cámara ${d.deviceId.slice(-4)}`}</option>)}
              </select>
              <button style={{marginLeft:8,padding:'6px 12px',fontSize:14,borderRadius:4,border:'1px solid #bbb',background:'#f5f5f5',color:'#1976d2',cursor:'pointer'}} onClick={()=>setReloading(r=>!r)}>Reintentar</button>
            </div>
            {error ? (
              <div style={{color:'#b71c1c',marginBottom:12,fontWeight:'bold'}}>{error}<br/>Asegúrate de dar permisos y usar HTTPS o localhost.</div>
            ) : (
              <video ref={videoRef} style={{width:'100%',maxWidth:380,minHeight:220,aspectRatio:'16/9',background:'#222',borderRadius:12}} autoPlay muted playsInline />
            )}
          </>
        )}
        <br />
        <button
          style={{marginTop:16,padding:'6px 16px',fontSize:14,borderRadius:4,border:'1px solid #bbb',background:'#fff',color:'#1976d2',cursor:'pointer'}}
          onClick={() => { if (onClose) onClose(); }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
