import { CorreoBienvenida as enviarCorreoBienvenida } from '../../../controler/zohoCorreo';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // La función CorreoBienvenida maneja la respuesta y validación internamente
  await enviarCorreoBienvenida(req, res);
}
