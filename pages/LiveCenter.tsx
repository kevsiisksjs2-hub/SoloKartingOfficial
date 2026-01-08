
import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import { storageService } from '../services/storageService';
import { TimingRow, TrackFlag } from '../types';

const LiveCenter: React.FC = () => {
  const [trackStatus, setTrackStatus] = useState<TrackFlag>(TrackFlag.VERDE);
  const [timing, setTiming] = useState<TimingRow[]>([]);
  const [sessionTime, setSessionTime] = useState("00:15:42");

  useEffect(() => {
    setTrackStatus(storageService.getTrackStatus());
    
    // Mock timing data con lógica de mejores tiempos (Púrpura/Verde)
    setTiming([
      { pos: 1, no: "01", name: "JUAN ACOSTA", laps: 12, lastLap: "48.110", bestLap: "48.110", gap: "-", interval: "-", status: "Out", lastPass: Date.now(), isSessionBest: true },
      { pos: 2, no: "02", name: "PEDRO RAMIREZ", laps: 12, lastLap: "48.450", bestLap: "48.300", gap: "+0.190", interval: "+0.190", status: "Out", lastPass: Date.now(), isPersonalBest: true },
      { pos: 3, no: "12", name: "MARTIN GARCIA", laps: 12, lastLap: "49.120", bestLap: "48.902", gap: "+0.792", interval: "+0.602", status: "Out", lastPass: Date.now() },
      { pos: 4, no: "44", name: "JORGE LOPEZ", laps: 12, lastLap: "49.500", bestLap: "49.120", gap: "+1.010", interval: "+0.218", status: "Out", lastPass: Date.now() },
      { pos: 5, no: "21", name: "FEDERICO PEREZ", laps: 11, lastLap: "50.111", bestLap: "49.800", gap: "+1 Lap", interval: "+1 Lap", status: "Pit", lastPass: Date.now() },
      { pos: 6, no: "08", name: "FRANCISCO PEROYE", laps: 11, lastLap: "51.200", bestLap: "50.111", gap: "+1 Lap", interval: "+5.102", status: "Out", lastPass: Date.now() },
    ]);

    const interval = setInterval(() => {
      setTrackStatus(storageService.getTrackStatus());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const flagColors: Record<TrackFlag, string> = {
    [TrackFlag.VERDE]: 'bg-emerald-600',
    [TrackFlag.AMARILLA]: 'bg-yellow-500',
    [TrackFlag.ROJA]: 'bg-red-600',
    [TrackFlag.AZUL]: 'bg-blue-600',
    [TrackFlag.CUADROS]: 'bg-white',
  };

  return (
    <div className="bg-black min-h-screen text-white font-mono flex flex-col overflow-hidden">
      {/* Orbits Header Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center shrink-0">
         <div className="flex items-center gap-6">
            <div className={`w-6 h-6 rounded-sm ${flagColors[trackStatus]} border border-zinc-700 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}></div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div>
               <p className="text-[10px] font-bold text-zinc-500 uppercase leading-none mb-1">Session Info</p>
               <p className="text-sm font-bold uppercase tracking-tight">KDO 150cc Power • Final A</p>
            </div>
         </div>
         <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
               <p className="text-[10px] font-bold text-zinc-500 uppercase leading-none mb-1">Time To Go</p>
               <div className="flex items-center gap-2">
                  <Clock size={14} className="text-red-500" />
                  <span className="text-xl font-bold tracking-tighter tabular-nums">{sessionTime}</span>
               </div>
            </div>
            <div className="bg-zinc-950 px-4 py-2 border border-zinc-800 rounded flex items-center gap-3">
               <Activity className="text-emerald-500 animate-pulse" size={16} />
               <span className="text-[10px] font-bold uppercase">Loop S3 Online</span>
            </div>
         </div>
      </div>

      {/* Main Timing Table - Estética Speedhive/Orbits */}
      <div className="flex-grow overflow-auto">
         <table className="w-full text-left border-collapse border-b border-zinc-800">
            <thead className="sticky top-0 z-10 bg-zinc-950 border-b-2 border-zinc-800">
               <tr className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  <th className="px-4 py-3 border-r border-zinc-900 w-12 text-center">Pos</th>
                  <th className="px-4 py-3 border-r border-zinc-900 w-16 text-center">No.</th>
                  <th className="px-6 py-3 border-r border-zinc-900">Name</th>
                  <th className="px-4 py-3 border-r border-zinc-900 w-16 text-center">Laps</th>
                  <th className="px-4 py-3 border-r border-zinc-900 text-right">Last Lap</th>
                  <th className="px-4 py-3 border-r border-zinc-900 text-right">Best Lap</th>
                  <th className="px-4 py-3 border-r border-zinc-900 text-right">Gap</th>
                  <th className="px-4 py-3 border-r border-zinc-900 text-right">Interval</th>
                  <th className="px-4 py-3 text-center">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
               {timing.map((row) => (
                  <tr key={row.no} className="hover:bg-zinc-900/50 tabular-nums">
                     <td className="px-4 py-2 border-r border-zinc-900 text-center font-bold text-zinc-500">{row.pos}</td>
                     <td className="px-4 py-2 border-r border-zinc-900 text-center">
                        <span className="bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[10px] border border-zinc-700">
                           {row.no}
                        </span>
                     </td>
                     <td className="px-6 py-2 border-r border-zinc-900 text-xs font-bold uppercase text-zinc-200">
                        {row.name}
                     </td>
                     <td className="px-4 py-2 border-r border-zinc-900 text-center text-xs text-zinc-400">
                        {row.laps}
                     </td>
                     <td className="px-4 py-2 border-r border-zinc-900 text-right text-xs font-bold text-zinc-300">
                        {row.lastLap}
                     </td>
                     <td className={`px-4 py-2 border-r border-zinc-900 text-right text-xs font-black ${
                        row.isSessionBest ? 'text-purple-400' : row.isPersonalBest ? 'text-emerald-500' : 'text-zinc-400'
                     }`}>
                        {row.bestLap}
                     </td>
                     <td className="px-4 py-2 border-r border-zinc-900 text-right text-[10px] text-zinc-600 font-bold">
                        {row.gap}
                     </td>
                     <td className="px-4 py-2 border-r border-zinc-900 text-right text-[10px] text-zinc-700">
                        {row.interval}
                     </td>
                     <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                           row.status === 'Pit' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                           {row.status}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* System Status Bar */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-2 px-6 flex justify-between items-center shrink-0">
         <div className="flex gap-6 items-center text-[9px] font-bold text-zinc-600 uppercase">
            <span>Server: OK</span>
            <span>Loops: 3/3 ACTIVE</span>
            <span>TX Buffer: 0%</span>
         </div>
         <div className="text-[9px] font-bold text-red-600 uppercase italic">
            Speedhive Live Sincronizado v5.3.1
         </div>
      </div>
    </div>
  );
};

export default LiveCenter;
