import { loreFieldsArr } from './constants'

export function buildInitialFormData(existingData = {}) {
  return loreFieldsArr.reduce(
    (o, key) => ({
      ...o,
      [key]: {
        name: key,
        value: existingData[key] || '',
        error: false,
      },
    }),
    {}
  )
}
