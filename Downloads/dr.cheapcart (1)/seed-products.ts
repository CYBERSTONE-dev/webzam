import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC046lbTrT_ckTAqNMfoQc6OMa9pq-YrGs',
  authDomain: 'drcheapcart.firebaseapp.com',
  projectId: 'drcheapcart',
  storageBucket: 'drcheapcart.firebasestorage.app',
  messagingSenderId: '178907424175',
  appId: '1:178907424175:web:21cd505b8e57d7b65ffb5a',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    title: 'Wireless Bluetooth Earbuds Pro',
    description: 'High-quality wireless earbuds with noise cancellation, 24-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
      'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=500',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500',
    ],
    video: 'https://youtube.com',
    price: 1499,
    comparativePrice: 2999,
    category: ['Electronics'],
    stock: 45,
    sku: 'EB-PRO-001',
    trending: true,
    featured: true,
    soldCount: 234,
    viewCount: 1567,
    createdAt: Date.now()
  },
  {
    title: 'Premium Cotton T-Shirt - Navy Blue',
    description: 'Ultra-soft premium cotton t-shirt with comfortable fit. Machine washable, durable, and perfect for everyday wear.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
    ],
    video: 'https://youtube.com',
    price: 499,
    comparativePrice: 999,
    category: ['Fashion'],
    stock: 120,
    sku: 'TS-NVY-M',
    trending: false,
    featured: true,
    soldCount: 567,
    viewCount: 2345,
    createdAt: Date.now()
  },
  {
    title: 'Smart Watch Series 5 - Black',
    description: 'Advanced smartwatch with heart rate monitoring, GPS, water resistance, and 7-day battery life. Compatible with iOS and Android.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    ],
    video: 'https://youtube.com',
    price: 2999,
    comparativePrice: 4999,
    category: ['Electronics'],
    stock: 30,
    sku: 'SW-BLK-005',
    trending: true,
    featured: false,
    soldCount: 189,
    viewCount: 3456,
    createdAt: Date.now()
  },
  {
    title: 'Organic Face Cream - Vitamin C',
    description: 'Nourishing face cream with Vitamin C and E. Lightweight formula, suitable for all skin types. 50ml tub.',
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
    images: [
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500',
    ],
    video: 'https://youtube.com',
    price: 699,
    comparativePrice: 1299,
    category: ['Beauty'],
    stock: 85,
    sku: 'FC-VIT-001',
    trending: true,
    featured: true,
    soldCount: 445,
    viewCount: 5678,
    createdAt: Date.now()
  },
  {
    title: 'Home Decorative LED Lamp',
    description: 'Beautiful decorative LED lamp with multiple color options. Perfect for bedroom, living room, or office ambiance.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    ],
    video: 'https://youtube.com',
    price: 899,
    comparativePrice: 1599,
    category: ['Home'],
    stock: 60,
    sku: 'LED-LMP-01',
    trending: false,
    featured: true,
    soldCount: 312,
    viewCount: 2890,
    createdAt: Date.now()
  },
  {
    title: 'Running Shoes - Comfort Fit',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Ideal for jogging, gym, or casual wear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    ],
    video: 'https://youtube.com',
    price: 1299,
    comparativePrice: 2499,
    category: ['Fashion'],
    stock: 40,
    sku: 'RS-CFT-042',
    trending: true,
    featured: false,
    soldCount: 678,
    viewCount: 7890,
    createdAt: Date.now()
  },
];

async function seedProducts() {
  console.log('Starting to seed products...\n');
  
  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log(`✓ Added: ${product.title} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`✗ Failed to add ${product.title}:`, error);
    }
  }
  
  console.log('\n✅ Seeding complete!');
}

seedProducts().catch(console.error);
