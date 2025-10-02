import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { updateUser } from '../reduxstore/actions/myact';

export default function GmailCallback() {
  const router = useRouter();
  const dispatch = useDispatch();

  const redirectedRef = useRef(false);
  useEffect(() => {
    // Bandera persistente para evitar reintentos y bucles infinitos
    if (sessionStorage.getItem('gmailCallbackProcessed')) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        router.replace('/inventario');
      }
      return;
    }
    sessionStorage.setItem('gmailCallbackProcessed', 'true');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const userId = localStorage.getItem('gmailUserId');
    console.log('GmailCallback - code:', code, 'userId:', userId);
    if (code && userId) {
      fetch(`/api/correo/oauth2callback?code=${code}&userId=${userId}`)
        .then(res => {
          if (!res.ok) {
            // Error 500, no redirigir automáticamente
            localStorage.removeItem('gmailUserId');
            sessionStorage.removeItem('gmailCallbackProcessed');
            console.error('Error en la autorización Gmail:', res.status);
            return;
          }
          return res.json();
        })
        .then(data => {
          localStorage.removeItem('gmailUserId');
          if (data && data.user) {
            // Actualiza el usuario en Redux con el token
            dispatch(updateUser({ usuario: data.user }));
            if (!redirectedRef.current) {
              redirectedRef.current = true;
              sessionStorage.removeItem('gmailCallbackProcessed');
              router.replace('/inventario');
            }
          }
        })
        .catch(err => {
          localStorage.removeItem('gmailUserId');
          sessionStorage.removeItem('gmailCallbackProcessed');
          console.error('Error en la autorización Gmail:', err.message);
        });
    } else {
      localStorage.removeItem('gmailUserId');
      sessionStorage.removeItem('gmailCallbackProcessed');
      console.error('Faltan datos para completar la autorización Gmail.', code, userId);
    }
    // No limpiar bandera en desmontaje, solo si la navegación fue exitosa o error
  }, [router]);

  return <div>Procesando autorización de Gmail...</div>;
}
