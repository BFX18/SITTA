import React, { useState, useMemo, useEffect } from 'react';
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
import { dataBahanAjar as initialData, upbjjList, kategoriList } from '../data';
import { BahanAjar } from '../types';
import { cn } from '../lib/utils';

export default function StokPage() {
  const [bahanAjar, setBahanAjar] = useState<BahanAjar[]>(initialData);

  useEffect(() => {
    localStorage.setItem('sitta_bahan_ajar', JSON.stringify(bahanAjar));
  }, [bahanAjar]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<BahanAjar | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<BahanAjar | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BahanAjar | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [filterUPBJJ, setFilterUPBJJ] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortBy, setSortBy] = useState<'judul' | 'qty' | 'harga'>('judul');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form States
  const [formData, setFormData] = useState({
    kode: '',
    judul: '',
    kategori: '',
    upbjj: '',
    lokasiRak: '',
    qty: 0,
    safety: 0,
    harga: 0,
    catatanHTML: ''
  });

  // Performance Optimization: Derived Kategori list based on selected UT-Daerah
  const availableCategories = useMemo(() => {
    const filteredBahan = filterUPBJJ
      ? bahanAjar.filter(item => item.upbjj === filterUPBJJ)
      : bahanAjar;
    const categoriesAtUPBJJ = filteredBahan.map(item => item.kategori);
    const unique = Array.from(new Set(categoriesAtUPBJJ)).filter(Boolean);
    return unique.length > 0 ? unique.sort() : kategoriList;
  }, [bahanAjar, filterUPBJJ]);

  // Performance Optimization: Filtered and Sorted Data (Memoized)
  const filteredAndSortedData = useMemo(() => {
    let result = bahanAjar.filter(item => {
      const itemJudul = item.judul || item.namaBarang || '';
      const itemKode = item.kode || item.kodeBarang || '';
      const itemQty = item.qty ?? item.stok ?? 0;

      const matchesSearch = itemJudul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           itemKode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUPBJJ = !filterUPBJJ || item.upbjj === filterUPBJJ;
      const matchesKategori = !filterKategori || item.kategori === filterKategori;
      
      // Critical Stock: qty < safety OR qty == 0
      const isCritical = itemQty === 0 || itemQty < item.safety;
      const matchesCritical = !showLowStock || isCritical;
      
      return matchesSearch && matchesUPBJJ && matchesKategori && matchesCritical;
    });

    // Sort Logic
    result.sort((a, b) => {
      const valA = sortBy === 'judul' ? (a.judul || a.namaBarang || '') : sortBy === 'qty' ? (a.qty ?? a.stok ?? 0) : (a.harga ?? 0);
      const valB = sortBy === 'judul' ? (b.judul || b.namaBarang || '') : sortBy === 'qty' ? (b.qty ?? b.stok ?? 0) : (b.harga ?? 0);
      
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
    setSortBy('judul');
    setSortOrder('asc');
  };

  const validateForm = () => {
    if (!formData.kode.trim()) {
      alert('Kode mata kuliah wajib diisi!');
      return false;
    }
    if (!formData.judul.trim()) {
      alert('Nama mata kuliah wajib diisi!');
      return false;
    }
    if (!formData.kategori) {
      alert('Kategori wajib dipilih!');
      return false;
    }
    if (!formData.upbjj) {
      alert('UT-Daerah wajib dipilih!');
      return false;
    }
    if (!formData.lokasiRak.trim()) {
      alert('Lokasi rak wajib diisi!');
      return false;
    }
    if (formData.harga <= 0) {
      alert('Harga harus lebih besar dari Rp 0!');
      return false;
    }
    if (formData.qty < 0) {
      alert('Jumlah stok tidak boleh kurang dari 0!');
      return false;
    }
    if (formData.safety < 0) {
      alert('Safety stock tidak boleh kurang dari 0!');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      setBahanAjar(bahanAjar.map(item => {
        if (item.kode === editingItem.kode || item.kodeBarang === editingItem.kodeBarang) {
          return {
            ...item,
            ...formData,
            kodeBarang: formData.kode,
            namaBarang: formData.judul,
            stok: formData.qty,
            kodeLokasi: formData.lokasiRak
          };
        }
        return item;
      }));
      setEditingItem(null);
    } else {
      const newItem: BahanAjar = {
        ...formData,
        jenisBarang: 'BMP',
        edisi: '1',
        cover: initialData.find(d => d.cover)?.cover || '',
        kodeBarang: formData.kode,
        namaBarang: formData.judul,
        stok: formData.qty,
        kodeLokasi: formData.lokasiRak
      };
      setBahanAjar([newItem, ...bahanAjar]);
    }
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      qty: 0,
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
      <div className="bg-[var(--bg-secondary)] p-4 md:p-6 rounded-3xl border border-[var(--border)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari BMP..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="w-full">
            <select 
              value={filterUPBJJ}
              onChange={(e) => setFilterUPBJJ(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm focus:border-blue-500 outline-none"
            >
              <option value="">Semua UT-Daerah</option>
              {upbjjList.map(u => <option key={u.kode} value={u.nama}>{u.nama}</option>)}
            </select>
          </div>
          
          <div className="w-full">
            <select 
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm focus:border-blue-500 outline-none"
            >
              <option value="">Semua Kategori</option>
              {availableCategories.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-blue-500 transition-colors py-2 w-full sm:w-auto"
          >
            <RefreshCcw size={14} /> Reset Filter
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 pt-2 border-t border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          <div className="flex flex-wrap items-center gap-3">
            <span>Urutkan:</span>
            <div className="flex flex-wrap gap-2">
              {(['judul', 'qty', 'harga'] as const).map(key => (
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
                  {key === 'judul' ? 'Judul' : key === 'qty' ? 'Stok' : 'Harga'}
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
            <span className="group-hover:text-[var(--text-primary)] transition-colors">Tampilkan Stok Kritis / Re-order</span>
          </label>
        </div>
      </div>

      {/* Desktop Main Table */}
      <div className="hidden md:block bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] overflow-visible">
        <div className="overflow-x-auto overflow-visible">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold whitespace-nowrap">Kode / Nama Mata Kuliah</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden lg:table-cell">Kategori</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden md:table-cell">UT-Daerah</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden xl:table-cell">Lokasi Rak</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-right hidden sm:table-cell">Harga</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-center whitespace-nowrap">Jumlah Stok</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-center hidden md:table-cell whitespace-nowrap">Stok Safety</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Status</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold hidden xl:table-cell">Catatan</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold text-right whitespace-nowrap">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredAndSortedData.map((item) => {
                const itemQty = item.qty ?? item.stok ?? 0;
                const status = getStatus(itemQty, item.safety);
                const StatusIcon = status.icon;
                return (
                  <motion.tr 
                    layout
                    key={item.kode} 
                    onClick={() => setSelectedItemForDetail(item)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-blue-500 font-bold mb-0.5 text-[10px] md:text-[13px]">{item.kode}</span>
                        <span className="font-bold text-[var(--text-primary)] leading-tight line-clamp-1 md:line-clamp-none">{item.judul}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase w-fit">
                        <Tag size={10} />
                        {item.kategori}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                        <MapPin size={12} className="text-slate-400" />
                        {item.upbjj}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-[11px] font-bold text-[var(--text-secondary)]">{item.lokasiRak}</span>
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell whitespace-nowrap font-bold text-[var(--text-primary)]">
                      Rp {(item.harga ?? 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={cn("text-xs md:text-sm font-black", status.color)}>{itemQty} buah</span>
                    </td>
                    <td className="px-6 py-4 text-center hidden md:table-cell whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-500">{item.safety} buah</span>
                    </td>
                    <td className="px-6 py-4 relative group/status overflow-visible">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider relative z-10",
                        status.bg,
                        status.color
                      )}>
                        <StatusIcon size={12} />
                        <span>{status.label}</span>
                      </div>

                      {/* Tooltip for Catatan */}
                      {item.catatanHTML && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-60 p-3 bg-slate-900 text-white rounded-xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 pointer-events-none text-left border border-slate-700">
                          <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 select-none">Preview Catatan</div>
                          <div 
                            className="text-[11px] font-medium leading-relaxed whitespace-normal text-slate-200"
                            dangerouslySetInnerHTML={{ __html: item.catatanHTML }}
                          />
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      {item.catatanHTML ? (
                        <div 
                          className="text-[11px] text-[var(--text-secondary)] italic max-w-[150px] truncate"
                          dangerouslySetInnerHTML={{ __html: item.catatanHTML }}
                          title={item.catatanHTML.replace(/<[^>]*>?/gm, '')}
                        />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => { setEditingItem(item); setFormData({ ...item }); setIsAdding(true); }}
                          className="p-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => setItemToDelete(item)}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filteredAndSortedData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center text-[var(--text-secondary)]">
                    <Package size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-medium">Tidak ada data stok ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card Grid View */}
      <div className="md:hidden space-y-4">
        {filteredAndSortedData.map((item) => {
          const itemQty = item.qty ?? item.stok ?? 0;
          const status = getStatus(itemQty, item.safety);
          const StatusIcon = status.icon;
          return (
            <motion.div
              layout
              key={item.kode}
              onClick={() => setSelectedItemForDetail(item)}
              className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border)] space-y-4 hover:border-blue-500/30 transition-all cursor-pointer relative"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-blue-500 font-bold text-xs">{item.kode}</span>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm leading-tight line-clamp-2">{item.judul}</h4>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0",
                  status.bg,
                  status.color
                )}>
                  <StatusIcon size={10} />
                  <span>{status.label}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border)]">
                  <Tag size={10} className="text-blue-500" />
                  {item.kategori}
                </span>
                <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border)]">
                  <MapPin size={10} className="text-slate-400" />
                  {item.upbjj}
                </span>
                <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border)]">
                  Loc: <span className="font-mono text-[var(--text-primary)] font-bold">{item.lokasiRak}</span>
                </span>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-[var(--border)]/50">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Harga Satuan</p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    Rp {(item.harga ?? 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stok / Safety</p>
                    <p className="text-sm font-black text-[var(--text-primary)]">
                      {itemQty} <span className="text-[10px] text-slate-500 font-medium">/ {item.safety}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 border-l border-[var(--border)] pl-3" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => { setEditingItem(item); setFormData({ ...item }); setIsAdding(true); }}
                      className="p-1.5 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filteredAndSortedData.length === 0 && (
          <div className="bg-[var(--bg-secondary)] py-12 text-center rounded-2xl border border-[var(--border)]">
            <Package size={40} className="mx-auto mb-2 opacity-15 text-[var(--text-secondary)]" />
            <p className="text-sm font-bold text-[var(--text-secondary)]">Tidak ada data stok ditemukan</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-secondary)] rounded-3xl md:rounded-[40px] shadow-2xl p-6 md:p-10 max-w-2xl w-full border border-[var(--border)] overflow-y-auto max-h-[90vh] my-4"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-[var(--text-primary)] uppercase">
                    {editingItem ? 'Edit Stok Barang' : 'Input Stok Baru'}
                  </h2>
                  <p className="text-[10px] md:text-xs text-[var(--text-secondary)] font-medium">Lengkapi formulir manajemen stok bahan ajar</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Kode Mata Kuliah</label>
                    <input 
                      required
                      disabled={!!editingItem}
                      value={formData.kode}
                      onChange={(e) => setFormData({...formData, kode: e.target.value.toUpperCase()})}
                      placeholder="SKOM4101"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Nama Mata Kuliah</label>
                    <input 
                      required
                      value={formData.judul}
                      onChange={(e) => setFormData({...formData, judul: e.target.value})}
                      placeholder="Pengantar Ilmu Komunikasi"
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] ml-1">Kategori</label>
                    <select
                      required
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      className="w-full px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
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
                      value={formData.lokasiRak}
                      onChange={(e) => setFormData({...formData, lokasiRak: e.target.value.toUpperCase()})}
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
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: parseInt(e.target.value) || 0})}
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

      <AnimatePresence>
        {selectedItemForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-secondary)] rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-full border border-[var(--border)] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter text-[var(--text-primary)]">Detail Bahan Ajar</h2>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{selectedItemForDetail.kode}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedItemForDetail(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex-shrink-0 overflow-hidden shadow-md">
                     <img 
                       src={selectedItemForDetail.cover || "https://placehold.co/100x140?text=No+Cover"} 
                       alt={selectedItemForDetail.judul}
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                     />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--text-primary)] text-sm mb-2">{selectedItemForDetail.judul}</h3>
                    <div className="flex gap-2">
                       <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold uppercase">{selectedItemForDetail.kategori}</span>
                       <span className="px-2 py-0.5 bg-slate-500/10 text-slate-500 rounded text-[9px] font-bold uppercase">Edisi {selectedItemForDetail.edisi}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase mb-1">Status Stok</p>
                    {(() => {
                      const status = getStatus(selectedItemForDetail.qty ?? 0, selectedItemForDetail.safety);
                      const StatusIcon = status.icon;
                      return (
                        <div className={cn("flex items-center gap-2 font-black", status.color)}>
                          <StatusIcon size={16} />
                          <span className="text-base">{selectedItemForDetail.qty} <span className="text-xs">QTY</span></span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase mb-1">Lokasi Rak</p>
                    <div className="flex items-center gap-2 font-black text-[var(--text-primary)]">
                       <MapPin size={16} className="text-blue-500" />
                       <span className="text-base">{selectedItemForDetail.lokasiRak}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-medium border-t border-[var(--border)] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">UT-Daerah</span>
                    <span className="font-bold text-[var(--text-primary)]">{selectedItemForDetail.upbjj}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Safety Level</span>
                    <span className="font-bold text-orange-500">{selectedItemForDetail.safety} QTY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Harga Satuan</span>
                    <span className="font-bold text-[var(--text-primary)]">Rp {selectedItemForDetail.harga.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {selectedItemForDetail.catatanHTML && (
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                    <p className="text-[9px] font-black text-yellow-600 uppercase mb-2">Catatan Khusus</p>
                    <div 
                      className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedItemForDetail.catatanHTML }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => {
                    setEditingItem(selectedItemForDetail);
                    setFormData({ ...selectedItemForDetail });
                    setSelectedItemForDetail(null);
                    setIsAdding(true);
                  }}
                  className="w-full py-4 bg-[var(--bg-primary)] hover:bg-blue-500 hover:text-white border border-[var(--border)] rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={14} />
                  Ubah Data Bahan Ajar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-secondary)] rounded-3xl shadow-2xl p-6 max-w-md w-full border border-[var(--border)] text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-[var(--text-primary)] mb-2">Hapus Bahan Ajar?</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus <span className="font-bold text-[var(--text-primary)]">{itemToDelete.judul} ({itemToDelete.kode})</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-3 px-4 bg-[var(--bg-primary)] hover:bg-[var(--border)] rounded-2xl font-bold text-sm text-[var(--text-secondary)] transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBahanAjar(bahanAjar.filter(b => b.kode !== itemToDelete.kode));
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
