"use client";

import React from "react";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

export default function OrdersPage() {
  const orders: Order[] = [
    { id: "1", date: "2025-08-01", total: 120, status: "Delivered" },
    { id: "2", date: "2025-08-10", total: 75, status: "Processing" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You don&apos;t have any orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded-md flex justify-between"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total}</p>
                <p className="text-sm text-gray-600">{order.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
