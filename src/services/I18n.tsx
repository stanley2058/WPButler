import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import rosetta from "rosetta";
import { translation as en, type TranslationType } from "./translation/en";
import { translation as zhTW } from "./translation/zh-tw";
import { translation as zhCN } from "./translation/zh-cn";

type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;
export type I18nKey = FlattenObjectKeys<TranslationType>;

const LOCALE_STORAGE_KEY = "demo-butler-preferred-locale";

export const supportedLocales = ["en", "zhTW", "zhCN"] as const;
type SupportedLocale = (typeof supportedLocales)[number];
function isSupportedLocale(locale: unknown): locale is SupportedLocale {
  if (typeof locale !== "string") return false;
  return (supportedLocales as readonly string[]).includes(locale);
}

const i18n = rosetta({
  en,
  zhTW,
  zhCN,
});

i18n.locale(getLocale());
document.documentElement.lang = i18n.t("localeCode");

const LocaleContext = createContext<{
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}>({ locale: getLocale(), setLocale: () => {} });

export function LocaleContextProvider({ children }: PropsWithChildren<{}>) {
  const [locale, setLocaleState] = useState(getLocale());
  const setLocale = useCallback((locale: SupportedLocale) => {
    if (!isSupportedLocale(locale)) return;
    i18n.locale(locale);
    setLocalePersist(locale);
    setLocaleState(locale);
    document.documentElement.lang = i18n.t("localeCode");
  }, []);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

type I18n = Omit<typeof i18n, "t"> & {
  t: <X extends Record<string, any> | any[]>(
    key: I18nKey,
    params?: X,
    lang?: SupportedLocale,
  ) => string;
};
export function useTranslation() {
  useLocale();
  return i18n as I18n;
}

export function getTranslation() {
  return i18n as I18n;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function getLocale() {
  const locale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (!isSupportedLocale(locale)) {
    window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    return "zhTW";
  }
  return locale;
}

export function setLocalePersist(locale: SupportedLocale) {
  if (!isSupportedLocale(locale)) return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
