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
    id: "zeus-black-hoodie",
    name: "هودي زيوس الأسود",
    price: 1299,
    category: "هودي",
    badge: "الأكثر مبيعاً",
    image:
      "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "هودي ثقيل الوزن 400GSM. قبعة مبطنة مزدوجة، جيب كانغرو، وأساور مضلعة. شعار ذئب زيوس مطرز على الصدر. مغسول في ظلام تام.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-oversized-tee",
    name: "تيشيرت زيوس أوفرسايز",
    price: 699,
    category: "تيشيرت",
    badge: "جديد",
    image:
      "https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "تيشيرت بوزن 240GSM. أكتاف منسدلة، وحاشية مطولة. رسمة برق زيوس مطبوعة على الظهر. مصمم لأولئك الذين يتحركون بهدف.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-tactical-cargo",
    name: "بنطلون كارغو تكتيكي",
    price: 1799,
    category: "بناطيل",
    image:
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "بنطلون كارغو تكتيكي بـ 6 جيوب. ركبتين مقواتين، وأساور كاحل قابلة للتعديل. قماش قنب مقاوم للتمزق. صُنع للشوارع، صُنع للوحش.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-shadow-jacket",
    name: "جاكيت زيوس الشبح",
    price: 2499,
    category: "جواكت",
    badge: "إصدار محدود",
    image:
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "جاكيت رياضي مع علامة زيوس العاكسة. هيكل مقاوم للماء، بطانة شبكية. جيوب بسحاب. إصدار محدود — بمجرد نفادها، تنتهي.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "zeus-wolf-snapback",
    name: "كاب زيوس الذئب",
    price: 499,
    category: "كابات",
    image:
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "كاب سناب باك بـ 6 ألواح. شعار رأس الذئب مطرز بتقنية 3D. حافة مسطحة مع شريط داخلي. مقاس واحد يناسب الجميع — ذئب واحد يناسب الجميع.",
    sizes: ["ONE SIZE"],
  },
];
