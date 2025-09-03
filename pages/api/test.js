export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ ok: true, method: 'POST' });
  } else {
    res.status(200).json({ ok: true, method: req.method });
  }
}