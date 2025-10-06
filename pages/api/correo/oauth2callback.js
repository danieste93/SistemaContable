
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from '../../../models/usersSass';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  const code = req.query.code;
  const userId = req.query.userId;
    if (!code || !userId) {
      console.log('ERROR: Faltan datos requeridos (code, userId)', { code, userId });
      res.status(400).json({ error: 'Faltan datos requeridos (code, userId).' });
      return;
  }
  // Cargar credenciales
  const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
  // Usar el redirect URI EXACTO que usó Google para el callback
  const redirectUri = redirect_uris.find(uri => uri.includes('/gmail-callback')) || redirect_uris[0];
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('TOKENS OBTENIDOS:', tokens);
    await mongoose.connect(process.env.REACT_DATA_BASE, { useNewUrlParser: true, useUnifiedTopology: true });
    // Usar la base de datos 'datashop' y la colección 'usuarios'
    let MainConn = await mongoose.connection.useDb('datashop');
    const UserModel = MainConn.model('usuarios', User);
    const { Types } = require('mongoose');
    let user = null;
    try {
      user = await UserModel.findOne({ _id: Types.ObjectId(userId) });
    } catch (e) {
      console.log('Error convirtiendo userId a ObjectId:', e);
    }
    console.log('USUARIO ENCONTRADO:', user);
    if (!user) {
      console.log('ERROR: Usuario no encontrado para userId:', userId);
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }
    user.gmailToken = tokens;
    await user.save();
    console.log('USUARIO ACTUALIZADO:', user);
    // Devolver el usuario actualizado para Redux
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener o guardar el token: ' + err.message });
  }
}
