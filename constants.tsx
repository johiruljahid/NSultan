
import { FoodItem } from './types';

export const COLORS = {
  primary: '#d97706', // Amber-600 (Royal Gold)
  secondary: '#ef4444', // Red-500 (Appetizing Red)
  accent: '#f59e0b', // Amber-500
  bg: '#050505',
  cardBg: 'rgba(20, 20, 20, 0.8)',
};

export const MENU_ITEMS: FoodItem[] = [
  {
    id: '1',
    nameEn: 'Sultan Shahi Kacchi',
    nameBn: 'সুলতান শাহী কাচ্চি বিরিয়ানি',
    descriptionEn: 'Royal basmati rice cooked with tender mutton, premium saffron, and secret Sultan spices.',
    descriptionBn: 'প্রিমিয়াম বাসমতি চাল এবং নরম খাসির মাংস দিয়ে তৈরি শাহী কাচ্চি।',
    price: 450,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop',
    category: 'main',
    isPopular: true,
  },
  {
    id: '2',
    nameEn: 'Mutton Rezala',
    nameBn: 'মাটন রেজালা',
    descriptionEn: 'Rich and creamy mutton curry with a blend of yogurt, cashews, and aromatic herbs.',
    descriptionBn: 'দই এবং কাজু বাদাম মিশ্রিত রাজকীয় মাটন কারি।',
    price: 380,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop',
    category: 'main',
    spicyLevel: 2,
  },
  {
    id: '3',
    nameEn: 'Grilled Whole Chicken',
    nameBn: 'গ্রিলড হোল চিকেন',
    descriptionEn: 'Flame-grilled tender chicken marinated in 24 secret Bangladeshi spices.',
    descriptionBn: '২৪টি সিক্রেট মসলায় মেরিনেট করা আগুনে পোড়ানো আস্ত মুরগি।',
    price: 550,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
    category: 'main',
  },
  {
    id: '4',
    nameEn: 'Shahi Tukra',
    nameBn: 'শাহী টুকরা',
    descriptionEn: 'Golden fried bread soaked in rich saffron milk and topped with pistachios.',
    descriptionBn: 'জাফরান দুধ এবং পেস্তা বাদাম দিয়ে সাজানো রাজকীয় মিষ্টি।',
    price: 180,
    image: 'https://images.unsplash.com/photo-1605191697541-cc9298e44d5a?q=80&w=1000&auto=format&fit=crop',
    category: 'dessert',
  },
  {
    id: '5',
    nameEn: 'Borhani Special',
    nameBn: 'স্পেশাল বোরহানি',
    descriptionEn: 'Spicy and tangy yogurt-based digestive drink, a Sultan specialty.',
    descriptionBn: 'হজমে সাহায্যকারী সুস্বাদু ও ঝাল দই পানীয়।',
    price: 60,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop',
    category: 'drinks',
  },
  {
    id: '6',
    nameEn: 'Beef Kala Bhuna',
    nameBn: 'বিফ কালা ভুনা',
    descriptionEn: 'Slow-cooked dry-style spicy beef with caramelized onions and traditional spices.',
    descriptionBn: 'ঐতিহ্যবাহী মশলায় তৈরি সেরা বিফ কালা ভুনা।',
    price: 320,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1000&auto=format&fit=crop',
    category: 'main',
    spicyLevel: 3,
  }
];
