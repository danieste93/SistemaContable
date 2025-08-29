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
          <>
            <h2>Elige tu Plan</h2>
            <p className="pagos-subtitle">Selecciona la duración y el plan que mejor se adapte a ti.</p>
            <div className="duration-toggle">
              <button className={duration === 'mensual' ? 'active' : ''} onClick={() => setDuration('mensual')}>Mensual</button>
              <button className={duration === 'anual' ? 'active' : ''} onClick={() => setDuration('anual')}>Anual</button>
            </div>
            <div className="plan-cards">
              {plansData && plansData[duration] && plansData[duration].map(plan => (
                <div 
                  key={plan.id}
                  className={`plan-card ${selectedPlan.name === plan.name && selectedPlan.duration.toLowerCase() === duration ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan({ name: plan.name, duration: duration.charAt(0).toUpperCase() + duration.slice(1), price: plan.price })}
                >
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">${plan.price}<span className="plan-duration">/{duration === 'anual' ? 'año' : 'mes'}</span></div>
                </div>
              ))}
            </div>
            <button type="button" className="pagos-btn confirm-btn" onClick={() => setStep("facturacion")}> 
              {`Continuar con ${selectedPlan.name} - $${selectedPlan.price}`}
            </button>
          </>
        );
      case "facturacion":
        return (
          <>
            <h2>Datos para Facturación</h2>
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
                console.log("[DEBUG] Email enviado a actualizar-facturacion:", emailToSend);
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
                  // Actualizar Redux con el usuario actualizado de la respuesta
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
              <input type="text" className="pagos-input" placeholder="Nombres" value={facturacion.Nombres} onChange={e => setFacturacion(f => ({ ...f, Nombres: e.target.value }))} required />
              <input type="text" className="pagos-input" placeholder="Cédula o RUC" value={facturacion.CedulaoRuc} onChange={e => setFacturacion(f => ({ ...f, CedulaoRuc: e.target.value }))} required />
              <input type="email" className="pagos-input" placeholder="Correo para Factura" value={facturacion.Correo} onChange={e => setFacturacion(f => ({ ...f, Correo: e.target.value }))} required />
              <input type="tel" className="pagos-input" placeholder="Teléfono" value={facturacion.Telefono} onChange={e => setFacturacion(f => ({ ...f, Telefono: e.target.value }))} />
              <input type="text" className="pagos-input" placeholder="Dirección" value={facturacion.Direccion} onChange={e => setFacturacion(f => ({ ...f, Direccion: e.target.value }))} required />
              {facturacionError && <div className="pagos-error">{facturacionError}</div>}
              <button type="submit" className="pagos-btn confirm-btn" disabled={loading}>{loading ? "Guardando..." : "Guardar y Continuar"}</button>
            </form>
          </>
        );
      case "transferencia":
        return (
          <>
            <h2>Formas de Pago</h2>
            <div className="formas-pago-toggle">
              <button className={step === "transferencia" ? "active" : ""} style={{marginRight:8}} disabled>Transferencia</button>
              <button className={step === "paypal" ? "active" : ""} onClick={()=>setStep("paypal")}>Paypal</button>
            </div>
            <div className="transferencia-section">
              <h3>Selecciona el banco</h3>
              <div className="bancos-list-minimal">
                {bancos.map((banco, idx) => (
                  <div key={idx} className={`banco-min-card ${selectedBanco?.nombre === banco.nombre ? "selected" : ""}`} onClick={() => setSelectedBanco(banco)}>
                    <span>{banco.nombre}</span>
                  </div>
                ))}
              </div>
              {selectedBanco && (
                <div className="banco-info-pro">
                  <h4>{selectedBanco.nombre}</h4>
                  <div><strong>Cuenta de ahorros:</strong> {selectedBanco.cuenta}</div>
                  <div><strong>Titular:</strong> {selectedBanco.titular}</div>
                  <div><strong>CI:</strong> {selectedBanco.ci}</div>
                  {selectedBanco.telefono && <div><strong>Teléfono:</strong> {selectedBanco.telefono}</div>}
                  <div><strong>Correo:</strong> {selectedBanco.correo}</div>
                  <div className="comprobante-upload">
                    <input type="file" accept="image/*,application/pdf" onChange={e => setComprobante(e.target.files[0])} />
                    {comprobanteError && <div className="pagos-error">{comprobanteError}</div>}
                    <button className="pagos-btn confirm-btn" onClick={handleComprobanteUpload} disabled={uploading || !comprobante}>{uploading ? "Subiendo..." : "Subir Comprobante"}</button>
                  </div>
                </div>
              )}
            </div>
            <style jsx>{`
              .formas-pago-toggle { display: flex; justify-content: center; margin-bottom: 24px; }
              .formas-pago-toggle button { flex: 1; padding: 12px; border: none; border-radius: 10px; font-weight: 600; color: #6366f1; background: #f3f4f6; cursor: pointer; margin: 0 4px; transition: background 0.2s; }
              .formas-pago-toggle button.active { background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%); color: #fff; }
              .transferencia-section { margin-top: 12px; }
              .bancos-list-minimal { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
              .banco-min-card { background: #f7fafc; border-radius: 10px; padding: 16px; text-align: center; cursor: pointer; font-weight: 600; color: #6366f1; border: 2px solid #e2e8f0; transition: border 0.2s, box-shadow 0.2s; }
              .banco-min-card.selected { border: 2px solid #6366f1; background: #e0e7ff; box-shadow: 0 2px 8px rgba(99,102,241,0.08); }
              .banco-info-pro { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(99,102,241,0.08); padding: 18px; margin-bottom: 12px; text-align: left; }
              .banco-info-pro h4 { color: #6366f1; margin-bottom: 8px; font-size: 1.1rem; }
              .comprobante-upload { margin-top: 16px; }
              .comprobante-upload input[type="file"] { margin-bottom: 10px; }
              .comprobante-upload button { width: 100%; }
            `}</style>
          </>
        );
      case "paypal":
        return (
          <>
            <h2>Pagar con Paypal</h2>
            <div style={{marginBottom:24}}>
              <PayPalScriptProvider options={{ "client-id": "AbsN1lxgxK9UDzodAY0RwHG-N2dZIBTdWJiy7m2dJJjVtDrw4aguKvSp9G8MmEARVhu4jaquxAhesqeU", currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical" }}
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
                        setShowSuccess(true);
                        dispatch(logOut());
                        dispatch(cleanData());
                        localStorage.removeItem("state");
                        localStorage.removeItem("jwt_token");
                        // Elimino redirección automática y flag
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
              </PayPalScriptProvider>
            </div>
            <button className="pagos-btn" onClick={()=>setStep("planSelection")}>Volver</button>
            {showSuccess && (
              <div className="paypal-success-modal" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(30,41,59,0.85)',zIndex:99999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)',transition:'background 0.3s'}}>
                <div style={{background:'#fff',borderRadius:20,padding:'40px 32px',maxWidth:380,textAlign:'center',boxShadow:'0 8px 32px rgba(30,41,59,0.25)',animation:'fadeInScale 0.5s'}}>
                  <h2 style={{color:'#10b981',marginBottom:16,fontSize:'2rem'}}>¡Membresía activada!</h2>
                  <p style={{fontSize:18,marginBottom:22,color:'#334155'}}>Tu membresía ha sido activada correctamente.<br/>Inicia sesión para disfrutar los beneficios.</p>
                  <button className="pagos-btn" style={{marginTop:18}} onClick={()=>{window.location.href="/ingreso"; if(onClose) onClose();}}>Continuar</button>
                </div>
                <style>{`
                  @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.85); }
                    to { opacity: 1; transform: scale(1); }
                  }
                `}</style>
              </div>
            )}
          </>
        );
      case "email":
        return (
          <>
            <h2>Ingresa tu correo</h2>
            <form onSubmit={handleEmailSubmit}>
              <input type="email" className="pagos-input" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} autoFocus required autoComplete="email" name="email"/>
              {emailError && <div className="pagos-error">{emailError}</div>}
              <button type="submit" className="pagos-btn" disabled={loading}>{loading ? "Validando..." : "Continuar"}</button>
            </form>
            <div className="social-login-divider"><span>O</span></div>
            <LoginGoogle onClick={() => setLoading(true)} onResult={handleGoogleLogin} getError={(err) => { setLoading(false); setEmailError(err.message || 'Error de Google'); }}/>
          </>
        );
      case "password":
        return (
            <>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" className="pagos-input" value={email} disabled name="email" autoComplete="email"/>
                    <input type="password" className="pagos-input" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} autoFocus required autoComplete="current-password" name="password"/>
                    {loginError && <div className="pagos-error">{loginError}</div>}
                    <button type="submit" className="pagos-btn" disabled={loading}>{loading ? "Iniciando sesión..." : "Iniciar Sesión"}</button>
                </form>
            </>
        );
      case "register":
        return (
            <>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleRegister}>
                <input type="email" className="pagos-input" value={email} disabled name="email" autoComplete="email"/>
                {registerStep === 0 && <input type="text" className="pagos-input" placeholder="Nombre de usuario" value={regUsuario} onChange={e => setRegUsuario(e.target.value)} disabled={loading} autoFocus required name="username" />}
                {registerStep === 1 && <input type="tel" className="pagos-input" placeholder="Teléfono" value={regTelefono} onChange={e => setRegTelefono(e.target.value)} disabled={loading} autoFocus required name="phone" />}
                {registerStep === 2 && <input type="password" className="pagos-input" placeholder="Contraseña (mín. 6 caracteres)" value={regPassword} onChange={e => setRegPassword(e.target.value)} disabled={loading} autoFocus required name="password" />}
                {registerError && <div className="pagos-error">{registerError}</div>}
                <button type="submit" className="pagos-btn" disabled={loading}>{loading ? "Registrando..." : (registerStep < 2 ? "Siguiente" : "Registrar")}</button>
            </form>
          </>
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
