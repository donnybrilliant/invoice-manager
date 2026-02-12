import { useEffect, useState, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { queryClient } from "./lib/queryClient";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
import CompanyProfile from "./components/CompanyProfile";
import PublicInvoiceView from "./components/PublicInvoiceView";
import { CheckCircle, X } from "lucide-react";

type Route =
  | "dashboard"
  | "company-profile"
  | "reset-password"
  | "public-invoice";

function AppContent() {
  const { user, loading, signupEmail, clearSignupEmail } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<Route>("dashboard");
  const [publicInvoiceToken, setPublicInvoiceToken] = useState<string | null>(
    null
  );
  const hasPushedStateRef = useRef(false);

  useEffect(() => {
    // Check for public invoice route: /invoice/[token]
    const path = window.location.pathname;
    const invoiceMatch = path.match(/^\/invoice\/(.+)$/);
    if (invoiceMatch) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setPublicInvoiceToken(invoiceMatch[1]);
        setCurrentRoute("public-invoice");
      }, 0);
      return;
    }

    // Check for password recovery token in hash fragment
    // Supabase sends type=recovery in hash fragment when password reset link is clicked
    const checkHash = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");

      if (type === "recovery") {
        // Route to reset password page
        // Don't clear hash yet - Supabase needs to process it first
        setCurrentRoute("reset-password");
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes (when user clicks password reset link while app is already open)
    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  // Handle browser back button for company profile
  useEffect(() => {
    const handlePopState = () => {
      // When back button is pressed on company profile, go back to dashboard
      if (currentRoute === "company-profile") {
        setCurrentRoute("dashboard");
        hasPushedStateRef.current = false;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentRoute]);

  // Push history state when navigating to company profile (only once per navigation)
  useEffect(() => {
    if (currentRoute === "company-profile" && !hasPushedStateRef.current) {
      window.history.pushState(
        { route: "company-profile" },
        "",
        window.location.href
      );
      hasPushedStateRef.current = true;
    } else if (currentRoute !== "company-profile") {
      hasPushedStateRef.current = false;
    }
  }, [currentRoute]);

  // Show public invoice view (no auth required) - check BEFORE loading/auth checks
  if (currentRoute === "public-invoice" && publicInvoiceToken) {
    return <PublicInvoiceView token={publicInvoiceToken} />;
  }

  // Show reset password page if in recovery mode (even if user not logged in yet)
  // The recovery session will be established after Supabase processes the hash fragment
  // Check BEFORE loading/auth checks since it doesn't require authentication
  if (currentRoute === "reset-password") {
    return <ResetPassword onSuccess={() => setCurrentRoute("dashboard")} />;
  }

  // Only show loading screen for authenticated routes
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

  if (currentRoute === "company-profile") {
    return (
      <>
        <CompanyProfile onBack={() => setCurrentRoute("dashboard")} />
        {signupEmail && (
          <SignupConfirmationOverlay
            email={signupEmail}
            onClose={clearSignupEmail}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dashboard
        onNavigateToProfile={() => setCurrentRoute("company-profile")}
      />
      {signupEmail && (
        <SignupConfirmationOverlay
          email={signupEmail}
          onClose={clearSignupEmail}
        />
      )}
    </>
  );
}

function SignupConfirmationOverlay({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) {
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
          We've sent a confirmation email to <strong>{email}</strong>. Please
          check your inbox to verify your account.
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
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <LocaleProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </LocaleProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
