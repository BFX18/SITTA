import React, { useState, useMemo, useEffect } from 'react';
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
import { dataTracking as initialData, upbjjList, paketList, dataBahanAjar } from '../data';
import { TrackingData } from '../types';
import { cn } from '../lib/utils';

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNum = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      if (monthNum >= 1 && monthNum <= 12) {
        return `${day} ${months[monthNum - 1]} ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

export default function TrackingPage() {
  const [dataTracking, setDataTracking] = useState<Record<string, TrackingData>>(initialData);

  useEffect(() => {
    localStorage.setItem('sitta_tracking', JSON.stringify(dataTracking));
  }, [dataTracking]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<TrackingData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);

  // States for adding tracking progress log
  const [newProgressText, setNewProgressText] = useState('');
  const [newProgressStatus, setNewProgressStatus] = useState('');

  // States for form validation errors
  const [formErrors, setFormErrors] = useState({
    nim: '',
    nama: '',
    ekspedisi: '',
    paket: ''
  });

  // Sync state when searching a DO
  useEffect(() => {
    if (searchResult) {
      setNewProgressStatus(searchResult.status);
    } else {
      setNewProgressStatus('');
      setNewProgressText('');
    }
  }, [searchResult]);

  // Keyboard handler for Esc key to clear/reset search query and result
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setSearchQuery('');
        setSearchResult(null);
        setSearchError(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  const sortedDOs = useMemo(() => {
    return (Object.values(dataTracking) as TrackingData[]).sort((a, b) => {
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
  }, [dataTracking]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchError(null);
    if (!searchQuery) {
      setSearchResult(null);
      return;
    }
    const trimQuery = searchQuery.trim();
    const cleanQuery = trimQuery.toUpperCase().replace(/[\/\s_-]/g, '');
    
    // Check if we can find by nomorDO or nim
    const found = (Object.values(dataTracking) as TrackingData[]).find(item => {
      // 1. Direct nomorDO match
      if (item.nomorDO.toUpperCase() === trimQuery.toUpperCase()) return true;
      
      // 2. Direct nim match
      if (item.nim.toUpperCase() === trimQuery.toUpperCase() || item.nim === trimQuery) return true;
      
      // 3. Flexible nomorDO match
      const normKey = item.nomorDO.toUpperCase().replace(/[\/\s_-]/g, '');
      if (normKey === cleanQuery) return true;
      
      const qMatch = cleanQuery.match(/^DO(\d{4})(\d+)$/);
      const tMatch = normKey.match(/^DO(\d{4})(\d+)$/);
      if (qMatch && tMatch) {
        const [_, qYear, qSeq] = qMatch;
        const [__, tYear, tSeq] = tMatch;
        return qYear === tYear && parseInt(qSeq, 10) === parseInt(tSeq, 10);
      }

      // 4. Loose NIM matching
      if (item.nim.replace(/[\/\s_-]/g, '') === cleanQuery) return true;
      
      return false;
    });

    setSearchResult(found || null);
    if (!found) {
      setSearchError(`Nomor DO atau NIM "${searchQuery}" tidak ditemukan!`);
    }
  };

  const generateDONumber = () => {
    const year = new Date().getFullYear();
    // Find all DO numbers for the current year
    const existingDOsForYear = Object.keys(dataTracking).filter(key => key.startsWith(`DO${year}-`));
    
    let maxSequence = 0;
    existingDOsForYear.forEach(key => {
      const parts = key.split('-');
      if (parts.length === 2) {
        const seq = parseInt(parts[1]);
        if (!isNaN(seq) && seq > maxSequence) {
          maxSequence = seq;
        }
      }
    });

    const sequence = maxSequence + 1;
    return `DO${year}-${String(sequence).padStart(3, '0')}`;
  };

  const validateForm = () => {
    const errors = {
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: ''
    };
    let isValid = true;

    // NIM validation: digits only, length 7 - 15
    if (!formData.nim) {
      errors.nim = 'NIM wajib diisi';
      isValid = false;
    } else if (!/^\d+$/.test(formData.nim)) {
      errors.nim = 'NIM harus berupa angka saja';
      isValid = false;
    } else if (formData.nim.length < 7 || formData.nim.length > 15) {
      errors.nim = 'NIM harus berjumlah antara 7 hingga 15 digit';
      isValid = false;
    }

    // Nama validation: minimum 3 characters
    if (!formData.nama.trim()) {
      errors.nama = 'Nama wajib diisi';
      isValid = false;
    } else if (formData.nama.trim().length < 3) {
      errors.nama = 'Nama minimal memiliki 3 karakter';
      isValid = false;
    }

    // Ekspedisi validation
    if (!formData.ekspedisi) {
      errors.ekspedisi = 'Pilih salah satu ekspedisi';
      isValid = false;
    }

    // Paket validation
    if (!formData.paket) {
      errors.paket = 'Pilih paket bahan ajar';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddDO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
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
          waktu: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          keterangan: "DO Berhasil Dibuat. Menunggu penjemputan kurir."
        }
      ]
    };

    setDataTracking(prev => ({ ...prev, [newDO]: newEntry }));
    setSearchQuery(newDO);
    setIsAddingMode(false);
    resetForm();
    
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
    setFormErrors({
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: ''
    });
  };

  const handleNewProgressStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgressText.trim()) return;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formattedWaktu = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const updatedPerjalanan = [
      ...searchResult!.perjalanan,
      {
        waktu: formattedWaktu,
        keterangan: newProgressText.trim()
      }
    ];

    const updatedStatus = newProgressStatus || searchResult!.status;

    const updatedDO: TrackingData = {
      ...searchResult!,
      status: updatedStatus,
      perjalanan: updatedPerjalanan
    };

    setDataTracking(prev => ({
      ...prev,
      [searchResult!.nomorDO]: updatedDO
    }));

    setSearchResult(updatedDO);
    setNewProgressText('');
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
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="group relative flex flex-col md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors z-10">
              <Search size={22} className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchError(null);
              }}
              placeholder="Masukkan Nomor DO atau NIM..."
              className="w-full pl-12 md:pl-16 pr-4 md:pr-48 py-4 md:py-6 bg-[var(--bg-secondary)] border-2 border-[var(--border)] rounded-2xl md:rounded-[32px] text-lg md:text-xl font-bold tracking-tight outline-none focus:border-blue-500 shadow-xl md:shadow-2xl transition-all"
            />
          </div>
          <button 
            type="submit"
            className="mt-4 md:mt-0 md:absolute md:right-3 md:top-1/2 md:-translate-y-1/2 w-full md:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl md:rounded-[24px] font-black uppercase tracking-tighter shadow-xl shadow-blue-500/30 active:scale-95 transition-all text-center"
          >
            Lacak Paket
          </button>
        </form>

        {searchError && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs md:text-sm flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span>{searchError}</span>
          </motion.div>
        )}
      </div>

      {/* DO List Table (Visible when no search result) */}
      {!searchResult && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border)] overflow-hidden shadow-xl"
        >
          <div className="p-6 md:p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)]/30">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-[var(--text-primary)]">Daftar Delivery Order</h3>
              <p className="text-xs text-[var(--text-secondary)]">Total {Object.keys(dataTracking).length} pengiriman tercatat</p>
            </div>
          </div>
          
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--bg-primary)]/50">
                  <th className="px-8 py-4">Nomor DO</th>
                  <th className="px-8 py-4">NIM / Nama</th>
                  <th className="px-8 py-4">Paket</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {sortedDOs.map((doItem) => (
                  <tr key={doItem.nomorDO} className="hover:bg-blue-500/5 transition-colors">
                    <td className="px-8 py-5">
                      <span className="font-mono font-black text-blue-500">{doItem.nomorDO}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--text-primary)]">{doItem.nama}</span>
                        <span className="text-[10px] font-medium text-[var(--text-secondary)]">{doItem.nim}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[var(--text-secondary)]">{doItem.paket}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-1 rounded-lg",
                        doItem.status === "Selesai" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {doItem.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {
                          setSearchQuery(doItem.nomorDO);
                          setSearchResult(doItem);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet View */}
          <div className="md:hidden p-4 space-y-3">
            {sortedDOs.map((doItem) => (
              <div 
                key={doItem.nomorDO}
                onClick={() => {
                  setSearchQuery(doItem.nomorDO);
                  setSearchResult(doItem);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border)] flex justify-between items-center hover:border-blue-500/30 transition-all cursor-pointer"
              >
                 <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono font-black text-blue-500 text-xs shrink-0">{doItem.nomorDO}</span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-bold truncate max-w-[150px]" title={doItem.paket}>{doItem.paket}</span>
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm truncate" title={doItem.nama}>{doItem.nama}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)]">NIM: {doItem.nim}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-3">
                  <span className={cn(
                    "text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap",
                    doItem.status === "Selesai" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {doItem.status}
                  </span>
                  <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
              <button 
                onClick={() => { setSearchResult(null); setSearchQuery(''); }}
                className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors mb-2"
              >
                <ChevronRight size={18} className="rotate-180" />
                Kembali ke Daftar
              </button>
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
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Tanggal Kirim</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{formatIndonesianDate(searchResult.tanggalKirim)}</p>
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

                {/* Form Update Progress Perjalanan */}
                <div className="mt-12 pt-8 border-t border-[var(--border)] space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
                    <Plus size={16} className="text-blue-500" />
                    Tambah Progress Pengiriman
                  </h4>
                  <form onSubmit={handleNewProgressStep} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Ubah Status DO (Opsional)</label>
                        <select
                          value={newProgressStatus}
                          onChange={(e) => setNewProgressStatus(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-[var(--text-primary)]"
                        >
                          <option value="Proses Packing">Proses Packing</option>
                          <option value="Menunggu Penjemputan">Menunggu Penjemputan</option>
                          <option value="Transit">Transit</option>
                          <option value="Dalam Perjalanan">Dalam Perjalanan</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </div>
                      {/* Local Time Info */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Waktu (Otomatis)</label>
                        <div className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono text-[var(--text-secondary)] flex items-center gap-2 border border-[var(--border)]">
                          <Clock size={12} className="text-blue-500 font-bold" />
                          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Keterangan */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Keterangan Progress Baru</label>
                      <input
                        type="text"
                        required
                        value={newProgressText}
                        onChange={(e) => setNewProgressText(e.target.value)}
                        placeholder="Contoh: Paket sedang disortir di Hub Jakarta"
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-sm font-bold text-[var(--text-primary)]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      Update Progress Perjalanan
                    </button>
                  </form>
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
                        className={cn(
                          "w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border rounded-2xl outline-none focus:ring-2 transition-all font-mono font-bold",
                          formErrors.nim ? "border-red-500 focus:ring-red-500" : "border-[var(--border)] focus:ring-emerald-500"
                        )}
                      />
                    </div>
                    {formErrors.nim && <p className="text-xs text-red-500 font-bold ml-1">{formErrors.nim}</p>}
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
                        className={cn(
                          "w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border rounded-2xl outline-none focus:ring-2 transition-all font-bold",
                          formErrors.nama ? "border-red-500 focus:ring-red-500" : "border-[var(--border)] focus:ring-emerald-500"
                        )}
                      />
                    </div>
                    {formErrors.nama && <p className="text-xs text-red-500 font-bold ml-1">{formErrors.nama}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1 tracking-widest">Pilih Ekspedisi</label>
                    <div className="relative">
                      <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        required
                        value={formData.ekspedisi}
                        onChange={(e) => setFormData({...formData, ekspedisi: e.target.value})}
                        className={cn(
                          "w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border  rounded-2xl outline-none focus:ring-2 transition-all appearance-none",
                          formErrors.ekspedisi ? "border-red-500 focus:ring-red-500" : "border-[var(--border)] focus:ring-emerald-500"
                        )}
                      >
                        <option value="">Pilih Logistik</option>
                        {allExpeditions.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                      </select>
                    </div>
                    {formErrors.ekspedisi && <p className="text-xs text-red-500 font-bold ml-1">{formErrors.ekspedisi}</p>}
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
                        className={cn(
                          "w-full pl-12 pr-6 py-4 bg-[var(--bg-primary)] border rounded-2xl outline-none focus:ring-2 transition-all appearance-none font-bold",
                          formErrors.paket ? "border-red-500 focus:ring-red-500" : "border-[var(--border)] focus:ring-emerald-500"
                        )}
                      >
                        <option value="">Pilih Paket...</option>
                        {paketList.map(p => (
                          <option key={p.kode} value={p.kode}>
                            {p.kode} - {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.paket && <p className="text-xs text-red-500 font-bold ml-1">{formErrors.paket}</p>}
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
                          <div>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Detail Isi Paket</span>
                            <span className="text-[13px] font-bold text-[var(--text-primary)]">{selectedPaket.nama}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Harga</span>
                            <span className="text-sm font-black text-emerald-600">Rp {selectedPaket.harga.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                        <ul className="grid grid-cols-1 gap-2">
                          {selectedPaket.isi.map(itemKode => {
                            const itemDetail = dataBahanAjar.find(b => b.kode === itemKode);
                            const itemNama = itemDetail ? itemDetail.judul : "Bahan Ajar UT";
                            return (
                              <li key={itemKode} className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-xl border border-blue-500/5">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-mono text-[10px] font-bold">
                                  {itemKode.slice(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-blue-400 font-mono leading-none mb-0.5">{itemKode}</span>
                                  <span className="text-[11px] font-bold text-slate-600 leading-tight">{itemNama}</span>
                                </div>
                              </li>
                            );
                          })}
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
