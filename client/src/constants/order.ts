export type OrderItem = {
  productId: string
  name: string
  price: number
  qty: number
}

export type Order = {
  _id: string
  customerName: string
  phone: string
  address: string
  deliveryTime?: string
  note?: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
}
