
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Languages, Menu, Calendar, Users, User, List } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Users, label: language === "en" ? "Events" : "Veranstaltungen", href: "/events" },
    { icon: Calendar, label: language === "en" ? "Calendar" : "Kalender", href: "/calendar" },
    { icon: List, label: language === "en" ? "List" : "Liste", href: "/list" },
    { icon: User, label: language === "en" ? "Profile" : "Profil", href: "/profile" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/User info */}
          <div className="flex items-center">
            <span className="font-semibold text-lg">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="ml-2 text-muted-foreground">({user?.role})</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                  location.pathname === item.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Theme and Language Toggles + Logout */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
              aria-label={language === "en" ? "Switch to German" : "Switch to English"}
            >
              <Languages className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={logout}>
              {language === "en" ? "Logout" : "Abmelden"}
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1 pb-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-4 py-2 rounded-md flex items-center space-x-2 ${
                  location.pathname === item.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4 inline mr-2" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
