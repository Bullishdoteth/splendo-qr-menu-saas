'use client'

import React, { useState } from 'react'
import { useSaaS } from '@/lib/saas-context'
import { OrderStatus } from '@/lib/types'
import { Bell, CheckCircle2, Clock, CookingPot, PackageCheck, ShoppingBag, Truck, Volume2 } from 'lucide-react'

export function KitchenDesk() {
  const { activeHotel, orders, updateOrderStatus } = useSaaS()
  const [statusFilter, setStatusFilter] = useState<string>('Active')

  const hotelOrders = orders.filter((o) => o.hotelId === activeHotel.id)

  const activeOrders = hotelOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
  const completedOrders = hotelOrders.filter((o) => o.status === 'Delivered')

  const filteredOrders = statusFilter === 'Active'
    ? activeOrders
    : statusFilter === 'All'
    ? hotelOrders
    : hotelOrders.filter((o) => o.status === statusFilter)

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Received':
        return <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800"><Bell size={13} /> New Order</span>
      case 'Preparing':
        return <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800"><CookingPot size={13} /> Preparing</span>
      case 'Out for Delivery':
        return <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800"><Truck size={13} /> On the way</span>
      case 'Delivered':
        return <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800"><CheckCircle2 size={13} /> Delivered</span>
      case 'Cancelled':
        return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">Cancelled</span>
    }
  }

  return (
    <section className="mx-auto max-w-[1420px] px-5 pb-16 pt-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e1e5df] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Live Kitchen & Staff Terminal</p>
          </div>
          <h1 className="mt-1 font-serif text-3xl text-[#173f35]">{activeHotel.name} Orders Desk</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#dfe4dc] bg-white px-4 py-2 text-xs font-semibold text-[#173f35]">
            <Volume2 size={15} className="text-emerald-600" />
            <span>Audio Alerts Active</span>
          </div>
          <div className="rounded-full bg-[#173f35] px-4 py-2 text-xs font-bold text-white">
            {activeOrders.length} Pending Orders
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['Active', 'All', 'Received', 'Preparing', 'Out for Delivery', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                statusFilter === tab
                  ? 'bg-[#173f35] text-white shadow-sm'
                  : 'border border-[#dfe4dc] bg-white text-[#6d786f] hover:border-[#9eb0a4]'
              }`}
            >
              {tab} {tab === 'Active' ? `(${activeOrders.length})` : tab === 'Delivered' ? `(${completedOrders.length})` : ''}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#8a948c]">Real-time synchronization enabled</p>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-[#d1d9cf] bg-white/70 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e5eee4] text-[#173f35]">
            <PackageCheck size={28} />
          </div>
          <h3 className="mt-4 font-serif text-xl text-[#173f35]">No orders matching filter</h3>
          <p className="mt-1 text-sm text-[#718078]">New guest orders placed via room QR codes will appear here instantly.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition shadow-sm ${
                order.status === 'Received'
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-[#e1e5df]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-lg bg-[#173f35] px-3 py-1 font-mono text-sm font-bold text-white">
                      Room {order.roomNumber}
                    </span>
                    <p className="mt-2 text-xs font-medium text-[#7d8980]">{order.guestName}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#8a948c]">
                      <Clock size={11} /> {order.createdAt}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="mt-4 border-t border-[#edf0eb] pt-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs">
                      <div>
                        <span className="font-semibold text-[#173f35]">{item.quantity}x {item.menuItem.name}</span>
                        {item.notes && <p className="text-[11px] italic text-amber-700">Note: {item.notes}</p>}
                      </div>
                      <span className="font-mono text-[#718078]">{activeHotel.currencySymbol}{item.menuItem.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900 border border-amber-200">
                    <span className="font-semibold">Guest Note:</span> {order.specialInstructions}
                  </div>
                )}
              </div>

              {/* Card Footer & Action Button */}
              <div className="mt-5 border-t border-[#edf0eb] pt-3">
                <div className="flex items-center justify-between text-sm font-bold text-[#173f35] mb-3">
                  <span>Total Bill:</span>
                  <span className="font-mono text-base">{activeHotel.currencySymbol}{order.totalAmount}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === 'Received' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white transition hover:bg-amber-600"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                      className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      Send for Room Delivery
                    </button>
                  )}
                  {order.status === 'Out for Delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
                    >
                      Confirm Delivered
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <div className="w-full rounded-xl bg-emerald-50 py-2 text-center text-xs font-bold text-emerald-700 border border-emerald-200">
                      Order Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
