import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError(language === "en" ? "Email and password are required" : "E-Mail und Passwort sind erforderlich");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Login attempt:", email);
      await login(email, password);
      
      // Force navigation after login
      console.log("Login successful, navigating to events");
      window.location.href = "/events"; // Use direct browser navigation for reliability
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || (language === "en" ? "Login failed" : "Anmeldung fehlgeschlagen"));
      setIsLoading(false); // Only reset loading on error
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            {language === "en" ? "Welcome back" : "Willkommen zurück"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Enter your credentials to continue"
              : "Geben Sie Ihre Anmeldedaten ein"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={language === "en" ? "Email" : "E-Mail"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={language === "en" ? "Password" : "Passwort"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Signing in..." : "Anmelden..."}
              </>
            ) : (
              language === "en" ? "Sign in" : "Anmelden"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
