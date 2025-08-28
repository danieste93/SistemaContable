

const dbConnect = require('../../lib/mongoose');
const User = require('../../models/usersSass');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const { email, Nombres, CedulaoRuc, Correo, Telefono, Direccion } = req.body;
  if (!email || !Nombres || !CedulaoRuc || !Correo || !Direccion) return res.status(400).json({ error: 'Faltan datos obligatorios' });
  try {
    await dbConnect();
    const result = await User.updateOne(
      { Email: email },
      { $set: {
        'DatosFacturacion.Nombres': Nombres,
        'DatosFacturacion.CedulaoRuc': CedulaoRuc,
        'DatosFacturacion.Correo': Correo,
        'DatosFacturacion.Telefono': Telefono,
        'DatosFacturacion.Direccion': Direccion
      }}
    );
    if (result.modifiedCount > 0) return res.status(200).json({ status: 'ok', updated: true });
    else return res.status(404).json({ status: 'error', updated: false, message: 'Usuario no encontrado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
}
