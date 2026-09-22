'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Hotel, MenuItem, Order, OrderStatus, RoomCode } from './types'
import { playOrderChime } from './sound-utils'

const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    slug: 'splendo-hotel',
    name: 'Splendo Hotel & Suites',
    tagline: 'Luxury Room Service & Dining.',
    logoText: 'S',
    primaryColor: '#173f35',
    accentColor: '#9b714f',
    currency: 'NGN',
    currencySymbol: '₦',
    address: '42 Victoria Island Way, Lagos',
    serviceHours: '8:00 AM – 10:00 PM',
    plan: 'Enterprise',
    rooms: [
      { id: 'r-101', roomNumber: '101', floor: '1st Floor', guestName: 'Available', status: 'Ready' },
      { id: 'r-119', roomNumber: '119', floor: '1st Floor', guestName: 'Sofia Bennett', status: 'Active' },
      { id: 'r-208', roomNumber: '208', floor: '2nd Floor', guestName: 'Amaka Okafor', status: 'Active' },
      { id: 'r-314', roomNumber: '314', floor: '3rd Floor', guestName: 'Daniel Mensah', status: 'Active' },
      { id: 'r-402', roomNumber: '402', floor: '4th Floor', guestName: 'Available', status: 'Ready' },
      { id: 'r-501', roomNumber: '501', floor: '5th Floor (Penthouse)', guestName: 'Marcus Vance', status: 'Active' },
    ],
    menuItems: [
      { id: 'm-1', name: 'Jollof & Grilled Chicken', description: 'Smoky tomato rice, charred chicken, fried plantain, spicy relish', price: 12500, category: 'Popular', image: '/images/jollof-chicken.png', time: '20–25 min', rating: '4.9', available: true, dietary: ['Gluten-Free'] },
      { id: 'm-2', name: 'Avocado Toast', description: 'Artisanal sourdough, smashed avocado, poached organic egg, chili flakes', price: 8500, category: 'Breakfast', image: '/images/avocado-toast.png', time: '10–15 min', rating: '4.8', available: true, dietary: ['Vegetarian'] },
      { id: 'm-3', name: 'Coconut Cake', description: 'Vanilla bean sponge, coconut cream frosting, toasted coconut flakes', price: 4500, category: 'Desserts', image: '/images/coconut-cake.png', time: '5–10 min', rating: '4.7', available: true, dietary: ['Vegetarian'] },
      { id: 'm-4', name: 'Truffle Mushroom Omelette', description: 'Three fluffy eggs, wild forest mushrooms, black truffle oil, aged cheddar', price: 9500, category: 'Breakfast', image: '/images/avocado-toast.png', time: '12–15 min', rating: '4.9', available: true },
      { id: 'm-5', name: 'Fresh Passionfruit Spritz', description: 'Sparkling mineral water, fresh passionfruit pulp, lime, mint leaves', price: 3500, category: 'Drinks', image: '/images/coconut-cake.png', time: '3–5 min', rating: '4.6', available: true, dietary: ['Vegan'] },
    ]
  },
  {
    id: 'hotel-2',
    slug: 'royal-palm',
    name: 'Royal Palm Resort & Spa',
    tagline: 'Luxury seaside hospitality.',
    logoText: 'R',
    primaryColor: '#0f2c59',
    accentColor: '#d4af37',
    currency: 'NGN',
    currencySymbol: '₦',
    address: '108 Ocean Drive, Lagos',
    serviceHours: '24/7 Room Service',
    plan: 'Pro',
    rooms: [
      { id: 'rp-101', roomNumber: '101', floor: 'Beach Front', guestName: 'Elena Rostova', status: 'Active' },
      { id: 'rp-202', roomNumber: '202', floor: '2nd Floor', guestName: 'Liam Hemsworth', status: 'Active' },
      { id: 'rp-305', roomNumber: '305', floor: '3rd Floor', guestName: 'Available', status: 'Ready' }
    ],
    menuItems: [
      { id: 'rp-m1', name: 'Grilled Lobster Tail', description: 'Garlic butter glaze, roasted asparagus, lemon herb quinoa', price: 32000, category: 'Popular', image: '/images/jollof-chicken.png', time: '25–30 min', rating: '5.0', available: true },
      { id: 'rp-m2', name: 'Tropical Acai Bowl', description: 'Organic acai, dragon fruit, house granola, chia seeds, chia nectar', price: 7500, category: 'Breakfast', image: '/images/avocado-toast.png', time: '10 min', rating: '4.8', available: true, dietary: ['Vegan'] }
    ]
  }
]

const INITIAL_ORDERS: Order[] = [
  {
    id: '#SP-1048',
    hotelId: 'hotel-1',
    roomNumber: '208',
    guestName: 'Amaka Okafor',
    items: [
      { menuItem: INITIAL_HOTELS[0].menuItems[0], quantity: 1, notes: 'Extra plantain please' },
      { menuItem: INITIAL_HOTELS[0].menuItems[2], quantity: 1 }
    ],
    totalAmount: 17000,
    status: 'Preparing',
    createdAt: '2 min ago',
    specialInstructions: 'Please leave outside door on table'
  },
  {
    id: '#SP-1047',
    hotelId: 'hotel-1',
    roomNumber: '314',
    guestName: 'Daniel Mensah',
    items: [
      { menuItem: INITIAL_HOTELS[0].menuItems[1], quantity: 1 }
    ],
    totalAmount: 8500,
    status: 'Out for Delivery',
    createdAt: '8 min ago'
  },
  {
    id: '#SP-1046',
    hotelId: 'hotel-1',
    roomNumber: '119',
    guestName: 'Sofia Bennett',
    items: [
      { menuItem: INITIAL_HOTELS[0].menuItems[2], quantity: 1 },
      { menuItem: INITIAL_HOTELS[0].menuItems[4], quantity: 2 }
    ],
    totalAmount: 11500,
    status: 'Delivered',
    createdAt: '14 min ago'
  }
]

interface SaaSContextType {
  hotels: Hotel[]
  activeHotel: Hotel
  setActiveHotelId: (id: string) => void
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addMenuItem: (hotelId: string, item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (hotelId: string, item: MenuItem) => void
  deleteMenuItem: (hotelId: string, itemId: string) => void
  toggleMenuItemStock: (hotelId: string, itemId: string) => void
  bulkGenerateRooms: (hotelId: string, startNum: number, count: number, floorPrefix: string) => void
  addHotel: (hotel: Omit<Hotel, 'id' | 'rooms' | 'menuItems'>) => void
  updateHotelSettings: (hotelId: string, updates: Partial<Hotel>) => void
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined)

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS)
  const [activeHotelId, setActiveHotelId] = useState<string>('hotel-1')
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Hydrate state from localStorage after initial client mount to prevent SSR mismatch & instant resets
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHotels = localStorage.getItem('splendo_saas_hotels')
        if (savedHotels) setHotels(JSON.parse(savedHotels))

        const savedActiveId = localStorage.getItem('splendo_saas_active_hotel_id')
        if (savedActiveId) setActiveHotelId(savedActiveId)

        const savedOrders = localStorage.getItem('splendo_saas_orders')
        if (savedOrders) setOrders(JSON.parse(savedOrders))
      } catch (e) {
        console.error('Failed to load state from localStorage:', e)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Persist state updates to localStorage only after initial load
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('splendo_saas_hotels', JSON.stringify(hotels))
    }
  }, [hotels, isLoaded])

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('splendo_saas_active_hotel_id', activeHotelId)
    }
  }, [activeHotelId, isLoaded])

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('splendo_saas_orders', JSON.stringify(orders))
    }
  }, [orders, isLoaded])

  const activeHotel = hotels.find((h) => h.id === activeHotelId) || hotels[0]

  const addOrder = (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...newOrderData,
      id: `#SP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      status: 'Received'
    }
    setOrders((prev) => [newOrder, ...prev])
    playOrderChime()
    return newOrder
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((ord) => ord.id === orderId ? { ...ord, status } : ord))
  }

  const addMenuItem = (hotelId: string, itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...itemData, id: `m-${Date.now()}` }
    setHotels((prev) => prev.map((h) => h.id === hotelId ? { ...h, menuItems: [newItem, ...h.menuItems] } : h))
  }

  const updateMenuItem = (hotelId: string, updatedItem: MenuItem) => {
    setHotels((prev) => prev.map((h) => h.id === hotelId ? { ...h, menuItems: h.menuItems.map((m) => m.id === updatedItem.id ? updatedItem : m) } : h))
  }

  const deleteMenuItem = (hotelId: string, itemId: string) => {
    setHotels((prev) => prev.map((h) => h.id === hotelId ? { ...h, menuItems: h.menuItems.filter((m) => m.id !== itemId) } : h))
  }

  const toggleMenuItemStock = (hotelId: string, itemId: string) => {
    setHotels((prev) => prev.map((h) => h.id === hotelId ? {
      ...h,
      menuItems: h.menuItems.map((m) => m.id === itemId ? { ...m, available: !m.available } : m)
    } : h))
  }

  const bulkGenerateRooms = (hotelId: string, startNum: number, count: number, floorPrefix: string) => {
    const newRooms: RoomCode[] = Array.from({ length: count }, (_, i) => {
      const num = (startNum + i).toString()
      return {
        id: `r-${num}-${Date.now()}`,
        roomNumber: num,
        floor: floorPrefix,
        guestName: 'Available',
        status: 'Ready'
      }
    })
    setHotels((prev) => prev.map((h) => h.id === hotelId ? { ...h, rooms: [...h.rooms, ...newRooms] } : h))
  }

  const addHotel = (hotelData: Omit<Hotel, 'id' | 'rooms' | 'menuItems'>) => {
    const newHotel: Hotel = {
      ...hotelData,
      id: `hotel-${Date.now()}`,
      rooms: [
        { id: `r-101-${Date.now()}`, roomNumber: '101', floor: '1st Floor', guestName: 'Available', status: 'Ready' },
        { id: `r-102-${Date.now()}`, roomNumber: '102', floor: '1st Floor', guestName: 'Available', status: 'Ready' }
      ],
      menuItems: INITIAL_HOTELS[0].menuItems.slice(0, 3)
    }
    setHotels((prev) => [...prev, newHotel])
    setActiveHotelId(newHotel.id)
  }

  const updateHotelSettings = (hotelId: string, updates: Partial<Hotel>) => {
    setHotels((prev) => prev.map((h) => h.id === hotelId ? { ...h, ...updates } : h))
  }

  return (
    <SaaSContext.Provider value={{
      hotels,
      activeHotel,
      setActiveHotelId,
      orders,
      addOrder,
      updateOrderStatus,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuItemStock,
      bulkGenerateRooms,
      addHotel,
      updateHotelSettings
    }}>
      {children}
    </SaaSContext.Provider>
  )
}

export function useSaaS() {
  const context = useContext(SaaSContext)
  if (!context) throw new Error('useSaaS must be used within SaaSProvider')
  return context
}
