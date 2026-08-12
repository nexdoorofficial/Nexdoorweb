const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompat() {
  const payload = {
    id: 'b-' + Date.now(),
    reference_id: 'NEX-884920',
    service_id: 'laundry',
    address: '2nd Floor, Paradise Heights, Kakkanad (682030)',
    selected_date: '2026-08-16',
    selected_time_slot: '02:30 PM',
    estimated_total: 725,
    deposit_amount: 199,
    status: 'pending',
    assigned_technician: 'Unassigned',
    notes: '[Customer: Anand Varma | Phone: +91 98765 43210 | Email: anand@gmail.com | Area: Kakkanad (682030) | Service: Doorstep Laundry Service (5 Kg) | Options: Weight: 5 Kg | Package: Wash + Dry + Steam Press | Speed: Express | Care: Premium Luxury Care] Please handle silk items with care.'
  };

  const { data, error } = await supabase.from('bookings').insert([payload]).select();
  console.log('Compat Insert Error:', error);
  console.log('Compat Insert Data:', data);
}

testCompat();
