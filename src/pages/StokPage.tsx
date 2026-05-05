import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Search, Trash2, Edit3, ClipboardList, BookOpen, Hash, Tag, X } from 'lucide-react';
import { dataBahanAjar as initialData } from '../data';
import { BahanAjar } from '../types';
import { cn } from '../lib/utils';

export default function StokPage() {
  const [bahanAjar, setBahanAjar] = useState<BahanAjar[]>(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BahanAjar | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New item form state
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newStok, setNewStok] = useState<number>(0);
  const [newEdisi, setNewEdisi] = useState('1');
  const [newLokasi, setNewLokasi] = useState('0TMP01');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: BahanAjar = {
      kodeLokasi: newLokasi,
      kodeBarang: newKode,
      namaBarang: newNama,
      jenisBarang: 'BMP',
      edisi: newEdisi,
      stok: newStok,
      cover: 'img/placeholder.jpg'
    };
    setBahanAjar([newItem, ...bahanAjar]);
    setIsAdding(false);
    setNewKode('');
    setNewNama('');
    setNewStok(0);
  };

  const handleDelete = (kode: string) => {
    setBahanAjar(bahanAjar.filter(item => item.kodeBarang !== kode));
  };

  const filteredData = bahanAjar.filter(item => 
    item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Informasi Stok Bahan Ajar</h2>
          <p className="text-sm text-[var(--text-secondary)]">Monitoring ketersediaan modul untuk UT-Daerah</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah Stok Baru
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari mata kuliah..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[var(--text-primary)] text-sm"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold w-16">Cover</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Kode</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Bahan Ajar</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Edisi</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Stok</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <AnimatePresence>
                {filteredData.map((item) => (
                  <motion.tr
                    key={item.kodeBarang}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-[var(--border)] shadow-sm">
                        <img 
                          src={item.cover} 
                          alt={item.namaBarang}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/120x160/1e293b/f8fafc?text=Modul';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-blue-500 font-bold">{item.kodeBarang}</span>
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase mt-1">{item.kodeLokasi}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-[var(--text-primary)]">{item.namaBarang}</span>
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase mt-1">{item.jenisBarang}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md font-bold text-[11px]">Edisi {item.edisi}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-bold",
                          item.stok < 200 ? "text-red-500" : "text-[var(--text-primary)]"
                        )}>
                          {item.stok}
                        </span>
                        {item.stok < 200 && (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase transition-transform hover:scale-105">Menipis</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right px-4">
                      <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.kodeBarang);
                          }}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-[var(--border)]">
          {filteredData.map((item) => (
            <div 
              key={item.kodeBarang}
              onClick={() => setSelectedItem(item)}
              className="p-4 flex gap-4 hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <div className="w-16 h-20 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-[var(--border)] shrink-0 shadow-sm">
                <img 
                  src={item.cover} 
                  alt={item.namaBarang}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/120x160/1e293b/f8fafc?text=Modul';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-blue-500 font-bold text-xs">{item.kodeBarang}</span>
                    <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded font-bold text-[9px] uppercase whitespace-nowrap">Ed. {item.edisi}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[var(--text-primary)] truncate mt-0.5 leading-tight">{item.namaBarang}</h4>
                  <p className="text-[9px] text-[var(--text-secondary)] uppercase mt-0.5 tracking-tight">{item.kodeLokasi} • {item.jenisBarang}</p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border)]/50">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-[12px] font-black",
                      item.stok < 200 ? "text-red-500" : "text-[var(--text-primary)]"
                    )}>
                      {item.stok}
                    </span>
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">Tersedia</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.kodeBarang);
                    }}
                    className="p-1.5 text-red-500/50 hover:text-red-500 active:scale-90 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg-secondary)] rounded-[32px] shadow-2xl max-w-2xl w-full border border-[var(--border)] overflow-hidden cursor-default"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Book Preview Side */}
                <div className="md:w-1/3 bg-[var(--bg-primary)] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border)]">
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)]">
                    <img 
                      src={selectedItem.cover} 
                      alt={selectedItem.namaBarang}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/1e293b/f8fafc?text=Cover+Tidak+Ditemukan';
                      }}
                    />
                  </div>
                </div>

                {/* Info Side */}
                <div className="md:w-2/3 p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md mb-2 inline-block italic">Detail Bahan Ajar</span>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-tight uppercase italic">{selectedItem.namaBarang}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors bg-[var(--bg-primary)] rounded-full border border-[var(--border)]"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 flex-1">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest italic">Kode Barang</p>
                        <p className="text-sm font-black text-[var(--text-primary)] font-mono">{selectedItem.kodeBarang}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest italic">Edisi</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">Ke-{selectedItem.edisi}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest italic">Lokasi Gudang</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{selectedItem.kodeLokasi}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest italic">Status Stok</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            selectedItem.stok < 200 ? "bg-red-500" : "bg-emerald-500"
                          )} />
                          <p className="text-sm font-bold text-[var(--text-primary)]">{selectedItem.stok} Tersedia</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-[var(--border)] flex gap-3">
                    <button className="flex-1 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-white/5 transition-all">
                      Cetak Label
                    </button>
                    <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                      Keluar Barang (DO)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--bg-secondary)] rounded-[24px] shadow-2xl p-10 max-w-lg w-full border border-[var(--border)]"
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-8">Tambah Bahan Ajar</h2>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Kode Barang</label>
                    <input 
                      required
                      value={newKode}
                      onChange={(e) => setNewKode(e.target.value.toUpperCase())}
                      placeholder="ASIP4301"
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none text-[var(--text-primary)] font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Edisi</label>
                    <input 
                      required
                      value={newEdisi}
                      onChange={(e) => setNewEdisi(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Judul Materi</label>
                  <input 
                    required
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Masukkan nama bahan ajar..."
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none text-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Jumlah Stok</label>
                    <input 
                      required
                      type="number"
                      value={newStok}
                      onChange={(e) => setNewStok(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Kode Lokasi</label>
                    <input 
                      required
                      value={newLokasi}
                      onChange={(e) => setNewLokasi(e.target.value.toUpperCase())}
                      placeholder="0TMP01"
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl outline-none text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-white/5 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20"
                  >
                    Simpan Data
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
