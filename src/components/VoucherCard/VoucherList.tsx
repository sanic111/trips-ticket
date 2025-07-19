import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Voucher } from "@/features/voucher/model/voucher.types";
import { fetchMockVouchers } from "@/features/voucher/model/voucher.service";
import VoucherCard from "./VoucherCard";
import { VOUCHER_NOTE } from "@/features/voucher/model/voucher.constants";

export interface VoucherListHandle {
  open: () => void;
  close: () => void;
  reset: () => void;
}

const SESSION_KEY = "appliedVouchersSession";

const VoucherList = forwardRef<VoucherListHandle>((_, ref) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    reset: () => {
      setVouchers((prev) =>
        prev.map((v) => ({ ...v, isApplied: false }))
      );
      sessionStorage.removeItem(SESSION_KEY);
    },
  }));

  useEffect(() => {
    if (!isOpen) return;

    fetchMockVouchers().then((data) => {
      const savedCodes: string[] = JSON.parse(
        sessionStorage.getItem(SESSION_KEY) || "[]"
      );
      const restored = data.map((v) => ({
        ...v,
        isApplied: savedCodes.includes(v.code),
      }));
      setVouchers(restored);
    });
  }, [isOpen]);

  const handleToggle = useCallback((code: string) => {
    setVouchers((prev) => {
      const updated = prev.map((v) =>
        v.code === code ? { ...v, isApplied: !v.isApplied } : v
      );
      const appliedCodes = updated
        .filter((v) => v.isApplied)
        .map((v) => v.code);

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(appliedCodes));
      return updated;
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="listWrapper">
      <div className="note">{VOUCHER_NOTE}</div>
      <div className="voucher">
        {vouchers.map((v) => (
          <VoucherCard key={v.code} voucher={v} onToggleApply={handleToggle} />
        ))}
      </div>
    </div>
  );
});

export default VoucherList;
