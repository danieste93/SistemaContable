import * as XLSX from 'xlsx';

const exportarClienteExcel = (clientes) => {
  if (!clientes || clientes.length === 0) {
    console.warn("No hay datos para exportar.");
    return;
  }

  // Generar título con fecha actual
  const fechaActual = new Date().toLocaleDateString('es-ES');
  const titulo = `Lista de Clientes - ${fechaActual}`;

  // Definir los encabezados en el orden solicitado
  const headers = ["ID", "Tipo ID", "Usuario","Telefono", "Email", "Ciudad", "Dirección"];

  // Crear los datos de las filas
  const filas = clientes.map(cliente => [
    cliente.Cedula ?? '',
    cliente.TipoID ?? '',
    cliente.Usuario ?? '',
      cliente.Telefono ?? '',
    cliente.Email ?? '',
    cliente.Ciudad ?? '',
    cliente.Direccion ?? ''
  ]);

  // Crear hoja de trabajo con los datos
  const ws = XLSX.utils.aoa_to_sheet([
    [titulo], // Primera fila con el título
    [],       // Fila vacía
    headers,  // Encabezados
    ...filas  // Datos
  ]);

  // Aplicar negrita a los encabezados (fila 3)
  const rangeHeaders = XLSX.utils.decode_range("A3:F3");
  for (let C = rangeHeaders.s.c; C <= rangeHeaders.e.c; C++) {
    const cellRef = XLSX.utils.encode_cell({ r: 2, c: C });
    if (!ws[cellRef]) continue;
    if (!ws[cellRef].s) ws[cellRef].s = {};
    ws[cellRef].s.font = { bold: true };
  }

  // Ajustar ancho de las columnas
  ws['!cols'] = headers.map(() => ({ wch: 20 })); // Ancho estándar de 20

  // Crear el libro de trabajo y añadir la hoja
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

  // Generar el archivo
  const nombreArchivo = `Clientes_${fechaActual.replace(/\//g, '_')}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
};

export default exportarClienteExcel;
