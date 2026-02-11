
export interface FoodItem {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  image: string;
  category: string;
  spicyLevel?: number;
  isPopular?: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  titleBn: string;
  category: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivered';
  trxId: string;
  timestamp: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  type: 'table' | 'party';
  status: 'pending' | 'confirmed';
}

export type AppView = 'home' | 'menu' | 'gallery' | 'details' | 'cart' | 'checkout' | 'booking' | 'admin';
