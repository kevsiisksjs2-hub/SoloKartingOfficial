
import { Pilot, Category, TechCheck, Penalty, AuditLog, SystemSettings, TrackFlag, Protest, Championship, Circuit, Association, RaceResult, MarketplaceItem, Regulation, AdminUser } from '../types';
import { INITIAL_PILOTS, INITIAL_CATEGORIES, INITIAL_CIRCUITS, INITIAL_CHAMPIONSHIPS, INITIAL_ASSOCIATIONS } from '../constants';

const KEYS = {
  PILOTS: 'kdo_p_v3',
  TECH: 'kdo_tech_v3',
  PENALTIES: 'kdo_penalties_v3',
  PROTESTS: 'kdo_protests_v3',
  SETTINGS: 'kdo_settings_v3',
  LOGS: 'kdo_logs_v3',
  TRACK_STATUS: 'kdo_flag_v3',
  AUTH: 'kdo_auth_v3',
  ADMIN_USERS: 'kdo_users_v3',
  MARKETPLACE: 'kdo_market_v3',
  REGULATIONS: 'kdo_regs_v3',
  RESULTS: 'kdo_results_v3',
  CHAMPIONSHIPS: 'kdo_champs_v3'
};

const INITIAL_ADMINS: AdminUser[] = [
  { id: 'admin1', username: 'kdoadmin', password: 'kdo2026', role: 'SuperAdmin', name: 'Director KDO' }
];

const DEFAULT_SETTINGS: SystemSettings = {
  paddockTicker: '⚠️ TODOS LOS PILOTOS A BRIEFING EN TORRE DE CONTROL • CLASE MASTER A PARQUE CERRADO ⚠️',
  maintenanceMode: false,
  registrationsOpen: true,
  briefingUrl: '#',
  raceDirectorMode: false,
  weatherInfo: 'Soleado - 24°C',
  minWeightPerCategory: {
    'KDO Power': 165,
    'Supermaster': 175,
    'Máster': 170,
    'Clase 3': 160
  },
  liveTimingUrl: 'https://speedhive.mylaps.com/LiveTiming',
  resultsExternalUrl: '#'
};

export interface ExtendedSystemSettings extends SystemSettings {
  orbitsIp?: string;
  useLocalOrbits?: boolean;
}

export const storageService = {
  getPilots: (): Pilot[] => JSON.parse(localStorage.getItem(KEYS.PILOTS) || JSON.stringify(INITIAL_PILOTS)),
  savePilots: (p: Pilot[]) => localStorage.setItem(KEYS.PILOTS, JSON.stringify(p)),

  getTechChecks: (): TechCheck[] => JSON.parse(localStorage.getItem(KEYS.TECH) || '[]'),
  saveTechCheck: (c: TechCheck) => {
    const all = storageService.getTechChecks();
    localStorage.setItem(KEYS.TECH, JSON.stringify([c, ...all]));
  },

  getPenalties: (): Penalty[] => JSON.parse(localStorage.getItem(KEYS.PENALTIES) || '[]'),
  savePenalty: (p: Penalty) => {
    const all = storageService.getPenalties();
    localStorage.setItem(KEYS.PENALTIES, JSON.stringify([p, ...all]));
  },

  getProtests: (): Protest[] => JSON.parse(localStorage.getItem(KEYS.PROTESTS) || '[]'),
  saveProtest: (p: Protest) => {
    const all = storageService.getProtests();
    localStorage.setItem(KEYS.PROTESTS, JSON.stringify([p, ...all]));
  },

  getSettings: (): ExtendedSystemSettings => JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS)),
  saveSettings: (s: ExtendedSystemSettings) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)),

  getAuditLogs: (): AuditLog[] => JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]'),
  addLog: (action: string, details: string) => {
    const logs = storageService.getAuditLogs();
    const admin = storageService.getAuth()?.username || 'System';
    const newLog = { id: Date.now().toString(), timestamp: Date.now(), admin, action, details };
    localStorage.setItem(KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 100)));
  },

  getTrackStatus: (): TrackFlag => (localStorage.getItem(KEYS.TRACK_STATUS) as TrackFlag) || TrackFlag.VERDE,
  saveTrackStatus: (f: TrackFlag) => localStorage.setItem(KEYS.TRACK_STATUS, f),

  getAuth: (): AdminUser | null => JSON.parse(localStorage.getItem(KEYS.AUTH) || 'null'),
  setAuth: (u: AdminUser | null) => u ? localStorage.setItem(KEYS.AUTH, JSON.stringify(u)) : localStorage.removeItem(KEYS.AUTH),

  getAdminUsers: (): AdminUser[] => JSON.parse(localStorage.getItem(KEYS.ADMIN_USERS) || JSON.stringify(INITIAL_ADMINS)),
  saveAdminUsers: (u: AdminUser[]) => localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(u)),

  getCategories: (): string[] => INITIAL_CATEGORIES,
  getCircuits: (): Circuit[] => INITIAL_CIRCUITS,
  
  getChampionships: (): Championship[] => JSON.parse(localStorage.getItem(KEYS.CHAMPIONSHIPS) || JSON.stringify(INITIAL_CHAMPIONSHIPS)),
  saveChampionships: (c: Championship[]) => localStorage.setItem(KEYS.CHAMPIONSHIPS, JSON.stringify(c)),

  getStreamingUrl: () => '#',
  getLiveUrl: () => storageService.getSettings().liveTimingUrl,
  
  getRaceResults: (): RaceResult[] => JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]'),
  saveRaceResults: (r: RaceResult[]) => localStorage.setItem(KEYS.RESULTS, JSON.stringify(r)),
  
  getRegulations: (): Regulation[] => JSON.parse(localStorage.getItem(KEYS.REGULATIONS) || '[]'),
  saveRegulations: (r: Regulation[]) => localStorage.setItem(KEYS.REGULATIONS, JSON.stringify(r)),
  
  getMarketplace: (): MarketplaceItem[] => JSON.parse(localStorage.getItem(KEYS.MARKETPLACE) || '[]'),
  saveMarketplace: (m: MarketplaceItem[]) => localStorage.setItem(KEYS.MARKETPLACE, JSON.stringify(m)),

  getAssociations: () => INITIAL_ASSOCIATIONS,
  getCategoryRankings: (category: string) => storageService.getPilots().filter(p => p.category === category)
};
