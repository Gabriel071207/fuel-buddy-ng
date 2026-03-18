export type FuelType = 'petrol' | 'diesel' | 'gas';
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';
export type QueueLevel = 'low' | 'medium' | 'high';

export interface FuelInfo {
  type: FuelType;
  price: number;
  availability: AvailabilityStatus;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  fuels: FuelInfo[];
  queueLevel: QueueLevel;
  rating: number;
  reviewCount: number;
  verified: boolean;
  lastUpdated: string;
  openNow: boolean;
  openHours: string;
  imageUrl?: string;
  distance?: number;
  confidence?: string;
  reportCount?: number;
}

export const mockStations: Station[] = [
  {
    id: '1',
    name: 'Total Energies Lekki',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    latitude: 6.4281,
    longitude: 3.4219,
    fuels: [
      { type: 'petrol', price: 617, availability: 'available' },
      { type: 'diesel', price: 1150, availability: 'available' },
      { type: 'gas', price: 950, availability: 'limited' },
    ],
    queueLevel: 'low',
    rating: 4.5,
    reviewCount: 234,
    verified: true,
    lastUpdated: '5 mins ago',
    openNow: true,
    openHours: '24 hours',
    distance: 0.8,
  },
  {
    id: '2',
    name: 'NNPC Mega Station Victoria Island',
    address: 'Ozumba Mbadiwe Ave, Victoria Island, Lagos',
    latitude: 6.4312,
    longitude: 3.4156,
    fuels: [
      { type: 'petrol', price: 580, availability: 'available' },
      { type: 'diesel', price: 1100, availability: 'available' },
    ],
    queueLevel: 'high',
    rating: 4.2,
    reviewCount: 567,
    verified: true,
    lastUpdated: '2 mins ago',
    openNow: true,
    openHours: '6:00 AM - 10:00 PM',
    distance: 1.2,
  },
  {
    id: '3',
    name: 'Mobil Ikoyi',
    address: '45 Alfred Rewane Rd, Ikoyi, Lagos',
    latitude: 6.4489,
    longitude: 3.4285,
    fuels: [
      { type: 'petrol', price: 625, availability: 'limited' },
      { type: 'diesel', price: 1180, availability: 'unavailable' },
    ],
    queueLevel: 'medium',
    rating: 3.8,
    reviewCount: 89,
    verified: false,
    lastUpdated: '15 mins ago',
    openNow: true,
    openHours: '6:00 AM - 9:00 PM',
    distance: 2.1,
  },
  {
    id: '4',
    name: 'Conoil Surulere',
    address: '88 Adeniran Ogunsanya St, Surulere, Lagos',
    latitude: 6.4922,
    longitude: 3.3567,
    fuels: [
      { type: 'petrol', price: 610, availability: 'unavailable' },
      { type: 'diesel', price: 1120, availability: 'limited' },
      { type: 'gas', price: 920, availability: 'available' },
    ],
    queueLevel: 'low',
    rating: 3.5,
    reviewCount: 45,
    verified: false,
    lastUpdated: '30 mins ago',
    openNow: false,
    openHours: '7:00 AM - 8:00 PM',
    distance: 3.5,
  },
  {
    id: '5',
    name: 'Oando Ikeja',
    address: '22 Allen Avenue, Ikeja, Lagos',
    latitude: 6.6018,
    longitude: 3.3515,
    fuels: [
      { type: 'petrol', price: 615, availability: 'available' },
      { type: 'diesel', price: 1140, availability: 'available' },
      { type: 'gas', price: 940, availability: 'available' },
    ],
    queueLevel: 'low',
    rating: 4.7,
    reviewCount: 312,
    verified: true,
    lastUpdated: '1 min ago',
    openNow: true,
    openHours: '24 hours',
    distance: 5.2,
  },
  {
    id: '6',
    name: 'AP Filling Station Yaba',
    address: '15 Herbert Macaulay Way, Yaba, Lagos',
    latitude: 6.5095,
    longitude: 3.3711,
    fuels: [
      { type: 'petrol', price: 620, availability: 'available' },
      { type: 'diesel', price: 1160, availability: 'limited' },
    ],
    queueLevel: 'medium',
    rating: 4.0,
    reviewCount: 156,
    verified: true,
    lastUpdated: '8 mins ago',
    openNow: true,
    openHours: '6:00 AM - 10:00 PM',
    distance: 4.0,
  },
  {
    id: '7',
    name: 'MRS Oil Ajah',
    address: '3 Addo Road, Ajah, Lagos',
    latitude: 6.4667,
    longitude: 3.5833,
    fuels: [
      { type: 'petrol', price: 630, availability: 'limited' },
    ],
    queueLevel: 'high',
    rating: 3.2,
    reviewCount: 28,
    verified: false,
    lastUpdated: '45 mins ago',
    openNow: true,
    openHours: '7:00 AM - 9:00 PM',
    distance: 8.3,
  },
  {
    id: '8',
    name: 'Forte Oil Maryland',
    address: '10 Ikorodu Road, Maryland, Lagos',
    latitude: 6.5556,
    longitude: 3.3667,
    fuels: [
      { type: 'petrol', price: 605, availability: 'available' },
      { type: 'diesel', price: 1090, availability: 'available' },
      { type: 'gas', price: 910, availability: 'available' },
    ],
    queueLevel: 'low',
    rating: 4.6,
    reviewCount: 421,
    verified: true,
    lastUpdated: '3 mins ago',
    openNow: true,
    openHours: '24 hours',
    distance: 6.1,
  },
];
