type TranslationKey =
  | "welcome"
  | "findVenue"
  | "viewDetails"
  | "discoverVenue"
  | "homeSearch.title"
  | "homeSearch.description"
  | "homeSearch.select.Country.Placeholder"
  | "homeSearch.select.City.Placeholder"
  | "country.Thailand"
  | "city.ChiangMai"
  | "city.Bangkok"
  | "city.Phuket";

type Language = "en" | "th" | "zh";

type TranslationValue = {
  [K in Language]: string;
};

export const translations = new Map<TranslationKey, TranslationValue>([
  [
    "welcome",
    {
      en: "Welcome to JustBookIt",
      th: "ยินดีต้อนรับสู่ JustBookIt",
      zh: "欢迎使用 JustBookIt",
    },
  ],
  [
    "findVenue",
    {
      en: "Find and book the perfect venue for your next event",
      th: "ค้นหาและจองสถานที่ที่สมบูรณ์แบบสำหรับงานถัดไปของคุณ",
      zh: "为您找到并预订完美的活动场地",
    },
  ],
  [
    "viewDetails",
    {
      en: "View Details",
      th: "ดูรายละเอียด",
      zh: "查看详情",
    },
  ],
  [
    "discoverVenue",
    {
      en: "Discover this amazing venue in {{city}}",
      th: "ค้นพบสถานที่น่าทึ่งนี้ใน {{city}}",
      zh: "在{{city}}探索这个令人惊叹的场地",
    },
  ],
  [
    "homeSearch.title",
    {
      en: "Find and Book Venues",
      th: "ค้นหาและจองสถานที่",
      zh: "查找和预订场地",
    },
  ],
  [
    "homeSearch.description",
    {
      en: "Select your location and category to find available venues",
      th: "เลือกสถานที่และหมวดหมู่ของคุณเพื่อค้นหาสถานที่ที่มีอยู่",
      zh: "选择您的位置和类别以查找可用场地",
    },
  ],
  [
    "homeSearch.select.Country.Placeholder",
    {
      en: "Select Country",
      th: "เลือกประเทศ",
      zh: "选择国家",
    },
  ],
  [
    "homeSearch.select.City.Placeholder",
    {
      en: "Select City",
      th: "เลือกเมือง",
      zh: "选择城市",
    },
  ],
  [
    "country.Thailand",
    {
      en: "Thailand",
      th: "ประเทศไทย",
      zh: "泰国",
    },
  ],
  [
    "city.ChiangMai",
    {
      en: "Chiang Mai",
      th: "เชียงใหม่",
      zh: "清迈",
    },
  ],
  [
    "city.Bangkok",
    {
      en: "Bangkok",
      th: "กรุงเทพฯ",
      zh: "曼谷",
    },
  ],
  [
    "city.Phuket",
    {
      en: "Phuket",
      th: "ภูเก็ต",
      zh: "普吉",
    },
  ],
]);
