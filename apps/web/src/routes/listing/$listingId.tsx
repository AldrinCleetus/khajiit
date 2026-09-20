import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ValuationBadge } from '../../components/ValuationBadge';
import { usePreferences } from '../../hooks/usePreferences';
import { Heart, Share2, MapPin, Handshake, BarChart3, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/listing/$listingId')({
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { formatPrice } = usePreferences();

  const item = {
    title: 'Sony Alpha a7 III Mirrorless Camera with 28-70mm Lens',
    basePrice: 115000, 
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    valuation: 'great' as const,
    location: 'Bangalore, KA',
    exchangeMethod: 'Pickup / Drop-off',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    condition: 'Used - Like New',
    tags: ['camera', 'sony', 'photography', 'mirrorless'],
    description: `Selling my Sony a7 III mirrorless camera. It's in pristine condition, barely used. I bought it last year for a trip but haven't touched it much since. 
    
Comes with the original kit lens (28-70mm), original battery, charger, strap, and the box. Shutter count is strictly under 2,000. 

No scratches on the sensor or the screen (screen protector applied since day 1). 
Feel free to ask any questions or request more photos!`,
    seller: {
      name: 'Sarah Jenkins',
      joined: 'Feb 2024',
      rating: 4.8,
      reviews: 12
    },
    options: [
      { id: 'opt-1', title: 'Camera + Lens (Full Bundle)', price: 115000 },
      { id: 'opt-2', title: 'Camera Body Only', price: 90000 },
      { id: 'opt-3', title: '28-70mm Lens Only', price: 29000 },
    ],
    publicOffers: [
      { id: 'o1', buyerName: 'Rahul', amount: 105000, timeAgo: '2h ago' },
      { id: 'o2', buyerName: 'Priya', amount: 95000, timeAgo: '5h ago' },
      { id: 'o3', buyerName: 'Aman', amount: 80000, timeAgo: '1d ago' },
      { id: 'o4', buyerName: 'Sanjay', amount: 110000, timeAgo: '30m ago' },
      { id: 'o5', buyerName: 'Karthik', amount: 85000, timeAgo: '2d ago' },
      { id: 'o6', buyerName: 'Neha', amount: 90000, timeAgo: '3d ago' },
      { id: 'o7', buyerName: 'Vikram', amount: 75000, timeAgo: '4d ago' },
    ]
  };

  const [selectedOptionId, setSelectedOptionId] = useState(item.options[0].id);
  const activeOption = item.options.find(opt => opt.id === selectedOptionId) || item.options[0];

  const images = [
    item.imageUrl,
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted group">
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handlePrev}
            >
              <ChevronLeft size={20} />
            </Button>
            <img 
              src={images[activeImageIndex]} 
              alt={item.title} 
              className="w-full h-full object-contain" 
            />
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleNext}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button 
                key={index}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-4 border-b pb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => alert('Added to favorites!')}>
                  <Heart size={16} className="mr-1" /> Save
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: item.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}>
                  <Share2 size={16} className="mr-1" /> Share
                </Button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground leading-tight">{item.title}</h1>
            
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(activeOption.price)}</span>
              <div className="mb-1">
                <ValuationBadge status={item.valuation} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Select Purchase Option</h3>
            <div className="space-y-2">
              {item.options.map((opt) => (
                <div 
                  key={opt.id} 
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedOptionId === opt.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-border/80 bg-card'
                  }`}
                  onClick={() => setSelectedOptionId(opt.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{opt.title}</span>
                    <span className="font-bold text-primary">{formatPrice(opt.price)}</span>
                  </div>
                  <div className={`absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center ${
                    selectedOptionId === opt.id ? 'border-primary' : 'border-muted'
                  }`}>
                    {selectedOptionId === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg">Message Seller</Button>
            <Button className="flex-1" variant="outline" size="lg">Make Offer</Button>
          </div>

          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <BarChart3 size={18} /> Transparent Bidding
              </div>
              <p className="text-sm text-muted-foreground">Top 5 highest offers:</p>
              <div className="space-y-2">
                {[...item.publicOffers]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((offer) => (
                  <div key={offer.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">{offer.buyerName}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">{formatPrice(offer.amount)}</span>
                      <span className="text-xs text-muted-foreground w-12 text-right">{offer.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 py-4 border-y">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Condition</span>
              <p className="font-medium text-foreground">{item.condition}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</span>
              <p className="font-medium text-foreground flex items-center gap-1"><MapPin size={14} className="text-muted-foreground" /> {item.location}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Exchange</span>
              <p className="font-medium text-foreground flex items-center gap-1"><Handshake size={14} className="text-muted-foreground" /> {item.exchangeMethod}</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                {item.seller.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.seller.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Joined {item.seller.joined} • <Star size={12} className="fill-primary text-primary" /> {item.seller.rating} ({item.seller.reviews} reviews)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 lg:w-2/3 space-y-6">
        <h2 className="text-xl font-bold text-foreground border-b pb-2">Description</h2>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          {item.description.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 pt-4">
          {item.tags.map(tag => (
            <Badge key={tag} variant="secondary">#{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
