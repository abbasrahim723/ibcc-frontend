export type CurrencyCode = string

/**
 * Formats a number with currency prefix. If compact is true, it will convert
 * to K/M/B with one decimal when appropriate.
 */
export function formatAmount(
  value: number | string | null | undefined,
  currency: CurrencyCode = 'PKR',
  options: { compact?: boolean } = {}
): string {
  const num = Number(value || 0)
  const symbol = currency?.toUpperCase() === 'PKR' ? 'Rs' : currency || ''

  if (options.compact) {
    const abs = Math.abs(num)
    let suffix = ''
    let divisor = 1

    if (abs >= 1_000_000_000) {
      suffix = 'B'
      divisor = 1_000_000_000
    } else if (abs >= 1_000_000) {
      suffix = 'M'
      divisor = 1_000_000
    } else if (abs >= 1_000) {
      suffix = 'K'
      divisor = 1_000
    }

    if (divisor > 1) {
      const compactVal = (num / divisor).toFixed(1).replace(/\.0$/, '')
      return `${symbol} ${compactVal}${suffix}`
    }
  }

  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(num)
  return `${symbol} ${formatted}`
}

/**
 * Formats a number without any currency prefix (useful for plain charts).
 */
export function formatNumberCompact(value: number | string | null | undefined): string {
  return formatAmount(value, '', { compact: true }).trim()
}
