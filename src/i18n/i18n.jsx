import React, { createContext, useContext, useMemo, useState } from 'react'

const I18nContext = createContext({ t: (k)=>k, locale: 'fr', setLocale: ()=>{} })

const fr = {
  login: {
    title: 'Tableau de bord Ricash',
    description: "Connectez-vous à votre espace d'administration",
    otp: {
      code_label: 'Code OTP',
      help: 'Saisissez le code à 4 chiffres.',
      resend: 'Renvoyer le code',
    }
  },
  errors: {
    phone_required: 'Le numéro de téléphone est requis',
    phone_invalid: 'Numéro de téléphone invalide',
    otp_invalid: 'Code OTP invalide',
  }
}

const dictionaries = { fr }

export function I18nProvider({ children, defaultLocale = 'fr' }) {
  const [locale, setLocale] = useState(defaultLocale)
  const dict = dictionaries[locale] || dictionaries.fr
  const t = useMemo(() => (key) => {
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : key), dict)
  }, [dict])
  const value = useMemo(()=> ({ t, locale, setLocale }), [t, locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}


