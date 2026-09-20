import { Menu, ChevronDown, Car, Building2, Smartphone, Monitor, Armchair, Briefcase, Bike, Paintbrush } from 'lucide-react';

interface CategoryNode {
  name: string;
  icon: React.ReactNode;
  subcategories?: string[];
}

const CATEGORY_DATA: CategoryNode[] = [
  {
    name: 'Cars',
    icon: <Car size={16} />,
    subcategories: [
      'SUVs',
      'Sedans',
      'Hatchbacks',
      'EVs & Hybrids',
      'Luxury Cars',
    ]
  },
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
    name: 'Electronics & Appliances',
    icon: <Monitor size={16} />,
    subcategories: [
      'TVs, Video - Audio',
      'Kitchen & Other Appliances',
      'Computers & Laptops',
      'Cameras & Lenses',
      'Games & Entertainment',
    ]
  },
  {
    name: 'Furniture',
    icon: <Armchair size={16} />,
    subcategories: [
      'Sofa & Dining',
      'Beds & Wardrobes',
      'Home Decor & Garden',
      'Kids Furniture',
    ]
  },
  {
    name: 'Jobs',
    icon: <Briefcase size={16} />,
    subcategories: [
      'Data entry & Back office',
      'Sales & Marketing',
      'BPO & Telecaller',
      'Driver',
      'Office Assistant',
    ]
  },
  {
    name: 'Bikes',
    icon: <Bike size={16} />,
    subcategories: [
      'Motorcycles',
      'Scooters',
      'Spare Parts',
      'Bicycles',
    ]
  },
  {
    name: 'Custom Crafts & 3D Prints',
    icon: <Paintbrush size={16} />,
    subcategories: [
      '3D Printed Models',
      'Custom Embroidery',
      'Handmade Jewelry',
      'Art & Paintings',
      'Woodworking',
    ]
  },
];

const QUICK_LINKS = [
  'Cars', 'Motorcycles', '3D Prints', 'Mobile Phones', 'For Sale: Houses & Apartments', 'Handmade'
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
          
          <div className="absolute top-12 left-0 w-[800px] bg-background border rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-6 grid grid-cols-4 gap-6">
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
