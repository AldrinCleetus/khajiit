import { Menu, ChevronDown, Building2, Smartphone, Monitor } from 'lucide-react';

interface CategoryNode {
  name: string;
  icon: React.ReactNode;
  subcategories?: string[];
}

const CATEGORY_DATA: CategoryNode[] = [
  {
    name: 'Properties',
    icon: <Building2 size={16} />,
    subcategories: [
      'For Sale: Houses & Apartments',
      'For Rent: Houses & Apartments',
      'Lands & Plots',
      'For Sale: Shops & Offices',
      'PG & Guest Houses',
    ]
  },
  {
    name: 'Mobiles',
    icon: <Smartphone size={16} />,
    subcategories: [
      'Mobile Phones',
      'Accessories',
      'Tablets',
    ]
  },
  {
    name: 'Electronics',
    icon: <Monitor size={16} />,
    subcategories: [
      'Computers & Laptops',
      'Cameras & Lenses',
      'TVs, Audio & Video',
      'Gaming & Consoles',
      'Home Appliances',
    ]
  },
];

const QUICK_LINKS = [
  'Properties',
  'Houses & Apartments',
  'Lands & Plots',
  'Mobiles',
  'Tablets',
  'Electronics',
  'Laptops',
  'Cameras'
];

export function CategoryNav() {
  return (
    <div className="w-full border-b bg-background text-sm shadow-sm">
      <div className="container flex items-center gap-4 h-12">
        
        <div 
          className="relative h-full flex items-center group cursor-pointer"
        >
          <button className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
            <Menu size={16} />
            <span>ALL CATEGORIES</span>
            <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          
          <div className="absolute top-12 left-0 w-[640px] bg-background border rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-6 grid grid-cols-3 gap-6">
            {CATEGORY_DATA.map(category => (
              <div key={category.name} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <span className="text-primary">{category.icon}</span>
                  {category.name}
                </div>
                {category.subcategories && (
                  <ul className="flex flex-col gap-1 mt-1">
                    {category.subcategories.map(sub => (
                      <li key={sub} className="text-muted-foreground hover:text-primary text-xs cursor-pointer transition-colors">
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide flex-1 ml-4">
          {QUICK_LINKS.map(link => (
            <button key={link} className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              {link}
            </button>
          ))}
        </div>
        
      </div>
    </div>
  );
}
