import React from "react";
import type { Voucher } from "@/features/voucher/model/voucher.types";

export type VoucherCardProps = {
  voucher: Voucher;
  onToggleApply: (code: string) => void;
};

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  onToggleApply,
}) => {
  const borderClass = voucher.isApplied ? "applied" : "notApplied";

  return (
    <div className={`voucherCard ${borderClass}`}>
      <div className="VoucherHeader">
        <div className="title">
          Giảm {voucher.discountPercent}% tối đa{" "}
          {voucher.maxAmount.toLocaleString()} đ
        </div>
      </div>
      <div className="body">
        Áp dụng cho giao dịch từ{" "}
        {voucher.minTransactionAmount.toLocaleString()} đ
      </div>
      <div className="voucherCardFooter">
        HSD: {new Date(voucher.expiryDate).toLocaleDateString()}
        <button
          className="toggleButton"
          onClick={() => onToggleApply(voucher.code)}
        >
          {voucher.isApplied ? "Hủy bỏ" : "Áp dụng"}
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;
