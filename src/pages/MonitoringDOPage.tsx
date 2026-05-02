import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MonitoringDOPage() {
  const doList = [
    { no: 'DO/2024/0001', mahasiswa: 'Agus Pranoto', progress: 100, status: 'Diterima', date: '2025-08-26' },
    { no: 'DO/2024/0002', mahasiswa: 'Rina Wulandari', progress: 65, status: 'Dalam Perjalanan', date: '2025-08-25' },
    { no: 'DO/2024/0003', mahasiswa: 'Budi Santoso', progress: 40, status: 'Transit', date: '2025-08-27' },
    { no: 'DO/2024/0004', mahasiswa: 'Siti Marlina', progress: 15, status: 'Diproses', date: '2025-08-28' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Monitoring Progress DO</h2>
        <p className="text-sm text-[var(--text-secondary)]">Status penyaluran Bahan Ajar secara real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Truck size={18} />
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Total Pengiriman</span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)]">1,284</div>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% dari bulan lalu</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Clock size={18} />
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Sedang Berjalan</span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)]">42</div>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-1">Estimasi tiba tepat waktu</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Selesai/Diterima</span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)]">1,242</div>
          <p className="text-[10px] text-blue-500 font-bold mt-1">98% Success rate</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h3 className="font-bold text-[var(--text-primary)]">Daftar Delivery Order Aktif</h3>
            <button className="text-xs font-bold text-blue-500 hover:underline">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Nomor DO</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Mahasiswa</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Progress</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Status</th>
                <th className="px-6 py-4 text-[var(--text-secondary)] font-semibold">Estimasi Tiba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {doList.map((item, idx) => (
                <tr key={item.no} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-blue-500 font-bold">{item.no}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-[var(--text-primary)]">{item.mahasiswa}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className={cn(
                            "h-full rounded-full",
                            item.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                          )}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        item.status === 'Diterima' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                        {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--text-secondary)]">{item.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
