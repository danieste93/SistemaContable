import * as XLSX from 'xlsx';

const generarReporteComprasExcel = (compras, data) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Configuración del título
    let titulo = "Reporte de Compras";
    if (data.diario) {
        const fecha = new Date(data.tiempo);
        const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        titulo += `${data.nombreComercial} - Diario: ${nombreDia} - ${fecha.toLocaleDateString('es-ES')}`;
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
        "Fecha", "Artículos", "Documento", "N° de Compra", "Vendedor",
        "Proveedor", "Forma de Pago", "Cuenta", "Costo Total"
    ];
    const formatearArticulos = (articulos) => {
        return articulos.map(articulo => articulo.Titulo).join(", ");
    };
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A3' });

    // Función para recortar el nombre del proveedor a 15 caracteres
    const recortarNombre15 = (nombre) => nombre.length > 15 ? `${nombre.slice(0, 12)}...` : nombre;

    // Agregar filas de compras
    let totalCosto = 0;
    compras.forEach((compra, index) => {
        const fecha = new Date(compra.Tiempo).toLocaleDateString();
        const articulos = formatearArticulos(compra.ArtComprados);
        const documento = compra.Doctype === 'Factura-Electronica' ? 'Electro-Fact' : compra.Doctype === 'Nota de compra' ? 'Nota' : compra.Doctype;
        const CompraNumero = compra.CompraNumero;
        const vendedor = compra.Usuario?.Nombre || 'N/A';
        const proveedor = recortarNombre15(compra.Factdata?.nombreComercial || "N/A");
        const forma = compra.Fpago.map(f => f.Tipo).join(", ");
        let cuenta = "";
        if (compra.Fpago && compra.Fpago.length > 0) {
            cuenta = compra.Fpago.map(pago => pago.Cuenta?.NombreC || "N/A").join(", ");
        }
        const total = parseFloat(compra.ValorTotal).toFixed(2);
        totalCosto += parseFloat(total);

        const row = [
            fecha, articulos, documento, CompraNumero, vendedor,
            proveedor, forma, cuenta, total
        ];
        XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${index + 4}` });
    });

    // Agregar fila de suma total al final
    const totalRow = ["", "", "", "", "", "", "", "Suma Total", totalCosto.toFixed(2)];
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: `A${compras.length + 4}` });

    // Agregar la hoja al libro y guardar el archivo
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Compras");
    const nombreArchivo = `${titulo.replace(/[:\/]/g, '_').replace(/ /g, '_')}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
};

export default generarReporteComprasExcel;
