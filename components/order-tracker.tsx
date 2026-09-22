'use client'

import React, { useState } from 'react'
import { Order, OrderStatus } from '@/lib/types'
import { Bell, CheckCircle2, CookingPot, Truck, X } from 'lucide-react'

export function OrderTracker({ order, onClose }: { order: Order; onClose: () => void }) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 260)
  }

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
    <div className={`fixed inset-0 z-50 flex items-end justify-center bg-[#102a23]/40 backdrop-blur-xs transition-opacity duration-300 ${
      isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Backdrop overlay click to retract */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Bottom Drawer Container */}
      <div className={`relative w-full max-w-xl rounded-t-[28px] sm:rounded-t-3xl bg-white p-6 sm:p-7 shadow-[0_-12px_45px_rgba(16,42,35,0.22)] border-t border-[#e2e6e0] transition-all duration-300 ease-out z-10 max-h-[85vh] overflow-y-auto ${
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        {/* Retract handle bar */}
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d0d7cf] mb-4 hover:bg-[#a8b4a6] transition-colors cursor-pointer shrink-0" onClick={handleClose} />

        <div className="flex items-center justify-between border-b border-[#edf0eb] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b714f]">Real-time Tracking</span>
            <h2 className="font-serif text-2xl font-bold text-[#173f35] mt-0.5">Order {order.id}</h2>
          </div>
          <button onClick={handleClose} aria-label="Close tracking drawer" className="rounded-full p-2 text-[#718078] hover:bg-[#edf1eb] transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Progress Timeline */}
        <div className="mt-6 space-y-5">
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
                    <div className={`mt-1 h-7 w-0.5 ${idx < currentIndex ? 'bg-emerald-600' : 'bg-[#edf1eb]'}`} />
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
        <div className="mt-6 rounded-2xl bg-[#f5f7f4] border border-[#e4e9e2] p-4 text-xs">
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
          onClick={handleClose}
          className="mt-6 w-full rounded-full bg-[#173f35] py-3.5 text-xs font-semibold text-white hover:bg-[#235749] transition-all active:scale-[0.99] shadow-md cursor-pointer"
        >
          Retract & Close Tracker
        </button>
      </div>
    </div>
  )
}
