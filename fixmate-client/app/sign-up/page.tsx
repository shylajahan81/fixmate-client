'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest, getDashboardPath, getSession, saveSession } from '../lib/api';
import { AuthSession } from '../../types/fixmate';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const existing = getSession();
    if (existing?.user) {
      router.replace(getDashboardPath(existing.user.role));
    }
  }, [router]);

  const passwordErrors: string[] = [];
  if (password.length > 0 && password.length < 6) {
    passwordErrors.push('Password must be at least 6 characters long.');
  }
  if (password.length > 0 && !/[A-Z]/.test(password)) {
    passwordErrors.push('Password must include at least one uppercase letter.');
  }
  if (password.length > 0 && !/[a-z]/.test(password)) {
    passwordErrors.push('Password must include at least one lowercase letter.');
  }

  const isPasswordValid =
    password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Full name and email are required');
      return;
    }
    if (!isPasswordValid) {
      setErrorMsg('Please fix the password requirements first');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest<AuthSession>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });
      saveSession(data);
      router.replace(getDashboardPath(data.user.role));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-14 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create Your Account</h1>
        <p className="text-sm text-slate-600 mt-1">
          Sign up as a customer to book repairs or as a technician to offer
          services.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>

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
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
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
              placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
            />
            {passwordErrors.length > 0 && (
              <ul className="mt-1.5 space-y-1 text-xs text-rose-600">
                {passwordErrors.map((errItem) => (
                  <li key={errItem}>• {errItem}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-2">
              Select Role
            </span>
            <div className="grid grid-cols-2 gap-3">
              {(['customer', 'technician'] as const).map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-medium capitalize ${role === item
                    ? 'border-teal-700 bg-teal-50 text-teal-900'
                    : 'border-slate-200 text-slate-700'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={item}
                    checked={role === item}
                    onChange={() => setRole(item)}
                    className="accent-teal-700"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 disabled:opacity-60"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-semibold text-teal-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}