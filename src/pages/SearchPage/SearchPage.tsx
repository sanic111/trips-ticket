import React from "react";
import { useState } from "react";
import TopBarWrapper from "@/pages/SearchPage/TopBarWrapper";
import TripListWrapper from "@/pages/SearchPage/TripListWrapper";  
import { loadTripData } from "@/services/dataService";
import type { Trip } from "@/features/trip/model/trip.types";

const SearchPage: React.FC = () => {
const [rawTrips, setRawTrips] = useState<Trip[]>([]);
  

  React.useEffect(() => {
    loadTripData().then(setRawTrips);
  }, []);

  return (
    <div className="searchPage">
      <TopBarWrapper rawTrips={rawTrips} />
      <TripListWrapper rawTrips={rawTrips} />
    </div>
  );
};

export default SearchPage;
