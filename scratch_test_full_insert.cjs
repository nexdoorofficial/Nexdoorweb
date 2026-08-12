const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFullInsert() {
  const payload = {
    id: 'b-' + Date.now(),
    reference_id: 'NEX-TEST99',
    service_id: 'house-cleaning',
    address: 'Flat 4B, Prestige Cyber Towers, Kakkanad (682030)',
    selected_date: '2026-08-15',
    selected_time_slot: '11:30 AM',
    estimated_total: 3299,
    deposit_amount: 199,
    status: 'pending',
    assigned_technician: 'Unassigned',
    notes: '[Customer: Test User | Phone: +91 98765 43210 | Service: House Cleaning (3 BHK) | Spec: Premium Ultra Clean]'
  };

  const { data, error } = await supabase.from('bookings').insert([payload]).select();
  console.log('Full Insert Error:', error);
  console.log('Full Insert Data:', data);
}

testFullInsert();
