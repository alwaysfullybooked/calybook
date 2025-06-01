export type Booking = {
  id: string;
  status: string;
  service: {
    id: string;
    venueId: string;
    venue: {
      id: string;
      name: string;
      country: string | null;
      city: string | null;
    };
  };
  serviceName: string;
  startDate: string;
  startTime: string;
  endTime: string;
  price: string;
  currency: string;
  notes: string | null;
  type: string;
};
