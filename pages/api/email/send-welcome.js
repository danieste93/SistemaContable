import { enviarCorreoBienvenida } from '../../../controler/CorreosZoho';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, nombre } = req.body;

  if (!email || !nombre) {
    return res.status(400).json({ message: 'Faltan datos: email y nombre son requeridos.' });
  }

  try {
    const result = await enviarCorreoBienvenida({ email, nombre });
    if (result.success) {
      return res.status(200).json({ status: 'Ok', message: 'Correo de bienvenida enviado con éxito.' });
    } else {
      return res.status(500).json({ status: 'Error', message: 'No se pudo enviar el correo de bienvenida.' });
    }
  } catch (error) {
    console.error('Error en la API de envío de correo:', error);
    return res.status(500).json({ status: 'Error', message: error.message || 'Error interno del servidor al enviar correo.' });
  }
}
