export interface Voucher {
  code: string;
  discountPercent: number;
  maxAmount: number;
  minTransactionAmount: number;
  expiryDate: string;
  isApplied: boolean;
}
