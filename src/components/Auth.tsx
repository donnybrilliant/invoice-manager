import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, CheckCircle } from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const { signIn, signUp, clearSignupEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const result = await signUp(email, password);
        // Always show confirmation message after signup
        // Supabase sends a welcome/confirmation email regardless of confirmation settings
        setSignupEmail(result.email);
        setShowSignupConfirmation(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (resetMode) {
    return <ResetPassword onSuccess={() => setResetMode(false)} />;
  }

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  if (showSignupConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-500" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Account created!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We've sent a confirmation email to <strong>{signupEmail}</strong>.
              Please check your inbox to verify your account.
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Didn't receive it? Check your spam folder or try signing up again.
            </p>

            <button
              onClick={() => {
                setShowSignupConfirmation(false);
                setEmail("");
                setPassword("");
                setIsLogin(true);
                // Clear the context's signupEmail to prevent overlay from showing again
                clearSignupEmail();
              }}
              className="w-full px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-900 dark:bg-slate-700 p-3 rounded-xl">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
            Invoice Manager
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            {isLogin && (
              <button
                onClick={() => setShowForgotPassword(true)}
                className="block w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition"
              >
                Forgot password?
              </button>
            )}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="block w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
