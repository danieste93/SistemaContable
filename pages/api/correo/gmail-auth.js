import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';


export default async function handler(req, res) {
  // Solo GET para iniciar el flujo OAuth2
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  // Obtener userId desde query
  const userId = req.query.userId;
  if (!userId) {
    res.status(400).json({ error: 'Falta userId en la URL' });
    return;
  }
  // Cargar credenciales
  const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
  // Permitir override del redirect_uri si viene en la query
  const redirectUri = req.query.redirect_uri || redirect_uris[1] || redirect_uris[0];
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  // Generar la URL de autorización usando el redirect_uri correcto
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    redirect_uri: redirectUri
  });
  res.status(200).json({ url: authUrl });
}
