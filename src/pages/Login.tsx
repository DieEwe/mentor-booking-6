
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/events");
    } catch (err) {
      setError(language === "en" ? "Invalid credentials" : "Ungültige Anmeldedaten");
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
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={language === "en" ? "Password" : "Passwort"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <Button type="submit" className="w-full">
            {language === "en" ? "Sign in" : "Anmelden"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
