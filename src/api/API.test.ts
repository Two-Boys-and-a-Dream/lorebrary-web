import { describe, test, expect, vi } from 'vitest'
import axios from 'axios'
import API from './API'
import type { Lore, NewLore } from '../types/data'
import { mockLoreData } from '../utils/testData'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('API', () => {
  describe('getAllLore', () => {
    test('fetches all lore successfully', async () => {
      mockedAxios.mockResolvedValue({ data: mockLoreData })

      const result = await API.getAllLore()

      expect(result).toEqual(mockLoreData)
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'get',
        url: 'https://api.example.com/lore',
      })
    })

    test('throws error message when request fails', async () => {
      const errorMessage = 'Network error'
      mockedAxios.mockRejectedValue(new Error(errorMessage))

      await expect(API.getAllLore()).rejects.toBe(errorMessage)
    })

    test('throws generic error for unknown errors', async () => {
      mockedAxios.mockRejectedValue('string error')

      await expect(API.getAllLore()).rejects.toBe('An unknown error occurred')
    })
  })

  describe('getLoreById', () => {
    test('fetches lore by id successfully', async () => {
      const lore = mockLoreData[0]
      mockedAxios.mockResolvedValue({ data: lore })

      const result = await API.getLoreById('1')

      expect(result).toEqual(lore)
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'get',
        url: 'https://api.example.com/lore/1',
      })
    })

    test('throws error message when lore not found', async () => {
      const errorMessage = 'Lore not found'
      mockedAxios.mockRejectedValue(new Error(errorMessage))

      await expect(API.getLoreById('999')).rejects.toBe(errorMessage)
    })
  })

  describe('createLore', () => {
    test('creates new lore successfully', async () => {
      const newLore: NewLore = {
        title: 'New Lore',
        subtitle: 'A new story',
        game: 'Test Game',
        text: 'This is a new lore entry.',
      }

      const createdLore: Lore = {
        ...newLore,
        id: '4',
        createdAt: '2025-01-04T00:00:00.000Z',
        updatedAt: '2025-01-04T00:00:00.000Z',
      }

      mockedAxios.mockResolvedValue({ data: createdLore })

      const result = await API.createLore(newLore)

      expect(result).toEqual(createdLore)
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'post',
        url: 'https://api.example.com/lore',
        data: newLore,
      })
    })

    test('throws error message when creation fails', async () => {
      const newLore: NewLore = {
        title: 'New Lore',
        subtitle: 'A new story',
        game: 'Test Game',
        text: 'This is a new lore entry.',
      }

      const errorMessage = 'Validation error'
      mockedAxios.mockRejectedValue(new Error(errorMessage))

      await expect(API.createLore(newLore)).rejects.toBe(errorMessage)
    })
  })

  describe('updateLore', () => {
    test('updates lore successfully', async () => {
      const updatedLore: Lore = {
        ...mockLoreData[0],
        title: 'Updated Title',
        updatedAt: '2025-01-05T00:00:00.000Z',
      }

      mockedAxios.mockResolvedValue({ data: updatedLore })

      const result = await API.updateLore(updatedLore)

      expect(result).toEqual(updatedLore)
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'post',
        url: 'https://api.example.com/lore/update',
        data: updatedLore,
      })
    })

    test('throws error message when update fails', async () => {
      const updatedLore: Lore = {
        ...mockLoreData[0],
        title: 'Updated Title',
      }

      const errorMessage = 'Update failed'
      mockedAxios.mockRejectedValue(new Error(errorMessage))

      await expect(API.updateLore(updatedLore)).rejects.toBe(errorMessage)
    })
  })

  describe('deleteLore', () => {
    test('deletes lore successfully', async () => {
      mockedAxios.mockResolvedValue({ data: undefined })

      await API.deleteLore('1')

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'delete',
        url: 'https://api.example.com/lore/1',
      })
    })

    test('throws error message when deletion fails', async () => {
      const errorMessage = 'Delete failed'
      mockedAxios.mockRejectedValue(new Error(errorMessage))

      await expect(API.deleteLore('1')).rejects.toBe(errorMessage)
    })
  })
})
