import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../utils/useWebSocket';

export default function TestWebSockets() {
  const [userId] = useState('68d85b66d50dfa3342a2dbcf'); // Tu userId de prueba
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [isOnline, setIsOnline] = useState(false); // Estado para manejar navigator

  // Hook de WebSocket con callback para recibir datos
  const { notifyDataChange, isConnected } = useWebSocket(userId, (data) => {
    console.log('📨 Mensaje recibido de otro dispositivo:', data);
    setMessages(prev => [...prev, {
      type: 'received',
      data: data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  });

  // Actualizar estado de conexión y online status
  useEffect(() => {
    // Solo en el cliente
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
    setConnectionStatus(isConnected ? 'Conectado ✅' : 'Desconectado ❌');
  }, [isConnected]);

  // Función para enviar mensaje de prueba
  const sendTestMessage = () => {
    if (!testMessage.trim()) return;

    const messageData = {
      action: 'test-message',
      message: testMessage,
      collection: 'test'
    };

    notifyDataChange(messageData);
    
    setMessages(prev => [...prev, {
      type: 'sent',
      data: messageData,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setTestMessage('');
  };

  // Función para simular cambio de datos
  const simulateDataChange = () => {
    const changeData = {
      action: 'save',
      collection: 'registros',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        concepto: 'Registro de prueba WebSocket',
        monto: Math.floor(Math.random() * 1000)
      }
    };

    notifyDataChange(changeData);
    
    setMessages(prev => [...prev, {
      type: 'sent',
      data: changeData,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Prueba de WebSockets en Tiempo Real</h1>
      
      {/* Estado de conexión */}
      <div style={{ 
        padding: '15px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        <h3>Estado de Conexión: {connectionStatus}</h3>
        <p><strong>Usuario ID:</strong> {userId}</p>
        <p><strong>Navegador en línea:</strong> {isOnline ? 'Sí ✅' : 'No ❌'}</p>
      </div>

      {/* Controles de prueba */}
      <div style={{ marginBottom: '20px' }}>
        <h3>📤 Enviar Datos de Prueba</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Escribe un mensaje de prueba..."
            style={{ 
              padding: '8px', 
              width: '300px', 
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <button 
            onClick={sendTestMessage}
            disabled={!isConnected || !testMessage.trim()}
            style={{ 
              padding: '8px 15px',
              backgroundColor: isConnected ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'not-allowed'
            }}
          >
            Enviar Mensaje
          </button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={simulateDataChange}
            disabled={!isConnected}
            style={{ 
              padding: '8px 15px',
              backgroundColor: isConnected ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'not-allowed',
              marginRight: '10px'
            }}
          >
            🔄 Simular Cambio de Datos
          </button>

          <button 
            onClick={clearMessages}
            style={{ 
              padding: '8px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Limpiar Mensajes
          </button>
        </div>
      </div>

      {/* Log de mensajes */}
      <div>
        <h3>📝 Log de Mensajes ({messages.length})</h3>
        <div style={{ 
          height: '400px', 
          overflow: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#f8f9fa'
        }}>
          {messages.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
              No hay mensajes. Prueba enviando un mensaje o abre esta página en otra pestaña/dispositivo.
            </p>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index}
                style={{ 
                  marginBottom: '10px',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: msg.type === 'sent' ? '#e3f2fd' : '#e8f5e8',
                  borderLeft: `4px solid ${msg.type === 'sent' ? '#2196f3' : '#4caf50'}`
                }}
              >
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  {msg.timestamp} - {msg.type === 'sent' ? '📤 Enviado' : '📨 Recibido'}
                </div>
                <div style={{ fontSize: '14px' }}>
                  <strong>Acción:</strong> {msg.data.action}<br/>
                  <strong>Datos:</strong> {JSON.stringify(msg.data, null, 2)}
                </div>
              </div>
            ))
          )}
        </div>
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
          <li>Verifica que el estado muestre "Conectado ✅"</li>
          <li>Envía un mensaje de prueba usando el campo de texto</li>
          <li>Abre esta página en otra pestaña o navegador</li>
          <li>Envía mensajes desde la otra pestaña y verifica que aparezcan aquí</li>
          <li>Simula cambios de datos y observa la sincronización</li>
        </ol>
      </div>
    </div>
  );
}