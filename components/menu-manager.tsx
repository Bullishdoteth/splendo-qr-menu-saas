'use client'

import React, { useState } from 'react'
import { useSaaS } from '@/lib/saas-context'
import { MenuItem } from '@/lib/types'
import { Check, Edit2, Plus, Power, Trash2, Utensils, X } from 'lucide-react'

export function MenuManager() {
  const { activeHotel, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemStock } = useSaaS()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(15)
  const [category, setCategory] = useState('Popular')
  const [time, setTime] = useState('15-20 min')
  const [image, setImage] = useState('/images/jollof-chicken.png')

  const openAddModal = () => {
    setEditingItem(null)
    setName('')
    setDescription('')
    setPrice(15)
    setCategory('Popular')
    setTime('15-20 min')
    setImage('/images/jollof-chicken.png')
    setIsModalOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setName(item.name)
    setDescription(item.description)
    setPrice(item.price)
    setCategory(item.category)
    setTime(item.time)
    setImage(item.image)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      updateMenuItem(activeHotel.id, {
        ...editingItem,
        name,
        description,
        price,
        category,
        time,
        image
      })
    } else {
      addMenuItem(activeHotel.id, {
        name,
        description,
        price,
        category,
        image,
        time,
        rating: '5.0',
        available: true
      })
    }
    setIsModalOpen(false)
  }

  return (
    <section className="mx-auto max-w-[1420px] px-5 pb-16 pt-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e1e5df] pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b714f]">Menu & Inventory Studio</p>
          <h1 className="mt-1 font-serif text-3xl text-[#173f35]">{activeHotel.name} Room Service Menu</h1>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#235749]"
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {/* Items List */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {activeHotel.menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition ${
              item.available ? 'border-[#e1e5df]' : 'border-rose-200 bg-rose-50/20 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-[#e5eee4] px-2.5 py-1 text-[11px] font-bold text-[#173f35]">
                    {item.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl text-[#173f35]">{item.name}</h3>
                </div>
                <span className="font-mono text-lg font-bold text-[#9b714f]">
                  {activeHotel.currencySymbol}{item.price}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#7a857c]">{item.description}</p>
            </div>

            <div className="mt-6 border-t border-[#edf0eb] pt-4 flex items-center justify-between">
              <button
                onClick={() => toggleMenuItemStock(activeHotel.id, item.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  item.available
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                <Power size={13} /> {item.available ? 'In Stock' : 'Out of Stock'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="rounded-full p-2 text-[#6d786f] hover:bg-[#edf1eb] hover:text-[#173f35]"
                  aria-label="Edit item"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => deleteMenuItem(activeHotel.id, item.id)}
                  className="rounded-full p-2 text-rose-600 hover:bg-rose-50"
                  aria-label="Delete item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a23]/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf0eb] pb-4">
              <h2 className="font-serif text-2xl text-[#173f35]">
                {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-[#718078] hover:bg-[#edf1eb]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173f35]">Item Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Seafood Paella"
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Price ({activeHotel.currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none bg-white"
                  >
                    <option value="Popular">Popular</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173f35]">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients, preparation details..."
                  className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Prep Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 15-20 min"
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173f35]">Image Asset</label>
                  <select
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#dfe4dc] px-4 py-2.5 text-sm focus:border-[#173f35] focus:outline-none bg-white"
                  >
                    <option value="/images/jollof-chicken.png">Jollof Chicken</option>
                    <option value="/images/avocado-toast.png">Avocado Toast</option>
                    <option value="/images/coconut-cake.png">Coconut Cake</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-[#dfe4dc] px-5 py-2.5 text-xs font-semibold text-[#6d786f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173f35] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#235749]"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
