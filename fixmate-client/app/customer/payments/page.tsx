'use client';

import { useEffect, useState } from 'react';

interface PaymentRecord {
  _id?: string;
  id?: string;
  serviceTitle?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${baseUrl}/api/customer/payments`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setPayments(Array.isArray(data) ? data : data.payments || []);
        }
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Payments</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading payments...</p>
      ) : payments.length === 0 ? (
        <div className="rounded border p-6 text-sm text-gray-500">
          No payments found yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">Service</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, idx) => (
                <tr key={item._id || item.id || idx} className="border-b">
                  <td className="p-3">{item.serviceTitle || 'Service'}</td>
                  <td className="p-3">{item.amount ?? '-'}</td>
                  <td className="p-3">{item.status || 'paid'}</td>
                  <td className="p-3">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}