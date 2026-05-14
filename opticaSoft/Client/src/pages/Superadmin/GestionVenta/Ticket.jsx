import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarTicketVenta = (
  cotizacionData,
  searchFilteredData,
  getTratamientosByPedido,
  formatDateString
) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: [226.77, 400] // ancho: 8cm, alto: se ajusta
  });

  let y = 20;

  const centerText = (text, size = 10, offset = 0) => {
    doc.setFontSize(size);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (doc.internal.pageSize.width - textWidth) / 2, y + offset);
    y += offset + 2;
  };

  // Encabezado
  doc.setFont('helvetica', 'bold');
  centerText('ÓPTICA MARYEN', 12, 10);
  doc.setFont('helvetica', 'normal');
  centerText('Especialistas en Salud Visual', 9, 12);
  centerText('Cristóbal Colón #26, Loc.1', 8, 10);
  centerText('Atrás de Universidad Americana', 8, 10);
  centerText('Frente al Restaurante Buzo\'s', 8, 10);
  centerText('Tel: 744 504 4946', 8, 10);
  //centerText('RFC: MARY890101ABC', 8, 10);

  y += 10;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(10, y, 216.77, y); // línea horizontal

  y += 10;

  // Info cotización
  doc.setFontSize(8);
  doc.text(`Ticket: ${cotizacionData?.codigo || 'N/A'}`, 10, y);
  doc.text(`Fecha: ${formatDateString(cotizacionData?.fechaRegistro) || 'N/A'}`, 120, y);

  y += 12;
  doc.text(`Cliente: ${cotizacionData?.nombrePaciente || 'Público en general'}`, 10, y);

  y += 10;
  doc.line(10, y, 216.77, y);
  y += 5;

  // Detalle de productos
  searchFilteredData.forEach((pedido) => {
    const tratamientos = getTratamientosByPedido(pedido.idPedido);
    const items = [];

    if (pedido.modelo) items.push([`Armazón ${pedido.marca} ${pedido.modelo}`, `$${pedido.precioArmazon || '0.00'}`]);
    if (pedido.tipoLente) items.push([`Lentes ${pedido.tipoLente}`, `$${pedido.precioLente || '0.00'}`]);
    if (pedido.material) items.push([`Material ${pedido.material}`, `$${pedido.precioMaterial || '0.00'}`]);
    if (pedido.marcaLentesContacto) items.push([`Lentes contacto ${pedido.marcaLentesContacto}`, `$${pedido.precioLentesContacto || '0.00'}`]);
    if (pedido.paquete) items.push([`Paquete ${pedido.paquete}`, `$${pedido.precioPaquete || '0.00'}`]);

    tratamientos.forEach(trat => {
      items.push([`Tratamiento: ${trat.nombreTratamiento}`, `$${trat.precioTratamiento || '0.00'}`]);
    });

    autoTable(doc, {
      startY: y,
      body: items,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: 20,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 130 },
        1: { cellWidth: 60, halign: 'right' }
      },
      margin: { left: 10, right: 10 }
    });

    y = doc.lastAutoTable.finalY + 5;

    if (pedido.observaciones) {
      doc.setFontSize(7);
      doc.text(`Notas: ${pedido.observaciones}`, 10, y);
      y += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Total (${pedido.cantidad} un.): $${pedido.total}`, 10, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
  });

  doc.line(10, y, 216.77, y);
  y += 10;

  // Totales
  const subtotal = Number(cotizacionData?.subtotal) || 0;
  const descuento = Number(cotizacionData?.descuento) || 0;
  const iva = cotizacionData?.iva ? subtotal * 0.16 : 0;
  const total = Number(cotizacionData?.total) || 0;

  const resumen = [
    ['Subtotal', `$${subtotal.toFixed(2)}`],
    ['Descuento', `-$${(subtotal * (descuento / 100)).toFixed(2)}`],
    ['IVA', `$${iva.toFixed(2)}`],
    ['Total', `$${total.toFixed(2)}`],
  ];

  resumen.forEach(([label, val]) => {
    doc.setFontSize(8);
    doc.text(label, 10, y);
    doc.text(val, 190, y, { align: 'right' });
    y += 10;
  });

  y += 5;
  doc.line(10, y, 216.77, y);
  y += 15;

  // Gracias y leyenda
  centerText('¡Gracias por su compra!', 9, 10);
  centerText('Este ticket no es válido como factura', 7, 10);
  centerText('Horario: Lun-Vie 11:00 - 18:30 | Sáb 10:30 - 15:00', 7, 10);

  // Guardar
  doc.save(`Ticket_Maryen_${cotizacionData?.codigo || Date.now()}.pdf`);
  
}