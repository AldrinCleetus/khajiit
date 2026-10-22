import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, IndianRupee, Layers } from 'lucide-react';
import type { PurchaseOption } from '@/types/listing-form';

interface PurchaseOptionsBuilderProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  options: PurchaseOption[];
  basePrice: string;
  baseTitle: string;
  onChange: (options: PurchaseOption[]) => void;
  titlePlaceholder?: string;
  subtitle?: string;
}

export function PurchaseOptionsBuilder({
  enabled,
  onToggle,
  options,
  basePrice,
  baseTitle,
  onChange,
  titlePlaceholder = 'e.g. Body Only, Body + 28-70mm Kit, Extra Battery Bundle',
  subtitle = 'Allow buyers to choose from multiple packages or buy individual accessories separately.',
}: PurchaseOptionsBuilderProps) {
  function handleAddOption() {
    const newId = `opt-${Date.now()}`;
    const newOpt: PurchaseOption = {
      id: newId,
      title: '',
      price: '',
    };
    onChange([...options, newOpt]);
  }

  function handleUpdateOption(
    id: string,
    field: 'title' | 'price',
    val: string
  ) {
    onChange(
      options.map((opt) => (opt.id === id ? { ...opt, [field]: val } : opt))
    );
  }

  function handleRemoveOption(id: string) {
    onChange(options.filter((opt) => opt.id !== id));
  }

  return (
    <div className="space-y-4 p-5 rounded-3xl border border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[hsl(var(--accent))]" />
            <Label className="text-sm font-semibold text-foreground cursor-pointer">
              Split / Bundle Purchase Options
            </Label>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
              Multi-Option
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>

      {enabled && (
        <div className="space-y-4 pt-3 border-t border-border/60">
          <div className="p-3.5 rounded-2xl bg-[hsl(var(--accent))]/5 border border-[hsl(var(--accent))]/20 flex items-start gap-3">
            <span className="text-xs text-foreground leading-relaxed">
              <strong>Tip:</strong> The primary option represents your main listing package. Additional options allow buyers to pick alternative tiers on the listing page.
            </span>
          </div>

          <div className="space-y-3">
            {/* Primary Option (Derived from Base Listing) */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/5">
              <Badge className="bg-[hsl(var(--accent))] text-white text-[10px] shrink-0">
                Primary Tier
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {baseTitle || 'Complete Bundle / Standard Package'}
                </p>
              </div>
              <div className="text-sm font-bold text-[hsl(var(--accent))] shrink-0">
                {basePrice ? `₹${Number(basePrice).toLocaleString('en-IN')}` : '₹ —'}
              </div>
            </div>

            {/* User-defined extra tiers */}
            {options.map((opt, index) => (
              <div
                key={opt.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl border border-border bg-background"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                    #{index + 2}
                  </span>
                </div>

                <div className="flex-1">
                  <Input
                    placeholder={titlePlaceholder}
                    value={opt.title}
                    onChange={(e) =>
                      handleUpdateOption(opt.id, 'title', e.target.value)
                    }
                    className="h-10 text-sm"
                  />
                </div>

                <div className="relative w-full sm:w-40 shrink-0">
                  <IndianRupee
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={opt.price}
                    onChange={(e) =>
                      handleUpdateOption(opt.id, 'price', e.target.value)
                    }
                    className="pl-8 h-10 text-sm font-semibold"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(opt.id)}
                  className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="rounded-pill gap-1.5 text-xs font-semibold"
          >
            <Plus size={14} /> Add Purchase Tier / Option
          </Button>
        </div>
      )}
    </div>
  );
}
