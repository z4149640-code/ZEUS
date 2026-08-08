export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  badge?: string;
};

export const products: Product[] = [
  {
    id: "zeus-black-tee-grillz",
    name: "تيشيرت The Next — أسود",
    price: 799,
    category: "تيشيرت",
    badge: "الأكثر مبيعاً",
    image: "/1ffb6811-5b98-419d-bb9e-01decb9d4b4b-Photoroom.webp",
    images: [
      "/1ffb6811-5b98-419d-bb9e-01decb9d4b4b-Photoroom.webp",
      "/258752b5-7038-4c1e-9872-7302f7924cae-Photoroom.webp",
    ],
    description:
      "تيشيرت أوفرسايز ثقيل الوزن 280GSM. طباعة Grillz معدنية فاخرة على الصدر. قماش قطن 100% — لأولئك الذين يتحركون بهدف.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-white-tee-grillz",
    name: "تيشيرت The Next — أبيض",
    price: 799,
    category: "تيشيرت",
    badge: "جديد",
    image: "/258752b5-7038-4c1e-9872-7302f7924cae-Photoroom.webp",
    images: [
      "/258752b5-7038-4c1e-9872-7302f7924cae-Photoroom.webp",
      "/1ffb6811-5b98-419d-bb9e-01decb9d4b4b-Photoroom.webp",
    ],
    description:
      "تيشيرت أوفرسايز أبيض 280GSM. نفس طباعة Grillz المعدنية على خلفية ناصعة البياض. قطعة تلفت الأنظار في كل مكان.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-black-camo-tee",
    name: "God's Art On Display — أسود",
    price: 899,
    category: "تيشيرت",
    badge: "إصدار محدود",
    image: "/89b94f55-405c-4874-af29-57e49807b237-Photoroom.webp",
    images: [
      "/89b94f55-405c-4874-af29-57e49807b237-Photoroom.webp",
      "/30a7dfa9-9790-44e7-8dea-01eaff7f8440-Photoroom.webp",
    ],
    description:
      "تيشيرت أوفرسايز كروب بطباعة Camo ضخمة. نص بولد — God's Art On Display. قماش 300GSM ثقيل فاخر.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-white-camo-tee",
    name: "God's Art On Display — أبيض",
    price: 899,
    category: "تيشيرت",
    image: "/30a7dfa9-9790-44e7-8dea-01eaff7f8440-Photoroom.webp",
    images: [
      "/30a7dfa9-9790-44e7-8dea-01eaff7f8440-Photoroom.webp",
      "/89b94f55-405c-4874-af29-57e49807b237-Photoroom.webp",
    ],
    description:
      "النسخة البيضاء من God's Art On Display. Camo رمادي على خلفية بيضاء — تناقض قوي وجريء.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-script-shorts",
    name: "شورت The Next Generation",
    price: 699,
    category: "شورت",
    badge: "جديد",
    image: "/IMG-1411.webp",
    images: ["/IMG-1411.webp"],
    description:
      "شورت أسود بطباعة خط سكريبت فاخر — The Next Generation. خامة فليس ناعمة 320GSM مع حزام وبيه شريط أبيض. راحة وأناقة بدون تنازلات.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];
