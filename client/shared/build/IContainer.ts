export interface IContainer {
  id: string
  icon: string
  category: string
  name: {
    lines: {
      ru: string
      en: string
    }
  }
  protection: number
  capacity: number
  values: {
    name: {
      lines: {
        ru: string
        en: string
      }
    }
    value: number
  }[]
}
