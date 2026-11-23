'use client';

import { useEffect, useState } from 'react';

interface AdminUser {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${baseUrl}/api/admin/users`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(Array.isArray(data) ? data : data.users || []);
                }
            } catch {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Users</h1>

            {loading ? (
                <p className="text-sm text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
                <div className="rounded border p-6 text-sm text-gray-500">
                    No users found yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => (
                                <tr key={u._id || u.id || idx} className="border-b">
                                    <td className="p-3">{u.name || '-'}</td>
                                    <td className="p-3">{u.email || '-'}</td>
                                    <td className="p-3">{u.role || 'user'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}