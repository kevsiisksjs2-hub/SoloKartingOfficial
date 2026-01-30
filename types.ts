
export type Category = string;
export enum Status { CONFIRMADO = 'Confirmado', PENDIENTE = 'Pendiente', BAJA = 'Baja' }

// Track flags for race control
export enum TrackFlag {
  VERDE = 'Verde',
  AMARILLA = 'Amarilla',
  ROJA = 'Roja',
  AZUL = 'Azul',
  CUADROS = 'Cuadros'
}

// Timing data for live sessions
export interface TimingRow {
  pos: number;
  no: string;
  name: string;
  laps: number;
  lastLap: string;
  bestLap: string;
  gap: string;
  interval: string;
  status: string;
  lastPass: number;
  isSessionBest?: boolean;
  isPersonalBest?: boolean;
}

export type RegulationCategory = 'Técnico' | 'Deportivo' | 'Anexo' | 'Calendario' | 'Institucional';

export interface Pilot {
  id: string;
  number: string;
  name: string;
  category: Category;
  status: Status;
  ranking: number;
  medicalLicense: string;
  sportsLicense: string;
  transponderId: string;
  conductPoints: number;
  lastUpdated: string;
  association?: string;
  stats: { wins: number; podiums: number; poles: number; };
}

export interface Championship {
  id: string;
  name: string;
  status: string;
  dates: string;
  tracks: string;
  image: string;
}

export interface Regulation {
  id: string;
  title: string;
  description: string;
  category: RegulationCategory;
  fileData: string;
  fileName: string;
  fileSize: string;
  date: string;
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  length: string;
  image: string;
  description: string;
  features: string[];
}

export interface Association {
  id: string;
  name: string;
  description: string;
  circuitIds?: string[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  category: 'Kart Completo' | 'Motor' | 'Repuestos' | 'Indumentaria';
  condition: 'Nuevo' | 'Usado';
  image: string;
  contact: string;
}
