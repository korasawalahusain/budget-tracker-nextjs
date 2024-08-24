export const Currencies = {
  IND: { value: "IND", label: "₹ RUPEE", locale: "en-IN" },
  USD: { value: "USD", label: "$ DOLLAR", locale: "en-US" },
  EUR: { value: "EUR", label: "€ EURO", locale: "de-DE" },
  JPY: { value: "JPY", label: "¥ YEN", locale: "ja-JP" },
  GBP: { value: "GBP", label: "£ POUND", locale: "en-GB" },
};

export type Currency = typeof Currencies.EUR;
export type CurrencyKey = keyof typeof Currencies;
