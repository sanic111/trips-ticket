import React from "react";
import clsx from "clsx";

type Props = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

const FilterButton: React.FC<Props> = ({
  label,
  active = false,
  onClick,  
  icon,
  className,
}) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <button
      className={clsx(
        "filterButton",
        { active, withIcon: !!icon },
        className
      )}
      onClick={handleClick}
    >
      <span className="buttonLabel">{label}</span>
      {icon && <span className="buttonIcon">{icon}</span>}
    </button>
  );
};

export default FilterButton;