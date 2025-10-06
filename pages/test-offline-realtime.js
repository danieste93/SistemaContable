import React, { useState, useEffect } from 'react';
import { useContableOffline } from '../utils/useContableOffline';

export default function TestOfflineRealTime() {
  const [userState] = useState({
    decodificado: { _id: '68d85b66d50dfa3342a2dbcf' } // Tu userId real
  });
  
  const [registros, setRegistros] = useState([]);
  const [conceptoInput, setConceptoInput] = useState('');
  const [montoInput, setMontoInput] = useState('');

  // Dispatch simulado para pruebas
  const mockDispatch = (action) => {
    console.log('🔄 Redux Action:', action);
    
    if (action.type === 'ADD_REGISTRO' || action.type === 'ADD_REMOTE_REGISTRO') {
      setRegistros(prev => [...prev, action.payload]);
    }
  };

  // Hook del sistema offline con WebSockets
  const {
    isLoading,
    isOnline,
    isConnected,
    dataLoaded,
    lastSync,
    saveRegistroContable
  } = useContableOffline(mockDispatch, userState);

  // Función para agregar un nuevo registro
  const agregarRegistro = async () => {
    if (!conceptoInput.trim() || !montoInput) {
      alert('Por favor completa todos los campos');
      return;
    }

    const nuevoRegistro = {
      id: Date.now().toString(), // ID único
      concepto: conceptoInput,
      monto: parseFloat(montoInput),
      fecha: new Date().toISOString(),
      usuario: userState.decodificado._id,
      timestamp: Date.now()
    };

    console.log('📝 Agregando nuevo registro:', nuevoRegistro);

    try {
      const result = await saveRegistroContable(nuevoRegistro);
      
      if (result.success) {
        setConceptoInput('');
        setMontoInput('');
        console.log('✅ Registro guardado y sincronizado');
      } else {
        console.error('❌ Error guardando registro:', result.error);
        alert('Error guardando el registro');
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      alert('Error inesperado guardando el registro');
    }
  };

  // Función para generar un registro de prueba rápido
  const generarRegistroRapido = () => {
    const conceptos = [
      'Venta de productos',
      'Compra de materiales', 
      'Pago de servicios',
      'Ingreso por servicios',
      'Gasto de transporte'
    ];
    
    setConceptoInput(conceptos[Math.floor(Math.random() * conceptos.length)]);
    setMontoInput((Math.random() * 1000 + 10).toFixed(2));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Prueba Sistema Offline + WebSockets en Tiempo Real</h1>
      
      {/* Panel de estado */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px' 
      }}>
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: isOnline ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isOnline ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <strong>Internet:</strong> {isOnline ? 'Conectado ✅' : 'Desconectado ❌'}
        </div>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <strong>WebSocket:</strong> {isConnected ? 'Conectado ✅' : 'Desconectado ❌'}
        </div>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: dataLoaded ? '#d4edda' : '#fff3cd',
          border: `1px solid ${dataLoaded ? '#c3e6cb' : '#ffeaa7'}`
        }}>
          <strong>Datos:</strong> {dataLoaded ? 'Cargados ✅' : 'Cargando...'}
        </div>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#e2e3e5',
          border: '1px solid #d6d8db'
        }}>
          <strong>Registros:</strong> {registros.length}
        </div>
      </div>

      {/* Formulario para agregar registros */}
      <div style={{ 
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>📝 Agregar Nuevo Registro Contable</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Concepto del registro..."
            value={conceptoInput}
            onChange={(e) => setConceptoInput(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          
          <input
            type="number"
            placeholder="Monto"
            value={montoInput}
            onChange={(e) => setMontoInput(e.target.value)}
            style={{
              width: '120px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          
          <button
            onClick={agregarRegistro}
            disabled={isLoading}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Guardando...' : '💾 Guardar'}
          </button>
        </div>
        
        <button
          onClick={generarRegistroRapido}
          style={{
            padding: '8px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎲 Generar Registro Rápido
        </button>
      </div>

      {/* Lista de registros */}
      <div>
        <h3>📊 Registros Contables ({registros.length})</h3>
        
        {registros.length === 0 ? (
          <div style={{ 
            padding: '20px',
            textAlign: 'center',
            color: '#6c757d',
            border: '2px dashed #dee2e6',
            borderRadius: '8px'
          }}>
            No hay registros aún. Agrega uno o abre esta página en otro navegador para ver la sincronización en tiempo real.
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {registros.map((registro, index) => (
              <div
                key={registro.id || index}
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{registro.concepto}</strong>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                      {new Date(registro.fecha).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: registro.monto >= 0 ? '#28a745' : '#dc3545'
                  }}>
                    ${registro.monto?.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <h4>📋 Instrucciones de Prueba:</h4>
        <ol>
          <li>Verifica que WebSocket esté "Conectado ✅"</li>
          <li>Agrega un registro usando el formulario</li>
          <li>Abre esta página en otra pestaña/navegador</li>
          <li>Agrega registros desde cualquier pestaña</li>
          <li>Observa cómo aparecen automáticamente en todas las pestañas 🚀</li>
        </ol>
      </div>
    </div>
  );
}