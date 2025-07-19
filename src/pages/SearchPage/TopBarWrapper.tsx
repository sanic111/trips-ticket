import React, {useEffect, useRef} from "react";
import TopBar from "@/components/Topbar/TopBar";
import type {Trip} from "@/features/trip/model/trip.types";
import type {FilterState} from "@/types/filter.types";

const initialFilter: FilterState = {
    operators: [],
    vehicleTypes: [],
    departureTimes: [],
    priceRange: null,
    sortField: "departure_time",
    sortDirection: "asc",
};

interface Props {
    rawTrips: Trip[];
}

const TopBarWrapper: React.FC<Props> = ({rawTrips}) => {
  const onDateChange = (date: string) => {
    window.dispatchEvent(new CustomEvent("trip-date-change", {detail: date}));
  };

  return <TopBar onDateChange={onDateChange} trips={rawTrips} />;
};
export default TopBarWrapper;
