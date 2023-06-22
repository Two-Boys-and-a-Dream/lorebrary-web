import axios from 'axios'

class API {
    #url
    constructor() {
        this.#url = process.env.API_URL
    }

    /**
     * Reusable axios function for convenience.
     * Bubbles error.message upwards for React Query.
     * @param {string} route
     * @param {object} config
     * @returns {Promise<any>}
     */
    async #axiosHandler(route, config = {}) {
        try {
            const result = await axios({
                method: 'get',
                url: this.#url + route,
                ...config,
            })

            return result.data
        } catch (error) {
            throw error.message
        }
    }

    /**
     * Returns all lore in database
     */
    async getAllLore() {
        return this.#axiosHandler('lore')
    }

    /**
     * Creates new lore in database
     */
    async createLore(newLore) {
        return this.#axiosHandler('lore', { method: 'post', data: newLore })
    }

    /**
     * Deletes lore by _id in database
     */
    async deleteLore(_id) {
        return this.#axiosHandler(`lore/${_id}`, { method: 'delete' })
    }
}

export default new API()
