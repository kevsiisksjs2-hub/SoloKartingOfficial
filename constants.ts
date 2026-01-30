
import { Status, Pilot, Championship, Circuit, Association } from './types';

export const INITIAL_CATEGORIES = [
  '150 PreJunior',
  '150 Junior',
  '150 Senior',
  '150 Master',
  '150 ProMaster',
  '150 Supermaster',
  '125 Prokart Light',
  '125 Prokart',
  '125 Prokart Master',
  'Directo Escuela',
  '250 Multimarca'
];

export const HISTORICAL_RANKINGS = [];

export const INITIAL_ASSOCIATIONS: Association[] = [
  {
    id: 'assoc1',
    name: 'Pilotos Karting del Norte (PKN)',
    description: 'Entidad oficial de fiscalización y fomento del karting.'
  }
];

export const INITIAL_REGISTRATION_LINKS = INITIAL_CATEGORIES.map(cat => ({
  category: cat,
  url: '#'
}));

export const INITIAL_PILOTS: Pilot[] = [
  { id: '1', number: '1', name: 'JUAN ACOSTA', category: '150 Senior', status: Status.CONFIRMADO, ranking: 1, lastUpdated: '2024-05-01', association: 'PKN Pilotos Karting del Norte', medicalLicense: '1001', sportsLicense: '2001', transponderId: 'TX-1001', conductPoints: 10, stats: { wins: 5, podiums: 10, poles: 2 } },
  { id: '2', number: '2', name: 'PEDRO RAMIREZ', category: '150 Senior', status: Status.CONFIRMADO, ranking: 2, lastUpdated: '2024-05-01', association: 'PKN Pilotos Karting del Norte', medicalLicense: '1002', sportsLicense: '2002', transponderId: 'TX-1002', conductPoints: 9, stats: { wins: 2, podiums: 8, poles: 1 } },
  { id: '3', number: '8', name: 'FRANCISCO PEROYE', category: '150 Supermaster', status: Status.CONFIRMADO, ranking: 1, lastUpdated: '2024-05-01', association: 'PKN Pilotos Karting del Norte', medicalLicense: '1003', sportsLicense: '2003', transponderId: 'TX-1003', conductPoints: 10, stats: { wins: 4, podiums: 7, poles: 4 } },
];

export const INITIAL_CHAMPIONSHIPS: Championship[] = [
  {
    id: 'c1',
    name: "Campeonato Oficial PKN 2024",
    status: "En curso",
    dates: "Marzo - Diciembre",
    tracks: "Zárate, Ciudad Evita, Baradero",
    image: "https://images.unsplash.com/photo-1547631618-f29792042761?w=800&auto=format"
  }
];

export const INITIAL_CIRCUITS: Circuit[] = [
  {
    id: 'ci1',
    name: 'Kartódromo PKN Chivilcoy',
    location: "Chivilcoy, Buenos Aires",
    length: "1.100 mts",
    image: "https://s11.aconvert.com/convert/p3r68-cdx67/13ion-ed12c.webp",
    description: "Referente de Pilotos Karting del Norte en suelo de tierra.",
    features: ["Superficie: Tierra Compactada", "Trazado Técnico", "Boxes PKN"]
  }
];
