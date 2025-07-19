import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import DateItem, { type DateItemHandle } from "./DateItem";

export type DateListHandle = {
  reset: () => void;
};

interface DateListProps {
  dates: { day: string; date: string }[];
  onSelect: (date: string) => void;
}

const DateList = forwardRef<DateListHandle, DateListProps>(
  ({ dates, onSelect }, ref) => {

    // Refs tới từng DateItem
    const itemRefs = useRef<Record<string, React.RefObject<DateItemHandle | null>>>(
      {}
    );

    // Khởi tạo refs nếu chưa có
    dates.forEach(({ date }) => {
      if (!itemRefs.current[date]) {
        itemRefs.current[date] = React.createRef<DateItemHandle>();
      }
    });

    const handleSelect = useCallback(
      (selectedDate: string) => {
        // deactivate all
        Object.entries(itemRefs.current).forEach(([date, ref]) => {
          if (ref.current) {
            if (date === selectedDate) {
              ref.current.activate();
            } else {
              ref.current.deactivate();
            }
          }
        });

        onSelect(selectedDate);
      },
      [onSelect]
    );

    useImperativeHandle(ref, () => ({
      reset: () => {
        const first = dates[0]?.date;
        if (first) {
          handleSelect(first);
        }
      },
    }));

    return (
      <div className="dateList">
        {dates.map(({ day, date }) => (
          <DateItem
            key={date}
            day={day}
            date={date}
            onSelect={handleSelect}
            ref={itemRefs.current[date]}
          />
        ))}
      </div>
    );
  }
);

export default DateList;
