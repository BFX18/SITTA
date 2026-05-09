import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Package, 
  Truck, 
  FileText, 
  History, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { dataRiwayatTransaksi } from '../data';

export default function DashboardPage() {
  const latestTransactions = dataRiwayatTransaksi.slice(0, 4);

  const cards = [
    { 
      title: 'Informasi Bahan Ajar', 
      desc: 'Cek stok ketersediaan modul', 
      icon: Package, 
      path: '/stok', 
      color: 'bg-blue-500',
      stats: '1,240 Item'
    },
    { 
      title: 'Tracking Pengiriman', 
      desc: 'Lacak status Delivery Order', 
      icon: Truck, 
      path: '/tracking', 
      color: 'bg-emerald-500',
      stats: '12 Aktif'
    },
    { 
      title: 'Monitoring DO', 
      desc: 'Progress DO Bahan Ajar', 
      icon: TrendingUp, 
      path: '/monitoring-do', 
      color: 'bg-orange-500',
      stats: '85% Selesai'
    },
    { 
      title: 'Rekap Bahan Ajar', 
      desc: 'Laporan inventaris bulanan', 
      icon: FileText, 
      path: '/rekap-stok', 
      color: 'bg-purple-500',
      stats: 'Apr 2024'
    },
    { 
      title: 'Histori Transaksi', 
      desc: 'Catatan pesanan terdahulu', 
      icon: History, 
      path: '/riwayat-transaksi', 
      color: 'bg-rose-500',
      stats: '458 Data'
    },
    { 
      title: 'Bantuan SITTA', 
      desc: 'Panduan penggunaan sistem', 
      icon: AlertCircle, 
      path: '#', 
      color: 'bg-slate-500',
      stats: 'FAQ'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              to={card.path}
              className="group block bg-[var(--bg-secondary)] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-[var(--border)] relative overflow-hidden"
            >
              <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-150", card.color)} />
              
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl text-white shadow-lg", card.color)}>
                  <card.icon size={22} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{card.stats}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-blue-500 transition-colors tracking-tight">
                {card.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 pr-10">
                {card.desc}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Buka Layanan <ChevronRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <History size={18} className="text-blue-500" />
              Aktivitas Terakhir
            </h3>
            <Link to="/riwayat-transaksi" className="text-[10px] font-black uppercase text-blue-500 hover:underline">Lihat Semua</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {latestTransactions.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-[var(--bg-primary)]/50 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    tx.jenis === 'Masuk' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                  )}>
                    {tx.jenis === 'Masuk' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight mb-0.5">{tx.item}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">{tx.tanggal} • {tx.petugas}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-black",
                    tx.jenis === 'Masuk' ? "text-emerald-500" : "text-orange-500"
                  )}>
                    {tx.jenis === 'Masuk' ? '+' : '-'}{tx.jumlah}
                  </p>
                  <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase bg-[var(--border)] px-1 rounded inline-block">{tx.paket}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic mb-2 tracking-tighter uppercase">SITTA V2</h2>
            <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6">Sistem Informasi Transaksi Tahunan Universitas Terbuka. Digitalisasi logistik untuk Indonesia.</p>
            
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Target Hari Ini</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">150 Paket</span>
                  <span className="text-[10px] bg-emerald-500 px-1.5 py-0.5 rounded-full font-bold">90%</span>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/tracking" className="relative z-10 bg-white text-blue-600 w-full py-3 rounded-xl font-black uppercase text-xs text-center shadow-xl transition-all hover:bg-blue-50 active:scale-[0.98] mt-6">
            Lacak Pengiriman
          </Link>
        </div>
      </div>
    </div>
  );
}
