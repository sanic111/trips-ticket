export function formatCurrency(amount: number, locale: string) {
  if (locale === 'en') {
    const usd = amount / 26000; // tỷ giá cố định, có thể thay đổi theo thực tế
    return usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
