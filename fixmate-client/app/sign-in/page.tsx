'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest, getDashboardPath, getSession, saveSession } from '../lib/api';
import { AuthSession } from '../../types/fixmate';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const existing = getSession();
    if (existing?.user) {
      router.replace(redirectTo || getDashboardPath(existing.user.role));
    }
  }, [router, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest<AuthSession>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      saveSession(data);
      router.replace(redirectTo || getDashboardPath(data.user.role));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-14 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign In to FixMate</h1>
        <p className="text-sm text-slate-600 mt-1">
          Access your customer, technician, or admin workspace.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 disabled:opacity-60"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="font-semibold text-teal-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}