import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read credentials from .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`📍 URL: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample products to import
const products = [
  {
    sku: 'VRS-MNC-CB-120',
    name: { he: 'מיטת תינוק מונקו', en: 'Monaco Baby Crib', ru: 'Детская кроватка Монако' },
    subtitle: { he: 'מתכווננת 3 מצבים עם דופן נפתחת', en: '3-position adjustable with drop side', ru: '3-уровневая регулировка с опускающейся стороной' },
    description: {
      he: 'מיטת התינוק מקולקציית מונקו משלבת עיצוב מודרני עם פונקציונליות גבוהה. עשויה עץ ליבנה ו-MDF איכותי, וצבועה בצבעים על בסיס מים, בטוחים לחלוטין לתינוקות. המיטה מציעה 3 מצבי גובה למזרן, דופן קדמית ניתנת להסרה והתאמה לגובה מיטת ההורים, ואפשרות להפוך אותה לספת ילדים נוחה. המיטה מגיעה עם רגלי עץ יציבות וניתן להוסיף לה גלגלים או מנגנון נדנוד.',
      en: 'The Monaco collection baby crib combines modern design with high functionality. Made of high-quality birch wood and MDF, and painted with water-based, completely baby-safe paints. The crib offers 3 mattress height positions, a removable front side that adjusts to the height of the parents\' bed, and the option to transform it into a comfortable children\'s sofa. The bed comes with stable wooden legs, and wheels or a rocking mechanism can be added.',
      ru: 'Детская кроватка из коллекции Монако сочетает в себе современный дизайн и высокую функциональность. Изготовлена из качественной древесины березы и МДФ, окрашена полностью безопасными для детей красками на водной основе. Кроватка предлагает 3 положения высоты матраса, съемную переднюю стенку, регулируемую под высоту родительской кровати, и возможность трансформации в удобный детский диванчик. Кроватка поставляется с устойчивыми деревянными ножками, также можно добавить колесики или маятниковый механизм.'
    },
    category: { he: 'מיטות תינוקות', en: 'Baby Cribs', ru: 'Детские кроватки' },
    collection: { he: 'מונקו', en: 'Monaco', ru: 'Монако' },
    brand: { he: 'Veres', en: 'Veres', ru: 'Veres' },
    dimensions: { he: '125x65x88 ס"מ', en: '125x65x88 cm', ru: '125x65x88 см' },
    images: [
      '/images/products/crib-monaco-white-1.jpg',
      '/images/products/crib-monaco-white-2.jpg',
      '/images/products/crib-monaco-white-3.jpg',
    ],
    colors: [
      { name: { he: 'לבן', en: 'White', ru: 'Белый' }, hex: '#FFFFFF' },
      { name: { he: 'אפור פחם', en: 'Charcoal Grey', ru: 'Угольно-серый' }, hex: '#52525B' }
    ],
    price: { ils: 1490, usd: 410, eur: 380 },
    accessories: [
      {
        id: 'acc1',
        name: { he: 'גלגלים למיטה', en: 'Crib Wheels', ru: 'Колесики для кроватки' },
        price: { ils: 50, usd: 15, eur: 13 },
        image: '/images/products/accessory-wheels-1.jpg'
      },
      {
        id: 'acc2',
        name: { he: 'מערכת נדנדה', en: 'Rocking System', ru: 'Маятниковая система' },
        price: { ils: 198, usd: 55, eur: 50 },
        image: '/images/products/accessory-rocking-system-1.jpg'
      }
    ],
    similar_product_ids: [],
    in_stock: true,
    stock: 15,
    features: [
      { he: '3 מצבי גובה', en: '3 height positions', ru: '3 уровня высоты' },
      { he: 'דופן נפתחת', en: 'Drop side', ru: 'Опускающаяся сторона' }
    ],
    safety_info: {
      he: 'עומד בתקני בטיחות אירופיים EN 716',
      en: 'Meets European safety standards EN 716',
      ru: 'Соответствует европейским стандартам безопасности EN 716'
    },
    warranty_info: {
      he: 'אחריות יצרן ל-2 שנים',
      en: '2-year manufacturer warranty',
      ru: 'Гарантия производителя 2 года'
    },
    certificates: ['EN 716', 'ISO 9001']
  }
];

async function importProducts() {
  console.log(`🚀 Starting product import...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      console.log(`📦 Importing: ${product.name.en} (${product.sku})`);

      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Imported successfully! ID: ${data[0].id}`);
        successCount++;
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📦 Total: ${products.length}\n`);

  if (successCount > 0) {
    console.log('🎉 Products imported successfully!\n');
  }
}

// Check if products already exist
async function checkExistingProducts() {
  console.log('🔍 Checking for existing products...\n');

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('❌ Error checking products:', error.message);
    return false;
  }

  console.log(`📊 Found ${count || 0} products in database\n`);

  if (count > 0) {
    console.log('⚠️  Products already exist in the database.');
    console.log('If you want to reimport, delete them first from Supabase dashboard.\n');
    return true;
  }

  return false;
}

// Run the import
checkExistingProducts()
  .then(async (exists) => {
    if (!exists) {
      await importProducts();
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
