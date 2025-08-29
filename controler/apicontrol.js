const cloudinary = require('cloudinary').v2;
const multiparty = require('multiparty');

async function subirComprobanteMeM(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const form = new multiparty.Form();
  form.parse(req, async function(err, fields, files) {
    if (err) return res.status(400).json({ error: 'Error al procesar archivo' });
    const email = fields.email[0];
    const filePath = files.comprobante[0].path;
    try {
      const result = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
      let MainConn = await mongoose.connection.useDb("datashop");
      let UserModelSass = await MainConn.model('usuarios', UserSchema);
      const user = await UserModelSass.findOne({ Email: email });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      user.SiSPagos.ComprobanteMeM = result.secure_url;
      await user.save();
      return res.status(200).json({ status: 'ok', url: result.secure_url, user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}


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





async function actualizarFacturacion(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { email, Nombres, CedulaoRuc, Correo, Telefono, Direccion } = req.body;
  if (!email || !Nombres || !CedulaoRuc || !Correo || !Direccion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    let MainConn = await mongoose.connection.useDb("datashop");
    let UserModelSass = await MainConn.model('usuarios', UserSchema);
    const result = await UserModelSass.updateOne(
      { Email: email },
      { $set: {
        'DatosFacturacion.Nombres': Nombres,
        'DatosFacturacion.CedulaoRuc': CedulaoRuc,
        'DatosFacturacion.Correo': Correo,
        'DatosFacturacion.Telefono': Telefono,
        'DatosFacturacion.Direccion': Direccion
      }}
    );
    if (result.modifiedCount > 0) {
      // Obtener el usuario actualizado
      const updatedUser = await UserModelSass.findOne({ Email: email });
      return res.status(200).json({ status: 'ok', updated: true, user: updatedUser });
    } else {
      return res.status(404).json({ status: 'error', updated: false, message: 'Usuario no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
}

module.exports = {pruebaFuncion, validarCorreo, validarUsuario, actualizarFacturacion, subirComprobanteMeM}