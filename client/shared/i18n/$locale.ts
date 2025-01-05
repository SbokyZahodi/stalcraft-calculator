interface ILocale {
  ru: string
  en: string
}

export default (value: ILocale) => {
  const { locale } = useI18n()

  return computed(() => locale.value === 'ru' ? value.ru : value.en)
}
