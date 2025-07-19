import React, { useState, forwardRef, useImperativeHandle } from "react";
import clsx from "clsx";

export type DateItemHandle = {
  activate: () => void;
  deactivate: () => void;
  getDate: () => string;
};

interface DateItemProps {
  day: string;
  date: string;
  onSelect?: (date: string) => void;
}

const DateItem = forwardRef<DateItemHandle, DateItemProps>(({ day, date, onSelect }, ref) => {
  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    activate: () => setActive(true),
    deactivate: () => setActive(false),
    getDate: () => date,
  }));

  return (
    <div
      className={clsx("dateItem", { active })}
      onClick={() => {
        if (!active) {
          onSelect?.(date);
        }
      }}
    >
      <div className="day">{day}</div>
      <div className="date">{date}</div>
    </div>
  );
});

export default DateItem;
