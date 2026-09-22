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
import { MenuItem, Order } from '@/lib/types'
import { Toaster, toast } from 'sonner'
import {
  Bell, CheckCircle2, ChevronDown, Clock3, ConciergeBell, Copy, ExternalLink,
  Minus, Plus, QrCode, Search, SearchX, Settings, ShieldCheck, ShoppingBag, Star,
  Trash2, Utensils, UtensilsCrossed, X
} from 'lucide-react'

export default function SplendoApp() {
  const { hotels, activeHotel, setActiveHotelId, addOrder, updateHotelSettings } = useSaaS()

  // Navigation views: guest | kitchen | menu | qr | super-admin
  const [view, setView] = useState<'guest' | 'kitchen' | 'menu' | 'qr' | 'super-admin'>('guest')
  const [category, setCategory] = useState('Popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [showCart, setShowCart] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Order notes & toast state
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isCategoryChanging, setIsCategoryChanging] = useState(false)
  const [isCartRetracting, setIsCartRetracting] = useState(false)

  const handleOpenCart = () => {
    setIsCartRetracting(false)
    setShowCart(true)
  }

  const handleCloseCart = () => {
    setIsCartRetracting(true)
    setTimeout(() => {
      setShowCart(false)
      setIsCartRetracting(false)
    }, 260)
  }

  // Hotel Settings Form State
  const [hotelName, setHotelName] = useState(activeHotel.name)
  const [hotelTagline, setHotelTagline] = useState(activeHotel.tagline)
  const [currencySymbol, setCurrencySymbol] = useState(activeHotel.currencySymbol)
  const [currencyCode, setCurrencyCode] = useState(activeHotel.currency)
  const [primaryColor, setPrimaryColor] = useState(activeHotel.primaryColor)
  const [serviceHours, setServiceHours] = useState(activeHotel.serviceHours)

  useEffect(() => {
    setHotelName(activeHotel.name)
    setHotelTagline(activeHotel.tagline)
    setCurrencySymbol(activeHotel.currencySymbol)
    setCurrencyCode(activeHotel.currency)
    setPrimaryColor(activeHotel.primaryColor)
    setServiceHours(activeHotel.serviceHours)
  }, [activeHotel])

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

  const addItem = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const handleAddItem = (item: MenuItem) => {
    addItem(item.id)
    toast.success(`Added "${item.name}" to order`, {
      description: `Room ${roomNumber} • ${activeHotel.currencySymbol}${item.price.toLocaleString()}`
    })
  }

  const removeItem = (id: string) => {
    setCart((prev) => {
      const current = prev[id] || 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: current - 1 }
    })
  }

  const handleRemoveItem = (item: MenuItem) => {
    removeItem(item.id)
  }

  const handleCategorySelect = (cat: string) => {
    if (cat === category) return
    setIsCategoryChanging(true)
    setCategory(cat)
    setTimeout(() => setIsCategoryChanging(false), 180)
  }

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0)
  const cartTotal = menuItems.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0)

  const visibleItems = menuItems.filter((item) => {
    const matchesCategory = category === 'Popular' || item.category === category
    const matchesSearch = !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handlePlaceOrder = () => {
    const orderItems = menuItems
      .filter((item) => cart[item.id] > 0)
      .map((item) => ({ menuItem: item, quantity: cart[item.id] }))

    if (orderItems.length === 0) return

    const created = addOrder({
      hotelId: activeHotel.id,
      roomNumber,
      guestName: `Guest (Room ${roomNumber})`,
      items: orderItems,
      totalAmount: cartTotal,
      specialInstructions: specialInstructions.trim() || 'Room service order'
    })

    setCart({})
    setShowCart(false)
    setSpecialInstructions('')
    setActiveTrackingOrder(created)
    toast.success(`Order ${created.id} confirmed!`, {
      description: `Sent to kitchen for Room ${roomNumber}`
    })
  }

  const liveBaseUrl = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
    ? window.location.origin
    : 'https://splendo-qr-menu-saas.vercel.app'

  const menuQrUrl = `${liveBaseUrl}/?room=${roomNumber}`

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#1c2823] antialiased">
      {/* Sonner Toast Container (Positioned Bottom-Right) */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            backgroundColor: '#173f35',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            fontSize: '13px',
            fontFamily: 'var(--font-inter), sans-serif',
            boxShadow: '0 10px 30px rgba(23,63,53,0.25)',
          },
        }}
      />

      {/* SaaS Global Header — ONLY visible in Staff/Admin mode */}
      {view !== 'guest' && (
        <header className="sticky top-0 z-40 border-b border-[#dfe4dc] bg-[#f8f7f4]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1420px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-10">
            {/* Logo & Hotel Tenant Switcher */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-serif text-white font-bold shadow-xs"
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
            <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#dfe4dc] bg-white/80 p-1 text-xs font-semibold">
              <button
                onClick={() => setView('guest')}
                className="rounded-full px-3.5 py-1.5 transition text-[#6d786f] hover:text-[#173f35]"
              >
                Guest View ➔
              </button>
              <button
                onClick={() => setView('kitchen')}
                className={`rounded-full px-3.5 py-1.5 transition ${view === 'kitchen' ? 'bg-[#173f35] text-white shadow-xs' : 'text-[#6d786f] hover:text-[#173f35]'}`}
              >
                Kitchen Desk
              </button>
              <button
                onClick={() => setView('menu')}
                className={`rounded-full px-3.5 py-1.5 transition ${view === 'menu' ? 'bg-[#173f35] text-white shadow-xs' : 'text-[#6d786f] hover:text-[#173f35]'}`}
              >
                Menu Studio
              </button>
              <button
                onClick={() => setView('qr')}
                className={`rounded-full px-3.5 py-1.5 transition ${view === 'qr' ? 'bg-[#173f35] text-white shadow-xs' : 'text-[#6d786f] hover:text-[#173f35]'}`}
              >
                QR Codes
              </button>
              <button
                onClick={() => setView('super-admin')}
                className={`rounded-full px-3 py-1.5 flex items-center gap-1 transition ${view === 'super-admin' ? 'bg-[#9b714f] text-white shadow-xs' : 'text-[#9b714f] hover:bg-[#9b714f]/10'}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a23]/35 backdrop-blur-xs p-4" role="dialog">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Guest QR Code</p>
                <h2 className="mt-0.5 font-serif text-2xl font-bold text-[#173f35]">Room {roomNumber} Scan</h2>
              </div>
              <button onClick={() => setShowQrModal(false)} className="rounded-full p-2 text-[#718078] hover:bg-[#edf1eb] transition-colors">
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
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dfe4dc] px-4 py-3 text-xs font-semibold text-[#173f35] hover:bg-[#f5f8f4] transition"
              >
                <Copy size={14} /> Copy Link
              </button>
              <a
                href={menuQrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#173f35] px-4 py-3 text-xs font-semibold text-white hover:bg-[#235749] transition"
              >
                <ExternalLink size={14} /> Open Menu
              </a>
            </div>
          </div>
        </div>
      )}

      {/* GUEST ROOM SERVICE FRONT-FACING EXPERIENCE */}
      {view === 'guest' && (
        <section className="mx-auto max-w-[780px] px-4 sm:px-6 py-5 sm:py-8 pb-32">

          {/* 1. ELEGANT REFINED HOTEL HEADER */}
          <header
            className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-[0_8px_30px_rgba(23,63,53,0.18)] transition-all duration-300"
            style={{ backgroundColor: activeHotel.primaryColor || '#173f35' }}
          >
            {/* Subtle background decorative emblem */}
            <div className="absolute -right-6 -bottom-8 pointer-events-none opacity-10 select-none font-serif text-9xl font-bold text-white">
              {activeHotel.logoText || 'S'}
            </div>

            <div className="relative z-10 flex flex-col justify-between gap-4">
              {/* Top Bar: Monogram + Subtitle & Availability Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 border border-white/25 text-base font-serif font-bold text-white shadow-xs">
                    {activeHotel.logoText || 'S'}
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#d9b896]">
                      <UtensilsCrossed size={12} className="inline text-[#d9b896]" /> Room Service
                    </span>
                  </div>
                </div>

                {/* Subtle Availability Indicator */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-medium text-emerald-200 backdrop-blur-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span>Room service available</span>
                </div>
              </div>

              {/* Hotel Main Name */}
              <div className="mt-1">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {activeHotel.name}
                </h1>
                {activeHotel.tagline && (
                  <p className="text-xs text-white/75 mt-0.5 font-normal tracking-wide">
                    {activeHotel.tagline}
                  </p>
                )}
              </div>

              {/* Refined Hairline Separator */}
              <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/15 to-transparent my-1 sm:my-2" />

              {/* Bottom Context Info: Delivering To + Service Hours */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Delivering To
                  </p>
                  <p className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide mt-0.5">
                    Room {roomNumber}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Service Hours
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-white/95 mt-0.5">
                    {activeHotel.serviceHours || '8:00 AM – 10:00 PM'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* STICKY SEARCH & CATEGORY NAVIGATION CONTAINER */}
          <div className="sticky top-0 z-30 pt-4 pb-2 bg-[#f8f7f4]/95 backdrop-blur-md transition-shadow">

            {/* 3. SEARCH BAR */}
            <div className="relative mb-3">
              <div className="flex items-center rounded-2xl border border-[#e2e6e0] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(23,63,53,0.03)] transition-all focus-within:border-[#173f35] focus-within:ring-2 focus-within:ring-[#173f35]/15">
                <Search size={18} className="text-[#7a877e] mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full text-sm bg-transparent text-[#1c2823] placeholder-[#8c988f] focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="rounded-full p-1 text-[#8c988f] hover:bg-[#edf2eb] hover:text-[#173f35] transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* 4. CATEGORY NAVIGATION PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {['Popular', 'Breakfast', 'Mains', 'Desserts', 'Drinks'].map((cat) => {
                const isActive = category === cat
                const catCount = menuItems.filter((i) => cat === 'Popular' || i.category === cat).length

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`whitespace-nowrap flex items-center gap-1.5 rounded-full px-4.5 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-[#173f35] text-white shadow-xs'
                        : 'border border-[#e2e6e0] bg-white text-[#5c6860] hover:border-[#b4c3b4] hover:text-[#173f35]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] font-mono rounded-full px-1.5 py-0.2 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#eef3ef] text-[#6d7b71]'
                    }`}>
                      {catCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5. FOOD ITEM CARDS LIST */}
          <div className="mt-4">
            {isCategoryChanging ? (
              /* Skeleton Card Loading State */
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse grid grid-cols-[90px_1fr_auto] items-center gap-4 rounded-2xl border border-[#e2e6e0] bg-white p-3.5">
                    <div className="h-[90px] w-[90px] rounded-[16px] bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-200" />
                      <div className="h-3 w-5/6 rounded bg-gray-100" />
                      <div className="h-3 w-1/2 rounded bg-gray-200" />
                    </div>
                    <div className="h-8 w-16 rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : visibleItems.length === 0 ? (
              /* 10. EMPTY MENU STATES */
              <div className="mt-8 rounded-2xl border border-dashed border-[#d8ded5] bg-white/80 p-9 text-center shadow-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3ec] text-[#173f35]">
                  <SearchX size={24} />
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold text-[#173f35]">No dishes found</h3>
                <p className="mt-1 text-xs text-[#6e7b72] max-w-sm mx-auto">
                  {searchQuery
                    ? `No items match "${searchQuery}". Try another search or browse a different category.`
                    : `No items available in the "${category}" category yet.`}
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="rounded-full border border-[#173f35] px-4 py-2 text-xs font-semibold text-[#173f35] hover:bg-[#173f35] hover:text-white transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                  {category !== 'Popular' && (
                    <button
                      onClick={() => setCategory('Popular')}
                      className="rounded-full bg-[#173f35] px-4 py-2 text-xs font-semibold text-white hover:bg-[#235749] transition-all"
                    >
                      Browse Popular
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* FOOD CARDS GRID/LIST */
              <div className="space-y-3">
                {visibleItems.map((item) => {
                  const qty = cart[item.id] || 0

                  return (
                    <article
                      key={item.id}
                      className="grid grid-cols-[90px_1fr_auto] sm:grid-cols-[108px_1fr_auto] items-center gap-3.5 sm:gap-5 rounded-2xl border border-[#e2e6e0] bg-white p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(23,63,53,0.03)] hover:shadow-[0_4px_18px_rgba(23,63,53,0.08)] hover:border-[#b8c7b8] transition-all duration-200 group relative"
                    >
                      {/* Column 1: Food Imagery */}
                      <div className="relative w-[90px] h-[90px] sm:w-[108px] sm:h-[108px] rounded-[16px] overflow-hidden bg-[#eef3ef] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 90px, 108px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                            Sold out
                          </div>
                        )}
                      </div>

                      {/* Column 2: Food Title, Description & Pricing/Time */}
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-base sm:text-[17px] font-semibold text-[#173f35] group-hover:text-[#102d26] transition-colors leading-tight">
                            {item.name}
                          </h3>
                          {item.dietary?.map((tag) => (
                            <span key={tag} className="hidden sm:inline-block rounded-full bg-[#edf3ec] px-2 py-0.5 text-[10px] font-semibold text-[#173f35]">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="mt-1 text-xs text-[#5c6860] line-clamp-2 leading-relaxed font-normal">
                          {item.description}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2 text-xs">
                          <span className="font-serif text-base sm:text-[17px] font-bold text-[#173f35]">
                            {activeHotel.currencySymbol}{item.price.toLocaleString()}
                          </span>
                          <span className="text-[#a8b5ab]">•</span>
                          <span className="inline-flex items-center text-[11px] font-medium text-[#738076]">
                            <Clock3 size={12} className="mr-1 text-[#9b714f] inline shrink-0" /> {item.time}
                          </span>
                        </div>
                      </div>

                      {/* Column 3: Add / Quantity Micro-Control */}
                      <div className="flex items-center justify-end shrink-0">
                        {qty > 0 ? (
                          /* 6. ADD TO ORDER QUANTITY CONTROLS */
                          <div className="flex items-center gap-1.5 rounded-full border border-[#173f35]/25 bg-[#173f35]/5 p-1 shadow-inner transition-all duration-200 animate-in zoom-in-95">
                            <button
                              onClick={() => handleRemoveItem(item)}
                              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white text-[#173f35] shadow-xs hover:bg-[#173f35] hover:text-white transition-all active:scale-90"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="w-5 text-center font-mono text-xs font-bold text-[#173f35]">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleAddItem(item)}
                              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#173f35] text-white shadow-xs hover:bg-[#235749] transition-all active:scale-90"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={!item.available}
                            onClick={() => handleAddItem(item)}
                            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                              item.available
                                ? 'border border-[#173f35] text-[#173f35] hover:bg-[#173f35] hover:text-white shadow-xs'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <Plus size={14} strokeWidth={2.5} /> Add
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>

          {/* 7. PERSISTENT ORDER SUMMARY FLOATING BAR */}
          {cartCount > 0 && (
            <div className="fixed bottom-5 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-[540px] animate-in slide-in-from-bottom-5 duration-300">
              <button
                onClick={handleOpenCart}
                className="w-full flex items-center justify-between rounded-full bg-[#173f35] px-5 py-3.5 text-white shadow-2xl hover:bg-[#204e42] active:scale-[0.99] transition-all border border-white/10 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9b714f] text-xs font-bold text-white shadow-xs">
                    {cartCount}
                  </span>
                  <span className="font-semibold text-sm tracking-wide">View Order</span>
                </div>

                <div className="flex items-center gap-2 font-mono font-bold text-sm sm:text-base">
                  <span>{activeHotel.currencySymbol}{cartTotal.toLocaleString()}</span>
                  <span className="text-white/70 ml-1">→</span>
                </div>
              </button>
            </div>
          )}

          {/* 8 & 9. ORDER DRAWER / RETRACTING BOTTOM SHEET */}
          {showCart && (
            <div className={`fixed inset-0 z-50 flex items-end justify-center bg-[#102a23]/40 backdrop-blur-xs transition-opacity duration-300 ${
              isCartRetracting ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
              {/* Backdrop Click */}
              <div className="absolute inset-0" onClick={handleCloseCart} />

              <div className={`relative w-full max-w-xl rounded-t-[28px] sm:rounded-t-3xl bg-white p-6 sm:p-7 shadow-[0_-12px_45px_rgba(16,42,35,0.22)] border-t border-[#e2e6e0] transition-all duration-300 ease-out z-10 max-h-[88vh] flex flex-col ${
                isCartRetracting ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
              }`}>
                {/* Retract Handle Bar */}
                <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d0d7cf] mb-3 hover:bg-[#a8b4a6] transition-colors cursor-pointer shrink-0" onClick={handleCloseCart} />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e4e8e2] pb-4 shrink-0">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b714f]">
                      <ConciergeBell size={12} /> Room {roomNumber} Order
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#173f35] mt-0.5">Your Room Service</h2>
                  </div>
                  <button
                    onClick={handleCloseCart}
                    aria-label="Close order sheet"
                    className="rounded-full p-2 text-[#68766c] hover:bg-[#eff4ee] transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Itemized Order List */}
                <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1 max-h-[260px] no-scrollbar">
                  {menuItems.filter((item) => cart[item.id] > 0).map((item) => {
                    const qty = cart[item.id]
                    const lineTotal = item.price * qty

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#e8ece6] bg-[#fafcf9] p-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-semibold text-sm text-[#173f35] truncate">{item.name}</p>
                          <p className="text-xs text-[#738076] font-mono mt-0.5">
                            {activeHotel.currencySymbol}{item.price.toLocaleString()} × {qty}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5 rounded-full border border-[#173f35]/20 bg-white p-1">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-[#173f35] hover:bg-[#edf2eb] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center font-mono text-xs font-bold text-[#173f35]">{qty}</span>
                            <button
                              onClick={() => addItem(item.id)}
                              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-[#173f35] hover:bg-[#edf2eb] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="font-mono text-sm font-bold text-[#173f35] min-w-[70px] text-right">
                            {activeHotel.currencySymbol}{lineTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 9. SPECIAL INSTRUCTIONS */}
                <div className="mt-4 shrink-0">
                  <label className="block text-xs font-semibold text-[#173f35] mb-1.5">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Add a note for the kitchen (e.g., extra spicy, no onions, please bring cutlery)..."
                    className="w-full rounded-xl border border-[#e0e4dd] bg-[#fafcf9] p-3 text-xs text-[#173f35] placeholder-[#8c988f] focus:border-[#173f35] focus:outline-none focus:ring-1 focus:ring-[#173f35] resize-none"
                  />
                </div>

                {/* Subtotal, Service charge, Total & Action Button */}
                <div className="mt-4 border-t border-[#e4e8e2] pt-4 shrink-0">
                  <div className="space-y-1.5 text-xs text-[#5c6860]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-[#173f35] font-medium">{activeHotel.currencySymbol}{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Service Delivery</span>
                      <span className="font-mono text-emerald-700 font-medium">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#173f35] pt-2 border-t border-[#edf1ec]">
                      <span className="font-serif">Total Amount</span>
                      <span className="font-mono text-lg">{activeHotel.currencySymbol}{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="mt-4 w-full rounded-full bg-[#173f35] py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#235749] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm & Send to Kitchen</span>
                    <span>→</span>
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
              className="mt-2 text-[11px] font-semibold text-[#9b714f] hover:underline cursor-pointer"
            >
              Staff & Hotel Admin Access ➔
            </button>
          </footer>
        </section>
      )}

      {/* STAFF / ADMIN VIEWS */}
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
