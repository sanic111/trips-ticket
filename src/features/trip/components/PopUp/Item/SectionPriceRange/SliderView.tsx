import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import { PRICE_RANGE_LIMIT } from "@/features/trip/model/filter.constants";

export interface SliderViewHandle {
  getState: () => [number, number];
  setState: (range: [number, number]) => void;
  reset: () => void;
}

interface Props {
  onChange?: (range: [number, number]) => void;
}

const SliderView = forwardRef<SliderViewHandle, Props>(({ onChange }, ref) => {
  const [rawRange, setRawRange] = useState<[number, number]>([...PRICE_RANGE_LIMIT]);

  const update = useCallback((newRaw: [number, number]) => {
    setRawRange(newRaw);
    const sorted: [number, number] =
      newRaw[0] <= newRaw[1] ? newRaw : [newRaw[1], newRaw[0]];
    onChange?.(sorted); // luôn truyền [min, max] ra ngoài
  }, [onChange]);

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.round(Number(e.target.value) / 50000) * 50000;
    update([v, rawRange[1]]);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.round(Number(e.target.value) / 50000) * 50000;
    update([rawRange[0], v]);
  };

  const [posA, posB] = rawRange;
  const [min, max] = posA <= posB ? [posA, posB] : [posB, posA];

  useImperativeHandle(ref, () => ({
    getState: () => [min, max],
    setState: (r) => update(r),
    reset: () => update([...PRICE_RANGE_LIMIT]),
  }));

  return (
    <div className="doubleSlider">
      <input
        type="range"
        min={PRICE_RANGE_LIMIT[0]}
        max={PRICE_RANGE_LIMIT[1]}
        step={50000}
        value={rawRange[0]}
        onChange={handleMin}
        className="thumbMin"
      />
      <input
        type="range"
        min={PRICE_RANGE_LIMIT[0]}
        max={PRICE_RANGE_LIMIT[1]}
        step={50000}
        value={rawRange[1]}
        onChange={handleMax}
        className="thumbMax"
      />
      <div
        className="sliderTrack"
        style={
          {
            "--pos-min": `${(min / PRICE_RANGE_LIMIT[1]) * 100}%`,
            "--pos-max": `${(max / PRICE_RANGE_LIMIT[1]) * 100}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
});


export default SliderView;
