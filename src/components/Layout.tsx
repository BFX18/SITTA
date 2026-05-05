import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home,
  Package, 
  Truck, 
  FileBox, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [greeting, setGreeting] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<{ nama: string; lokasi: string } | null>(null);
  const [openMenus, setOpenMenus] = useState<string[]>(['Laporan']);

  useEffect(() => {
    // Close sidebar on location change for mobile
    setIsSidebarOpen(false);
    
    // Set greeting and user data
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Pagi');
    else if (hour >= 12 && hour < 15) setGreeting('Siang');
    else if (hour >= 15 && hour < 19) setGreeting('Sore');
    else setGreeting('Malam');

    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, [location.pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title) 
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { title: 'Beranda', path: '/dashboard', icon: Home },
    { title: 'Monitoring DO', path: '/monitoring-do', icon: LayoutDashboard },
    { title: 'Informasi Bahan Ajar', path: '/stok', icon: Package },
    { title: 'Tracking Pengiriman', path: '/tracking', icon: Truck },
    { 
      title: 'Laporan', 
      path: '#', 
      icon: FileBox, 
      subItems: [
        { title: 'Monitoring DO', path: '/monitoring-do' },
        { title: 'Rekap Bahan Ajar', path: '/rekap-stok' }
      ] 
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[var(--bg-secondary)] border-r border-[var(--border)] p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-lg shadow-md transition-transform group-hover:rotate-12" />
          <span className="text-xl font-extrabold text-[var(--text-primary)] tracking-tighter">SITTA UT</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.title} className="flex flex-col gap-1">
              {item.subItems ? (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm w-full text-left",
                    openMenus.includes(item.title)
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight size={14} className={cn("transition-transform", openMenus.includes(item.title) && "rotate-90")} />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                    location.pathname === item.path 
                      ? "bg-blue-500/10 text-blue-500 shadow-sm" 
                      : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              )}
              
              <AnimatePresence>
                {item.subItems && openMenus.includes(item.title) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-9 flex flex-col gap-1 border-l border-[var(--border)] pl-4 overflow-hidden"
                  >
                    {item.subItems.map(sub => (
                      <Link
                        key={sub.title}
                        to={sub.path}
                        className={cn(
                          "text-xs py-2 transition-colors",
                          location.pathname === sub.path
                            ? "text-blue-500 font-bold"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-white/5 dark:bg-black/20 rounded-2xl border border-[var(--border)]">
          <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mb-1 italic">{userData?.lokasi || 'Admin UT-Daerah'}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{userData?.nama || 'Pengguna SITTA'}</div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={14} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex h-20 md:h-24 items-center justify-between px-4 md:px-10">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-[var(--text-primary)]">Selamat {greeting}, {userData?.nama?.split(' ')[0] || 'Admin'}</h1>
            <p className="text-[10px] md:text-sm text-[var(--text-secondary)]">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • SITTA</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/dashboard"
              className="p-2 md:p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-blue-500 transition-all"
              title="Beranda"
            >
              <Home size={18} className="md:w-5 md:h-5" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              {theme === 'light' ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
            </button>
            <div className="lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 md:p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              >
                <Menu size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 md:px-10 pb-10 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-50 p-6 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-blue-900">UT</div>
                  <h1 className="font-bold text-slate-900 dark:text-white">SITTA UT</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.title}>
                    {item.subItems ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-4 rounded-xl text-slate-600 dark:text-slate-400 font-bold",
                            openMenus.includes(item.title) && "text-blue-500"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={22} />
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight size={18} className={cn("transition-transform", openMenus.includes(item.title) && "rotate-90")} />
                        </button>
                        <AnimatePresence>
                          {openMenus.includes(item.title) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-10 flex flex-col gap-2 border-l border-slate-200 dark:border-slate-800 pl-4"
                            >
                              {item.subItems.map(sub => (
                                <Link
                                  key={sub.title}
                                  to={sub.path}
                                  className={cn(
                                    "py-2 text-sm font-bold",
                                    location.pathname === sub.path ? "text-blue-400" : "text-slate-500"
                                  )}
                                >
                                  {sub.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-4 rounded-xl transition-all",
                          location.pathname === item.path 
                            ? "bg-blue-600 text-white shadow-lg" 
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      >
                        <item.icon size={22} />
                        <span className="font-bold">{item.title}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-4 py-4 w-full rounded-xl text-red-500 font-bold"
              >
                <LogOut size={22} />
                <span>Keluar</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
