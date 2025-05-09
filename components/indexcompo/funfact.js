import { useEffect, useRef, useState } from 'react';

export default function FunFactsSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const numbersRef = useRef([]);
  const sectionRef = useRef(null);

  const funFacts = [
    { value: 20, label: 'Awesome Integrations', color: '#cc00ff' },
    { value: 200, label: 'Powerful Tools', color: '#ff6600' },
    { value: 5000, label: 'Happy Users', color: '#00ccff' },
    { value: 2500, label: 'Projects Delivered', color: '#00ff99' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          funFacts.forEach((fact, index) => animateNumber(index, fact.value));
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumber = (index, target) => {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      if (numbersRef.current[index]) {
        numbersRef.current[index].innerText = value + '+';
      }
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numbersRef.current[index].innerText = target + '+';
      }
    };

    requestAnimationFrame(update);
  };

  return (
    <section className="funfacts-section" ref={sectionRef}>
      <div className="content">
        <div className={`image-area ${hasAnimated ? 'animate' : ''}`}>
          <img src="/static/landing/bm2.webp" alt="Laptop mockup" />
        </div>
        <div className="text-area">
          <h5>Fun facts</h5>
          <h2>
            We have some <strong>awesome</strong> funfacts for clients.
          </h2>
          <p>
            As a SAAS web crawler expert, I help organizations adjust to the expanding significance of internet promoting.
          </p>
          <div className="facts-flex">
            {funFacts.map((fact, index) => (
              <div className="fact-box" key={index}>
                <span
                  className="number"
                  ref={(el) => (numbersRef.current[index] = el)}
                  style={{ color: fact.color }}
                >
                  0+
                </span>
                <span className="label">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .funfacts-section {
          position: relative;
          overflow: hidden;
          padding:100px 20px;
          background: white;
        }
          .funfacts-section::before {
  content: '';
  position: absolute;
  top: 0;  /* cambiado */
  left: 0; /* cambiado */
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><path d="M0,300 C200,500 600,100 800,300" fill="none" stroke="%23cc00ff" stroke-width="4"/><path d="M0,400 C200,600 600,200 800,400" fill="none" stroke="%2300ccff" stroke-width="4"/></svg>') no-repeat center center;
  background-size: cover;
  opacity: 0.2; /* un poco más visible */
  pointer-events: none; /* para que no bloquee clicks */
  z-index: 0; /* asegurarse que esté detrás */
}

        .content {
         
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: stretch;
        }

        .image-area {
          flex: 1 1 400px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: translateY(50px);
          opacity: 0;
          transition: all 1s ease;
          padding: 10px;
        }

        .image-area::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle,rgba(204, 0, 255, 0.43), transparent 70%);
          border-radius: 50%;
          top: 10%;
          left: 10%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .image-area.animate {
          transform: translateY(0);
          opacity: 1;
        }

        .image-area img {
          width: 100%;
          border-radius: 10px;
          z-index: 1;
          position: relative;
              margin-right: 100px;
        }

        .text-area {
        width: 40%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
                 /* From https://css.glass */
    background: rgb(238 56 56 / 0%);
border-radius: 16px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.7px);
-webkit-backdrop-filter: blur(6.7px);
border: 1px solid rgba(87, 41, 211, 0.16);
padding:20px
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
          margin-bottom: 30px;
          color: #555;
        }

        .facts-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: space-between;
        }

        .fact-box {
          flex: 1 1 45%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border-top: 2px solid #eee;
          padding-top: 10px;
        }

        .number {
          font-size: 32px;
          font-weight: bold;
          display: block;
        }

        .label {
          font-size: 14px;
          color: #555;
        }

        @media (max-width: 768px) {
         .funfacts-section {
         
         padding: 20px 20px
         }
          .content {
            flex-direction: column;
          }

          .fact-box {
            flex: 1 1 100%;
            align-items: center;
            text-align: center;
          }
            
                  .text-area {
        width: 90%; }
        }

 @media (max-width: 425px) {
 .image-area{
 width: 120%; 
 }
 .funfacts-section {
   padding:20px 20px;
 }
 }

      `}</style>
    </section>
  );
}
