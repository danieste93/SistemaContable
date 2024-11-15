// Función para recortar el nombre del cliente
const recortarNombre15 = (nombre, maxLength = 15) => {
    if (nombre.length > maxLength) {
        return nombre.slice(0, maxLength) + '...'; // Recorta y agrega '...'
    }
    return nombre;
};

// Modificación dentro del código original
import { jsPDF } from 'jspdf';

const generarReporteComprasPDF = (compras, logoUrl, data) => {
    console.log(compras)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        margins: { left: 15, top: 20, bottom: 20 } // Márgenes a la izquierda y abajo
    });

    // Agrega el logo si se proporciona
    if (logoUrl) {
        doc.addImage(logoUrl, 'JPEG', 10, 10, );
    }

    // Título del documento
    doc.setFontSize(16); // Tamaño reducido
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de compras", doc.internal.pageSize.width / 2, 20, null, null, 'center');

    // Agregar título dependiendo de la opción seleccionada (diario, mensual, periodo)
    doc.setFontSize(12); // Tamaño de fuente para el subtítulo
    let y = 30; // Posición vertical para el subtítulo
    let titulo
    if (data.diario) {
        // Si es diario, agrega el nombre del día
        const fecha = new Date(data.tiempo);
        const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Nombre del día en español
        titulo = `${data.nombreComercial} - Diario: ${nombreDia} - ${fecha.toLocaleDateString('es-ES')}`
       
        doc.text(titulo, doc.internal.pageSize.width / 2, y, null, null, 'center');
    } else if (data.mensual) {
        // Si es mensual, agrega el nombre del mes
        const fecha = new Date(data.tiempo);
        const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' }); // Nombre del mes
        titulo = `${data.nombreComercial} - Mensual: ${nombreMes} ${fecha.getFullYear()}`
        doc.text(titulo, doc.internal.pageSize.width / 2, y, null, null, 'center');
    } else if (data.periodo) {
        // Si es periodo, agrega el rango de fechas
        const fechaInicio = new Date(data.tiempoperiodoini);
        const fechaFin = new Date(data.tiempoperiodofin);
        titulo = `${data.nombreComercial} - Periodo: ${fechaInicio.toLocaleDateString('es-ES')} a ${fechaFin.toLocaleDateString('es-ES')}`
        doc.text(titulo, doc.internal.pageSize.width / 2, y, null, null, 'center');
    }

    y += 10; // Espacio adicional después del subtítulo

    // Encabezados de la tabla con ajuste en los anchos
    doc.setFontSize(10); // Tamaño reducido
    doc.text("Fecha", 10, y);      // Columna Fecha ajustada
    doc.text("Artículos", 30, y);  // Columna Artículos agrandada
    doc.text("Documento", 90, y);  // Columna Documento ajustada
    doc.text("Compra Nº", 120, y);    // Columna Estado ajustada
    doc.text("Usuario", 150, y);  // Columna Vendedor ajustada
    doc.text("Proveedor", 180, y);
    doc.text("Tipo", 210, y);
    doc.text("Cuenta", 230, y);    // Ancho reducido
    doc.text("V.Total", 260, y);   // Última columna ajustada
    y += 10;

    // Función para manejar el recorte y los saltos de línea en los artículos
    const formatearArticulos = (articulos, maxLength = 25, cantidadLength = 5) => {
        let articulosFormateados = articulos.map(articulo => {
            // Formato para el título
            let tituloFormateado = articulo.Titulo.length > maxLength
                ? `${articulo.Titulo.slice(0, maxLength - 3)}...`  // Recorta los primeros caracteres y agrega '...'
                : articulo.Titulo;
    
            // Calcular la cantidad y asegurarse de que siempre tenga el tamaño adecuado
            const cantidadText = ` x${articulo.CantidadCompra}`;
         
    
            // Formateo final del artículo
            return `${tituloFormateado}${cantidadText}`;
        }).join("\n");
    
        // Devuelve los artículos formateados con salto de línea entre cada uno
        return articulosFormateados;
    };

    // Agrega los datos de cada compra
    compras.forEach((compra, index) => {
        // Verifica si se alcanzó el margen inferior
        if (y > doc.internal.pageSize.height - 30) { // Se mantiene un margen de 30mm
            doc.addPage(); // Agrega una nueva página
            y = 20; // Resetea la posición Y para la nueva página
            doc.text("Reporte de Compras", doc.internal.pageSize.width / 2, 20, null, null, 'center');
            y = 30;

            // Reimprimir encabezado de la tabla en la nueva página
            doc.setFontSize(10); // Tamaño reducido
           
            doc.text("Fecha", 10, y);      // Columna Fecha ajustada
    doc.text("Artículos", 30, y);  // Columna Artículos agrandada
    doc.text("Documento", 90, y);  // Columna Documento ajustada
    doc.text("Compra Nº", 120, y);    // Columna Estado ajustada
    doc.text("Usuario", 150, y);  // Columna Vendedor ajustada
    doc.text("Proveedor", 180, y);
    doc.text("Tipo", 210, y);
    doc.text("Cuenta", 230, y);    // Ancho reducido
    doc.text("V.Total", 260, y);  
            y += 10;
        }

        const fecha = new Date(compra.Tiempo).toLocaleDateString();
        const articulos = compra.ArtComprados;
        const documento = compra.Doctype === 'Factura-Electronica' ? 'Electro-Fact' : compra.Doctype === 'Nota de compra' ? 'Nota' : compra.Doctype;
        const CompraNumero = compra.CompraNumero;
        const vendedor = compra.Usuario?.Nombre || 'N/A';
        const proveedor = recortarNombre15(compra.Factdata.nombreComercial); // Aplica la función para recortar el nombre del cliente
        const forma = compra.Fpago.map(f=>f.Tipo +',' );

        // Extrae el nombre de cuenta del primer método de pago, si existe
        let cuenta = "";
        if (compra.Fpago && compra.Fpago.length > 0) {
            cuenta = compra.Fpago.map(pago => pago.Cuenta.NombreC).join(", ");
        }


        const total = compra.ValorTotal.toFixed(2);

        // Cambia el tamaño de la fuente para que quepa todo
        doc.setFontSize(8); // Tamaño reducido
        doc.setFont("helvetica", "light");
        // Imprime los datos
        doc.text(fecha, 10, y);             // Columna Fecha ajustada
        doc.text(formatearArticulos(articulos), 30, y); // Columna Artículos ajustada, con salto de línea y recorte
        doc.text(documento, 90, y);        // Columna Documento ajustada
        doc.text(`${CompraNumero}`, 120, y);           // Columna Estado ajustada
        doc.text(vendedor, 150, y);         // Columna Vendedor ajustada
        doc.text(proveedor, 180, y);          // Cliente con recorte si es necesario
        doc.text(forma, 210, y);
        doc.text(recortarNombre15(cuenta), 230, y);           // Cuenta con su nueva ruta
        doc.text(`${total}`, 260, y);

        y += 10; // Mueve la posición vertical para la siguiente fila

        // Paginación
        if (index === compras.length - 1) {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.text(`Página ${pageCount}`, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, { align: 'right' });
        }
    });

    // Suma total de las compras
    const sumaTotal = compras.reduce((acc, compra) => acc + compra.ValorTotal, 0).toFixed(2);

    // Espacio antes de la sección de la suma total
    y += 10;

    // Agregar el texto "Suma Total" con letra grande
    doc.setFontSize(18); // Tamaño grande para la suma total
    doc.setFont("helvetica", "bold");
   
    y += 10;

    // Agregar el total de compras en la siguiente línea
    doc.setFontSize(16); // Tamaño más pequeño para el total
    doc.setFont("helvetica", "normal");
    doc.text(`Total compras: $${sumaTotal}`, doc.internal.pageSize.width / 2, y, null, null, 'center');
    y += 10;

    const nombreArchivo = `${titulo.replace(/[:\/]/g, '_').replace(/ /g, '_')}.pdf`;
    // Finaliza el PDF y lo descarga
    doc.save(nombreArchivo);
};

export default generarReporteComprasPDF