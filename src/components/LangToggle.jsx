import { useLang } from '../i18n/LangContext.jsx'

export default function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="lang-toggle" role="group" aria-label={t('lang.aria')}>
      {['en', 'tr'].map((code) => (
        <button
          key={code}
          type="button"
          className={lang === code ? 'lang-btn active' : 'lang-btn'}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
