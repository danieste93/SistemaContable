import React, { useEffect, useRef, useState } from 'react';
import Typewriter from './maquinaEscribir';
import { useDispatch } from 'react-redux';
import { updateUser, logOut } from '../../reduxstore/actions/myact';
import { cleanData, addFirstRegs, addFirstRegsDelete, getcats, getcuentas, getArts, getClients, getCompras, getVentas, getDistribuidor } from '../../reduxstore/actions/regcont';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import LoginGoogle from '../loginGoogle';

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

const PantallaPrincipal = () => {
    const dispatch = useDispatch();
    const [isVisibleLeft, setIsVisibleLeft] = useState(false);
    const [isVisibleRight, setIsVisibleRight] = useState(false);
    // Detectar si es móvil
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const leftRef = useRef();
    const rightRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.target === leftRef.current) setIsVisibleLeft(true);
                        if (entry.target === rightRef.current) setIsVisibleRight(true);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (leftRef.current) observer.observe(leftRef.current);
        if (rightRef.current) observer.observe(rightRef.current);

        return () => {
            if (leftRef.current) observer.unobserve(leftRef.current);
            if (rightRef.current) observer.unobserve(rightRef.current);
        };
    }, []);

    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            const decoded = decodeJwt(credentialResponse.credential);
            if(decoded){
                // Login/registro en backend
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
        disabled: false, // Activo en todos los dispositivos
        position: 'bottom-right',
    });

    const handleBackendLogin = async (loginData) => {
        if (loginData.status === "Ok") {
            const { user, decodificado, token } = loginData.data;
            const usuarioPayload = { user, decodificado, token };
            let localstate = { userReducer: { update: { usuario: usuarioPayload } } };
            localStorage.setItem("state", JSON.stringify(localstate));
            localStorage.setItem("jwt_token", token);
            dispatch(cleanData());
            dispatch(logOut());
            dispatch(updateUser({ usuario: usuarioPayload }));
            // --- CARGA DE DATOS ---
            try {
                // Registros contables
                const montRegsRes = await fetch("/cuentas/getmontregs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo },
                        tiempo: new Date().getTime()
                    })
                });
                const montRegsData = await montRegsRes.json();
                if (montRegsData.status !== "error") {
                    dispatch(addFirstRegs(montRegsData.regsHabiles));
                    dispatch(addFirstRegsDelete(montRegsData.regsHabilesDelete));
                }
            } catch (err) { console.error("Error getmontregs", err); }
            try {
                // Registros ejecutados
                const exeRegsRes = await fetch("/cuentas/exeregs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo, tiempo: new Date().getTime() }
                    })
                });
                const exeRegsData = await exeRegsRes.json();
                if (exeRegsData.status !== "error" && exeRegsData.registrosUpdate && exeRegsData.registrosUpdate.length > 0) {
                    dispatch(require('../../reduxstore/actions/regcont').updateRegs(exeRegsData.registrosUpdate));
                }
            } catch (err) { console.error("Error exeregs", err); }
            try {
                // Cuentas y categorías
                const cuentasCatsRes = await fetch("/cuentas/getCuentasyCats", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo }
                    })
                });
                const cuentasCatsData = await cuentasCatsRes.json();
                if (cuentasCatsData.status === "Ok") {
                    dispatch(getcats(cuentasCatsData.catHabiles));
                    dispatch(getcuentas(cuentasCatsData.cuentasHabiles));
                }
            } catch (err) { console.error("Error getCuentasyCats", err); }
            try {
                // Artículos
                const artsRes = await fetch("/public/engine/art", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo }
                    })
                });
                const artsData = await artsRes.json();
                if (artsData.status === "Ok") {
                    dispatch(getArts(artsData.articulosHabiles));
                }
            } catch (err) { console.error("Error getArts", err); }
            try {
                // Clientes
                const clientsRes = await fetch("/cuentas/getClients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo }
                    })
                });
                const clientsData = await clientsRes.json();
                if (clientsData.status === "Ok") {
                    dispatch(getClients(clientsData.clientesHabiles));
                }
            } catch (err) { console.error("Error getClients", err); }
            try {
                // Compras
                const comprasRes = await fetch("/cuentas/getCompras", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo }
                    })
                });
                const comprasData = await comprasRes.json();
                if (comprasData.status === "Ok") {
                    dispatch(getCompras(comprasData.comprasHabiles));
                }
            } catch (err) { console.error("Error getCompras", err); }
            try {
                // Ventas
                const ventasRes = await fetch("/cuentas/getVentas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo }
                    })
                });
                const ventasData = await ventasRes.json();
                if (ventasData.status === "Ok") {
                    dispatch(getVentas(ventasData.ventasHabiles));
                }
            } catch (err) { console.error("Error getVentas", err); }
            try {
                // Distribuidores
                const distRes = await fetch("/cuentas/getarmoextradata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify({
                        User: { DBname: user.DBname, Tipo: user.Tipo }
                    })
                });
                const distData = await distRes.json();
                if (distData.status === "Ok") {
                    dispatch(getDistribuidor(distData.distriHabiles));
                    dispatch(getcuentas(distData.allCuentasHabiles));
                }
            } catch (err) { console.error("Error getDistribuidor", err); }
        }
    };

    useEffect(() => {
        // Forzar el popup de Google One Tap a estar por encima de todo y permitir clics
        const interval = setInterval(() => {
            const oneTap = document.querySelector('iframe[title*="google"]');
            if (oneTap) {
                oneTap.style.zIndex = '99999';
                oneTap.style.pointerEvents = 'auto';
            }
            const oneTapSheet = document.querySelector('div[style*="z-index"]');
            if (oneTapSheet && oneTapSheet.innerHTML.includes('Continuar')) {
                oneTapSheet.style.zIndex = '99999';
                oneTapSheet.style.pointerEvents = 'auto';
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="contPrincipal">
            <svg className="backgroundLines" viewBox="0 0 1440 900" preserveAspectRatio="none">
                <path 
                    fill="none" 
                    stroke="white" 
                    strokeOpacity="0.2" 
                    strokeWidth="1" 
                    d="M0,0 C180,0 360,200 540,100 C720,0 900,200 1080,100 C1260,0 1440,200 1440,100" 
                />
             
            </svg>

            <div className="heroContainer">
                <div 
                    ref={leftRef} 
                    className={`leftSection ${isVisibleLeft ? 'animateUp' : ''}`}
                >
                    <div style={{ width: "100%" }}>
                        <h1 className="title">Cuentas Claras,</h1>
                        <Typewriter words={[ 'Creciendo', 'Estable', 'Automático']} />
                    </div>

                    <p className="subtitle">
                    Sistema contable simplificado,  completo para controlar gastos, gestión de inventario y ventas.
                    </p>
          
                    <div className="buttonGroup">
                        <button className="btnPrimary">Empieza</button>
                        <button className="btnSecondary">Pruébalo gratis</button>
                        <div className="google-login-wrapper">
                          <LoginGoogle onResult={handleBackendLogin} />
                        </div>
                    </div>
                    <div className="stars">
                        ⭐⭐⭐⭐⭐ <span>Calidad al más alto nivel  </span>
                    </div>
                </div>

                <div 
                    ref={rightRef} 
                    className={`rightSection ${isVisibleRight ? 'animateRight' : ''}`}
                >
                    <img src="/static/landing/bm1a.png" alt="App Preview" className="heroImage" />
                </div>
            </div>

            <style jsx>{`
                .contPrincipal {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(to right, #d946ef, #3b82f6);
                    overflow: hidden;
                    color: white;
                }

                .backgroundLines {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                .heroContainer {
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 1200px;
                    padding: 1rem;
                    z-index: 10;
                }

                .leftSection {
                    width: 55%;
                    min-width: 300px;
                    opacity: 0;
                    transform: translateY(50px);
                    transition: all 0.8s ease;
                }

                .leftSection.animateUp {
                    opacity: 1;
                    transform: translateY(0);
                }

                .rightSection {
                    width: 45%;
                    min-width: 300px;
                    opacity: 0;
                    transform: translateX(50px);
                    transition: all 0.8s ease;
                }

                .rightSection.animateRight {
                    opacity: 1;
                    transform: translateX(0);
                }

                .title {
                    font-size: 3.5rem;
                    font-weight: bold;
                    margin-bottom: 0px;
                }

                .subtitle {
                    font-size: 1.2rem;
                    margin-bottom: 1.5rem;
                }

                .buttonGroup {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .btnPrimary {
                    background-color: #ff00aa;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.3s ease;
                }

                .btnSecondary {
                    background: none;
                    border: 2px solid #00ffee;
                    color: #00ffee;
                    padding: 0.75rem 1.5rem;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.3s ease;
                }

                .btnPrimary:hover, .btnSecondary:hover {
                    opacity: 0.8;
                }

                .stars {
                    font-size: 1rem;
                    margin-top: 1rem;
                }

                .heroImage {
                    width: 60%;
                    max-width: 350px;
                    display: block;
                    margin: 0 auto;
                    margin-top: 40px;
                }

                .google-login-wrapper {
                  display: flex;
                  align-items: center;
                  margin-left: 8px;
                }

                @media (max-width: 768px) {
                    .rightSection {
                        margin-top: 0px;
                    }

                    .leftSection {
                        margin-top: 25px;
                        width: 80%;
                    }

                    .heroContainer {
                        flex-direction: column;
                        text-align: center;
                    }
                    .buttonGroup {
                        justify-content: center;
                        flex-direction: column;
                        gap: 0.5rem;
                        align-items: center;
                      }

                    .title {
                        font-size: 2.5rem;
                    }
                }

                @media (max-width: 425px) {
                    .title {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default PantallaPrincipal;