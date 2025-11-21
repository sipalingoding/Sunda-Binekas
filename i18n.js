// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./locales/resources"; // Import file yang tadi dibuat

i18n
  .use(initReactI18next) // integrasi dengan react-i18next
  .init({
    resources,
    lng: "su", // Bahasa Utama (Default) = Sunda
    fallbackLng: "su", // Jika terjemahan tidak ada, kembali ke Sunda
    interpolation: {
      escapeValue: false, // React sudah aman dari XSS
    },
  });

export default i18n;