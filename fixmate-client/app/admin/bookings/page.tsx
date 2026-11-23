'use client';

import { useEffect, useState } from 'react';

interface AdminBooking {
    _id?: string;
    id?: string;
    serviceTitle?: string;
    customerName?: string;
    technicianName?: string;
    status?: string;
    amount?: number;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${baseUrl}/api/admin/bookings`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(Array.isArray(data) ? data : data.bookings || []);
                }
            } catch {
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">All Bookings</h1>

            {loading ? (
                <p className="text-sm text-gray-500">Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <div className="rounded border p-6 text-sm text-gray-500">
                    No bookings found yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3">Service</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Technician</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((item, idx) => (
                                <tr key={item._id || item.id || idx} className="border-b">
                                    <td className="p-3">{item.serviceTitle || 'Service'}</td>
                                    <td className="p-3">{item.customerName || '-'}</td>
                                    <td className="p-3">{item.technicianName || '-'}</td>
                                    <td className="p-3">{item.status || 'pending'}</td>
                                    <td className="p-3">{item.amount ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}