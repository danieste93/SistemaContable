// 🎯 Hook específico para el sistema contable de Daniel
import { useState, useEffect } from 'react';

export function useContableOffline(dispatch, userState) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Inicializar IndexedDB específico para datos contables
  const [db, setDb] = useState(null);

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

  return {
    // Estados
    isLoading,
    isOnline,
    dataLoaded,
    lastSync,
    
    // Funciones
    loadMainData,
    syncWithServer
  };
}