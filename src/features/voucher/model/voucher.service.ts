import type { Voucher } from "@/features/voucher/model/voucher.types";

export function fetchMockVouchers(): Promise<Voucher[]> {
  // Ở đây tạm hard-code, sau này có thể replace bằng fetch API thật
  return Promise.resolve([
    {
      code: "XEKHACH100",
      discountPercent: 8,
      maxAmount: 100000,
      minTransactionAmount: 0,
      expiryDate: "2025-07-01",
      isApplied: true,
    },
    {
      code: "SUMMER50",
      discountPercent: 5,
      maxAmount: 20000,
      minTransactionAmount: 0,
      expiryDate: "2025-07-01",
      isApplied: false,
    },
    // … thêm mock nếu cần
  ]);
}
