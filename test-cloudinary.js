// Script de prueba para verificar Cloudinary
const fetch = require('node-fetch');

async function testCloudinary() {
    try {
        console.log("🧪 Probando endpoint de Cloudinary...");
        
        // Datos de prueba (reemplaza con datos reales)
        const testData = {
            datos: {
                url: "https://res.cloudinary.com/y-y-y-y/image/authenticated/x-x-x-x/v1/archivo.p12",
                publicId: "archivo"
            }
        };

        const response = await fetch('https://sistemacontable-436626443349.us-central1.run.app/public/getDbuserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer tu-token-aqui' // Necesitarás un token válido
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log("📊 Resultado:", result);
        
        if (result.status === "Ok") {
            console.log("✅ ¡Cloudinary funciona correctamente!");
            console.log("📄 Datos recibidos:", result.data ? "Archivo descargado" : "Sin datos");
        } else {
            console.log("❌ Error en Cloudinary:", result.message);
        }
        
    } catch (error) {
        console.error("💥 Error en la prueba:", error);
    }
}

testCloudinary();