import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Lock, Mail, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { dataPengguna } from '../data';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalType, setModalType] = useState<'forgot' | 'register' | null>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = dataPengguna.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('email/password yang anda masukkan salah');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md text-[var(--text-secondary)] transition-all hover:scale-110"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-[var(--bg-secondary)] rounded-[24px] shadow-2xl overflow-hidden p-6 sm:p-10 border border-[var(--border)]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white tracking-tighter">UT</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Selamat Datang</h1>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">Sistem Informasi Bahan Ajar SITTA UT</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ut.ac.id"
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[var(--text-primary)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[var(--text-primary)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98]"
            >
              Masuk ke Sistem
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-xs">
            <button
              onClick={() => setModalType('forgot')}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Lupa Password?
            </button>
            <button
              onClick={() => setModalType('register')}
              className="text-blue-500 font-bold hover:underline"
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal Box */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full relative"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                {modalType === 'forgot' ? 'Lupa Password' : 'Daftar Akun'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {modalType === 'forgot' 
                  ? 'Silakan hubungi administrator IT Universitas Terbuka untuk mengatur ulang kata sandi Anda.' 
                  : 'Pendaftaran akun baru hanya dapat dilakukan melalui surat resmi dari Kepala UT-Daerah.'}
              </p>
              <button
                onClick={() => setModalType(null)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
