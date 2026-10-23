import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ValuationBadge } from '../../components/ValuationBadge';
import { usePreferences } from '../../hooks/usePreferences';
import { ListingLocationMap } from '../../components/ListingLocationMap';
import {
  Heart,
  Share2,
  BarChart3,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Package,
  Calendar,
  AlertTriangle,
  Flag,
  Camera,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/listing/$listingId')({
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { listingId } = Route.useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { formatPrice } = usePreferences();

  // Mock Data
  const isPlot = listingId === 'plot-1' || listingId === 'plot-2';

  // 1. Camera / Electronics Mock Item
  const cameraItem = {
    title: 'Sony Alpha a7 III Mirrorless Camera with 28-70mm Lens',
    listingType: 'OFFERING' as const,
    basePrice: 115000,
    marketEstimate: '₹1,22,000 – ₹1,30,000',
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'great' as const,
    location: 'Indiranagar, Bengaluru',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    condition: 'Used - Like New',
    tags: ['sony', 'a7iii', 'fullframe', 'photography'],
    description: `Selling my personal Sony a7 III full-frame mirrorless camera with kit lens. Pristine cosmetic and functional condition, kept inside an electronic dry cabinet throughout.\n\nPurchased from Sony Center Indiranagar. Shutter count is strictly under 2,000 actuations.\n\nComes with the original box, FE 28-70mm OSS lens, original Sony NP-FZ100 battery, strap, lens hood, and original GST tax invoice.\n\nBuyers are welcome to test the autofocus, sensor, and buttons in person before paying.`,
    specs: [
      { label: 'Brand', value: 'Sony' },
      { label: 'Model', value: 'Alpha a7 III (ILCE-7M3)' },
      { label: 'Shutter Count', value: '< 2,000 actuations' },
      { label: 'Mount Type', value: 'Sony E-Mount' },
      { label: 'Sensor Format', value: '35mm Full Frame (24.2 MP)' },
      { label: 'Condition', value: 'Used - Like New (No scratches/dust)' },
      { label: 'Age of Item', value: '1 – 2 Years' },
      { label: 'Battery Health', value: 'Original Sony 100% capacity' },
    ],
    verification: {
      bill: 'Original Indian GST Invoice Available',
      box: 'Original Box, Strap & Cables Included',
      warranty: 'Out of Warranty (Bought Oct 2023)',
      authenticity: '100% Genuine Indian Unit (Verified Serial)',
    },
    seller: {
      name: 'Karthik Nair',
      joined: 'Feb 2024',
      rating: 4.8,
      reviews: 12,
      type: 'individual' as const,
      verifiedOwner: true,
      verifiedPhone: true,
      verifiedUpi: true,
      salesCount: 4,
      responseTime: 'Typically replies in 15 mins',
    },
    options: [
      { id: 'opt-1', title: 'Camera + 28-70mm Lens (Full Bundle)', price: 115000 },
      { id: 'opt-2', title: 'Camera Body Only', price: 90000 },
      { id: 'opt-3', title: '28-70mm Lens Only', price: 29000 },
    ],
    publicOffers: [
      { id: 'o1', buyerName: 'Sanjay M.', amount: 110000, timeAgo: '30m ago', verified: true },
      { id: 'o2', buyerName: 'Rahul K.', amount: 105000, timeAgo: '2h ago', verified: true },
      { id: 'o3', buyerName: 'Priya V.', amount: 95000, timeAgo: '5h ago', verified: true },
    ],
  };

  // 2. Real Estate / Plot Mock Item
  const plotItem = {
    title: '2400 sq.ft Premium Residential Plot in North Bangalore',
    listingType: 'OFFERING' as const,
    basePrice: 12500000,
    marketEstimate: '₹1.30 Cr – ₹1.45 Cr',
    rateSubtext: '₹5,208 / sq.ft',
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'great' as const,
    location: 'Devanahalli, North Bengaluru',
    exchangeMethod: 'In-Person Registration',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    condition: 'Clear Title / A-Khata',
    tags: ['real-estate', 'plot', 'bangalore', 'north-bangalore'],
    description: `Prime residential plot located in the rapidly appreciating North Bangalore tech corridor, just 15 minutes from Kempegowda International Airport.\n\n- Dimensions: 40 x 60 ft (2,400 sq.ft total)\n- Facing: East Facing\n- Title: A-Khata with up-to-date tax receipts and encumbrance certificate (EC)\n- Approvals: Approved for SBI & HDFC home construction loans\n- Road: Dual road access with 40ft wide main approach\n\nDirect builder sale with clean legal documentation. Inspect the exact polygon boundaries on the satellite map below.`,
    specs: [
      { label: 'Plot Area', value: '2,400 Sq. Ft. (5.5 Cents)' },
      { label: 'Price per Sq. Ft.', value: '₹5,208 / sq.ft' },
      { label: 'Title / Khata', value: 'A-Khata (Clear Titles)' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Dimensions', value: '40 x 60 ft' },
      { label: 'Road Width', value: '40 ft Frontage' },
      { label: 'Boundary Wall', value: 'Built & Demarcated' },
      { label: 'Bank Approvals', value: 'SBI, HDFC, ICICI Pre-Approved' },
    ],
    verification: {
      bill: 'Original Registered Title Deed & EC Available',
      box: 'Demarcated Boundary Stones with Survey Map',
      warranty: 'Clear Encumbrance Certificate (30-year check)',
      authenticity: 'Direct Owner / Developer Listing',
    },
    seller: {
      name: 'Rohan Sharma',
      businessName: 'AcreGreen Realty LLP',
      joined: 'Jan 2022',
      rating: 4.9,
      reviews: 142,
      type: 'business' as const,
      verifiedGst: true,
      verifiedPhone: true,
      salesCount: 38,
      responseTime: 'Typically replies in 5 mins',
    },
    options: [
      { id: 'opt-1', title: 'Outright Land Purchase', price: 12500000 },
      { id: 'opt-2', title: 'Plot + Custom Construction Package', price: 18500000 },
    ],
    publicOffers: [
      { id: 'o1', buyerName: 'K. Rao', amount: 12200000, timeAgo: '4h ago', verified: true },
      { id: 'o2', buyerName: 'Anand T.', amount: 12000000, timeAgo: '1d ago', verified: true },
    ],
  };

  // 3. Request / Wanted Mock Item
  const requestItem = {
    title: 'Any working PlayStation 4 (Slim or Pro)',
    basePrice: 15000,
    marketEstimate: '₹14,000 – ₹17,000',
    imageUrl:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'pending' as const,
    location: 'Bangalore, KA',
    exchangeMethod: 'Pickup',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    condition: 'Used - Fair',
    tags: ['ps4', 'gaming', 'wanted'],
    description: `Looking to buy a working PS4. Don't care about cosmetic scuffs as long as the HDMI port works, disc drive functions, and it doesn't overheat.\n\nWilling to pick it up anywhere in Bangalore and pay cash/UPI on the spot.`,
    specs: [
      { label: 'Looking For', value: 'Sony PS4 (Slim or Pro)' },
      { label: 'Condition Desired', value: 'Working (Cosmetics okay)' },
      { label: 'Preferred Location', value: 'Bangalore (Any locality)' },
      { label: 'Payment Method', value: 'Immediate UPI / Cash on inspection' },
    ],
    verification: {
      bill: 'Cash / UPI Ready',
      box: 'Controllers optional',
      warranty: 'Will test on pickup',
      authenticity: 'Buyer OTP Verified',
    },
    seller: {
      name: 'Karthik',
      joined: 'Oct 2023',
      rating: 5.0,
      reviews: 2,
      type: 'individual' as const,
      verifiedPhone: true,
      verifiedUpi: true,
      salesCount: 1,
      responseTime: 'Typically replies in 10 mins',
    },
    listingType: 'REQUESTING' as const,
    options: [{ id: 'opt-1', title: 'Budget', price: 15000 }],
    publicOffers: [],
  };

  const item = listingId === '8' ? requestItem : isPlot ? plotItem : cameraItem;
  const isRequest = item.listingType === 'REQUESTING';

  const [selectedOptionId, setSelectedOptionId] = useState(item.options[0]?.id);
  const activeOption =
    item.options.find((opt) => opt.id === selectedOptionId) || item.options[0];

  // Realistic Product Images (No random stock office photos!)
  const images = [
    item.imageUrl,
    isPlot
      ? 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      : isRequest
      ? item.imageUrl
      : 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isPlot
      ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      : isRequest
      ? item.imageUrl
      : 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Lens & accessories on table (relevant product photography)
  ];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ══════════════════════════════════════════════════════════════
            LEFT COLUMN (7 cols): Photos, Specs, Description, Real Map
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-muted/40 shadow-sm group">
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full shadow-md"
                onClick={handlePrev}
              >
                <ChevronLeft size={20} />
              </Button>

              <img
                src={images[activeImageIndex]}
                alt={item.title}
                className="w-full h-full object-contain p-2"
              />

              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full shadow-md"
                onClick={handleNext}
              >
                <ChevronRight size={20} />
              </Button>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails row */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === index
                      ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                      : 'border-border/60 opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── 2. Structured Item Specifications Grid (Above Description) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-xl font-bold text-foreground">
                Item Specifications
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                Verified Seller Inputs
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5">
              {item.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 rounded-2xl bg-card border border-border/70 flex flex-col justify-center"
                >
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground pt-0.5">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Description ────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground border-b pb-2">
              Description from Seller
            </h2>
            <div className="space-y-3 text-foreground/90 text-sm leading-relaxed whitespace-pre-line">
              {item.description}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* ── 1. Interactive Leaflet Map (Fixed Projection) ───────── */}
          <div className="pt-2">
            <ListingLocationMap
              isPlot={isPlot}
              locationName={item.location}
              center={isPlot ? [13.2437, 77.7126] : [12.9784, 77.6408]}
              radiusMeters={2000}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT COLUMN (5 cols): Trust Badges, Price, CTAs, Anti-Scam
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Price Block */}
          <div className="space-y-3.5 border-b pb-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => alert('Saved to favorites!')}
                >
                  <Heart size={14} className="mr-1" /> Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: item.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Listing link copied to clipboard!');
                    }
                  }}
                >
                  <Share2 size={14} className="mr-1" /> Share
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-foreground leading-snug">
              {item.title}
            </h1>

            {/* Price Row with Credible Valuation Context */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2.5">
                {isRequest && (
                  <span className="text-lg font-medium text-muted-foreground">Budget:</span>
                )}
                <span className="text-3xl font-extrabold text-primary tracking-tight">
                  {formatPrice(activeOption?.price || item.basePrice, isPlot)}
                </span>
                {!isRequest && (
                  <div className="ml-1">
                    <ValuationBadge status={item.valuation} />
                  </div>
                )}
              </div>

              {/* 5. Explain the Fair Price Badge (No AI mention) */}
              {!isRequest && item.marketEstimate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>
                    Estimated fair market value: <strong>{item.marketEstimate}</strong> for this condition.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Purchase Options (If Multi-Option Available) ──────── */}
          {!isRequest && item.options.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Layers size={15} className="text-[hsl(var(--accent))]" />
                  Select Purchase Option
                </h3>
                <span className="text-xs text-muted-foreground">Choose package</span>
              </div>
              <div className="space-y-2">
                {item.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedOptionId === opt.id
                        ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 shadow-sm'
                        : 'border-border hover:border-border/80 bg-card'
                    }`}
                    onClick={() => setSelectedOptionId(opt.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{opt.title}</span>
                      <span className="font-extrabold text-primary text-sm">
                        {formatPrice(opt.price, isPlot)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 2. "Proof of Ownership & Bill" Trust Strip (Above Fold) */}
          <Card className="border-emerald-500/30 bg-emerald-500/5 overflow-hidden rounded-2xl">
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Verified Inclusions & Ownership
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-start gap-2 text-foreground/90">
                  <FileCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Invoice / Bill:</strong> {item.verification.bill}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-foreground/90">
                  <Package size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Box & Packaging:</strong> {item.verification.box}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-foreground/90">
                  <Calendar size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Warranty Status:</strong> {item.verification.warranty}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-foreground/90">
                  <Camera size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Original Photos:</strong> {item.verification.authenticity}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Action Buttons */}
          <div className="space-y-2">
            <div className="flex gap-3">
              <Button className="flex-1 rounded-pill bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-bold h-12 shadow-md">
                {isRequest ? 'Message Buyer' : 'Message Seller'}
              </Button>
              <Button className="flex-1 rounded-pill font-bold h-12" variant="outline">
                {isRequest ? 'Offer Item' : 'Make Offer'}
              </Button>
            </div>
          </div>

          {/* ── 6. Anti-Scam Reassurance Callout (Near CTAs) ─────────── */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs text-foreground/90">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
              <AlertTriangle size={15} />
              <span>Safe Local Deal Guidelines</span>
            </div>
            <ul className="space-y-1 text-muted-foreground list-disc pl-4 text-[11px] leading-relaxed">
              <li>Inspect and test the item in person before making any payment.</li>
              <li>Never pay advance &quot;booking&quot; or &quot;courier/army transfer&quot; fees.</li>
              <li>
                <strong>Remember:</strong> You NEVER need to scan a QR code or enter your UPI PIN to receive money.
              </li>
            </ul>
          </div>

          {/* ── 5. Credible Transparent Bidding Box ──────────────────── */}
          {!isRequest && (
            <Card className="bg-muted/20 border-dashed rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <BarChart3 size={17} className="text-primary" /> Transparent Bidding
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    Top Offers
                  </Badge>
                </div>

                <div className="space-y-2">
                  {[...item.publicOffers]
                    .sort((a, b) => b.amount - a.amount)
                    .map((offer) => (
                      <div
                        key={offer.id}
                        className="flex justify-between items-center text-xs p-2 rounded-xl bg-card border border-border/60"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{offer.buyerName}</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">
                            <ShieldCheck size={11} /> Phone Verified
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">
                            {formatPrice(offer.amount, isPlot)}
                          </span>
                          <span className="text-[10px] text-muted-foreground w-12 text-right">
                            {offer.timeAgo}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  🔒 Only OTP phone-verified buyers can place binding offers. Shill bids are blocked.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Overview Badges: Condition, Location, Exchange */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/60 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Condition
              </span>
              <p className="text-xs font-bold text-foreground truncate">{item.condition}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Location
              </span>
              <p className="text-xs font-bold text-foreground truncate">{item.location}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Exchange
              </span>
              <p className="text-xs font-bold text-foreground truncate">{item.exchangeMethod}</p>
            </div>
          </div>

          {/* ── 4. Upgraded "About the Seller" Card ──────────────────── */}
          <Card className="rounded-3xl border-border bg-card/70 overflow-hidden shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-bold text-sm text-foreground">
                  {isRequest ? 'About the Buyer' : 'About the Seller'}
                </h3>
                {item.seller.type === 'business' ? (
                  <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 text-[10px] font-bold">
                    Verified Business (GST Registered)
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px] font-bold">
                    Direct Owner (Not a Dealer)
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shrink-0">
                  {item.seller.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-base truncate">
                    {item.seller.name}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    Member since {item.seller.joined} •{' '}
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <strong>{item.seller.rating}</strong> ({item.seller.reviews} reviews)
                  </p>
                </div>
              </div>

              {/* Concrete Verification Badges */}
              <div className="grid grid-cols-1 gap-2 pt-2 text-xs border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>
                    <strong>Phone & UPI Verified</strong> (KYC Match)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>
                    <strong>{item.seller.salesCount} Successful Deals</strong> on Khajiit
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">⏱️</span>
                  <span>{item.seller.responseTime}</span>
                </div>
              </div>

              <div className="pt-2">
                {item.seller.type === 'business' ? (
                  <Button variant="outline" className="w-full rounded-pill text-xs font-semibold">
                    View Business Inventory
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full rounded-pill text-xs font-semibold">
                    View Seller Profile & History
                  </Button>
                )}
              </div>

              {/* Report Listing Action */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => alert('Report submitted for review. Thank you for keeping Khajiit safe!')}
                  className="text-[11px] text-muted-foreground hover:text-destructive flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <Flag size={11} /> Report suspicious listing or dealer
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
