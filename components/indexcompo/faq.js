import { useState } from "react";

const faqs = [
  {
    question: "What should I include in App?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed eiusmod tempor incididunt ut labore. In order to design a mobile app that is going to be module downloaded."
  },
  {
    question: "How does the Moodle app work?",
    answer: "The Moodle app lets you access course content, submit assignments, and interact with others from your mobile device."
  },
  {
    question: "Can users choose to install the app?",
    answer: "Yes, users are given the option to install the app or use the web version directly."
  },
  {
    question: "How do I disable installed apps?",
    answer: "You can disable installed apps through the system settings or application manager."
  }
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container">
    <div className="svg-background" />
        <div className="content">
     
      
      <div className="header">
        <span className="material-icons icon">supervised_user_circle</span>
        <div>
          <h2>Learn about <strong>features</strong> from FAQ!</h2>
          <p className="subtitle">As a SAAS web crawler expert, I help organizations to the expanding significance of internet promoting.</p>
        </div>
      </div>
      <div className="accordion">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggle(index)}
          >
            <div className="question">
              <span className="material-icons">{activeIndex === index ? "remove_circle" : "add_circle"}</span>
              <h4>{faq.question}</h4>
            </div>
            <div className="answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
      <style jsx>{`
        .faq-container {
          position: relative;
        display: flex
;
    justify-content: center;
    align-items: center;
      
          color: #000;
          font-family: 'Arial', sans-serif;
           background-image: url('/static/landing/waves.svg');
  background-size: contain;    /* o contain, o auto según necesites */
  background-repeat: no-repeat;

    
        }
          .content{
              width: 70%;
    max-width: 800px;
    margin-top: 50px;
    padding: 50px 0px;
    }

        .header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .icon {
          font-size: 40px;
          color: white
        }

        h2 {
          font-size: 2rem;
          margin: 0;
        }

        .subtitle {
          font-size: 0.9rem;
          color: #666;
          max-width: 400px;
        }

        .accordion {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          padding: 5px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .faq-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .faq-item.active {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.02);
        }

        .question {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .question .material-icons {
          font-size: 24px;
          color: #7b61ff;
        }

        .answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease;
          width: 80%;
    text-align: justify;
    margin: auto;
        }

        .faq-item.active .answer {
          margin-top: 0.5rem;
          max-height: 200px;
        }

        .svg-background {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        background: radial-gradient(circle at 15% 20%, rgba(255, 0, 255, 0.2), #00000000 60%), radial-gradient(circle at 85% 70%, rgb(0 128 255 / 26%), transparent 50%), linear-gradient(to bottom right, #f0f4ff 0%, #f5faff 100%);
    background-repeat: no-repeat;
      background-size: cover;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.2));
        }

        @media (max-width: 768px) {
          .faq-container {
            padding: 1rem;
          }
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .subtitle {
            max-width: 100%;
          }
            .faq-container{
                background-size: auto;
            }
        }
      `}</style>
    </div>
  );
}
