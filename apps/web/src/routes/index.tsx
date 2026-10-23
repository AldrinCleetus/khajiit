import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { ListingCard, type Listing } from '../components/ListingCard';
import { Building2, Smartphone, Monitor, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/')({
  component: Index,
});

type FilterType =
  | 'ALL'
  | 'GREAT_DEALS'
  | 'PROPERTIES'
  | 'MOBILES'
  | 'ELECTRONICS'
  | 'WTB';

const MOCK_LISTINGS: Listing[] = [
  // ── PROPERTIES ────────────────────────────────────────────────────────
  {
    id: 'plot-1',
    title: '2400 sq.ft Premium Residential Plot in North Bangalore',
    price: 12500000,
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'great',
    location: 'Devanahalli, Bangalore',
    exchangeMethod: 'Registration',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    condition: 'A-Khata / Clear Title',
    category: 'properties',
    subcategory: 'Lands & Plots',
    microSpecs: '2,400 sq.ft • Clear Title • Mapped Plot',
    rateSubtext: '₹5,208 / sq.ft',
    tags: ['plot', 'bangalore', 'north-bangalore'],
    description:
      'Prime residential plot in the North Bangalore growth corridor. 40x60 dimensions, East facing, clear A-Khata titles, 40ft road frontage. Bank approved for immediate loan.',
    isFeatured: true,
  },
  {
    id: 'plot-2',
    title: '10 Cent Residential Plot in Kakkanad, near Infopark',
    price: 8500000,
    imageUrl:
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'great',
    location: 'Kakkanad, Kochi',
    exchangeMethod: 'Registration',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    condition: 'Dry Land / Single Owner',
    category: 'properties',
    subcategory: 'Lands & Plots',
    microSpecs: '10 Cent • Tar Road Access • Direct Owner',
    rateSubtext: '₹8.5L / Cent',
    tags: ['kochi', 'infopark', 'residential'],
    description:
      'Square plot just 2.5 km from Infopark Phase 2. High elevation dry land with tar road frontage and KSEB / water connections ready. Direct owner listing with zero broker fees.',
  },
  {
    id: 'prop-3',
    title: '3 BHK Luxury Apartment with Terrace Garden',
    price: 24500000,
    imageUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'fair',
    location: 'Indiranagar, Bangalore',
    exchangeMethod: 'Registration',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    condition: 'Ready to Move',
    category: 'properties',
    subcategory: 'For Sale: Houses & Apartments',
    microSpecs: '1,850 sq.ft • Semi-Furnished • 2 Car Parks',
    rateSubtext: '₹13,243 / sq.ft',
    tags: ['apartment', 'indiranagar', 'luxury'],
    description:
      'East-facing 3 BHK on the 4th floor with 1850 sq.ft built-up area and private terrace garden. Italian marble flooring, 100% power backup, premium gated society.',
    isFeatured: true,
  },
  {
    id: 'prop-4',
    title: '2 BHK Gated Community Flat for Rent in Whitefield',
    price: 38000,
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'fair',
    location: 'Whitefield, Bangalore',
    exchangeMethod: 'Direct Agreement',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    condition: 'Fully Furnished',
    category: 'properties',
    subcategory: 'For Rent: Houses & Apartments',
    microSpecs: '1,200 sq.ft • 2 Bathrooms • Deposit ₹1.5L',
    rateSubtext: '₹38,000 / mo',
    tags: ['rent', 'whitefield', '2bhk'],
    description:
      'Well-maintained 2 BHK flat near ITPL. Fully furnished with modular kitchen, AC in master bedroom, washing machine, and dedicated covered car parking.',
  },

  // ── MOBILES ───────────────────────────────────────────────────────────
  {
    id: 'mob-1',
    title: 'Apple iPhone 15 Pro 256GB (Natural Titanium)',
    price: 98000,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'Indiranagar, Bangalore',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    condition: 'Used - Like New',
    category: 'mobiles',
    subcategory: 'Mobile Phones',
    microSpecs: '256GB • 94% Battery • Box & Bill',
    tags: ['apple', 'iphone', '15pro'],
    description:
      'Indian retail unit purchased from Apple Store BKC. Pristine condition with tempered glass and Spigen case from day one. Battery health 94%. Comes with original box, braided cable, and GST invoice.',
    isFeatured: true,
  },
  {
    id: 'mob-2',
    title: 'Samsung Galaxy S24 Ultra 512GB (Titanium Gray)',
    price: 102000,
    imageUrl:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'fair',
    location: 'Bandra West, Mumbai',
    exchangeMethod: 'Pickup / Meet',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    condition: 'Used - Like New',
    category: 'mobiles',
    subcategory: 'Mobile Phones',
    microSpecs: '512GB • 12GB RAM • S-Pen & Bill',
    tags: ['samsung', 's24ultra', 'android'],
    description:
      'Snapdragon 8 Gen 3 beast. 512GB storage, 12GB RAM. No scratches or dings. Samsung Care+ active till Jan 2025. Original box, S-Pen, and 45W Samsung brick included.',
  },
  {
    id: 'mob-3',
    title: 'Google Pixel 8 128GB (Hazel) - Mint Condition',
    price: 44000,
    imageUrl:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'Koramangala, Bangalore',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    condition: 'Used - Good',
    category: 'mobiles',
    subcategory: 'Mobile Phones',
    microSpecs: '128GB • 8GB RAM • Under Warranty',
    tags: ['google', 'pixel8', 'camera'],
    description:
      'Flagship camera phone with 7 years of OS updates. 5 months old with Flipkart purchase invoice and box. Minor pocket wear on the camera visor, screen is spotless.',
  },
  {
    id: 'mob-4',
    title: 'iPad Air M2 11" 128GB Wi-Fi (Space Gray)',
    price: 51000,
    imageUrl:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'HSR Layout, Bangalore',
    exchangeMethod: 'Pickup / Shipping',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    condition: 'Used - Like New',
    category: 'mobiles',
    subcategory: 'Tablets',
    microSpecs: '128GB • 100% Battery • Apple Pencil 2 option',
    tags: ['ipad', 'm2', 'apple'],
    description:
      'Latest M2 iPad Air bought for university note-taking. Rarely used. 100% battery capacity. Can include Apple Pencil Pro for additional ₹8,000.',
  },

  // ── ELECTRONICS & APPLIANCES ──────────────────────────────────────────
  {
    id: '1',
    title: 'Sony Alpha a7 III Mirrorless Camera with 28-70mm Lens',
    price: 115000,
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'Bangalore, KA',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: 'Used - Like New • 3 Purchase Options',
    tags: ['camera', 'sony', 'photography'],
    description:
      'Barely used Sony a7 III body with original box and accessories. Shutter count under 4,800. Also offering body only for ₹90k or full bundle with extra battery.',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'MacBook Pro 16" M2 Max 32GB RAM / 1TB SSD',
    price: 185000,
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'fair',
    location: 'Worli, Mumbai',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    condition: 'Used - Good',
    category: 'electronics',
    subcategory: 'Computers & Laptops',
    microSpecs: '32GB RAM • 1TB SSD • Battery 92%',
    tags: ['macbook', 'apple', 'm2max'],
    description:
      'Top-tier editing workstation. 38-core GPU, 32GB Unified Memory, 1TB NVMe. 92% battery cycle. Original 140W MagSafe charger and bill included.',
    isFeatured: true,
  },
  {
    id: 'elec-3',
    title: 'Sony a6400 + Sigma 16mm f/1.4 DC DN Lens Bundle',
    price: 68000,
    imageUrl:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'T. Nagar, Chennai',
    exchangeMethod: 'Pickup / Meet',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: 'Shutter 4.2k • 2 Purchase Options • Bill',
    tags: ['sony', 'sigma', 'vlogging'],
    description:
      'Super crisp 4K creator combo. Sony a6400 body + Sigma 16mm f/1.4 prime lens. Includes 2 original NP-FW50 batteries, dual charger, and strap.',
  },
  {
    id: '5',
    title: 'DJI Mini 3 Pro Drone with RC Controller & Fly More Kit',
    price: 62000,
    imageUrl:
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'fair',
    location: 'Kothrud, Pune',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: '3 Batteries • Fly More Kit • Invoice',
    tags: ['drone', 'dji', 'video'],
    description:
      'Lightweight sub-249g drone. Flown only 4 times. Comes with DJI RC built-in screen controller, 3 intelligent batteries, two-way charging hub, and shoulder bag.',
  },
  {
    id: 'elec-4',
    title: 'LG C3 55-inch 4K OLED TV (120Hz Gaming)',
    price: 89000,
    imageUrl:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'fair',
    location: 'Jubilee Hills, Hyderabad',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    condition: 'Used - Good',
    category: 'electronics',
    subcategory: 'TVs, Video - Audio',
    microSpecs: 'OLED • 120Hz HDMI 2.1 • 1.5 yrs with Bill',
    tags: ['tv', 'oled', 'gaming'],
    description:
      'Top-of-the-line 55" OLED with Dolby Vision and 4x HDMI 2.1 ports for PS5 / Xbox Series X 120Hz HDR gaming. Wall-mounted since purchase, zero burn-in.',
  },
  {
    id: '8',
    title: 'Any working PlayStation 4 (Slim or Pro)',
    price: 15000,
    imageUrl:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'pending',
    location: 'Bangalore, KA',
    exchangeMethod: 'Pickup',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    condition: 'Used - Fair',
    category: 'electronics',
    subcategory: 'Games & Entertainment',
    microSpecs: 'Wanted • Any Condition • Pickup Today',
    tags: ['ps4', 'gaming', 'wanted'],
    description:
      "Looking to buy a working PS4. Don't care about cosmetic condition as long as it plays discs and doesn't overheat. Controllers optional. Willing to travel anywhere in Bangalore.",
    listingType: 'REQUESTING',
  },
];

function Index() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // Filter listings based on active chip
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'GREAT_DEALS') return item.valuation === 'great';
      if (activeFilter === 'PROPERTIES') return item.category === 'properties';
      if (activeFilter === 'MOBILES') return item.category === 'mobiles';
      if (activeFilter === 'ELECTRONICS') return item.category === 'electronics';
      if (activeFilter === 'WTB') return item.listingType === 'REQUESTING';
      return true;
    });
  }, [activeFilter]);

  return (
    <div className="container py-6 space-y-10 max-w-7xl mx-auto">
      {/* ── Compact, High-Trust Hero Banner ────────────────────────────── */}
      <section className="p-6 sm:p-8 md:p-10 rounded-3xl border border-border/80 glass-panel shadow-sm space-y-6">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Buy and sell locally. <br className="hidden sm:inline" />
            <span className="text-[hsl(var(--accent))]">Real prices, zero spam.</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
            Verified listings across Properties, Mobiles, and Electronics—with transparent offers and fair market price checks.
          </p>
        </div>

        {/* Quick Category Filter Cards (Above the Fold) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {/* Properties Card */}
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'PROPERTIES' ? 'ALL' : 'PROPERTIES')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
              activeFilter === 'PROPERTIES'
                ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 shadow-sm ring-1 ring-[hsl(var(--accent))]/40'
                : 'border-border bg-card/60 hover:border-[hsl(var(--accent))]/40 hover:bg-card'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeFilter === 'PROPERTIES'
                  ? 'bg-[hsl(var(--accent))] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-foreground text-sm">Properties</h3>
                <span className="text-[11px] text-muted-foreground font-medium">
                  ({MOCK_LISTINGS.filter((i) => i.category === 'properties').length})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Plots, Houses & Rentals <br />
                <span className="text-foreground/75 font-medium">Direct owners, mapped boundaries</span>
              </p>
            </div>
          </button>

          {/* Mobiles Card */}
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'MOBILES' ? 'ALL' : 'MOBILES')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
              activeFilter === 'MOBILES'
                ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 shadow-sm ring-1 ring-[hsl(var(--accent))]/40'
                : 'border-border bg-card/60 hover:border-[hsl(var(--accent))]/40 hover:bg-card'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeFilter === 'MOBILES'
                  ? 'bg-[hsl(var(--accent))] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Smartphone size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-foreground text-sm">Mobiles</h3>
                <span className="text-[11px] text-muted-foreground font-medium">
                  ({MOCK_LISTINGS.filter((i) => i.category === 'mobiles').length})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Phones & Tablets <br />
                <span className="text-foreground/75 font-medium">Verified models, battery & box details</span>
              </p>
            </div>
          </button>

          {/* Electronics Card */}
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'ELECTRONICS' ? 'ALL' : 'ELECTRONICS')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
              activeFilter === 'ELECTRONICS'
                ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 shadow-sm ring-1 ring-[hsl(var(--accent))]/40'
                : 'border-border bg-card/60 hover:border-[hsl(var(--accent))]/40 hover:bg-card'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeFilter === 'ELECTRONICS'
                  ? 'bg-[hsl(var(--accent))] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Monitor size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-foreground text-sm">Electronics</h3>
                <span className="text-[11px] text-muted-foreground font-medium">
                  ({MOCK_LISTINGS.filter((i) => i.category === 'electronics').length})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Cameras, Laptops & Gear <br />
                <span className="text-foreground/75 font-medium">Bundle options & invoice info</span>
              </p>
            </div>
          </button>
        </div>

        {/* Indian Value / Trust Pills (Subtle inline row) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3 border-t border-border/50 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Transparent Offers (No &quot;DM for price&quot;)
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Fair Market Price Tags
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Direct Local Pickup & Verified Plots
          </span>
        </div>
      </section>

      {/* ── Feed Section Header with Quick Filter Chips ───────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Fresh Listings
              <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                {filteredListings.length}
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified local ads sorted by freshness & deal transparency
            </p>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'ALL', label: 'All Items' },
              { id: 'GREAT_DEALS', label: 'Great Deals Only' },
              { id: 'PROPERTIES', label: 'Properties' },
              { id: 'MOBILES', label: 'Mobiles' },
              { id: 'ELECTRONICS', label: 'Electronics' },
              { id: 'WTB', label: 'Looking For (WTB)' },
            ].map((chip) => {
              const isSelected = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveFilter(chip.id as FilterType)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] shadow-sm'
                      : 'bg-card text-foreground/80 border-border hover:border-border/80 hover:bg-muted/30'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Listing Cards Grid ────────────────────────────────────────── */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border space-y-3">
            <SlidersHorizontal size={36} className="mx-auto text-muted-foreground opacity-50" />
            <h3 className="font-bold text-foreground text-lg">No listings match this filter</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try switching back to &quot;All Items&quot; or browse a different category.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className="mt-2 text-xs font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              Reset to All Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
