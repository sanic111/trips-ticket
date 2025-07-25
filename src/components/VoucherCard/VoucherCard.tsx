import React from "react";
import { useTranslation } from "react-i18next";
import type { Voucher } from "@/features/voucher/model/voucher.types";
import { formatCurrency } from "@/ultils/formatCurrency";

export type VoucherCardProps = {
  voucher: Voucher;
  onToggleApply: (code: string) => void;
};

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  onToggleApply,
}) => {
  const { t, i18n } = useTranslation();
  const borderClass = voucher.isApplied ? "applied" : "notApplied";

  return (
    <div className={`voucherCard ${borderClass}`}>
      <div className="VoucherHeader">
        <div className="title">
          {t("voucherCard.discount", {
            percent: voucher.discountPercent,
            amount: formatCurrency(voucher.maxAmount, i18n.language),
          })}
        </div>
      </div>
      <div className="body">
        {t("voucherCard.minTransaction", {
          amount: formatCurrency(voucher.minTransactionAmount, i18n.language),
        })}
      </div>
      <div className="voucherCardFooter">
        {t("voucherCard.expiry", {
          date: new Date(voucher.expiryDate).toLocaleDateString(),
        })}
        <button
          className="toggleButton"
          onClick={() => onToggleApply(voucher.code)}
        >
          {voucher.isApplied
            ? t("voucherCard.cancel")
            : t("voucherCard.apply")}
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;
