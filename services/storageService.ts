
import { Pilot, Category, Championship, Regulation, Circuit, Association, MarketplaceItem, TrackFlag } from '../types';
import { INITIAL_PILOTS, INITIAL_CATEGORIES, INITIAL_CHAMPIONSHIPS, INITIAL_CIRCUITS, INITIAL_ASSOCIATIONS } from '../constants';

const KEYS = {
  PILOTS: 'pkn_pilots',
  CHAMPS: 'pkn_champs',
  CATS: 'pkn_categories',
  REGS: 'pkn_regulations',
  LIVE_URL: 'pkn_live_url',
  STREAM_URL: 'pkn_stream_url',
  AUTH: 'pkn_auth',
  CIRCUITS: 'pkn_circuits',
  ASSOCS: 'pkn_assocs',
  MARKET: 'pkn_market',
  TRACK_STATUS: 'pkn_track_status'
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

  getAuth: () => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  setAuth: (u: any) => u ? localStorage.setItem(KEYS.AUTH, JSON.stringify(u)) : localStorage.removeItem(KEYS.AUTH),
  
  getLiveUrl: () => localStorage.getItem(KEYS.LIVE_URL) || 'https://speedhive.mylaps.com/LiveTiming',
  saveLiveUrl: (u: string) => localStorage.setItem(KEYS.LIVE_URL, u),

  getStreamingUrl: () => localStorage.getItem(KEYS.STREAM_URL) || 'https://youtube.com',
  saveStreamingUrl: (u: string) => localStorage.setItem(KEYS.STREAM_URL, u),

  getCircuits: (): Circuit[] => {
    const data = localStorage.getItem(KEYS.CIRCUITS);
    return data ? JSON.parse(data) : INITIAL_CIRCUITS;
  },
  saveCircuits: (c: Circuit[]) => localStorage.setItem(KEYS.CIRCUITS, JSON.stringify(c)),

  getAssociations: (): Association[] => {
    const data = localStorage.getItem(KEYS.ASSOCS);
    return data ? JSON.parse(data) : INITIAL_ASSOCIATIONS;
  },

  getChampionships: (): Championship[] => {
    const data = localStorage.getItem(KEYS.CHAMPS);
    return data ? JSON.parse(data) : INITIAL_CHAMPIONSHIPS;
  },
  saveChampionships: (c: Championship[]) => localStorage.setItem(KEYS.CHAMPS, JSON.stringify(c)),

  getMarketplace: (): MarketplaceItem[] => {
    const data = localStorage.getItem(KEYS.MARKET);
    return data ? JSON.parse(data) : [];
  },
  saveMarketplace: (m: MarketplaceItem[]) => localStorage.setItem(KEYS.MARKET, JSON.stringify(m)),

  getCategoryRankings: (category: string): { ranking: number; number: string; name: string }[] => {
    const data = localStorage.getItem('pkn_rankings_' + category);
    return data ? JSON.parse(data) : [];
  },

  getTrackStatus: (): TrackFlag => {
    return (localStorage.getItem(KEYS.TRACK_STATUS) as TrackFlag) || TrackFlag.VERDE;
  },

  saveTrackStatus: (status: TrackFlag) => localStorage.setItem(KEYS.TRACK_STATUS, status)
};
