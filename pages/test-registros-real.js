import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWebSocket } from '../utils/useWebSocket';
import { addRegs, getcuentas, getcats } from '../reduxstore/actions/regcont';

export default function TestRegistrosReal() {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.userReducer);
  const registrosRedux = useSelector(state => state.RegContableReducer?.Regs || []);
  const cuentasRedux = useSelector(state => state.RegContableReducer?.Cuentas || []);
  const categoriasRedux = useSelector(state => state.RegContableReducer?.Cats || []);
  
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : false);
  const [registroLocal, setRegistroLocal] = useState({
    concepto: '',
    monto: '',
    tipo: 'Ingreso'
  });
  const [cuentasDisponibles, setCuentasDisponibles] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Usuario ID del Redux
  const userId = userState?.update?.usuario?.user?._id;
  const userToken = userState?.update?.usuario?.token;
  const dbName = userState?.update?.usuario?.user?.DBname;

  // Hook WebSocket para recibir sincronización
  const { isConnected } = useWebSocket(userId, handleRemoteDataSync);

  // Función para manejar datos sincronizados desde otros dispositivos
  function handleRemoteDataSync(remoteData) {
    console.log('🔄 Datos sincronizados desde otro dispositivo:', remoteData);
    
    if (remoteData.action === 'save' && remoteData.collection === 'registros') {
      // Agregar el registro sincronizado a Redux
      dispatch(addRegs([remoteData.data]));
      
      // Mostrar notificación visual
      showNotification('📡 Nuevo registro sincronizado desde otro dispositivo');
    }
  }

  // Función para mostrar notificaciones
  const showNotification = (message) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Sistema Contable', {
          body: message,
          icon: '/assets/logo1.png'
        });
      }
    }
    
    // También mostrar en consola
    console.log('🔔', message);
  };

  // Detectar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Solicitar permisos de notificación
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Cargar cuentas y categorías cuando el usuario esté disponible
  useEffect(() => {
    if (userId && userToken && dbName) {
      cargarCuentasYCategorias();
    }
  }, [userId, userToken, dbName]);

  // Función para cargar cuentas y categorías reales
  const cargarCuentasYCategorias = async () => {
    try {
      setCargandoDatos(true);
      
      const datos = {
        User: {
          DBname: dbName,
          Tipo: userState.update.usuario.user.Tipo
        }
      };

      const response = await fetch('/cuentas/getMainData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': userToken
        },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (result.status === 'Ok') {
        console.log('✅ Datos del sistema cargados:', result);
        
        // Guardar cuentas disponibles
        if (result.cuentasHabiles && result.cuentasHabiles.length > 0) {
          setCuentasDisponibles(result.cuentasHabiles);
          setCuentaSeleccionada(result.cuentasHabiles[0]); // Seleccionar la primera por defecto
          dispatch(getcuentas(result.cuentasHabiles)); // Actualizar Redux
        }

        // Guardar categorías disponibles
        if (result.catHabiles && result.catHabiles.length > 0) {
          setCategoriasDisponibles(result.catHabiles);
          setCategoriaSeleccionada(result.catHabiles[0]); // Seleccionar la primera por defecto
          dispatch(getcats(result.catHabiles)); // Actualizar Redux
        }

        setCargandoDatos(false);
      } else {
        console.error('❌ Error cargando datos del sistema:', result);
        setCargandoDatos(false);
      }
    } catch (error) {
      console.error('❌ Error de red cargando datos:', error);
      setCargandoDatos(false);
    }
  };

  // Función para agregar registro usando la API real
  const agregarRegistroReal = async () => {
    if (!registroLocal.concepto.trim() || !registroLocal.monto || !userId || !userToken) {
      alert('Por favor completa todos los campos y asegúrate de estar logueado');
      return;
    }

    if (!cuentaSeleccionada || !categoriaSeleccionada) {
      alert('No hay cuentas o categorías disponibles. Cargar datos del sistema primero.');
      return;
    }

    const datosRegistro = {
      Accion: registroLocal.tipo,
      Tiempo: new Date().getTime(),
      Nota: registroLocal.concepto,
      Descripcion: registroLocal.concepto,
      Importe: parseFloat(registroLocal.monto),
      urlImg: [],
      Valrep: 'No',
      TipoRep: 'No',
      CuentaSelect: {
        _id: cuentaSeleccionada._id,
        NombreC: cuentaSeleccionada.NombreC,
        DineroActual: cuentaSeleccionada.DineroActual
      },
      CatSelect: {
        idCat: categoriaSeleccionada.idCat || categoriaSeleccionada._id,
        nombreCat: categoriaSeleccionada.nombreCat,
        urlIcono: categoriaSeleccionada.urlIcono || 'default-icon',
        _id: categoriaSeleccionada._id
      },
      SubCatSelect: categoriaSeleccionada.subCats?.[0]?.nombreSubCat || 'General',
      Usuario: {
        DBname: dbName,
        Usuario: userState.update.usuario.user.Usuario,
        _id: userId,
        Tipo: userState.update.usuario.user.Tipo,
      }
    };

    console.log('📝 Enviando registro a API:', datosRegistro);

    try {
      const response = await fetch('/cuentas/addreg', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': userToken
        },
        body: JSON.stringify(datosRegistro)
      });

      const result = await response.json();

      if (result.status === 'Ok') {
        console.log('✅ Registro creado exitosamente:', result);
        
        // Actualizar Redux local
        dispatch(addRegs(result.regCreate));
        
        // Limpiar formulario
        setRegistroLocal({
          concepto: '',
          monto: '',
          tipo: 'Ingreso'
        });

        showNotification('✅ Registro agregado exitosamente');
      } else {
        console.error('❌ Error del servidor:', result);
        alert('Error: ' + (result.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      alert('Error de conexión. El registro se guardará cuando vuelva la conexión.');
    }
  };

  // Función para generar registro de prueba rápido
  const generarRegistroPrueba = () => {
    const conceptos = [
      'Venta de productos',
      'Compra de materiales', 
      'Pago de servicios',
      'Ingreso por servicios',
      'Gasto de transporte'
    ];
    
    setRegistroLocal({
      concepto: conceptos[Math.floor(Math.random() * conceptos.length)],
      monto: (Math.random() * 1000 + 10).toFixed(2),
      tipo: Math.random() > 0.5 ? 'Ingreso' : 'Gasto'
    });
  };

  if (!userId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⚠️ No hay usuario logueado</h2>
        <p>Por favor inicia sesión para usar el sistema de registros contables</p>
        <a href="/ingreso" style={{ 
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Ir al Login
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📊 Sistema de Registros Contables en Tiempo Real</h1>
      <p>Usuario: <strong>{userState.update.usuario.user.Usuario}</strong></p>
      
      {/* Panel de estado */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px' 
      }}>
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: isOnline ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isOnline ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <strong>Internet:</strong> {isOnline ? 'Conectado ✅' : 'Desconectado ❌'}
        </div>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <strong>WebSocket:</strong> {isConnected ? 'Conectado ✅' : 'Desconectado ❌'}
        </div>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: cargandoDatos ? '#fff3cd' : '#d4edda',
          border: `1px solid ${cargandoDatos ? '#ffeaa7' : '#c3e6cb'}`
        }}>
          <strong>Datos del Sistema:</strong> {cargandoDatos ? 'Cargando...' : 'Listos ✅'}
        </div>
        
        <div style={{ 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#e2e3e5',
          border: '1px solid #d6d8db'
        }}>
          <strong>Cuentas:</strong> {cuentasDisponibles.length} | <strong>Categorías:</strong> {categoriasDisponibles.length}
        </div>
      </div>

      {/* Formulario para agregar registros */}
      <div style={{ 
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>📝 Agregar Nuevo Registro Contable</h3>
        
        {cargandoDatos ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>⏳ Cargando cuentas y categorías del sistema...</p>
          </div>
        ) : (
          <>
            {/* Selectores de cuenta y categoría */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  🏦 Cuenta:
                </label>
                <select
                  value={cuentaSeleccionada?._id || ''}
                  onChange={(e) => {
                    const cuenta = cuentasDisponibles.find(c => c._id === e.target.value);
                    setCuentaSeleccionada(cuenta);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                >
                  {cuentasDisponibles.map(cuenta => (
                    <option key={cuenta._id} value={cuenta._id}>
                      {cuenta.NombreC} (${typeof cuenta.DineroActual === 'number' ? cuenta.DineroActual.toFixed(2) : '0.00'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  📂 Categoría:
                </label>
                <select
                  value={categoriaSeleccionada?._id || ''}
                  onChange={(e) => {
                    const categoria = categoriasDisponibles.find(c => c._id === e.target.value);
                    setCategoriaSeleccionada(categoria);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                >
                  {categoriasDisponibles.map(categoria => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.nombreCat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campos principales del registro */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <select
                value={registroLocal.tipo}
                onChange={(e) => setRegistroLocal({...registroLocal, tipo: e.target.value})}
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <option value="Ingreso">💰 Ingreso</option>
                <option value="Gasto">💸 Gasto</option>
              </select>
              
              <input
                type="text"
                placeholder="Concepto del registro..."
                value={registroLocal.concepto}
                onChange={(e) => setRegistroLocal({...registroLocal, concepto: e.target.value})}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              
              <input
                type="number"
                placeholder="Monto"
                value={registroLocal.monto}
                onChange={(e) => setRegistroLocal({...registroLocal, monto: e.target.value})}
                style={{
                  width: '120px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              
              <button
                onClick={agregarRegistroReal}
                disabled={!cuentaSeleccionada || !categoriaSeleccionada}
                style={{
                  padding: '8px 15px',
                  backgroundColor: (!cuentaSeleccionada || !categoriaSeleccionada) ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (!cuentaSeleccionada || !categoriaSeleccionada) ? 'not-allowed' : 'pointer'
                }}
              >
                💾 Guardar
              </button>
            </div>
            
            <button
              onClick={generarRegistroPrueba}
              style={{
                padding: '8px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🎲 Generar Registro de Prueba
            </button>
          </>
        )}
      </div>

      {/* Lista de registros desde Redux */}
      <div>
        <h3>📊 Registros en Redux ({registrosRedux.length})</h3>
        
        {registrosRedux.length === 0 ? (
          <div style={{ 
            padding: '20px',
            textAlign: 'center',
            color: '#6c757d',
            border: '2px dashed #dee2e6',
            borderRadius: '8px'
          }}>
            No hay registros en Redux. Agrega uno o abre esta página en otro navegador para ver la sincronización.
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {registrosRedux.slice(-10).reverse().map((registro, index) => (
              <div
                key={registro._id || registro.IdRegistro || index}
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{registro.Nota || registro.Descripcion}</strong>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                      {registro.Accion} - {new Date(registro.Tiempo).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      ID: {registro.IdRegistro || registro._id}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: registro.Accion === 'Ingreso' ? '#28a745' : '#dc3545'
                  }}>
                    {registro.Accion === 'Ingreso' ? '+' : '-'}${(parseFloat(registro.Importe) || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <h4>📋 Instrucciones de Prueba:</h4>
        <ol>
          <li>Asegúrate de estar logueado en el sistema</li>
          <li>Verifica que WebSocket esté "Conectado ✅"</li>
          <li>Agrega un registro usando el formulario</li>
          <li>Abre esta página en otra pestaña/navegador (con el mismo usuario)</li>
          <li>Agrega registros desde cualquier pestaña</li>
          <li>Observa cómo aparecen automáticamente en todas las pestañas 🚀</li>
        </ol>
        <p><strong>Nota:</strong> Los registros aparecen tanto en Redux como se sincronizan entre dispositivos en tiempo real.</p>
      </div>
    </div>
  );
}