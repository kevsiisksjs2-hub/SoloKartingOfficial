
export type Category = string;
export enum Status { CONFIRMADO = 'Confirmado', PENDIENTE = 'Pendiente', BAJA = 'Baja' }

export enum TrackFlag {
  VERDE = 'Verde',
  AMARILLA = 'Amarilla',
  ROJA = 'Roja',
  AZUL = 'Azul',
  CUADROS = 'Cuadros'
}

export type UserRole = 'SuperAdmin' | 'Comisario Deportivo' | 'Escrutador Técnico' | 'Secretario' | 'Prensa';

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
  lastLogin?: number;
  permissions: string[];
}

export interface Championship {
  id: string;
  name: string;
  status: string;
  dates: string;
  tracks: string;
  image: string;
  year: number;
  events?: ChampionshipEvent[];
  champions?: { category: string; pilot: string; kart: string }[];
}

export interface ChampionshipEvent {
  id: string;
  round: number;
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  track: string;
  status: 'Programada' | 'En curso' | 'Finalizada' | 'Suspendida' | 'Próxima';
  briefingSigned?: string[];
  technicalScrutiny?: Record<string, boolean>;
}

export interface Pilot {
  id: string;
  number: string;
  name: string;
  category: Category;
  status: Status;
  ranking: number;
  association?: string;
  medicalLicense: string;
  sportsLicense: string;
  transponderId: string;
  conductPoints: number; 
  lastUpdated: string;
  createdAt: number;
  stats: { wins: number; podiums: number; poles: number; points?: number };
}

export interface SystemSettings {
  paddockTicker: string;
  maintenanceMode: boolean;
  registrationsOpen: boolean;
  liveTimingUrl: string;
  useLocalOrbits?: boolean;
  orbitsIp?: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  admin: string;
  action: string;
  details: string;
}

export type RegulationCategory = 'Técnico' | 'Deportivo' | 'Calendario' | 'Anexo' | 'Circular';

export interface Regulation {
  id: string;
  title: string;
  description: string;
  category: RegulationCategory;
  version: string;
  date: string;
  fileSize: string;
  fileData: string;
  isDraft: boolean;
}

export interface LapTime {
  lap: number;
  time: string;
  isBest?: boolean;
}

export interface RaceResultDetail {
  pos: number;
  no: string;
  pilotName: string;
  laps: number;
  totalTime: string;
  gap: string;
  interval: string;
  bestLap: string;
  bestLapNo: number;
  lapTimes: LapTime[];
}

export interface RaceResult {
  id: string;
  eventId: string;
  sessionName: string;
  category: string;
  date: string;
  results: RaceResultDetail[];
}

export interface PressRelease {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'Oficial' | 'Prensa' | 'Urgente';
}

export interface Penalty {
  id: string;
  pilotId: string;
  pilotName: string;
  category: string;
  reason: string;
  sanction: string;
  date: string;
}

export interface Association {
  id: string;
  name: string;
  description: string;
  circuitIds: string[];
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  length: string;
  image: string;
  description: string;
  features: string[];
  surfaceStatus: string;
  emergencyPhone: string;
  records: any[];
}

export interface TimingRow {
  pos: number;
  no: string;
  name: string;
  laps: number;
  lastLap: string;
  bestLap: string;
  s1: string;
  s2: string;
  s3: string;
  gap: string;
  interval: string;
  status: 'TRACK' | 'PITS';
  isSessionBest?: boolean;
  isPersonalBest?: boolean;
  isS1Best?: boolean;
  isS2Best?: boolean;
  isS3Best?: boolean;
  predictive?: string;
  delta?: 'up' | 'down' | 'steady';
  transponderSignal?: string;
}

// Added MarketplaceItem interface to fix missing export errors
export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  category: 'Kart Completo' | 'Motor' | 'Repuestos' | 'Indumentaria';
  condition: 'Nuevo' | 'Usado';
  image: string;
  contact: string;
}
