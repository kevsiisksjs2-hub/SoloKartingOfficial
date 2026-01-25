
import { Pilot, Category, Championship, TrackFlag, Regulation, Circuit, Association, MarketplaceItem } from '../types';
import { INITIAL_PILOTS, INITIAL_CATEGORIES, INITIAL_CHAMPIONSHIPS, INITIAL_CIRCUITS, INITIAL_ASSOCIATIONS, HISTORICAL_RANKINGS } from '../constants';

const KEYS = {
  PILOTS: 'kdo_pilots',
  CHAMPS: 'kdo_champs',
  CATS: 'kdo_categories',
  REGS: 'kdo_regulations',
  LIVE_URL: 'kdo_live_url',
  HIST_URL: 'kdo_hist_url',
  STREAM_URL: 'kdo_stream_url',
  TRACK: 'kdo_track_status',
  AUTH: 'kdo_auth',
  CIRCUITS: 'kdo_circuits',
  ASSOCS: 'kdo_assocs',
  MARKET: 'kdo_market'
};

export const storageService = {
  getPilots: (): Pilot[] => {
    const data = localStorage.getItem(KEYS.PILOTS);
    return data ? JSON.parse(data) : INITIAL_PILOTS;
  },
  savePilots: (p: Pilot[]) => localStorage.setItem(KEYS.PILOTS, JSON.stringify(p)),
  
  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATS);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  },
  saveCategories: (c: Category[]) => localStorage.setItem(KEYS.CATS, JSON.stringify(c)),

  getRegulations: (): Regulation[] => {
    const data = localStorage.getItem(KEYS.REGS);
    return data ? JSON.parse(data) : [];
  },
  saveRegulations: (r: Regulation[]) => localStorage.setItem(KEYS.REGS, JSON.stringify(r)),

  getTrackStatus: () => (localStorage.getItem(KEYS.TRACK) as TrackFlag) || TrackFlag.VERDE,
  saveTrackStatus: (s: TrackFlag) => localStorage.setItem(KEYS.TRACK, s),

  getAuth: () => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  setAuth: (u: any) => u ? localStorage.setItem(KEYS.AUTH, JSON.stringify(u)) : localStorage.removeItem(KEYS.AUTH),
  
  getLiveUrl: () => localStorage.getItem(KEYS.LIVE_URL) || 'https://speedhive.mylaps.com/LiveTiming',
  saveLiveUrl: (u: string) => localStorage.setItem(KEYS.LIVE_URL, u),

  // Added missing method for history URL
  getHistoryUrl: () => localStorage.getItem(KEYS.HIST_URL) || 'https://speedhive.mylaps.com',
  saveHistoryUrl: (u: string) => localStorage.setItem(KEYS.HIST_URL, u),

  // Added missing method for streaming URL
  getStreamingUrl: () => localStorage.getItem(KEYS.STREAM_URL) || 'https://youtube.com',
  saveStreamingUrl: (u: string) => localStorage.setItem(KEYS.STREAM_URL, u),

  // Added missing method for circuits
  getCircuits: (): Circuit[] => {
    const data = localStorage.getItem(KEYS.CIRCUITS);
    return data ? JSON.parse(data) : INITIAL_CIRCUITS;
  },

  // Added missing method for associations
  getAssociations: (): Association[] => {
    const data = localStorage.getItem(KEYS.ASSOCS);
    return data ? JSON.parse(data) : INITIAL_ASSOCIATIONS;
  },

  // Added missing method for championships
  getChampionships: (): Championship[] => {
    const data = localStorage.getItem(KEYS.CHAMPS);
    return data ? JSON.parse(data) : INITIAL_CHAMPIONSHIPS;
  },

  // Added missing method for category rankings
  getCategoryRankings: (category: string) => {
    return HISTORICAL_RANKINGS;
  },

  // Added missing methods for marketplace
  getMarketplace: (): MarketplaceItem[] => {
    const data = localStorage.getItem(KEYS.MARKET);
    return data ? JSON.parse(data) : [];
  },
  saveMarketplace: (m: MarketplaceItem[]) => localStorage.setItem(KEYS.MARKET, JSON.stringify(m))
};
