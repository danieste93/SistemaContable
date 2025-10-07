import {Provider} from 'react-redux';
import {createStore , applyMiddleware, compose  } from 'redux';
import thunk from "redux-thunk";
import App from 'next/app'
import { PageTransition } from 'next-page-transitions'
import Nav from '../components/navbar';
import Head from 'next/head';
import { DEFAULT_SEO } from '../config';
import inireducer from '../reduxstore/reducers';
import websocketService from '../services/websocketService';

import postal from 'postal';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {updateUser, updateOrder} from "../reduxstore/actions/myact"
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import { Workbox } from "workbox-window";
import Router from 'next/router';
import {logOut} from "../reduxstore/actions/myact"
import "../styles/extrabootstrap.css"
import "../styles/main.css"
import {GoogleOAuthProvider} from "@react-oauth/google"
//import 'bootstrap/dist/css/bootstrap.min.css';
// 🧠 Sistema de Backup Inteligente
class SmartBackupService {
  constructor() {
    this.lastBackupTime = 0;
    this.hasChanges = false;
    this.lastStateHash = null;
    this.isUserActive = true;
    this.backupInterval = 5 * 60 * 1000; // 5 minutos por defecto
  }

  // Marcar que hay cambios (muy ligero)
  markChanged = () => {
    this.hasChanges = true;
  }

  // Crear hash simple para detectar cambios reales
  createStateHash = (state) => {
    const criticalData = {
      registros: state.registrosReducer?.length || 0,
      cuentas: state.cuentasReducer?.length || 0,
      user: state.userReducer?.update?.usuario?.user?._id || null
    };
    return JSON.stringify(criticalData);
  }

  // Backup inteligente - solo si hay cambios reales
  smartBackup = (state) => {
    try {
      const currentHash = this.createStateHash(state);
      const now = Date.now();

      // Si no hay cambios reales, no hacer backup
      if (currentHash === this.lastStateHash) {
        return;
      }

      // Si el usuario está muy activo, esperar
      if (this.isUserActive && (now - this.lastBackupTime) < 60000) {
        return; // Esperar al menos 1 minuto si está activo
      }

      // Solo hacer backup si han pasado al menos 3 minutos
      if ((now - this.lastBackupTime) < 180000) {
        return;
      }

      // Crear backups múltiples
      const serializedState = JSON.stringify(state);
      
      // Backup principal
      localStorage.setItem("state", serializedState);
      
      // Backup de seguridad
      localStorage.setItem("state_backup", serializedState);
      
      // Backup con timestamp (mantener solo los últimos 3)
      const timestamp = now;
      localStorage.setItem(`state_${timestamp}`, serializedState);
      this.cleanOldBackups();

      // Backup en IndexedDB (async, no bloquea)
      this.saveToIndexedDB(state);

      this.lastBackupTime = now;
      this.lastStateHash = currentHash;
      this.hasChanges = false;

      console.log('💾 Backup inteligente completado:', new Date().toLocaleTimeString());

    } catch(e) {
      console.error('🚨 Error en backup inteligente:', e);
    }
  }

  // Limpiar backups antiguos
  cleanOldBackups = () => {
    try {
      const keys = Object.keys(localStorage);
      const timestampBackups = keys
        .filter(key => key.startsWith('state_') && key !== 'state_backup')
        .sort()
        .reverse();

      // Mantener solo los últimos 3
      timestampBackups.slice(3).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch(e) {
      console.error('Error limpiando backups:', e);
    }
  }

  // Backup en IndexedDB (más robusto)
  saveToIndexedDB = async (state) => {
    try {
      const request = indexedDB.open('AppBackup', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('backups')) {
          db.createObjectStore('backups', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['backups'], 'readwrite');
        const store = transaction.objectStore('backups');
        
        store.put({
          id: 'main_backup',
          data: state,
          timestamp: Date.now()
        });
      };
    } catch(e) {
      console.error('Error en IndexedDB backup:', e);
    }
  }

  // Detectar actividad del usuario
  trackUserActivity = () => {
    let activityTimer;
    
    const resetTimer = () => {
      this.isUserActive = true;
      clearTimeout(activityTimer);
      
      activityTimer = setTimeout(() => {
        this.isUserActive = false;
        console.log('😴 Usuario inactivo, backup habilitado');
      }, 30000); // 30 segundos de inactividad
    };

    // Escuchar eventos de actividad
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    resetTimer();
  }
}

// Crear instancia global
const smartBackup = new SmartBackupService();

export const saveToLocalStorage=(state)=>{
  // Marcar que hay cambios
  smartBackup.markChanged();
  
  // Backup inteligente (no siempre)
  smartBackup.smartBackup(state);
}

export const loadFromLocalStorage=(state)=>{
 
  try{

const serializedState = localStorage.getItem("state")

if(serializedState === null) return undefined
return JSON.parse(serializedState)
  } catch(e){
    
    return undefined
  }
}

// 🛡️ Sistema de Recuperación Inteligente
class SmartRecoveryService {
  
  // Recuperar datos con múltiples intentos
  recoverData = () => {
    console.log('🔍 Iniciando recuperación inteligente...');
    
    // Intento 1: Estado principal
    let data = this.tryLoadFromSource('state');
    if (data && this.validateData(data)) {
      console.log('✅ Datos recuperados desde estado principal');
      return data;
    }

    // Intento 2: Backup de seguridad
    data = this.tryLoadFromSource('state_backup');
    if (data && this.validateData(data)) {
      console.log('✅ Datos recuperados desde backup de seguridad');
      // Restaurar como principal
      localStorage.setItem('state', JSON.stringify(data));
      return data;
    }

    // Intento 3: Backups con timestamp
    const timestampBackups = this.getTimestampBackups();
    for (const backupKey of timestampBackups) {
      data = this.tryLoadFromSource(backupKey);
      if (data && this.validateData(data)) {
        console.log(`✅ Datos recuperados desde ${backupKey}`);
        localStorage.setItem('state', JSON.stringify(data));
        return data;
      }
    }

    // Intento 4: IndexedDB
    this.tryRecoverFromIndexedDB();

    console.log('⚠️ No se pudieron recuperar datos locales');
    return undefined;
  }

  // Intentar cargar desde una fuente específica
  tryLoadFromSource = (key) => {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) return null;
      return JSON.parse(serializedState);
    } catch(e) {
      console.log(`❌ Error cargando desde ${key}:`, e);
      return null;
    }
  }

  // Validar que los datos están completos
  validateData = (data) => {
    try {
      return (
        data &&
        typeof data === 'object' &&
        data.userReducer &&
        (data.registrosReducer !== undefined) &&
        (data.cuentasReducer !== undefined)
      );
    } catch(e) {
      return false;
    }
  }

  // Obtener backups con timestamp ordenados
  getTimestampBackups = () => {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith('state_') && key !== 'state_backup')
        .sort()
        .reverse(); // Más recientes primero
    } catch(e) {
      return [];
    }
  }

  // Recuperar desde IndexedDB
  tryRecoverFromIndexedDB = async () => {
    try {
      console.log('💾 Intentando recuperar desde IndexedDB...');
      
      const request = indexedDB.open('AppBackup', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['backups'], 'readonly');
        const store = transaction.objectStore('backups');
        const getRequest = store.get('main_backup');
        
        getRequest.onsuccess = () => {
          const backup = getRequest.result;
          if (backup && backup.data && this.validateData(backup.data)) {
            console.log('✅ Datos recuperados desde IndexedDB');
            localStorage.setItem('state', JSON.stringify(backup.data));
            
            // Recargar página para aplicar datos
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        };
      };
    } catch(e) {
      console.error('Error recuperando desde IndexedDB:', e);
    }
  }

  // Limpiar datos corruptos
  cleanCorruptedData = () => {
    try {
      const keysToClean = ['state', 'state_backup'];
      keysToClean.forEach(key => {
        const data = localStorage.getItem(key);
        if (data && !this.validateData(JSON.parse(data))) {
          localStorage.removeItem(key);
          console.log(`🧹 Limpiado dato corrupto: ${key}`);
        }
      });
    } catch(e) {
      console.error('Error limpiando datos:', e);
    }
  }
}

// Crear instancia global de recuperación
const smartRecovery = new SmartRecoveryService();

// Función mejorada de carga
export const loadFromLocalStorageWithRecovery = () => {
  // Intentar carga normal primero
  const normalData = loadFromLocalStorage();
  if (normalData && smartRecovery.validateData(normalData)) {
    return normalData;
  }

  // Si falla, usar recuperación inteligente
  console.log('🚨 Carga normal falló, iniciando recuperación...');
  return smartRecovery.recoverData();
}

export const persistedState= loadFromLocalStorageWithRecovery()

//const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const  store = createStore(inireducer, persistedState,composeEnhancers(applyMiddleware(thunk)));

store.subscribe(()=> saveToLocalStorage(store.getState()))

Router.onRouteChangeStart = () => {

  NProgress.start();
};

Router.onRouteChangeComplete = () => {
   
  NProgress.done();
};

Router.onRouteChangeError = () => {
 
  NProgress.done();
};


class MyApp extends App {
state={
  actualizacion:{carrito:"",Estado:""},
  Alert:{Estado:false},
}
channel1 = null;
channel2 = null;

setTimets=(tiempoRes)=>{
  setTimeout(()=>{
      
    let add = {
      Estado:true,
      Tipo:"info",
      Mensaje:"Su token expirara en los proximos 30 segundos, vuelva a iniciar sesión"
             }

  this.setState({Alert: add})

   },(tiempoRes*1000)-30000)

   setTimeout(()=>{

    // Solo hacer logout si tenemos internet
    if (navigator.onLine) {
      let add = {
        Estado:true,
        Tipo:"error",
        Mensaje:"Su token ha expirado, vuelva a iniciar sesión"
      }
      this.setState({Alert: add})

      store.dispatch(logOut());
      Router.push("/ingreso")
    } else {
      console.log('📴 [APP] Token expirado por timeout pero sin internet - manteniendo sesión offline');
    }
   },(tiempoRes*1000))
}

  componentDidMount(){

    window.addEventListener('visibilitychange', ()=>{
      let actualStateadd = store.getState()

      let tiempoAct = new Date().getTime() / 1000
   
      if(actualStateadd.userReducer != "" ){
    
  let deco = actualStateadd.userReducer.update.usuario.decodificado
  let tiempoRes = (deco && deco.exp) ? (deco.exp - tiempoAct) : 0;

        if (tiempoRes > 35){
        
        this.setTimets(tiempoRes)
          } else{
            
            // Solo hacer logout si tenemos internet
            if (navigator.onLine) {
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:"Su token ha expirado, vuelva a iniciar sesión"
              }
              this.setState({Alert: add})
              store.dispatch(logOut());
              Router.push("/ingreso")
            } else {
              console.log('📴 [APP] Token expirado pero sin internet - manteniendo sesión offline');
            }
          }
      }
    
     });
    
    // 🔴 DESHABILITADO: Event listener de offline que causaba logout automático
    // window.addEventListener('offline', function(e) {
    //    alert("Aplicacion off-line")
    //    store.dispatch(logOut());
    //    Router.push("/ingreso")
    // });
    
    // 🌐 Nuevo manejo de offline que NO hace logout
    window.addEventListener('offline', function(e) {
      console.log('📴 [APP] Aplicación offline - manteniendo sesión');
      // NO hacer logout automático, mantener sesión
    });
    
    window.addEventListener('online', function(e) {
      console.log('📶 [APP] Aplicación online - reconectada');
    });
      


       let actualState = store.getState()

this.channel1 = postal.channel();
this.channel2 = postal.channel();
let tiempoAct = new Date().getTime() / 1000
this.channel1.subscribe('setTokenTimer', (data) => {

  let tiempoRestanteSegundos = (data.message.exp - data.message.iat)  * 1000

  setTimeout(()=>{

   let add = {
     Estado:true,
     Tipo:"info",
     Mensaje:"Su token expirara en los proximos 30 segundos, vuelva a iniciar sesión"
 }
 this.setState({Alert: add})

  },tiempoRestanteSegundos-30000)

  setTimeout(()=>{

   // Solo hacer logout si tenemos internet
   if (navigator.onLine) {
     let add = {
       Estado:true,
       Tipo:"error",
       Mensaje:"Su token ha expirado, vuelva a iniciar sesión"
     }
     this.setState({Alert: add})

     store.dispatch(logOut());
     Router.push("/ingreso")
   } else {
     console.log('📴 [APP] Token expirado por setTokenTimer pero sin internet - manteniendo sesión offline');
   }
  },tiempoRestanteSegundos)
    
  });
if(actualState.userReducer != "" ){

let deco = actualState.userReducer.update.usuario.decodificado
let tiempoRes = (deco && deco.exp) ? (deco.exp - tiempoAct) : 0

  if (tiempoRes > 65){
   this.setTimets(tiempoRes)
  
    }else{
      
      // Solo hacer logout si tenemos internet
      if (navigator.onLine) {
        let add = {
          Estado:true,
          Tipo:"info",
          Mensaje:"vuelva a iniciar sesión"
        }
        this.setState({Alert: add})
        store.dispatch(logOut());
        Router.push("/ingreso")
      } else {
        console.log('📴 [APP] Sesión expirada en componentDidMount pero sin internet - manteniendo sesión offline');
      }
    } }

  
    if (
      !("serviceWorker"in navigator) || process.env.NODE_ENV !== "production" ) {
      console.warn("Progressive Web App support is disabled");
      return;
    }
const wb = new Workbox("sw.js", { scope: "/" });
    wb.register();

    // 🔄 WEBSOCKETS: Inicializar conexión global si hay usuario logueado
    this.initializeWebSocketConnection();

    // 🧠 BACKUP INTELIGENTE: Inicializar tracking de actividad
    smartBackup.trackUserActivity();

    // 🛡️ BACKUP: Verificar integridad de datos después de cargar
    setTimeout(() => {
      this.checkDataIntegrity();
    }, 2000); // Esperar 2 segundos para que cargue todo

  }//fin DidMount 

  // 🔄 WEBSOCKETS: Inicializar conexión WebSocket global
  initializeWebSocketConnection = () => {
    const state = store.getState();
    const user = state.userReducer?.update?.usuario?.user;
    
    if (user && user._id) {
      console.log('🔌 [APP] Inicializando WebSocket para usuario:', user._id);
      websocketService.connect(user._id);
      
      // Escuchar cambios en el store para reconectar si cambia el usuario
      store.subscribe(() => {
        const newState = store.getState();
        const newUser = newState.userReducer?.update?.usuario?.user;
        
        if (newUser && newUser._id && newUser._id !== user._id) {
          console.log('🔄 [APP] Usuario cambió, reconectando WebSocket:', newUser._id);
          websocketService.connect(newUser._id);
        } else if (!newUser && websocketService.isConnectedToSocket()) {
          console.log('❌ [APP] Usuario cerró sesión, desconectando WebSocket');
          websocketService.disconnect();
        }
      });
    } else {
      console.log('⚠️ [APP] No hay usuario logueado, WebSocket no se inicializa');
    }
  }

  // �️ BACKUP: Verificar y recuperar datos si es necesario
  checkDataIntegrity = () => {
    try {
      const state = store.getState();
      
      // Si hay usuario pero no datos, intentar recuperar
      if (state.userReducer?.update?.usuario?.user && 
          (!state.cuentasReducer || state.cuentasReducer.length === 0)) {
        
        console.log('⚠️ Usuario logueado pero sin datos, intentando recuperar...');
        
        // Intentar recuperación automática
        const recoveredData = smartRecovery.recoverData();
        if (recoveredData) {
          // Si recuperamos datos, recargar la página
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          // Si no hay backup, mostrar opción de recargar desde servidor
          this.showDataRecoveryOptions();
        }
      }
    } catch (error) {
      console.error('🚨 Error verificando integridad de datos:', error);
    }
  }

  // Mostrar opciones de recuperación al usuario
  showDataRecoveryOptions = () => {
    const shouldReload = confirm(
      'Parece que algunos datos no se cargaron correctamente. ¿Quieres recargar la aplicación para recuperarlos?'
    );
    
    if (shouldReload) {
      window.location.reload();
    }
  }

  // 🔄 WEBSOCKETS: Limpiar al desmontar
  componentWillUnmount() {
    if (websocketService.isConnectedToSocket()) {
      websocketService.disconnect();
    }
  }




  render(){
   let Client_ID = "642525073015-81k5i1a9s8vdr4495kfgdncnuidls40e.apps.googleusercontent.com"
  
    const handleClose = (event, reason) => {
      let AleEstado = this.state.Alert
      AleEstado.Estado = false
      this.setState({Alert:AleEstado})
     
  }
const Alert=(props)=> {
return <MuiAlert elevation={6} variant="filled" {...props} />;
}
     const { Component, pageProps, router } = this.props
 
  return (

    <Provider store={store}>
      <GoogleOAuthProvider clientId={Client_ID}>
         <Head>
    
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

 
        <title key="title">{DEFAULT_SEO.title}</title>
        <meta
                  key="description"
                  name="description"
                  content={DEFAULT_SEO.description}
                />
        <meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width" />
                  
             
            
                <meta
                  key="og:url"
                  property="og:url"
                  content={DEFAULT_SEO.openGraph.url}
                />
                <meta
                  key="og:type"
                  property="og:type"
                  content={DEFAULT_SEO.openGraph.type}
                />
                <meta
                  key="og:title"
                  property="og:title"
                  content={DEFAULT_SEO.openGraph.title}
                />
                <meta
                  key="og:description"
                  property="og:description"
                  content={DEFAULT_SEO.openGraph.description}
                />
                <meta
                  key="og:image"
                  property="og:image"
                  content={DEFAULT_SEO.openGraph.image}
                />
                <meta
                  key="og:image:width"
                  property="og:image:width"
                  content={DEFAULT_SEO.openGraph.imageWidth}
                />
                <meta
                  key="og:image:height"
                  property="og:image:height"
                  content={DEFAULT_SEO.openGraph.imageHeight}
                />
                <meta
                  key="og:locale"
                  property="og:locale"
                  content={DEFAULT_SEO.openGraph.locale}
                />
   <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png"/>
                <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png"/>
                <link rel="icon" type="image/png" sizes="192x192"  href="/favicons/android-icon-192x192.png"/>
                <link rel="icon" type="image/png" sizes="512x512"  href="/favicons/android-icon-512x512.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
                <link rel="manifest" href="/manifest.json"/>
                <meta name="msapplication-TileColor" content="#418fe2"/>
                <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png"/>
                <meta name="theme-color" content="#418fe2"/>
            
        </Head>
        <Nav/> 
        <PageTransition timeout={300} classNames="page-transition" >
        <Component {...pageProps} key={router.route} tokenmannager={()=>{console.log("tgokemas man")}} />       
        </PageTransition>
  <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>    
    </Alert>
  </Snackbar>
 </GoogleOAuthProvider>
  <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: opacity 300ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity 300ms;
          }
        `}</style>
        </Provider>
  )
}
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp