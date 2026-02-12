import { useState, useActionState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useThemeSafe } from "../contexts/ThemeContext";

interface ForgotPasswordProps {
  onBack: () => void;
}

interface ForgotPasswordState {
  error?: string;
  submitted?: boolean;
  email?: string;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const { isBrutalist } = useThemeSafe();

  const [state, submitAction, isPending] = useActionState(
    async (
      _prevState: ForgotPasswordState | null,
      formData: FormData
    ): Promise<ForgotPasswordState> => {
      const emailValue = formData.get("email") as string;

      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          emailValue,
          {
            redirectTo: `${window.location.origin}`,
          }
        );

        if (resetError) throw resetError;
        return { submitted: true, email: emailValue };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Failed to send reset email",
        };
      }
    },
    null
  );

  const submitted = state?.submitted ?? false;

  if (submitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
        <div className="w-full max-w-md">
          <div className={`p-8 text-center ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-2xl shadow-xl"}`}>
            <div className="flex justify-center mb-6">
              <CheckCircle className={`w-16 h-16 ${isBrutalist ? "text-[hsl(var(--brutalist-green))]" : "text-green-600 dark:text-green-500"}`} />
            </div>

            <h1 className={`text-2xl font-bold mb-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
              Check your email
            </h1>
            <p className={`mb-6 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
              We've sent a password reset link to{" "}
              <strong>{state?.email || email}</strong>. Click the link in the
              email to set a new password.
            </p>

            <p className={`text-sm mb-6 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-500 dark:text-slate-400"}`}>
              Didn't receive it? Check your spam folder or try again.
            </p>

            <button
              onClick={onBack}
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

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
      <div className="w-full max-w-md">
        <div className={`p-8 ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-2xl shadow-xl"}`}>
          <button
            onClick={onBack}
            className={`flex items-center gap-2 transition mb-6 text-sm font-medium ${isBrutalist ? "text-[hsl(var(--brutalist-cyan))] hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className={`text-3xl font-bold mb-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
            Reset password
          </h1>
          <p className={`mb-8 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
            Enter your email and we'll send you a link to reset your password.
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
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
