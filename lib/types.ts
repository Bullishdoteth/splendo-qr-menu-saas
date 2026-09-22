export type OrderStatus = 'Received' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  time: string
  rating: string
  available: boolean
  dietary?: string[]
}

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  hotelId: string
  roomNumber: string
  guestName: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  specialInstructions?: string
}

export interface RoomCode {
  id: string
  roomNumber: string
  floor: string
  guestName: string
  status: 'Ready' | 'Active' | 'Maintenance'
}

export interface Hotel {
  id: string
  slug: string
  name: string
  tagline: string
  logoText: string
  primaryColor: string
  accentColor: string
  currency: string
  currencySymbol: string
  address: string
  serviceHours: string
  plan: 'Free' | 'Pro' | 'Enterprise'
  menuItems: MenuItem[]
  rooms: RoomCode[]
}

export interface SaaSPlan {
  name: 'Free' | 'Pro' | 'Enterprise'
  priceMonthly: number
  roomLimit: number
  features: string[]
}
