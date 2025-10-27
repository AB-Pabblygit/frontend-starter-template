import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { REALISTIC_DUMMY_DATA } from './_realistic-dummy-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export data to JSON files
const exportDataToFiles = () => {
  const exportDir = path.join(__dirname, '..', '..', '..', 'public', 'dummy-data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  
  // Export each dataset
  const datasets = {
    'customers.json': REALISTIC_DUMMY_DATA.customers,
    'transactions.json': REALISTIC_DUMMY_DATA.transactions,
    'invoices.json': REALISTIC_DUMMY_DATA.invoices,
    'subscriptions.json': REALISTIC_DUMMY_DATA.subscriptions,
    'monthly-analytics.json': REALISTIC_DUMMY_DATA.monthlyAnalytics,
    'products.json': REALISTIC_DUMMY_DATA.products,
    'plans.json': REALISTIC_DUMMY_DATA.plans,
    'summary.json': {
      generatedAt: REALISTIC_DUMMY_DATA.generatedAt,
      totalCustomers: REALISTIC_DUMMY_DATA.customers.length,
      totalTransactions: REALISTIC_DUMMY_DATA.transactions.length,
      totalInvoices: REALISTIC_DUMMY_DATA.invoices.length,
      totalSubscriptions: REALISTIC_DUMMY_DATA.subscriptions.length,
      monthsOfData: REALISTIC_DUMMY_DATA.monthlyAnalytics.length
    }
  };
  
  // Write each file
  Object.entries(datasets).forEach(([filename, data]) => {
    const filePath = path.join(exportDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Exported ${filename} (${data.length || Object.keys(data).length} records)`);
  });
  
  console.log(`\n📁 All data exported to: ${exportDir}`);
  console.log('📊 Files created:');
  Object.keys(datasets).forEach(filename => {
    console.log(`   - ${filename}`);
  });
};

// Export the data
exportDataToFiles();
