import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logOut } from '../reduxstore/actions/myact';
import { cleanData } from '../reduxstore/actions/regcont';
import postal from 'postal';
import LoginGoogle from '../components/loginGoogle';
import { useGoogleOneTapLogin } from '@react-oauth/google';

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

  const [step, setStep] = useState("email");
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
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (loggedInUser && loggedInUser.Email) {
        setEmail(loggedInUser.Email);
        setStep("planSelection");
    } else {
        setStep("email");
    }
  }, [loggedInUser]);

  const handleBackendLogin = async (loginData) => {
  // Mostrar respuesta del backend en pantalla para debug
  setDebugInfo(JSON.stringify(loginData, null, 2));
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
    setStep("planSelection");
  } else {
    const errorMessage = loginData.message || "Error al iniciar sesión.";
    setLoginError(errorMessage);
    setEmailError(errorMessage);
    setDebugInfo(prev => prev + "\n[LOGIN ERROR] " + errorMessage);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/users/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: email, Contrasena: password })
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
      const res = await fetch("/api/registro-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: regUsuario, correo: email, password: regPassword, telefono: regTelefono })
      });
      const data = await res.json();
      setDebugInfo("[REGISTRO] " + JSON.stringify(data, null, 2));
      if (data.status === "Ok" && data.data && data.data.user && data.data.decodificado) {
        setRegisterSuccess(true);
        // Auto-login after registration (NO espera el correo)
        const loginEvent = { preventDefault: () => {} }; // Mock event object
        setDebugInfo(prev => prev + "\n[LOGIN] email: " + email + ", password: " + regPassword);
        setPassword(regPassword); // Asegura que la contraseña usada sea la registrada
        handleLogin(loginEvent, true);
        // Enviar correo de bienvenida en segundo plano, ignora cualquier error
        fetch("/api/email/send-welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            nombre: regUsuario
          })
        }).catch(() => {});
      } else {
        setRegisterError(data.message || "Error al registrar usuario.");
        setDebugInfo(prev => prev + "\n[REGISTRO ERROR] " + (data.message || "Error al registrar usuario."));
        setLoading(false);
      }
    } catch (err) {
      setRegisterError("Error de conexión. Intenta de nuevo.");
      setDebugInfo(prev => prev + "\n[REGISTRO ERROR] " + err.message);
      setLoading(false);
    }
  }

  const renderStep = () => {
    // Mostrar debugInfo en pantalla para ver detalles
    const debugBlock = debugInfo ? (
      <pre style={{textAlign:'left',background:'#f9f9f9',color:'#333',fontSize:'0.85em',padding:'10px',borderRadius:'8px',marginBottom:'12px',maxHeight:'200px',overflow:'auto'}}>
        {debugInfo}
      </pre>
    ) : null;

    switch (step) {
      case "planSelection":
    return (
      <>
        {debugBlock}
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
        <button type="button" className="pagos-btn confirm-btn" onClick={() => onPlanConfirmed(selectedPlan, loggedInUser)}>
          {`Continuar con ${selectedPlan.name} - $${selectedPlan.price}`}
        </button>
      </>
    );
      case "email":
        return (
          <>
            {debugBlock}
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
        {debugBlock}
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
            {debugBlock}
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
        .plan-card.selected { border-color: #6366f1; background-color: #f0f0ff; transform: translateY(-4px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1); }
        .plan-name { font-size: 1.1rem; font-weight: 700; color: #2d3748; margin-bottom: 8px; }
        .plan-price { font-size: 1.5rem; font-weight: 800; color: #1a202c; }
        .plan-duration { font-size: 0.9rem; font-weight: 500; color: #718096; }
        .confirm-btn { margin-top: 24px; }
      `}</style>
    </div>
  );
}
