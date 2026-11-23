'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  apiRequest,
  getSession,
  saveSession,
  uploadImageToImgBB,
} from '../../lib/api';
import { UserProfile } from '../../../types/fixmate';

export default function UpdateProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setRole(session.user.role || '');
      setPhone(session.user.phone || '');
      setArea(session.user.area || '');
      setBio(session.user.bio || '');
      setImage(session.user.image || '');
    }
  }, []);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setImage(url);
      toast.success('Photo uploaded to ImgBB');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiRequest<{ user: UserProfile }>('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          bio: bio.trim(),
          image,
        }),
      });

      const current = getSession();
      if (current && res?.user) {
        saveSession({
          ...current,
          user: { ...current.user, ...res.user },
        });
      }
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Update Profile</h1>
      <p className="text-sm text-slate-600 mt-1">
        Keep your contact details, service area, bio, and profile photo up to
        date.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={
              image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || 'User'
              )}&background=0f766e&color=fff`
            }
            alt={name || 'Profile'}
            className="w-16 h-16 rounded-full object-cover border border-slate-200"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Profile Photo (ImgBB Upload)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-xs text-slate-600"
            />
            {uploading && (
              <p className="text-xs text-teal-700 mt-1">Uploading photo...</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full border border-slate-200 bg-slate-100 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Role (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={role}
              className="w-full border border-slate-200 bg-slate-100 rounded-xl px-3.5 py-2 text-sm capitalize"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            City / Area
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Mirpur, Dhaka"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Short Bio (Skills &amp; Experience)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers or technicians a bit about your background..."
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}