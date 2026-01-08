
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pilot, Category } from '../types';

/**
 * Generates an official Entry List PDF
 */
export const generatePilotsPDF = (pilots: Pilot[], title: string, category?: Category) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const sortedPilots = [...pilots].filter(p => p.status !== 'Baja').sort((a, b) => a.ranking - b.ranking);

  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 38.5, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('LISTADO OFICIAL DE', 15, 15);
  doc.setFontSize(24);
  doc.text('INSCRIPTOS', 14, 28);

  const dateStr = new Date().toLocaleDateString('es-AR');
  const catStr = category ? category.toUpperCase() : 'PLANILLA GENERAL';
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(7);
  doc.text(`${catStr}`, pageWidth - 15, 15, { align: 'right' });
  doc.text(`FECHA: ${dateStr}`, pageWidth - 15, 20, { align: 'right' });

  autoTable(doc, {
    startY: 45,
    head: [['POS.', '#', 'PILOTO', 'ASOCIACIÓN / EQUIPO']],
    body: sortedPilots.map((p) => [p.ranking, p.number, p.name.toUpperCase(), p.association.toUpperCase()]),
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7, textColor: [40, 40, 40] },
    margin: { left: 15, right: 15 }
  });

  doc.save(`SoloKarting_Inscriptos_${catStr.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Generates an official Classification Result PDF
 */
export const generateResultsPDF = (sessionName: string, track: string, results: Pilot[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 33.5, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('CLASIFICACIÓN OFICIAL', 15, 15);
  doc.setFontSize(10);
  doc.text(`${sessionName.toUpperCase()} - ${track.toUpperCase()}`, 15, 25);

  autoTable(doc, {
    startY: 40,
    head: [['P', 'N°', 'PILOTO', 'ASOCIACIÓN', 'VTS', 'T. TOTAL', 'DIF', 'MEJOR VTA', 'EN']],
    body: results.map((p, i) => [i + 1, p.number, p.name.toUpperCase(), p.association.toUpperCase(), '14', '11:12.432', i === 0 ? '-' : `+${(i * 0.231).toFixed(3)}`, '48.110', '9']),
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30], fontSize: 7 },
    bodyStyles: { fontSize: 7 }
  });

  doc.save(`Resultado_${sessionName.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Generates a highly compact Lap-by-Lap Report with 2 columns
 */
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
  const pilotsToProcess = pilots.slice(0, 30); // Limitar para el ejemplo

  for (let i = 0; i < pilotsToProcess.length; i += 2) {
    // Estimamos altura de la tabla de vueltas (12 vueltas + header ~ 35mm)
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
      
      // Pilot label
      doc.setFillColor(235, 235, 235);
      doc.rect(startX, rowYStart, colWidth, 5, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(`POS ${i + idx + 1} - #${p.number} ${p.name.toUpperCase()}`, startX + 2, rowYStart + 3.5);

      const lapTimes = Array.from({ length: 12 }, (_, lapIdx) => [
        `V${lapIdx + 1}`, 
        (48.0 + Math.random() * (lapIdx === 0 ? 3 : 0.5)).toFixed(3)
      ]);

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

  doc.save(`Vueltas_Compacto_${sessionName.replace(/\s+/g, '_')}.pdf`);
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

  const head = [['POS', 'N°', 'PILOTO', 'ASOCIACIÓN', 'WINS', 'PODIUMS', 'PUNTOS']];
  const body = pilots.map((p, i) => [
    i + 1,
    p.number,
    p.name.toUpperCase(),
    p.association.toUpperCase(),
    p.stats?.wins || 0,
    p.stats?.podiums || 0,
    ((pilots.length - i) * 10 + (p.stats?.wins || 0) * 25).toFixed(1)
  ]);

  autoTable(doc, {
    startY: 45,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5 }
  });

  doc.save(`Standings_${category.replace(/\s+/g, '_')}.pdf`);
};
