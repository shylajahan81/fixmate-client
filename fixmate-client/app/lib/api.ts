import { AuthSession } from '../../types/fixmate';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const SESSION_KEY = 'fixmate_session';

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('fixmate-auth-change'));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('fixmate-auth-change'));
}

export function getDashboardPath(role?: string): string {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'technician') return '/dashboard/technician';
  return '/dashboard/customer';
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (payload as { message?: string }).message || 'Something went wrong'
    );
  }

  return payload as T;
}

export async function uploadImageToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) {
    throw new Error('ImgBB API key is missing in .env.local');
  }

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.success || !data.data?.display_url) {
    throw new Error('Failed to upload image to ImgBB');
  }

  return data.data.display_url as string;
}