import { useState } from "react";
import OrderHistoryCard from "../../components/cards/OrderHistoryCard";

export default function OrderHistory() {
    const [orderHistory, setOrderHistory] = useState([
        {
            id: 1,
            date: "2023-01-01",
            orderBy: "John Doe",
            location: "Paombong, Bulacan",
            via: "Messenger",
            modeTransport: "Pickup",
            items: [
                {
                    id: 1,
                    name: "Superworm",
                    size: "small-medium",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 300
                },
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 300
        },
        {
            id: 1,
            date: "2023-01-01",
            orderBy: "John Doe",
            location: "Paombong, Bulacan",
            via: "Messenger",
            modeTransport: "Pickup",
            items: [
                {
                    id: 1,
                    name: "Superworm",
                    size: "small-medium",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 300
                },
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 300
        },
        {
            id: 1,
            date: "2023-01-01",
            orderBy: "John Doe",
            location: "Paombong, Bulacan",
            via: "Messenger",
            modeTransport: "Pickup",
            items: [
                {
                    id: 1,
                    name: "Superworm",
                    size: "small-medium",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 300
                },
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 300
        },
        {
            id: 1,
            date: "2023-01-01",
            orderBy: "John Doe",
            location: "Paombong, Bulacan",
            via: "Messenger",
            modeTransport: "Pickup",
            items: [
                {
                    id: 1,
                    name: "Superworm",
                    size: "small-medium",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 300
                },
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 300
        },
        {
            id: 1,
            date: "2023-01-01",
            orderBy: "John Doe",
            location: "Paombong, Bulacan",
            via: "Messenger",
            modeTransport: "Pickup",
            items: [
                {
                    id: 1,
                    name: "Superworm",
                    size: "small-medium",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 300
                },
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 300
        },
        {
            id: 1,
            date: "2023-01-01",
            orderBy: "John Doe",
            location: "Paombong, Bulacan",
            via: "Messenger",
            modeTransport: "Pickup",
            items: [
                {
                    id: 1,
                    name: "Superworm",
                    size: "small-medium",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 300
                },
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 1,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 300
        },
        {
            id: 2,
            date: "2023-01-02",
            location: "Paombong, Bulacan",
            orderBy: "Jane Smith",
            via: "Messenger",
            modeTransport: "Delivery",
            items: [
                {
                    id: 2,
                    name: "Superworm",
                    size: "large-extra large",
                    quantity: 2,
                    pieces: 1000,
                    freebies: 100,
                    price: 200
                }
            ],
            total: 200
        }
    ]);
  return (
    <main className="page-container">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-green-800">Your Order History</h1>
            <p className="text-sm text-gray-600">
                Review your past orders and track their status. Stay informed about your purchases and manage your order history with ease.
            </p>
        </div>
        <div className="flex flex-col w-full items-center justify-center gap-4 mt-4">
            <p className="text-gray-600 w-full ">{orderHistory.length} orders</p>
            {orderHistory.length === 0 && (
                <p className="text-gray-500 text-sm font-medium pt-10">
                    You have no order history yet. Start exploring our catalog and place your first order!
                </p>
            )}
            {orderHistory.map((order) => (
                <OrderHistoryCard
                    key={order.id}
                    orderId={order.id}
                    orderDate={order.date}
                    orderBy={order.orderBy}
                    orderLocation={order.location}
                    orderVia={order.via}
                    orderModeTransport={order.modeTransport}
                    orderItems={order.items}
                    orderTotal={order.total}
                />
            ))}
        </div>
    </main>
  );
}