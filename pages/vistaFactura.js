import React, { useEffect, useState } from "react";
import factData from "../public/static/FactTemplate"; // Asegúrate de que exporte una función que devuelve un string HTML

const VistaFacturaPage = () => {
  const [htmlFactura, setHtmlFactura] = useState("");

  useEffect(() => {
    const datosEjemplo = {
      nombreComercial: "Empresa XYZ S.A.",
      razonSocialComprador: "Juan Pérez",
      identificacionComprador: "0102030405",
      correoComprador: "juan@example.com",
      direccionComprador: "Av. Amazonas N34",
      ciudadComprador: "Quito",
      SuperTotal: 250.75,
      baseImpoConImpuestos: 180.0,
      baseImpoSinImpuestos: 50.0,
      IvaEC: 20.75,
      ruc: "1790010010001",
      fechaEmision: "06/08/2025",
      estab: "001",
      ptoEmi: "002",
      secuencial: "000012345",
      rimpeval: true,
      populares: false,
      dirEstablecimiento: "Av. República 123",
      Estado: "AUTORIZADO",
      detalles: "Factura de ejemplo generada para revisión",
      fechaAuto: "06/08/2025",
      numeroAuto: "1234567890",
      ClaveAcceso: "0123456789012345678901234567890123456789012345678",
      obligadoContabilidad: "NO",
      LogoEmp: "https://via.placeholder.com/100x50.png?text=LOGO",
      adicionalInfo: [
        {
          clave: "Dirección",
          valor: "Av. 10 de Agosto N34-56"
        },
        {
          clave: "Teléfono",
          valor: "(02) 123-4567"
        }
      ],
      ArticulosVendidos: [
        {
          Titulo: "Producto A",
          CantidadCompra: 2,
          PrecioVendido: 45.0,
          PrecioCompraTotal: 90.0,
          Iva: true
        },
        {
          Titulo: "Producto B",
          CantidadCompra: 1,
          PrecioVendido: 100.75,
          PrecioCompraTotal: 100.75,
          Iva: false
        }
      ],
      Fpago : [
  {
    Tipo: "Efectivo",
    Cantidad: 2.5,
    Cuenta: {
      NombreC: "Caja Chica",
      FormaPago: "Efectivo",
      urlIcono: "https://res.cloudinary.com/registrocontabledata/image/upload/v1750371412/iglassEcuador-31799/Personalizacion/mbef2efom0yjhdy6kclv.jpg"
    },
    Id: "FP-998",
    Detalles: ""
  },
  {
    Tipo: "Transferencia",
    Cantidad: 2.5,
    Cuenta: {
      NombreC: "Pichincha",
      FormaPago: "Transferencia",
      urlIcono: "https://res.cloudinary.com/registrocontabledata/image/upload/v1708248466/owsfpfx3gaxi1fcldji7.png"
    },
    Id: "FP-2",
    Detalles: ""
  },
  {
    Tipo: "Tarjeta-de-Debito",
    Cantidad: 2.5,
    Cuenta: {
      NombreC: "American Express",
      FormaPago: "Tarjeta-de-Debito",
      urlIcono: "/iconscuentas/amex.png"
    },
    Id: "FP-776",
    Detalles: ""
  },
  {
    Tipo: "Tarjeta-de-Credito",
    Cantidad: 2.5,
    Cuenta: {
      NombreC: "Mastercard Black💳",
      FormaPago: "Tarjeta-de-Credito",
      urlIcono: "/iconscuentas/mastercard.png"
    },
    Id: "FP-281",
    Detalles: ""
  }
]
    };

    const html = factData(  datosEjemplo ); // Llama a tu plantilla
    setHtmlFactura(html);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Vista previa de la Factura</h2>
      {htmlFactura ? (
        <iframe
          title="Factura Preview"
          srcDoc={htmlFactura}
          style={{
            width: "100%",
            height: "1000px",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default VistaFacturaPage;
