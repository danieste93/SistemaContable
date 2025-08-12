import React, { useEffect, useRef, useState } from 'react';
import Typewriter from './maquinaEscribir';

const PantallaPrincipal = () => {
    const [isVisibleLeft, setIsVisibleLeft] = useState(false);
    const [isVisibleRight, setIsVisibleRight] = useState(false);

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