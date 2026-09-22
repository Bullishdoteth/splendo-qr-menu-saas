'use client'

import React from 'react'
import { Order, OrderStatus } from '@/lib/types'
import { Bell, CheckCircle2, Clock, CookingPot, Truck, X } from 'lucide-react'

export function OrderTracker({ order, onClose }: { order: Order; onClose: () => void }) {
  const steps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'Received', label: 'Order Received', icon: <Bell size={16} /> },
    { status: 'Preparing', label: 'In Kitchen', icon: <CookingPot size={16} /> },
    { status: 'Out for Delivery', label: 'Out for Delivery', icon: <Truck size={16} /> },
    { status: 'Delivered', label: 'Delivered', icon: <CheckCircle2 size={16} /> },
  ]

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Received': return 0
      case 'Preparing': return 1
      case 'Out for Delivery': return 2
      case 'Delivered': return 3
      default: return 0
    }
  }

  const currentIndex = getStepIndex(order.status)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102a23]/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#edf0eb] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b714f]">Real-time Tracking</span>
            <h2 className="font-serif text-2xl text-[#173f35]">Order {order.id}</h2>
          </div>
          <button onClick={onClose} aria-label="Close tracking" className="rounded-full p-2 text-[#718078] hover:bg-[#edf1eb]">
            <X size={18} />
          </button>
        </div>

        {/* Progress Timeline */}
        <div className="mt-6 space-y-6">
          {steps.map((step, idx) => {
            const isDone = idx <= currentIndex
            const isCurrent = idx === currentIndex

            return (
              <div key={step.status} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    isCurrent
                      ? 'bg-[#173f35] text-white ring-4 ring-[#173f35]/20 animate-pulse'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#edf1eb] text-[#8a948c]'
                  }`}>
                    {step.icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`mt-1 h-8 w-0.5 ${idx < currentIndex ? 'bg-emerald-600' : 'bg-[#edf1eb]'}`} />
                  )}
                </div>

                <div className="pt-1">
                  <p className={`text-sm font-bold ${isDone ? 'text-[#173f35]' : 'text-[#8a948c]'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="mt-0.5 text-xs text-[#9b714f] font-medium">
                      {step.status === 'Received' && 'Kitchen staff notified.'}
                      {step.status === 'Preparing' && 'Chef is preparing your meal.'}
                      {step.status === 'Out for Delivery' && `On the way to Room ${order.roomNumber}.`}
                      {step.status === 'Delivered' && 'Enjoy your meal!'}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Card */}
        <div className="mt-6 rounded-2xl bg-[#f5f7f4] p-4 text-xs">
          <div className="flex justify-between font-semibold text-[#173f35]">
            <span>Delivery Target:</span>
            <span>Room {order.roomNumber}</span>
          </div>
          <div className="mt-2 flex justify-between text-[#718078]">
            <span>Items Ordered:</span>
            <span>{order.items.length} items</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#173f35] py-3 text-xs font-semibold text-white hover:bg-[#235749]"
        >
          Close Tracker
        </button>
      </div>
    </div>
  )
}
