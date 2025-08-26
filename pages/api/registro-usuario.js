
import mongoose from 'mongoose';
import UserSchema from '../../models/users';
const UserSchema2 = require('../../models/users');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { usuario, correo, telefono, password } = req.body;
  let MainConn = await mongoose.connection.useDb('datashop');

  try {
    const UserModel = MainConn.models['usuarios'] ? MainConn.model('usuarios') : MainConn.model('usuarios', UserSchema);
    let UserModelSass2 = await MainConn.model('usuarios', UserSchema2);
    const usuarios = await UserModelSass2.find({ Email: correo });
    if (usuarios.length > 0) {
      return res.status(200).json({ registrado: true, mensaje: 'Usuario ya registrado, puede continuar con el pago.' });
    }
    if (!usuario || !correo || !telefono || !password) {
      return res.status(400).json({ registrado: false, message: 'Faltan datos para registrar el usuario.' });
    }
    // Importa el servicio de registro completo
    const { registerFullUser } = require('../../controler/services/registrationService');
    // Prepara el input para el registro completo
    const userInput = {
      Usuario: usuario,
      TelefonoContacto: telefono,
      Confirmacion: false,
      Correo: correo,
      Imagen: '',
      RegistradoPor: 'usuario',
      Contrasena: password,
      Membresia: 'Gratuita'
    };
    const result = await registerFullUser(userInput);
    if (result.success) {
      return res.status(201).json({ registrado: true, message: 'Usuario creado exitosamente', user: result.user, db: result.db });
    } else {
      return res.status(500).json({ registrado: false, message: result.error });
    }
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}