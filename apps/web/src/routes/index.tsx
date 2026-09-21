import { createFileRoute } from '@tanstack/react-router';
import { ListingCard, type Listing } from '../components/ListingCard';

export const Route = createFileRoute('/')({
  component: Index,
});

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Sony Alpha a7 III Mirrorless Camera',
    price: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Bangalore, KA',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    condition: 'Used-Like-New',
    tags: ['camera', 'sony', 'photography'],
    description: 'Barely used Sony a7 III body with original box and accessories. Shutter count under 5k. Upgrading to a7 IV.',
    isFeatured: true
  },
  {
    id: '2',
    title: 'MacBook Pro M2 Max 32GB/1TB',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    valuation: 'fair',
    location: 'Mumbai, MH',
    exchangeMethod: 'Pickup',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    condition: 'Used-Good',
    tags: ['laptop', 'apple', 'macbook'],
    description: 'Selling my work laptop. Has a minor scratch on the lid, but works perfectly. Battery health 92%.',
    isFeatured: true
  },
  {
    id: '3',
    title: 'Vintage Leather Jacket',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'overpriced',
    location: 'Delhi, DL',
    exchangeMethod: 'Shipping Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    condition: 'Used-Fair',
    tags: ['clothing', 'vintage', 'leather'],
    description: 'An original 1980s leather jacket. Well-worn but still has plenty of life left.'
  },
  {
    id: 'plot-1',
    title: '2400 sq.ft Premium Residential Plot in North Bangalore',
    price: 12500000,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'pending',
    location: 'Devanahalli, Bangalore',
    exchangeMethod: 'In-Person Registration',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    condition: 'Clear Title / A-Khata',
    tags: ['real-estate', 'plot', 'investment'],
    description: 'Prime residential plot near the upcoming tech park. East facing, clear titles.',
    isFeatured: true
  },
  {
    id: '4',
    title: 'Nintendo Switch OLED',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Kochi, KL',
    exchangeMethod: 'Drop-off',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    condition: 'New',
    tags: ['gaming', 'nintendo', 'console'],
    description: 'Brand new in box, never opened. Unwanted gift.'
  },
  {
    id: '5',
    title: 'DJI Mini 3 Pro Drone',
    price: 62000,
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'fair',
    location: 'Pune, MH',
    exchangeMethod: 'Pickup / Drop-off',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    condition: 'Used-Like-New',
    tags: ['drone', 'dji', 'video'],
    description: 'Comes with DJI RC controller and Fly More kit. Flown maybe 3 times.'
  },
  {
    id: '6',
    title: 'Custom 3D Printed Mechanical Keyboard Case',
    price: 5400,
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Chennai, TN',
    exchangeMethod: 'Drop-off',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    condition: 'New',
    tags: ['3d-print', 'custom', 'keyboard'],
    description: 'Custom designed and 3D printed 60% keyboard case. Made from durable PETG. Comes with mounting hardware.'
  },
  {
    id: '7',
    title: 'Hand-Embroidered Denim Jacket',
    price: 9900,
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f209bfc8d40a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'fair',
    location: 'Hyderabad, TS',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    condition: 'New',
    tags: ['embroidery', 'fashion', 'handmade'],
    description: 'Unique Levi\'s jacket with custom floral hand-embroidery on the back panel. Size Medium. One of a kind piece.'
  },
];

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function Index() {
  return (
    <div className="container py-8 space-y-12">
      <section className="py-20 text-center space-y-6 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl border">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Find great deals, <span className="text-primary">backed by AI.</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative px-4">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            type="text" 
            className="w-full pl-12 h-14 text-lg rounded-full shadow-sm border-2 focus-visible:ring-primary/20" 
            placeholder="What are you looking for? (e.g., 'MacBook Pro under 1 lakh')" 
          />
        </div>
      </section>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Fresh Recommendations</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {MOCK_LISTINGS.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
