const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSelectOne() {
  const { data, error } = await supabase.from('bookings').select();
  console.log('Select Error:', error);
  console.log('Select Data:', data);
}

testSelectOne();
