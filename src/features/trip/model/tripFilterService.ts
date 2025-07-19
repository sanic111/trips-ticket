import type { Trip } from "./trip.types";
import type { FilterState } from "@/types/filter.types";

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export function filterTrips(trips: Trip[], filter: FilterState): Trip[] {
  return trips.filter((t) => {
    if (
      filter.operators.length > 0 &&
      !filter.operators.includes(t.transport_information.name)
    ) return false;

    if (
      filter.vehicleTypes.length > 0 &&
      !filter.vehicleTypes.includes(t.vehicle_type.toUpperCase())
    ) return false;

    if (filter.departureTimes.length > 0) {
      const depMins = timeToMinutes(t.departure_time);
      const inAnyRange = filter.departureTimes.some(
        ({ start, end }) =>
          depMins >= timeToMinutes(start) && depMins <= timeToMinutes(end)
      );
      if (!inAnyRange) return false;
    }

    if (filter.priceRange) {
      const [min, max] = filter.priceRange;
      const discounted = t.fare_amount - (t.discount_amount || 0);
      if (discounted < min || discounted > max) return false;
    }

    return true;
  });
}

export function sortTrips(
  trips: Trip[],
  sortField: FilterState["sortField"],
  sortDirection: FilterState["sortDirection"]
): Trip[] {
  const arr = [...trips];
  arr.sort((a, b) => {
    let diff = 0;
    switch (sortField) {
      case "departure_time":
        diff = timeToMinutes(a.departure_time) - timeToMinutes(b.departure_time);
        break;
      case "fare_amount":
        diff = (a.fare_amount - (a.discount_amount || 0)) - (b.fare_amount - (b.discount_amount || 0));
        break;
      case "rating":
        diff = a.transport_information.rating - b.transport_information.rating;
        break;
    }
    return sortDirection === "asc" ? diff : -diff;
  });
  return arr;
}

export function applyTripFilterAndSort(
  trips: Trip[],
  filter: FilterState
): Trip[] {
  const t0 = performance.now();

  let result = filterTrips(trips, filter);
  const t1 = performance.now();

  result = sortTrips(result, filter.sortField, filter.sortDirection);
  const t2 = performance.now();

  console.log(
    `[Filter] Time: conditionFilter=${(t1 - t0).toFixed(1)}ms, sort=${(t2 - t1).toFixed(1)}ms, total=${(t2 - t0).toFixed(1)}ms`
  );
  console.log(`[Filter] Final result count: ${result.length}`);

  return result;
}
