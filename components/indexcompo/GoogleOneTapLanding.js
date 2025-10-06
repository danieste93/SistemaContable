import React from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import Router from 'next/router';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const GoogleOneTapLanding = () => {
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      const decoded = decodeJwt(credentialResponse.credential);
      if(decoded){
        const googledata = await fetch('/users/googleLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decoded),
        });
        const response = await googledata.json();
        if(response.message === "Exito en el registro" || response.message === "Exito en el login"){
          // Replicar estructura de ingreso.js
          const usuario = response.data;
          let localstate = { userReducer: { update: { usuario } } };
          const serializedState = JSON.stringify(localstate);
          localStorage.setItem("state", serializedState);
          // Redirigir según tipo
          if(usuario.user.Tipo === "administrador"){
            Router.push("/usuarios/administrador");
          } else if(usuario.user.Tipo === "vendedor" || usuario.user.Tipo === "tesorero"){
            Router.push("/usuarios/vendedor");
          }
        } else {
          // Si falla, puedes mostrar un mensaje o log
          // alert("Error en el login de Google One Tap");
        }
      }
    },
    onError: () => console.log('One Tap Login Failed'),
  });
  return null;
};

export default GoogleOneTapLanding;
