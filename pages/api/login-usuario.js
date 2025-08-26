// API Next.js para validar usuario y contraseña
import mongoose from 'mongoose';
import { dbConnect } from '../../lib/mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserSchema from '../../models/users';

export default async function handler(req, res) {
  const SECRET = process.env.JWT_SECRET || 'CerdadInfinita';
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }
  try {
  await dbConnect();
    const UserModel = mongoose.models['usuarios'] || mongoose.model('usuarios', UserSchema);
    const user = await UserModel.findOne({ Email: correo });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }
    const valid = await bcrypt.compare(password, user.Password);
    if (valid) {
      // Generar JWT
      const token = jwt.sign({ id: user._id, email: user.Email, membresia: user.Membresia }, SECRET, { expiresIn: '2h' });
      return res.status(200).json({ status: "Ok", data: { user, decodificado: token } });
    } else {
      return res.status(401).json({ status: "error", message: 'Contraseña incorrecta' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error en la consulta', error: err.message });
  } finally {
    // No desconectamos para evitar cierre forzado de la conexión
  }
}
