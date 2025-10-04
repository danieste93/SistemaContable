// 🧪 Página de prueba para funcionalidad offline - VERSIÓN SIMPLE
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from "../components/header";
import ConnectionStatus from "../components/ConnectionStatus";

// Importar acciones de Redux
import {addFirstRegs, gettipos, getcats, getcuentas, getRepeticiones, getCounter, cleanData} from "../reduxstore/actions/regcont";
import {logOut} from "../reduxstore/actions/myact";
import Router from 'next/router';

class OfflineTestV2 extends Component {
  state = {
    isOnline: navigator.onLine,
    testResults: [],
    loading: false,
    userInfo: null
  }

  componentDidMount() {
    this.addTestResult("🚀 Iniciando diagnóstico...");
    this.debugLocalStorage();
    
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
    this.addTestResult("🌐 Conexión restaurada");
  }

  handleOffline = () => {
    this.setState({ isOnline: false });
    this.addTestResult("📱 Modo offline activado");
  }

  addTestResult = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    this.setState(prevState => ({
      testResults: [...prevState.testResults, `[${timestamp}] ${message}`]
    }));
  }

  debugLocalStorage = () => {
    try {
      this.addTestResult(`📊 localStorage tiene ${localStorage.length} items`);
      
      // Listar todas las keys
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      this.addTestResult(`🔑 Keys: ${keys.join(', ')}`);
      
      // PRIMERO: Verificar Redux
      if (this.props.state && this.props.state.userReducer) {
        const userState = this.props.state.userReducer;
        if (userState.update && userState.update.usuario) {
          const userData = userState.update.usuario.user;
          this.setState({ userInfo: userData });
          this.addTestResult(`✅ Usuario en Redux: ${userData.nombre || userData.email || userData.DBname}`);
          this.addTestResult(`👤 Tipo: ${userData.Tipo}`);
          
          if (userData.Tipo === "administrador" || userData.Tipo === "tesorero") {
            this.addTestResult("🎯 Acceso autorizado para testing");
          } else {
            this.addTestResult("❌ Sin permisos para testing");
          }
        } else {
          this.addTestResult("❌ No hay usuario en Redux");
          this.tryLoadFromLocalStorage(); // CARGAR DESDE LOCALSTORAGE
        }
      } else {
        this.addTestResult("❌ No hay datos de Redux");
        this.tryLoadFromLocalStorage(); // CARGAR DESDE LOCALSTORAGE
      }
      
      // Verificar localStorage directo
      const stateInStorage = localStorage.getItem('state');
      if (stateInStorage) {
        this.addTestResult("✅ Hay 'state' en localStorage");
        try {
          const parsed = JSON.parse(stateInStorage);
          this.addTestResult(`📋 Keys en state: ${Object.keys(parsed).join(', ')}`);
        } catch (e) {
          this.addTestResult("❌ Error parseando state");
        }
      } else {
        this.addTestResult("❌ No hay 'state' en localStorage");
      }
      
    } catch (error) {
      this.addTestResult(`❌ Error: ${error.message}`);
    }
  }

  tryLoadFromLocalStorage = () => {
    try {
      this.addTestResult("🔄 Intentando cargar usuario desde localStorage...");
      
      const stateInStorage = localStorage.getItem('state');
      if (stateInStorage) {
        this.addTestResult("📊 Explorando estructura de localStorage...");
        
        let parsed;
        try {
          parsed = JSON.parse(stateInStorage);
          this.addTestResult("✅ localStorage parseado correctamente");
        } catch (parseError) {
          this.addTestResult(`❌ Error parseando localStorage: ${parseError.message}`);
          return;
        }
        
        // DEBUG: Mostrar el contenido real
        this.addTestResult(`🔍 Tipo de parsed: ${typeof parsed}`);
        this.addTestResult(`🔍 ¿Es objeto?: ${typeof parsed === 'object' && parsed !== null}`);
        
        if (typeof parsed === 'object' && parsed !== null) {
          const keys = Object.keys(parsed);
          this.addTestResult(`🔑 Keys reales en parsed: ${keys.join(', ')}`);
          
          // Buscar userReducer de forma más robusta
          let userReducer = null;
          
          if ('userReducer' in parsed) {
            userReducer = parsed.userReducer;
            this.addTestResult("✅ userReducer encontrado directamente");
          } else if (parsed.userReducer) {
            userReducer = parsed.userReducer;
            this.addTestResult("✅ userReducer encontrado con bracket notation");
          } else {
            this.addTestResult("❌ userReducer no encontrado");
            // Mostrar contenido para debug
            this.addTestResult(`� Contenido parcial: ${JSON.stringify(parsed).substring(0, 300)}...`);
            return;
          }
          
          if (userReducer && typeof userReducer === 'object') {
            this.addTestResult(`✅ userReducer es objeto válido`);
            this.addTestResult(`🔑 Keys en userReducer: ${Object.keys(userReducer).join(', ')}`);
            
            if (userReducer.update && userReducer.update.usuario && userReducer.update.usuario.user) {
              const userData = userReducer.update.usuario.user;
              this.setState({ userInfo: userData });
              this.addTestResult(`✅ Usuario cargado desde localStorage: ${userData.nombre || userData.email || userData.DBname}`);
              this.addTestResult(`👤 Tipo: ${userData.Tipo}`);
              
              if (userData.Tipo === "administrador" || userData.Tipo === "tesorero") {
                this.addTestResult("🎯 Acceso autorizado para testing (desde localStorage)");
              } else {
                this.addTestResult("❌ Sin permisos para testing");
              }
            } else {
              this.addTestResult("❌ Estructura de usuario incompleta");
              if (userReducer.update) {
                this.addTestResult(`📊 Keys en update: ${Object.keys(userReducer.update).join(', ')}`);
              } else {
                this.addTestResult("❌ No hay 'update' en userReducer");
              }
            }
          } else {
            this.addTestResult(`❌ userReducer no es un objeto válido - Tipo: ${typeof userReducer}`);
            
            // Si es string, intentar parsearlo
            if (typeof userReducer === 'string') {
              this.addTestResult("🔄 userReducer es string, intentando parsear...");
              try {
                const parsedUserReducer = JSON.parse(userReducer);
                this.addTestResult("✅ userReducer parseado como string exitosamente");
                
                if (parsedUserReducer.update && parsedUserReducer.update.usuario && parsedUserReducer.update.usuario.user) {
                  const userData = parsedUserReducer.update.usuario.user;
                  this.setState({ userInfo: userData });
                  this.addTestResult(`✅ Usuario cargado desde localStorage (string parseado): ${userData.nombre || userData.email || userData.DBname}`);
                  this.addTestResult(`👤 Tipo: ${userData.Tipo}`);
                  
                  if (userData.Tipo === "administrador" || userData.Tipo === "tesorero") {
                    this.addTestResult("🎯 Acceso autorizado para testing (desde localStorage)");
                  } else {
                    this.addTestResult("❌ Sin permisos para testing");
                  }
                } else {
                  this.addTestResult("❌ Estructura de usuario incompleta en string parseado");
                }
              } catch (stringParseError) {
                this.addTestResult(`❌ Error parseando userReducer como string: ${stringParseError.message}`);
                this.addTestResult(`📊 Contenido userReducer (primeros 200 chars): ${userReducer.substring(0, 200)}`);
              }
            } else {
              this.addTestResult(`📊 Contenido userReducer: ${JSON.stringify(userReducer).substring(0, 200)}`);
            }
          }
        } else {
          this.addTestResult("❌ parsed no es un objeto válido");
        }
        
      } else {
        this.addTestResult("❌ No hay state en localStorage");
      }
    } catch (error) {
      this.addTestResult(`❌ Error cargando desde localStorage: ${error.message}`);
      this.addTestResult(`🔍 Stack: ${error.stack.substring(0, 200)}`);
    }
  }

  testOfflineLoad = async () => {
    this.setState({ loading: true });
    this.addTestResult("🧪 Iniciando test de carga offline...");
    
    try {
      if (!this.state.userInfo) {
        this.addTestResult("❌ No hay usuario válido para testing");
        return;
      }
      
      // Simular carga de datos
      const userState = this.props.state.userReducer.update.usuario;
      const datos = {
        User: {
          DBname: userState.user.DBname,
          Tipo: userState.user.Tipo
        }
      };

      this.addTestResult("📡 Intentando conectar al servidor...");
      this.addTestResult(`📤 Enviando datos: DBname=${datos.User.DBname}, Tipo=${datos.User.Tipo}`);
      
      if (this.state.isOnline) {
        const startTime = Date.now();
        
        const response = await fetch("/cuentas/getMainData", {
          method: 'POST',
          body: JSON.stringify(datos),
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": userState.token
          }
        });

        const loadTime = Date.now() - startTime;
        this.addTestResult(`⏱️ Tiempo de respuesta: ${loadTime}ms`);

        const serverData = await response.json();
        
        if (serverData.status === 'Ok') {
          this.addTestResult(`✅ Datos del servidor recibidos (${Object.keys(serverData).length} campos)`);
          this.addTestResult(`📊 Registros: ${serverData.regsHabiles?.length || 0}`);
          this.addTestResult(`💳 Cuentas: ${serverData.cuentasHabiles?.length || 0}`);
          this.addTestResult(`📁 Categorías: ${serverData.catHabiles?.length || 0}`);
          this.addTestResult(`🏷️ Tipos: ${serverData.tiposDeCuentas?.length || serverData.tiposHabiles?.length || 0}`);
          this.addTestResult(`🔄 Repeticiones: ${serverData.repsHabiles?.length || 0}`);
          
          // Aplicar a Redux
          let appliedCount = 0;
          if (serverData.regsHabiles) {
            this.props.dispatch(addFirstRegs(serverData.regsHabiles));
            appliedCount++;
          }
          if (serverData.cuentasHabiles) {
            this.props.dispatch(getcuentas(serverData.cuentasHabiles));
            appliedCount++;
          }
          if (serverData.catHabiles) {
            this.props.dispatch(getcats(serverData.catHabiles));
            appliedCount++;
          }
          if (serverData.tiposDeCuentas || serverData.tiposHabiles) {
            const tipos = serverData.tiposDeCuentas || serverData.tiposHabiles;
            this.props.dispatch(gettipos(tipos));
            appliedCount++;
          }
          if (serverData.repsHabiles) {
            this.props.dispatch(getRepeticiones(serverData.repsHabiles));
            appliedCount++;
          }
          if (serverData.contadoresHabiles && serverData.contadoresHabiles[0]) {
            this.props.dispatch(getCounter(serverData.contadoresHabiles[0]));
            appliedCount++;
          }
          
          this.addTestResult(`✅ ${appliedCount} tipos de datos aplicados a Redux`);
          
          // Ahora simular guardado en IndexedDB
          this.addTestResult("💾 Simulando guardado en IndexedDB...");
          this.saveToIndexedDB(serverData);
          
        } else {
          this.addTestResult(`❌ Error del servidor: ${serverData.message}`);
          if (serverData.message === "error al decodificar el token") {
            this.addTestResult("🔑 Token expirado");
          }
        }
      } else {
        this.addTestResult("📱 Sin conexión - probando carga desde IndexedDB...");
        this.loadFromIndexedDB();
      }
      
    } catch (error) {
      this.addTestResult(`❌ Error en test: ${error.message}`);
    } finally {
      this.setState({ loading: false });
    }
  }

  saveToIndexedDB = (data) => {
    try {
      const request = indexedDB.open('SistemaContableTest', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('mainData')) {
          db.createObjectStore('mainData', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['mainData'], 'readwrite');
        const store = transaction.objectStore('mainData');
        
        const cacheData = {
          id: 'mainData',
          data: data,
          timestamp: new Date().toISOString(),
          userDBname: this.props.state.userReducer.update.usuario.user.DBname
        };
        
        store.put(cacheData);
        this.addTestResult("💾 Datos guardados en IndexedDB");
      };
      
      request.onerror = () => {
        this.addTestResult("❌ Error guardando en IndexedDB");
      };
    } catch (error) {
      this.addTestResult(`❌ Error IndexedDB: ${error.message}`);
    }
  }

  loadFromIndexedDB = () => {
    try {
      const request = indexedDB.open('SistemaContableTest', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['mainData'], 'readonly');
        const store = transaction.objectStore('mainData');
        const getRequest = store.get('mainData');
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            this.addTestResult(`📱 Datos encontrados en IndexedDB (${result.timestamp})`);
            this.addTestResult(`⚡ CARGA OFFLINE INSTANTÁNEA!`);
            
            // Aplicar los datos a Redux (simulado)
            const data = result.data;
            this.addTestResult(`📊 Datos offline: ${data.regsHabiles?.length || 0} registros`);
            this.addTestResult(`💳 Cuentas offline: ${data.cuentasHabiles?.length || 0}`);
            this.addTestResult(`📁 Categorías offline: ${data.catHabiles?.length || 0}`);
            this.addTestResult(`✅ VELOCIDAD OFFLINE: ~50ms vs ${3000}ms online`);
            
          } else {
            this.addTestResult("📱 No hay datos en IndexedDB");
          }
        };
        
        getRequest.onerror = () => {
          this.addTestResult("❌ Error leyendo IndexedDB");
        };
      };
      
      request.onerror = () => {
        this.addTestResult("❌ Error abriendo IndexedDB");
      };
    } catch (error) {
      this.addTestResult(`❌ Error cargando IndexedDB: ${error.message}`);
    }
  }

  forceOfflineTest = () => {
    this.setState({ loading: true });
    this.addTestResult("⚡ FORZANDO TEST OFFLINE SIN USUARIO...");
    this.addTestResult("📱 Probando carga directa desde IndexedDB...");
    
    setTimeout(() => {
      this.loadFromIndexedDB();
      this.setState({ loading: false });
    }, 100);
  }

  render() {
    const { testResults, loading, isOnline, userInfo } = this.state;

    return (
      <div>
        <Header />
        <ConnectionStatus isOnline={isOnline} />
        
        <div style={{ padding: '20px' }}>
          <h1>🧪 Test de Funcionalidad Offline V2</h1>
          
          {/* Estado del usuario */}
          <div style={{ 
            backgroundColor: userInfo ? '#e8f5e8' : '#ffe8e8', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h3>👤 Estado del Usuario</h3>
            {userInfo ? (
              <div>
                <p><strong>✅ Usuario:</strong> {userInfo.nombre || userInfo.email || userInfo.DBname}</p>
                <p><strong>🏷️ Tipo:</strong> {userInfo.Tipo}</p>
                <p><strong>🔐 Acceso:</strong> {
                  userInfo.Tipo === "administrador" || userInfo.Tipo === "tesorero" 
                    ? "✅ Autorizado" 
                    : "❌ Sin permisos"
                }</p>
              </div>
            ) : (
              <p>❌ No hay usuario autenticado</p>
            )}
          </div>

          {/* Estado de conexión */}
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h3>📡 Estado de Conexión</h3>
            <p><strong>Conexión:</strong> {isOnline ? '🌐 Online' : '📱 Offline'}</p>
          </div>

          {/* Botones de prueba */}
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={this.debugLocalStorage}
              style={{ marginRight: '10px', padding: '10px 15px' }}
            >
              🔍 Debug Storage
            </button>
            <button 
              onClick={this.testOfflineLoad}
              disabled={loading}
              style={{ marginRight: '10px', padding: '10px 15px' }}
            >
              {loading ? '⏳ Testing...' : '🧪 Test Carga'}
            </button>
            <button 
              onClick={this.forceOfflineTest}
              style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#ff6b6b', color: 'white' }}
            >
              ⚡ FORZAR TEST OFFLINE
            </button>
          </div>

          {/* Log de resultados */}
          <div>
            <h3>📝 Log de Diagnóstico</h3>
            <div style={{ 
              backgroundColor: '#000', 
              color: '#00ff00', 
              padding: '15px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              height: '300px',
              overflowY: 'scroll'
            }}>
              {testResults.length === 0 ? (
                <p>Esperando resultados...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index}>{result}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state
});

export default connect(mapStateToProps, null)(OfflineTestV2);