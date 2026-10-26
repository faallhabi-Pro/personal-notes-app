import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Loading from './Loading';
import StatusMessage from './StatusMessage';

// Hanya untuk pengguna yang sudah login. Otorisasi sebenarnya tetap di server
// (setiap permintaan catatan membawa Bearer token).
function ProtectedRoute() {
  const { user, initializing, sessionError } = useAuth();
  const { t } = useLanguage();

  if (initializing) return <Loading text={t('notes.loading')} />;
  if (!user) {
    if (sessionError) return <StatusMessage type="error">{t('auth.sessionFailed')}</StatusMessage>;
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// Halaman login/registrasi: pengguna yang sudah login dialihkan ke daftar catatan.
function PublicRoute() {
  const { user, initializing } = useAuth();
  const { t } = useLanguage();

  if (initializing) return <Loading text={t('notes.loading')} />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

export { ProtectedRoute, PublicRoute };
