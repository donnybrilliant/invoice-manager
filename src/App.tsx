import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
import CompanyProfile from "./components/CompanyProfile";
import { CheckCircle, X } from "lucide-react";

type Route = "dashboard" | "company-profile" | "reset-password";

function AppContent() {
  const { user, loading, signupEmail, clearSignupEmail } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<Route>("dashboard");

  useEffect(() => {
    // Check for password recovery token in hash fragment
    // Supabase sends type=recovery in hash fragment when password reset link is clicked
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    
    if (type === "recovery") {
      // Route to reset password page
      // Don't clear hash yet - Supabase needs to process it first
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

  // Show reset password page if in recovery mode (even if user not logged in yet)
  // The recovery session will be established after Supabase processes the hash fragment
  if (currentRoute === "reset-password") {
    return <ResetPassword onSuccess={() => setCurrentRoute("dashboard")} />;
  }

  if (!user) {
    return <Auth />;
  }

  if (currentRoute === "company-profile") {
    return (
      <>
        <CompanyProfile onBack={() => setCurrentRoute("dashboard")} />
        {signupEmail && (
          <SignupConfirmationOverlay email={signupEmail} onClose={clearSignupEmail} />
        )}
      </>
    );
  }

  return (
    <>
      <Dashboard onNavigateToProfile={() => setCurrentRoute("company-profile")} />
      {signupEmail && (
        <SignupConfirmationOverlay email={signupEmail} onClose={clearSignupEmail} />
      )}
    </>
  );
}

function SignupConfirmationOverlay({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Account created!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          We've sent a confirmation email to <strong>{email}</strong>.
          Please check your inbox to verify your account.
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Didn't receive it? Check your spam folder.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium"
        >
          Got it!
        </button>
      </div>
    </div>
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
