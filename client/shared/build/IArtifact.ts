export interface IArtifact {
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
    value: {
      min: number
      max: number
    }
  }[]
  additional_stats: IArtifactAdditional[]
}

export interface IArtifactAdditional {
  id: string
  lines: {
    ru: string
    en: string
  }
  value: {
    min: number
    max: number
  }
}
