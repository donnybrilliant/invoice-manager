import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
import CompanyProfile from "./components/CompanyProfile";

type Route = "dashboard" | "company-profile" | "reset-password";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<Route>("dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    if (params.get("mode") === "reset") {
      setCurrentRoute("reset-password");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (currentRoute === "reset-password") {
    return <ResetPassword onSuccess={() => setCurrentRoute("dashboard")} />;
  }

  if (currentRoute === "company-profile") {
    return <CompanyProfile onBack={() => setCurrentRoute("dashboard")} />;
  }

  return (
    <Dashboard onNavigateToProfile={() => setCurrentRoute("company-profile")} />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
