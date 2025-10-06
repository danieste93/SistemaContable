// 🎯 Hook específico para el sistema contable de Daniel
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export function useContableOffline(dispatch, userState) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Inicializar IndexedDB específico para datos contables
  const [db, setDb] = useState(null);

  // WebSocket para sincronización en tiempo real
  const userId = userState?.decodificado?._id;
  const { notifyDataChange, isConnected } = useWebSocket(userId, handleRemoteDataSync);

  // Función para manejar datos sincronizados desde otros dispositivos
  function handleRemoteDataSync(remoteData) {
    console.log('🔄 Sincronizando datos desde otro dispositivo:', remoteData);
    
    switch(remoteData.action) {
      case 'save':
        handleRemoteSave(remoteData);
        break;
      case 'update':
        handleRemoteUpdate(remoteData);
        break;
      case 'delete':
        handleRemoteDelete(remoteData);
        break;
      default:
        console.log('📝 Acción no reconocida:', remoteData.action);
    }
  }

  // Manejar guardado remoto
  async function handleRemoteSave(remoteData) {
    try {
      // Guardar en IndexedDB local
      await saveToIndexedDB(remoteData.collection, remoteData.data);
      
      // Actualizar Redux si es necesario
      if (remoteData.collection === 'registros' && dispatch) {
        // Agregar al estado de Redux para reflejar en UI
        dispatch({
          type: 'ADD_REMOTE_REGISTRO',
          payload: remoteData.data
        });
      }
      
      console.log('✅ Datos remotos sincronizados localmente');
    } catch (error) {
      console.error('❌ Error sincronizando datos remotos:', error);
    }
  }

  // Manejar actualización remota
  async function handleRemoteUpdate(remoteData) {
    try {
      await updateInIndexedDB(remoteData.collection, remoteData.data);
      console.log('✅ Actualización remota aplicada');
    } catch (error) {
      console.error('❌ Error aplicando actualización remota:', error);
    }
  }

  // Manejar eliminación remota
  async function handleRemoteDelete(remoteData) {
    try {
      await deleteFromIndexedDB(remoteData.collection, remoteData.id);
      console.log('✅ Eliminación remota aplicada');
    } catch (error) {
      console.error('❌ Error aplicando eliminación remota:', error);
    }
  }

  useEffect(() => {
    initContableDB();
    setupConnectionListeners();
  }, []);

  const initContableDB = async () => {
    try {
      const request = indexedDB.open('SistemaContableDB', 1);
      
      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        // Store para datos principales (getMainData)
        if (!database.objectStoreNames.contains('mainData')) {
          const mainStore = database.createObjectStore('mainData', { keyPath: 'type' });
          mainStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store para metadata de sync
        if (!database.objectStoreNames.contains('syncMeta')) {
          database.createObjectStore('syncMeta', { keyPath: 'key' });
        }
      };
      
      request.onsuccess = (event) => {
        setDb(event.target.result);
        console.log('✅ IndexedDB inicializada para sistema contable');
      };
      
      request.onerror = (event) => {
        console.error('❌ Error inicializando IndexedDB:', event.target.error);
      };
    } catch (error) {
      console.error('❌ Error configurando IndexedDB:', error);
    }
  };

  const setupConnectionListeners = () => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Conexión restaurada - iniciando sync');
      if (dataLoaded) {
        syncWithServer();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📱 Sin conexión - modo offline activado');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  // Función principal: cargar datos (offline-first)
  const loadMainData = async () => {
    if (!db || !userState?.update?.usuario?.user) {
      console.log('⏳ Esperando DB o usuario...');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. CARGAR DATOS LOCALES PRIMERO (instantáneo)
      const cachedData = await getCachedMainData();
      if (cachedData) {
        console.log('📱 Cargando datos desde caché offline');
        applyDataToRedux(cachedData);
        setDataLoaded(true);
        setLastSync(cachedData.timestamp);
      }

      // 2. SI HAY CONEXIÓN, SINCRONIZAR EN BACKGROUND
      if (navigator.onLine) {
        console.log('🔄 Sincronizando con servidor en background...');
        await syncWithServer();
      } else {
        console.log('📱 Sin conexión - usando solo datos offline');
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener datos cacheados
  const getCachedMainData = async () => {
    if (!db) return null;

    try {
      const transaction = db.transaction(['mainData'], 'readonly');
      const store = transaction.objectStore('mainData');
      
      return new Promise((resolve) => {
        const request = store.get('mainData');
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            resolve(result);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('❌ Error obteniendo caché:', error);
      return null;
    }
  };

  // Guardar datos en caché
  const cacheMainData = async (data) => {
    if (!db) return;

    try {
      const transaction = db.transaction(['mainData'], 'readwrite');
      const store = transaction.objectStore('mainData');
      
      const cacheEntry = {
        type: 'mainData',
        data: data,
        timestamp: new Date().toISOString(),
        userDBname: userState.update.usuario.user.DBname
      };
      
      await store.put(cacheEntry);
      console.log('💾 Datos guardados en caché offline');
    } catch (error) {
      console.error('❌ Error guardando en caché:', error);
    }
  };

  // Sincronizar con servidor
  const syncWithServer = async () => {
    if (!navigator.onLine || !userState?.update?.usuario) return;

    try {
      const userData = {
        User: {
          DBname: userState.update.usuario.user.DBname,
          Tipo: userState.update.usuario.user.Tipo
        }
      };

      const response = await fetch("/cuentas/getMainData", {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
          "x-access-token": userState.update.usuario.token
        }
      });

      const serverData = await response.json();
      
      if (serverData.status === 'Ok') {
        console.log('✅ Datos sincronizados desde servidor');
        
        // Guardar en caché
        await cacheMainData(serverData);
        
        // Aplicar a Redux
        applyDataToRedux(serverData);
        
        setLastSync(new Date().toISOString());
        setDataLoaded(true);
      } else if (serverData.status === 'error') {
        console.log('⚠️ Error del servidor, usando datos offline');
        if (serverData.message === "error al decodificar el token") {
          // Manejar token expirado
          handleTokenExpired();
        }
      }
    } catch (error) {
      console.log('📡 Error de red - continuando con datos offline');
    }
  };

  // Aplicar datos a Redux (tu lógica actual)
  const applyDataToRedux = (data) => {
    if (!dispatch) return;

    // Tu lógica actual de accessRegister.js
    if (data.regsHabiles) {
      dispatch({ type: 'ADD_FIRST_REGS', payload: data.regsHabiles });
    }
    if (data.tiposDeCuentas || data.tiposHabiles) {
      const tiposFinal = data.tiposDeCuentas || data.tiposHabiles;
      dispatch({ type: 'GET_TIPOS', payload: tiposFinal });
    }
    if (data.catHabiles) {
      dispatch({ type: 'GET_CATS', payload: data.catHabiles });
    }
    if (data.cuentasHabiles) {
      dispatch({ type: 'GET_CUENTAS', payload: data.cuentasHabiles });
    }
    if (data.repsHabiles) {
      dispatch({ type: 'GET_REPETICIONES', payload: data.repsHabiles });
    }
    if (data.contadoresHabiles && data.contadoresHabiles[0]) {
      dispatch({ type: 'GET_COUNTER', payload: data.contadoresHabiles[0] });
    }
  };

  // Manejar token expirado
  const handleTokenExpired = () => {
    if (dispatch) {
      dispatch({ type: 'LOG_OUT' });
      dispatch({ type: 'CLEAN_DATA' });
      alert("Session expirada, vuelva a iniciar sesion para continuar");
      // Router.push("/ingreso") - se maneja desde el componente
    }
  };

  // 🚀 NUEVA FUNCIÓN: Guardar registro y notificar a otros dispositivos
  const saveRegistroContable = async (registroData) => {
    try {
      console.log('💾 Guardando registro contable con sincronización:', registroData);
      
      // 1. Guardar en IndexedDB local
      await saveToIndexedDB('registros', registroData);
      
      // 2. Actualizar Redux local
      if (dispatch) {
        dispatch({
          type: 'ADD_REGISTRO',
          payload: registroData
        });
      }
      
      // 3. Notificar a otros dispositivos del mismo usuario
      if (notifyDataChange && userId) {
        notifyDataChange({
          action: 'save',
          collection: 'registros',
          data: registroData
        });
        console.log('📡 Notificación enviada a otros dispositivos');
      }
      
      // 4. Si hay conexión, intentar guardar en servidor también
      if (navigator.onLine) {
        try {
          // Aquí iría la llamada al API del servidor
          console.log('🌐 Intentando guardar en servidor...');
          // await saveToServer(registroData);
        } catch (serverError) {
          console.log('⚠️ Error guardando en servidor, mantenido en offline:', serverError);
        }
      }
      
      return { success: true, data: registroData };
    } catch (error) {
      console.error('❌ Error guardando registro:', error);
      return { success: false, error };
    }
  };

  // Función auxiliar para guardar en IndexedDB
  const saveToIndexedDB = async (collection, data) => {
    if (!db) {
      throw new Error('IndexedDB no está disponible');
    }

    const transaction = db.transaction([collection], 'readwrite');
    const store = transaction.objectStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Función auxiliar para actualizar en IndexedDB
  const updateInIndexedDB = async (collection, data) => {
    return await saveToIndexedDB(collection, data); // put() actualiza o crea
  };

  // Función auxiliar para eliminar de IndexedDB
  const deleteFromIndexedDB = async (collection, id) => {
    if (!db) {
      throw new Error('IndexedDB no está disponible');
    }

    const transaction = db.transaction([collection], 'readwrite');
    const store = transaction.objectStore(collection);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  return {
    // Estados
    isLoading,
    isOnline,
    dataLoaded,
    lastSync,
    isConnected, // Estado de WebSocket
    
    // Funciones existentes
    loadMainData,
    syncWithServer,
    
    // Nuevas funciones con sincronización
    saveRegistroContable
  };
}