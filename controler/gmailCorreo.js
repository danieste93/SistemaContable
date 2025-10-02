
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Busca correos con adjuntos XML/PDF en Gmail y retorna info relevante
exports.buscarFacturasPorCorreo = async (req, res) => {
  const { fechaInicio, fechaFin, token } = req.body;
  if (!token || !fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  // Cargar credenciales y crear cliente OAuth2
  const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    // Buscar mensajes en el rango de fechas con adjuntos XML/PDF
    const query = `after:${fechaInicio} before:${fechaFin} has:attachment`;
    const messagesRes = await gmail.users.messages.list({ userId: 'me', q: query });
    const messages = messagesRes.data.messages || [];
    let facturas = [];
    for (const msg of messages) {
      const msgData = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const payload = msgData.data.payload;
      const parts = payload.parts || [];
      for (const part of parts) {
        if (part.filename && (part.filename.endsWith('.xml') || part.filename.endsWith('.pdf'))) {
          // Descargar el adjunto
          const attachId = part.body.attachmentId;
          const attachRes = await gmail.users.messages.attachments.get({ userId: 'me', messageId: msg.id, id: attachId });
          facturas.push({
            filename: part.filename,
            contentType: part.mimeType,
            content: attachRes.data.data, // base64
            subject: payload.headers.find(h => h.name === 'Subject')?.value,
            date: payload.headers.find(h => h.name === 'Date')?.value
          });
        }
      }
    }
    res.json({ facturas });
  } catch (err) {
    console.error('Error Gmail API:', err);
    res.status(500).json({ error: 'Error Gmail API: ' + err.message });
  }
};
