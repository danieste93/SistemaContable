// 🚀 Sistema de almacenamiento offline robusto
class OfflineStorage {
  constructor() {
    this.dbName = 'SistemaContableDB';
    this.version = 1;
    this.db = null;
  }

  // Inicializar IndexedDB (más robusto que localStorage)
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store para registros contables
        if (!db.objectStoreNames.contains('registros')) {
          const registrosStore = db.createObjectStore('registros', { keyPath: '_id' });
          registrosStore.createIndex('fecha', 'fecha', { unique: false });
          registrosStore.createIndex('categoria', 'categoria', { unique: false });
        }
        
        // Store para datos pendientes de sync
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
        }
        
        // Store para configuración usuario
        if (!db.objectStoreNames.contains('userConfig')) {
          db.createObjectStore('userConfig', { keyPath: 'key' });
        }
      };
    });
  }

  // 💾 Guardar registros offline
  async saveRegistros(registros) {
    const transaction = this.db.transaction(['registros'], 'readwrite');
    const store = transaction.objectStore('registros');
    
    for (const registro of registros) {
      await store.put(registro);
    }
    
    return transaction.complete;
  }

  // 📖 Obtener registros offline
  async getRegistros(filtros = {}) {
    const transaction = this.db.transaction(['registros'], 'readonly');
    const store = transaction.objectStore('registros');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        let registros = request.result;
        
        // Aplicar filtros
        if (filtros.fechaDesde) {
          registros = registros.filter(r => new Date(r.fecha) >= new Date(filtros.fechaDesde));
        }
        if (filtros.fechaHasta) {
          registros = registros.filter(r => new Date(r.fecha) <= new Date(filtros.fechaHasta));
        }
        
        resolve(registros);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ✏️ Crear registro offline (se sincroniza después)
  async createRegistroOffline(registro) {
    // Generar ID temporal
    const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    registro._id = tempId;
    registro.isOffline = true;
    registro.lastModified = new Date().toISOString();
    
    // Guardar en IndexedDB
    await this.saveRegistros([registro]);
    
    // Marcar para sync posterior
    await this.addToPendingSync('CREATE', registro);
    
    return registro;
  }

  // 📝 Editar registro offline
  async updateRegistroOffline(registroId, updates) {
    const transaction = this.db.transaction(['registros'], 'readwrite');
    const store = transaction.objectStore('registros');
    
    return new Promise(async (resolve, reject) => {
      const getRequest = store.get(registroId);
      
      getRequest.onsuccess = async () => {
        const registro = getRequest.result;
        if (!registro) {
          reject(new Error('Registro no encontrado'));
          return;
        }
        
        // Aplicar updates
        Object.assign(registro, updates);
        registro.lastModified = new Date().toISOString();
        registro.isOfflineEdited = true;
        
        // Guardar cambios
        const putRequest = store.put(registro);
        putRequest.onsuccess = async () => {
          await this.addToPendingSync('UPDATE', registro);
          resolve(registro);
        };
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // 🔄 Marcar items para sincronización
  async addToPendingSync(action, data) {
    const transaction = this.db.transaction(['pendingSync'], 'readwrite');
    const store = transaction.objectStore('pendingSync');
    
    const syncItem = {
      action, // 'CREATE', 'UPDATE', 'DELETE'
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    return store.add(syncItem);
  }

  // 🚀 Sincronizar con servidor cuando hay conexión
  async syncWithServer() {
    if (!navigator.onLine) {
      console.log('📡 Sin conexión - sync pospuesto');
      return;
    }

    const transaction = this.db.transaction(['pendingSync'], 'readwrite');
    const store = transaction.objectStore('pendingSync');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = async () => {
        const pendingItems = request.result.filter(item => !item.synced);
        
        console.log(`🔄 Sincronizando ${pendingItems.length} items pendientes`);
        
        for (const item of pendingItems) {
          try {
            await this.syncItem(item);
            
            // Marcar como sincronizado
            item.synced = true;
            store.put(item);
          } catch (error) {
            console.error('❌ Error sincronizando item:', error);
          }
        }
        
        resolve(pendingItems.length);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Sincronizar item individual
  async syncItem(item) {
    const { action, data } = item;
    
    switch (action) {
      case 'CREATE':
        // Enviar al servidor
        const response = await fetch('/registros/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          const serverData = await response.json();
          // Actualizar con ID real del servidor
          await this.updateRegistroWithServerId(data._id, serverData._id);
        }
        break;
        
      case 'UPDATE':
        await fetch(`/registros/update/${data._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        break;
        
      case 'DELETE':
        await fetch(`/registros/delete/${data._id}`, {
          method: 'DELETE'
        });
        break;
    }
  }

  // Actualizar ID temporal con ID real del servidor
  async updateRegistroWithServerId(tempId, realId) {
    const transaction = this.db.transaction(['registros'], 'readwrite');
    const store = transaction.objectStore('registros');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(tempId);
      
      getRequest.onsuccess = () => {
        const registro = getRequest.result;
        if (registro) {
          // Eliminar registro con ID temporal
          store.delete(tempId);
          
          // Crear con ID real
          registro._id = realId;
          registro.isOffline = false;
          store.put(registro);
        }
        resolve();
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
}

// 🌐 Detector de conexión
class ConnectionManager {
  constructor(offlineStorage) {
    this.offlineStorage = offlineStorage;
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Conexión restaurada - iniciando sync');
      this.isOnline = true;
      this.offlineStorage.syncWithServer();
    });

    window.addEventListener('offline', () => {
      console.log('📱 Sin conexión - modo offline activado');
      this.isOnline = false;
    });
  }

  // Mostrar indicador de estado de conexión
  updateConnectionStatus() {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
      statusElement.innerHTML = this.isOnline 
        ? '🌐 Conectado' 
        : '📱 Sin conexión (modo offline)';
      statusElement.className = this.isOnline ? 'online' : 'offline';
    }
  }
}

// 🚀 Exportar funcionalidad
export { OfflineStorage, ConnectionManager };