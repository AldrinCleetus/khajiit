import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Target, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [selectedLocation, setSelectedLocation] = useState('India');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-2xl font-bold tracking-tight">
          <span className="text-primary">Fair</span>
          <span className="text-muted-foreground">Trade</span>
        </Link>
        
        {/* Search & Location Group */}
        <div className="flex flex-1 items-center gap-2 max-w-2xl px-4">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 w-48 justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <MapPin size={16} className="text-muted-foreground shrink-0" />
                  <span className="truncate">{selectedLocation}</span>
                </div>
                <ChevronDown size={16} className="text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem className="text-primary font-medium cursor-pointer">
                <Target size={16} className="mr-2" /> Use current location
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Recent Locations</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedLocation('Vytila')} className="cursor-pointer">
                <MapPin size={16} className="mr-2 text-muted-foreground" /> Vytila
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLocation('Kochi')} className="cursor-pointer">
                <MapPin size={16} className="mr-2 text-muted-foreground" /> Kochi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLocation('Kerala')} className="cursor-pointer">
                <MapPin size={16} className="mr-2 text-muted-foreground" /> Kerala
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input 
            type="search" 
            placeholder="Search items..." 
            className="flex-1"
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} title="Toggle Dark Mode">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button asChild variant="outline" className="font-semibold">
            <Link to={"/sell" as any}>Sell</Link>
          </Button>
          
          <Link to="/profile" className="ml-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
              A
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
