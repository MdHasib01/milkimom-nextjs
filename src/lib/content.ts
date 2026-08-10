export const siteConfig = {
  name: "মিল্কিমম",
  nameEn: "Milkimom",
  tagline: "Make Mother Great Again",
  phone: "+8801517102603",
  phoneDisplay: "01517-102603",
  messenger: "https://www.facebook.com/milkimom?_rdr",
  email: "milkimominfo@gmail.com",
  address: "202-J, Road-6, Mohammadiya Housing society, Mohammadpur, Dhaka.",
};

export const navLinks = [
  { href: "#benefits", label: "উপকারিতা" },
  { href: "#compare", label: "তুলনা" },
  { href: "#reviews", label: "রিভিউ" },
  { href: "#faq", label: "প্রশ্নোত্তর" },
];

export const trustBadges = [
  { title: "১০০% প্রাকৃতিক উপাদান", icon: "leaf" as const },
  { title: "BSTI সার্টিফাইড", icon: "shield-check" as const },
  { title: "ডাক্তার সুপারিশকৃত", icon: "stethoscope" as const },
  { title: "পার্শ্বপ্রতিক্রিয়াবিহীন", icon: "heart-pulse" as const },
];

export const benefits = [
  {
    accent: "বুকের দুধ",
    rest: "স্থায়ীভাবে বাড়ায়",
  },
  {
    accent: "বন্ধ হয়ে যাওয়া",
    rest: "বুকের দুধ পুনরায় তৈরি করে",
  },
  {
    accent: "বুকের দুধের",
    rest: "সব পুষ্টিগুণ বজায় রাখে",
  },
  {
    accent: "বুকের দুধ",
    rest: "পাতলা হলে ঘন করে",
  },
  {
    accent: "ফর্মুলা দুধের",
    rest: "খরচ বাঁচায়",
  },
];

export const flavors = [
  {
    id: "dark-chocolate",
    name: "ডার্ক চকলেট",
    nameEn: "Dark Chocolate",
    icon: "cookie" as const,
    tag: "সবচেয়ে জনপ্রিয়",
    description: "রিচ, গভীর ও চকলেটি মজায় ভরপুর",
    popular: true,
    image: "/images/product-jar.webp",
    accentBg: "bg-[#4A261D]/10 border-[#4A261D]/25",
    accentGradient: "from-[#4A261D]/20 to-[#8D493A]/30",
  },
  {
    id: "vanilla",
    name: "ভ্যানিলা",
    nameEn: "Vanilla",
    icon: "ice-cream-cone" as const,
    description: "মিষ্টি, স্মুথ ও ভ্যানিলার মধুর ছোঁয়ায়",
    popular: false,
    image: "/images/product-jar.webp",
    accentBg: "bg-amber-500/10 border-amber-500/25",
    accentGradient: "from-[#F59E0B]/20 to-[#FBBF24]/30",
  },
  {
    id: "cardamom",
    name: "কার্ডামম (এলাচ)",
    nameEn: "Cardamom",
    icon: "leaf" as const,
    description: "এলাচের ঘ্রাণে এক অনন্য মজার স্বাদ",
    popular: false,
    image: "/images/product-jar.webp",
    accentBg: "bg-emerald-500/10 border-emerald-500/25",
    accentGradient: "from-[#059669]/20 to-[#34D399]/30",
  },
  {
    id: "cinnamon",
    name: "সিনামন (দারুচিনি)",
    nameEn: "Cinnamon",
    icon: "flame" as const,
    description: "দারুচিনির উষ্ণতা, স্বাদে করে তোলে আরও স্পেশাল",
    popular: false,
    image: "/images/product-jar.webp",
    accentBg: "bg-orange-500/10 border-orange-500/25",
    accentGradient: "from-[#EA580C]/20 to-[#FB923C]/30",
  },
];

export const comparisonRows = [
  { milkimom: "পার্মানেন্ট সলিউশন", other: "সাময়িক সমাধান" },
  { milkimom: "১ ডোজই যথেষ্ট", other: "বারবার খেতে হয়" },
  { milkimom: "ব্রেস্টফিডিং এর শেষ পর্যন্ত বুকের দুধ থাকে", other: "বুকের দুধ স্থায়ীভাবে বজায় নাও থাকতে পারে" },
  { milkimom: "খেতে হালকা মিষ্টি ও ৪টি ফ্লেভারে পাওয়া যায়", other: "স্বাদ ভালো নাও হতে পারে" },
  { milkimom: "বিশ্বব্যাপী স্বীকৃত", other: "সবার জন্য একই রকম কার্যকর নাও হতে পারে" },
  { milkimom: "৬+ বছরের গবেষণার মাধ্যমে ক্লিনিক্যালি প্রুভড", other: "সাইডইফেক্ট থাকতে পারে" },
  { milkimom: "১০০% ইম্পোর্টেড, রেয়ার ও ন্যাচারাল উপাদানে তৈরি", other: "সীমিত উপাদান" },
  { milkimom: "সম্পূর্ণ সাইডইফেক্ট মুক্ত", other: "লং-টার্ম সাপোর্ট কম" },
  {
    milkimom: "বাবু সাক না করলেও বা পাম্প ব্যবহার করলেও বুকের দুধ বৃদ্ধি করতে সাহায্য করে",
    other: "পাম্প ব্যবহারকারীদের জন্য পর্যাপ্ত সাপোর্ট নাও থাকতে পারে",
  },
];

export const testimonials = [
  {
    name: "সুমাইয়া আক্তার",
    location: "ঢাকা",
    rating: 5,
    text: "৩ দিনের মধ্যেই পার্থক্য বুঝতে পেরেছি। বাচ্চা এখন পেট ভরে দুধ পাচ্ছে, আলহামদুলিল্লাহ।",
    avatar: "/assets/reviewer/girl1.jpeg",
  },
  {
    name: "নাজনীন সুলতানা",
    location: "চট্টগ্রাম",
    rating: 5,
    text: "ফর্মুলা মিল্কের পেছনে অনেক টাকা খরচ হচ্ছিল। মিল্কিমম শুরু করার পর থেকে সেই দুশ্চিন্তা নেই।",
    avatar: "/assets/reviewer/girl2.jpeg",
  },
  {
    name: "ফারজানা ইয়াসমিন",
    location: "সিলেট",
    rating: 5,
    text: "স্বাদটাও দারুণ, খেতে কোনো সমস্যা হয়নি। ডাক্তারও দেখে অবাক হয়েছেন উন্নতি দেখে।",
    avatar: "/assets/reviewer/girl3.jpeg",
  },
  {
    name: "তাহমিনা হক",
    location: "রাজশাহী",
    rating: 5,
    text: "প্রসবের পর খুব দুর্বল লাগছিল। এখন মিল্কিমম খেয়ে অনেক চাঙ্গা অনুভব করি এবং বাচ্চা পেট ভরে দুধ পাচ্ছে।",
    avatar: "/assets/reviewer/girl4.jpeg",
  },
  {
    name: "রাবেয়া সুলতানা",
    location: "খুলনা",
    rating: 5,
    text: "বুকের দুধ বৃদ্ধি পাওয়ার পাশাপাশি আমার শরীরের দুর্বলতা দূর হয়েছে। খুব দ্রুত এবং স্থায়ী রেজাল্ট পেয়েছি!",
    avatar: "/assets/reviewer/girl1.jpeg",
  },
  {
    name: "শারমিন জাহান",
    location: "বরিশাল",
    rating: 5,
    text: "প্রথমেই কাজ করবে কি না একটু দ্বিধায় ছিলাম, কিন্তু ব্যবহারের ২-৩ দিনের মধ্যেই দারুণ পরিবর্তন লক্ষ করেছি। শতভাগ সন্তুষ্ট!",
    avatar: "/assets/reviewer/girl2.jpeg",
  },
];


export const singleJarPrice = {
  label: "১ জার",
  regularPrice: 8990,
  salePrice: 4990,
  perJarDays: 15,
};

export const smoothflowSingleJarPrice = {
  label: "১ জার",
  regularPrice: 3290,
  salePrice: 1999,
  saving: 1291,
  perJarDays: 15,
};

export const smoothflowBenefits = [
  {
    accent: "২৪ ঘন্টায়",
    rest: "শক্ত চাকা ও নালীর জমাট ব্লক দূর করে",
  },
  {
    accent: "ব্যথাহীন ও সহজ",
    rest: "ব্রেস্টফিডিং অনুভূতি এনে দেয়",
  },
  {
    accent: "ব্রেস্টের ভারীভাব",
    rest: "ও চাপ দ্রুত উপশম করে",
  },
  {
    accent: "স্মুথ ও নিরবচ্ছিন্ন",
    rest: "দুধের প্রবাহ বজায় রাখে",
  },
  {
    accent: "১০০% প্রাকৃতিক",
    rest: "ও সম্পূর্ণ সাইডইফেক্ট মুক্ত",
  },
];

export const smoothflowTestimonials = [
  {
    name: "রেহানা পারভীন",
    location: "ঢাকা",
    rating: 5,
    text: "বুকের এক পাশে শক্ত চাকার মতো হয়ে তীব্র ব্যথা করছিল, বাবুকে দুধ খাওয়াতেই ভয় পেতাম। স্মুথফ্লো নেওয়ার ২৪ ঘণ্টার মধ্যেই চাকা একদম সফট হয়ে যায় এবং ব্যথা নাই হয়ে গেছে!",
    avatar: "/assets/reviewer/girl1.jpeg",
    verifiedPurchase: true,
    babyAge: "১.৫ মাস",
    problemType: "ব্রেস্টে শক্ত চাকা ও ফিডিং-এ তীব্র ব্যথা",
    usageDuration: "২৪ ঘন্টা (১ দিন)",
  },
  {
    name: "সাবিহা সুলতানা",
    location: "চট্টগ্রাম",
    rating: 5,
    text: "ক্লগড ডাক্টের কারণে ফিডিং করানোর সময় চোখ দিয়ে পানি চলে আসতো। স্মুথফ্লো ব্যবহারে ২ দিনের মধ্যে নালীর ব্লক পুরোপুরি ক্লিন হয়ে দুধের প্রবাহ একদম স্মুথ হয়েছে।",
    avatar: "/assets/reviewer/girl2.jpeg",
    verifiedPurchase: true,
    babyAge: "২ মাস",
    problemType: "ক্লগড ডাক্ট ও ব্রেস্টের ভারীভাব",
    usageDuration: "২ দিন",
  },
  {
    name: "নুসরাত জাহান",
    location: "সিলেট",
    rating: 5,
    text: "বুকের ভারী ভাব ও ফোলা অনুভূতির জন্য রাতে ঘুমাতেই পারতাম না। মাত্র ১ দিনেই ব্রেস্টের চাপ একদম হালকা হয়ে গেছে, আলহামদুলিল্লাহ।",
    avatar: "/assets/reviewer/girl3.jpeg",
    verifiedPurchase: true,
    babyAge: "৩ মাস",
    problemType: "ব্রেস্টে প্রচণ্ড চাপ ও অস্বস্তি",
    usageDuration: "২৪ ঘন্টা",
  },
  {
    name: "মেহজাবীন চৌধুরী",
    location: "উত্তরা, ঢাকা",
    rating: 5,
    text: "আগে ফিডিং করানোর আগে মানসিকভাবে ভয় পেতাম। স্মুথফ্লো সেবনের ৩ দিনের মধ্যে কোনো ব্যথা ছাড়াই বাবু সুন্দরভাবে দুধ খাচ্ছে।",
    avatar: "/assets/reviewer/girl4.jpeg",
    verifiedPurchase: true,
    babyAge: "১ মাস",
    problemType: "ফিডিং এর সময় অসহ্য পেইন",
    usageDuration: "৩ দিন",
  },
  {
    name: "আফরোজা খানম",
    location: "কুমিল্লা",
    rating: 5,
    text: "ডাক্তারের পরামর্শে স্মুথফ্লো ট্রাই করি। ২ দিনের মধ্যে চাকা ভাব কেটে গেছে এবং বুকে জমাট বাঁধা দুধ স্বাচ্ছন্দ্যে রিলিজ হয়েছে।",
    avatar: "/assets/reviewer/girl1.jpeg",
    verifiedPurchase: true,
    babyAge: "৪ মাস",
    problemType: "শক্ত চাকা অনুভূতি ও ফিডিং এ সমস্যা",
    usageDuration: "২ দিন",
  },
  {
    name: "তানজিনা আক্তার",
    location: "রাজশাহী",
    rating: 5,
    text: "সত্যিই জাদুকরী কাজ করে! মাত্র ২৪ ঘন্টায় আমার বুকের তীব্র ব্যথা কমে স্বস্তি এসেছে। আপনারা নিশ্চিন্তে ব্যবহার করতে পারেন।",
    avatar: "/assets/reviewer/girl2.jpeg",
    verifiedPurchase: true,
    babyAge: "২.৫ মাস",
    problemType: "ক্লগড ডাক্ট ও দুগ্ধনালীর ব্লক",
    usageDuration: "২৪ ঘন্টা",
  },
];

