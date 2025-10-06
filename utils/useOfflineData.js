// 🎯 Hook personalizado para funcionalidad offline
import { useState, useEffect } from 'react';
import { OfflineStorage, ConnectionManager } from './offlineStorage';

export function useOfflineData() {
  const [offlineStorage, setOfflineStorage] = useState(null);
  const [connectionManager, setConnectionManager] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inicializar sistema offline
  useEffect(() => {
    const initOfflineSystem = async () => {
      try {
        const storage = new OfflineStorage();
        await storage.init();
        
        const connManager = new ConnectionManager(storage);
        
        setOfflineStorage(storage);
        setConnectionManager(connManager);
        
        // Cargar datos iniciales
        await loadRegistros(storage);
        
        console.log('✅ Sistema offline inicializado');
      } catch (error) {
        console.error('❌ Error inicializando sistema offline:', error);
      } finally {
        setLoading(false);
      }
    };

    initOfflineSystem();
  }, []);

  // Cargar registros (offline first)
  const loadRegistros = async (storage = offlineStorage) => {
    if (!storage) return;

    try {
      setLoading(true);
      
      // 1. Cargar datos locales INMEDIATAMENTE
      const localRegistros = await storage.getRegistros();
      setRegistros(localRegistros);
      console.log(`📱 Cargados ${localRegistros.length} registros offline`);
      
      // 2. Si hay conexión, sincronizar en background
      if (navigator.onLine) {
        try {
          const response = await fetch('/registros/sync');
          if (response.ok) {
            const serverRegistros = await response.json();
            
            // Merge con datos locales
            await storage.saveRegistros(serverRegistros);
            const updatedRegistros = await storage.getRegistros();
            setRegistros(updatedRegistros);
            
            console.log(`🔄 Sincronizados ${serverRegistros.length} registros del servidor`);
          }
        } catch (error) {
          console.log('📡 Error de conexión - usando datos offline');
        }
      }
    } catch (error) {
      console.error('❌ Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear registro (funciona offline)
  const createRegistro = async (nuevoRegistro) => {
    if (!offlineStorage) return;

    try {
      if (navigator.onLine) {
        // Online: enviar al servidor directamente
        const response = await fetch('/registros/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoRegistro)
        });

        if (response.ok) {
          const serverRegistro = await response.json();
          await offlineStorage.saveRegistros([serverRegistro]);
          await loadRegistros();
          return serverRegistro;
        }
      }
      
      // Offline: guardar localmente
      const offlineRegistro = await offlineStorage.createRegistroOffline(nuevoRegistro);
      await loadRegistros();
      
      // Mostrar notificación
      showOfflineNotification('✅ Registro creado offline - se sincronizará automáticamente');
      
      return offlineRegistro;
    } catch (error) {
      console.error('❌ Error creando registro:', error);
      throw error;
    }
  };

  // Editar registro (funciona offline)
  const updateRegistro = async (registroId, updates) => {
    if (!offlineStorage) return;

    try {
      if (navigator.onLine) {
        // Online: actualizar en servidor
        const response = await fetch(`/registros/update/${registroId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const serverRegistro = await response.json();
          await offlineStorage.saveRegistros([serverRegistro]);
          await loadRegistros();
          return serverRegistro;
        }
      }
      
      // Offline: actualizar localmente
      const updatedRegistro = await offlineStorage.updateRegistroOffline(registroId, updates);
      await loadRegistros();
      
      showOfflineNotification('✏️ Registro editado offline - se sincronizará automáticamente');
      
      return updatedRegistro;
    } catch (error) {
      console.error('❌ Error actualizando registro:', error);
      throw error;
    }
  };

  // Filtrar registros
  const filtrarRegistros = async (filtros) => {
    if (!offlineStorage) return [];
    
    const registrosFiltrados = await offlineStorage.getRegistros(filtros);
    return registrosFiltrados;
  };

  // Mostrar notificación offline
  const showOfflineNotification = (message) => {
    // Integrar con tu sistema de notificaciones existente
    console.log('📱 OFFLINE:', message);
    
    // Mostrar toast o snackbar
    if (window.showToast) {
      window.showToast(message, 'info');
    }
  };

  // Estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineStorage) {
        offlineStorage.syncWithServer();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineStorage]);

  return {
    // Datos
    registros,
    loading,
    isOnline,
    
    // Funciones
    loadRegistros,
    createRegistro,
    updateRegistro,
    filtrarRegistros,
    
    // Sistema
    offlineStorage,
    connectionManager
  };
}