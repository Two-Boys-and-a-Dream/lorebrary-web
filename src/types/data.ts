export type Lore = {
  id: string
  title: string
  subtitle: string
  game: string
  text: string
  createdAt: string
  updatedAt: string
}

export type NewLore = Pick<Lore, 'title' | 'subtitle' | 'game' | 'text'>
export type UpdateLore = Partial<NewLore> & { id: string }
