
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Languages } from "lucide-react";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div>
          <span className="font-semibold">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="ml-2 text-muted-foreground">({user?.role})</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-9 w-9"
          >
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={logout}>
            {language === "en" ? "Logout" : "Abmelden"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
