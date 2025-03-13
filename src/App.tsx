
import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import Login from "./pages/Login"
import Events from "./pages/Events"
import Calendar from "./pages/Calendar"
import EventList from "./pages/List" // Updated import to use the new component name
import EventDetail from "./pages/EventDetail" // Import the new EventDetail page
import Profile from "./pages/Profile"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/list" element={<EventList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/" element={<Navigate to="/events" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
