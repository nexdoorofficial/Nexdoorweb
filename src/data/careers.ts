import type { CareerPosition } from '../types';

export const CAREER_POSITIONS: CareerPosition[] = [
  {
    id: 'tech-lead-cleaning',
    title: 'Senior House Cleaning Supervisor',
    department: 'Home Services Operations',
    type: 'Full-Time',
    location: 'Kakkanad / Edappally Hub',
    salary: '₹28,000 - ₹35,000 / month + Performance Bonus',
    description: 'Lead a team of 4 residential cleaning specialists operating single-disc floor scrubbers and steam machines.',
    responsibilities: [
      'Conduct pre-cleaning customer walkthroughs and scope validation',
      'Manage equipment safety, chemical dilution ratios, and team punctuality',
      'Perform final quality control inspection before customer sign-off'
    ],
    requirements: [
      '2+ years experience in hotel housekeeping or commercial deep cleaning',
      'Familiarity with floor scrubbing machinery and eco-chemicals',
      'Valid 2-wheeler or 4-wheeler driver license preferred'
    ]
  },
  {
    id: 'car-detailing-specialist',
    title: 'Automotive Detailing Technician',
    department: 'Mobile Car Wash Unit',
    type: 'Full-Time',
    location: 'Kochi Fleet Hub',
    salary: '₹25,000 - ₹32,000 / month + Tips & Incentive',
    description: 'Execute doorstep foam washing, interior seat extraction, and dual-action machine paint polishing.',
    responsibilities: [
      'Operate mobile detailing unit pressure jets and steam generators',
      'Perform delicate interior upholstery extraction and leather conditioning',
      'Apply ceramic sealants and tire dressings according to protocol'
    ],
    requirements: [
      'Prior experience in car detailing, polishing, or auto wash',
      'High attention to detail and care for high-end vehicle clear coats'
    ]
  },
  {
    id: 'customer-support-executive',
    title: 'Customer Experience & Booking Specialist',
    department: 'Customer Operations',
    type: 'Shift',
    location: 'Kakkanad HQ / Hybrid',
    salary: '₹22,000 - ₹28,000 / month',
    description: 'Manage incoming customer booking requests, schedule dispatch routes, and resolve inquiries.',
    responsibilities: [
      'Assist customers with booking customization and service inquiries',
      'Coordinate real-time team dispatch with field supervisors',
      'Collect customer feedback ratings post-service completion'
    ],
    requirements: [
      'Fluent in English & Malayalam',
      'Strong communication skills and empathy',
      'Familiarity with CRM tools or chat software'
    ]
  }
];
