import React, { useRef } from 'react';

// Simple barcode reader using native camera and input (for mobile, triggers scanner)
export default function BarcodeCameraReader({ onDetected, onClose }) {
  const inputRef = useRef();

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:24,borderRadius:8,boxShadow:'0 2px 12px #0003',maxWidth:340,width:'90vw',textAlign:'center'}}>
        <h3 style={{marginBottom:16}}>Escanear código de barras</h3>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{display:'none'}}
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = ev => {
                if (onDetected) onDetected(ev.target.result);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          style={{marginBottom:16,padding:'8px 18px',fontSize:16,borderRadius:4,border:'1px solid #1976d2',background:'#1976d2',color:'#fff',cursor:'pointer'}}
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          Usar cámara
        </button>
        <br />
        <button
          style={{padding:'6px 16px',fontSize:14,borderRadius:4,border:'1px solid #bbb',background:'#fff',color:'#1976d2',cursor:'pointer'}}
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
