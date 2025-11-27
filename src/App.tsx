import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadContract from './pages/UploadContract';
import Overview from './pages/Overview';
import Contracts from './pages/Contracts';
import Incidents from './pages/Incidents';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Landing from './pages/Landing';
import RequireAuth from './components/RequireAuth';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-right" theme="dark" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Redirects for legacy routes */}
        <Route path="/upload" element={<Navigate to="/dashboard/upload" replace />} />
        <Route path="/contracts" element={<Navigate to="/dashboard/contracts" replace />} />
        <Route path="/incidents" element={<Navigate to="/dashboard/incidents" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Overview />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/upload"
          element={
            <RequireAuth>
              <UploadContract />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/contracts"
          element={
            <RequireAuth>
              <Contracts />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/incidents"
          element={
            <RequireAuth>
              <Incidents />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
