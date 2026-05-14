import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Package, 
  Calendar, 
  User, 
  CreditCard, 
  ChevronRight,
  Hash,
  Info,
  Plus,
  X
} from 'lucide-react';
import { dataTracking as initialData, upbjjList, paketList } from '../data';
import { TrackingData } from '../types';
import { cn } from '../lib/utils';

export default function TrackingPage() {
  const [dataTracking, setDataTracking] = useState<Record<string, TrackingData>>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<TrackingData | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);

  // New DO Form State
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    ekspedisi: '',
    paket: '',
    tanggalKirim: new Date().toISOString().split('T')[0]
  });

  const selectedPaket = useMemo(() => 
    paketList.find(p => p.kode === formData.paket), 
  [formData.paket]);

  const allExpeditions = useMemo(() => {
    return [...new Set(upbjjList.flatMap(u => u.expeditions))];
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery) {
      setSearchResult(null);
      return;
    }
    const result = dataTracking[searchQuery.toUpperCase()];
    setSearchResult(result || null);
    if (!result) alert("Nomor DO tidak ditemukan!");
  };

  const generateDONumber = () => {
    const year = new Date().getFullYear();
    const count = Object.keys(dataTracking).length + 1;
    return `DO${year}-${String(count).padStart(3, '0')}`;
  };

  const handleAddDO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nim || !formData.nama || !formData.ekspedisi || !formData.paket) {
      alert("Lengkapi semua data!");
      return;
    }

    const newDO = generateDONumber();
    const newEntry: TrackingData = {
      nomorDO: newDO,
      nim: formData.nim,
      nama: formData.nama,
      status: 'Proses Packing',
      ekspedisi: formData.ekspedisi,
      tanggalKirim: formData.tanggalKirim,
      paket: formData.paket,
      total: selectedPaket?.harga || 0,
      perjalanan: [
        {
          waktu: new Date().toLocaleString(),
          keterangan: "DO Berhasil Dibuat. Menunggu penjemputan kurir."
        }
      ]
    };

    setDataTracking(prev => ({ ...prev, [newDO]: newEntry }));
    setSearchQuery(newDO);
    setIsAddingMode(false);
    resetForm();
    alert(`DO Berhasil dibuat: ${newDO}`);
    
    // Auto show result
    setSearchResult(newEntry);
  };

  const resetForm = () => {
    setFormData({
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: '',
      tanggalKirim: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-500 rounded-2xl shadow-xl shadow-blue-500/20 text-white">
            <Truck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">Tracking Center</h1>
            <p className="text-sm text-[var(--text-secondary)] font-medium">Lacak status pengiriman Bahan Ajar Universitas Terbuka</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddingMode(true)}
          className="px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl font-bold text-sm text-[var(--text-primary)] hover:border-blue-500 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Input DO Baru
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="group relative">
        <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors z-10">
          <Search size={22} className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Masukkan Nomor DO..."
          className="w-full pl-12 md:pl-16 pr-4 py-4 md:py-6 bg-[var(--bg-secondary)] border-2 border-[var(--border)] rounded-2xl md:rounded-[32px] text-lg md:text-xl font-bold tracking-tight outline-none focus:border-blue-500 shadow-xl md:shadow-2xl transition-all"
        />
        <button 
          type="submit"
          className="mt-4 md:mt-0 md:absolute md:right-3 md:top-1/2 md:-translate-y-1/2 w-full md:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl md:rounded-[24px] font-black uppercase tracking-tighter shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
        >
          Lacak Paket
        </button>
      </form>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {searchResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Package Info Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[var(--bg-secondary)] rounded-[40px] p-8 border border-[var(--border)] shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest bg-blue-500/10 px-2 py-1 rounded mb-2 inline-block">Order Summary</span>
                    <h3 className="text-2xl font-black text-[var(--text-primary)] leading-tight">{searchResult.nomorDO}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Status: <span className="text-blue-500 font-bold">{searchResult.status}</span></p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Nama Mahasiswa / NIM</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{searchResult.nama} ({searchResult.nim})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Paket Bahan Ajar</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{searchResult.paket}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Ekspedisi</p>
                        <p className="text-sm font-bold text-blue-500">{searchResult.ekspedisi}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Total Pembayaran</p>
                        <p className="text-lg font-black text-[var(--text-primary)] leading-none mt-1">Rp {searchResult.total.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking History */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--bg-secondary)] rounded-[40px] p-8 md:p-12 border border-[var(--border)] shadow-xl min-h-full">
                <div className="flex items-center gap-3 mb-12">
                  <div className="p-3 bg-blue-500 text-white rounded-2xl">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">Riwayat Perjalanan</h3>
                </div>

                <div className="relative space-y-10 pl-10 md:pl-16">
                  <div className="absolute left-[2.45rem] md:left-[3.15rem] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-blue-200 to-transparent" />
                  
                  {searchResult.perjalanan.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      <div className={cn(
                        "absolute -left-[2.1rem] md:-left-[2.85rem] top-0 p-1.5 rounded-full border-4 border-[var(--bg-secondary)] shadow-xl z-10 transition-transform hover:scale-125",
                        i === 0 ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      )}>
                        {i === 0 ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full bg-current" />}
                      </div>
                      
                      <div className="space-y-1">
                        <time className="text-[11px] font-black text-blue-500 tracking-wider uppercase">{step.waktu}</time>
                        <p className={cn(
                          "text-base leading-relaxed",
                          i === 0 ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-secondary)] font-medium"
                        )}>
                          {step.keterangan}
                        </p>
                      </div>
                    </motion.div>
                  )).reverse()}
                </div>
              </div>
            </div>
          </motion.div>
        ) : searchQuery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]"
          >
            <div className="relative mb-6">
              <Search size={64} className="opacity-10" />
              <Search size={24} className="absolute -top-2 -right-2 text-blue-500 animate-pulse" />
            </div>
            <p className="text-lg font-bold">Maaf, Nomor DO "{searchQuery}" tidak ditemukan</p>
            <p className="text-sm">Pastikan format penulisan sudah benar (e.g., DO2025-001)</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddingMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-secondary)] rounded-3xl md:rounded-[48px] shadow-2xl p-6 md:p-12 max-w-4xl w-full border border-[var(--border)] overflow-y-auto max-h-[90vh] my-4"
            >
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 md:p-4 bg-emerald-500 text-white rounded-xl md:rounded-[24px] shadow-xl shadow-emerald-500/20">
                    <Plus size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">Input DO Baru</h2>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">ID: <span className="text-emerald-500">{generateDONumber()}</span></p>
                  </div>
                </div>
                <button onClick={() => setIsAddingMode(false)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all">
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleAddDO} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                {/* Left Column */}
                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1 tracking-widest">NIM Mahasiswa</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        value={formData.nim}
                        onChange={(e) => setFormData({...formData, nim: e.target.value})}
                        placeholder="Contoh: 041234567"
                        className="w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1 tracking-widest">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        placeholder="Nama Sesuai KTP"
                        className="w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1 tracking-widest">Pilih Ekspedisi</label>
                    <div className="relative">
                      <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        required
                        value={formData.ekspedisi}
                        onChange={(e) => setFormData({...formData, ekspedisi: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                      >
                        <option value="">Pilih Logistik</option>
                        {allExpeditions.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1 tracking-widest">Paket Bahan Ajar</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        required
                        value={formData.paket}
                        onChange={(e) => setFormData({...formData, paket: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none font-bold"
                      >
                        <option value="">Pilih Program Studi</option>
                        {paketList.map(p => <option key={p.kode} value={p.kode}>{p.nama}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Package Info */}
                  <AnimatePresence mode="wait">
                    {selectedPaket && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[28px] space-y-3"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-blue-500/10">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Detail Modul</span>
                          <span className="text-sm font-black text-blue-600">Rp {selectedPaket.harga.toLocaleString('id-ID')}</span>
                        </div>
                        <ul className="space-y-2">
                          {selectedPaket.items.map(item => (
                            <li key={item.kode} className="flex flex-col">
                              <span className="text-[9px] font-black text-blue-400 font-mono">{item.kode}</span>
                              <span className="text-xs font-bold text-slate-600 leading-tight">{item.nama}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1 tracking-widest">Tanggal Kirim</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="date"
                        value={formData.tanggalKirim}
                        onChange={(e) => setFormData({...formData, tanggalKirim: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-8 flex gap-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingMode(false)}
                    className="flex-1 px-8 py-5 rounded-[24px] font-black uppercase tracking-tighter text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-tighter shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all text-lg"
                  >
                    Simpan & Generate DO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
