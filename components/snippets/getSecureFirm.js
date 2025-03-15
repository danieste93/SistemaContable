import React from 'react';
import Forge  from 'node-forge';
import CryptoJS from "crypto-js";
import fetchData from '../funciones/fetchdata';

  const decryptData = (text) => {
           
            const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
           
            return (data)
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
      let FinalFirma = await decryptData(baseData)
      const bufferfile = base64ToArrayBuffer(FinalFirma);
      return bufferfile;
   
    
      }
      };

      export default SecureFirm