import React from 'react';
import Forge  from 'node-forge';
import CryptoJS from "crypto-js";
const getSignature=(url, key, name)=>{
        let sha1_base64=(txt)=> {
          let md = Forge.md.sha1.create();
          md.update(txt,"utf8");
          return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
          }
      let stringdata = name +""+key 
      let base64 = sha1_base64(stringdata)
      
      let signature = `s--${base64.slice(0, 8)}--` 
      let chanceUrl = url.replace("x-x-x-x",signature)
      let secureUrl = chanceUrl.replace("y-y-y-y",process.env.REACT_CLOUDY_CLOUDNAME)

      return secureUrl
      }
  const decryptData = (text) => {
           
            const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_CLOUDY_SECRET);
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
           
            return (data)
          }; 
       const SecureFirm = async (firmadata) => {

        const baseData = localStorage.getItem("base64data")
        if(baseData == null){
        const GeneratedURL = getSignature(
          firmadata.url,
          process.env.REACT_CLOUDY_SECRET,
          firmadata.publicId
        );
      
        // Realiza la solicitud fetch y obtiene el blob
        const response = await fetch(GeneratedURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-pkcs12',
          },
        });
      
        const blob = await response.blob();

        let readerSave = new FileReader();
        readerSave.readAsDataURL(blob); 
        readerSave.onloadend = ()=> {
        let base64data = readerSave.result;                

        const dataEncripted = CryptoJS.AES.encrypt(
        JSON.stringify(base64data),
        process.env.REACT_CLOUDY_SECRET
        ).toString();




        localStorage.setItem("base64data", dataEncripted)
        }

        // Convierte el blob a un ArrayBuffer usando FileReader encapsulado en una promesa
        const bufferfile = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onloadend = () =>      resolve(reader.result)

          reader.onerror = () => reject(new Error('Error al leer el blob'));
        });
      
        return bufferfile;
     }else{
        console.log("esta bien guardado")
        let base64Decript = decryptData(baseData)
        const response = await fetch(base64Decript, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-pkcs12',
            },
          });
          const blob = await response.blob();
     

          const bufferfile = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Error al leer el blob'));
          });
          console.log(bufferfile)
          return bufferfile;
      }
      };

      export default SecureFirm