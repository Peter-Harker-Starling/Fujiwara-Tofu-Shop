import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../constants/order"; 

function SelectOrder() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        setOrders([]);

        try {
            const res = await fetch(`/api/orders/${phone}`);
            if (!res.ok) {
                throw new Error('查詢失敗');
            }
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError('無法查詢訂單');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <div className="flex items-center bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold">查詢訂單</h1>
                <button className="ml-auto py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                        onClick={() => navigate('/')}>← 返回</button>
            </div>
            <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-6 mb-6">
                <input className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                       placeholder="請輸入電話"
                       value={phone}
                       onChange={e => setPhone(e.target.value)}/>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        onClick={fetchOrders}>GO</button>
            </div>

            {/* Status */}
            {loading && <p>查詢中...</p>}
            {error && <p className="text-xl font-bold text-center mb-2 text-red-600">{error}</p>}

            {/* Orders */}
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order._id} className="border border-gray-300 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">訂單編號：{order._id.slice(-6)}</span>
                            <span className="text-sm text-gray-600">{order.deliveryTime}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                            狀態：<span className="font-semibold">{order.status}</span>
                        </div>
                        <ul className="text-sm">
                            {order.items.map(item => (
                                <li key={item.productId}>
                                    {item.name} × {item.qty}（${item.price}）
                                </li>
                            ))}
                        </ul>
                        <div className="font-bold">總金額：${order.totalAmount}</div>
                    </div>
                ))}

                {!loading && orders.length === 0 && phone && (
                    <div className="border text-center border-gray-300 rounded-2xl p-4 space-y-2">
                        <p className="text-xl font-bold text-gray-800">查無訂單</p>
                    </div>
                )}
            </div>
        </div>
    );
    }

export default SelectOrder;