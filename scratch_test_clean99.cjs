const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanFullTest() {
  await supabase.from('bookings').delete().eq('reference_id', 'NEX-TEST99');
  console.log('Cleaned NEX-TEST99');
}

cleanFullTest();
