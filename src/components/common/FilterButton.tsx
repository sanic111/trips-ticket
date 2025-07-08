import React from "react";
import clsx from "clsx";

type FilterButtonProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  active,
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      className={clsx(
        "filterButton", // luôn giữ class gốc trước
        {
          "active": active,
          "withIcon": !!icon,
        },
        className // gắn class bổ sung từ props
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      {icon && <span className="filterIcon">{icon}</span>}
    </button>
  );
};

export default FilterButton;
