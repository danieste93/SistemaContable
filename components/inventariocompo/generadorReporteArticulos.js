import * as XLSX from 'xlsx';

const exportarInventarioExcel = (productos) => {
  if (!productos || productos.length === 0) {
    console.warn("No hay datos para exportar.");
    return;
  }

  // Generar título con fecha actual
  const fechaActual = new Date().toLocaleDateString('es-ES');
  const titulo = `Inventario - ${fechaActual}`;

  // Definir los encabezados en el orden solicitado
  const headers = [
    "Diid", "Eqid", "Título", "Cantidad", "Tipo", 
    "Categoría", "Precio Venta", "Precio Alternativo", 
    "Precio Compra", "Precio Total"
  ];

  // Crear los datos de las filas
  const filas = productos.map((producto) => [
    producto.Diid ?? '',
    producto.Eqid ?? '',
    producto.Titulo ?? '',
    producto.Existencia ?? 0,
    producto.Tipo ?? '',
    producto.Categoria.nombreCat ?? '',
    (producto.Precio_Venta ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 }),
    (producto.Precio_Alt ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 }),
    (producto.Precio_Compra ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 }),
    (producto.PrecioCompraTotal ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })
  ]);

  // Calcular el total del inventario (ignorando "Servicio" y "Combo")
  const totalInventario = productos
    .filter(p => p.Tipo !== "Servicio" && p.Tipo !== "Combo")
    .reduce((sum, p) => sum + (p.PrecioCompraTotal || 0), 0)
    .toLocaleString('es-ES', { minimumFractionDigits: 2 });

  // Agregar la fila de total al final
  const filaTotal = ["", "", "", "", "", "", "", "", "Total del Inventario", totalInventario];

  // Crear hoja de trabajo con los datos
  const ws = XLSX.utils.aoa_to_sheet([
    [titulo], // Primera fila con el título
    [],       // Fila vacía
    headers,  // Encabezados
    ...filas, // Datos
    [],       // Fila vacía
    filaTotal // Total del inventario
  ]);

  // Aplicar negrita a los encabezados (fila 3)
  const rangeHeaders = XLSX.utils.decode_range("A3:J3");
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
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

  // Generar el archivo
  const nombreArchivo = `Inventario_${fechaActual.replace(/\//g, '_')}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
};

export default exportarInventarioExcel;
