
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
  doc.text(`EMISIÓN OFICIAL: ${new Date().toLocaleString('es-AR')}`, pageWidth - 14, 33, { align: 'right' });
};

// 1. PDF de Inscriptos Simple (N° Kart, Ranking, Categoría, Nombre y Apellido)
export const generateInscriptosSimplePDF = (pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "PLANILLA DE INSCRIPTOS", "LISTADO GENERAL POR DORSAL");
  
  autoTable(doc, {
    startY: 45,
    head: [['KART', 'RANKING', 'CATEGORÍA', 'NOMBRE Y APELLIDO']],
    body: pilots.map(p => [`#${p.number}`, p.ranking || '-', p.category, p.name]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] },
    styles: { fontSize: 10, cellPadding: 4 }
  });
  
  doc.save(`KDO_Inscriptos_Simple_${Date.now()}.pdf`);
};

// 2. PDF de Inscritos Verificación (N° Kart, Ranking, Categoría, Nombre, Licencias y Firma)
export const generateInscriptosLicenciasPDF = (pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "REGISTRO DE LICENCIAS", "VERIFICACIÓN ADMINISTRATIVA Y FIRMA");
  
  autoTable(doc, {
    startY: 45,
    head: [['KART', 'RANK', 'CATEGORÍA', 'PILOTO', 'L. MÉDICA', 'L. DEPORTIVA', 'FIRMA']],
    body: pilots.map(p => [
      `#${p.number}`, 
      p.ranking || '-', 
      p.category, 
      p.name, 
      p.medicalLicense, 
      p.sportsLicense,
      '________________'
    ]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      6: { cellWidth: 35 } // Espacio para firma
    }
  });
  
  doc.save(`KDO_Verificacion_Licencias_${Date.now()}.pdf`);
};

// 3. PDF Cronológico de Inscripción (N° Kart, Ranking, Nombre, Categoría y Orden de llegada)
export const generateInscriptosCronologicoPDF = (pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, "ORDEN DE INSCRIPCIÓN", "LISTADO CRONOLÓGICO POR LLEGADA");
  
  const sorted = [...pilots].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  
  autoTable(doc, {
    startY: 45,
    head: [['ORDEN', 'KART', 'RANKING', 'NOMBRE Y APELLIDO', 'CATEGORÍA', 'FECHA/HORA']],
    body: sorted.map((p, i) => [
      i + 1, 
      `#${p.number}`, 
      p.ranking || '-', 
      p.name, 
      p.category,
      new Date(p.createdAt || 0).toLocaleString('es-AR')
    ]),
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] },
    styles: { fontSize: 9 }
  });
  
  doc.save(`KDO_Orden_Llegada_General_${Date.now()}.pdf`);
};

// 4. PDF por Categoría Cronológico (Divididos en cada categoría)
export const generateInscriptosPorCategoriaPDF = (pilots: Pilot[], categories: string[]) => {
  const doc = new jsPDF();
  let currentY = 45;

  drawKDOHeader(doc, "INSCRIPTOS POR CATEGORÍA", "ORDEN CRONOLÓGICO SEGMENTADO");

  categories.forEach((cat, idx) => {
    const catPilots = pilots
      .filter(p => p.category === cat)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    if (catPilots.length === 0) return;

    if (idx > 0 && currentY > 200) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(240, 240, 240);
    doc.rect(14, currentY, 182, 8, 'F');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`CATEGORÍA: ${cat.toUpperCase()}`, 16, currentY + 6);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [['ORDEN', 'KART', 'RANKING', 'NOMBRE Y APELLIDO', 'HORA REGISTRO']],
      body: catPilots.map((p, i) => [
        i + 1, 
        `#${p.number}`, 
        p.ranking || '-', 
        p.name,
        new Date(p.createdAt || 0).toLocaleTimeString('es-AR')
      ]),
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
      margin: { bottom: 20 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  });
  
  doc.save(`KDO_Por_Categorias_Cronologico_${Date.now()}.pdf`);
};

// 5. PDF Grupos de Salida a Pista (Divididos por cada categoría)
export const generateGruposPistaPDF = (pilots: Pilot[], categories: string[]) => {
  const doc = new jsPDF();
  let currentY = 45;

  drawKDOHeader(doc, "GRUPOS DE SALIDA", "ORGANIZACIÓN DE TANDAS EN PISTA");

  categories.forEach((cat) => {
    const catPilots = pilots
      .filter(p => p.category === cat)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    if (catPilots.length === 0) return;

    const groupSize = 15; // Límite de karts en pista por tanda
    for (let i = 0; i < catPilots.length; i += groupSize) {
      const groupNum = Math.floor(i / groupSize) + 1;
      const groupPilots = catPilots.slice(i, i + groupSize);
      const groupLabel = groupNum === 1 ? 'A' : groupNum === 2 ? 'B' : 'C';

      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38); // Rojo KDO
      doc.setFont('helvetica', 'bold');
      doc.text(`${cat.toUpperCase()} - GRUPO ${groupLabel}`, 14, currentY);
      currentY += 5;

      autoTable(doc, {
        startY: currentY,
        head: [['POS', 'KART', 'NOMBRE Y APELLIDO', 'RANKING']],
        body: groupPilots.map((p, idx) => [idx + 1, `#${p.number}`, p.name, p.ranking || '-']),
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;
    }
  });
  
  doc.save(`KDO_Grupos_Pista_${Date.now()}.pdf`);
};

// Funciones heredadas
export const generatePilotCredential = (pilot: Pilot) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 55] });
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, 85, 55, 'F');
  doc.setFillColor(250, 204, 21);
  doc.rect(0, 0, 85, 12, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("CREDENCIAL OFICIAL KDO 2026", 42.5, 8, { align: 'center' });
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(6, 18, 25, 30, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(pilot.name.toUpperCase(), 35, 22);
  doc.setTextColor(250, 204, 21);
  doc.setFontSize(18);
  doc.text(`KART #${pilot.number}`, 35, 32);
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.text(`CAT: ${pilot.category}`, 35, 38);
  doc.text(`LIC. MÉDICA: ${pilot.medicalLicense}`, 35, 42);
  doc.text(`LIC. DEPORTIVA: ${pilot.sportsLicense}`, 35, 46);
  doc.setFillColor(250, 204, 21);
  doc.rect(0, 52, 85, 3, 'F');
  doc.save(`KDO_Credencial_${pilot.number}.pdf`);
};

export const generateOfficialResultsPDF = (category: string, pilots: any[], sessionName: string = "CLASIFICACIÓN OFICIAL", eventName: string = "") => {
  const doc = new jsPDF();
  drawKDOHeader(doc, sessionName, `${eventName} - CATEGORÍA: ${category}`);
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'VUELTAS', 'MEJOR VTA']],
    body: pilots.map((p, i) => [i + 1, `#${p.no}`, p.pilotName, p.laps, p.bestLap]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Resultados_${category}_${sessionName.replace(/\s+/g, '_')}.pdf`);
};

export const generateLiveTimingPDF = (title: string, trackFlag: string, timing: TimingRow[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, title, `ESTADO PISTA: ${trackFlag}`);
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'NO', 'PILOTO', 'VLTAS', 'MEJOR']],
    body: timing.map(t => [t.pos, t.no, t.name, t.laps, t.bestLap]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_LiveTiming_${Date.now()}.pdf`);
};

// Added missing generateChampionshipPDF function to fix import errors in Campeonatos.tsx and Resultados.tsx
export const generateChampionshipPDF = (title: string, category: string, pilots: Pilot[]) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, title, `STANDINGS OFICIALES - ${category}`);
  autoTable(doc, {
    startY: 45,
    head: [['POS', 'KART', 'PILOTO', 'WINS', 'PODIOS', 'PUNTOS']],
    body: pilots.map((p, i) => [
      i + 1,
      `#${p.number}`,
      p.name,
      p.stats?.wins || 0,
      p.stats?.podiums || 0,
      (p.stats?.points || 0).toFixed(1)
    ]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Standings_${category}_${Date.now()}.pdf`);
};

// Added missing generatePilotsPDF function to fix import error in Pilotos.tsx
export const generatePilotsPDF = (pilots: Pilot[], title: string) => {
  const doc = new jsPDF();
  drawKDOHeader(doc, title, "REGISTRO GENERAL DE COMPETIDORES");
  autoTable(doc, {
    startY: 45,
    head: [['KART', 'PILOTO', 'CATEGORÍA', 'MÉDICA', 'DEPORTIVA', 'CONDUCTA']],
    body: pilots.map(p => [
      `#${p.number}`,
      p.name,
      p.category,
      p.medicalLicense,
      p.sportsLicense,
      `${p.conductPoints}/10`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [250, 204, 21] }
  });
  doc.save(`KDO_Padron_Pilotos_${Date.now()}.pdf`);
};
