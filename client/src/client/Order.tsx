import { useState } from 'react';
import { PRODUCTS } from '../constants/products';
import type { ProductId } from '../constants/products';
import { useNavigate } from "react-router-dom";

type Item = {
    productId: ProductId;
    qty: number;
}

function Order() {

    const navigate = useNavigate();

    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [note, setNote] = useState('');
    const [items, setItems] = useState<Item[]>([]);

    // 這邊是處理商品數量變更的函式
    const handleQtyChange = (productId: ProductId, qty: number) => {
    setItems(prev => {
      const exist = prev.find(i => i.productId === productId)
      if (exist) {
        return prev.map(i =>
          i.productId === productId ? { ...i, qty } : i
        )
      }
      return [...prev, { productId, qty }]
    })
  }

    const totalAmount = items.reduce((sum, item) => {
        return sum + PRODUCTS[item.productId].price * item.qty}, 0)

    const submitOrder = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        phone,
        address,
        deliveryTime,
        note,
        items,
        totalAmount})
    })

    if (!res.ok) {
      alert('訂單送出失敗')
      return
    }

    alert('訂單已送出')
    setCustomerName('')
    setPhone('')
    setAddress('')
    setDeliveryTime('')
    setNote('')
    setItems([])
  }

    const generateTimeOptions = (
      startHour = 4,
      endHour = 12,
      intervalMinutes = 30
    ) => {
      const times: string[] = [];

        for (let h = startHour; h <= endHour; h++) {
          for (let m = 0; m < 60; m += intervalMinutes) {
            if (h === endHour && m > 0) continue;

            const hh = String(h).padStart(2, '0');
            const mm = String(m).padStart(2, '0');
            times.push(`${hh}:${mm}`);
          }
        }

        return times;
    };

    const timeOptions = generateTimeOptions(4, 12, 30);

    const getQty = (productId: ProductId) => {
      return items.find(i => i.productId === productId)?.qty ?? 0;
    };



    return (
        <div className='max-w-xl mx-auto p-4 space-y-4'>
            <div className='flex justify-end bg-white rounded-2xl shadow-lg p-6 mb-6'>
                <h1 className='text-3xl font-bold'>下訂單</h1>
                <button className='ml-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold'
                    onClick={() => navigate('/')}>← 返回</button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">配送資訊</h2>
                <input className="mb-4 border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                   placeholder="姓名"
                   value={customerName}
                   onChange={e => setCustomerName(e.target.value)}/>
                <input className='mb-4 border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                        placeholder='電話'
                        value={phone}
                        onChange={e => setPhone(e.target.value)}/>
                <input className='mb-4 border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                        placeholder='地址'
                        value={address}
                        onChange={e => setAddress(e.target.value)}/>
                <select className='mb-4 border border-gray-300 p-3 h-12 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                        value={deliveryTime}
                        onChange={e => setDeliveryTime(e.target.value)}>
                    <option value="" disabled>選擇配送時間</option>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
                <textarea className='border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                        placeholder='備註'
                        value={note}
                        onChange={e => setNote(e.target.value)}/>
            </div>

            <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
              <h2 className="text-xl font-bold text-gray-800 mb-4">選擇商品</h2>
                <div className="space-y-3">
                    {Object.entries(PRODUCTS).map(([id, product]) => (
                        <div key={id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <span>{product.name} (${product.price}) / {product.unit}</span>
                            <div className='flex items-center gap-2'>
                              <div className='flex items-center gap-2'>
                                <button type="button"
                                        className='w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center'
                                        onClick={() => handleQtyChange(id as ProductId, Math.max(0, getQty(id as ProductId) - 1))}>−</button>
                                <input min={0}
                                       className='border border-gray-300 w-10 text-center p-1 rounded-lg'
                                       value={getQty(id as ProductId)}
                                       onChange={e => handleQtyChange(id as ProductId, Number(e.target.value))}/>
                                <button type="button"
                                        className='w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center'
                                        onClick={() => handleQtyChange(id as ProductId, getQty(id as ProductId) + 1)}>+</button>
                              </div>
                            </div>
                        </div>
                      ))}
                </div>
            </div>

            <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
                <div className='text-2xl font-bold mb-4'>總金額: ${totalAmount}</div>
                <button className='w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold'
                        onClick={submitOrder}>送出</button>
            </div>
            
        </div>
    );
}

export default Order;