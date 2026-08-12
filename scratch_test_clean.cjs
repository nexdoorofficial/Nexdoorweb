const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://zavdaottweujphpvgkce.supabase.co';
const supabaseKey = 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanTest() {
  await supabase.from('bookings').delete().eq('id', 'b-1');
  console.log('Cleaned test row');
}

cleanTest();
