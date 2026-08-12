import type { HouseCategoryData, VehicleCategoryData } from '../types';

export const HOUSE_CATEGORIES: HouseCategoryData[] = [
  {
    id: '1-bhk',
    label: '1 BHK',
    description: 'Compact apartments up to 600 sq ft.',
    sqftRange: '400 - 650 sq.ft',
    standard: {
      name: 'Standard Deep Clean',
      priceDisplay: '₹1,499',
      priceNumeric: 1499,
      description: 'Comprehensive general cleaning covering all essential living spaces, kitchen surfaces, and bathroom.',
      included: [
        'Floor sweeping, mopping & vacuuming',
        'Dusting of open furniture, shelves & fixtures',
        'Kitchen countertop & sink sanitization',
        'Bathroom deep scrub (toilet, sink, floor)',
        'Trash removal & linen change prompt'
      ],
      excluded: [
        'Inside kitchen cabinets / fridge cleaning',
        'Balcony high-pressure wash',
        'Upholstery shampooing',
        'Wall paint stain scraping'
      ],
      duration: '2.5 - 3 Hours',
      professionals: 2,
      frequency: 'Every 2-4 Weeks',
      prepInstructions: [
        'Secure high-value personal jewelry and items',
        'Keep floor free from loose toys and clothes'
      ],
      afterCare: [
        'Keep ventilation fans ON for 30 minutes',
        'Allow floors to dry fully before placing heavy rugs'
      ]
    },
    premium: {
      name: 'Premium Ultra Clean',
      priceDisplay: '₹2,499',
      priceNumeric: 2499,
      description: 'Enterprise-grade deep sanitization including steam treatment, appliance exterior degreasing & glass polishing.',
      included: [
        'All Standard Clean features included',
        'Steam sanitization of bathroom & kitchen fixtures',
        'Interior appliance surface degreasing (hob, hood, microwave exterior)',
        'Full window pane & channel vacuuming',
        'Wood polish spray on wooden furniture'
      ],
      excluded: [
        'Full house wall paint repainting',
        'External high-rise window rope access'
      ],
      duration: '4 - 4.5 Hours',
      professionals: 3,
      frequency: 'Once a Month',
      prepInstructions: [
        'Clear kitchen counters of perishable unpackaged food',
        'Provide electrical points access for steam machinery'
      ],
      afterCare: [
        'Wipe down glass surfaces with microfiber after 24 hrs if needed',
        'Enjoy sanitized germ-free indoor air'
      ]
    }
  },
  {
    id: '2-bhk',
    label: '2 BHK',
    description: 'Medium residential units from 650 - 1100 sq ft.',
    sqftRange: '650 - 1,100 sq.ft',
    standard: {
      name: 'Standard Deep Clean',
      priceDisplay: '₹1,999',
      priceNumeric: 1999,
      description: 'Thorough cleaning for 2 bedrooms, hall, kitchen, and up to 2 bathrooms.',
      included: [
        'Dual bedroom dusting & floor scrubbing',
        'Living & dining room complete vacuuming',
        'Kitchen stove & slab degreasing',
        'Bathroom wall tile & fixture descaling (2 Bathrooms)',
        'Cobweb removal from high ceilings'
      ],
      excluded: [
        'Inside wardrobe organizing',
        'Sofa steam extraction'
      ],
      duration: '3.5 - 4 Hours',
      professionals: 3,
      frequency: 'Monthly',
      prepInstructions: [
        'Store away sensitive paper documents',
        'Ensure continuous water supply during service'
      ],
      afterCare: [
        'Keep windows slightly cracked for airflow'
      ]
    },
    premium: {
      name: 'Premium Ultra Clean',
      priceDisplay: '₹3,299',
      priceNumeric: 3299,
      description: 'All-inclusive deep restorative clean with heavy machine floor scrubbing and mattress vacuuming.',
      included: [
        'All Standard 2 BHK features',
        'Single-disc floor buffing machine scrub',
        'UV mattress vacuuming (2 Mattresses)',
        'Kitchen cabinet interior wipe-down',
        'Balcony floor high-pressure jet wash'
      ],
      excluded: [
        'Civil repair work / tile grouting replacement',
        'External high-rise window scaffolding access'
      ],
      duration: '5 - 6 Hours',
      professionals: 4,
      frequency: 'Bi-monthly or Seasonal',
      prepInstructions: [
        'Empty kitchen cabinet drawers if interior clean is desired'
      ],
      afterCare: [
        'Do not step on freshly machine-scrubbed marble for 1 hour'
      ]
    }
  },
  {
    id: '3-bhk',
    label: '3 BHK',
    description: 'Spacious family apartments & flats (1100 - 1700 sq ft).',
    sqftRange: '1,100 - 1,700 sq.ft',
    standard: {
      name: 'Standard Deep Clean',
      priceDisplay: '₹2,799',
      priceNumeric: 2799,
      description: 'Complete multi-room deep cleaning for larger households.',
      included: [
        '3 Bedrooms, Living, Dining & Kitchen detail cleaning',
        'Up to 3 Bathrooms descaling & disinfection',
        'Fan blade, light fixture & switchboard wiping',
        'Balcony railing & floor wash'
      ],
      excluded: [
        'Water tank cleaning',
        'Heavy furniture lifting beyond safe limit'
      ],
      duration: '4.5 - 5 Hours',
      professionals: 3,
      frequency: 'Monthly',
      prepInstructions: [
        'Provide dedicated parking spot for equipment van if applicable'
      ],
      afterCare: [
        'Maintain room temperature above 20°C for fast drying'
      ]
    },
    premium: {
      name: 'Premium Ultra Clean',
      priceDisplay: '₹4,499',
      priceNumeric: 4499,
      description: 'Luxury deep treatment featuring sofa shampooing, full kitchen steam clean & balcony jet wash.',
      included: [
        'All Standard 3 BHK features',
        '5-Seater Sofa foam shampoo & extraction',
        'Complete kitchen steam degreasing & interior cabinet detailing',
        'Hard water stain removal on glass shower enclosures',
        'Door frame, window mesh wash & high-gloss floor polishing'
      ],
      excluded: [
        'Exterior facade cleaning requiring scaffolding',
        'Overhead water tank chemical flushing'
      ],
      duration: '6.5 - 7.5 Hours',
      professionals: 5,
      frequency: 'Quarterly',
      prepInstructions: [
        'Remove clothes from closets if interior wardrobe cleaning is opted'
      ],
      afterCare: [
        'Allow sofa upholstery 3-4 hours to air dry completely'
      ]
    }
  },
  {
    id: '4-bhk',
    label: '4 BHK',
    description: 'Large executive residences (1700 - 2500 sq ft).',
    sqftRange: '1,700 - 2,500 sq.ft',
    standard: {
      name: 'Standard Deep Clean',
      priceDisplay: '₹3,499',
      priceNumeric: 3499,
      description: 'Full home deep sanitization engineered for expansive 4 bedroom residences.',
      included: [
        'Detailed cleaning of 4 Bedrooms, Lounge, Dining, Kitchen',
        'Up to 4 Bathrooms complete sanitization',
        'Balconies & utility service yard cleaning',
        'Furniture exterior wipe-down & floor mopping with eco-disinfectant'
      ],
      excluded: [
        'Terrace waterproofing or roof washing',
        'Deep upholstery stain bleaching'
      ],
      duration: '6 - 7 Hours',
      professionals: 4,
      frequency: 'Monthly',
      prepInstructions: [
        'Ensure power outlets are functional in all wings'
      ],
      afterCare: [
        'Keep bathroom exhaust running for 45 mins'
      ]
    },
    premium: {
      name: 'Premium Ultra Clean',
      priceDisplay: '₹5,999',
      priceNumeric: 5999,
      description: 'Full scale VIP restorative cleaning service with industrial heavy scrubbers & fabric protection.',
      included: [
        'All Standard 4 BHK features',
        'Industrial floor scrubber polish for marble / granite',
        '7-Seater Sofa & 2 Mattress deep shampoo extraction',
        'Chimney filter degreasing & full oven interior clean',
        'High window pane streak-free treatment'
      ],
      excluded: [
        'Garden landscape maintenance',
        'Structural roof waterproofing repair'
      ],
      duration: '8 - 9 Hours',
      professionals: 6,
      frequency: 'Quarterly',
      prepInstructions: [
        'Clear fragile crystal glassware from open displays'
      ],
      afterCare: [
        'Follow technician guidance for polished stone surfaces'
      ]
    }
  },
  {
    id: 'villa',
    label: 'Villa',
    description: 'Multi-story independent houses, duplexes & villas.',
    sqftRange: '2,500+ sq.ft',
    standard: {
      name: 'Standard Estate Clean',
      priceDisplay: 'Custom Quote',
      priceNumeric: null,
      description: 'Tailored estate cleaning plan custom-fit for multi-floor luxury villas.',
      included: [
        'Comprehensive multi-level floor cleaning',
        'Staircase, banister, chandelier & high ceiling cobweb removal',
        'Patio, porch & entryway pressure washing',
        'All bed & bath sanctuary sanitization'
      ],
      excluded: [
        'Swimming pool chemical treatment',
        'High-rise exterior rope access cleaning'
      ],
      duration: 'Full Day (8+ Hours)',
      professionals: 6,
      frequency: 'On Demand / Monthly',
      prepInstructions: [
        'Initial site inspection recommended for exact team sizing'
      ],
      afterCare: [
        'Custom maintenance schedule provided upon completion'
      ]
    },
    premium: {
      name: 'Royal Villa Protocol',
      priceDisplay: 'Custom Quote',
      priceNumeric: null,
      description: 'White-glove luxury treatment covering entire villa interior, private terrace & driveways.',
      included: [
        'Complete interior deep steam sanitization',
        'Full upholstery & carpet shampooing',
        'Granite / Marble diamond pad restoration scrub',
        'Outdoor patio jet washing & solar panel dusting'
      ],
      excluded: [
        'Major structural painting',
        'Swimming pool filter pump replacement'
      ],
      duration: '1 - 2 Days',
      professionals: 8,
      frequency: 'Biannual',
      prepInstructions: [
        'Dedicated supervisor site walkthrough before day 1'
      ],
      afterCare: [
        'Dedicated account manager wrap-up report'
      ]
    }
  },
  {
    id: 'custom',
    label: 'Custom Size',
    description: 'Commercial spaces, offices, or custom residential floor layouts.',
    sqftRange: 'Any Custom Sq.Ft',
    standard: {
      name: 'Custom Inspection & Quote',
      priceDisplay: 'Request Inspection',
      priceNumeric: null,
      description: 'Schedule a free 15-minute on-site or virtual inspection with our lead technical supervisor.',
      included: [
        'Detailed square footage assessment',
        'Customized scope-of-work documentation',
        'Flexible scheduling & recurring enterprise discounts'
      ],
      excluded: [
        'Hazardous chemical waste disposal',
        'Structural architectural modifications'
      ],
      duration: 'Flexible',
      professionals: 4,
      frequency: 'Customized',
      prepInstructions: [
        'Share blueprint or photos prior to site visit if available'
      ],
      afterCare: [
        'Written service level agreement (SLA) delivered in 24 hours'
      ]
    },
    premium: {
      name: 'Custom Executive SLA',
      priceDisplay: 'Request Inspection',
      priceNumeric: null,
      description: 'Full white-label enterprise cleaning protocol with dedicated supervisor & custom timeline.',
      included: [
        'Dedicated key account manager',
        'Off-peak / weekend night shift execution option',
        'Specialized chemical treatments (anti-microbial fogging)'
      ],
      excluded: [
        'Industrial asbestos removal',
        'High-voltage electrical repairs'
      ],
      duration: 'Custom Schedule',
      professionals: 10,
      frequency: 'Contractual',
      prepInstructions: [
        'Security clearance badge arrangement if required'
      ],
      afterCare: [
        'Quarterly audit & floor longevity reports'
      ]
    }
  }
];

export const VEHICLE_CATEGORIES: VehicleCategoryData[] = [
  {
    id: 'hatchback',
    label: 'Hatchback',
    description: 'Compact 4-wheeler city cars.',
    examples: 'Swift, i10, Baleno, Polo, Tiago',
    packages: {
      basic: {
        id: 'basic',
        name: 'Basic Wash',
        tagline: 'Quick exterior refresh & vacuuming',
        price: 399,
        overview: 'pH-neutral pressure wash, tire dressing, and interior cabin floor vacuuming.',
        included: ['High-pressure water rinse', 'Snow foam hand wash', 'Tire shine & rim wiping', 'Cabin & boot vacuuming', 'Dashboard dust wipe'],
        excluded: ['Upholstery shampoo', 'Paint waxing', 'Engine bay clean'],
        duration: '45 Mins',
        frequency: 'Bi-Weekly'
      },
      premium: {
        id: 'premium',
        name: 'Premium Wash',
        tagline: 'Deep exterior shine & interior sanitization',
        price: 699,
        overview: 'Full foam wash, hydrophobic spray wax coating, deep door jam cleaning and interior wipe.',
        included: ['All Basic Wash features', 'Carnauba spray wax application', 'Door jambs & glass streak-free wipe', 'AC vent steam spray', 'Mat washing & drying'],
        excluded: ['Machine paint polishing', 'Leather conditioning', 'Body denting & repainting'],
        duration: '75 Mins',
        frequency: 'Monthly'
      },
      interior: {
        id: 'interior',
        name: 'Interior Detailing',
        tagline: 'Complete cabin deep scrub & deodorization',
        price: 1199,
        overview: 'Deep fabric/leather seat shampoo extraction, ceiling liner cleaning & germ-free ozone fogging.',
        included: ['Seat fabric injection-extraction scrub', 'Roof liner spot cleaning', 'Dashboard & console UV protectant dressing', 'Ozone air sanitization', 'Carpet deep extraction'],
        excluded: ['Exterior paint correction', 'Engine bay pressure washing', 'Glass scratch removal'],
        duration: '2.5 Hours',
        frequency: 'Quarterly'
      },
      complete: {
        id: 'complete',
        name: 'Complete Detailing',
        tagline: '360° Showroom restoration package',
        price: 1999,
        overview: 'Combines full interior spa with 2-stage machine paint polish and ceramic sealant shine.',
        included: ['All Interior Detailing features', 'Dual-action machine paint polish', 'Synthetic ceramic spray sealant (6-month protection)', 'Engine bay dressing', 'Headlight clarity restoration'],
        excluded: ['Deep scratch painting / bodywork repair', 'Alloy wheel curb damage welding'],
        duration: '4.5 Hours',
        frequency: 'Bi-Annually'
      }
    }
  },
  {
    id: 'sedan',
    label: 'Sedan',
    description: 'Mid-size 3-box passenger cars.',
    examples: 'City, Verna, Ciaz, Slavia, Virtus',
    packages: {
      basic: {
        id: 'basic',
        name: 'Basic Wash',
        tagline: 'Exterior foam wash & floor vacuum',
        price: 499,
        overview: 'Pressure water wash, microfiber dry, tire gloss & interior footwell vacuuming.',
        included: ['High-pressure body rinse', 'pH neutral foam wash', 'Tire & wheel arch wash', 'Full floor mat & boot vacuum'],
        excluded: ['Wax polish', 'Seat stain removal', 'Engine degreasing'],
        duration: '50 Mins',
        frequency: 'Bi-Weekly'
      },
      premium: {
        id: 'premium',
        name: 'Premium Wash',
        tagline: 'Hydrophobic shine & detailed cabin wipe',
        price: 849,
        overview: 'Hydrophobic spray coating, glass treatment, door lip degreasing and dash polish.',
        included: ['All Basic Wash features', 'Hydrophobic polymer wax shield', 'Interior console & door trim dressing', 'Windshield anti-fog glass treatment'],
        excluded: ['Deep seat shampoo', 'Orbital machine buffing'],
        duration: '90 Mins',
        frequency: 'Monthly'
      },
      interior: {
        id: 'interior',
        name: 'Interior Detailing',
        tagline: 'Total cabin rejuvenation',
        price: 1399,
        overview: 'Hot water seat extraction, leather conditioning, AC duct disinfectant fogging.',
        included: ['Full seat shampoo & wet vacuum extraction', 'Leather seat deep scrub & conditioner', 'Roof headliner clean', 'Dashboard & door panel UV protection', 'Air duct ozone treatment'],
        excluded: ['Exterior paint buffing', 'Windshield glass polishing'],
        duration: '3 Hours',
        frequency: 'Quarterly'
      },
      complete: {
        id: 'complete',
        name: 'Complete Detailing',
        tagline: 'Ultimate inside-out restoration',
        price: 2399,
        overview: 'Showroom finish paint correction polish combined with deep interior extraction.',
        included: ['Complete Interior Detailing', '2-Step orbital machine paint correction', 'Hydrophobic ceramic sealant application', 'Engine bay degreasing', 'Alloy wheel iron decontaminant wash'],
        excluded: ['Major denting/painting', 'Rusted underbody welding'],
        duration: '5 Hours',
        frequency: 'Bi-Annually'
      }
    }
  },
  {
    id: 'suv',
    label: 'Compact & Mid SUV',
    description: '5-Seater crossover & compact SUVs.',
    examples: 'Creta, Seltos, Nexon, Brezza, Harrier',
    packages: {
      basic: {
        id: 'basic',
        name: 'Basic Wash',
        tagline: 'Rugged body wash & cabin vacuum',
        price: 599,
        overview: 'Underbody high-pressure jet wash, body snow foam, tire dressing & boot vacuum.',
        included: ['Underbody jet wash', 'Body snow foam wash', 'Tire & rim detail wash', 'Cabin & boot vacuuming'],
        excluded: ['Body wax', 'Upholstery stain extraction', 'Engine bay detailing'],
        duration: '60 Mins',
        frequency: 'Bi-Weekly'
      },
      premium: {
        id: 'premium',
        name: 'Premium Wash',
        tagline: 'High-gloss protection & glass polishing',
        price: 999,
        overview: 'Polymer spray wax, wheel arch mud removal, interior trim nourish & glass clean.',
        included: ['All Basic Wash features', 'Carnauba polymer gloss wax', 'Underbody mud jet flush', 'Interior trim UV protectant', 'Glass streak-free wipe'],
        excluded: ['Machine buffing', 'Leather restoration'],
        duration: '100 Mins',
        frequency: 'Monthly'
      },
      interior: {
        id: 'interior',
        name: 'Interior Detailing',
        tagline: 'Deep SUV cabin spa',
        price: 1599,
        overview: 'Extraction shampooing for all 5 seats, boot space detail clean, and disinfectant mist.',
        included: ['5-Seat hot extraction shampooing', 'Boot floor & side panel extraction', 'Roof headliner spot treatment', 'Ozone gas anti-bacterial cabin treatment'],
        excluded: ['Exterior paint correction', 'Silencer coating'],
        duration: '3.5 Hours',
        frequency: 'Quarterly'
      },
      complete: {
        id: 'complete',
        name: 'Complete Detailing',
        tagline: 'Master SUV detailing',
        price: 2799,
        overview: 'Heavy paint correction to eliminate swirl marks + total interior rejuvenation.',
        included: ['Full Interior Detailing', '2-Stage paint swirl mark removal', 'Ceramic spray sealant shield', 'Plastic cladding restoration', 'Engine bay detail clean'],
        excluded: ['Body repainting', 'Glass deep scratch removal'],
        duration: '5.5 Hours',
        frequency: 'Bi-Annually'
      }
    }
  },
  {
    id: 'luxury-suv',
    label: '7-Seater / Large SUV',
    description: '3-Row full size SUVs & MPVs.',
    examples: 'Fortuner, Endeavour, Innova Hycross, XUV700, Safari',
    packages: {
      basic: {
        id: 'basic',
        name: 'Basic Wash',
        tagline: 'Full-size 3-row wash & vacuum',
        price: 699,
        overview: 'High-pressure foam wash for large body frames, underbody spray, 3-row interior vacuum.',
        included: ['High-pressure body & underbody rinse', 'Snow foam wash', '3-Row seats & trunk vacuum', 'Tire gloss application'],
        excluded: ['Wax polish', 'Leather seat conditioning'],
        duration: '75 Mins',
        frequency: 'Bi-Weekly'
      },
      premium: {
        id: 'premium',
        name: 'Premium Wash',
        tagline: 'Extended gloss wax & trim nourishment',
        price: 1199,
        overview: 'Heavy snow foam, Carnauba wax shield, step-board clean, and interior trim treatment.',
        included: ['All Basic Wash features', 'Carnauba spray wax coating', 'Side stepboard & roof rail cleaning', 'Full cabin UV trim polish'],
        excluded: ['Machine paint restoration', 'Deep carpet extraction'],
        duration: '2 Hours',
        frequency: 'Monthly'
      },
      interior: {
        id: 'interior',
        name: 'Interior Detailing',
        tagline: '3-Row luxury interior overhaul',
        price: 1899,
        overview: 'Deep extraction shampoo for 7 seats, leather nourishment, roof clean & ozone sanitization.',
        included: ['7-Seat deep injection-extraction shampoo', 'Trunk floor & side pocket extraction', 'Roof headliner deep clean', 'Dual AC vent steam disinfectant spray'],
        excluded: ['Exterior paint correction', 'Headlight buffing'],
        duration: '4 Hours',
        frequency: 'Quarterly'
      },
      complete: {
        id: 'complete',
        name: 'Complete Detailing',
        tagline: 'Flagship 3-Row SUV detailing',
        price: 3299,
        overview: 'Complete machine buffing & paint decontamination paired with top-tier interior spa.',
        included: ['Complete 3-Row Interior Detailing', 'Clay bar paint decontamination', 'Multi-stage machine paint polish', 'Ceramic spray sealant (9-month endurance)', 'Engine compartment detail'],
        excluded: ['Structural body shop repairs', 'Exhaust pipe rust removal'],
        duration: '6 Hours',
        frequency: 'Bi-Annually'
      }
    }
  },
  {
    id: 'premium-car',
    label: 'Luxury / Supercar',
    description: 'High-end luxury sedans & sports cars.',
    examples: 'BMW 5/7 Series, Mercedes E/S Class, Audi A6/A8, Porsche',
    packages: {
      basic: {
        id: 'basic',
        name: 'Basic Wash',
        tagline: 'Gentle touchless hand wash',
        price: 899,
        overview: 'pH-balanced delicate microfiber hand wash engineered for soft clear coats & ceramic-coated cars.',
        included: ['Filtered water soft rinse', 'pH 7 neutral delicate snow foam', 'Scratch-free plush microfiber dry', 'Tire gel & wheel rim detail wiping', 'Cabin light vacuuming'],
        excluded: ['Abrasive machine polishing', 'Leather balm conditioning'],
        duration: '75 Mins',
        frequency: 'Weekly'
      },
      premium: {
        id: 'premium',
        name: 'Premium Wash',
        tagline: 'Swiss vax / SiO2 ceramic booster wash',
        price: 1499,
        overview: 'SiO2 ceramic booster coat spray, luxury leather trim wipe, glass hydrophobic coat.',
        included: ['All Basic Wash features', 'SiO2 ceramic hydrophobic spray coat', 'Nappa leather surface gentle wiping', 'Wheel iron fallout removal spray'],
        excluded: ['Heavy paint correction', 'Roof liner extraction'],
        duration: '2 Hours',
        frequency: 'Bi-Weekly'
      },
      interior: {
        id: 'interior',
        name: 'Interior Detailing',
        tagline: 'White-glove luxury leather & alcantara spa',
        price: 2499,
        overview: 'Ph-balanced luxury leather balm feeding, alcantara suede brush clean, and hospital-grade air fogging.',
        included: ['Ph-neutral leather cleaner & balm conditioner', 'Alcantara steam & soft brush detail', 'Real wood trim polish & glass crystal clean', 'Hospital-grade air sanitization fogging'],
        excluded: ['Exterior paint correction', 'Rims powder coating'],
        duration: '4.5 Hours',
        frequency: 'Quarterly'
      },
      complete: {
        id: 'complete',
        name: 'Complete Detailing',
        tagline: 'Concourse-grade detailing protocol',
        price: 4499,
        overview: 'Clay bar decontamination, 3-stage precision paint correction, luxury interior restoration.',
        included: ['Full Luxury Interior Spa', 'Clay bar decontamination treatment', '3-Stage paint polish to 95%+ clarity', 'Graphene ceramic hybrid sealant application', 'Engine bay dressed & protected'],
        excluded: ['Respraying', 'PPF wrap installation'],
        duration: '7+ Hours',
        frequency: 'Bi-Annually'
      }
    }
  }
];

export const LAUNDRY_WEIGHT_TIERS = [
  { weightKg: 1, label: '1 kg', estItems: '3 - 4 Shirts / Tops', basePricePerKg: 120 },
  { weightKg: 2, label: '2 kg', estItems: '6 - 8 Clothes (Free Pickup Threshold)', basePricePerKg: 110 },
  { weightKg: 3, label: '3 kg', estItems: '10 - 12 Daily Clothes', basePricePerKg: 100 },
  { weightKg: 5, label: '5 kg', estItems: '18 - 20 Clothes / Small Family', basePricePerKg: 90 },
  { weightKg: 10, label: '10 kg', estItems: '35 - 40 Clothes / Weekly Load', basePricePerKg: 85 },
  { weightKg: 15, label: '15 kg', estItems: '50 - 60 Clothes / Heavy Load', basePricePerKg: 80 },
  { weightKg: 20, label: '20 kg', estItems: '70+ Clothes / Bulk Family Load', basePricePerKg: 75 },
];
