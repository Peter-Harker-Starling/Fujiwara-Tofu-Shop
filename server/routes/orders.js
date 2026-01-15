const express = require('express');
const Order = require('../models/Order')
const jwtauth = require('../auth/auth');
const generateOrderPdf = require('../utils/generateOrderPdf');

const router = express.Router()

// 定義品項價格（與前端一致）
const PRODUCTS = {
  momen_tofu: { name: '板豆腐', price: 30 },
  fried_tofu: { name: '油豆腐', price: 10 },
  soy_milk: { name: '特製豆漿', price: 25 },
  inari_sushi: { name: '豆皮壽司', price: 60 },
  dried_tofu: { name: '手工豆乾', price: 20 }
}

// 新增訂單（加入驗證）
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      deliveryTime,
      note,
      items,
      totalAmount
    } = req.body

    // 1️⃣ 驗證商品是否存在 + 數量是否合法
    const isValidItems = items.every(item => {
      const product = PRODUCTS[item.productId]
      return product && Number.isInteger(item.qty) && item.qty > 0
    })

    if (!isValidItems) {
      return res.status(400).json({ error: '商品不存在或數量錯誤' })
    }

    // 2️⃣ 後端計算總金額（完全不信任前端）
    const calculatedTotal = items.reduce((sum, item) => {
      const product = PRODUCTS[item.productId]
      return sum + product.price * item.qty
    }, 0)

    // 3️⃣ 驗證總金額
    if (calculatedTotal !== totalAmount) {
      return res.status(400).json({ error: '總金額不正確' })
    }

    // 4️⃣ 組合乾淨的訂單資料（用後端價格）
    const orderItems = items.map(item => {
      const product = PRODUCTS[item.productId]
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        qty: item.qty
      }
    })

    const order = await Order.create({
      customerName,
      phone,
      address,
      deliveryTime,
      note,
      items: orderItems,
      totalAmount: calculatedTotal
    })

    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// 客戶透過電話號碼取得自己的訂單
router.get('/:phone', async (req, res) => {
  const orders = await Order.find({ phone: req.params.phone }).sort({ createdAt: -1 }) // 新的在前
  res.json(orders)
})

// 取得所有訂單
router.get('/', jwtauth, async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 }) // 新的在前
    res.json(orders)
})

// 新增一個查看 PDF 的路由
router.get('/:id/pdf', jwtauth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('訂單不存在');
    }

    // 呼叫剛剛改好的 function，直接傳入 res
    generateOrderPdf(res, order);
    
  } catch (err) {
    res.status(500).send('生成單據出錯：' + err.message);
  }
});

// 更新訂單狀態
router.patch('/:id/status', jwtauth, async (req, res) => {
  const { status } = req.body;
  if (!['準備中', '已出貨'].includes(status)) {
    return res.status(400).json({ error: '無效的訂單狀態' });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ error: '訂單不存在' });
  }

  res.json(order);
});

// 刪除訂單
router.delete('/:id', jwtauth, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = router