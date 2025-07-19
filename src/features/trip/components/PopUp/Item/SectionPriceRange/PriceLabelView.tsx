import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { PRICE_RANGE_LIMIT } from "@/features/trip/model/filter.constants";

export interface PriceLabelViewHandle {
  setState: (range: [number, number]) => void;
  reset: () => void;
}

const PriceLabelView = forwardRef<PriceLabelViewHandle>((_, ref) => {
  const [range, setRange] = useState<[number, number]>([...PRICE_RANGE_LIMIT]);

  useImperativeHandle(ref, () => ({
    setState: (r) => setRange(r),
    reset: () => setRange([...PRICE_RANGE_LIMIT]),
  }));

const [min, max] = range[0] <= range[1] ? range : [range[1], range[0]];

  return (
    <div className="priceRange">
      <span>{min.toLocaleString()} đ</span>
      <span>{max.toLocaleString()} đ</span>
    </div>
  );
});

export default PriceLabelView;
