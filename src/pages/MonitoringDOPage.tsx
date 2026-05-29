import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { dataTracking as initialData } from '../data';
import { TrackingData } from '../types';
import { formatIndonesianDate } from './TrackingPage';

export default function MonitoringDOPage() {
  const [dataTracking, setDataTracking] = useState<Record<string, TrackingData>>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('sitta_tracking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Record<string, TrackingData>;
          const normalized: Record<string, TrackingData> = {};
          Object.entries(parsed).forEach(([key, val]) => {
            let normalizedKey = key;
            const match = key.match(/^DO(\d{4})-(\d+)$/);
            if (match) {
              const [_, year, seq] = match;
              if (seq.length !== 3) {
                normalizedKey = `DO${year}-${String(parseInt(seq, 10)).padStart(3, '0')}`;
              }
            }
            normalized[normalizedKey] = {
              ...val,
              nomorDO: normalizedKey
            };
          });
          return normalized;
        } catch (e) {
          return initialData;
        }
      }
    }
    return initialData;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sitta_tracking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Record<string, TrackingData>;
          const normalized: Record<string, TrackingData> = {};
          Object.entries(parsed).forEach(([key, val]) => {
            let normalizedKey = key;
            const match = key.match(/^DO(\d{4})-(\d+)$/);
            if (match) {
              const [_, year, seq] = match;
              if (seq.length !== 3) {
                normalizedKey = `DO${year}-${String(parseInt(seq, 10)).padStart(3, '0')}`;
              }
            }
            normalized[normalizedKey] = {
              ...val,
              nomorDO: normalizedKey
            };
          });
          setDataTracking(normalized);
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Periodically sync if needed, and initial trigger
    handleStorageChange();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sort descending: newest DO first
  const sortedTracking = (Object.values(dataTracking) as TrackingData[]).sort((a, b) => {
    const matchA = a.nomorDO.match(/^DO(\d{4})-(\d+)$/);
    const matchB = b.nomorDO.match(/^DO(\d{4})-(\d+)$/);
    if (matchA && matchB) {
      const yearA = parseInt(matchA[1], 10);
      const yearB = parseInt(matchB[1], 10);
      const seqA = parseInt(matchA[2], 10);
      const seqB = parseInt(matchB[2], 10);
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      return seqB - seqA;
    }
    const dateA = new Date(a.tanggalKirim).getTime();
    const dateB = new Date(b.tanggalKirim).getTime();
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return b.nomorDO.localeCompare(a.nomorDO);
  });

  const doList = sortedTracking.map(item => {
    let progress = 15;
    const status = item.status || 'Proses Packing';
    const norm = status.toLowerCase();
    
    if (norm.includes('selesai') || norm.includes('terima') || norm === 'diterima') {
      progress = 100;
    } else if (norm.includes('perjalanan') || norm.includes('kirim')) {
      progress = 65;
    } else if (norm.includes('transit')) {
      progress = 40;
    } else if (norm.includes('penjemputan') || norm.includes('kurir')) {
      progress = 20;
    } else if (norm.includes('packing') || norm.includes('proses') || norm.includes('diproses')) {
      progress = 15;
    }

    return {
      no: item.nomorDO,
      mahasiswa: item.nama,
      progress,
      status: item.status,
      date: item.tanggalKirim,
      paket: item.paket,
    };
  });

  const totalCount = 1280 + doList.length;
  const runningCount = 40 + doList.filter(d => d.progress < 100).length;
  const completedCount = 1240 + doList.filter(d => d.progress === 100).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Monitoring Progress DO</h2>
        <p className="text-sm text-[var(--text-secondary)]">Status penyaluran Bahan Ajar secara real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Truck size={18} />
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Total Pengiriman</span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)]">{totalCount.toLocaleString('id-ID')}</div>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% dari bulan lalu</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Clock size={18} />
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Sedang Berjalan</span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)]">{runningCount}</div>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-1">Estimasi tiba tepat waktu</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Selesai/Diterima</span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)]">{completedCount.toLocaleString('id-ID')}</div>
          <p className="text-[10px] text-blue-500 font-bold mt-1">98% Success rate</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[var(--border)] flex justify-between items-center bg-white/5">
            <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)]">Daftar Delivery Order Aktif</h3>
            <button className="text-[10px] md:text-xs font-bold text-blue-500 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">Lihat Semua</button>
        </div>
        
        {/* Desktop View (Large Screens only) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Nomor DO</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Mahasiswa</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Paket</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Progress</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Status</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-right">Estimasi Tiba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {doList.map((item) => (
                <tr key={item.no} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-blue-500 font-bold">{item.no}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-[var(--text-primary)]">{item.mahasiswa}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded font-bold text-[10px]">{item.paket}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className={cn(
                            "h-full rounded-full",
                            item.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                          )}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        (item.status === 'Diterima' || item.status === 'Selesai') ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                        {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[var(--text-secondary)] font-medium">{formatIndonesianDate(item.date)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet & Mobile View (Grid for tablet, List for mobile) */}
        <div className="lg:hidden p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doList.map((item) => (
              <div 
                key={item.no} 
                className="p-5 rounded-2xl bg-[var(--bg-primary)]/40 border border-[var(--border)] space-y-4 hover:border-blue-500/50 transition-all active:scale-[0.98]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="font-mono text-blue-500 font-bold text-[10px] tracking-tight shrink-0">{item.no}</span>
                        <span className="bg-slate-200 dark:bg-slate-800 text-[8px] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-bold break-words">{item.paket}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] break-words">{item.mahasiswa}</h4>
                  </div>
                  <span className={cn(
                      "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest sm:self-start w-fit whitespace-nowrap shrink-0",
                      (item.status === 'Diterima' || item.status === 'Selesai') ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                      {item.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Progress Logistik</span>
                    <span className={cn(
                        "font-black",
                        item.progress === 100 ? "text-emerald-500" : "text-blue-500"
                    )}>{item.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={cn(
                        "h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                        item.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/50">
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                    <Clock size={12} className="text-blue-500" />
                    <span className="font-medium italic">Estimasi: {formatIndonesianDate(item.date)}</span>
                  </div>
                  <button className="p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <TrendingUp size={14} className="text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
