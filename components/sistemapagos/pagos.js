import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logOut } from '../../reduxstore/actions/myact';
import { cleanData } from '../../reduxstore/actions/regcont';
import postal from 'postal';
import LoginGoogle from '../loginGoogle';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
}

export default function Pagos({ initialPlan, plansData, onPlanConfirmed, onClose }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState("email");
  const [facturacion, setFacturacion] = useState({
    Nombres: "",
    CedulaoRuc: "",
    Correo: "",
    Telefono: "",
    Direccion: ""
  });

  useEffect(() => {
    if (step === "facturacion") {
      setFacturacion({
        Nombres: loggedInUser?.DatosFacturacion?.Nombres || "",
        CedulaoRuc: loggedInUser?.DatosFacturacion?.CedulaoRuc || loggedInUser?.Factura?.ruc || "",
        Correo: loggedInUser?.DatosFacturacion?.Correo || loggedInUser?.Email || "",
        Telefono: loggedInUser?.DatosFacturacion?.Telefono || loggedInUser?.TelefonoContacto || loggedInUser?.Telefono || "",
        Direccion: loggedInUser?.DatosFacturacion?.Direccion || ""
      });
    }
  }, [loggedInUser, step]);
  const [facturacionError, setFacturacionError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(state => state.userReducer.update?.usuario?.user);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [duration, setDuration] = useState(initialPlan?.duration?.toLowerCase() || 'anual');

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [registerStep, setRegisterStep] = useState(0);
  const [regUsuario, setRegUsuario] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  // Estado para tipo de pago PayPal
  const [paypalType, setPaypalType] = useState("single");
  // Estado para mostrar opciones dentro de Paypal
  const [paypalStep, setPaypalStep] = useState("");

  // Mapeo de plan_id por membresía y duración
  const planIds = {
    "PRO año": "P-32L003119H586330UNCZERZQ",
    "PLATA año": "P-3YW90125FL705312YNCZERPA",
    "ORO año": "P-1YD87776CK155842ENCZEQ4Y",
    "PRO mes": "P-5HA862042A659263LNCZEQHI",
    "PLATA mes": "P-75359657YV9885601NCZEP7Y",
    "ORO mes": "P-6YK00835TW873845BNCZEPYQ"
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.Email) {
      setEmail(loggedInUser.Email);
      // Solo ir a planSelection si no hay plan seleccionado y no estamos en facturacion/transferencia
      if (step === "email" || step === "password" || step === "register") {
        setStep("planSelection");
      }
    } else {
      setStep("email");
    }
  }, [loggedInUser]);

  const handleBackendLogin = async (loginData) => {
  console.log("Backend Response:", loginData);
  setLoading(false);
  if (loginData.status === "Ok") {
    const { user, decodificado, token } = loginData.data;
    const usuarioPayload = { user, decodificado, token };
    let localstate = { userReducer: { update: { usuario: usuarioPayload } } };
    localStorage.setItem("state", JSON.stringify(localstate));
    localStorage.setItem("jwt_token", token);
    dispatch(cleanData());
    dispatch(logOut());
    dispatch(updateUser({ usuario: usuarioPayload }));
    postal.channel().publish('setTokenTimer', { message: decodificado });
    // Forzar paso a selección de plan tras login automático
    setTimeout(() => setStep("planSelection"), 100);
  } else {
    const errorMessage = loginData.message || "Error al iniciar sesión.";
    setLoginError(errorMessage);
    setEmailError(errorMessage);
  }
  }

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
        setLoading(true);
        const decoded = decodeJwt(credentialResponse.credential);
        if(decoded){
            const googledata = await fetch('/users/googleLogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(decoded),
              });
            const sendData = await googledata.json();
            handleBackendLogin(sendData);
        }
    },
    onError: () => console.log('One Tap Login Failed'),
    disabled: !!loggedInUser || step !== 'email'
  });

  const handleGoogleLogin = (response) => {
    setLoading(true);
    handleBackendLogin(response);
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/validar-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email })
      });
      const data = await res.json();
      if (data.existe) {
        setStep("password");
      } else {
        setStep("register");
      }
    } catch (err) {
      setEmailError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError("");
    setLoading(true);
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;
    try {
      const res = await fetch("/users/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: loginEmail.toLowerCase(), Contrasena: loginPassword })
      });
      const data = await res.json();
      handleBackendLogin(data);
    } catch (err) {
      setLoginError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerStep < 2) {
      setRegisterStep(registerStep + 1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          Usuario:regUsuario.trim().replace(" ", "-"),
               TelefonoContacto:regTelefono,
               Correo:email,
               Contrasena:regPassword,
               Imagen:"",
               RegistradoPor:"usuario",
               Confirmacion:false,
  
        })
      });
      const data = await res.json();
      console.log("Registro Response:", data);
      if (data.status === "Ok") {

        console.log("Usuario registrado y listo para login automático.");
      //  setRegisterSuccess(true);
        // Enviar correo de bienvenida
        try {
 console.log("yendo a enviar");
          await fetch("/correo/send-welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              nombre: regUsuario.trim().replace(" ", "-"),
            })
          });
        } catch (err) {
          console.error("Error enviando correo de bienvenida:", err);
        }
        // Auto-login after registration by calling handleLogin with fromRegister=true
  // Login automático usando los datos recién registrados
  handleLogin(null, email, regPassword);
      } else {
        setRegisterError(data.message || "Error al registrar usuario.");
        setLoading(false);
      }
    } catch (err) {
      setRegisterError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const renderStep = () => {
    const bancos = [
      {
        nombre: "Banco Pichincha",
        cuenta: "2201495697",
        titular: "Johnny Merizalde",
        ci: "1723048946",
        correo: "soporte@activos.ec"
      },
      {
        nombre: "Banco Pacífico",
        cuenta: "1055056202",
        titular: "Daniel Flor",
        ci: "1726365727001",
        telefono: "0962124673",
        correo: "soporte@activos.ec"
      },
      {
        nombre: "Banco Produbanco",
        cuenta: "12007130657",
        titular: "Daniel Flor",
        ci: "1726365727001",
        telefono: "0962124673",
        correo: "soporte@activos.ec"
      },
      {
        nombre: "Banco Internacional",
        cuenta: "808047021",
        titular: "Daniel Flor",
        ci: "1726365727001",
        telefono: "0962124673",
        correo: "soporte@activos.ec"
      },
      {
        nombre: "Banco del Austro",
        cuenta: "9102175",
        titular: "Daniel Flor",
        ci: "1726365727001",
        telefono: "0962124673",
        correo: "soporte@activos.ec"
      },
      {
        nombre: "Banco Bolivariano",
        cuenta: "5001640407",
        titular: "Daniel Flor",
        ci: "1726365727001",
        telefono: "0962124673",
        correo: "soporte@activos.ec"
      },
      {
        nombre: "Banco Guayaquil",
        cuenta: "21527046",
        titular: "Daniel Flor",
        ci: "1726365727001",
        telefono: "0962124673",
        correo: "soporte@activos.ec"
      }
    ];

    const [selectedBanco, setSelectedBanco] = useState(null);
    const [comprobante, setComprobante] = useState(null);
    const [comprobanteError, setComprobanteError] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleComprobanteUpload = async () => {
      if (!selectedBanco) {
        setComprobanteError("Selecciona un banco primero.");
        return;
      }
      if (!comprobante) {
        setComprobanteError("Sube el comprobante de transferencia.");
        return;
      }
      setComprobanteError("");
      setUploading(true);
      try {
  const formData = new FormData();
  formData.append("email", loggedInUser?.Email || email);
  formData.append("comprobante", comprobante);
  formData.append("duration", duration);
  formData.append("banco", selectedBanco?.nombre || "");
  formData.append("plan", selectedPlan?.name || "");
        const res = await fetch("/api/subir-comprobante-mem", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.status === "ok") {
          alert("¡Comprobante subido correctamente! Tu membresía ha sido activada. Inicia sesión nuevamente para disfrutar los beneficios.");
          // Limpiar datos y simular inicio de sesión
          dispatch(logOut());
          dispatch(cleanData());
          localStorage.removeItem("state");
          localStorage.removeItem("jwt_token");
          setTimeout(() => {
            window.location.href = "/ingreso";
          }, 1200);
        } else {
          setComprobanteError(data.error || "Error al subir comprobante");
        }
      } catch (err) {
        setComprobanteError("Error de conexión. Intenta de nuevo.");
      } finally {
        setUploading(false);
      }
    };

    switch (step) {
      case "planSelection":
        return (
          <div style={{maxWidth:400,margin:'0 auto',background:'#fff',borderRadius:20,padding:'32px 16px',boxSizing:'border-box',boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            <h2 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:8,color:'#1976d2'}}>Elige tu Plan</h2>
            <p className="pagos-subtitle" style={{fontSize:'1rem',color:'#718096',marginBottom:24}}>Selecciona la duración y el plan que mejor se adapte a ti.</p>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginBottom:32}}>
              <span style={{fontWeight:600,color:duration==='mensual'?'#1976d2':'#888',marginRight:12}}>Mensual</span>
              <label style={{position:'relative',display:'inline-block',width:56,height:28,cursor:'pointer'}}>
                <input type="checkbox" checked={duration==='anual'} onChange={()=>setDuration(duration==='mensual'?'anual':'mensual')} style={{opacity:0,width:0,height:0}} />
                <span style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:duration==='mensual'?'#e3f2fd':'#1976d2',borderRadius:14,transition:'background 0.3s'}}></span>
                <span style={{position:'absolute',top:3,left:duration==='mensual'?4:28,width:22,height:22,background:'#fff',borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',transition:'left 0.3s'}}></span>
              </label>
              <span style={{fontWeight:600,color:duration==='anual'?'#1976d2':'#888',marginLeft:12}}>Anual</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24,justifyContent:'center'}}>
              {plansData && plansData[duration] && plansData[duration]
  .filter(plan => plan.name?.toUpperCase() !== 'A MEDIDA')
  .map(plan => (
                  <div 
                    key={plan.id}
                    className={`plan-card ${selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan({ name: plan.name, duration: duration.charAt(0).toUpperCase() + duration.slice(1), price: plan.price })}
                    style={{
                      padding:'24px 12px',
                      border:'2px solid',
                      borderColor: plan.name?.toUpperCase() === 'ORO' ? '#FFD700' : (selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration ? '#1976d2' : '#e2e8f0'),
                      borderRadius:16,
                      cursor:'pointer',
                      background: selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration
                        ? 'linear-gradient(90deg,#e3f2fd 0%,#bbdefb 100%)'
                        : (plan.name?.toUpperCase() === 'ORO' ? 'linear-gradient(90deg,#fffbe6 0%,#fffde4 100%)':'#f7fafd'),
                      boxShadow: selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration
                        ? '0 4px 16px rgba(25,118,210,0.10)'
                        : (plan.name?.toUpperCase() === 'ORO' ? '0 4px 16px rgba(255,215,0,0.10)' : 'none'),
                      transition:'all 0.3s',
                      textAlign:'center',
                      fontWeight:600,
                      position:'relative',
                      outline:selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration ? '2px solid #1976d2' : 'none',
                      margin: undefined,
                      gridColumn: undefined,
                      maxWidth: undefined
                    }}
                  >
                    {plan.name?.toUpperCase() === 'ORO' && (
                      <div style={{position:'absolute',top:8,left:8,background:'#FFD700',color:'#fff',fontWeight:700,fontSize:12,padding:'2px 10px',borderRadius:8,boxShadow:'0 2px 8px rgba(255,215,0,0.10)'}}>Recomendado</div>
                    )}
                    <div style={{fontSize:'1.1rem',fontWeight:700,color:'#2d3748',marginBottom:8}}>{plan.name}</div>
                    <div style={{fontSize:'1.5rem',fontWeight:800,color:'#1976d2'}}>${plan.price}<span style={{fontSize:'0.9em',fontWeight:500,color:'#718096'}}>/{duration==='anual'?'año':'mes'}</span></div>
                    {selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration && (
                      <div style={{position:'absolute',top:8,right:8}}>
                        <svg width="24" height="24" fill="#1976d2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e3f2fd"/><path d="M9.5 13.5l2 2 4-4" stroke="#1976d2" strokeWidth="2" fill="none"/></svg>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <button type="button" className="pagos-btn confirm-btn" style={{width:'100%',padding:'14px 0',fontSize:18,fontWeight:700,background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',color:'#fff',border:'none',borderRadius:12,marginTop:12,boxShadow:'0 4px 16px rgba(25,118,210,0.12)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}} onClick={() => setStep("facturacion")}> 
              {`Continuar con ${selectedPlan.name} - $${selectedPlan.price}`}
            </button>
          </div>
        );
      case "facturacion":
        return (
          <div style={{maxWidth:400,width:'100%',margin:'0 auto',background:'#fff',borderRadius:20,padding:'32px 16px',boxSizing:'border-box',boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            <h2 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:8,color:'#1976d2'}}>Datos para Facturación</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              if (!facturacion.Nombres || !facturacion.CedulaoRuc || !facturacion.Correo || !facturacion.Direccion) {
                setFacturacionError("Completa todos los campos obligatorios.");
                return;
              }
              setFacturacionError("");
              setLoading(true);
              try {
                const emailToSend = loggedInUser?.Email || email;
                const res = await fetch("http://localhost:3000/api/actualizar-facturacion", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: emailToSend,
                    Nombres: facturacion.Nombres,
                    CedulaoRuc: facturacion.CedulaoRuc,
                    Correo: facturacion.Correo,
                    Telefono: facturacion.Telefono,
                    Direccion: facturacion.Direccion
                  })
                });
                const data = await res.json();
                if (data.status === "ok") {
                  if (data.user) {
                    dispatch(updateUser({ usuario: { user: data.user } }));
                  }
                  setStep("transferencia");
                } else {
                  setFacturacionError(data.message || "Error al guardar datos de facturación.");
                }
              } catch (err) {
                setFacturacionError("Error de conexión. Intenta de nuevo.");
              } finally {
                setLoading(false);
              }
            }}>
              <input
                type="text"
                className="pagos-input"
                placeholder="Nombres"
                value={facturacion.Nombres}
                onChange={e => {
                  let val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                  // Capitaliza la primera letra de cada palabra
                  val = val.replace(/\b(\w)/g, c => c.toUpperCase());
                  setFacturacion(f => ({ ...f, Nombres: val }));
                }}
                required
                style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}}
              />
              <input
                type="text"
                className="pagos-input"
                placeholder="Cédula o RUC"
                value={facturacion.CedulaoRuc}
                onChange={e => {
                  let val = e.target.value.replace(/[^0-9]/g, ""); // Solo números
                  if (val.length > 13) val = val.slice(0, 13); // Máximo 13 dígitos
                  setFacturacion(f => ({ ...f, CedulaoRuc: val }));
                }}
                required
                minLength={10}
                maxLength={13}
                style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}}
              />
              <input
                type="email"
                className="pagos-input"
                placeholder="Correo para Factura"
                value={facturacion.Correo}
                onChange={e => {
                  let val = e.target.value.replace(/\s/g, ""); // Elimina espacios
                  setFacturacion(f => ({ ...f, Correo: val }));
                }}
                required
                style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}}
              />
              <input
                type="tel"
                className="pagos-input"
                placeholder="Teléfono"
                value={facturacion.Telefono}
                onChange={e => {
                  let val = e.target.value.replace(/[^0-9+]/g, ""); // Solo números y +
                  // Solo un + al inicio
                  val = val.replace(/(?!^)[+]/g, "");
                  if (val.length > 15) val = val.slice(0, 15); // Máximo 15 dígitos
                  setFacturacion(f => ({ ...f, Telefono: val }));
                }}
                required
                minLength={7}
                maxLength={15}
                style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}}
              />
              <input type="text" className="pagos-input" placeholder="Dirección" value={facturacion.Direccion} onChange={e => setFacturacion(f => ({ ...f, Direccion: e.target.value }))} required style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}} />
              {facturacionError && <div className="pagos-error" style={{color:'#e53e3e',marginBottom:8}}>{facturacionError}</div>}
              <div style={{display:'flex',gap:12,marginTop:12}}>
                <button className="pagos-btn" type="button" style={{flex:1,padding:'13px 0',fontSize:16,fontWeight:600,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:12,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}} onClick={()=>setStep('planSelection')}>← Atrás</button>
                <button type="submit" className="pagos-btn confirm-btn" style={{flex:2,padding:'14px 0',fontSize:18,fontWeight:700,background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',color:'#fff',border:'none',borderRadius:12,boxShadow:'0 4px 16px rgba(25,118,210,0.12)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}} disabled={loading}>{loading ? "Guardando..." : "Guardar y Continuar"}</button>
              </div>
            </form>
          </div>
        );
      case "transferencia":
        return (
          <div style={{maxWidth:400,margin:'0 auto',background:'#fff',borderRadius:20,padding:'32px 16px',boxSizing:'border-box',boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            {/* Logo dinámico arriba del título */}
            {selectedBanco && (
              <div style={{textAlign:'center',marginBottom:16}}>
                {selectedBanco.nombre === 'Banco Pichincha' && (
                  <img src="https://play-lh.googleusercontent.com/Ma1NGNRR9qTl2N-TFuFFF2Htkk3vVWKmUh9b9C_lyIS6PxWkbKaAEz2o5cACGXI7lgc" alt="Banco Pichincha" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',background:'#fff',padding:8}} />
                )}
                {selectedBanco.nombre === 'Banco Pacífico' && (
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnuwOHSL0ynnMxg8ZidjwAUu7COeTKlFuDjw&s" alt="Banco Pacífico" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',background:'#fff',padding:8}} />
                )}
                {selectedBanco.nombre === 'Banco Produbanco' && (
                  <img src="https://play-lh.googleusercontent.com/Yi51-VuicWXIv3LhQs6pij1nZlf3ScIsIGkXRcZT4qLUGz_5u9mXTTzSKZ5etCY7tJg" alt="Banco Produbanco" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',background:'#fff',padding:8}} />
                )}
                {selectedBanco.nombre === 'Banco del Austro' && (
                  <img src="https://yt3.googleusercontent.com/r1hOPuWSeKB5NQY7Bj_7mrzisYyfLYP8U5xVmsJUGwGwMvwHVaSG4LNbM77DlcmBRTHbklI5EA=s900-c-k-c0x00ffffff-no-rj" alt="Banco del Austro" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',background:'#fff',padding:8}} />
                )}
              </div>
            )}
            <h2 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:8,color:'#1976d2'}}>Formas de Pago</h2>
            <div className="formas-pago-toggle" style={{display:'flex',justifyContent:'center',marginBottom:24,gap:8}}>
              <button className={step === "transferencia" ? "active" : ""} style={{flex:1,padding:'14px 0',border:'none',borderRadius:12,fontWeight:700,fontSize:16,color:step === "transferencia" ? '#fff' : '#1976d2',background:step === "transferencia" ? 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)' : '#e3f2fd',boxShadow:step === "transferencia" ? '0 4px 16px rgba(25,118,210,0.12)' : 'none',cursor:'pointer',transition:'background 0.2s, box-shadow 0.2s'}} onClick={()=>setStep("transferencia")}>Transferencia</button>
              <button className={step === "paypal" ? "active" : ""} style={{flex:1,padding:'14px 0',border:'none',borderRadius:12,fontWeight:700,fontSize:16,color:step === "paypal" ? '#fff' : '#1976d2',background:step === "paypal" ? 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)' : '#e3f2fd',boxShadow:step === "paypal" ? '0 4px 16px rgba(25,118,210,0.12)' : 'none',cursor:'pointer',transition:'background 0.2s, box-shadow 0.2s'}} onClick={()=>setStep("paypal")}>Paypal</button>
            </div>
            {step === "transferencia" && (
              <div style={{display:'flex',flexDirection:'column',gap:0}}>
                <div className="transferencia-section" style={{marginTop:12}}>
                  {/* Solo muestra el mensaje si no hay banco seleccionado */}
                  {!selectedBanco && (
                    <h3 style={{fontSize:'1.1rem',fontWeight:600,color:'#1976d2',marginBottom:12}}>Selecciona el banco</h3>
                  )}
                  {!selectedBanco ? (
                    <>
                      <div className="bancos-list-minimal" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18}}>
                        {bancos.map((banco, idx) => (
                          <div key={idx} className={`banco-min-card`} onClick={() => setSelectedBanco(banco)} style={{background:'#f7fafc',borderRadius:12,padding:16,textAlign:'center',cursor:'pointer',fontWeight:700,color:'#6366f1',border:'2px solid #e2e8f0',transition:'border 0.2s, box-shadow 0.2s'}}>
                            <span>{banco.nombre}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{marginTop:32}}>
                        <button className="pagos-btn" style={{width:'100%',padding:'13px 0',fontSize:16,fontWeight:600,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:12,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer',marginBottom:0}} onClick={()=>setStep("facturacion")}>← Atrás</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button className="pagos-btn" style={{marginBottom:16,padding:'10px 0',width:'100%',fontSize:16,fontWeight:600,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:10,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}} onClick={()=>setSelectedBanco(null)}>← Seleccionar otro banco</button>
                      <div className="banco-info-pro" style={{background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',padding:18,marginBottom:12,textAlign:'left',border:'2px solid #e3f2fd'}}>
                        <h4 style={{color:'#1976d2',marginBottom:8,fontSize:'1.1rem',fontWeight:700}}>{selectedBanco?.nombre || ''}</h4>
                        <div style={{marginBottom:4}}><strong>Cuenta de ahorros:</strong> {selectedBanco?.cuenta || ''}</div>
                        <div style={{marginBottom:4}}><strong>Titular:</strong> {selectedBanco?.titular || ''}</div>
                        <div style={{marginBottom:4}}><strong>CI:</strong> {selectedBanco?.ci || ''}</div>
                        {selectedBanco?.telefono && <div style={{marginBottom:4}}><strong>Teléfono:</strong> {selectedBanco.telefono}</div>}
                        <div style={{marginBottom:4}}><strong>Correo:</strong> {selectedBanco?.correo || ''}</div>
                        <div className="comprobante-upload" style={{marginTop:16}}>
                          <input type="file" accept="image/*,application/pdf" onChange={e => setComprobante(e.target.files[0])} style={{marginBottom:10,width:'100%',padding:'10px',borderRadius:10,border:'2px solid #e3f2fd',background:'#f7fafd',fontWeight:600}} />
                          {comprobanteError && <div className="pagos-error" style={{color:'#e53e3e',marginBottom:8}}>{comprobanteError}</div>}
                          <button className="pagos-btn confirm-btn" onClick={handleComprobanteUpload} disabled={uploading || !comprobante} style={{width:'100%',padding:'14px 0',fontSize:18,fontWeight:700,background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',color:'#fff',border:'none',borderRadius:12,boxShadow:'0 4px 16px rgba(25,118,210,0.12)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}}>{uploading ? "Subiendo..." : "Subir Comprobante"}</button>
                        </div>
                      </div>
                      <div style={{marginTop:32}}>
                        <button className="pagos-btn" style={{width:'100%',padding:'13px 0',fontSize:16,fontWeight:600,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:12,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer',marginBottom:0}} onClick={()=>setStep("facturacion")}>← Atrás</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case "paypal":
        return (
          <div style={{maxWidth:400,margin:'0 auto',background:'#fff',borderRadius:20,padding:'32px 16px',boxSizing:'border-box',boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            <div style={{textAlign:'center',marginBottom:24}}>
              <img src="https://play-lh.googleusercontent.com/iQ8f5plIFy9rrY46Q2TNRwq_8nCvh9LZVwytqMBpOEcfnIU3vTkICQ6L1-RInWS93oQg" alt="PayPal" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',background:'#fff',padding:8}} />
              <h2 style={{marginTop:12,fontWeight:700,color:'#1976d2',letterSpacing:1}}>Pagar con Paypal</h2>
            </div>
            {!paypalStep && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, gap:8 }}>
                  <button className="pagos-btn" style={{flex:1,padding:'14px 0',fontSize:16,fontWeight:700,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:12,boxShadow:'0 4px 16px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer',marginRight:8}} onClick={() => setPaypalStep("single")}>Pago único</button>
                  <button className="pagos-btn" style={{flex:1,padding:'14px 0',fontSize:16,fontWeight:700,background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',color:'#fff',border:'none',borderRadius:12,boxShadow:'0 4px 16px rgba(25,118,210,0.12)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}} onClick={() => setPaypalStep("auto")}>Suscripción</button>
                </div>
                <div style={{marginTop:32}}>
                  <button className="pagos-btn" style={{width:'100%',padding:'13px 0',fontSize:16,fontWeight:600,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:12,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer',marginBottom:0}} onClick={()=>setStep("transferencia")}>← Atrás</button>
                </div>
              </>
            )}
            {paypalStep === "single" && (
              <div style={{margin:'0 0 24px 0',padding:'16px',background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',borderRadius:12,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',color:'#1976d2',fontWeight:600,fontSize:'1rem',textAlign:'center',letterSpacing:0.5}}>
                <span>Este pago único <strong>no se renueva automáticamente</strong>. Si deseas continuar el servicio después del periodo, deberás realizar un nuevo pago manualmente.</span>
              </div>
            )}
            {paypalStep === "auto" && (
              <div style={{margin:'0 0 24px 0',padding:'16px',background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',borderRadius:12,boxShadow:'0 2px 8px rgba(25,118,210,0.08)',color:'#1976d2',fontWeight:600,fontSize:'1rem',textAlign:'center',letterSpacing:0.5}}>
                <span>Este pago es una <strong>membresía que se renueva automáticamente</strong> cada periodo. Puedes cancelar la suscripción desde tu cuenta de Paypal o en <a href="https://activos.ec/configuracion-general" target="_blank" rel="noopener noreferrer" style={{color:'#1565c0',textDecoration:'underline'}}>activos.ec/configuracion-general</a>.</span>
              </div>
            )}
            {(paypalStep === "single" || paypalStep === "auto") && (
              <div style={{marginBottom:24}}>
                <PayPalScriptProvider options={{ "client-id": "AbsN1lxgxK9UDzodAY0RwHG-N2dZIBTdWJiy7m2dJJjVtDrw4aguKvSp9G8MmEARVhu4jaquxAhesqeU", currency: "USD", vault: true }}>
                  {paypalStep === "single" && (
                    <PayPalButtons
                      style={{ shape: 'pill', color: 'blue', layout: 'vertical', label: 'pay' }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: selectedPlan?.price?.toString() || "0"
                            },
                            description: `Membresía ${selectedPlan?.name} (${duration}) Activos.ec`
                          }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        const details = await actions.order.capture();
                        // Activar membresía en backend
                        try {
                          const res = await fetch("/api/activar-membresia-paypal", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: loggedInUser?.Email || email,
                              plan: selectedPlan?.name,
                              duration,
                              paypalOrderId: details.id,
                              payer: details.payer
                            })
                          });
                          const result = await res.json();
                          if (result.status === "ok") {
                            alert("¡Membresía activada! Tu membresía ha sido activada correctamente. Inicia sesión para disfrutar los beneficios.");
                            window.location.href = "/ingreso";
                          } else {
                            alert(result.error || "Error al activar membresía");
                          }
                        } catch (err) {
                          alert("Error de conexión. Intenta de nuevo.");
                        }
                      }}
                      onError={(err) => {
                        alert("Error en el pago con Paypal: " + err);
                      }}
                    />
                  )}
                  {paypalStep === "auto" && (
                    <>
                      {/*
                      <div style={{marginBottom:8, color:'#1976d2', fontWeight:'bold',fontSize:15}}>
                        Plan seleccionado: <span style={{color:'#222'}}>{selectedPlan?.name} {duration}</span><br/>
                        {(() => {
                          // Normalizar nombre y duración para el mapeo
                          // Normalizar duración: 'anual' -> 'año'
                          let normDuration = duration?.trim().toLowerCase();
                          if (normDuration === 'anual') normDuration = 'año';
                          if (normDuration === 'mensual') normDuration = 'mes';
                          const planKey = `${selectedPlan?.name?.trim().toUpperCase()} ${normDuration}`;
                          return (
                            <>
                              plan_id: <span style={{color:'#e53e3e'}}>{planIds[planKey] || 'NO ENCONTRADO'}</span>
                              <br/>
                              <span style={{fontSize:'0.9em',color:'#888'}}>Clave usada: {planKey}</span>
                            </>
                          );
                        })()}
                      </div>
                      */}
                      <PayPalButtons
                        style={{ shape: 'pill', color: 'black', layout: 'vertical', label: 'subscribe' }}
                        createSubscription={(data, actions) => {
                          // Selecciona el plan_id según el plan y duración elegidos
                          // Normalizar nombre y duración para el mapeo
                          // Normalizar duración: 'anual' -> 'año'
                          let normDuration = duration?.trim().toLowerCase();
                          if (normDuration === 'anual') normDuration = 'año';
                          if (normDuration === 'mensual') normDuration = 'mes';
                          const key = `${selectedPlan?.name?.trim().toUpperCase()} ${normDuration}`;
                          console.log('PayPal plan_id:', planIds[key], 'Plan:', key);
                          if (!planIds[key]) {
                            alert(`No existe plan_id para la membresía: ${key}`);
                            return;
                          }
                          return actions.subscription.create({
                            plan_id: planIds[key]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          alert(data.subscriptionID);
                          // Simula el mismo flujo que pago único
                          try {
                            const res = await fetch("/api/activar-membresia-paypal", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                email: loggedInUser?.Email || email,
                                plan: selectedPlan?.name,
                                duration,
                                paypalOrderId: data.subscriptionID,
                                payer: null,
                                tipo: "suscripcion"
                              })
                            });
                            const result = await res.json();
                            if (result.status === "ok") {
                              alert("¡Membresía activada! Tu membresía ha sido activada correctamente. Inicia sesión para disfrutar los beneficios.");
                              window.location.href = "/ingreso";
                            } else {
                              alert(result.error || "Error al activar membresía");
                            }
                          } catch (err) {
                            alert("Error de conexión. Intenta de nuevo.");
                          }
                        }}
                        onError={(err) => {
                          alert("Error en el pago con Paypal: " + err);
                        }}
                      />
                    </>
                  )}
                </PayPalScriptProvider>
                <button className="pagos-btn" style={{width:'100%',padding:'14px 0',fontSize:18,fontWeight:700,background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',color:'#1976d2',border:'none',borderRadius:12,boxShadow:'0 4px 16px rgba(25,118,210,0.08)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer',marginTop:8}} onClick={()=>setPaypalStep("")}>← Atrás</button>
              </div>
            )}
          </div>
        );
      case "email":
        return (
          <div className="pagos-login-container" style={{maxWidth:400,width:'100%',margin:'32px auto',background:'#fff',borderRadius:16,padding:'32px 16px',boxSizing:'border-box',boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            <div style={{textAlign:'center',marginBottom:24}}>
              <img src="https://activos.ec/static/logo1.png" alt="Logo Activos" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)'}} />
              <h2 style={{marginTop:12,fontWeight:700,color:'#1976d2',letterSpacing:1}}>Inicia sesión</h2>
            </div>
            <form onSubmit={handleEmailSubmit} className="pagos-form" style={{width:'100%'}}>
              <div style={{marginBottom:16,position:'relative',width:'100%'}}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  required
                  className="pagos-input"
                  style={{
                    width:'100%',
                    maxWidth:'100%',
                    boxSizing:'border-box',
                    padding:'14px 44px 14px 18px',
                    borderRadius:12,
                    border:'2px solid #e3f2fd',
                    fontSize:18,
                    background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',
                    boxShadow:'0 4px 16px rgba(25,118,210,0.10)',
                    outline:'none',
                    color:'#222',
                    letterSpacing:1,
                    fontWeight:600,
                    marginTop:0,
                    marginBottom:0,
                    textAlign:'left',
                    transition:'border-color 0.3s, box-shadow 0.3s'
                  }}
                  disabled={loading}
                  autoFocus
                  autoComplete="email"
                  name="email"
                  onFocus={e => e.target.style.borderColor = '#1976d2'}
                  onBlur={e => e.target.style.borderColor = '#e3f2fd'}
                />
              </div>
              {emailError && <div className="pagos-error" style={{color:'#e53e3e',marginBottom:8}}>{emailError}</div>}
              <button type="submit" className="pagos-btn confirm-btn" style={{
                width:'100%',
                padding:'14px 0',
                fontSize:18,
                fontWeight:700,
                background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                color:'#fff',
                border:'none',
                borderRadius:12,
                marginTop:12,
                boxShadow:'0 4px 16px rgba(25,118,210,0.12)',
                letterSpacing:1,
                transition:'background 0.2s, box-shadow 0.2s',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }} disabled={loading}>{loading ? "Validando..." : "Continuar"}</button>
            </form>
            <div style={{marginTop:24,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div className="social-login-divider" style={{margin:'20px 0',color:'#bfc9d9',width:'100%',textAlign:'center'}}><span>O</span></div>
              <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
                <LoginGoogle onClick={() => setLoading(true)} onResult={handleGoogleLogin} getError={(err) => { setLoading(false); setEmailError(err.message || 'Error de Google'); }}/>
              </div>
              <div style={{marginTop:12,fontSize:14,color:'#888',textAlign:'center'}}>O inicia sesión con Google</div>
            </div>
          </div>
        );
      case "password":
        return (
          <div className="pagos-login-container" style={{maxWidth:400,margin:'0 auto',background:'#fff',borderRadius:16,padding:32,boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            <div style={{textAlign:'center',marginBottom:24}}>
              <img src="https://activos.ec/static/logo1.png" alt="Logo Activos" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)'}} />
              <h2 style={{marginTop:12,fontWeight:700,color:'#1976d2',letterSpacing:1}}>Iniciar Sesión</h2>
            </div>
            <form onSubmit={handleLogin} className="pagos-form">
              <div style={{marginBottom:16,position:'relative',width:'100%'}}>
                <input
                  type="email"
                  className="pagos-input"
                  value={email}
                  disabled
                  name="email"
                  autoComplete="email"
                  style={{
                    width:'100%',
                    minWidth:'100%',
                    maxWidth:'100%',
                    boxSizing:'border-box',
                    padding:'14px 0',
                    borderRadius:12,
                    border:'2px solid #e3f2fd',
                    fontSize:18,
                    background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',
                    boxShadow:'0 4px 16px rgba(25,118,210,0.10)',
                    outline:'none',
                    color:'#222',
                    letterSpacing:1,
                    fontWeight:600,
                    marginTop:0,
                    marginBottom:0,
                    textAlign:'left',
                    transition:'border-color 0.3s, box-shadow 0.3s'
                  }}
                />
              </div>
              <div style={{marginBottom:16,position:'relative',width:'100%'}}>
                <input
                  type="password"
                  className="pagos-input"
                  placeholder="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  autoFocus
                  required
                  autoComplete="current-password"
                  name="password"
                  style={{
                    width:'100%',
                    minWidth:'100%',
                    maxWidth:'100%',
                    boxSizing:'border-box',
                    padding:'14px 0',
                    borderRadius:12,
                    border:'2px solid #e3f2fd',
                    fontSize:18,
                    background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',
                    boxShadow:'0 4px 16px rgba(25,118,210,0.10)',
                    outline:'none',
                    color:'#222',
                    letterSpacing:1,
                    fontWeight:600,
                    marginTop:0,
                    marginBottom:0,
                    textAlign:'left',
                    transition:'border-color 0.3s, box-shadow 0.3s'
                  }}
                />
              </div>
              {loginError && <div className="pagos-error" style={{color:'#e53e3e',marginBottom:8}}>{loginError}</div>}
              <button type="submit" className="pagos-btn confirm-btn" style={{
                width:'100%',
                padding:'14px 0',
                fontSize:18,
                fontWeight:700,
                background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                color:'#fff',
                border:'none',
                borderRadius:12,
                marginTop:12,
                boxShadow:'0 4px 16px rgba(25,118,210,0.12)',
                letterSpacing:1,
                transition:'background 0.2s, box-shadow 0.2s',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }} disabled={loading}>{loading ? "Iniciando sesión..." : "Iniciar Sesión"}</button>
            </form>
          </div>
        );
      case "register":
        return (
          <div style={{maxWidth:400,margin:'0 auto',background:'#fff',borderRadius:20,padding:'32px 16px',boxSizing:'border-box',boxShadow:'0 4px 24px rgba(44,62,80,0.10)'}}>
            <div style={{textAlign:'center',marginBottom:24}}>
              <img src="https://activos.ec/static/logo1.png" alt="Logo Activos" style={{width:64,height:64,borderRadius:'50%',boxShadow:'0 2px 8px rgba(25,118,210,0.10)'}} />
              <h2 style={{marginTop:12,fontWeight:700,color:'#1976d2',letterSpacing:1}}>Registro de Usuario</h2>
            </div>
            <form onSubmit={handleRegister}>
              <input type="email" className="pagos-input" value={email} disabled name="email" autoComplete="email" style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}} />
              {registerStep === 0 && <input type="text" className="pagos-input" placeholder="Nombre de usuario" value={regUsuario} onChange={e => setRegUsuario(e.target.value)} disabled={loading} autoFocus required name="username" style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}} />}
              {registerStep === 1 && <input type="tel" className="pagos-input" placeholder="Teléfono" value={regTelefono} onChange={e => setRegTelefono(e.target.value)} disabled={loading} autoFocus required name="phone" style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}} />}
              {registerStep === 2 && <input type="password" className="pagos-input" placeholder="Contraseña (mín. 6 caracteres)" value={regPassword} onChange={e => setRegPassword(e.target.value)} disabled={loading} autoFocus required name="password" style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid #e3f2fd',fontSize:18,background:'linear-gradient(90deg, #f7fafd 0%, #e3f2fd 100%)',boxShadow:'0 4px 16px rgba(25,118,210,0.10)',outline:'none',color:'#222',letterSpacing:1,fontWeight:600,marginTop:0,marginBottom:12,textAlign:'left',transition:'border-color 0.3s, box-shadow 0.3s'}} />}
              {registerError && <div className="pagos-error" style={{color:'#e53e3e',marginBottom:8}}>{registerError}</div>}
              <div style={{display:'flex',gap:12,marginTop:12}}>
                {registerStep > 0 && (
                  <button
                    type="button"
                    className="pagos-btn"
                    style={{
                      width:'100%',
                      padding:'14px 0',
                      fontSize:18,
                      fontWeight:700,
                      background:'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',
                      color:'#1976d2',
                      border:'none',
                      borderRadius:12,
                      boxShadow:'0 4px 16px rgba(25,118,210,0.08)',
                      letterSpacing:1,
                      transition:'background 0.2s, box-shadow 0.2s',
                      cursor:'pointer'
                    }}
                    disabled={loading}
                    onClick={() => setRegisterStep(registerStep - 1)}
                  >Atrás</button>
                )}
                <button type="submit" className="pagos-btn" style={{width:'100%',padding:'14px 0',fontSize:18,fontWeight:700,background:'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',color:'#fff',border:'none',borderRadius:12,boxShadow:'0 4px 16px rgba(25,118,210,0.12)',letterSpacing:1,transition:'background 0.2s, box-shadow 0.2s',cursor:'pointer'}} disabled={loading}>{loading ? "Registrando..." : (registerStep < 2 ? "Siguiente" : "Registrar")}</button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  }
  return (
    <div className="pagos-modal-bg" onClick={onClose}>
      <div className="pagos-modal" onClick={(e) => e.stopPropagation()}>
        {renderStep()}
      </div>
      <style jsx>{`
        .pagos-modal-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(5px); }
        .pagos-modal { background: #fff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); padding: 40px; max-width: 420px; width: 100%; text-align: center; animation: slide-up 0.4s ease-out; }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .pagos-modal h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 8px; color: #1a202c; }
        .pagos-subtitle { font-size: 1rem; color: #718096; margin-bottom: 24px; }
        .pagos-input { width: 100%; padding: 12px 16px; font-size: 1rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 12px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .pagos-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        .pagos-btn { width: 100%; padding: 14px 0; background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%); color: #fff; font-weight: 600; font-size: 1rem; border: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .pagos-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .pagos-error { color: #e53e3e; font-size: 0.9rem; margin-bottom: 10px; text-align: left; }
        .social-login-divider { display: flex; align-items: center; text-align: center; color: #a0aec0; margin: 20px 0; }
        .social-login-divider::before, .social-login-divider::after { content: ''; flex: 1; border-bottom: 1px solid #e2e8f0; }
        .social-login-divider span { padding: 0 12px; font-size: 0.9rem; }
        .duration-toggle { display: flex; background-color: #f7fafc; border-radius: 12px; padding: 4px; margin-bottom: 24px; }
        .duration-toggle button { flex: 1; padding: 10px; border: none; background-color: transparent; border-radius: 8px; font-weight: 600; color: #718096; cursor: pointer; transition: all 0.3s ease; }
        .duration-toggle button.active { background-color: #fff; color: #6366f1; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
        .plan-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .plan-card { padding: 20px; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; text-align: center; }
        .plan-card:hover { transform: translateY(-4px); border-color: #c3dafe; }
        .plan-card.selected { border-color: #6366f1; background-color: #f0f0ff; transform: translateY(-4px); box-shadow: 0 4px 12px rgba(99, 102,241, 0.1); }
        .plan-name { font-size: 1.1rem; font-weight: 700; color: #2d3748; margin-bottom: 8px; }
        .plan-price { font-size: 1.5rem; font-weight: 800; color: #1a202c; }
        .plan-duration { font-size: 0.9rem; font-weight: 500; color: #718096; }
        .confirm-btn { margin-top: 24px; }
      `}</style>
    </div>
  );
}
