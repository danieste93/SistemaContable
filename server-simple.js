const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('¡Hola! El servidor está funcionando correctamente en Google Cloud Run!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Sistema Contable funcionando' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});