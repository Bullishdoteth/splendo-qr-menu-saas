'use client'

import React, { useState } from 'react'
import { useSaaS } from '@/lib/saas-context'
import { Building2, CreditCard, DollarSign, Plus, ShieldCheck, TrendingUp, Users, X } from 'lucide-react'

export function SuperAdmin() {
  const { hotels, orders, addHotel, setActiveHotelId } = useSaaS()

  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [symbol, setSymbol] = useState('$')
  const [primaryColor, setPrimaryColor] = useState('#173f35')
  const [plan, setPlan] = useState<'Free' | 'Pro' | 'Enterprise'>('Pro')

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalOrders = orders.length

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) return
    addHotel({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      tagline: 'Luxury guest room service experience.',
      logoText: name.charAt(0).toUpperCase(),
      primaryColor,
      accentColor: '#9b714f',
      currency,
      currencySymbol: symbol,
      address: '100 Boulevard, City Center',
      serviceHours: '24/7 Service',
      plan
    })
    setIsAddHotelOpen(false)
    setName('')
    setSlug('')
  }

  return (
    <section className="mx-auto max-w-[1420px] px-5 pb-16 pt-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#e1e5df] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-700" size={18} />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Platform Owner Control Panel</p>
          </div>
          <h1 className="mt-1 font-serif text-3xl text-[#173f35]">Splendo SaaS Overview</h1>
        </div>

        <button
          onClick={() => setIsAddHotelOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#235749]"
        >
          <Plus size={16} /> Onboard New Hotel Tenant
        </button>
      </div>

      {/* Platform Metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#e1e5df] bg-white p-5">
          <p className="text-xs text-[#7d8980]">Active Hotels</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-serif text-3xl text-[#173f35]">{hotels.length}</p>
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-800"><Building2 size={18} /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e1e5df] bg-white p-5">
          <p className="text-xs text-[#7d8980]">Total Room Orders</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-serif text-3xl text-[#173f35]">{totalOrders}</p>
            <div className="rounded-full bg-blue-100 p-2 text-blue-800"><TrendingUp size={18} /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e1e5df] bg-white p-5">
          <p className="text-xs text-[#7d8980]">Platform Volume (GMV)</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-serif text-3xl text-[#173f35]">${totalGMV}</p>
            <div className="rounded-full bg-amber-100 p-2 text-amber-800"><DollarSign size={18} /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e1e5df] bg-white p-5">
          <p className="text-xs text-[#7d8980]">SaaS Monthly Recurring</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-serif text-3xl text-[#173f35]">$1,280</p>
            <div className="rounded-full bg-[#e5eee4] p-2 text-[#173f35]"><CreditCard size={18} /></div>
          </div>
        </div>
      </div>

      {/* Tenants List Table */}
      <div className="mt-10 rounded-2xl border border-[#e1e5df] bg-white overflow-hidden">
        <div className="border-b border-[#edf0eb] p-5">
          <h2 className="font-serif text-2xl text-[#173f35]">Subscribed Hotel Tenants</h2>
          <p className="mt-1 text-xs text-[#8a948c]">Manage active hotel clients, custom domains, and subscription tiers.</p>
        </div>

        <div className="divide-y divide-[#edf0eb]">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-serif text-white font-bold shadow-sm"
                  style={{ backgroundColor: hotel.primaryColor || '#173f35' }}
                >
                  {hotel.logoText}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#173f35]">{hotel.name}</h3>
                  <p className="text-xs text-[#8a948c]">/{hotel.slug} · {hotel.rooms.length} Rooms · Currency: {hotel.currencySymbol}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#e5eee4] px-3 py-1 text-xs font-bold text-[#4d7b61]">
                  {hotel.plan} Plan
                </span>
                <button
                  onClick={() => setActiveHotelId(hotel.id)}
                  className="rounded-full border border-[#dfe4dc] px-4 py-2 text-xs font-semibold text-[#173f35] hover:bg-[#f5f8f4]"
                >
                  Switch Workspace →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboard Hotel Modal */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a23]/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf0eb] pb-4">
              <h2 className="font-serif text-2xl text-[#173f35]">Onboard New Hotel</h2>
              <button onClick={() => setIsAddHotelOpen(false)} className="rounded-full p-2 text-[#718078] hover:bg-[#edf1eb]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHotel} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173f35]">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grand Hyatt Lagos"
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173f35]">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="grand-hyatt"
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Currency Code</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="USD, EUR, NGN"
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Currency Symbol</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="$, €, ₦"
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Primary Brand Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-[#dfe4dc] p-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Subscription Tier</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as 'Free' | 'Pro' | 'Enterprise')}
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none bg-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro ($99/mo)</option>
                    <option value="Enterprise">Enterprise ($299/mo)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddHotelOpen(false)}
                  className="rounded-full border border-[#dfe4dc] px-5 py-2.5 text-xs font-semibold text-[#6d786f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173f35] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#235749]"
                >
                  Create Hotel Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
