import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Truck, MapPin, Calendar, CreditCard, PackageCheck, Ship, Box, ArrowRight, Clock } from 'lucide-react';
import { dataTracking } from '../data';
import { TrackingData } from '../types';
import { cn } from '../lib/utils';

export default function TrackingPage() {
  const [searchNo, setSearchNo] = useState('');
  const [searchResult, setSearchResult] = useState<TrackingData | null>(null);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = dataTracking[searchNo];
    setSearchResult(result || null);
    setIsSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 shadow-sm border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
            <Search size={22} />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Lacak Pengiriman</h2>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              type="text"
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              placeholder="Masukkan Nomor DO (Contoh: 2023001234)"
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[var(--text-primary)] font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Cari DO
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {isSearched && (
          searchResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border)] p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
                  <div className="space-y-1">
                    <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Mahasiswa</p>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{searchResult.nama}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Nomor DO: {searchResult.nomorDO}</p>
                    </div>
                  </div>
                  <div className="md:text-right flex flex-col gap-2">
                    <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] h-full flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Paket {searchResult.paket}</p>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{searchResult.ekspedisi}</h3>
                      <div className="flex flex-col md:items-end mt-1">
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">Dikirim: {searchResult.tanggalKirim}</p>
                        <p className="text-xs text-blue-500 font-bold">Total: {searchResult.total}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4 px-2">
                     <span className="text-sm font-bold text-blue-500 italic tracking-tight">{searchResult.status}</span>
                     <span className="text-xs text-[var(--text-secondary)] font-medium">Status Pengiriman</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className={cn(
                          "h-2 flex-1 rounded-full transition-all duration-1000",
                          step <= (searchResult.status === 'Selesai' ? 4 : (searchResult.status === 'Dalam Perjalanan' ? 3 : 2))
                            ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                            : "bg-[var(--border)]"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Journey Detail */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-blue-500" />
                    <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Riwayat Perjalanan</h4>
                  </div>
                  <div className="relative ml-3 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-[var(--border)]">
                    {searchResult.perjalanan.map((step, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className={cn(
                          "absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-[var(--bg-secondary)] transition-colors",
                          idx === 0 ? "bg-blue-500 ring-4 ring-blue-500/10" : "bg-[var(--border)]"
                        )} />
                        <p className="text-[10px] font-bold text-blue-500 mb-1">{step.waktu}</p>
                        <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed">{step.keterangan}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-secondary)] border border-red-500/20 rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                 <PackageCheck size={32} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Cari DO Baru</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium">Nomor DO tidak ditemukan dalam sistem SITTA.</p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
