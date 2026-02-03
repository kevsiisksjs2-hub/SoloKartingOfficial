
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pilot, Category, TimingRow, RaceResult } from '../types';

const drawKDOHeader = (doc: jsPDF, title: string, subtitle: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(250, 204, 21);
  doc.rect(0, 38, pageWidth, 2, 'F');
  doc.setTextColor(250, 204, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text("KDO", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("KART DISCIPLINA OFICIAL", 14, 28);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(title.toUpperCase(), pageWidth - 14, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(subtitle.toUpperCase(), pageWidth - 14, 25, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(250, 204, 21);
  doc.text(`EMISIÓN: ${new Date().toLocaleString('es-AR')}`, pageWidth - 14, 33, { align: 'right' });
};

/**
 * Genera el padrón en un formato compacto de dos columnas para ahorrar papel y facilitar lectura.
 */
export const generateCompactPilotsPDF = (pilots: Pilot[], title: string, category?: string) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, title, category || 'PADRÓN GENERAL');
  
  const midPoint = Math.ceil(pilots.length / 2);
  const leftCol = pilots.slice(0, midPoint);
  const rightCol = pilots.slice(midPoint);

  const formatPilotRow = (p: Pilot) => [`#${p.number}`, p.name.substring(0, 22), p.category.substring(0, 10)];

  autoTable(doc, {
    startY: 45,
    head: [['KART', 'PILOTO', 'CAT.', 'KART', 'PILOTO', 'CAT.']],
    body: Array.from({ length: midPoint }).map((_, i) => [
      ...(leftCol[i] ? formatPilotRow(leftCol[i]) : ['', '', '']),
      ...(rightCol[i] ? formatPilotRow(rightCol[i]) : ['', '', ''])
    ]),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', width: 15 },
      3: { fontStyle: 'bold', halign: 'center', width: 15 }
    }
  });

  doc.save(`KDO_Padron_Compacto_${category || 'General'}.pdf`);
};

/**
 * Genera resultados en formato compacto de dos columnas.
 */
export const generateCompactResultsPDF = (result: RaceResult) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "RESULTADOS COMPACTOS", `${result.sessionName} • ${result.track}`);
  
  const midPoint = Math.ceil(result.data.length / 2);
  const leftCol = result.data.slice(0, midPoint);
  const rightCol = result.data.slice(midPoint);

  const formatRow = (d: any) => [d.pos, `#${d.number}`, d.name.substring(0, 14), d.gap, d.bestLap];

  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'DIF.', 'MEJOR', 'POS', 'KART', 'PILOTO', 'DIF.', 'MEJOR']],
    body: Array.from({ length: midPoint }).map((_, i) => [
      ...(leftCol[i] ? formatRow(leftCol[i]) : ['', '', '', '', '']),
      ...(rightCol[i] ? formatRow(rightCol[i]) : ['', '', '', '', ''])
    ]),
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', width: 10 },
      1: { halign: 'center', width: 15 },
      5: { fontStyle: 'bold', halign: 'center', width: 10 },
      6: { halign: 'center', width: 15 }
    }
  });

  doc.save(`KDO_Resultados_Compactos_${result.sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generatePilotsPDF = (pilots: Pilot[], title: string, category?: Category) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, title, category ? `CATEGORÍA: ${category}` : 'PADRÓN GENERAL');
  autoTable(doc, {
    startY: 45,
    head: [['ORDEN', 'KART', 'PILOTO', 'CATEGORÍA', 'ESTADO']],
    body: pilots.map((p, i) => [i + 1, `#${p.number}`, p.name, p.category, p.status]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Listado_${Date.now()}.pdf`);
};

export const generateChampionshipPDF = (championshipName: string, category: string, pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "STANDINGS OFICIALES", `${championshipName} - ${category}`);
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'VICTORIAS', 'PUNTOS']],
    body: pilots.map((p, i) => [i + 1, `#${p.number}`, p.name, p.stats?.wins || 0, (p.stats?.points || 0).toFixed(1)]),
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Standings_${category}.pdf`);
};

export const generatePilotCredential = (pilot: Pilot) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 55] });
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 85, 55, 'F');
  doc.setFillColor(250, 204, 21);
  doc.rect(0, 0, 85, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("LICENCIA KDO 2026", 42.5, 7, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(pilot.name.toUpperCase(), 10, 20);
  doc.setTextColor(250, 204, 21);
  doc.setFontSize(16);
  doc.text(`KART #${pilot.number}`, 10, 30);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text(`CAT: ${pilot.category}`, 10, 38);
  doc.text(`MÉDICA: ${pilot.medicalLicense}`, 10, 43);
  doc.text(`DEPOR: ${pilot.sportsLicense}`, 10, 48);
  doc.save(`Credencial_${pilot.number}.pdf`);
};

export const generateDetailedLapsPDF = (result: RaceResult, selectedPilotNumbers?: string[]) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  drawKDOHeader(doc, "TIEMPOS VUELTA POR VUELTA", `${result.sessionName} • ${result.track}`);
  
  const pilotsInReport = selectedPilotNumbers && selectedPilotNumbers.length > 0
    ? result.data.filter(d => selectedPilotNumbers.includes(d.number))
    : result.data.slice(0, 10);

  if (pilotsInReport.length === 0) return;

  const maxLaps = Math.max(...pilotsInReport.map(d => d.lapsHistory?.length || 0));
  const headers = ['VTA', ...pilotsInReport.map(d => `#${d.number} ${d.name.split(' ')[0]}`)];
  
  const body = [];
  for (let i = 1; i <= maxLaps; i++) {
    const row = [i.toString()];
    pilotsInReport.forEach(pilot => {
      const lapTime = pilot.lapsHistory?.find(l => l.lap === i);
      row.push(lapTime ? lapTime.time : '-');
    });
    body.push(row);
  }

  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: body,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1, halign: 'center' },
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21], fontSize: 6.5 },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
  });

  doc.save(`KDO_Laps_${result.sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generateResultsPDF = (sessionName: string, track: string, data: any[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "RESULTADOS OFICIALES", `${sessionName} • ${track}`);
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'DIF.', 'MEJOR VTA']],
    body: data.map(d => [d.pos, `#${d.number}`, d.name, d.gap, d.bestLap]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Resultados_${sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generateLiveTimingPDF = (title: string, flag: string, timing: TimingRow[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "LIVE TIMING REPORT", `${title} • ESTADO: ${flag}`);
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'VTAS', 'ULT. VTA', 'MEJOR VTA', 'GAP']],
    body: timing.map(t => [t.pos, `#${t.no}`, t.name, t.laps, t.lastLap, t.bestLap, t.gap]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Live_${Date.now()}.pdf`);
};

export const generateBriefingAttendancePDF = (pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "ASISTENCIA A BRIEFING", "FIRMA OBLIGATORIA DE PILOTOS");
  autoTable(doc, {
    startY: 45,
    head: [['KART', 'PILOTO', 'CATEGORÍA', 'FIRMA']],
    body: pilots.map(p => [`#${p.number}`, p.name, p.category, '_________________']),
    theme: 'grid',
    styles: { cellPadding: 5 }
  });
  doc.save(`Asistencia_Briefing.pdf`);
};

export const generateMedicalEmergencyPDF = (pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "FICHA MÉDICA EVENTO", "DATOS CRÍTICOS PARA SERVICIOS DE SALUD");
  autoTable(doc, {
    startY: 45,
    head: [['KART', 'PILOTO', 'GRUPO SANG.', 'CONTACTO EMERGENCIA']],
    body: pilots.map(p => [`#${p.number}`, p.name, p.bloodType || 'N/A', p.emergencyContact || 'N/A']),
    theme: 'grid',
    headStyles: { fillColor: [200, 0, 0], textColor: [255, 255, 255] }
  });
  doc.save(`Fichas_Medicas.pdf`);
};
