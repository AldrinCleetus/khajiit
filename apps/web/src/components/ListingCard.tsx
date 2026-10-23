import { Link } from '@tanstack/react-router';
import { ValuationBadge } from './ValuationBadge';
import { usePreferences } from '../hooks/usePreferences';
import { MapPin, Package, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Listing {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  valuation: 'great' | 'fair' | 'overpriced' | 'pending';
  location: string;
  exchangeMethod: string;
  createdAt: string;
  condition: string;
  tags: string[];
  description: string;
  category?: 'properties' | 'mobiles' | 'electronics';
  subcategory?: string;
  microSpecs?: string;
  rateSubtext?: string;
  isFeatured?: boolean;
  listingType?: 'OFFERING' | 'REQUESTING';
  seller?: {
    name: string;
    avatarUrl?: string;
    type: 'individual' | 'business';
  };
}

interface ListingCardProps {
  listing: Listing;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { formatPrice } = usePreferences();
  const isProperty = listing.category === 'properties';
  const formattedPrice = formatPrice(listing.price, isProperty);
  const isRequest = listing.listingType === 'REQUESTING';

  return (
    <Link
      to="/listing/$listingId"
      params={{ listingId: listing.id }}
      className="block h-full group"
    >
      <Card
        className={`h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md glass-card flex flex-col justify-between ${
          listing.isFeatured
            ? 'border-accent/60 ring-1 ring-accent/30 shadow-[0_0_15px_rgba(var(--accent),0.15)]'
            : 'border-border/60 hover:border-border'
        } ${isRequest ? 'bg-indigo-50/25 dark:bg-indigo-950/10' : ''}`}
      >
        <div>
          {/* Product Image & Badges */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isRequest ? 'opacity-85' : ''
              }`}
              loading="lazy"
            />

            {/* Top-left Badges (Max 2 badges in clean horizontal row) */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 max-w-[90%]">
              {listing.isFeatured && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  <Star size={10} className="fill-current" />
                  FEATURED
                </Badge>
              )}
              {isRequest ? (
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                  LOOKING FOR
                </Badge>
              ) : (
                <ValuationBadge status={listing.valuation} />
              )}
            </div>
          </div>

          <CardContent className="p-4 flex flex-col gap-2">
            {/* Price & Rate Subtext */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-primary">
                {isRequest && (
                  <span className="text-xs font-normal text-muted-foreground mr-1">
                    Budget:
                  </span>
                )}
                {formattedPrice}
              </span>
              {listing.rateSubtext && (
                <span className="text-xs text-muted-foreground font-medium">
                  {listing.rateSubtext}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-[hsl(var(--accent))] transition-colors">
              {listing.title}
            </h3>

            {/* Category Micro-Specs */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
              {listing.microSpecs ? (
                <span className="font-medium text-foreground/80 line-clamp-1">
                  {listing.microSpecs}
                </span>
              ) : (
                <span className="font-medium uppercase tracking-wider text-[11px]">
                  {listing.condition.replace(/-/g, ' ')}
                </span>
              )}
              <span className="shrink-0">• {timeAgo(listing.createdAt)}</span>
            </div>
          </CardContent>
        </div>

        {/* Footer: Location & Exchange */}
        <div className="px-4 pb-3 pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1 truncate max-w-[55%]">
            <MapPin size={13} className="shrink-0 opacity-70" />
            <span className="truncate">{listing.location}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0 font-medium text-foreground/70">
            <Package size={13} className="opacity-70" />
            <span>{listing.exchangeMethod}</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
