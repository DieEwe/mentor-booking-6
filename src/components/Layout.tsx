
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { Calendar, Users, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Users, label: 'Events', href: '/events' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent className="flex flex-col gap-4">
            <nav className="grid gap-1 px-2">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-zinc-900 dark:text-zinc-50 dark:hover:text-zinc-50"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </nav>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <Navbar />
          <main className="container py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
