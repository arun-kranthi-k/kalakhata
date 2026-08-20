import madhubani from "@/assets/art-madhubani.jpg";
import pattachitra from "@/assets/art-pattachitra.jpg";
import warli from "@/assets/art-warli.jpg";
import dhokra from "@/assets/art-dhokra.jpg";
import bluePottery from "@/assets/art-bluepottery.jpg";
import banarasi from "@/assets/art-banarasi.jpg";

export const images = { madhubani, pattachitra, warli, dhokra, bluePottery, banarasi };

export type Product = {
  name: string;
  price: string;
  detail: string;
};

export type Artist = {
  id: string;
  name: string;
  craft: string;
  region: string;
  place: string;
  generations: string;
  image: string;
  quote: string;
  story: string[];
  products: Product[];
};

export const artists: Artist[] = [
  {
    id: "sunaina-devi",
    name: "Sunaina Devi",
    craft: "Madhubani",
    region: "bihar",
    place: "Jitwarpur, Bihar",
    generations: "6th generation",
    image: madhubani,
    quote: "My grandmother painted the walls of our home before she ever painted paper.",
    story: [
      "In Jitwarpur the monsoon decides everything — when the mud walls are replastered, when the pigments are ground, when the women of the village sit together and begin to draw.",
      "Sunaina learned the kachni line work at seven, tracing over her grandmother's fish and peacocks with a bamboo twig wrapped in cotton. She still refuses synthetic colour: her black is soot and cow dung, her yellow turmeric, her red the kusum flower.",
      "Every piece she sells funds a Saturday class where eleven girls from the village learn the same lines she once traced.",
    ],
    products: [
      { name: "Fish & Lotus Scroll", price: "₹6,400", detail: "Handmade paper · 22 × 30 in · natural pigments" },
      { name: "Kohbar Wedding Panel", price: "₹14,800", detail: "Cotton canvas · 36 × 48 in · 40 days of work" },
      { name: "Small Peacock Study", price: "₹2,200", detail: "Handmade paper · 8 × 10 in" },
    ],
  },
  {
    id: "raghunath-maharana",
    name: "Raghunath Maharana",
    craft: "Pattachitra",
    region: "odisha",
    place: "Raghurajpur, Odisha",
    generations: "9th generation",
    image: pattachitra,
    quote: "The cloth must be prepared for ten days before a single line is allowed.",
    story: [
      "Raghurajpur is a village of one street where every house is a studio and every wall is a canvas. Raghunath's family has painted the Jagannath cycle here since before the British came.",
      "He glues layers of old cotton saree with tamarind seed paste, polishes the sheet with a river stone, and only then opens his brushes — some made from a single mouse whisker.",
      "He has never sold through a gallery. He would rather you write to him.",
    ],
    products: [
      { name: "Jagannath Triad Patta", price: "₹18,500", detail: "Tussar cloth · 24 × 36 in · natural stone colours" },
      { name: "Krishna Leela Miniature", price: "₹5,900", detail: "Palm leaf etching · 6 × 14 in" },
    ],
  },
  {
    id: "jivya-more",
    name: "Jivya More",
    craft: "Warli",
    region: "maharashtra",
    place: "Ganjad, Maharashtra",
    generations: "4th generation",
    image: warli,
    quote: "A circle, a triangle, a line. That is the whole world if you look long enough.",
    story: [
      "Warli painting was never made to be sold. It was made on the mud walls of a home for a wedding, and washed away the next season.",
      "Jivya paints on canvas now so the work can travel, but he keeps the rice-paste white and the geometry unbroken: sun, farmer, tarpa dancers spiralling with no beginning.",
      "He teaches at the village school on Wednesdays, unpaid.",
    ],
    products: [
      { name: "Tarpa Dance Circle", price: "₹9,200", detail: "Canvas with cow-dung wash · 30 × 30 in" },
      { name: "Harvest Village", price: "₹4,100", detail: "Handmade paper · 16 × 20 in" },
    ],
  },
  {
    id: "budhiyarin-bai",
    name: "Budhiyarin Bai",
    craft: "Dhokra",
    region: "chhattisgarh",
    place: "Bastar, Chhattisgarh",
    generations: "5th generation",
    image: dhokra,
    quote: "Every mould breaks. That is why no two pieces can ever be the same.",
    story: [
      "Dhokra is four thousand years old — the dancing girl of Mohenjo-daro was cast this way. Lost-wax, bell metal, a clay mould that must be shattered to free the figure inside.",
      "Budhiyarin's family works through the dry months in Bastar, coiling wax threads by hand into elephants, tribal riders and measuring bowls.",
      "The furnace is fired once a week. Everything cast that day is everything she will sell that month.",
    ],
    products: [
      { name: "Bastar Horse Rider", price: "₹7,600", detail: "Bell metal · 9 in · lost-wax cast" },
      { name: "Measuring Bowl Set", price: "₹5,300", detail: "Bell metal · set of three" },
    ],
  },
  {
    id: "iqbal-khan",
    name: "Iqbal Khan",
    craft: "Blue Pottery",
    region: "rajasthan",
    place: "Jaipur, Rajasthan",
    generations: "3rd generation",
    image: bluePottery,
    quote: "There is no clay in my clay. Only quartz, glass and the patience to fail.",
    story: [
      "Jaipur blue pottery came from Persia through Kashmir and settled in the pink city. The body contains no clay at all — powdered quartz, borax, gum and water, pressed into plaster moulds.",
      "Half of every firing cracks. Iqbal's father told him that was the tax the craft charges for its colour.",
      "He mixes his own cobalt oxide and refuses the copper-green shortcut most workshops use now.",
    ],
    products: [
      { name: "Cobalt Vine Vase", price: "₹4,800", detail: "Quartz body · 11 in · hand-painted" },
      { name: "Tile Set of Nine", price: "₹6,900", detail: "4 × 4 in each · glazed" },
    ],
  },
  {
    id: "shahid-ansari",
    name: "Shahid Ansari",
    craft: "Banarasi Weaving",
    region: "uttar-pradesh",
    place: "Varanasi, Uttar Pradesh",
    generations: "7th generation",
    image: banarasi,
    quote: "Six months on one saree. The loom knows my hands better than my children do.",
    story: [
      "In the lanes behind Madanpura the sound of the pit loom starts before the first azaan and stops long after dark.",
      "Shahid works a jala loom — the pattern held in knotted threads above his head, read like a score. A single kadhwa saree can take six months and cannot be undone.",
      "Powerlooms copy his designs in an afternoon. Selling directly is the only reason he still weaves.",
    ],
    products: [
      { name: "Kadhwa Silk Saree", price: "₹68,000", detail: "Pure silk · real zari · 6 months on the loom" },
      { name: "Brocade Stole", price: "₹9,400", detail: "Silk & zari · 28 × 80 in" },
    ],
  },
];

export type Region = {
  id: string;
  name: string;
  x: number;
  y: number;
  forms: string[];
  note: string;
};

export const regions: Region[] = [
  { id: "jammu-kashmir", name: "Kashmir", x: 45, y: 13, forms: ["Papier-mâché", "Pashmina Kani", "Khatamband"], note: "Persian-influenced surface craft carried over the mountain passes." },
  { id: "rajasthan", name: "Rajasthan", x: 40, y: 33, forms: ["Blue Pottery", "Phad", "Miniature", "Bandhani"], note: "Court patronage turned desert workshops into pigment laboratories." },
  { id: "uttar-pradesh", name: "Uttar Pradesh", x: 51, y: 32, forms: ["Banarasi Weaving", "Chikankari", "Zardozi"], note: "The loom belt of the Gangetic plain." },
  { id: "bihar", name: "Bihar", x: 58, y: 38, forms: ["Madhubani", "Sujni", "Sikki Grass"], note: "Wall painting by women, done for weddings, now on paper." },
  { id: "gujarat", name: "Gujarat", x: 36, y: 45, forms: ["Patola", "Rogan", "Ajrakh"], note: "Double-ikat and resist printing older than most nations." },
  { id: "madhya-pradesh", name: "Madhya Pradesh", x: 47, y: 44, forms: ["Gond", "Bagh Print", "Maheshwari"], note: "Forest cosmology drawn in dots and dashes." },
  { id: "west-bengal", name: "West Bengal", x: 63, y: 44, forms: ["Kantha", "Patua Scroll", "Terracotta"], note: "Story scrolls sung aloud as they are unrolled." },
  { id: "chhattisgarh", name: "Chhattisgarh", x: 55, y: 50, forms: ["Dhokra", "Bastar Iron", "Wood Carving"], note: "Lost-wax metal casting practised for four millennia." },
  { id: "odisha", name: "Odisha", x: 59, y: 54, forms: ["Pattachitra", "Palm Leaf", "Silver Filigree"], note: "Temple painting bound to the Jagannath calendar." },
  { id: "maharashtra", name: "Maharashtra", x: 42, y: 58, forms: ["Warli", "Paithani", "Kolhapuri"], note: "Tribal geometry and the imperial silk of the Deccan." },
  { id: "telangana", name: "Telangana & Andhra", x: 50, y: 66, forms: ["Kalamkari", "Cheriyal", "Bidri"], note: "Pen-drawn cloth using fermented iron and myrobalan." },
  { id: "karnataka", name: "Karnataka", x: 45, y: 73, forms: ["Mysore Painting", "Channapatna", "Bidriware"], note: "Gesso and gold leaf under the Wodeyar court." },
  { id: "tamil-nadu", name: "Tamil Nadu", x: 50, y: 82, forms: ["Tanjore Painting", "Bronze Casting", "Kanchipuram"], note: "Chola bronze technique still cast in Swamimalai." },
  { id: "kerala", name: "Kerala", x: 45, y: 86, forms: ["Mural Painting", "Aranmula Mirror", "Coir Craft"], note: "Temple murals in five vegetable colours." },
  { id: "assam", name: "Assam & North East", x: 71, y: 35, forms: ["Muga Silk", "Bamboo Craft", "Naga Weaving"], note: "Golden silk reared nowhere else on earth." },
];

export type FeedItem = {
  id: string;
  title: string;
  craft: string;
  place: string;
  artistId: string;
  image: string;
  blurb: string;
};

export const feed: FeedItem[] = [
  { id: "f1", title: "Ten days before the first line", craft: "Pattachitra", place: "Raghurajpur, Odisha", artistId: "raghunath-maharana", image: pattachitra, blurb: "Raghunath on why the cloth matters more than the painting." },
  { id: "f2", title: "Soot, turmeric, kusum flower", craft: "Madhubani", place: "Jitwarpur, Bihar", artistId: "sunaina-devi", image: madhubani, blurb: "Sunaina Devi grinds every colour she paints with." },
  { id: "f3", title: "The furnace fires once a week", craft: "Dhokra", place: "Bastar, Chhattisgarh", artistId: "budhiyarin-bai", image: dhokra, blurb: "Four thousand years of lost-wax casting, one day at a time." },
  { id: "f4", title: "A circle, a triangle, a line", craft: "Warli", place: "Ganjad, Maharashtra", artistId: "jivya-more", image: warli, blurb: "Jivya More on painting a world with three shapes." },
  { id: "f5", title: "There is no clay in my clay", craft: "Blue Pottery", place: "Jaipur, Rajasthan", artistId: "iqbal-khan", image: bluePottery, blurb: "Half of every firing cracks. That is the tax." },
  { id: "f6", title: "Six months on one saree", craft: "Banarasi Weaving", place: "Varanasi, Uttar Pradesh", artistId: "shahid-ansari", image: banarasi, blurb: "The jala loom, read like a musical score." },
];

export const getArtist = (id: string) => artists.find((a) => a.id === id);
