import React, { useState, useEffect } from 'react';

const Typewriter = ({ words, typingSpeed = 50, pauseTime = 2000, deletingSpeed = 35 }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  // Validación mejorada para evitar errores
  const safeWords = words && Array.isArray(words) && words.length > 0 ? words : ['Cargando...'];

  useEffect(() => {
    // Validación adicional dentro del useEffect
    if (!safeWords || safeWords.length === 0) return;
    
    const currentWord = safeWords[wordIndex] || '';
    let timer;

    if (isDeleting) {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, deletingSpeed);
      } else {
        // Cuando termina de borrar, pasamos a la siguiente palabra
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % safeWords.length);
      }
    } else {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, typingSpeed);
      } else {
        // Cuando termina de escribir, esperamos antes de borrar
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, safeWords, typingSpeed, deletingSpeed, pauseTime]);

  return (<div className='contData'>
    <span className='title'> Dinero </span>
      <span  className="contMaquina">{text}</span>
     
     <style jsx>{`
     .contData{
     margin-bottom: 2rem;
     
     }
     .contMaquina{
         font-weight: bold;
    font-size: 3.5rem;
    color: black;
    height: 50px;
    margin-left: 3px;
     }
     .title {
                    font-size: 3.5rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }


                 @media (max-width: 768px) {
                         .contMaquina {
                    font-size: 2.5rem;
                
                }

                         .title {
                    font-size: 2.5rem;
                
     }
                    }
    @media (max-width: 425px) {
          .contMaquina {
                    font-size: 2rem;
                
                }
            .title {
                    font-size: 2rem;
                
                }
    }
     `}
         </style>
      </div>

  );
};

export default Typewriter;
