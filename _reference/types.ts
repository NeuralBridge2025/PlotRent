export interface Plot {
  id: string;
  title: string;
  price: number;
  size: string;
  distance: string;
  rating: number;
  image: string;
  tags: string[];
  host: string;
  location: string;
  description?: string;
  soilType?: string;
  exposure?: string;
  utilities?: string[];
}

export interface Service {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  tag: string;
  unit?: string;
}

export interface Message {
  id: string;
  sender: 'host' | 'user';
  text?: string;
  image?: string;
  timestamp: string;
}
