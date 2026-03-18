import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Nearby from "./pages/Nearby";
import Reports from "./pages/Reports";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import StationDetail from "./pages/StationDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TopBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nearby" element={<Nearby />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/station/:id" element={<StationDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
