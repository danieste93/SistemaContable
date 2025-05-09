import { useState, useEffect, useRef } from "react";
import { Switch } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/CheckCircle";
import classNames from "classnames";

const plans = {
  monthly: [
    {
      title: "Free",
      price: "$0",
      access: "Limited Access",
      features: [
        "100 GB Disk Space",
        "1 Sub domain",
        "3 Email Accounts"
      ]
    },
    {
      title: "Popular",
      price: "$29",
      access: "Limited Access",
      features: [
        "1000 GB Disk Space",
        "5 Sub domains",
        "10 Email Accounts",
        "1 Year License"
      ]
    },
    {
      title: "Entrepreneurs",
      price: "$49",
      access: "Unlimited Access",
      features: [
        "2000 GB Disk Space",
        "10 Sub domains",
        "15 Email Accounts",
        "Priority Support"
      ]
    }
  ],
  yearly: [
    {
      title: "Free",
      price: "$0",
      access: "Limited Access",
      features: [
        "120 GB Disk Space",
        "2 Sub domains",
        "5 Email Accounts"
      ]
    },
    {
      title: "Popular",
      price: "$279",
      access: "Limited Access",
      features: [
        "1200 GB Disk Space",
        "6 Sub domains",
        "12 Email Accounts",
        "1 Year License"
      ]
    },
    {
      title: "Entrepreneurs",
      price: "$499",
      access: "Unlimited Access",
      features: [
        "3000 GB Disk Space",
        "15 Sub domains",
        "20 Email Accounts",
        "Phone & Mail Support"
      ]
    }
  ]
};

export default function PricingComponent() {
  const [isYearly, setIsYearly] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

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
        <h2>Get in <strong>Reasonable Price</strong></h2>
        <p>A Private Limited is the most popular type of partnership Malta...</p>
        <div className="switcher">
          <span>Monthly</span>
          <Switch
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
            color="primary"
          />
          <span>Yearly</span>
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
            <button>Get Started</button>
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
