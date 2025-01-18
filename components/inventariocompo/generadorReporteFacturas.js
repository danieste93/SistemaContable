import * as XLSX from 'xlsx';

const  jsonToExcel = (items, data) => {
  console.log(data)
  // Generar el título dinámico
  let titulo = 'Reporte de Ventas';
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

  // Definir las cabeceras
  const header = [
    "Factura Nº", 
    "Clave de Acceso", 
    "Numero Autorizacion", 
    "Fecha Autorizacion", 
    "Cedula Receptor", 
    "Nombre Receptor", 
    "Detalle", 
    "Sub-Total", 
    "IvaEC", 
    "Total"
  ];

  // Crear los datos de las filas

  const rowItems = items.map((row) => {
    return header.map((fieldName) => {
      if (fieldName === 'Factura Nº') {
        return (data.estab+data.ptoEmi + row["Secuencial"]);
      } else if (fieldName === 'Clave de Acceso') {
        return row["ClaveAcceso"] ?? '';
      } else if (fieldName === 'Numero Autorizacion') {
        return row["FactAutorizacion"] ?? '';
      } else if (fieldName === 'Fecha Autorizacion') {
        return row["FactFechaAutorizacion"] ?? '';
      } else if (fieldName === 'Cedula Receptor') {
        return row["cedulaCliente"] ?? '';
      } else if (fieldName === 'Nombre Receptor') {
        return row["nombreCliente"] ?? '';
      } else if (fieldName === 'Detalle') {
        const dataDeta = row.articulosVendidos.map(x => {
          let sinbackslash = x.Titulo.replace(/\\/g, "/").replace(/"/g, "'").replace(",", ".");
          return sinbackslash + " -";
        }).join(' ');
        return dataDeta ?? '';
      } else if (fieldName === 'Sub-Total') {
        return parseFloat(row["baseImponible"]).toFixed(2);
      } else if (fieldName === 'IvaEC') {
        return parseFloat(row["IvaEC"]).toFixed(2);
      } else if (fieldName === 'Total') {
        return parseFloat(row["PrecioCompraTotal"]).toFixed(2);
      }
    });
  });

  // Crear una hoja de trabajo
  const ws = XLSX.utils.aoa_to_sheet([
    [titulo], // Título en la primera fila
    [],       // Fila en blanco
    header,   // Encabezados
    ...rowItems // Filas de datos
  ]);

  // Ajustar el ancho de las columnas
  ws['!cols'] = [
    { wch: 15 }, // Factura Nº
    { wch: 35 }, // Clave de Acceso (ancho extendido)
    { wch: 35 }, // Numero Autorizacion (ancho extendido)
    { wch: 20 }, // Fecha Autorizacion
    { wch: 20 }, // Cedula Receptor
    { wch: 30 }, // Nombre Receptor
    { wch: 40 }, // Detalle
    { wch: 15 }, // Sub-Total
    { wch: 10 }, // IvaEC
    { wch: 15 }, // Total
  ];

  // Crear el libro de trabajo
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Ventas');

  // Guardar el archivo con el título como nombre
  const nombreArchivo = `${titulo.replace(/[:\/]/g, '_').replace(/ /g, '_')}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
};
export default jsonToExcel