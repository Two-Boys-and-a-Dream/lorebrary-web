/**
 * Base form fields
 */
export const loreFieldsArr = ['title', 'subtitle', 'game', 'text'] as const

export type LoreField = (typeof loreFieldsArr)[number]
