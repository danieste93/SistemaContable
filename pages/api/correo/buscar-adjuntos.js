import { google } from 'googleapis';
import mongoose from 'mongoose';
import User from '../../../models/usersSass';

// Utilidad para construir la query de Gmail
function buildGmailQuery({ startDate, endDate, fileTypes }) {
  let query = '';
  if (startDate && endDate) {
    // Gmail API usa formato yyyy/mm/dd
    query += `after:${startDate} before:${endDate} `;
  }
  if (fileTypes && fileTypes.length) {
    // Buscar correos con adjuntos de los tipos indicados
    const extQuery = fileTypes.map(ext => `filename:${ext}`).join(' OR ');
    query += `has:attachment (${extQuery})`;
  } else {
    query += 'has:attachment';
  }
  return query.trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  const { userId, startDate, endDate, fileTypes } = req.body;
  if (!userId || !startDate || !endDate) {
    res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    return;
  }
  try {
    await mongoose.connect(process.env.REACT_DATA_BASE, { useNewUrlParser: true, useUnifiedTopology: true });
    let MainConn = await mongoose.connection.useDb('datashop');
    const UserModel = MainConn.model('usuarios', User);
    const { Types } = require('mongoose');
    const user = await UserModel.findOne({ _id: Types.ObjectId(userId) });
    if (!user || !user.gmailToken || !user.gmailToken.access_token) {
      res.status(401).json({ error: 'Usuario sin token Gmail válido.' });
      return;
    }
    // Inicializar cliente Gmail
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(user.gmailToken);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    // Construir la query
    const query = buildGmailQuery({ startDate, endDate, fileTypes });
    // Buscar mensajes
    const messagesRes = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 50 // Puedes ajustar el límite
    });
    const messages = messagesRes.data.messages || [];
    // Obtener detalles y adjuntos
    const results = [];
    for (const msg of messages) {
      const msgData = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const payload = msgData.data.payload;
      const parts = payload.parts || [];
      // Filtrar adjuntos por extensión
      const attachments = parts.filter(part => {
        return part.filename && fileTypes.some(ext => part.filename.toLowerCase().endsWith(ext));
      }).map(part => ({
        filename: part.filename,
        mimeType: part.mimeType,
        attachmentId: part.body.attachmentId
      }));
      if (attachments.length) {
        results.push({
          id: msg.id,
          threadId: msgData.data.threadId,
          snippet: msgData.data.snippet,
          date: msgData.data.internalDate,
          from: (payload.headers || []).find(h => h.name === 'From')?.value,
          subject: (payload.headers || []).find(h => h.name === 'Subject')?.value,
          attachments
        });
      }
    }
    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar correos: ' + err.message });
  }
}
