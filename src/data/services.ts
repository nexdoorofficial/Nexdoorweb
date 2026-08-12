import type { FeaturedService } from '../types';

export const FEATURED_HOUSE_SERVICES: FeaturedService[] = [
  {
    id: 'deep-home-cleaning',
    title: 'Deep Home Cleaning',
    subtitle: 'Full-spectrum intensive residential sanitization & rejuvenation',
    overview: 'Our signature Deep Home Cleaning engineered to eradicate embedded grime, hard water stains, high cobwebs, and hidden allergens from every square inch of your living space.',
    startingPrice: '₹1,499',
    features: [
      'Single-disc machine floor scrubbing & sanitization',
      'High-pressure steam disinfestation of kitchen & bath',
      'Streak-free high window pane & channel vacuuming',
      'Ceiling fan, chandelier & exhaust blade degreasing'
    ],
    benefits: [
      'Eliminates 99.9% of dust mites, mold spores & bacteria',
      'Restores original shine of marble, granite & vitrified tiles',
      'Improves indoor air quality and removes stale odors',
      'Extends furniture and wall finish longevity'
    ],
    included: [
      'Living room, bedrooms, hallways & balconies deep clean',
      'Kitchen countertop, tile grout, sink & appliance exterior scrub',
      'Bathrooms wall tile descaling, WC sanitization & chrome polish',
      'Light fixtures, switchboards & door frame wipe down',
      'Floor scrubbing with eco-certified disinfectant'
    ],
    excluded: [
      'Internal wall repainting or heavy cement stain scraping',
      'Structural repairs or tile regrouting',
      'Exterior high-rise window rope suspended access'
    ],
    estimatedTime: '4 - 6 Hours (depending on house size)',
    recommendedFor: 'Seasonal cleaning, post-renovation, or pre-festive home refresh.',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Do I need to supply cleaning products or machinery?',
        answer: 'No. NEXDOOR technicians arrive fully equipped with German single-disc scrubbers, steam cleaners, industrial vacuum units, and non-toxic eco-friendly chemicals.'
      },
      {
        question: 'How long does the floor take to dry?',
        answer: 'Our high-performance extraction machinery leaves floors touch-dry within 20-30 minutes.'
      }
    ],
    ctaText: 'Book Deep Home Clean'
  },
  {
    id: 'move-in-move-out',
    title: 'Move-In / Move-Out Cleaning',
    subtitle: 'Zero-stress transition cleaning for landlords & new homeowners',
    overview: 'Ensure maximum security deposit returns or step into a pristine, disinfected fresh canvas with our comprehensive move-in and tenant departure deep cleaning package.',
    startingPrice: '₹1,999',
    features: [
      'Interior wardrobe & kitchen drawer vacuuming & sanitization',
      'Heavy appliance cutout & refrigerator cavity degreasing',
      'Complete paint speckle & dust wiping from fixtures',
      'Full house pest barrier surface spray wipe'
    ],
    benefits: [
      'Guarantees smooth landlord inspection & full deposit refund',
      'Sanitizes spaces previously inhabited by pets or prior occupants',
      'Prepares empty cupboards and drawers for immediate clothes packing'
    ],
    included: [
      'Inside-out cleaning of empty wardrobes, cabinets & drawers',
      'Heavy degreasing of kitchen oil stains and exhaust hoods',
      'Hard water scaling removal from shower enclosures & taps',
      'Balcony floor high-pressure jet wash and drain clearing',
      'Disinfection of switchboards, handles & intercoms'
    ],
    excluded: [
      'Hauling away discarded furniture or heavy construction debris',
      'Repairs to broken plumbing fixtures or electrical sockets'
    ],
    estimatedTime: '5 - 7 Hours',
    recommendedFor: 'Tenants vacating rental properties or home buyers moving into a newly handed-over home.',
    gallery: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Should the home be empty when your team arrives?',
        answer: 'Yes, move-in/out cleaning is most thorough when major heavy furniture and personal boxes are cleared, allowing access to inside cabinets and corners.'
      }
    ],
    ctaText: 'Book Move-In/Out Clean'
  },
  {
    id: 'kitchen-deep-cleaning',
    title: 'Kitchen Deep Cleaning',
    subtitle: 'Grease-free, hygienic culinary environment restoration',
    overview: 'Targeted heavy oil, carbon deposit, and tile grout degreasing tailored specifically for modern kitchens, chimneys, gas hobs, and cabinets.',
    startingPrice: '₹999',
    features: [
      'Chimney filter soak & degreasing in hot chemical bath',
      'Gas hob burner dismantle & carbon deposit removal',
      'Tile splashback grease removal with citrus eco-solvents',
      'Under-sink cabinet mold check & sanitization'
    ],
    benefits: [
      'Reduces kitchen fire hazards caused by buildup of cooking oil grease',
      'Restores suction efficiency of electric chimneys',
      'Creates a sterile food-safe prep zone free of pests'
    ],
    included: [
      'Electric chimney mesh filter degreasing & outer wipe',
      'Gas stove, knobs, and burner plate carbon scrubbing',
      'Wall tile oil stain removal & grout steam clean',
      'Kitchen platform slab, sink & tap chrome polish',
      'Exterior & interior wiping of empty overhead cabinets'
    ],
    excluded: [
      'Internal electric motor repair of chimney units',
      'Gas pipeline plumbing alterations'
    ],
    estimatedTime: '2.5 - 3.5 Hours',
    recommendedFor: 'Homes with heavy oil cooking residue or pre-dinner party kitchen preparation.',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Is the chimney motor opened during cleaning?',
        answer: 'We deep clean chimney filters, oil collectors, and outer housing. Motor assembly dismantling is kept sealed for warranty safety.'
      }
    ],
    ctaText: 'Book Kitchen Clean'
  }
];

export const FEATURED_CAR_SERVICES: FeaturedService[] = [
  {
    id: 'exterior-foam-wash',
    title: 'Exterior Foam Wash',
    subtitle: 'pH-balanced thick snow foam touchless wash & high-gloss spray wax',
    overview: 'Delicate high-pressure snow foam wash designed to encapsulate dirt particles and prevent swirl marks on clear coats.',
    startingPrice: '₹399',
    features: [
      'Dual-bucket hand wash technique with plush microfiber mitts',
      'High-volume snow foam lance application',
      'Tire gel dressing with UV blocker protection',
      'Streak-free glass & side mirror cleaning'
    ],
    benefits: [
      'Preserves paint coat gloss without inducing micro-scratches',
      'Repels road grime and mud with hydrophobic spray wax finish',
      'Keeps alloy wheels free from brake dust pitting'
    ],
    included: [
      'Underbody high pressure water blast',
      'Body snow foam bath & rinse',
      'Tire & wheel arch detail scrubbing',
      'Door jamb & trunk seal wiping',
      'Synthetic sealant spray application'
    ],
    excluded: [
      'Interior seat stain shampooing',
      'Machine compound polishing'
    ],
    estimatedTime: '45 - 60 Mins',
    recommendedFor: 'Bi-weekly routine vehicle exterior maintenance.',
    gallery: [
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Do you bring your own water and power source?',
        answer: 'Yes! Our mobile detailing vans are equipped with onboard soft-water tanks and power generators for doorstep service anywhere.'
      }
    ],
    ctaText: 'Book Exterior Wash'
  },
  {
    id: 'interior-cleaning',
    title: 'Interior Deep Cleaning',
    subtitle: 'Hospital-grade cabin sanitization, seat extraction & air fogging',
    overview: 'Deep cabin overhaul targeting seat stains, food spills, pet hair, dust mites, and persistent air conditioning odor.',
    startingPrice: '₹1,199',
    features: [
      'Hot water injection-extraction upholstery shampooing',
      'Leather seat condition balm treatment',
      'Roof headliner non-sag spot cleaning',
      'Ozone gas / thermal fog AC sanitization'
    ],
    benefits: [
      'Removes stubborn coffee, milk & ink stains from seats',
      'Kills 99.9% of cabin bacteria, viruses & fungal spores',
      'Restores supple texture to cracked leather interiors'
    ],
    included: [
      'Deep vacuuming of seats, floor carpet, boot & floor mats',
      'Seat fabric injection shampoo & extraction',
      'Dashboard, steering, gear knob & console UV dressing',
      'Glass interior streak-free wiping',
      'Antibacterial AC duct steam treatment'
    ],
    excluded: [
      'Ripped seat upholstery stitching',
      'Dashboard crack repairs'
    ],
    estimatedTime: '2.5 - 3.5 Hours',
    recommendedFor: 'Used cars recently purchased, cars with pet owners, or quarterly hygiene routine.',
    gallery: [
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'How long until seats dry completely after extraction?',
        answer: 'Our heavy wet-vac moisture extraction leaves fabric 85% dry. Full air dry takes about 1-2 hours in normal shaded air.'
      }
    ],
    ctaText: 'Book Interior Clean'
  },
  {
    id: 'premium-car-detailing',
    title: 'Premium Car Detailing',
    subtitle: 'Concourse paint correction, clay bar bath & ceramic protection',
    overview: 'The pinnacle of automotive care: 2 to 3-stage orbital machine paint correction to eliminate 90%+ of paint scratches and swirl marks.',
    startingPrice: '₹1,999',
    features: [
      'Clay bar paint decontamination to strip embedded tar & iron',
      'Dual-action machine compound swirl removal',
      'Hydrophobic ceramic/graphene sealant coat',
      'Engine bay detail wash & dress'
    ],
    benefits: [
      'Delivers mirror-like optical paint clarity & depth',
      'Provides 6 to 12 months hydrophobic rain & UV protection',
      'Dramatically elevates vehicle resale value'
    ],
    included: [
      'Full exterior snow foam wash & clay bar treatment',
      '2-Stage paint correction machine polish',
      'Wheel iron fallout remover & tire gel coat',
      'Plastic trim color restoration',
      'Engine bay degreasing & protective dressing'
    ],
    excluded: [
      'Body paint scratch respraying or panel beating'
    ],
    estimatedTime: '5 - 7 Hours',
    recommendedFor: 'Luxury vehicle owners, luxury auto enthusiasts, or pre-sale car detailing.',
    gallery: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Does paint correction remove deep scratches down to the primer?',
        answer: 'Paint correction removes clear coat swirls, light scratches, and oxidation. Scratches that penetrate past the color coat into metal require body shop paint.'
      }
    ],
    ctaText: 'Book Full Detailing'
  }
];

export const FEATURED_LAUNDRY_SERVICES: FeaturedService[] = [
  {
    id: 'curtain-cleaning',
    title: 'Curtain & Drapery Cleaning',
    subtitle: 'On-hang steam cleaning & off-hang specialized fabric care',
    overview: 'Specialized cleaning for heavy drapes, velvet curtains, blackout liners, and sheer lace without shrinkage or fabric damage.',
    startingPrice: '₹299 / panel',
    features: [
      'In-situ high-pressure steam cleaning option (no removal needed)',
      'Off-hang organic solvent dry cleaning for sensitive silk/velvet',
      'Fabric dust extraction & allergen neutralizer spray',
      'Crease-free drapery steamer press'
    ],
    benefits: [
      'Eliminates years of trapped dust & window moisture mold',
      'Protects expensive custom blackout lining & embroidery',
      'Convenient doorstep re-hanging service available'
    ],
    included: [
      'Fabric material inspection & color-fastness test',
      'Gentle solvent washing or high-temp steam treatment',
      'Gentle tumble dry / shadow dry',
      'Vertical steam pressing & hanger packaging'
    ],
    excluded: [
      'Curtain track/rod hardware installation repair'
    ],
    estimatedTime: '48 Hours (Free Pickup & Delivery)',
    recommendedFor: 'Seasonal household deep refresh & allergy prevention.',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Will my curtains shrink after washing?',
        answer: 'No. We use specialized non-aqueous dry cleaning for shrink-prone fabrics like silk, wool, and heavy velvet.'
      }
    ],
    ctaText: 'Book Curtain Laundry'
  },
  {
    id: 'blanket-cleaning',
    title: 'Blanket & Comforter Care',
    subtitle: 'Hygiene sanitization for duvets, mink blankets & heavy quilts',
    overview: 'Deep thermal sanitization and fluffing service for heavy winter comforters, feather duvets, and mink blankets.',
    startingPrice: '₹349 / piece',
    features: [
      'Anti-bacterial thermo-wash at 60°C to kill dust mites',
      'Feather duvet down-restoration tumble drying',
      'Hypoallergenic fragrance-free liquid detergent',
      'Vacuum-sealed moisture-proof storage packaging'
    ],
    benefits: [
      'Restores loft and soft fluffiness to clumpy down fillings',
      'Removes deep night sweat odors and skin dander',
      'Vacuum pack saves 70% storage closet space'
    ],
    included: [
      'Stain pretreatment on food/oil spots',
      'Gentle large-drum drum wash with fabric softeners',
      'Complete moisture-free tumble drying',
      'Aromatic hygiene pack sealing'
    ],
    excluded: [
      'Tear mending or zipper replacement (available upon request)'
    ],
    estimatedTime: '48 Hours',
    recommendedFor: 'End of winter blanket storage or quarterly bedding maintenance.',
    gallery: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Are heavy double mink blankets accepted?',
        answer: 'Yes, our industrial 30kg commercial washers comfortably process double mink and heavy king-size quilts.'
      }
    ],
    ctaText: 'Book Blanket Care'
  },
  {
    id: 'shoe-cleaning',
    title: 'Sneaker & Shoe Spa',
    subtitle: 'Hand-crafted restoration for sneakers, suede, leather & boots',
    overview: 'Master sneakerhead & luxury footwear spa treatment: hand cleaning soles, uppers, laces, inner linings, and suede nap conditioning.',
    startingPrice: '₹399 / pair',
    features: [
      'Uppers hand brush with Crep Protect / Reshoevn8r solutions',
      'Outsole undersole deep dirt extraction',
      'Suede nap brush restoration & waterproofing spray',
      'Deodorizing UV sterilizer chamber treatment'
    ],
    benefits: [
      'Revives white midsoles and removes yellow oxidation',
      'Extends life of limited edition sneakers & formal leather',
      'Sterilizes shoe interior eliminating foot odor bacteria'
    ],
    included: [
      'Lace removal & separate soak wash',
      'Upper material appropriate soft/medium brush scrub',
      'Midsole scrubbing & stain lift',
      'Deodorizing UV chamber sterilization',
      'Custom shoe tree shape retention during drying'
    ],
    excluded: [
      'Sole reglue or heel replacement cobra work'
    ],
    estimatedTime: '72 Hours',
    recommendedFor: 'White sneakers, suede boots, sports running shoes, and designer footwear.',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    faq: [
      {
        question: 'Is it safe for genuine suede and nubuck?',
        answer: 'Yes, suede is cleaned using dry eraser pads and specialized waterless suede foam, followed by brass brush nap restoration.'
      }
    ],
    ctaText: 'Book Shoe Spa'
  }
];
