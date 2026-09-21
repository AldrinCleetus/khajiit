import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ListingCard, type Listing } from '../components/ListingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Settings, Heart, FolderHeart, Star, Package, MapPinned, Store } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

const DUMMY_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Sony Alpha a7 III Mirrorless Camera',
    price: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'Bangalore, KA',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date().toISOString(),
    condition: 'Used-Like New',
    tags: ['camera', 'sony'],
    description: 'Barely used camera. Moving to a new system.'
  },
  {
    id: '2',
    title: 'Vintage Leather Jacket',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'overpriced',
    location: 'Delhi, DL',
    exchangeMethod: 'Shipping Only',
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    condition: 'Used-Fair',
    tags: ['clothing', 'vintage'],
    description: 'An original 1980s leather jacket. Well-worn but still has plenty of life left.'
  }
];

const DUMMY_BOOKMARK_FOLDERS = [
  { id: 'f1', name: 'Office Setup', count: 4 },
  { id: 'f2', name: 'Summer Wardrobe', count: 12 },
  { id: 'f3', name: '3D Print Ideas', count: 2 },
];

function ProfilePage() {
  // Mock state to toggle between viewing an Individual vs viewing a Business Storefront
  const [viewAsBusiness, setViewAsBusiness] = useState(false);

  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-8">
      {/* Dev Toggle (Just for mocking) */}
      <div className="flex items-center justify-end space-x-2 bg-muted/50 p-2 rounded-lg mb-4">
        <Switch 
          id="business-mode" 
          checked={viewAsBusiness} 
          onCheckedChange={setViewAsBusiness}
        />
        <Label htmlFor="business-mode" className="text-sm text-muted-foreground">Mock View: Business Storefront</Label>
      </div>

      {viewAsBusiness ? (
        // BUSINESS STOREFRONT HEADER
        <div className="space-y-6">
          <div className="h-48 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden relative shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              alt="Store cover"
            />
          </div>
          
          <div className="px-6 flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 relative z-10">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarImage src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
              <AvatarFallback>EK</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-foreground">ElectroKart Retail</h1>
                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 mt-1">
                  Verified Business • GST: 29ABCDE1234F1Z5
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-4">
                <span className="flex items-center gap-1"><MapPin size={16} /> Bangalore, KA</span>
                <span className="flex items-center gap-1"><Star size={16} className="text-primary fill-primary" /> 4.9 (420 reviews)</span>
                <span className="flex items-center gap-1"><Store size={16} /> Member since 2021</span>
              </p>
            </div>
            <div className="flex gap-3 mb-2">
              <Button size="lg">Message Store</Button>
              <Button variant="outline" size="lg">Follow</Button>
            </div>
          </div>
        </div>
      ) : (
        // INDIVIDUAL PROFILE HEADER
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-6 bg-card border rounded-2xl shadow-sm">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex justify-center md:justify-start items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Alex Doe</h1>
              <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                Individual
              </Badge>
            </div>
            <p className="text-muted-foreground flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 pt-1">
              <span className="flex items-center gap-1"><MapPin size={16} /> New Delhi, DL</span>
              <span className="flex items-center gap-1"><Star size={16} className="text-primary fill-primary" /> 4.5 (12 reviews)</span>
              <span>Joined Sep 2026</span>
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="flex-1 md:flex-none">Message</Button>
          </div>
        </div>
      )}

      {/* TABS */}
      <Tabs defaultValue={viewAsBusiness ? "inventory" : "favorites"} className="w-full">
        <TabsList className="mb-6 bg-muted/50 h-auto p-1 border">
          {viewAsBusiness && (
            <TabsTrigger value="inventory" className="py-2.5 px-6 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Package size={16} className="mr-2" /> Store Inventory
            </TabsTrigger>
          )}
          {!viewAsBusiness && (
            <TabsTrigger value="favorites" className="py-2.5 px-6 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Heart size={16} className="mr-2" /> Favorites
            </TabsTrigger>
          )}
          {!viewAsBusiness && (
            <TabsTrigger value="bookmarks" className="py-2.5 px-6 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FolderHeart size={16} className="mr-2" /> Bookmark Folders
            </TabsTrigger>
          )}
          <TabsTrigger value="settings" className="py-2.5 px-6 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings size={16} className="mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        {viewAsBusiness && (
          <TabsContent value="inventory" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Store Inventory</h2>
              <p className="text-muted-foreground">All items currently listed by this business.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {DUMMY_LISTINGS.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {DUMMY_LISTINGS.map(listing => (
                <ListingCard key={listing.id + 'copy'} listing={{...listing, id: listing.id + 'copy'}} />
              ))}
            </div>
          </TabsContent>
        )}

        <TabsContent value="favorites" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Your Favorites</h2>
            <p className="text-muted-foreground">Items you've liked recently.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {DUMMY_LISTINGS.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Bookmark Folders</h2>
              <p className="text-muted-foreground">Organize your saved listings into custom folders.</p>
            </div>
            <Button>+ New Folder</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DUMMY_BOOKMARK_FOLDERS.map(folder => (
              <Card key={folder.id} className="hover:border-primary cursor-pointer transition-colors group">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FolderHeart size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{folder.name}</h3>
                    <p className="text-sm text-muted-foreground">{folder.count} items</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" defaultValue={viewAsBusiness ? "ElectroKart Retail" : "Alex Doe"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={viewAsBusiness ? "contact@electrokart.in" : "alex@example.com"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Default Location</Label>
                <div className="relative">
                  <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input id="location" className="pl-9" defaultValue={viewAsBusiness ? "Bangalore, KA" : "New Delhi, DL"} />
                </div>
              </div>
              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
