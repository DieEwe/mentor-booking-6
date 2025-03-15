import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import FirstLoginModal from './components/FirstLoginModal';
import { Toaster } from "@/components/ui/sonner"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthDebug } from './components/AuthDebug';

// Import your pages
import EventList from "./pages/List"
import Login from "./pages/Login";
import Events from "./pages/Events"
import Calendar from "./pages/Calendar"
import EventDetail from "./pages/EventDetail"
import Profile from "./pages/Profile"

const queryClient = new QueryClient();

// Wrap app content
const AppContent = () => {
  const { isFirstLogin } = useAuth();
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  
  // Comment out this effect
  /*
  useEffect(() => {
    if (isFirstLogin) {
      setShowFirstLoginModal(true);
    }
  }, [isFirstLogin]);
  */

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/list" element={<EventList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/" element={<Navigate to="/events" replace />} />
          </Route>
        </Routes>
      </Router>
      
      {/* Comment out the modal component */}
      {/*
      <FirstLoginModal 
        isOpen={showFirstLoginModal}
        onComplete={() => setShowFirstLoginModal(false)}
      />
      */}
      <Toaster />
      {import.meta.env.DEV && <AuthDebug />}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
