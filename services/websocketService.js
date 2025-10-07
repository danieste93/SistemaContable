import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  // 🔌 Conectar WebSocket
  connect(userId) {
    if (this.socket && this.isConnected && this.userId === userId) {
      console.log('✅ [WS-SERVICE] Ya conectado para usuario:', userId);
      return;
    }

    this.userId = userId;
    
    try {
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:3000';
      
      console.log('🔌 [WS-SERVICE] Conectando a:', socketUrl, 'Usuario:', userId);
      
      // Desconectar socket anterior si existe
      if (this.socket) {
        this.socket.disconnect();
      }

      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000
      });

      this.setupEventListeners();
      
    } catch (error) {
      console.error('🚨 [WS-SERVICE] Error conectando:', error);
    }
  }

  // 🎧 Configurar listeners básicos
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('✅ [WS-SERVICE] Conectado con ID:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Unirse a la sala del usuario
      if (this.userId) {
        this.socket.emit('join-user', this.userId);
        console.log('👤 [WS-SERVICE] Usuario unido a sala:', this.userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ [WS-SERVICE] Desconectado:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 [WS-SERVICE] Error de conexión:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 [WS-SERVICE] Reconectado en intento:', attemptNumber);
      if (this.userId) {
        this.socket.emit('join-user', this.userId);
      }
    });

    // 📡 Listeners para sincronización de datos
    this.socket.on('sync-data', (data) => {
      console.log('📥 [WS-SERVICE] Datos sincronizados:', data);
      this.notifyListeners('sync-data', data);
    });

    this.socket.on('delete-registro', (data) => {
      console.log('🗑️ [WS-SERVICE] Registro eliminado:', data);
      this.notifyListeners('delete-registro', data);
    });

    this.socket.on('edit-registro', (data) => {
      console.log('✏️ [WS-SERVICE] Registro editado:', data);
      this.notifyListeners('edit-registro', data);
    });

    // 🏦 Listeners para cuentas y categorías
    this.socket.on('account-created', (data) => {
      console.log('🏦 [WS-SERVICE] Cuenta creada:', data);
      this.notifyListeners('account-created', data);
    });

    this.socket.on('category-created', (data) => {
      console.log('📁 [WS-SERVICE] Categoría creada:', data);
      this.notifyListeners('category-created', data);
    });

    this.socket.on('account-deleted', (data) => {
      console.log('🗑️ [WS-SERVICE] Cuenta eliminada:', data);
      this.notifyListeners('account-deleted', data);
    });
  }

  // 📢 Registrar listener para componentes
  subscribe(event, callback, componentId) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Map());
    }
    
    this.listeners.get(event).set(componentId, callback);
    console.log(`📢 [WS-SERVICE] Listener registrado: ${event} -> ${componentId}`);
  }

  // 🔇 Desregistrar listener
  unsubscribe(event, componentId) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(componentId);
      console.log(`🔇 [WS-SERVICE] Listener eliminado: ${event} -> ${componentId}`);
    }
  }

  // 📣 Notificar a todos los listeners
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback, componentId) => {
        try {
          console.log(`📣 [WS-SERVICE] Notificando ${componentId} del evento ${event}`);
          callback(data);
        } catch (error) {
          console.error(`🚨 [WS-SERVICE] Error notificando ${componentId}:`, error);
        }
      });
    }
  }

  // 🔌 Verificar estado de conexión
  isConnectedToSocket() {
    return this.socket && this.isConnected;
  }

  // 🔄 Forzar reconexión
  forceReconnect() {
    if (this.userId) {
      this.connect(this.userId);
    }
  }

  // 🔌 Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
      this.listeners.clear();
      console.log('❌ [WS-SERVICE] Desconectado y limpiado');
    }
  }
}

// Crear instancia singleton
const websocketService = new WebSocketService();

export default websocketService;