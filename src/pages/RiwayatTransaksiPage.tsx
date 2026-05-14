import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  User as UserIcon,
  Tag
} from 'lucide-react';
import { dataRiwayatTransaksi } from '../data';
import { cn } from '../lib/utils';

export default function RiwayatTransaksiPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState<'Semua' | 'Masuk' | 'Keluar'>('Semua');

  const filteredData = dataRiwayatTransaksi.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.petugas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJenis = filterJenis === 'Semua' || item.jenis === filterJenis;
    return matchesSearch && matchesJenis;
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-1">
          {(['Semua', 'Masuk', 'Keluar'] as const).map((jenis) => (
            <button
              key={jenis}
              onClick={() => setFilterJenis(jenis)}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
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

      <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse text-[13px] min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">ID Transaksi</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Tanggal & Waktu</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Item / Bahan Ajar</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Jenis</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Jumlah</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Keterangan</th>
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
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-blue-500 font-bold">{item.id}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {item.tanggal}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-[var(--text-primary)]">{item.item}</div>
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-blue-500" />
                          <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase">{item.paket}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-[var(--text-secondary)] italic text-xs">
                      <div className="flex flex-col gap-1">
                        <span>"{item.keterangan}"</span>
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
    </div>
  );
}
