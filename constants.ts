
import { Status, Pilot, Championship, Circuit, Association } from './types';

export const INITIAL_CATEGORIES = [
  '150cc KDO Power',
  '150cc Supermaster',
  '150cc Master',
  '150cc Clase 2',
  '150cc Clase 1',
  '150cc Menores',
  'Directo Escuela'
];

/**
 * Ranking Histórico del Campeonato Anterior (150cc Menores)
 * Utilizado para automatizar inscripciones
 */
export const HISTORICAL_RANKINGS = [
  { name: 'Alvarez, Alexis', ranking: 1, number: '1' },
  { name: 'Cardoso, Tomás', ranking: 2, number: '2' },
  { name: 'Fischer, Patricio', ranking: 3, number: '8' },
  { name: 'Benitez, Bautista', ranking: 4, number: '19' },
  { name: 'Musso, Alessandro', ranking: 5, number: '16' },
  { name: 'Durante, Oreste', ranking: 6, number: '6' },
  { name: 'Langarica, Valentín', ranking: 7, number: '323' },
  { name: 'Montero, Ale', ranking: 8, number: '11' },
  { name: 'Altamirano, Nacho', ranking: 9, number: '88' },
  { name: 'Astudillo, Manuel', ranking: 10, number: '48' },
  { name: 'Frizorger, Andrés', ranking: 11, number: '72' },
  { name: 'Tomich, Lolo', ranking: 12, number: '9' },
  { name: 'Orchese, Nicolas', ranking: 13, number: '23' },
  { name: 'Camera, Benjamin', ranking: 14, number: '118' },
  { name: 'Davio, Juan Martín', ranking: 15, number: '189' },
  { name: 'Valerio, Santino', ranking: 16, number: '3' },
  { name: 'Gambin, Ramiro', ranking: 17, number: '119' },
  { name: 'Osterrieth, Donatto', ranking: 18, number: '159' },
  { name: 'Palazzesi, Pilar', ranking: 19, number: '100' },
  { name: 'Mccormack, Ian', ranking: 20, number: '611' }
];

export const INITIAL_ASSOCIATIONS: Association[] = [
  {
    id: 'assoc1',
    name: 'Asociacion Solo Karting Demo',
    description: 'Entidad principal de pruebas para el sistema KDO.'
  }
];

export const INITIAL_REGISTRATION_LINKS = [
  { category: '150cc KDO Power', url: 'https://forms.gle/example1' },
  { category: '150cc Supermaster', url: 'https://forms.gle/example2' },
  { category: '150cc Master', url: 'https://forms.gle/example3' },
  { category: '150cc Clase 2', url: 'https://forms.gle/example4' },
  { category: '150cc Clase 1', url: 'https://forms.gle/example5' },
  { category: '150cc Menores', url: 'https://forms.gle/example6' },
  { category: 'Directo Escuela', url: 'https://forms.gle/example7' },
];

export const INITIAL_PILOTS: Pilot[] = [
  // Added missing transponderId property
  { id: '1', number: '1', name: 'Juan Acosta', category: '150cc KDO Power', status: Status.CONFIRMADO, ranking: 1, lastUpdated: '2024-05-01', association: 'Asociacion Solo Karting Demo', medicalLicense: '1001', sportsLicense: '2001', transponderId: 'TX-1001', conductPoints: 10, stats: { wins: 5, podiums: 10, poles: 2 } },
  { id: '2', number: '2', name: 'Pedro Ramirez', category: '150cc KDO Power', status: Status.CONFIRMADO, ranking: 2, lastUpdated: '2024-05-01', association: 'Asociacion Solo Karting Demo', medicalLicense: '1002', sportsLicense: '2002', transponderId: 'TX-1002', conductPoints: 9, stats: { wins: 2, podiums: 8, poles: 1 } },
  { id: '3', number: '8', name: 'Frantisco Peroye', category: '150cc Supermaster', status: Status.CONFIRMADO, ranking: 1, lastUpdated: '2024-05-01', association: 'Asociacion Solo Karting Demo', medicalLicense: '1003', sportsLicense: '2003', transponderId: 'TX-1003', conductPoints: 10, stats: { wins: 4, podiums: 7, poles: 4 } },
  { id: '4', number: '12', name: 'Martin Garcia', category: '150cc Supermaster', status: Status.PENDIENTE, ranking: 3, lastUpdated: '2024-05-01', association: 'Asociacion Solo Karting Demo', medicalLicense: '1004', sportsLicense: '2004', transponderId: 'TX-1004', conductPoints: 8, stats: { wins: 1, podiums: 3, poles: 0 } },
  { id: '5', number: '44', name: 'Jorge Lopez', category: '150cc Master', status: Status.CONFIRMADO, ranking: 1, lastUpdated: '2024-05-01', association: 'Asociacion Solo Karting Demo', medicalLicense: '1005', sportsLicense: '2005', transponderId: 'TX-1005', conductPoints: 10, stats: { wins: 3, podiums: 6, poles: 1 } },
  { id: '6', number: '21', name: 'Federico Perez', category: '150cc Clase 2', status: Status.CONFIRMADO, ranking: 4, lastUpdated: '2024-05-01', association: 'Asociacion Solo Karting Demo', medicalLicense: '1006', sportsLicense: '2006', transponderId: 'TX-1006', conductPoints: 7, stats: { wins: 0, podiums: 2, poles: 1 } },
];

export const INITIAL_CHAMPIONSHIPS: Championship[] = [
  {
    id: 'c1',
    name: "Campeonato Provincial de Karting 2024",
    status: "En curso",
    dates: "Marzo - Diciembre",
    tracks: "Zárate, Ciudad Evita, Baradero",
    image: "https://images.unsplash.com/photo-1547631618-f29792042761?w=800&auto=format"
  },
  {
    id: 'c2',
    name: "Copa de Verano Nocturna",
    status: "Próximamente",
    dates: "Enero - Febrero 2025",
    tracks: "Circuito Internacional BA",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format"
  }
];

export const INITIAL_CIRCUITS: Circuit[] = [
  {
    id: 'ci1',
    name: 'Kartódromo "Julio Canepa"',
    location: "Chivilcoy, Buenos Aires",
    length: "1.100 mts",
    image: "https://s11.aconvert.com/convert/p3r68-cdx67/13ion-ed12c.webp",
    description: "Referente del karting en tierra. Como se aprecia en la vista aérea, el trazado de Chivilcoy destaca por su diseño compacto y técnico.",
    features: ["Superficie: Tierra Compactada", "Trazado Técnico", "Boxes Techados"]
  },
  {
    id: 'ci2',
    name: 'Kartódromo "Miguel Roldán"',
    location: "San Andrés de Giles, Buenos Aires",
    length: "950 mts",
    image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&auto=format",
    description: "Ubicado en un entorno natural privilegiado rodeado de campos bonaerenses. El 'Miguel Roldán' ofrece un dibujo fluido.",
    features: ["Superficie: Tierra / Mezcla", "Entorno Natural", "Iluminación Nocturna"]
  }
];
