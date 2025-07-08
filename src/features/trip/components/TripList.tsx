import React from "react";
import TripCard from "@/components/TripCard/TripCard";
import type { Trip } from "@/features/trip/model/trip.types";

export type TripListProps = {
  trips: Trip[];
  favorites: Set<string>;
  onToggleFavorite: (uuid: string) => void;
};

const TripList: React.FC<TripListProps> = React.memo(
  ({ trips, favorites, onToggleFavorite }) => {
    if (trips.length === 0) {
      return (
        <div>
          <p>Không có chuyến nào phù hợp.</p>
        </div>
      );
    }

    return (
      <div>
        {trips.map((trip) => (
          <TripCard
            key={trip.uuid}
            trip={trip}
            uuid={trip.uuid}
            isFavorite={favorites.has(trip.uuid)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    );
  }
);

export default TripList;
