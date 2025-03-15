import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  console.log("Protected route check:", { 
    user: user?.email, 
    loading,
    timestamp: new Date().toISOString()
  });
  
  // Maximum 3-second loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <div>Loading authentication...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log("No authenticated user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
