import React, { useRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const LoginGoogle = ({ onResult, onClick, getError }) => {
  const timeoutRef = useRef(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      clearTimeout(timeoutRef.current); // ✔️ Cancelar timeout
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userInfo = await res.json();
        console.log('👤 Usuario:', userInfo);

        const googledata = await fetch('/users/googleLogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });

        const sendData = await googledata.json();
        onResult(sendData);

      } catch (err) {
        getError && getError(err);
        console.error('❌ Error obteniendo datos del usuario', err);
      }
    },

    onError: (err) => {
      clearTimeout(timeoutRef.current); // ✔️ Cancelar timeout
      getError && getError(err);
      console.error('❌ Error al iniciar sesión con Google', err);
    },

    flow: 'implicit',
  });

  const handleClick = () => {
    // ✔️ Inicia el timeout de 10 segundos
    timeoutRef.current = setTimeout(() => {
      getError && getError(new Error('⏳ El usuario no completó el login o cerró la ventana'));
    }, 10000);

    login();
    if (onClick) onClick();
  };

  return (
    <div>
      <span onClick={handleClick} className="btn btn-google">
        <img className='googleimg' src="/icons/google.png" alt="Google" />
      </span>
      <style jsx>{`
        .btn-google {
          width: 35px;
          background: #ffffff;
          padding: 5px;
          display: flex;
          border: 1px solid white;
          border-radius: 50%;
        }
        .googleimg {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default LoginGoogle;
