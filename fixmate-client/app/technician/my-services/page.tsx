'use client';

import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../../lib/api';
import { ServiceItem } from '../../../types/fixmate';

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

export default function MyServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [editTarget, setEditTarget] = useState<ServiceItem | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editMode, setEditMode] = useState<'Home Visit' | 'Shop Drop-off'>(
    'Home Visit'
  );
  const [editArea, setEditArea] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<ServiceItem[]>('/api/services/technician/mine');
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openEditModal = (srv: ServiceItem) => {
    setEditTarget(srv);
    setEditTitle(srv.title);
    setEditCategory(srv.category);
    setEditPrice(String(srv.basePrice));
    setEditDuration(srv.estimatedDuration);
    setEditMode(
      srv.serviceMode === 'Shop Drop-off' ? 'Shop Drop-off' : 'Home Visit'
    );
    setEditArea(srv.serviceArea);
    setEditDescription(srv.description);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    try {
      await apiRequest(`/api/services/${editTarget._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory,
          basePrice: Number(editPrice),
          estimatedDuration: editDuration.trim(),
          serviceMode: editMode,
          serviceArea: editArea.trim(),
          description: editDescription.trim(),
        }),
      });
      toast.success('Service updated (status reset to pending)');
      setEditTarget(null);
      loadServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleToggleAvailability = async (srv: ServiceItem) => {
    try {
      await apiRequest(`/api/services/${srv._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: !srv.isAvailable }),
      });
      toast.success('Availability updated');
      loadServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Toggle failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiRequest(`/api/services/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      toast.success('Service deleted');
      setDeleteTarget(null);
      loadServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Services</h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading your services...</p>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
          You haven&apos;t added any repair services yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-600">
              <tr>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Approval</th>
                <th className="p-3.5">Available</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr
                  key={srv._id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                      <span className="font-medium text-slate-900">
                        {srv.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-700">{srv.category}</td>
                  <td className="p-3.5 font-semibold">${srv.basePrice}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${srv.approvalStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : srv.approvalStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                      {srv.approvalStatus || 'pending'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(srv)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${srv.isAvailable !== false
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-200 text-slate-700'
                        }`}
                    >
                      {srv.isAvailable !== false ? 'Available' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-3.5 space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(srv)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(srv)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">Edit Service</h2>
            <p className="text-xs text-amber-700 mt-1">
              Editing will set approval status back to pending.
            </p>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
                <select
                  value={editMode}
                  onChange={(e) =>
                    setEditMode(
                      e.target.value as 'Home Visit' | 'Shop Drop-off'
                    )
                  }
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
              </div>
              <input
                type="text"
                required
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 rounded-xl border text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">Delete Service?</h2>
            <p className="text-sm text-slate-600 mt-2">
              Delete <strong>{deleteTarget.title}</strong> permanently?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}