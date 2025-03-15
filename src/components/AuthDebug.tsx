import { useAuth } from '../contexts/AuthContext';

export const AuthDebug = () => {
  const { user, session, loading } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded max-w-sm z-50 text-xs">
      <h3 className="font-bold mb-2">Auth Debug Panel</h3>
      <div>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user ? `${user.email} (${user.role})` : 'Not logged in'}</p>
        <p>Session: {session ? 'Active' : 'None'}</p>
        <p>Timestamp: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};