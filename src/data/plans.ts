export interface PlanComparisonRow {
  feature: string;
  standard: boolean | string;
  premium: boolean | string;
  tooltip?: string;
}

export const PLAN_COMPARISON_MATRIX: PlanComparisonRow[] = [
  {
    feature: 'General Floor Mopping & Sweeping',
    standard: true,
    premium: true
  },
  {
    feature: 'Dusting Furniture & Light Fixtures',
    standard: true,
    premium: true
  },
  {
    feature: 'Bathroom Scrubbing & WC Sanitization',
    standard: 'Basic Scrub',
    premium: 'Heavy Tile Descaling & Steam'
  },
  {
    feature: 'Single-Disc Heavy Machine Floor Buffing',
    standard: false,
    premium: true,
    tooltip: 'Restores original shine on marble & vitrified tiles'
  },
  {
    feature: 'High-Pressure Steam Sanitization',
    standard: false,
    premium: true,
    tooltip: 'Deep thermal sanitization for kitchen & bath taps'
  },
  {
    feature: 'Kitchen Appliance Interior Degreasing',
    standard: 'Exterior Only',
    premium: 'Interior + Exterior'
  },
  {
    feature: 'Window Pane & Channel Vacuuming',
    standard: 'Standard Wipe',
    premium: 'Deep Channel Vacuum + Streak-Free Polish'
  },
  {
    feature: 'Eco-Friendly Chemical Solution',
    standard: 'Standard Eco',
    premium: 'Imported Non-Toxic Hospital Grade'
  },
  {
    feature: 'Team Strength',
    standard: '2 - 3 Specialists',
    premium: '3 - 5 Specialists + Supervisor'
  },
  {
    feature: 'Warranty & Re-clean Support',
    standard: '24 Hours',
    premium: '48 Hours Priority Re-clean Guarantee'
  }
];
