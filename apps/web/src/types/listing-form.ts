// ── Category & Subcategory Definitions ────────────────────────────────

export type MainCategory = 'properties' | 'mobiles' | 'electronics';

export type ListingType = 'OFFERING' | 'REQUESTING';

export type Step = 'type' | 'details' | 'media' | 'location' | 'review';

export const CATEGORY_DEFINITIONS: Record<
  MainCategory,
  {
    label: string;
    description: string;
    subcategories: string[];
  }
> = {
  properties: {
    label: 'Properties',
    description: 'Houses, apartments, lands, commercial spaces & PG',
    subcategories: [
      'For Sale: Houses & Apartments',
      'For Rent: Houses & Apartments',
      'Lands & Plots',
      'For Sale: Shops & Offices',
      'PG & Guest Houses',
    ],
  },
  mobiles: {
    label: 'Mobiles',
    description: 'Smartphones, tablets & accessories',
    subcategories: ['Mobile Phones', 'Tablets', 'Accessories'],
  },
  electronics: {
    label: 'Electronics & Appliances',
    description: 'Laptops, cameras, TVs, gaming & home appliances',
    subcategories: [
      'Cameras & Lenses',
      'Computers & Laptops',
      'TVs, Video - Audio',
      'Kitchen & Other Appliances',
      'Games & Entertainment',
    ],
  },
};

// ── Property Specific Types ──────────────────────────────────────────

export type PropertyFurnishing = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PropertyFacing =
  | 'North'
  | 'South'
  | 'East'
  | 'West'
  | 'North-East'
  | 'North-West'
  | 'South-East'
  | 'South-West';
export type PlotAreaUnit = 'Sq. Ft.' | 'Cent' | 'Acre' | 'Sq. Yard';

export interface PropertyDetails {
  // Common / Pricing
  priceType: 'sale' | 'rent';
  securityDeposit?: string;
  carpetArea?: string; // in Sq. Ft.
  builtUpArea?: string; // in Sq. Ft.

  // Houses / Apartments
  bhk?: '1' | '2' | '3' | '4' | '4+';
  bathrooms?: string;
  furnishing?: PropertyFurnishing;
  floorNo?: string;
  totalFloors?: string;
  carParking?: boolean;

  // Lands & Plots
  plotArea?: string;
  plotUnit?: PlotAreaUnit;
  lengthBreadth?: string; // e.g. "40 x 60"
  facing?: PropertyFacing;
  boundaryWall?: boolean;
  roadWidth?: string; // in ft

  // Commercial / Shops & Offices
  washrooms?: string;
  pantry?: boolean;

  // PG & Guest Houses
  roomSharing?: 'Single' | 'Double' | 'Triple' | '4+';
  preferredTenants?: 'Any' | 'Male' | 'Female' | 'Students';
  foodIncluded?: boolean;

  // Polygon boundary
  polygonCoordinates?: [number, number][]; // [lat, lng] array
  polygonAreaSqFt?: number;
}

// ── Mobiles Specific Types ───────────────────────────────────────────

export type ItemCondition =
  | 'New'
  | 'Used - Like New'
  | 'Used - Good'
  | 'Used - Fair'
  | 'For Parts / Not Working';

export interface MobileDetails {
  brand: string;
  model: string;
  isManualModel: boolean;
  condition: ItemCondition;
  ram?: string;
  storage?: string;
  batteryHealth?: string; // % for iPhones
  includedInBox: string[]; // ['Original Box', 'Original Charger', 'Cable', 'Valid Bill/Invoice']
  warrantyStatus: 'Under Warranty' | 'Out of Warranty';
  hasPurchaseOptions: boolean;
  purchaseOptions: PurchaseOption[];
}

// ── Electronics Specific Types ───────────────────────────────────────

export interface ElectronicsDetails {
  brand: string;
  model: string;
  condition: ItemCondition;
  ageOfItem: '< 6 months' | '6–12 months' | '1–3 years' | '3+ years';
  originalBillAvailable: boolean;
  underWarranty: boolean;

  // Subcategory specific
  mountType?: string; // Cameras
  shutterCount?: string; // Cameras
  sensorFormat?: string; // Cameras: Full Frame, APS-C, etc.

  cpu?: string; // Laptops/Computers
  ram?: string; // Laptops/Computers
  storageTypeSize?: string; // e.g. 512GB NVMe SSD
  gpu?: string; // Dedicated/Integrated
  screenSize?: string; // Laptops / TVs

  displayTech?: string; // OLED, QLED, LED
  soundOutput?: string; // Watts or channels

  platform?: string; // Gaming: PS5, Xbox, Switch, PC
  capacity?: string; // Appliances: 250L, 7kg, etc.
  keySpecs?: string;

  hasPurchaseOptions: boolean;
  purchaseOptions: PurchaseOption[];
}

// ── Purchase Options (Bundles/Variants) ───────────────────────────────

export interface PurchaseOption {
  id: string;
  title: string;
  price: string;
}

// ── Unified Form State ───────────────────────────────────────────────

export interface ListingFormData {
  listingType: ListingType;
  category: MainCategory | '';
  subcategory: string;

  title: string;
  description: string;
  price: string; // Base price or primary price
  negotiable: boolean;

  exchangeMethods: string[]; // Only for Mobiles & Electronics
  tags: string[];
  images: { file?: File; preview: string }[];

  // Location
  location: string; // City / Area
  latitude?: number;
  longitude?: number;

  // Category specific slices
  properties: PropertyDetails;
  mobiles: MobileDetails;
  electronics: ElectronicsDetails;
}

// ── Constants & Helpers ──────────────────────────────────────────────

export const CONDITIONS: ItemCondition[] = [
  'New',
  'Used - Like New',
  'Used - Good',
  'Used - Fair',
  'For Parts / Not Working',
];

export const EXCHANGE_METHODS = [
  'Pickup',
  'Drop-off',
  'Shipping',
  'In-Person Meet',
];

export const MOBILE_RAM_OPTIONS = ['4GB', '6GB', '8GB', '12GB', '16GB', 'Other'];
export const MOBILE_STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];
export const BOX_INCLUSIONS = [
  'Original Box',
  'Original Charger',
  'Charging Cable',
  'Valid Bill / Invoice',
];

export const INITIAL_FORM_DATA: ListingFormData = {
  listingType: 'OFFERING',
  category: '',
  subcategory: '',
  title: '',
  description: '',
  price: '',
  negotiable: true,
  exchangeMethods: ['Pickup'],
  tags: [],
  images: [],
  location: '',
  latitude: 12.9716, // Bangalore default
  longitude: 77.5946,
  properties: {
    priceType: 'sale',
    bhk: '2',
    furnishing: 'Semi-Furnished',
    plotUnit: 'Sq. Ft.',
    facing: 'East',
    boundaryWall: true,
    carParking: true,
    roomSharing: 'Double',
    preferredTenants: 'Any',
    foodIncluded: false,
  },
  mobiles: {
    brand: '',
    model: '',
    isManualModel: false,
    condition: 'Used - Good',
    ram: '8GB',
    storage: '128GB',
    includedInBox: ['Original Box', 'Charging Cable'],
    warrantyStatus: 'Out of Warranty',
    hasPurchaseOptions: false,
    purchaseOptions: [],
  },
  electronics: {
    brand: '',
    model: '',
    condition: 'Used - Good',
    ageOfItem: '6–12 months',
    originalBillAvailable: true,
    underWarranty: false,
    hasPurchaseOptions: false,
    purchaseOptions: [],
  },
};
