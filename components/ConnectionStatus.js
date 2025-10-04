// 🌐 Componente para mostrar estado de conexión
import React from 'react';

const ConnectionStatus = ({ isOnline, pendingSync = 0 }) => {
  return (
    <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="status-indicator">
        {isOnline ? (
          <>
            🌐 <span>Conectado</span>
          </>
        ) : (
          <>
            📱 <span>Sin conexión</span>
          </>
        )}
      </div>
      
      {!isOnline && (
        <div className="offline-message">
          <small>Trabajando offline - los datos se sincronizarán automáticamente</small>
        </div>
      )}
      
      {pendingSync > 0 && (
        <div className="sync-pending">
          <small>🔄 {pendingSync} cambios pendientes de sincronizar</small>
        </div>
      )}
      
      <style jsx>{`
        .connection-status {
          position: fixed;
          top: 10px;
          right: 10px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .connection-status.online {
          background: #e8f5e8;
          color: #2d5a2d;
          border: 1px solid #4caf50;
        }
        
        .connection-status.offline {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffc107;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .offline-message, .sync-pending {
          margin-top: 4px;
          opacity: 0.8;
        }
        
        .sync-pending {
          color: #17a2b8;
        }
      `}</style>
    </div>
  );
};

export default ConnectionStatus;