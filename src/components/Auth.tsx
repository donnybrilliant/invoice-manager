import { useState, useActionState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useThemeSafe } from "../contexts/ThemeContext";
import { LogIn, CheckCircle } from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

interface AuthState {
  error?: string;
  signupEmail?: string;
  showSignupConfirmation?: boolean;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { signIn, signUp, clearSignupEmail } = useAuth();
  const { isBrutalist } = useThemeSafe();

  // Use a ref to track the current isLogin value so the action function always has the latest value
  const isLoginRef = useRef(isLogin);

  useEffect(() => {
    isLoginRef.current = isLogin;
  }, [isLogin]);

  const [state, submitAction, isPending] = useActionState(
    async (
      _prevState: AuthState | null,
      formData: FormData
    ): Promise<AuthState> => {
      const emailValue = formData.get("email") as string;
      const passwordValue = formData.get("password") as string;

      try {
        // Use ref to get the current isLogin value, not the stale closure value
        if (isLoginRef.current) {
          await signIn(emailValue, passwordValue);
          return { error: undefined };
        } else {
          const result = await signUp(emailValue, passwordValue);
          // Always show confirmation message after signup
          // Supabase sends a welcome/confirmation email regardless of confirmation settings
          return {
            error: undefined,
            signupEmail: result.email,
            showSignupConfirmation: true,
          };
        }
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "An error occurred",
        };
      }
    },
    null
  );

  // Track signup confirmation - show when action state indicates, allow dismissal
  const [dismissedSignupEmail, setDismissedSignupEmail] = useState<
    string | null
  >(null);

  // Derive whether to show confirmation from action state and dismissal state
  const showSignupConfirmation =
    !!(state?.showSignupConfirmation && state?.signupEmail) &&
    dismissedSignupEmail !== state?.signupEmail;
  const signupEmail = state?.signupEmail ?? "";

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
                setDismissedSignupEmail(signupEmail);
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
      <div className="w-full max-w-md">
        <div className={`p-8 ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-2xl shadow-xl"}`}>
          <div className="flex items-center justify-center mb-8">
            <div className={isBrutalist ? "brutalist-border bg-[hsl(var(--brutalist-red))] p-3" : "bg-slate-900 dark:bg-slate-700 p-3 rounded-xl"}>
              <LogIn className={`w-8 h-8 ${isBrutalist ? "text-white" : "text-white"}`} />
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-center mb-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
            Invoice Manager
          </h1>
          <p className={`text-center mb-8 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>

          <form action={submitAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${isBrutalist ? "brutalist-text text-[var(--brutalist-fg)]" : "text-slate-700 dark:text-slate-300"}`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  isBrutalist
                    ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
                    : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
                }`}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${isBrutalist ? "brutalist-text text-[var(--brutalist-fg)]" : "text-slate-700 dark:text-slate-300"}`}
              >
                Password
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
              {isPending ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            {isLogin && (
              <button
                onClick={() => setShowForgotPassword(true)}
                className={`block w-full text-sm font-medium transition ${isBrutalist ? "text-[hsl(var(--brutalist-cyan))] hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                Forgot password?
              </button>
            )}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`block w-full text-sm font-medium transition ${isBrutalist ? "text-[hsl(var(--brutalist-cyan))] hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
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
