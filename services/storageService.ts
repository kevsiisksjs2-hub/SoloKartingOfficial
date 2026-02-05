
import { Pilot, AuditLog, SystemSettings, TrackFlag, Championship, Regulation, AdminUser, PressRelease, Status, Circuit, MarketplaceItem, Penalty } from '../types';
import { INITIAL_PILOTS, INITIAL_CATEGORIES, INITIAL_CHAMPIONSHIPS, INITIAL_CIRCUITS } from '../constants';

const KEYS = {
  PILOTS: 'kdo_v10_pilots',
  SETTINGS: 'kdo_v10_settings',
  LOGS: 'kdo_v10_logs',
  TRACK: 'kdo_v10_track',
  AUTH: 'kdo_v10_auth',
  ADMINS: 'kdo_v10_admins',
  REGS: 'kdo_v10_regs',
  CHAMPS: 'kdo_v10_champs',
  NEWS: 'kdo_v10_news',
  CIRCUITS: 'kdo_v10_circuits',
  MARKET: 'kdo_v10_market',
  PENALTIES: 'kdo_v10_penalties'
};

const defaultAdmins: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Director General KDO',
    role: 'SuperAdmin',
    permissions: ['READ', 'WRITE', 'ADMIN']
  }
];

export const storageService = {
  getPilots: (): Pilot[] => {
    const data = localStorage.getItem(KEYS.PILOTS);
    return data ? JSON.parse(data) : INITIAL_PILOTS;
  },
  savePilots: (pilots: Pilot[]) => localStorage.setItem(KEYS.PILOTS, JSON.stringify(pilots)),

  getSettings: (): SystemSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      paddockTicker: "TEMPORADA 2026 - KDO OFICIAL",
      maintenanceMode: false,
      registrationsOpen: true,
      liveTimingUrl: ""
    };
  },
  saveSettings: (settings: SystemSettings) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings)),

  getAuditLogs: (): AuditLog[] => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  addLog: (action: string, details: string) => {
    const logs = storageService.getAuditLogs();
    const auth = storageService.getAuth();
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      admin: auth?.username || 'SYSTEM',
      action,
      details
    };
    localStorage.setItem(KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 500)));
  },

  getTrackStatus: (): TrackFlag => (localStorage.getItem(KEYS.TRACK) as TrackFlag) || TrackFlag.VERDE,
  saveTrackStatus: (flag: TrackFlag) => localStorage.setItem(KEYS.TRACK, flag),

  getAuth: (): AdminUser | null => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  setAuth: (user: AdminUser | null) => {
    if (user) localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    else localStorage.removeItem(KEYS.AUTH);
  },

  getAdminUsers: (): AdminUser[] => {
    const data = localStorage.getItem(KEYS.ADMINS);
    return data ? JSON.parse(data) : defaultAdmins;
  },
  saveAdminUsers: (users: AdminUser[]) => localStorage.setItem(KEYS.ADMINS, JSON.stringify(users)),

  getRegulations: (): Regulation[] => {
    const data = localStorage.getItem(KEYS.REGS);
    return data ? JSON.parse(data) : [];
  },
  saveRegulations: (regs: Regulation[]) => localStorage.setItem(KEYS.REGS, JSON.stringify(regs)),

  getChampionships: (): Championship[] => {
    const data = localStorage.getItem(KEYS.CHAMPS);
    return data ? JSON.parse(data) : INITIAL_CHAMPIONSHIPS;
  },
  saveChampionships: (champs: Championship[]) => localStorage.setItem(KEYS.CHAMPS, JSON.stringify(champs)),

  getPressReleases: (): PressRelease[] => {
    const data = localStorage.getItem(KEYS.NEWS);
    return data ? JSON.parse(data) : [];
  },
  savePressReleases: (news: PressRelease[]) => localStorage.setItem(KEYS.NEWS, JSON.stringify(news)),

  getCategories: (): string[] => INITIAL_CATEGORIES,

  getCircuits: (): Circuit[] => {
    const data = localStorage.getItem(KEYS.CIRCUITS);
    return data ? JSON.parse(data) : INITIAL_CIRCUITS;
  },
  
  getMarketplace: (): MarketplaceItem[] => {
    const data = localStorage.getItem(KEYS.MARKET);
    return data ? JSON.parse(data) : [];
  },
  saveMarketplace: (items: MarketplaceItem[]) => localStorage.setItem(KEYS.MARKET, JSON.stringify(items)),

  getPenalties: (): Penalty[] => {
    const data = localStorage.getItem(KEYS.PENALTIES);
    return data ? JSON.parse(data) : [];
  },
  savePenalties: (penalties: Penalty[]) => localStorage.setItem(KEYS.PENALTIES, JSON.stringify(penalties)),

  castVote: (pilotId: string) => {
    storageService.addLog('VOTO', `Voto registrado para piloto ID: ${pilotId}`);
  }
};
