import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef, type ChangeEvent, type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Smartphone,
  Monitor,
  Package,
  Search,
  ChevronRight,
  ChevronLeft,
  ImagePlus,
  X,
  MapPin,
  IndianRupee,
  Sparkles,
  Info,
  Check,
  Tag,
  Megaphone,
} from 'lucide-react';

import {
  CATEGORY_DEFINITIONS,
  INITIAL_FORM_DATA,
  CONDITIONS,
  EXCHANGE_METHODS,
  MOBILE_RAM_OPTIONS,
  MOBILE_STORAGE_OPTIONS,
  BOX_INCLUSIONS,
  type MainCategory,
  type Step,
  type ListingFormData,
  type PropertyFurnishing,
  type PropertyFacing,
  type PlotAreaUnit,
} from '@/types/listing-form';

import { MobileModelSelector } from '@/components/sell/MobileModelSelector';
import { PurchaseOptionsBuilder } from '@/components/sell/PurchaseOptionsBuilder';
import { PropertyPolygonMap } from '@/components/sell/PropertyPolygonMap';
import { ApproximateLocationMap } from '@/components/sell/ApproximateLocationMap';

export const Route = createFileRoute('/sell')({
  component: SellPage,
});

const STEPS: { id: Step; label: string }[] = [
  { id: 'type', label: 'Category' },
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Photos' },
  { id: 'location', label: 'Location' },
  { id: 'review', label: 'Review' },
];

function formatPriceINR(val: number | string): string {
  const num = typeof val === 'string' ? Number(val) : val;
  if (!num || isNaN(num)) return '₹ —';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

function SellPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('type');
  const [form, setForm] = useState<ListingFormData>(INITIAL_FORM_DATA);
  const [tagInput, setTagInput] = useState('');

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const isRequest = form.listingType === 'REQUESTING';
  const isProperty = form.category === 'properties';
  const isMobile = form.category === 'mobiles';
  const isElectronics = form.category === 'electronics';

  // ── Form Update Helpers ─────────────────────────────────────────────

  function updateField<K extends keyof ListingFormData>(
    field: K,
    val: ListingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function updatePropertyField<K extends keyof ListingFormData['properties']>(
    field: K,
    val: ListingFormData['properties'][K]
  ) {
    setForm((prev) => ({
      ...prev,
      properties: { ...prev.properties, [field]: val },
    }));
  }

  function updateMobileField<K extends keyof ListingFormData['mobiles']>(
    field: K,
    val: ListingFormData['mobiles'][K]
  ) {
    setForm((prev) => ({
      ...prev,
      mobiles: { ...prev.mobiles, [field]: val },
    }));
  }

  function updateElectronicsField<K extends keyof ListingFormData['electronics']>(
    field: K,
    val: ListingFormData['electronics'][K]
  ) {
    setForm((prev) => ({
      ...prev,
      electronics: { ...prev.electronics, [field]: val },
    }));
  }

  function toggleExchangeMethod(method: string) {
    const cur = form.exchangeMethods;
    if (cur.includes(method)) {
      updateField(
        'exchangeMethods',
        cur.filter((m) => m !== method)
      );
    } else {
      updateField('exchangeMethods', [...cur, method]);
    }
  }

  function toggleBoxInclusion(item: string) {
    const cur = form.mobiles.includedInBox;
    if (cur.includes(item)) {
      updateMobileField(
        'includedInBox',
        cur.filter((i) => i !== item)
      );
    } else {
      updateMobileField('includedInBox', [...cur, item]);
    }
  }

  function handleAddTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t) && form.tags.length < 8) {
      updateField('tags', [...form.tags, t]);
      setTagInput('');
    }
  }

  function handleRemoveTag(tag: string) {
    updateField(
      'tags',
      form.tags.filter((t) => t !== tag)
    );
  }

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newImgs = files.slice(0, 8 - form.images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    updateField('images', [...form.images, ...newImgs]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleRemoveImage(idx: number) {
    const updated = [...form.images];
    if (updated[idx]?.preview) {
      URL.revokeObjectURL(updated[idx].preview);
    }
    updated.splice(idx, 1);
    updateField('images', updated);
  }

  // ── Validation Gate ────────────────────────────────────────────────

  function canProceed(): boolean {
    switch (step) {
      case 'type':
        return Boolean(form.category && form.subcategory);
      case 'details': {
        const hasTitle = form.title.trim().length >= 4;
        const hasPrice = Number(form.price) > 0;
        if (!hasTitle || !hasPrice) return false;

        if (isMobile) {
          return Boolean(form.mobiles.brand && form.mobiles.model);
        }
        if (isElectronics) {
          return Boolean(form.electronics.brand);
        }
        if (isProperty) {
          if (form.subcategory.includes('Plots')) {
            return Boolean(form.properties.plotArea);
          }
          if (
            form.subcategory.includes('Houses & Apartments') ||
            form.subcategory.includes('Shops & Offices')
          ) {
            return Boolean(form.properties.carpetArea);
          }
        }
        return true;
      }
      case 'media':
        // Optional for requests, at least 1 image for sales
        return isRequest || form.images.length >= 1;
      case 'location':
        return form.location.trim().length >= 3;
      case 'review':
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    if (stepIndex < STEPS.length - 1 && canProceed()) {
      setStep(STEPS[stepIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Auto-calculated Price per Sq. Ft. for properties
  const pricePerSqFt = (() => {
    if (!isProperty) return null;
    const priceNum = Number(form.price);
    const areaNum =
      Number(form.properties.carpetArea) ||
      Number(form.properties.builtUpArea) ||
      Number(form.properties.plotArea) ||
      form.properties.polygonAreaSqFt;

    if (priceNum > 0 && areaNum && areaNum > 0) {
      return Math.round(priceNum / areaNum);
    }
    return null;
  })();

  // ── Step 1: Type & Category Selector ───────────────────────────────

  function renderTypeStep() {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            What would you like to list?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Choose whether you are offering or requesting, then pick your category and subcategory.
          </p>
        </div>

        {/* Offering vs Requesting Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => updateField('listingType', 'OFFERING')}
            className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-4 cursor-pointer ${
              form.listingType === 'OFFERING'
                ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 shadow-md ring-1 ring-[hsl(var(--accent))]/30'
                : 'border-border bg-card hover:border-[hsl(var(--accent))]/40'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                form.listingType === 'OFFERING'
                  ? 'bg-[hsl(var(--accent))] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Package size={22} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Sell / Offer</h3>
              <p className="text-xs text-muted-foreground mt-0.5">List an item or property you want to sell</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateField('listingType', 'REQUESTING')}
            className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-4 cursor-pointer ${
              form.listingType === 'REQUESTING'
                ? 'border-indigo-500 bg-indigo-500/5 shadow-md ring-1 ring-indigo-500/30'
                : 'border-border bg-card hover:border-indigo-400/40'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                form.listingType === 'REQUESTING'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Search size={22} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Request / Wanted</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Post what you're looking to buy with a budget</p>
            </div>
          </button>
        </div>

        <Separator />

        {/* 3 Core Category Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Select Category <span className="text-destructive">*</span>
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Properties */}
            <button
              type="button"
              onClick={() => {
                updateField('category', 'properties');
                updateField('subcategory', CATEGORY_DEFINITIONS.properties.subcategories[0]);
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group cursor-pointer ${
                form.category === 'properties'
                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 shadow-lg ring-2 ring-[hsl(var(--accent))]/30'
                  : 'border-border bg-card hover:border-[hsl(var(--accent))]/40 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    form.category === 'properties'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-[hsl(var(--accent))]/10 group-hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Properties</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Houses, apartments, lands, commercial spaces & PG
                  </p>
                </div>
              </div>
            </button>

            {/* Mobiles */}
            <button
              type="button"
              onClick={() => {
                updateField('category', 'mobiles');
                updateField('subcategory', CATEGORY_DEFINITIONS.mobiles.subcategories[0]);
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group cursor-pointer ${
                form.category === 'mobiles'
                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 shadow-lg ring-2 ring-[hsl(var(--accent))]/30'
                  : 'border-border bg-card hover:border-[hsl(var(--accent))]/40 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    form.category === 'mobiles'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-[hsl(var(--accent))]/10 group-hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <Smartphone size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Mobiles</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Smartphones, tablets & accessories
                  </p>
                </div>
              </div>
            </button>

            {/* Electronics & Appliances */}
            <button
              type="button"
              onClick={() => {
                updateField('category', 'electronics');
                updateField('subcategory', CATEGORY_DEFINITIONS.electronics.subcategories[0]);
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group cursor-pointer ${
                form.category === 'electronics'
                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 shadow-lg ring-2 ring-[hsl(var(--accent))]/30'
                  : 'border-border bg-card hover:border-[hsl(var(--accent))]/40 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    form.category === 'electronics'
                      ? 'bg-[hsl(var(--accent))] text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-[hsl(var(--accent))]/10 group-hover:text-[hsl(var(--accent))]'
                  }`}
                >
                  <Monitor size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Electronics & Appliances</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Laptops, cameras, TVs, gaming & home appliances
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Subcategories (Visible only after category selected) */}
        {form.category && (
          <div className="space-y-3 pt-4 animate-in fade-in-50 duration-200">
            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Select Subcategory <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORY_DEFINITIONS[form.category].subcategories.map((sub) => {
                const isSelected = form.subcategory === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => updateField('subcategory', sub)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] shadow-md'
                        : 'bg-card text-foreground border-border hover:border-[hsl(var(--accent))]/50 hover:bg-muted/30'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Step 2: Dynamic Category-Specific Details ───────────────────────

  function renderDetailsStep() {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isRequest ? 'Describe What You Are Looking For' : 'Listing Details'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Category: <strong className="text-foreground">{CATEGORY_DEFINITIONS[form.category as MainCategory]?.label}</strong> &gt; <strong className="text-foreground">{form.subcategory}</strong>
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
            {form.subcategory}
          </Badge>
        </div>

        {/* 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ═══════════════════════════════════════════════════════════
              A. MOBILES SPECIFIC FIELDS
          ═══════════════════════════════════════════════════════════ */}
          {isMobile && (
            <>
              {/* Mobile Model Selector */}
              <div className="md:col-span-12">
                <MobileModelSelector
                  brand={form.mobiles.brand}
                  model={form.mobiles.model}
                  isManualModel={form.mobiles.isManualModel}
                  subcategory={form.subcategory}
                  onChange={({ brand, model, isManualModel, suggestedTitle }) => {
                    updateMobileField('brand', brand);
                    updateMobileField('model', model);
                    updateMobileField('isManualModel', isManualModel);
                    if (suggestedTitle && (!form.title || form.title.startsWith(form.mobiles.brand))) {
                      updateField('title', suggestedTitle);
                    }
                  }}
                />
              </div>

              {/* RAM & Storage */}
              <div className="md:col-span-6 space-y-2">
                <Label className="text-xs font-semibold">RAM</Label>
                <div className="flex flex-wrap gap-2">
                  {MOBILE_RAM_OPTIONS.map((ram) => (
                    <button
                      key={ram}
                      type="button"
                      onClick={() => updateMobileField('ram', ram)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                        form.mobiles.ram === ram
                          ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))]'
                          : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                      }`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-6 space-y-2">
                <Label className="text-xs font-semibold">Internal Storage</Label>
                <div className="flex flex-wrap gap-2">
                  {MOBILE_STORAGE_OPTIONS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateMobileField('storage', st)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                        form.mobiles.storage === st
                          ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))]'
                          : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery Health (Highlighted if Apple) */}
              <div className="md:col-span-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="batteryHealth" className="text-xs font-semibold">
                    Battery Health (%)
                  </Label>
                  {form.mobiles.brand.toLowerCase() === 'apple' && (
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                      Recommended for iPhone
                    </Badge>
                  )}
                </div>
                <Input
                  id="batteryHealth"
                  type="number"
                  min="50"
                  max="100"
                  placeholder="e.g. 88"
                  value={form.mobiles.batteryHealth || ''}
                  onChange={(e) => updateMobileField('batteryHealth', e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Warranty Status */}
              <div className="md:col-span-6 space-y-2">
                <Label className="text-xs font-semibold">Warranty Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Under Warranty', 'Out of Warranty'] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => updateMobileField('warrantyStatus', w)}
                      className={`h-11 text-xs font-medium rounded-xl border transition-colors ${
                        form.mobiles.warrantyStatus === w
                          ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] font-semibold'
                          : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Included in Box */}
              <div className="md:col-span-12 space-y-2">
                <Label className="text-xs font-semibold">Included in Box / Package</Label>
                <div className="flex flex-wrap gap-2">
                  {BOX_INCLUSIONS.map((item) => {
                    const isChecked = form.mobiles.includedInBox.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleBoxInclusion(item)}
                        className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-primary/10 border-primary text-primary font-semibold'
                            : 'bg-card border-border text-muted-foreground hover:border-border/80'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                            isChecked
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted-foreground/40'
                          }`}
                        >
                          {isChecked && <Check size={12} />}
                        </div>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════
              B. ELECTRONICS SPECIFIC FIELDS
          ═══════════════════════════════════════════════════════════ */}
          {isElectronics && (
            <>
              {/* Brand & Model */}
              <div className="md:col-span-6 space-y-2">
                <Label htmlFor="elecBrand" className="text-xs font-semibold">
                  Brand / Manufacturer <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="elecBrand"
                  placeholder="e.g. Sony, Apple, Dell, LG"
                  value={form.electronics.brand}
                  onChange={(e) => updateElectronicsField('brand', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="md:col-span-6 space-y-2">
                <Label htmlFor="elecModel" className="text-xs font-semibold">
                  Model Name & Number
                </Label>
                <Input
                  id="elecModel"
                  placeholder="e.g. Alpha a7 III, XPS 15 9520, C3 OLED"
                  value={form.electronics.model}
                  onChange={(e) => updateElectronicsField('model', e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Dynamic Subcategory Specs */}
              {form.subcategory.includes('Cameras') && (
                <>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Mount Type</Label>
                    <Input
                      placeholder="e.g. Sony E, Canon RF, Nikon Z"
                      value={form.electronics.mountType || ''}
                      onChange={(e) => updateElectronicsField('mountType', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Shutter Count</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 4500"
                      value={form.electronics.shutterCount || ''}
                      onChange={(e) => updateElectronicsField('shutterCount', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Sensor Format</Label>
                    <Input
                      placeholder="e.g. Full Frame, APS-C"
                      value={form.electronics.sensorFormat || ''}
                      onChange={(e) => updateElectronicsField('sensorFormat', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </>
              )}

              {form.subcategory.includes('Computers') && (
                <>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Processor (CPU)</Label>
                    <Input
                      placeholder="e.g. Apple M2 Max, i7-13700H"
                      value={form.electronics.cpu || ''}
                      onChange={(e) => updateElectronicsField('cpu', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">RAM</Label>
                    <Input
                      placeholder="e.g. 16GB / 32GB DDR5"
                      value={form.electronics.ram || ''}
                      onChange={(e) => updateElectronicsField('ram', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Storage (SSD / HDD)</Label>
                    <Input
                      placeholder="e.g. 1TB NVMe SSD"
                      value={form.electronics.storageTypeSize || ''}
                      onChange={(e) => updateElectronicsField('storageTypeSize', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <Label className="text-xs font-semibold">Graphics / GPU</Label>
                    <Input
                      placeholder="e.g. RTX 4070 8GB / Integrated"
                      value={form.electronics.gpu || ''}
                      onChange={(e) => updateElectronicsField('gpu', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <Label className="text-xs font-semibold">Screen Size</Label>
                    <Input
                      placeholder="e.g. 15.6 inch, 16 inch"
                      value={form.electronics.screenSize || ''}
                      onChange={(e) => updateElectronicsField('screenSize', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </>
              )}

              {/* Age of Item */}
              <div className="md:col-span-6 space-y-2">
                <Label className="text-xs font-semibold">Age of Item</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['< 6 months', '6–12 months', '1–3 years', '3+ years'] as const).map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => updateElectronicsField('ageOfItem', age)}
                      className={`h-10 text-xs rounded-xl border transition-colors ${
                        form.electronics.ageOfItem === age
                          ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] font-semibold'
                          : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warranty & Bill checkboxes */}
              <div className="md:col-span-6 space-y-3 pt-2">
                <Label className="text-xs font-semibold block">Inclusions & Guarantee</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.electronics.originalBillAvailable}
                      onChange={(e) => updateElectronicsField('originalBillAvailable', e.target.checked)}
                      className="rounded border-border text-[hsl(var(--accent))]"
                    />
                    Original Purchase Invoice / Bill Available
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.electronics.underWarranty}
                      onChange={(e) => updateElectronicsField('underWarranty', e.target.checked)}
                      className="rounded border-border text-[hsl(var(--accent))]"
                    />
                    Under Active Manufacturer Warranty
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════
              C. PROPERTIES SPECIFIC FIELDS
          ═══════════════════════════════════════════════════════════ */}
          {isProperty && (
            <>
              {/* Rental vs Sale specific fields */}
              {form.subcategory.includes('Rent') || form.subcategory.includes('PG') ? (
                <>
                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor="secDeposit" className="text-xs font-semibold">
                      Security Deposit (₹)
                    </Label>
                    <div className="relative">
                      <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="secDeposit"
                        type="number"
                        placeholder="e.g. 50000"
                        value={form.properties.securityDeposit || ''}
                        onChange={(e) => updatePropertyField('securityDeposit', e.target.value)}
                        className="pl-8 h-11"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {/* Houses & Apartments */}
              {form.subcategory.includes('Houses & Apartments') && (
                <>
                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor="carpetArea" className="text-xs font-semibold">
                      Carpet Area (Sq. Ft.) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="carpetArea"
                      type="number"
                      placeholder="e.g. 1250"
                      value={form.properties.carpetArea || ''}
                      onChange={(e) => updatePropertyField('carpetArea', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor="builtUpArea" className="text-xs font-semibold">
                      Super Built-up Area (Sq. Ft.)
                    </Label>
                    <Input
                      id="builtUpArea"
                      type="number"
                      placeholder="e.g. 1550"
                      value={form.properties.builtUpArea || ''}
                      onChange={(e) => updatePropertyField('builtUpArea', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <Label className="text-xs font-semibold">Bedrooms / BHK</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['1', '2', '3', '4', '4+'] as const).map((bhk) => (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => updatePropertyField('bhk', bhk)}
                          className={`h-11 text-xs font-medium rounded-xl border transition-colors ${
                            form.properties.bhk === bhk
                              ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] font-bold'
                              : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                          }`}
                        >
                          {bhk} BHK
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor="bathrooms" className="text-xs font-semibold">
                      Bathrooms
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="e.g. 2"
                      value={form.properties.bathrooms || ''}
                      onChange={(e) => updatePropertyField('bathrooms', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <Label className="text-xs font-semibold">Furnishing Status</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Furnished', 'Semi-Furnished', 'Unfurnished'] as PropertyFurnishing[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => updatePropertyField('furnishing', f)}
                          className={`h-11 text-xs rounded-xl border transition-colors ${
                            form.properties.furnishing === f
                              ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] font-semibold'
                              : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="floorNo" className="text-xs font-semibold">
                      Floor No
                    </Label>
                    <Input
                      id="floorNo"
                      placeholder="e.g. 4"
                      value={form.properties.floorNo || ''}
                      onChange={(e) => updatePropertyField('floorNo', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="totalFloors" className="text-xs font-semibold">
                      Total Floors
                    </Label>
                    <Input
                      id="totalFloors"
                      placeholder="e.g. 14"
                      value={form.properties.totalFloors || ''}
                      onChange={(e) => updatePropertyField('totalFloors', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </>
              )}

              {/* Lands & Plots */}
              {form.subcategory.includes('Lands & Plots') && (
                <>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="plotArea" className="text-xs font-semibold">
                      Plot Area <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="plotArea"
                      type="number"
                      placeholder="e.g. 2400"
                      value={form.properties.plotArea || ''}
                      onChange={(e) => updatePropertyField('plotArea', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs font-semibold">Unit</Label>
                    <select
                      value={form.properties.plotUnit || 'Sq. Ft.'}
                      onChange={(e) => updatePropertyField('plotUnit', e.target.value as PlotAreaUnit)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-card text-xs"
                    >
                      <option value="Sq. Ft.">Sq. Ft.</option>
                      <option value="Cent">Cent</option>
                      <option value="Acre">Acre</option>
                      <option value="Sq. Yard">Sq. Yard</option>
                    </select>
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor="lenBreadth" className="text-xs font-semibold">
                      Dimensions (Length x Breadth)
                    </Label>
                    <Input
                      id="lenBreadth"
                      placeholder="e.g. 40 x 60 ft"
                      value={form.properties.lengthBreadth || ''}
                      onChange={(e) => updatePropertyField('lengthBreadth', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Facing Direction</Label>
                    <select
                      value={form.properties.facing || 'East'}
                      onChange={(e) => updatePropertyField('facing', e.target.value as PropertyFacing)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-card text-xs"
                    >
                      <option value="North">North</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="South">South</option>
                      <option value="North-East">North-East</option>
                      <option value="North-West">North-West</option>
                      <option value="South-East">South-East</option>
                      <option value="South-West">South-West</option>
                    </select>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="roadWidth" className="text-xs font-semibold">
                      Road Width (ft)
                    </Label>
                    <Input
                      id="roadWidth"
                      type="number"
                      placeholder="e.g. 30"
                      value={form.properties.roadWidth || ''}
                      onChange={(e) => updatePropertyField('roadWidth', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold">Boundary Wall Made</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[true, false].map((val) => (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => updatePropertyField('boundaryWall', val)}
                          className={`h-11 text-xs rounded-xl border transition-colors ${
                            form.properties.boundaryWall === val
                              ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] font-semibold'
                              : 'bg-card border-border hover:border-[hsl(var(--accent))]/50'
                          }`}
                        >
                          {val ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Shops & Offices */}
              {form.subcategory.includes('Shops & Offices') && (
                <>
                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor="shopCarpet" className="text-xs font-semibold">
                      Carpet Area (Sq. Ft.) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shopCarpet"
                      type="number"
                      placeholder="e.g. 850"
                      value={form.properties.carpetArea || ''}
                      onChange={(e) => updatePropertyField('carpetArea', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <Label className="text-xs font-semibold">Furnishing</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Furnished', 'Semi-Furnished', 'Unfurnished'] as PropertyFurnishing[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => updatePropertyField('furnishing', f)}
                          className={`h-11 text-xs rounded-xl border transition-colors ${
                            form.properties.furnishing === f
                              ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] font-semibold'
                              : 'bg-card border-border'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════
              D. COMMON LISTING FIELDS (TITLE, DESC, CONDITION, PRICE)
          ═══════════════════════════════════════════════════════════ */}

          {/* Title */}
          <div className="md:col-span-12 space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-foreground">
              Listing Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder={
                isProperty
                  ? 'e.g. 3 BHK Luxury Apartment in Indiranagar with Terrace Garden'
                  : isMobile
                  ? 'e.g. Apple iPhone 15 Pro 128GB Blue Titanium - 92% Battery'
                  : 'e.g. Sony Alpha a7 III Mirrorless Camera with 28-70mm Lens'
              }
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              maxLength={120}
              className="h-12 text-base"
            />
            <p className="text-xs text-muted-foreground text-right">{form.title.length}/120</p>
          </div>

          {/* Description */}
          <div className="md:col-span-12 space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder={
                isProperty
                  ? 'Provide key highlights: gated community, clubhouse, water source, landmark, khata status...'
                  : 'Describe item details, cosmetic condition, usage history, included extras...'
              }
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              maxLength={2500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{form.description.length}/2500</p>
          </div>

          {/* Condition Pills (HIDDEN FOR PROPERTIES) */}
          {!isProperty && (
            <div className="md:col-span-12 space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Item Condition <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((cond) => {
                  const currentCond = isMobile ? form.mobiles.condition : form.electronics.condition;
                  const isSelected = currentCond === cond;
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => {
                        if (isMobile) updateMobileField('condition', cond);
                        if (isElectronics) updateElectronicsField('condition', cond);
                      }}
                      className={`px-3.5 py-2 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] shadow-sm'
                          : 'bg-card text-foreground border-border hover:border-[hsl(var(--accent))]/50'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing & Negotiation */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="price" className="text-sm font-semibold text-foreground">
                {isRequest
                  ? 'Your Budget'
                  : form.subcategory.includes('Rent') || form.subcategory.includes('PG')
                  ? 'Monthly Rent'
                  : 'Total Price'}{' '}
                (₹) <span className="text-destructive">*</span>
              </Label>

              {/* Auto calculated price per sq ft badge for properties */}
              {pricePerSqFt && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                  ₹{pricePerSqFt.toLocaleString('en-IN')} / Sq. Ft.
                </Badge>
              )}
            </div>

            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                min="0"
                placeholder={isRequest ? 'Maximum budget' : 'Asking price'}
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                className="pl-9 h-12 text-base font-bold text-primary"
              />
            </div>
          </div>

          {/* Exchange Methods (HIDDEN FOR PROPERTIES) */}
          {!isProperty ? (
            <div className="md:col-span-6 space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Exchange Methods <span className="text-xs text-muted-foreground">(multi-select)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {EXCHANGE_METHODS.map((method) => {
                  const isSelected = form.exchangeMethods.includes(method);
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => toggleExchangeMethod(method)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[hsl(var(--accent))] text-white border-[hsl(var(--accent))] shadow-sm'
                          : 'bg-card text-foreground border-border hover:border-[hsl(var(--accent))]/50'
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="md:col-span-6 flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Price Negotiable</Label>
                <p className="text-xs text-muted-foreground">Open to reasonable counter-offers</p>
              </div>
              <Switch checked={form.negotiable} onCheckedChange={(val) => updateField('negotiable', val)} />
            </div>
          )}

          {/* Purchase Options Builder (FOR MOBILES & ELECTRONICS) */}
          {isElectronics && (
            <div className="md:col-span-12">
              <PurchaseOptionsBuilder
                enabled={form.electronics.hasPurchaseOptions}
                onToggle={(enabled) => updateElectronicsField('hasPurchaseOptions', enabled)}
                options={form.electronics.purchaseOptions}
                basePrice={form.price}
                baseTitle={form.title}
                onChange={(opts) => updateElectronicsField('purchaseOptions', opts)}
                subtitle="Split cameras/lenses, laptops with accessories, or console bundles into selectable buyer tiers."
              />
            </div>
          )}

          {isMobile && (
            <div className="md:col-span-12">
              <PurchaseOptionsBuilder
                enabled={form.mobiles.hasPurchaseOptions}
                onToggle={(enabled) => updateMobileField('hasPurchaseOptions', enabled)}
                options={form.mobiles.purchaseOptions}
                basePrice={form.price}
                baseTitle={form.title}
                onChange={(opts) => updateMobileField('purchaseOptions', opts)}
                titlePlaceholder="e.g. Phone Only, Phone + AirPods Bundle"
                subtitle="Offer bundle options (e.g. adding cases, wireless earbuds or smartwatches)."
              />
            </div>
          )}

          {/* Tags */}
          <div className="md:col-span-12 space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Search Tags <span className="text-xs text-muted-foreground font-normal">(up to 8)</span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="e.g. gated-community, east-facing, 5g, mint-condition"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="pl-9 h-11"
                  maxLength={30}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={form.tags.length >= 8}
                className="rounded-pill px-5"
              >
                Add
              </Button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {form.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pl-3 pr-1.5 py-1 rounded-full text-xs">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Photos ─────────────────────────────────────────────────

  function renderMediaStep() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {isRequest ? 'Add Reference Photos (Optional)' : 'Add High-Quality Photos'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isProperty
              ? 'Upload elevation, interior, layout drawings, floor plans, and surrounding street views.'
              : 'Add up to 8 photos. The first image will be used as the featured card thumbnail.'}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {form.images.map((img, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-border shadow-sm"
            >
              <img src={img.preview} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <Badge className="absolute top-2 left-2 bg-[hsl(var(--accent))] text-white text-[10px] font-bold">
                  Cover Photo
                </Badge>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {form.images.length < 8 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-[hsl(var(--accent))]/60 bg-muted/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <ImagePlus size={32} />
              <span className="text-xs font-semibold">
                {form.images.length === 0 ? 'Upload Photos' : 'Add More'}
              </span>
            </button>
          )}
        </div>

        {!isRequest && form.images.length === 0 && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[hsl(var(--accent))]/5 border border-[hsl(var(--accent))]/20">
            <Info size={18} className="text-[hsl(var(--accent))] mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-foreground">
              Listings with at least 3 genuine photos receive <span className="font-bold">4× more inquiries</span>.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Step 4: Location (Polygon Map for Properties vs Approximate Radius)

  function renderLocationStep() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {isProperty ? 'Property Exact Boundary & Location' : 'Item Location & Privacy'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isProperty
              ? 'Real estate listings require an exact boundary polygon so buyers can inspect plot limits and satellite topography.'
              : 'Your precise home address is kept private. We only show buyers an approximate 1km area.'}
          </p>
        </div>

        {/* City / Area Input */}
        <div className="space-y-2">
          <Label htmlFor="locInput" className="text-sm font-semibold text-foreground">
            City / Neighborhood / Locality <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="locInput"
              placeholder="e.g. Indiranagar, Bangalore, KA"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="pl-9 h-12 text-sm"
            />
          </div>
        </div>

        {/* Dynamic Map Component */}
        {isProperty ? (
          <PropertyPolygonMap
            initialCenter={[form.latitude || 12.9716, form.longitude || 77.5946]}
            initialCoordinates={form.properties.polygonCoordinates || []}
            locationName={form.location}
            onCoordinatesChange={(coords, areaSqFt) => {
              updatePropertyField('polygonCoordinates', coords);
              updatePropertyField('polygonAreaSqFt', areaSqFt);
            }}
          />
        ) : (
          <ApproximateLocationMap
            center={[form.latitude || 12.9716, form.longitude || 77.5946]}
            locationName={form.location}
            onCenterChange={([lat, lng]) => {
              updateField('latitude', lat);
              updateField('longitude', lng);
            }}
          />
        )}
      </div>
    );
  }

  // ── Step 5: Review & Post ──────────────────────────────────────────

  function renderReviewStep() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Review Your Listing</h2>
          <p className="text-sm text-muted-foreground">
            Verify all details before publishing to Khajiit Marketplace.
          </p>
        </div>

        {/* Preview Card matching Product Detail Page style */}
        <Card className="glass-card overflow-hidden !rounded-3xl border border-border">
          {form.images.length > 0 && (
            <div className="aspect-video max-h-72 w-full overflow-hidden bg-muted">
              <img
                src={form.images[0].preview}
                alt="Listing preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {isRequest && (
                <Badge className="bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Looking For / Wanted
                </Badge>
              )}
              <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
                {CATEGORY_DEFINITIONS[form.category as MainCategory]?.label}
              </Badge>
              <Badge variant="secondary" className="text-xs font-semibold">
                {form.subcategory}
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground leading-snug">
                {form.title || 'Untitled Listing'}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin size={13} /> {form.location || 'Location not specified'}
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              {isRequest && <span className="text-sm text-muted-foreground">Budget:</span>}
              <span className="text-3xl font-extrabold text-[hsl(var(--accent))]">
                {formatPriceINR(form.price)}
              </span>
              {pricePerSqFt && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                  ₹{pricePerSqFt.toLocaleString('en-IN')} / Sq. Ft.
                </Badge>
              )}
            </div>

            {form.description && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </span>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {form.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Category Spec Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
              {isProperty && (
                <>
                  {form.properties.carpetArea && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Carpet Area</span>
                      <span className="text-sm font-semibold">{form.properties.carpetArea} Sq. Ft.</span>
                    </div>
                  )}
                  {form.properties.plotArea && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Plot Area</span>
                      <span className="text-sm font-semibold">{form.properties.plotArea} {form.properties.plotUnit}</span>
                    </div>
                  )}
                  {form.properties.bhk && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Configuration</span>
                      <span className="text-sm font-semibold">{form.properties.bhk} BHK</span>
                    </div>
                  )}
                  {form.properties.furnishing && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Furnishing</span>
                      <span className="text-sm font-semibold">{form.properties.furnishing}</span>
                    </div>
                  )}
                  {form.properties.facing && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Facing</span>
                      <span className="text-sm font-semibold">{form.properties.facing}</span>
                    </div>
                  )}
                  {form.properties.polygonAreaSqFt && form.properties.polygonAreaSqFt > 0 ? (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Polygon Boundary</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {form.properties.polygonAreaSqFt.toLocaleString('en-IN')} Sq. Ft. Mapped
                      </span>
                    </div>
                  ) : null}
                </>
              )}

              {isMobile && (
                <>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Device</span>
                    <span className="text-sm font-semibold">{form.mobiles.brand} {form.mobiles.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Condition</span>
                    <span className="text-sm font-semibold">{form.mobiles.condition}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Specs</span>
                    <span className="text-sm font-semibold">{form.mobiles.ram} / {form.mobiles.storage}</span>
                  </div>
                  {form.mobiles.batteryHealth && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Battery Health</span>
                      <span className="text-sm font-semibold">{form.mobiles.batteryHealth}%</span>
                    </div>
                  )}
                </>
              )}

              {isElectronics && (
                <>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Brand / Model</span>
                    <span className="text-sm font-semibold">{form.electronics.brand} {form.electronics.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Condition</span>
                    <span className="text-sm font-semibold">{form.electronics.condition}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Age</span>
                    <span className="text-sm font-semibold">{form.electronics.ageOfItem}</span>
                  </div>
                  {form.electronics.cpu && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">CPU</span>
                      <span className="text-sm font-semibold">{form.electronics.cpu}</span>
                    </div>
                  )}
                  {form.electronics.mountType && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Mount</span>
                      <span className="text-sm font-semibold">{form.electronics.mountType}</span>
                    </div>
                  )}
                </>
              )}

              {/* Exchange methods for physical goods */}
              {!isProperty && form.exchangeMethods.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Exchange</span>
                  <span className="text-sm font-semibold">{form.exchangeMethods.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Purchase Options / Split Bundle Summary */}
            {((isElectronics && form.electronics.hasPurchaseOptions && form.electronics.purchaseOptions.length > 0) ||
              (isMobile && form.mobiles.hasPurchaseOptions && form.mobiles.purchaseOptions.length > 0)) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Available Purchase Tiers / Packages
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs py-2 px-3 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30">
                      <span className="font-semibold text-foreground">
                        {form.title} (Primary Bundle)
                      </span>
                      <span className="font-bold text-[hsl(var(--accent))]">
                        {formatPriceINR(form.price)}
                      </span>
                    </div>

                    {(isElectronics
                      ? form.electronics.purchaseOptions
                      : form.mobiles.purchaseOptions
                    ).map((opt) => (
                      <div
                        key={opt.id}
                        className="flex justify-between items-center text-xs py-2 px-3 rounded-xl bg-card border border-border"
                      >
                        <span className="font-medium text-foreground">{opt.title || 'Package Option'}</span>
                        <span className="font-bold text-primary">{formatPriceINR(opt.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {form.tags.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[11px] rounded-full">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Market Transparency Notice */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[hsl(var(--accent))]/5 border border-[hsl(var(--accent))]/20">
          <Sparkles size={20} className="text-[hsl(var(--accent))] mt-0.5 shrink-0" />
          <div className="text-xs">
            <strong className="text-foreground font-semibold block text-sm">
              Fair Market Price Check
            </strong>
            <p className="text-muted-foreground mt-0.5">
              Once published, your listing receives an automatic fair-price rating based on verified local sales and specs, giving buyers immediate trust and confidence.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Master Layout ───────────────────────────────────────────

  const stepRenderers: Record<Step, () => ReactNode> = {
    type: renderTypeStep,
    details: renderDetailsStep,
    media: renderMediaStep,
    location: renderLocationStep,
    review: renderReviewStep,
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((s, idx) => {
          const isActive = idx === stepIndex;
          const isDone = idx < stepIndex;
          return (
            <div key={s.id} className="flex items-center flex-1 min-w-[100px]">
              <button
                type="button"
                disabled={idx > stepIndex}
                onClick={() => idx <= stepIndex && setStep(s.id)}
                className={`flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${
                  isActive
                    ? 'text-[hsl(var(--accent))]'
                    : isDone
                    ? 'text-foreground hover:text-[hsl(var(--accent))]'
                    : 'text-muted-foreground/40'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[hsl(var(--accent))] text-white shadow-md ring-4 ring-[hsl(var(--accent))]/20'
                      : isDone
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? <Check size={14} /> : idx + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                    idx < stepIndex ? 'bg-emerald-500/40' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Glass Form Card with 12-Column Layout */}
      <Card className="glass-card !rounded-3xl border border-border shadow-xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 md:p-10">
          {stepRenderers[step]()}
        </CardContent>
      </Card>

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="rounded-pill gap-1.5 px-6 font-semibold"
        >
          <ChevronLeft size={16} /> Back
        </Button>

        <div>
          {step === 'review' ? (
            <Button
              type="button"
              onClick={() => {
                alert('Listing posted successfully to Khajiit Marketplace! 🎉 (mock)');
                navigate({ to: '/' });
              }}
              className="rounded-pill bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white px-8 font-bold shadow-lg"
              size="lg"
            >
              <Megaphone size={16} className="mr-2" />
              {isRequest ? 'Publish Request' : 'Publish Listing'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className="rounded-pill bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white px-8 font-semibold shadow-md disabled:opacity-50"
              size="lg"
            >
              Continue <ChevronRight size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
