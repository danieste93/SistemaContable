async function activarMembresiaPaypal(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { email, plan, duration, paypalOrderId, payer } = req.body;
  if (!email || !plan || !duration || !paypalOrderId) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    let MainConn = await require('mongoose').connection.useDb("datashop");
    let UserModelSass = await MainConn.model('usuarios', require('../models/usersSass'));
    const user = await UserModelSass.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Actualizar campos igual que transferencia pero para PayPal
    const now = new Date();
    user.Membresia = plan === "ORO" ? "Premium" : plan;
    user.Fechas.InicioMem = now;
    if (duration === "anual") {
      user.Fechas.ExpiraMem = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
      user.SiSPagos.FirmaCortesia = "1";
    } else {
      user.Fechas.ExpiraMem = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
      user.SiSPagos.FirmaCortesia = "";
    }
    user.SiSPagos.BancoMEM = "";
    // Diferenciar tipo de venta según campo 'tipo' recibido
    user.SiSPagos.TipoVentaMeM = req.body.tipo === "suscripcion" ? "SuscripcionPaypal" : "Paypal";
    user.SiSPagos.ComprobanteMeM = paypalOrderId;
    await user.save();
    // Enviar correo de activación
    try {
      const { CorreoActivacionMembresia } = require('./zohoCorreo');
      await CorreoActivacionMembresia({
        email,
        nombre: user.DatosFacturacion?.Nombres || user.Usuario || "Usuario",
        membresia: plan,
        tiempo: duration === "anual" ? "1 año" : "1 mes"
      });
    } catch (mailErr) {
      console.error("Error enviando correo de activación de membresía:", mailErr);
    }
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al activar membresía', details: err.message });
  }
}
const cloudinary = require('cloudinary').v2;
const multiparty = require('multiparty');

async function subirComprobanteMeM(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const form = new multiparty.Form();
  form.parse(req, async function(err, fields, files) {
    if (err) return res.status(400).json({ error: 'Error al procesar archivo' });
    const plan = fields.plan ? fields.plan[0] : "";
    const email = fields.email[0];
    const { CorreoActivacionMembresia } = require('./zohoCorreo');
    const filePath = files.comprobante[0].path;
    const duration = fields.duration ? fields.duration[0] : "";
    const banco = fields.banco ? fields.banco[0] : "";
    try {
      const result = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
      let MainConn = await mongoose.connection.useDb("datashop");
      let UserModelSass = await MainConn.model('usuarios', UserSchema);
      const user = await UserModelSass.findOne({ Email: email });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  console.log('[DEPURAR] Valor recibido de plan:', plan);
  console.log('[DEPURAR] Membresia antes:', user.Membresia);
      // Actualizar membresía según el plan seleccionado
      if (plan === "PRO") user.Membresia = "Pro";
      else if (plan === "PLATA") user.Membresia = "Plata";
      else if (plan === "ORO") user.Membresia = "Premium";
      // Actualizar campos de membresía
      const now = new Date();
      user.Fechas.InicioMem = now;
      if (duration === "anual") {
        user.Fechas.ExpiraMem = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        user.SiSPagos.FirmaCortesia = "1";
      } else {
        user.Fechas.ExpiraMem = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        user.SiSPagos.FirmaCortesia = "";
      }
      user.SiSPagos.BancoMEM = banco;
      user.SiSPagos.TipoVentaMeM = "Transferencia";
      user.SiSPagos.ComprobanteMeM = result.secure_url;
      await user.save();
        // Enviar correo de activación de membresía
        try {
          await CorreoActivacionMembresia({
            email: user.Email,
            nombre: user.DatosFacturacion?.Nombres || user.Usuario || "Usuario",
            membresia: user.Membresia,
            tiempo: duration === "anual" ? "1 año" : "1 mes"
          });
        } catch (mailErr) {
          console.error("Error enviando correo de activación de membresía:", mailErr);
        }
  console.log('[DEPURAR] Membresia después:', user.Membresia);
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
  console.log('[DEPURAR] Email recibido para actualizar:', email);
  if (!email) {
    return res.status(400).json({ error: 'Falta el email identificador' });
  }
  // Construir el objeto de actualización solo con los campos enviados
  let updateFields = {};
  if (Nombres !== undefined) updateFields['DatosFacturacion.Nombres'] = Nombres;
  if (CedulaoRuc !== undefined) updateFields['DatosFacturacion.CedulaoRuc'] = CedulaoRuc;
  if (Correo !== undefined) updateFields['DatosFacturacion.Correo'] = Correo;
  if (Telefono !== undefined) updateFields['DatosFacturacion.Telefono'] = Telefono;
  if (Direccion !== undefined) updateFields['DatosFacturacion.Direccion'] = Direccion;
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
  }
  try {
    let MainConn = await mongoose.connection.useDb("datashop");
    let UserModelSass = await MainConn.model('usuarios', UserSchema);
    // Mostrar usuarios encontrados con ese email antes de actualizar
    const usuariosCoinciden = await UserModelSass.find({ Email: email });
    console.log('[DEPURAR] Usuarios encontrados con ese Email:', usuariosCoinciden);
    const result = await UserModelSass.updateOne(
      { Email: email },
      { $set: updateFields }
    );
    // Obtener el usuario actualizado
    const updatedUser = await UserModelSass.findOne({ Email: email });
    if (updatedUser) {
      return res.status(200).json({ status: 'ok', updated: result.modifiedCount > 0, user: updatedUser });
    } else {
      return res.status(404).json({ status: 'error', updated: false, message: 'Usuario no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
}

module.exports = {pruebaFuncion, validarCorreo, validarUsuario, actualizarFacturacion, subirComprobanteMeM, activarMembresiaPaypal}