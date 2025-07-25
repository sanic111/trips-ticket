import { useTranslation } from "react-i18next";

export const useDynamicTranslation = () => {
  const { t } = useTranslation('dynamic');
  
  const translateLocation = (locationName: string): string => {
    // Sử dụng key locations.{locationName} từ file dynamic.json
    return t(`locations.${locationName}`, { defaultValue: locationName });
  };
  
  const translateOperator = (operatorName: string): string => {
    // Sử dụng key operators.{operatorName} từ file dynamic.json
    return t(`operators.${operatorName}`, { defaultValue: operatorName });
  };
  
  return { translateLocation, translateOperator };
};