import React, {useState, useRef, useEffect, useCallback, useMemo} from "react";
import TripList, {type TripListHandle} from "@/features/trip/components/TripList";
import type {Trip} from "@/features/trip/model/trip.types";
import type {FilterState} from "@/types/filter.types";

interface Props {
    rawTrips: Trip[];
}

const TripListWrapper: React.FC<Props> = ({rawTrips}) => {
    const [filter, setFilter] = useState<FilterState>({
        operators: [],
        vehicleTypes: [],
        departureTimes: [],
        priceRange: null,
        sortField: "departure_time",
        sortDirection: "asc",
    });
    const [selectedDate, setSelectedDate] = useState<string>("");

    const [favorites, setFavorites] = useState<Set<string>>(() => {
        try {
            const stored = localStorage.getItem("favorites");
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    });

    // ref tới TripList để gọi resetPage()
    const tripListRef = useRef<TripListHandle>(null);

    // Các handler: setFilter/setDate rồi gọi resetPage()
    const handleFilterApply = useCallback((e: CustomEvent) => {
        setFilter((prev) => ({
            ...prev,
            operators: e.detail.operators,
            vehicleTypes: e.detail.vehicleTypes,
            departureTimes: e.detail.departureTimes,
            priceRange: e.detail.priceRange,
        }));
    }, []);

    const handleOperatorApply = useCallback((e: CustomEvent) => {
        setFilter((prev) => ({...prev, operators: e.detail.operators}));
    }, []);

    const handleSortChange = useCallback((e: CustomEvent) => {
        setFilter((prev) => ({...prev, ...e.detail}));
    }, []);

    const handleDateChange = useCallback((e: CustomEvent) => {
        const newDate = e.detail;
        setSelectedDate(newDate);
    }, []);
    useEffect(() => {
      console.log("[Wrapper] Trigger resetPage with filter:", filter, "selectedDate:", selectedDate);
        tripListRef.current?.resetPage(); // gọi đúng lúc filter/date thay đổi xong
    }, [filter, selectedDate]);

    // listener các event
    useEffect(() => {
        const events = [
            {name: "trip-filter-apply", handler: handleFilterApply},
            {name: "operator-filter-apply", handler: handleOperatorApply},
            {name: "trip-sort-change", handler: handleSortChange},
            {name: "trip-date-change", handler: handleDateChange},
        ];

        events.forEach(({name, handler}) => window.addEventListener(name, handler as EventListener));
        return () => {
            events.forEach(({name, handler}) => window.removeEventListener(name, handler as EventListener));
        };
    }, [handleFilterApply, handleOperatorApply, handleSortChange, handleDateChange]);

    // persist favorites
    useEffect(() => {
        try {
            localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
        } catch {
            /* silent */
        }
    }, [favorites]);

    const onToggleFavorite = useCallback((uuid: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            next.has(uuid) ? next.delete(uuid) : next.add(uuid);
            return next;
        });
    }, []);
    
const filteredByDate = useMemo(() => {
  if (!selectedDate) return rawTrips;

  const [day, month] = selectedDate.split("/");
  const prefix = `${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
  const matched = rawTrips.filter((trip) =>
    trip.departure_date.startsWith(prefix)
  );

  console.log(`[Wrapper] Selected date: ${selectedDate}`);
  console.log(`[Wrapper] Trips matched after date filter: ${matched.length}`);
  return matched;
}, [rawTrips, selectedDate]);


  const memoizedProps = useMemo(
  () => ({
    rawTrips: filteredByDate,
    filter,
    selectedDate,
    favorites,
    onToggleFavorite,
  }),
  [filteredByDate, filter, selectedDate, favorites, onToggleFavorite]
);

return <TripList ref={tripListRef} {...memoizedProps} />;
};

export default TripListWrapper;
