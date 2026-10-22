import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Check, ChevronDown, RotateCcw } from 'lucide-react';

interface MobileDevice {
  brand: string;
  model: string;
  type: 'phone' | 'tablet';
}

const POPULAR_DEVICES: MobileDevice[] = [
  // Apple iPhones
  { brand: 'Apple', model: 'iPhone 15 Pro Max', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 15 Pro', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 15 Plus', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 15', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 14 Pro Max', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 14 Pro', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 14', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 13 Pro Max', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 13', type: 'phone' },
  { brand: 'Apple', model: 'iPhone 12', type: 'phone' },
  { brand: 'Apple', model: 'iPhone SE (3rd Gen)', type: 'phone' },
  // Apple iPads
  { brand: 'Apple', model: 'iPad Pro 13" (M4)', type: 'tablet' },
  { brand: 'Apple', model: 'iPad Pro 11" (M4)', type: 'tablet' },
  { brand: 'Apple', model: 'iPad Air 11" (M2)', type: 'tablet' },
  { brand: 'Apple', model: 'iPad (10th Gen)', type: 'tablet' },
  { brand: 'Apple', model: 'iPad Mini (6th Gen)', type: 'tablet' },

  // Samsung
  { brand: 'Samsung', model: 'Galaxy S24 Ultra', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy S24+', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy S24', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy Z Fold 5', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy Z Flip 5', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy S23 Ultra', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy S23 FE', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy A55 5G', type: 'phone' },
  { brand: 'Samsung', model: 'Galaxy Tab S9 Ultra', type: 'tablet' },
  { brand: 'Samsung', model: 'Galaxy Tab S9 FE', type: 'tablet' },

  // OnePlus
  { brand: 'OnePlus', model: 'OnePlus 12', type: 'phone' },
  { brand: 'OnePlus', model: 'OnePlus 12R', type: 'phone' },
  { brand: 'OnePlus', model: 'OnePlus Open', type: 'phone' },
  { brand: 'OnePlus', model: 'OnePlus 11 5G', type: 'phone' },
  { brand: 'OnePlus', model: 'OnePlus Nord CE 4', type: 'phone' },
  { brand: 'OnePlus', model: 'OnePlus Pad', type: 'tablet' },

  // Google
  { brand: 'Google', model: 'Pixel 8 Pro', type: 'phone' },
  { brand: 'Google', model: 'Pixel 8', type: 'phone' },
  { brand: 'Google', model: 'Pixel 8a', type: 'phone' },
  { brand: 'Google', model: 'Pixel 7 Pro', type: 'phone' },
  { brand: 'Google', model: 'Pixel 7a', type: 'phone' },
  { brand: 'Google', model: 'Pixel Fold', type: 'phone' },
  { brand: 'Google', model: 'Pixel Tablet', type: 'tablet' },

  // Xiaomi & others
  { brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', type: 'phone' },
  { brand: 'Xiaomi', model: 'Xiaomi 14', type: 'phone' },
  { brand: 'Redmi', model: 'Redmi Note 13 Pro+ 5G', type: 'phone' },
  { brand: 'Xiaomi', model: 'Xiaomi Pad 6', type: 'tablet' },
];

interface MobileModelSelectorProps {
  brand: string;
  model: string;
  isManualModel: boolean;
  subcategory: string;
  onChange: (updates: {
    brand: string;
    model: string;
    isManualModel: boolean;
    suggestedTitle?: string;
  }) => void;
}

export function MobileModelSelector({
  brand,
  model,
  isManualModel,
  subcategory,
  onChange,
}: MobileModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close combobox when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDevices = useMemo(() => {
    const isTablet = subcategory.toLowerCase().includes('tablet');
    return POPULAR_DEVICES.filter((d) => {
      if (isTablet && d.type !== 'tablet') return false;
      if (!isTablet && subcategory.includes('Phone') && d.type === 'tablet')
        return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.brand.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        `${d.brand} ${d.model}`.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, subcategory]);

  const selectedDisplay =
    brand && model ? `${brand} ${model}` : 'Select phone / tablet model...';

  if (isManualModel) {
    return (
      <div className="space-y-4 p-4 rounded-2xl border border-dashed border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Manual Device Entry
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                brand: '',
                model: '',
                isManualModel: false,
              })
            }
            className="text-xs text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 gap-1 h-7 px-2"
          >
            <RotateCcw size={12} /> Use Model Directory
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Brand / Manufacturer</Label>
            <Input
              placeholder="e.g. Motorola, Nothing, Vivo"
              value={brand}
              onChange={(e) =>
                onChange({
                  brand: e.target.value,
                  model,
                  isManualModel: true,
                  suggestedTitle: `${e.target.value} ${model}`.trim(),
                })
              }
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Model Name & Number</Label>
            <Input
              placeholder="e.g. Phone (2) 5G"
              value={model}
              onChange={(e) =>
                onChange({
                  brand,
                  model: e.target.value,
                  isManualModel: true,
                  suggestedTitle: `${brand} ${e.target.value}`.trim(),
                })
              }
              className="h-11"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">
            Device Model <span className="text-destructive">*</span>
          </Label>
          <Badge
            variant="secondary"
            className="text-[10px] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/20 gap-1 font-semibold"
          >
            <Sparkles size={10} /> Recommended
          </Badge>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              brand: '',
              model: '',
              isManualModel: true,
            })
          }
          className="text-xs text-muted-foreground hover:text-[hsl(var(--accent))] transition-colors"
        >
          Can't find device? Enter manually
        </button>
      </div>

      {/* Combobox Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 rounded-xl border border-input bg-card text-left flex items-center justify-between hover:border-[hsl(var(--accent))]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span
          className={`text-sm truncate ${
            brand && model ? 'font-medium text-foreground' : 'text-muted-foreground'
          }`}
        >
          {selectedDisplay}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border bg-popover shadow-xl overflow-hidden backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="p-3 border-b border-border/50 bg-muted/30">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                autoFocus
                placeholder="Search by brand or model (e.g. iPhone 15, S24, Pixel)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm bg-background"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => {
                const isSelected =
                  device.brand === brand && device.model === model;
                return (
                  <button
                    key={`${device.brand}-${device.model}`}
                    type="button"
                    onClick={() => {
                      onChange({
                        brand: device.brand,
                        model: device.model,
                        isManualModel: false,
                        suggestedTitle: `${device.brand} ${device.model}`,
                      });
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-sm flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[hsl(var(--accent))] text-white font-medium'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="opacity-70 text-xs w-16 shrink-0 font-medium">
                        {device.brand}
                      </span>
                      <span>{device.model}</span>
                    </div>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No matching device found in directory.
              </div>
            )}
          </div>

          <div className="p-2.5 border-t border-border/50 bg-muted/40 text-center">
            <button
              type="button"
              onClick={() => {
                onChange({
                  brand: searchQuery || '',
                  model: '',
                  isManualModel: true,
                });
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              + Enter custom model manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
