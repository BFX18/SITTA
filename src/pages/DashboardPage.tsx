import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Package, 
  Truck, 
  FileText, 
  History, 
  BarChart3, 
  ClipboardList,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardPage() {
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

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-blue-500/20">
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic mb-3 tracking-tighter uppercase">SITTA V2</h2>
          <p className="text-blue-100 max-w-sm font-medium leading-relaxed">Sistem Informasi Transaksi Tahunan Universitas Terbuka. Digitalisasi logistik Bahan Ajar untuk Indonesia.</p>
        </div>
        
        <Link to="/tracking" className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-xl font-black uppercase tracking-tight shadow-xl transition-transform hover:scale-105 active:scale-95">
          Lacak Pengiriman Sekarang
        </Link>
      </div>
    </div>
  );
}
