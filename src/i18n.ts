import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import viCommon from "@/locales/vi/common.json";
import enCommon from "@/locales/en/common.json";
import viDynamic from "@/locales/vi/dynamic.json";
import enDynamic from "@/locales/en/dynamic.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: { 
      translation: viCommon,
      dynamic: viDynamic
    },
    en: { 
      translation: enCommon,
      dynamic: enDynamic
    }
  },
  lng: "vi", // Ngôn ngữ mặc định
  fallbackLng: "vi", // Ngôn ngữ dự phòng
  interpolation: {
    escapeValue: false // React đã xử lý HTML escape
  }
});

export default i18n;  