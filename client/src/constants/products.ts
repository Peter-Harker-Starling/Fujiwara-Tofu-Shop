export const PRODUCTS = {
  momen_tofu: { name: '板豆腐', price: 30, unit: '丁' },
  fried_tofu: { name: '油豆腐', price: 10, unit: '個' },
  soy_milk: { name: '特製豆漿', price: 25, unit: '杯' },
  inari_sushi: { name: '豆皮壽司', price: 60, unit: '盒' },
  dried_tofu: { name: '手工豆乾', price: 20, unit: '份' }
} as const

export type ProductId = keyof typeof PRODUCTS
