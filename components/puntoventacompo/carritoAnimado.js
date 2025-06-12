import React, { Component } from 'react';

class Carrito extends Component {
  state = {
    animando: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.ArtVent < this.props.ArtVent) {
      this.setState({ animando: true });
      setTimeout(() => this.setState({ animando: false }), 500);
    }
  }

  render() {
    const { ArtVent } = this.props;
    const { animando } = this.state;

    return (
      <>
        <div className={`carrito ${animando ? 'animar' : ''}`}>
          <i className="material-icons">shopping_cart</i>
          {ArtVent > 0 && (
            <span className="bolita">{ArtVent}</span>
          )}
        </div>

        <style jsx>{`
          .carrito {
          
            position: relative;
            font-size: 30px;
            color: white;
            display:flex;
            transition: transform 0.3s;
            justify-content: flex-end;
          }

          .carrito.animar {
            animation: llegada 0.4s ease;
          }

          @keyframes llegada {
            0% {
              transform: scale(1);
            }
            30% {
              transform: scale(1.3) rotate(-10deg);
            }
            60% {
              transform: scale(1.1) rotate(10deg);
            }
            100% {
              transform: scale(1) rotate(0);
            }
          }

          .bolita {
            position: absolute;
            top: -8px;
            right: -8px;
            background: red;
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 999px;
            animation: aparecer 0.3s ease;
          }

          @keyframes aparecer {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </>
    );
  }
}

export default Carrito;
