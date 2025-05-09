export default function BackgroundAbstract() {
    return (
      <div className="backgroundContainer">
        <svg
          className="backgroundSvg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="100" />
            </filter>
          </defs>
  
          {/* Humo azul grisáceo */}
          <circle cx="400" cy="300" r="250" fill="#b0c4de" filter="url(#blur)" />
          <circle cx="1000" cy="500" r="200" fill="#a0b8d0" filter="url(#blur)" />
  
          {/* Líneas abstractas blancas suaves */}
          <path
            fill="none"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="1"
            d="M0,200 C300,100 600,300 900,200 C1200,100 1440,300 1440,200"
          />
          <path
            fill="none"
            stroke="white"
            strokeOpacity="0.15"
            strokeWidth="1"
            d="M0,400 C300,300 600,500 900,400 C1200,300 1440,500 1440,400"
          />
        </svg>
  
        <style jsx>{`
          .backgroundContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
            pointer-events: none;
          }
          .backgroundSvg {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
  