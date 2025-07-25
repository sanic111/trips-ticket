import React from "react";
import {useState} from "react";
import TopBarWrapper from "@/pages/SearchPage/TopBarWrapper";
import TripListWrapper from "@/pages/SearchPage/TripListWrapper";
import {loadTripData} from "@/services/dataService";
import type {Trip} from "@/features/trip/model/trip.types";

const SearchPage: React.FC = () => {
    const [rawTrips, setRawTrips] = useState<Trip[]>([]);

    React.useEffect(() => {
        loadTripData().then(setRawTrips);
    }, []);

    return (
        <div className="searchPage">
            <div className="topBarWrapper">
                <TopBarWrapper rawTrips={rawTrips} />
            </div>
            <div className="tripListWrapper">
                <TripListWrapper rawTrips={rawTrips} />
            </div>
        </div>
    );
};

export default SearchPage;
