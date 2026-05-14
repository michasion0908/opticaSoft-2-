import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarCotizacionPDF = (
  cotizacionData,
  searchFilteredData,
  getTratamientosByPedido,
  formatDateString,
  observacionesCotizacion
) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  let yPos = margin;

  // Paleta de colores
  const primaryColor = '#92d050'; // Verde principal
  const primaryDark = '#7cb342'; // Verde oscuro
  const secondaryColor = '#f8f8f8'; // Gris muy claro
  const accentColor = '#4caf50'; // Verde medio
  const textColor = '#333333'; // Gris oscuro para mejor legibilidad
  const lightText = '#777777'; // Gris para texto secundario

  // Encabezado mejorado
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, doc.internal.pageSize.width, 80, 'F');
  
  // Logo o icono (puedes reemplazar esto con un logo real si lo tienes)
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  //doc.text('👓', margin, 50); // Icono de gafas
  doc.text('ÓPTICA MARYEN', margin + 40, 50);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Especialistas en Salud Visual', margin + 40, 70);

  yPos = 100;

  // Información de la cotización con fondo
  doc.setFillColor(secondaryColor);
  doc.roundedRect(margin, yPos - 20, doc.internal.pageSize.width - 2 * margin, 40, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Cotización #: ${cotizacionData?.codigo || 'N/A'}`, margin + 15, yPos);
  doc.text(`Fecha: ${formatDateString(cotizacionData?.fechaRegistro) || 'N/A'}`, doc.internal.pageSize.width - margin - 15, yPos, { align: 'right' });

  yPos += 40;

  // Información del paciente con estilo moderno
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDark);
  doc.text('Información del Paciente', margin, yPos);
  
  // Línea decorativa
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(2);
  doc.line(margin, yPos + 5, margin + 150, yPos + 5);

  yPos += 25;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor);
  
  // Cuadro de información del paciente
  const patientInfo = [
    [`Nombre:`, `${cotizacionData?.nombrePaciente || 'No especificado'}`],
    [`Teléfono:`, `${cotizacionData?.telefono || 'No especificado'}`],
    [`Dirección:`, `${cotizacionData?.direccion || 'No especificado'}${cotizacionData?.localidad ? `, ${cotizacionData.localidad}` : ''}`]
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: patientInfo,
    styles: {
      textColor: textColor,
      font: 'helvetica',
      fontSize: 11,
    },
    bodyStyles: {
      cellPadding: { top: 5, right: 5, bottom: 5, left: 5 },
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80, textColor: primaryDark },
      1: { cellWidth: 'auto' }
    },
    tableWidth: 'wrap',
    margin: { left: margin, right: margin },
    theme: 'plain',
    tableLineColor: [255, 255, 255],
    tableLineWidth: 0,
  });

  yPos = doc.lastAutoTable.finalY + 30;

  // Detalle de productos con diseño mejorado
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDark);
  doc.text('Detalle de Productos', margin, yPos);
  
  // Línea decorativa
  doc.line(margin, yPos + 5, margin + 150, yPos + 5);

  yPos += 25;

  searchFilteredData.forEach((pedido, index) => {
    const tratamientos = getTratamientosByPedido(pedido.idPedido);

    const items = [];

    if (pedido.modelo) {
      items.push([`Armazón ${pedido.marca} ${pedido.modelo}`, `$${pedido.precioArmazon || '0.00'}`]);
    }

    if (pedido.tipoLente) {
      items.push([`Lentes ${pedido.tipoLente}`, `$${pedido.precioLente || '0.00'}`]);
    }

    if (pedido.material) {
      items.push([`Material ${pedido.material}`, `$${pedido.precioMaterial || '0.00'}`]);
    }

    if (pedido.marcaLentesContacto) {
      items.push([`Lentes de contacto ${pedido.marcaLentesContacto}`, `$${pedido.precioLentesContacto || '0.00'}`]);
    }

    if (pedido.paquete) {
      items.push([`Paquete ${pedido.paquete}`, `$${pedido.precioPaquete || '0.00'}`]);
    }

    tratamientos.forEach(trat => {
      items.push([`Tratamiento: ${trat.nombreTratamiento}`, `$${trat.precioTratamiento || '0.00'}`]);
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Descripción', 'Precio']],
      body: items,
      styles: {
        textColor: textColor,
        font: 'helvetica',
        fontSize: 10,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        cellPadding: 6,
      },
      alternateRowStyles: {
        fillColor: secondaryColor,
      },
      margin: { left: margin, right: margin },
      tableLineColor: [220, 220, 220],
      tableLineWidth: 0.5,
    });

    yPos = doc.lastAutoTable.finalY + 15;

    if (pedido.observaciones) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(lightText);
      doc.text(`Notas: ${pedido.observaciones}`, margin + 5, yPos);
      yPos += 15;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryDark);
    doc.text(`Total (${pedido.cantidad} unidades): $${pedido.total}`, doc.internal.pageSize.width - margin, yPos, { align: 'right' });

    yPos += 30;
    
    // Línea divisoria entre pedidos
    if (index < searchFilteredData.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos - 10, doc.internal.pageSize.width - margin, yPos - 10);
    }
  });

  // Resumen financiero con diseño mejorado
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDark);
  doc.text('Resumen Financiero', margin, yPos);
  
  // Línea decorativa
  doc.line(margin, yPos + 5, margin + 150, yPos + 5);

  yPos += 25;

  const subtotal = Number(cotizacionData?.subtotal) || 0;
  const descuento = Number(cotizacionData?.descuento) || 0;
  const iva = cotizacionData?.iva ? subtotal * 0.16 : 0;
  const total = Number(cotizacionData?.total) || 0;

  const resumen = [
    ['Subtotal', `$${subtotal.toFixed(2)}`],
    [`Descuento (${descuento}%)`, `-$${(subtotal * (descuento / 100)).toFixed(2)}`],
    [`IVA (${cotizacionData?.iva ? '16' : '0'}%)`, `$${iva.toFixed(2)}`],
    ['Total a Pagar', `$${total.toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: yPos,
    body: resumen,
    styles: {
      textColor: textColor,
      font: 'helvetica',
      fontSize: 11,
    },
    bodyStyles: {
      cellPadding: 8,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: primaryDark },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    tableLineColor: [220, 220, 220],
    tableLineWidth: 0.5,
    theme: 'grid',
    head: [['Concepto', 'Valor']],
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
    },
  });

  yPos = doc.lastAutoTable.finalY + 25;

  // Observaciones con diseño mejorado
  if (observacionesCotizacion) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryDark);
    doc.text('Observaciones', margin, yPos);
    
    // Línea decorativa
    doc.line(margin, yPos + 5, margin + 100, yPos + 5);

    yPos += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    
    // Fondo para las observaciones
    doc.setFillColor(secondaryColor);
    doc.roundedRect(margin, yPos - 5, doc.internal.pageSize.width - 2 * margin, 50, 3, 3, 'F');
    
    const splitObservaciones = doc.splitTextToSize(observacionesCotizacion, doc.internal.pageSize.width - 2 * margin - 20);
    doc.text(splitObservaciones, margin + 10, yPos + 5);
    yPos += splitObservaciones.length * 12 + 20;
  }

  // Pie de página mejorado
    // Pie de página mejorado
  doc.setFillColor(primaryColor);
  doc.rect(0, doc.internal.pageSize.height - 80, doc.internal.pageSize.width, 80, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  
  // Logo pequeño en el footer
  doc.setFontSize(14);
  //    doc.text('👓', margin, doc.internal.pageSize.height - 55);
  
  doc.setFontSize(10);
  doc.text('ÓPTICA MARYEN - Especialistas en Salud Visual', margin + 20, doc.internal.pageSize.height - 55);
  doc.text('Cristóbal Colón #26, Loc.1 - Atrás de Universidad Americana', margin + 20, doc.internal.pageSize.height - 40);
  doc.text('Frente al Restaurante Buzo\'s', margin + 20, doc.internal.pageSize.height - 25);
  
  // Contacto actualizado (sin correo, con horario y teléfono correctos)
  doc.text('Teléfono: 744 504 4946', doc.internal.pageSize.width - margin, doc.internal.pageSize.height - 55, { align: 'right' });
  doc.text('Horario: Lun-Vie 11:00 - 18:30 | Sáb 10:30 - 15:00', doc.internal.pageSize.width - margin, doc.internal.pageSize.height - 40, { align: 'right' });

  // Guardar el PDF
    doc.save(`Cotizacion_Maryen_${cotizacionData?.codigo || new Date().getTime()}.pdf`);
  }