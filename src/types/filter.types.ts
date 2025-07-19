export type SortField = "departure_time" | "fare_amount" | "rating";

export interface TimeRange {
  label: string;
  start: string;
  end: string;
}

export type FilterState = {
  operators: string[];
  vehicleTypes: string[];
  departureTimes: TimeRange[];
  priceRange: [number, number] | null;
  sortField: "departure_time" | "fare_amount" | "rating";
  sortDirection: "asc" | "desc";
};
