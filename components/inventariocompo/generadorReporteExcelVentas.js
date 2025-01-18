import * as XLSX from 'xlsx';

const generarReporteVentasExcel = (ventas, data,logoUrl, ) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Configuración del título
    let titulo = "Reporte de Ventas";
    if (data.diario) {
        const fecha = new Date(data.tiempo);
        const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        titulo += `${data.nombreComercial}- Diario: ${nombreDia} - ${fecha.toLocaleDateString('es-ES')}`;
      } else if (data.mensual) {
        const fecha = new Date(data.tiempo);
        const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' });
        titulo += `${data.nombreComercial} - Mensual: ${nombreMes} ${fecha.getFullYear()}`;
      } else if (data.periodo) {
        const fechaInicio = new Date(data.tiempoperiodoini);
        const fechaFin = new Date(data.tiempoperiodofin);
        titulo += `${data.nombreComercial} - Periodo: ${fechaInicio.toLocaleDateString('es-ES')} a ${fechaFin.toLocaleDateString('es-ES')}`;
      }

    // Añadir el título en la primera fila y combinar celdas
    XLSX.utils.sheet_add_aoa(ws, [[titulo]], { origin: 'A1' });
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]; // Combina las celdas de A1 a I1
    ws["A1"].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" }
    };

    // Encabezados de la tabla
    const headers = [
        "Fecha", "Artículos", "Documento", "Estado", "Vendedor", 
        "Cliente", "Tipo", "Cuenta", "V.Total"
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A3' });

    // Función para formatear artículos sin límite de longitud ni cantidades
    const formatearArticulos = (articulos) => {
        return articulos.map(articulo => articulo.Titulo).join(", ");
    };

    // Agregar filas de ventas
    let totalSuma = 0;
    ventas.forEach((venta, index) => {
        const fecha = new Date(venta.tiempo).toLocaleDateString();
        const articulos = formatearArticulos(venta.articulosVendidos);
        const documento = venta.Doctype === 'Factura-Electronica' ? 'Electro-Fact' : venta.Doctype === 'Nota de venta' ? 'Nota' : venta.Doctype;
        const estado = venta.Estado;
        const vendedor = venta.Vendedor?.Nombre || 'N/A';

        const cliente = venta.nombreCliente.length > 25
            ? `${venta.nombreCliente.slice(0, 22)}...`
            : venta.nombreCliente;

        const tipo = venta.TipoVenta;
        
        let cuenta = "";
        if (venta.formasdePago && venta.formasdePago.length > 0) {
            cuenta = venta.formasdePago.map(pago => pago.Cuenta.NombreC).join(", ");
        }

        const total = venta.PrecioCompraTotal.toFixed(2);
        totalSuma += parseFloat(total);

        const row = [
            fecha, articulos, documento, estado, vendedor,
            cliente, tipo, cuenta, total
        ];
        XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${index + 4}` });
    });

    // Agregar fila de suma total al final
    const totalRow = ["", "", "", "", "", "", "", "Suma Total", totalSuma.toFixed(2)];
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: `A${ventas.length + 4}` });

    // Agregar la hoja al libro y guardar el archivo
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Ventas");
    const nombreArchivo = `${titulo.replace(/[:\/]/g, '_').replace(/ /g, '_')}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
};

export default generarReporteVentasExcel;
