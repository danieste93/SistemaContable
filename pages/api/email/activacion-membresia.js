// Template y función para correo de activación de membresía

export function getActivacionMembresiaHtml({ nombre, membresia, tiempo }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Activación de Membresía - Activos</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1e3a8a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px;">
  <tr>
    <td>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #1e3a8a; text-align: center; padding: 30px 20px;">
            <img src="https://activos.ec/static/logo1.png" alt="Logo Activos" style="max-width: 150px;" />
            <h1 style="color: white; margin-top: 20px; font-size: 24px; font-weight: bold;">🔓 Tu Acceso Exclusivo ya está Activo</h1>
            <p style="color: #bfdbfe; font-size: 14px;">Disfruta ahora de beneficios diseñados especialmente para ti</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 20px; color: #111827; font-size: 16px; line-height: 1.6;">
            <h2 style="font-size: 20px; margin-bottom: 10px;">¡Hola, <strong>${nombre}</strong>!</h2>
            <p>Es un placer darte la bienvenida como miembro <strong>Activo</strong>. Tu <strong>membresía ${membresia}</strong> ha sido activada exitosamente por un período de <strong>${tiempo}</strong>.</p>
            <p>A partir de este momento, puedes acceder a todas las funciones exclusivas que te ayudarán a organizar, controlar y optimizar tu emprendimiento.</p>
            <p>Recuerda que, como miembro, tendrás acceso a:</p>
            <ul style="padding-left: 20px; margin-top: 10px; margin-bottom: 20px;">
              <li>Modulo inventario</li>
              <li>Punto de venta</li>
              <li>Multi Usuarios</li>
              <li>Reportes, análisis y funciones financieras automatizadas</li>
              <li>Soporte directo y acompañamiento en tu emprendimiento</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://activos.ec/ingreso" target="_blank" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Acceder a mi cuenta</a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; color: #0c4a6e; font-size: 15px; line-height: 1.6;">
              <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px; color: #0369a1;">📌 Un beneficio exclusivo para ti</h3>
              <p style="margin: 10px 0;">Si tienes la membresía anual, puedes <strong>obtener tu firma electrónica de Ecuador</strong> y facturar todo el año sin costo adicional.</p>
              <p style="margin: 10px 0;"><strong>Ingresa aquí:</strong></p>
              <p style="margin: 10px 0;">
                <a href="https://activos.ec/firma-electronica" target="_blank" style="color: #0284c7; text-decoration: underline;">https://activos.ec/firma-electronica</a>
              </p>
              <p style="margin: 10px 0;">Reúne los requisitos y haz clic en <strong>"Comenzar"</strong> para activarla.</p>
              <p style="margin: 10px 0; font-style: italic; color: #0891b2;">Nota: Este beneficio es totalmente opcional, activala cuando la necesites dentro del periodo de la membresia.</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="margin-bottom: 10px;">Conéctate con nosotros y sé parte de nuestra comunidad:</p>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-top: 10px; white-space: nowrap;">
                  <a href="https://www.instagram.com/Activos_app/" target="_blank" style="display: inline-block; background-color: #E1306C; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 6px;">📸 Instagram</a>
                  <a href="https://www.facebook.com/activos.ap" target="_blank" style="display: inline-block; background-color: #1877F2; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 6px;">📘 Facebook</a>
                  <a href="https://www.youtube.com/@Activos_app" target="_blank" style="display: inline-block; background-color: #FF0000; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-right: 6px;">▶️ YouTube</a>
                  <a href="https://www.tiktok.com/@Activos_app" target="_blank" style="display: inline-block; background-color: #000000; color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-size: 13px;">🎵 TikTok</a>
                </td>
              </tr>
            </table>
            <p style="margin-top: 20px;">
              También puedes encontrar consejos y guías útiles en nuestro 
              <a href="https://activos.ec/blogs" style="color: #2563eb; text-decoration: underline;">Blog de Finanzas</a>.
            </p>
            <h3 style="font-size: 18px; margin-top: 30px; margin-bottom: 10px;">¿Necesitas ayuda?</h3>
            <p style="margin-bottom: 10px;">Nuestro equipo de soporte está disponible para resolver tus dudas.</p>
            <a href="https://wa.me/593962124673" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Hablar con soporte</a>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280; padding: 20px;">
            &copy; 2025 Activos.ec - Todos los derechos reservados.<br>
            Si no solicitaste esta membresía, por favor ignora este mensaje.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
