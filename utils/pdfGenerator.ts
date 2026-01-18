
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pilot, Category } from '../types';

/**
 * Genera un PDF oficial de Inscriptos con diseño de 2 COLUMNAS por página.
 * Formato KDO Estándar: POS, KART, PILOTO, CATEGORÍA.
 */
export const generatePilotsPDF = (pilots: Pilot[], title: string, category?: Category) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Ordenar por fecha de inscripción
  const sortedPilots = [...pilots]
    .filter(p => p.status !== 'Baja')
    .sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));

  // Dividir pilotos en dos bloques para las dos columnas
  const midPoint = Math.ceil(sortedPilots.length / 2);
  const leftColPilots = sortedPilots.slice(0, midPoint);
  const rightColPilots = sortedPilots.slice(midPoint);

  const drawHeader = (d: jsPDF) => {
    // Cabezal Institucional Negro
    d.setFillColor(15, 15, 15);
    d.rect(0, 0, pageWidth, 40, 'F');
    
    // Línea de acento Roja KDO
    d.setFillColor(220, 38, 38);
    d.rect(0, 38.5, pageWidth, 1.5, 'F');

    // Textos del Cabezal
    d.setTextColor(255, 255, 255);
    d.setFont('helvetica', 'bold');
    d.setFontSize(8);
    d.text('KDO - KARTING DISCIPLINA OFICIAL', 15, 12);
    d.setFontSize(22);
    d.text('PLANILLA DE INSCRIPTOS', 14, 25);

    const dateStr = new Date().toLocaleDateString('es-AR');
    const catLabel = category ? category.toUpperCase() : 'TODAS LAS CATEGORÍAS';
    
    d.setTextColor(180, 180, 180);
    d.setFontSize(7);
    d.text(`${catLabel}`, pageWidth - 15, 12, { align: 'right' });
    d.text(`FECHA: ${dateStr}`, pageWidth - 15, 17, { align: 'right' });
    d.text(`CANTIDAD: ${sortedPilots.length} PILOTOS`, pageWidth - 15, 22, { align: 'right' });
  };

  drawHeader(doc);

  const sharedStyles = {
    theme: 'striped' as const,
    headStyles: { 
      fillColor: [0, 0, 0] as [number, number, number], 
      textColor: [255, 255, 255] as [number, number, number], 
      fontStyle: 'bold' as const, 
      fontSize: 7, 
      halign: 'center' as const,
      cellPadding: 2 
    },
    bodyStyles: { 
      fontSize: 6.5, 
      textColor: [20, 20, 20] as [number, number, number], 
      cellPadding: 2,
      valign: 'middle' as const
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' as const, fontStyle: 'bold' as const },
      1: { cellWidth: 10, halign: 'center' as const, fontStyle: 'bold' as const, textColor: [220, 38, 38] as [number, number, number] },
      2: { cellWidth: 'auto', fontStyle: 'bold' as const },
      3: { cellWidth: 20, halign: 'left' as const, textColor: [100, 100, 100] as [number, number, number] }
    },
    margin: { top: 45 },
  };

  // Tabla Columna Izquierda
  autoTable(doc, {
    ...sharedStyles,
    startY: 45,
    margin: { left: 10, right: pageWidth / 2 + 2 },
    head: [['POS', 'KART', 'PILOTO', 'CATEGORÍA']],
    body: leftColPilots.map((p, index) => [
      index + 1,
      `#${p.number}`, 
      p.name.toUpperCase(), 
      p.category.split(' ').slice(0, 2).join(' ') // Abreviar categoría si es larga
    ]),
  });

  // Tabla Columna Derecha
  autoTable(doc, {
    ...sharedStyles,
    startY: 45,
    margin: { left: pageWidth / 2 + 2, right: 10 },
    head: [['POS', 'KART', 'PILOTO', 'CATEGORÍA']],
    body: rightColPilots.map((p, index) => [
      midPoint + index + 1,
      `#${p.number}`, 
      p.name.toUpperCase(), 
      p.category.split(' ').slice(0, 2).join(' ')
    ]),
  });

  const fileName = category 
    ? `Inscripciones_${category.replace(/\s+/g, '_')}.pdf`
    : `Inscripciones_General.pdf`;

  doc.save(fileName);
};

export const generateResultsPDF = (sessionName: string, track: string, results: Pilot[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 33.5, pageWidth, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('RESULTADOS OFICIALES', 15, 15);
  doc.setFontSize(10);
  doc.text(`${sessionName.toUpperCase()} - ${track.toUpperCase()}`, 15, 25);
  autoTable(doc, {
    startY: 40,
    head: [['POS', 'KART', 'PILOTO', 'CATEGORÍA', 'VTS', 'T. TOTAL', 'DIF', 'MEJOR VTA', 'EN']],
    body: results.map((p, i) => [i + 1, p.number, p.name.toUpperCase(), p.category.toUpperCase(), '14', '11:12.432', i === 0 ? '-' : `+${(i * 0.231).toFixed(3)}`, '48.110', '9']),
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30], fontSize: 7, halign: 'center' },
    bodyStyles: { fontSize: 7 },
    columnStyles: { 0: { halign: 'center', fontStyle: 'bold', cellWidth: 15 }, 1: { halign: 'center', fontStyle: 'bold', cellWidth: 15 } }
  });
  doc.save(`Resultado_${sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generateLapByLapPDF = (sessionName: string, track: string, pilots: Pilot[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const drawHeader = (doc: jsPDF) => {
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 28.5, pageWidth, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('HISTORIAL DE VUELTAS (VvV)', 15, 12);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`${sessionName.toUpperCase()} - ${track.toUpperCase()}`, 15, 20);
    const now = new Date();
    doc.setFontSize(6);
    doc.text(`EMITIDO: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, pageWidth - 15, 12, { align: 'right' });
  };
  drawHeader(doc);
  let currentY = 35;
  const colWidth = (pageWidth - 40) / 2;
  const pilotsToProcess = pilots.slice(0, 30); 
  for (let i = 0; i < pilotsToProcess.length; i += 2) {
    if (currentY > pageHeight - 45) {
      doc.addPage();
      drawHeader(doc);
      currentY = 35;
    }
    const rowPilots = [pilotsToProcess[i], pilotsToProcess[i + 1]].filter(Boolean);
    const rowYStart = currentY;
    let maxTableY = currentY;
    rowPilots.forEach((p, idx) => {
      const startX = 15 + (idx * (colWidth + 10));
      doc.setFillColor(235, 235, 235);
      doc.rect(startX, rowYStart, colWidth, 5, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(`KART #${p.number} - ${p.name.toUpperCase()}`, startX + 2, rowYStart + 3.5);
      const lapTimes = Array.from({ length: 12 }, (_, lapIdx) => [`V${lapIdx + 1}`, (48.0 + Math.random() * (lapIdx === 0 ? 3 : 0.5)).toFixed(3)]);
      autoTable(doc, {
        startY: rowYStart + 5,
        head: [['V', 'TIEMPO']],
        body: lapTimes,
        theme: 'grid',
        tableWidth: colWidth,
        margin: { left: startX },
        headStyles: { fillColor: [40, 40, 40], fontSize: 5, halign: 'center', cellPadding: 0.5 },
        bodyStyles: { fontSize: 5.5, halign: 'center', cellPadding: 0.4 },
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: colWidth - 10 } },
        styles: { overflow: 'hidden' }
      });
      const finalY = (doc as any).lastAutoTable.finalY;
      if (finalY > maxTableY) maxTableY = finalY;
    });
    currentY = maxTableY + 8;
  }
  doc.save(`Vueltas_${sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generateChampionshipPDF = (championshipName: string, category: string, pilots: Pilot[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('POSICIONES CAMPEONATO', 15, 15);
  doc.setFontSize(9);
  doc.text(`${championshipName.toUpperCase()} - ${category.toUpperCase()}`, 15, 25);
  const head = [['POS', 'KART', 'PILOTO', 'CATEGORÍA', 'PUNTOS']];
  const body = pilots.map((p, i) => [i + 1, p.number, p.name.toUpperCase(), p.category.toUpperCase(), ((pilots.length - i) * 10 + (p.stats?.wins || 0) * 25).toFixed(1)]);
  autoTable(doc, {
    startY: 45,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], fontSize: 7.5, halign: 'center' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: { 0: { halign: 'center', fontStyle: 'bold', cellWidth: 15 }, 1: { halign: 'center', fontStyle: 'bold', cellWidth: 15 } }
  });
  doc.save(`Campeonato_${category.replace(/\s+/g, '_')}.pdf`);
};
