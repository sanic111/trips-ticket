// import type { Trip } from "@/features/trip/model/trip.types";

// /**
//  * Lấy danh sách chuyến xe theo trang với phân trang đơn giản
//  */

// export const getTripsByPage = (
//   trips: Trip[],
//   page: number,
//   limit: number
// ): { trips: Trip[]; total: number } => {
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   return {
//     trips: trips.slice(start, end),
//     total: trips.length,
//   };
// };
