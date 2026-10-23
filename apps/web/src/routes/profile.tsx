import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { ListingCard, type Listing } from '../components/ListingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Settings,
  Heart,
  Star,
  Store,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  CreditCard,
  RefreshCw,
  FileCheck,
  PhoneCall,
  MessageSquare,
  Flag,
  Lock,
  Eye,
  Edit3,
} from 'lucide-react';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

// ── Realistic Mock Listings across Mobiles & Electronics ───────────────

const INDIVIDUAL_ACTIVE_LISTINGS: Listing[] = [
  {
    id: 'mob-1',
    title: 'Apple iPhone 15 Pro 256GB (Natural Titanium)',
    price: 98000,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'Indiranagar, Bengaluru',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    condition: 'Used - Like New',
    category: 'mobiles',
    subcategory: 'Mobile Phones',
    microSpecs: '256GB • 94% Battery • Box & Bill',
    tags: ['apple', 'iphone', '15pro'],
    description: 'Indian retail unit with original bill, box and cable. Pristine condition.',
    isFeatured: true,
  },
  {
    id: '1',
    title: 'Sony Alpha a7 III Mirrorless Camera with 28-70mm Lens',
    price: 115000,
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'great',
    location: 'Indiranagar, Bengaluru',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: 'Shutter < 2k • 3 Purchase Options • Bill',
    tags: ['camera', 'sony', 'fullframe'],
    description: 'Barely used camera, kept inside an electronic dry cabinet throughout.',
    isFeatured: true,
  },
  {
    id: '5',
    title: 'DJI Mini 3 Pro Drone with RC Controller & Fly More Kit',
    price: 62000,
    imageUrl:
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'fair',
    location: 'Indiranagar, Bengaluru',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: '3 Batteries • Fly More Kit • Invoice',
    tags: ['drone', 'dji', 'video'],
    description: 'Flown only 4 times. Comes with DJI RC screen controller and accessories.',
  },
  {
    id: '8',
    title: 'Any working PlayStation 4 (Slim or Pro)',
    price: 15000,
    imageUrl:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'pending',
    location: 'Indiranagar, Bengaluru',
    exchangeMethod: 'Pickup',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    condition: 'Used - Fair',
    category: 'electronics',
    subcategory: 'Games & Entertainment',
    microSpecs: 'Wanted • Any Condition • Pickup Today',
    tags: ['ps4', 'gaming', 'wanted'],
    description: 'Looking to buy a working PS4. Controllers optional.',
    listingType: 'REQUESTING',
  },
];

const INDIVIDUAL_SOLD_ITEMS = [
  {
    id: 's1',
    title: 'Apple iPad Air M1 64GB Wi-Fi (Space Gray)',
    soldPrice: 34000,
    soldDate: '2 weeks ago',
    buyer: 'Vivek R.',
    category: 'Mobiles / Tablets',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 's2',
    title: 'Sony FE 50mm f/1.8 Prime Lens (E-Mount)',
    soldPrice: 13500,
    soldDate: '1 month ago',
    buyer: 'Deepa S.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 's3',
    title: 'Apple AirPods Pro (2nd Gen) with MagSafe Case',
    soldPrice: 14000,
    soldDate: '2 months ago',
    buyer: 'Sandeep M.',
    category: 'Mobiles / Audio',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 's4',
    title: 'MacBook Air M1 8GB/256GB (Gold, Battery 96%)',
    soldPrice: 52000,
    soldDate: '3 months ago',
    buyer: 'Harish K.',
    category: 'Electronics / Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

const INDIVIDUAL_REVIEWS = [
  {
    id: 'r1',
    buyerName: 'Vivek R.',
    rating: 5,
    date: '2 weeks ago',
    itemTitle: 'Apple iPad Air M1 64GB',
    comment:
      'Genuine seller. Met in Indiranagar Starbucks, tested the iPad with Apple diagnostics, original bill and box provided. Super smooth deal.',
    tags: ['Item as described', 'Original bill provided', 'Smooth pickup'],
  },
  {
    id: 'r2',
    buyerName: 'Deepa S.',
    rating: 5,
    date: '1 month ago',
    itemTitle: 'Sony FE 50mm f/1.8 Prime Lens',
    comment:
      'Lens was in pristine condition without a speck of dust or fungus. Very courteous person and patient while I inspected on my camera body.',
    tags: ['Mint condition', 'Fast response'],
  },
  {
    id: 'r3',
    buyerName: 'Harish K.',
    rating: 4.5,
    date: '3 months ago',
    itemTitle: 'MacBook Air M1',
    comment:
      'Battery cycle count matched what was promised. Clear communication and fair negotiation.',
    tags: ['Fair negotiation', 'Original charger'],
  },
];

// ── Store Inventory for ElectroKart Retail ─────────────────────────────

const STORE_INVENTORY: Listing[] = [
  {
    id: 'ek-1',
    title: 'Sony Alpha a7 IV Mirrorless Body (Shutter 1,800)',
    price: 168000,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Brigade Road, Bengaluru',
    exchangeMethod: 'Store Pickup / Express',
    createdAt: new Date().toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: 'Shutter 1.8k • 7-Day Store Warranty',
    tags: ['sony', 'a7iv', 'store-verified'],
    description: 'Certified pre-owned Sony a7 IV with box, charger, bill, and 7-day in-store testing warranty.',
    isFeatured: true,
  },
  {
    id: 'ek-2',
    title: 'MacBook Pro 16" M2 Max 32GB RAM / 1TB SSD',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'fair',
    location: 'Brigade Road, Bengaluru',
    exchangeMethod: 'Store Pickup / Courier',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    condition: 'Used - Good',
    category: 'electronics',
    subcategory: 'Computers & Laptops',
    microSpecs: '32GB RAM • 1TB SSD • Battery 92%',
    tags: ['macbook', 'm2max', 'workstation'],
    description: 'Tested flagship MacBook workstation with 140W MagSafe charger and GST invoice.',
    isFeatured: true,
  },
  {
    id: 'ek-3',
    title: 'Samsung Galaxy S24 Ultra 512GB (Titanium Gray)',
    price: 102000,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'fair',
    location: 'Brigade Road, Bengaluru',
    exchangeMethod: 'Store Pickup / Courier',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    condition: 'Used - Like New',
    category: 'mobiles',
    subcategory: 'Mobile Phones',
    microSpecs: '512GB • 12GB RAM • S-Pen & GST Bill',
    tags: ['samsung', 's24ultra', 'exchange-available'],
    description: 'Clean device. Samsung Care+ active. Trade-in exchange accepted at our retail counter.',
  },
  {
    id: 'ek-4',
    title: 'Apple iPhone 15 Pro Max 256GB (Natural Titanium)',
    price: 109000,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Brigade Road, Bengaluru',
    exchangeMethod: 'Store Pickup / Express',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    condition: 'Used - Like New',
    category: 'mobiles',
    subcategory: 'Mobile Phones',
    microSpecs: '256GB • 95% Battery • GST Bill',
    tags: ['apple', 'iphone', 'store-verified'],
    description: '100% original Indian unit. Complete with box, cable, and store warranty.',
    isFeatured: true,
  },
  {
    id: 'ek-5',
    title: 'LG C3 55-inch 4K 120Hz OLED TV (Gaming Monitor)',
    price: 89000,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'fair',
    location: 'Brigade Road, Bengaluru',
    exchangeMethod: 'Store Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    condition: 'Used - Good',
    category: 'electronics',
    subcategory: 'TVs, Video - Audio',
    microSpecs: 'OLED • 120Hz HDMI 2.1 • Tested',
    tags: ['tv', 'oled', 'gaming'],
    description: 'Zero burn-in, tested in our workshop. Remote, stand and wall mount included.',
  },
  {
    id: 'ek-6',
    title: 'Sony a6400 + Sigma 16mm f/1.4 DC DN Lens Combo',
    price: 68000,
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Brigade Road, Bengaluru',
    exchangeMethod: 'Store Pickup / Courier',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
    condition: 'Used - Like New',
    category: 'electronics',
    subcategory: 'Cameras & Lenses',
    microSpecs: 'Shutter 4.2k • 2 Batteries • Charger',
    tags: ['sony', 'sigma', 'creator-kit'],
    description: 'Popular YouTube/content creator bundle. Tested optical condition.',
  },
];

function ProfilePage() {
  // ── Perspective & Persona State ─────────────────────────────────────
  const [viewAsBusiness, setViewAsBusiness] = useState(false);
  const [isOwnerView, setIsOwnerView] = useState(false);

  // Store Inventory Filter State
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategoryFilter, setStoreCategoryFilter] = useState('ALL');
  const [storeSort, setStoreSort] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  const filteredStoreInventory = useMemo(() => {
    let result = STORE_INVENTORY.filter((item) => {
      if (storeCategoryFilter === 'CAMERAS' && !item.subcategory?.includes('Cameras')) return false;
      if (storeCategoryFilter === 'LAPTOPS' && !item.subcategory?.includes('Computers')) return false;
      if (storeCategoryFilter === 'MOBILES' && item.category !== 'mobiles') return false;

      if (storeSearch.trim()) {
        const q = storeSearch.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });

    if (storeSort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (storeSort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [storeSearch, storeCategoryFilter, storeSort]);

  return (
    <div className="container py-6 max-w-6xl mx-auto space-y-6">
      {/* ── 1. Dev / Preview Mode Control Bar ─────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye size={15} className="text-primary" />
          <span className="font-semibold text-foreground">View Mode Preview:</span>
          <span>Switch personas or test public vs. private owner dashboard view</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Persona Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="persona-mode"
              checked={viewAsBusiness}
              onCheckedChange={setViewAsBusiness}
            />
            <Label htmlFor="persona-mode" className="cursor-pointer text-xs font-medium">
              {viewAsBusiness ? 'Business: ElectroKart Retail' : 'Individual: Arjun Menon'}
            </Label>
          </div>

          {/* Perspective Switch */}
          <div className="flex items-center space-x-2 border-l border-border/80 pl-4">
            <Switch
              id="owner-mode"
              checked={isOwnerView}
              onCheckedChange={setIsOwnerView}
            />
            <Label htmlFor="owner-mode" className="cursor-pointer text-xs font-medium">
              {isOwnerView ? (
                <span className="font-bold text-[hsl(var(--accent))] flex items-center gap-1">
                  <Lock size={12} /> Owner Dashboard Mode
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1">
                  Public Visitor View
                </span>
              )}
            </Label>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. BUSINESS STOREFRONT VIEW (ElectroKart Retail)
      ══════════════════════════════════════════════════════════════ */}
      {viewAsBusiness ? (
        <div className="space-y-8">
          {/* Cover Photo & Brand Header */}
          <div className="space-y-4">
            <div className="h-56 sm:h-64 w-full rounded-3xl overflow-hidden relative shadow-sm border border-border">
              <img
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                className="w-full h-full object-cover"
                alt="ElectroKart Retail Storefront"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-bold backdrop-blur-sm">
                    🟢 Open Now
                  </span>
                  <span className="opacity-90">Closes 9:00 PM (Mon–Sat)</span>
                </div>
                <div className="text-xs opacity-80 hidden sm:block">
                  Verified Retailer on Khajiit since 2018
                </div>
              </div>
            </div>

            {/* Profile Bar */}
            <div className="px-2 sm:px-6 flex flex-col md:flex-row gap-5 items-start md:items-end -mt-14 relative z-10">
              <Avatar className="w-28 h-28 border-4 border-background shadow-xl rounded-2xl bg-card">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  className="object-cover"
                />
                <AvatarFallback className="font-bold text-xl bg-blue-600 text-white">EK</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1 mb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    ElectroKart Retail
                  </h1>
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck size={13} /> Verified Business
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-primary" /> Brigade Road, Bengaluru - 560001
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star size={14} className="text-amber-400 fill-amber-400" /> 4.9 (420 verified reviews)
                  </span>
                  <span>GSTIN: 29ABCDE1234F1Z5</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto mb-1">
                {isOwnerView ? (
                  <Button className="rounded-pill bg-[hsl(var(--accent))] text-white font-bold gap-1.5 h-11 px-6">
                    <Edit3 size={15} /> Edit Store Profile
                  </Button>
                ) : (
                  <>
                    <Button className="rounded-pill bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-bold gap-1.5 h-11 px-6 shadow-md">
                      <MessageSquare size={16} /> Message Store
                    </Button>
                    <Button variant="outline" className="rounded-pill font-bold h-11 px-4">
                      Follow
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Two-Column Storefront Layout ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Left Sidebar (Store Info & Physical Trust Card - 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Physical Shop Card */}
              <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Store size={18} className="text-primary" /> Physical Retail Counter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-foreground block">Store Address:</span>
                    <p className="text-muted-foreground leading-relaxed">
                      Shop #14, Ground Floor, Brigade Plaza, Brigade Road, Bengaluru, Karnataka 560001
                    </p>
                    <p className="text-muted-foreground pt-1">
                      <strong>Landmark:</strong> Opposite Rex Theatre Lane
                    </p>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Brigade+Road+Bengaluru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--accent))] hover:underline"
                  >
                    <ExternalLink size={13} /> Get Directions on Google Maps
                  </a>

                  {/* Shop Timings */}
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Clock size={14} className="text-emerald-500" />
                      <span>Operating Hours</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Mon – Sat:</span>
                      <strong className="text-foreground">10:00 AM – 9:00 PM</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sunday:</span>
                      <strong className="text-foreground">11:00 AM – 7:00 PM</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Guarantees & Policies */}
              <Card className="rounded-3xl border-emerald-500/30 bg-emerald-500/5 shadow-sm">
                <CardHeader className="pb-3 border-b border-emerald-500/20">
                  <CardTitle className="text-base font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600" /> Store Guarantees & Trust
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <FileCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">GST Tax Invoice on All Sales</strong>
                      <span className="text-muted-foreground">100% legal ownership transfer with valid invoice.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">7-Day Testing Warranty</strong>
                      <span className="text-muted-foreground">Full refund or replacement if any hardware defect is detected.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <RefreshCw size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Device Exchange / Trade-In</strong>
                      <span className="text-muted-foreground">Instant cash or upgrade value on old phones and cameras.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CreditCard size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">UPI, Cards & No-Cost EMI</strong>
                      <span className="text-muted-foreground">Accepted at retail counter with zero card surcharges.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call / Action */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Prefer speaking with a store technician?
                </p>
                <Button variant="outline" className="w-full rounded-pill text-xs font-bold gap-1.5">
                  <PhoneCall size={14} /> Request Callback
                </Button>
              </div>
            </div>

            {/* Right Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-2xl border border-border h-auto">
                  <TabsTrigger value="inventory" className="rounded-xl py-2 px-5 text-xs font-bold">
                    Active Inventory ({filteredStoreInventory.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-xl py-2 px-5 text-xs font-bold">
                    Customer Reviews (420)
                  </TabsTrigger>
                  <TabsTrigger value="about" className="rounded-xl py-2 px-5 text-xs font-bold">
                    About & Retail Photos
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Searchable Store Inventory */}
                <TabsContent value="inventory" className="space-y-5 pt-4">
                  {/* Search and Category Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search within ElectroKart inventory..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        className="pl-9 h-10 text-xs rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                      <select
                        aria-label="Sort store inventory"
                        value={storeSort}
                        onChange={(e) => setStoreSort(e.target.value as 'featured' | 'price-low' | 'price-high')}
                        className="h-9 px-2.5 text-xs rounded-xl bg-card border border-border text-foreground"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                      {[
                        { id: 'ALL', label: 'All' },
                        { id: 'CAMERAS', label: 'Cameras' },
                        { id: 'LAPTOPS', label: 'Laptops' },
                        { id: 'MOBILES', label: 'Mobiles' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setStoreCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                            storeCategoryFilter === cat.id
                              ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))]'
                              : 'bg-muted/30 border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listings Grid */}
                  {filteredStoreInventory.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredStoreInventory.map((item) => (
                        <ListingCard key={item.id} listing={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center rounded-2xl border border-dashed text-xs text-muted-foreground space-y-2">
                      <p className="font-semibold text-foreground">No matching items found in store.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setStoreSearch('');
                          setStoreCategoryFilter('ALL');
                        }}
                        className="text-[hsl(var(--accent))] font-bold hover:underline"
                      >
                        Clear search filters
                      </button>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 2: Store Reviews */}
                <TabsContent value="reviews" className="space-y-4 pt-4">
                  <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <span className="text-4xl font-extrabold text-foreground">4.9</span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={18} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on 420 verified buyer transactions in Bengaluru
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>✓ 100% On-time dispatch & store pickup</div>
                      <div>✓ Genuine serial numbers verified</div>
                      <div>✓ 7-Day return policy honored</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: 'Naveen Kumar',
                        date: '3 days ago',
                        item: 'Sony Alpha a7 IV Body',
                        review: 'Walked into their Brigade Road shop. Tested shutter count with my own laptop on the spot. Provided original GST invoice with warranty card. Best used camera store in Bangalore.',
                      },
                      {
                        name: 'Aishwarya S.',
                        date: '1 week ago',
                        item: 'MacBook Pro 16" M2 Max',
                        review: 'Traded in my old M1 MacBook Air and bought the 16" M2 Max. Fair trade-in appraisal and quick paperwork.',
                      },
                    ].map((rev, idx) => (
                      <Card key={idx} className="rounded-2xl border-border bg-card/60">
                        <CardContent className="p-4 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">{rev.name}</span>
                            <span className="text-muted-foreground">{rev.date}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            Bought: {rev.item}
                          </Badge>
                          <p className="text-foreground/90 leading-relaxed">{rev.review}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab 3: About & Retail Photos */}
                <TabsContent value="about" className="space-y-4 pt-4">
                  <div className="space-y-3 text-xs text-foreground/90 leading-relaxed">
                    <p>
                      <strong>ElectroKart Retail LLP</strong> has operated as an authorized electronics exchange and pre-owned camera/computing hub in Brigade Road since 2018.
                    </p>
                    <p>
                      Every piece of inventory undergoing listing on Khajiit passes a mandatory 28-point hardware diagnostic inspection: sensor cleaning, battery cycle test, thermal throttling check, and screen burn-in tests.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <img
                      src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Store Counter"
                      className="rounded-2xl aspect-video object-cover border"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Testing Workbench"
                      className="rounded-2xl aspect-video object-cover border"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            3. INDIVIDUAL SELLER PROFILE VIEW (Arjun Menon)
        ══════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Individual Header Card */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-24 h-24 border-2 border-border rounded-full shadow-sm">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Arjun Menon"
                />
                <AvatarFallback className="font-bold text-lg bg-primary text-primary-foreground">
                  AM
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Arjun Menon
                  </h1>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-bold text-xs">
                    Individual • Direct Owner
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star size={13} className="text-amber-400 fill-amber-400" /> 4.8 (12 buyer reviews)
                  </span>
                  <span>•</span>
                  <span>Member since Feb 2023</span>
                </p>

                {/* Trust & Activity Metric Row */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 pt-2 text-xs border-t border-border/50 text-muted-foreground">
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500" /> Phone & ID Verified
                  </span>
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    🤝 8 Successful Local Deals
                  </span>
                  <span className="flex items-center gap-1">
                    ⚡ Replies within 15 mins
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-primary" /> Indiranagar, Bengaluru
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                {isOwnerView ? (
                  <Button className="w-full md:w-auto rounded-pill bg-[hsl(var(--accent))] text-white font-bold gap-1.5 px-6">
                    <Edit3 size={15} /> Edit My Profile
                  </Button>
                ) : (
                  <>
                    <Button className="flex-1 md:flex-none rounded-pill bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-bold px-6 shadow-md">
                      Message
                    </Button>
                    <Button variant="outline" className="rounded-pill font-bold px-4">
                      Share
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* ── Individual Tabs ──────────────────────────────────────── */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-muted/40 p-1 rounded-2xl border border-border h-auto">
              <TabsTrigger value="active" className="rounded-xl py-2 px-5 text-xs font-bold">
                Active Listings ({INDIVIDUAL_ACTIVE_LISTINGS.length})
              </TabsTrigger>
              <TabsTrigger value="sold" className="rounded-xl py-2 px-5 text-xs font-bold">
                Sold Items ({INDIVIDUAL_SOLD_ITEMS.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl py-2 px-5 text-xs font-bold">
                Buyer Reviews ({INDIVIDUAL_REVIEWS.length})
              </TabsTrigger>

              {/* Owner-Only Tabs */}
              {isOwnerView && (
                <>
                  <TabsTrigger value="favorites" className="rounded-xl py-2 px-5 text-xs font-bold gap-1.5 text-primary">
                    <Heart size={13} /> Saved Favorites
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-xl py-2 px-5 text-xs font-bold gap-1.5">
                    <Settings size={13} /> Settings
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Tab 1: Active Listings */}
            <TabsContent value="active" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {INDIVIDUAL_ACTIVE_LISTINGS.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </TabsContent>

            {/* Tab 2: Sold Items History (Essential Trust Signal) */}
            <TabsContent value="sold" className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>
                  Past completed transactions build marketplace trust. Shows this seller has a genuine local track record.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {INDIVIDUAL_SOLD_ITEMS.map((item) => (
                  <Card key={item.id} className="rounded-2xl border-border bg-card/60 overflow-hidden">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale opacity-75" />
                      <Badge className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold">
                        SOLD
                      </Badge>
                    </div>
                    <CardContent className="p-3.5 space-y-1.5 text-xs">
                      <span className="font-bold text-foreground line-clamp-1">{item.title}</span>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-bold text-primary">₹{item.soldPrice.toLocaleString('en-IN')}</span>
                        <span>Sold {item.soldDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab 3: Buyer Reviews */}
            <TabsContent value="reviews" className="space-y-3 pt-4">
              {INDIVIDUAL_REVIEWS.map((rev) => (
                <Card key={rev.id} className="rounded-2xl border-border bg-card/60">
                  <CardContent className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{rev.buyerName}</span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-muted-foreground">{rev.date}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Purchased: <strong className="text-foreground">{rev.itemTitle}</strong>
                    </div>

                    <p className="text-foreground/90 leading-relaxed">{rev.comment}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] rounded-full">
                          ✓ {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Tab 4: Owner Favorites & Settings (Only visible in Owner Mode) */}
            {isOwnerView && (
              <>
                <TabsContent value="favorites" className="space-y-4 pt-4">
                  <h3 className="font-bold text-sm">Your Saved Listings (Private)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {INDIVIDUAL_ACTIVE_LISTINGS.slice(0, 2).map((item) => (
                      <ListingCard key={item.id} listing={item} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="pt-4">
                  <Card className="max-w-2xl rounded-3xl border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Account Settings</CardTitle>
                      <CardDescription>Manage your profile, phone verification and alert settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <Label htmlFor="userName" className="text-xs font-semibold">Full Name</Label>
                        <Input id="userName" defaultValue="Arjun Menon" className="h-10 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="userEmail" className="text-xs font-semibold">Email Address</Label>
                        <Input id="userEmail" defaultValue="arjun.menon@example.com" className="h-10 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="userCity" className="text-xs font-semibold">City / Locality</Label>
                        <Input id="userCity" defaultValue="Indiranagar, Bengaluru, KA" className="h-10 text-xs" />
                      </div>
                      <Button className="rounded-pill bg-[hsl(var(--accent))] text-white font-bold px-6 mt-2">
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>

          {/* Report link for public visitors */}
          {!isOwnerView && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => alert('Report submitted for review.')}
                className="text-[11px] text-muted-foreground hover:text-destructive flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <Flag size={11} /> Report suspicious profile or activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
