import { useEffect, useRef, useState } from 'react';

export default function AppDownloadSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
         
          setTimeout(()=>{
            setIsVisible(true);
            observer.unobserve(entry.target);

          },500)
        
        }
      },
      { threshold: 0.2 } // Observa cuando el 50% del componente esté visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`app-download-section ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="content">
        <div className={`image-area ${isVisible ? 'show-image' : ''}`}>
          <img src="/static/landing/bm3.png" alt="App Preview" />
        </div>
        <div className={`text-area ${isVisible ? 'show-text' : ''}`}>
          <h5>Acceso Universal</h5>
          <h2>Optimizado para cualquier dispositivo.</h2>
          <p>
Como plataforma SAAS, ofrecemos una solución completa sin necesidad de descargar una app o que ocupe espacio en tu teléfono. Está disponible en móviles, tablets y computadoras con navegadores modernos.          </p>
          <div className="platforms">
            <div className={`platform ${isVisible ? 'show-platform' : ''} platform-apple`}>
              <img src="/static/landing/apple.svg" alt="Apple" />
              Apple
            </div>
            <div className={`platform ${isVisible ? 'show-platform' : ''} platform-android`}>
              <img src="/static/landing/android.svg" alt="Android" />
              Android
            </div>
            <div className={`platform ${isVisible ? 'show-platform' : ''} platform-windows`}>
              <img src="/static/landing/windows.svg" alt="Windows" />
              Windows
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .image-area {
          flex: 1 1 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          opacity: 0;
          transform: translateX(-100px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .image-area.show-image {
          opacity: 1;
          transform: translateX(0);
        }

        .image-area img {
          width: 100%;
          max-width: 350px;
          border-radius: 10px;
        }

        .text-area {
          flex: 1 1 400px;
          padding: 20px;
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          padding-top:0px
        }

        .text-area.show-text {
          opacity: 1;
          transform: translateY(0);
        }

        .text-area h5 {
          text-transform: uppercase;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .text-area h2 {
          font-size: 32px;
          margin-bottom: 20px;
        }

        .text-area p {
          font-size: 16px;
          
          color: #555;
        }

        .platforms {
          display: flex;
          gap: 20px;

          opacity: 1;
          transform: translateY(50px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .platforms.show-platforms {
          opacity: 1;
          transform: translateY(0);
        }

        .platform {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #333;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: transform 0.2s;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .platform.show-platform {
          opacity: 1;
          transform: translateY(0);
        }

        .platform img {
          width: 24px;
          height: 24px;
        }

        .platform-apple {
          transition-delay: 0.2s;
        }

        .platform-android {
          transition-delay: 0.4s;
        }

        .platform-windows {
          transition-delay: 0.6s;
        }

        .app-download-section {
          position: relative;
          overflow: hidden;
          padding: 40px 20px;
          background: linear-gradient(to bottom right, rgb(60 138 224 / 69%), rgba(220, 230, 250, 0.8));
          z-index: 1;
        }

        @media (max-width: 768px) {
          .content {
            flex-direction: column;
          }

          .platforms {
            justify-content: center;
            flex-wrap: wrap;
          }

          .image-area {
            padding: 5px;
          }

          .app-download-section {
            padding: 20px 20px;
          }
        }
      `}</style>
    </section>
  );
}
