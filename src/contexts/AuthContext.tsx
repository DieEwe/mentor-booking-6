import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isFirstLogin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // Set up auth state
    const initAuth = async () => {
      setLoading(true);
      
      // Add a safety timeout to prevent infinite loading
      const safetyTimeout = setTimeout(() => {
        console.log("Auth safety timeout triggered");
        setLoading(false);
      }, 5000); // 5 second max loading time
      
      try {
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          await fetchUserData(session);

          // Comment out the first login check
          /*
          // Check if this is first login
          const { data } = await supabase
            .from('mentorbooking_profile_extensions')
            .select('first_login_completed')
            .eq('user_id', session.user.id)
            .single();
          
          if (!data || data.first_login_completed === false) {
            setIsFirstLogin(true);
            
            // Create profile extension if it doesn't exist
            if (!data) {
              await supabase.from('mentorbooking_profile_extensions').insert({
                user_id: session.user.id,
                first_login_completed: false
              });
            }
          }
          */
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        clearTimeout(safetyTimeout);
        setLoading(false);
      }
    };

    initAuth();
    
    // Set up auth changes listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        if (session) {
          await fetchUserData(session);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data from your existing tables
  const fetchUserData = async (session: Session) => {
    try {
      console.log("Fetching user data for:", session.user.id);
      
      // Get profile data with timeout safety
      const fetchPromise = Promise.all([
        // Get user profile - change to singular 'user_profile' with correct field
        supabase
          .from('user_profile') // Not 'user_profiles'
          .select('user_id, Username') // Not 'username'
          .eq('user_id', session.user.id) // Use 'user_id', not 'id'
          .single(),
          
        // Get role data - update field names
        supabase
          .from('user_roles')
          .select('user_id, role_id')
          .eq('user_id', session.user.id)
          .single(),
          
        // Get profile extensions
        supabase
          .from('mentorbooking_profile_extensions')
          .select('*')
          .eq('user_id', session.user.id)
          .single(),
          
        // Get employer data (optional)
        supabase
          .from('employers')
          .select('name')
          .eq('user_id', session.user.id)
          .single()
      ]);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Fetching user data timed out")), 10000); // Increase from 3s to 10s
      });
      
      let results;
      try {
        // Use Promise.race correctly - it returns the first settled promise
        const winner = await Promise.race([
          fetchPromise.then(data => ({ type: 'data', data })),
          timeoutPromise.then(data => ({ type: 'timeout', data }))
        ]);
        
        if (winner.type === 'timeout') {
          throw new Error("Fetching user data timed out");
        }
        
        results = winner.data;
      } catch (error) {
        console.error("Error in data fetching race:", error);
        throw error;
      }
      
      const [profileResult, roleResult, extensionResult, employerResult] = results;
      
      const profileData = profileResult?.data;
      const roleData = roleResult?.data;
      const extensionData = extensionResult?.data;
      const employerData = employerResult?.data;
      
      console.log("User data fetched:", { profileData, roleData });
      
      // Add better logging:
      console.log("User profile data:", profileData);
      console.log("User role data:", roleData, "Role ID:", roleData?.role_id);
      
      // Extract role safely
      let roleName: UserRole = 'guest';
      
      if (roleData && roleData.role_id) {
        try {
          // Get role name from role_id
          const { data: roleNameData, error: roleNameError } = await supabase
            .from('roles')
            .select('name')
            .eq('id', roleData.role_id)
            .single();
          
          if (roleNameError) throw roleNameError;
          
          if (roleNameData?.name) {
            // Map database role name to your UserRole type
            const roleMap: Record<string, UserRole> = {
              'coach': 'coach',
              'mentor': 'mentor'
            };
            
            roleName = roleMap[roleNameData.name.toLowerCase()] || 'guest';
            console.log("Found role:", roleNameData.name, "→", roleName);
          }
        } catch (roleError) {
          console.error("Error fetching role name:", roleError);
        }
      }
      
      // Build minimal user object even if some data is missing
      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        firstName: profileData?.Username?.split(' ')[0] || '', // Note: Username not username
        lastName: profileData?.Username?.split(' ').slice(1).join(' ') || '',
        role: roleName,
        company: employerData?.name
      };
      
      // Set user state
      setUser(userData);
      console.log("User data set:", userData);
      
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Create minimal user object as fallback
      if (session?.user) {
        const fallbackUser = {
          id: session.user.id,
          email: session.user.email || '',
          firstName: '',
          lastName: '',
          role: 'guest' as UserRole
        };
        
        setUser(fallbackUser);
        console.log("Set fallback user data:", fallbackUser);
        return fallbackUser;
      }
      
      throw error;
    }
  };

  // Update your login function to match the interface
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("AuthContext: Attempting login for", email);
      
      if (!supabase) {
        throw new Error("Supabase client is not initialized");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }
      
      console.log("AuthContext: Login successful", data);
      
      // Set the session state immediately after successful login
      if (data.session) {
        setSession(data.session);
        // Store a simple flag in localStorage as backup
        localStorage.setItem('user_authenticated', 'true');
        // Also fetch user data
        await fetchUserData(data.session);
      }
      
      // Don't return anything
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    isFirstLogin,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
