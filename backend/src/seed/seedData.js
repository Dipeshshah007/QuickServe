const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const User = require('../models/User.model');
const Restaurant = require('../models/Restaurant.model');
const MenuItem = require('../models/MenuItem.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickserve';

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Restaurant.deleteMany(), MenuItem.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // ── Create Admin ────────────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@quickserve.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    isActive: true,
    isVerified: true,
  });

  // ── Create Test Customer ────────────────────────────────────────────────────
  await User.create({
    name: 'John Doe',
    email: 'customer@quickserve.com',
    password: 'Customer@123',
    phone: '+1-555-0100',
    role: 'customer',
    isActive: true,
    isVerified: true,
    addresses: [{
      label: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true,
    }],
  });

  // ── Create Restaurants ──────────────────────────────────────────────────────
  const restaurants = await Restaurant.insertMany([
    {
      name: "Mario's Pizzeria",
      description: 'Authentic Neapolitan pizza with wood-fired ovens and fresh ingredients imported from Italy.',
      cuisineTypes: ['Italian', 'Pizza'],
      categories: ['pizza'],
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      coverImage: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
      address: { street: '45 Broadway', city: 'New York', state: 'NY', zipCode: '10006', lat: 40.7580, lng: -73.9855 },
      contactPhone: '+1-555-0101',
      rating: { average: 4.7, count: 342 },
      deliveryInfo: { minOrder: 15, deliveryFee: 2.99, estimatedTime: '25-35 min', freeDeliveryAbove: 50 },
      isFeatured: true,
      isActive: true,
      tags: ['popular', 'fast-delivery'],
    },
    {
      name: "Burger Republic",
      description: 'Juicy gourmet burgers stacked high with the finest toppings. Crafted to perfection every time.',
      cuisineTypes: ['American', 'Burgers'],
      categories: ['burger'],
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      address: { street: '789 Fifth Ave', city: 'New York', state: 'NY', zipCode: '10022', lat: 40.7638, lng: -73.9730 },
      contactPhone: '+1-555-0102',
      rating: { average: 4.5, count: 218 },
      deliveryInfo: { minOrder: 12, deliveryFee: 1.99, estimatedTime: '20-30 min', freeDeliveryAbove: 40 },
      isFeatured: true,
      isActive: true,
      tags: ['trending', 'must-try'],
    },
    {
      name: "Sakura Sushi Bar",
      description: 'Premium fresh sushi and Japanese cuisine crafted by our master chef with 20+ years of experience.',
      cuisineTypes: ['Japanese', 'Sushi', 'Asian'],
      categories: ['sushi'],
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      coverImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800',
      address: { street: '12 East 49th St', city: 'New York', state: 'NY', zipCode: '10017', lat: 40.7554, lng: -73.9746 },
      contactPhone: '+1-555-0103',
      rating: { average: 4.9, count: 156 },
      deliveryInfo: { minOrder: 25, deliveryFee: 3.99, estimatedTime: '35-50 min', freeDeliveryAbove: 75 },
      isFeatured: true,
      isActive: true,
      tags: ['premium', 'fresh'],
    },
    {
      name: "Spice Garden",
      description: 'Authentic Indian cuisine with aromatic spices, rich curries, and tandoor-baked breads.',
      cuisineTypes: ['Indian', 'Asian'],
      categories: ['indian'],
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
      address: { street: '234 Lexington Ave', city: 'New York', state: 'NY', zipCode: '10016', lat: 40.7470, lng: -73.9793 },
      contactPhone: '+1-555-0104',
      rating: { average: 4.6, count: 289 },
      deliveryInfo: { minOrder: 18, deliveryFee: 2.49, estimatedTime: '30-45 min', freeDeliveryAbove: 60 },
      isFeatured: false,
      isActive: true,
      tags: ['vegetarian-friendly', 'spicy'],
    },
    {
      name: "Taco Fiesta",
      description: 'Street-style Mexican tacos, burritos and nachos with fresh salsa made in-house daily.',
      cuisineTypes: ['Mexican', 'Latin'],
      categories: ['mexican'],
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      coverImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
      address: { street: '567 West 23rd St', city: 'New York', state: 'NY', zipCode: '10011', lat: 40.7484, lng: -74.0017 },
      contactPhone: '+1-555-0105',
      rating: { average: 4.4, count: 413 },
      deliveryInfo: { minOrder: 10, deliveryFee: 1.49, estimatedTime: '15-25 min', freeDeliveryAbove: 35 },
      isFeatured: false,
      isActive: true,
      tags: ['fast', 'affordable'],
    },
    {
      name: "Dragon Palace",
      description: 'Authentic Chinese cuisine from Sichuan and Cantonese traditions. Dim sum available weekends.',
      cuisineTypes: ['Chinese', 'Asian'],
      categories: ['chinese'],
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
      coverImage: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800',
      address: { street: '88 Mott St', city: 'New York', state: 'NY', zipCode: '10013', lat: 40.7157, lng: -73.9970 },
      contactPhone: '+1-555-0106',
      rating: { average: 4.3, count: 521 },
      deliveryInfo: { minOrder: 20, deliveryFee: 2.99, estimatedTime: '30-40 min', freeDeliveryAbove: 55 },
      isFeatured: false,
      isActive: true,
      tags: ['family-style', 'dim-sum'],
    },
  ]);

  console.log(`✅ Created ${restaurants.length} restaurants`);

  // ── Menu Items ──────────────────────────────────────────────────────────────
  const pizzaItems = [
    { name: 'Margherita Pizza', description: 'Classic tomato, fresh mozzarella, and basil.', price: 14.99, category: 'Classic Pizzas', isVeg: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
    { name: 'Pepperoni Pizza', description: 'Double pepperoni with spicy tomato sauce.', price: 17.99, category: 'Classic Pizzas', isBestSeller: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
    { name: 'BBQ Chicken Pizza', description: 'Grilled chicken, caramelized onions, smoky BBQ sauce.', price: 18.99, category: 'Specialty Pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' },
    { name: 'Veggie Supreme', description: 'Bell peppers, mushrooms, olives, onions, and sun-dried tomatoes.', price: 16.99, category: 'Specialty Pizzas', isVeg: true, isVegan: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300' },
    { name: 'Garlic Bread', description: 'Toasted Italian bread with garlic butter and herbs.', price: 5.99, category: 'Sides', isVeg: true, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300' },
    { name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers.', price: 6.99, category: 'Desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300' },
  ];

  const burgerItems = [
    { name: 'Classic Smash Burger', description: 'Double smash patty, American cheese, pickles, special sauce.', price: 12.99, category: 'Burgers', isBestSeller: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
    { name: 'BBQ Bacon Burger', description: 'Beef patty, crispy bacon, cheddar, caramelized onions, BBQ.', price: 14.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' },
    { name: 'Veggie Burger', description: 'Plant-based patty with avocado, lettuce, tomato, chipotle mayo.', price: 13.99, category: 'Burgers', isVeg: true, isVegan: true, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300' },
    { name: 'Crispy Chicken Burger', description: 'Fried chicken breast, coleslaw, pickles, honey mustard.', price: 13.49, category: 'Burgers', isBestSeller: true, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300' },
    { name: 'Loaded Fries', description: 'Crispy fries with cheese sauce, jalapeños, and sour cream.', price: 7.99, category: 'Sides', isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
    { name: 'Chocolate Milkshake', description: 'Thick, creamy chocolate milkshake topped with whipped cream.', price: 5.99, category: 'Drinks', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300' },
  ];

  const sushiItems = [
    { name: 'Salmon Nigiri (6pc)', description: 'Fresh Atlantic salmon over seasoned sushi rice.', price: 16.99, category: 'Nigiri', isBestSeller: true, image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300' },
    { name: 'Dragon Roll', description: 'Shrimp tempura inside, avocado & tobiko outside.', price: 18.99, category: 'Rolls', isBestSeller: true, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300' },
    { name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo, cucumber, and sesame.', price: 15.99, category: 'Rolls', image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=300' },
    { name: 'Veggie Roll', description: 'Cucumber, avocado, carrot, pickled radish.', price: 11.99, category: 'Rolls', isVeg: true, isVegan: true, image: 'https://images.unsplash.com/photo-1599364025924-12d3c9de26f5?w=300' },
    { name: 'Miso Soup', description: 'Traditional Japanese miso soup with tofu and wakame.', price: 4.99, category: 'Soups', isVeg: true, isVegan: true, image: 'https://images.unsplash.com/photo-1547592175-82f97f08b64a?w=300' },
    { name: 'Edamame', description: 'Steamed salted edamame pods.', price: 5.99, category: 'Appetizers', isVeg: true, isVegan: true, isGlutenFree: true, image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=300' },
  ];

  const indianItems = [
    { name: 'Chicken Tikka Masala', description: 'Tender chicken in rich, creamy tomato-based curry.', price: 16.99, category: 'Curries', isBestSeller: true, spiceLevel: 'medium', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300' },
    { name: 'Butter Paneer', description: 'Cottage cheese in silky butter and tomato gravy.', price: 14.99, category: 'Curries', isVeg: true, isBestSeller: true, spiceLevel: 'mild', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300' },
    { name: 'Garlic Naan', description: 'Soft leavened bread with garlic butter, baked in tandoor.', price: 3.99, category: 'Breads', isVeg: true, image: 'https://images.unsplash.com/photo-1562689901-ade80c41e7d5?w=300' },
    { name: 'Biryani (Chicken)', description: 'Fragrant basmati rice cooked with spiced chicken and saffron.', price: 17.99, category: 'Rice Dishes', isBestSeller: true, spiceLevel: 'medium', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300' },
    { name: 'Mango Lassi', description: 'Creamy yogurt drink blended with Alphonso mangoes.', price: 4.99, category: 'Drinks', isVeg: true, isGlutenFree: true, image: 'https://images.unsplash.com/photo-1571167366136-b57e0b2f7a3d?w=300' },
    { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-cardamom sugar syrup.', price: 5.99, category: 'Desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  ];

  const tacoItems = [
    { name: 'Carne Asada Tacos (3pc)', description: 'Grilled marinated beef with cilantro, onion, lime.', price: 11.99, category: 'Tacos', isBestSeller: true, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300' },
    { name: 'Chicken Burrito', description: 'Grilled chicken, rice, beans, pico de gallo, sour cream.', price: 13.99, category: 'Burritos', isBestSeller: true, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=300' },
    { name: 'Veggie Tacos (3pc)', description: 'Black beans, roasted peppers, corn, avocado crema.', price: 10.99, category: 'Tacos', isVeg: true, isVegan: true, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300' },
    { name: 'Nachos Supreme', description: 'Tortilla chips, cheese sauce, jalapeños, guacamole, salsa.', price: 9.99, category: 'Appetizers', isVeg: true, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300' },
    { name: 'Churros with Chocolate', description: 'Fried dough pastry with cinnamon sugar, dark chocolate dip.', price: 6.99, category: 'Desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300' },
    { name: 'Horchata', description: 'Sweet rice-based Mexican drink with cinnamon and vanilla.', price: 3.99, category: 'Drinks', isVeg: true, isGlutenFree: true, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=300' },
  ];

  const chineseItems = [
    { name: 'Kung Pao Chicken', description: 'Diced chicken with peanuts, chili peppers, and Sichuan sauce.', price: 15.99, category: 'Main Course', isBestSeller: true, spiceLevel: 'hot', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300' },
    { name: 'Dim Sum Basket (6pc)', description: 'Assorted steamed dumplings with ginger-soy dipping sauce.', price: 12.99, category: 'Dim Sum', isBestSeller: true, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300' },
    { name: 'Fried Rice (Vegetable)', description: 'Wok-tossed rice with seasonal vegetables and soy sauce.', price: 10.99, category: 'Rice & Noodles', isVeg: true, image: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=300' },
    { name: 'Beef Chow Mein', description: 'Tender beef with egg noodles, cabbage, bean sprouts.', price: 14.99, category: 'Rice & Noodles', isBestSeller: true, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300' },
    { name: 'Spring Rolls (4pc)', description: 'Crispy fried rolls stuffed with vegetables and glass noodles.', price: 7.99, category: 'Appetizers', isVeg: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300' },
    { name: 'Fortune Cookies (4pc)', description: 'Classic crispy cookies with lucky messages inside.', price: 2.99, category: 'Desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=300' },
  ];

  const allMenuData = [
    ...pizzaItems.map(i => ({ ...i, restaurant: restaurants[0]._id })),
    ...burgerItems.map(i => ({ ...i, restaurant: restaurants[1]._id })),
    ...sushiItems.map(i => ({ ...i, restaurant: restaurants[2]._id })),
    ...indianItems.map(i => ({ ...i, restaurant: restaurants[3]._id })),
    ...tacoItems.map(i => ({ ...i, restaurant: restaurants[4]._id })),
    ...chineseItems.map(i => ({ ...i, restaurant: restaurants[5]._id })),
  ];

  await MenuItem.insertMany(allMenuData);
  console.log(`✅ Created ${allMenuData.length} menu items`);

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Admin:    admin@quickserve.com  | Password: Admin@123');
  console.log('📧 Customer: customer@quickserve.com | Password: Customer@123\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
