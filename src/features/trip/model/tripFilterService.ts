import type { Trip } from "./trip.types";
import type { FilterState } from "@/types/filter.types";

// Chuyển giờ dạng "HH:mm" về tổng phút để dễ so sánh
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Lọc theo các tiêu chí trong filter (loại xe, hãng xe, khung giờ, giá)
 */
export function filterTrips(trips: Trip[], filter: FilterState): Trip[] {
  return trips.filter((t) => {
    // Lọc theo hãng xe
    if (
      filter.operators.length > 0 &&
      !filter.operators.includes(t.transport_information.name)
    ) {
      return false;
    }

    // Lọc theo loại xe
    if (
      filter.vehicleTypes.length > 0 &&
      !filter.vehicleTypes.includes(t.vehicle_type.toUpperCase())
    ) {
      return false;
    }

    // Lọc theo khung giờ khởi hành
    if (filter.departureTimes.length > 0) {
      const depMins = timeToMinutes(t.departure_time);
      const inAnyRange = filter.departureTimes.some(
        ({ start, end }) =>
          depMins >= timeToMinutes(start) && depMins <= timeToMinutes(end)
      );
      if (!inAnyRange) return false;
    }

    // Lọc theo khoảng giá
    if (filter.priceRange) {
      const [min, max] = filter.priceRange;
      const discountedPrice = t.fare_amount - (t.discount_amount || 0);
      if (discountedPrice < min || discountedPrice > max) return false;
    }

    return true;
  });
}

/**
 * Sắp xếp danh sách theo tiêu chí: giờ, giá, rating
 */
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
        diff =
          timeToMinutes(a.departure_time) - timeToMinutes(b.departure_time);
        break;
      case "fare_amount":
        diff = a.fare_amount - b.fare_amount;
        break;
      case "rating":
        diff = a.transport_information.rating - b.transport_information.rating;
        break;
    }

    return sortDirection === "asc" ? diff : -diff;
  });

  return arr;
}

/**
 * Hàm tổng hợp: lọc theo ngày, rồi lọc filter, rồi sort
 */
export function applyTripFilterAndSort(
  trips: Trip[],
  filter: FilterState,
  selectedDate: string
): Trip[] {
  let result = trips;

  if (selectedDate) {
    // Biến "20/03" → "20-03"
    const [d, m] = selectedDate.split("/");
    const prefix = `${d}-${m}`; // "20-03"

    result = result.filter((t) => t.departure_date.startsWith(prefix));
  }

  result = filterTrips(result, filter);
  result = sortTrips(result, filter.sortField, filter.sortDirection);
  // console.log("SelectedDate:", selectedDate);
  // console.log(
  //   "TripDates:",
  //   trips.map((t) => t.departure_date)
  // );

  return result;
}
