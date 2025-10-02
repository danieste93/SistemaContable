// Endpoint para guardar el token OAuth2 de Gmail en el usuario SAS
const User = require('../models/usersSass');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/save-gmail-token', async (req, res) => {
	const { userId, gmailToken } = req.body;
	if (!userId || !gmailToken) {
		return res.status(400).json({ error: 'Faltan datos requeridos.' });
	}
	try {
		const user = await mongoose.model('UserSass', User).findById(userId);
		if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
		user.gmailToken = gmailToken;
		await user.save();
		res.json({ status: 'ok', message: 'Token guardado correctamente.' });
	} catch (err) {
		console.error('Error guardando token Gmail:', err);
		res.status(500).json({ error: 'Error guardando token Gmail.' });
	}
});


const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

const zohoControler = require('../controler/zohoCorreo');
const gmailControler = require('../controler/gmailCorreo');

// Cargar credenciales
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
// Usar el redirect URI del backend para el flujo OAuth2
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1] || redirect_uris[0]);

// Endpoint para iniciar el flujo OAuth2
router.get('/gmail-auth', (req, res) => {
	const scopes = [
		'https://www.googleapis.com/auth/gmail.readonly'
	];
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	});
	res.redirect(authUrl);
});

// Endpoint para recibir el token de Google
router.get('/oauth2callback', async (req, res) => {
	const code = req.query.code;
	if (!code) return res.status(400).send('No code provided');
	try {
		const { tokens } = await oAuth2Client.getToken(code);
		// Aquí puedes guardar el token en la base de datos, sesión, etc.
		// Por ahora, lo mostramos en pantalla para copiar y usar en el frontend
		res.send(`<pre>${JSON.stringify(tokens, null, 2)}</pre><br><b>Copia este token y guárdalo en tu configuración de correo.</b>`);
	} catch (err) {
		res.status(500).send('Error al obtener el token: ' + err.message);
	}
});




router.post('/send-welcome', zohoControler.CorreoBienvenida);

// Endpoint para buscar facturas en Gmail
router.post('/buscar-facturas-gmail', gmailControler.buscarFacturasPorCorreo);


module.exports = router;