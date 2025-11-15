import type { Lore } from '../api/API'

/**
 * Default test data for Lore items
 * This can be imported in any test file without linting issues
 * Note: Using high-value IDs to avoid collision with placeholder IDs (0-19) in loading states
 */
export const mockLoreData: Lore[] = [
  {
    _id: 'lore-1001',
    title: 'The Ancient Prophecy',
    subtitle: 'A tale of destiny',
    game: 'Fantasy Quest',
    text: 'Long ago, in the age of heroes, a prophecy was written in the stars...',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    _id: 'lore-1002',
    title: 'The Forgotten Temple',
    subtitle: 'Ruins of the old world',
    game: 'Adventure Chronicles',
    text: 'Deep within the jungle lies a temple forgotten by time...',
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
  {
    _id: 'lore-1003',
    title: "The Dragon's Lair",
    subtitle: 'Where fire meets ice',
    game: 'Fantasy Quest',
    text: 'The great dragon Azureth guards its hoard in the frozen mountains...',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]
