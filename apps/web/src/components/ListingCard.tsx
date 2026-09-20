import { Link } from '@tanstack/react-router';
import { ValuationBadge } from './ValuationBadge';
import { usePreferences } from '../hooks/usePreferences';
import { MapPin, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  const formattedPrice = formatPrice(listing.price);

  return (
    <Link to={`/listing/${listing.id}` as any} className="block h-full group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border/50 hover:border-border">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute top-2 left-2 z-10">
            <ValuationBadge status={listing.valuation} />
          </div>
        </div>
        
        <CardContent className="p-4 flex flex-col h-[calc(100%-75%)]">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold tracking-tight text-primary">
              {formattedPrice}
            </p>
            <h3 className="font-medium text-foreground line-clamp-2 leading-snug">
              {listing.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {listing.condition.replace(/-/g, ' ')}
            </span>
            <span className="text-xs text-muted-foreground">• {timeAgo(listing.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location}</span>
            <span className="flex items-center gap-1"><Package size={14} /> {listing.exchangeMethod}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
