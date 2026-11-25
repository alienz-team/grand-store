"use client";

import { useActionState } from "react";
import { useI18n } from "@/components/preferences";
import { login, type FormState } from "../actions";

export function LoginForm() {
  const { L } = useI18n();
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          {L("البريد الإلكتروني", "Email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          autoFocus
          dir="ltr"
          defaultValue={state.email}
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-error" : undefined}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          {L("كلمة المرور", "Password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          dir="ltr"
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-error" : undefined}
          className="field"
        />
      </div>
      {state.error && (
        <p id="login-error" role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? L("جارٍ الدخول…", "Signing in…") : L("دخول", "Sign in")}
      </button>
    </form>
  );
}
