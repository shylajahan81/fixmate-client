'use client';

import { useEffect, useState } from 'react';

interface TransactionItem {
    _id?: string;
    id?: string;
    transactionId?: string;
    userName?: string;
    amount?: number;
    status?: string;
    createdAt?: string;
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${baseUrl}/api/admin/transactions`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(
                        Array.isArray(data) ? data : data.transactions || []
                    );
                }
            } catch {
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Transactions</h1>

            {loading ? (
                <p className="text-sm text-gray-500">Loading transactions...</p>
            ) : transactions.length === 0 ? (
                <div className="rounded border p-6 text-sm text-gray-500">
                    No transactions found yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3">Transaction ID</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, idx) => (
                                <tr key={tx._id || tx.id || idx} className="border-b">
                                    <td className="p-3">{tx.transactionId || tx._id || '-'}</td>
                                    <td className="p-3">{tx.userName || '-'}</td>
                                    <td className="p-3">{tx.amount ?? '-'}</td>
                                    <td className="p-3">{tx.status || 'completed'}</td>
                                    <td className="p-3">
                                        {tx.createdAt
                                            ? new Date(tx.createdAt).toLocaleDateString()
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