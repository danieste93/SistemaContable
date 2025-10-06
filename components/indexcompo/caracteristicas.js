import React, { useEffect, useState, useRef } from 'react';
import CompleteWavyBackground from './wavybg';

const Caracteristicas = () => {
  const services = [
    {
      id: 1,
      icon: '/static/landing/icofirma.png',
      title: 'Firma electrónica GRATIS',
      description: 'Ahorra hasta $30 al año, incluida en todos los planes anuales.'
    },
    {
      id: 2,
      icon: '/static/landing/icono1.png',
      title: 'Aprendizaje sin límites',
       description: 'Maneja toda la contabilidad de tu empresa de forma facil sin necesidad de terceros'
    },
    {
      id: 3,
      icon: '/static/landing/icoplan.png',
      title: 'Plan GRATUITO completo',
          description: 'La app de finanzas más completa que te permite una Contabilidad automatizada.'
 
    },
    {
      id: 4,
      icon: '/static/landing/icopersonaliza.png',
      title: 'Personaliza tu empresa',
      description: 'Sube tu logo y emite facturas desde tu propio correo.'
    }
  ];

  const [visibleItems, setVisibleItems] = useState(0);
  const componentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(()=>{
            setIsVisible(true);
            observer.unobserve(entry.target);

          },300)
        
        }
      },
      {
        threshold: 0.2 // Se activa cuando el 10% del componente es visible
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setVisibleItems(prev => (prev < services.length ? prev + 1 : prev));
      }, 300);

      return () => clearInterval(timer);
    }
  }, [isVisible, services.length]);

  return (
    <div className="hero" ref={componentRef}>
      <CompleteWavyBackground/>
      
      <div className="content">
        <div className="logo-container">
          <span className="material-icons">cloud_circle</span>
          <span>Caracteristicas de los <span>servicios</span></span>
        </div>

        <div className='why'>
          <span style={{fontWeight:"bolder"}}>
            ¿Porque deberías elegir 
          </span>
          <br/>nuestra aplicación?
        </div>
        
        <div>
          <p style={{fontSize:"1rem"}}>
            Porque mereces <strong>libertad financiera.</strong> Te damos herramientas confiables, sin complicaciones, para que logres todas tus metas.
        
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`service-card ${index < visibleItems ? 'visible' : ''}`}
              
            >
              <img className="service-icon" src={service.icon} alt={service.title} />
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero {
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Roboto', sans-serif;
          position: relative;
          min-height: 100vh;
          background: white;
          overflow: hidden;
        }

        .content {
        width: 90%;
          position: relative;
          z-index: 2;
      
          text-align: center;
          background-color: rgba(255, 255, 255, 0.85);
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(2px);
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .logo-container .material-icons {
          font-size: 3rem;
          color: #3F51B5;
        }

        .logo-container span span {
          color: #E91E63;
        }

        .why {
          font-size: 2.5rem; 
          margin-bottom: 15px;
          color: #3F51B5;
        }

        p {
          font-size: 1.5rem;
          line-height: 1.6;
          margin-bottom: 3rem;
          color: #424242;
        }

        /* Servicios Grid */
        .services-grid {
display: flex
;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

        }

        .service-card {
          background: #e9e9f4;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: all 0.4s ease;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          opacity: 0;
          transform: translateY(20px);
          max-width:220px;
          margin: 15px;
          height:250px;
        }

        .service-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .service-card:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          background: #f0f0f0;
        }

        .service-icon {
            

    transition: transform 0.3s ease;
 
    padding: 5px;
  
    border-radius: 11px;
    width: 80px;
   
        }

        .service-card:hover .service-icon {
          transform: scale(1.05);
        }

        .service-title {
          font-size: 1.4rem;
          color: #2d3748;
          margin-top:5px;
          margin-bottom: 15px;
          transition: color 0.3s ease;
        }

        .service-card:hover .service-title {
          color: #3F51B5;
        }

        .service-description {
          font-size: 1rem;
          color: black;
          line-height: 1.6;
          transition: color 0.3s ease;
        }

        .service-card:hover .service-description {
          color: #5a6268;
        }

        @media (max-width: 768px) {
          .content {
            padding: 2rem;
            margin: 1rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .why {
            font-size: 1.5rem;
          }

          p {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Caracteristicas;