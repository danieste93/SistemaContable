import {Provider} from 'react-redux';
import {createStore , applyMiddleware, compose  } from 'redux';
import thunk from "redux-thunk";
import App from 'next/app'
import { PageTransition } from 'next-page-transitions'
import Nav from '../components/navbar';
import Head from 'next/head';
import { DEFAULT_SEO } from '../config';
import inireducer from '../reduxstore/reducers';

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
export const saveToLocalStorage=(state)=>{
  try{
const serializedState = JSON.stringify(state)
localStorage.setItem("state", serializedState)
  } catch(e){
   
  }
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

export const persistedState= loadFromLocalStorage()

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

 


  }//fin DidMount 




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