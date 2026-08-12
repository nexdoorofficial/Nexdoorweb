const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRefId() {
  const { data, error } = await supabase.from('bookings').insert([{ id: 'b-1', reference_id: 'REF-1' }]).select();
  console.log('Error:', error);
  console.log('Data:', data);
}

testRefId();
