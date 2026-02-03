
export type Category = string;
export enum Status { CONFIRMADO = 'Confirmado', PENDIENTE = 'Pendiente', BAJA = 'Baja' }

export enum TrackFlag {
  VERDE = 'Verde',
  AMARILLA = 'Amarilla',
  ROJA = 'Roja',
  AZUL = 'Azul',
  CUADROS = 'Cuadros'
}

export type UserRole = 'SuperAdmin' | 'Comisario' | 'Técnico' | 'Cronometrista';

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  lastLogin?: number;
  name: string;
}

export type PenaltyType = 'Apercibimiento' | 'Recargo' | 'Exclusión' | 'Suspensión';
export type TechStatus = 'Aprobado' | 'Observado' | 'Rechazado' | 'Pendiente';

export interface LapRecord {
  lap: number;
  time: string;
  s1?: string;
  s2?: string;
  s3?: string;
  isPersonalBest?: boolean;
}

export interface RaceEvent {
  id: string;
  round: number;
  name: string;
  date: string;
  track: string;
  status: 'Finalizada' | 'Próxima' | 'Programada';
}

export interface Championship {
  id: string;
  name: string;
  status: string;
  dates: string;
  tracks: string;
  image: string;
  year?: number;
  events?: RaceEvent[];
  champions?: { category: string; pilot: string }[];
}

export interface TechCheck {
  id: string;
  pilotId: string;
  race: string;
  weight: number;
  engineSeal: string;
  chassisSeal: string;
  tireSerials: string[];
  fuelSample: boolean;
  tiresOk: boolean;
  status: TechStatus;
  comments: string;
}

export interface Protest {
  id: string;
  timestamp: number;
  fromPilotId: string;
  againstPilotId: string;
  reason: string;
  status: 'Recibida' | 'Resuelta';
  resolution?: string;
}

export interface Penalty {
  id: string;
  pilotId: string;
  race: string;
  type: PenaltyType;
  description: string;
  pointsDeducted: number;
  timePenalty?: number; 
  date: string;
  stewardName: string;
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
  status: 'PITS' | 'TRACK' | 'OUT';
  isSessionBest: boolean;
  isPersonalBest: boolean;
  isS1Best?: boolean;
  isS2Best?: boolean;
  isS3Best?: boolean;
  predictive?: string;
  delta?: 'up' | 'down' | 'steady';
  transponderSignal?: 'Good' | 'Fair' | 'Poor';
}

export interface RaceResult {
  id: string;
  category: string;
  track: string;
  sessionName: string;
  date: string;
  stewardsVerdict?: string;
  data: {
    pos: number;
    number: string;
    name: string;
    gap: string;
    bestLap: string;
    penalties?: string;
    lapsHistory?: LapRecord[];
  }[];
}

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
  createdAt: number;
  association?: string;
  emergencyContact?: string;
  bloodType?: string;
  stats: { wins: number; podiums: number; poles: number; points?: number; fastLaps?: number };
}

export interface SystemSettings {
  paddockTicker: string;
  maintenanceMode: boolean;
  registrationsOpen: boolean;
  weatherInfo: string;
  briefingUrl?: string;
  raceDirectorMode?: boolean;
  minWeightPerCategory: Record<string, number>;
  liveTimingUrl: string;
  resultsExternalUrl: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  admin: string;
  action: string;
  details: string;
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

export interface Association {
  id: string;
  name: string;
  description: string;
  circuitIds: string[];
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

export type RegulationCategory = 'Técnico' | 'Deportivo' | 'Calendario' | 'Anexo';

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
