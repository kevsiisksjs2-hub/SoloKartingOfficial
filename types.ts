
export type Category = string;

export enum Status {
  CONFIRMADO = 'Confirmado',
  PENDIENTE = 'Pendiente',
  BAJA = 'Baja'
}

export enum TrackFlag {
  VERDE = 'Verde',
  AMARILLA = 'Amarilla',
  ROJA = 'Roja',
  CUADROS = 'Cuadros',
  AZUL = 'Azul'
}

export interface Association {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  circuitIds?: string[];
}

export interface Pilot {
  id: string;
  number: string;
  name: string;
  category: Category;
  status: Status;
  ranking: number;
  association?: string; // Ahora es opcional
  lastUpdated: string;
  medicalLicense: string;
  sportsLicense: string;
  transponderId: string; // ID Estilo Mylaps (Hex)
  conductPoints: number;
  stats: {
    wins: number;
    podiums: number;
    poles: number;
  };
}

export interface TimingRow {
  pos: number;
  no: string;
  name: string;
  laps: number;
  lastLap: string;
  bestLap: string;
  gap: string;
  interval: string;
  status: 'In' | 'Out' | 'Pit';
  lastPass: number; // timestamp
  isSessionBest?: boolean;
  isPersonalBest?: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor';
}

export interface Championship {
  id: string;
  name: string;
  status: string;
  dates: string;
  tracks: string;
  image: string;
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

export interface RegistrationLink {
  category: string;
  url: string;
}

export interface RaceResult {
  id: string;
  category: string;
  date: string;
  circuit: string;
  fastestLap: {
    pilot: string;
    time: string;
  };
  classification: {
    pos: number;
    number: string;
    name: string;
    laps: number;
    gap: string;
    bestLap: string;
  }[];
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

export interface Regulation {
  id: string;
  title: string;
  description: string;
  fileData: string; // Base64 string del PDF
  fileName: string;
  fileSize: string;
  date: string;
}
