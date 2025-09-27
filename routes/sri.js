const express = require('express');
const router = express.Router();
const soap = require('soap');

const WSDL = 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl';

// POST /api/sri/consultar-comprobante
router.post('/consultar-comprobante', async (req, res) => {
  const clave = req.body.claveAcceso;
  if (!clave || typeof clave !== 'string' || clave.length < 40) {
    return res.status(400).json({ status: 'error', error: 'Clave de acceso inválida o faltante.' });
  }
  try {
    const client = await soap.createClientAsync(WSDL);
    // El nombre exacto puede variar, revisa client.describe() si da error
    const [result] = await client.autorizacionComprobanteAsync({ claveAccesoComprobante: clave });
    const autorizaciones = result.autorizaciones && result.autorizaciones.autorizacion;
    if (autorizaciones && autorizaciones.length > 0 && autorizaciones[0].comprobante) {
      res.json({ status: 'ok', xml: autorizaciones[0].comprobante });
    } else {
      res.json({ status: 'no_xml', detalle: result });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.toString() });
  }
});

module.exports = router;
