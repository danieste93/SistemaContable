

const UserSchema = require('../models/usersSass');
const mongoose = require('mongoose')

async function pruebaFuncion (req, res){


    console.log("llego a la funcion pruebaFuncion")
}

async function validarCorreo(req, res) {
  console.log('Método recibido:', req.method);
  if (req.method === 'POST') {
    const { correo } = req.body || {};
    console.log('Body recibido:', req.body);
    if (!correo) {
      res.status(400).json({ error: 'Correo requerido' });
      return;
    }
    res.status(200).json({ recibido: correo });
    console.log('🔵 Respuesta enviada:', { recibido: correo });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}

// API Next.js para validar si el usuario existe y su membresía


 async function validarUsuario(req, res) {
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

let MainConn = await mongoose.connection.useDb("datashop");  
    let UserModelSass = await MainConn.model('usuarios', UserSchema);

  const user = await UserModelSass.findOne({ Email: correo });

    if (user) {
      console.log('Usuario encontrado, membresía:', user.Membresia);
      return res.status(200).json({ existe: true, membresia: user.Membresia });
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





module.exports = {pruebaFuncion, validarCorreo, validarUsuario}