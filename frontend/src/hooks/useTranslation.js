import { useAppContext } from '../context/AppContext';
import { translations } from '../translations/translations';

export function useTranslation() {
  const { state } = useAppContext();
  const lang = state.language || 'en';
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
  return { t, lang };
}
