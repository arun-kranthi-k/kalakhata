/**
 * Kalakhata heritage data model.
 *
 * These types describe the entities the platform is built around. Today they are
 * fulfilled by the static seed data in this folder; the same shapes are intended
 * to be served by an API later, so components should only ever read through the
 * selectors exported from `./index`.
 */

export type HeritageStatus =
  | "thriving"
  | "at-risk"
  | "endangered"
  | "critically-endangered";

export type ArtCategory =
  | "Painting"
  | "Textiles"
  | "Metal"
  | "Wood"
  | "Pottery"
  | "Folk Theatre"
  | "Music"
  | "Dance";

export type TimelineEntry = { period: string; note: string };
export type TechniqueStep = { title: string; detail: string };

export type ArtForm = {
  id: string;
  name: string;
  category: ArtCategory;
  stateId: string;
  state: string;
  district: string;
  status: HeritageStatus;
  /** Qualitative reasons behind the Kalakhata Heritage Status. Never statistics. */
  statusFactors: string[];
  summary: string;
  origin: string;
  history: string[];
  timeline: TimelineEntry[];
  materials: string[];
  techniques: TechniqueStep[];
  significance: string[];
  image: string;
  gallery: string[];
  artisanIds: string[];
  relatedFormIds: string[];
  sources: string[];
  /** Sample figure for the prototype — always rendered with a "sample data" label. */
  documentedArtisans: number;
};

export type VerificationState = "demo-verified" | "unverified";

export type Artisan = {
  id: string;
  name: string;
  artFormId: string;
  craft: string;
  stateId: string;
  place: string;
  generations: string;
  yearsPractising: number;
  specialisation: string;
  verification: VerificationState;
  image: string;
  quote: string;
  story: string[];
  workshop: string;
  process: string[];
};

export type Product = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  detail: string;
  artisanId: string;
  artFormId: string;
  materials: string[];
  timeRequired: string;
  storyBehind: string;
  image: string;
};

export type District = { name: string; artFormIds: string[] };

export type Region = {
  id: string;
  name: string;
  /** Hotspot position on the India outline, in percent. */
  x: number;
  y: number;
  note: string;
  districts: District[];
};

export type StoryCategory =
  | "Artist Stories"
  | "Art Stories"
  | "Behind the Craft"
  | "Heritage Alerts"
  | "Workshops"
  | "Community";

export type Story = {
  id: string;
  title: string;
  category: StoryCategory;
  craft: string;
  place: string;
  artisanId: string;
  artFormId: string;
  image: string;
  blurb: string;
};
