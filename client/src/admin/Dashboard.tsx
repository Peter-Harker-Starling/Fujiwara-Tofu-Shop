import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../constants/order";   

function Dashboard() {

    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [checkingAuth, setCheckingAuth] = useState(true);


    const logout = async () => {
        await fetch('api/admins/logout', {
            method: 'POST',
            credentials: 'include'
        })
        navigate('/');
    };

    useEffect(() => {

        fetch("/api/orders", {
            credentials: 'include'
        })
        .then(res => {
            if (res.status === 401) {
            navigate("/");
            return Promise.reject();
            }
            return res.json();
        })
        .then(data => {
            setOrders(data);
            setCheckingAuth(false);
        })
        .catch(() => {
            setCheckingAuth(false);
        });

    }, []);


    if (checkingAuth) {
        return <div className="p-4">驗證中...</div>;
    }

    const updateOrderStatus = async (id: string, status: string) => {
        await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({ status })
        });

        setOrders(prev => prev.map(order => order._id === id ? { ...order, status } : order));
    };

    const openPdf = async (id: string) => {
        // 1. 在 click 當下就先開新分頁（Safari 允許）
        const newWindow = window.open('', '_blank');

        if (!newWindow) {
            alert('瀏覽器阻擋彈出視窗，請允許此網站彈出視窗');
            return;
        }

        try {
            // 2. 再去打有 jwtauth 的 API
            const res = await fetch(`/api/orders/${id}/pdf`, {
                credentials: 'include'
            });

            if (!res.ok) {
            newWindow.close();
            alert('PDF 產生失敗');
            return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            // ✅ 3. 把已經開好的視窗導向 PDF
            newWindow.location.href = url;

        } catch (err) {
            newWindow.close();
            alert('開啟 PDF 發生錯誤');
        }
    };


    const deleteOrder = async (id: string) => {
        if (!confirm("確定要刪除這筆訂單嗎？")) return;

        await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        credentials: 'include'
        });

        setOrders(prev => prev.filter(order => order._id !== id));
    };

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">

            <div className="flex items-center bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-3xl font-bold">訂單管理</h1>
                <button className="ml-auto py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                        onClick={logout}>登出</button>
            </div>

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-semibold text-lg">{order.customerName}（{order.phone}）</div>
                            <div className="text-gray-500 text-sm ml-2">${order.totalAmount}</div>
                        </div>
                        <div className="mb-4 space-y-1 text-sm text-gray-700">
                                {order.items.map(item => (
                                    <div key={item.productId} className="flex justify-between">
                                        <span>{item.name} × {item.qty}</span>
                                        <span>${item.price * item.qty}</span>
                                    </div>
                                ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <select value={order.status} 
                                    onChange={e => updateOrderStatus(order._id, e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="準備中">準備中</option>
                                <option value="已出貨">已出貨</option>
                            </select>

                            <button onClick={() => openPdf(order._id)}
                                    className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium">PDF</button>

                            <button className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium ml-auto"
                                    onClick={() => deleteOrder(order._id)}>刪除</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    }

export default Dashboard;