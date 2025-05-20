export const VALID_ICONS = [
  "cart-outline",
  "calendar-outline",
  "tv-outline",
  "analytics-outline",
  "book-outline",
  "barbell-outline",
  "cloud-outline",
  "film-outline",
  "heart-outline",
  "pricetag-outline",
  "star-outline",
  "apps-outline",
  "cash-outline",
  "laptop-outline",
  "gift-outline",
  "home-outline",
] as const;

export type IconName = (typeof VALID_ICONS)[number];
