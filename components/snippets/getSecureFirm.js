import React from 'react';
import Forge  from 'node-forge';
import CryptoJS from "crypto-js";
import fetchData from '../funciones/fetchdata';

  const decryptData = (text) => {
    try {
      console.log("Intentando desencriptar datos...");
      
      // Validar que tenemos el secret
      if (!process.env.REACT_CLOUDY_SECRET) {
        throw new Error('REACT_CLOUDY_SECRET no está definido');
      }
      
      // Validar que tenemos texto para desencriptar
      if (!text || typeof text !== 'string') {
        throw new Error('Texto de encriptación inválido');
      }
      
      const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      
      // Validar que la desencriptación fue exitosa
      if (!decryptedText) {
        throw new Error('La desencriptación falló - posible clave incorrecta');
      }
      
      const data = JSON.parse(decryptedText);
      console.log("Desencriptación exitosa");
      return data;
      
    } catch (error) {
      console.error('Error en desencriptación:', error);
      throw new Error(`Error al desencriptar: ${error.message}`);
    }
  }; 
       

 const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

       const SecureFirm = async (userReducer) => {
        try {
          const baseData = localStorage.getItem("base64data")
          if(baseData == null){
            console.log("descargando desde cloudi2")

            let firmaDescargada = await fetchData(userReducer,
              "/public/getDbuserData",
              userReducer.update.usuario.user.Firmdata)
      
              console.log(firmaDescargada)
              if(firmaDescargada.status == "Ok"){
                const dataEncripted = CryptoJS.AES.encrypt(
                  JSON.stringify(firmaDescargada.data),
                  process.env.REACT_CLOUDY_SECRET
                  ).toString();

                  localStorage.setItem("base64data", dataEncripted)
                  const bufferfile = base64ToArrayBuffer(firmaDescargada.data);
                  return bufferfile;
               

              }else{
                throw new Error("No se pudo descargar la firma desde Cloudinary");
              }
          
         
       }else{
        console.log("Usando datos en cache, desencriptando...");
        try {
          let FinalFirma = await decryptData(baseData)
          const bufferfile = base64ToArrayBuffer(FinalFirma);
          return bufferfile;
        } catch (decryptError) {
          console.error("Error al desencriptar cache, descargando nuevamente...", decryptError);
          // Si falla la desencriptación, limpiar cache y descargar de nuevo
          localStorage.removeItem("base64data");
          return await SecureFirm(userReducer);
        }
      }
      
      } catch (error) {
        console.error("Error en SecureFirm:", error);
        throw new Error(`Error al obtener bufferfile: ${error.message}`);
      }
      };

      export default SecureFirm