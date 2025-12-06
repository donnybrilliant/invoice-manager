import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ResetPasswordProps {
  onSuccess: () => void;
}

export default function ResetPassword({ onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    let mounted = true;

    const validateRecoverySession = async () => {
      // Supabase automatically processes the recovery token from the hash fragment
      // We need to wait a moment for it to process, then check for a session

      // First, check if we have a recovery token in the hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");

      if (type === "recovery") {
        // Give Supabase a moment to process the recovery token
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check for valid session after token processing
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (mounted) {
          if (!session || error) {
            setValidToken(false);
          } else {
            // Clear hash from URL for security (tokens are now in session)
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      } else {
        // No recovery token in hash, check if we have an existing session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setValidToken(!!session);
        }
      }
    };

    validateRecoverySession();

    // Listen for auth state changes to catch PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY") {
        // Valid recovery session detected
        setValidToken(true);
        // Clear hash from URL
        window.history.replaceState(null, "", window.location.pathname);
      } else if (
        event === "SIGNED_OUT" ||
        (!session && event !== "TOKEN_REFRESHED")
      ) {
        // Session invalid or expired
        setValidToken(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Invalid or expired link
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              This password reset link has expired or is invalid. Please request
              a new one.
            </p>
            <button
              onClick={onSuccess}
              className="w-full px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-500" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Password reset successful
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your password has been updated. You can now sign in with your new
              password.
            </p>

            <button
              onClick={onSuccess}
              className="w-full px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium"
            >
              Sign In
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Set new password
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                New Password
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
