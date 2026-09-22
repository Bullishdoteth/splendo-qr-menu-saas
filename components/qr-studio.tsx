'use client'

import React, { useState } from 'react'
import { useSaaS } from '@/lib/saas-context'
import { RoomCode } from '@/lib/types'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, ExternalLink, Plus, Printer, QrCode, Sparkles } from 'lucide-react'

export function QRStudio() {
  const { activeHotel, bulkGenerateRooms } = useSaaS()

  const [selectedRoom, setSelectedRoom] = useState<RoomCode>(activeHotel.rooms[0] || {
    id: 'default',
    roomNumber: '101',
    floor: '1st Floor',
    guestName: 'Available',
    status: 'Ready'
  })

  // Bulk Generator State
  const [showGenerator, setShowGenerator] = useState(false)
  const [startNum, setStartNum] = useState(201)
  const [count, setCount] = useState(5)
  const [floorPrefix, setFloorPrefix] = useState('2nd Floor')

  const liveBaseUrl = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
    ? window.location.origin
    : 'https://splendo-qr-menu-saas.vercel.app'

  const selectedUrl = `${liveBaseUrl}/?room=${selectedRoom.roomNumber}`

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bulkGenerateRooms(activeHotel.id, startNum, count, floorPrefix)
    setShowGenerator(false)
  }

  return (
    <section className="mx-auto max-w-[1420px] px-5 pb-16 pt-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#e1e5df] pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Room QR Code Studio</p>
          <h1 className="mt-1 font-serif text-3xl text-[#173f35]">{activeHotel.name} Room Codes</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 rounded-full border border-[#dfe4dc] bg-white px-4 py-2.5 text-xs font-bold text-[#173f35] hover:bg-[#f5f7f4]"
          >
            <Plus size={15} /> Bulk Add Rooms
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#235749]"
          >
            <Printer size={15} /> Print Selected Code
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        {/* Rooms Selection Table */}
        <div className="rounded-2xl border border-[#e1e5df] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#173f35]">Active Room Directory</h2>
              <p className="mt-1 text-xs text-[#8a948c]">{activeHotel.rooms.length} assigned QR codes</p>
            </div>
            <span className="rounded-full bg-[#e5eee4] px-3 py-1 text-xs font-bold text-[#4d7b61]">
              Live QR Encoding
            </span>
          </div>

          <div className="mt-5 grid gap-2 max-h-[500px] overflow-y-auto pr-1">
            {activeHotel.rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  selectedRoom.id === room.id
                    ? 'border-[#173f35] bg-[#f2f6f0] ring-1 ring-[#173f35]/20'
                    : 'border-[#edf0eb] hover:bg-[#fafbf8]'
                }`}
              >
                <div>
                  <p className="font-semibold text-[#173f35]">Room {room.roomNumber}</p>
                  <p className="mt-0.5 text-xs text-[#8a948c]">{room.guestName} · {room.floor}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  room.status === 'Active' ? 'bg-[#e5eee4] text-[#4d7b61]' : 'bg-[#f1ede4] text-[#9b714f]'
                }`}>
                  {room.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="rounded-3xl bg-[#e5eee4] p-8 text-center border border-[#b9cdbd] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Printable Room Tent</span>
            <h2 className="mt-2 font-serif text-3xl text-[#173f35]">Room {selectedRoom.roomNumber}</h2>
            <p className="mt-1 text-xs text-[#718078]">
              {selectedRoom.guestName === 'Available' ? 'Ready for guest check-in' : `Assigned to ${selectedRoom.guestName}`}
            </p>

            {/* High-res QR code container */}
            <div className="mx-auto mt-6 flex size-64 items-center justify-center rounded-2xl bg-white p-4 shadow-md border border-[#c3d6c7]">
              <QRCodeSVG
                value={selectedUrl}
                size={220}
                bgColor="#ffffff"
                fgColor={activeHotel.primaryColor || '#173f35'}
                level="H"
                includeMargin
              />
            </div>

            <p className="mt-4 break-all font-mono text-[11px] text-[#546b5a]">{selectedUrl}</p>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => navigator.clipboard?.writeText(selectedUrl)}
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#b9cdbd] bg-white px-4 py-3 text-xs font-semibold text-[#173f35] hover:bg-[#f5f8f4]"
            >
              <Copy size={14} /> Copy Link
            </button>
            <a
              href={selectedUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-4 py-3 text-xs font-semibold text-white hover:bg-[#235749]"
            >
              <ExternalLink size={14} /> Test Live
            </a>
          </div>
        </div>
      </div>

      {/* Bulk Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a23]/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#9b714f]" size={20} />
              <h2 className="font-serif text-2xl text-[#173f35]">Bulk Add Rooms</h2>
            </div>
            <p className="mt-1 text-xs text-[#718078]">Generate sequential room QR codes for keycards and table tents.</p>

            <form onSubmit={handleBulkSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173f35]">Starting Room Number</label>
                <input
                  type="number"
                  required
                  value={startNum}
                  onChange={(e) => setStartNum(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#173f35]">Number of Rooms to Create</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#173f35]">Floor Label</label>
                <input
                  type="text"
                  required
                  value={floorPrefix}
                  onChange={(e) => setFloorPrefix(e.target.value)}
                  placeholder="e.g. 2nd Floor"
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerator(false)}
                  className="rounded-full border border-[#dfe4dc] px-4 py-2 text-xs font-semibold text-[#6d786f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173f35] px-5 py-2 text-xs font-semibold text-white hover:bg-[#235749]"
                >
                  Generate {count} Rooms
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
