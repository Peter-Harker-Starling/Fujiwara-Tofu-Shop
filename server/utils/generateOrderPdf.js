const PDFDocument = require('pdfkit');
const path = require('path');

/**
 * 直接將 PDF 流向 Response，不儲存於伺服器
 */
function generateOrderPdf(res, order) {
  const doc = new PDFDocument({
    size: [226.77, 450], // 稍微加長一點以防品項多
    margins: { top: 15, bottom: 15, left: 15, right: 15 }
  });

  // 設定 Header，讓瀏覽器知道這是 PDF
  res.setHeader('Content-Type', 'application/pdf');
  // inline 代表在瀏覽器打開，若改為 attachment 則會直接下載
  res.setHeader('Content-Disposition', `inline; filename=fujiwara-order-${order._id}.pdf`);

  // 直接 pipe 給 response
  doc.pipe(res);

  // 載入字體
  doc.registerFont('tc', path.join(__dirname, '../font/NotoSansTC-VariableFont_wght.ttf'));
  doc.font('tc');

  // --- PDF 內容與你原本的邏輯相同 ---
  doc.fontSize(14).text('藤原とうふ店 (自家用)', { align: 'center' });
  doc.fontSize(8).text('------------------------------------------', { align: 'center' });
  doc.moveDown(0.5);

  doc.fontSize(10).text(`日期：${new Date(order.createdAt).toLocaleDateString('zh-TW')}`);
  doc.text(`單號：${order._id.toString().slice(-6).toUpperCase()}`);
  doc.text(`客戶：${order.customerName}`);
  doc.text(`電話：${order.phone}`);
  doc.text(`地址：${order.address}`);
  doc.text(`配送：${order.deliveryTime}`);
  doc.moveDown(0.5);

  // ⭐ 品項明細（含價格）
doc.fontSize(9).text('品項明細：')
doc.text('------------------------------------------')
// 表頭
doc.text('品名          數量   單價   小計')
doc.text('------------------------------------------')

// 品項列表
order.items.forEach(item => {
const itemTotal = item.price * item.qty
const name = item.name.padEnd(4, '　') // 中文全形空格對齊
const qty = `x${item.qty}`.padStart(4)
const price = `$${item.price}`.padStart(8)
const total = `$${itemTotal}`.padStart(7)
doc.fontSize(9).text(`${name} ${qty} ${price} ${total}`)
})

doc.text('------------------------------------------')
// ⭐ 總金額
doc.fontSize(11).text(`總計：NT$ ${order.totalAmount}`, { align: 'right' })
doc.moveDown(0.5)

// 備註
if (order.note) {
doc.fontSize(9).text(`備註：${order.note}`, { oblique: true })
doc.moveDown(0.5)
}

// 頁尾
doc.fontSize(10).text('秋名山配送專用', { align: 'center' })

  // 結束文件
  doc.end();
}

module.exports = generateOrderPdf;