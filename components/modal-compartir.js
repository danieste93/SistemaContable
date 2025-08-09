import React, { Component } from 'react'



class ModalCompartir extends Component {
  componentDidMount() {
    setTimeout(() => {
      document.getElementById('mainxx').classList.add("entradaaddc")
    }, 200);
  }

  Onsalida = () => {
    document.getElementById('mainxx').classList.remove("entradaaddc")
    setTimeout(() => {
      this.props.Flecharetro()
    }, 400);
  }

  // Descargar el PDF desde base64
  handleDescargar = () => {
    const base64 = this.props.data;
    if (!base64) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = "comprobante.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compartir por WhatsApp
  handleWhatsapp = () => {
    const url = "https://activos.ec/comprobante-ficticio"; // URL ficticia
    window.open(`https://wa.me/?text=Consulta tu comprobante aquí: ${url}`, "_blank");
  };

  // Compartir por Messenger
  handleMessenger = () => {
    const url = "https://activos.ec/comprobante-ficticio"; // URL ficticia
    window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=123456789&redirect_uri=${url}`, "_blank");
  };

  // Compartir por Instagram (solo puede copiar el link)
  handleInstagram = () => {
    const url = "https://activos.ec/comprobante-ficticio"; // URL ficticia
    navigator.clipboard.writeText(url);
    this.setState({
      alerta: "Enlace copiado para Instagram"
    });
    setTimeout(() => this.setState({ alerta: "" }), 2000);
  };

  state = {
    alerta: ""
  };

  render () {

   
        return ( 

         <div >

<div className="maincontacto" id="mainxx" >
<div className="contcontactov2"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
              <div className="tituloventa">
                <span style={{ color: "#1976d2" }}>Compartir Comprobante</span>
              </div>
            </div> 
            <div className="panel-compartir">
              <div className="compartir-row">
                <button className="compartir-btn whatsapp" onClick={this.handleWhatsapp}>
                  <span className="material-icons">whatsapp</span>
                  WhatsApp
                </button>
                <button className="compartir-btn messenger" onClick={this.handleMessenger}>
                  <span className="material-icons">facebook</span>
                  Messenger
                </button>
                <button className="compartir-btn instagram" onClick={this.handleInstagram}>
                  <span className="material-icons">link</span>
                  Instagram
                </button>
                <button className="compartir-btn descargar" onClick={this.handleDescargar}>
                  <span className="material-icons">download</span>
                  Descargar PDF
                </button>
              </div>
              {this.state.alerta && (
                <div className="alerta-copiado">
                  {this.state.alerta}
                </div>
              )}
              <div className="preview-pdf">
                <iframe
                  title="Vista previa PDF"
                  src={`data:application/pdf;base64,${this.props.data}`}
                  width="100%"
                  height="300px"
                  style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx >{`
           .maincontacto{
              z-index: 1299;
         width: 98.5vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.7);
         left: -100%;
         position: fixed;
         top: 0px;
         display: flex;
         justify-content: center;
         align-items: center;
         transition:0.5s;
       
            
            }

            .contcontactov2{
               border-radius: 12px;
      width: 90vw;
      max-width: 500px;
        background-color: #fff;
        padding: 20px 24px;
        position:absolute;
     
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
                cursor: pointer;
              }
              .entradaaddc{
                left: 0%;
                }

                .headercontact {

                  display:flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                  margin-bottom: 12px;
                  }
                  .tituloventa{
                    display: flex;
                    align-items: center;
                    font-size: 28px;
                    font-weight: bolder;
                    text-align: center;
                    justify-content: center;
                    color: #1976d2;
                    }
                    .panel-compartir {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 10px;
          }
          .compartir-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
            margin-bottom: 18px;
          }
          .compartir-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 500;
            border: none;
            border-radius: 8px;
            padding: 12px 18px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
            transition: background 0.2s, color 0.2s;
          }
          .compartir-btn.whatsapp {
            background: #25D366;
            color: white;
          }
          .compartir-btn.whatsapp:hover {
            background: #128C7E;
          }
          .compartir-btn.messenger {
            background: #0084FF;
            color: white;
          }
          .compartir-btn.messenger:hover {
            background: #005ecb;
          }
          .compartir-btn.instagram {
            background: linear-gradient(90deg, #fd5, #f5438a, #1fa2ff);
            color: white;
          }
          .compartir-btn.instagram:hover {
            background: linear-gradient(90deg, #f5438a, #fd5, #1fa2ff);
          }
          .compartir-btn.descargar {
            background: #1976d2;
            color: white;
          }
          .compartir-btn.descargar:hover {
            background: #1565c0;
          }
          .alerta-copiado {
            margin: 10px 0;
            color: #388e3c;
            background: #e8f5e9;
            border-radius: 6px;
            padding: 8px 16px;
            font-weight: 500;
            text-align: center;
          }
          .preview-pdf {
            margin-top: 18px;
            width: 100%;
            min-height: 300px;
            background: #f5f5f5;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(25, 118, 210, 0.06);
            display: flex;
            justify-content: center;
            align-items: center;
          }
           `}</style>
        

          
           </div>
        )
    }
}

export default ModalCompartir