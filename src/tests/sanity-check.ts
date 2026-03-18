import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  useCdn: false, // Set to false to see latest changes immediately
});

async function checkSanity() {
  console.log('🔍 Checking Sanity Connection...');
  console.log(`Project ID: ${process.env.SANITY_PROJECT_ID}`);
  
  try {
    const services = await client.fetch('*[_type == "service"]');
    console.log('✅ Connection Successful!');
    console.log(`Found ${services.length} services in the database.`);
    
    if (services.length > 0) {
      console.log('Service Names:', services.map(s => s.name).join(', '));
    } else {
      console.log('⚠️ No services found. (Maybe you haven\'t added content yet?)');
    }
  } catch (error) {
    console.error('❌ Sanity Connection Failed:');
    console.error(error.message);
  }
}

checkSanity();
