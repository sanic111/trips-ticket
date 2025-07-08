import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import TopBar from "@/features/trip/components/TopBar";
import TripList from "@/features/trip/components/TripList";
import type { FilterState } from "@/types/filter.types";
import type { Trip } from "@/features/trip/model/trip.types";
import { loadTripData } from "@/services/dataService";
import { applyTripFilterAndSort } from "@/features/trip/model/tripFilterService";

const PAGE_SIZE = 20;
const initialFilter: FilterState = {
  operators: [],
  vehicleTypes: [],
  departureTimes: [],
  priceRange: null,
  sortField: "departure_time",
  sortDirection: "asc",
};

export default React.memo(function SearchPage() {
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [rawTrips, setRawTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [visibleTrips, setVisibleTrips] = useState<Trip[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const tripListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTripData().then(setRawTrips);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    const result = applyTripFilterAndSort(rawTrips, filter, selectedDate);
    setFilteredTrips(result);
    setCurrentPage(1);
    setVisibleTrips(result.slice(0, PAGE_SIZE));
  }, [rawTrips, filter, selectedDate]);

  useEffect(() => {
    setVisibleTrips(filteredTrips.slice(0, currentPage * PAGE_SIZE));
  }, [currentPage, filteredTrips]);

  const onFilterChange = useCallback((f: FilterState) => {
    setFilter(f);
  }, []);

  const onDateChange = useCallback((d: string) => {
    setSelectedDate(d);
  }, []);

  const toggleFavorite = useCallback((uuid: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }, []);

  const handleScroll = useCallback(() => {
    const container = tripListRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setCurrentPage((prev) => {
        const maxPage = Math.ceil(filteredTrips.length / PAGE_SIZE);
        return prev < maxPage ? prev + 1 : prev;
      });
    }
  }, [filteredTrips.length]);

  useEffect(() => {
    const container = tripListRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="searchPage">
      <TopBar
        filter={filter}
        onFilterChange={onFilterChange}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        trips={rawTrips}
      />

      <div className="tripListWrapper" ref={tripListRef}>
        <TripList
          trips={visibleTrips}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        {visibleTrips.length < filteredTrips.length && (
          <div className="loadingMore">Đang tải thêm...</div>
        )}
      </div>
    </div>
  );
});
