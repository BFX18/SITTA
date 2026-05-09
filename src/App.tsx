/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TrackingPage from './pages/TrackingPage';
import StokPage from './pages/StokPage';
import MonitoringDOPage from './pages/MonitoringDOPage';
import RekapBahanAjarPage from './pages/RekapBahanAjarPage';
import RiwayatTransaksiPage from './pages/RiwayatTransaksiPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stok"
            element={
              <ProtectedRoute>
                <StokPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitoring-do"
            element={
              <ProtectedRoute>
                <MonitoringDOPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/riwayat-transaksi"
            element={
              <ProtectedRoute>
                <RiwayatTransaksiPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rekap-stok"
            element={
              <ProtectedRoute>
                <RekapBahanAjarPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
