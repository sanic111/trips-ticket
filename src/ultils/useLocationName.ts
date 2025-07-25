import { useTranslation } from "react-i18next";

export const useLocationName = (locationId: number | string): string => {
  const { t } = useTranslation();
  
  // Convert to string for consistency
  const id = String(locationId);
  
  // Sử dụng key locations.{id} từ file dịch
  const locationName = t(`locations.${id}`, { defaultValue: `Unknown Location (${id})` });
  
  return locationName;
};