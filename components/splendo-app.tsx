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
  const { hotels, activeHotel, setActiveHotelId, addOrder } = useSaaS()

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
      guestName: 'Guest',
      items: orderItems,
      totalAmount: cartTotal,
      specialInstructions: 'Please deliver to room'
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
      {/* SaaS Global Header — ONLY visible in Staff/Admin mode */}
      {view !== 'guest' && (
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
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b714f]">Staff Admin Workspace</p>
              </div>
            </div>

            {/* Role Navigation Pills */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#dfe4dc] bg-white/70 p-1 text-xs font-semibold">
              <button
                onClick={() => setView('guest')}
                className={`rounded-full px-3.5 py-1.5 transition ${view === 'guest' ? 'bg-[#173f35] text-white shadow-sm' : 'text-[#6d786f] hover:text-[#173f35]'}`}
              >
                Guest View ➔
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
      )}

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

      {/* FRONT FACING GUEST VIEW */}
      {view === 'guest' && (
        <section className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:px-6">
          {/* Room Service Delivery Card ONLY */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
            style={{ backgroundColor: activeHotel.primaryColor || '#173f35' }}
          >
            <div className="relative flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-serif text-2xl font-bold">
                    {activeHotel.logoText}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-85">Room Service Delivery</p>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">{activeHotel.name}</h1>
                  </div>
                </div>
                <div className="rounded-full bg-white/20 p-2.5">
                  <Utensils size={20} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-75">Delivering To</p>
                  <p className="text-xl font-bold font-mono">Room {roomNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider opacity-75">Service Hours</p>
                  <p className="text-xs font-medium">{activeHotel.serviceHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="my-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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

          {/* 3-COLUMN ITEMS LIST: Image (Col 1) | Details & Price (Col 2) | Quantity [- count +] (Col 3) */}
          <div className="space-y-3">
            {visibleItems.map((item) => {
              const qty = cart[item.id] || 0

              return (
                <article
                  key={item.id}
                  className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[96px_1fr_auto] items-center gap-3 sm:gap-4 rounded-2xl border border-[#e1e5df] bg-white p-3 sm:p-4 shadow-sm transition hover:border-[#b9cdbd]"
                >
                  {/* Column 1: Image of product */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl bg-[#e5eee4]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        Sold out
                      </div>
                    )}
                  </div>

                  {/* Column 2: Name of product, description & price */}
                  <div className="min-w-0 pr-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#173f35] truncate">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-[#7a857c] line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#9b714f]">
                        {activeHotel.currencySymbol}{item.price}
                      </span>
                      <span className="text-[11px] text-[#8b958d]">
                        <Clock3 size={12} className="mr-1 inline text-[#9b714f]" /> {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Quantity [- and +] Controls */}
                  <div className="flex items-center justify-end">
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 rounded-full border border-[#173f35] bg-[#173f35]/5 p-1">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#173f35] shadow-sm hover:bg-[#edf1eb]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-4 text-center font-mono text-xs font-bold text-[#173f35]">{qty}</span>
                        <button
                          onClick={() => addItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#173f35] text-white shadow-sm hover:bg-[#235749]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!item.available}
                        onClick={() => addItem(item.id)}
                        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                          item.available
                            ? 'bg-[#173f35] text-white hover:bg-[#235749] shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
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
              <span className="font-semibold text-sm">View Order</span>
              <span className="font-mono font-bold text-sm">{activeHotel.currencySymbol}{cartTotal}</span>
            </button>
          )}

          {/* Cart Checkout Drawer */}
          {showCart && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102a23]/30 p-4 sm:items-center">
              <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#e6e9e4] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b714f]">Room {roomNumber}</span>
                    <h2 className="font-serif text-2xl text-[#173f35]">Your Room Service Order</h2>
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

          {/* Discreet Footer link to Staff Access */}
          <footer className="mt-16 text-center border-t border-[#dfe4dc] pt-6 pb-12">
            <p className="text-xs text-[#8a948c]">{activeHotel.name} · Room Service Portal</p>
            <button
              onClick={() => setView('kitchen')}
              className="mt-2 text-[11px] font-semibold text-[#9b714f] hover:underline"
            >
              Staff & Hotel Admin Access ➔
            </button>
          </footer>
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
