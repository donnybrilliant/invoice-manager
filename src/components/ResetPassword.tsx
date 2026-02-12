import { useState, useEffect, useActionState } from "react";
import { CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useThemeSafe } from "../contexts/ThemeContext";

interface ResetPasswordProps {
  onSuccess: () => void;
}

interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

export default function ResetPassword({ onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validToken, setValidToken] = useState(true);
  const { isBrutalist } = useThemeSafe();

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

  const [state, submitAction, isPending] = useActionState(
    async (
      _prevState: ResetPasswordState | null,
      formData: FormData
    ): Promise<ResetPasswordState> => {
      const passwordValue = formData.get("password") as string;
      const confirmPasswordValue = formData.get("confirmPassword") as string;

      if (passwordValue !== confirmPasswordValue) {
        return { error: "Passwords do not match" };
      }

      if (passwordValue.length < 6) {
        return { error: "Password must be at least 6 characters" };
      }

      try {
        const { error: updateError } = await supabase.auth.updateUser({
          password: passwordValue,
        });

        if (updateError) throw updateError;
        return { success: true };
      } catch (err) {
        return {
          error:
            err instanceof Error ? err.message : "Failed to reset password",
        };
      }
    },
    null
  );

  const success = state?.success ?? false;

  if (!validToken) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
        <div className="w-full max-w-md">
          <div className={`p-8 text-center ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-2xl shadow-xl"}`}>
            <h1 className={`text-2xl font-bold mb-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
              Invalid or expired link
            </h1>
            <p className={`mb-6 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
              This password reset link has expired or is invalid. Please request
              a new one.
            </p>
            <button
              onClick={onSuccess}
              className={`w-full px-4 py-3 font-medium transition ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                  : "bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600"
              }`}
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
      <div className={`min-h-screen flex items-center justify-center p-4 ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
        <div className="w-full max-w-md">
          <div className={`p-8 text-center ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-2xl shadow-xl"}`}>
            <div className="flex justify-center mb-6">
              <CheckCircle className={`w-16 h-16 ${isBrutalist ? "text-[hsl(var(--brutalist-green))]" : "text-green-600 dark:text-green-500"}`} />
            </div>

            <h1 className={`text-2xl font-bold mb-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
              Password reset successful
            </h1>
            <p className={`mb-6 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
              Your password has been updated. You can now sign in with your new
              password.
            </p>

            <button
              onClick={onSuccess}
              className={`w-full px-4 py-3 font-medium transition ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                  : "bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
      <div className="w-full max-w-md">
        <div className={`p-8 ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-2xl shadow-xl"}`}>
          <h1 className={`text-3xl font-bold mb-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
            Set new password
          </h1>
          <p className={`mb-8 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
            Enter a new password for your account.
          </p>

          <form action={submitAction} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${isBrutalist ? "brutalist-text text-[var(--brutalist-fg)]" : "text-slate-700 dark:text-slate-300"}`}
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  isBrutalist
                    ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
                    : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
                }`}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className={`block text-sm font-medium mb-2 ${isBrutalist ? "brutalist-text text-[var(--brutalist-fg)]" : "text-slate-700 dark:text-slate-300"}`}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  isBrutalist
                    ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
                    : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
                }`}
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className={`px-4 py-3 text-sm ${isBrutalist ? "brutalist-border bg-[hsl(var(--brutalist-red))] text-white" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg"}`}>
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text focus:ring-[hsl(var(--brutalist-yellow))]"
                  : "bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 focus:ring-slate-900 dark:focus:ring-slate-500"
              }`}
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
