import { useState } from "react";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [tweetIndex, setTweetIndex] = useState(0);
  const tweets = [
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt. 4",
    "Doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
  ];

  const handleSubscribe = () => {
    alert(`Subscribed with: ${email}`);
  };

  const handleTweetChange = (direction) => {
    const tweetsEl = document.querySelector('.tweet-text');
    tweetsEl.classList.add('slide-out');

    setTimeout(() => {
      setTweetIndex((prev) => (prev + direction + tweets.length) % tweets.length);
      tweetsEl.classList.remove('slide-out');
      tweetsEl.classList.add('slide-in');
    }, 300);

    setTimeout(() => {
      tweetsEl.classList.remove('slide-in');
    }, 600);
  };

  return (
    <div className="subscribe-container">
<div class="curve-container">
  <svg viewBox="0 0 100 10" preserveAspectRatio="none">
    <path d="M0,10 Q50,0 100,10 L100,0 L0,0 Z" fill="lightgrey"/>
  </svg>
</div>

      <div className="newsletter">
        <h2>Subscribe to Our Newsletter</h2>
        <p>
          A Private Limited is the most popular type of partnership Malta. The limited
          liability is, in fact, the only type of company allowed by Companies.
        </p>
        <div className="subscribe-box">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      </div>

      <footer className="footer">
     <div className="footer-section logo-section">
          
          <img className="logof" src="/static/logo1.png" alt="logo" />
          <p>
            Be the first to find out about exclusive deals, the latest Lookbooks trends.
            We’re on a mission to build a better future where technology.
          </p>
          <div className="social-icons">
          <img src="/static/landing/icons8-youtube.svg" alt="youtube" />
          <img src="/static/landing/icons8-facebook.svg" alt="facebook" />
          <img src="/static/landing/icons8-instagram.svg" alt="instagram" />
          </div>
        </div>
        <div className="footer-section address-section basedmargin">
          <h4>Address</h4>
          <p>Phone: +1 605 722 2032</p>
          <p>Email: example@mail.com</p>
          <p>Charlotte, North Carolina, United States</p>
        </div>

        <div className="footer-section quick-links basedmargin">
          <h4>Quick Links</h4>
          <p>Privacy Policy</p>
          <p>About Us</p>
          <p>Contact Us</p>
        </div>

        <div className="footer-section twitter-section basedmargin">
          <h4>Twitter</h4>
          <div className="tweet">
            <p className="tweet-text">{tweets[tweetIndex]}</p>
          </div>
          <div className="tweet-nav">
            <button onClick={() => handleTweetChange(-1)}> {"<"} </button>
            <button onClick={() => handleTweetChange(1)}> {">"} </button>
          </div>
        </div>

      </footer>

      <div className="copyright-bar">
        &copy; 2025 Trademark JWdevelopment. All rights reserved.
      </div>

      <style jsx>{`
        .subscribe-container {
        
          text-align: center;
       
        }
          

          .newsletter{
          margin-bottom:50px
          }
 
        .newsletter h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
.logof{
width:90px;
margin:20px
}
        .newsletter p {
          color: #666;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .subscribe-box {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          background: #fff;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          padding: 1rem 1.5rem;
          border-radius: 50px;
          max-width: 600px;
          margin: 0 auto;
        }

        .subscribe-box input {
          border: none;
          outline: none;
          flex: 1;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: 50px;
        }

        .subscribe-box button {
          background: linear-gradient(to right, #007bff, #f41fbf);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
        }

        .footer {
          display: flex;
              justify-content: space-around;
          flex-wrap: wrap;

        
        }

        .footer-section {
            width: 100%;
    min-width: 200px;
    max-width: 300px;
    margin: 10px;
    
        }

        .logo-section .logo {
          font-size: 1.5rem;
          color: #7b61ff;
        }
          .logo-section p{
          text-align:justify
          }

        .social-icons {
          display: flex;
         justify-content:space-around;
        margin-top:20px
        }

        .material-icons {
          font-size: 20px;
          color: #555;
        }

        .tweet-text {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .slide-out {
          transform: translateX(-100%);
          opacity: 0;
        }

        .slide-in {
          transform: translateX(100%);
          opacity: 0;
        }

        .tweet-nav button {
          margin-top: 0.5rem;
          margin-right: 0.5rem;
          background: transparent;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
        }

        .copyright-bar {
          background: #111;
          color: white;
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
        }
           .basedmargin{
          margin-top:90px
          }
          .curve-container {
  width: 100%;
  height: 20px; /* ajusta la altura aquí */
  overflow: hidden;
}

.curve-container svg {
  width: 100%;
  height: 100%;
  display: block;
}

        @media (max-width: 768px) {
          .subscribe-box {
            flex-direction: column;
          }
             .basedmargin{
          margin-top:20px
          }

          .subscribe-box input,
          .subscribe-box button {
            width: 100%;
          }

          .footer {
       
            align-items: center;
          }

          .footer-section {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
