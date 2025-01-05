export interface IArmor {
  id: string
  icon: string
  category: string
  locale: {
    ru: string
    en: string
  }
  values: {
    name: {
      ru: string
      en: string
    }
    value: number
  }[]
}
