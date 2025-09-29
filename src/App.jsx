import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// Code Splitting: importiamo le pagine dinamicamente
const AuthPage = lazy(() => import('./auth/pages/AuthPage'));
const ChampionshipListPage = lazy(() => import('./pages/ChampionshipListPage'));
const CreateChampionshipPage = lazy(() => import('./pages/CreateChampionshipPage'));
const ImportPlayersPage = lazy(() => import('./pages/ImportPlayersPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AddPlayersPage = lazy(() => import('./pages/AddPlayersPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const CreateTeamPage = lazy(() => import('./pages/CreateTeamPage'));
const JoinPage = lazy(() => import('./pages/JoinPage')); // Importa la nuova pagina
const UserProfilePage = lazy(() => import('./pages/UserProfilePage')); // Importa la pagina profilo
const ResetPasswordPage = lazy(() => import('./auth/pages/ResetPasswordPage')); // Importa la pagina di reset della password
const ConfirmEmailPage = lazy(() => import('./auth/pages/ConfirmEmailPage'));
const PrivacyPolicyPage = lazy(() => import ('./pages/PrivacyPolicyPage'));
// SetFormationPage è già caricato dinamicamente tramite modale, quindi non è necessario qui.

// Componente PrivateRoute per proteggere le route
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Caricamento...</p>; // Puoi aggiungere uno spinner qui per un'esperienza migliore
  }

  // Se l'utente non è autenticato, reindirizza alla pagina di autenticazione
  // Usiamo 'AuthPage' come rotta base per l'autenticazione, come nel tuo schema
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Componente Layout per le pagine protette che include l'Header
const ProtectedLayout = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Navbar />
      <Suspense fallback={<div className="loading-container"><div className="loading-spinner"></div></div>}>
        <Routes>
          {/* Rotta per Login/Registrazione. La root "/" reindirizza a "/auth" se non specificato */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/auth" replace />} /> {/* La root reindirizza sempre a /auth */}
          <Route path="/join" element={<JoinPage />} /> {/* Nuova rotta per gli inviti */}
          <Route path="/reset-password" element={<ResetPasswordPage />} /> {/* Nuova rotta per il reset della password */}
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          {/* Rotte protette, accessibili solo se autenticati */}
          {/* Usiamo ProtectedLayout per avvolgere le rotte che devono avere l'Header */}
          <Route
            path="/championships"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <ChampionshipListPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/championships/:championshipId/dashboard"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/championships/:championshipId/calendar"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <CalendarPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/create-championship"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <CreateChampionshipPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/championships/:championshipId/import-players"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <ImportPlayersPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/championships/:championshipId/add-players"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <AddPlayersPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/championships/:championshipId/create-team"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <CreateTeamPage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <UserProfilePage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />


          {/* Rotta per qualsiasi URL non riconosciuto */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
