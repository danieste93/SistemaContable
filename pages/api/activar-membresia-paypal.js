
import User from '../../models/usersSass';
import sendActivacionMembresia from './email/activacion-membresia';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
 
  const { email, plan, duration, paypalOrderId, payer } = req.body;
  if (!email || !plan || !duration || !paypalOrderId) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Actualiza la membresía
    user.Membresia = {
      activa: true,
      plan,
      duration,
      metodo: 'paypal',
      paypalOrderId,
      fechaActivacion: new Date(),
      payer
    };
    await user.save();
    // Envía correo de activación
    await sendActivacionMembresia({
      email,
      nombre: user.Nombres || user.Email,
      plan,
      duration
    });
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al activar membresía', details: err.message });
  }
}
