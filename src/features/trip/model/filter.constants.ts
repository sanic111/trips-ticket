export const TIME_RANGES = [
  { label: "00:00 - 06:00", start: "00:00", end: "06:00" },
  { label: "06:00 - 12:00", start: "06:00", end: "12:00" },
  { label: "12:00 - 18:00", start: "12:00", end: "18:00" },
  { label: "18:00 - 23:59", start: "18:00", end: "23:59" },
] as const;

export const VEHICLE_TYPES = ["LIMOUSINE", "SLEEPER", "NORMAL"] as const;
export const PRICE_RANGE_LIMIT: [number, number] = [0, 3000000];

// Nếu muốn giới hạn giá tối đa/min:
// export const PRICE_RANGE_LIMIT: [number, number] = [0, 3000000];
