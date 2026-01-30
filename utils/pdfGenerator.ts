
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pilot, Category } from '../types';

/**
 * PDF Genérico para Inscriptos
 */
export const generatePilotsPDF = (pilots: Pilot[], title: string, category?: Category) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const sortedPilots = [...pilots]
    .filter(p => p.status !== 'Baja')
    .sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));

  const drawHeader = (d: jsPDF) => {
    d.setFillColor(10, 10, 10);
    d.rect(0, 0, pageWidth, 45, 'F');
    d.setFillColor(37, 99, 235);
    d.rect(0, 43.5, pageWidth, 1.5, 'F');
    
    d.setTextColor(255, 255, 255);
    d.setFont('helvetica', 'bold');
    d.setFontSize(8);
    d.text('PKN - PILOTOS KARTING DEL NORTE', 15, 12);
    
    d.setFontSize(22);
    d.text(title.toUpperCase(), 14, 28);
    
    const dateStr = new Date().toLocaleDateString('es-AR');
    d.setTextColor(150, 150, 150);
    d.setFontSize(7);
    d.text(`FECHA DE EMISION: ${dateStr}`, pageWidth - 15, 12, { align: 'right' });
    d.text(`TOTAL INSCRIPTOS: ${sortedPilots.length}`, pageWidth - 15, 17, { align: 'right' });
  };

  drawHeader(doc);

  autoTable(doc, {
    startY: 50,
    head: [['N°', 'PILOTO', 'CATEGORÍA', 'ESTADO']],
    body: sortedPilots.map((p) => [`#${p.number}`, p.name.toUpperCase(), p.category, p.status.toUpperCase()]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      1: { fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 30 }
    }
  });

  doc.save(`Inscripciones_PKN_${category || 'General'}.pdf`);
};

/**
 * Ranking de Campeonato Oficial
 */
export const generateChampionshipPDF = (championshipName: string, category: string, pilots: Pilot[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, pageWidth, 50, 'F');
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 48.5, pageWidth, 1.5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PILOTOS KARTING DEL NORTE • RANKING OFICIAL', 15, 15);
  
  doc.setFontSize(24);
  doc.text('CAMPEONATO 2024', 14, 30);
  
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text(category.toUpperCase(), 15, 40);
  
  const dateStr = new Date().toLocaleDateString('es-AR');
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.text(`PUNTOS CALCULADOS AL: ${dateStr}`, pageWidth - 15, 15, { align: 'right' });

  autoTable(doc, {
    startY: 55,
    head: [['POS', 'KART', 'PILOTO', 'WINS', 'PODS', 'PUNTOS']],
    body: pilots.map((p, i) => {
      const points = (p.stats?.wins || 0) * 25 + (p.stats?.podiums || 0) * 15 + (p.stats?.poles || 0) * 5;
      return [
        i + 1,
        `#${p.number}`,
        p.name.toUpperCase(),
        p.stats?.wins || 0,
        p.stats?.podiums || 0,
        points.toFixed(1)
      ];
    }),
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], halign: 'center', fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, valign: 'middle' },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 15 },
      1: { halign: 'center', fontStyle: 'bold', cellWidth: 15, textColor: [37, 99, 235] },
      2: { fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 25 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.text('ESTE DOCUMENTO ES PROPIEDAD DE PILOTOS KARTING DEL NORTE - PROCESADO POR SISTEMA PKN', pageWidth / 2, finalY + 15, { align: 'center' });

  doc.save(`Ranking_PKN_${category.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Resultados de Carrera / Clasificación
 */
export const generateResultsPDF = (sessionName: string, track: string, results: Pilot[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 38.5, pageWidth, 1.5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CLASIFICACION OFICIAL', 15, 18);
  doc.setFontSize(9);
  doc.text(`${sessionName.toUpperCase()} • ${track.toUpperCase()}`, 15, 28);
  
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'TIEMPO', 'DIF']],
    body: results.map((p, i) => [
      i + 1,
      `#${p.number}`,
      p.name.toUpperCase(),
      (48 + Math.random()).toFixed(3),
      i === 0 ? '-' : `+${(i * 0.125).toFixed(3)}`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], halign: 'center', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { halign: 'center', fontStyle: 'bold' }, 1: { halign: 'center', fontStyle: 'bold' } }
  });
  
  doc.save(`Resultados_PKN_${sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generateLapByLapPDF = (sessionName: string, track: string, pilots: Pilot[]) => {
  // Función simplificada para vueltas
  const doc = new jsPDF();
  doc.text('Reporte de Vueltas PKN', 10, 10);
  doc.save(`Vueltas_PKN_${sessionName}.pdf`);
};
