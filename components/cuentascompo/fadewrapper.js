import React, { Component } from 'react';

class FadeWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.show,
      shouldRender: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      if (this.props.show) {
        // Mostrar directamente
        this.setState({ isVisible: true, shouldRender: true });
      } else {
        // Iniciar animación de salida
        this.setState({ isVisible: false });
      }
    }
  }

  handleAnimationEnd = () => {
    if (!this.state.isVisible) {
      // Al terminar fade-out, ocultar con display: none
      this.setState({ shouldRender: false });
    }
  };

  render() {
    const { isVisible, shouldRender } = this.state;
    const { children } = this.props;

    return (
      <div
        className={isVisible ? 'fade-in' : 'fade-out'}
        onAnimationEnd={this.handleAnimationEnd}
        style={{ display: shouldRender ? 'block' : 'none' }}
      >
        {children}

        <style jsx>{`
          .fade-in {
            animation: fadeIn 0.4s forwards;
          }

          .fade-out {
            animation: fadeOut 0.4s forwards;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
        `}</style>
      </div>
    );
  }
}

export default FadeWrapper;
