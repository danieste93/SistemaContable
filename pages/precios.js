// 1) Imports
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import useUserRedux from '../components/useUserRedux';
import WhatsappButton from "../components/WhatsappButton";
import Head from "next/head";
import Pagos from "../components/sistemapagos/pagos";
import { updateUser } from '../reduxstore/actions/myact';

const plansData = {
  anual: [
    { name: 'PRO', price: 45, id: 'pro-anual' },
    { name: 'Plata', price: 115, id: 'plata-anual' },
    { name: 'ORO', price: 200, id: 'oro-anual' },
    { name: 'A MEDIDA', price: 500, id: 'amedida-anual' },
  ],
  mensual: [
    { name: 'PRO', price: 4.50, id: 'pro-mensual' },
    { name: 'Plata', price: 11.50, id: 'plata-mensual' },
    { name: 'ORO', price: 22.50, id: 'oro-mensual' },
    { name: 'A MEDIDA', price: 50, id: 'amedida-mensual' },
  ]
};

export default function Precios() {
  const dispatch = useDispatch();
  const user = useUserRedux();
  // 2) Estado de tema y toggles
  // Sincronizar scroll horizontal de ambas tablas en móvil
  useEffect(() => {
    if (window.innerWidth <= 600) {
      const tabla1 = document.getElementById('stickyPrecios');
      const tabla2 = document.getElementById('mainContent');
      if (tabla1 && tabla2) {
        const syncScroll = (e) => {
          if (e.target === tabla1) {
            tabla2.scrollLeft = tabla1.scrollLeft;
          } else {
            tabla1.scrollLeft = tabla2.scrollLeft;
          }
        };
        tabla1.addEventListener('scroll', syncScroll);
        tabla2.addEventListener('scroll', syncScroll);
        return () => {
          tabla1.removeEventListener('scroll', syncScroll);
          tabla2.removeEventListener('scroll', syncScroll);
        };
      }
    }
  }, []);
  const [isDark, setIsDark] = useState(false);
  const [showDarkToggle, setShowDarkToggle] = useState(true);
  const [showPagos, setShowPagos] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Efecto: leer tema guardado y aplicarlo
  useEffect(() => {
    const temaGuardado = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (temaGuardado === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Efecto: mostrar/ocultar botón flotante según scroll
  useEffect(() => {
    const handleScroll = () => setShowDarkToggle(window.scrollY < 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler: alternar tema claro/oscuro
  const alternarModoOscuro = () => {
    const nuevoTema = !isDark;
    setIsDark(nuevoTema);
    if (nuevoTema) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark-theme');
    }
  };

  // Handler para mostrar el modal de pagos
  const [showMembresiaModal, setShowMembresiaModal] = useState(false);
  const [membresiaMsg, setMembresiaMsg] = useState("");

  const handleCarritoClick = (planName, duration, price) => {
    // Depuración: mostrar el objeto user
    console.log('USER:', user);
    // Validación de membresía activa para usuarios logeados
    let expira;
    if (user && user.Fechas && user.Fechas.ExpiraMem) {
      expira = user.Fechas.ExpiraMem;
    } else if (user && user.ExpiraMem) {
      expira = user.ExpiraMem;
    }
    if (user && user.Membresia && ["PRO", "Premium", "Plata"].includes(user.Membresia)) {
      const expiraDate = expira ? new Date(expira) : null;
      const hoy = new Date();
      console.log('Membresia:', user.Membresia, 'ExpiraMem:', expira, 'expiraDate:', expiraDate, 'Hoy:', hoy);
      if (expiraDate && expiraDate > hoy) {
        setMembresiaMsg(
          <div style={{textAlign:'center',padding:'32px 18px',maxWidth:400,margin:'0 auto'}}>
            <img src="https://contaluxestaging-b86e9da05a14.herokuapp.com/static/logo1.png" alt="Logo Contaluxe" style={{width:80,marginBottom:18,borderRadius:12,boxShadow:'0 2px 8px #6366f144'}} />
            <h2 style={{color:'#6366f1',fontWeight:700,fontSize:'1.3em',marginBottom:12}}>¡Ya tienes una membresía activa!</h2>
            <p style={{fontSize:'1.08em',color:'#232323',marginBottom:10}}>
              Tu membresía <b style={{color:'#6366f1'}}>{user.Membresia}</b> está activa y caduca el <b style={{color:'#6366f1'}}>{expiraDate.toLocaleDateString()}</b>.<br/>
              Si deseas hacer un <b>upgrade</b> de tu membresía, comunícate con <a href="https://api.whatsapp.com/send/?phone=%2B593962124673&text=Hola%2C+quiero+consultar+por+upgrade+de+membresía&type=phone_number&app_absent=0" target="_blank" style={{color:'#6366f1',textDecoration:'underline'}}>soporte</a>.
            </p>
            <button onClick={()=>setShowMembresiaModal(false)} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:600,marginTop:18,cursor:'pointer',boxShadow:'0 2px 8px #6366f144'}}>Cerrar</button>
          </div>
        );
        setShowMembresiaModal(true);
        return;
      }
    }
    // Si no tiene membresía activa, puede avanzar
    setSelectedPlan({ name: planName, duration, price });
    setShowPagos(true);
  };

  const handlePlanConfirmed = (plan, user) => {
    // Confirmar el pago solo después de la facturación
    // Aquí podrías mostrar un modal de pago, redirigir, etc.
    // Por ahora solo mostramos el mensaje y cerramos el modal
    setTimeout(() => {
      setShowPagos(false);
      alert(`Procediendo al pago para el plan ${plan.name} (${plan.duration}) por $${plan.price}`);
    }, 300); // Pequeño delay para asegurar que el flujo de facturación termine
  }

  // 3) Secciones y acordeón (visual)
  const secciones = [
    'contable', 'registros', 'sri', 'inventario', 'punto-venta', 'tienda-online', 'almacenamiento'
  ];
  const [abiertas, setAbiertas] = useState(Object.fromEntries(secciones.map(s => [s, true])));
  const handleToggleSeccion = (id) => setAbiertas(prev => ({ ...prev, [id]: !prev[id] }));
  const handleToggleAll = (open) => setAbiertas(Object.fromEntries(secciones.map(s => [s, open])));

  function handleCotizarClick(plan) {
    window.open('https://api.whatsapp.com/send/?phone=%2B593962124673&text=Hola%2C+quiero+m%C3%A1s+informaci%C3%B3n+sobre+las+membres%C3%ADas+de+Activos.ec&type=phone_number&app_absent=0', '_blank');
  }

  useEffect(() => {
    // Si el usuario no está en Redux, intenta cargarlo desde localStorage o API
    if (!user) {
      const userLocal = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (userLocal) {
        try {
          const userObj = JSON.parse(userLocal);
          dispatch(updateUser(userObj));
        } catch (e) {}
      }
      // Si tienes una API, aquí podrías hacer la petición y luego dispatch(updateUser(apiUser))
    }

    // Si el usuario existe y tiene token, refresca datos desde API y actualiza Redux
    if (user && user.token) {
      const datos = {
        User: {
          DBname: user.DBname,
          Tipo: user.Tipo
        }
      };
      fetch('/api/refresh-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': user.token
        },
        body: JSON.stringify(datos)
      })
        .then(res => res.json())
        .then(response => {
          if (response && response.user) {
            dispatch(updateUser(response.user));
          }
        })
        .catch(() => {});
    }
  }, [user, dispatch]);

  return (
    <>
      <Head>
        <title>Membresías - Activos.ec</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <main>
        {/* Modal membresía activa */}
        {showMembresiaModal && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'#fff',borderRadius:18,boxShadow:'0 2px 18px #6366f188',padding:'0 0 24px 0',maxWidth:420,width:'90vw'}}>
              {membresiaMsg}
            </div>
          </div>
        )}
  {/* 4.1) Encabezado y botón tema */}
  <h1 style={{textAlign: 'center', fontSize: '2em', fontWeight: 700, margin: '80px 0 12px 0', lineHeight: 1.15}}>Elige tu Membresía</h1>
  <h2 style={{textAlign: 'center', fontSize: '1.15em', fontWeight: 500, margin: '0 0 28px 0', color: '#6366f1', lineHeight: 1.18}}>Descubre todas las funciones disponibles en cada plan</h2>

        {showDarkToggle && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: '0 0 12px 0' }}>
            <button className="dark-toggle" onClick={alternarModoOscuro} title="Cambiar modo claro/oscuro">
              <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
          </div>
        )}

        {/* 4.2) Tabla superior de precios (Anual/Mensual) */}
          <div className="tabla-scroll tabla-sticky" id="stickyPrecios" style={{margin: '32px 12px 0 12px', padding: '0 16px', maxWidth: '900px'}}>
            <div style={{ minWidth: '600px' }}>
              <table id="tablaPrecios">
                <thead>
                  <tr>
                    <th className="detalle">Precio Anual / Mensual</th>
                    <th className="libre">Libre</th>
                    <th className="profesional">PRO</th>
                    <th className="plata">Plata</th>
                    <th className="premiun">ORO</th>
                    <th className="personalizado">A MEDIDA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="titulo-seccion detalle fila-tipo">Anual</td>
                    <td className="libre centrado"><span className="precio">$0</span></td>
                    <td className="profesional centrado">
                      <span className="precio">$45</span><br />
                      <a className="btn-comprar" href="#" onClick={(e) => {e.preventDefault(); handleCarritoClick('PRO', 'Anual', 45)}}><i className="fas fa-shopping-cart"></i></a>
                    </td>
                    <td className="plata centrado">
                      <span className="precio">$115</span><br />
                      <a className="btn-comprar" href="#" onClick={(e) => {e.preventDefault(); handleCarritoClick('Plata', 'Anual', 115)}}><i className="fas fa-shopping-cart"></i></a>
                    </td>
                    <td className="premiun centrado">
                      <span className="precio">$200</span><br />
                      <a className="btn-comprar" href="#" onClick={(e) => {e.preventDefault(); handleCarritoClick('ORO', 'Anual', 200)}}><i className="fas fa-shopping-cart"></i></a>
                    </td>
                    <td className="personalizado centrado">
                      <a
                        className="btn-cotizar"
                        href="#"
                        onClick={(e) => {e.preventDefault(); handleCotizarClick('A MEDIDA')}}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          fontSize: '0.95em',
                          fontWeight: 700,
                          background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                          letterSpacing: 1,
                          transition: 'background 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                          marginTop: 4,
                          marginBottom: 2,
                          textShadow: '0 1px 4px rgba(25,118,210,0.10)',
                          textDecoration: 'none',
                          outline: 'none',
                          position: 'relative',
                          overflow: 'hidden',
                          minWidth: '70px',
                          maxWidth: '100px',
                          textAlign: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)'}
                      >
                        <i className="fas fa-comments" style={{marginRight:5, fontSize:'0.9em'}}></i>
                        Cotizar
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="titulo-seccion detalle fila-tipo">Mensual</td>
                    <td className="libre centrado"><span className="precio">$0</span></td>
                    <td className="profesional centrado">
                      <span className="precio">$4.50</span><br />
                      <a className="btn-comprar" href="#" onClick={(e) => {e.preventDefault(); handleCarritoClick('PRO', 'Mensual', 4.50)}}><i className="fas fa-shopping-cart"></i></a>
                    </td>
                    <td className="plata centrado">
                      <span className="precio">$11.50</span><br />
                      <a className="btn-comprar" href="#" onClick={(e) => {e.preventDefault(); handleCarritoClick('Plata', 'Mensual', 11.50)}}><i className="fas fa-shopping-cart"></i></a>
                    </td>
                    <td className="premiun centrado">
                      <span className="precio">$22.50</span><br />
                      <a className="btn-comprar" href="#" onClick={(e) => {e.preventDefault(); handleCarritoClick('ORO', 'Mensual', 22.50)}}><i className="fas fa-shopping-cart"></i></a>
                    </td>
                    <td className="personalizado centrado">
                      <a
                        className="btn-cotizar"
                        href="#"
                        onClick={(e) => {e.preventDefault(); handleCotizarClick('A MEDIDA')}}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          fontSize: '0.95em',
                          fontWeight: 700,
                          background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                          letterSpacing: 1,
                          transition: 'background 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                          marginTop: 4,
                          marginBottom: 2,
                          textShadow: '0 1px 4px rgba(25,118,210,0.10)',
                          textDecoration: 'none',
                          outline: 'none',
                          position: 'relative',
                          overflow: 'hidden',
                          minWidth: '70px',
                          maxWidth: '100px',
                          textAlign: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)'}
                      >
                        <i className="fas fa-comments" style={{marginRight:5, fontSize:'0.9em'}}></i>
                        Cotizar
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA a la página de firma electrónica */}
          <a href="/firma-electronica" className="free-button">SOLO Firma electrónica</a>

          <div className="acciones" style={{ marginTop: 40 }}>
            {/* 4.4) Controles globales del acordeón */}
            <button className="expandir" onClick={() => handleToggleAll(true)}>Expandir Todo</button>
            <button className="contraer" onClick={() => handleToggleAll(false)}>Contraer Todo</button>
          </div>

          {/* 4.5) Tabla principal de características por sección */}
          <div className="tabla-scroll main-content" id="mainContent" style={{margin: '32px 12px 0 12px', padding: '0 16px', maxWidth: '900px'}}>
            <div style={{ minWidth: '600px' }}>
              <table id="tablaPrincipal">
                <thead>
                  <tr>
                    <th className="detalle">Detalles</th>
                    <th className="libre">Libre</th>
                    <th className="profesional">PRO</th>
                    <th className="plata">Plata</th>
                    <th className="premiun">ORO</th>
                    <th className="personalizado">A MEDIDA</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sección: Sistema Contable */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('contable')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>Sistema Contable <span className="icono-acordeon">{abiertas['contable'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['contable'] && (<>
                    <tr><td className="detalle">Plan de cuentas</td>
                      <td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                    </tr>
                      <tr><td className="detalle">Creación de cuentas</td>
                        <td className="libre centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                        <td className="profesional centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                        <td className="plata centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                        <td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                        <td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                      </tr>
                    <tr><td className="detalle">Cuentas personalizables con fondo e iconos</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Cálculo de Liquidez</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Cálculo de Patrimonio</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Sistemas de permisos por tipo de usuario</td>
                      <td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td>
                      <td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                    </tr>
                    <tr><td className="detalle">Estadísticas</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Tipos de cuentas</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Bancos</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Tarjetas de crédito</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Cuentas por cobrar</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Cuentas por pagar</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Distribuidores</td>
                      <td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td>
                      <td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                    </tr>
                    <tr><td className="detalle">Trabajadores</td>
                      <td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td>
                      <td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                    </tr>
                    <tr><td className="detalle">Inventario</td>
                      <td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td>
                      <td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                      <td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td>
                    </tr>
                  </>)}

                  {/* Sección: Registros */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('registros')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>Registros <span className="icono-acordeon">{abiertas['registros'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['registros'] && (<>
                    <tr><td className="detalle">Gastos</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Ingresos</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Transferencias</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Registros Automáticos Repetitivos</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Registros Cuota</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Creación de Categorías</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Creación de Subcategorías</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Iconos en categoría personalizables</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">MiniCalculadora</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Subir fotos por cada registro</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Descargar registros por Excel</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Papelera de reciclaje</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Permisos por usuario</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Búsqueda avanzada</td><td className="libre centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                  </>)}

                  {/* Sección: SRI */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('sri')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>SRI <span className="icono-acordeon">{abiertas['sri'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['sri'] && (<>
                    <tr><td className="detalle">Archivo p12 1 año</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Archivo p12 1-6 meses</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Facturación electrónica</td>
                      <td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td>
                      <td className="profesional centrado"><span style={{color:'#1976d2', fontWeight:'bold', fontSize:'1.1em', display:'inline-block'}}>$20.000</span></td>
                      <td className="plata centrado"><span style={{color:'#1976d2', fontWeight:'bold', fontSize:'1.1em', display:'inline-block'}}>$20.000</span></td>
                      <td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                      <td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td>
                    </tr>
                    <tr><td className="detalle">Nota de crédito</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="plata centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td></tr>
                    <tr><td className="detalle">Guías de remisión</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="plata centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td></tr>
                    <tr><td className="detalle">Notas de débito</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="plata centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td></tr>
                    <tr><td className="detalle">Declaración impuestos automática</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Declaración impuestos manual</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Declaración IVA automática</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Declaración IVA manual</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Envío de comprobantes correo corporativo</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">RIMPE negocios populares, emprendedores y régimen general</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                  </>)}

                  {/* Sección: Inventario */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('inventario')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>Inventario <span className="icono-acordeon">{abiertas['inventario'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['inventario'] && (<>
                    <tr><td className="detalle">Productos</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado">20</td><td className="plata centrado">200</td><td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td></tr>
                    <tr><td className="detalle">Servicios</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado">20</td><td className="plata centrado">200</td><td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td></tr>
                    <tr><td className="detalle">Categoría y subcategoría ítems</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Compras automáticas con XML</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Compras masivas</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Reporte de inventario</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Rastreo de productos</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Descarga inventario en Excel</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Sistema impresión código de barras</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Kardex</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Ventas</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Listado de ventas</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Listado de compras</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Ventas por clientes</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Ventas por producto</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Cálculo de ganancias netas por venta</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Usuarios trabajadores</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Número usuarios trabajadores</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado">1</td><td className="plata centrado">3</td><td className="premiun centrado">5</td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Clientes, ingreso masivo y descarga total</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                  </>)}

                  {/* Sección: Punto de venta */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('punto-venta')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>Punto de Venta <span className="icono-acordeon">{abiertas['punto-venta'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['punto-venta'] && (<>
                    <tr><td className="detalle">Punto de venta</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="plata centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="premiun centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Pago Lector de tarjetas física</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Bodegas</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado">2</td><td className="premiun centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td><td className="personalizado centrado"><span style={{color:'green', fontSize:'1.4em', fontWeight:'bold', display:'inline-block'}}>∞</span></td></tr>
                    <tr><td className="detalle">Punto de venta Offline</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                  </>)}

                  {/* Sección: Tienda online */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('tienda-online')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>Tienda Online <span className="icono-acordeon">{abiertas['tienda-online'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['tienda-online'] && (<>
                    <tr><td className="detalle">Productos sincronizados con inventario</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Editor página web para productos y blogs</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Pago con tarjetas de crédito/débito</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Dominio personalizado</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Sistema de clientes</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Estrategias marketing automatizadas</td><td className="libre centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="profesional centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="plata centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="premiun centrado"><span style={{color:'red', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✘</span></td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                  </>)}

                  {/* Sección: Almacenamiento */}
                  <tr className="seccion-titulo titulo-seccion" onClick={() => handleToggleSeccion('almacenamiento')} style={{cursor:'pointer'}}>
                    <td colSpan={6} className="detalle" style={{textAlign:'center'}}>Almacenamiento <span className="icono-acordeon">{abiertas['almacenamiento'] ? '▼' : '▶'}</span></td>
                  </tr>
                  {abiertas['almacenamiento'] && (<>
                    <tr><td className="detalle">Base de datos</td><td className="libre centrado">100 MB</td><td className="profesional centrado">150 MB</td><td className="plata centrado">250 MB</td><td className="premiun centrado">500 MB</td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                    <tr><td className="detalle">Multimedia</td><td className="libre centrado">500 Mb</td><td className="profesional centrado">1 Gb</td><td className="plata centrado">5 Gb</td><td className="premiun centrado">15 Gb</td><td className="personalizado centrado"><span style={{color:'green', fontWeight:'bold', fontSize:'1.2em', display:'inline-block'}}>✔</span></td></tr>
                  </>)}
                </tbody>
              </table>
            </div>
          </div>
        {/* Modal de pagos minimalista */}
        {showPagos && <Pagos
            initialPlan={selectedPlan}
            plansData={plansData}
            onPlanConfirmed={handlePlanConfirmed}
            onClose={() => setShowPagos(false)}
        />}
        {/* Botón flotante de WhatsApp */}
        <WhatsappButton phone="+593962124673" message="Hola, quiero más información sobre las membresías de Activos.ec" title="Contáctanos por WhatsApp" />
      </main>

      {/* Mensaje flotante de firma electrónica */}
      <div className="firma-flotante">
        <span className="icono-certificado">
          <i className="fas fa-certificate"></i>
        </span>
        <span className="texto-firma">Todos los planes anuales, incluyen <b>firma electrónica</b>!</span>
      </div>
      <style jsx>{`
            .subtitulo-precios {
              font-size: 1.18em;
              font-weight: 600;
              color: #6366f1;
              margin: 0 auto 32px auto;
              text-align: center;
              letter-spacing: 1.2px;
              font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
              text-shadow: 0 2px 12px #6366f144, 0 1px 0 #fff;
              transition: all 0.2s;
              max-width: 98vw;
              padding: 0;
            }
            .dark-theme .subtitulo-precios {
              color: #a5b4fc;
              text-shadow: 0 2px 12px #6366f188, 0 1px 0 #23232a;
            }
            @media (max-width: 600px) {
                .container {
                  max-width: 700px;
                  padding-left: 12px;
                  padding-right: 12px;
                  margin-inline: auto;
                  box-sizing: border-box;
                }
              .dark-toggle {
                top: 54px !important;
                right: 10px !important;
                z-index: 99999;
              }
              .titulo-minimalista {
                font-size: 1.25em;
                padding: 12px 10px 10px 10px;
                max-width: 98vw;
                border-radius: 12px;
              }
              .titulo-minimalista::after {
                height: 6px;
                opacity: 0.28;
              }
            }
            @media (max-width: 600px) {
                .titulo-minimalista {
                  font-size: 1.15em;
                  padding: 12px 4vw 10px 4vw;
                  max-width: 90vw;
                  margin-left: 4vw;
                  margin-right: 4vw;
                  border-radius: 12px;
                }
              .titulo-minimalista::after {
                height: 6px;
                opacity: 0.28;
              }
            }
            .titulo-minimalista {
              font-size: 2.1em;
              font-weight: 700;
              color: #232323;
              background: #fff;
              border-radius: 18px;
              padding: 18px 28px 14px 28px;
              border: 1.5px solid #e5e7eb;
              box-shadow: 0 2px 12px 0 #00000014;
              text-align: center;
              margin: 36px auto 28px auto;
              letter-spacing: 0.8px;
              line-height: 1.13;
              font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
              width: 100%;
              max-width: 480px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              overflow: hidden;
              border-bottom: 2px solid #e5e7eb;
            }
            .titulo-minimalista::after {
              content: "";
              position: absolute;
              left: 0; right: 0; bottom: 0;
              height: 8px;
              background: linear-gradient(90deg, #8b5cf6, #38bdf8, #8b5cf6);
              opacity: 0.18;
              z-index: 1;
              animation: gradmove 3.5s linear infinite;
            }
            @keyframes gradmove {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
            .dark-theme .titulo-minimalista {
              color: #e5e7eb;
              background: #18181b;
              border-color: #23232a;
              box-shadow: 0 2px 12px 0 #00000066;
            }
            .dark-theme .titulo-minimalista::after {
              background: linear-gradient(90deg, #6366f1, #38bdf8, #6366f1);
              opacity: 0.32;
            }
        .firma-flotante {
          position: fixed;
          left: 16px;
          bottom: 16px;
          background: linear-gradient(135deg, #8b5cf6 0%, #25d366 100%);
          color: #fff;
          border-radius: 28px;
          box-shadow: 0 4px 18px rgba(139,92,246,0.18);
          padding: 10px 14px 10px 12px;
          font-size: 1.05rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          z-index: 1201;
          gap: 10px;
          animation: fadeinFirma 1.2s;
          max-width: 80vw;
          min-width: 120px;
          flex-wrap: wrap;
          word-break: break-word;
        }
        .icono-certificado {
          font-size: 1.5em;
          color: #ffe066;
          background: rgba(255,255,255,0.12);
          border-radius: 50%;
          padding: 6px;
          box-shadow: 0 2px 8px rgba(25,118,210,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .texto-firma b {
          color: #ffe066;
          font-weight: 700;
        }
        @media (max-width: 600px) {
          .firma-flotante {
            left: 6px;
            bottom: 10px;
            font-size: 0.92rem;
            padding: 7px 7vw 7px 8px;
            max-width: 50vw;
            min-width: 80px;
            border-radius: 18px;
            flex-wrap: wrap;
            word-break: break-word;
          }
          .icono-certificado {
            font-size: 1.1em;
            padding: 4px;
          }
        }
        @keyframes fadeinFirma {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 5) Estilos (styled-jsx) */}
      <style jsx global>{`
        /* Variables y tipografía base */
        :root { --detalle-ancho: 180px; --columna-ancho: 80px; }
        body { font-family: 'Inter', sans-serif; background-color: #ffffff; margin: 0; padding: 0; color: #111827; transition: background-color 0.3s ease, color 0.3s ease; }
        h1, h2 { text-align: center; margin: 0 auto 20px auto; padding: 0 10px; }
        h1 { font-size: 1.8em; color: #111827; }
        body.dark-theme h1 { border: 2px solid #fff; border-radius: 18px; padding: 10px 18px; color: #fff; background: rgba(24,24,24,0.7); display: flex; justify-content: center; align-items: center; margin-left: auto; margin-right: auto; width: fit-content; }
        h2 { font-size: 1em; color: #6b7280; }

        /* Acciones globales */
        .acciones { text-align: center; margin: 10px 0 20px; display: flex; justify-content: center; gap: 10px; }
        .acciones button { min-width: 90px; background-color: #8b5cf6; color: white; border: none; padding: 6px 12px; margin: 0; cursor: pointer; border-radius: 20px; font-size: 0.85em; transition: background-color 0.3s ease, color 0.3s ease; box-shadow: 0 2px 6px rgba(139,92,246,0.08); }
        .acciones .expandir { background-color: #a78bfa; color: #fff; border: 1.5px solid #8b5cf6; }
        .acciones .expandir:hover { background-color: #8b5cf6; color: #fff; border-color: #7c3aed; }
        .acciones .contraer { background-color: #f3e8ff; color: #8b5cf6; border: 1.5px solid #8b5cf6; }
        .acciones .contraer:hover { background-color: #ede9fe; color: #7c3aed; border-color: #7c3aed; }

        /* Scroll horizontal para tablas anchas */
        .tabla-scroll { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tabla-scroll > div { min-width: 600px; }

        /* Tabla base */
        table { width: 100%; max-width: 100%; margin: 20px auto; border-collapse: collapse; background-color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 20px; overflow: hidden; font-size: 14px; }
        th, td { border: 1px solid #e5e7eb; padding: 10px 8px; text-align: center; min-width: var(--columna-ancho); max-width: var(--columna-ancho); white-space: nowrap; transition: all 0.3s ease; }
        th.detalle, td.detalle { min-width: var(--detalle-ancho); max-width: var(--detalle-ancho); white-space: normal; word-wrap: break-word; text-align: left; font-weight: bold; background-color: #8b5cf6; color: white; }
        th { background-color: #8b5cf6; color: white; font-weight: 600; text-transform: uppercase; }
        .titulo-seccion.fila-tipo { background-color: #8b5cf6 !important; color: white !important; font-weight: bold; text-align: center; }
        .titulo-seccion { background-color: white !important; font-weight: bold; text-align: left; font-size: 1em; color: #2c3e50; cursor: pointer; user-select: none; }
        .icono-acordeon { float: right; font-weight: bold; color: #facc15; transition: transform 0.3s ease; }

        /* Iconos semánticos */
        .visto::after { content: "\u2714"; color: green; font-weight: bold; display: inline-block; }
        .no::after { content: "\u2718"; color: red; font-weight: bold; display: inline-block; }
        .ilimitado::after { content: "\u221e"; color: green; font-size: 1.4em; display: inline-block; }
        .precio { font-size: 1.2em; font-weight: bold; }

        /* Botón comprar (placeholder) */
        .btn-comprar, .btn-registrate { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background-color: #3b82f6; color: white; border-radius: 50%; text-decoration: none; font-size: 16px; transition: background 0.3s ease; }
        .btn-comprar:hover, .btn-registrate:hover { background-color: #2563eb; }

        tr:nth-child(even) { background-color: #f9fafb; }
        .centrado { text-align: center; }

        /* Tabla superior sticky */
        .tabla-sticky { position: sticky; top: 80px; width: 100%; z-index: 999; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s ease, opacity 0.3s ease; }
        .tabla-sticky table { width: 100%; max-width: 100%; margin: 0 auto; border-radius: 20px; box-shadow: none; }
        .main-content { margin-top: 0; transition: margin-top 0.3s ease; }

        /* CTA Firmas */
        .free-button { display: block; background-color: rgb(255, 0, 170); color: white; padding: 14px 20px; border-radius: 30px; text-decoration: none; font-weight: 600; text-align: center; margin: 20px auto; font-size: 16px; max-width: 240px; transition: background 0.3s ease; }
        .free-button:hover { background-color: #ff33cc; }

        /* Botón flotante de tema */
        .dark-toggle { position: fixed; top: 100px; right: 20px; z-index: 9999; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(139,92,246,0.3); border: 2px solid rgba(255, 255, 255, 0.2); }
        .dark-toggle:hover { background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); transform: scale(1.1); box-shadow: 0 6px 24px rgba(139, 92, 246, 0.5); }

        /* Responsive móvil */
        @media screen and (max-width: 600px) {
            .tabla-scroll {
              width: 100vw;
              box-sizing: border-box;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              padding-left: 12px;
              padding-right: 12px;
            }
            .tabla-scroll > div {
              width: 100%;
              max-width: 700px;
              min-width: 0;
            }
            table {
              width: 100%;
              max-width: 700px;
              min-width: 0;
              font-size: 12px;
              table-layout: fixed;
            }
          th, td { padding: 8px 6px; min-width: 80px; text-align: center; }
          th.detalle, td.detalle { min-width: 160px !important; white-space: normal; padding: 10px; text-align: left; }
          .btn-comprar, .btn-registrate { width: 30px; height: 30px; font-size: 14px; }
          .acciones button { font-size: 0.8em; padding: 6px 12px; }
        }

        /* Tema oscuro */
        body.dark-theme { background: #181818 !important; color: #f1f1f1 !important; }
        body.dark-theme .container, body.dark-theme .precios-pagina { background: #232323 !important; color: #f1f1f1 !important; }
        body.dark-theme table, body.dark-theme .tabla-precios, body.dark-theme .tabla-scroll, body.dark-theme .main-content { background: #232323 !important; color: #f1f1f1 !important; }
        body.dark-theme th, body.dark-theme td { background: #232323 !important; color: #f1f1f1 !important; border-color: #333 !important; }
        body.dark-theme .precio-numero, body.dark-theme .precio { color: #ffe066 !important; }
        body.dark-theme .btn-circular, body.dark-theme .btn-comprar { background: #333 !important; color: #ffe066 !important; border: 1px solid #ffe066 !important; }
        body.dark-theme .free-button { background: #333 !important; color: #ffe066 !important; border: 1px solid #ffe066 !important; }
        body.dark-theme .dark-toggle { background: #232323 !important; color: #ffe066 !important; }
      `}</style>
    </>
  );
}