import React from "react";
import clsx from "clsx";

type DateItemProps = {
  day: string;
  date: string;
  active?: boolean;
  onClick?: () => void;
};

const DateItem: React.FC<DateItemProps> = React.memo(
  ({ day, date, active, onClick }) => {
    return (
      <div
        className={clsx("dateItem", { active })}
        onClick={onClick}
      >
        <div className="day">{day}</div>
        <div className="date">{date}</div>
      </div>
    );
  }
);

export default DateItem;
