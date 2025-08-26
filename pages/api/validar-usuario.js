// API Next.js para validar si el usuario existe y su membresía
import mongoose from 'mongoose';
import { dbConnect } from '../../lib/mongoose';
import UserSchema from '../../models/users';

export default async function handler(req, res) {
  console.log('API validar-usuario llamada');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  const { correo } = req.body;
  console.log('Correo recibido:', correo);
  if (!correo) {
    return res.status(400).json({ message: 'Falta el correo' });
  }
  try {
  console.log('Conectando a MongoDB...');
  await dbConnect();
  console.log('Conexión a MongoDB exitosa');
  const UserModel = mongoose.models['usuarios'] || mongoose.model('usuarios', UserSchema);
  console.log('Buscando usuario...');
  const user = await UserModel.findOne({ Email: correo });
  console.log('Resultado de búsqueda:', user);
    if (user) {
      console.log('Usuario encontrado, membresía:', user.Membresia);
      return res.status(200).json({ existe: true, membresia: user.Membresia || 'Gratuita' });
    } else {
      console.log('Usuario no encontrado');
      return res.status(200).json({ existe: false, membresia: 'Gratuita' });
    }
  } catch (err) {
    console.error('Error en la consulta:', err);
    return res.status(500).json({ message: 'Error en la consulta', error: err.message });
  } finally {
    // No desconectamos para evitar cierre forzado de la conexión
  }
}
