
import React from 'react';
import ReactDOM from 'react-dom';
import Forge  from 'node-forge';
import moment from "moment";
import "moment/locale/es";
import converter from "hex2dec"
const Demo=(Comprobante, archivop12, pass)=>
{
    
let FirmarComprobante=(mi_contenido_p12, mi_pwd_p12, comprobante) =>{
   console.log(mi_contenido_p12)

try{


    let issuerName= ""
    let arrayUint8 = new Uint8Array(mi_contenido_p12);
 
    let p12B64 = Forge.util.binary.base64.encode(arrayUint8);
    let p12Der = Forge.util.decode64(p12B64);
    let p12Asn1 = Forge.asn1.fromDer(p12Der);
  
    let p12 = Forge.pkcs12.pkcs12FromAsn1(p12Asn1, mi_pwd_p12);
 
  
    let certBags = p12.getBags({bagType:Forge.pki.oids.certBag})
    let cert
    let pkcs8bags = p12.getBags({bagType:Forge.pki.oids.pkcs8ShroudedKeyBag});
    let pkcs8 
   
   var signaturesQuantity = certBags[Forge.oids.certBag];
   //console.log(signaturesQuantity)

for (let z = 0 ;z<signaturesQuantity.length;z++){
  
    if(signaturesQuantity[z].attributes.friendlyName){
  
    var entidad = signaturesQuantity[z].attributes.friendlyName[0];
    

    if (/BANCO CENTRAL/i.test(entidad)) {   

       
       // issuerName
        issuerName = 'CN=AC BANCO CENTRAL DEL ECUADOR,L=QUITO,OU=ENTIDAD DE CERTIFICACION DE INFORMACION-ECIBCE,O=BANCO CENTRAL DEL ECUADOR,C=EC';
     break
    
    }else if(/SECURITY DATA/i.test(entidad)){
       
       issuerName = 'CN=AUTORIDAD DE CERTIFICACION SUBCA-2 SECURITY DATA,OU=ENTIDAD DE CERTIFICACION DE INFORMACION,O=SECURITY DATA S.A. 2,C=EC';
       break
    }else if(/ArgosData/i.test(entidad)){
       
        issuerName = 'CN=ArgosData CA 1 - SHA256,OU=ArgosData CA,O=ArgosData,C=EC';

 break
    }
    else if(/CONSEJO DE LA JUDICATURA/i.test(entidad)){
       

       
       issuerName = 'CN=ENTIDAD DE CERTIFICACION ICERT-EC,OU=SUBDIRECCION NACIONAL DE SEGURIDAD DE LA INFORMACION DNTICS,O=CONSEJO DE LA JUDICATURA,L=DM QUITO,C=EC';
    }

} else {
       

   issuerName = 'CN=ENTIDAD DE CERTIFICACION ICERT-EC,OU=SUBDIRECCION NACIONAL DE SEGURIDAD DE LA INFORMACION DNTICS,O=CONSEJO DE LA JUDICATURA,L=DM QUITO,C=EC';
}
}
for (let z = 0 ;z<signaturesQuantity.length;z++){
    if(signaturesQuantity[z].cert.extensions[0].digitalSignature == true){
       
        cert = certBags[Forge.oids.certBag][z].cert;
        pkcs8 = pkcs8bags[Forge.oids.pkcs8ShroudedKeyBag][z];
      
     }
}

    let key = pkcs8.key;
    let X509SerialNumber = converter.hexToDec(cert.serialNumber)  


    if( key == null ) {
        key = pkcs8.asn1;
    }

    let certificateX509_pem = Forge.pki.certificateToPem(cert);

    let certificateX509 = certificateX509_pem;
    certificateX509 = certificateX509.substr( certificateX509.indexOf('\n') );
    certificateX509 = certificateX509.substr( 0, certificateX509.indexOf('\n-----END CERTIFICATE-----') );

    certificateX509 = certificateX509.replace(/\r?\n|\r/g, '').replace(/([^\0]{76})/g, '$1\n');

    //Pasar certificado a formato DER y sacar su hash:
   let certificateX509_asn1 = Forge.pki.certificateToAsn1(cert);
    let certificateX509_der = Forge.asn1.toDer(certificateX509_asn1).getBytes();

    

   let certificateX509_der_hash =  sha1_base64(certificateX509_der);



    //Serial Number
  
  

   let exponent =  hexToBase64(key.e.data[0].toString(16));            
   let modulus =  bigint2base64(key.n);


    let sha1_comprobante =  sha1_base64UTF8(comprobante);

    let xmlns = 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';


    //numeros involucrados en los hash:
    
    //let Certificate_number = 1217155;//p_obtener_aleatorio(); //1562780 en el ejemplo del SRI
    let Certificate_number =  p_obtener_aleatorio(); //1562780 en el ejemplo del SRI
    
    //let Signature_number = 1021879;//p_obtener_aleatorio(); //620397 en el ejemplo del SRI
    let Signature_number =  p_obtener_aleatorio();;//620397 en el ejemplo del SRI
    
    //let SignedProperties_number = 1006287;//p_obtener_aleatorio(); //24123 en el ejemplo del SRI
    let SignedProperties_number =  p_obtener_aleatorio(); //24123 en el ejemplo del SRI

    //numeros fuera de los hash:
    
    //let SignedInfo_number = 696603;// (); //814463 en el ejemplo del SRI
    let SignedInfo_number = p_obtener_aleatorio();//814463 en el ejemplo del SRI
    
    //let SignedPropertiesID_number = 77625;//p_obtener_aleatorio(); //157683 en el ejemplo del SRI
    let SignedPropertiesID_number = p_obtener_aleatorio(); //157683 en el ejemplo del SRI
    
    //let Reference_ID_number = 235824;//p_obtener_aleatorio(); //363558 en el ejemplo del SRI
    let Reference_ID_number = p_obtener_aleatorio();;//363558 en el ejemplo del SRI
    
    //let SignatureValue_number = 844709;//p_obtener_aleatorio(); //398963 en el ejemplo del SRI
    let SignatureValue_number =  p_obtener_aleatorio();; //398963 en el ejemplo del SRI
    
    //let Object_number = 621794;//p_obtener_aleatorio(); //231987 en el ejemplo del SRI
    let Object_number =  p_obtener_aleatorio();//231987 en el ejemplo del SRI



    let SignedProperties = '';

    SignedProperties += '<etsi:SignedProperties Id="Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';  //SignedProperties
        SignedProperties += '<etsi:SignedSignatureProperties>';
            SignedProperties += '<etsi:SigningTime>';

             //   SignedProperties += '2022-12-21T22:40:17-05:00';//moment().format('YYYY-MM-DD\THH:mm:ssZ');
                SignedProperties += moment().format('YYYY-MM-DD\THH:mm:ssZ');

            SignedProperties += '</etsi:SigningTime>';
            SignedProperties += '<etsi:SigningCertificate>';
                SignedProperties += '<etsi:Cert>';
                    SignedProperties += '<etsi:CertDigest>';
                        SignedProperties += '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
                        SignedProperties += '</ds:DigestMethod>';
                        SignedProperties += '<ds:DigestValue>';

                            SignedProperties += certificateX509_der_hash;

                        SignedProperties += '</ds:DigestValue>';
                    SignedProperties += '</etsi:CertDigest>';
                    SignedProperties += '<etsi:IssuerSerial>';
                        SignedProperties += '<ds:X509IssuerName>';
                            SignedProperties += issuerName;
                        SignedProperties += '</ds:X509IssuerName>';
                    SignedProperties += '<ds:X509SerialNumber>';

                        SignedProperties += X509SerialNumber;

                    SignedProperties += '</ds:X509SerialNumber>';
                    SignedProperties += '</etsi:IssuerSerial>';
                SignedProperties += '</etsi:Cert>';
            SignedProperties += '</etsi:SigningCertificate>';
        SignedProperties += '</etsi:SignedSignatureProperties>';
        SignedProperties += '<etsi:SignedDataObjectProperties>';
            SignedProperties += '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' + Reference_ID_number + '">';
                SignedProperties += '<etsi:Description>';

                    SignedProperties += 'contenido comprobante';                        

                SignedProperties += '</etsi:Description>';
                SignedProperties += '<etsi:MimeType>';
                    SignedProperties += 'text/xml';
                SignedProperties += '</etsi:MimeType>';
            SignedProperties += '</etsi:DataObjectFormat>';
        SignedProperties += '</etsi:SignedDataObjectProperties>';
    SignedProperties += '</etsi:SignedProperties>'; //fin SignedProperties

   let SignedProperties_para_hash = SignedProperties.replace('<etsi:SignedProperties', '<etsi:SignedProperties ' + xmlns);

    let sha1_SignedProperties =  sha1_base64(SignedProperties_para_hash);        



    let KeyInfo = '';

    KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
        KeyInfo += '\n<ds:X509Data>';
            KeyInfo += '\n<ds:X509Certificate>\n';

                //CERTIFICADO X509 CODIFICADO EN Base64 
                KeyInfo += certificateX509;

            KeyInfo += '\n</ds:X509Certificate>';
        KeyInfo += '\n</ds:X509Data>';
        KeyInfo += '\n<ds:KeyValue>';
            KeyInfo += '\n<ds:RSAKeyValue>';
                KeyInfo += '\n<ds:Modulus>\n';

                    //MODULO DEL CERTIFICADO X509
                    KeyInfo += modulus;

                KeyInfo += '\n</ds:Modulus>';
                KeyInfo += '\n<ds:Exponent>';

                    //KeyInfo += 'AQAB';
                    KeyInfo += exponent;

                KeyInfo += '</ds:Exponent>';
            KeyInfo += '\n</ds:RSAKeyValue>';
        KeyInfo += '\n</ds:KeyValue>';
    KeyInfo += '\n</ds:KeyInfo>';

    let KeyInfo_para_hash = KeyInfo.replace('<ds:KeyInfo', '<ds:KeyInfo ' + xmlns);

    let sha1_certificado =  sha1_base64(KeyInfo_para_hash);


    let SignedInfo = '';

    SignedInfo += '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
        SignedInfo += '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
        SignedInfo += '</ds:CanonicalizationMethod>';
        SignedInfo += '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
        SignedInfo += '</ds:SignatureMethod>';
        SignedInfo += '\n<ds:Reference Id="SignedPropertiesID' + SignedPropertiesID_number + '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';
            SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
            SignedInfo += '</ds:DigestMethod>';
            SignedInfo += '\n<ds:DigestValue>';

                //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
                SignedInfo += sha1_SignedProperties;

            SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
            SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
            SignedInfo += '</ds:DigestMethod>';
            SignedInfo += '\n<ds:DigestValue>';

                //HASH O DIGEST DEL CERTIFICADO X509
                SignedInfo += sha1_certificado;

            SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference Id="Reference-ID-' + Reference_ID_number + '" URI="#comprobante">';
            SignedInfo += '\n<ds:Transforms>';
                SignedInfo += '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
                SignedInfo += '</ds:Transform>';
            SignedInfo += '\n</ds:Transforms>';
            SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
            SignedInfo += '</ds:DigestMethod>';
            SignedInfo += '\n<ds:DigestValue>';

                //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante" 
                SignedInfo += sha1_comprobante;

            SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
    SignedInfo += '\n</ds:SignedInfo>';

    let SignedInfo_para_firma = SignedInfo.replace('<ds:SignedInfo', '<ds:SignedInfo ' + xmlns);

    let md = Forge.md.sha1.create();
    md.update(SignedInfo_para_firma, 'utf8');

    let signature = btoa(key.sign(md)).match(/.{1,76}/g).join("\n");


    let xades_bes = '';

    //INICIO DE LA FIRMA DIGITAL 
    xades_bes += '<ds:Signature ' + xmlns + ' Id="Signature' + Signature_number + '">';
        xades_bes += '\n' + SignedInfo;

        xades_bes += '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';

            //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL) 
            xades_bes += signature;

        xades_bes += '\n</ds:SignatureValue>';

        xades_bes += '\n' + KeyInfo;

        xades_bes += '\n<ds:Object Id="Signature' + Signature_number + '-Object' + Object_number + '">';
            xades_bes += '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

                //ELEMENTO <etsi:SignedProperties>';
                xades_bes += SignedProperties;

            xades_bes += '</etsi:QualifyingProperties>';
        xades_bes += '</ds:Object>';
    xades_bes += '</ds:Signature>';

    //FIN DE LA FIRMA DIGITAL 

    return  comprobante.replace(/(<[^<]+)$/, xades_bes + '$1');
}
catch(error){
    console.log(error.name, error.message);
    
    return {status: "Error", message: error.message , error };
  }

}




let sha1_base64UTF8=(txt)=> {
  
    let md = Forge.md.sha1.create();
    md.update(txt, "utf8");
  
    //return new Buffer(md.digest().toHex(), 'hex').toString('base64');
    return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
  }
let sha1_base64=(txt)=> {
    let md = Forge.md.sha1.create();
    md.update(txt);
    return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
    }


let hexToBase64=(str)=> {
  let hex = ('00' + str).slice(0 - str.length - str.length % 2);
  
  return btoa(String.fromCharCode.apply(null,
      hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

let bigint2base64=(bigint)=>{
  let base64 = '';
  base64 = btoa(bigint.toString(16).match(/\w{2}/g).map(function(a){return String.fromCharCode(parseInt(a, 16));} ).join(""));
  
  base64 = base64.match(/.{1,76}/g).join("\n");
  
  return base64;
}

let p_obtener_aleatorio=()=> {
  return Math.floor(Math.random() * 999000) + 990;    
}
    let ComprobanteFirmado = FirmarComprobante(archivop12, pass, Comprobante)

  return ComprobanteFirmado
}
 
export default Demo;