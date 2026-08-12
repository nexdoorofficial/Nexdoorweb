const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const newBooking = {
    id: 'test-' + Date.now(),
    reference_id: 'NEX-TEST1',
    customer_name: 'Test Customer',
    customer_phone: '+919999999999',
    customer_email: 'test@example.com',
    address: 'Test Address',
    area: 'Kakkanad',
    pincode: '682030',
    service_id: 'house-cleaning',
    service_name: 'House Cleaning (2-bhk)',
    category_or_package: 'premium',
    scheduled_date: '2026-08-15',
    scheduled_time: '11:30 AM',
    estimated_total: 3299,
    deposit_paid: 199,
    status: 'pending',
    assigned_staff: 'Unassigned',
    notes: 'Test note'
  };

  const { data, error } = await supabase.from('bookings').insert([newBooking]).select();
  console.log('Insert Error:', error);
  console.log('Insert Data:', data);
}

testInsert();
