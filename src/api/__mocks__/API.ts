import { vi } from 'vitest'
import type { Lore, NewLore } from '../API'
import { mockLoreData } from '../../utils/testData'

// Mock implementation of the API class
const API = {
  getAllLore: vi.fn().mockResolvedValue(mockLoreData),

  createLore: vi.fn().mockImplementation((newLore: NewLore): Promise<Lore> => {
    const lore: Lore = {
      _id: `${mockLoreData.length + 1}`,
      ...newLore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return Promise.resolve(lore)
  }),

  deleteLore: vi.fn().mockResolvedValue(undefined),

  updateLore: vi.fn().mockImplementation((updatedLore: Lore): Promise<Lore> => {
    return Promise.resolve({
      ...updatedLore,
      updatedAt: new Date().toISOString(),
    })
  }),

  getLoreById: vi.fn().mockImplementation((_id: string): Promise<Lore> => {
    const lore = mockLoreData.find((l) => l._id === _id)
    if (lore) {
      return Promise.resolve(lore)
    }
    return Promise.reject(new Error('Lore not found'))
  }),
}

export default API
