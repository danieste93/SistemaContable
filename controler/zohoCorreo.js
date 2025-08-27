const nodemailer = require('nodemailer');

// 1. Configuración del Transporter para Zoho (usando variables de entorno)
const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: process.env.ZOHO_SMTP_PORT,
  secure: true, // true para puerto 465
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASS,
  },
});

// 2. Función para enviar correo de bienvenida con tu diseño
async function CorreoBienvenida(req, res) {
  console.log(req.body);
  const { email, nombre } = req.body;
  const emailHtmlTemplate = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Bienvenido a Activos</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #1e3a8a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px;">
    <tr>
      <td>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #1e3a8a; text-align: center; padding: 30px 20px;">
              <img src="https://activos.ec/static/logo1.png" alt="Logo Activos" style="max-width: 150px;" />
              <h1 style="color: white; margin-top: 20px; font-size: 24px; font-weight: bold;">¡Bienvenido/a a Activos!</h1>
              <p style="color: #bfdbfe; font-size: 14px;">Tu herramienta definitiva para gestionar tus finanzas personales.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 20px; color: #111827; font-size: 16px; line-height: 1.6;">
              <h2 style="font-size: 20px; margin-bottom: 10px;">¡Hola, ${nombre}!</h2>
              <p>Gracias por registrarte en <strong>Activos</strong>. Estamos emocionados de tenerte con nosotros. Tu cuenta ya está activa y puedes comenzar a explorar todas nuestras funciones.</p>
              <p>Únete a nuestra comunidad y sigue nuestros canales para aprender más sobre finanzas personales y cómo aprovechar al máximo la app:</p>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-top: 10px; white-space: nowrap;">
                    <a href="https://www.instagram.com/Activos_app/" target="_blank" style="display: inline-block; background-color: #E1306C; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 8px; margin-bottom: 8px; display: inline-flex; align-items: center;">
                      <span style="background-color: #f3f4f6; border-radius: 50%; padding: 4px; margin-right: 5px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="color: #E1306C; font-size: 12px;">📸</span>
                      </span>
                      Instagram
                    </a>
                    <a href="https://www.facebook.com/activos.ap" target="_blank" style="display: inline-block; background-color: #1877F2; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 8px; margin-bottom: 8px; display: inline-flex; align-items: center;">
                      <span style="background-color: #f3f4f6; border-radius: 50%; padding: 4px; margin-right: 5px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="color: #1877F2; font-size: 12px;">📘</span>
                      </span>
                      Facebook
                    </a>
                    <a href="https://www.youtube.com/@Activos_app" target="_blank" style="display: inline-block; background-color: #FF0000; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 8px; margin-bottom: 8px; display: inline-flex; align-items: center;">
                      <span style="background-color: #f3f4f6; border-radius: 50%; padding: 4px; margin-right: 5px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="color: #FF0000; font-size: 12px;">▶️</span>
                      </span>
                      YouTube
                    </a>
                    <a href="https://www.tiktok.com/@Activos_app" target="_blank" style="display: inline-block; background-color: #000000; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 8px; margin-bottom: 8px; display: inline-flex; align-items: center;">
                      <span style="background-color: #f3f4f6; border-radius: 50%; padding: 4px; margin-right: 5px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="color: #000000; font-size: 12px;">🎵</span>
                      </span>
                      TikTok
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin-top: 20px;">
                ¿Quieres aprender más sobre finanzas personales y cómo usar la app?
                <a href="https://activos.ec/blogs" style="color: #2563eb; text-decoration: underline;">Visita nuestro blog</a>.
              </p>
              <h3 style="font-size: 18px; margin-top: 30px; margin-bottom: 10px;">¿Necesitas ayuda?</h3>
              <p style="margin-bottom: 10px;">Si tienes dudas o necesitas apoyo personalizado, puedes contactarnos directamente por WhatsApp.</p>
              <a href="https://wa.me/593962124673" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Hablar con soporte</a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280; padding: 20px;">
              &copy; 2025 Activos.ec Todos los derechos reservados.<br>
              Si no solicitaste esta cuenta, por favor ignora este mensaje.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  </body>
  </html>
  `;



  // Reemplazar el placeholder con el nombre real
  const emailHtml = emailHtmlTemplate.replace('[Nombre]', nombre);

  const mailOptions = {
    from: process.env.ZOHO_SMTP_USER,
    to: email,
    subject: `¡Bienvenido a Activos.ec, ${nombre}! `,
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de bienvenida enviado:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error al enviar correo de bienvenida:', error);
    return res.status(500).json({ success: false, error: error.message || 'No se pudo enviar el correo de bienvenida.' });
  }
}

module.exports = { CorreoBienvenida };
