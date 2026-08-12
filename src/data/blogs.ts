import type { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Science of Indoor Air Quality: Why Deep House Cleaning Matters',
    slug: 'science-of-indoor-air-quality',
    excerpt: 'Discover how unseen mattress dust mites, AC duct mold, and floor dirt impact your daily health and energy levels.',
    content: `
Indoor air pollution can be up to five times higher than outdoor air, according to environmental studies. In humid tropical climates like Kochi, air conditioning units, fabric sofas, and tile grouts trap microscopic mold spores, dander, and dust mites.

### Key Factors Impacting Your Indoor Air

1. **High Humidity & Mold Spores**: Tiles and ceiling corners collect invisible humidity condensation. Standard sweeping only redistributes dust into the breathing zone.
2. **Deep Mattress Dust Mites**: An uncleaned mattress can harbor over 10,000 dust mites that trigger morning nasal congestion.
3. **Kitchen Grease Residue**: Cooking oil vapors settle on upper kitchen cabinets, attracting airborne dust particles.

### The NEXDOOR Deep Cleaning Protocol

Our enterprise deep cleaning utilizes HEPA-filtered vacuum extraction and 140°C thermal steam sanitization to eliminate biological contaminants at the cellular level. By combining high-pressure steam with non-toxic eco-solvents, we restore your home's air to pristine purity.
    `,
    category: 'Home Care',
    author: {
      name: 'Dr. Vivek Sharma',
      role: 'Head of Environmental Hygiene',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'July 18, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    tags: ['Deep Cleaning', 'Indoor Air Quality', 'Health', 'Home Care']
  },
  {
    id: '2',
    title: 'Why Automatic Drive-Through Car Washes Ruin Your Car Clear Coat',
    slug: 'why-automatic-washes-ruin-clear-coat',
    excerpt: 'Swirl marks and micro-scratches explained: Why touchless snow foam hand washes preserve luxury vehicle resale value.',
    content: `
Many car owners prefer quick drive-through automatic washes for convenience. However, high-speed rotating nylon bristles carry gritty dirt from previous vehicles, acting like sandpaper against your clear coat.

### Understanding Clear Coat Swirl Marks

Modern vehicle paints consist of a primer, color base coat, and a delicate 40-60 micron clear coat shield. When dirty brushes slap against your paint:

- **Micro-Marring**: Tiny circular scratches scatter sunlight, causing paint to look dull and greyish.
- **Brake Dust Pitting**: Iron fallout from brake pads embeds into hot clear coats, rusting over time.

### The Mobile Detailing Advantage

NEXDOOR uses the **Dual-Bucket Touchless Snow Foam Method**:
1. High BAR pressure pre-rinse washes away loose grit without friction.
2. pH-neutral thick snow foam encapsulates remaining dirt particles.
3. Ultra-plush 1200 GSM microfiber towels dry the paint scratch-free.
    `,
    category: 'Auto Detailing',
    author: {
      name: 'Karan Malhotra',
      role: 'Master Automotive Detailer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'July 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    tags: ['Car Wash', 'Paint Protection', 'Auto Detailing', 'Tips']
  },
  {
    id: '3',
    title: 'Fabric Maintenance 101: Extending the Life of Your Suits & Sarees',
    slug: 'fabric-maintenance-101-laundry-guide',
    excerpt: 'Mastering temperature settings, detergent chemistry, and dry cleaning cycles for delicate designer wear.',
    content: `
High-end silk sarees, linen suits, and designer woolens require specialized care beyond standard home washing machines.

### 3 Rules of Fabric Longevity

1. **Avoid Commercial Alkaline Powders**: Harsh powdered detergents strip natural oils from silk fibers, causing fading and stiffness.
2. **Never Tumble Dry Wool or Silk**: High heat degrades protein-based natural fibers, leading to garment shrinkage.
3. **Opt for Organic Dry Cleaning**: Solvents like liquid silicone gently dissolve body oils without water friction.
    `,
    category: 'Laundry & Garment Care',
    author: {
      name: 'Anita Roy',
      role: 'Textile Care Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'June 25, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80',
    tags: ['Laundry', 'Dry Cleaning', 'Garment Care', 'Fashion']
  }
];
