import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  User as UserIcon,
  Tag,
  X
} from 'lucide-react';
import { dataRiwayatTransaksi, dataBahanAjar, kategoriList, upbjjList } from '../data';
import { cn } from '../lib/utils';

export default function RiwayatTransaksiPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState<'Semua' | 'Masuk' | 'Keluar'>('Semua');
  const [filterUPBJJ, setFilterUPBJJ] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  const filteredData = dataRiwayatTransaksi.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.petugas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJenis = filterJenis === 'Semua' || item.jenis === filterJenis;
    
    // Find item data for category and region filtering
    const itemData = dataBahanAjar.find(b => item.item.toLowerCase().includes(b.judul.toLowerCase()));
    const matchesUPBJJ = !filterUPBJJ || (itemData && itemData.upbjj === filterUPBJJ);
    const matchesKategori = !filterKategori || (itemData && itemData.kategori === filterKategori);

    return matchesSearch && matchesJenis && matchesUPBJJ && matchesKategori;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Riwayat Transaksi</h2>
          <p className="text-sm text-[var(--text-secondary)]">Log aktivitas keluar masuk bahan ajar</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/25">
          <Download size={18} />
          Ekspor Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input 
            type="text"
            placeholder="Cari ID transaksi, nama item, atau petugas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl outline-none focus:border-blue-500 transition-colors text-sm text-[var(--text-primary)]"
          />
        </div>
        <select
          value={filterUPBJJ}
          onChange={(e) => { setFilterUPBJJ(e.target.value); setFilterKategori(''); }}
          className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-sm focus:border-blue-500 outline-none text-[var(--text-primary)]"
        >
          <option value="">Semua UT-Daerah</option>
          {upbjjList.map(u => <option key={u.kode} value={u.nama}>{u.nama}</option>)}
        </select>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-sm focus:border-blue-500 outline-none text-[var(--text-primary)]"
        >
          <option value="">Semua Kategori</option>
          {(filterUPBJJ 
            ? Array.from(new Set(dataBahanAjar.filter(b => b.upbjj === filterUPBJJ).map(b => b.kategori))).sort()
            : kategoriList
          ).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <div className="flex bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-1">
          {(['Semua', 'Masuk', 'Keluar'] as const).map((jenis) => (
            <button
              key={jenis}
              onClick={() => setFilterJenis(jenis)}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold rounded-xl transition-all",
                filterJenis === jenis 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {jenis}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse text-[13px] min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">ID Transaksi</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden md:table-cell">Tanggal & Waktu</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Item / Bahan Ajar</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden sm:table-cell">Jenis</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Jumlah</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden lg:table-cell">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id} 
                    onClick={() => setSelectedTransaction(item)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-blue-500 font-bold">{item.id}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {item.tanggal}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-[var(--text-primary)] leading-tight">{item.item}</div>
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-blue-500" />
                          <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase">{item.paket}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        item.jenis === 'Masuk' 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-orange-500/10 text-orange-500"
                      )}>
                        {item.jenis === 'Masuk' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {item.jenis}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-black text-sm",
                        item.jenis === 'Masuk' ? "text-emerald-500" : "text-orange-500"
                      )}>
                        {item.jenis === 'Masuk' ? '+' : '-'}{item.jumlah}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] italic text-xs hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <span>"{item.keterangan}"</span>
                        {item.catatanHTML && (
                          <div 
                            className="bg-blue-500/5 text-blue-500 p-1 px-2 rounded-lg not-italic font-bold text-[9px] w-fit"
                            dangerouslySetInnerHTML={{ __html: item.catatanHTML }}
                          />
                        )}
                        <div className="flex items-center gap-1.5 not-italic font-medium text-[10px]">
                          <UserIcon size={12} className="text-blue-500" />
                          <span>{item.petugas}</span>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-[var(--text-secondary)]">
                    <History size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Tidak ada data transaksi ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="md:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id}
              onClick={() => setSelectedTransaction(item)}
              className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border)] space-y-4 hover:border-blue-500/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-500 font-bold text-xs">{item.id}</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase">{item.paket}</span>
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm leading-tight">{item.item}</h4>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0",
                  item.jenis === 'Masuk' 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-orange-500/10 text-orange-500"
                )}>
                  {item.jenis === 'Masuk' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                  <span>{item.jenis}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{item.tanggal}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-1 italic">"{item.keterangan}"</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jumlah</p>
                  <p className={cn(
                    "text-lg font-black leading-none mt-1",
                    item.jenis === 'Masuk' ? "text-emerald-500" : "text-orange-500"
                  )}>
                    {item.jenis === 'Masuk' ? '+' : '-'}{item.jumlah}
                  </p>
                </div>
              </div>

              {item.catatanHTML && (
                <div 
                  className="bg-blue-500/5 text-blue-500 p-2 rounded-xl text-[10px] font-bold"
                  dangerouslySetInnerHTML={{ __html: item.catatanHTML }}
                />
              )}

              <div className="flex items-center gap-1.5 font-medium text-[10px] text-[var(--text-secondary)]">
                <UserIcon size={12} className="text-blue-500" />
                <span>Petugas: {item.petugas}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-[var(--bg-secondary)] py-12 text-center rounded-2xl border border-[var(--border)]">
            <History size={40} className="mx-auto mb-2 opacity-15 text-[var(--text-secondary)]" />
            <p className="text-sm font-bold text-[var(--text-secondary)]">Tidak ada data transaksi ditemukan</p>
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-secondary)] rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-full border border-[var(--border)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <History size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter text-[var(--text-primary)]">Detail Transaksi</h2>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{selectedTransaction.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTransaction(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)]">
                  <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase mb-2">Item / Bahan Ajar</p>
                  <p className="text-base font-bold text-[var(--text-primary)] mb-1">{selectedTransaction.item}</p>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold uppercase">{selectedTransaction.paket}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase mb-2">Jenis & Jumlah</p>
                    <div className={cn(
                      "flex items-center gap-2 font-black text-base",
                      selectedTransaction.jenis === 'Masuk' ? "text-emerald-500" : "text-orange-500"
                    )}>
                      {selectedTransaction.jenis === 'Masuk' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      {selectedTransaction.jenis === 'Masuk' ? '+' : '-'}{selectedTransaction.jumlah}
                    </div>
                  </div>
                   <div className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase mb-2">Tanggal</p>
                    <div className="flex items-center gap-2 font-black text-[var(--text-primary)] text-sm">
                       <Calendar size={16} className="text-blue-500" />
                       {selectedTransaction.tanggal}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-medium border-t border-[var(--border)] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Petugas</span>
                    <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                       <UserIcon size={14} className="text-blue-500" />
                       {selectedTransaction.petugas}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-secondary)] block">Keterangan:</span>
                    <p className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] italic">"{selectedTransaction.keterangan}"</p>
                  </div>
                </div>

                {selectedTransaction.catatanHTML && (
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-2">Catatan Internal</p>
                    <div 
                      className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedTransaction.catatanHTML }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
