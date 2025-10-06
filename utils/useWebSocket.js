import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(userId, onDataSync) {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Solo ejecutar en el cliente (navegador)
    if (typeof window === 'undefined') return;

    // Solo conectar si hay internet
    if (navigator.onLine) {
      const serverUrl = process.env.NODE_ENV === 'production' 
        ? 'https://sistemacontable-436626443349.us-central1.run.app'
        : 'http://localhost:3000';

      console.log('🔌 Conectando WebSocket a:', serverUrl);

      socket.current = io(serverUrl, {
        transports: ['websocket', 'polling']
      });

      socket.current.on('connect', () => {
        console.log('🟢 WebSocket conectado exitosamente');
        setIsConnected(true);
        
        // Unirse a la sala del usuario
        socket.current.emit('join-user', userId);
      });

      socket.current.on('sync-data', (data) => {
        console.log('🔄 Datos sincronizados desde otro dispositivo:', data);
        if (onDataSync) {
          onDataSync(data);
        }
      });

      socket.current.on('disconnect', () => {
        console.log('🔴 WebSocket desconectado');
        setIsConnected(false);
      });

      socket.current.on('connect_error', (error) => {
        console.log('❌ Error de conexión WebSocket:', error);
        setIsConnected(false);
      });
    } else {
      console.log('📶 Sin internet - WebSocket no se conectará');
    }

    // Cleanup function
    return () => {
      if (socket.current) {
        console.log('🔌 Desconectando WebSocket...');
        socket.current.disconnect();
        setIsConnected(false);
      }
    };
  }, [userId]);

  // Función para notificar cambios a otros dispositivos
  const notifyDataChange = (changeData) => {
    if (socket.current && isConnected) {
      const dataToSend = {
        ...changeData,
        userId: userId,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Enviando notificación de cambio:', dataToSend);
      socket.current.emit('data-changed', dataToSend);
    } else {
      console.log('📶 WebSocket no conectado - cambio no notificado');
    }
  };

  return { 
    notifyDataChange, 
    isConnected,
    socket: socket.current 
  };
}