import { useState, useEffect, useRef } from "react";
import { Switch } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/CheckCircle";
import classNames from "classnames";

const plans = {
  monthly: [
        {
      title: "Free",
      price: "$0",
      access: "Acceso Limitado",
      features: [
        "Gestión de Cuentas",
        "Estadísticas",
        "Personalización"
      ]
    },
       {
      title: "Pro",
      price: "$5",
      access: "Acceso Medio",
      features: [
        "5 Productos o Servicios",
        "Firma electrónica Ecuador P12",
        "Facturación Electrónica ilimitada",
        "Gestión clientes, proveedores",
        "Compras xml automatizado SRI ",
      ]
    },
     {
      title: "ORO",
      price: "$20",
      access: "Acceso Ilimitado",
      features: [
        "Módulo Inventario Full ",
        "3 cuentas para Trabajadores",
        "Punto de venta (POS) ",
        "Soporte Prioritario",
       

      ]
    }
  ],
  yearly: [
    {
      title: "Free",
      price: "$0",
      access: "Acceso Limitado",
      features: [
        "Gestión de Cuentas",
        "Estadísticas",
        "Personalización"
      ]
    },
    {
      title: "Pro",
      price: "$45",
      access: "Acceso Medio",
      features: [
        "5 Productos o Servicios",
        "Firma electrónica Ecuador P12",
        "Facturación Electrónica ilimitada",
        "Gestión clientes, proveedores",
        "Compras xml automatizado SRI ",
      ]
    },
    {
      title: "ORO",
      price: "$200",
      access: "Acceso Ilimitado",
      features: [
        "Módulo Inventario Full ",
        "3 cuentas para Trabajadores",
        "Punto de venta (POS) ",
        "Soporte Prioritario",
        "Tu logo y correo personalizado"

      ]
    }
  ]
};

export default function PricingComponent() {
  const [isYearly, setIsYearly] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);
  const razonableHeaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => containerRef.current && observer.unobserve(containerRef.current);
  }, []);

  const currentPlans = isYearly ? plans.yearly : plans.monthly;

  return (
    <div className="pricing-wrapper" ref={containerRef}>
      <div className="header">
        <h2 ref={razonableHeaderRef} id="razonable-header">Obtengo a un <strong>Precio Razonable</strong></h2>
        <p>Obtén el mejor servicio en base a Calidad / Precio</p>
        <div className="switcher">
          <span>Mensual</span>
          <Switch
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
            color="primary"
          />
          <span>Anual</span>
        </div>
      </div>
      <div className="pricing-grid">
        {currentPlans.map((plan, idx) => (
          <div
            key={idx}
            className={classNames("card", { highlight: idx === 1, visible: inView })}
          >
            <h3>{plan.title}</h3>
            <h2>{plan.price}</h2>
            <p>{plan.access}</p>
            <ul>
              {plan.features.map((feat, i) => (
                <li key={i}><CheckIcon style={{ color: "green" }} /> {feat}</li>
              ))}
            </ul>
            <button onClick={() => window.location.href = '/precios'}>Ver más</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pricing-wrapper {
          text-align: center;
          padding: 4rem 1rem;
          
          background: #fff;
        }
        .header p {
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }
        .switcher {
          margin: 1rem auto;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .pricing-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        .card {
          background: white;
          border-radius: 16px;
          border: 1px solid #eee;
          padding: 2rem;
          width: 280px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }
        .card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .card.highlight {
          border: 2px solid transparent;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          background: linear-gradient(#fff, #fff) padding-box,
                      linear-gradient(to right, #a18cd1, #fbc2eb) border-box;
        }
        .card ul {
          list-style: none;
          padding: 0;
          text-align: left;
          margin: 1rem 0;
        }
        .card li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        button {
          padding: 0.5rem 1.5rem;
          border-radius: 999px;
          border: none;
          background: linear-gradient(to right, #7b61ff, #f857a6);
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
