/** Price formatting: 144999 → "Rs. 144,999" (en-PK, no decimals). */
export function usePrice() {
  const nf = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })
  return {
    format: (n: number) => `Rs. ${nf.format(n)}`,
  }
}
