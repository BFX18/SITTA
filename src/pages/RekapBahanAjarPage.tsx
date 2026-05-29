import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FileText, Download, Filter, BarChart3 } from 'lucide-react';
import { dataBahanAjar } from '../data';

export default function RekapBahanAjarPage() {
  const chartData = dataBahanAjar.map(item => ({
    name: item.kode,
    stok: item.qty ?? 0
  }));

  const pieData = [
    { name: 'Tersedia', value: 3, color: '#3b82f6' },
    { name: 'Menipis', value: 2, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Rekap Bahan Ajar</h2>
          <p className="text-sm text-[var(--text-secondary)]">Laporan ringkasan inventaris dan stok</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all">
          <Download size={14} />
          Unduh PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-secondary)] p-4 md:p-8 rounded-2xl border border-[var(--border)] overflow-hidden">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" />
            Distribusi Stok Per Modul
          </h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                />
                <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar dataKey="stok" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] p-4 md:p-8 rounded-2xl border border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" />
            Kondisi Inventaris
          </h3>
          <div className="h-48 md:h-64 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            <div className="w-full h-full md:w-3/4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f8fafc',
                      zIndex: 50
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-row md:flex-col flex-wrap justify-center gap-4 md:gap-3 md:ml-4">
                {pieData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] md:text-xs font-bold text-[var(--text-secondary)] whitespace-nowrap">{item.name} ({item.value})</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] p-4 md:p-6 rounded-2xl border border-[var(--border)]">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold text-[var(--text-primary)]">Ringkasan Tabular</h3>
             <button className="text-[10px] font-bold text-[var(--text-secondary)] flex items-center gap-1">
                 <Filter size={12} />
                 Filter
             </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] md:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1 italic">Total SKU</div>
                  <div className="text-sm md:text-xl font-black text-[var(--text-primary)]">42 Modul</div>
              </div>
              <div className="p-3 md:p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] md:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1 italic">Voucher DO</div>
                  <div className="text-sm md:text-xl font-black text-[var(--text-primary)]">156 Record</div>
              </div>
              <div className="p-3 md:p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] md:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1 italic">Value Stock</div>
                  <div className="text-sm md:text-xl font-black text-blue-500">Rp 4.2M</div>
              </div>
              <div className="p-3 md:p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] md:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1 italic">Coverage</div>
                  <div className="text-sm md:text-xl font-black text-[var(--text-primary)]">38 UPBJJ</div>
              </div>
          </div>
      </div>
    </div>
  );
}
