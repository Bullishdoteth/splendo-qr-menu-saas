'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { useSaaS } from '@/lib/saas-context'
import { KitchenDesk } from './kitchen-desk'
import { MenuManager } from './menu-manager'
import { QRStudio } from './qr-studio'
import { SuperAdmin } from './super-admin'
import { OrderTracker } from './order-tracker'
import { Order } from '@/lib/types'
import {
  Bell, ChevronDown, Clock3, ConciergeBell, Copy, ExternalLink,
  Minus, Plus, QrCode, Search, ShieldCheck, ShoppingBag, Star, Utensils, X
} from 'lucide-react'

export default function SplendoApp() {
  const { hotels, activeHotel, setActiveHotelId, addOrder, orders } = useSaaS()

  // Navigation views: guest | kitchen | menu | qr | super-admin
  const [view, setView] = useState<'guest' | 'kitchen' | 'menu' | 'qr' | 'super-admin'>('guest')
  const [category, setCategory] = useState('Popular')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [showCart, setShowCart] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)

  // Tracking Modal State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null)

  // Detect room query parameter
  const [roomNumber, setRoomNumber] = useState('208')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('room')
      if (param) setRoomNumber(param)
    }
  }, [])

  const menuItems = activeHotel.menuItems

  const addItem = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  const removeItem = (id: string) => setCart((prev) => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }))

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0)
  const cartTotal = menuItems.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0)

  const visibleItems = category === 'Popular'
    ? menuItems
    : menuItems.filter((item) => item.category === category)

  const handlePlaceOrder = () => {
    const orderItems = menuItems
      .filter((item) => cart[item.id] > 0)
      .map((item) => ({ menuItem: item, quantity: cart[item.id] }))

    if (orderItems.length === 0) return

    const created = addOrder({
      hotelId: activeHotel.id,
      roomNumber,
      guestName: 'Amaka Okafor',
      items: orderItems,
      totalAmount: cartTotal,
      specialInstructions: 'Please leave outside room door'
    })

    setCart({})
    setShowCart(false)
    setActiveTrackingOrder(created)
  }

  const liveBaseUrl = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
    ? window.location.origin
    : 'https://splendo-qr-menu-saas.vercel.app'

  const menuQrUrl = `${liveBaseUrl}/?room=${roomNumber}`

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#17241f]">
      {/* SaaS Global Header */}
      <header className="sticky top-0 z-30 border-b border-[#dfe4dc] bg-[#f5f5f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1420px] flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-10">
          {/* Logo & Hotel Tenant Switcher */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-serif text-white font-bold shadow-sm"
              style={{ backgroundColor: activeHotel.primaryColor || '#173f35' }}
            >
              {activeHotel.logoText}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-serif text-lg font-bold text-[#173f35] leading-none">{activeHotel.name}</p>
                <select
                  value={activeHotel.id}
                  onChange={(e) => setActiveHotelId(e.target.value)}
                  className="rounded-full border border-[#dfe4dc] bg-white px-2 py-0.5 text-[11px] font-bold text-[#173f35] focus:outline-none cursor-pointer"
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>Switch: {h.name}</option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b714f]">{activeHotel.tagline}</p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#dfe4dc] bg-white/70 p-1 text-xs font-semibold">
            <button
              onClick={() => setView('guest')}
              className={`rounded-full px-3.5 py-1.5 transition ${view === 'guest' ? 'bg-[#173f35] text-white shadow-sm' : 'text-[#6d786f] hover:text-[#173f35]'}`}
            >
              Guest View
            </button>
            <button
              onClick={() => setView('kitchen')}
              className={`rounded-full px-3.5 py-1.5 transition ${view === 'kitchen' ? 'bg-[#173f35] text-white shadow-sm' : 'text-[#6d786f] hover:text-[#173f35]'}`}
            >
              Kitchen Desk
            </button>
            <button
              onClick={() => setView('menu')}
              className={`rounded-full px-3.5 py-1.5 transition ${view === 'menu' ? 'bg-[#173f35] text-white shadow-sm' : 'text-[#6d786f] hover:text-[#173f35]'}`}
            >
              Menu Studio
            </button>
            <button
              onClick={() => setView('qr')}
              className={`rounded-full px-3.5 py-1.5 transition ${view === 'qr' ? 'bg-[#173f35] text-white shadow-sm' : 'text-[#6d786f] hover:text-[#173f35]'}`}
            >
              QR Codes
            </button>
            <button
              onClick={() => setView('super-admin')}
              className={`rounded-full px-3 py-1.5 flex items-center gap-1 transition ${view === 'super-admin' ? 'bg-[#9b714f] text-white shadow-sm' : 'text-[#9b714f] hover:bg-[#9b714f]/10'}`}
            >
              <ShieldCheck size={14} /> Platform SaaS
            </button>
          </div>

          {/* QR Code Action Button */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6d786f]">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#dfe4dc] bg-white px-3 py-1.5 hover:border-[#9eb0a4] transition"
            >
              <QrCode size={14} /> Room QR
            </button>
          </div>
        </div>
      </header>

      {/* QR Code Quick Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a23]/35 p-4" role="dialog">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Guest QR Code</p>
                <h2 className="mt-1 font-serif text-2xl text-[#173f35]">Room {roomNumber} Scan</h2>
              </div>
              <button onClick={() => setShowQrModal(false)} className="rounded-full p-2 text-[#718078] hover:bg-[#edf1eb]">
                <X size={18} />
              </button>
            </div>

            <div className="mx-auto mt-6 flex size-56 items-center justify-center rounded-2xl border border-[#e5eee4] bg-white p-3">
              <QRCodeSVG value={menuQrUrl} size={190} bgColor="#ffffff" fgColor={activeHotel.primaryColor || '#173f35'} level="H" includeMargin />
            </div>

            <p className="mt-4 break-all font-mono text-[11px] text-[#9aa59d]">{menuQrUrl}</p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => navigator.clipboard?.writeText(menuQrUrl)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dfe4dc] px-4 py-3 text-xs font-semibold text-[#173f35]"
              >
                <Copy size={14} /> Copy Link
              </button>
              <a
                href={menuQrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#173f35] px-4 py-3 text-xs font-semibold text-white"
              >
                <ExternalLink size={14} /> Open Menu
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main View Router */}
      {view === 'guest' && (
        <section className="mx-auto max-w-[1320px] px-5 pb-20 lg:px-10">
          <div className="grid items-center gap-10 py-10 lg:grid-cols-[1fr_1.2fr] lg:py-14">
            <div>
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">
                <span className="h-px w-8 bg-[#9b714f]" /> Welcome to {activeHotel.name}
              </p>
              <h1 className="max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] text-[#173f35] sm:text-6xl">
                Good food,<br />
                <em className="font-normal text-[#9b714f]">beautifully</em> served.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#6d786f]">
                Explore our curated room service menu. Your order will be prepared by our chefs and delivered fresh to your room.
              </p>
            </div>

            {/* Room Location Card */}
            <div
              className="relative overflow-hidden rounded-[28px] p-8 sm:p-10 text-white shadow-xl"
              style={{ backgroundColor: activeHotel.primaryColor || '#173f35' }}
            >
              <div className="relative flex min-h-[220px] flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">Room Service Delivery</p>
                    <p className="mt-2 font-serif text-3xl">{activeHotel.name}</p>
                  </div>
                  <div className="rounded-full bg-white/20 p-3"><Utensils size={20} /></div>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-white/20 pt-4">
                  <div>
                    <p className="text-xs opacity-75">Delivering to</p>
                    <p className="mt-1 text-xl font-semibold">Room {roomNumber} <span className="opacity-60">·</span> Guest</p>
                  </div>
                  <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold">{activeHotel.currency} Currency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Curated Selection</p>
              <h2 className="mt-1 font-serif text-3xl text-[#173f35]">What are you in the mood for?</h2>
            </div>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
            {['Popular', 'Breakfast', 'Mains', 'Desserts', 'Drinks'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  category === cat
                    ? 'bg-[#173f35] text-white shadow-sm'
                    : 'border border-[#dfe4dc] bg-white text-[#6d786f] hover:border-[#9eb0a4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid gap-5 md:grid-cols-3">
            {visibleItems.map((item) => (
              <article key={item.id} className="group overflow-hidden rounded-2xl border border-[#e1e5df] bg-white shadow-sm">
                <div className="relative h-52 overflow-hidden bg-[#e5eee4]">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#173f35]">
                    <Star size={12} className="mr-1 inline fill-[#c99562] text-[#c99562]" /> {item.rating}
                  </div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl text-[#173f35]">{item.name}</h3>
                      <p className="mt-2 text-xs leading-5 text-[#7a857c]">{item.description}</p>
                    </div>
                    <p className="text-lg font-bold font-mono text-[#9b714f]">
                      {activeHotel.currencySymbol}{item.price}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#edf0eb] pt-4">
                    <span className="text-xs text-[#8b958d]">
                      <Clock3 size={13} className="mr-1 inline" /> {item.time}
                    </span>
                    <button
                      disabled={!item.available}
                      onClick={() => addItem(item.id)}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                        item.available
                          ? 'bg-[#e5eee4] text-[#173f35] hover:bg-[#cfe0d0]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus size={14} /> Add to Order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Floating Cart Button */}
          {cartCount > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-[#173f35] px-6 py-4 text-white shadow-2xl transition hover:bg-[#235749]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c99562] text-xs font-bold">
                {cartCount}
              </span>
              <span className="font-semibold text-sm">View Room Service Order</span>
              <span className="font-mono font-bold text-sm">{activeHotel.currencySymbol}{cartTotal}</span>
            </button>
          )}

          {/* Cart Drawer */}
          {showCart && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102a23]/30 p-4 sm:items-center">
              <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#e6e9e4] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b714f]">Room {roomNumber}</span>
                    <h2 className="font-serif text-2xl text-[#173f35]">Your Order</h2>
                  </div>
                  <button onClick={() => setShowCart(false)} aria-label="Close order"><X size={18} /></button>
                </div>

                <div className="mt-5 space-y-4 max-h-[300px] overflow-y-auto">
                  {menuItems.filter((item) => cart[item.id]).map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-[#edf0eb] pb-3">
                      <div>
                        <p className="font-semibold text-sm text-[#173f35]">{item.name}</p>
                        <p className="text-xs text-[#8a948c]">{activeHotel.currencySymbol}{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeItem(item.id)} className="rounded-full bg-[#edf1eb] p-1.5 text-[#173f35]">
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">{cart[item.id]}</span>
                        <button onClick={() => addItem(item.id)} className="rounded-full bg-[#edf1eb] p-1.5 text-[#173f35]">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#e6e9e4] pt-4">
                  <div className="flex justify-between text-base font-bold text-[#173f35]">
                    <span>Total Amount:</span>
                    <span className="font-mono text-lg">{activeHotel.currencySymbol}{cartTotal}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="mt-5 w-full rounded-full bg-[#173f35] py-3.5 text-xs font-bold text-white hover:bg-[#235749]"
                  >
                    Confirm & Send to Kitchen
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {view === 'kitchen' && <KitchenDesk />}
      {view === 'menu' && <MenuManager />}
      {view === 'qr' && <QRStudio />}
      {view === 'super-admin' && <SuperAdmin />}

      {/* Real-time Order Tracking Modal */}
      {activeTrackingOrder && (
        <OrderTracker
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}
    </main>
  )
}
