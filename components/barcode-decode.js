// Utilidad para decodificar código de barras desde una imagen usando zxing-js/browser
// Instalación recomendada: npm install @zxing/browser

export async function decodeBarcodeFromImage(imageDataUrl) {
  try {
    const { BrowserMultiFormatReader } = await import('@zxing/browser');
    const codeReader = new BrowserMultiFormatReader();
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = async () => {
        try {
          const result = await codeReader.decodeFromImageElement(img);
          resolve(result.text);
        } catch (err) {
          reject('No se pudo leer el código de barras');
        }
      };
      img.onerror = () => reject('No se pudo cargar la imagen');
      img.src = imageDataUrl;
    });
  } catch (err) {
    throw new Error('No se pudo cargar el lector de código de barras');
  }
}
