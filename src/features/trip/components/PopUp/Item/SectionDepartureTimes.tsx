import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { TIME_RANGES } from "@/features/trip/model/filter.constants";
import type { TimeRange } from "@/types/filter.types";

export interface SectionDepartureTimesHandle {
  getState: () => TimeRange[];
  setState: (s: TimeRange[]) => void;
  reset: () => void;
}

interface ItemHandle {
  get: () => boolean;
  set: (v: boolean) => void;
}

const TimeRangeItem = forwardRef(
  (
    { range }: { range: TimeRange },
    ref: React.Ref<ItemHandle>
  ) => {
    const [render, setRender] = useState(0);
    const selectedRef = useRef(false);

    const toggle = () => {
      selectedRef.current = !selectedRef.current;
      setRender((r) => r + 1);
    };

    useImperativeHandle(ref, () => ({
      get: () => selectedRef.current,
      set: (v) => {
        selectedRef.current = v;
        setRender((r) => r + 1);
      },
    }));

    return (
      <button onClick={toggle} className={selectedRef.current ? "selected" : ""}>
        {range.label}
      </button>
    );
  }
);

const SectionDepartureTimes = forwardRef<SectionDepartureTimesHandle>((_, ref) => {
  const refs = useRef<Record<string, React.RefObject<ItemHandle | null>>>({});

  TIME_RANGES.forEach((range) => {
    if (!refs.current[range.label]) {
      refs.current[range.label] = React.createRef();
    }
  });

  useImperativeHandle(ref, () => ({
    getState: () =>
      TIME_RANGES.filter((range) =>
        refs.current[range.label]?.current?.get()
      ),
    setState: (selectedRanges) => {
      TIME_RANGES.forEach((range) =>
        refs.current[range.label]?.current?.set(
          selectedRanges.some((r) => r.label === range.label)
        )
      );
    },
    reset: () => {
      TIME_RANGES.forEach((range) =>
        refs.current[range.label]?.current?.set(false)
      );
    },
  }));

  return (
    <div className="section">
      <div className="sectionHeader"><h4>Giờ đi</h4></div>
      <div className="timeOptions">
        {TIME_RANGES.map((range) => (
          <TimeRangeItem key={range.label} ref={refs.current[range.label]} range={range} />
        ))}
      </div>
    </div>
  );
});

export default SectionDepartureTimes;
