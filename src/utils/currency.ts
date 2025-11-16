/**
 * Formatage des prix en Franc CFA (FCFA)
 */

/**
 * Formate un prix en Franc CFA
 * @param price - Le prix à formater
 * @param showCurrency - Afficher le symbole FCFA (défaut: true)
 * @returns Le prix formaté avec le symbole FCFA
 */
export const formatPrice = (price: number, showCurrency: boolean = true): string => {
  // Formater le nombre avec des espaces comme séparateurs de milliers
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
  
  return showCurrency ? `${formatted} FCFA` : formatted
}

/**
 * Formate un prix avec décimales en Franc CFA
 * @param price - Le prix à formater
 * @param showCurrency - Afficher le symbole FCFA (défaut: true)
 * @returns Le prix formaté avec le symbole FCFA
 */
export const formatPriceWithDecimals = (price: number, showCurrency: boolean = true): string => {
  // Formater le nombre avec des espaces comme séparateurs de milliers et 2 décimales
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  
  return showCurrency ? `${formatted} FCFA` : formatted
}

