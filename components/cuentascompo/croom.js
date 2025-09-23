import React, { Component } from 'react'
import { Animate } from "react-animate-mount";
import {connect} from 'react-redux';
import {  KeyboardDatePicker,  MuiPickersUtilsProvider } from "@material-ui/pickers";
import GenGroupRegs from './SubCompos/GenGroupRegsCuentasNuevas';
import moment from "moment";
import MomentUtils from '@date-io/moment';
import "moment/locale/es";
import Addcuenta from "./modal-addcuenta"
import Addtipo from "./modal-addtipo"
import Editcuenta from "./modal-editcuenta"
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ModalDeleteC from "./modal-delete-cuenta";
import postal from 'postal';
import {getcuentas,addFirstRegs,addTipo,updateCuenta } from "../../reduxstore/actions/regcont";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "../reusableComplex/herlperDrag"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';

import ReactToPrint from "react-to-print";
import ModalBalance from "./SubCompos/modal-balance"
import Dropdown from 'react-bootstrap/Dropdown';


class Croom extends Component {
    state={
      value:0,
      cuentas0:false,
      cuentaExpand:"",
      marginTopDeta:"0",
      loadginData:false,
      downloadData:false,
      ArrTipos:[],
      ValorCuenta:true,
      Alert:{Estado:false},
        Tipos:[],
        ordenCuentas:{}, // Para manejar el orden individual por tipo de cuenta
        tiempo: new Date(),
        CuentasD:[],
        sequence:"",
        displayDetalles:[],
        cuentadetail:false,
        cuenEditMode:false,
        EditCuenta:false,
        allcuentas:true,
        cuentaSelect:{
          NombreC:"",
          DineroActual:{$numberDecimal:0},
          Background:{
            Seleccionado:""
          }
        },
        cuentasSearcher:"",
        CuentaEditar:{},
        TotalIng:0,
        tiempoperiodoini: new Date(),
        tiempoperiodofin: this.periodofin(),
        TotalGas:0,
        sumatransing:0,
        sumatransgas:0,
        diario:false,
mensual:true,
periodo:false,
AddCuenta:false,
addmitipo:false, 
searchMode:false, 
vistaFormato:"cuadros", // Nuevo estado: "cuadros" o "lista"
visibility:false,

superTotal:false,
Activos:false,
Pasivos:false,
filtrosDetalles:false,
visualtipos:true,
cuentascla:false,
ModalDeleteC:false,
CuentaPorDel:"",
InventarioVal:0,
modalBalance:false
    }

    channel1 = null;
    channelCroom = null;
    componentRef = React.createRef(); 
    tituloPrin= React.createRef(); 
    tituloDeta= React.createRef(); 
    printRef  = React.createRef();
    
    handleChangeTiempoini=(e)=>{
      if(e){ 
      this.setState({
        tiempoperiodoini:e._d
      })
     }
    }
    a11yProps(index) {
      return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
      };
    }
    handleChange = (event, newValue) => {
      this.setState({value:newValue})
    };
    periodofin(){
   
     

      let nuevafecha = new Date(add)

      let nuevo = new Date()
      let asd  = nuevo.getDate() + 7
      let add = nuevo.setDate(asd)
     
     
      let fechareturn = new Date(add)
      return(fechareturn)
 
  }

        componentDidMount(){
  this.channelCroom = postal.channel();
  this.channelCroom.subscribe('UpdateCount', (data) => {
 
   if(this.state.cuentaSelect._id == data.cuenta._id)[
    this.setState({cuentaSelect:data.cuenta})
   ]
   
     
   });
   this.channelCroom.subscribe('UpdateCounts', (data) => {
   data.cuentas.forEach(x=>{
    if(x._id == this.state.cuentaSelect._id ){
      this.setState({cuentaSelect:x})
    }

   })
    
      
    });

   

  


     this.channel1 = postal.channel();
     
     // Agregar listeners para activar búsqueda con cualquier tecla de letra y ESC para salir
     this.handleKeyPress = this.handleKeyPress.bind(this);
     this.handleKeyDown = this.handleKeyDown.bind(this);
     document.addEventListener('keypress', this.handleKeyPress);
     document.addEventListener('keydown', this.handleKeyDown);

     // Cargar configuración de cuentas del usuario
     this.loadCuentasConfig();
   




        }

        // Función para cargar configuración de vista de cuentas
        loadCuentasConfig = async () => {
          try {
            console.log('🔍 [CUENTAS] Cargando configuración de vista de cuentas...');
            
            // Verificar si tenemos acceso al usuario desde Redux
            if (!this.props.state.userReducer?.update?.usuario?.user?._id) {
              console.log('⚠️ [CUENTAS] No hay usuario en Redux, intentando cargar desde localStorage...');
              const localConfig = localStorage.getItem('cuentas-vista-config');
              if (localConfig) {
                const config = JSON.parse(localConfig);
                console.log('✅ [CUENTAS] Configuración cargada desde localStorage:', config);
                this.setState({
                  visualtipos: config.visualtipos !== undefined ? config.visualtipos : true,
                  visibility: config.visibility !== undefined ? config.visibility : false,
                  cuentas0: config.cuentas0 !== undefined ? config.cuentas0 : false,
                  vistaFormato: config.vistaFormato || 'cuadros'
                });
              }
              return;
            }
            
            const userId = this.props.state.userReducer.update.usuario.user._id;
            console.log('👤 [CUENTAS] Usuario ID desde Redux:', userId);
            
            console.log('📡 [CUENTAS] Enviando petición a /users/get-config...');
            const response = await fetch('/users/get-config', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                userId: userId,
                configType: 'cuentas-vista' 
              })
            });
            
            console.log('📨 [CUENTAS] Respuesta recibida, status:', response.status);
            
            if (response.ok) {
              const result = await response.json();
              console.log('✅ [CUENTAS] Configuración recibida:', result);
              
              if (result.status === "Ok" && result.data && result.data.cuentasVistaConfig) {
                const config = result.data.cuentasVistaConfig;
                console.log('🎯 [CUENTAS] Aplicando configuración encontrada:', config);
                
                this.setState({
                  visualtipos: config.visualtipos !== undefined ? config.visualtipos : true,
                  visibility: config.visibility !== undefined ? config.visibility : false,
                  cuentas0: config.cuentas0 !== undefined ? config.cuentas0 : false,
                  vistaFormato: config.vistaFormato || 'cuadros'
                });
                
                console.log('✨ [CUENTAS] Estado actualizado con configuración guardada');
              } else {
                console.log('⚠️ [CUENTAS] No se encontró configuración guardada, usando valores por defecto');
                console.log('🔍 [CUENTAS] configData keys:', configData ? Object.keys(configData) : 'configData is null/undefined');
                console.log('🔍 [CUENTAS] configData completo:', configData);
              }
            } else {
              console.log('❌ [CUENTAS] Error en respuesta:', response.status, response.statusText);
              // Intentar cargar desde localStorage como fallback
              const localConfig = localStorage.getItem('cuentas-vista-config');
              if (localConfig) {
                const config = JSON.parse(localConfig);
                console.log('📦 [CUENTAS] Usando configuración de localStorage como fallback:', config);
                this.setState({
                  visualtipos: config.visualtipos !== undefined ? config.visualtipos : true,
                  visibility: config.visibility !== undefined ? config.visibility : false,
                  cuentas0: config.cuentas0 !== undefined ? config.cuentas0 : false,
                  vistaFormato: config.vistaFormato || 'cuadros'
                });
              }
            }
          } catch (error) {
            console.error('💥 [CUENTAS] Error cargando configuración:', error);
            // Intentar cargar desde localStorage como fallback
            const localConfig = localStorage.getItem('cuentas-vista-config');
            if (localConfig) {
              const config = JSON.parse(localConfig);
              console.log('📦 [CUENTAS] Usando configuración de localStorage tras error:', config);
              this.setState({
                visualtipos: config.visualtipos !== undefined ? config.visualtipos : true,
                visibility: config.visibility !== undefined ? config.visibility : false,
                cuentas0: config.cuentas0 !== undefined ? config.cuentas0 : false,
                vistaFormato: config.vistaFormato || 'cuadros'
              });
            }
          }
        };

        // Función para guardar configuración de vista de cuentas
        saveCuentasConfig = async () => {
          try {
            console.log('💾 [CUENTAS] Guardando configuración de vista de cuentas...');
            
            const configData = {
              visualtipos: this.state.visualtipos,
              visibility: this.state.visibility,
              cuentas0: this.state.cuentas0,
              vistaFormato: this.state.vistaFormato
            };
            
            console.log('� [CUENTAS] Estado actual a guardar:', configData);
            
            const token = localStorage.getItem('token');
            console.log('🔑 [CUENTAS] Token para guardar:', token ? 'Sí' : 'No');
            
            // Verificar si tenemos acceso al usuario desde Redux (método preferido)
            if (this.props.state.userReducer?.update?.usuario?.user?._id) {
              const userId = this.props.state.userReducer.update.usuario.user._id;
              console.log('👤 [CUENTAS] Usuario ID desde Redux:', userId);
              
              const response = await fetch('/users/save-config', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  userId: userId,
                  configType: 'cuentas-vista',
                  configData: configData
                })
              });
              
              console.log('📨 [CUENTAS] Respuesta del guardado (Redux), status:', response.status);
              
              if (response.ok) {
                const result = await response.json();
                console.log('✅ [CUENTAS] Configuración guardada en BD exitosamente (Redux):', result);
                localStorage.setItem('cuentas-vista-config', JSON.stringify(configData));
                return;
              }
            }
            
            if (!token) {
              console.log('⚠️ [CUENTAS] No hay token ni Redux, guardando en localStorage temporalmente...');
              localStorage.setItem('cuentas-vista-config', JSON.stringify(configData));
              console.log('✅ [CUENTAS] Configuración guardada en localStorage');
              return;
            }
            
            const response = await fetch('/users/save-config', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ 
                configType: 'cuentas-vista',
                configData: configData
              })
            });
            
            console.log('📨 [CUENTAS] Respuesta del guardado, status:', response.status);
            
            if (response.ok) {
              const result = await response.json();
              console.log('✅ [CUENTAS] Configuración guardada en BD exitosamente:', result);
              // También guardar en localStorage como backup
              localStorage.setItem('cuentas-vista-config', JSON.stringify(configData));
            } else {
              const errorText = await response.text();
              console.log('❌ [CUENTAS] Error guardando en BD, guardando en localStorage:', response.status, response.statusText, errorText);
              localStorage.setItem('cuentas-vista-config', JSON.stringify(configData));
            }
          } catch (error) {
            console.error('💥 [CUENTAS] Error guardando configuración, usando localStorage:', error);
            const configData = {
              visualtipos: this.state.visualtipos,
              visibility: this.state.visibility,
              cuentas0: this.state.cuentas0,
              vistaFormato: this.state.vistaFormato
            };
            localStorage.setItem('cuentas-vista-config', JSON.stringify(configData));
          }
        };        componentWillUnmount() {
          // Remover los listeners cuando el componente se desmonte
          document.removeEventListener('keypress', this.handleKeyPress);
          document.removeEventListener('keydown', this.handleKeyDown);
        }
        
        handleKeyDown = (event) => {
          // Detectar tecla ESC para salir del modo búsqueda
          if (event.key === 'Escape' && this.state.searchMode) {
            this.setState({
              searchMode: false,
              cuentasSearcher: ""
            });
          }
        }
        
        handleKeyPress = (event) => {
          // Solo activar si estamos en la vista principal de cuentas (no en detalles ni modales)
          // Y si el foco NO está en un input (para evitar duplicar teclas)
          const isInputFocused = document.activeElement && document.activeElement.tagName === 'INPUT';
          
          if (this.state.allcuentas && !this.state.searchMode && !isInputFocused) {
            // Verificar que sea una letra (a-z, A-Z) y no una tecla especial
            const isLetter = /^[a-zA-Z]$/.test(event.key);
            
            if (isLetter) {
              // Prevenir que el evento se propague al input
              event.preventDefault();
              event.stopPropagation();
              
              // Activar modo búsqueda y enfocar el input
              this.setState({ 
                searchMode: true,
                cuentasSearcher: event.key // Comenzar con la letra presionada
              }, () => {
                // Scroll hacia arriba y enfocar el input después de que se active
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  const input = document.querySelector('input[name="cuentasSearcher"]');
                  if (input) {
                    input.focus();
                    // Posicionar el cursor al final
                    input.setSelectionRange(input.value.length, input.value.length);
                  }
                }, 100);
              });
            }
          }
        }
        
        printEstado=()=>{
          this.setState({titleToPrint:true})
          setTimeout(()=>{
            this.printRef.current.handleClick();
            this.setState({titleToPrint:false})
          },300)
        
      
        }
        getCuentas=()=>{
         
          let datos = {Usuario: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
            Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
let lol = JSON.stringify(datos)

fetch("/cuentas/getcuentas", {
  method: 'POST', // or 'PUT'
  body: lol, // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json',
    "x-access-token": this.props.state.userReducer.update.usuario.token
  }
}).then(res => res.json())
.catch(error => {console.error('Error:', error);
})  .then(response => {  
  
  if(response.status == 'error'){
  alert("error al actualizar registros")
        }
  else{
   
    this.props.dispatch(getcuentas(response.cuentasgen)); 
    this.setState({loadginData:false})
  }   
      })
    }
    getRCR=()=>{
        
      let datos = {User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
                          Tipo: this.props.state.userReducer.update.usuario.user.Tipo   }}
      let lol = JSON.stringify(datos)
  
      fetch("/cuentas/getRCR", {
        method: 'POST', // or 'PUT'
        body: lol, // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          "x-access-token": this.props.state.userReducer.update.usuario.token
        }
      }).then(res => res.json())
      .catch(error => {console.error('Error:', error);
             })
      .then(response => {  
        
          if(response.status == 'error'){
        
            if(response.message == "error al decodificar el token"){
              this.props.dispatch(logOut());
              this.props.dispatch(cleanData());
              alert("Session expirada, vuelva a iniciar sesion para continuar");
          
           
              Router.push("/ingreso")
                 
            }
          }else if(response.status == 'Ok'){
          
                                 
            this.props.dispatch(getcuentas(response.cuentasHabiles)); 
            this.setState({loadginData:false})
           
          }
      });
      
    }

        updateData = ()=>{
          
          this.setState({loadginData:true})
          this.getCuentas()
        }
        onDragEnd = async ({ destination, source }) => {
          // dropped outside the list
          if (!destination) return;
      
          const newItems = reorder(this.props.regC.Tipos, source.index, destination.index);
 
          this.props.dispatch(addTipo(newItems))
          let dataTosend = {
            Userdata:{DBname:this.props.state.userReducer.update.usuario.user.DBname} , 
            genToUp:newItems
          }
            fetch("/users/uploadArrorder", {
              method: 'POST', // or 'PUT'
              body: JSON.stringify(dataTosend), // data can be `string` or {object}!
              headers:{
                'Content-Type': 'application/json',
                "x-access-token": this.props.state.userReducer.update.usuario.token
              }
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
             
              if(response.message=="error al registrar"){
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje:"Error en el sistema, porfavor intente en unos minutos"
              }
              this.setState({Alert: add, loading:false}) 
              }else{
                this.setState({newdata:""})
              }
            })

          

        };

        // Método para alternar el orden de las cuentas por tipo
        toggleOrdenCuentas = (tipoClicked) => {
          const ordenActual = this.state.ordenCuentas[tipoClicked] || 'desc';
          const nuevoOrden = ordenActual === 'desc' ? 'asc' : 'desc';
          
          this.setState({
            ordenCuentas: {
              ...this.state.ordenCuentas,
              [tipoClicked]: nuevoOrden
            }
          });
        }
    

        displayCuentas=()=>{
          let cuentas = this.props.regC.Cuentas
       
              if(this.state.cuentasSearcher != ""){
        let  filtradospornombre =  this.findCuentas(cuentas)
      
    
        if(filtradospornombre.length >0){
        
          let renderNewCuentas = filtradospornombre.map((cuenta,i)=>{
            let tintura = ()=>{

              if(cuenta.CheckedA){
                if(parseFloat(cuenta.DineroActual.$numberDecimal)  == 0){
                  return ""
                }else if(parseFloat(cuenta.DineroActual.$numberDecimal)  > 0){
                  return "setBlue"
                }else if(parseFloat(cuenta.DineroActual.$numberDecimal) < 0){
                  return "setRed"
                }
              }
              else{ return "" }
             }
             let cuenEditMode= this.state.cuenEditMode?"cseditmodeactive":"";
             
             // Lógica corregida para cuentas ocultas
             let esOculta = cuenta.Visibility === false && this.state.visibility === true;
             let claseOculta = esOculta ? "cuenta-oculta-visible" : "";
             
             // Debug temporal
             if (cuenta.NombreC === "PayPal") {
               console.log('🔍 DEBUG PayPal - cuenta.Visibility:', cuenta.Visibility);
               console.log('🔍 DEBUG PayPal - this.state.visibility:', this.state.visibility);
               console.log('🔍 DEBUG PayPal - esOculta:', esOculta);
             }
             
             // Usar el mismo diseño visual que las cuentas normales
             let backgroundSolido = cuenta.Background.Seleccionado=="Solido"?cuenta.Background.colorPicked:""
             let backgroundImagen = cuenta.Background.Seleccionado=="Imagen"?cuenta.Background.urlBackGround:""
             
             // Estilo para cuentas ocultas
             let estilosOculta = esOculta ? {
               opacity: 0.7,
               border: '2px dashed #ff9800',
               position: 'relative'
             } : {};
             
             return(
                  <div key ={cuenta._id} className={ ` contenedorCuenta ${claseOculta}`}>
                    <div className={ `  cuentaContenedor jwPointer  ${cuenEditMode}`} 
                    onClick={()=>{
                      if(this.state.cuenEditMode){
                        this.editCustomCuenta(cuenta)
                      }else{
                        this.getcuentaRegs(cuenta)
                      }
                    }}
                    style={{
                      backgroundColor:backgroundSolido,
                      backgroundImage: `url(${backgroundImagen})`,
                      position: 'relative',
                      ...estilosOculta
                    }}
                    title={esOculta ? "Cuenta Oculta - Visible durante búsqueda" : ""}
                    >
                      <div className='jwFlexEnd'>
                        {/* Indicador de cuenta oculta mejorado */}
                        {esOculta && (
                          <div className="indicador-cuenta-oculta">
                            <i className="material-icons">
                              visibility_off
                            </i>
                            OCULTA
                          </div>
                        )}
                        <div className="contIconoCroom">
                          <img  className='iconoCuenta' src={cuenta.urlIcono}/>
                        </div>
                        {/* Etiqueta de tipo de cuenta */}
                        <div style={{
                          position: 'absolute',
                          top: '5px',
                          left: '5px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          zIndex: 10,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                          {cuenta.Tipo}
                        </div>
                      </div>
                      <div className="contDataCuenta">
                        <div className="conteliminal">
                          <p className={tintura()}>
                            {`$ ${parseFloat(cuenta.DineroActual.$numberDecimal).toFixed(2)}` }
                          </p>
                          <Animate show={this.state.cuenEditMode}>
                            <div style={{display: 'flex', gap: '8px'}}>
                              <i className="material-icons" onClick={(e)=>{
                                e.stopPropagation()
                                if(cuenta.Tipo== "Inventario" ){
                                  let add = {
                                    Estado:true,
                                    Tipo:"Warning",
                                    Mensaje:"No se puede eliminar cuentas de inventario directamente."
                                  }
                                  this.setState({Alert: add})
                                }else{
                                  this.setState({ModalDeleteC:true, CuentaPorDel:cuenta})
                                }
                              }}>
                              delete
                              </i>
                              <i className="material-icons" 
                                 onClick={(e)=>{
                                   e.stopPropagation()
                                   this.toggleCuentaVisibility(cuenta)
                                 }}
                                 title={cuenta.Visibility === false ? "Mostrar cuenta" : "Ocultar cuenta"}>
                              {cuenta.Visibility === false ? 'visibility' : 'visibility_off'}
                              </i>
                            </div>
                          </Animate>
                        </div>
                        <p className='textoNombreCuenta' >
                          {cuenta.NombreC}
                        </p>
                      </div>
                    </div>
                  </div>

             )

          })

return renderNewCuentas
        }
        else{
          return(<div>*-*</div>)
        }
      }
        }

        findCuentas=(cuentas)=>{
          
let valor = this.state.cuentasSearcher
if(valor !=""){
  if(cuentas.length > 0){
    let findCuentas = cuentas.filter(cuen =>

      cuen.NombreC.toLowerCase().includes(valor.toLowerCase())||
      cuen.Tipo.toLowerCase().includes(valor.toLowerCase())
            )
         
            return findCuentas
  }
}
        }
        handleChangeSwitch=(e)=>{

          this.setState({
            [e.target.name]:!this.state[e.target.name]
            })
        }
        handleChangeGeneral=(e)=>{

          this.setState({
          [e.target.name]:e.target.value
          })
          }
            getcuentaRegs=(cuenta)=>{


this.setState({cuentadetail:true, cuentaSelect:cuenta, allcuentas:false})

this.channel1.publish('sendCuenta', {
  cuentaSend: cuenta
});
setTimeout(()=>{
 let detaMtop= this.tituloDeta.current.clientHeight - 60 + "px"
 
 this.setState({marginTopDeta:detaMtop})

},10)

}
downloadCuentaRegs = ()=> {
  this.setState({downloadData:true})
  let datos = {
    User: {DBname:this.props.state.userReducer.update.usuario.user.DBname,
    },
    cuentaid:this.state.cuentaSelect._id,
    diario:this.state.diario,
    mensual:this.state.mensual,
    periodo:this.state.periodo,
    tiempoperiodoini:this.state.tiempoperiodoini,
    tiempoperiodofin:this.state.tiempoperiodofin,
    tiempo:this.state.tiempo
  }
  let lol = JSON.stringify(datos)

  fetch("/cuentas/getcuentasregs", {
    method: 'POST', // or 'PUT'
    body: lol, // data can be `string` or {object}!
    headers:{
    'Content-Type': 'application/json',
    "x-access-token": this.props.state.userReducer.update.usuario.token
    }
    }).then(res => res.json())
    .catch(error => {console.error('Error:', error);
    })  .then(response => {  
//console.log(response)
    if(response.status == 'error'){
    alert("error al actualizar registros")
   
      }
    else{
     

    let misarrs = this.props.regC.Regs

    let finalars= misarrs.concat(response.regsHabiles)
  

    let sinRepetidosObjeto= finalars.filter((value, index, self) => {
      return(            
        index === self.findIndex((t) => (
          t._id === value._id && t._id === value._id
        ))
    )
    
    });
    
    this.props.dispatch(addFirstRegs(sinRepetidosObjeto));
   

    }   
    this.setState({downloadData:false})

    })



}

getMonthName = ()=> {
  var monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
  return monthNames[this.state.tiempo.getMonth()];
}

getDayName = ()=> {
var days = ['Domingo.','Lunes.', 'Martes.', 'Miercoles.', 'Jueves.', 'Viernes.', 'Sabado.' ];

return days[this.state.tiempo.getDay()];

}

menosunmes=()=>{
  let mesactual = this.state.tiempo.getMonth() - 1
  let nuevomes = this.state.tiempo.setMonth(mesactual)
  let newdate = new Date(nuevomes)

  this.setState({tiempo:newdate})


}
masunmes=()=>{
  let mesactual = this.state.tiempo.getMonth() + 1
  let nuevomes = this.state.tiempo.setMonth(mesactual)
  let newdate = new Date(nuevomes)

  this.setState({tiempo:newdate})


}

menosundia=()=>{
  let asd  = this.state.tiempo.getDate() - 1
  let add = this.state.tiempo.setDate(asd)

  let nuevafecha = new Date(add)
  this.setState({tiempo:nuevafecha})
 

  }
  masundia=()=>{
      let asd  = this.state.tiempo.getDate() + 1
      let add = this.state.tiempo.setDate(asd)

      let nuevafecha = new Date(add)
      this.setState({tiempo:nuevafecha})
     
  }
  ActualFilter=(regs)=>{
   
   
 let fecha = new Date()
          
 let fechafin = fecha.setHours(23, 59, 59)


 if(regs.length >0){
  let misregs = regs.filter((r)=>{

    if(r.Tiempo<= fechafin ){
   
      return r
    }
    
  }  )


return  misregs
 }else{

  return regs
}

  }
  DiaryFilter=(regs)=>{
    let fecha = new Date(this.state.tiempo)
            let fechaini = fecha.setHours(0, 0, 0)
            let fechafin = fecha.setHours(23, 59, 59)
           
            if(regs.length >0){
              let misregs = regs.filter(regs=> regs.Tiempo >= fechaini && regs.Tiempo <= fechafin  )
              return misregs
            }else{
              return regs
            }
  }
  
 
MensualFilter=(regs, tiempo)=>{

  let fecha = new Date(tiempo)
            var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getTime()
            var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
            var ultimahora = new Date(ultimoDia.setHours(23, 59, 59)).getTime()
            if(regs.length >0){
              let misregfiltrados = regs.filter(regs=> regs.Tiempo >= primerDia && regs.Tiempo <= ultimahora  )
            return misregfiltrados
            }else{
              return regs
            }

}
PeriodoFilter=(regs, fechainiAtt, fechafinAtt)=>{

  let fecha = new Date(fechainiAtt)
  let fechafin = new Date(fechafinAtt)

  

  var primerDiaP = fecha.setHours(0,0,0)
  var ultimoDiaP = fechafin.setHours(23,59,59)



  let fechainix = new Date(primerDiaP).getTime()
  let fechafinx = new Date(ultimoDiaP).getTime()
  if(regs.length >0){
    let misregsP = regs.filter(regs=> regs.Tiempo >= fechainix && regs.Tiempo <= fechafinx) 
    return misregsP
  }else{
    return regs
  }

}

OrderFilter=(regs)=>{
  let order = regs.sort((a, b) => b.Tiempo - a.Tiempo)
 
 return order
}
handleChangeTiempoPeriodofin=(e)=>{
  if(e){
 this.setState({
  tiempoperiodofin:e._d
 })
 
}
}
OrderFilter=(regs)=>{
  let order = regs.sort((a, b) => b.Tiempo - a.Tiempo)

 return order
}
buttonsp=(e)=>{

let namex = e.target.id
  this.setState({
  diario:false,
mensual:false,
periodo:false
})
setTimeout(()=>{this.setState({
  [namex]:true
})},10)
  

  }
  handleChangeTiempo=(e)=>{
    if(e){
   this.setState({
    tiempo:e._d
   })
  }
  }

  libutton=(e)=>{
    e.stopPropagation();
    this.setState({Activos:!this.state.Activos})
}
pabutton=(e)=>{
  e.stopPropagation();
    this.setState({Pasivos:!this.state.Pasivos})
}
editCustomCuenta=(e)=>{
 
/*  if(e.Tipo== "Inventario" ){
    let add = {
      Estado:true,
      Tipo:"error",
      Mensaje:"No se puede editar cuentas de sistema directamente"
  }
  this.setState({Alert: add})
  }else{

}
*/
this.setState({CuentaEditar:e,EditCuenta:true})
}

toggleCuentaVisibility = (cuenta) => {
  console.log('🔄 Toggle visibility called for:', cuenta.NombreC, 'Current visibility:', cuenta.Visibility);
  
  // Crear los datos como lo hace el modal de editar cuenta
  let datos = {
    Permisos: cuenta.Permisos || ["administrador"],
    valores: {
      checkedA: cuenta.CheckedA,
      checkedP: cuenta.CheckedP,
      visibility: !cuenta.Visibility, // Cambiar el estado de visibilidad
      Tipo: cuenta.Tipo,
      NombreC: cuenta.NombreC,
      Dinero: cuenta.DineroIni,
      DineroActual: cuenta.DineroActual,
      DescripC: cuenta.Descrip,
      idCuenta: cuenta.iDcuenta,
      idCuentaMongo: cuenta._id,
      Fpago: cuenta.FormaPago,
      limiteCredito: cuenta.LimiteCredito,
      urlIcono: cuenta.urlIcono,
      fondo: cuenta.Background?.Seleccionado || "",
      colorCuenta: cuenta.Background?.colorPicked || "",
      fondoImagen: cuenta.Background?.urlBackGround || "",
      Vendedor: cuenta.Permisos?.includes("vendedor") || false,
      Tesorero: cuenta.Permisos?.includes("tesorero") || false,
      Auxiliar: cuenta.Permisos?.includes("auxiliar") || false
    },
    Usuario: {
      DBname: this.props.state.userReducer.update.usuario.user.DBname,
      Usuario: this.props.state.userReducer.update.usuario.user.Usuario,
      _id: this.props.state.userReducer.update.usuario.user._id,
      Tipo: this.props.state.userReducer.update.usuario.user.Tipo,
    },
  };

  console.log('📤 Sending data:', datos);

  let url = "/cuentas/editcount";
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(datos),
    headers: {
      'Content-Type': 'application/json',
      "x-access-token": this.props.state.userReducer.update.usuario.token
    }
  }).then(res => {
    console.log('📥 Response status:', res.status);
    return res.json();
  })
  .catch(error => {
    console.error('❌ Error:', error);
    let alertMessage = {
      Estado: true,
      Tipo: "error",
      Mensaje: "Error al actualizar la visibilidad de la cuenta"
    };
    this.setState({Alert: alertMessage});
  })
  .then(response => {
    console.log('📋 Response data:', response);
    if (response && response.cuenta) {
      // Actualizar Redux con la cuenta modificada
      this.props.dispatch(updateCuenta(response.cuenta));
      
      // Mostrar mensaje de confirmación
      let alertMessage = {
        Estado: true,
        Tipo: "success",
        Mensaje: response.cuenta.Visibility ? "Cuenta mostrada exitosamente" : "Cuenta ocultada exitosamente"
      };
      this.setState({Alert: alertMessage});
      
      // Actualizar los datos localmente
      this.updateData();
    } else {
      console.log('⚠️ No cuenta in response or invalid response');
    }
  });
}



genRegs=(detallesrender)=>{ 
 
  if( detallesrender) return detallesrender
  else{
    return(<div style={{display:"flex", alignItems:"center", 

      marginTop:"20px"
    }}>
      <span className="material-icons">
warning
</span>
       Sin resultos que mostrar. 
       
    </div>)
  }


}


CalcRegsCuentas=(cuentas)=>{
  let SumCuentasActual=0

  let ArrCuentas = []
  if( this.props.regC.Regs){
  cuentas.forEach(cuenta => {
    let registros  = this.props.regC.Regs.filter(x => x.CuentaSelec.idCuenta === cuenta._id   )
    let transregister  = this.props.regC.Regs.filter(x => x.Accion === "Trans" )
   
    let Ingregister  = registros.filter(x => x.Accion === "Ingreso" )
    let Gasregister  = registros.filter(x => x.Accion === "Gasto"  )
    let Transregister  = transregister.filter(x => x.CuentaSelec.idCuenta === cuenta._id || x.CuentaSelec2.idCuenta === cuenta._id )


    let ActualIngs = this.ActualFilter(Ingregister)
    let ActualGas = this.ActualFilter(Gasregister)
    let ActualTrans = this.ActualFilter(Transregister)
  
    let Actualdata = this.calcData(ActualIngs, ActualGas, ActualTrans, cuenta)

    ArrCuentas.push(Actualdata.AllBalanceRender)

  });
}


SumCuentasActual = ArrCuentas.reduce( (acc, obj)=>  acc + parseFloat(obj), 0);

return SumCuentasActual

}

calcData=(Ingregister, Gasregister, Transregister, cuenta)=>{
  let sumaingbalance = 0
  let sumagasbalance = 0
  let sumatransgasbalance = 0
  let sumatransingbalance = 0
  let arrsee =[]
  let ingbalance = 0
  let gasbalance = 0
  let AllBalanceRender = 0
  
  if(Ingregister.length > 0){
    for (let i=0; i < Ingregister.length; i++ ){
      sumaingbalance += Ingregister[i].Importe
  }
  }
  if(Gasregister.length > 0){
    for (let i=0; i < Gasregister.length; i++ ){
         sumagasbalance += Gasregister[i].Importe
       }
      } 
    
      if(Transregister.length > 0){
        for (let i=0; i < Transregister.length; i++ ){
        
        if(cuenta._id ==  Transregister[i].CuentaSelec.idCuenta){
       sumatransgasbalance +=  Transregister[i].Importe
     
        }
        else if(cuenta._id ==  Transregister[i].CuentaSelec2.idCuenta){
     sumatransingbalance +=  (Transregister[i].Importe)
     arrsee.push(Transregister[i])
        } 
        }
        
        
        }
     
       
        ingbalance= (sumaingbalance +sumatransingbalance).toFixed(2)
        gasbalance=(sumagasbalance+sumatransgasbalance).toFixed(2)
        AllBalanceRender = (ingbalance - gasbalance).toFixed(2)
        if(cuenta.NombreC == "Johnny Merizalde "){
       
        
        
        }
        return {ingbalance, gasbalance, AllBalanceRender }

}

generadorBalanceGeneral=(DetallesPorrender)=>{
  let sumaingbalance = 0
  let sumagasbalance = 0
  let sumatransgasbalance = 0
  let sumatransingbalance = 0

  let ingbalance = 0
  let gasbalance = 0
  let misregsing = DetallesPorrender.filter(regsing => regsing.Accion == "Ingreso")
            if(misregsing.length > 0){
              for (let i=0; i < misregsing.length; i++ ){
                sumaingbalance +=  misregsing[i].Importe
            }
              }

            let misregsgas = DetallesPorrender.filter(regsgas => regsgas.Accion == "Gasto")
            if(misregsgas.length > 0){
        for (let i=0; i < misregsgas.length; i++ ){

            sumagasbalance += misregsgas[i].Importe
        
          }
          } 

             let misregstrans = DetallesPorrender.filter(regstrans => regstrans.Accion == "Trans")
           if(misregstrans.length > 0){
      for (let i=0; i < misregstrans.length; i++ ){

      if(this.state.cuentaSelect._id ==  misregstrans[i].CuentaSelec.idCuenta){
      sumatransgasbalance +=   misregstrans[i].Importe

      }
      else if(this.state.cuentaSelect._id ==  misregstrans[i].CuentaSelec2.idCuenta){
      sumatransingbalance +=   misregstrans[i].Importe
      } 
      }


               }


ingbalance= (sumaingbalance +sumatransingbalance).toFixed(2)
  gasbalance=(sumagasbalance+sumatransgasbalance).toFixed(2)

let balancegeneral = ingbalance - gasbalance

let saldofinal =  balancegeneral

return saldofinal.toFixed(2)
}


    render() {

      let ArrTipos = []
      if(this.props.regC){
      if( this.props.regC.Tipos){
           ArrTipos = this.props.regC.Tipos
          }
      
  
  }
  


      let flechaCuentasP = this.state.cuentaExpand == "Posesion"?"expand_less":"expand_more" 
      let flechaCuentasNoP = this.state.cuentaExpand == "NoPosesion"?"expand_less":"expand_more" 
      let flechaCuentasPsinT = this.state.cuentaExpand == "PosesionSinTotal"?"expand_less":"expand_more" 
      let generadorCuentas = (grupoCuentas,formato)=> grupoCuentas.map((cuenta,i)=>{
        let Actualdata  = 0
        
        // Lógica corregida para cuentas ocultas
        let novisible = "";
        let esOculta = cuenta.Visibility === false && this.state.visibility === true;
        let hayBusqueda = this.state.cuentasSearcher != "";
        
        // Debug temporal para PayPal
        if (cuenta.NombreC === "PayPal") {
          console.log('🔍 GENERADOR PayPal - cuenta.Visibility:', cuenta.Visibility);
          console.log('🔍 GENERADOR PayPal - this.state.visibility:', this.state.visibility);
          console.log('🔍 GENERADOR PayPal - esOculta:', esOculta);
          console.log('🔍 GENERADOR PayPal - formato:', formato);
        }
        
        // La cuenta solo se muestra si:
        // 1. No es oculta (cuenta.Visibility !== false)
        // 2. O es oculta pero visibility está activado (this.state.visibility === true)
        if (cuenta.Visibility === false && this.state.visibility === false) {
          novisible = "invisiblex"; // Completamente oculta
        }
        
        if(this.props.regC.Regs){
        let registros  = this.props.regC.Regs.filter(x => x.CuentaSelec.idCuenta === cuenta._id   )
        let transregister  = this.props.regC.Regs.filter(x => x.Accion === "Trans" )
        let Ingregister  = registros.filter(x => x.Accion === "Ingreso" )
        let Gasregister  = registros.filter(x => x.Accion === "Gasto"  )
        let Transregister  = transregister.filter(x => x.CuentaSelec.idCuenta === cuenta._id || x.CuentaSelec2.idCuenta === cuenta._id )
        
        
        let ActualIngs = this.ActualFilter(Ingregister)
        let ActualGas = this.ActualFilter(Gasregister)
        let ActualTrans = this.ActualFilter(Transregister)
        
        //let Diarydata = this.calcData(diaryIngs, diaryGas, diaryTrans, cuenta)
        let Alldata = this.calcData(Ingregister, Gasregister, Transregister, cuenta)
    
        //console.warn(Math.abs(parseFloat(cuenta.DineroActual.$numberDecimal).toFixed(2)))
        
        //console.warn(Math.abs(parseFloat(Alldata.AllBalanceRender)))
        
     
         Actualdata = this.calcData(ActualIngs, ActualGas, ActualTrans, cuenta)
        
      }
        let comprobador =()=>{
        
        
        
        if(Math.abs(parseFloat(cuenta.DineroActual.$numberDecimal).toFixed(2)) == Math.abs(parseFloat(Alldata.AllBalanceRender))
        
        ){
        
        return " "
        }else {
        
        return "FatalError"
        }
        
        }
        
        let tintura = ()=>{
        
        if(cuenta.CheckedA && cuenta.CheckedP){
        if(parseFloat(cuenta.DineroActual.$numberDecimal) == 0){
        return ""
        }else if(parseFloat(cuenta.DineroActual.$numberDecimal) > 0){
        return "setBlue"
        }else if(parseFloat(cuenta.DineroActual.$numberDecimal)  < 0){
        return "setRed"
        }
        }
        else{ return "" }
        }
     
        let backgroundSolido = cuenta.Background.Seleccionado=="Solido"?cuenta.Background.colorPicked:""
        let backgroundImagen = cuenta.Background.Seleccionado=="Imagen"?cuenta.Background.urlBackGround:""
        
        // Estilo para cuentas ocultas
        let estilosOcultaLista = esOculta ? {
          opacity: 0.7,
          border: '2px dashed #ff9800',
          backgroundColor: backgroundSolido ? 
            `${backgroundSolido}AA` : // Añade transparencia al color sólido
            'rgba(255, 152, 0, 0.1)' // Color de fondo sutil para ocultas
        } : {};
        
        return(<div>
          
    { formato == "cuadros" &&   <div key ={cuenta._id} className={ ` contenedorCuenta  ${novisible}`}  {...this.a11yProps(i)} >
        <div className={ `  cuentaContenedor jwPointer  ${cuenEditMode}`} 
        onClick={()=>{
        
        if(this.state.cuenEditMode){
        this.editCustomCuenta(cuenta)
        }else{
        this.getcuentaRegs(cuenta)
        }
        }}
        
        style={{
          backgroundColor:backgroundSolido,
          backgroundImage: `url(${backgroundImagen})`,
          position: 'relative',
          ...estilosOcultaLista
        }}
        title={esOculta ? "Cuenta Oculta - Visible durante búsqueda" : ""}
        >

     
          <div className='jwFlexEnd'>
        <div className="contIconoCroom">
          <img  className='iconoCuenta' src={cuenta.urlIcono}/>
        </div>
        </div>
        {/* Indicador OCULTA para cuentas ocultas en formato cuadros */}
        {esOculta && (
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            transform: 'translate(50%, -50%)',
            background: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: 15,
            display: 'inline-flex',
            alignItems: 'center'
          }}>
            <i className="material-icons" style={{ fontSize: '12px', marginRight: '2px' }}>
              visibility_off
            </i>
            OCULTA
          </div>
        )}
        <div className="contDataCuenta">
        <div className="conteliminal">
        <p className={tintura()}>
        <Animate show={this.state.ValorCuenta}>
        {`$ ${cuenta.DineroActual.$numberDecimal }` }
        </Animate> 
        <Animate show={!this.state.ValorCuenta}>
        {`$ ${Actualdata.AllBalanceRender}` }
        </Animate> 
        
        </p>
        <Animate show={this.state.cuenEditMode}>
        <div style={{display: 'flex', gap: '8px'}}>
          <i className="material-icons" onClick={(e)=>{
          e.stopPropagation()
          if(cuenta.Tipo== "Inventario" ){
          let add = {
          Estado:true,
          Tipo:"Warning",
          Mensaje:"No se puede eliminar cuentas de inventario directamente."
          }
          this.setState({Alert: add})
          }else{
          this.setState({ModalDeleteC:true, CuentaPorDel:cuenta})
          }
          }}>
          delete
          </i>
          <i className="material-icons" 
             onClick={(e)=>{
               e.stopPropagation()
               this.toggleCuentaVisibility(cuenta)
             }}
             title={cuenta.Visibility === false ? "Mostrar cuenta" : "Ocultar cuenta"}>
          {cuenta.Visibility === false ? 'visibility' : 'visibility_off'}
          </i>
        </div>
        </Animate>
        
        </div>
        <p className='textoNombreCuenta' >
        
        {cuenta.NombreC}
        </p>
        </div>
        </div>
      
        </div>}

        {formato == "lista" &&<div key ={cuenta._id} className={ ` contenedorCuentaLista ${novisible}`}    >
<div className={ `  contenedorlista jwPointer  ${cuenEditMode}`} 
onClick={()=>{

if(this.state.cuenEditMode){
this.editCustomCuenta(cuenta)
}else{
this.getcuentaRegs(cuenta)
}
}}

style={{
  backgroundColor:backgroundSolido,
  backgroundImage: `url(${backgroundImagen})`, 
  position: 'relative',
  ...estilosOcultaLista
}}
title={esOculta ? "Cuenta Oculta - Visible durante búsqueda" : ""}
>
<div className="contIconoCroomLista">
  <img  className='iconoLista' src={cuenta.urlIcono}/>
  {/* Para cuentas ocultas: mostrar "OCULTA" en lugar del nombre */}
  {esOculta ? (
    <p className='jwbolder'>
      {cuenta.NombreC}
    </p>
  ) : (
    <p className='jwbolder'>
      {cuenta.NombreC}
    </p>
  )}
</div>
{/* Indicador OCULTA para cuentas ocultas */}
{esOculta && (
  <div style={{
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(50%, -50%)',
    background: 'rgba(255, 0, 0, 0.8)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 'bold',
    zIndex: 15,
    display: 'inline-flex',
    alignItems: 'center'
  }}>
    <i className="material-icons" style={{ fontSize: '12px', marginRight: '2px' }}>
      visibility_off
    </i>
    OCULTA
  </div>
)}
<div className='contValoreslista'> 
<p className={tintura()}>
<Animate show={this.state.ValorCuenta}>
{`$ ${cuenta.DineroActual.$numberDecimal }` }
</Animate> 
<Animate show={!this.state.ValorCuenta}>
{`$ ${Actualdata.AllBalanceRender}` }
</Animate> 

</p>
<div className="conteliminal">

<Animate show={this.state.cuenEditMode}>
<i className="material-icons" onClick={(e)=>{
e.stopPropagation()
if(cuenta.Tipo== "Inventario" ){
let add = {
Estado:true,
Tipo:"Warning",
Mensaje:"No se puede eliminar cuentas de inventario directamente."
}
this.setState({Alert: add})
}else{
this.setState({ModalDeleteC:true, CuentaPorDel:cuenta})
}
}}>
delete
</i>
<i className="material-icons" 
   style={{marginLeft: '8px'}}
   onClick={(e)=>{
     e.stopPropagation()
     this.toggleCuentaVisibility(cuenta)
   }}
   title={cuenta.Visibility === false ? "Mostrar cuenta" : "Ocultar cuenta"}>
{cuenta.Visibility === false ? 'visibility' : 'visibility_off'}
</i>
</Animate>

</div>
</div>

</div>

</div>



        }
              </div>
        )
        })



      let backgroundSolido = "white"
      let backgroundImagen  ="/fondoscuentas/fblanco.png"

      if( this.state.cuentaSelect.Background.Seleccionado=="Imagen"){
        backgroundSolido = ""
        backgroundImagen=this.state.cuentaSelect.Background.urlBackGround
      }
      if( this.state.cuentaSelect.Background.Seleccionado=="Solido"){
        backgroundImagen=""
        backgroundSolido = this.state.cuentaSelect.Background.colorPicked
     
      }



    let detaMtop = "0px"
 
   


      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
    }
    const Alert=(props)=> {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
   

  
      let diarioval = this.state.diario?"activeval":"";
      let mensualval = this.state.mensual?"activeval":"";
      let periodoval = this.state.periodo?"activeval":"";
      let estilo = this.state.Activos?"clicked":"";
      let estilo2 = this.state.Pasivos?"clicked":"";

let displayDetalles =[]
let detallesrender= ""
let DragableContent = <CircularProgress />
let Detallesfiltrados =""
let DetallesOrdenados  =""
let  DetallesPorrender=[]

let superIng= 0
let superGas= 0
let sumaing = 0
let sumagas = 0

let tiposrender = []
let cuentasrender  =[]
let cuentasHidden  =[]

let cuentasrenderPosesion  =[]
let cuentasrenderPosesionsinTotal = []
let cuentasrenderNoPosesion = []
let cuenEditMode= this.state.cuenEditMode?"ceditmodeactive":""
let capitalTotal =0
let deberTotal =0
let deberActual =0
let balanceTotal = 0
let balanceActual = 0
let deberNoP =0


let CuentasNoP =0
let CuentasP =0






let ActivoST = CuentasNoP + CuentasP 

let PasivosST = 0

let  sumaingbalance=0;
let  sumagasbalance=0;

let sumatransgasbalance = 0
let sumatransingbalance = 0
let ingbalance = 0
let gasbalance = 0
let saldoRender  = 0
let saldoEnviado  = 0
let sumatoriaP = 0
  let sumatoriaNP= 0
  
  let sumatoriaPST = 0
  let contSuperTotalAct = 0
  let contSuperTotalPav = 0
  
  let contPasivosP=0
  let contPasivosNoP=0




if(this.props.regC.Tipos){


if(this.props.regC.Regs){
if(ArrTipos.length > 0){
DragableContent = ArrTipos.map((item, index) => (
  <Draggable
    draggableId={`${item}`}
    index={index}
    key={item}
  >
    {(provided, snapshot) => {

        let visible=""
        let sumatoria= 0
        
        let sumatoriaST= 0
        let ResultCuentas=0
      
        if(this.props.regC.Cuentas){
          if(this.props.regC.Cuentas.length > 0){
      
      
    // Obtener el orden actual para este tipo de cuenta (por defecto: descendente)
    const ordenActual = this.state.ordenCuentas[item] || 'desc';
    
    let cuentasfiltradas;
    if (ordenActual === 'desc') {
      cuentasfiltradas = this.props.regC.Cuentas.filter(cuentaper => cuentaper.Tipo === item).sort((a, b) => parseFloat(b.DineroActual.$numberDecimal) - parseFloat(a.DineroActual.$numberDecimal));
    } else {
      cuentasfiltradas = this.props.regC.Cuentas.filter(cuentaper => cuentaper.Tipo === item).sort((a, b) => parseFloat(a.DineroActual.$numberDecimal) - parseFloat(b.DineroActual.$numberDecimal));
    }
     
    if(this.state.cuentas0){
      cuentasrender = cuentasfiltradas.filter(x=> x.DineroActual.$numberDecimal != "0" && x.DineroActual.$numberDecimal != "0.00")
    }else{
      cuentasrender = cuentasfiltradas
    }


    ResultCuentas = this.CalcRegsCuentas(cuentasrender)


              
              let cuentasSum = cuentasrender
              if(cuentasSum.length > 0){
               for(let i = 0; i < cuentasSum.length; i++){
                        sumatoria += parseFloat(cuentasSum[i].DineroActual.$numberDecimal) 
               }
            
              }
             
           
             
           
          }
        }

       
        let cantidadCuentas = cuentasrender.length 
        visible = cantidadCuentas == 0?"invisiblex":""
        let color = sumatoria > 0? "setBlue":"setRed"
        let color2 = ResultCuentas > 0? "setBlue":"setRed"
      
      let cuenEditMode= this.state.cuenEditMode?"ceditmodeactive":""
      let isDragging = snapshot.isDragging ? "draggingListItem" : ""
        
     return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
       
        className={`tipoMain ${visible} `}
      >
        <div className='contBarraCuenta'>
     <div 
   
      {...provided.dragHandleProps}
     
      className={`contFlexSpaceB  customDragbar ${isDragging}`}
     
     >  
<div className="tituloPrin">{item.toUpperCase()}</div> 
<div className='AnimateCont'>
<Animate show={this.state.ValorCuenta}>
<div className={`valorcuentas  ${color} `}>
${sumatoria.toFixed(2)} 

</div>
</Animate> 
<Animate show={!this.state.ValorCuenta}>
<div className={`valorcuentas  ${color2} `}>
${parseFloat(ResultCuentas).toFixed(2)} 

</div>
</Animate> 



</div>



</div>
<div className="confiltroCuentra">
{/* Botón de ordenamiento */}
<i className="material-icons" 
   onClick={(e)=>{
     e.stopPropagation();
     this.toggleOrdenCuentas(item);
   }}
   title={`Ordenar de ${(this.state.ordenCuentas[item] || 'desc') === 'desc' ? 'menor a mayor' : 'mayor a menor'}`}
   style={{
     fontSize: '20px',
     color: '#1976d2',
     cursor: 'pointer',
     marginRight: '8px',
     padding: '2px',
     borderRadius: '4px',
     transition: 'all 0.3s ease'
   }}
   onMouseEnter={(e) => {
     e.target.style.backgroundColor = '#e3f2fd';
   }}
   onMouseLeave={(e) => {
     e.target.style.backgroundColor = 'transparent';
   }}
>
  {(this.state.ordenCuentas[item] || 'desc') === 'desc' ? 'arrow_downward' : 'arrow_upward'}
</i>
        </div>
</div>
<Animate show={this.state.vistaFormato === "cuadros"}>
<div className="contcuentas">
<Tabs
         value={0} // siempre válido
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
       
{ generadorCuentas(cuentasrender, "cuadros")
 }


</Tabs>
</div></Animate>
<Animate show={this.state.vistaFormato === "lista"}>
<div className='contcuentaslista'>

{ generadorCuentas(cuentasrender,"lista")
 }</div>
</Animate>
      </div>
    )}}
    
  </Draggable>
))}

if(this.props.regC.Regs.length > 0 && this.state.cuentaSelect != ""){


  let IngGastregister  = this.props.regC.Regs.filter(x => x.Accion === "Ingreso" || x.Accion === "Gasto"  )
  
  let response  = IngGastregister.filter(x => x.CuentaSelec.idCuenta === this.state.cuentaSelect._id  )
  
  let transregister  = this.props.regC.Regs.filter(x => x.Accion === "Trans" )
  
  let responseTrans = transregister.filter(x => x.CuentaSelec.idCuenta === this.state.cuentaSelect._id || x.CuentaSelec2.idCuenta === this.state.cuentaSelect._id )
  let registrosElegidos =""
  let balancePosterior = 0
  let combinado = response.concat(responseTrans)
  displayDetalles = this.OrderFilter(combinado)
  let fecha = new Date(this.state.tiempo)
  let valorActualCuenta =this.state.cuentaSelect.DineroActual.$numberDecimal 
  if(this.state.diario){
  DetallesPorrender = this.DiaryFilter(displayDetalles)

  let getMesSistema = fecha.getMonth()
  let getDiaSistema = fecha.getDate()
  let getMesActual =new Date().getMonth()
  let getDiaActual =new Date().getDate()

  
  }else if(this.state.mensual){

 

  DetallesPorrender = this.MensualFilter(displayDetalles, this.state.tiempo)

    let getPeriodRegs =  this.PeriodoFilter(displayDetalles, fecha.setDate(1), new Date() )
  

      let balancePeriod = parseFloat(this.generadorBalanceGeneral(getPeriodRegs))
      let balanceMesSistema= parseFloat(this.generadorBalanceGeneral(DetallesPorrender.filter(x=>x.TiempoEjecucion!= 0)))
 
      
      let saldoGenerado = ((valorActualCuenta - balancePeriod) + balanceMesSistema).toFixed(2)
      


       saldoRender = saldoGenerado
    
  
    

  }
  else if(this.state.periodo){
    
  DetallesPorrender = this.PeriodoFilter(displayDetalles, this.state.tiempoperiodoini, this.state.tiempoperiodofin )

 

      let balancePeriod = parseFloat(this.generadorBalanceGeneral(DetallesPorrender))

  
      
      saldoRender = balancePeriod

  }
  
 

  
  }
  }}
 

 
  
if(DetallesPorrender.length > 0){


  let misregs2ing = DetallesPorrender.filter(regsing => regsing.Accion == "Ingreso" && regsing.TiempoEjecucion != 0)
  
          if(misregs2ing.length > 0){
            for (let i=0; i < misregs2ing.length; i++ ){
              sumaing += misregs2ing[i].Importe
          }
        }
        let misregsgas = DetallesPorrender.filter(regsgas => regsgas.Accion == "Gasto"&& regsgas.TiempoEjecucion != 0 )
       
  
          if(misregsgas.length > 0){
          for (let i=0; i < misregsgas.length; i++ ){
              sumagas +=  misregsgas[i].Importe
             }
            } 
  
            let misregstrans = DetallesPorrender.filter(regstrans => regstrans.Accion == "Trans"&& regstrans.TiempoEjecucion != 0)
  let sumatransing = 0
  let sumatransgas = 0
  
  if(misregstrans.length > 0){
  for (let i=0; i < misregstrans.length; i++ ){
  
  if(this.state.cuentaSelect._id ==  misregstrans[i].CuentaSelec.idCuenta){
  sumatransgas +=   misregstrans[i].Importe
  
  }
  else if(this.state.cuentaSelect._id ==  misregstrans[i].CuentaSelec2.idCuenta){
  sumatransing +=   misregstrans[i].Importe
  } 
  }
  
  
  }
  
  superIng=  (sumaing + sumatransing).toFixed(2)
  superGas= (sumagas + sumatransgas).toFixed(2)

  detallesrender = <GenGroupRegs Registros={DetallesPorrender} cuentaSelect={this.state.cuentaSelect} datosGene={{saldo:saldoRender, balance:superIng-superGas,saldoActive:true}} />
  
  }
  //fin display detalles 

  let capitalActual = 0
if(this.props.regC.Cuentas){
  if(this.props.regC.Cuentas.length > 0){

   // let cuentasCapital = this.props.regC.Cuentas.filter(x => this.CalcRegsCuentas([x]) > 0 && x.CheckedA && x.CheckedP)
   let cuentasCapital = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal) > 0 && x.CheckedA && x.CheckedP)

    let ActivoCuentasNoP = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal)  > 0 && x.CheckedP == false )
    let ActivoCuentasP = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal)  > 0 && x.CheckedP && x.CheckedA)
    let cuentasDeber = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal)  < 0 && x.CheckedP && x.CheckedA)
    let cuentasDeberNoP = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal)  < 0 && x.CheckedP==false )
    
    let SuperTotalActivos = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal) > 0 )
    let SuperTotalPasivos = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal) < 0 )

    let PasivosP = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal)   < 0 && x.CheckedP )
    let PasivosNoP = this.props.regC.Cuentas.filter(x => parseFloat(x.DineroActual.$numberDecimal)  < 0 && x.CheckedP==false )

    cuentasrenderPosesion = this.props.regC.Cuentas.filter(cuentaper =>  cuentaper.CheckedP && cuentaper.CheckedA )
    cuentasrenderPosesionsinTotal = this.props.regC.Cuentas.filter(cuentaper =>  cuentaper.CheckedP && cuentaper.CheckedA ==false )
    cuentasrenderNoPosesion = this.props.regC.Cuentas.filter(cuentaper =>  cuentaper.CheckedP == false )   
  
    if(PasivosP.length > 0){
      for(let i = 0; i < PasivosP.length; i++){
              contPasivosP += parseFloat(PasivosP[i].DineroActual.$numberDecimal)
      }}
      if(PasivosNoP.length > 0){
        for(let i = 0; i < PasivosNoP.length; i++){
                contPasivosNoP += parseFloat(PasivosNoP[i].DineroActual.$numberDecimal)
        }}
    if(SuperTotalActivos.length > 0){
      for(let i = 0; i < SuperTotalActivos.length; i++){
              contSuperTotalAct += parseFloat(SuperTotalActivos[i].DineroActual.$numberDecimal)
      }}
      if(SuperTotalPasivos.length > 0){
        for(let i = 0; i < SuperTotalPasivos.length; i++){
          contSuperTotalPav += parseFloat(SuperTotalPasivos[i].DineroActual.$numberDecimal)
        }}

       
 if(cuentasrenderPosesion.length > 0){
  for(let i = 0; i < cuentasrenderPosesion.length; i++){
           sumatoriaP += parseFloat(cuentasrenderPosesion[i].DineroActual.$numberDecimal)
  }

 }
 if(cuentasrenderPosesionsinTotal.length > 0){
  for(let i = 0; i < cuentasrenderPosesionsinTotal.length; i++){
           sumatoriaPST += parseFloat(cuentasrenderPosesionsinTotal[i].DineroActual.$numberDecimal)
  }

 }
if(cuentasrenderNoPosesion.length > 0){
  for(let a = 0; a < cuentasrenderNoPosesion.length; a++){
              sumatoriaNP += parseFloat(cuentasrenderNoPosesion[a].DineroActual.$numberDecimal)
  }

 }

    
    if(cuentasCapital.length > 0){
    for(let i = 0; i < cuentasCapital.length; i++){
    capitalTotal  += parseFloat(cuentasCapital[i].DineroActual.$numberDecimal)
    capitalActual = this.CalcRegsCuentas(cuentasCapital)
  }



    }
    if(cuentasDeber.length > 0){
   
    for(let i = 0; i < cuentasDeber.length; i++){
      deberTotal += parseFloat(cuentasDeber[i].DineroActual.$numberDecimal)
      deberActual = this.CalcRegsCuentas(cuentasDeber)
    }
  
    }
    if(cuentasDeberNoP.length > 0){
      for(let i = 0; i < cuentasDeberNoP.length; i++){
      deberNoP += parseFloat( cuentasDeberNoP[i].DineroActual.$numberDecimal)
      }
      }
    
    if(ActivoCuentasNoP.length > 0){
    for(let i = 0; i < ActivoCuentasNoP.length; i++){
    CuentasNoP += parseFloat( ActivoCuentasNoP[i].DineroActual.$numberDecimal)
    }
    }
    if(ActivoCuentasP.length > 0){
    for(let i = 0; i < ActivoCuentasP.length; i++){
    CuentasP += parseFloat(ActivoCuentasP[i].DineroActual.$numberDecimal)
    }
    }

    balanceTotal = capitalTotal + deberTotal 
    balanceActual = parseFloat(capitalActual) + parseFloat(deberActual)

    ActivoST = contSuperTotalAct 
    PasivosST = contPasivosP + contPasivosNoP

    }}
    let superBalance =  ActivoST+ contSuperTotalPav
  
        return (
            <div id="maincronn"className="Contcronn"
            
            style={{backgroundColor:backgroundSolido,backgroundImage: `url(${backgroundImagen})`}}
            >
           
           <div className="contAllcuentas">
           <Animate show={this.state.allcuentas}> 
    <div className="contGnCroom">

    <div className="contheadercromm">
        <div className="tituloArt">Mis cuentas</div>
        <div className="contLoader">
        <Animate show={!this.state.loadginData}>
        <div className="contBotonesCuen">
        <button className=" btn btn-success botonAddCrom" onClick={()=>{this.setState({AddCuenta:true})}}>
      
      <span className="material-icons">
    add
    </span>

    </button>
          <button className=" btn btn-primary botonAddCrom" onClick={()=>{this.setState({cuenEditMode:!this.state.cuenEditMode})}}>
         
            <span className="material-icons">
          edit
          </span>
          </button>
          <button className={`btn ${this.state.searchMode ? 'btn-success' : 'btn-secondary'} botonAddCrom`} onClick={()=>{
            const newSearchMode = !this.state.searchMode;
            this.setState({
              searchMode: newSearchMode,
              cuentasSearcher: newSearchMode ? this.state.cuentasSearcher : "" // Limpiar búsqueda si se desactiva
            });
            // Si se está activando el modo búsqueda, hacer scroll hacia arriba y enfocar input
            if (newSearchMode) {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Enfocar automáticamente el input para abrir el teclado en móviles
                const input = document.querySelector('input[name="cuentasSearcher"]');
                if (input) {
                  input.focus();
                }
              }, 150); // Pequeño delay para asegurar que el input esté renderizado
            }
          }}>
            <span className="material-icons">
              {this.state.searchMode ? 'view_list' : 'search'}
            </span>
          </button>
          <button className="btn btn-info botonAddCrom" 
                  onClick={()=>{
                    this.setState({
                      vistaFormato: this.state.vistaFormato === "cuadros" ? "lista" : "cuadros"
                    }, () => this.saveCuentasConfig());
                  }}
                  title={`Cambiar a vista ${this.state.vistaFormato === "cuadros" ? "lista" : "cuadros"}`}
          >
            <span className="material-icons">
              {this.state.vistaFormato === "cuadros" ? 'view_list' : 'view_module'}
            </span>
          </button>
       
          <Dropdown>
        
          <Dropdown.Toggle variant="light" className="contDropdown" id="dropdownm" style={{marginRight:"15px"}}>
          <span className="material-icons">
          more_vert
          </span>
      </Dropdown.Toggle>
    
       <Dropdown.Menu>
       
   
          <Dropdown.Item>
          <button className=" btn btn-warning btnDropDowm" onClick={this.updateData}>
         
         <span className="material-icons">
       update
       </span>
       <p>Actualizar</p>
       </button>
          </Dropdown.Item>

        

          <Dropdown.Item>
          <button className=" btn btn-info btnDropDowm" onClick={()=>{this.setState({visualtipos:!this.state.visualtipos}, () => this.saveCuentasConfig())}}>
         
         <span className="material-icons">
         account_balance_wallet
       </span>
       <p>Posesiones</p>
       </button>
          </Dropdown.Item>
          <Dropdown.Item>
      <button id ="sad"className=" btn btn-dark  jwFull"  onClick={ ()=>{ this.setState({visibility:!this.state.visibility}, () => this.saveCuentasConfig())}} >
        
          {this.state.visibility && 
          <span className='btnDropDowm'><i className="material-icons" >  visibility</i>
              <p>Visible</p>
          </span>
          }
         
       
          {!this.state.visibility && 
          <span className='btnDropDowm'><i className="material-icons" >  visibility_off</i>
              <p>Invisible</p>
          </span>
          }

         
        
          </button>
      </Dropdown.Item>
      <Dropdown.Item>
      <button id ="sad"className=" btn btn-danger  jwFull"  onClick={ ()=>{ this.setState({cuentas0:!this.state.cuentas0}, () => this.saveCuentasConfig())}} >
        
          {this.state.cuentas0 && 
          <span className='btnDropDowm'><i className="material-icons" >  visibility</i>
              <p>Cuentas en 0</p>
          </span>
          }
         
       
          {!this.state.cuentas0 && 
          <span className='btnDropDowm'><i className="material-icons" >  visibility_off</i>
              <p>Cuentas en 0</p>
          </span>
          }

         
        
          </button>
      </Dropdown.Item>
       </Dropdown.Menu>
            
             </Dropdown>
            
       
          
          </div>
        </Animate>
        <Animate show={this.state.loadginData}>
        <CircularProgress />
        </Animate>
        </div>
    </div>

    <div className="contFull100">
    <Animate show={!this.state.searchMode}>
     <div className="contCentrado">
    <div className="contResultados">
      <div className="mainText">
        <div className="mainData">Capital</div>
        <div className="mainData ">

          <div className='AnimateCont setBlue'>
  <Animate show={this.state.ValorCuenta}>

             ${capitalTotal.toFixed(2)}
    

    </Animate> 
    <Animate show={!this.state.ValorCuenta}>

    ${parseFloat(capitalActual).toFixed(2)} 
    
 
    </Animate> 
    </div>
          
          </div>
      </div>
      <div className="mainText">
        <div className="mainData">A deber</div>
        <div className="mainData ">
        <div className='AnimateCont setRed'>
  <Animate show={this.state.ValorCuenta}>

  ${deberTotal.toFixed(2)}
    

    </Animate> 
    <Animate show={!this.state.ValorCuenta}>

    ${parseFloat(deberActual).toFixed(2)}

    
 
    </Animate> 
    </div>
        
          
          </div>
      </div>
      <div className="mainText boton3d" onClick={()=>{this.setState({modalBalance:true})}}>
        <div className="mainData">Balance</div>
        <div className="mainData">
     
          
          <div className='AnimateCont '>
  <Animate show={this.state.ValorCuenta}>

             ${balanceTotal.toFixed(2)}
    

    </Animate> 
    <Animate show={!this.state.ValorCuenta}>

    ${parseFloat(balanceActual).toFixed(2)} 
    
 
    </Animate> 
    </div>
          
          
          </div>
      </div>
    </div>
   
    <Animate show={this.state.visualtipos}>
    <div className="contTipos">
    <DragDropContext onDragEnd={this.onDragEnd}>
    <Droppable droppableId="droppable-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  
                  
                  {DragableContent}
                  
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
      </DragDropContext>
      
    </div>
    </Animate>
    <Animate show={!this.state.visualtipos}>
    <div className="contTipos">
    <div className="tipoMain">  
    <div className="contFlexSpaceB">  
    <div className="tituloPrin">POSESIÓN</div> 
    <div className={`valorcuentas  `}>${sumatoriaP.toFixed(2)}</div>
    <div className="confiltroCuentra">
<i className="material-icons" onClick={(e)=>{

  if(this.state.cuentaExpand == "Posesion"){
    this.setState({cuentaExpand:""})
  }else{
    this.setState({cuentaExpand:"Posesion"})
  }
  

  }}>
  {flechaCuentasP}
</i>
</div>
    </div>
    <Animate show={this.state.cuentaExpand != "Posesion" && !(this.state.vistaFormato === "lista" && !this.state.visualtipos)}>
    <div className="contcuentas">
<Tabs
         value={0} // siempre válido
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          
{ generadorCuentas(cuentasrenderPosesion,"cuadros")
 }


</Tabs>
</div>
    </Animate>
    <Animate show={this.state.cuentaExpand == "Posesion" && this.state.vistaFormato === "lista" || !this.state.visualtipos && this.state.vistaFormato === "lista"}>
    <div className="contcuentaslista">

{ generadorCuentas(cuentasrenderPosesion,"lista")
 }

</div>
</Animate>
    </div>
   
    <div className="tipoMain">  
    <div className="contFlexSpaceB">  
    <div className="tituloPrin">NO Posesión</div> 
    <div className={`valorcuentas  `}>${sumatoriaNP.toFixed(2)}</div>
    <div className="confiltroCuentra">
    <i className="material-icons" onClick={(e)=>{

if(this.state.cuentaExpand == "NoPosesion"){
  this.setState({cuentaExpand:""})
}else{
  this.setState({cuentaExpand:"NoPosesion"})
}


}}>
{flechaCuentasNoP}
</i>
</div>
    </div>
    <Animate show={this.state.cuentaExpand != "NoPosesion" && !(this.state.vistaFormato === "lista" && !this.state.visualtipos)}>
    <div className="contcuentas">
<Tabs
         value={0} // siempre válido
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
           
{ generadorCuentas(cuentasrenderNoPosesion,"cuadros")
 }


</Tabs>
</div>
    </Animate>
    <Animate show={this.state.cuentaExpand == "NoPosesion" && this.state.vistaFormato === "lista" || !this.state.visualtipos && this.state.vistaFormato === "lista"}>
    <div className="contcuentaslista">
{ generadorCuentas(cuentasrenderNoPosesion,"lista")
 }
</div>
</Animate>
    </div>
    <div className="tipoMain">  
    <div className="contFlexSpaceB">  
    <div className="tituloPrin">Posesión SIN TOTAL</div> 
    <div className={`valorcuentas  `}>${sumatoriaPST.toFixed(2)}</div>
    <div className="confiltroCuentra">
    <i className="material-icons" onClick={(e)=>{

if(this.state.cuentaExpand == "PosesionSinTotal"){
  this.setState({cuentaExpand:""})
}else{
  this.setState({cuentaExpand:"PosesionSinTotal"})
}


}}>
{flechaCuentasPsinT}
</i>
</div>
    </div>
    <Animate show={this.state.cuentaExpand != "PosesionSinTotal" && !(this.state.vistaFormato === "lista" && !this.state.visualtipos)}>
    <div className="contcuentas">
<Tabs
         value={0} // siempre válido
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
           
{ generadorCuentas(cuentasrenderPosesionsinTotal,"cuadros")
 }


</Tabs>
</div>
    </Animate>
    <Animate show={this.state.cuentaExpand == "PosesionSinTotal" && this.state.vistaFormato === "lista" || !this.state.visualtipos && this.state.vistaFormato === "lista"}>
    <div className="contcuentaslista">
{ generadorCuentas(cuentasrenderPosesionsinTotal,"lista")
 }
</div>
</Animate>
    </div>
    </div>
   
    </Animate>
    <div className="superTotal jwPointer" onClick={()=>{this.setState({superTotal:!this.state.superTotal})}}>
      <p className="subtituloArt  ">
        Super Total
      </p>
      
    </div>
    <div className="cont-superT">
    <Animate show={this.state.superTotal}>
      <div className="cont-Prin">
      <div className="contULS">
                    <div className="contul">
                    <ul>
      <li className={`${estilo} `} style={{color:"Green"}} onClick={this.libutton} ><span >Activos <div className="valor_activos" >${ActivoST.toFixed(2)}</div></span> </li>
      <Animate show={this.state.Activos}>
     <div className="minilist">
       <div className="tituloclave">
    <p className="STclave">- Posesión</p>
    <p className="STvalor">${CuentasP.toFixed(2)}</p>
    </div>
    <div className="tituloclave">
    <p className="STclave">- No Posesión</p>
    <p className="STvalor">${CuentasNoP.toFixed(2)}</p>
    </div>
  
    </div>
    </Animate>
    </ul>
    </div>
    <div className="contul2">
    <ul>
      <li className={`${estilo2} `} style={{color:"red"}} onClick={this.pabutton}><span >Pasivos <div className="valor_activos" >${PasivosST.toFixed(2)}</div></span></li>
      <Animate show={this.state.Pasivos}>
      <div className="minilist">
      <div className="tituloclave">
    <p className="STclave">- Posesión</p>
    <p className="STvalor">${contPasivosP.toFixed(2)}</p>
    </div>
    <div className="tituloclave">
    <p className="STclave">- No Posesión</p>
    <p className="STvalor">${contPasivosNoP.toFixed(2)}</p>
    </div>

    </div>
    </Animate>
    </ul>
    </div>
    </div>
    
    <div className="conttotalesCrom">
        <div className="conttitulo">
            <div className="titulo">Patrimonio</div>
            <div className="valor valor_activos">${superBalance.toFixed(2)}</div>
        </div>
    </div>
    
      </div>
      </Animate>
      </div>
    </div>
    </Animate>
    </div>
    <div className="contFull100">
    <Animate show={this.state.searchMode}>
    <div className="contCentrado">
    <div className="contSuggester" style={{
      position: 'sticky',
      top: '80px',
      backgroundColor: '#ffffff',
      zIndex: 50,
      padding: '10px 0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
    
      <div className="react-autosuggest__container" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
    <input 
      name="cuentasSearcher" 
      className="react-autosuggest__input" 
      onChange={this.handleChangeGeneral} 
      placeholder="Busca tus Cuentas"
      value={this.state.cuentasSearcher}
      style={{paddingRight: '40px'}}
      autoFocus={this.state.searchMode}
      autoComplete="off"
      inputMode="text"
    /> 
    {this.state.cuentasSearcher && (
      <button 
        onClick={() => {
          this.setState({
            cuentasSearcher: "",
            searchMode: false
          });
        }}
        style={{
          position: 'absolute',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: '#666',
          cursor: 'pointer',
          padding: '0',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="clear-search-btn"
      >
        ×
      </button>
    )}
      </div>
    </div>
    <div className="contcuentas-search">
    {this.displayCuentas()}
    </div>
    </div>
    </Animate>
    </div>
</div> 
</Animate>
</div>





<Animate show={this.state.cuentadetail}>
<div className='marginer'>
<div className='mainTopBS' >
  <div   ref={this.tituloDeta}  className='contBotonesSuperiores' >

  <img src="/static/flecharetro.png" alt="" className="flecharetro" 
                  onClick={()=>{this.setState({cuentadetail:false, allcuentas:true,cuentaSelect:{
                    NombreC:"",
                    DineroActual:{$numberDecimal:0},
                    Background:{
                      Seleccionado:""
                    }
                  }})
                  this.channel1.publish('resetCuenta', {
                    cuentaSend: ""
                  });
                }  }
                  />
                    <div className="tituloArt">Detalles de  {this.state.cuentaSelect.NombreC}</div>

                  
                    <Dropdown>
                    <Dropdown.Toggle variant="dark" className="userCont customDrop" id="dropdown-basic">
                    <span className="material-icons">
          more_vert
          </span>
      </Dropdown.Toggle>  
      <Dropdown.Menu>
 
      <Dropdown.Item >
      <button className='btn btn-success ' onClick={this.printEstado}> Estado de Cuenta </button>
      </Dropdown.Item>
      <Dropdown.Item >
      <button className='btn btn-info ' onClick={()=>{this.setState({filtrosDetalles:!this.state.filtrosDetalles})}}> Filtros </button>
      </Dropdown.Item>
      </Dropdown.Menu>
                    </Dropdown>
  </div>
  </div>
  <div className='centrar'   style={{marginTop:"60px"}} >
  <ReactToPrint 
                        trigger={() => <React.Fragment/>}
                        content={() => this.componentRef.current}     
                        ref={this.printRef}
                      
                        />

                        </div>
  <div ref={this.componentRef} className="contGnCroom2" >
  
    <div className="headercroom">

        <Animate show={this.state.titleToPrint}>
          <div className='centrar'>
          <div className="tituloArt">Detalles de  {this.state.cuentaSelect.NombreC}</div>
          </div>
          </Animate>            

  </div>
  <div className="contTipos">
    
  <div className="tipoMainDeta">
    <div className='ContTituloFiltros' style={{marginTop:this.state.marginTopDeta}}>
      <div className='contAnimacion'>
    <Animate show={this.state.mensual}>
      <div className='centrar '>
        <div className='contmensualflechas'>
      <div className="flechalateral" onClick={this.menosunmes}> {'<'}</div>
    <div className="subtituloArt contDonthide">
                         {this.getMonthName()}
                 
                       </div>
                       <div className="flechalateral" onClick={this.masunmes}> {'>'}</div>
                       </div>
       
                       </div>
      </Animate>
      <Animate show={this.state.diario}>
      <div className='centrar'>
    <div className="subtituloArt contmensualflechas">
    <div className="flechalateral" onClick={this.menosundia}> {'<'}</div>
    {this.getDayName()}
    <div className="flechalateral" onClick={this.masundia}> {'>'}</div>
                       </div>
                       </div>
      </Animate>
      <Animate show={this.state.periodo}>
      <div className='centrar'>
      <div className="subtituloArt contmensualflechas">
        Periodo
      </div>
      </div>
      </Animate>
      </div>
      <div className="Contdonwloadbutton">
            <Animate show={!this.state.downloadData}>
            <button className="downloadbutton"onClick={this.downloadCuentaRegs} >       <span className="material-icons">
             search
</span></button>

</Animate>
<Animate show={this.state.downloadData}>
<CircularProgress />
</Animate>
</div>
    </div>
  <Animate show={this.state.filtrosDetalles}>
    <div className='contFiltros'>
  <div className="cont-Prin">
  
  <div  id="diario" className={`botongeneral jwPointer  ${diarioval}  `}onClick={ this.buttonsp}>Diario</div>
  <div id="mensual" className={`botongeneral jwPointer  ${mensualval} `}onClick={ this.buttonsp}>Mensual</div>
  <div id="periodo" className={`botongeneral jwPointer  ${periodoval} `}onClick={ this.buttonsp}> Periodo</div>
  
  
  </div>
  <Animate show={this.state.mensual}>
  <div className="contfiltromensual jwContFlexCenter">
                      
                     <div className="contmensual " >
   
      <div className="fechacentral">
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                 <KeyboardDatePicker
            disableToolbar
            format="DD/MM/YYYY"
            views={["month"]}
            margin="normal"
            id="date-picker-inline"
            label="Selecciona la fecha"
            value={this.state.tiempo}
            onChange={this.handleChangeTiempo}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
              
            
                 </MuiPickersUtilsProvider>
                 </div>
                
                 </div>
                       
                     </div>
  
                     </Animate>   
                     <Animate show={this.state.diario}>
                  <div className="contfiltromensual jwContFlexCenter">
                
                     <div className="contmensual " >
     
      <div className="fechacentral">
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                 <KeyboardDatePicker
            disableToolbar
            format="DD/MM/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Selecciona la fecha"
            value={this.state.tiempo}
            onChange={this.handleChangeTiempo}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
              
            
                 </MuiPickersUtilsProvider>
                 </div>
                
                 </div>
                       
                     </div>
            
       
                    </Animate>    
                    <Animate show={this.state.periodo}>
                    <div className="contfiltromensual jwContFlexCenter">
                   
                       <div className="contmensual">
                         <div className="separador">
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                 <KeyboardDatePicker
            disableToolbar
        
            format="DD/MM/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Fecha de inicio "
            value={this.state.tiempoperiodoini}
            onChange={this.handleChangeTiempoini}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
              
            
                 </MuiPickersUtilsProvider>
                 </div>
                 <div className="separador">
                 <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                 <KeyboardDatePicker
            disableToolbar
             format="DD/MM/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Fecha fin "
            value={this.state.tiempoperiodofin}
            onChange={this.handleChangeTiempoPeriodofin}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
              
            
                 </MuiPickersUtilsProvider>
  
                 </div>
                 </div>
                       
                     </div>
  
                    </Animate> 
                    </div>
  </Animate>     
  
               <div className="contdinerosum ">
                  <div className="dineroresum2 ">
                     <p className="subtituloArt " >{}</p>
                     <div className="contsgens">
                         <div className="minigen">
                             <div style={{color:"blue"}}>Ingreso</div>
                             <div>${superIng}</div>
                         </div>
                         <div className="minigen">
                             <div style={{color:"red"}}>Gasto</div>
                             <div>${superGas}</div>
                         </div>
                         <div className="minigen">
                             <div>Balance</div>
                             <div>${(superIng - superGas).toFixed(2)} </div>
                       
                         </div>
                         <div className="minigen">
                             <div style={{fontWeight:"Bolder"}}>Saldo </div>
                          
                             <div style={{fontWeight:"Bolder"}}> ${saldoRender} </div>
                       
                         </div>
                         </div>
                     </div>
                     </div>
                     
      
                  <div className="supercontreg">
                    
                  {this.genRegs(detallesrender)}
                  </div>
                
               
  </div>
  </div>
  
  </div>
  </div>
  </Animate>
  
  <Animate show={this.state.AddCuenta}>
         < Addcuenta datosUsuario={this.props.datosUsuario._id}    Flecharetro4={
           
     ()=>{
    
      this.setState({AddCuenta:false, })}
    } 
    agregarTipo={()=>{
   
      this.setState({addmitipo:true})}}
            />
          </Animate >
  
          <Animate show={this.state.addmitipo}>
      
      < Addtipo id="adddtipe"   Flecharetro4={
  
  ()=>{
  
   this.setState({addmitipo:false, valdefault:"No"})}} 
         /> 
         
       </Animate >
       <Animate show={this.state.EditCuenta}>
         < Editcuenta
          datosUsuario={this.props.datosUsuario._id}
          agregarTipo={()=>{
   
            this.setState({addmitipo:true})}}
                  
            CuentaEditar={this.state.CuentaEditar}
            Flecharetro4={()=>{ this.setState({EditCuenta:false})}} 
            />

          </Animate >
          <Animate show={this.state.ModalDeleteC}>
         <ModalDeleteC CuentaDelete={this.state.CuentaPorDel} Flecharetro={()=>{this.setState({ModalDeleteC:false})}}/>
          </Animate>

          <Animate show={this.state.modalBalance}>
         <ModalBalance balance={balanceTotal} Flecharetro={()=>{this.setState({modalBalance:false})}}/>
          </Animate>

          <Snackbar open={this.state.Alert.Estado} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> {this.state.Alert.Mensaje} </p>
    
    </Alert>
  </Snackbar>
<style > {  ` 
.RegData{
  display: flex;
    flex-flow: column;
    align-items: center;
    border-bottom: 3px solid black;
    padding: 5px;
    border-radius: 15px;
    text-align: center;
    background: #cfe6ff94;
    width: 157px;
}
.contDropdown{
  margin-top: 5px;
  margin-left: 5px;
  height: 34px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.AnimateCont{
  display:flex;
  flex-flow: column;
}

    .react-autosuggest__container{
      position: relative;
    border-radius: 6px;
    border: 2px solid #ffffff;
    box-shadow: -1px 5px 9px #418fe2;
    margin: 0px;
    margin-right: 20px;
  
    }  
.contCentrado{
  display:flex;
  flex-flow: column;
  align-items: center;
}
.cDc2x{
  margin-left: 2px;
  width: 15%;
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
  height: 87%;
  width: 88%;
  padding: 5px;
  border-radius: 10px;
  cursor:pointer;
} 
cDc2x p{
  margin:0px;
}   

  
.contBotonesCuen{
  display:flex;
}
.superTotal{
  width: 34%;
  margin-bottom: 10px;
  margin-top: 12px;
  transition: 1s;
  cursor: pointer;
  border: 1px solid;
  border-radius: 17px;
  box-shadow: inset 0px -1px 5px black;
  min-width: 125px;
  display: flex;
  flex-flow: column;
  padding: 5px;
  justify-content: center;
  align-items: center;
}
.contResultados{
  display: flex;
  justify-content: space-around;
  width: 80%;
  border-bottom: 2px solid #81bbf7;
  border-radius: 19px;
  box-shadow: 0px 1px 1px black;
  margin-top: 65px;
  margin-bottom: 11px;
  align-items: center;
}
.contFull100{
  width: 100%;
}
             .botonAddCrom{
              display:flex;
              padding:4px;
              margin:5px
               }
          
          .botonAddCrom p{
              margin:0px
          }
.separador{
  margin: 6px 14px  ;
}
.contheadercromm{
  display: flex;
  justify-content: space-around;
  width: 100%;
  background: #e3ebf3;
  border-radius: 15px;
  padding: 5px;
  position: fixed;
  z-index: 10;
}
  .cont-Prin {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    margin-top:5px;
    margin-bottom:20px;
}
.fechacentral{
  width: 60%;
}
.contfiltromensual{
  flex-flow:column
} 
 .contmensual{
  display: flex;
  justify-content: space-around;
align-items: center;
max-width: 500px;

border: 6px outset;
border-radius: 11px;
margin: 10px 0px;
}
.contCuentasSearch{
  max-width: 500px;
  width: 90%;
}
.tituloclave{
  margin-bottom: 12px;
    border-bottom: 2px solid #4fa74f;
    padding: 5px;
    border-radius: 8px;
}
.flechalateral{
  display: flex;
  align-items: center;
  box-shadow: inset 1px 2px 3px;
  width: 25px;
  height:25px;
  padding: 4px;
  text-align: center;
  justify-content: center;
  cursor:pointer;
  border-radius: 48%;
}
.STvalor{

  margin-left: 10px;
    font-style: italic;
}
.STclave{


  font-weight: bold;
}
.valorcuentas{
  margin-right: 15px;
  font-weight: bold;
  font-size: 23px;
}

.setBlue{
  color:blue;
}
.setRed{
  color:red;
}
.FatalError{
  border:3px solid red;
}
.contIconoCroom{
 
  background: #f5f5f5cc;
  border-radius: 50%;
  padding: 1px;
  display: flex;
  justify-content: center;
  border-bottom: 2px solid black;
  height: 40px;
  width: 40px;

   }
   .iconoCuenta{
    width: 95%;
    border-radius: 50%;
  }
.mainData{
  text-align: center;
}
.invisiblex{
  display: none;
}
.cuenta-oculta-visible {
  opacity: 0.6;
  filter: grayscale(20%);
  border: 1px dashed #ccc !important;
}
.headercroom{
  display:flex;
}
   .fechacont{
    font-size: 16px;
    color: darkgrey;
   }
.contGrupo{
  width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid;
    border-radius:5px;
    margin-bottom: 6px;
    padding: 5px;
    max-width: 800px;
}
.conteliminal{

  font-size: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
 

    }
    .contBarraCuenta{
      display:flex;
    }
.mainText{
  width: 30%;
  display: flex;
  margin: 10px;
  flex-flow: column;
  text-align: center;
}
.cont-superT{
 
  width: 80%;
  height: 360px;

}
              .contdinerosum{
                display: flex;
                justify-content: center;
                align-items: center;
              }
             .dineroresum2{
              margin: 5px 0px;
              box-shadow: 0px 0px 2px #292323;
              padding: 10px;
              border-radius: 13px;
              background: #ecf5ff;
              width: 100%;
              max-width: 500px
          }
                        .supercontreg{                    
                          padding-bottom: 150px;
                          width: 100%;
                          align-items: center;
                          display: flex;
                          justify-content: center;
                          flex-flow: column;
                     
                          background: #f5f5f5f7;
                          border-radius: 10px;
                          padding:0
                         }
          
                      
 .cuentareg{
  font-size: 15px;
  color: grey;
}
.hiddenCustom{
  background: #bfb9b9;
}

p{
  margin:0px
}
.contSubData{
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin: 5px 0px;
}
.conticons{
  width: 30%;
    display: flex;
    justify-content: space-around;
    max-width: 200px;
    align-items: center;
}
.botonVisualite{
  padding: 6px;
  border-radius: 36px;

  box-shadow: 0px 0px 0px 0px #1e214c;
  transition: 1s,
  height: 40px;
}
.dineroresum{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 5%;
  margin-top: 3%;
  margin-bottom: 5%;
  /* border-top: 2px solid white; */
  box-shadow: 0px 0px 2px #292323;
  padding: 10px;
  border-radius: 13px;
  background: #ecf5ff;
  flex-flow:column;
  max-width: 500px
}
.customDrop{
  padding: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
}
                    .flecharetro{
                      height: 40px;
                      width: 40px;
                      padding: 5px;
                    }
                .contGnCroom{
                  display: flex;
                  flex-flow: column;
                  width: 100%;
                  align-items: center;
           
                }
                .contGnCroom2{
                  display: flex;
                  flex-flow: column;
                  width: 100%;
                  align-items: center;
                margin-top:10px;
                }
                .Contcronn{
                  width: 100%;
                  display: flex;
                  flex-flow: column;
                
                  align-items: center;
                  background-size: cover;
                  background-attachment: fixed;
                  transition:1s;
                  min-height: 100vh;
                
                }
                .contLoader{
          
                  display: flex;
                  flex-flow: column;
                }
                .contTipos{
                  width: 99vw;
                  max-width: 800px;
                }
                .contcuentas{
                  padding: 5px;
                  display: flex;
                  justify-content: center;
                  height: 140px;
                }
                .contSuggester{
                  margin-top: 65px;
                  margin-bottom: 30px;
                }
                .contenedorCuenta{
                  height: 120px;
                  margin: 5px;
                  width: 202px;
                  min-width: 200px;
                  max-width: 200px;
                  margin-right: 20px;
                  flex-wrap:wrap;
                }
                .contenedorCuentaLista{
                  width: 100%;
                  
                  margin: 2px 0px;
                }
                .textoNombreCuenta{
                  overflow: hidden;
  text-overflow: ellipsis; 
  font-weight:bolder;
                }
                .contenedorlista{
                  display: flex;
                  justify-content: space-between;
                  border-radius: 5px;
                  padding: 3px;
                  transition: 1s;
                  box-shadow: 0px 0px 0px black;
                }
                .tituloPrin{
                  font-weight: bold;
                  font-size: 20px;
                }
                  .cuentaContenedor{
            
                    border-bottom: 2px solid grey;
                    padding: 6px 0px 0px 0px;
                    border-radius: 13px;
                    margin-bottom: 10px;
                    background-size: cover;
                    height: 95%;
                    flex-flow: column;
                    display: flex;
                    min-height: 40px;
                    transition: 1s;
                    box-shadow:0px 0px 3px -1px black;
                 
                    justify-content: space-between;
                  }
                  .contDataCuenta{
                    padding-left: 6px;
                    background: #ffffffba;
                    line-height: 23px;
                    padding-top: 5px;
                    border-radius: 12px;
                  }
                  .cuentanameSearch{
                    border: 2px solid grey;
                    box-shadow: 0px -2px 3px black;
                    height: 70px;
                    transition: 1s;
                    border-radius: 13px;
                    overflow: hidden;
                    display: flex;
                    margin-bottom: 16px;
                    flex-flow: column;
                    justify-content: space-between;
                    background: white;
                  }
                  .boxp{
                    display: flex;
    justify-content: space-between;
    margin:10px;
                  }
                  .boxs{
                    display: flex;
                    justify-content: center;
                    font-size: 12px;
                    background: #0505eb;
                    width: 100%;
                    color: white;
                                     
                 
                  }
                  .contAllcuentas{
                    width: 100%;
                  }
                  .ceditmodeactive{
                 
                    box-shadow: 1px 2px 9px 4px black;
    height: 100%;
                  
                  
                  }
                  .cseditmodeactive{
                    background: #f0f7ff;
                    
                    box-shadow: 1px 3px 1px black;
                    height: 75px;
                  
                  }
                  .cuentaContenedor p{
                    margin:0;
                 
                    margin-left: 13px;
                  }
                  
                  .customDragbar{
                    background: #7cbaff;
                    height: 50px;
                    padding: 5px;
                    border-radius: 10px 0px 0px 0px;
                    display: flex;
                    justify-content: space-around;
                    border-bottom: 3px solid black;
                    align-items: center;
                    color: white;
                    width: 99%;
                  }
                  .contcuentaslista{
                 
                    display: flex;
                    justify-content: center;
                    flex-flow: column;
                    padding: 0px 3px;
                  }
                  .contcuentaslista.expandido{
                    display: flex !important;
                  }
                  .confiltroCuentra{
                    background: #7cbaff;
                    border-radius: 0px 10px 0px 0px;
                    color: white;
                    justify-content: center;
                    border-bottom: 3px solid black;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                  }

                .tipoMain{
                  box-shadow: 0px 4px 3px #708ec7;
             
                  margin: 5px;
                  margin-bottom: 17px;
                  border-radius: 10px;
            
                  width: 96%;
                  margin-left: 2%;
                }
                .tipoMainDeta{
              

                  margin: 5px;
                  margin-bottom: 17px;
                  border-radius: 10px;
            
                  width: 96%;
                  margin-left: 2%;
                }
             
                .btnDropDowm p{
                  margin-left: 4%;
                }
                .full{
                    width: 90%;
                }
                .contBotonesSuperiores{
                  display: flex;
                  margin-top: 5px;
                
               
                  background: #ffffffeb;
                border-radius:14px;
                  justify-content: space-around;
               
                  z-index: 1;
                  padding: 5px;
                  width: 96%;
                 
                }
                .mainTopBS{
                  display: flex;
                  position: fixed;
                  justify-content: center;
                  text-align: center;
                  width: 99vw;
                  max-width: 800px;
                
                }
                
                /* Estilos específicos para el grid de búsqueda de cuentas */
                .contcuentas-search {
                  padding: 5px;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  align-items: flex-start;
                  gap: 10px;
                  min-height: 140px;
                  position: relative;
                  z-index: 1;
                }
                
                /* Media queries solo para búsqueda de cuentas */
                @media (max-width: 768px) {
                  .contcuentas-search {
                    justify-content: center;
                    gap: 8px;
                  }
                  .contcuentas-search .contenedorCuenta {
                    width: calc(100% - 10px);
                    max-width: 100%;
                    min-width: 280px;
                    margin: 0;
                  }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                  .contcuentas-search {
                    justify-content: flex-start;
                    gap: 10px;
                  }
                  .contcuentas-search .contenedorCuenta {
                    width: calc(50% - 5px);
                    min-width: 200px;
                    max-width: 300px;
                    margin: 0;
                  }
                }
                
                @media (min-width: 1025px) {
                  .contcuentas-search {
                    justify-content: flex-start;
                    gap: 15px;
                  }
                  .contcuentas-search .contenedorCuenta {
                    width: calc(33.333% - 10px);
                    min-width: 220px;
                    max-width: 280px;
                    margin: 0;
                  }
                }
                
                @media (min-width: 1400px) {
                  .contcuentas-search .contenedorCuenta {
                    width: calc(25% - 12px);
                  }
                }
                
                /* Estilo para el botón de limpiar búsqueda */
                .clear-search-btn:hover {
                  background-color: #f0f0f0 !important;
                  color: #333 !important;
                }
       
  .minigen{
    text-align: center;
  
    min-width: 110px;
    margin: 5px;
 }
 .contIconoCroomLista{
  display:flex;
  width: 50%;
  max-width:200px;
  align-items: center;
  background: #ffffffba;
  border-radius: 12px;
 }
 .contIconoCroomLista p{
margin-left:5px
 }

 .contValoreslista{
  align-items: center;
  background: #ffffffba;
  border-radius: 12px;
  display: flex;
  padding: 3px;
 }


 .iconoLista{
  width: 35px;
 }
 .contsgens{
  display: flex;
width: 100%;
justify-content: space-around;
flex-wrap:wrap;
}
.botongeneral{
  border-radius: 10px;
  width: 30%;
  font-weight: bold;
  height: 30px;
  background: white;
  transition: 0.5s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  color: lightgrey;
 }
 .activeval{
  height: 40px;
  color: black;
  box-shadow: -5px 1px 5px #5498e3;  

}
.contDonthide{
  background: #ffffffc7;
  border-radius: 15px;
  padding: 3px;
  margin-bottom:3px;
  display:flex;
  justify-content: center;
  align-items: center;
}

  .contAnimacion{
  display:flex;
  flex-flow:column
  }

 .contmensualflechas{
  background: #fcfdff;
  display: flex;
 
     min-width: 225px;
  justify-content: space-around;
  align-items: center;
  border-radius: 26px;
  margin-bottom:6px;
  padding:5px;
 }
.mainhomeapp{
  transition: 0.5s;


width: 100%;
height: 50%;
display: flex;
justify-content: center;
align-items: center;
  transition: 0.5s;
  left: -100%;
}
.entradaaddc{
  left: 0%;
 }

.cont-Prin {
  display: flex;
  width: 100%;
  justify-content: space-evenly;

}
.contFiltros{
  background: #ffffffeb;
  border-radius: 10px;
  padding:5px;
}
.contULS{
  width: 40%;
}
.MuiFormControlLabel-root{
  margin: 0;
}
.conttitulo{
  border-radius: 30px;
  text-align: center;
  padding: 5px;
  box-shadow: rgb(38 57 77) 12px 35px 78px -20px;
  width: 90%;
  max-width: 350px;
  border-bottom: 6px double black;

}
.conttotalesCrom{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;

}
.marginer{
  padding-bottom:30px;
}

.listActive{
  box-shadow: -1px -1px 2px 4px #1e214c;
}
  ul {
      margin-top:20px;
      padding: 0;
      list-style-type: none;
  }
  
  li {
      z-index: 1;
      font-size: 25px;
      width: 100%;
      height: 100%;
      color: black;
      border-left: 0.08em solid;
      position: relative;
      margin-top: 0.8em;
      cursor: pointer;
  }
  
  li::before,
  li::after
   {
      content: '';
      position: absolute;
      width: inherit;
      border-left: inherit;
      z-index: -1;
  }
  
  li::before {
      height: 85%;
      top: 8%;
      left: calc(-0.15em - 0.08em * 2);
      filter: brightness(0.9);
  }
  
  li::after {
      height: 65%;
      top: 20%;
      left: calc(-0.15em * 2 - 0.08em * 3);
      filter: brightness(0.6);
  }
  
  li span {
      position: relative;
 

      height:90px;
      box-sizing: border-box;
      border: 0.08em solid;
      background-color: whitesmoke;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: sans-serif;
      text-transform: capitalize;
      transform: translateX(calc(-0.15em * 3 - 0.08em * 2));
      transition: 0.3s;
      border-radius:15px;
      flex-flow: column;
      max-width:300px;
      box-shadow: rgb(38 57 77) 0px 20px 30px -20px;
  }
  
  li.clicked span {
      transform: translateX(0.15em);
  }

.contgenerales i{
border-left: 1px solid black;
padding:3px;
border-radius:5px;
cursor:pointer
}
.draggingListItem: {
  background: "rgb(235,235,235)"
}

.boton3d {

background: linear-gradient(353deg, #666, #333);
color: white;
border: none;

font-size: 17px;
cursor: pointer;
border-radius: 12px;
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2), 0px 0px 25px rgba(255, 255, 255, 0.2);
transition: all 0.3s ease;
outline: none;
transform: translateY(0);
width: 100px;
padding: 2px;
}

.boton3d:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4);
}

.boton3d:active {
  transform: translateY(2px);
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}

.boton3d:focus {
  outline: none;
}
.ContTituloFiltros{
    display: flex;
    margin-top: 0px;
    justify-content: center;
}
                   
                ` }
    </style>

</div>
        )
    }
}
const mapStateToProps = state=>  {
  let regC =   state.RegContableReducer
  return {
    regC,
    state
  }
};

export default connect(mapStateToProps, null)(Croom);