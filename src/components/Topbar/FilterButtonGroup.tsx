import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import FilterButton from "./FilterButton";
import TripFilterPopup, { type TripFilterPopupHandle } from "../../features/trip/components/PopUp/TripFilterPopup";
import Icon from "@/assets/icons/Icon";

export type FilterButtonGroupHandle = {
  reset: () => void;
  openFilter: () => void;
};

const FilterButtonGroup = forwardRef<FilterButtonGroupHandle>((_, ref) => {
  const filterPopupRef = useRef<TripFilterPopupHandle>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      // Reset logic if needed
    },
    openFilter: () => {
      filterPopupRef.current?.open();
    },
  }));

  const handleFilterClick = () => {
    filterPopupRef.current?.open();
  };

  return (
    <>
      <FilterButton
        label="Lọc"
        onClick={handleFilterClick}
        className="filterButton"
        icon={<Icon name="filter" className="icon filterIcon" />}
      />
      <TripFilterPopup ref={filterPopupRef} />
    </>
  );
});

export default FilterButtonGroup;