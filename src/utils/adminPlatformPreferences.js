export const ADMIN_PLATFORM_PREFERENCES_KEY = "admin_platform_preferences";
export const ADMIN_PLATFORM_PREFERENCES_EVENT = "admin-platform-preferences-updated";

export const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "USD - US Dollar", locale: "en-US" },
  { code: "EUR", label: "EUR - Euro", locale: "de-DE" },
  { code: "GBP", label: "GBP - British Pound Sterling", locale: "en-GB" },
  { code: "JPY", label: "JPY - Japanese Yen", locale: "ja-JP" },
  { code: "PHP", label: "PHP - Philippine Peso", locale: "en-PH" },
  { code: "SGD", label: "SGD - Singapore Dollar", locale: "en-SG" },
];

const CURRENCY_RATE_FROM_USD = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  PHP: 56.1,
  SGD: 1.35,
};

const CURRENCY_CODE_SET = new Set(SUPPORTED_CURRENCIES.map((item) => item.code));

export const DEFAULT_ADMIN_PLATFORM_PREFERENCES = {
  platformName: "CertiCode",
  supportEmail: "support@certicode.com",
  currency: "USD",
  timezone: "EST",
};

export const normalizeAdminCurrency = (value) => {
  const code = String(value || "").toUpperCase().trim();
  return CURRENCY_CODE_SET.has(code)
    ? code
    : DEFAULT_ADMIN_PLATFORM_PREFERENCES.currency;
};

export const getCurrencyMeta = (currencyCode) => {
  const code = normalizeAdminCurrency(currencyCode);
  return (
    SUPPORTED_CURRENCIES.find((item) => item.code === code) ||
    SUPPORTED_CURRENCIES[0]
  );
};

export const loadAdminPlatformPreferences = () => {
  try {
    const raw = localStorage.getItem(ADMIN_PLATFORM_PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_ADMIN_PLATFORM_PREFERENCES };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_PLATFORM_PREFERENCES,
      ...(parsed && typeof parsed === "object" ? parsed : {}),
      currency: normalizeAdminCurrency(parsed?.currency),
    };
  } catch {
    return { ...DEFAULT_ADMIN_PLATFORM_PREFERENCES };
  }
};

export const saveAdminPlatformPreferences = (nextPreferences) => {
  const merged = {
    ...DEFAULT_ADMIN_PLATFORM_PREFERENCES,
    ...loadAdminPlatformPreferences(),
    ...(nextPreferences && typeof nextPreferences === "object"
      ? nextPreferences
      : {}),
  };
  merged.currency = normalizeAdminCurrency(merged.currency);

  localStorage.setItem(ADMIN_PLATFORM_PREFERENCES_KEY, JSON.stringify(merged));
  window.dispatchEvent(
    new CustomEvent(ADMIN_PLATFORM_PREFERENCES_EVENT, { detail: merged }),
  );
  return merged;
};

export const subscribeAdminPlatformPreferences = (callback) => {
  if (typeof callback !== "function") return () => {};

  const handleCustomEvent = (event) => {
    callback(event?.detail || loadAdminPlatformPreferences());
  };

  const handleStorage = (event) => {
    if (event.key !== ADMIN_PLATFORM_PREFERENCES_KEY) return;
    callback(loadAdminPlatformPreferences());
  };

  window.addEventListener(ADMIN_PLATFORM_PREFERENCES_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(
      ADMIN_PLATFORM_PREFERENCES_EVENT,
      handleCustomEvent,
    );
    window.removeEventListener("storage", handleStorage);
  };
};

// Backend dashboard metrics are currently returned in USD. This converts them
// for display when the admin selects a different platform currency.
export const convertDashboardAmountFromUsd = (amount, targetCurrency) => {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return 0;
  const rate = CURRENCY_RATE_FROM_USD[normalizeAdminCurrency(targetCurrency)] ?? 1;
  return numeric * rate;
};

export const formatAdminCurrency = (amount, currencyCode) => {
  const normalizedCurrency = normalizeAdminCurrency(currencyCode);
  const { locale } = getCurrencyMeta(normalizedCurrency);
  const converted = convertDashboardAmountFromUsd(amount, normalizedCurrency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: normalizedCurrency,
    minimumFractionDigits: normalizedCurrency === "JPY" ? 0 : 2,
    maximumFractionDigits: normalizedCurrency === "JPY" ? 0 : 2,
  }).format(converted);
};

