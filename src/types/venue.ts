export type Venue = {
  name: string;
  id: string;
  currency: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
  emailForNotifications: string | null;

  image: string | null;
  courts: number | null;
  price: string | null;
  amenities: string[] | null;
};
