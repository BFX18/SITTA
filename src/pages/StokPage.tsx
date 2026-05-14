import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  RefreshCcw, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { dataBahanAjar as initialData, upbjjList } from '../data';
import { BahanAjar } from '../types';
import { cn } from '../lib/utils';

export default function StokPage() {
  const [bahanAjar, setBahanAjar] = useState<BahanAjar[]>(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<BahanAjar | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [filterUPBJJ, setFilterUPBJJ] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortBy, setSortBy] = useState<'namaBarang' | 'stok' | 'harga'>('namaBarang');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form States
  const [formData, setFormData] = useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: '',
    upbjj: '',
    kodeLokasi: '',
    stok: 0,
    safety: 0,
    harga: 0,
    catatanHTML: ''
  });

  const allKategori = useMemo(() => {
    let list = [...new Set(bahanAjar.map(item => item.kategori))];
    if (filterUPBJJ) {
      list = [...new Set(bahanAjar.filter(item => item.upbjj === filterUPBJJ).map(item => item.kategori))];
    }
    return list;
  }, [bahanAjar, filterUPBJJ]);

  const filteredAndSortedData = useMemo(() => {
    let result = bahanAjar.filter(item => {
      const matchesSearch = item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUPBJJ = !filterUPBJJ || item.upbjj === filterUPBJJ;
      const matchesKategori = !filterKategori || item.kategori === filterKategori;
      const matchesLowStock = !showLowStock || (item.stok < item.safety || item.stok === 0);
      
      return matchesSearch && matchesUPBJJ && matchesKategori && matchesLowStock;
    });

    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return result;
  }, [bahanAjar, searchTerm, filterUPBJJ, filterKategori, showLowStock, sortBy, sortOrder]);

  const handleReset = () => {
    setSearchTerm('');
    setFilterUPBJJ('');
    setFilterKategori('');
    setShowLowStock(false);
  };

  const validateForm = () => {
    if (!formData.kodeBarang || !formData.namaBarang || !formData.upbjj || !formData.kategori) {
      alert('Semua field wajib diisi!');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      setBahanAjar(bahanAjar.map(item => item.kodeBarang === editingItem.kodeBarang ? { ...item, ...formData } : item));
      setEditingItem(null);
    } else {
      const newItem: BahanAjar = {
        ...formData,
        jenisBarang: 'BMP',
        edisi: '1',
        cover: initialData[0].cover // fallback
      };
      setBahanAjar([newItem, ...bahanAjar]);
    }
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      kodeBarang: '',
      namaBarang: '',
      kategori: '',
      upbjj: '',
      kodeLokasi: '',
      stok: 0,
      safety: 0,
      harga: 0,
      catatanHTML: ''
    });
  };

  const getStatus = (stok: number, safety: number) => {
    if (stok === 0) return { label: 'Kosong', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
    if (stok < safety) return { label: 'Menipis', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: AlertTriangle };
    return { label: 'Aman', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: ShieldCheck };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] leading-tight">Kelola Stok Bahan Ajar</h2>
          <p className="text-sm text-[var(--text-secondary)]">Manajemen ketersediaan buku universitas daerah</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); resetForm(); setEditingItem(null); }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah Bahan Ajar
        </button>
      </div>

      {/* Filters & Sorting */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari BMP..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm focus:border-blue-500 outline-none"
            />
          </div>
          <select 
            value={filterUPBJJ}
            onChange={(e) => { setFilterUPBJJ(e.target.value); setFilterKategori(''); }}
            className="px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm focus:border-blue-500 outline-none"
          >
            <option value="">Semua UT-Daerah</option>
            {upbjjList.map(u => <option key={u.kode} value={u.nama}>{u.nama}</option>)}
          </select>
          
          <AnimatePresence mode="popLayout">
            {filterUPBJJ && (
              <motion.select 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm focus:border-blue-500 outline-none"
              >
                <option value="">Semua Kategori</option>
                {allKategori.map(k => <option key={k} value={k}>{k}</option>)}
              </motion.select>
            )}
          </AnimatePresence>

          <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-blue-500 transition-colors"
          >
            <RefreshCcw size={14} /> Reset Filter
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span>Urut Berdasarkan:</span>
            <div className="flex gap-2">
              {(['namaBarang', 'stok', 'harga'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => {
                    if (sortBy === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else setSortBy(key);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all",
                    sortBy === key ? "bg-blue-500 text-white border-blue-500" : "bg-[var(--bg-primary)] border-[var(--border)] hover:border-blue-500"
                  )}
                >
                  {key === 'namaBarang' ? 'Judul' : key === 'stok' ? 'Stok' : 'Harga'}
                  {sortBy === key && <ArrowUpDown size={10} />}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={showLowStock}
              onChange={() => setShowLowStock(!showLowStock)}
              className="w-4 h-4 rounded border-[var(--border)] text-blue-500 focus:ring-blue-500 bg-[var(--bg-primary)]"
            />
            <span className="group-hover:text-[var(--text-primary)] transition-colors">Tampilkan Stok Kritis (Safety/Kosong)</span>
          </label>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Kode / Nama BMP</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Reg / Kategori</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Lokasi</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-center">Stok / Safety</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Harga</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Status</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredAndSortedData.map((item) => {
                const status = getStatus(item.stok, item.safety);
                const StatusIcon = status.icon;
                return (
                  <motion.tr 
                    layout
                    key={item.kodeBarang} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-blue-500 font-bold mb-0.5">{item.kodeBarang}</span>
                        <span className="font-bold text-[var(--text-primary)] leading-tight">{item.namaBarang}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                        <MapPin size={12} className="text-slate-400" />
                        UT {item.upbjj}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase w-fit">
                        <Tag size={10} />
                        {item.kategori}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-[11px] font-bold text-[var(--text-secondary)]">Rak {item.kodeLokasi}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className={cn("text-base font-black", status.color)}>{item.stok}</span>
                        <span className="text-[10px] text-[var(--text-secondary)] font-medium border-t border-[var(--border)] pt-0.5 w-full text-center mt-0.5">S: {item.safety}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--text-primary)]">
                        Rp {item.harga.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        status.bg,
                        status.color
                      )}>
                        <StatusIcon size={12} />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(item); setFormData({ ...item }); setIsAdding(true); }}
                          className="p-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filteredAndSortedData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-[var(--text-secondary)]">
                    <Package size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-medium">Tidak ada data stok ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-secondary)] rounded-[40px] shadow-2xl p-10 max-w-2xl w-full border border-[var(--border)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter text-[var(--text-primary)] uppercase">
                    {editingItem ? 'Edit Stok Barang' : 'Input Stok Baru'}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Lengkapi formulir manajemen stok bahan ajar</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Kode Mata Kuliah</label>
                    <input 
                      required
                      disabled={!!editingItem}
                      value={formData.kodeBarang}
                      onChange={(e) => setFormData({...formData, kodeBarang: e.target.value.toUpperCase()})}
                      placeholder="SKOM4101"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Nama Mata Kuliah</label>
                    <input 
                      required
                      value={formData.namaBarang}
                      onChange={(e) => setFormData({...formData, namaBarang: e.target.value})}
                      placeholder="Pengantar Ilmu Komunikasi"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Kategori</label>
                    <input 
                      required
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      placeholder="Ilmu Sosial"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">UT-Daerah</label>
                    <select
                      required
                      value={formData.upbjj}
                      onChange={(e) => setFormData({...formData, upbjj: e.target.value})}
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Pilih Daerah</option>
                      {upbjjList.map(u => <option key={u.kode} value={u.nama}>{u.nama}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Lokasi Rak</label>
                    <input 
                      required
                      value={formData.kodeLokasi}
                      onChange={(e) => setFormData({...formData, kodeLokasi: e.target.value.toUpperCase()})}
                      placeholder="0JKT01"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Harga Satuan (Rp)</label>
                    <input 
                      required
                      type="number"
                      value={formData.harga}
                      onChange={(e) => setFormData({...formData, harga: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Jumlah Stok (QTY)</label>
                    <input 
                      required
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData({...formData, stok: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-black"
                    />
                  </div>
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Safety Stock</label>
                    <input 
                      required
                      type="number"
                      value={formData.safety}
                      onChange={(e) => setFormData({...formData, safety: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-black text-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Catatan / HTML</label>
                   <textarea
                     rows={3}
                     value={formData.catatanHTML}
                     onChange={(e) => setFormData({...formData, catatanHTML: e.target.value})}
                     className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm italic"
                   />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-tighter text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tighter shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    {editingItem ? 'Update Stok' : 'Simpan Barang'}
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
