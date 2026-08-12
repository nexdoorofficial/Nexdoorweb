const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBasicInsert() {
  const minimalRow = {
    id: 'test-' + Date.now(),
    reference_id: 'NEX-MIN1',
    customer_name: 'Test Customer',
    customer_phone: '+919999999999',
    service_id: 'house-cleaning',
    scheduled_date: '2026-08-15',
    status: 'pending'
  };

  const { data, error } = await supabase.from('bookings').insert([minimalRow]).select();
  console.log('Minimal Insert Error:', error);
  console.log('Minimal Insert Data:', data);
}

testBasicInsert();
