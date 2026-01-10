
import { Pilot, Category, User, Status, Championship, Circuit, Association, RaceResult, TrackFlag, RegistrationLink, MarketplaceItem, Regulation } from '../types';
import { INITIAL_PILOTS, INITIAL_CHAMPIONSHIPS, INITIAL_CIRCUITS, INITIAL_ASSOCIATIONS, INITIAL_CATEGORIES, INITIAL_REGISTRATION_LINKS } from '../constants';

const KEYS = {
  PILOTS: 'sk_pilots',
  CHAMPS: 'sk_champs',
  CIRCUITS: 'sk_circuits',
  ASSOCS: 'sk_assocs',
  CATEGORIES: 'sk_categories',
  RESULTS: 'sk_results',
  TRACK_STATUS: 'sk_track_status',
  AUTH: 'sk_auth',
  USERS: 'sk_users_list',
  LINKS: 'sk_links',
  LIVE_RESULTS_URL: 'sk_live_url',
  HISTORY_RESULTS_URL: 'sk_history_url',
  RANKINGS_PREFIX: 'sk_ranking_',
  MARKETPLACE: 'sk_marketplace',
  REGULATIONS: 'sk_regulations',
};

export const storageService = {
  getPilots: (): Pilot[] => {
    const data = localStorage.getItem(KEYS.PILOTS);
    return data ? JSON.parse(data) : INITIAL_PILOTS;
  },
  savePilots: (pilots: Pilot[]) => {
    localStorage.setItem(KEYS.PILOTS, JSON.stringify(pilots));
  },
  getCategoryRankings: (category: string): any[] => {
    const data = localStorage.getItem(KEYS.RANKINGS_PREFIX + category);
    return data ? JSON.parse(data) : [];
  },
  saveCategoryRankings: (category: string, rankings: any[]) => {
    localStorage.setItem(KEYS.RANKINGS_PREFIX + category, JSON.stringify(rankings));
  },
  getResults: (): RaceResult[] => {
    const data = localStorage.getItem(KEYS.RESULTS);
    return data ? JSON.parse(data) : [];
  },
  saveResults: (results: RaceResult[]) => {
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
  },
  getLiveUrl: (): string => {
    return localStorage.getItem(KEYS.LIVE_RESULTS_URL) || 'https://speedhive.mylaps.com/LiveTiming';
  },
  saveLiveUrl: (url: string) => {
    localStorage.setItem(KEYS.LIVE_RESULTS_URL, url);
  },
  getHistoryUrl: (): string => {
    return localStorage.getItem(KEYS.HISTORY_RESULTS_URL) || 'https://speedhive.mylaps.com';
  },
  saveHistoryUrl: (url: string) => {
    localStorage.setItem(KEYS.HISTORY_RESULTS_URL, url);
  },
  getTrackStatus: (): TrackFlag => {
    return (localStorage.getItem(KEYS.TRACK_STATUS) as TrackFlag) || TrackFlag.VERDE;
  },
  saveTrackStatus: (status: TrackFlag) => {
    localStorage.setItem(KEYS.TRACK_STATUS, status);
  },
  getChampionships: (): Championship[] => {
    const data = localStorage.getItem(KEYS.CHAMPS);
    return data ? JSON.parse(data) : INITIAL_CHAMPIONSHIPS;
  },
  saveChampionships: (champs: Championship[]) => {
    localStorage.setItem(KEYS.CHAMPS, JSON.stringify(champs));
  },
  getCircuits: (): Circuit[] => {
    const data = localStorage.getItem(KEYS.CIRCUITS);
    return data ? JSON.parse(data) : INITIAL_CIRCUITS;
  },
  saveCircuits: (circuits: Circuit[]) => {
    localStorage.setItem(KEYS.CIRCUITS, JSON.stringify(circuits));
  },
  getAssociations: (): Association[] => {
    const data = localStorage.getItem(KEYS.ASSOCS);
    return data ? JSON.parse(data) : INITIAL_ASSOCIATIONS;
  },
  saveAssociations: (assocs: Association[]) => {
    localStorage.setItem(KEYS.ASSOCS, JSON.stringify(assocs));
  },
  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },
  getUsers: (): any[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [
      { id: '1', username: 'kdoadmin', role: 'admin' },
      { id: '2', username: 'FRAD 3', role: 'admin' }
    ];
  },
  saveUsers: (users: any[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  getAuth: (): User | null => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  setAuth: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    else localStorage.removeItem(KEYS.AUTH);
  },
  getMarketplace: (): MarketplaceItem[] => {
    const data = localStorage.getItem(KEYS.MARKETPLACE);
    return data ? JSON.parse(data) : [];
  },
  saveMarketplace: (items: MarketplaceItem[]) => {
    localStorage.setItem(KEYS.MARKETPLACE, JSON.stringify(items));
  },
  getRegulations: (): Regulation[] => {
    const data = localStorage.getItem(KEYS.REGULATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveRegulations: (regs: Regulation[]) => {
    localStorage.setItem(KEYS.REGULATIONS, JSON.stringify(regs));
  }
};
