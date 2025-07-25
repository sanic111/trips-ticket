import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import TripCard from "@/components/TripCard/TripCard";
import type { Trip } from "@/features/trip/model/trip.types";
import type { FilterState } from "@/types/filter.types";
import { applyTripFilterAndSort } from "@/features/trip/model/tripFilterService";

export interface TripListHandle {
  resetPage: () => void;
}

export type TripListProps = {
  rawTrips: Trip[];
  filter: FilterState;
  favorites: Set<string>;
  onToggleFavorite: (uuid: string) => void;
};

const PAGE_SIZE = 20;

const TripList = forwardRef<TripListHandle, TripListProps>(
  ({ rawTrips, filter, favorites, onToggleFavorite }, ref) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef(1);
    const [visibleTrips, setVisibleTrips] = useState<Trip[]>([]);
    const filteredTripsRef = useRef<Trip[]>([]);

    // Áp dụng filter và sort
    const applyFilter = useCallback(() => {
      console.log(`[TripList] applyFilter RUNNING`);
      console.log("→ received filter =", filter);

      const filtered = applyTripFilterAndSort(rawTrips, filter);
      console.log(`[TripList] After filtering: ${filtered.length} trips`);

      filteredTripsRef.current = filtered;
      pageRef.current = 1;
      setVisibleTrips(filtered.slice(0, PAGE_SIZE));
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [rawTrips, filter]);

    // Load more khi scroll
    const loadMore = useCallback(() => {
      const nextPage = pageRef.current + 1;
      const maxPage = Math.ceil(filteredTripsRef.current.length / PAGE_SIZE);
      if (nextPage > maxPage) return;
      pageRef.current = nextPage;
      setVisibleTrips(filteredTripsRef.current.slice(0, nextPage * PAGE_SIZE));
    }, []);

    const handleScroll = useCallback(() => {
      const el = containerRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    }, [loadMore]);

    // Chạy applyFilter khi dependency thay đổi
    useEffect(() => {
       console.log("[TripList] useEffect triggered → applyFilter");
      applyFilter();
    }, [applyFilter]);

    // Thiết lập scroll listener
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Expose API cho wrapper
    useImperativeHandle(ref, () => ({
      resetPage: applyFilter,
    }), [applyFilter]);

    const hasMore = visibleTrips.length < filteredTripsRef.current.length;

    return (
      <div ref={containerRef} style={{ overflowY: "auto", height: "100%", paddingTop: "2rem" }}>
        {visibleTrips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            {t("noTripsFound")}
          </div>
        ) : (
          visibleTrips.map((trip) => (
            <TripCard
              key={trip.uuid}
              trip={trip}
              uuid={trip.uuid}
              isFavorite={favorites.has(trip.uuid)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
        {hasMore && (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            {t("loadingMore")}
          </div>
        )}
      </div>
    );
  }
);

export default React.memo(TripList);