import rawData from "@/data/locchuyenxe.json";
import type { Trip } from "@/features/trip/model/trip.types";

const TRIPS: Trip[] = (rawData as any).json.coreData.data as Trip[];

export async function loadTripData(): Promise<Trip[]> {
  // Trong tương lai có thể thay bằng API call
  return TRIPS;
}
