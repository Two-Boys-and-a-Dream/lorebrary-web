import { loreFieldsArr, LoreField } from './constants'

export interface FormFieldData {
  name: string
  value: string
  error: boolean
}

export type FormData = Record<LoreField, FormFieldData> & {
  [key: string]: FormFieldData
}

export function buildInitialFormData(
  existingData: Partial<Record<LoreField, string>> = {}
): FormData {
  return loreFieldsArr.reduce(
    (o, key) => ({
      ...o,
      [key]: {
        name: key,
        value: existingData[key] || '',
        error: false,
      },
    }),
    {} as FormData
  )
}
