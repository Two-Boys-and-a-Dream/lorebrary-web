import axios, { type AxiosRequestConfig } from 'axios'

export interface Lore {
  _id: string
  title: string
  subtitle: string
  game: string
  text: string
  createdAt?: string
  updatedAt?: string
}

export type NewLore = Omit<Lore, '_id' | 'createdAt' | 'updatedAt'>

class API {
  #url: string

  constructor() {
    this.#url = String(import.meta.env.VITE_API_URL)
  }

  /**
   * Reusable axios function for convenience.
   * Bubbles error.message upwards for React Query.
   * @param route - API route to call
   * @param config - Axios configuration object
   * @returns Promise with response data
   */
  async #axiosHandler<T>(
    route: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const result = await axios({
        method: 'get',
        url: this.#url + route,
        ...config,
      })

      return result.data
    } catch (error) {
      if (error instanceof Error) {
        throw error.message
      }
      throw 'An unknown error occurred'
    }
  }

  /**
   * Returns all lore in database
   */
  async getAllLore(): Promise<Lore[]> {
    return this.#axiosHandler<Lore[]>('/lore')
  }

  /**
   * Creates new lore in database
   */
  async createLore(newLore: NewLore): Promise<Lore> {
    return this.#axiosHandler<Lore>('/lore', { method: 'post', data: newLore })
  }

  /**
   * Deletes lore by _id in database
   */
  async deleteLore(_id: string): Promise<void> {
    return this.#axiosHandler<void>(`/lore/${_id}`, { method: 'delete' })
  }

  /**
   * Updates lore by _id
   */
  async updateLore(updatedLore: Lore): Promise<Lore> {
    return this.#axiosHandler<Lore>('/lore/update', {
      method: 'post',
      data: updatedLore,
    })
  }

  async getLoreById(_id: string): Promise<Lore> {
    return this.#axiosHandler<Lore>(`/lore/${_id}`)
  }
}

export default new API()
