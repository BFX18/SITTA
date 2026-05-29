import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  FileText, 
  History, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { cn } from '../lib/utils';
import { dataRiwayatTransaksi, dataBahanAjar, dataTracking } from '../data';

export default function DashboardPage() {
  const latestTransactions = dataRiwayatTransaksi.slice(0, 4);

  const stats = useMemo(() => {
    const totalBuku = dataBahanAjar.reduce((acc, curr) => acc + (curr.qty ?? 0), 0);
    const lowStock = dataBahanAjar.filter(item => (item.qty ?? 0) < item.safety && (item.qty ?? 0) > 0).length;
    const outOfStock = dataBahanAjar.filter(item => (item.qty ?? 0) === 0).length;
    const activeDO = Object.keys(dataTracking).length;
    
    return { totalBuku, lowStock, outOfStock, activeDO };
  }, []);

  const cards = [
    { 
      title: 'Stok Bahan Ajar', 
      desc: 'Cek stok ketersediaan modul', 
      icon: Package, 
      path: '/stok', 
      color: 'bg-blue-500',
      stats: `${stats.totalBuku.toLocaleString()} Qty`
    },
    { 
      title: 'Tracking Pengiriman', 
      desc: 'Lacak status Delivery Order', 
      icon: Truck, 
      path: '/tracking', 
      color: 'bg-emerald-500',
      stats: `${stats.activeDO} Aktif`
    },
    { 
      title: 'Histori Transaksi', 
      desc: 'Catatan pesanan terdahulu', 
      icon: History, 
      path: '/riwayat-transaksi', 
      color: 'bg-rose-500',
      stats: `${dataRiwayatTransaksi.length} Log`
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Alert Banner for Low Stock */}
      <AnimatePresence>
        {(stats.lowStock > 0 || stats.outOfStock > 0) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-1 px-4 bg-red-500 rounded-2xl flex flex-col md:flex-row items-center justify-between text-white shadow-lg shadow-red-500/20 gap-2 md:gap-4"
          >
            <div className="flex items-center gap-3 py-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest leading-none">Peringatan Stok Kritis</p>
                <p className="text-xs font-medium opacity-90">{stats.outOfStock} buku kosong & {stats.lowStock} buku di bawah safety.</p>
              </div>
            </div>
            <Link to="/stok" className="w-full md:w-auto px-6 py-2 bg-white text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors text-center mb-2 md:mb-0">
              Cek Detail Stok
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              to={card.path}
              className="group block bg-[var(--bg-secondary)] rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all border border-[var(--border)] relative overflow-hidden"
            >
              <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 transition-transform group-hover:scale-150", card.color)} />
              
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className={cn("p-3 md:p-4 rounded-2xl md:rounded-3xl text-white shadow-xl shadow-current/10", card.color)}>
                  <card.icon size={28} className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{card.stats}</span>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-black italic text-[var(--text-primary)] mb-1 group-hover:text-blue-500 transition-colors tracking-tighter uppercase">
                {card.title}
              </h3>
              <p className="text-[11px] md:text-xs text-[var(--text-secondary)] font-medium">
                {card.desc}
              </p>

              <div className="mt-6 md:mt-8 flex items-center gap-2 text-[10px] md:text-xs font-black uppercase text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Kelola Data <ChevronRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-[32px] md:rounded-[40px] border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-black italic text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-tighter text-base md:text-lg">
              <History size={20} className="text-blue-500" />
              Aktivitas Gudang
            </h3>
            <Link to="/riwayat-transaksi" className="text-[10px] font-black uppercase text-blue-500 hover:underline tracking-widest">Detail</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {latestTransactions.map((tx) => (
              <div key={tx.id} className="p-4 md:p-6 hover:bg-[var(--bg-primary)]/50 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={cn(
                    "p-2.5 md:p-3 rounded-xl md:rounded-2xl shrink-0",
                    tx.jenis === 'Masuk' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                  )}>
                    {tx.jenis === 'Masuk' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-[var(--text-primary)] leading-tight mb-1 truncate">{tx.item}</h4>
                    <p className="text-[9px] md:text-[10px] text-[var(--text-secondary)] font-medium truncate">{tx.tanggal} • {tx.petugas}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn(
                    "text-base md:text-lg font-black italic",
                    tx.jenis === 'Masuk' ? "text-emerald-500" : "text-orange-500"
                  )}>
                    {tx.jenis === 'Masuk' ? '+' : '-'}{tx.jumlah}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-black italic text-[var(--text-secondary)] uppercase bg-[var(--border)] px-2 py-0.5 rounded-full inline-block">{tx.paket}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6">
               <ClipboardList size={24} />
            </div>
            <h2 className="text-4xl font-black italic mb-2 tracking-tighter uppercase">SITTA V2</h2>
            <p className="text-blue-100 text-xs font-bold leading-relaxed mb-8 opacity-80 uppercase tracking-wider">Sistem Informasi Transaksi Tahunan Universitas Terbuka.</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <p className="text-[10px] font-black opacity-60 uppercase mb-2 tracking-widest">Digitalisasi Logistik</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black">Distribusi Nasional</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <TrendingUp size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/tracking" className="relative z-10 bg-white text-blue-600 w-full py-5 rounded-[24px] font-black uppercase italic tracking-tighter shadow-2xl transition-all hover:bg-blue-50 active:scale-[0.98] mt-8 flex items-center justify-center gap-2">
            Lacak Pengiriman <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
