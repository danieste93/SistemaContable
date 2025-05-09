import React from 'react';

const WhyChooseApp = () => {
  return (
    <section className="why-choose-app">
      <div className="background-left"></div>
      <div className="background-right"></div>

      <div className="content">
        <div className="features">
          <div className="feature">
            
            <div>
              <h3>Bug free</h3>
              <p>As a web crawler expert, I help organizations adjust to the expanding significance of internet promoting.</p>
            </div>
            <div className="icon-circle">
              <span>🐞</span>
            </div>
          </div>

          <div className="feature">
      
            <div>
              <h3>Well Organized</h3>
              <p>As a web crawler expert, I help organizations adjust to the expanding significance of internet promoting.</p>
            </div>
            <div className="icon-circle">
              <span>🗂️</span>
            </div>
          </div>

          <div className="feature" >
        
            <div >
              <h3>Clean coding</h3>
              <p>As a web crawler expert, I help organizations adjust to the expanding significance of internet promoting.</p>
            </div>
            <div className="icon-circle">
              <span>💻</span>
            </div>
          </div>
        </div>

        <div className="phone-preview">
          <h2>Why will you choose our app?</h2>
          <img src="/static/landing/bm1.webp" alt="App Preview" className="telefonoimg" />
           
        </div>
      </div>

      <style jsx>{`
      .telefonoimg{
       width: 70%;
      }
        .why-choose-app {
          position: relative;
          overflow: hidden;
          padding: 60px 20px;
          background: #f7f7f7;
        }

        .background-left {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: radial-gradient(circle at left, rgba(230,230,230,0.6), transparent 70%);
          background-size: 20px 20px;
          mask-image: radial-gradient(circle, white 60%, transparent 100%);
          z-index: 0;
        }

        .background-right {
          position: absolute;
          top: -20%;
          right: -20%;
          width: 70%;
          height: 140%;
          background: radial-gradient(circle at center, #a500ff, #00c6ff);
          border-radius: 50%;
          opacity: 0.7;
          z-index: 0;
        }

        .content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-around;
          max-width: 1200px;
          margin: auto;
          z-index: 1;
          flex-wrap: wrap;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 500px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 20px;
          /* From https://css.glass */
background: rgba(87, 41, 211, 0.1);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.7px);
-webkit-backdrop-filter: blur(6.7px);
border: 1px solid rgba(87, 41, 211, 0.16);
padding:10px
        }
          

        .icon-circle {
         padding:10px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }

        .feature h3 {
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 600;
        }

        .feature p {
          margin: 0;
          color: black;
          font-size: 14px;
        }

        .phone-preview {
          text-align: center;
          max-width: 400px;
           display:flex;
           justify-content:space-beetween;
           align-items:center;

        }

        .phone-preview h2 {
          color: black;
          font-size: 2.5rem;
          margin-bottom: 20px;
           min-width: 200px;
           border:1px solid green.
        }

        .phone-mockup {
          width: 200px;
          height: 400px;
          background: white;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          background: linear-gradient(to bottom, #2d2dff, #ff4f81);
        }

        @media (max-width: 768px) {
          .content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .features {
            align-items: center;
          }
            .phone-preview{
            display:block
            }
            
        }
      `}</style>
    </section>
  );
};

export default WhyChooseApp;
